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

/**
 * A pipeline is a network of nodes in which data flows to a sink
 */
export class SpeedyPipelineNEW
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
        this._gpu = new SpeedyGPU(1, 1);
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
     * Add node(s) to the pipeline
     * @param  {...SpeedyPipelineNode} nodes
     * @returns {SpeedyPipelineNEW} this pipeline
     */
    add(...nodes)
    {
        Utils.assert(nodes.length > 0);

        // add nodes to the network
        for(let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if(!this._hasNode(node))
                this._nodes.push(node);
        }

        // topological sorting
        this._sequence = SpeedyPipelineNEW._tsort(this._nodes);
        Utils.assert(this._sequence.length === this._nodes.length);

        // done!
        return this;
    }

    /**
     * Run the pipeline
     * @returns {SpeedyPromise<object.<string,(SpeedyMedia|SpeedyFeature[])>>} results are indexed by the names of the sink nodes
     */
    run()
    {
        Utils.assert(this._sequence.length > 0, `Pipeline doesn't have nodes`);
        Utils.assert(this._sequence[0].isSource(), `Pipeline doesn't have a source`);

        // find the sinks
        const sinks = this._sequence.filter(node => node.isSink());
        Utils.assert(sinks.length > 0, `Pipeline doesn't have a sink`);

        // set the output textures of each node
        const valid = _ => this._gpu.texturePool.allocate();
        for(let i = this._sequence.length - 1; i >= 0; i--)
            this._sequence[i].setOutputTextures(valid);

        // run the pipeline
        return SpeedyPipelineNEW._runSequence(this._sequence, this._gpu).then(() =>

            // export results
            SpeedyPromise.all(sinks.map(sink => sink.export())).then(results =>

                // aggregate results by the names of the sinks
                results.reduce((obj, val, idx) => Object.assign(obj, { [sinks[idx].name]: val }), {})
            )
        ).then(aggregate => {
            // unset the output textures of the nodes
            // and clear all ports
            const nil = tex => this._gpu.texturePool.free(tex);
            for(let i = this._sequence.length - 1; i >= 0; i--) {
                this._sequence[i].setOutputTextures(nil);
                this._sequence[i].clearPorts();
            }

            // done!
            return aggregate;
        }).turbocharge();
    }

    /**
     * Is the given node already present in the pipeline?
     * @param {SpeedyPipelineNode} node
     * @returns {boolean}
     */
    _hasNode(node)
    {
        return this._nodes.includes(node);
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
        return (i < n) ?
            sequence[i].execute(gpu).then(() => SpeedyPipelineNEW._runSequence(sequence, gpu, i+1, n)) :
            SpeedyPromise.resolve();
    }

    /**
     * Topological sorting
     * @param {SpeedyPipelineNode[]} nodes 
     * @returns {SpeedyPipelineNode[]}
     */
    static _tsort(nodes)
    {
        const outlinks = SpeedyPipelineNEW._outlinks(nodes);
        const stack = nodes.map(node => [ node, false ]);
        const trash = new Set();
        const sorted = [];

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
                sorted.push(node);
        }

        return sorted.reverse();
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

                outlinks.set(from, links.concat([ to ]));
            }
        }

        return outlinks;
    }
}