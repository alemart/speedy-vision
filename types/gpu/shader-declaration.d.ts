/**
 * Import a ShaderDeclaration from a GLSL file
 * @param {string} filepath relative to the shaders/ folder (a .glsl file)
 * @param {string} [vsfilepath] optional vertex shader (a .vs.glsl file)
 * @returns {ShaderDeclaration}
 */
export function importShader(filepath: string, vsfilepath?: string | undefined): ShaderDeclaration;
/**
 * Create a ShaderDeclaration from a GLSL source code
 * @param {string} source fragment shader
 * @param {string} [vssource] optional vertex shader
 * @returns {ShaderDeclaration}
 */
export function createShader(source: string, vssource?: string | undefined): ShaderDeclaration;
/** @typedef {string} ShaderDeclarationUnprocessedGLSL */
/** @typedef {string[]} ShaderDeclarationArgumentList */
/** @typedef {Map<string,string>} ShaderDeclarationUniformTypes */
/** @typedef {Map<string,number>} ShaderDeclarationPreprocessorConstants */
/**
 * Shader Declaration
 * @abstract
 */
export class ShaderDeclaration {
    /**
     * @private Constructor
     * @param {Symbol} privateToken
     * @param {ShaderDeclarationArgumentList} argumentList
     * @param {ShaderDeclarationPreprocessorConstants} defines
     * @param {ShaderDeclarationUnprocessedGLSL} fsSource unprocessed GLSL code of the fragment shader
     * @param {ShaderDeclarationUnprocessedGLSL} vsSource unprocessed GLSL code of the vertex shader
     */
    private constructor();
    /** @type {ShaderDeclarationArgumentList} an ordered list of uniform names */
    _arguments: ShaderDeclarationArgumentList;
    /** @type {ShaderDeclarationPreprocessorConstants} externally #defined pre-processor constants */
    _defines: ShaderDeclarationPreprocessorConstants;
    /** @type {string} preprocessed source code of the fragment shader */
    _fragmentSource: string;
    /** @type {string} preprocessed source code of the vertex shader */
    _vertexSource: string;
    /** @type {ShaderDeclarationUniformTypes} it maps uniform names to their types */
    _uniforms: ShaderDeclarationUniformTypes;
    /**
     * Return the preprocessed GLSL source code of the fragment shader
     * @returns {string}
     */
    get fragmentSource(): string;
    /**
     * Return the preprocessed GLSL source code of the vertex shader
     * @returns {string}
     */
    get vertexSource(): string;
    /**
     * Get the names of the vertex shader attributes
     * @returns {typeof DEFAULT_ATTRIBUTES}
     */
    get attributes(): Readonly<{
        position: "a_position";
        texCoord: "a_texCoord";
    }>;
    /**
     * Get the pre-defined locations of the vertex shader attributes
     * @returns {typeof DEFAULT_ATTRIBUTES_LOCATION}
     */
    get locationOfAttributes(): Readonly<{
        position: 0;
        texCoord: 1;
    }>;
    /**
     * Names of the arguments that will be passed to the Shader,
     * corresponding to GLSL uniforms, in the order they will be passed
     * @returns {string[]}
     */
    get arguments(): string[];
    /**
     * Names of the uniforms declared in the shader
     * @returns {string[]}
     */
    get uniforms(): string[];
    /**
     * The GLSL type of a uniform variable declared in the shader
     * @param {string} name
     * @returns {string}
     */
    uniformType(name: string): string;
    /**
     * The value of an externally defined constant, i.e., via withDefines()
     * @param {string} name
     * @returns {number}
     */
    definedConstant(name: string): number;
    /**
     * Parses a GLSL source and detects the uniform variables,
     * as well as their types
     * @param {string} preprocessedSource
     * @returns {ShaderDeclarationUniformTypes} specifies the types of all uniforms
     */
    _autodetectUniforms(preprocessedSource: string): ShaderDeclarationUniformTypes;
    /**
     * Checks if all the arguments of the shader declaration are backed by a
     * uniform variable in GLSL code
     * @param {ShaderDeclarationArgumentList} argumentList
     * @param {ShaderDeclarationUniformTypes} uniforms
     * @throws {IllegalArgumentError}
     */
    _validateArguments(argumentList: ShaderDeclarationArgumentList, uniforms: ShaderDeclarationUniformTypes): void;
}
/**
 * A builder of a ShaderDeclaration
 * @abstract
 */
export class ShaderDeclarationBuilder {
    /**
     * @private Constructor
     * @param {Symbol} privateToken
     */
    private constructor();
    /** @type {string[]} ordered list of uniform names */
    _arguments: string[];
    /** @type {ShaderDeclarationPreprocessorConstants} externally #defined pre-processor constants */
    _defines: ShaderDeclarationPreprocessorConstants;
    /**
     * Specify the list & order of arguments to be
     * passed to the shader
     * @param  {string[]} args argument names
     * @returns {this}
     */
    withArguments(...args: string[]): this;
    /**
     * Specify a set of #defines to be prepended to the shader
     * @param {Object<string,number>} defines key-value pairs
     * @returns {this}
     */
    withDefines(defines: {
        [x: string]: number;
    }): this;
    /**
     * Build a ShaderDeclaration
     * @returns {ShaderDeclaration}
     */
    build(): ShaderDeclaration;
}
export type ShaderDeclarationUnprocessedGLSL = string;
export type ShaderDeclarationArgumentList = string[];
export type ShaderDeclarationUniformTypes = Map<string, string>;
export type ShaderDeclarationPreprocessorConstants = Map<string, number>;
