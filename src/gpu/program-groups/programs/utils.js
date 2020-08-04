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
 * utils.js
 * Utility shaders
 */

import { importShader } from '../../shader-declaration';

// Identity shader: no-operation
export const identity = importShader('utils/identity.glsl').withArguments('image');

// Flip y-axis for output
export const flipY = importShader('utils/flip-y.glsl').withArguments('image');

// Fill image with a constant
export const fill = importShader('utils/fill.glsl').withArguments('value');

// Fill zero or more color components of the input image with a constant value
export const fillComponents = importShader('utils/fill-components.glsl').withArguments('image', 'pixelComponents', 'value');

// Copy the src component of src to zero or more color components of a copy of dest
export const copyComponents = importShader('utils/copy-components.glsl').withArguments('dest', 'src', 'destComponents', 'srcComponentId');

// Scan the entire image and find the minimum & maximum pixel intensity for each row and column
export const scanMinMax1D = importShader('utils/scan-minmax1d.glsl').withArguments('image', 'iterationNumber');

// Scan the entire image and find the minimum & maximum pixel intensity
export const scanMinMax2D = importShader('utils/scan-minmax2d.glsl').withArguments('image', 'iterationNumber');