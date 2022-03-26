/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2022 Alexandre Martins <alemartf(at)gmail.com>
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
 * settings.js
 * Global settings
 */

import { SpeedyNamespace } from './speedy-namespace';
import { SpeedyGL } from '../gpu/speedy-gl';

/** @typedef {import('../gpu/speedy-gl').SpeedyPowerPreference} SpeedyPowerPreference */



/**
 * Global settings
 */
export class Settings extends SpeedyNamespace
{
    /**
     * Power preference of the WebGL context
     * @returns {SpeedyPowerPreference}
     */
    static get powerPreference()
    {
        return SpeedyGL.powerPreference;
    }

    /**
     * Power preference of the WebGL context
     * @param {SpeedyPowerPreference} value
     */
    static set powerPreference(value)
    {
        SpeedyGL.powerPreference = value;
    }
}