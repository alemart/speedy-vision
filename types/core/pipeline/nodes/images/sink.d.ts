/**
 * Gets an image out of a pipeline
 */
export class SpeedyPipelineNodeImageSink extends SpeedyPipelineSinkNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {SpeedyPipelineNodeImageSinkExportedMediaType} the media type that is exported from this node */
    _mediaType: SpeedyPipelineNodeImageSinkExportedMediaType;
    /** @type {ImageBitmap} output bitmap */
    _bitmap: ImageBitmap;
    /** @type {ImageData} output pixel data */
    _data: ImageData;
    /** @type {ImageFormat} output format */
    _format: ImageFormat;
    /** @type {SpeedyTextureReader} texture reader */
    _textureReader: SpeedyTextureReader;
    /**
     * The media type that is exported from this node
     * @param {SpeedyPipelineNodeImageSinkExportedMediaType} value
     */
    set mediaType(arg: SpeedyPipelineNodeImageSinkExportedMediaType);
    /**
     * The media type that is exported from this node
     * @returns {SpeedyPipelineNodeImageSinkExportedMediaType}
     */
    get mediaType(): SpeedyPipelineNodeImageSinkExportedMediaType;
    /**
     * Export data from this node to the user
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    export(): SpeedyPromise<SpeedyMedia>;
}
/**
 * exported media type
 */
export type SpeedyPipelineNodeImageSinkExportedMediaType = "bitmap" | "data";
import { SpeedyPipelineSinkNode } from "../../pipeline-node";
import { ImageFormat } from "../../../../utils/types";
import { SpeedyTextureReader } from "../../../../gpu/speedy-texture-reader";
import { SpeedyPromise } from "../../../speedy-promise";
import { SpeedyMedia } from "../../../speedy-media";
