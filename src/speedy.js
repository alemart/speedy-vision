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
 * speedy.js
 * Speedy's entry point
 */

import { SpeedyMedia } from './core/speedy-media';
import { FPSCounter } from './utils/fps-counter';
import { Utils } from './utils/utils';

class Speedy
{
    /**
     * Loads a SpeedyMedia object based on the provided source element
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} sourceElement The source media
     * @returns {Promise<SpeedyMedia>}
     */
    static load(sourceElement)
    {
        return new Promise((resolve, reject) => {
            new SpeedyMedia(sourceElement, (err, media) => {
                if(!err)
                    resolve(media);
                else
                    reject(err);
            });
        });
    }

    /**
     * The version of the library
     * @returns {string} The version of the library
     */
    static get version()
    {
        return PACKAGE_VERSION;
    }

    /**
     * The FPS rate. Get it as Speedy.fps.value
     * @returns {number} Frames per second (FPS)
     */
    static get fps()
    {
        return {
            get value() { return FPSCounter.instance.fps; }
        };
    }
}

export const load = Speedy.load;
export const version = Speedy.version;
export const fps = Speedy.fps;