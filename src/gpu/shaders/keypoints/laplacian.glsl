/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * laplacian.glsl
 * Compute the Laplacian of a level-of-detail of a corner response map
 */

@include "pyramids.glsl"
@include "float16.glsl"
@include "filters.glsl"

/*

Scale-normalized Laplacian map:

RG := float16 encoded laplacian (level-of-detail = lod extracted from corner response map - lodStep + lodOffset)
BA := float16 encoded laplacian (level-of-detail = lod extracted from corner response map + lodStep + lodOffset)

*/

uniform sampler2D corners;
uniform sampler2D pyramid;
uniform float lodStep; // may be zero
uniform float lodOffset; // default is zero

void main()
{
    ivec2 thread = threadLocation();
    vec4 pixel = threadPixel(corners);
    float lod = decodeLod(pixel.a); // corner response map
    float lodMinus = max(0.0f, lod - lodStep + lodOffset);
    float lodPlus = min(float(PYRAMID_MAX_LEVELS - 1), lod + lodStep + lodOffset);

    float lapMinus = laplacian(pyramid, vec2(thread), lodMinus);
    float lapPlus = abs(lodPlus - lodMinus) < 1e-5 ? lapMinus : laplacian(pyramid, vec2(thread), lodPlus);

    color = encodePairOfFloat16(vec2(lapMinus, lapPlus));
}