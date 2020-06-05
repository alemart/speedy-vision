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
 * speedy-helpers.js
 * Helpers for Speedy's unit testing
 */

// Constants
const PIXEL_TOLERANCE = 1; // pixel intensities within this tolerance are "close enough"
const MAX_IMERR = 0.01; // max. image error (percentage)

// Read pixels from a source
function pixels(source)
{
    const toCanvas = ({
        'SpeedyMedia': createCanvasFromSpeedyMedia,
        'HTMLImageElement': createCanvasFromImage,
        'HTMLCanvasElement': x => x,
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
        video.muted = true;
        video.loop = true;
        video.src = '../assets/' + assetName;
        video.load();
    });
}

// Displays a SpeedyMedia, Image or Canvas
function display(source, title = '')
{
    if(jasmine.lastTest !== jasmine.currentTest) {
        jasmine.lastTest = jasmine.currentTest;
        header('It ' + jasmine.currentTest.description);
    }

    const toCanvas = ({
        'SpeedyMedia': createCanvasFromSpeedyMedia,
        'HTMLImageElement': createCanvasFromImage,
        'HTMLCanvasElement': createCanvasFromCanvas,
    })[source.constructor.name];

    const canvas = toCanvas(source, title);
    document.body.appendChild(canvas);

    return canvas;
}

// Prints a message to the screen
function print(message = '')
{
    const pre = document.createElement('pre');
    const text = document.createTextNode(message);
    pre.appendChild(text);
    document.body.appendChild(pre);

    if(!message)
        pre.style.margin = 0;
}

// Creates a header for visualization
function header(title)
{
    const hr = document.createElement('hr');
    document.body.appendChild(hr);
    print('> ' + title);
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


// Array operations
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

// Utilities
function createCanvas(width, height, title = '')
{
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.title = title;
    return canvas;
}

function createCanvasFromImage(filepath, title = '')
{
    return loadImage(filepath).then(image =>
        createCanvas(image.naturalWidth, image.naturalHeight, title)
    );
}

function createCanvasFromCanvas(origCanvas, title = '')
{
    const canvas = createCanvas(origCanvas.width, origCanvas.height, title);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(origCanvas, 0, 0);
    return canvas;
}

function createCanvasFromSpeedyMedia(media, title = '')
{
    const canvas = createCanvas(media.width, media.height, title);
    const isAnimated = media.type != 'image';

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

    toBeElementwiseEqual: (util, customEqualityMatchers) =>
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
                `Relative error count: ${relerrcnt(a, b, tolerance)}\n` +
                `Mean average error: ${mae(a, b)}`;

            return { pass, message };
        }
    }),

    toBeElementwiseNearlyEqual: (util, customEqualityMatchers) =>
    ({
        compare(a, b, tolerance = PIXEL_TOLERANCE)
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

    toBeElementwiseGreaterThanOrEqual: (util, customEqualityMatchers) =>
    ({
        compare(a, b)
        {
            let pass = (a.length == b.length);
            for(let i = 0; i < a.length && pass; i++)
                pass = pass && a[i] >= b[i];

            let message = pass ?
                `Arrays elements are expected not to be greater than or equal to, elementwise` :
                `Arrays elements are expected to be greater than or equal to, elementwise, but ${(a.length > b.length ? a : b).filter((_, i) => a[i] < b[i]).length} elements are less than. ` +
                `The maximum difference between these elements is ${(a.length > b.length ? a : b).map((_, i) => b[i] - a[i]).reduce((m, x) => Math.max(m, x), 0)}`

            return { pass, message };
        }
    }),

    toBeElementwiseGreaterThan: (util, customEqualityMatchers) =>
    ({
        compare(a, b)
        {
            let pass = (a.length == b.length);
            for(let i = 0; i < a.length && pass; i++)
                pass = pass && a[i] > b[i];

            let message = pass ?
                `Arrays elements are expected not to be greater than, elementwise` :
                `Arrays elements are expected to be greater than, elementwise, but ${(a.length > b.length ? a : b).filter((_, i) => a[i] <= b[i]).length} elements are less than or equal to. ` +
                `The maximum difference between these elements is ${(a.length > b.length ? a : b).map((_, i) => b[i] - a[i]).reduce((m, x) => Math.max(m, x), 0)}`

            return { pass, message };
        }
    }),

    toBeElementwiseLessThanOrEqual: (util, customEqualityMatchers) =>
    ({
        compare(a, b)
        {
            let pass = (a.length == b.length);
            for(let i = 0; i < a.length && pass; i++)
                pass = pass && a[i] <= b[i];

            let message = pass ?
                `Arrays elements are expected not to be less than or equal to, elementwise` :
                `Arrays elements are expected to be less than or equal to, elementwise, but ${(a.length > b.length ? a : b).filter((_, i) => a[i] > b[i]).length} elements are greater than. ` +
                `The maximum difference between these elements is ${(a.length > b.length ? a : b).map((_, i) => a[i] - b[i]).reduce((m, x) => Math.max(m, x), 0)}`

            return { pass, message };
        }
    }),

    toBeElementwiseLessThan: (util, customEqualityMatchers) =>
    ({
        compare(a, b)
        {
            let pass = (a.length == b.length);
            for(let i = 0; i < a.length && pass; i++)
                pass = pass && a[i] < b[i];

            let message = pass ?
                `Arrays elements are expected not to be less than, elementwise` :
                `Arrays elements are expected to be less than, elementwise, but ${(a.length > b.length ? a : b).filter((_, i) => a[i] >= b[i]).length} elements are greater than or equal to. ` +
                `The maximum difference between these elements is ${(a.length > b.length ? a : b).map((_, i) => a[i] - b[i]).reduce((m, x) => Math.max(m, x), 0)}`

            return { pass, message };
        }
    }),

    //
    // Image matchers
    //

    toBeAnAcceptableImageError: (util, customEqualityMatchers) =>
    ({
        compare(err)
        {
            const pass = Math.abs(err) < MAX_IMERR;
            return { pass };
        }
    }),
};

// add jasmine.currentTest
jasmine.getEnv().addReporter({
    specStarted: x => (jasmine.currentTest = x),
    specDone: x => (jasmine.currentTest = x),
});

// add disclaimer
window.addEventListener('load', () => {
    header('Speedy testing!');
    const msg = `Please note that the floating point precision may vary across different GPUs, ` +
                `which may impact this testing.\nResults are available for visual inspection.`;
    print(msg);
});