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
 * speedy-feature-detector-factory.js
 * A collection of methods for instantiating SpeedyFeatureDetectors
 */

import { SpeedyNamespace } from './speedy-namespace';
import { SpeedyFeatureDetector } from './speedy-feature-detector';
import { FASTFeatures, MultiscaleFASTFeatures } from './features/algorithms/fast';
import { HarrisFeatures, MultiscaleHarrisFeatures } from './features/algorithms/harris';
import { ORBFeatures } from './features/algorithms/orb';
import { BRISKFeatures } from './features/algorithms/brisk';

/**
 * A collection of methods for instantiating SpeedyFeatureDetectors
 */
export class SpeedyFeatureDetectorFactory extends SpeedyNamespace
{
    /**
     * FAST feature detector
     */
    static FAST()
    {
        return new SpeedyFeatureDetector(new FASTFeatures());
    }

    /**
     * FAST feature detector in scale-space
     */
    static MultiscaleFAST()
    {
        return new SpeedyFeatureDetector(new MultiscaleFASTFeatures());
    }

    /**
     * Harris corner detector
     */
    static Harris()
    {
        return new SpeedyFeatureDetector(new HarrisFeatures());
    }

    /**
     * Harris corner detector in scale-space
     */
    static MultiscaleHarris()
    {
        return new SpeedyFeatureDetector(new MultiscaleHarrisFeatures());
    }

    /**
     * ORB feature detector & descriptor
     */
    static ORB()
    {
        return new SpeedyFeatureDetector(new ORBFeatures());
    }

    /**
     * BRISK feature detector & descriptor
     */
    static BRISK()
    {
        return new SpeedyFeatureDetector(new BRISKFeatures());
    }
}