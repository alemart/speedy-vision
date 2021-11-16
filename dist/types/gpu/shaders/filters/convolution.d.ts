/**
 * Generate a 2D convolution with a square kernel
 * @param {number[]} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 */
export function conv2D(kernel: number[], normalizationConstant?: number): import("../../shader-declaration").ShaderDeclaration;
/**
 * Generate a 1D convolution function on the x-axis
 * @param {number[]} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 */
export function convX(kernel: number[], normalizationConstant?: number): import("../../shader-declaration").ShaderDeclaration;
/**
 * Generate a 1D convolution function on the y-axis
 * @param {number[]} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 */
export function convY(kernel: number[], normalizationConstant?: number): import("../../shader-declaration").ShaderDeclaration;
//# sourceMappingURL=convolution.d.ts.map