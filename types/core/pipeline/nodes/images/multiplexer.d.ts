/**
 * Image multiplexer
 */
export class SpeedyPipelineNodeImageMultiplexer extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {number} which port should be linked to the output? */
    _port: number;
    /**
     * The number of the port that should be linked to the output
     * @param {number} port
     */
    set port(arg: number);
    /**
     * The number of the port that should be linked to the output
     * @returns {number}
     */
    get port(): number;
}
import { SpeedyPipelineNode } from "../../pipeline-node";
