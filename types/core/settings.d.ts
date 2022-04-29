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
    /**
     * Logging mode
     * @param {LoggingMode} mode
     */
    static set logging(arg: LoggingMode);
    /**
     * Logging mode
     * @returns {LoggingMode}
     */
    static get logging(): LoggingMode;
}
export type PowerPreference = import('../gpu/speedy-gl').PowerPreference;
export type GPUPollingMode = "raf" | "asap";
export type LoggingMode = 'default' | 'none';
import { SpeedyNamespace } from "./speedy-namespace";
