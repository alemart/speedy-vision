/**
 * A match between two keypoint descriptors
 */
export class SpeedyKeypointMatch {
    /**
     * Constructor
     * @param {number} index index of the stored keypoint, a non-negative integer
     * @param {number} distance a measure of the quality of the match, a non-negative number
     */
    constructor(index: number, distance: number);
    /** @type {number} index of the stored keypoint */
    _index: number;
    /** @type {number} a measure of the quality of the match */
    _distance: number;
    /**
     * The index of the stored keypoint
     * @returns {number}
     */
    get index(): number;
    /**
     * A measure of the quality of the match (lower values indicate better matches)
     * @returns {number}
     */
    get distance(): number;
    /**
     * A string representation of the keypoint match
     * @returns {string}
     */
    toString(): string;
}
