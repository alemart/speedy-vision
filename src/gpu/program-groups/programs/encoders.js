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
 * encoders.js
 * Speedy image encoding algorithms
 */

import { importShader } from '../../shader-declaration';

// encode keypoint offsets: maxIterations is an integer in [1,255], determined experimentally
export const encodeKeypointOffsets = importShader('encoders/encode-keypoint-offsets.glsl').withArguments('image', 'imageSize', 'maxIterations');

// encode keypoints
export const encodeKeypoints = importShader('encoders/encode-keypoints.glsl').withArguments('image', 'imageSize', 'encoderLength', 'descriptorSize');