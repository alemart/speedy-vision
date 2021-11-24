/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2021 Alexandre Martins <alemartf(at)gmail.com>
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
import { SpeedyKeypoint } from '../speedy-keypoint';

/**
 * A dictionary indexed by the names of the sink nodes
 * @typedef {Object<string,any>} SpeedyPipelineOutput
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

        /** @type {SpeedyGPU} GPU instance */
        this._gpu = null;

        /** @type {boolean} are we running the pipeline at this moment? */
        this._busy = false;
    }

    /**
     * Find a node by its name
     * @template T extends SpeedyPipelineNode
     * @param {string} name
     * @returns {T|null}
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
        this._gpu = new SpeedyGPU();

        // add nodes to the network
        for(let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if(!this._nodes.includes(node))
                this._nodes.push(node);
        }

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

        // done!
        return null;
    }

    /**
     * Run the pipeline
     * @returns {SpeedyPromise<SpeedyPipelineOutput>} results are indexed by the names of the sink nodes
     */
    run()
    {
        Utils.assert(this._gpu != null, `The pipeline has not been initialized or has been released`);

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
        const sinks = /** @type {SpeedyPipelineSinkNode[]} */ ( this._sequence.filter(node => node.isSink()) );

        // create output template
        const template = SpeedyPipeline._createOutputTemplate(sinks);

        // run the pipeline
        return SpeedyPipeline._runSequence(this._sequence, this._gpu).then(() =>

            // export results
            SpeedyPromise.all(sinks.map(sink => sink.export())).then(results =>

                // aggregate results by the names of the sinks
                results.reduce((obj, val, idx) => ((obj[sinks[idx].name] = val), obj), template)
            )

        ).finally(() => {
            // clear all ports
            for(let i = this._sequence.length - 1; i >= 0; i--)
                this._sequence[i].clearPorts();

            // the pipeline is no longer busy
            this._busy = false;
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
        for(; i < n; i++) {
            const runTask = sequence[i].execute(gpu);

            // this call greatly improves performance when downloading pixel data using PBOs
            gpu.gl.flush();

            if(typeof runTask !== 'undefined')
                return runTask.then(() => SpeedyPipeline._runSequence(sequence, gpu, i+1, n));
        }

        return SpeedyPromise.resolve();
    }

    /**
     * Topological sorting
     * @param {SpeedyPipelineNode[]} nodes 
     * @returns {SpeedyPipelineNode[]}
     */
    static _tsort(nodes)
    {
        /** @typedef {[SpeedyPipelineNode, boolean]} StackNode */

        const outlinks = SpeedyPipeline._outlinks(nodes);
        const stack = nodes.map(node => /** @type {StackNode} */ ([ node, false ]) );
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
                    stack.push(...(outnodes.map(node => /** @type {StackNode} */ ([ node, false ]) )));

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
     * @param {SpeedyPipelineNode[]} [sinks]
     * @returns {SpeedyPipelineOutput}
     */
    static _createOutputTemplate(sinks = [])
    {
        const template = Object.create(null);

        for(let i = sinks.length - 1; i >= 0; i--)
            template[sinks[i].name] = null;

        return template;
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
        else if(!sequence.find(node => node.isSink()))
            throw new IllegalOperationError(`Pipeline doesn't have a sink`);
    }
}
