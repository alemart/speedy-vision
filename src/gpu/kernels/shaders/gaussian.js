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
 * gaussian.js
 * Gaussian kernel generator
 */

/*
 * -----------------------------------------------------------------------------
 * 1D Gaussian Kernel
 * Lets generate a 1D Gaussian kernel with size kernelSize x 1 and custom sigma
 * -----------------------------------------------------------------------------
 * Let G(x) be a Gaussian function centered at 0 with fixed sigma:
 *
 * G(x) = (1 / (sigma * sqrt(2 * pi))) * exp(-(x / (sqrt(2) * sigma))^2)
 * 
 * In addition, let f(p) be a kernel value at pixel p, -k/2 <= p <= k/2:
 * 
 * f(p) = \int_{p - 0.5}^{p + 0.5} G(x) dx (integrate around p)
 *      = \int_{0}^{p + 0.5} G(x) dx - \int_{0}^{p - 0.5} G(x) dx
 * 
 * Setting a constant c := sqrt(2) * sigma, it follows that:
 * 
 * f(p) = (1 / 2c) * (erf((p + 0.5) / c) - erf((p - 0.5) / c))
 * 
 * Practical tip: use kernelSize >= (5 * sigma), kernelSize odd
 */
import { Utils } from "../../../utils/utils";

// Returns a function that creates a (kernelSize x 1)
// texture encoding a 1D gaussian kernel with custom sigma
export function createGaussianKernel(kernelSize)
{
    // validate kernel size
    if(kernelSize < 1 || kernelSize % 2 == 0)
        Utils.fatal(`Invalid kernel size given to createGaussianKernel: ${kernelSize} x 1`);

    // we shouldn't overflow the pixel storage (1.0) for small sigmas (~ 0.1)
    const NORMALIZER = 4.0; // might lead to precision loss? use multiple channels?

    // constants
    const N  =  kernelSize >> 1; // integer (floor, div 2)
    const m  =  0.3275911;
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const sq =  Math.sqrt(2);

    // function erf(x) = -erf(-x) can be approximated numerically. See:
    // https://en.wikipedia.org/wiki/Error_function#Numerical_approximations
    const body = `
    const c = (+sigma) * ${sq};
    let xa = (this.thread.x - ${N} + 0.5) / c;
    let xb = (this.thread.x - ${N} - 0.5) / c;
    let sa = 1.0, sb = 1.0;

    if(xa < 0.0) { sa = -1.0; xa = -xa; }
    if(xb < 0.0) { sb = -1.0; xb = -xb; }

    const ta = 1.0 / (1.0 + ${m} * xa);
    const tb = 1.0 / (1.0 + ${m} * xb);
    const pa = (((((${a5}) * ta + (${a4})) * ta + (${a3})) * ta + (${a2})) * ta + (${a1})) * ta;
    const pb = (((((${a5}) * tb + (${a4})) * tb + (${a3})) * tb + (${a2})) * tb + (${a1})) * tb;
    const ya = 1.0 - pa * Math.exp(-xa * xa);
    const yb = 1.0 - pb * Math.exp(-xb * xb);

    const erfa = sa * ya;
    const erfb = sb * yb;
    const fp = (erfa - erfb) / (2.0 * c);
    const f = fp * (${1.0 / NORMALIZER});

    this.color(f, f, f, 1);
    `;

    return new Function('sigma', body);
}

// Normalizes a gaussian kernel, so that the
// sum of each entry is equal to 1.0
export function normalizeGaussianKernel(kernelSize)
{
    // validate kernel size
    if(kernelSize < 1 || kernelSize % 2 == 0)
        Utils.fatal(`Invalid kernel size given to createGaussianKernel: ${kernelSize} x 1`);

    // repeat
    const repeat = f => [...Array(kernelSize).keys()].map(f).join('\n');
    const code = i => `pixel = image[y][${i}]; sum += pixel[0];`;

    // code
    const body = `
    const x = this.thread.x, y = this.thread.y;
    let pixel = image[y][x];
    let g = pixel[0];
    let sum = 0.0;

    ${repeat(code)}

    g /= sum;
    this.color(g, g, g, 1);
    `;

    return new Function('image', body);
}