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
 * speedy-feature-descriptor-factory.js
 * Factory of feature descriptors
 */

import { SpeedyNamespace } from './speedy-namespace';
import { SpeedyFeatureTracker } from './speedy-feature-tracker';
import { SpeedyFeatureDetector } from './speedy-feature-detector';
import { ORBFeatures } from './keypoints/descriptors/orb';
import { Utils } from '../utils/utils';

/**
 * A collection of methods for decorating Feature Detectors &
 * Feature Trackers with Descriptors
 */
export class SpeedyFeatureDescriptorFactory extends SpeedyNamespace
{
    /**
     * ORB descriptor
     * @param {SpeedyFeatureTracker|SpeedyFeatureDetector} obj
     * @returns {SpeedyFeatureTracker|SpeedyFeatureDetector} obj
     */
    static ORB(obj)
    {
        Utils.assert((obj instanceof SpeedyFeatureDetector) || (obj instanceof SpeedyFeatureTracker));
        obj.decorate(ORBFeatures);
        return obj;
    }
}