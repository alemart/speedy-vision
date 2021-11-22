/**
 * Import a ShaderDeclaration from a GLSL file
 * @param {string} filepath relative to the shaders/ folder (a .glsl file)
 * @param {string|null} [vsfilepath] optional vertex shader (a .vs.glsl file)
 * @returns {ShaderDeclaration}
 */
export function importShader(filepath: string, vsfilepath?: string | null | undefined): ShaderDeclaration;
/**
 * Create a ShaderDeclaration from a GLSL source code
 * @param {string} source fragment shader
 * @param {string|null} [vssource] optional vertex shader
 * @returns {ShaderDeclaration}
 */
export function createShader(source: string, vssource?: string | null | undefined): ShaderDeclaration;
/**
 * @typedef {object} ShaderDeclarationFilepathOptions
 * @property {"filepath"} type
 * @property {string} filepath
 * @property {string} [vsfilepath]
 *
 * @typedef {object} ShaderDeclarationSourceOptions
 * @property {"source"} type
 * @property {string} source
 * @property {string} [vssource]
 *
 * @typedef {ShaderDeclarationFilepathOptions | ShaderDeclarationSourceOptions} ShaderDeclarationOptions
 */
/** @typedef {import('./shader-preprocessor').ShaderDefines} ShaderDefines */
/**
 * Shader Declaration
 */
export class ShaderDeclaration {
    /**
     * Creates a new Shader directly from a GLSL source
     * @param {string} source fragment shader
     * @param {string|null} [vssource] vertex shader
     * @returns {ShaderDeclaration}
     */
    static create(source: string, vssource?: string | null | undefined): ShaderDeclaration;
    /**
     * Import a Shader from a file containing a GLSL source
     * @param {string} filepath path to .glsl file relative to the shaders/ folder
     * @param {string} [vsfilepath] path to a .vs.glsl file relative to the shaders/ folder
     * @returns {ShaderDeclaration}
     */
    static import(filepath: string, vsfilepath?: string | undefined): ShaderDeclaration;
    /**
     * @private Constructor
     * @param {ShaderDeclarationOptions} options
     * @param {Symbol} privateToken
     */
    private constructor();
    /** @type {string} original source code provided by the user (fragment shader) */
    _source: string;
    /** @type {string} vertex shader source code (without preprocessing) */
    _vssource: string;
    /** @type {string} preprocessed source code of the fragment shader */
    _fragmentSource: string;
    /** @type {string} preprocessed source code of the vertex shader */
    _vertexSource: string;
    /** @type {string} filepath of the fragment shader */
    _filepath: string;
    /** @type {string} filepath of the vertex shader */
    _vsfilepath: string;
    /** @type {string[]} an ordered list of uniform names */
    _arguments: string[];
    /** @type {Map<string,string>} it maps uniform names to their types */
    _uniforms: Map<string, string>;
    /** @type {ShaderDefines} it maps externally #defined constants to their values */
    _defines: import("./shader-preprocessor").ShaderDefines;
    /**
     * Specify the list & order of arguments to be
     * passed to the shader
     * @param  {...string} args argument names
     * @returns {this}
     */
    withArguments(...args: string[]): this;
    /**
     * Specify a set of #defines to be prepended to the fragment shader
     * @param {Object<string,number>} defines key-value pairs (define-name: define-value)
     * @returns {this}
     */
    withDefines(defines: {
        [x: string]: number;
    }): this;
    /**
     * Return the GLSL source of the fragment shader
     * @returns {string}
     */
    get fragmentSource(): string;
    /**
     * Return the GLSL source of the vertex shader
     * @returns {string}
     */
    get vertexSource(): string;
    /**
     * Get the names of the vertex shader attributes
     * @returns {typeof DEFAULT_ATTRIBUTES}
     */
    get attributes(): Readonly<{
        position: string;
        texCoord: string;
    }>;
    /**
     * Get the pre-defined locations of the vertex shader attributes
     * @returns {typeof DEFAULT_ATTRIBUTES_LOCATION}
     */
    get locationOfAttributes(): Readonly<{
        position: number;
        texCoord: number;
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
     * @returns {Map<string,string>} specifies the types of all uniforms
     */
    _autodetectUniforms(preprocessedSource: string): Map<string, string>;
}
export type ShaderDeclarationFilepathOptions = {
    type: "filepath";
    filepath: string;
    vsfilepath?: string | undefined;
};
export type ShaderDeclarationSourceOptions = {
    type: "source";
    source: string;
    vssource?: string | undefined;
};
export type ShaderDeclarationOptions = ShaderDeclarationFilepathOptions | ShaderDeclarationSourceOptions;
export type ShaderDefines = import('./shader-preprocessor').ShaderDefines;
