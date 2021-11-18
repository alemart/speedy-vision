/**
 * Represents a keypoint descriptor
 */
export class SpeedyKeypointDescriptor {
    /**
     * Constructor
     * @param {Uint8Array} data descriptor bytes
     */
    constructor(data: Uint8Array);
    _data: Uint8Array;
    /**
     * Descriptor data
     * @returns {Uint8Array}
     */
    get data(): Uint8Array;
    /**
     * The size of the descriptor, in bytes
     * @returns {number}
     */
    get size(): number;
    /**
     * A string representation of the keypoint descriptor
     * @returns {string}
     */
    toString(): string;
}
