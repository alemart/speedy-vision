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
 * int32.glsl
 * Encode 32-bit integers into RGBA tuples
 */

#ifndef _INT32_GLSL
#define _INT32_GLSL

@include "platform.glsl"

/**
 * Convert a RGBA tuple into a uint32 using little-endian
 * @param {vec4} rgba in [0,1]^4
 * @returns {uint} 32-bit unsigned integer
 */
uint decodeUint32(vec4 rgba)
{
    uvec4 v = uvec4(rgba * 255.0f) & 255u;
    return v.x | (v.y << 8u) | (v.z << 16u) | (v.w << 24u);
}

/**
 * Convert a uint32 into a RGBA tuple using little-endian
 * @param {uint} value
 * @returns {vec4} RGBA tuple
 */
vec4 encodeUint32(uint value)
{
#if defined(APPLE_GPU) || (defined(APPLE) && defined(INTEL_GRAPHICS))

    /*

    A user with a MacBook Air (2014) reported that the feature matching demos
    were not working. After performing a detailed investigation, we tracked the
    problem down to this function. It was giving incorrect output, probably due
    to a driver bug. We replaced its bitwise operations by equivalent arithmetic
    operations and then we found that the demos worked properly.

    The device had an Intel HD Graphics 5000 card. Different browsers identified
    the video card in different ways: (OS: Big Sur)

    - Chrome: Intel HD Graphics 5000
    - Firefox: Intel HD Graphics 400
    - Safari: Apple GPU

    The extent of that driver bug is unknown. I haven't received any other
    similar complaints.

    */

    uvec4 v = uvec4(value, value / 256u, value / 65536u, value / 16777216u) % 256u;
    return vec4(v) / 255.0f;

#else

    uvec4 v = uvec4(value, value >> 8u, value >> 16u, value >> 24u) & 255u;
    return vec4(v) / 255.0f;

#endif
}

#endif
