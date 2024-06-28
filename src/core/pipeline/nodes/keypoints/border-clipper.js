/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2024 Alexandre Martins <alemartf(at)gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * border-clipper.js
 * Keypoint Border Clipper
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineNodeKeypointDetector } from './detectors/detector';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedySize } from '../../../speedy-size';
import { SpeedyVector2 } from '../../../speedy-vector';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { IllegalOperationError } from '../../../../utils/errors';
import { MAX_ENCODER_CAPACITY } from '../../../../utils/globals';
import { SpeedyPromise } from '../../../speedy-promise';


/**
 * The Border Clipper removes all keypoints within a border of the edges of an image
 */
export class SpeedyPipelineNodeKeypointBorderClipper extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 5, [
            InputPort().expects(SpeedyPipelineMessageType.Keypoints),
            OutputPort().expects(SpeedyPipelineMessageType.Keypoints)
        ]);

        /** @type {SpeedySize} image size, in pixels */
        this._imageSize = new SpeedySize(0,0);

        /** @type {SpeedyVector2} border size, in pixels */
        this._borderSize = new SpeedyVector2(0,0);
    }

    /**
     * Image size, in pixels
     * @returns {SpeedySize}
     */
    get imageSize()
    {
        return this._imageSize;
    }

    /**
     * Image size, in pixels
     * @param {SpeedySize} imageSize
     */
    set imageSize(imageSize)
    {
        this._imageSize = imageSize;
    }

    /**
     * Border size, in pixels
     * @returns {SpeedyVector2}
     */
    get borderSize()
    {
        return this._borderSize;
    }

    /**
     * Border size, in pixels
     * @param {SpeedyVector2} borderSize
     */
    set borderSize(borderSize)
    {
        this._borderSize = borderSize;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input().read() );
        const keypoints = gpu.programs.keypoints;
        const imageSize = this._imageSize;
        const borderSize = this._borderSize;
        const imageWidth = imageSize.width, imageHeight = imageSize.height;
        const borderLeft = borderSize.x, borderRight = borderSize.x;
        const borderTop = borderSize.y, borderBottom = borderSize.y;
        const tex = this._tex;

        // validate
        if(imageWidth == 0 || imageHeight == 0)
            throw new IllegalOperationError(`BorderClipper: did you forget to set the image size?`);

        // find the capacity of the keypoint stream
        const capacity = SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        const mixEncoderLength = Math.max(1, Math.ceil(Math.sqrt(capacity)));

        // prepare programs
        keypoints.clipBorder.outputs(encoderLength, encoderLength, tex[0]);
        keypoints.mixKeypointsInit.outputs(mixEncoderLength, mixEncoderLength, tex[1]);
        keypoints.mixKeypointsSort.outputs(mixEncoderLength, mixEncoderLength, tex[2], tex[3]);
        keypoints.mixKeypointsApply.outputs(encoderLength, encoderLength, tex[4]);

        // clip keypoints
        let clippedKeypoints = keypoints.clipBorder(
            imageWidth, imageHeight,
            borderTop, borderRight, borderBottom, borderLeft,
            encodedKeypoints, descriptorSize, extraSize, encoderLength
        );

        // sort keypoints
        let sortedKeypoints = keypoints.mixKeypointsInit(
            clippedKeypoints, descriptorSize, extraSize, encoderLength, capacity
        );

        for(let b = 1; b < capacity; b *= 2)
            sortedKeypoints = keypoints.mixKeypointsSort(sortedKeypoints, b);

        clippedKeypoints = keypoints.mixKeypointsApply(
            sortedKeypoints, clippedKeypoints, descriptorSize, extraSize, encoderLength
        );

        /*
        // debug: view keypoints
        keypoints.mixKeypointsView.outputs(mixEncoderLength, mixEncoderLength, tex[1]);
        this._visualize(gpu, keypoints.mixKeypointsView(sortedKeypoints));
        */

        // done!
        this.output().swrite(clippedKeypoints, descriptorSize, extraSize, encoderLength);
    }
}