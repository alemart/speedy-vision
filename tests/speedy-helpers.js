/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2022 Alexandre Martins <alemartf(at)gmail.com>
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
 * speedy-helpers.js
 * Helpers for Speedy's unit testing
 */

// Constants
const PIXEL_TOLERANCE = 1; // pixel intensities within this tolerance are "close enough"
const MAX_IMERR = 0.01; // max. image error (percentage)



//
// Image utilities
//

// Read pixels from a source
function pixels(source)
{
    const toCanvas = ({
        'SpeedyMedia': createCanvasFromSpeedyMedia,
        'HTMLImageElement': createCanvasFromImage,
        'HTMLCanvasElement': canvas => canvas,
        'ImageBitmap': createCanvasFromBitmap,
    })[source.constructor.name];

    const canvas = toCanvas(source);
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return Array.from(imageData.data);
}

// Loads an image
function loadImage(assetName)
{
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Can't load ${assetName}`));
        image.src = '../assets/' + assetName;
    });
}

// Loads a video
function loadVideo(assetName)
{
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.oncanplay = () => (video.play(), resolve(video));
        video.onerror = () => reject(new Error(`Can't load ${assetName}`));
        video.defaultMuted = video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.src = '../assets/' + assetName;
    });
}

// Changed test?
function printTestHeader()
{
    if(jasmine.lastTest !== jasmine.currentTest) {
        jasmine.lastTest = jasmine.currentTest;
        header(
            '> It ' + jasmine.currentTest.description + '\n\n' +
            '(' + jasmine.currentSuite.fullName + ')',
            'color: white; background: royalblue; padding: 1em'
        );

        return true;
    }

    return false;
}

// Creates a header for visualization
function header(title, style)
{
    const hr = document.createElement('hr');
    document.body.appendChild(hr);
    print(title, style);
}

// Prints a message to the screen
function print(message = '', style)
{
    printTestHeader();

    const pre = document.createElement('pre');
    if(style !== undefined)
        pre.style = style;

    const text = document.createTextNode(message);
    pre.appendChild(text);
    document.body.appendChild(pre);

    if(!message)
        pre.style.margin = 0;
}

// Print matrices
function printm(...matrices) {
    if(matrices.length > 0) {
        const m = matrices.shift();
        if(typeof m === 'object') {
            print(m.toString());
            printm(...matrices);
        }
        else {
            print(m);
            printm(...matrices);
        }
    }
}

// Displays a SpeedyMedia, Image or Canvas
function display(source, title = '')
{
    printTestHeader();

    const toCanvas = ({
        'SpeedyMedia': createCanvasFromSpeedyMedia,
        'HTMLImageElement': createCanvasFromImage,
        'HTMLCanvasElement': createCanvasFromCanvas,
        'ImageBitmap': createCanvasFromBitmap,
    })[source.constructor.name];

    const canvas = toCanvas(source, title);
    document.body.appendChild(canvas);

    return canvas;
}

// Displays a SpeedyMedia with features
function displayFeatures(mediaOrCanvas, features = [], title = '', color = 'red')
{
    const canvas = (mediaOrCanvas instanceof HTMLCanvasElement) ? mediaOrCanvas : display(mediaOrCanvas, title);
    const context = canvas.getContext('2d');
    const size = 2;
    
    context.beginPath();
    for(let feature of features) {
        let radius = size * feature.scale;

        // draw scaled circle
        context.moveTo(feature.x + radius, feature.y);
        context.arc(feature.x, feature.y, radius, 0, Math.PI * 2.0);

        // draw rotation line
        const sin = Math.sin(feature.rotation);
        const cos = Math.cos(feature.rotation);
        context.moveTo(feature.x, feature.y);
        context.lineTo(feature.x + radius * cos, feature.y - radius * sin);
    }
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
}

// Image error: a value in [0,1]
// the higher the value, the higher the error
function imerr(imageA, imageB)
{
    const rgb1 = pixels(imageA).filter((_, i) => i % 4 < 3);
    const rgb2 = pixels(imageB).filter((_, i) => i % 4 < 3);
    return mae(rgb1, rgb2) / 255.0;
}

// Image difference for visual inspection
function imdiff(mediaA, mediaB, normalize = true)
{
    const diff = subtract(pixels(mediaA), pixels(mediaB));
    const min = normalize ? diff.reduce((m, p) => Math.min(m, p), 255) : 0;
    const max = normalize ? diff.reduce((m, p) => Math.max(m, p), -255) : 255;

    const normalized = multiply(
        subtract(
            diff,
            Array(diff.length).fill(min)
        ),
        255.0 / (max - min)
    );

    return createCanvasFromPixels(mediaA.width, mediaA.height, normalized);
}



//
// Array operations
//

function zeroes(n) // [ 0 ... 0 ]^T
{
    return Array(n).fill(0);
}

function add(a, b) // a + b
{
    const n = Math.max(a.length, b.length);
    return Array(n).fill(0).map((_, i) => (a[i] || 0) + (b[i] || 0));
}

function subtract(a, b) // a - b
{
    const n = Math.max(a.length, b.length);
    return Array(n).fill(0).map((_, i) => (a[i] || 0) - (b[i] || 0));
}

function multiply(v, m = 1.0) // m v
{
    return v.map(x => x * m);
}

function errmax(a, b, tolerance = PIXEL_TOLERANCE) // max absolute error of elements not nearly equal
{
    return subtract(a, b).map(x => Math.abs(x)).filter(e => e > tolerance).reduce((m, e) => Math.max(m, e), 0);
}

function errcnt(a, b, tolerance = PIXEL_TOLERANCE) // error count: number of elements not nearly equal
{
    return subtract(a, b).filter(x => Math.abs(x) > tolerance).length;
}

function relerrcnt(a, b, tolerance = PIXEL_TOLERANCE) // relative error count
{
    const n = Math.max(a.length, b.length);
    return errcnt(a, b, tolerance) / n;
}

function rms(v) // root mean square
{
    const sum = v.reduce((s, vi) => s + vi * vi, 0);
    return Math.sqrt(sum / v.length);
}

function mae(a, b) // mean absolute error
{
    const diff = subtract(a, b);
    return diff.reduce((s, d) => s + Math.abs(d), 0) / diff.length;
}

function l2dist(a, b) // Euclidean distance
{
    return Math.sqrt(subtract(a, b).reduce((s, d) => s + d * d, 0));
}

function l1dist(a, b) // Manhattan distance
{
    return subtract(a, b).reduce((s, d) => s + Math.abs(d), 0);
}

function norm(a) // Euclidean norm
{
    return Math.sqrt(a.reduce((s, ai) => s + ai * ai, 0));
}

function mean(v) // mean
{
    const sum = a.reduce((s, x) => s + x, 0);
    return sum / v.length;
}

function variance(v) // variance
{
    const u = mean(v);
    const sum = v.map(x => (x - u) * (x - u));
    return sum / v.length;
}

function stddev(v) // standard deviation
{
    return Math.sqrt(variance(v));
}

function linspace(start, stop, num) // [ start , ... , stop ] with num linearly spaced elements
{
    if(num > 1) {
        const step = (stop - start) / (num - 1);
        return Array(num).fill(start).map((x, i) => x + i * step);
    }
    else
        return num == 1 ? [(start + stop) / 2] : [];
}



//
// Utilities
//

// repeat an async function n times
async function repeat(n, fn)
{
    let result = null;

    while(n-- > 0)
        result = await fn();

    return result;
}

// sleep for a few milliseconds
function sleep(ms)
{
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

// compute the center of mass of a collection of SpeedyFeatures
function centerOfMass(features)
{
    const avg = features.reduce((avg, p) => {
        avg.x += p.x;
        avg.y += p.y;
        return avg;
    }, { x: 0, y: 0 });

    if(features.length > 0) {
        avg.x /= features.length;
        avg.y /= features.length;
    }

    return avg;
}

// a random integer i such that 0 <= i < n
function randomInt(n)
{
    return (n * Math.random()) | 0;
}


//
// Internal utilities
//
function createCanvas(width, height, title = '')
{
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.title = title;
    return canvas;
}

function createCanvasFromImage(image, title = '')
{
    const canvas = createCanvas(image.naturalWidth, image.naturalHeight, title);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    return canvas;
}

function createCanvasFromCanvas(origCanvas, title = '')
{
    const canvas = createCanvas(origCanvas.width, origCanvas.height, title);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(origCanvas, 0, 0);
    return canvas;
}

function createCanvasFromBitmap(bitmap, title = '')
{
    const canvas = createCanvas(bitmap.width, bitmap.height, title);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);
    return canvas;
}

function createCanvasFromSpeedyMedia(media, title = '')
{
    const canvas = createCanvas(media.width, media.height, title);
    const isAnimated = media.type == 'video'; //media.type != 'image'; // for tests

    if(isAnimated) {
        function animate() {
            media.draw(canvas);
            requestAnimationFrame(animate);
        }
        animate();
    }
    else
        media.draw(canvas);

    return canvas;
}

function createCanvasFromPixels(width, height, pixels, title = '')
{
    const canvas = createCanvas(width, height, title);
    const ctx = canvas.getContext('2d');
    const rgb = pixels.map((px, i) => i % 4 == 3 ? 255 : px);
    const imageData = new ImageData(new Uint8ClampedArray(rgb), width, height);

    ctx.putImageData(imageData, 0, 0);

    return canvas;
}

// Custom matchers for Jasmine
var speedyMatchers =
{

    //
    // Array matchers
    //

    toBeElementwiseEqual: util =>
    ({
        compare(a, b)
        {
            let pass = (a.length == b.length);
            for(let i = 0; i < a.length && pass; i++)
                pass = pass && a[i] === b[i];

            let message = pass ?
                `Arrays are expected to differ` :
                `Arrays are not expected to differ, but ${(a.length > b.length ? a : b).filter((_, i) => a[i] !== b[i]).length} elements do differ. ` +
                `They differ by at most ${errmax(a, b, 0)}\n` +
                `Mean average error: ${mae(a, b)}`;

            return { pass, message };
        }
    }),

    toBeElementwiseNearlyEqual: util =>
    ({
        compare(a, b, tolerance = 1e-5)
        {
            let pass = (a.length == b.length);
            for(let i = 0; i < a.length && pass; i++)
                pass = pass && Math.abs(a[i] - b[i]) <= tolerance;

            let message = pass ?
                `Arrays are expected not to be nearly equal` :
                `Arrays are expected to be nearly equal, but ${errcnt(a, b, tolerance)} pairs aren't so. ` +
                `Their elements differ by at most ${errmax(a, b, tolerance)}, ` +
                `whereas the test tolerance is ${tolerance}\n` +
                `Relative error count: ${relerrcnt(a, b, tolerance)}\n` +
                `Mean average error: ${mae(a, b)}`;
                
            return { pass, message };
        }
    }),

    toBeElementwiseNearlyTheSamePixels: util =>
    ({
        compare(a, b)
        {
            const tolerance = PIXEL_TOLERANCE;

            let pass = (a.length == b.length);
            for(let i = 0; i < a.length && pass; i++)
                pass = pass && Math.abs(a[i] - b[i]) <= tolerance;

            let message = pass ?
                `Arrays are expected not to be elementwise nearly the same pixels` :
                `Arrays are expected to be elementwise nearly the same pixels, but ${errcnt(a, b, tolerance)} pairs aren't so. ` +
                `Their elements differ by at most ${errmax(a, b, tolerance)}, ` +
                `whereas the test tolerance is ${tolerance}\n` +
                `Relative error count: ${relerrcnt(a, b, tolerance)}\n` +
                `Mean average error: ${mae(a, b)}`;
                
            return { pass, message };
        }
    }),

    toBeElementwiseGreaterThanOrEqual: util =>
    ({
        compare(a, b)
        {
            let pass = (a.length == b.length);
            for(let i = 0; i < a.length && pass; i++)
                pass = pass && a[i] >= b[i];

            let message = pass ?
                `Arrays elements are expected not to be greater than or equal to, elementwise` :
                `Arrays elements are expected to be greater than or equal to, elementwise, but ${(a.length > b.length ? a : b).filter((_, i) => a[i] < b[i]).length} elements are less than. ` +
                `The maximum difference between these elements is ${(a.length > b.length ? a : b).map((_, i) => b[i] - a[i]).reduce((m, x) => Math.max(m, x), 0)}`;

            return { pass, message };
        }
    }),

    toBeElementwiseGreaterThan: util =>
    ({
        compare(a, b)
        {
            let pass = (a.length == b.length);
            for(let i = 0; i < a.length && pass; i++)
                pass = pass && a[i] > b[i];

            let message = pass ?
                `Arrays elements are expected not to be greater than, elementwise` :
                `Arrays elements are expected to be greater than, elementwise, but ${(a.length > b.length ? a : b).filter((_, i) => a[i] <= b[i]).length} elements are less than or equal to. ` +
                `The maximum difference between these elements is ${(a.length > b.length ? a : b).map((_, i) => b[i] - a[i]).reduce((m, x) => Math.max(m, x), 0)}`;

            return { pass, message };
        }
    }),

    toBeElementwiseLessThanOrEqual: util =>
    ({
        compare(a, b)
        {
            let pass = (a.length == b.length);
            for(let i = 0; i < a.length && pass; i++)
                pass = pass && a[i] <= b[i];

            let message = pass ?
                `Arrays elements are expected not to be less than or equal to, elementwise` :
                `Arrays elements are expected to be less than or equal to, elementwise, but ${(a.length > b.length ? a : b).filter((_, i) => a[i] > b[i]).length} elements are greater than. ` +
                `The maximum difference between these elements is ${(a.length > b.length ? a : b).map((_, i) => a[i] - b[i]).reduce((m, x) => Math.max(m, x), 0)}`;

            return { pass, message };
        }
    }),

    toBeElementwiseLessThan: util =>
    ({
        compare(a, b)
        {
            let pass = (a.length == b.length);
            for(let i = 0; i < a.length && pass; i++)
                pass = pass && a[i] < b[i];

            let message = pass ?
                `Arrays elements are expected not to be less than, elementwise` :
                `Arrays elements are expected to be less than, elementwise, but ${(a.length > b.length ? a : b).filter((_, i) => a[i] >= b[i]).length} elements are greater than or equal to. ` +
                `The maximum difference between these elements is ${(a.length > b.length ? a : b).map((_, i) => a[i] - b[i]).reduce((m, x) => Math.max(m, x), 0)}`;

            return { pass, message };
        }
    }),

    toBeElementwiseZero: util =>
    ({
        compare(a)
        {
            let pass = (a.length > 0);
            for(let i = 0; i < a.length && pass; i++)
                pass = pass && a[i] === 0.0;

            const zeros = (new Array(a.length)).fill(0.0);
            let message = pass ?
                `Array is expected not to be filled with zeros` :
                `Array is expected to be filled with zeros, but ${a.filter((_, i) => a[i] !== 0.0).length} elements are not zero. ` +
                `Elements differ by at most ${errmax(a, zeros, 0)}\n` +
                `Mean average error: ${mae(a, zeros)}`;

            return { pass, message };
        }
    }),

    toBeElementwiseNearlyZero: util =>
    ({
        compare(a, eps = 1e-6)
        {
            let pass = (a.length > 0);
            for(let i = 0; i < a.length && pass; i++)
                pass = pass && Math.abs(a[i]) <= eps;

            const zeros = (new Array(a.length)).fill(0.0);
            let message = pass ?
                `Array elements are expected not to be nearly zero` :
                `Array elements are expected to be nearly zero, but ${errcnt(a, zeros, eps)} elements aren't so. ` +
                `The elements differ by at most ${errmax(a, zeros, eps)}, ` +
                `whereas the test tolerance is ${eps}\n` +
                `Relative error count: ${relerrcnt(a, zeros, eps)}\n` +
                `Mean average error: ${mae(a, zeros)}`;

            return { pass, message };
        }
    }),

    toBeElementwiseNaN: util =>
    ({
        compare(a)
        {
            let pass = true;
            for(let i = 0; i < a.length && pass; i++)
                pass = pass && Number.isNaN(a[i]);

            let message = pass ?
                `Not all arrays elements are expected to be NaN, but ${a.filter(x => Number.isNaN(x)).length} elements are NaN.` :
                `All arrays elements are expected to be NaN, but ${a.filter(x => !Number.isNaN(x)).length} elements are not NaN.`;

            return { pass, message };
        }
    }),

    //
    // Image matchers
    //

    toBeAnAcceptableImageError: util =>
    ({
        compare(err, toleranceMultiplier = 1.0)
        {
            const pass = Math.abs(err) < toleranceMultiplier * MAX_IMERR;
            return { pass };
        }
    }),

    //
    // Misc
    //

    toBeNearlyZero: util =>
    ({
        compare(x, eps = 1e-6)
        {
            const pass = Math.abs(x) < eps;
            return { pass };
        }
    })
};

// add jasmine.currentTest
jasmine.getEnv().addReporter({
    suiteStarted: x => (jasmine.currentSuite = x),
    specStarted: x => (jasmine.currentTest = x),
});

// add disclaimer
window.addEventListener('load', () => {
    header('Speedy testing!');
    const msg = `Results are available for visual inspection.`;
    print(msg);
});

// run test sequentially
jasmine.getEnv().configure({ random: false });