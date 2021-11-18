/**
 * Size of a rectangle
 */
export class SpeedySize {
    /**
     * Constructor
     * @param {number} width non-negative number
     * @param {number} height non-negative number
     */
    constructor(width: number, height: number);
    /** @type {number} width */
    _width: number;
    /** @type {number} height */
    _height: number;
    /**
     * Width
     * @param {number} value
     */
    set width(arg: number);
    /**
     * Width
     * @returns {number}
     */
    get width(): number;
    /**
     * Height
     * @param {number} value
     */
    set height(arg: number);
    /**
     * Height
     * @returns {number}
     */
    get height(): number;
    /**
     * Convert to string
     * @returns {string}
     */
    toString(): string;
    /**
     * Is this size equal to anotherSize?
     * @param {SpeedySize} anotherSize
     * @returns {boolean}
     */
    equals(anotherSize: SpeedySize): boolean;
    /**
     * The area of the rectangle
     * @returns {number}
     */
    area(): number;
}
