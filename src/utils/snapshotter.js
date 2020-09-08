/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for the web
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
 * snapshotter.js
 * Take snapshots of a SpeedyMedia and keep a short history of them
 */

import { SpeedyMedia } from '../core/speedy-media';

/**
 * A Snapshotter is used to take snapshots of a
 * SpeedyMedia and to keep a short history of them
 */
export class Snapshotter
{
    /**
     * Class constructor
     * @param {SpeedyMedia} media 
     */
    constructor(media)
    {
        this._media = media;
        this._bitmap = null;
        this._prevBitmap = null;
    }

    /**
     * Take a snapshot, returning a short history of the
     * N = 2 most recent snapshots. The latest snapshot is
     * stored at index 0; the one taken before that, at 1...
     * @returns {Promise<ImageBitmap[]>}
     */
    _takeSnapshot()
    {
        return this._media.toBitmap().then(bitmap => {
            this._prevBitmap = this._bitmap || bitmap;
            this._bitmap = bitmap;
            return [ this_bitmap, this._prevBitmap ];
        });
    }
}