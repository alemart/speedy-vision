/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * speedy-feature-detector-factory.js
 * A collection of methods for instantiating SpeedyFeatureDetectors
 */

import { SpeedyNamespace } from './speedy-namespace';
import {
    FASTFeatureDetector,
    MultiscaleFASTFeatureDetector,
    HarrisFeatureDetector,
    MultiscaleHarrisFeatureDetector,
    ORBFeatureDetector,
    BRISKFeatureDetector
} from './speedy-feature-detector';

/**
 * A collection of methods for instantiating SpeedyFeatureDetectors
 */
export class SpeedyFeatureDetectorFactory extends SpeedyNamespace
{
    /**
     * FAST feature detector
     * @param {number} [n] Variant of the algorithm. Must be 9, 7 or 5.
     * @returns {FASTFeatureDetector}
     */
    static FAST(n = 9)
    {
        return new FASTFeatureDetector(n);
    }

    /**
     * FAST feature detector in scale-space
     * @param {number} [n] Variant of the algorithm. Must be 9.
     * @returns {MultiscaleFASTFeatureDetector}
     */
    static MultiscaleFAST(n = 9)
    {
        return new MultiscaleFASTFeatureDetector(n);
    }

    /**
     * Harris corner detector
     * @returns {HarrisFeatureDetector}
     */
    static Harris()
    {
        return new HarrisFeatureDetector();
    }

    /**
     * Harris corner detector in scale-space
     * @returns {MultiscaleHarrisFeatureDetector}
     */
    static MultiscaleHarris()
    {
        return new MultiscaleHarrisFeatureDetector();
    }

    /**
     * ORB feature detector & descriptor
     * @returns {ORBFeatureDetector}
     */
    static ORB()
    {
        return new ORBFeatureDetector();
    }

    /**
     * BRISK feature detector & descriptor
     * @returns {BRISKFeatureDetector}
     */
    static BRISK()
    {
        return new BRISKFeatureDetector();
    }
}