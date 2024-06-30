/**
 * Utilities to query information about the graphics driver. This information
 * may or may not be available, depending on the privacy settings of the web
 * browser. In addition, it may be more or less accurate in different browsers.
 */
export class SpeedyPlatform extends SpeedyNamespace {
    /**
     * Renderer string of the graphics driver
     * @returns {string}
     */
    static get renderer(): string;
    /**
     * Vendor string of the graphics driver
     * @returns {string}
     */
    static get vendor(): string;
}
import { SpeedyNamespace } from "./speedy-namespace";
