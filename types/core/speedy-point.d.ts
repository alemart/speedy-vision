/**
 * 2D point
 */
export class SpeedyPoint2 {
    /**
     * Create a 2D point
     * @param {number} x
     * @param {number} y
     */
    constructor(x: number, y: number);
    /** @type {number} x coordinate */
    _x: number;
    /** @type {number} y coordinate */
    _y: number;
    /**
     * x-coordinate
     * @param {number} value
     */
    set x(arg: number);
    /**
     * x-coordinate
     * @returns {number}
     */
    get x(): number;
    /**
     * y-coordinate
     * @param {number} value
     */
    set y(arg: number);
    /**
     * y-coordinate
     * @returns {number}
     */
    get y(): number;
    /**
     * Convert to string
     * @returns {string}
     */
    toString(): string;
    /**
     * Add a vector to this point
     * @param {SpeedyVector2} v
     * @returns {SpeedyPoint2}
     */
    plus(v: SpeedyVector2): SpeedyPoint2;
    /**
     * Subtracts a point p from this point
     * @param {SpeedyPoint2} p
     * @returns {SpeedyVector2}
     */
    minus(p: SpeedyPoint2): SpeedyVector2;
    /**
     * Is this point equal to p?
     * @param {SpeedyPoint2} p
     * @returns {boolean}
     */
    equals(p: SpeedyPoint2): boolean;
}
import { SpeedyVector2 } from "./speedy-vector";
//# sourceMappingURL=speedy-point.d.ts.map