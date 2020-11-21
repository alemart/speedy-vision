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
    ORBHarrisFeatureDetector,
    ORBFASTFeatureDetector,
    BRISKFeatureDetector
} from './speedy-feature-detector';
import { IllegalArgumentError } from '../utils/errors';

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
     * @param {string} [detector] 'harris' | 'fast'
     * @returns {ORBHarrisFeatureDetector | ORBFASTFeatureDetector}
     */
    static ORB(detector = 'harris')
    {
        if(detector == 'harris')
            return new ORBHarrisFeatureDetector();
        else if(detector == 'fast')
            return new ORBFASTFeatureDetector();
        else if(detector == 'fast-with-harris') // discard this?
            return new ORBFASTFeatureDetector(true);
        else
            throw new IllegalArgumentError(`Invalid detector for ORB: "${detector}"`);
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