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
 * speedy-platform.js
 * Utilities to query information about the graphics driver
 */

import { SpeedyNamespace } from './speedy-namespace';
import { SpeedyGL } from '../gpu/speedy-gl';

/**
 * Utilities to query information about the graphics driver. This information
 * may or may not be available, depending on the privacy settings of the web
 * browser. In addition, it may be more or less accurate in different browsers.
 */
export class SpeedyPlatform extends SpeedyNamespace
{
    /**
     * Renderer string of the graphics driver
     * @returns {string}
     */
    static get renderer()
    {
        return SpeedyGL.instance.renderer;
    }

    /**
     * Vendor string of the graphics driver
     * @returns {string}
     */
    static get vendor()
    {
        return SpeedyGL.instance.vendor;
    }
}
