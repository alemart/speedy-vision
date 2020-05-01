/*
 * speedy-features.js
 * GPU-accelerated feature detection and matching for Computer Vision on the web
 * Copyright 2020 Alexandre Martins <alemartf(at)gmail.com>
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
 * feature-detector.js
 * Feature detection facade
 */

import { GPUPrograms } from './gpu-programs';
import { SpeedyFeature } from './speedy-feature';
import { Utils } from '../utils/utils';

/**
 * FeatureDetector encapsulates
 * feature detection algorithms
 */
export class FeatureDetector
{
    /**
     * Class constructor
     * @param {SpeedyMedia} media
     */
    constructor(media)
    {
        this._media = media;
        this._gpu = new GPUPrograms(media.width, media.height);
    }

    /**
     * FAST corner detection
     * @param {number} [n] We'll run FAST-n, where n must be 9 (default), 7 or 5
     * @param {object} [userSettings ]
     */
    fast(n = 9, userSettings = { })
    {
        const settings = Object.assign({ }, {
            threshold: 10,
            denoise: true,
        }, userSettings);

        // convert a sensitivity value in [0,1],
        // if it's defined, to a FAST threshold
        if(settings.hasOwnProperty('sensitivity')) {
            const sensitivity = Math.max(0, Math.min(settings.sensitivity, 1));
            settings.threshold = 1 - Math.tanh(2.77 * sensitivity);
        }
        else {
            const threshold = Math.max(0, Math.min(settings.threshold, 255));
            settings.threshold = threshold / 255;
        }

        // validate input
        if(n != 9 && n != 5 && n != 7)
            Utils.fatal(`Not implemented: FAST-${n}`); // this shouldn't happen...

        // pre-processing the image...
        const smoothed = settings.denoise ?
            this._gpu.filters.gauss1x(this._gpu.filters.gauss1y(this._media.source)) :
            this._media.source;

        const greyscale = this._gpu.colors.rgb2grey(smoothed);

        // feature detection
        const rawCorners = (({
            5:  () => this._gpu.features.fast5(greyscale, settings.threshold),
            7:  () => this._gpu.features.fast7(greyscale, settings.threshold),
            9:  () => this._gpu.features.fast9(greyscale, settings.threshold),
        })[n])();

        const rawCornersWithScores = (({
            5:  () => this._gpu.features.fastScore8(rawCorners, settings.threshold),
            7:  () => this._gpu.features.fastScore12(rawCorners, settings.threshold),
            9:  () => this._gpu.features.fastScore16(rawCorners, settings.threshold),
        })[n])();

        const corners = this._gpu.features.fastSuppression(rawCornersWithScores);

        // encoding result
        const offsets = this._gpu.encoding.encodeOffsets(corners);
        this._gpu.encoding.encodeFeatureCount(offsets);
        const pixel = this._gpu.encoding.encodeFeatureCount.getPixels();
        this._gpu.optimizeEncoder((pixel[3] << 24) | (pixel[2] << 16) | (pixel[1] << 8) | pixel[0]);
        this._gpu.encoding.encodeFeatures(offsets, this._gpu.encoderLength);

        // done!
        return this._decodeFeatures(this._gpu.encoding.encodeFeatures);
    }

    // reads the corners from a processed image
    _decodeFeatures(texture)
    {
        const [ w, h ] = [ this._media.width, this._media.height ];
        const pixels = texture.getPixels(); // bottleneck
        let features = [], p, x, y, count;

        for(let i = 0; i < pixels.length; i += 4) {
            x = (pixels[i+1] << 8) | pixels[i];
            y = (pixels[i+3] << 8) | pixels[i+2];
            if(x < w && y < h)
                features.push(new SpeedyFeature(x, y));
            else
                break;
        }

        return features;
    }
}