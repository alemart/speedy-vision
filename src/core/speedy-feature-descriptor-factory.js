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
import { SpeedyFeatureDecorator } from './speedy-feature-decorator';
import { ORBFeatures } from './keypoints/descriptors/orb';

/**
 * A collection of methods for decorating Feature Detectors &
 * Feature Trackers with Descriptors
 */
export class SpeedyFeatureDescriptorFactory extends SpeedyNamespace
{
    /**
     * ORB descriptor
     * @returns {SpeedyFeatureDecorator}
     */
    static ORB()
    {
        return new SpeedyFeatureDecorator(ORBFeatures);
    }
}