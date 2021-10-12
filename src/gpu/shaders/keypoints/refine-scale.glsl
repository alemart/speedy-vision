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
 * refine-scale.glsl
 * Refine the scale of a set of keypoints using interpolation
 */

@include "keypoints.glsl"
@include "filters.glsl"

#if !defined(METHOD)
#error Undefined METHOD
#endif

uniform sampler2D pyramid;
uniform float lodStep;

uniform sampler2D encodedKeypoints;
uniform int descriptorSize;
uniform int extraSize;
uniform int encoderLength;

#if METHOD == 1
uniform int threshold; // FAST threshold
#endif

const float eps = 1e-6;

/**
 * A measure of corner strength in scale-space
 * @param {vec2} position
 * @param {float} lod
 * @returns {float}
 */
float cornerStrength(vec2 position, float lod)
{
#if METHOD == 0

    //
    // Laplacian of Gaussian (pyramid)
    //
    return laplacian(pyramid, position, lod);

#elif METHOD == 1

    //
    // FAST-9,16 score
    //
    float pot = exp2(lod);
    float t = float(clamp(threshold, 0, 255)) / 255.0f;

    #define P(x,y) pyrPixelAtOffset(pyramid, lod, pot, ivec2((x),(y))).g
    mat4 mp = mat4(
        P(0,3),P(3,0),P(0,-3),P(-3,0),
        P(1,3),P(2,2),P(3,1),P(3,-1),
        P(2,-2),P(1,-3),P(-1,-3),P(-2,-2),
        P(-3,-1),P(-3,1),P(-2,2),P(-1,3)
    );

    float c = P(0,0);
    float ct = c + t, c_t = c - t;
    mat4 mct = mp - mat4(ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct);
    mat4 mc_t = mat4(c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t) - mp;

    const vec4 zeros = vec4(0.0f), ones = vec4(1.0f);
    vec4 bs = max(mct[0], zeros), ds = max(mc_t[0], zeros);
    bs += max(mct[1], zeros);     ds += max(mc_t[1], zeros);
    bs += max(mct[2], zeros);     ds += max(mc_t[2], zeros);
    bs += max(mct[3], zeros);     ds += max(mc_t[3], zeros);

    return max(dot(bs, ones), dot(ds, ones)) / 16.0f;

#else
#error Invalid method
#endif
}

void main()
{
    vec4 pixel = threadPixel(encodedKeypoints);
    ivec2 thread = threadLocation();
    KeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);

    // we want a properties cell
    color = pixel;
    if(address.offset != 1)
        return;

    // decode keypoint
    Keypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);
    if(isBadKeypoint(keypoint))
        return;

    // find the corner strength of 3 levels of the pyramid
    vec3 strength = vec3(
        cornerStrength(keypoint.position, max(0.0f, keypoint.lod - lodStep)),
        cornerStrength(keypoint.position, keypoint.lod),
        cornerStrength(keypoint.position, keypoint.lod + lodStep)
    );

    // fit a parabola p = (a,b,c) <=> ax^2 + bx + c = 0 using
    // points { (0,x), (0.5,y), (1,z) } where (x,y,z) = strength
    vec3 p = mat3(
        2, -3, 1,
        -4, 4, 0,
        2, -1, 0
    ) * strength;

    float maxStrength = max(strength.x, max(strength.y, strength.z));
    vec3 diffStrength = abs(strength - vec3(maxStrength));
    vec3 strengthIndicators = vec3(lessThan(diffStrength, vec3(eps))); // in {0,1}^3
    float maxPoint = min(1.0f, dot(vec3(0.0f, 0.5f, 1.0f), strengthIndicators)); // multiple indicators set to 1?

    bool hasMax = p.x < -eps;
    float pmax = hasMax ? -0.5f * p.y / p.x : maxPoint;

    // find the new lod
    //float alpha = clamp(pmax, 0.0f, 1.0f);
    float alpha = abs(pmax - 0.5f) <= 0.5f ? pmax : maxPoint;
    float lodOffset = mix(-lodStep, lodStep, alpha);
    float lod = keypoint.lod + lodOffset;

    // done!
    color.r = encodeLod(lod);
}