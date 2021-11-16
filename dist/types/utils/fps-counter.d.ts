/**
 * FPS counter
 */
export class FPSCounter {
    /**
     * Gets an instance of the FPS counter.
     * We use lazy loading, i.e., we will not
     * create a FPS counter unless we need to!
     * @returns {FPSCounter}
     */
    static get instance(): FPSCounter;
    /** @type {number} current FPS rate */
    _fps: number;
    /** @type {number} frame counter */
    _frames: number;
    /** @type {number} update interval in milliseconds */
    _updateInterval: number;
    /** @type {number} time of the last update */
    _lastUpdate: number;
    /** @type {function(): void} bound update function */
    _boundUpdate: () => void;
    /**
     * Get the FPS rate
     * @returns {number} frames per second
     */
    get fps(): number;
    /**
     * Updates the FPS counter
     */
    _update(): void;
}
//# sourceMappingURL=fps-counter.d.ts.map