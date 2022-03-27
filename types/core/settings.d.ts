/**
 * Global settings
 */
export class Settings extends SpeedyNamespace {
    /**
     * Power preference of the WebGL context
     * @param {PowerPreference} value
     */
    static set powerPreference(arg: import("../gpu/speedy-gl").PowerPreference);
    /**
     * Power preference of the WebGL context
     * @returns {PowerPreference}
     */
    static get powerPreference(): import("../gpu/speedy-gl").PowerPreference;
    /**
     * GPU polling mode
     * @param {GPUPollingMode} value
     */
    static set gpuPollingMode(arg: GPUPollingMode);
    /**
     * GPU polling mode
     * @returns {GPUPollingMode}
     */
    static get gpuPollingMode(): GPUPollingMode;
}
export type PowerPreference = import('../gpu/speedy-gl').PowerPreference;
export type GPUPollingMode = "raf" | "asap";
import { SpeedyNamespace } from "./speedy-namespace";
