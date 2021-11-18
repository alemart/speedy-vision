/** @typedef {Map<string,number>} ShaderDefines */
/**
 * Custom preprocessor for the shaders
 */
export class ShaderPreprocessor {
    /**
     * Runs the preprocessor
     * @param {string} code
     * @param {ShaderDefines} [defines]
     * @returns {string} preprocessed code
     */
    static run(code: string, defines?: ShaderDefines): string;
}
export type ShaderDefines = Map<string, number>;
