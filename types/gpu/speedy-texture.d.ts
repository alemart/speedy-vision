/**
 * Get a buffer filled with zeros
 * @param {number} size number of bytes
 * @returns {Uint8Array}
 */
/**
 * A wrapper around WebGLTexture
 */
export class SpeedyTexture {
    /**
     * Create a WebGL texture
     * @param {WebGL2RenderingContext} gl
     * @param {number} width in pixels
     * @param {number} height in pixels
     * @param {number} format usually gl.RGBA
     * @param {number} internalFormat usually gl.RGBA8
     * @param {number} dataType usually gl.UNSIGNED_BYTE
     * @param {number} filter usually gl.NEAREST or gl.LINEAR
     * @param {number} wrap gl.REPEAT, gl.MIRRORED_REPEAT or gl.CLAMP_TO_EDGE
     * @returns {WebGLTexture}
     */
    static _createTexture(gl: WebGL2RenderingContext, width: number, height: number, format: number, internalFormat: number, dataType: number, filter: number, wrap: number): WebGLTexture;
    /**
     * Upload pixel data to a WebGL texture
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLTexture} texture
     * @param {GLsizei} width texture width
     * @param {GLsizei} height texture height
     * @param {TexImageSource} pixels
     * @param {GLint} lod mipmap level-of-detail
     * @param {number} format
     * @param {number} internalFormat
     * @param {number} dataType
     * @returns {WebGLTexture} texture
     */
    static _upload(gl: WebGL2RenderingContext, texture: WebGLTexture, width: GLsizei, height: GLsizei, pixels: TexImageSource, lod: GLint, format: number, internalFormat: number, dataType: number): WebGLTexture;
    /**
     * Constructor
     * @param {WebGL2RenderingContext} gl
     * @param {number} width texture width in pixels
     * @param {number} height texture height in pixels
     * @param {number} [format]
     * @param {number} [internalFormat]
     * @param {number} [dataType]
     * @param {number} [filter]
     * @param {number} [wrap]
     */
    constructor(gl: WebGL2RenderingContext, width: number, height: number, format?: number | undefined, internalFormat?: number | undefined, dataType?: number | undefined, filter?: number | undefined, wrap?: number | undefined);
    /** @type {WebGL2RenderingContext} rendering context */
    _gl: WebGL2RenderingContext;
    /** @type {number} width of the texture */
    _width: number;
    /** @type {number} height of the texture */
    _height: number;
    /** @type {boolean} have we generated mipmaps for this texture? */
    _hasMipmaps: boolean;
    /** @type {number} texture format */
    _format: number;
    /** @type {number} internal format (usually a sized format) */
    _internalFormat: number;
    /** @type {number} data type */
    _dataType: number;
    /** @type {number} texture filtering (min & mag) */
    _filter: number;
    /** @type {number} texture wrapping */
    _wrap: number;
    /** @type {WebGLTexture} internal texture object */
    _glTexture: WebGLTexture;
    /**
     * Releases the texture
     * @returns {null}
     */
    release(): null;
    /**
     * Upload pixel data to the texture. The texture will be resized if needed.
     * @param {TexImageSource} pixels
     * @param {number} [width] in pixels
     * @param {number} [height] in pixels
     * @return {SpeedyTexture} this
     */
    upload(pixels: TexImageSource, width?: number | undefined, height?: number | undefined): SpeedyTexture;
    /**
     * Clear the texture
     * @returns {this}
     */
    clear(): this;
    /**
     * Resize this texture. Its content will be lost!
     * @param {number} width new width, in pixels
     * @param {number} height new height, in pixels
     * @returns {this}
     */
    resize(width: number, height: number): this;
    /**
     * Generate mipmap
     * @param {SpeedyDrawableTexture[]} [mipmap] custom texture for each mip level
     * @returns {SpeedyTexture} this
     */
    generateMipmaps(mipmap?: SpeedyDrawableTexture[] | undefined): SpeedyTexture;
    /**
     * Invalidates previously generated mipmap, if any
     */
    discardMipmaps(): void;
    /**
     * Does this texture have a mipmap?
     * @returns {boolean}
     */
    hasMipmaps(): boolean;
    /**
     * Has this texture been released?
     * @returns {boolean}
     */
    isReleased(): boolean;
    /**
     * The size of this texture, in bytes
     * @returns {number}
     */
    size(): number;
    /**
     * The internal WebGLTexture
     * @returns {WebGLTexture}
     */
    get glTexture(): WebGLTexture;
    /**
     * The width of the texture, in pixels
     * @returns {number}
     */
    get width(): number;
    /**
     * The height of the texture, in pixels
     * @returns {number}
     */
    get height(): number;
    /**
     * The WebGL Context
     * @returns {WebGL2RenderingContext}
     */
    get gl(): WebGL2RenderingContext;
}
/**
 * A SpeedyTexture with a framebuffer
 */
export class SpeedyDrawableTexture extends SpeedyTexture {
    /**
     * Create a FBO associated with an existing texture
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLTexture} texture
     * @returns {WebGLFramebuffer}
     */
    static _createFramebuffer(gl: WebGL2RenderingContext, texture: WebGLTexture): WebGLFramebuffer;
    /**
     * Copy data from a framebuffer to a texture
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLFramebuffer} fbo we'll read the data from this
     * @param {WebGLTexture} texture destination texture
     * @param {GLint} x xpos (where to start copying)
     * @param {GLint} y ypos (where to start copying)
     * @param {GLsizei} width width of the texture
     * @param {GLsizei} height height of the texture
     * @param {GLint} [lod] mipmap level-of-detail
     * @returns {WebGLTexture} texture
     */
    static _copyToTexture(gl: WebGL2RenderingContext, fbo: WebGLFramebuffer, texture: WebGLTexture, x: GLint, y: GLint, width: GLsizei, height: GLsizei, lod?: number | undefined): WebGLTexture;
    /** @type {WebGLFramebuffer} framebuffer */
    _glFbo: WebGLFramebuffer;
    /**
     * The internal WebGLFramebuffer
     * @returns {WebGLFramebuffer}
     */
    get glFbo(): WebGLFramebuffer;
    /**
     * Copy this texture into another
     * (you may have to discard the mipmaps after calling this function)
     * @param {SpeedyTexture} texture target texture
     * @param {number} [lod] level-of-detail of the target texture
     */
    copyTo(texture: SpeedyTexture, lod?: number | undefined): void;
    /**
     * Clear the texture to a color
     * @param {number} r red component, a value in [0,1]
     * @param {number} g green component, a value in [0,1]
     * @param {number} b blue component, a value in [0,1]
     * @param {number} a alpha component, a value in [0,1]
     * @returns {this}
     */
    clearToColor(r: number, g: number, b: number, a: number): this;
}
