/**
 * A pipeline is a network of nodes in which data flows to a sink
 */
export class SpeedyPipeline {
    /**
     * Execute the tasks of a sequence of nodes
     * @param {SpeedyPipelineNode[]} sequence sequence of nodes
     * @param {number} [i] in [0,n)
     * @param {number} [n] number of nodes
     * @returns {SpeedyPromise<void>}
     */
    static _runSequence(sequence: SpeedyPipelineNode[], i?: number | undefined, n?: number | undefined): SpeedyPromise<void>;
    /**
     * Topological sorting
     * @param {SpeedyPipelineNode[]} nodes
     * @returns {SpeedyPipelineNode[]}
     */
    static _tsort(nodes: SpeedyPipelineNode[]): SpeedyPipelineNode[];
    /**
     * Figure out the outgoing links of all nodes
     * @param {SpeedyPipelineNode[]} nodes
     * @returns {Map<SpeedyPipelineNode,SpeedyPipelineNode[]>}
     */
    static _outlinks(nodes: SpeedyPipelineNode[]): Map<SpeedyPipelineNode, SpeedyPipelineNode[]>;
    /**
     * Generate the output template by aggregating the names of the sinks
     * @param {SpeedyPipelineNode[]} [sinks]
     * @returns {SpeedyPipelineOutput}
     */
    static _createOutputTemplate(sinks?: SpeedyPipelineNode[] | undefined): SpeedyPipelineOutput;
    /**
     * Validate a sequence of nodes
     * @param {SpeedyPipelineNode[]} sequence
     */
    static _validateSequence(sequence: SpeedyPipelineNode[]): void;
    /** @type {SpeedyPipelineNode[]} the collection of all nodes that belong to this pipeline */
    _nodes: SpeedyPipelineNode[];
    /** @type {SpeedyPipelineNode[]} a sequence of nodes: from the source(s) to the sink */
    _sequence: SpeedyPipelineNode[];
    /** @type {boolean} are we running the pipeline at this moment? */
    _busy: boolean;
    /**
     * Find a node by its name
     * @template T extends SpeedyPipelineNode
     * @param {string} name
     * @returns {T|null}
     */
    node<T>(name: string): T | null;
    /**
     * Initialize the pipeline
     * @param  {...SpeedyPipelineNode} nodes
     * @returns {SpeedyPipeline} this pipeline
     */
    init(...nodes: SpeedyPipelineNode[]): SpeedyPipeline;
    /**
     * Release the resources associated with this pipeline
     * @returns {null}
     */
    release(): null;
    /**
     * Run the pipeline
     * @returns {SpeedyPromise<SpeedyPipelineOutput>} results are indexed by the names of the sink nodes
     */
    run(): SpeedyPromise<SpeedyPipelineOutput>;
    /**
     * @private
     *
     * GPU instance
     * @returns {SpeedyGPU}
     */
    private get _gpu();
}
/**
 * A dictionary indexed by the names of the sink nodes
 */
export type SpeedyPipelineOutput = {
    [x: string]: any;
};
import { SpeedyPipelineNode } from "./pipeline-node";
import { SpeedyPromise } from "../../utils/speedy-promise";
