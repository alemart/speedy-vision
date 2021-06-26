/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * pipeline.js
 * A pipeline is a network of nodes in which data flows to a sink
 */

import { Utils } from '../../utils/utils';
import { SpeedyPromise } from '../../utils/speedy-promise';
import { IllegalOperationError, IllegalArgumentError, NotSupportedError } from '../../utils/errors';
import { SpeedyPipelineNode, SpeedyPipelineSourceNode, SpeedyPipelineSinkNode } from './pipeline-node';
import { SpeedyPipelinePort, SpeedyPipelineInputPort, SpeedyPipelineOutputPort } from './pipeline-port';
import { SpeedyGPU } from '../../gpu/speedy-gpu';
import { SpeedyMedia } from '../speedy-media';
import { SpeedyFeature } from '../speedy-feature';

/**
 * @typedef {Object.<string,(SpeedyMedia|SpeedyFeature[])>} SpeedyPipelineOutput
 * indexed by the names of the sink nodes
 */

/**
 * A pipeline is a network of nodes in which data flows to a sink
 */
export class SpeedyPipeline
{
    /**
     * Constructor
     */
    constructor()
    {
        /** @type {SpeedyPipelineNode[]} the collection of all nodes that belong to this pipeline */
        this._nodes = [];

        /** @type {SpeedyPipelineNode[]} a sequence of nodes: from the source(s) to the sink */
        this._sequence = [];

        /** @type {SpeedyPipelineOutput} output template */
        this._template = SpeedyPipeline._createOutputTemplate();

        /** @type {SpeedyGPU} GPU instance */
        this._gpu = null;

        /** @type {boolean} are we running the pipeline at this moment? */
        this._busy = false;
    }

    /**
     * Find a node by its name
     * @param {string} name
     * @returns {SpeedyPipelineNode|null}
     */
    node(name)
    {
        for(let i = 0, n = this._nodes.length; i < n; i++) {
            if(this._nodes[i].name === name)
                return this._nodes[i];
        }

        return null;
    }

    /**
     * Initialize the pipeline
     * @param  {...SpeedyPipelineNode} nodes
     * @returns {SpeedyPipeline} this pipeline
     */
    init(...nodes)
    {
        // validate
        if(this._nodes.length > 0)
            throw new IllegalOperationError(`The pipeline has already been initialized`);
        else if(nodes.length == 0)
            throw new IllegalArgumentError(`Can't initialize the pipeline. Please specify its nodes`);

        // create a GPU instance
        this._gpu = new SpeedyGPU(1, 1);

        // add nodes to the network
        for(let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if(!this._nodes.includes(node))
                this._nodes.push(node);
        }

        // generate the output template
        this._template = SpeedyPipeline._createOutputTemplate(this._nodes);

        // generate the sequence of nodes
        this._sequence = SpeedyPipeline._tsort(this._nodes);
        SpeedyPipeline._validateSequence(this._sequence);

        // initialize nodes
        for(let i = 0; i < this._sequence.length; i++)
            this._sequence[i].init(this._gpu);

        // done!
        return this;
    }

    /**
     * Release the resources associated with this pipeline
     * @returns {null}
     */
    release()
    {
        if(this._nodes.length == 0)
            throw new IllegalOperationError(`The pipeline has already been released or has never been initialized`);

        // release nodes
        for(let i = this._sequence.length - 1; i >= 0; i--)
            this._sequence[i].release(this._gpu);
        this._sequence.length = 0;
        this._nodes.length = 0;

        // release GPU
        this._gpu = this._gpu.release();

        // release other properties
        this._template = SpeedyPipeline._createOutputTemplate();

        // done!
        return null;
    }

    /**
     * Run the pipeline
     * @returns {SpeedyPromise<SpeedyPipelineOutput>} results are indexed by the names of the sink nodes
     */
    run()
    {
        Utils.assert(this._gpu != null, `Pipeline has not been initialized or has been released`);

        // is the pipeline busy?
        if(this._busy) {
            // if so, we need to wait 'til it finishes
            return new SpeedyPromise((resolve, reject) => {
                setTimeout(() => this.run().then(resolve, reject), 0);
            });
        }
        else {
            // the pipeline is now busy and won't accept concurrent tasks
            // (we allocate textures using a single pool)
            this._busy = true;
        }

        // find the sinks
        const sinks = this._sequence.filter(node => node.isSink());

        // run the pipeline
        return SpeedyPipeline._runSequence(this._sequence, this._gpu).then(() =>

            // export results
            SpeedyPromise.all(sinks.map(sink => sink.export())).then(results =>

                // aggregate results by the names of the sinks
                results.reduce((obj, val, idx) => ((obj[sinks[idx].name] = val), obj), this._template)
            )
        ).then(aggregate => {
            // clear all ports & textures
            for(let i = this._sequence.length - 1; i >= 0; i--) {
                this._sequence[i].clearPorts();
                this._sequence[i].clearTextures();
            }

            // the pipeline is no longer busy
            this._busy = false;

            // done!
            return aggregate;
        }).turbocharge();
    }

    /**
     * Execute the tasks of a sequence of nodes
     * @param {SpeedyPipelineNode[]} sequence sequence of nodes
     * @param {SpeedyGPU} gpu GPU instance
     * @param {number} [i] in [0,n)
     * @param {number} [n] number of nodes
     * @returns {SpeedyPromise<void>}
     */
    static _runSequence(sequence, gpu, i = 0, n = sequence.length)
    {
        if(i >= n)
            return SpeedyPromise.resolve();

        const runTask = sequence[i].execute(gpu);
        gpu.gl.flush();

        if(runTask == undefined)
            return SpeedyPipeline._runSequence(sequence, gpu, i+1, n);

        return runTask.then(() => SpeedyPipeline._runSequence(sequence, gpu, i+1, n));
    }

    /**
     * Topological sorting
     * @param {SpeedyPipelineNode[]} nodes 
     * @returns {SpeedyPipelineNode[]}
     */
    static _tsort(nodes)
    {
        const outlinks = SpeedyPipeline._outlinks(nodes);
        const stack = nodes.map(node => [ node, false ]);
        const trash = new Set();
        const sorted = new Array(nodes.length);
        let j = sorted.length;

        while(stack.length > 0) {
            const [ node, done ] = stack.pop();
            if(!done) {
                if(!trash.has(node)) {
                    const outnodes = outlinks.get(node);

                    trash.add(node);
                    stack.push([ node, true ]);
                    stack.push(...(outnodes.map(node => [ node, false ])));

                    if(outnodes.some(node => trash.has(node) && !sorted.includes(node)))
                        throw new IllegalOperationError(`Pipeline networks cannot have cycles!`);
                }
            }
            else
                sorted[--j] = node;
        }

        return sorted;
    }

    /**
     * Figure out the outgoing links of all nodes
     * @param {SpeedyPipelineNode[]} nodes
     * @returns {Map<SpeedyPipelineNode,SpeedyPipelineNode[]>}
     */
    static _outlinks(nodes)
    {
        const outlinks = new Map();

        for(let k = 0; k < nodes.length; k++)
            outlinks.set(nodes[k], []);

        for(let i = 0; i < nodes.length; i++) {
            const to = nodes[i];
            const inputs = to.inputNodes();

            for(let j = 0; j < inputs.length; j++) {
                const from = inputs[j];
                const links = outlinks.get(from);

                if(!links)
                    throw new IllegalOperationError(`Can't initialize the pipeline. Missing node: ${from.fullName}. Did you forget to add it to the initialization list?`);

                if(!links.includes(to))
                    links.push(to);
            }
        }

        return outlinks;
    }

    /**
     * Generate the output template by aggregating the names of the sinks
     * @param {SpeedyPipelineNode[]} [nodes]
     * @returns {SpeedyPipelineOutput}
     */
    static _createOutputTemplate(nodes = [])
    {
        const template = Object.create(null);
        const sinks = nodes.filter(node => node.isSink());

        return sinks.reduce((obj, sink) => ((obj[sink.name] = null), obj), template);
    }

    /**
     * Validate a sequence of nodes
     * @param {SpeedyPipelineNode[]} sequence
     */
    static _validateSequence(sequence)
    {
        if(sequence.length == 0)
            throw new IllegalOperationError(`Pipeline doesn't have nodes`);
        else if(!sequence[0].isSource())
            throw new IllegalOperationError(`Pipeline doesn't have a source`);
        else if(!sequence[sequence.length - 1].isSink())
            throw new IllegalOperationError(`Pipeline doesn't have a sink`);
    }
}
