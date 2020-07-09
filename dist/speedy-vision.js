/*!
 * speedy-vision.js v0.3.0
 * https://github.com/alemart/speedy-vision-js
 * 
 * GPU-accelerated Computer Vision for the web
 * Copyright 2020 Alexandre Martins <alemartf(at)gmail.com> (https://github.com/alemart)
 * @license Apache-2.0
 * 
 * Date: 2020-07-09T01:50:24.309Z
 */
var Speedy =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/speedy.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/core/algorithms/brisk.js":
/*!**************************************!*\
  !*** ./src/core/algorithms/brisk.js ***!
  \**************************************/
/*! exports provided: BRISK */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BRISK", function() { return BRISK; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
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
 * brisk.js
 * Modified BRISK algorithm
 */



let gaussians = null;
let shortPairs = null, longPairs = null;

/**
 * BRISK feature detection
 */
class BRISK
{
    /**
     * BRISK feature detection algorithm
     * @param {GPUInstance} gpu
     * @param {Texture} greyscale Greyscale image
     * @param {object} settings
     * @returns {Texture} features in a texture
     */
    static run(gpu, greyscale, settings)
    {
        const MIN_DEPTH = 1, MAX_DEPTH = gpu.pyramidHeight;

        // clamp settings.depth (height of the image pyramid)
        settings.depth = Math.max(MIN_DEPTH, Math.min(settings.depth, MAX_DEPTH)) | 0;

        // create the pyramid
        const pyramid = new Array(settings.depth);
        const intraPyramid = new Array(pyramid.length + 1);
        pyramid[0] = gpu.pyramid(0).pyramids.setBase(greyscale); // base of the pyramid
        for(let i = 1; i < pyramid.length; i++)
            pyramid[i] = gpu.pyramid(i-1).pyramids.reduce(pyramid[i-1]);
        intraPyramid[0] = gpu.pyramid(0).pyramids.intraExpand(pyramid[0]); // 1.5 * sizeof(base)
        for(let i = 1; i < intraPyramid.length; i++)
            intraPyramid[i] = gpu.intraPyramid(i-1).pyramids.reduce(intraPyramid[i-1]);

        // get FAST corners of all pyramid levels
        const pyramidCorners = new Array(pyramid.length);
        const intraPyramidCorners = new Array(intraPyramid.length);
        for(let j = 0; j < pyramidCorners.length; j++) {
            pyramidCorners[j] = gpu.pyramid(j).keypoints.fast9(pyramid[j], settings.threshold);
            pyramidCorners[j] = gpu.pyramid(j).keypoints.fastSuppression(pyramidCorners[j]);
        }
        for(let j = 0; j < intraPyramidCorners.length; j++) {
            intraPyramidCorners[j] = gpu.intraPyramid(j).keypoints.fast9(intraPyramid[j], settings.threshold);
            intraPyramidCorners[j] = gpu.intraPyramid(j).keypoints.fastSuppression(intraPyramidCorners[j]);
        }

        // scale space non-maximum suppression & interpolation
        const lgM = Math.log2(gpu.pyramidMaxScale), h = gpu.pyramidHeight;
        const suppressedPyramidCorners = new Array(pyramidCorners.length);
        const suppressedIntraPyramidCorners = new Array(intraPyramidCorners.length);
        suppressedIntraPyramidCorners[0] = gpu.intraPyramid(0).keypoints.brisk(intraPyramidCorners[0], intraPyramidCorners[0], pyramidCorners[0], 1.0, 2.0 / 3.0, lgM, h);
        for(let j = 0; j < suppressedPyramidCorners.length; j++) {
            suppressedPyramidCorners[j] = gpu.pyramid(j).keypoints.brisk(pyramidCorners[j], intraPyramidCorners[j], intraPyramidCorners[j+1], 1.5, 0.75, lgM, h);
            if(j+1 < suppressedPyramidCorners.length)
                suppressedIntraPyramidCorners[j+1] = gpu.intraPyramid(j+1).keypoints.brisk(intraPyramidCorners[j+1], pyramidCorners[j], pyramidCorners[j+1], 4.0 / 3.0, 2.0 / 3.0, lgM, h);
            else
                suppressedIntraPyramidCorners[j+1] = gpu.intraPyramid(j+1).keypoints.brisk(intraPyramidCorners[j+1], pyramidCorners[j], intraPyramidCorners[j+1], 4.0 / 3.0, 1.0, lgM, h);
        }

        // merge all keypoints
        for(let j = suppressedPyramidCorners.length - 2; j >= 0; j--)
            suppressedPyramidCorners[j] = gpu.pyramid(j).pyramids.mergeKeypointsAtConsecutiveLevels(suppressedPyramidCorners[j], suppressedPyramidCorners[j+1]);
        for(let j = suppressedIntraPyramidCorners.length - 2; j >= 0; j--)
            suppressedIntraPyramidCorners[j] = gpu.intraPyramid(j).pyramids.mergeKeypointsAtConsecutiveLevels(suppressedIntraPyramidCorners[j], suppressedIntraPyramidCorners[j+1]);
        suppressedIntraPyramidCorners[0] = gpu.intraPyramid(0).pyramids.normalizeKeypoints(suppressedIntraPyramidCorners[0], 1.5);
        suppressedIntraPyramidCorners[0] = gpu.pyramid(0).pyramids.crop(suppressedIntraPyramidCorners[0]);
        const keypoints = gpu.pyramid(0).pyramids.mergeKeypoints(suppressedPyramidCorners[0], suppressedIntraPyramidCorners[0]);

        // create gaussian kernels for different scales and radii
        if(false) {}

        // done!
        return keypoints;
    }

    /**
     * Short distance pairings,
     * for scale = 1.0. Format:
     * [x1,y1,x2,y2, ...]. Thus,
     * 4 elements for each pair
     * @returns {Float32Array<number>} flattened array
     */
    static get shortDistancePairs()
    {
        return shortPairs || (shortPairs = briskShortDistancePairs());
    };

    /**
     * Long distance pairings,
     * for scale = 1.0. Format:
     * [x1,y1,x2,y2, ...]. Thus,
     * 4 elements for each pair
     * @returns {Float32Array<number>} flattened array
     */
    static get longDistancePairs()
    {
        return longPairs || (longPairs = briskLongDistancePairs());
    }
}

/**
 * (Modified) BRISK pattern for 60 points:
 * 5 layers with k_l colliding circles,
 * each at a distance l_l from the origin
 * with radius r_l. For each layer l=0..4,
 * we have k_l = [1,10,14,15,20] circles
 *
 * @param {number} [scale] pattern scale
 *                 (e.g, 1, 0.5, 0.25...)
 * @returns {Array<object>}
 */
function briskPattern(scale = 1.0)
{
    const piOverTwo = Math.PI / 2.0;
    const baseDistance = 4.21; // innermost layer for scale = 1

    const s10 = Math.sin(piOverTwo / 10);
    const s14 = Math.sin(piOverTwo / 14);
    const s15 = Math.sin(piOverTwo / 15);
    const s20 = Math.sin(piOverTwo / 20);

    const l10 = baseDistance * scale;
    const r10 = 2 * l10 * s10;

    const r14 = (2 * (l10 + r10) * s14) / (1 - 2 * s14);
    const l14 = l10 + r10 + r14;

    const r15 = (2 * (l14 + r14) * s15) / (1 - 2 * s15);
    const l15 = l14 + r14 + r15;

    const r20 = (2 * (l15 + r15) * s20) / (1 - 2 * s20);
    const l20 = l15 + r15 + r20;

    const r1 = r10 * 0.8; // guess & plot!
    const l1 = 0.0;

    return [
        { n: 1, r: r1, l: l1 },
        { n: 10, r: r10, l: l10 },
        { n: 14, r: r14, l: l14 },
        { n: 15, r: r15, l: l15 },
        { n: 20, r: r20, l: l20 },
    ];
}

/**
 * BRISK points given a
 * {n, r, l} BRISK layer
 * @param {object} layer
 * @returns {Array<object>}
 */
function briskPoints(layer)
{
    const { n, r, l } = layer;
    const twoPi = 2.0 * Math.PI;

    return [...Array(n).keys()].map(j => ({
        x: l * Math.cos(twoPi * j / n),
        y: l * Math.sin(twoPi * j / n),
        r, l, j, n,
    }));
}

/**
 * BRISK pair of points such that
 * the distance of each is greater
 * than (threshold*scale), or less
 * than (-threshold*scale) if
 * threshold < 0
 * @param {number} threshold
 * @param {number} [scale] pattern scale
 * @returns {Float32Array<number>} format [x1,y1,x2,y2, ...]
 */
function briskPairs(threshold, scale = 1.0)
{
    const flatten = arr => arr.reduce((v, e) => v.concat(e), []);
    const p = flatten(briskPattern(scale).map(briskPoints));
    const n = p.length, t = +threshold * scale;

    const dist2 = (p, q) => (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y);
    const wanted = (t < 0) ? ((p,q) => dist2(p,q) < t*t) : ((p,q) => dist2(p,q) > t*t);
    const pairs = [];

    for(let i = 1; i < n; i++) {
        for(let j = 0; j < i; j++) {
            if(wanted(p[i], p[j])) {
                pairs.push(p[i].x);
                pairs.push(p[i].y);
                pairs.push(p[j].x);
                pairs.push(p[j].y);
            }
        }
    }

    return new Float32Array(pairs);
}

/**
 * BRISK short distance pairs
 * @param {number} threshold pick pairs with distance < threshold*scale
 * @param {number} [scale] pattern scale
 * @returns {Float32Array<number>} format [x1,y1,x2,y2, ...]
 */
function briskShortDistancePairs(threshold = 9.75, scale = 1.0)
{
    return briskPairs(-threshold, scale);
}

/**
 * BRISK long distance pairs
 * @param {number} threshold pick pairs with distance > threshold*scale
 * @param {number} [scale] pattern scale
 * @returns {Float32Array<number>} format [x1,y1,x2,y2, ...]
 */
function briskLongDistancePairs(threshold = 13.67, scale = 1.0)
{
    return briskPairs(threshold, scale);
}

/***/ }),

/***/ "./src/core/algorithms/fast.js":
/*!*************************************!*\
  !*** ./src/core/algorithms/fast.js ***!
  \*************************************/
/*! exports provided: FAST */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FAST", function() { return FAST; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
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
 * fast.js
 * FAST corner detection
 */



/**
 * FAST corner detection
 */
class FAST
{
    /**
     * Run the FAST corner detection algorithm
     * @param {number} n FAST parameter: 9, 7 or 5
     * @param {GPUInstance} gpu
     * @param {Texture} greyscale Greyscale image
     * @param {object} settings
     * @returns {Texture} features in a texture
     */
    static run(n, gpu, greyscale, settings)
    {
        // validate input
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(
            n == 9 || n == 7 || n == 5,
            `Not implemented: FAST-${n}`
        );

        // keypoint detection
        const rawCorners = (({
            5: () => gpu.keypoints.fast5(greyscale, settings.threshold),
            7: () => gpu.keypoints.fast7(greyscale, settings.threshold),
            9: () => gpu.keypoints.fast9(greyscale, settings.threshold),
        })[n])();

        // non-maximum suppression
        const corners = gpu.keypoints.fastSuppression(rawCorners);
        return corners;
    }

    /**
     * Sensitivity to threshold conversion
     * sensitivity in [0,1] -> pixel intensity threshold in [0,1]
     * performs a non-linear conversion (used for FAST)
     * @param {number} sensitivity
     * @returns {number} pixel intensity
     */
    static sensitivity2threshold(sensitivity)
    {
        // the number of keypoints ideally increases linearly
        // as the sensitivity is increased
        sensitivity = Math.max(0, Math.min(sensitivity, 1));
        return 1 - Math.tanh(2.77 * sensitivity);
    }

    /**
     * Normalize a threshold
     * pixel threshold in [0,255] -> normalized threshold in [0,1]
     * @returns {number} clamped & normalized threshold
     */
    static normalizedThreshold(threshold)
    {
        threshold = Math.max(0, Math.min(threshold, 255));
        return threshold / 255;
    }
}

/***/ }),

/***/ "./src/core/feature-detector.js":
/*!**************************************!*\
  !*** ./src/core/feature-detector.js ***!
  \**************************************/
/*! exports provided: FeatureDetector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeatureDetector", function() { return FeatureDetector; });
/* harmony import */ var _algorithms_fast_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./algorithms/fast.js */ "./src/core/algorithms/fast.js");
/* harmony import */ var _algorithms_brisk_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./algorithms/brisk.js */ "./src/core/algorithms/brisk.js");
/* harmony import */ var _utils_tuner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/tuner */ "./src/utils/tuner.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
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
 * feature-detector.js
 * Feature detection facade
 */






/**
 * FeatureDetector encapsulates
 * feature detection algorithms
 */
class FeatureDetector
{
    /**
     * Class constructor
     * @param {GPUInstance} gpu
     */
    constructor(gpu)
    {
        this._gpu = gpu;
        this._lastKeypointCount = 0;
        this._sensitivityTuner = null;
    }

    /**
     * FAST corner detection
     * @param {SpeedyMedia} media The media
     * @param {number} [n] We'll run FAST-n, where n must be 9 (default), 7 or 5
     * @param {object} [settings] Additional settings
     * @returns {Array<SpeedyFeature>} keypoints
     */
    fast(media, n = 9, settings = {})
    {
        const gpu = this._gpu;

        // default settings
        settings = {
            threshold: 10,
            denoise: true,
            ...settings
        };

        // convert the expected number of keypoints,
        // if defined, into a sensitivity value
        if(settings.hasOwnProperty('expected'))
            settings.sensitivity = this._findSensitivity(settings.expected);

        // convert a sensitivity value in [0,1],
        // if it's defined, to a FAST threshold
        if(settings.hasOwnProperty('sensitivity'))
            settings.threshold = _algorithms_fast_js__WEBPACK_IMPORTED_MODULE_0__["FAST"].sensitivity2threshold(settings.sensitivity);
        else
            settings.threshold = _algorithms_fast_js__WEBPACK_IMPORTED_MODULE_0__["FAST"].normalizedThreshold(settings.threshold);

        // pre-processing the image...
        const source = media._gpu.core.upload(media.source);
        const texture = settings.denoise ? gpu.filters.gauss5(source) : source;
        const greyscale = gpu.colors.rgb2grey(texture);

        // extract features
        const keypoints = _algorithms_fast_js__WEBPACK_IMPORTED_MODULE_0__["FAST"].run(n, gpu, greyscale, settings);
        return this._extractKeypoints(keypoints);
    }

    /**
     * BRISK feature point detection
     * @param {SpeedyMedia} media The media
     * @param {object} [settings]
     * @returns {Array<SpeedyFeature>}
     */
    brisk(media, settings = {})
    {
        const gpu = this._gpu;

        // default settings
        settings = {
            threshold: 10,
            denoise: true,
            depth: 4,
            ...settings
        };

        // convert settings.expected to settings.sensitivity
        if(settings.hasOwnProperty('expected'))
            settings.sensitivity = this._findSensitivity(settings.expected);

        // convert settings.sensitivity to settings.threshold
        if(settings.hasOwnProperty('sensitivity'))
            settings.threshold = _algorithms_fast_js__WEBPACK_IMPORTED_MODULE_0__["FAST"].sensitivity2threshold(settings.sensitivity);
        else
            settings.threshold = _algorithms_fast_js__WEBPACK_IMPORTED_MODULE_0__["FAST"].normalizedThreshold(settings.threshold);

        // pre-processing the image...
        const source = media._gpu.core.upload(media.source);
        const texture = settings.denoise ? gpu.filters.gauss5(source) : source;
        const greyscale = gpu.colors.rgb2grey(texture);

        // extract features
        const keypoints = _algorithms_brisk_js__WEBPACK_IMPORTED_MODULE_1__["BRISK"].run(gpu, greyscale, settings);
        return this._extractKeypoints(keypoints);
    }

    // given a corner-encoded texture,
    // return an Array of keypoints
    _extractKeypoints(corners, gpu = this._gpu)
    {
        const encodedKeypoints = gpu.encoders.encodeKeypoints(corners);
        const keypoints = gpu.encoders.decodeKeypoints(encodedKeypoints);
        const slack = this._lastKeypointCount > 0 ? // approximates assuming continuity
            Math.max(1, Math.min(keypoints.length / this._lastKeypointCount), 2) : 1;

        gpu.encoders.optimizeKeypointEncoder(keypoints.length * slack);
        this._lastKeypointCount = keypoints.length;

        return keypoints;
    }

    // find a sensitivity value in [0,1] such that
    // the feature detector returns approximately the
    // number of features you expect - within a
    // tolerance, i.e., a percentage value
    _findSensitivity(param)
    {
        // grab the parameters
        const expected = {
            number: 0, // how many keypoints do you expect?
            tolerance: 0.10, // percentage relative to the expected number of keypoints
            ...(typeof param == 'object' ? param : {
                number: param | 0,
            })
        };

        // spawn the tuner
        this._sensitivityTuner = this._sensitivityTuner ||
            new _utils_tuner__WEBPACK_IMPORTED_MODULE_2__["OnlineErrorTuner"](0, 1200); // use a slightly wider interval for better stability
            //new TestTuner(0, 1000);
        const normalizer = 0.001;

        // update tuner
        this._sensitivityTuner.tolerance = expected.tolerance;
        this._sensitivityTuner.feedObservation(this._lastKeypointCount, expected.number);
        const sensitivity = this._sensitivityTuner.currentValue() * normalizer;

        // return the new sensitivity
        return Math.max(0, Math.min(sensitivity, 1));
    }
}

/***/ }),

/***/ "./src/core/pipeline-operations.js":
/*!*****************************************!*\
  !*** ./src/core/pipeline-operations.js ***!
  \*****************************************/
/*! exports provided: PipelineOperation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PipelineOperation", function() { return PipelineOperation; });
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _gpu_gl_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../gpu/gl-utils */ "./src/gpu/gl-utils.js");
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
 * pipeline-operations.js
 * A pipeline operation is an element of a SpeedyPipeline
 */





const PipelineOperation = { };

/**
 * Abstract basic operation
 */
/* abstract */ class SpeedyPipelineOperation
{
    /**
     * Runs the pipeline operation
     * @param {Texture} texture
     * @param {GPUInstance} gpu
     * @param {SpeedyMedia} [media]
     * @returns {Texture}
     */
    run(texture, gpu, media)
    {
        return texture;
    }

    /**
     * Perform any necessary cleanup
     */
    release()
    {
    }
}


// =====================================================
//               COLOR CONVERSIONS
// =====================================================

/**
 * Convert to greyscale
 */
PipelineOperation.ConvertToGreyscale = class extends SpeedyPipelineOperation
{
    run(texture, gpu, media)
    {
        if(media._colorFormat == _utils_types__WEBPACK_IMPORTED_MODULE_0__["ColorFormat"].RGB)
            texture = gpu.colors.rgb2grey(texture);
        else if(media._colorFormat != _utils_types__WEBPACK_IMPORTED_MODULE_0__["ColorFormat"].Greyscale)
            _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].fatal(`Can't convert image to greyscale: unknown color format`);

        media._colorFormat = _utils_types__WEBPACK_IMPORTED_MODULE_0__["ColorFormat"].Greyscale;
        return texture;
    }
}



// =====================================================
//               IMAGE FILTERS
// =====================================================

/**
 * Blur image
 */
PipelineOperation.Blur = class extends SpeedyPipelineOperation
{
    /**
     * Blur operation
     * @param {object} [options]
     */
    constructor(options = {})
    {
        const { filter, size } = (options = {
            filter: 'gaussian',     // "gassuian" | "box"
            size: 5,                // 3 | 5 | 7
            ...options
        });
        super();

        // validate kernel size
        if(size != 3 && size != 5 && size != 7)
            _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].fatal(`Invalid kernel size: ${size}`);

        // select the appropriate filter
        if(filter == 'gaussian')
            this._filter = 'gauss' + size;
        else if(filter == 'box')
            this._filter = 'box' + size;
        else
            _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].fatal(`Invalid filter: "${filter}"`);
    }

    run(texture, gpu, media)
    {
        return gpu.filters[this._filter](texture);
    }
}

/**
 * Image convolution
 */
PipelineOperation.Convolve = class extends SpeedyPipelineOperation
{
    /**
     * Perform a convolution
     * Must provide a SQUARE kernel with size: 3x3, 5x5 or 7x7
     * @param {Array<number>} kernel convolution kernel
     * @param {number} [divisor] divide all kernel entries by this number
     */
    constructor(kernel, divisor = 1.0)
    {
        let kern = new Float32Array(kernel).map(x => x / divisor);
        const len = kern.length;
        const size = Math.sqrt(len) | 0;
        const method = ({
            3: ['createKernel3x3', 'texConv2D3'],
            5: ['createKernel5x5', 'texConv2D5'],
            7: ['createKernel7x7', 'texConv2D7'],
        })[size] || null;
        super();

        // validate kernel
        if(len == 1)
            _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].fatal(`Cannot convolve with a kernel containing a single element`);
        else if(size * size != len || !method)
            _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].fatal(`Cannot convolve with a non-square kernel of ${len} elements`);

        // normalize kernel entries to [0,1]
        const min = Math.min(...kern), max = Math.max(...kern);
        const offset = min;
        const scale = Math.abs(max - min) > 1e-5 ? max - min : 1;
        kern = kern.map(x => (x - offset) / scale);

        // store the normalized kernel
        this._method = method;
        this._scale = scale;
        this._offset = offset;
        this._kernel = kern;
        this._kernelSize = size;
        this._texKernel = null;
        this._gl = null;
    }

    run(texture, gpu, media)
    {
        // instantiate the texture kernel
        if(this._texKernel == null) {
            this._texKernel = gpu.filters[this._method[0]](this._kernel);
            this._gl = gpu.core.gl;
        }

        // convolve
        return gpu.filters[this._method[1]](
            texture,
            this._texKernel,
            this._scale,
            this._offset
        );
    }

    release()
    {
        if(this._texKernel != null) {
            _gpu_gl_utils__WEBPACK_IMPORTED_MODULE_2__["GLUtils"].destroyTexture(this._gl, this._texKernel);
            this._texKernel = this._gl = null;
        }
        super.release();
    }
}

/***/ }),

/***/ "./src/core/speedy-feature.js":
/*!************************************!*\
  !*** ./src/core/speedy-feature.js ***!
  \************************************/
/*! exports provided: SpeedyFeature */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyFeature", function() { return SpeedyFeature; });
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
 * speedy-feature.js
 * SpeedyFeature implementation
 */

/**
 * A SpeedyFeature is a keypoint in an image,
 * with optional scale, rotation and descriptor
 */
class SpeedyFeature
{
    /**
     * Creates a new SpeedyFeature
     * @param {number} x X position
     * @param {number} y Y position
     * @param {number} [scale] Scale
     * @param {number} [rotation] Rotation in radians
     * @param {FeatureDescriptor} [descriptor] Feature descriptor
     */
    constructor(x, y, scale = 1.0, rotation = 0.0, descriptor = null)
    {
        this._x = +x;
        this._y = +y;
        this._scale = +scale;
        this._rotation = +rotation;
        this._descriptor = descriptor;
    }

    /**
     * Converts a SpeedyFeature to a representative string
     * @returns {string}
     */
    toString()
    {
        return `(${this._x},${this._y})`;
    }

    /**
     * The X position of the feature point
     * @returns {number} X position
     */
    get x()
    {
        return this._x;
    }

    /**
     * The y position of the feature point
     * @returns {number} Y position
     */
    get y()
    {
        return this._y;
    }

    /**
     * The scale of the feature point
     * @returns {number} Scale
     */
    get scale()
    {
        return this._scale;
    }

    /**
     * The rotation of the feature point, in radians
     * @returns {number} Angle in radians
     */
    get rotation()
    {
        return this._rotation;
    }

    /**
     * The descriptor of the feature point, or null
     * if there isn't any
     * @return {FeatureDescriptor|null} feature descriptor
     */
    get descriptor()
    {
        return this._descriptor;
    }
}

/***/ }),

/***/ "./src/core/speedy-media.js":
/*!**********************************!*\
  !*** ./src/core/speedy-media.js ***!
  \**********************************/
/*! exports provided: SpeedyMedia */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMedia", function() { return SpeedyMedia; });
/* harmony import */ var _gpu_gpu_instance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../gpu/gpu-instance */ "./src/gpu/gpu-instance.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/types */ "./src/utils/types.js");
/* harmony import */ var _feature_detector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./feature-detector */ "./src/core/feature-detector.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
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
 * speedy-media.js
 * SpeedyMedia implementation
 */







/**
 * SpeedyMedia encapsulates a media element
 * (e.g., image, video, canvas)
 */
class SpeedyMedia
{
    /**
     * Class constructor
     * It assumes A VALID (!) media source that is already loaded
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|Texture} mediaSource An image, video or canvas
     * @param {number} width media width
     * @param {number} height media height
     */
    /* private */ constructor(mediaSource, width, height)
    {
        if(arguments.length > 1) {
            // store data
            this._source = mediaSource;
            this._width = width | 0;
            this._height = height | 0;
            this._type = getMediaType(this._source);
            this._colorFormat = _utils_types__WEBPACK_IMPORTED_MODULE_1__["ColorFormat"].RGB;

            // spawn relevant components
            this._gpu = new _gpu_gpu_instance__WEBPACK_IMPORTED_MODULE_0__["GPUInstance"](this._width, this._height);
            this._featureDetector = null; // lazy instantiation 
        }
        else if(arguments.length == 1) {
            // copy constructor (shallow copy)
            const media = arguments[0];

            this._source = media._source;
            this._width = media._width;
            this._height = media._height;
            this._type = media._type;
            this._colorFormat = media._colorFormat;

            this._gpu = media._gpu;
            this._featureDetector = media._featureDetector;
        }
        else
            _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].fatal(`Invalid instantiation of SpeedyMedia`);
    }

    /**
     * Load a media source
     * Will wait until the HTML media source is loaded
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} mediaSource An image, video or canvas
     * @returns {Promise<SpeedyMedia>}
     */
    static load(mediaSource)
    {
        return new Promise((resolve, reject) => {
            const dimensions = getMediaDimensions(mediaSource);
            if(dimensions != null) {
                // try to load the media until it's ready
                (function loadMedia(dimensions, k = 500) {
                    if(dimensions.width > 0 && dimensions.height > 0) {
                        const media = new SpeedyMedia(mediaSource, dimensions.width, dimensions.height);
                        _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].log(`Loaded SpeedyMedia with a ${mediaSource}.`);
                        resolve(media);
                    }
                    else if(k > 0)
                        setTimeout(() => loadMedia(getMediaDimensions(mediaSource), k-1), 10);
                    else
                        reject(new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["SpeedyError"](`Can't load SpeedyMedia with a ${mediaSource}: timeout.`));
                })(dimensions);
            }
            else {
                // invalid media source
                reject(new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["SpeedyError"](`Can't load SpeedyMedia with a ${mediaSource}: invalid media source.`));
            }
        });
    }

    /**
     * Loads a camera stream
     * @param {number} [width] width of the stream
     * @param {number} [height] height of the stream
     * @param {object} [options] additional options to pass to getUserMedia()
     * @returns {Promise<SpeedyMedia>}
     */
    static loadCameraStream(width = 426, height = 240, options = {})
    {
        return requestCameraStream(width, height, options).then(
            video => SpeedyMedia.load(createCanvasFromVideo(video))
        );
    }

    /**
     * The media element (image, video, canvas) encapsulated by this SpeedyMedia object
     * @returns {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} the media element
     */
    get source()
    {
        return this._source;
    }

    /**
     * Gets the width of the media
     * @returns {number} media width
     */
    get width()
    {
        return this._width;
    }

    /**
     * Gets the height of the media
     * @returns {number} media height
     */
    get height()
    {
        return this._height;
    }

    /**
     * The type of the media attached to this SpeedyMedia object
     * @returns {string} "image" | "video" | "canvas" | "internal"
     */
    get type()
    {
        switch(this._type) {
            case _utils_types__WEBPACK_IMPORTED_MODULE_1__["MediaType"].Image:
                return 'image';

            case _utils_types__WEBPACK_IMPORTED_MODULE_1__["MediaType"].Video:
                return 'video';

            case _utils_types__WEBPACK_IMPORTED_MODULE_1__["MediaType"].Canvas:
                return 'canvas';

            case _utils_types__WEBPACK_IMPORTED_MODULE_1__["MediaType"].Texture: // the result of pipelining
                return 'internal';

            default: // this shouldn't happen
                return 'unknown';
        }
    }

    /**
     * Clones the SpeedyMedia object
     * @param {object} options options object
     * @returns {SpeedyMedia} a clone object
     */
    clone(options = {})
    {
        // Default settings
        options = {
            lightweight: false,
            ...(options)
        };

        if(options.lightweight) {
            // shallow copy
            return new SpeedyMedia(this);
        }
        else {
            // deep copy
            return new SpeedyMedia(
                this._source,
                this._width,
                this._height
            );
        }
    }

    /**
     * Runs a pipeline
     * @param {SpeedyPipeline} pipeline
     * @returns {Promise<SpeedyMedia>} a promise that resolves to A CLONE of this SpeedyMedia
     */
    run(pipeline)
    {
        const media = this.clone({ lightweight: true });
        media._type = _utils_types__WEBPACK_IMPORTED_MODULE_1__["MediaType"].Texture;
        return pipeline._run(media);
    }

    /**
     * Draws the media to a canvas
     * @param {HTMLCanvasElement} canvas canvas element
     * @param {number} [x] x-position
     * @param {number} [y] y-position
     * @param {number} [width] desired width
     * @param {number} [height] desired height
     */
    draw(canvas, x = 0, y = 0, width = this.width, height = this.height)
    {
        const ctx = canvas.getContext('2d');

        x = +x; y = +y;
        width = Math.max(width, 0);
        height = Math.max(height, 0);

        switch(this._type) {
            case _utils_types__WEBPACK_IMPORTED_MODULE_1__["MediaType"].Image:
            case _utils_types__WEBPACK_IMPORTED_MODULE_1__["MediaType"].Video:
            case _utils_types__WEBPACK_IMPORTED_MODULE_1__["MediaType"].Canvas:
                ctx.drawImage(this._source, x, y, width, height);
                break;

            case _utils_types__WEBPACK_IMPORTED_MODULE_1__["MediaType"].Texture:
                ctx.drawImage(this._gpu.canvas, x, y, width, height);
                break;
        }
    }

    /**
     * Finds image features
     * @param {object} [settings] Configuration object
     * @returns {Promise< Array<SpeedyFeature> >} A Promise returning an Array of SpeedyFeature objects
     */
    findFeatures(settings = {})
    {
        // Default settings
        settings = Object.assign({
            method: 'fast',
        }, settings);

        // Lazy instantiation
        this._featureDetector = this._featureDetector || new _feature_detector__WEBPACK_IMPORTED_MODULE_2__["FeatureDetector"](this._gpu);

        // Algorithm table
        const fn = ({
            'fast' : (media, settings) => this._featureDetector.fast(media, 9, settings),   // alias for fast9
            'fast9': (media, settings) => this._featureDetector.fast(media, 9, settings),   // FAST-9,16 (default)
            'fast7': (media, settings) => this._featureDetector.fast(media, 7, settings),   // FAST-7,12
            'fast5': (media, settings) => this._featureDetector.fast(media, 5, settings),   // FAST-5,8
            'brisk': (media, settings) => this._featureDetector.brisk(media, settings),     // BRISK
        });

        // Run the algorithm
        return new Promise((resolve, reject) => {
            const method = String(settings.method).toLowerCase();

            if(fn.hasOwnProperty(method)) {
                const features = (fn[method])(this, settings);
                resolve(features);
            }
            else
                reject(new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["SpeedyError"](`Invalid method "${method}" for keypoint detection.`));
        });
    }
}

// get the { width, height } of a certain HTML element (image, video, canvas...)
function getMediaDimensions(mediaSource)
{
    if(mediaSource && mediaSource.constructor && mediaSource.constructor.name) {
        const element = mediaSource.constructor.name, key = {
            HTMLImageElement: { width: 'naturalWidth', height: 'naturalHeight' },
            HTMLVideoElement: { width: 'videoWidth', height: 'videoHeight' },
            HTMLCanvasElement: { width: 'width', height: 'height' },
        };

        if(key.hasOwnProperty(element)) {
            return {
                width: mediaSource[key[element].width],
                height: mediaSource[key[element].height]
            };
        }
    }

    return null;
}

// get a string corresponding to the media type (image, video, canvas)
function getMediaType(mediaSource)
{
    if(mediaSource && mediaSource.constructor) {
        switch(mediaSource.constructor.name) {
            case 'HTMLImageElement':
                return _utils_types__WEBPACK_IMPORTED_MODULE_1__["MediaType"].Image;

            case 'HTMLVideoElement':
                return _utils_types__WEBPACK_IMPORTED_MODULE_1__["MediaType"].Video;

            case 'HTMLCanvasElement':
                return _utils_types__WEBPACK_IMPORTED_MODULE_1__["MediaType"].Canvas;

            default:
                return _utils_types__WEBPACK_IMPORTED_MODULE_1__["MediaType"].Texture;
        }
    }

    _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].fatal(`Can't get media type: invalid media source. ${mediaSource}`);
    return null;
}

// webcam access
function requestCameraStream(width, height, options = {})
{
    return new Promise((resolve, reject) => {
        _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].log('Accessing the webcam...');

        if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
            return reject(new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["SpeedyError"]('Unsupported browser: no mediaDevices.getUserMedia()'));

        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: { ideal: width },
                height: { ideal: height },
                aspectRatio: { ideal: width / height },
                facingMode: 'environment',
            },
            ...(options)
        })
        .then(stream => {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.onloadedmetadata = e => {
                video.play();
                _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].log('The camera device is turned on!');
                resolve(video, stream);
            };
        })
        .catch(err => {
            reject(new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["SpeedyError"](
                `Please give access to the camera and reload the page.\n` +
                `${err.name}. ${err.message}.`
            ));
        });
    });
}

// create a HTMLCanvasElement using a HTMLVideoElement
function createCanvasFromVideo(video)
{
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    function render() {
        ctx.drawImage(video, 0, 0);
        requestAnimationFrame(render);
    }
    render();

    return canvas;
}

/***/ }),

/***/ "./src/core/speedy-pipeline.js":
/*!*************************************!*\
  !*** ./src/core/speedy-pipeline.js ***!
  \*************************************/
/*! exports provided: SpeedyPipeline */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipeline", function() { return SpeedyPipeline; });
/* harmony import */ var _pipeline_operations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pipeline-operations */ "./src/core/pipeline-operations.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
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
 * speedy-pipeline.js
 * A pipeline is a sequence of operations that transform the image in some way
 */






/**
 * A SpeedyPipeline holds a sequence of operations that
 * graphically transform the incoming media in some way
 * 
 * SpeedyPipeline's methods are chainable: use them to
 * create your own sequence of image operations
 */
class SpeedyPipeline
{
    /* friend class SpeedyMedia */

    /**
     * Class constructor
     */
    constructor()
    {
        this._operations = [];
    }

    /**
     * The number of the operations of the pipeline
     * @returns {number}
     */
    get length()
    {
        return this._operations.length;
    }

    /**
     * Cleanup pipeline memory
     * @returns {Promise<SpeedyPipeline>} resolves as soon as the memory is released
     */
    release()
    {
        return new Promise((resolve, reject) => {
            for(let i = this._operations.length - 1; i >= 0; i--)
                this._operations[i].release();
            this._operations.length = 0;
            resolve(this);
        });
    }

    /**
     * Adds a new operation to the end of the pipeline
     * @param {SpeedyPipelineOperation} operation
     * @returns {SpeedyPipeline} the pipeline itself
     */
    _spawn(operation)
    {
        this._operations.push(operation);
        return this;
    }

    /**
     * Runs the pipeline on a target media (it will be modified!)
     * @param {SpeedyMedia} media media to be modified
     * @returns {Promise<SpeedyMedia>} a promise that resolves to the provided media
     */
    _run(media)
    {
        return new Promise((resolve, reject) => {
            if(media._type == _utils_types__WEBPACK_IMPORTED_MODULE_1__["MediaType"].Texture) {
                // upload the media to the GPU
                let texture = media._gpu.core.upload(media._source);

                // run the pipeline
                for(let i = 0; i < this._operations.length; i++)
                    texture = this._operations[i].run(texture, media._gpu, media);

                // end of the pipeline
                media._gpu.utils.output(texture);
                media._source = media._gpu.canvas;

                // done!
                resolve(media);
            }
            else
                reject(new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["SpeedyError"](`Can't run a pipeline on a media that is not a texture`));
        });
    }


    // =====================================================
    //                    GENERIC
    // =====================================================

    /**
     * Concatenates another pipeline into this one
     * @param {SpeedyPipeline} pipeline
     * @returns {SpeedyPipeline}
     */
    concat(pipeline)
    {
        if(pipeline instanceof SpeedyPipeline) {
            this._operations = this._operations.concat(pipeline._operations);
            return this;
        }

        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].fatal(`Invalid argument "${pipeline}" given to SpeedyPipeline.concatenate()`);
        return this;
    }


    // =====================================================
    //               COLOR CONVERSIONS
    // =====================================================

    /**
     * Convert to a color space
     * @param {string} [colorSpace] 'greyscale' | 'grayscale'
     * @returns {SpeedyPipeline}
     */
    convertTo(colorSpace = null)
    {
        if(colorSpace == 'greyscale' || colorSpace == 'grayscale') {
            return this._spawn(
                new _pipeline_operations__WEBPACK_IMPORTED_MODULE_0__["PipelineOperation"].ConvertToGreyscale()
            );
        }

        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].fatal(`Can't convert to unknown color space: "${colorSpace}"`);
        return this;
    }



    // =====================================================
    //               IMAGE FILTERING
    // =====================================================

    /**
     * Image smoothing
     * @param {object} [options]
     * @returns {SpeedyPipeline}
     */
    blur(options = {})
    {
        return this._spawn(
            new _pipeline_operations__WEBPACK_IMPORTED_MODULE_0__["PipelineOperation"].Blur(options)
        );
    }

    /**
     * Image convolution
     * @param {Array<number>} kernel
     * @param {number} [divisor]
     * @returns {SpeedyPipeline}
     */
    convolve(kernel, divisor = 1.0)
    {
        return this._spawn(
            new _pipeline_operations__WEBPACK_IMPORTED_MODULE_0__["PipelineOperation"].Convolve(kernel, divisor)
        );
    }
}

/***/ }),

/***/ "./src/gpu/gl-utils.js":
/*!*****************************!*\
  !*** ./src/gpu/gl-utils.js ***!
  \*****************************/
/*! exports provided: GLError, GLUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GLError", function() { return GLError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GLUtils", function() { return GLUtils; });
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
 * gl-utils.js
 * WebGL utilities
 */

/**
 * WebGL-related error
 */
class GLError extends Error
{
    /**
     * Class constructor
     * @param {string} message 
     */
    constructor(message)
    {
        super(`[GLError] ${message}`);
        this.name = this.constructor.name;
    }
}

/**
 * WebGL Utilities
 */
class GLUtils
{
    /**
     * Create a new GLError object
     * @param {string} message 
     */
    static Error(message)
    {
        return new GLError(message);
    }

    /**
     * Create a shader
     * @param {WebGL2RenderingContext} gl
     * @param {number} type
     * @param {string} source
     * @returns {WebGLShader}
     */
    static createShader(gl, type, source)
    {
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        return shader;
    }

    /**
     * Create a vertex-shader + fragment-shader program
     * @param {WebGL2RenderingContext} gl
     * @param {string} vertexShaderSource
     * @param {string} fragmentShaderSource
     * @returns {WebGLProgram}
     */
    static createProgram(gl, vertexShaderSource, fragmentShaderSource)
    {
        const program = gl.createProgram();
        const vertexShader = GLUtils.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = GLUtils.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        // error?
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const errors = [
                gl.getShaderInfoLog(fragmentShader),
                gl.getShaderInfoLog(vertexShader),
                gl.getProgramInfoLog(program),
            ];

            const spaces = i => Math.max(0, 2 - Math.floor(Math.log10(i)));
            const col = k => Array(spaces(k)).fill(' ').join('') + k + '. ';
            const formattedSource = fragmentShaderSource.split('\n')
                .map((line, no) => col(1+no) + line)
                .join('\n');

            gl.deleteProgram(program);
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);

            throw GLUtils.Error(
                `Can't create shader program.\n\n` +
                `---------- ERROR ----------\n` +
                errors.join('\n') + '\n\n' +
                `---------- SOURCE CODE ----------\n` +
                formattedSource
            );
        }

        return program;
    }

    /**
     * Create a WebGL texture
     * @param {WebGL2RenderingContext} gl 
     * @param {number} width in pixels
     * @param {number} height in pixels
     * @param {number} format 
     * @returns {WebGLTexture}
     */
    static createTexture(gl, width, height, format = null)
    {
        const texture = gl.createTexture();

        // use default format
        if(format === null)
            format = gl.RGBA8;
        
        // setup texture
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.texStorage2D(gl.TEXTURE_2D, 1, format, width, height);

        // unbind & return
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    /**
     * Destroys a WebGL texture
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLTexture} texture 
     * @returns {null}
     */
    static destroyTexture(gl, texture)
    {
        gl.deleteTexture(texture);
        return null;
    }

    /**
     * Upload pixel data to a WebGL texture
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLTexture} texture 
     * @param {ImageBitmap|ImageData|ArrayBufferView|HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} pixels 
     * @returns {WebGLTexture} texture
     */
    static uploadToTexture(gl, texture, pixels)
    {
        // Prefer calling uploadToTexture() before gl.useProgram() to avoid the
        // needless switching of GL programs internally. See also:
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texSubImage2D(gl.TEXTURE_2D,     // target
                         0,                 // mip level
                         0,                 // x-offset
                         0,                 // y-offset
                         gl.RGBA,           // source format
                         gl.UNSIGNED_BYTE,  // source type
                         pixels);           // source data

        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    // bind the textures and assign their numbers
    // textureMap: { 'textureName': <texture> , ... }
    // locationMap: { 'textureName': <uniformLocation> , ... }
    static bindTextures(gl, textureMap, locationMap)
    {
        const names = Object.keys(textureMap);

        if(names.length > gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
            throw GLUtils.Error(`Can't bind ${names.length} textures to a program: max is ${gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS}`);

        for(let i = 0; i < names.length; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, textureMap[names[i]]);
            gl.uniform1i(locationMap[names[i]], i);
        }
    }

    /**
     * Creates a framebuffer object (FBO) associated with an existing texture
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLTexture} texture 
     * @returns {WebGLFramebuffer}
     */
    static createFramebuffer(gl, texture)
    {
        const fbo = gl.createFramebuffer();

        // setup framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER,         // target
                                gl.COLOR_ATTACHMENT0,   // color buffer
                                gl.TEXTURE_2D,          // tex target
                                texture,                // texture
                                0);                     // mipmap level

        // check for errors
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if(status != gl.FRAMEBUFFER_COMPLETE) {
            const error = (() => (([
                'FRAMEBUFFER_UNSUPPORTED',
                'FRAMEBUFFER_INCOMPLETE_ATTACHMENT',
                'FRAMEBUFFER_INCOMPLETE_DIMENSIONS',
                'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT',
                'FRAMEBUFFER_INCOMPLETE_MULTISAMPLE'
            ].filter(err => gl[err] === status))[0] || 'unknown error'))();
            throw GLUtils.Error(`Can't create framebuffer: ${error} (${status})`);
        }

        // unbind & return
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return fbo;
    }

    /**
     * Destroys a framebuffer object (FBO)
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLFramebuffer} fbo 
     * @returns {null}
     */
    static destroyFramebuffer(gl, fbo)
    {
        gl.deleteFramebuffer(fbo);
        return null;
    }
}

/***/ }),

/***/ "./src/gpu/gpu-instance.js":
/*!*********************************!*\
  !*** ./src/gpu/gpu-instance.js ***!
  \*********************************/
/*! exports provided: GPUInstance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GPUInstance", function() { return GPUInstance; });
/* harmony import */ var _speedy_gpu_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-gpu-core */ "./src/gpu/speedy-gpu-core.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _kernels_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./kernels/utils */ "./src/gpu/kernels/utils.js");
/* harmony import */ var _kernels_colors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./kernels/colors */ "./src/gpu/kernels/colors.js");
/* harmony import */ var _kernels_filters__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./kernels/filters */ "./src/gpu/kernels/filters.js");
/* harmony import */ var _kernels_keypoints__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./kernels/keypoints */ "./src/gpu/kernels/keypoints.js");
/* harmony import */ var _kernels_encoders__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./kernels/encoders */ "./src/gpu/kernels/encoders.js");
/* harmony import */ var _kernels_pyramids__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./kernels/pyramids */ "./src/gpu/kernels/pyramids.js");
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
 * gpu-instance.js
 * The set of all GPU kernel groups for accelerated computer vision
 */










// Limits
const MAX_TEXTURE_LENGTH = 65534; // 2^n - 2 due to encoding
const MAX_PYRAMID_LEVELS = 4;

// Available kernel groups
// (maps group name to class name)
const KERNEL_GROUPS = {
    'utils': _kernels_utils__WEBPACK_IMPORTED_MODULE_2__["GPUUtils"],
    'colors': _kernels_colors__WEBPACK_IMPORTED_MODULE_3__["GPUColors"],
    'filters': _kernels_filters__WEBPACK_IMPORTED_MODULE_4__["GPUFilters"],
    'keypoints': _kernels_keypoints__WEBPACK_IMPORTED_MODULE_5__["GPUKeypoints"],
    'encoders': _kernels_encoders__WEBPACK_IMPORTED_MODULE_6__["GPUEncoders"],
    'pyramids': _kernels_pyramids__WEBPACK_IMPORTED_MODULE_7__["GPUPyramids"],
};

/**
 * The set of all GPU kernel groups for
 * accelerated computer vision
 */
class GPUInstance
{
    /**
     * Class constructor
     * @param {number} width Texture width
     * @param {number} height Texture height
     */
    constructor(width, height)
    {
        // read & validate texture size
        this._width = Math.max(1, width | 0);
        this._height = Math.max(1, height | 0);
        if(this._width > MAX_TEXTURE_LENGTH || this._height > MAX_TEXTURE_LENGTH) {
            _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].warning(`Maximum texture size exceeded (using ${this._width} x ${this._height}).`);
            this._width = Math.min(this._width, MAX_TEXTURE_LENGTH);
            this._height = Math.min(this._height, MAX_TEXTURE_LENGTH);
        }

        // initialize the GPU core
        this._core = this._spawnGPUCore(this._width, this._height);
    }

    /**
     * Texture width
     * @returns {number}
     */
    get width()
    {
        return this._width;
    }

    /**
     * Texture height
     * @returns {number}
     */
    get height()
    {
        return this._height;
    }

    /**
     * GPU core
     * @returns {SpeedyGPUCore}
     */
    get core()
    {
        return this._core;
    }

    /**
     * Access the kernel groups of a pyramid level
     * sizeof(pyramid(i)) = sizeof(pyramid(0)) / 2^i
     * @param {number} level a number in 0, 1, ..., MAX_PYRAMID_LEVELS - 1
     * @returns {Array}
     */
    pyramid(level)
    {
        const lv = level | 0;

        if(lv < 0 || lv >= MAX_PYRAMID_LEVELS)
            _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].fatal(`Invalid pyramid level: ${lv}`);

        return this._pyramid[lv];
    }

    /**
     * Access the kernel groups of an intra-pyramid level
     * The intra-pyramid encodes layers between pyramid layers
     * sizeof(intraPyramid(0)) = 1.5 * sizeof(pyramid(0))
     * sizeof(intraPyramid(1)) = 1.5 * sizeof(pyramid(1))
     * @param {number} level a number in 0, 1, ..., MAX_PYRAMID_LEVELS
     * @returns {Array}
     */
    intraPyramid(level)
    {
        const lv = level | 0;

        if(lv < 0 || lv >= MAX_PYRAMID_LEVELS + 1)
            _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].fatal(`Invalid intra-pyramid level: ${lv}`);

        return this._intraPyramid[lv];
    }

    /**
     * The number of layers of the pyramid
     * @returns {number}
     */
    get pyramidHeight()
    {
        return MAX_PYRAMID_LEVELS;
    }

    /**
     * The maximum supported scale for a pyramid layer
     * @returns {number}
     */
    get pyramidMaxScale()
    {
        // This is preferably a power of 2
        return 2;
    }

    /**
     * Internal canvas
     * @returns {HTMLCanvasElement}
     */
    get canvas()
    {
        return this._core.canvas;
    }

    // spawns a SpeedyGPUCore instance
    _spawnGPUCore(width, height)
    {
        // create GPU
        const gpu = new _speedy_gpu_core__WEBPACK_IMPORTED_MODULE_0__["SpeedyGPUCore"](width, height);

        // spawn kernel groups
        spawnKernelGroups.call(this, this, width, height);

        // spawn pyramids of kernel groups
        this._pyramid = this._buildPyramid(gpu, width, height, 1.0, MAX_PYRAMID_LEVELS);
        this._intraPyramid = this._buildPyramid(gpu, width, height, 1.5, MAX_PYRAMID_LEVELS + 1);

        // done!
        return gpu;
    }

    // build a pyramid, where each level stores the kernel groups
    _buildPyramid(gpu, imageWidth, imageHeight, baseScale, numLevels)
    {
        let scale = +baseScale;
        let width = (imageWidth * scale) | 0, height = (imageHeight * scale) | 0;
        let pyramid = new Array(numLevels);

        for(let i = 0; i < pyramid.length; i++) {
            pyramid[i] = { width, height, scale };
            spawnKernelGroups.call(pyramid[i], this, width, height);
            width = ((1 + width) / 2) | 0;
            height = ((1 + height) / 2) | 0;
            scale /= 2;
        }

        return pyramid;
    }
}

// Spawn kernel groups
function spawnKernelGroups(gpu, width, height)
{
    // all kernel groups are available via getters
    for(let g in KERNEL_GROUPS) {
        Object.defineProperty(this, g, {
            get: (() => {
                const grp = '_' + g;
                return (function() { // lazy instantiation
                    return this[grp] || (this[grp] = new (KERNEL_GROUPS[g])(gpu, width, height));
                }).bind(this);
            })(),
            configurable: true // WebGL context may be lost
        });
    }
}


/***/ }),

/***/ "./src/gpu/gpu-kernel-group.js":
/*!*************************************!*\
  !*** ./src/gpu/gpu-kernel-group.js ***!
  \*************************************/
/*! exports provided: GPUKernelGroup */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GPUKernelGroup", function() { return GPUKernelGroup; });
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
 * gpu-kernel-group.js
 * An abstract group of GPU kernels
 */

/**
 * GPUKernelGroup
 * A semantically correlated group
 * of kernels that run on the GPU
 */

class GPUKernelGroup
{
    /**
     * Class constructor
     * @param {GPUInstance} gpu
     * @param {number} width Texture width (depends on the pyramid layer)
     * @param {number} height Texture height (depends on the pyramid layer)
     */
    /* protected */ constructor(gpu, width, height)
    {
        this._gpu = gpu;
        this._width = width;
        this._height = height;
    }

    /**
     * Declare a kernel
     * @param {string} name Kernel name
     * @param {Function} fn Kernel code
     * @param {object} settings Kernel settings
     * @returns {GPUKernelGroup} This object
     */
    /* protected */ declare(name, fn, settings = { })
    {
        // lazy instantiation of kernels
        Object.defineProperty(this, name, {
            get: (() => {
                const key = '__k_' + name;
                return (function() {
                    return this[key] || (this[key] = this._spawnKernel(fn, settings));
                }).bind(this);
            })()
        });

        return this;
    }

    /**
     * Multi-pass composition
     * @param {string} name Kernel name
     * @param {string} fn Other kernels
     * @returns {GPUKernelGroup} This object
     */
    /* protected */ compose(name, ...fn)
    {
        // function composition: functions are called in the order they are specified
        // e.g., compose('h', 'f', 'g') means h(x) = g(f(x))
        Object.defineProperty(this, name, {
            get: (() => {
                const key = '__c_' + name;
                return (function() {
                    return this[key] || (this[key] = (fn.length == 2) ? (() => {
                        fn = fn.map(fi => this[fi]);
                        return function compose(image, ...args) {
                            return (fn[1])((fn[0])(image, ...args), ...args);
                        };
                    })() : ((fn.length == 3) ? (() => {
                        fn = fn.map(fi => this[fi]);
                        return function compose(image, ...args) {
                            return (fn[2])((fn[1])((fn[0])(image, ...args), ...args), ...args);
                        };
                    })() : ((fn.length == 4) ? (() => {
                        fn = fn.map(fi => this[fi]);
                        return function compose(image, ...args) {
                            return (fn[3])((fn[2])((fn[1])((fn[0])(image, ...args), ...args), ...args), ...args);
                        };
                    })() : (() => {
                        fn = fn.map(fi => this[fi]);
                        return function compose(image, ...args) {
                            return fn.reduce((img, fi) => fi(img, ...args), image);
                        };
                    })())));
                }).bind(this);
            })()
        });

        return this;
    }

    /**
     * Neat helpers to be used
     * when defining operations
     */
    get operation()
    {
        return this._helpers || (this.helpers = {

            // Set texture input/output size
            // Dimensions are converted to integers
            hasTextureSize(width, height) {
                return {
                    output: [ width|0, height|0 ]
                };
            },

            // Render to canvas
            // Use it when we're supposed to see the texture
            displaysGraphics() {
                return {
                    renderToTexture: false
                };
            },

            // Use this when we want to keep the kernel
            // texture (they are recycled by default)
            doesNotRecycleTextures() {
                return {
                    recycleTexture: false
                };
            },

        });
    }

    /* private */ _spawnKernel(fn, settings = { })
    {
        return this._gpu.core.createProgram(fn, {
            // default settings
            output: [ this._width, this._height ],
            ...settings
        });
    }
}

/***/ }),

/***/ "./src/gpu/kernels/colors.js":
/*!***********************************!*\
  !*** ./src/gpu/kernels/colors.js ***!
  \***********************************/
/*! exports provided: GPUColors */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GPUColors", function() { return GPUColors; });
/* harmony import */ var _gpu_kernel_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../gpu-kernel-group */ "./src/gpu/gpu-kernel-group.js");
/* harmony import */ var _shaders_colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shaders/colors */ "./src/gpu/kernels/shaders/colors.js");
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
 * gpu-colors.js
 * Color conversion algorithms
 */




/**
 * GPUColors
 * Color conversions
 */
class GPUColors extends _gpu_kernel_group__WEBPACK_IMPORTED_MODULE_0__["GPUKernelGroup"]
{
    /**
     * Class constructor
     * @param {GPUInstance} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            // convert to greyscale
            .declare('rgb2grey', _shaders_colors__WEBPACK_IMPORTED_MODULE_1__["rgb2grey"])
        ;
    }
}

/***/ }),

/***/ "./src/gpu/kernels/encoders.js":
/*!*************************************!*\
  !*** ./src/gpu/kernels/encoders.js ***!
  \*************************************/
/*! exports provided: GPUEncoders */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GPUEncoders", function() { return GPUEncoders; });
/* harmony import */ var _gpu_kernel_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../gpu-kernel-group */ "./src/gpu/gpu-kernel-group.js");
/* harmony import */ var _shaders_encoders__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shaders/encoders */ "./src/gpu/kernels/shaders/encoders.js");
/* harmony import */ var _core_speedy_feature__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/speedy-feature */ "./src/core/speedy-feature.js");
/* harmony import */ var _utils_tuner__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/tuner */ "./src/utils/tuner.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
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
 * gpu-encoders.js
 * Texture encoders
 */







// We won't admit more than MAX_KEYPOINTS per media.
// The larger this value is, the more data we need to transfer from the GPU.
const MAX_DESCRIPTOR_SIZE = 64; // in bytes, must be divisible by 4
const MAX_KEYPOINT_SIZE = 8 + MAX_DESCRIPTOR_SIZE; // in bytes, must be divisible by 4
const MAX_PIXELS_PER_KEYPOINT = (MAX_KEYPOINT_SIZE / 4) | 0; // in pixels
const MAX_ENCODER_LENGTH = 300; // in pixels (if too large, WebGL may lose context - so be careful!)
const MAX_KEYPOINTS = ((MAX_ENCODER_LENGTH * MAX_ENCODER_LENGTH) / MAX_PIXELS_PER_KEYPOINT) | 0;
const INITIAL_ENCODER_LENGTH = 128; // pick a large value <= MAX (useful on static images when no encoder optimization is performed beforehand)
const TWO_PI = 2.0 * Math.PI;


/**
 * GPUEncoders
 * Texture encoding
 */
class GPUEncoders extends _gpu_kernel_group__WEBPACK_IMPORTED_MODULE_0__["GPUKernelGroup"]
{
    /**
     * Class constructor
     * @param {GPUInstance} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            // Keypoint encoding
            .declare('_encodeKeypointOffsets', _shaders_encoders__WEBPACK_IMPORTED_MODULE_1__["encodeKeypointOffsets"])
            .declare('_encodeKeypoints', _shaders_encoders__WEBPACK_IMPORTED_MODULE_1__["encodeKeypoints"], {
                output: [ INITIAL_ENCODER_LENGTH, INITIAL_ENCODER_LENGTH ],
                renderToTexture: false
            })
        ;

        // setup internal data
        let neighborFn = (s) => Math.round(_utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].gaussianNoise(s, 64)) % 256;
        this._tuner = new _utils_tuner__WEBPACK_IMPORTED_MODULE_3__["StochasticTuner"](48, 32, 255, 0.2, 4, 60, neighborFn);
        this._keypointEncoderLength = INITIAL_ENCODER_LENGTH;
        this._descriptorSize = 0;
        this._spawnedAt = performance.now();
    }



    // -------------------------------------------------------------------------
    //                       KEYPOINT ENCODING
    // -------------------------------------------------------------------------


    /**
     * Optimizes the keypoint encoder for an expected number of keypoints
     * @param {number} keypointCount expected number of keypoints
     * @returns {number} nonzero if the encoder has been optimized
     */
    optimizeKeypointEncoder(keypointCount)
    {
        const clampedKeypointCount = Math.max(0, Math.min(keypointCount, MAX_KEYPOINTS));
        const pixelsPerKeypoint = Math.ceil(2 + this._descriptorSize / 4);
        const len = Math.ceil(Math.sqrt((4 + clampedKeypointCount) * pixelsPerKeypoint)); // add some slack
        const newEncoderLength = Math.max(1, Math.min(len, MAX_ENCODER_LENGTH));
        const oldEncoderLength = this._keypointEncoderLength;

        if(newEncoderLength != oldEncoderLength) {
            this._keypointEncoderLength = newEncoderLength;
            this._encodeKeypoints.resize(newEncoderLength, newEncoderLength);
        }

        return newEncoderLength - oldEncoderLength;
    }

    /**
     * Encodes the keypoints of an image - this is a bottleneck!
     * @param {WebGLTexture} corners image with encoded corners
     * @returns {Array<number>} pixels in the [r,g,b,a, ...] format
     */
    encodeKeypoints(corners)
    {
        // parameters
        const encoderLength = this._keypointEncoderLength;
        const descriptorSize = this._descriptorSize;
        const imageSize = [ this._width, this._height ];
        const maxIterations = this._tuner.currentValue();

        // encode keypoint offsets
        const start = performance.now();
        const offsets = this._encodeKeypointOffsets(corners, imageSize, maxIterations);
        this._encodeKeypoints(offsets, imageSize, encoderLength, descriptorSize);
        const pixels = this._encodeKeypoints.readPixelsSync();

        // tuner: drop noisy feedback when the page loads
        if(performance.now() >= this._spawnedAt + 2000) {
            const time = performance.now() - start;
            this._tuner.feedObservation(time);
        }

        // debug
        //console.log(JSON.stringify(this._tuner.info()));

        // done!
        return pixels;
    }

    /**
     * Decodes the keypoints, given a flattened image of encoded pixels
     * @param {Array<number>} pixels pixels in the [r,g,b,a,...] format
     * @returns {Array<SpeedyFeature>} keypoints
     */
    decodeKeypoints(pixels)
    {
        const [ w, h ] = [ this._width, this._height ];
        const hasRotation = this._descriptorSize > 0;
        const pixelsPerKeypoint = 2 + this._descriptorSize / 4;
        const lgM = Math.log2(this._gpu.pyramidMaxScale);
        const pyrHeight = this._gpu.pyramidHeight;
        let keypoints = [], x, y, scale, rotation;

        for(let i = 0; i < pixels.length; i += 4 * pixelsPerKeypoint) {
            x = (pixels[i+1] << 8) | pixels[i];
            y = (pixels[i+3] << 8) | pixels[i+2];
            if(x < w && y < h) {
                scale = pixels[i+4] == 255 ? 1.0 :
                    Math.pow(2.0, -lgM + (lgM + pyrHeight) * pixels[i+4] / 255.0);

                rotation = !hasRotation ? 0.0 :
                    pixels[i+5] * TWO_PI / 255.0;

                keypoints.push(new _core_speedy_feature__WEBPACK_IMPORTED_MODULE_2__["SpeedyFeature"](x, y, scale, rotation));
            }
            else
                break;
        }

        // developer's secret ;)
        // reset the tuner
        if(keypoints.length == 0) {
            if(this._tuner.finished())
                this._tuner.reset();
        }

        // done!
        return keypoints;
    }
}

/***/ }),

/***/ "./src/gpu/kernels/filters.js":
/*!************************************!*\
  !*** ./src/gpu/kernels/filters.js ***!
  \************************************/
/*! exports provided: GPUFilters */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GPUFilters", function() { return GPUFilters; });
/* harmony import */ var _gpu_kernel_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../gpu-kernel-group */ "./src/gpu/gpu-kernel-group.js");
/* harmony import */ var _shaders_convolution__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shaders/convolution */ "./src/gpu/kernels/shaders/convolution.js");
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
 * gpu-filters.js
 * Image filtering on the GPU
 */




/**
 * GPUFilters
 * Image filtering
 */
class GPUFilters extends _gpu_kernel_group__WEBPACK_IMPORTED_MODULE_0__["GPUKernelGroup"]
{
    /**
     * Class constructor
     * @param {GPUInstance} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            // gaussian approximation (sigma approx. 1.0)
            .compose('gauss5', '_gauss5x', '_gauss5y') // size: 5x5
            .compose('gauss3', '_gauss3x', '_gauss3y') // size: 3x3
            .compose('gauss7', '_gauss7x', '_gauss7y') // size: 7x7

            // box filters
            .compose('box5', '_box5x', '_box5y') // size: 5x5
            .compose('box3', '_box3x', '_box3y') // size: 3x3
            .compose('box7', '_box7x', '_box7y') // size: 7x7
            .compose('box9', '_box9x', '_box9y') // size: 9x9
            .compose('box11', '_box11x', '_box11y') // size: 11x11

            // texture-based convolutions
            .compose('texConv2D3', '_idConv2D3', '_texConv2D3') // 2D texture-based 3x3 convolution
            .compose('texConv2D5', '_idConv2D5', '_texConv2D5') // 2D texture-based 5x5 convolution
            .compose('texConv2D7', '_idConv2D7', '_texConv2D7') // 2D texture-based 7x7 convolution

            .declare('_texConv2D3', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["texConv2D"])(3)) // 3x3 convolution with a texture (not chainable)
            .declare('_idConv2D3', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["idConv2D"])(3)) // identity operation (enables chaining)
            .declare('_texConv2D5', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["texConv2D"])(5)) // 5x5 convolution with a texture (not chainable)
            .declare('_idConv2D5', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["idConv2D"])(5)) // identity operation (enables chaining)
            .declare('_texConv2D7', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["texConv2D"])(7)) // 7x7 convolution with a texture (not chainable)
            .declare('_idConv2D7', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["idConv2D"])(7)) // identity operation (enables chaining)

            // texture-based separable convolutions
            .compose('texConvXY3', 'texConvX3', 'texConvY3') // 2D convolution with same 1D separable kernel in both axes
            .declare('texConvX3', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["texConvX"])(3)) // 3x1 convolution, x-axis
            .declare('texConvY3', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["texConvY"])(3)) // 1x3 convolution, y-axis
            .compose('texConvXY5', 'texConvX5', 'texConvY5') // 2D convolution with same 1D separable kernel in both axes
            .declare('texConvX5', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["texConvX"])(5)) // 5x1 convolution, x-axis
            .declare('texConvY5', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["texConvY"])(5)) // 1x5 convolution, y-axis
            .compose('texConvXY7', 'texConvX7', 'texConvY7') // 2D convolution with same 1D separable kernel in both axes
            .declare('texConvX7', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["texConvX"])(7)) // 7x1 convolution, x-axis
            .declare('texConvY7', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["texConvY"])(7)) // 1x7 convolution, y-axis
            .compose('texConvXY9', 'texConvX9', 'texConvY9') // 2D convolution with same 1D separable kernel in both axes
            .declare('texConvX9', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["texConvX"])(9)) // 9x1 convolution, x-axis
            .declare('texConvY9', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["texConvY"])(9)) // 1x9 convolution, y-axis
            .compose('texConvXY11', 'texConvX11', 'texConvY11') // 2D convolution with same 1D separable kernel in both axes
            .declare('texConvX11', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["texConvX"])(11)) // 11x1 convolution, x-axis
            .declare('texConvY11', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["texConvY"])(11)) // 1x11 convolution, y-axis

            // create custom convolution kernels
            .declare('createKernel3x3', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["createKernel2D"])(3), { // 3x3 texture kernel
                ...(this.operation.hasTextureSize(3, 3)),
                ...(this.operation.doesNotRecycleTextures())
            })
            .declare('createKernel5x5', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["createKernel2D"])(5), { // 5x5 texture kernel
                ...(this.operation.hasTextureSize(5, 5)),
                ...(this.operation.doesNotRecycleTextures())
            })
            .declare('createKernel7x7', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["createKernel2D"])(7), { // 7x7 texture kernel
                ...(this.operation.hasTextureSize(7, 7)),
                ...(this.operation.doesNotRecycleTextures())
            })
            .declare('createKernel3x1', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["createKernel1D"])(3), { // 3x1 texture kernel
                ...(this.operation.hasTextureSize(3, 1)),
                ...(this.operation.doesNotRecycleTextures())
            })
            .declare('createKernel5x1', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["createKernel1D"])(5), { // 5x1 texture kernel
                ...(this.operation.hasTextureSize(5, 1)),
                ...(this.operation.doesNotRecycleTextures())
            })
            .declare('createKernel7x1', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["createKernel1D"])(7), { // 7x1 texture kernel
                ...(this.operation.hasTextureSize(7, 1)),
                ...(this.operation.doesNotRecycleTextures())
            })
            .declare('createKernel9x1', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["createKernel1D"])(9), { // 9x1 texture kernel
                ...(this.operation.hasTextureSize(9, 1)),
                ...(this.operation.doesNotRecycleTextures())
            })
            .declare('createKernel11x1', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["createKernel1D"])(11), { // 11x1 texture kernel
                ...(this.operation.hasTextureSize(11, 1)),
                ...(this.operation.doesNotRecycleTextures())
            })
            /*.declare('_readKernel3x3', identity, { // for testing
                ...(this.operation.hasTextureSize(3, 3)),
                ...(this.operation.displaysGraphics())
            })
            .declare('_readKernel3x1', identity, {
                ...(this.operation.hasTextureSize(3, 1)),
                ...(this.operation.displaysGraphics())
            })*/




            // separable kernels (Gaussian)
            // see also: http://dev.theomader.com/gaussian-kernel-calculator/
            .declare('_gauss5x', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["convX"])([
                0.05, 0.25, 0.4, 0.25, 0.05
                //0.006, 0.061, 0.242, 0.383, 0.242, 0.061, 0.006
            ]))
            .declare('_gauss5y', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["convY"])([
                0.05, 0.25, 0.4, 0.25, 0.05
                //0.006, 0.061, 0.242, 0.383, 0.242, 0.061, 0.006
            ]))
            .declare('_gauss3x', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["convX"])([
                0.25, 0.5, 0.25
                //0.27901, 0.44198, 0.27901
            ]))
            .declare('_gauss3y', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["convY"])([
                0.25, 0.5, 0.25
                //0.27901, 0.44198, 0.27901
            ]))
            .declare('_gauss7x', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["convX"])([
                0.00598, 0.060626, 0.241843, 0.383103, 0.241843, 0.060626, 0.00598
            ]))
            .declare('_gauss7y', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["convY"])([
                0.00598, 0.060626, 0.241843, 0.383103, 0.241843, 0.060626, 0.00598
            ]))
            /*.declare('_gauss5', conv2D([ // for testing
                1, 4, 7, 4, 1,
                4, 16, 26, 16, 4,
                7, 26, 41, 26, 7,
                4, 16, 26, 16, 4,
                1, 4, 7, 4, 1,
            ], 1 / 237))*/



            // separable kernels (Box filter)
            .declare('_box3x', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["convX"])([
                1, 1, 1
            ], 1 / 3))
            .declare('_box3y', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["convY"])([
                1, 1, 1
            ], 1 / 3))
            .declare('_box5x', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["convX"])([
                1, 1, 1, 1, 1
            ], 1 / 5))
            .declare('_box5y', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["convY"])([
                1, 1, 1, 1, 1
            ], 1 / 5))
            .declare('_box7x', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["convX"])([
                1, 1, 1, 1, 1, 1, 1
            ], 1 / 7))
            .declare('_box7y', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["convY"])([
                1, 1, 1, 1, 1, 1, 1
            ], 1 / 7))
            .declare('_box9x', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["convX"])([
                1, 1, 1, 1, 1, 1, 1, 1, 1
            ], 1 / 9))
            .declare('_box9y', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["convY"])([
                1, 1, 1, 1, 1, 1, 1, 1, 1
            ], 1 / 9))
            .declare('_box11x', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["convX"])([
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
            ], 1 / 11))
            .declare('_box11y', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_1__["convY"])([
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
            ], 1 / 11))
        ;
    }
}


/***/ }),

/***/ "./src/gpu/kernels/keypoints.js":
/*!**************************************!*\
  !*** ./src/gpu/kernels/keypoints.js ***!
  \**************************************/
/*! exports provided: GPUKeypoints */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GPUKeypoints", function() { return GPUKeypoints; });
/* harmony import */ var _gpu_kernel_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../gpu-kernel-group */ "./src/gpu/gpu-kernel-group.js");
/* harmony import */ var _shaders_fast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shaders/fast */ "./src/gpu/kernels/shaders/fast.js");
/* harmony import */ var _shaders_brisk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shaders/brisk */ "./src/gpu/kernels/shaders/brisk.js");
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
 * gpu-keypoints.js
 * Facade for various keypoint detection algorithms
 */





/**
 * GPUKeypoints
 * Keypoint detection
 */
class GPUKeypoints extends _gpu_kernel_group__WEBPACK_IMPORTED_MODULE_0__["GPUKernelGroup"]
{
    /**
     * Class constructor
     * @param {GPUInstance} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            // FAST-9,16
            .compose('fast9', '_fast9', '_fastScore16')
            .declare('_fast9', _shaders_fast__WEBPACK_IMPORTED_MODULE_1__["fast9ml"]) // use 'ml' for multiple passes
            .declare('_fastScore16', _shaders_fast__WEBPACK_IMPORTED_MODULE_1__["fastScore16"]) // compute scores

            // FAST-7,12
            .compose('fast7', '_fast7', '_fastScore12')
            .declare('_fast7', _shaders_fast__WEBPACK_IMPORTED_MODULE_1__["fast7"])
            .declare('_fastScore12', _shaders_fast__WEBPACK_IMPORTED_MODULE_1__["fastScore12"])

            // FAST-5,8
            .compose('fast5', '_fast5', '_fastScore8')
            .declare('_fast5', _shaders_fast__WEBPACK_IMPORTED_MODULE_1__["fast5"])
            .declare('_fastScore8', _shaders_fast__WEBPACK_IMPORTED_MODULE_1__["fastScore8"])

            // FAST Non-Maximum Suppression
            .declare('fastSuppression', _shaders_fast__WEBPACK_IMPORTED_MODULE_1__["fastSuppression"])

            // BRISK Scale-Space Non-Maximum Suppression & Interpolation
            .declare('brisk', _shaders_brisk__WEBPACK_IMPORTED_MODULE_2__["brisk"])
        ;
    }
}



/***/ }),

/***/ "./src/gpu/kernels/pyramids.js":
/*!*************************************!*\
  !*** ./src/gpu/kernels/pyramids.js ***!
  \*************************************/
/*! exports provided: GPUPyramids */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GPUPyramids", function() { return GPUPyramids; });
/* harmony import */ var _gpu_kernel_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../gpu-kernel-group */ "./src/gpu/gpu-kernel-group.js");
/* harmony import */ var _shaders_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shaders/utils */ "./src/gpu/kernels/shaders/utils.js");
/* harmony import */ var _shaders_convolution__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shaders/convolution */ "./src/gpu/kernels/shaders/convolution.js");
/* harmony import */ var _shaders_pyramids__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shaders/pyramids */ "./src/gpu/kernels/shaders/pyramids.js");
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
 * gpu-pyramids.js
 * Image pyramids
 */








/**
 * GPUPyramids
 * Image pyramids
 */
class GPUPyramids extends _gpu_kernel_group__WEBPACK_IMPORTED_MODULE_0__["GPUKernelGroup"]
{
    /**
     * Class constructor
     * @param {GPUInstance} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            // initialize pyramid
            .declare('setBase', Object(_shaders_pyramids__WEBPACK_IMPORTED_MODULE_3__["setScale"])(1.0, gpu.pyramidHeight, gpu.pyramidMaxScale))
 
            // pyramid operations
            .compose('reduce', '_smoothX', '_smoothY', '_downsample2', '_scale1/2')
            .compose('expand', '_upsample2', '_smoothX2', '_smoothY2', '_scale2')
           
            // intra-pyramid operations (between two pyramid levels)
            .compose('intraReduce', '_upsample2', '_smoothX2', '_smoothY2', '_downsample3/2', '_scale2/3')
            .compose('intraExpand', '_upsample3', '_smoothX3', '_smoothY3', '_downsample2/3', '_scale3/2')

            // Merge keypoints across multiple scales
            .declare('mergeKeypoints', _shaders_pyramids__WEBPACK_IMPORTED_MODULE_3__["mergeKeypoints"])
            .declare('mergeKeypointsAtConsecutiveLevels', _shaders_pyramids__WEBPACK_IMPORTED_MODULE_3__["mergeKeypointsAtConsecutiveLevels"])
            .declare('normalizeKeypoints', _shaders_pyramids__WEBPACK_IMPORTED_MODULE_3__["normalizeKeypoints"])

            // Crop texture to width x height of the current pyramid level
            .declare('crop', _shaders_pyramids__WEBPACK_IMPORTED_MODULE_3__["crop"])

            // kernels for debugging
            .declare('output', _shaders_utils__WEBPACK_IMPORTED_MODULE_1__["flipY"], {
                ...this.operation.hasTextureSize(this._width, this._height),
                ...this.operation.displaysGraphics()
            })

            .declare('output2', _shaders_utils__WEBPACK_IMPORTED_MODULE_1__["flipY"], {
                ...this.operation.hasTextureSize(2 * this._width, 2 * this._height),
                ...this.operation.displaysGraphics()
            })

            .declare('output3', _shaders_utils__WEBPACK_IMPORTED_MODULE_1__["flipY"], {
                ...this.operation.hasTextureSize(3 * this._width, 3 * this._height),
                ...this.operation.displaysGraphics()
            })


            
            // separable kernels for gaussian smoothing
            // use [c, b, a, b, c] where a+2c = 2b and a+2b+2c = 1
            // pick a = 0.4 for gaussian approximation
            .declare('_smoothX', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])([
                0.05, 0.25, 0.4, 0.25, 0.05
            ]))
            .declare('_smoothY', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])([
                0.05, 0.25, 0.4, 0.25, 0.05
            ]))

            // smoothing for 2x image
            // same rules as above with sum(k) = 2
            .declare('_smoothX2', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])([
                0.1, 0.5, 0.8, 0.5, 0.1
            ]), this.operation.hasTextureSize(2 * this._width, 2 * this._height))

            .declare('_smoothY2', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])([
                0.1, 0.5, 0.8, 0.5, 0.1
            ], 1.0 / 2.0), this.operation.hasTextureSize(2 * this._width, 2 * this._height))

            // smoothing for 3x image
            // use [1-b, b, 1, b, 1-b], where 0 < b < 1
            .declare('_smoothX3', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])([
                0.2, 0.8, 1.0, 0.8, 0.2
            ]), this.operation.hasTextureSize(3 * this._width, 3 * this._height))

            .declare('_smoothY3', Object(_shaders_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])([
                0.2, 0.8, 1.0, 0.8, 0.2
            ], 1.0 / 3.0), this.operation.hasTextureSize(3 * this._width, 3 * this._height))

            // upsampling & downsampling
            .declare('_upsample2', _shaders_pyramids__WEBPACK_IMPORTED_MODULE_3__["upsample2"],
                this.operation.hasTextureSize(2 * this._width, 2 * this._height))

            .declare('_downsample2', _shaders_pyramids__WEBPACK_IMPORTED_MODULE_3__["downsample2"],
                this.operation.hasTextureSize((1 + this._width) / 2, (1 + this._height) / 2))

            .declare('_upsample3', _shaders_pyramids__WEBPACK_IMPORTED_MODULE_3__["upsample3"],
                this.operation.hasTextureSize(3 * this._width, 3 * this._height))

            .declare('_downsample3', _shaders_pyramids__WEBPACK_IMPORTED_MODULE_3__["downsample3"],
                this.operation.hasTextureSize((2 + this._width) / 3, (2 + this._height) / 3))

            .declare('_downsample2/3', _shaders_pyramids__WEBPACK_IMPORTED_MODULE_3__["downsample2"],
                this.operation.hasTextureSize(3 * this._width / 2, 3 * this._height / 2))

            .declare('_downsample3/2', _shaders_pyramids__WEBPACK_IMPORTED_MODULE_3__["downsample3"],
                this.operation.hasTextureSize(2 * this._width / 3, 2 * this._height / 3))

            // adjust the scale coefficients
            .declare('_scale2', Object(_shaders_pyramids__WEBPACK_IMPORTED_MODULE_3__["scale"])(2.0, gpu.pyramidHeight, gpu.pyramidMaxScale),
                this.operation.hasTextureSize(2 * this._width, 2 * this._height))

            .declare('_scale1/2', Object(_shaders_pyramids__WEBPACK_IMPORTED_MODULE_3__["scale"])(0.5, gpu.pyramidHeight, gpu.pyramidMaxScale),
                this.operation.hasTextureSize((1 + this._width) / 2, (1 + this._height) / 2))

            .declare('_scale3/2', Object(_shaders_pyramids__WEBPACK_IMPORTED_MODULE_3__["scale"])(1.5, gpu.pyramidHeight, gpu.pyramidMaxScale),
                this.operation.hasTextureSize(3 * this._width / 2, 3 * this._height / 2))

            .declare('_scale2/3', Object(_shaders_pyramids__WEBPACK_IMPORTED_MODULE_3__["scale"])(2.0 / 3.0, gpu.pyramidHeight, gpu.pyramidMaxScale),
                this.operation.hasTextureSize(2 * this._width / 3, 2 * this._height / 3))
        ;
    }
}


/***/ }),

/***/ "./src/gpu/kernels/shaders/brisk.js":
/*!******************************************!*\
  !*** ./src/gpu/kernels/shaders/brisk.js ***!
  \******************************************/
/*! exports provided: brisk */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "brisk", function() { return brisk; });
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
 * brisk.js
 * BRISK feature detection
 */

/*
 * This implements a MODIFIED, GPU-based version
 * of the BRISK [1] feature detection algorithm
 * 
 * Reference:
 * 
 * [1] Leutenegger, Stefan; Chli, Margarita; Siegwart, Roland Y.
 *     "BRISK: Binary robust invariant scalable keypoints"
 *     International Conference on Computer Vision (ICCV-2011)
 */
const brisk = (image, layerA, layerB, scaleA, scaleB, lgM, h) => __webpack_require__(/*! ./keypoint-detectors/brisk.glsl */ "./src/gpu/kernels/shaders/keypoint-detectors/brisk.glsl");

/***/ }),

/***/ "./src/gpu/kernels/shaders/colors.js":
/*!*******************************************!*\
  !*** ./src/gpu/kernels/shaders/colors.js ***!
  \*******************************************/
/*! exports provided: rgb2grey */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rgb2grey", function() { return rgb2grey; });
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
 * colors.js
 * Color conversions
 */

// Convert to greyscale
const rgb2grey = (image) => __webpack_require__(/*! ./colors/rgb2grey.glsl */ "./src/gpu/kernels/shaders/colors/rgb2grey.glsl");

/***/ }),

/***/ "./src/gpu/kernels/shaders/colors/rgb2grey.glsl":
/*!******************************************************!*\
  !*** ./src/gpu/kernels/shaders/colors/rgb2grey.glsl ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "const vec4 grey = vec4(0.299f, 0.587f, 0.114f, 0.0f);\nuniform sampler2D image;\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nfloat g = dot(pixel, grey);\ncolor = vec4(g, g, g, 1.0f);\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/convolution.js":
/*!************************************************!*\
  !*** ./src/gpu/kernels/shaders/convolution.js ***!
  \************************************************/
/*! exports provided: conv2D, convX, convY, createKernel2D, createKernel1D, texConv2D, idConv2D, texConvX, texConvY */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "conv2D", function() { return conv2D; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convX", function() { return convX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convY", function() { return convY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createKernel2D", function() { return createKernel2D; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createKernel1D", function() { return createKernel1D; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "texConv2D", function() { return texConv2D; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "idConv2D", function() { return idConv2D; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "texConvX", function() { return texConvX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "texConvY", function() { return texConvY; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.js");
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
 * convolution.js
 * Convolution function generator
 */


const cartesian = (a, b) => [].concat(...a.map(a => b.map(b => [a,b]))); // [a] x [b]
const symmetricRange = n => [...Array(2*n + 1).keys()].map(x => x-n);    // [-n, ..., n]

// Generate a 2D convolution with a square kernel
function conv2D(kernel, normalizationConstant = 1.0)
{
    const kernel32 = new Float32Array(kernel.map(x => (+x) * (+normalizationConstant)));
    const kSize = Math.sqrt(kernel32.length) | 0;
    const N = (kSize / 2) | 0;

    // validate input
    if(kSize < 1 || kSize % 2 == 0)
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].fatal(`Can't perform a 2D convolution with an invalid kSize of ${kSize}`);
    else if(kSize * kSize != kernel32.length)
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].fatal(`Invalid 2D convolution kernel of ${kernel32.length} elements (expected: square)`);

    // code generator
    const foreachKernelElement = fn => cartesian(symmetricRange(N), symmetricRange(N)).map(
        cur => fn(
            kernel32[(cur[0] + N) * kSize + (cur[1] + N)],
            cur[0], cur[1]
        )
    ).join('\n');

    const generateCode = (k, dy, dx) => `
        result += pixelAtOffset(image, ivec2(${dx | 0}, ${dy | 0})) * float(${+k});
    `;

    // shader
    const shader = `
    uniform sampler2D image;

    void main()
    {
        float alpha = threadPixel(image).a;
        vec4 result = vec4(0.0f, 0.0f, 0.0f, 0.0f);

        ${foreachKernelElement(generateCode)}

        color = vec4(result.rgb, alpha);
    }
    `;

    // done!
    return (image) => shader;
}

// Generate a 1D convolution function on the x-axis
function convX(kernel, normalizationConstant = 1.0)
{
    return conv1D('x', kernel, normalizationConstant);
}

// Generate a 1D convolution function on the y-axis
function convY(kernel, normalizationConstant = 1.0)
{
    return conv1D('y', kernel, normalizationConstant);
}

// 1D convolution function generator
function conv1D(axis, kernel, normalizationConstant)
{
    const kernel32 = new Float32Array(kernel.map(x => (+x) * (+normalizationConstant)));
    const kSize = kernel32.length;
    const N = (kSize / 2) | 0;

    // validate input
    if(kSize < 1 || kSize % 2 == 0)
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].fatal(`Can't perform a 1D convolution with an invalid kSize of ${kSize}`);
    else if(axis != 'x' && axis != 'y')
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].fatal(`Can't perform 1D convolution: invalid axis "${axis}"`); // this should never happen

    // code generator
    const foreachKernelElement = fn => symmetricRange(N).reduce(
        (acc, cur) => acc + fn(kernel32[cur + N], cur),
    '');
    const generateCode = (k, i) => ((axis == 'x') ? `
        pixel += pixelAtOffset(image, ivec2(${i | 0}, 0)) * float(${+k});
    ` : `
        pixel += pixelAtOffset(image, ivec2(0, ${i | 0})) * float(${+k});
    `);

    // shader
    const shader = `
    uniform sampler2D image;

    void main()
    {
        float alpha = threadPixel(image).a;
        vec4 pixel = vec4(0.0f, 0.0f, 0.0f, 0.0f);

        ${foreachKernelElement(generateCode)}

        color = vec4(pixel.rgb, alpha);
    }
    `;

    // done!
    return (image) => shader;
}

/*
 * ------------------------------------------------------------------
 * Texture Encoding
 * Encoding a float in [0,1] into RGB[A]
 * ------------------------------------------------------------------
 * Define frac(x) := x - floor(x)
 * Of course, 0 <= frac(x) < 1.
 * 
 * Given: x in [0,1]
 * 
 * Define e0 := floor(x),
 *        e1 := 256 frac(x)
 *        e2 := 256 frac(e1) = 256 frac(256 frac(x))
 *        e3 := 256 frac(e2) = 256 frac(256 frac(e1)) = 256 frac(256 frac(256 frac(x))),
 *        ...
 *        more generally,
 *        ej := 256 frac(e_{j-1}), j >= 2
 * 
 * Since x = frac(x) + floor(x), it follows that
 * x = floor(x) + 256 frac(x) / 256 = e0 + e1 / 256 = e0 + (frac(e1) + floor(e1)) / 256 =
 * e0 + (256 frac(e1) + 256 floor(e1)) / (256^2) = e0 + (e2 + 256 floor(e1)) / (256^2) =
 * e0 + ((256 frac(e2) + 256 floor(e2)) + 256^2 floor(e1)) / (256^3) =
 * e0 + (e3 + 256 floor(e2) + 256^2 floor(e1)) / (256^3) = 
 * floor(e0) + floor(e1) / 256 + floor(e2) / (256^2) + e3 / (256^3) = ... =
 * floor(e0) + floor(e1) / 256 + floor(e2) / (256^2) + floor(e3) / (256^3) + e4 / (256^4) = ... ~
 * \sum_{i >= 0} floor(e_i) / 256^i
 * 
 * Observe that e0 in {0, 1} and, for j >= 1, 0 <= e_j < 256, meaning that
 * e0 and (e_j / 256) can be stored in a 8-bit color channel.
 * 
 * We now have approximations for x:
 * x ~ x0 <-- first order
 * x ~ x0 + x1 / 256 <-- second order
 * x ~ x0 + x1 / 256 + x2 / (256^2) <-- third order (RGB)
 * x ~ x0 + x1 / 256 + x2 / (256^2) + x3 / (256^3) <-- fourth order (RGBA)
 * where x_i = floor(e_i).
 */

// Generate a texture-based 2D convolution kernel
// of size (kernelSize x kernelSize), where all
// entries belong to the [0, 1] range
function createKernel2D(kernelSize)
{
    // validate input
    kernelSize |= 0;
    if(kernelSize < 1 || kernelSize % 2 == 0)
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].fatal(`Can't create a 2D texture kernel of size ${kernelSize}`);

    // encode float in the [0,1] range to RGBA
    const shader = `
    uniform float kernel[${kernelSize * kernelSize}];

    void main()
    {
        ivec2 thread = threadLocation();
        float val = kernel[(${kernelSize}) * thread.y + thread.x];

        float e0 = floor(val);
        float e1 = 256.0f * fract(val);
        float e2 = 256.0f * fract(e1);
        float e3 = 256.0f * fract(e2);

        color = vec4(e0, floor(e1) / 256.0f, floor(e2) / 256.0f, floor(e3) / 256.0f);
    }
    `;

    // IMPORTANT: all entries of the input kernel
    // are assumed to be in the [0, 1] range AND
    // kernel.length >= kernelSize * kernelSize
    //return new Function('arr', body);
    return (kernel) => shader;
}

// Generate a texture-based 1D convolution kernel
// of size (kernelSize x 1), where all entries
// belong to the [0, 1] range
function createKernel1D(kernelSize)
{
    // validate input
    kernelSize |= 0;
    if(kernelSize < 1 || kernelSize % 2 == 0)
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].fatal(`Can't create a 1D texture kernel of size ${kernelSize}`);

    // encode float in the [0,1] range to RGBA
    const shader = `
    uniform float kernel[${kernelSize}];

    void main()
    {
        ivec2 thread = threadLocation();
        float val = kernel[thread.x];

        float e0 = floor(val);
        float e1 = 256.0f * fract(val);
        float e2 = 256.0f * fract(e1);
        float e3 = 256.0f * fract(e2);

        color = vec4(e0, floor(e1) / 256.0f, floor(e2) / 256.0f, floor(e3) / 256.0f);
    }
    `;

    // IMPORTANT: all entries of the input kernel
    // are assumed to be in the [0, 1] range AND
    // kernel.length >= kernelSize
    //return new Function('arr', body);
    return (kernel) => shader;
}

// 2D convolution with a texture-based kernel of size
// kernelSize x kernelSize, with optional scale & offset
// By default, scale and offset are 1 and 0, respectively
function texConv2D(kernelSize)
{
    // validate input
    const N = kernelSize >> 1; // idiv 2
    if(kernelSize < 1 || kernelSize % 2 == 0)
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].fatal(`Can't perform a texture-based 2D convolution with an invalid kernel size of ${kernelSize}`);

    // utilities
    const foreachKernelElement = fn => cartesian(symmetricRange(N), symmetricRange(N)).map(
        ij => fn(ij[0], ij[1])
    ).join('\n');

    const generateCode = (i, j) => `
        kernel = pixelAt(texKernel, ivec2(${i + N}, ${j + N}));
        value = dot(kernel, magic) * scale + offset;
        result += pixelAtOffset(image, ivec2(${i}, ${j})) * value;
    `;

    // image: target image
    // texKernel: convolution kernel (all entries in [0,1])
    // scale: multiply the kernel entries by a number (like 1.0)
    // offset: add a number to all kernel entries (like 0.0)
    const shader = `
    const vec4 magic = vec4(1.0f, 1.0f, 1.0f / 256.0f, 1.0f / 65536.0f);
    uniform sampler2D image, texKernel;
    uniform float scale, offset;

    void main()
    {
        vec4 kernel = vec4(0.0f, 0.0f, 0.0f, 0.0f);
        vec4 result = vec4(0.0f, 0.0f, 0.0f, 0.0f);
        float alpha = threadPixel(image).a;
        float value = 0.0f;

        ${foreachKernelElement(generateCode)}

        result = clamp(result, 0.0f, 1.0f);
        color = vec4(result.rgb, alpha);
    }
    `;

    return (image, texKernel, scale, offset) => shader;
}

// identity operation with the same parameters as texConv2D()
function idConv2D(kernelSize)
{
    return (image, texKernel, scale, offset) => `
    uniform sampler2D image, texKernel;
    uniform float scale, offset;

    void main()
    {
        color = threadPixel(image);
    }
    `;
}

// Texture-based 1D convolution on the x-axis
const texConvX = kernelSize => texConv1D(kernelSize, 'x');

// Texture-based 1D convolution on the x-axis
const texConvY = kernelSize => texConv1D(kernelSize, 'y');

// texture-based 1D convolution function generator
// (the convolution kernel is stored in a texture)
function texConv1D(kernelSize, axis)
{
    // validate input
    const N = kernelSize >> 1; // idiv 2
    if(kernelSize < 1 || kernelSize % 2 == 0)
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].fatal(`Can't perform a texture-based 2D convolution with an invalid kernel size of ${kernelSize}`);
    else if(axis != 'x' && axis != 'y')
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].fatal(`Can't perform a texture-based 1D convolution: invalid axis "${axis}"`); // this should never happen

    // utilities
    const foreachKernelElement = fn => symmetricRange(N).map(fn).join('\n');
    const generateCode = i => ((axis == 'x') ? `
        kernel = pixelAt(texKernel, ivec2(${i + N}, 0));
        value = dot(kernel, magic) * scale + offset;
        result += pixelAtOffset(image, ivec2(${i}, 0)) * value;
    ` : `
        kernel = pixelAt(texKernel, ivec2(${i + N}, 0));
        value = dot(kernel, magic) * scale + offset;
        result += pixelAtOffset(image, ivec2(0, ${i})) * value;
    `);

    // image: target image
    // texKernel: convolution kernel (all entries in [0,1])
    // scale: multiply the kernel entries by a number (like 1.0)
    // offset: add a number to all kernel entries (like 0.0)
    const shader = `
    const vec4 magic = vec4(1.0f, 1.0f, 1.0f / 256.0f, 1.0f / 65536.0f);
    uniform sampler2D image, texKernel;
    uniform float scale, offset;

    void main()
    {
        vec4 kernel = vec4(0.0f, 0.0f, 0.0f, 0.0f);
        vec4 result = vec4(0.0f, 0.0f, 0.0f, 0.0f);
        float alpha = threadPixel(image).a;
        float value = 0.0f;

        ${foreachKernelElement(generateCode)}

        result = clamp(result, 0.0f, 1.0f);
        color = vec4(result.rgb, alpha);
    }
    `;

    return (image, texKernel, scale, offset) => shader;
}

/***/ }),

/***/ "./src/gpu/kernels/shaders/encoders.js":
/*!*********************************************!*\
  !*** ./src/gpu/kernels/shaders/encoders.js ***!
  \*********************************************/
/*! exports provided: encodeKeypointOffsets, encodeKeypoints */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodeKeypointOffsets", function() { return encodeKeypointOffsets; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodeKeypoints", function() { return encodeKeypoints; });
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

// encode keypoint offsets: maxIterations is an integer in [1,255], determined experimentally
const encodeKeypointOffsets = (image, imageSize, maxIterations) => __webpack_require__(/*! ./encoders/encode-keypoint-offsets.glsl */ "./src/gpu/kernels/shaders/encoders/encode-keypoint-offsets.glsl");

// encode keypoints
const encodeKeypoints = (image, imageSize, encoderLength, descriptorSize) => __webpack_require__(/*! ./encoders/encode-keypoints.glsl */ "./src/gpu/kernels/shaders/encoders/encode-keypoints.glsl");

/***/ }),

/***/ "./src/gpu/kernels/shaders/encoders/encode-keypoint-offsets.glsl":
/*!***********************************************************************!*\
  !*** ./src/gpu/kernels/shaders/encoders/encode-keypoint-offsets.glsl ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nuniform ivec2 imageSize;\nuniform int maxIterations;\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nivec2 pos = threadLocation();\nint offset = -1;\nwhile(offset < maxIterations && pos.y < imageSize.y && pixelAt(image, pos).r == 0.0f) {\n++offset;\npos.x = (pos.x + 1) % imageSize.x;\npos.y += int(pos.x == 0);\n}\ncolor = vec4(pixel.rg, float(max(0, offset)) / 255.0f, pixel.a);\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/encoders/encode-keypoints.glsl":
/*!****************************************************************!*\
  !*** ./src/gpu/kernels/shaders/encoders/encode-keypoints.glsl ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nuniform ivec2 imageSize;\nuniform int encoderLength;\nuniform int descriptorSize;\nbool findQthKeypoint(int q, out ivec2 position, out vec4 pixel)\n{\nint i = 0, p = 0;\nfor(position = ivec2(0, 0); position.y < imageSize.y; ) {\npixel = pixelAt(image, position);\nif(pixel.r > 0.0f) {\nif(p++ == q)\nreturn true;\n}\ni += 1 + int(pixel.b * 255.0f);\nposition = ivec2(i % imageSize.x, i / imageSize.x);\n}\nreturn false;\n}\nvoid main()\n{\nvec4 pixel;\nivec2 position;\nivec2 thread = threadLocation();\nint p = encoderLength * thread.y + thread.x;\nint d = 2 + descriptorSize / 4;\nint q = p / d;\ncolor = vec4(1.0f, 1.0f, 1.0f, 1.0f);\nif(findQthKeypoint(q, position, pixel)) {\nint r = p % d;\nswitch(r) {\ncase 0: {\nivec2 lo = position & 255;\nivec2 hi = position >> 8;\ncolor = vec4(float(lo.x), float(hi.x), float(lo.y), float(hi.y)) / 255.0f;\nbreak;\n}\ncase 1: {\nfloat scale = pixel.a;\nfloat rotation = 0.0f;\ncolor = vec4(scale, rotation, 0.0f, 0.0f);\nbreak;\n}\ndefault: {\nint i = r - 2;\nbreak;\n}\n}\n}\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/fast.js":
/*!*****************************************!*\
  !*** ./src/gpu/kernels/shaders/fast.js ***!
  \*****************************************/
/*! exports provided: fast9, fast9ml, fast7, fast5, fastScore16, fastScore12, fastScore8, fastSuppression */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fast9", function() { return fast9; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fast9ml", function() { return fast9ml; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fast7", function() { return fast7; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fast5", function() { return fast5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fastScore16", function() { return fastScore16; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fastScore12", function() { return fastScore12; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fastScore8", function() { return fastScore8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fastSuppression", function() { return fastSuppression; });
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
 * fast.js
 * FAST corner detection
 */

/*
 * This is a GPU implementation of FAST,
 * "Features from Accelerated Segment Test" [1]
 *
 * Reference:
 *
 * [1] Rosten, Edward; Drummond, Tom.
 *     "Machine learning for high-speed corner detection"
 *     European Conference on Computer Vision (ECCV-2006)
 *
 */

/*
 * Pixels are encoded as follows:
 *
 * R: "cornerness" score IF the pixel is a corner, 0 otherwise
 * G: pixel intensity (left untouched)
 * B: "cornerness" score regardless if the pixel is a corner or not
 *    (useful for other algorithms)
 * A: left untouched
 */

// FAST-9_16: requires 9 contiguous pixels
// on a circumference of 16 pixels
const fast9 = (image, threshold) => __webpack_require__(/*! ./keypoint-detectors/fast9.glsl */ "./src/gpu/kernels/shaders/keypoint-detectors/fast9.glsl");

// FAST-9,16 implementation based on Machine Learning
// Adapted from New BSD Licensed fast_9.c code found at
// https://github.com/edrosten/fast-C-src
const fast9ml = (image, threshold) => __webpack_require__(/*! ./keypoint-detectors/fast9ml.glsl */ "./src/gpu/kernels/shaders/keypoint-detectors/fast9ml.glsl");

// FAST-7_12: requires 7 contiguous pixels
// on a circumference of 12 pixels
const fast7 = (image, threshold) => __webpack_require__(/*! ./keypoint-detectors/fast7.glsl */ "./src/gpu/kernels/shaders/keypoint-detectors/fast7.glsl");

// FAST-5_8: requires 5 contiguous pixels
// on a circumference of 8 pixels
const fast5 = (image, threshold) => __webpack_require__(/*! ./keypoint-detectors/fast5.glsl */ "./src/gpu/kernels/shaders/keypoint-detectors/fast5.glsl");

// compute corner score considering a
// neighboring circumference of 16 pixels
const fastScore16 = (image, threshold) => __webpack_require__(/*! ./keypoint-detectors/fast-score16.glsl */ "./src/gpu/kernels/shaders/keypoint-detectors/fast-score16.glsl");

// compute corner score considering a
// neighboring circumference of 12 pixels
const fastScore12 = (image, threshold) => __webpack_require__(/*! ./keypoint-detectors/fast-score12.glsl */ "./src/gpu/kernels/shaders/keypoint-detectors/fast-score12.glsl");

// compute corner score considering a
// neighboring circumference of 8 pixels
const fastScore8 = (image, threshold) => __webpack_require__(/*! ./keypoint-detectors/fast-score8.glsl */ "./src/gpu/kernels/shaders/keypoint-detectors/fast-score8.glsl");

// non-maximum suppression on 8-neighborhood based
// on the corner score stored on the red channel
const fastSuppression = image => __webpack_require__(/*! ./keypoint-detectors/fast-suppression.glsl */ "./src/gpu/kernels/shaders/keypoint-detectors/fast-suppression.glsl");

/***/ }),

/***/ "./src/gpu/kernels/shaders/includes sync recursive ^\\.\\/.*$":
/*!********************************************************!*\
  !*** ./src/gpu/kernels/shaders/includes sync ^\.\/.*$ ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./global.glsl": "./src/gpu/kernels/shaders/includes/global.glsl"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/gpu/kernels/shaders/includes sync recursive ^\\.\\/.*$";

/***/ }),

/***/ "./src/gpu/kernels/shaders/includes/global.glsl":
/*!******************************************************!*\
  !*** ./src/gpu/kernels/shaders/includes/global.glsl ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#define threadLocation() ivec2(texCoord * texSize)\n#define outputSize() ivec2(texSize)\n#define threadPixel(img) textureLod((img), texCoord, 0.0f)\n#define pixelAt(img, pos) texelFetch((img), (pos), 0)\n#define pixelAtOffset(img, offset) textureLodOffset((img), texCoord, 0.0f, (offset))"

/***/ }),

/***/ "./src/gpu/kernels/shaders/keypoint-detectors/brisk.glsl":
/*!***************************************************************!*\
  !*** ./src/gpu/kernels/shaders/keypoint-detectors/brisk.glsl ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image, layerA, layerB;\nuniform float scaleA, scaleB, lgM, h;\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nfloat score = pixel.r;\nivec2 zero = ivec2(0, 0);\nivec2 sizeA = textureSize(layerA, 0);\nivec2 sizeB = textureSize(layerB, 0);\nvec2 mid = (texCoord * texSize) + vec2(0.5f, 0.5f);\nivec2 pa = clamp(ivec2(ceil(mid * scaleA - 1.0f)), zero, sizeA - 2);\nivec2 pb = clamp(ivec2(ceil(mid * scaleB - 1.0f)), zero, sizeB - 2);\nvec4 a00 = pixelAt(layerA, pa);\nvec4 a10 = pixelAt(layerA, pa + ivec2(1, 0));\nvec4 a01 = pixelAt(layerA, pa + ivec2(0, 1));\nvec4 a11 = pixelAt(layerA, pa + ivec2(1, 1));\nvec4 b00 = pixelAt(layerB, pb);\nvec4 b10 = pixelAt(layerB, pb + ivec2(1, 0));\nvec4 b01 = pixelAt(layerB, pb + ivec2(0, 1));\nvec4 b11 = pixelAt(layerB, pb + ivec2(1, 1));\nfloat maxScore = max(\nmax(max(a00.r, a10.r), max(a01.r, a11.r)),\nmax(max(b00.r, b10.r), max(b01.r, b11.r))\n);\ncolor = vec4(0.0f, pixel.gba);\nif(score < maxScore || score == 0.0f)\nreturn;\nvec2 ea = fract(mid * scaleA);\nvec2 eb = fract(mid * scaleB);\nfloat isa = a00.b * (1.0f - ea.x) * (1.0f - ea.y) +\na10.b * ea.x * (1.0f - ea.y) +\na01.b * (1.0f - ea.x) * ea.y +\na11.b * ea.x * ea.y;\nfloat isb = b00.b * (1.0f - eb.x) * (1.0f - eb.y) +\nb10.b * eb.x * (1.0f - eb.y) +\nb01.b * (1.0f - eb.x) * eb.y +\nb11.b * eb.x * eb.y;\nbool cond1 = (isa > score && isa > isb);\nbool cond2 = (isb > score && isb > isa);\ncolor = mix(\nmix(\npixel,\nvec4(isb, pixel.gb, b00.a),\nbvec4(cond2, cond2, cond2, cond2)\n),\nvec4(isa, pixel.gb, a00.a),\nbvec4(cond1, cond1, cond1, cond1)\n);\nfloat y1 = isa, y2 = isb, y3 = score;\nfloat x1 = lgM - (lgM + h) * a00.a;\nfloat x2 = lgM - (lgM + h) * b00.a;\nfloat x3 = lgM - (lgM + h) * pixel.a;\nfloat dn = (x1 - x2) * (x1 - x3) * (x2 - x3);\nif(abs(dn) < 0.00001f)\nreturn;\nfloat a = (x3 * (y2 - y1) + x2 * (y1 - y3) + x1 * (y3 - y2)) / dn;\nif(a >= 0.0f)\nreturn;\nfloat b = (x3 * x3 * (y1 - y2) + x2 * x2 * (y3 - y1) + x1 * x1 * (y2 - y3)) / dn;\nfloat c = (x2 * x3 * (x2 - x3) * y1 + x3 * x1 * (x3 - x1) * y2 + x1 * x2 * (x1 - x2) * y3) / dn;\nfloat xv = -b / (2.0f * a);\nfloat yv = c - (b * b) / (4.0f * a);\nif(xv < min(x1, min(x2, x3)) || xv > max(x1, max(x2, x3)))\nreturn;\nfloat interpolatedScale = (lgM - xv) / (lgM + h);\nfloat interpolatedScore = clamp(yv, 0.0f, 1.0f);\ncolor = vec4(interpolatedScore, pixel.gb, interpolatedScale);\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/keypoint-detectors/fast-score12.glsl":
/*!**********************************************************************!*\
  !*** ./src/gpu/kernels/shaders/keypoint-detectors/fast-score12.glsl ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nuniform float threshold;\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nfloat ifCorner = step(1.0f, pixel.r);\nfloat t = clamp(threshold, 0.0f, 1.0f);\nfloat c = pixel.g;\nfloat ct = c + t, c_t = c - t;\nfloat p0 = pixelAtOffset(image, ivec2(0, 2)).g;\nfloat p1 = pixelAtOffset(image, ivec2(1, 2)).g;\nfloat p2 = pixelAtOffset(image, ivec2(2, 1)).g;\nfloat p3 = pixelAtOffset(image, ivec2(2, 0)).g;\nfloat p4 = pixelAtOffset(image, ivec2(2, -1)).g;\nfloat p5 = pixelAtOffset(image, ivec2(1, -2)).g;\nfloat p6 = pixelAtOffset(image, ivec2(0, -2)).g;\nfloat p7 = pixelAtOffset(image, ivec2(-1, -2)).g;\nfloat p8 = pixelAtOffset(image, ivec2(-2, -1)).g;\nfloat p9 = pixelAtOffset(image, ivec2(-2, 0)).g;\nfloat p10 = pixelAtOffset(image, ivec2(-2, 1)).g;\nfloat p11 = pixelAtOffset(image, ivec2(-1, 2)).g;\nfloat bs = 0.0f, ds = 0.0f;\nbs += max(c_t - p0, 0.0f);  ds += max(p0 - ct, 0.0f);\nbs += max(c_t - p1, 0.0f);  ds += max(p1 - ct, 0.0f);\nbs += max(c_t - p2, 0.0f);  ds += max(p2 - ct, 0.0f);\nbs += max(c_t - p3, 0.0f);  ds += max(p3 - ct, 0.0f);\nbs += max(c_t - p4, 0.0f);  ds += max(p4 - ct, 0.0f);\nbs += max(c_t - p5, 0.0f);  ds += max(p5 - ct, 0.0f);\nbs += max(c_t - p6, 0.0f);  ds += max(p6 - ct, 0.0f);\nbs += max(c_t - p7, 0.0f);  ds += max(p7 - ct, 0.0f);\nbs += max(c_t - p8, 0.0f);  ds += max(p8 - ct, 0.0f);\nbs += max(c_t - p9, 0.0f);  ds += max(p9 - ct, 0.0f);\nbs += max(c_t - p10, 0.0f); ds += max(p10 - ct, 0.0f);\nbs += max(c_t - p11, 0.0f); ds += max(p11 - ct, 0.0f);\nfloat score = max(bs, ds) / 12.0f;\ncolor = vec4(score * ifCorner, pixel.g, score, pixel.a);\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/keypoint-detectors/fast-score16.glsl":
/*!**********************************************************************!*\
  !*** ./src/gpu/kernels/shaders/keypoint-detectors/fast-score16.glsl ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nuniform float threshold;\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nfloat ifCorner = step(1.0f, pixel.r);\nfloat t = clamp(threshold, 0.0f, 1.0f);\nfloat c = pixel.g;\nfloat ct = c + t, c_t = c - t;\nfloat p0 = pixelAtOffset(image, ivec2(0, 3)).g;\nfloat p1 = pixelAtOffset(image, ivec2(1, 3)).g;\nfloat p2 = pixelAtOffset(image, ivec2(2, 2)).g;\nfloat p3 = pixelAtOffset(image, ivec2(3, 1)).g;\nfloat p4 = pixelAtOffset(image, ivec2(3, 0)).g;\nfloat p5 = pixelAtOffset(image, ivec2(3, -1)).g;\nfloat p6 = pixelAtOffset(image, ivec2(2, -2)).g;\nfloat p7 = pixelAtOffset(image, ivec2(1, -3)).g;\nfloat p8 = pixelAtOffset(image, ivec2(0, -3)).g;\nfloat p9 = pixelAtOffset(image, ivec2(-1, -3)).g;\nfloat p10 = pixelAtOffset(image, ivec2(-2, -2)).g;\nfloat p11 = pixelAtOffset(image, ivec2(-3, -1)).g;\nfloat p12 = pixelAtOffset(image, ivec2(-3, 0)).g;\nfloat p13 = pixelAtOffset(image, ivec2(-3, 1)).g;\nfloat p14 = pixelAtOffset(image, ivec2(-2, 2)).g;\nfloat p15 = pixelAtOffset(image, ivec2(-1, 3)).g;\nfloat bs = 0.0f, ds = 0.0f;\nbs += max(c_t - p0, 0.0f);  ds += max(p0 - ct, 0.0f);\nbs += max(c_t - p1, 0.0f);  ds += max(p1 - ct, 0.0f);\nbs += max(c_t - p2, 0.0f);  ds += max(p2 - ct, 0.0f);\nbs += max(c_t - p3, 0.0f);  ds += max(p3 - ct, 0.0f);\nbs += max(c_t - p4, 0.0f);  ds += max(p4 - ct, 0.0f);\nbs += max(c_t - p5, 0.0f);  ds += max(p5 - ct, 0.0f);\nbs += max(c_t - p6, 0.0f);  ds += max(p6 - ct, 0.0f);\nbs += max(c_t - p7, 0.0f);  ds += max(p7 - ct, 0.0f);\nbs += max(c_t - p8, 0.0f);  ds += max(p8 - ct, 0.0f);\nbs += max(c_t - p9, 0.0f);  ds += max(p9 - ct, 0.0f);\nbs += max(c_t - p10, 0.0f); ds += max(p10 - ct, 0.0f);\nbs += max(c_t - p11, 0.0f); ds += max(p11 - ct, 0.0f);\nbs += max(c_t - p12, 0.0f); ds += max(p12 - ct, 0.0f);\nbs += max(c_t - p13, 0.0f); ds += max(p13 - ct, 0.0f);\nbs += max(c_t - p14, 0.0f); ds += max(p14 - ct, 0.0f);\nbs += max(c_t - p15, 0.0f); ds += max(p15 - ct, 0.0f);\nfloat score = max(bs, ds) / 16.0f;\ncolor = vec4(score * ifCorner, pixel.g, score, pixel.a);\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/keypoint-detectors/fast-score8.glsl":
/*!*********************************************************************!*\
  !*** ./src/gpu/kernels/shaders/keypoint-detectors/fast-score8.glsl ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nuniform float threshold;\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nfloat ifCorner = step(1.0f, pixel.r);\nfloat t = clamp(threshold, 0.0f, 1.0f);\nfloat c = pixel.g;\nfloat ct = c + t, c_t = c - t;\nfloat p0 = pixelAtOffset(image, ivec2(0, 1)).g;\nfloat p1 = pixelAtOffset(image, ivec2(1, 1)).g;\nfloat p2 = pixelAtOffset(image, ivec2(1, 0)).g;\nfloat p3 = pixelAtOffset(image, ivec2(1, -1)).g;\nfloat p4 = pixelAtOffset(image, ivec2(0, -1)).g;\nfloat p5 = pixelAtOffset(image, ivec2(-1, -1)).g;\nfloat p6 = pixelAtOffset(image, ivec2(-1, 0)).g;\nfloat p7 = pixelAtOffset(image, ivec2(-1, 1)).g;\nfloat bs = 0.0f, ds = 0.0f;\nbs += max(c_t - p0, 0.0f); ds += max(p0 - ct, 0.0f);\nbs += max(c_t - p1, 0.0f); ds += max(p1 - ct, 0.0f);\nbs += max(c_t - p2, 0.0f); ds += max(p2 - ct, 0.0f);\nbs += max(c_t - p3, 0.0f); ds += max(p3 - ct, 0.0f);\nbs += max(c_t - p4, 0.0f); ds += max(p4 - ct, 0.0f);\nbs += max(c_t - p5, 0.0f); ds += max(p5 - ct, 0.0f);\nbs += max(c_t - p6, 0.0f); ds += max(p6 - ct, 0.0f);\nbs += max(c_t - p7, 0.0f); ds += max(p7 - ct, 0.0f);\nfloat score = max(bs, ds) / 8.0f;\ncolor = vec4(score * ifCorner, pixel.g, score, pixel.a);\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/keypoint-detectors/fast-suppression.glsl":
/*!**************************************************************************!*\
  !*** ./src/gpu/kernels/shaders/keypoint-detectors/fast-suppression.glsl ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nvoid main()\n{\nfloat p0 = pixelAtOffset(image, ivec2(0, 1)).r;\nfloat p1 = pixelAtOffset(image, ivec2(1, 1)).r;\nfloat p2 = pixelAtOffset(image, ivec2(1, 0)).r;\nfloat p3 = pixelAtOffset(image, ivec2(1, -1)).r;\nfloat p4 = pixelAtOffset(image, ivec2(0, -1)).r;\nfloat p5 = pixelAtOffset(image, ivec2(-1, -1)).r;\nfloat p6 = pixelAtOffset(image, ivec2(-1, 0)).r;\nfloat p7 = pixelAtOffset(image, ivec2(-1, 1)).r;\nfloat m = max(\nmax(max(p0, p1), max(p2, p3)),\nmax(max(p4, p5), max(p6, p7))\n);\nvec4 pixel = threadPixel(image);\nfloat score = float(pixel.r >= m) * pixel.r;\ncolor = vec4(score, pixel.gba);\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/keypoint-detectors/fast5.glsl":
/*!***************************************************************!*\
  !*** ./src/gpu/kernels/shaders/keypoint-detectors/fast5.glsl ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nuniform float threshold;\nvoid main()\n{\nivec2 thread = threadLocation();\nivec2 size = outputSize();\nvec4 pixel = threadPixel(image);\ncolor = vec4(0.0f, pixel.gba);\nif(\nthread.x >= 3 && thread.x < size.x - 3 &&\nthread.y >= 3 && thread.y < size.y - 3\n) {\nfloat t = clamp(threshold, 0.0f, 1.0f);\nfloat c = pixel.g;\nfloat ct = c + t, c_t = c - t;\nfloat p0 = pixelAtOffset(image, ivec2(0, 1)).g;\nfloat p1 = pixelAtOffset(image, ivec2(1, 1)).g;\nfloat p2 = pixelAtOffset(image, ivec2(1, 0)).g;\nfloat p3 = pixelAtOffset(image, ivec2(1, -1)).g;\nfloat p4 = pixelAtOffset(image, ivec2(0, -1)).g;\nfloat p5 = pixelAtOffset(image, ivec2(-1, -1)).g;\nfloat p6 = pixelAtOffset(image, ivec2(-1, 0)).g;\nfloat p7 = pixelAtOffset(image, ivec2(-1, 1)).g;\nbool possibleCorner =\n((c_t > p1 || c_t > p5) && (c_t > p3 || c_t > p7)) ||\n((ct < p1  || ct < p5)  && (ct < p3  || ct < p7))  ;\nif(possibleCorner) {\nint bright = 0, dark = 0, bc = 0, dc = 0;\nif(c_t > p0) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p0) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p1) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p1) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p2) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p2) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p3) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p3) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p4) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p4) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p5) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p5) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p6) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p6) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p7) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p7) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(bright < 5 && dark < 5) {\nif(bc > 0 && bc < 5) do {\nif(c_t > p0)           bc += 1; else break;\nif(c_t > p1 && bc < 5) bc += 1; else break;\nif(c_t > p2 && bc < 5) bc += 1; else break;\nif(c_t > p3 && bc < 5) bc += 1; else break;\n} while(false);\nif(dc > 0 && dc < 5) do {\nif(ct < p0)           dc += 1; else break;\nif(ct < p1 && dc < 5) dc += 1; else break;\nif(ct < p2 && dc < 5) dc += 1; else break;\nif(ct < p3 && dc < 5) dc += 1; else break;\n} while(false);\nif(bc >= 5 || dc >= 5)\ncolor = vec4(1.0f, pixel.gba);\n}\nelse {\ncolor = vec4(1.0f, pixel.gba);\n}\n}\n}\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/keypoint-detectors/fast7.glsl":
/*!***************************************************************!*\
  !*** ./src/gpu/kernels/shaders/keypoint-detectors/fast7.glsl ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nuniform float threshold;\nvoid main()\n{\nivec2 thread = threadLocation();\nivec2 size = outputSize();\nvec4 pixel = threadPixel(image);\ncolor = vec4(0.0f, pixel.gba);\nif(\nthread.x >= 3 && thread.x < size.x - 3 &&\nthread.y >= 3 && thread.y < size.y - 3\n) {\nfloat t = clamp(threshold, 0.0f, 1.0f);\nfloat c = pixel.g;\nfloat ct = c + t, c_t = c - t;\nfloat p0 = pixelAtOffset(image, ivec2(0, 2)).g;\nfloat p1 = pixelAtOffset(image, ivec2(1, 2)).g;\nfloat p2 = pixelAtOffset(image, ivec2(2, 1)).g;\nfloat p3 = pixelAtOffset(image, ivec2(2, 0)).g;\nfloat p4 = pixelAtOffset(image, ivec2(2, -1)).g;\nfloat p5 = pixelAtOffset(image, ivec2(1, -2)).g;\nfloat p6 = pixelAtOffset(image, ivec2(0, -2)).g;\nfloat p7 = pixelAtOffset(image, ivec2(-1, -2)).g;\nfloat p8 = pixelAtOffset(image, ivec2(-2, -1)).g;\nfloat p9 = pixelAtOffset(image, ivec2(-2, 0)).g;\nfloat p10 = pixelAtOffset(image, ivec2(-2, 1)).g;\nfloat p11 = pixelAtOffset(image, ivec2(-1, 2)).g;\nbool possibleCorner =\n((c_t > p0 || c_t > p6) && (c_t > p3 || c_t > p9)) ||\n((ct < p0  || ct < p6)  && (ct < p3  || ct < p9))  ;\nif(possibleCorner) {\nint bright = 0, dark = 0, bc = 0, dc = 0;\nif(c_t > p0) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p0) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p1) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p1) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p2) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p2) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p3) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p3) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p4) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p4) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p5) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p5) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p6) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p6) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p7) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p7) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p8) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p8) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p9) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p9) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p10) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p10) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p11) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p11) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(bright < 7 && dark < 7) {\nif(bc > 0 && bc < 7) do {\nif(c_t > p0)           bc += 1; else break;\nif(c_t > p1 && bc < 7) bc += 1; else break;\nif(c_t > p2 && bc < 7) bc += 1; else break;\nif(c_t > p3 && bc < 7) bc += 1; else break;\nif(c_t > p4 && bc < 7) bc += 1; else break;\nif(c_t > p5 && bc < 7) bc += 1; else break;\n} while(false);\nif(dc > 0 && dc < 7) do {\nif(ct < p0)           dc += 1; else break;\nif(ct < p1 && dc < 7) dc += 1; else break;\nif(ct < p2 && dc < 7) dc += 1; else break;\nif(ct < p3 && dc < 7) dc += 1; else break;\nif(ct < p4 && dc < 7) dc += 1; else break;\nif(ct < p5 && dc < 7) dc += 1; else break;\n} while(false);\nif(bc >= 7 || dc >= 7)\ncolor = vec4(1.0f, pixel.gba);\n}\nelse {\ncolor = vec4(1.0f, pixel.gba);\n}\n}\n}\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/keypoint-detectors/fast9.glsl":
/*!***************************************************************!*\
  !*** ./src/gpu/kernels/shaders/keypoint-detectors/fast9.glsl ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nuniform float threshold;\nvoid main()\n{\nivec2 thread = threadLocation();\nivec2 size = outputSize();\nvec4 pixel = threadPixel(image);\ncolor = vec4(0.0f, pixel.gba);\nif(\nthread.x >= 3 && thread.x < size.x - 3 &&\nthread.y >= 3 && thread.y < size.y - 3\n) {\nfloat t = clamp(threshold, 0.0f, 1.0f);\nfloat c = pixel.g;\nfloat ct = c + t, c_t = c - t;\nfloat p0 = pixelAtOffset(image, ivec2(0, 3)).g;\nfloat p1 = pixelAtOffset(image, ivec2(1, 3)).g;\nfloat p2 = pixelAtOffset(image, ivec2(2, 2)).g;\nfloat p3 = pixelAtOffset(image, ivec2(3, 1)).g;\nfloat p4 = pixelAtOffset(image, ivec2(3, 0)).g;\nfloat p5 = pixelAtOffset(image, ivec2(3, -1)).g;\nfloat p6 = pixelAtOffset(image, ivec2(2, -2)).g;\nfloat p7 = pixelAtOffset(image, ivec2(1, -3)).g;\nfloat p8 = pixelAtOffset(image, ivec2(0, -3)).g;\nfloat p9 = pixelAtOffset(image, ivec2(-1, -3)).g;\nfloat p10 = pixelAtOffset(image, ivec2(-2, -2)).g;\nfloat p11 = pixelAtOffset(image, ivec2(-3, -1)).g;\nfloat p12 = pixelAtOffset(image, ivec2(-3, 0)).g;\nfloat p13 = pixelAtOffset(image, ivec2(-3, 1)).g;\nfloat p14 = pixelAtOffset(image, ivec2(-2, 2)).g;\nfloat p15 = pixelAtOffset(image, ivec2(-1, 3)).g;\nbool possibleCorner =\n((c_t > p0 || c_t > p8) && (c_t > p4 || c_t > p12)) ||\n((ct < p0  || ct < p8)  && (ct < p4  || ct < p12))  ;\nif(possibleCorner) {\nint bright = 0, dark = 0, bc = 0, dc = 0;\nif(c_t > p0) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p0) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p1) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p1) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p2) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p2) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p3) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p3) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p4) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p4) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p5) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p5) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p6) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p6) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p7) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p7) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p8) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p8) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p9) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p9) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p10) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p10) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p11) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p11) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p12) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p12) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p13) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p13) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p14) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p14) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p15) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p15) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(bright < 9 && dark < 9) {\nif(bc > 0 && bc < 9) do {\nif(c_t > p0)           bc += 1; else break;\nif(c_t > p1 && bc < 9) bc += 1; else break;\nif(c_t > p2 && bc < 9) bc += 1; else break;\nif(c_t > p3 && bc < 9) bc += 1; else break;\nif(c_t > p4 && bc < 9) bc += 1; else break;\nif(c_t > p5 && bc < 9) bc += 1; else break;\nif(c_t > p6 && bc < 9) bc += 1; else break;\nif(c_t > p7 && bc < 9) bc += 1; else break;\n} while(false);\nif(dc > 0 && dc < 9) do {\nif(ct < p0)           dc += 1; else break;\nif(ct < p1 && dc < 9) dc += 1; else break;\nif(ct < p2 && dc < 9) dc += 1; else break;\nif(ct < p3 && dc < 9) dc += 1; else break;\nif(ct < p4 && dc < 9) dc += 1; else break;\nif(ct < p5 && dc < 9) dc += 1; else break;\nif(ct < p6 && dc < 9) dc += 1; else break;\nif(ct < p7 && dc < 9) dc += 1; else break;\n} while(false);\nif(bc >= 9 || dc >= 9)\ncolor = vec4(1.0f, pixel.gba);\n}\nelse {\ncolor = vec4(1.0f, pixel.gba);\n}\n}\n}\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/keypoint-detectors/fast9ml.glsl":
/*!*****************************************************************!*\
  !*** ./src/gpu/kernels/shaders/keypoint-detectors/fast9ml.glsl ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nuniform float threshold;\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nivec2 thread = threadLocation();\nivec2 size = outputSize();\ncolor = vec4(0.0f, pixel.gba);\nif(thread.x < 3 || thread.y < 3 || thread.x >= size.x - 3 || thread.y >= size.y - 3)\nreturn;\nfloat t = clamp(threshold, 0.0f, 1.0f);\nfloat c = pixel.g;\nfloat ct = c + t, c_t = c - t;\nfloat p0 = pixelAtOffset(image, ivec2(0, 3)).g;\nfloat p4 = pixelAtOffset(image, ivec2(3, 0)).g;\nfloat p8 = pixelAtOffset(image, ivec2(0, -3)).g;\nfloat p12 = pixelAtOffset(image, ivec2(-3, 0)).g;\nif(!(\n((c_t > p0 || c_t > p8) && (c_t > p4 || c_t > p12)) ||\n((ct < p0  || ct < p8)  && (ct < p4  || ct < p12))\n))\nreturn;\nfloat p1 = pixelAtOffset(image, ivec2(1, 3)).g;\nfloat p2 = pixelAtOffset(image, ivec2(2, 2)).g;\nfloat p3 = pixelAtOffset(image, ivec2(3, 1)).g;\nfloat p5 = pixelAtOffset(image, ivec2(3, -1)).g;\nfloat p6 = pixelAtOffset(image, ivec2(2, -2)).g;\nfloat p7 = pixelAtOffset(image, ivec2(1, -3)).g;\nfloat p9 = pixelAtOffset(image, ivec2(-1, -3)).g;\nfloat p10 = pixelAtOffset(image, ivec2(-2, -2)).g;\nfloat p11 = pixelAtOffset(image, ivec2(-3, -1)).g;\nfloat p13 = pixelAtOffset(image, ivec2(-3, 1)).g;\nfloat p14 = pixelAtOffset(image, ivec2(-2, 2)).g;\nfloat p15 = pixelAtOffset(image, ivec2(-1, 3)).g;\nif(p0 > ct)\nif(p1 > ct)\nif(p2 > ct)\nif(p3 > ct)\nif(p4 > ct)\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse if(p7 < c_t)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse if(p14 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse if(p6 < c_t)\nif(p15 > ct)\nif(p13 > ct)\nif(p14 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse if(p13 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p14 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p13 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse if(p13 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p5 < c_t)\nif(p14 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\nif(p11 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p12 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\nif(p11 < c_t)\nif(p13 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p14 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p6 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\nif(p11 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p12 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\nif(p11 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\nif(p6 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p4 < c_t)\nif(p13 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p11 < c_t)\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\nif(p12 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p13 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p6 < c_t)\nif(p5 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p14 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p11 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p6 < c_t)\nif(p5 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p14 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p3 < c_t)\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p4 > ct)\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p10 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p11 < c_t)\nif(p6 < c_t)\nif(p5 < c_t)\nif(p4 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p12 < c_t)\nif(p13 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p4 > ct)\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p10 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p6 < c_t)\nif(p5 < c_t)\nif(p4 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p13 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\nif(p13 < c_t)\nif(p14 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p13 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p2 < c_t)\nif(p9 > ct)\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p4 > ct)\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p3 > ct)\nif(p4 > ct)\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p9 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p10 < c_t)\nif(p6 < c_t)\nif(p5 < c_t)\nif(p4 < c_t)\nif(p3 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p11 < c_t)\nif(p12 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p9 > ct)\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p4 > ct)\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p3 > ct)\nif(p4 > ct)\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p9 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p10 < c_t)\nif(p11 < c_t)\nif(p6 < c_t)\nif(p5 < c_t)\nif(p4 < c_t)\nif(p3 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p12 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\nif(p12 < c_t)\nif(p13 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p1 < c_t)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 > ct)\nif(p7 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p4 > ct)\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p3 > ct)\nif(p4 > ct)\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p2 > ct)\nif(p3 > ct)\nif(p4 > ct)\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p8 < c_t)\nif(p7 < c_t)\nif(p9 < c_t)\nif(p6 < c_t)\nif(p5 < c_t)\nif(p4 < c_t)\nif(p3 < c_t)\nif(p2 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p10 < c_t)\nif(p11 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 > ct)\nif(p7 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p4 > ct)\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p3 > ct)\nif(p4 > ct)\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p2 > ct)\nif(p3 > ct)\nif(p4 > ct)\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p8 < c_t)\nif(p7 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\nif(p6 < c_t)\nif(p5 < c_t)\nif(p4 < c_t)\nif(p3 < c_t)\nif(p2 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p11 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\nif(p11 < c_t)\nif(p12 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p0 < c_t)\nif(p1 > ct)\nif(p8 > ct)\nif(p7 > ct)\nif(p9 > ct)\nif(p6 > ct)\nif(p5 > ct)\nif(p4 > ct)\nif(p3 > ct)\nif(p2 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p10 > ct)\nif(p11 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 < c_t)\nif(p7 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p4 < c_t)\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p3 < c_t)\nif(p4 < c_t)\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p2 < c_t)\nif(p3 < c_t)\nif(p4 < c_t)\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p1 < c_t)\nif(p2 > ct)\nif(p9 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p10 > ct)\nif(p6 > ct)\nif(p5 > ct)\nif(p4 > ct)\nif(p3 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p11 > ct)\nif(p12 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p9 < c_t)\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p4 < c_t)\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p3 < c_t)\nif(p4 < c_t)\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p2 < c_t)\nif(p3 > ct)\nif(p10 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p11 > ct)\nif(p6 > ct)\nif(p5 > ct)\nif(p4 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p12 > ct)\nif(p13 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p4 < c_t)\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p3 < c_t)\nif(p4 > ct)\nif(p13 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p6 > ct)\nif(p5 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p14 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p13 < c_t)\nif(p11 > ct)\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\nif(p12 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p11 < c_t)\nif(p12 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p5 > ct)\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p4 < c_t)\nif(p5 > ct)\nif(p14 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p6 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p14 < c_t)\nif(p12 > ct)\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\nif(p11 > ct)\nif(p13 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p12 < c_t)\nif(p13 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\nif(p11 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p6 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p5 < c_t)\nif(p6 > ct)\nif(p15 < c_t)\nif(p13 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p14 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p13 < c_t)\nif(p14 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p6 < c_t)\nif(p7 > ct)\nif(p14 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse if(p7 < c_t)\nif(p8 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p13 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p13 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p12 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\nif(p11 > ct)\nif(p13 > ct)\nif(p14 > ct)\nif(p6 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\nif(p11 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p11 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p10 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p6 > ct)\nif(p5 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p14 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p10 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p6 > ct)\nif(p5 > ct)\nif(p4 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p13 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\nif(p13 > ct)\nif(p14 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p13 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p4 < c_t)\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p9 > ct)\nif(p7 > ct)\nif(p8 > ct)\nif(p10 > ct)\nif(p11 > ct)\nif(p6 > ct)\nif(p5 > ct)\nif(p4 > ct)\nif(p3 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p12 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\nif(p12 > ct)\nif(p13 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p9 < c_t)\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p4 < c_t)\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p3 < c_t)\nif(p4 < c_t)\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\nif(p8 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p8 > ct)\nif(p7 > ct)\nif(p9 > ct)\nif(p10 > ct)\nif(p6 > ct)\nif(p5 > ct)\nif(p4 > ct)\nif(p3 > ct)\nif(p2 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p11 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\nif(p11 > ct)\nif(p12 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p8 < c_t)\nif(p9 < c_t)\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p6 < c_t)\nif(p7 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p4 < c_t)\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p3 < c_t)\nif(p4 < c_t)\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p2 < c_t)\nif(p3 < c_t)\nif(p4 < c_t)\nif(p5 < c_t)\nif(p6 < c_t)\nif(p7 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p7 > ct)\nif(p8 > ct)\nif(p9 > ct)\nif(p6 > ct)\nif(p5 > ct)\nif(p4 > ct)\nif(p3 > ct)\nif(p2 > ct)\nif(p1 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p10 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\nif(p10 > ct)\nif(p11 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p10 > ct)\nif(p11 > ct)\nif(p12 > ct)\nif(p13 > ct)\nif(p14 > ct)\nif(p15 > ct)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse if(p7 < c_t)\nif(p8 < c_t)\nif(p9 < c_t)\nif(p6 < c_t)\nif(p5 < c_t)\nif(p4 < c_t)\nif(p3 < c_t)\nif(p2 < c_t)\nif(p1 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\nif(p10 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\nif(p10 < c_t)\nif(p11 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\nif(p10 < c_t)\nif(p11 < c_t)\nif(p12 < c_t)\nif(p13 < c_t)\nif(p14 < c_t)\nif(p15 < c_t)\ncolor = vec4(1.0f, pixel.gba);\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\nelse\n;\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/pyramids.js":
/*!*********************************************!*\
  !*** ./src/gpu/kernels/shaders/pyramids.js ***!
  \*********************************************/
/*! exports provided: upsample2, downsample2, upsample3, downsample3, mergeKeypoints, mergeKeypointsAtConsecutiveLevels, normalizeKeypoints, crop, setScale, scale */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "upsample2", function() { return upsample2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "downsample2", function() { return downsample2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "upsample3", function() { return upsample3; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "downsample3", function() { return downsample3; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeKeypoints", function() { return mergeKeypoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeKeypointsAtConsecutiveLevels", function() { return mergeKeypointsAtConsecutiveLevels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalizeKeypoints", function() { return normalizeKeypoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "crop", function() { return crop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setScale", function() { return setScale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scale", function() { return scale; });
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
 * pyramids.js
 * Image pyramids & scale-space utilities
 */

// pyramid generation
const upsample2 = image => __webpack_require__(/*! ./pyramids/upsample2.glsl */ "./src/gpu/kernels/shaders/pyramids/upsample2.glsl");
const downsample2 = image => __webpack_require__(/*! ./pyramids/downsample2.glsl */ "./src/gpu/kernels/shaders/pyramids/downsample2.glsl");
const upsample3 = image => __webpack_require__(/*! ./pyramids/upsample3.glsl */ "./src/gpu/kernels/shaders/pyramids/upsample3.glsl");
const downsample3 = image => __webpack_require__(/*! ./pyramids/downsample3.glsl */ "./src/gpu/kernels/shaders/pyramids/downsample3.glsl");

// utilities for merging keypoints across multiple scales
const mergeKeypoints = (target, source) => __webpack_require__(/*! ./pyramids/merge-keypoints.glsl */ "./src/gpu/kernels/shaders/pyramids/merge-keypoints.glsl");
const mergeKeypointsAtConsecutiveLevels = (largerImage, smallerImage) => __webpack_require__(/*! ./pyramids/merge-keypoints-at-consecutive-levels.glsl */ "./src/gpu/kernels/shaders/pyramids/merge-keypoints-at-consecutive-levels.glsl");
const normalizeKeypoints = (image, imageScale) => __webpack_require__(/*! ./pyramids/normalize-keypoints.glsl */ "./src/gpu/kernels/shaders/pyramids/normalize-keypoints.glsl");

// misc
const crop = image => __webpack_require__(/*! ./pyramids/crop.glsl */ "./src/gpu/kernels/shaders/pyramids/crop.glsl");

// image scale

/*
 * Image scale is encoded in the alpha channel (a)
 * according to the following model:
 *
 * a(x) = (log2(M) - log2(x)) / (log2(M) + h)
 *
 * where x := scale of the image in the pyramid
 *            it may be 1, 0.5, 0.25, 0.125...
 *            also 1.5, 0.75, 0.375... (intra-layers)
 *
 *       h := height (depth) of the pyramid, an integer
 *
 *       M := scale upper bound: the maximum supported
 *            scale x for a pyramid layer, a constant
 *            that is preferably a power of two
 *            (e.g., M = 2)
 *
 *
 *
 * This model has some neat properties:
 *
 * Scale image by factor s:
 * a(s*x) = a(x) - log2(s) / (log2(M) + h)
 *
 * Log of scale (scale-axis):
 * log2(x) = log2(M) - (log2(M) + h) * a(x)
 *
 * Bounded output:
 * 0 <= a(x) < 1
 *
 * Since x <= M, it follows that a(x) >= 0 for all x
 * Since x > 1/2^h, it follows that a(x) < 1 for all x
 * Thus, if alpha channel = 1.0, we have no scale data
 *
 *
 *
 * A note on image scale:
 *
 * scale = 1 means an image with its original size
 * scale = 2 means double the size (4x the area)
 * scale = 0.5 means half the size (1/4 the area)
 * and so on...
 */

function setScale(scale, pyramidHeight, pyramidMaxScale)
{
    const lgM = Math.log2(pyramidMaxScale), eps = 1e-5;
    const pyramidMinScale = Math.pow(2, -pyramidHeight) + eps;
    const x = Math.max(pyramidMinScale, Math.min(scale, pyramidMaxScale));
    const alpha = (lgM - Math.log2(x)) / (lgM + pyramidHeight);

    return (image) => `
    uniform sampler2D image;

    void main()
    {
        color = vec4(threadPixel(image).rgb, float(${alpha}));
    }
    `;
}

function scale(scaleFactor, pyramidHeight, pyramidMaxScale)
{
    const lgM = Math.log2(pyramidMaxScale);
    const s = Math.max(1e-5, scaleFactor);
    const delta = -Math.log2(s) / (lgM + pyramidHeight);

    return (image) => `
    uniform sampler2D image;

    void main()
    {
        vec4 pixel = threadPixel(image);
        float alpha = clamp(pixel.a + float(${delta}), 0.0f, 1.0f);

        color = vec4(pixel.rgb, alpha);
    }
    `;
}

/***/ }),

/***/ "./src/gpu/kernels/shaders/pyramids/crop.glsl":
/*!****************************************************!*\
  !*** ./src/gpu/kernels/shaders/pyramids/crop.glsl ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nvoid main()\n{\nivec2 thread = threadLocation();\nivec2 size = outputSize();\nivec2 zero = ivec2(0, 0);\ncolor = pixelAt(image, clamp(thread, zero, size - 1));\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/pyramids/downsample2.glsl":
/*!***********************************************************!*\
  !*** ./src/gpu/kernels/shaders/pyramids/downsample2.glsl ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nvoid main()\n{\nivec2 thread = threadLocation();\nivec2 pos = min(thread * 2, textureSize(image, 0) - 1);\ncolor = pixelAt(image, pos);\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/pyramids/downsample3.glsl":
/*!***********************************************************!*\
  !*** ./src/gpu/kernels/shaders/pyramids/downsample3.glsl ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nvoid main()\n{\nivec2 thread = threadLocation();\nivec2 pos = min(thread * 3, textureSize(image, 0) - 1);\ncolor = pixelAt(image, pos);\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/pyramids/merge-keypoints-at-consecutive-levels.glsl":
/*!*************************************************************************************!*\
  !*** ./src/gpu/kernels/shaders/pyramids/merge-keypoints-at-consecutive-levels.glsl ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D largerImage;\nuniform sampler2D smallerImage;\nvoid main()\n{\nivec2 thread = threadLocation();\nvec4 lg = pixelAt(largerImage, min(thread, textureSize(largerImage, 0) - 1));\nvec4 sm = pixelAt(smallerImage, min(thread / 2, textureSize(smallerImage, 0) - 1));\nbool cond = (((thread.x & 1) + (thread.y & 1)) == 0) && (sm.r > lg.r);\ncolor = mix(\nlg,\nvec4(sm.r, lg.gb, sm.a),\nbvec4(cond, cond, cond, cond)\n);\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/pyramids/merge-keypoints.glsl":
/*!***************************************************************!*\
  !*** ./src/gpu/kernels/shaders/pyramids/merge-keypoints.glsl ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D target;\nuniform sampler2D source;\nvoid main()\n{\nvec4 a = threadPixel(target);\nvec4 b = threadPixel(source);\nbool cond = (b.r > a.r);\ncolor = mix(\na,\nvec4(b.r, a.gb, b.a),\nbvec4(cond, cond, cond, cond)\n);\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/pyramids/normalize-keypoints.glsl":
/*!*******************************************************************!*\
  !*** ./src/gpu/kernels/shaders/pyramids/normalize-keypoints.glsl ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nuniform float imageScale;\n#define B2(expr) bvec2((expr),(expr))\nvoid main()\n{\nivec2 thread = threadLocation();\nivec2 size = outputSize();\nivec2 scaled = ivec2((texCoord * texSize) * imageScale);\nivec2 imageSize = textureSize(image, 0);\nvec4 pixel = threadPixel(image);\nvec4 p0 = pixelAt(image, min(scaled, imageSize-1));\nvec4 p1 = pixelAt(image, min(scaled + ivec2(0, 1), imageSize-1));\nvec4 p2 = pixelAt(image, min(scaled + ivec2(1, 0), imageSize-1));\nvec4 p3 = pixelAt(image, min(scaled + ivec2(1, 1), imageSize-1));\nbool gotCorner = ((thread.x & 1) + (thread.y & 1) == 0) &&\n(scaled.x + 1 < size.x && scaled.y + 1 < size.y) &&\n(p0.r + p1.r + p2.r + p3.r > 0.0f);\nvec2 best = mix(\nvec2(0.0f, pixel.a),\nmix(\nmix(\nmix(p3.ra, p1.ra, B2(p1.r > p3.r)),\nmix(p2.ra, p1.ra, B2(p1.r > p2.r)),\nB2(p2.r > p3.r)\n),\nmix(\nmix(p3.ra, p0.ra, B2(p0.r > p3.r)),\nmix(p2.ra, p0.ra, B2(p0.r > p2.r)),\nB2(p2.r > p3.r)\n),\nB2(p0.r > p1.r)\n),\nB2(gotCorner)\n);\ncolor = vec4(best.x, pixel.gb, best.y);\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/pyramids/upsample2.glsl":
/*!*********************************************************!*\
  !*** ./src/gpu/kernels/shaders/pyramids/upsample2.glsl ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nvoid main()\n{\nivec2 thread = threadLocation();\nvec4 pixel = pixelAt(image, thread / 2);\nbool cond = (((thread.x + thread.y) & 1) == 0);\ncolor = mix(\nvec4(0.0f, 0.0f, 0.0f, pixel.a),\npixel,\nbvec4(cond, cond, cond, cond)\n);\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/pyramids/upsample3.glsl":
/*!*********************************************************!*\
  !*** ./src/gpu/kernels/shaders/pyramids/upsample3.glsl ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nvoid main()\n{\nivec2 thread = threadLocation();\nvec4 pixel = pixelAt(image, thread / 3);\nbool cond = ((thread.x - (thread.y % 3) + 3) % 3) == 0;\ncolor = mix(\nvec4(0.0f, 0.0f, 0.0f, pixel.a),\npixel,\nbvec4(cond, cond, cond, cond)\n);\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/utils.js":
/*!******************************************!*\
  !*** ./src/gpu/kernels/shaders/utils.js ***!
  \******************************************/
/*! exports provided: identity, flipY */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "identity", function() { return identity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flipY", function() { return flipY; });
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

// Identity shader: no-operation
const identity = (image) => __webpack_require__(/*! ./utils/identity.glsl */ "./src/gpu/kernels/shaders/utils/identity.glsl");

// Flip y-axis for output
const flipY = (image) => __webpack_require__(/*! ./utils/flip-y.glsl */ "./src/gpu/kernels/shaders/utils/flip-y.glsl");

/***/ }),

/***/ "./src/gpu/kernels/shaders/utils/flip-y.glsl":
/*!***************************************************!*\
  !*** ./src/gpu/kernels/shaders/utils/flip-y.glsl ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nvoid main() {\nivec2 pos = threadLocation();\npos.y = int(texSize.y) - 1 - pos.y;\ncolor = pixelAt(image, pos);\n}"

/***/ }),

/***/ "./src/gpu/kernels/shaders/utils/identity.glsl":
/*!*****************************************************!*\
  !*** ./src/gpu/kernels/shaders/utils/identity.glsl ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nvoid main()\n{\ncolor = threadPixel(image);\n}"

/***/ }),

/***/ "./src/gpu/kernels/utils.js":
/*!**********************************!*\
  !*** ./src/gpu/kernels/utils.js ***!
  \**********************************/
/*! exports provided: GPUUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GPUUtils", function() { return GPUUtils; });
/* harmony import */ var _gpu_kernel_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../gpu-kernel-group */ "./src/gpu/gpu-kernel-group.js");
/* harmony import */ var _shaders_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shaders/utils */ "./src/gpu/kernels/shaders/utils.js");
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
 * gpu-utils.js
 * GPU utilities
 */




/**
 * GPUUtils
 * Utility operations
 */
class GPUUtils extends _gpu_kernel_group__WEBPACK_IMPORTED_MODULE_0__["GPUKernelGroup"]
{
    /**
     * Class constructor
     * @param {GPUInstance} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            // no-operation
            .declare('identity', _shaders_utils__WEBPACK_IMPORTED_MODULE_1__["identity"])

            // output a texture from a pipeline
            .declare('output', _shaders_utils__WEBPACK_IMPORTED_MODULE_1__["flipY"],
                this.operation.displaysGraphics())
        ;
    }
}

/***/ }),

/***/ "./src/gpu/shader-preprocessor.js":
/*!****************************************!*\
  !*** ./src/gpu/shader-preprocessor.js ***!
  \****************************************/
/*! exports provided: ShaderPreprocessor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShaderPreprocessor", function() { return ShaderPreprocessor; });
/* harmony import */ var _gl_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gl-utils */ "./src/gpu/gl-utils.js");
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
 * shader-preprocessor.js
 * Custom preprocessor for shaders
 */



/**
 * Custom preprocessor for shaders
 */
class ShaderPreprocessor
{
    /**
     * Runs the preprocessor
     * @param {WebGL2RenderingContext} gl
     * @param {string} code 
     * @returns {string} preprocessed code
     */
    static run(gl, code)
    {
        ShaderPreprocessor._includeRegex = ShaderPreprocessor._includeRegex ||
            (ShaderPreprocessor._includeRegex = /^\s*@\s*include\s+"(.*?)"/gm);

        ShaderPreprocessor._commentsRegex = ShaderPreprocessor._commentsRegex ||
            (ShaderPreprocessor._commentsRegex = [ /\/\*(.|\s)*?\*\//g , /\/\/.*$/gm ]);

        // remove comments and run the preprocessor
        return String(code).replace(ShaderPreprocessor._commentsRegex[0], '')
                           .replace(ShaderPreprocessor._commentsRegex[1], '')
                           .replace(ShaderPreprocessor._includeRegex,
                                (_, filename) => readfileSync(gl, filename)
                            );
    }
}

 /**
 * Reads a shader from the /shaders/include/ folder
 * @param {WebGL2RenderingContext} gl
 * @param {string} filename
 * @returns {string}
 */
function readfileSync(gl, filename)
{
    if(String(filename).match(/^[a-zA-Z0-9_\-]+\.glsl$/))
        return __webpack_require__("./src/gpu/kernels/shaders/includes sync recursive ^\\.\\/.*$")("./" + filename);

    throw _gl_utils__WEBPACK_IMPORTED_MODULE_0__["GLUtils"].Error(`Shader preprocessor: can't read file \"${filename}\"`);
}

/***/ }),

/***/ "./src/gpu/speedy-gpu-core.js":
/*!************************************!*\
  !*** ./src/gpu/speedy-gpu-core.js ***!
  \************************************/
/*! exports provided: SpeedyGPUCore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyGPUCore", function() { return SpeedyGPUCore; });
/* harmony import */ var _speedy_program_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-program.js */ "./src/gpu/speedy-program.js");
/* harmony import */ var _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gl-utils.js */ "./src/gpu/gl-utils.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
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
 * speedy-gpu-core.js
 * GPGPU core
 */





/**
 * Speedy GPGPU core
 */
class SpeedyGPUCore
{
    /**
     * Class constructor
     * @param {number} width in pixels
     * @param {number} height in pixels
     */
    constructor(width, height)
    {
        // set dimensions
        this._width = Math.max(width | 0, 1);
        this._height = Math.max(height | 0, 1);

        // setup GPU
        this._canvas = createCanvas(this._width, this._height);
        this._gl = createWebGLContext(this._canvas);
        this._inputTexture = null;
    }

    /**
     * WebGL context
     * @returns {WebGL2RenderingContext}
     */
    get gl()
    {
        return this._gl;
    }

    /**
     * Canvas element
     * @returns {HTMLCanvasElement|OffscreenCanvas}
     */
    get canvas()
    {
        return this._canvas;
    }

    /**
     * Width in pixels
     * @returns {number}
     */
    get width()
    {
        return this._width;
    }

    /**
     * Height in pixels
     * @returns {number}
     */
    get height()
    {
        return this._height;
    }

    /**
     * Upload data to the GPU
     * @param {ImageBitmap|ImageData|ArrayBufferView|HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} data 
     * @param {number} [width]
     * @param {number} [height] 
     * @returns {WebGLTexture}
     */
    upload(data, width = -1, height = -1)
    {
        const gl = this._gl;

        // lost GL context?
        if(gl.isContextLost()) {
            _utils_utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].warning('Lost WebGL context');
            this._gl = createWebGLContext(this._canvas);
            this._inputTexture = null;
            return upload(data, width, height);
        }

        // default values
        if(width < 0)
            width = gl.canvas.width;
        if(height < 0)
            height = gl.canvas.height;

        // invalid dimensions?
        if(width == 0 || height == 0)
            throw _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].Error(`Can't upload an image of area 0`);

        // create or recreate & size texture
        if(this._inputTexture === null) {
            gl.canvas.width = Math.max(gl.canvas.width, width);
            gl.canvas.height = Math.max(gl.canvas.height, height);
            this._inputTexture = _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].createTexture(gl, gl.canvas.width, gl.canvas.height);
        }
        else if(width > gl.canvas.width || height > gl.canvas.height) {
            _utils_utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].warning(`Resizing input texture to ${width} x ${height}`)
            this._inputTexture = _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].destroyTexture(gl, inputTexture);
            return upload(data, width, height);
        }

        // done! note: the input texture is upside-down, i.e.,
        // flipped on the y-axis. We need to unflip it on the
        // output, so that (0,0) becomes the top-left corner
        _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].uploadToTexture(gl, this._inputTexture, data);
        return this._inputTexture;
    }

    /**
     * Create a SpeedyProgram to be run on this GPGPU core
     * @param {Function} shaderdecl A function that returns GLSL code
     * @param {object} [options] SpeedyProgram options
     * @returns {SpeedyProgram} new instance
     */
    createProgram(shaderdecl, options = { })
    {
        const gl = this._gl;

        return new _speedy_program_js__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgram"](gl, shaderdecl, {
            output: [ gl.canvas.width, gl.canvas.height ],
            ...options
        });
    }

    /**
     * Clear the internal canvas
     */
    clearCanvas()
    {
        const gl = this._gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
}

function createCanvas(width, height)
{
    const inWorker = (typeof importScripts === 'function') && (typeof WorkerGlobalScope !== 'undefined');

    if(inWorker) {
        if(typeof OffscreenCanvas !== 'function')
            throw _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].Error('OffscreenCanvas is not available in your browser. Please upgrade.');

        return new OffscreenCanvas(width, height);
    }
    else {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
}

function createWebGLContext(canvas)
{
    const gl = canvas.getContext('webgl2', {
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        preferLowPowerToHighPerformance: false,
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
    });

    if(!gl)
        throw _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].Error('WebGL2 is not available in your browser. Please upgrade.');

    return gl;
}

/***/ }),

/***/ "./src/gpu/speedy-program.js":
/*!***********************************!*\
  !*** ./src/gpu/speedy-program.js ***!
  \***********************************/
/*! exports provided: SpeedyProgram */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyProgram", function() { return SpeedyProgram; });
/* harmony import */ var _shader_preprocessor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shader-preprocessor.js */ "./src/gpu/shader-preprocessor.js");
/* harmony import */ var _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gl-utils.js */ "./src/gpu/gl-utils.js");
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
 * speedy-program.js
 * SpeedyProgram class
 */




const LOCATION_ATTRIB_POSITION = 0;
const LOCATION_ATTRIB_TEXCOORD = 1;

const DEFAULT_VERTEX_SHADER = `#version 300 es
in vec2 a_position;
in vec2 a_texCoord;
out vec2 texCoord;
 
void main() {
    gl_Position = vec4(a_position, 0, 1);
    texCoord = a_texCoord;
}`;

const DEFAULT_FRAGMENT_SHADER_PREFIX = `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
 
out vec4 color;
in vec2 texCoord;
uniform vec2 texSize;

@include "global.glsl"\n`;

const UNIFORM_TYPES = {
    'sampler2D':'uniform1i',
    'float':    'uniform1f',
    'int':      'uniform1i',
    'uint':     'uniform1ui',
    'bool':     'uniform1i',
    'vec2':     'uniform2f',
    'vec3':     'uniform3f',
    'vec4':     'uniform4f',
    'ivec2':    'uniform2i',
    'ivec3':    'uniform3i',
    'ivec4':    'uniform4i',
    'uvec2':    'uniform2ui',
    'uvec3':    'uniform3ui',
    'uvec4':    'uniform4ui',
    'bvec2':    'uniform2i',
    'bvec3':    'uniform3i',
    'bvec4':    'uniform4i',
};

/**
 * A SpeedyProgram is a Function that
 * runs GPU-accelerated GLSL code
 */
class SpeedyProgram extends Function
{
    /**
     * Creates a new SpeedyProgram
     * @param {WebGL2RenderingContext} gl WebGL context
     * @param {Function} shaderdecl shader declaration
     * @param {object} [options] user options
     */
    constructor(gl, shaderdecl, options = { })
    {
        super('...args', 'return this._self._call(...args)');
        this._self = this.bind(this);
        this._self._init(gl, shaderdecl, options);
        return this._self;
    }

    /**
     * Resize the output texture
     * @param {number} width 
     * @param {number} height 
     */
    resize(width, height)
    {
        const gl = this._gl;
        const options = this._options;

        // no need to resize?
        if(width === this._stdprog.width && height === this._stdprog.height)
            return;

        // get size
        width = Math.max(1, width | 0);
        height = Math.max(1, height | 0);

        // update options.output
        options.output[0] = width;
        options.output[1] = height;

        // resize stdprog
        if(options.renderToTexture)
            this._stdprog = detachFBO(this._stdprog);

        this._stdprog.width = width;
        this._stdprog.height = height;

        if(options.renderToTexture)
            this._stdprog = attachFBO(this._stdprog);

        // update texSize uniform
        const uniform = this._stdprog.uniform.texSize;
        (gl[UNIFORM_TYPES[uniform.type]])(uniform.location, width, height);
        //console.log(`Resized program to ${width} x ${height}`);

        // invalidate pixel buffers
        if(this._pixels !== null && this._pixels.length < width * height * 4)
            this._pixels = null;
    }

    /**
     * Read pixels from the output texture.
     * You may optionally specify a (x,y,width,height) sub-rectangle.
     * @param {number} [x]
     * @param {number} [y] 
     * @param {number} [width]
     * @param {number} [height]
     * @returns {Uint8Array} pixels in the RGBA format
     */
    readPixelsSync(x = 0, y = 0, width = -1, height = -1)
    {
        const gl = this._gl;
        const pixels = this._pixels || (this._pixels = new Uint8Array(this._stdprog.width * this._stdprog.height * 4));
        //const flippedPixels = this._flippedPixels || (this._flippedPixels = new Uint8Array(pixels.length));

        // default values
        if(width < 0)
            width = this._stdprog.width;
        if(height < 0)
            height = this._stdprog.height;

        // clamp values
        width = Math.min(width, this._stdprog.width);
        height = Math.min(height, this._stdprog.height);
        x = Math.max(0, Math.min(x, width - 1));
        y = Math.max(0, Math.min(y, height - 1));

        // read pixels
        if(this._stdprog.hasOwnProperty('fbo')) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._stdprog.fbo);
            gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        else
            gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        // flip y-axis
        /*
        let a, b;
        for(let i = 0; i < height; i++) {
            for(let j = 0; j < width; j++) {
                a = 4 * (i * width + j);
                b = 4 * ((height - 1 - i) * width + j);
                pixels[a + 0] = flippedPixels[b + 0];
                pixels[a + 1] = flippedPixels[b + 1];
                pixels[a + 2] = flippedPixels[b + 2];
                pixels[a + 3] = flippedPixels[b + 3];
            }
        }
        return this._flippedPixels;
        */

        // return cached array
        return this._pixels;
    }

    /**
     * WebGL rendering context
     * @returns {WebGL2RenderingContext}
     */
    get gl()
    {
        return this._gl;
    }

    /**
     * Read uniforms of the program (metadata)
     * @returns {object}
     */
    get uniforms()
    {
        return this._stdprog.uniform;
    }

    // Prepare the shader
    _init(gl, shaderdecl, options)
    {
        // default options
        options = {
            output: [ gl.drawingBufferWidth, gl.drawingBufferHeight ], // size of the output texture
            uniforms: { }, // user-defined constants (as uniforms)
            renderToTexture: true, // render results to a texture?
            recycleTexture: true, // recycle output texture? If false, you must manually destroy the output texture
            ...options // user-defined options
        };

        // get size
        let width = Math.max(1, options.output[0] | 0);
        let height = Math.max(1, options.output[1] | 0);
        options.output = [ width, height ];

        // need to resize the canvas?
        const canvas = gl.canvas;
        if(width > canvas.width)
            canvas.width = width;
        if(height > canvas.height)
            canvas.height = height;

        // create shader
        const source = shaderdecl();
        let stdprog = createStandardProgram(gl, width, height, source, options.uniforms);
        if(options.renderToTexture)
            stdprog = attachFBO(stdprog);

        // validate arguments
        const params = functionArguments(shaderdecl);
        for(let j = 0; j < params.length; j++) {
            if(!stdprog.uniform.hasOwnProperty(params[j])) {
                if(!stdprog.uniform.hasOwnProperty(params[j] + '[0]'))
                    throw _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].Error(`Can't run shader: expected uniform "${params[j]}"`);
            }
        }

        // store context
        this._gl = gl;
        this._source = source;
        this._options = options;
        this._stdprog = stdprog;
        this._params = params;
        this._pixels = null;
    }

    // Run the SpeedyProgram
    _call(...args)
    {
        const gl = this._gl;
        const options = this._options;
        const stdprog = this._stdprog;
        const params = this._params;
        
        // matching arguments?
        if(args.length != params.length)
            throw _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].Error(`Can't run shader: incorrect number of arguments`);

        // use program
        gl.useProgram(stdprog.program);

        // set uniforms[i] to args[i]
        for(let i = 0, texNo = 0; i < args.length; i++) {
            const argname = params[i];
            let uniform = stdprog.uniform[argname];

            if(uniform) {
                // uniform variable matches parameter name
                texNo = this._setUniform(uniform, args[i], texNo);
            }
            else if(stdprog.uniform.hasOwnProperty(argname + '[0]')) {
                // uniform array matches parameter name
                const array = args[i];
                if(stdprog.uniform.hasOwnProperty(`${argname}[${array.length}]`))
                    throw _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].Error(`Can't run shader: too few elements in array "${argname}"`);
                for(let j = 0; (uniform = stdprog.uniform[`${argname}[${j}]`]); j++)
                    texNo = this._setUniform(uniform, array[j], texNo);
            }
            else
                throw _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].Error(`Can't run shader: unknown parameter "${argname}": ${args[i]}`);
        }

        // render
        if(options.renderToTexture)
            gl.bindFramebuffer(gl.FRAMEBUFFER, stdprog.fbo);
        else
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.viewport(0, 0, stdprog.width, stdprog.height);
        gl.drawArrays(gl.TRIANGLE_STRIP,
                      0,        // offset
                      4);       // count       

        // output texture
        let outputTexture = null;
        if(options.renderToTexture) {
            outputTexture = stdprog.texture;
            if(!options.recycleTexture) {
                // clone outputTexture using the current framebuffer
                const cloneTexture = _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].createTexture(gl, stdprog.width, stdprog.height);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, cloneTexture);
                gl.copyTexSubImage2D(gl.TEXTURE_2D,     // target
                                     0,                 // mipmap level
                                     0,                 // xoffset
                                     0,                 // yoffset
                                     0,                 // x
                                     0,                 // y
                                     stdprog.width,     // width
                                     stdprog.height);   // height
                gl.bindTexture(gl.TEXTURE_2D, null);
                outputTexture = cloneTexture;
            }
        }

        // return texture (if available)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return outputTexture;
    }

    // set uniform to value
    // arrays of arbitrary size are not supported, only fixed-size vectors (vecX, ivecX, etc.)
    _setUniform(uniform, value, texNo)
    {
        const gl = this._gl;

        if(uniform.type == 'sampler2D') {
            // set texture
            if(texNo > gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
                throw _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].Error(`Can't bind ${texNo} textures to a program: max is ${gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS}`);
            else if(value === this._stdprog.texture)
                throw _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].Error(`Can't run shader: cannot use its output texture as an input to itself`);

            gl.activeTexture(gl.TEXTURE0 + texNo);
            gl.bindTexture(gl.TEXTURE_2D, value);
            gl.uniform1i(uniform.location, texNo);
            texNo++;
        }
        else {
            // set value
            if(typeof value == 'number' || typeof value == 'boolean')
                (gl[UNIFORM_TYPES[uniform.type]])(uniform.location, value);
            else if(Array.isArray(value))
                (gl[UNIFORM_TYPES[uniform.type]])(uniform.location, ...value);
            else
                throw _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].Error(`Can't run shader: unrecognized argument "${value}"`);
        }

        return texNo;
    }
}

// a dictionary specifying the types of all uniforms in the code
function autodetectUniforms(shaderSource)
{
    const sourceWithoutComments = shaderSource; // assume we've preprocessed the source already
    const regex = /uniform\s+(\w+)\s+([^;]+)/g;
    const uniforms = { };

    let match;
    while((match = regex.exec(sourceWithoutComments)) !== null) {
        const type = match[1];
        const names = match[2].split(',').map(name => name.trim()).filter(name => name); // trim & remove empty names
        for(const name of names) {
            if(name.endsWith(']')) {
                // is it an array?
                if(!(match = name.match(/(\w+)\s*\[\s*(\d+)\s*\]$/)))
                    throw _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].Error(`Unspecified array length for uniform "${name}" in the shader`);
                const [ array, length ] = [ match[1], Number(match[2]) ];
                for(let i = 0; i < length; i++)
                    uniforms[`${array}[${i}]`] = { type };
            }
            else {
                // regular uniform
                uniforms[name] = { type };
            }
        }
    }

    return Object.freeze(uniforms);
}

// names of function arguments
function functionArguments(fun)
{
    const code = fun.toString();
    const regex = code.startsWith('function') ? 'function\\s.*\\(([^)]*)\\)' :
                 (code.startsWith('(') ? '\\(([^)]*)\\).*=>' : '([^=]+).*=>');
    const match = new RegExp(regex).exec(code);

    if(match !== null) {
        const args = match[1].replace(/\/\*.*?\*\//g, ''); // remove comments
        return args.split(',').map(argname =>
            argname.replace(/=.*$/, '').trim() // remove default params & trim
        ).filter(argname =>
            argname // handle trailing commas
        );
    }
    else
        throw _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].Error(`Can't detect function arguments of ${code}`);

    return [];
}

// create VAO & VBO
function createStandardGeometry(gl)
{
    // cached values?
    const f = createStandardGeometry;
    const cache = f._cache || (f._cache = new WeakMap());
    if(cache.has(gl))
        return cache.get(gl);

    // configure the attributes of the vertex shader
    const vao = gl.createVertexArray(); // vertex array object
    const vbo = [ gl.createBuffer(), gl.createBuffer() ]; // vertex buffer objects
    gl.bindVertexArray(vao);

    // set the a_position attribute
    // using the current vbo
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo[0]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        // clip coordinates
        -1, -1,
        1, -1,
        -1, 1,
        1, 1,
    ]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(LOCATION_ATTRIB_POSITION, // attribute location
                           2,          // 2 components per vertex (x,y)
                           gl.FLOAT,   // type
                           false,      // don't normalize
                           0,          // default stride (tightly packed)
                           0);         // offset
    gl.enableVertexAttribArray(LOCATION_ATTRIB_POSITION);

    // set the a_texCoord attribute
    // using the current vbo
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo[1]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        // texture coordinates
        0, 0,
        1, 0,
        0, 1,
        1, 1,
    ]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(LOCATION_ATTRIB_TEXCOORD, // attribute location
                           2,          // 2 components per vertex (x,y)
                           gl.FLOAT,   // type
                           false,      // don't normalize
                           0,          // default stride (tightly packed)
                           0);         // offset
    gl.enableVertexAttribArray(LOCATION_ATTRIB_TEXCOORD);

    // unbind & return
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    const result = { vao, vbo };
    cache.set(gl, result);
    return result;
}

// a standard program runs a shader on an "image"
// uniforms: { 'name': <default_value>, ... }
function createStandardProgram(gl, width, height, fragmentShaderSource, uniforms = { })
{
    // compile shaders
    const source = _shader_preprocessor_js__WEBPACK_IMPORTED_MODULE_0__["ShaderPreprocessor"].run(gl, DEFAULT_FRAGMENT_SHADER_PREFIX + fragmentShaderSource);
    const program = _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].createProgram(gl, DEFAULT_VERTEX_SHADER, source);

    // setup geometry
    gl.bindAttribLocation(program, LOCATION_ATTRIB_POSITION, 'a_position');
    gl.bindAttribLocation(program, LOCATION_ATTRIB_TEXCOORD, 'a_texCoord');
    const vertexObjects = createStandardGeometry(gl);

    // define texSize
    width = Math.max(width | 0, 1);
    height = Math.max(height | 0, 1);
    uniforms.texSize = [ width, height ];

    // autodetect uniforms, get their locations,
    // define their setters and set their default values
    const uniform = autodetectUniforms(source);
    gl.useProgram(program);
    for(const u in uniform) {
        // get location
        uniform[u].location = gl.getUniformLocation(program, u);

        // validate type
        if(!UNIFORM_TYPES.hasOwnProperty(uniform[u].type))
            throw _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].Error(`Unknown uniform type: ${uniform[u].type}`);

        // must set a default value?
        if(uniforms.hasOwnProperty(u)) {
            const value = uniforms[u];
            if(typeof value == 'number' || typeof value == 'boolean')
                (gl[UNIFORM_TYPES[uniform[u].type]])(uniform[u].location, value);
            else if(typeof value == 'object')
                (gl[UNIFORM_TYPES[uniform[u].type]])(uniform[u].location, ...Array.from(value));
            else
                throw _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].Error(`Unrecognized uniform value: "${value}"`);
        }

        // note: to set the default value of array arr, pass
        // { 'arr[0]': val0, 'arr[1]': val1, ... } to uniforms
    }

    // done!
    return {
        program,
        gl,
        uniform,
        width,
        height,
        ...vertexObjects,
    };
}

// Attach a framebuffer object to a standard program
function attachFBO(stdprog)
{
    const gl = stdprog.gl;
    const width = stdprog.width;
    const height = stdprog.height;

    const texture = _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].createTexture(gl, width, height);
    const fbo = _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].createFramebuffer(gl, texture);

    return Object.assign(stdprog, {
        texture,
        fbo
    });
}

// Detach a framebuffer object from a standard program
function detachFBO(stdprog)
{
    if(stdprog.hasOwnProperty('fbo')) {
        _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].destroyFramebuffer(stdprog.gl, stdprog.fbo);
        delete stdprog.fbo;
    }

    if(stdprog.hasOwnProperty('texture')) {
        _gl_utils_js__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].destroyTexture(stdprog.gl, stdprog.texture);
        delete stdprog.texture;
    }

    return stdprog;
}

/***/ }),

/***/ "./src/speedy.js":
/*!***********************!*\
  !*** ./src/speedy.js ***!
  \***********************/
/*! exports provided: load, camera, pipeline, version, fps */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "load", function() { return load; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "camera", function() { return camera; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pipeline", function() { return pipeline; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "version", function() { return version; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fps", function() { return fps; });
/* harmony import */ var _core_speedy_media__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/speedy-media */ "./src/core/speedy-media.js");
/* harmony import */ var _core_speedy_pipeline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/speedy-pipeline */ "./src/core/speedy-pipeline.js");
/* harmony import */ var _utils_fps_counter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/fps-counter */ "./src/utils/fps-counter.js");
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
 * speedy.js
 * Speedy's entry point
 */





class Speedy
{
    /**
     * Loads a SpeedyMedia object based on the provided source element
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} sourceElement The source media
     * @returns {Promise<SpeedyMedia>}
     */
    static load(sourceElement)
    {
        return _core_speedy_media__WEBPACK_IMPORTED_MODULE_0__["SpeedyMedia"].load(sourceElement);
    }

    /**
     * Loads a camera stream
     * @param {number} [width] width of the stream
     * @param {number} [height] height of the stream
     * @param {object} [options] additional options to pass to getUserMedia()
     * @returns {Promise<SpeedyMedia>}
     */
    static camera(width = 426, height = 240, options = {})
    {
        return _core_speedy_media__WEBPACK_IMPORTED_MODULE_0__["SpeedyMedia"].loadCameraStream(width, height, options);
    }

    /**
     * Creates a new pipeline
     * @returns {SpeedyPipeline}
     */
    static pipeline()
    {
        return new _core_speedy_pipeline__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipeline"]();
    }

    /**
     * The version of the library
     * @returns {string} The version of the library
     */
    static get version()
    {
        return "0.3.0";
    }

    /**
     * The FPS rate. Get it as Speedy.fps.value
     * @returns {number} Frames per second (FPS)
     */
    static get fps()
    {
        return {
            get value() { return _utils_fps_counter__WEBPACK_IMPORTED_MODULE_2__["FPSCounter"].instance.fps; }
        };
    }
}

const load = Speedy.load;
const camera = Speedy.camera;
const pipeline = Speedy.pipeline;
const version = Speedy.version;
const fps = Speedy.fps;

/***/ }),

/***/ "./src/utils/errors.js":
/*!*****************************!*\
  !*** ./src/utils/errors.js ***!
  \*****************************/
/*! exports provided: SpeedyError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyError", function() { return SpeedyError; });
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
 * errors.js
 * Error classes
 */

/**
 * Error class for Speedy
 */
class SpeedyError extends Error
{
    /**
     * Class constructor
     * @param {string} message message text
     * @param  {...string} [args] additional text
     */
    constructor(message, ...args)
    {
        const text = [ message, ...args ].join(' ');
        console.error('[speedy-vision.js]', text);
        super(text);
    }

    /**
     * Error name
     * @returns {string}
     */
    get name()
    {
        return this.constructor.name;
    }
}

/***/ }),

/***/ "./src/utils/fps-counter.js":
/*!**********************************!*\
  !*** ./src/utils/fps-counter.js ***!
  \**********************************/
/*! exports provided: FPSCounter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FPSCounter", function() { return FPSCounter; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils/utils.js");
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
 * fps-counter.js
 * A FPS counter
 */


let instance = null;
const UPDATE_INTERVAL = 500; // in ms

class FPSCounter
{
    /**
     * Creates a new FPSCounter
     */
    /* private */ constructor()
    {
        this._fps = 60;
        this._frames = 0;
        this._updateInterval = UPDATE_INTERVAL;
        this._lastUpdate = performance.now();

        // this should never happen...
        if(instance !== null)
            _utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].fatal(`Can't have multiple instances of FPSCounter`);

        // start FPS counter
        requestAnimationFrame(this._update.bind(this));
    }

    /**
     * Gets an instance of the FPS counter.
     * Using lazy loading, i.e., we will not
     * create a FPS counter unless we need to!
     */
    static get instance()
    {
        if(instance === null)
            instance = new FPSCounter();

        return instance;
    }

    /**
     * Get the FPS rate
     * @returns {number} frames per second
     */
    get fps()
    {
        return this._fps;
    }

    // Updates the FPS counter
    _update()
    {
        const now = performance.now();
        const deltaTime = now - this._lastUpdate;

        if(deltaTime >= this._updateInterval) {
            this._fps = Math.round(this._frames / (deltaTime * 0.001));
            this._frames = 0;
            this._lastUpdate = now;
        }

        this._frames++;
        requestAnimationFrame(this._update.bind(this));
    }
}

/***/ }),

/***/ "./src/utils/tuner.js":
/*!****************************!*\
  !*** ./src/utils/tuner.js ***!
  \****************************/
/*! exports provided: TestTuner, StochasticTuner, GoldenSectionTuner, OnlineErrorTuner */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TestTuner", function() { return TestTuner; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StochasticTuner", function() { return StochasticTuner; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GoldenSectionTuner", function() { return GoldenSectionTuner; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OnlineErrorTuner", function() { return OnlineErrorTuner; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils/utils.js");
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
 * tuner.js
 * A device designed to minimize the (noisy) output of a unknown system
 */



/**
 * A Bucket of observations is used to give
 * statistical treatment to (noisy) data
 */
class Bucket
{
    /**
     * Class constructor
     * @param {number} bucketSize It should be a power of two
     * @param {number} windowSize An odd positive number for filtering
     */
    constructor(bucketSize = 32, windowSize = 5)
    {
        // validate parameters
        this._bucketSize = 1 << Math.ceil(Math.log2(bucketSize));
        this._windowSize = windowSize + (1 - windowSize % 2);

        // bucketSize should be a power of 2
        if(bucketSize < this._windowSize)
            _utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].fatal(`Invalid bucketSize of ${bucketSize}`);

        // Bucket is implemented as a circular vector
        this._head = this._bucketSize - 1;
        this._rawData = new Float32Array(this._bucketSize).fill(0);
        this._smoothedData = new Float32Array(this._bucketSize).fill(0);
        this._average = 0;
        this._isSmooth = true;
    }

    /**
     * Put a value in the bucket
     * @param {number} value
     */
    put(value)
    {
        this._head = (this._head + 1) & (this._bucketSize - 1);
        this._rawData[this._head] = value;
        this._isSmooth = false;
    }

    /**
     * Bucket size
     * @returns {number}
     */
    get size()
    {
        return this._bucketSize;
    }

    /**
     * Get smoothed average
     * @returns {number}
     */
    get average()
    {
        // need to smooth the signal?
        if(!this._isSmooth)
            this._smooth();

        // the median filter does not introduce new data to the signal
        // this._average approaches the mean of the distribution as bucketSize -> inf
        return this._average;
    }

    /**
     * Fill the bucket with a value
     * @param {number} value
     */
    fill(value)
    {
        this._rawData.fill(value);
        this._smoothedData.fill(value);
        this._average = value;
        this._isSmooth = true;
        this._head = this._bucketSize - 1;
        return this;
    }

    // Apply the smoothing filter & compute the average
    _smooth()
    {
        // smooth the signal & compute the average
        this._average = 0;
        for(let i = 0; i < this._bucketSize; i++) {
            this._smoothedData[i] = this._median(this._window(i));
            this._average += this._smoothedData[i];
        }
        this._average /= this._bucketSize;
        //this._average = this._median(this._rawData);

        // the signal has been smoothed
        this._isSmooth = true;
    }

    // A window of size w around i
    _window(i)
    {
        const arr = this._rawData;
        const win = this._win || (this._win = new Float32Array(this._windowSize));
        const n = arr.length;
        const w = win.length;
        const wOver2 = w >> 1;
        const head = this._head;
        const tail = (head + 1) & (n - 1);

        for(let j = 0, k = -wOver2; k <= wOver2; k++) {
            let pos = i + k;

            // boundary conditions:
            // reflect values
            if(i <= head){
                if(pos > head)
                    pos = head + (head - pos);
            }
            else {
                if(pos < tail)
                    pos = tail + (tail - pos);
            }
            if(pos < 0)
                pos += n;
            else if(pos >= n)
                pos -= n;

            win[j++] = arr[pos];
        }

        return win;
    }

    // return the median of a sequence (note: the input is rearranged)
    _median(v)
    {
        // fast median search for fixed length vectors
        switch(v.length) {
            case 1:
                return v[0];

            case 3:
                //  v0   v1   v2   [ v0  v1  v2 ]
                //   \  / \   /
                //   node  node    [ min(v0,v1)  min(max(v0,v1),v2)  max(max(v0,v1),v2) ]
                //      \   /
                //      node       [ min(min(v0,v1),min(max(v0,v1),v2))  max(min(...),min(...))  max(v0,v1,v2) ]
                //       |
                //     median      [ min(v0,v1,v2)  median  max(v0,v1,v2) ]
                if(v[0] > v[1]) [v[0], v[1]] = [v[1], v[0]];
                if(v[1] > v[2]) [v[1], v[2]] = [v[2], v[1]];
                if(v[0] > v[1]) [v[0], v[1]] = [v[1], v[0]];
                return v[1];

            case 5:
                if(v[0] > v[1]) [v[0], v[1]] = [v[1], v[0]];
                if(v[3] > v[4]) [v[3], v[4]] = [v[4], v[3]];
                if(v[0] > v[3]) [v[0], v[3]] = [v[3], v[0]];
                if(v[1] > v[4]) [v[1], v[4]] = [v[4], v[1]];
                if(v[1] > v[2]) [v[1], v[2]] = [v[2], v[1]];
                if(v[2] > v[3]) [v[2], v[3]] = [v[3], v[2]];
                if(v[1] > v[2]) [v[1], v[2]] = [v[2], v[1]];
                return v[2];

            case 7:
                if(v[0] > v[5]) [v[0], v[5]] = [v[5], v[0]];
                if(v[0] > v[3]) [v[0], v[3]] = [v[3], v[0]];
                if(v[1] > v[6]) [v[1], v[6]] = [v[6], v[1]];
                if(v[2] > v[4]) [v[2], v[4]] = [v[4], v[2]];
                if(v[0] > v[1]) [v[0], v[1]] = [v[1], v[0]];
                if(v[3] > v[5]) [v[3], v[5]] = [v[5], v[3]];
                if(v[2] > v[6]) [v[2], v[6]] = [v[6], v[2]];
                if(v[2] > v[3]) [v[2], v[3]] = [v[3], v[2]];
                if(v[3] > v[6]) [v[3], v[6]] = [v[6], v[3]];
                if(v[4] > v[5]) [v[4], v[5]] = [v[5], v[4]];
                if(v[1] > v[4]) [v[1], v[4]] = [v[4], v[1]];
                if(v[1] > v[3]) [v[1], v[3]] = [v[3], v[1]];
                if(v[3] > v[4]) [v[3], v[4]] = [v[4], v[3]];
                return v[3];

            default:
                v.sort((a, b) => a - b);
                return (v[(v.length - 1) >> 1] + v[v.length >> 1]) / 2;
        }
    }
}

/**
 * A Tuner is a device designed to find
 * an integer x that minimizes the output
 * of a unknown system y = F(x) with noise
 */
/* abstract */ class Tuner
{
    /**
     * Class constructor
     * @param {number} initialState initial guess to input to the unknown system
     * @param {number} minState minimum integer accepted by the unknown system
     * @param {number} maxState maximum integer accepted by the unknown system
     */
    constructor(initialState, minState, maxState)
    {
        // validate parameters
        if(minState >= maxState)
            _utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].fatal(`Invalid boundaries [${minState},${maxState}] given to the Tuner`);
        initialState = Math.max(minState, Math.min(initialState, maxState));

        // setup object
        this._state = initialState;
        this._prevState = initialState;
        this._prevPrevState = initialState;
        this._initialState = initialState;
        this._minState = minState;
        this._maxState = maxState;
        this._bucket = new Array(maxState - minState + 1).fill(null).map(x => new Bucket(this._bucketSetup().size, this._bucketSetup().window));
        this._iterations = 0; // number of iterations in the same state
        this._epoch = 0; // number of state changes
    }

    /**
     * The value to input to the unknown system
     */
    currentValue()
    {
        return this._state;
    }

    /**
     * Feed the output y = F(x) of the unknown system
     * when given an input x = this.currentValue()
     */
    feedObservation(y)
    {
        const bucket = this._bucketOf(this._state);

        // feed the observation into the bucket of the current state
        bucket.put(+y);

        // time to change state?
        if(++this._iterations >= bucket.size) {
            // initialize buckets
            if(this._epoch == 0) {
                this._bucket.forEach(bk => bk.fill(bucket.average));
                if(!isFinite(this._costOfBestState))
                    this._costOfBestState = bucket.average;
            }

            // compute next state
            const clip = s => Math.max(this._minState, Math.min(s | 0, this._maxState));
            const prevPrevState = this._prevState;
            const prevState = this._state;
            this._state = clip(this._nextState());
            this._prevState = prevState;
            this._prevPrevState = prevPrevState;

            // reset iteration counter
            // and advance epoch number
            this._iterations = 0;
            this._epoch++;
        }
    }

    /**
     * Reset the Tuner to its initial state
     * Useful if you change on-the-fly the unknown system,
     * so that there is a new target value you want to find
     */
    reset()
    {
        this._state = this._initialState;
        this._prevState = this._initialState;
        this._prevPrevState = this._initialState;
        this._iterations = 0;
        this._epoch = 0;
    }

    /**
     * Finished optimization?
     * @returns {boolean}
     */
    finished()
    {
        return false;
    }

    // get the bucket of a state
    _bucketOf(state)
    {
        state = Math.max(this._minState, Math.min(state | 0, this._maxState));
        return this._bucket[state - this._minState];
    }

    // the bucket may be reconfigured on subclasses
    _bucketSetup()
    {
        return {
            "size": 32,
            "window": 5
        };
    }

    // this is magic
    /* abstract */ _nextState()
    {
        // Subclass responsibility
        return this._state;
    }

    /**
     * Let me see stuff
     * @returns {object}
     */
    info()
    {
        const bucket = this._bucketOf(this._state);
        const prevBucket = this._bucketOf(this._prevState);

        return {
            now: this._state,
            avg: bucket.average,
            itr: [ this._iterations, this._epoch ],
            bkt: bucket._smoothedData,
            cur: new Array(bucket.size).fill(0).map((x, i) => i == bucket._head ? 1 : 0),
            prv: [ this._prevState, prevBucket.average ],
            fim: this.finished(),
        };
    }
}

/**
 * A Tuner created for testing purposes
 */
class TestTuner extends Tuner
{
    /**
     * Class constructor
     * @param {number} minState minimum integer accepted by the unknown system
     * @param {number} maxState maximum integer accepted by the unknown system
     */
    constructor(minState, maxState)
    {
        super(minState, minState, maxState);
    }

    // where should I go next?
    _nextState()
    {
        //console.log(this.info());
        const nextState = this._state + 1;
        return nextState > this._maxState ? this._minState : nextState;
    }

    // bucket setup
    _bucketSetup()
    {
        return {
            "size": 4,
            "window": 3
        };
    }

    // let me see stuff
    info()
    {
        return {
            state: [ this._state, this._bucketOf(this._state).average ],
            data: JSON.stringify(this._bucket.map(b => b.average)),
        };
    }
}

/*
 * Implementation of Simulated Annealing
 */
class StochasticTuner extends Tuner
{
    /**
     * Class constructor
     * @param {number} initialState initial guess to input to the unknown system
     * @param {number} minState minimum integer accepted by the unknown system
     * @param {number} maxState maximum integer accepted by the unknown system
     * @param {number} [alpha] geometric decrease rate of the temperature
     * @param {number} [maxIterationsPerTemperature] number of iterations before cooling down by alpha
     * @param {number} [initialTemperature] initial temperature
     * @param {Function<number,number?>} [neighborFn] neighbor picking function: state[,F(state)] -> state
     */
    constructor(initialState, minState, maxState, alpha = 0.5, maxIterationsPerTemperature = 8, initialTemperature = 100, neighborFn = null)
    {
        super(initialState, minState, maxState);

        this._bestState = this._initialState;
        this._costOfBestState = Infinity;
        this._initialTemperature = Math.max(0, initialTemperature);
        this._temperature = this._initialTemperature;
        this._numIterations = 0; // no. of iterations in the current temperature
        this._maxIterationsPerTemperature = Math.max(1, maxIterationsPerTemperature);
        this._alpha = Math.max(0, Math.min(alpha, 1)); // geometric decrease rate

        if(!neighborFn)
            neighborFn = (s) => this._minState + Math.floor(Math.random() * (this._maxState - this._minState + 1))
        this._pickNeighbor = neighborFn;
    }

    /**
     * Reset the Tuner
     */
    reset()
    {
        this._temperature = this._initialTemperature;
        this._numIterations = 0;
        // we shall not reset the best state...
    }

    /**
     * Finished optimization?
     * @returns {boolean}
     */
    finished()
    {
        return this._temperature <= 1e-5;
    }

    // Pick the next state
    // Simulated Annealing
    _nextState()
    {
        // finished simulation?
        if(this.finished())
            return this._bestState;

        // pick a neighbor
        const f = (s) => this._bucketOf(s).average;
        let nextState = this._state;
        let neighbor = this._pickNeighbor(this._state, f(this._state)) | 0;
        neighbor = Math.max(this._minState, Math.min(neighbor, this._maxState));

        // evaluate the neighbor
        if(f(neighbor) < f(this._state)) {
            // the neighbor is better than the current state
            nextState = neighbor;
        }
        else {
            // the neighbor is not better than the current state,
            // but we may admit it with a certain probability
            if(Math.random() < Math.exp((f(this._state) - f(neighbor)) / this._temperature))
                nextState = neighbor;
        }

        // update the best state
        if(f(nextState) < this._costOfBestState) {
            this._bestState = nextState;
            this._costOfBestState = f(nextState);
        }

        // cool down
        if(++this._numIterations >= this._maxIterationsPerTemperature) {
            this._temperature *= this._alpha;
            this._numIterations = 0;
        }

        // done
        return nextState;
    }

    // bucket setup
    _bucketSetup()
    {
        return {
            "size": 4,
            "window": 3
        };
    }

    // let me see stuff
    info()
    {
        return {
            best: [ this._bestState, this._costOfBestState ],
            state: [ this._state, this._bucketOf(this._state).average ],
            iterations: [ this._numIterations, this._maxIterationsPerTemperature ],
            temperature: this._temperature,
            alpha: this._alpha,
            cool: this.finished(),
        };
    }
}

/**
 * Golden Section Search
 */
class GoldenSectionTuner extends Tuner
{
    /**
     * Class constructor
     * @param {number} minState minimum INTEGER accepted by the quadratic error system
     * @param {number} maxState maximum INTEGER accepted by the quadratic error system
     * @param {number} tolerance terminating condition (interval size)
     */
    constructor(minState, maxState, tolerance = 0.001)
    {
        super(minState, minState, maxState);
        this._invphi = (Math.sqrt(5.0) - 1.0) / 2.0; // 1 / phi
        this._tolerance = Math.max(0, tolerance);
        this.reset();
    }

    /**
     * Reset the tuner
     */
    reset()
    {
        this._xlo = Math.max(xlo, this._minState);
        this._xhi = Math.min(xhi, this._maxState);
        this._x1 = this._xhi - this._invphi * (this._xhi - this._xlo);
        this._x2 = this._xlo + this._invphi * (this._xhi - this._xlo);

        this._state = Math.floor(this._x1);
        this._bestState = this._state;
    }

    /**
     * Finished optimizing?
     * @returns {boolean}
     */
    finished()
    {
        return this._xhi - this._xlo <= this._tolerance;
    }

    // Where should I go next?
    _nextState()
    {
        const f = (s) => this._bucketOf(s).average;

        // best state so far
        if(f(this._state) < f(this._bestState))
            this._bestState = this._state;

        // finished?
        if(this.finished())
            return this._bestState;

        // initial search
        if(this._epoch == 0)
            return Math.ceil(this._x2);

        // evaluate the current interval
        if(f(Math.floor(this._x1)) < f(Math.ceil(this._x2))) {
            this._xhi = this._x2;
            this._x2 = this._x1;
            this._x1 = this._xhi - this._invphi * (this._xhi - this._xlo);
            return Math.floor(this._x1);
        }
        else {
            this._xlo = this._x1;
            this._x1 = this._x2;
            this._x2 = this._xlo + this._invphi * (this._xhi - this._xlo);
            return Math.ceil(this._x2);
        }
    }

    // Bucket setup
    _bucketSetup()
    {
        return {
            "size": 4,
            "window": 3
        };
    }

    // let me see stuff
    info()
    {
        return {
            now: this._state,
            avg: this._bucketOf(this._state).average,
            itr: [ this._iterations, this._epoch ],
            int: [ this._xlo, this._xhi ],
            sub: [ this._x1, this._x2 ],
            done: this.finished(),
        };
    }
}

/**
 * A Tuner for minimizing errors between observed and expected values
 * 
 * It should be an Online Tuner, that is, it should learn the
 * best responses in real-time, as it goes
 * 
 * This is sort of a hill climbing / gradient descent algorithm
 * with random elements and adapted for discrete space
 */
class OnlineErrorTuner extends Tuner
{
    /**
     * Class constructor
     * @param {number} minState minimum INTEGER accepted by the quadratic error system
     * @param {number} maxState maximum INTEGER accepted by the quadratic error system
     * @param {number} tolerance percentage relative to the expected observation
     * @param {number} learningRate hyperparameter
     */
    constructor(minState, maxState, tolerance = 0.1, learningRate = 0.05)
    {
        const initialState = Math.round(_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].gaussianNoise((minState + maxState) / 2, 5));
        super(initialState, minState, maxState);
        this._tolerance = Math.max(0, tolerance);
        this._bestState = this._initialState;
        this._expected = null;
        this._learningRate = Math.max(0, learningRate);
    }

    /**
     * Reset the tuner
     */
    reset()
    {
        super.reset();
        this._expected = null;
    }

    /**
     * Feed an observed value and an expected value
     * @param {number} observedValue
     * @param {number} expectedValue
     */
    feedObservation(observedValue, expectedValue)
    {
        const obs = +observedValue;
        const expected = +expectedValue;

        // must reset the tuner?
        if(expected !== this._expected)
            this.reset();
        this._expected = expected;

        // feed an error measurement to the appropriate bucket
        const err = ((obs - expected) * (obs - expected)) / (expected * expected);
        super.feedObservation(err);
    }

    /**
     * Finished optimizing?
     * -- for now, that is...
     *    it's an online tuner!
     * @returns {boolean}
     */
    finished()
    {
        // error function
        const E = (s) => Math.sqrt(this._bucketOf(s).average) * Math.abs(this._expected);

        // compute values
        const err = E(this._bestState);
        const tol = this._tolerance;
        const exp = this._expected;
        //console.log('ERR', err, tol * exp);

        // acceptable condition
        return err <= tol * exp;
    }

    /**
     * Tolerance value, a percentage relative
     * to the expected value that we want
     * @returns {boolean}
     */
    get tolerance()
    {
        return this._tolerance;
    }

    /**
     * Set the tolerance, a percentage relative
     * to the expected value that we want
     */
    set tolerance(value)
    {
        this._tolerance = Math.max(0, value);
    }

    // Where should I go next?
    _nextState()
    {
        // finished?
        if(this.finished())
            return this._bestState;

        // error function
        const E = (s) => Math.sqrt(this._bucketOf(s).average) * Math.abs(this._expected);

        // best state
        if(E(this._state) < E(this._bestState))
            this._bestState = this._state;

        // the algorithm should avoid long hops, as this
        // would cause discontinuities for the end-user
        //const stepSize = this._learningRate * E(this._state);
        const worldScale = Math.abs(this._maxState);
        const G = (s) => Math.sqrt(this._bucketOf(s).average) * worldScale;
        const stepSize = this._learningRate * G(this._state);

        // move in the opposite direction of the error or in
        // the direction of the error with a small probability
        const sign = x => (x >= 0) - (x < 0); // -1 or 1
        const direction = (
            sign(E(this._state) - E(this._prevState)) *
           -sign(this._state - this._prevState) *
            sign(Math.random() - 0.15)
        );
        //console.warn("at state", this._state, direction > 0 ? '-->' : '<--');

        // pick the next state
        const weight = _utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].gaussianNoise(1.0, 0.1); // dodge local mimina
        let newState = Math.round(this._state + direction * weight * stepSize);

        // outside bounds?
        if(newState > this._maxState)
            newState = this._bestState;
        else if(newState < this._minState)
            newState = this._bestState;

        // done
        return newState;
    }

    // Bucket setup
    _bucketSetup()
    {
        return {
            "size": 4,
            "window": 3
        };
    }

    // let me see stuff
    info()
    {
        return {
            now: [ this._state, this._prevState ],
            bkt: this._bucketOf(this._state)._rawData,
            cur: this._bucketOf(this._state)._head,
            err: [ this._bucketOf(this._state).average, this._bucketOf(this._prevState).average ],
            sqt: Math.sqrt(this._bucketOf(this._state).average),
            done: this.finished(),
        };
    }
}

/***/ }),

/***/ "./src/utils/types.js":
/*!****************************!*\
  !*** ./src/utils/types.js ***!
  \****************************/
/*! exports provided: MediaType, ColorFormat */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaType", function() { return MediaType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ColorFormat", function() { return ColorFormat; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils/utils.js");
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
 * types.js
 * Types & formats
 */



const MediaType = _utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].enum(
    'Image',
    'Video',
    'Canvas',
    'Texture'
);

const ColorFormat = _utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].enum(
    'RGB',
    'Greyscale',
    'Binary'
);

/***/ }),

/***/ "./src/utils/utils.js":
/*!****************************!*\
  !*** ./src/utils/utils.js ***!
  \****************************/
/*! exports provided: Utils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Utils", function() { return Utils; });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors */ "./src/utils/errors.js");
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
 * Generic utilities
 */



class Utils
{
    /**
     * Displays a fatal error
     * @param {string} text message text
     * @param  {...string} [args] optional text
     * @throws {SpeedyError} an error object containing the message text
     */
    static fatal(text, ...args)
    {
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__["SpeedyError"](text, ...args);
    }

    /**
     * Generates a warning
     * @param {string} text message text
     * @param  {...string} [args] optional text
     * @returns {string} the message text
     */
    static warning(text, ...args)
    {
        const message = [ text, ...args ].join(' ');
        console.warn('[speedy-vision.js]', message);
        return message;
    }

    /**
     * Logs a message
     * @param {string} text message text
     * @param  {...string} [args] optional text
     * @returns {string} the message text
     */
    static log(text, ...args)
    {
        const message = [ text, ...args ].join(' ');
        console.log('[speedy-vision.js]', message);
        return message;
    }

    /**
     * Assertion
     * @param {boolean} expr expression
     * @param {string} [text] error message
     * @throws {SpeedyError}
     */
    static assert(expr, text = '')
    {
        if(!expr)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__["SpeedyError"]('Assertion failed.', text);
    }

    /**
     * Generates an enumeration
     * @param {...string} values enumeration options
     * @returns {object} enum object
     */
    static enum(...values)
    {
        return Object.freeze(
            values.reduce((acc, cur) => ((acc[cur] = Symbol(cur)), acc), { })
        );
    }

    /**
     * Generates a random number with
     * Gaussian distribution (mu, sigma)
     * @param {number} mu mean
     * @param {number} sigma standard deviation
     * @returns {number} random number
     */
    static gaussianNoise(mu = 0, sigma = 1)
    {
        // Box-Muller transformation
        const TWO_PI = 2.0 * Math.PI;
        
        let a, b = Math.random();
        do { a = Math.random(); } while(a <= Number.EPSILON);
        let z = Math.sqrt(-2 * Math.log(a)) * Math.sin(TWO_PI * b);

        return z * sigma + mu;
    }
}

/***/ })

/******/ });
//# sourceMappingURL=speedy-vision.js.map