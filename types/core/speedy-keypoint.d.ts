/**
 * Represents a keypoint
 */
export class SpeedyKeypoint {
    /**
     * Constructor
     * @param {number} x X position
     * @param {number} y Y position
     * @param {number} [lod] Level-of-detail
     * @param {number} [rotation] Rotation in radians
     * @param {number} [score] Cornerness measure
     * @param {SpeedyKeypointDescriptor|null} [descriptor] Keypoint descriptor, if any
     */
    constructor(x: number, y: number, lod?: number | undefined, rotation?: number | undefined, score?: number | undefined, descriptor?: SpeedyKeypointDescriptor | null | undefined);
    _position: SpeedyPoint2;
    _lod: number;
    _rotation: number;
    _score: number;
    _descriptor: SpeedyKeypointDescriptor | null;
    /**
     * Converts this keypoint to a descriptive string
     * @returns {string}
     */
    toString(): string;
    /**
     * The position of this keypoint
     * @returns {SpeedyPoint2}
     */
    get position(): SpeedyPoint2;
    /**
     * The x-position of this keypoint
     * @returns {number}
     */
    get x(): number;
    /**
     * The y-position of this keypoint
     * @returns {number}
     */
    get y(): number;
    /**
     * The pyramid level-of-detail from which this keypoint was extracted
     * @returns {number}
     */
    get lod(): number;
    /**
     * Scale: 2^lod
     * @returns {number}
     */
    get scale(): number;
    /**
     * The orientation of the keypoint, in radians
     * @returns {number} Angle in radians
     */
    get rotation(): number;
    /**
     * Score: a cornerness measure
     * @returns {number} Score
     */
    get score(): number;
    /**
     * Keypoint descriptor
     * @return {SpeedyKeypointDescriptor|null}
     */
    get descriptor(): SpeedyKeypointDescriptor | null;
}
import { SpeedyPoint2 } from "./speedy-point";
import { SpeedyKeypointDescriptor } from "./speedy-keypoint-descriptor";
