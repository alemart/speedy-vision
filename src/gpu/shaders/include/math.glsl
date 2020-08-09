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
 * math.glsl
 * Math utilities
 */

#ifndef _MATH_GLSL
#define _MATH_GLSL

// constants
#define TWO_PI          6.28318530718f
#define PI              3.14159265359f
#define PI_OVER_2       1.57079632679f
#define PI_OVER_4       0.78539816339f

// settings
#define USE_FAST_ATAN


/**
 * Fast arctangent - use an approximation
 * How fast is atan() in actual hardware?
 * @param {float} x
 * @returns {float} a value between PI/2 and -PI/2
 */
#ifdef USE_FAST_ATAN
float fastAtan(float x)
{
    float w = 1.0f - abs(x);
    return (w >= 0.0f) ?
        (PI_OVER_4 + 0.273f * w) * x :
        sign(x) * PI_OVER_2 - (PI_OVER_4 + 0.273f * (1.0f - abs(1.0f / x))) / x;
}
#else
#define fastAtan(x) atan(x)
#endif

/**
 * Fast atan2 - use an approximation
 * @param {float} y
 * @param {float} x
 * @returns {float} a value between PI and -PI
 */
#ifdef USE_FAST_ATAN
float fastAtan2(float y, float x)
{
    return (x == 0.0f) ? PI_OVER_2 * sign(y) : fastAtan(y / x) + float(x < 0.0f) * PI * sign(y);
}
#else
#define fastAtan2(y, x) atan((y), (x))
#endif

#endif