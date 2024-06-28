/**
 * Custom preprocessor for the shaders
 */
export class ShaderPreprocessor {
    /**
     * Runs the preprocessor and generates GLSL code
     * @param {ShaderPreprocessorConstants} defines user-provided preprocessor constants for this shader
     * @param {string} infix annotated GLSL code
     * @param {string} [prefix]
     * @param {string} [suffix]
     * @returns {string} preprocessed GLSL code
     */
    static generateGLSL(defines: import("./shader-declaration").ShaderDeclarationPreprocessorConstants, infix: string, prefix?: string | undefined, suffix?: string | undefined): string;
}
export type ShaderPreprocessorTemplateOfConstants = {
    [x: string]: number;
};
export type ShaderPreprocessorConstants = import('./shader-declaration').ShaderDeclarationPreprocessorConstants;
