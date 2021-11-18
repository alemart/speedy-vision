/**
 * 2D vector of floating-point numbers
 */
export class SpeedyVector2 {
    /**
     * Create a 2D vector
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
     * Is this vector equal to v?
     * @param {SpeedyVector2} v
     * @returns {boolean}
     */
    equals(v: SpeedyVector2): boolean;
    /**
     * Dot product between this vector and another vector
     * @param {SpeedyVector2} v another vector
     * @returns {number}
     */
    dot(v: SpeedyVector2): number;
    /**
     * The distance between this vector and another vector
     * @param {SpeedyVector2} v another vector
     * @returns {number}
     */
    distanceTo(v: SpeedyVector2): number;
    /**
     * Euclidean norm
     * @returns {number}
     */
    length(): number;
    /**
     * Returns a normalized version of this vector
     * @returns {SpeedyVector2}
     */
    normalized(): SpeedyVector2;
    /**
     * Returns a copy of this vector translated by offset
     * @param {SpeedyVector2} offset
     * @returns {SpeedyVector2}
     */
    plus(offset: SpeedyVector2): SpeedyVector2;
    /**
     * Returns a copy of this vector translated by -offset
     * @param {SpeedyVector2} offset
     * @returns {SpeedyVector2}
     */
    minus(offset: SpeedyVector2): SpeedyVector2;
    /**
     * Returns a copy of this vector scaled by a scalar
     * @param {number} scalar
     * @returns {SpeedyVector2}
     */
    times(scalar: number): SpeedyVector2;
}
