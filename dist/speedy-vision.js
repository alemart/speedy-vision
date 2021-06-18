/*!
 * speedy-vision.js v0.7.0-wip
 * GPU-accelerated Computer Vision for JavaScript
 * https://github.com/alemart/speedy-vision-js
 * 
 * Copyright 2020-2021 Alexandre Martins <alemartf(at)gmail.com> (https://github.com/alemart)
 * @license Apache-2.0
 * 
 * Date: 2021-06-18T02:06:29.202Z
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./src/core/keypoints/descriptors/orb.js":
/*!***********************************************!*\
  !*** ./src/core/keypoints/descriptors/orb.js ***!
  \***********************************************/
/*! exports provided: ORBFeatures */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ORBFeatures", function() { return ORBFeatures; });
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _feature_description_algorithm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../feature-description-algorithm */ "./src/core/keypoints/feature-description-algorithm.js");
/* harmony import */ var _feature_algorithm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../feature-algorithm */ "./src/core/keypoints/feature-algorithm.js");
/* harmony import */ var _speedy_descriptor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../speedy-descriptor */ "./src/core/speedy-descriptor.js");
/* harmony import */ var _speedy_feature__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../speedy-feature */ "./src/core/speedy-feature.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * orb.js
 * ORB features
 */







// constants
const DESCRIPTOR_SIZE = 32; // 256 bits

/**
 * ORB features
 */
class ORBFeatures extends _feature_description_algorithm__WEBPACK_IMPORTED_MODULE_1__["FeatureDescriptionAlgorithm"]
{
    /**
     * Constructor
     * @param {FeatureAlgorithm} decoratedAlgorithm preferably Multiscale Harris
     */
    constructor(decoratedAlgorithm)
    {
        super(decoratedAlgorithm, DESCRIPTOR_SIZE);
    }

    /**
     * Compute ORB feature descriptors
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @param {SpeedyTexture} detectedKeypoints tiny texture with appropriate size for the descriptors
     * @returns {SpeedyTexture} tiny texture with encoded keypoints & descriptors
     */
    _describe(gpu, inputTexture, detectedKeypoints)
    {
        const descriptorSize = this.descriptorSize;
        const extraSize = this.extraSize;
        const encoderLength = this.encoderLength;

        // get oriented keypoints
        const orientedKeypoints = this._computeOrientation(gpu, inputTexture, detectedKeypoints);

        // smooth the image before computing the descriptors
        const smoothTexture = gpu.programs.filters.gauss7(inputTexture);
        const smoothPyramid = smoothTexture.generateMipmaps(gpu);

        // compute ORB feature descriptors
        return gpu.programs.keypoints.orb(smoothPyramid, orientedKeypoints, descriptorSize, extraSize, encoderLength);
    }

    /**
     * Compute the orientation of the keypoints
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @param {SpeedyTexture} detectedKeypoints tiny texture with appropriate size for the descriptors
     * @returns {SpeedyTexture} tiny texture with encoded keypoints & descriptors
     */
    _computeOrientation(gpu, inputTexture, detectedKeypoints)
    {
        const descriptorSize = this.descriptorSize;
        const extraSize = this.extraSize;
        const encoderLength = this.encoderLength;

        // generate pyramid
        const pyramid = inputTexture.generateMipmaps(gpu);

        // compute orientation
        return gpu.programs.keypoints.orbOrientation(pyramid, detectedKeypoints, descriptorSize, extraSize, encoderLength);
    }

    /**
     * Post-process the keypoints after downloading them
     * @param {SpeedyFeature[]} keypoints
     * @returns {SpeedyFeature[]}
     */
    _postProcess(keypoints)
    {
        return keypoints.map(
            keypoint => new _speedy_feature__WEBPACK_IMPORTED_MODULE_4__["SpeedyFeatureWithDescriptor"](
                keypoint,
                descriptorBytes => new _speedy_descriptor__WEBPACK_IMPORTED_MODULE_3__["BinaryDescriptor"](descriptorBytes)
            )
        );
    }
}

/***/ }),

/***/ "./src/core/keypoints/detectors/fast.js":
/*!**********************************************!*\
  !*** ./src/core/keypoints/detectors/fast.js ***!
  \**********************************************/
/*! exports provided: FASTFeatures, MultiscaleFASTFeatures */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FASTFeatures", function() { return FASTFeatures; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MultiscaleFASTFeatures", function() { return MultiscaleFASTFeatures; });
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _feature_detection_algorithm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../feature-detection-algorithm */ "./src/core/keypoints/feature-detection-algorithm.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/globals */ "./src/utils/globals.js");
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
 * fast.js
 * FAST corner detector
 */








// constants
const SQRT_2 = 1.4142135623730951;
const DEFAULT_FAST_VARIANT = 9;
const DEFAULT_FAST_THRESHOLD = 20;
const DEFAULT_DEPTH = 4;
const DEFAULT_SCALE_FACTOR = SQRT_2; // scale factor between consecutive pyramid layers



/**
 * FAST corner detector
 */
class FASTFeatures extends _feature_detection_algorithm__WEBPACK_IMPORTED_MODULE_2__["FeatureDetectionAlgorithm"]
{
    /**
     * Constructor
     */
    constructor()
    {
        super();

        /** @type {number} FAST variant */
        this._n = DEFAULT_FAST_VARIANT;

        /** @type {number} FAST threshold in [0,255] */
        this._threshold = DEFAULT_FAST_THRESHOLD;
    }

    /**
     * Get FAST variant
     * @returns {number}
     */
    get n()
    {
        return this._n;
    }

    /**
     * Set FAST variant
     * @param {number} value 9, 7 or 5
     */
    set n(value)
    {
        this._n = value | 0;
        _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].assert(this._n === 9 || this._n === 7 || this._n === 5);
    }

    /**
     * Get FAST threshold
     * @returns {number}
     */
    get threshold()
    {
        return this._threshold;
    }

    /**
     * Set FAST threshold
     * @param {number} value a number in [0,255]
     */
    set threshold(value)
    {
        this._threshold = value | 0;
        _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].assert(this._threshold >= 0 && this._threshold <= 255);
    }

    /**
     * Detect feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} encoded keypoints
     */
    _detect(gpu, inputTexture)
    {
        const n = this._n;
        const threshold = this._threshold;
        const normalizedThreshold = threshold / 255.0;
        const descriptorSize = this.descriptorSize;
        const extraSize = this.extraSize;
        const encoderLength = this.encoderLength;

        // find corners
        let corners = null;
        if(n == 9)
            corners = gpu.programs.keypoints.fast9(inputTexture, normalizedThreshold);
        else if(n == 7)
            corners = gpu.programs.keypoints.fast7(inputTexture, normalizedThreshold);
        else if(n == 5)
            corners = gpu.programs.keypoints.fast5(inputTexture, normalizedThreshold);
        else
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["NotSupportedError"]();

        // non-maximum suppression
        const suppressedCorners = gpu.programs.keypoints.nonMaxSuppression(corners);

        // convert scores to an 8-bit component
        const finalCorners = gpu.programs.keypoints.encodeFastScore(suppressedCorners);

        // encode corners
        return gpu.programs.encoders.encodeKeypoints(finalCorners, descriptorSize, extraSize, encoderLength);
    }
}





/**
 * FAST corner detector in an image pyramid
 */
class MultiscaleFASTFeatures extends _feature_detection_algorithm__WEBPACK_IMPORTED_MODULE_2__["FeatureDetectionAlgorithm"]
{
    /**
     * Constructor
     */
    constructor()
    {
        super();

        /** @type {number} FAST variant */
        this._n = DEFAULT_FAST_VARIANT;

        /** @type {number} FAST threshold in [0,255] */
        this._threshold = DEFAULT_FAST_THRESHOLD;

        /** @type {number} how many pyramid levels we'll scan */
        this._depth = DEFAULT_DEPTH;

        /** @type {number} scale factor between consecutive pyramid levels */
        this._scaleFactor = DEFAULT_SCALE_FACTOR;
    }

    /**
     * Get FAST variant
     * @returns {number}
     */
    get n()
    {
        return this._n;
    }

    /**
     * Set FAST variant
     * @param {number} value only 9 is supported at this time
     */
    set n(value)
    {
        this._n = value | 0;
        _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].assert(this._n === 9);
    }

    /**
     * Get FAST threshold
     * @returns {number}
     */
    get threshold()
    {
        return this._threshold;
    }

    /**
     * Set FAST threshold
     * @param {number} value a number in [0,255]
     */
    set threshold(value)
    {
        this._threshold = value | 0;
        _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].assert(this._threshold >= 0 && this._threshold <= 255);
    }

    /**
     * Get depth: how many pyramid levels we will scan
     * @returns {number}
     */
    get depth()
    {
        return this._depth;
    }

    /**
     * Set depth: how many pyramid levels we will scan
     * @param {number} value 1, 2, 3...
     */
    set depth(value)
    {
        this._depth = value | 0;
        _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].assert(this._depth >= 1 && this._depth <= _utils_globals__WEBPACK_IMPORTED_MODULE_5__["PYRAMID_MAX_LEVELS"]);
    }

    /**
     * Get the scale factor between consecutive pyramid layers
     * @returns {number}
     */
    get scaleFactor()
    {
        return this._scaleFactor;
    }

    /**
     * Set the scale factor between consecutive pyramid layers
     * @param {number} value a value greater than 1 and less than or equal to 2
     */
    set scaleFactor(value)
    {
        this._scaleFactor = Math.min(Math.max(1, +value), 2);
    }

    /**
     * Detect feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} encoded keypoints
     */
    _detect(gpu, inputTexture)
    {
        const threshold = this._threshold;
        const depth = this._depth;
        const normalizedThreshold = threshold / 255.0;
        const numberOfLayers = 2 * depth - 1;
        const lodStep = Math.log2(this._scaleFactor);
        const descriptorSize = this.descriptorSize;
        const extraSize = this.extraSize;
        const encoderLength = this.encoderLength;

        // generate pyramid
        const pyramid = inputTexture.generateMipmaps(gpu);

        // find corners
        const corners = gpu.programs.keypoints.multiscaleFast(pyramid, normalizedThreshold, numberOfLayers, lodStep);

        // non-maximum suppression
        const suppressedCorners = gpu.programs.keypoints.nonMaxSuppression(corners, lodStep);

        // convert scores to an 8-bit component
        const finalCorners = gpu.programs.keypoints.encodeFastScore(suppressedCorners);

        // encode keypoints
        const detectedKeypoints = gpu.programs.encoders.encodeKeypoints(finalCorners, descriptorSize, extraSize, encoderLength);

        // done
        return detectedKeypoints;
    }
}

/***/ }),

/***/ "./src/core/keypoints/detectors/harris.js":
/*!************************************************!*\
  !*** ./src/core/keypoints/detectors/harris.js ***!
  \************************************************/
/*! exports provided: HarrisFeatures, MultiscaleHarrisFeatures */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HarrisFeatures", function() { return HarrisFeatures; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MultiscaleHarrisFeatures", function() { return MultiscaleHarrisFeatures; });
/* harmony import */ var _gpu_speedy_gl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../gpu/speedy-gl */ "./src/gpu/speedy-gl.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _feature_detection_algorithm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../feature-detection-algorithm */ "./src/core/keypoints/feature-detection-algorithm.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/globals */ "./src/utils/globals.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.js");
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
 * harris.js
 * Harris corner detector
 */









// constants
const DEFAULT_QUALITY = 0.1; // default quality metric
const DEFAULT_DEPTH = 4; // default depth for multiscale feature detection
const DEFAULT_WINDOW_SIZE = 3; // compute Harris autocorrelation matrix within a 3x3 window
const DEFAULT_SCALE_FACTOR = 1.4142135623730951; // scale factor between consecutive pyramid layers (sqrt(2))
const MIN_WINDOW_SIZE = 0; // minimum window size when computing the autocorrelation matrix
const MAX_WINDOW_SIZE = 7; // maximum window size when computing the autocorrelation matrix
const MAX_LAYERS = 2 * _utils_globals__WEBPACK_IMPORTED_MODULE_5__["PYRAMID_MAX_LEVELS"] - 1; // Sobel derivatives for each pyramid layer

/**
 * Harris corner detector
 */
class HarrisFeatures extends _feature_detection_algorithm__WEBPACK_IMPORTED_MODULE_3__["FeatureDetectionAlgorithm"]
{
    /**
     * Constructor
     */
    constructor()
    {
        super();
        this._quality = DEFAULT_QUALITY;
    }

    /**
     * Get detector quality
     * @returns {number}
     */
    get quality()
    {
        return this._quality;
    }

    /**
     * Set detector quality
     * @param {number} value a number in [0,1]: we will pick corners having score >= quality * max(score)
     */
    set quality(value)
    {
        this._quality = +value;
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(this._quality >= 0 && this._quality <= 1);
    }

    /**
     * Run the Harris corner detector
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} encoded keypoints
     */
    _detect(gpu, inputTexture)
    {
        const { width, height } = gpu.programs.keypoints.multiscaleSobel;
        const quality = this._quality;
        const descriptorSize = this.descriptorSize;
        const extraSize = this.extraSize;
        const encoderLength = this.encoderLength;
        const windowSize = DEFAULT_WINDOW_SIZE;
        const lod = 0, lodStep = 1, numberOfLayers = 1;

        // compute derivatives
        gpu.programs.keypoints.multiscaleSobel.outputs(width, height, null);
        const df = gpu.programs.keypoints.multiscaleSobel(inputTexture, lod);
        const sobelDerivatives = new Array(MAX_LAYERS).fill(df);

        // corner detection
        const corners = gpu.programs.keypoints.multiscaleHarris(inputTexture, windowSize, numberOfLayers, lodStep, sobelDerivatives);

        // find the maximum corner response
        const numIterations = Math.ceil(Math.log2(Math.max(corners.width, corners.height)));
        let maxScore = corners;
        for(let i = 0; i < numIterations; i++)
            maxScore = gpu.programs.keypoints.maxHarrisScore(maxScore, i);

        // discard corners according to quality level
        //const filteredCorners = gpu.programs.keypoints.harrisCutoff(suppressedCorners, maxScore, quality);
        const filteredCorners = gpu.programs.keypoints.harrisCutoff(corners, maxScore, quality);

        // non-maximum suppression
        const suppressedCorners = gpu.programs.keypoints.nonMaxSuppression(filteredCorners);

        // convert score to 8-bit component
        const finalCorners = gpu.programs.keypoints.encodeHarrisScore(suppressedCorners);

        // encode corners
        return gpu.programs.encoders.encodeKeypoints(finalCorners, descriptorSize, extraSize, encoderLength);
    }
}

/**
 * Harris corner detector in an image pyramid
 */
class MultiscaleHarrisFeatures extends _feature_detection_algorithm__WEBPACK_IMPORTED_MODULE_3__["FeatureDetectionAlgorithm"]
{
    /**
     * Constructor
     */
    constructor()
    {
        super();
        this._quality = DEFAULT_QUALITY;
        this._depth = DEFAULT_DEPTH;
        this._scaleFactor = DEFAULT_SCALE_FACTOR;
        this._derivativesTexture = Array.from({ length : MAX_LAYERS }, () =>
            new _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_2__["SpeedyDrawableTexture"](_gpu_speedy_gl__WEBPACK_IMPORTED_MODULE_0__["SpeedyGL"].instance.gl, 1, 1));
    }

    /**
     * Get detector quality
     * @returns {number}
     */
    get quality()
    {
        return this._quality;
    }

    /**
     * Set detector quality
     * @param {number} value a number in [0,1]: we will pick corners having score >= quality * max(score)
     */
    set quality(value)
    {
        this._quality = +value;
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(this._quality >= 0 && this._quality <= 1);
    }

    /**
     * Get depth: how many pyramid levels we will scan
     * @returns {number}
     */
    get depth()
    {
        return this._depth;
    }

    /**
     * Set depth: how many pyramid levels we will scan
     * @param {number} value 1, 2, 3...
     */
    set depth(value)
    {
        this._depth = value | 0;
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(this._depth >= 1 && this._depth <= _utils_globals__WEBPACK_IMPORTED_MODULE_5__["PYRAMID_MAX_LEVELS"]);
    }

    /**
     * Get the scale factor between consecutive pyramid layers
     * @returns {number}
     */
    get scaleFactor()
    {
        return this._scaleFactor;
    }

    /**
     * Set the scale factor between consecutive pyramid layers
     * @param {number} value a value greater than 1 and less than or equal to 2
     */
    set scaleFactor(value)
    {
        this._scaleFactor = Math.min(Math.max(1, +value), 2);
    }

    /**
     * Detect feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} encoded keypoints
     */
    _detect(gpu, inputTexture)
    {
        const { width, height } = gpu.programs.keypoints.multiscaleSobel;
        const quality = this._quality;
        const depth = this._depth;
        const descriptorSize = this.descriptorSize;
        const extraSize = this.extraSize;
        const encoderLength = this.encoderLength;
        const windowSize = DEFAULT_WINDOW_SIZE;
        const numberOfLayers = 2 * depth - 1;
        const lodStep = Math.log2(this._scaleFactor);

        // generate pyramid
        const pyramid = inputTexture.generateMipmaps(gpu);

        // compute derivatives
        const sobelDerivatives = new Array(MAX_LAYERS);
        for(let j = 0; j < numberOfLayers; j++) {
            gpu.programs.keypoints.multiscaleSobel.outputs(width, height, this._derivativesTexture[j]);
            sobelDerivatives[j] = gpu.programs.keypoints.multiscaleSobel(pyramid, j * lodStep);
            gpu.programs.keypoints.multiscaleSobel.outputs(width, height, null);
        }
        for(let k = numberOfLayers; k < sobelDerivatives.length; k++)
            sobelDerivatives[k] = sobelDerivatives[k-1]; // can't call shaders with null pointers

        // corner detection
        const corners = gpu.programs.keypoints.multiscaleHarris(pyramid, windowSize, numberOfLayers, lodStep, sobelDerivatives);

        // find the maximum corner response
        const numIterations = Math.ceil(Math.log2(Math.max(corners.width, corners.height)));
        let maxScore = corners;
        for(let i = 0; i < numIterations; i++)
            maxScore = gpu.programs.keypoints.maxHarrisScore(maxScore, i);

        // discard corners according to the quality level
        const filteredCorners = gpu.programs.keypoints.harrisCutoff(corners, maxScore, quality);

        // non-maximum suppression
        const suppressedCorners = gpu.programs.keypoints.nonMaxSuppression(filteredCorners, lodStep);

        // convert score to 8-bit component
        const finalCorners = gpu.programs.keypoints.encodeHarrisScore(suppressedCorners);

        // encode keypoints
        const detectedKeypoints = gpu.programs.encoders.encodeKeypoints(finalCorners, descriptorSize, extraSize, encoderLength);

        // done
        return detectedKeypoints;
    }
}

/***/ }),

/***/ "./src/core/keypoints/feature-algorithm-decorator.js":
/*!***********************************************************!*\
  !*** ./src/core/keypoints/feature-algorithm-decorator.js ***!
  \***********************************************************/
/*! exports provided: FeatureAlgorithmDecorator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeatureAlgorithmDecorator", function() { return FeatureAlgorithmDecorator; });
/* harmony import */ var _feature_algorithm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./feature-algorithm */ "./src/core/keypoints/feature-algorithm.js");
/* harmony import */ var _speedy_feature__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../speedy-feature */ "./src/core/speedy-feature.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
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
 * feature-algorithm-decorator.js
 * Decorator pattern applied to the FeatureAlgorithm class
 */






/**
 * This decorator lets us extend and combine
 * the FeatureAlgorithm class in many ways
 * @abstract
 */
class FeatureAlgorithmDecorator extends _feature_algorithm__WEBPACK_IMPORTED_MODULE_0__["FeatureAlgorithm"]
{
    /**
     * Constructor
     * @param {FeatureAlgorithm} decoratedAlgorithm 
     * @param {number} [descriptorSize] in bytes, required for GPU algorithms
     * @param {number} [extraSize] in bytes, required for GPU algorithms
     */
    constructor(decoratedAlgorithm, descriptorSize = 0, extraSize = 0)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(decoratedAlgorithm instanceof _feature_algorithm__WEBPACK_IMPORTED_MODULE_0__["FeatureAlgorithm"]);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(descriptorSize >= decoratedAlgorithm.descriptorSize);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(extraSize >= decoratedAlgorithm.extraSize);

        super(descriptorSize, extraSize);

        /** @type {FeatureAlgorithm} decorated algorithm */
        this._decoratedAlgorithm = decoratedAlgorithm;
        this._decoratedAlgorithm.descriptorSize = this.descriptorSize;
        this._decoratedAlgorithm.extraSize = this.extraSize;
    }

    /**
     * Abstract "run" operation:
     * runs something on the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture
     * @returns {SpeedyTexture}
     */
    run(gpu, inputTexture)
    {
        return this._decoratedAlgorithm.run(gpu, inputTexture);
    }

    /**
     * Download feature points from the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} encodedKeypoints tiny texture with encoded keypoints
     * @param {FeatureDownloaderFlag} [flags] will be passed to the downloader
     * @returns {SpeedyPromise<SpeedyFeature[]>}
     */
    download(gpu, encodedKeypoints, flags = 0)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(this.extraSize == this._decoratedAlgorithm.extraSize);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(this.descriptorSize == this._decoratedAlgorithm.descriptorSize);

        return this._decoratedAlgorithm.download(gpu, encodedKeypoints, flags);
    }

    /**
     * The decorated algorithm
     * @returns {FeatureAlgorithm}
     */
    get decoratedAlgorithm()
    {
        return this._decoratedAlgorithm;
    }

    /**
     * Extra size of the headers of the encoded keypoint texture
     * @return {number} in bytes
     */
    get extraSize()
    {
        return super.extraSize;
    }

    /**
     * Set the extra size of the headers of the encoded keypoint texture
     * @param {number} bytes a multiple of 4 (32 bits)
     */
    set extraSize(bytes)
    {
        super.extraSize = bytes;
        this._decoratedAlgorithm.extraSize = bytes;
    }

    /**
     * Descriptor size
     * @return {number} in bytes
     */
    get descriptorSize()
    {
        return super.descriptorSize;
    }

    /**
     * Set the descriptor size, in bytes
     * @param {number} bytes a multiple of 4 (32 bits)
     */
    set descriptorSize(bytes)
    {
        super.descriptorSize = bytes;
        this._decoratedAlgorithm.descriptorSize = bytes;
    }

    /**
     * Size of the keypoint encoder texture
     * @returns {number}
     */
    get encoderLength()
    {
        return this._decoratedAlgorithm.encoderLength;
    }
}

/***/ }),

/***/ "./src/core/keypoints/feature-algorithm.js":
/*!*************************************************!*\
  !*** ./src/core/keypoints/feature-algorithm.js ***!
  \*************************************************/
/*! exports provided: FeatureAlgorithm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeatureAlgorithm", function() { return FeatureAlgorithm; });
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _speedy_feature__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../speedy-feature */ "./src/core/speedy-feature.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/globals */ "./src/utils/globals.js");
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
 * feature-algorithm.js
 * An abstract algorithm related to feature points
 */









/**
 * An abstract algorithm that deals with
 * feature points in any way (detection,
 * tracking, etc.)
 * @abstract
 */
class FeatureAlgorithm
{
    /**
     * Class constructor
     * @param {number} [descriptorSize] in bytes, required for GPU algorithms
     * @param {number} [extraSize] in bytes, required for GPU algorithms
     */
    constructor(descriptorSize = 0, extraSize = 0)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(descriptorSize <= _utils_globals__WEBPACK_IMPORTED_MODULE_6__["MAX_DESCRIPTOR_SIZE"]);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(descriptorSize % 4 === 0);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(extraSize % 4 === 0);

        /** @type {number} descriptor size in bytes */
        this._descriptorSize = descriptorSize; // for encoded keypoint textures

        /** @type {number} extra size in bytes */
        this._extraSize = extraSize; // for encoded keypoint textures
    }

    /**
     * Abstract "run" operation:
     * runs something on the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture
     * @returns {SpeedyTexture}
     */
    run(gpu, inputTexture)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["AbstractMethodError"]();
    }

    /**
     * Download feature points from the GPU
     * Needs to be overridden in subclasses
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} encodedKeypoints tiny texture
     * @param {FeatureDownloaderFlag} [flags] will be passed to the downloader
     * @returns {SpeedyPromise<SpeedyFeature[]>} feature points
     */
    download(gpu, encodedKeypoints, flags = 0)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["AbstractMethodError"]();
    }

    /**
     * Extra size of the headers of the encoded keypoint texture
     * By default, this is set to zero
     * @return {number} in bytes
     */
    get extraSize()
    {
        return this._extraSize;
    }

    /**
     * Set the extra size of the headers of the encoded keypoint texture
     * By default, this is set to zero
     * This is low-level stuff!
     * @param {number} bytes a multiple of 4 (32 bits)
     */
    set extraSize(bytes)
    {
        this._extraSize = Math.max(0, bytes | 0);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(this._extraSize % 4 === 0); // multiple of 32 bits (RGBA pixel)
    }

    /**
     * Descriptor size
     * By default, this is set to zero
     * @return {number} in bytes
     */
    get descriptorSize()
    {
        return this._descriptorSize;
    }

    /**
     * Set the descriptor size, in bytes
     * By default, this is set to zero
     * @param {number} bytes a multiple of 4 (32 bits)
     */
    set descriptorSize(bytes)
    {
        this._descriptorSize = Math.max(0, bytes | 0);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(this._descriptorSize % 4 === 0); // multiple of 32 bits (RGBA pixel)
    }

    /**
     * Size of the keypoint encoder texture
     * @returns {number}
     */
    get encoderLength()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["AbstractMethodError"]();
    }
}

/***/ }),

/***/ "./src/core/keypoints/feature-description-algorithm.js":
/*!*************************************************************!*\
  !*** ./src/core/keypoints/feature-description-algorithm.js ***!
  \*************************************************************/
/*! exports provided: FeatureDescriptionAlgorithm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeatureDescriptionAlgorithm", function() { return FeatureDescriptionAlgorithm; });
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _feature_algorithm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./feature-algorithm */ "./src/core/keypoints/feature-algorithm.js");
/* harmony import */ var _feature_algorithm_decorator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./feature-algorithm-decorator */ "./src/core/keypoints/feature-algorithm-decorator.js");
/* harmony import */ var _feature_detection_algorithm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./feature-detection-algorithm */ "./src/core/keypoints/feature-detection-algorithm.js");
/* harmony import */ var _speedy_feature__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../speedy-feature */ "./src/core/speedy-feature.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
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
 * feature-description-algorithm.js
 * Abstract feature description algorithm
 */









/**
 * Abstract feature description algorithm
 * @abstract
 */
class FeatureDescriptionAlgorithm extends _feature_algorithm_decorator__WEBPACK_IMPORTED_MODULE_2__["FeatureAlgorithmDecorator"]
{
    /**
     * Constructor
     * @param {FeatureAlgorithm} decoratedAlgorithm usually the feature detection algorithm 
     * @param {number} descriptorSize in bytes, required for GPU algorithms
     */
    constructor(decoratedAlgorithm, descriptorSize)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(decoratedAlgorithm instanceof _feature_algorithm__WEBPACK_IMPORTED_MODULE_1__["FeatureAlgorithm"]);
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(descriptorSize > 0);

        super(decoratedAlgorithm, descriptorSize, decoratedAlgorithm.extraSize);
    }

    /**
     * To "run" this algorithm means: to describe feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} tiny texture with encoded keypoints & descriptors
     */
    run(gpu, inputTexture)
    {
        // run decorated algorithm (e.g., feature detection)
        const detectedKeypoints = this.decoratedAlgorithm.run(gpu, inputTexture);

        // run feature description algorithm
        return this._describe(gpu, inputTexture, detectedKeypoints);
    }

    /**
     * Download feature points from the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} encodedKeypoints tiny texture with encoded keypoints
     * @param {FeatureDownloaderFlag} [flags] will be passed to the downloader
     * @returns {SpeedyPromise<SpeedyFeature[]>}
     */
    download(gpu, encodedKeypoints, flags = 0)
    {
        return super.download(gpu, encodedKeypoints, flags).then(
            keypoints => this._postProcess(keypoints)
        );
    }

    /**
     * Describe feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @param {SpeedyTexture} detectedKeypoints tiny texture with appropriate size for the descriptors
     * @returns {SpeedyTexture} tiny texture with encoded keypoints & descriptors
     */
    _describe(gpu, inputTexture, detectedKeypoints)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["AbstractMethodError"]();
    }

    /**
     * Post-process the keypoints after downloading them
     * @param {SpeedyFeature[]} keypoints
     * @returns {SpeedyFeature[]}
     */
    _postProcess(keypoints)
    {
        //return keypoints;
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["AbstractMethodError"]();
    }
}

/***/ }),

/***/ "./src/core/keypoints/feature-detection-algorithm.js":
/*!***********************************************************!*\
  !*** ./src/core/keypoints/feature-detection-algorithm.js ***!
  \***********************************************************/
/*! exports provided: FeatureDetectionAlgorithm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeatureDetectionAlgorithm", function() { return FeatureDetectionAlgorithm; });
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _feature_algorithm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./feature-algorithm */ "./src/core/keypoints/feature-algorithm.js");
/* harmony import */ var _feature_downloader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./feature-downloader */ "./src/core/keypoints/feature-downloader.js");
/* harmony import */ var _speedy_feature__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../speedy-feature */ "./src/core/speedy-feature.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * feature-detection-algorithm.js
 * Feature detection & description: abstract class
 */









// Constants

/**
 * Enhancements
 * @typedef {object} FeatureDetectionEnhancements
 * @property {number} gain contrast stretching, typically in [0,1]
 * @property {number} offset global brightness, typically in [0,1]
 * @property {number} decay from the center, in [0,1]
 * @property {string} quality filter quality ('high' | 'medium' | 'low')
 */
const DEFAULT_ENHANCEMENTS = Object.freeze({
    gain: 0.9,
    offset: 0.5,
    decay: 0.0,
    quality: 'low'
});

/**
 * An abstract class for feature
 * detection & description
 * @abstract
 */
class FeatureDetectionAlgorithm extends _feature_algorithm__WEBPACK_IMPORTED_MODULE_1__["FeatureAlgorithm"]
{
    /**
     * Class constructor
     */
    constructor()
    {
        super(0, 0);

        /** @type {FeatureDetectionEnhancements|null} */
        this._enhancements = null;

        /** @type {FeatureDownloader} */
        this._downloader = new _feature_downloader__WEBPACK_IMPORTED_MODULE_2__["FeatureDownloader"]();
    }

    /**
     * To "run" this algorithm means: to detect feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} tiny texture with encoded keypoints
     */
    run(gpu, inputTexture)
    {
        const enhancedInputTexture = this._enhanceTexture(gpu, inputTexture);
        return this._detect(gpu, enhancedInputTexture);
    }

    /**
     * Download feature points from the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} encodedKeypoints tiny texture with encoded keypoints
     * @param {FeatureDownloaderFlag} [flags] will be passed to the downloader
     * @returns {SpeedyPromise<SpeedyFeature[]>}
     */
    download(gpu, encodedKeypoints, flags = 0)
    {
        return this._downloader.download(gpu, encodedKeypoints, this.descriptorSize, this.extraSize, flags);
    }

    /**
     * Size of the keypoint encoder texture
     * @returns {number}
     */
    get encoderLength()
    {
        return this._downloader.encoderLength;
    }

    /**
     * The feature downloader
     * @returns {FeatureDownloader}
     */
    get downloader()
    {
        return this._downloader;
    }

    /**
     * Setup enhancements to be applied when detecting features
     * @param {FeatureDetectionEnhancements|boolean} [enhancements] fix irregular lighting in the scene?
     */
    setEnhancements(enhancements)
    {
        if(enhancements === true)
            this._enhancements = DEFAULT_ENHANCEMENTS;
        else if(typeof enhancements === 'object' && enhancements !== null)
            this._enhancements = Object.assign({ }, DEFAULT_ENHANCEMENTS, enhancements);
        else
            this._enhancements = null;
    }

    /**
     * Detect feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} tiny texture with encoded keypoints
     */
    _detect(gpu, inputTexture)
    {
        // This must be implemented in subclasses
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["AbstractMethodError"]();
    }

    /**
     * Enhances a texture specifically for feature detection
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture
     * @returns {SpeedyTexture}
     */
    _enhanceTexture(gpu, inputTexture)
    {
        let texture = inputTexture;
        const options = this._enhancements;

        if(options !== null) {
            texture = gpu.programs.enhancements.nightvision(texture, options.gain, options.offset, options.decay, options.quality, true);
            texture = gpu.programs.filters.gauss3(texture); // blur a bit more
        }

        return texture;
    }
}

/***/ }),

/***/ "./src/core/keypoints/feature-downloader.js":
/*!**************************************************!*\
  !*** ./src/core/keypoints/feature-downloader.js ***!
  \**************************************************/
/*! exports provided: FeatureDownloader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeatureDownloader", function() { return FeatureDownloader; });
/* harmony import */ var _feature_encoder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./feature-encoder */ "./src/core/keypoints/feature-encoder.js");
/* harmony import */ var _speedy_feature__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../speedy-feature */ "./src/core/speedy-feature.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/globals */ "./src/utils/globals.js");
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
 * feature-downloader.js
 * Download features from the GPU
 */









// constants
const INITIAL_KEYPOINTS_GUESS = _feature_encoder__WEBPACK_IMPORTED_MODULE_0__["FeatureEncoder"].capacity(0, 0, _utils_globals__WEBPACK_IMPORTED_MODULE_6__["INITIAL_ENCODER_LENGTH"]); // a guess about the initial number of keypoints
const INITIAL_FILTER_GAIN = 0.85; // a number in [0,1]
const MIN_KEYPOINTS = 32; // at any point in time, the encoder will have space for
                          // at least this number of keypoints




/**
 * A filter used to estimate the future number of
 * keypoints given past measurements
 */
class FeatureCountEstimator
{
    /**
     * Class constructor
     */
    constructor()
    {
        this._gain = INITIAL_FILTER_GAIN;
        this._state = INITIAL_KEYPOINTS_GUESS;
        this._prevState = this._state;
    }

    /**
     * Estimate the number of keypoints on the next time-step
     * @param {number} measurement
     * @returns {number}
     */
    estimate(measurement)
    {
        // extrapolate the current state
        const prediction = Math.max(0, this._state + (this._state - this._prevState));
    
        // estimate the new state
        const gain = this._gain; // do we trust more the prediction or the measurement?
        const newState = prediction + gain * (measurement - prediction);

        // update gain
        this._gain = Math.min(INITIAL_FILTER_GAIN, this._gain + 0.3);

        // testing
        /*
        this._cnt = Math.round(measurement - this._state) >= 1 ? (this._cnt||0) + 1 : 0;
        const diff = Math.abs(Math.round(measurement - this._state));
        const ratio = measurement / this._state-1;
        console.log(JSON.stringify({
            gain,
            prediction: Math.round(prediction),
            newState: Math.round(newState),
            measurement,
            diff,
            ratio: Math.round(100*ratio)+'%'
        }).replace(/,/g,',\n'));
        if(ratio+1 > this.maxGrowth) console.log('maxGrowth exceeded!');
        */

        // save state
        this._prevState = this._state;
        this._state = newState;

        // return
        return Math.round(this._state);
    }

    /**
     * Reset the filter to its initial state
     */
    reset()
    {
        // trust the prediction, not the measurement
        this._gain = 0;

        // reset state & prev state
        this._state = this._prevState = INITIAL_KEYPOINTS_GUESS;
    }

    /**
     * We expect measurement <= maxGrowth * previousState
     * to be true (almost) all the time, so we can
     * accomodate the encoder
     * @returns {number} greater than 1
     */
    get maxGrowth()
    {
        // If you increase this number, you'll get
        // more robust responses to abrupt and significant
        // increases in the number of keypoints, but you'll
        // also increase the amount of data going back and
        // forth from the GPU, thus impacting performance.
        // We would like to keep this value low.
        return 1.5;
    }
}



/**
 * The FeatureDownloader receives a texture of encoded
 * keypoints and returns a corresponding array of keypoints
 */
class FeatureDownloader
{
    /**
     * Class constructor
     */
    constructor()
    {
        /** @type {number} size of the keypoint encoder texture */
        this._encoderLength = _utils_globals__WEBPACK_IMPORTED_MODULE_6__["INITIAL_ENCODER_LENGTH"];

        /** @type {FeatureCountEstimator} used to estimate the future number of keypoints */
        this._estimator = new FeatureCountEstimator();
    }

    /**
     * Download feature points from the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} encodedKeypoints tiny texture with encoded keypoints
     * @param {number} descriptorSize in bytes (set it to zero if there is no descriptor)
     * @param {number} extraSize in bytes (set it to zero if there is no extra data)
     * @param {FeatureDownloaderFlag} [flags] used to modify the behavior of the downloader
     * @returns {SpeedyPromise<SpeedyFeature[]>}
     */
    download(gpu, encodedKeypoints, descriptorSize, extraSize, flags = 0)
    {
        // validate the input texture
        _utils_utils__WEBPACK_IMPORTED_MODULE_5__["Utils"].assert(encodedKeypoints.width === encodedKeypoints.height);
        _utils_utils__WEBPACK_IMPORTED_MODULE_5__["Utils"].assert(encodedKeypoints.width === this._encoderLength);

        // reset the capacity of the downloader
        if(flags & FeatureDownloader.RESET_DOWNLOADER_STATE != 0) {
            this._estimator.reset();
            //this._encoderLength = INITIAL_ENCODER_LENGTH; // no need
        }

        // download keypoints
        const useBufferedDownloads = (flags & FeatureDownloader.USE_BUFFERED_DOWNLOADS) != 0;
        return gpu.programs.encoders.downloadEncodedKeypoints(encodedKeypoints, useBufferedDownloads).then(data => {

            // decode the keypoints
            const encoderLength = encodedKeypoints.width;
            const multiplier = (flags & FeatureDownloader.SUPPRESS_DESCRIPTORS) != 0 ? 0 : 1;
            const keypoints = _feature_encoder__WEBPACK_IMPORTED_MODULE_0__["FeatureEncoder"].decode(data, descriptorSize * multiplier, extraSize, encoderLength);

            // how many keypoints do we expect in the next frame?
            const discardedCount = this._countDiscardedKeypoints(keypoints);
            const nextCount = this._estimator.estimate(keypoints.length - discardedCount);

            // optimize the keypoint encoder
            // add slack (maxGrowth) to accomodate for abrupt changes in the number of keypoints
            const capacity = Math.max(nextCount, MIN_KEYPOINTS);
            const extraCapacity = this._estimator.maxGrowth * capacity;
            this._encoderLength = _feature_encoder__WEBPACK_IMPORTED_MODULE_0__["FeatureEncoder"].minLength(extraCapacity, descriptorSize, extraSize);

            // done!
            return keypoints;

        }).catch(err => {
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalOperationError"](`Can't download keypoints`, err);
        });
    }

    /**
     * Size of the keypoint encoder texture
     * @returns {number}
     */
    get encoderLength()
    {
        return this._encoderLength;
    }

    /**
     * Ensures that encoderLength is large enough to handle a
     * particular configuration of the keypoint encoder
     * @param {number} keypointCount integer
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {boolean} [tight] make it a tight fit (i.e., remove any slack)
     */
    reserveSpace(keypointCount, descriptorSize, extraSize, tight = false)
    {
        const e = _feature_encoder__WEBPACK_IMPORTED_MODULE_0__["FeatureEncoder"].minLength(keypointCount, descriptorSize, extraSize);
        this._encoderLength = tight ? e : Math.max(this._encoderLength, e);
    }

    /**
     * Count keypoints that should be discarded
     * @param {SpeedyFeature[]} keypoints
     */
    _countDiscardedKeypoints(keypoints)
    {
        let i, count = 0;

        for(i = keypoints.length - 1; i >= 0; i--)
            count += ((keypoints[i].flags & _utils_globals__WEBPACK_IMPORTED_MODULE_6__["KPF_DISCARD"]) != 0) | 0;

        return count;
    }



    /**
     * Flags accepted by the FeatureDownloader (bitwise)
     * @typedef {number} FeatureDownloaderFlag
     */

    /**
     * Flag: reset the state of the downloader
     * @returns {FeatureDownloaderFlag}
     */
    static get RESET_DOWNLOADER_STATE()
    {
        return 1;
    }

    /**
     * Flag: use buffered downloads
     * It's an optimization technique that implies a 1-frame delay
     * in the downloads when using async transfers; it may or may
     * not be acceptable, depending on what you're trying to do
     * @returns {FeatureDownloaderFlag}
     */
    static get USE_BUFFERED_DOWNLOADS()
    {
        return 2;
    }

    /**
     * Flag: suppress feature descriptors
     * This is meant to improve download times. Use if the
     * descriptors are not needed by the end-user
     * @returns {FeatureDownloaderFlag}
     */
    static get SUPPRESS_DESCRIPTORS()
    {
        return 4;
    }
}

/***/ }),

/***/ "./src/core/keypoints/feature-encoder.js":
/*!***********************************************!*\
  !*** ./src/core/keypoints/feature-encoder.js ***!
  \***********************************************/
/*! exports provided: FeatureEncoder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeatureEncoder", function() { return FeatureEncoder; });
/* harmony import */ var _speedy_feature__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-feature */ "./src/core/speedy-feature.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/globals */ "./src/utils/globals.js");
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
 * feature-encoder.js
 * Utilities related to the encoding of feature points in a texture
 */




// Constants
const MIN_ENCODER_LENGTH = Math.ceil(Math.sqrt(_utils_globals__WEBPACK_IMPORTED_MODULE_1__["MIN_KEYPOINT_SIZE"] / 4)); // Minimum size of the keypoint encoder, in pixels
const MAX_ENCODER_LENGTH = 300; // Maximum size of the keypoint encoder - make it too large, and you may get a crash (WebGL context lost)

/**
 * Utilities related to the encoding of feature points in a texture
 */
class FeatureEncoder
{
    /**
     * The minimum encoder length for a set of keypoints
     * @param {number} keypointCount integer
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @returns {number}
     */
    static minLength(keypointCount, descriptorSize, extraSize)
    {
        const pixelsPerKeypoint = Math.ceil((_utils_globals__WEBPACK_IMPORTED_MODULE_1__["MIN_KEYPOINT_SIZE"] + descriptorSize + extraSize) / 4);
        const clampedKeypointCount = Math.max(0, Math.ceil(keypointCount));
        const len = Math.ceil(Math.sqrt(clampedKeypointCount * pixelsPerKeypoint));

        return Math.max(MIN_ENCODER_LENGTH, Math.min(len, MAX_ENCODER_LENGTH));
    }

    /**
     * The maximum number of keypoints we can store using
     * a particular configuration of a keypoint encoder
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     */
    static capacity(descriptorSize, extraSize, encoderLength)
    {
        const pixelsPerKeypoint = Math.ceil((_utils_globals__WEBPACK_IMPORTED_MODULE_1__["MIN_KEYPOINT_SIZE"] + descriptorSize + extraSize) / 4);
        const numberOfPixels = encoderLength * encoderLength;

        return Math.floor(numberOfPixels / pixelsPerKeypoint);
    }

    /**
     * Decode a sequence of keypoints, given a flattened
     * image of encoded pixels
     * @param {Uint8Array[]} pixels pixels in the [r,g,b,a,...] format
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     * @returns {SpeedyFeature[]} keypoints
     */
    static decode(pixels, descriptorSize, extraSize, encoderLength)
    {
        const pixelsPerKeypoint = Math.ceil((_utils_globals__WEBPACK_IMPORTED_MODULE_1__["MIN_KEYPOINT_SIZE"] + descriptorSize + extraSize) / 4);
        let x, y, lod, rotation, score, flags, extraBytes, descriptorBytes;
        let hasLod, hasRotation;
        const keypoints = [];

        // how many bytes should we read?
        const e = encoderLength;
        const e2 = e * e * pixelsPerKeypoint * 4;
        const size = Math.min(pixels.length, e2);

        // copy the data (we use shared buffers when receiving pixels[])
        if(descriptorSize + extraSize > 0)
            pixels = new Uint8Array(pixels);

        // for each encoded keypoint
        for(let i = 0; i < size; i += 4 /* RGBA */ * pixelsPerKeypoint) {
            // extract fixed-point coordinates
            x = (pixels[i+1] << 8) | pixels[i];
            y = (pixels[i+3] << 8) | pixels[i+2];
            if(x >= 0xFFFF && y >= 0xFFFF) // if end of list
                break;

            // We've cleared the texture to black.
            // Likely to be incorrect black pixels
            // due to resize. Bad for encoderLength
            if(x + y == 0 && pixels[i+6] == 0)
                continue; // discard, it's noise

            // convert from fixed-point
            x /= _utils_globals__WEBPACK_IMPORTED_MODULE_1__["FIX_RESOLUTION"];
            y /= _utils_globals__WEBPACK_IMPORTED_MODULE_1__["FIX_RESOLUTION"];

            // extract flags
            flags = pixels[i+7];

            // extract LOD
            hasLod = (pixels[i+4] < 255);
            lod = !hasLod ? 0.0 :
                -_utils_globals__WEBPACK_IMPORTED_MODULE_1__["LOG2_PYRAMID_MAX_SCALE"] + (_utils_globals__WEBPACK_IMPORTED_MODULE_1__["LOG2_PYRAMID_MAX_SCALE"] + _utils_globals__WEBPACK_IMPORTED_MODULE_1__["PYRAMID_MAX_LEVELS"]) * pixels[i+4] / 255.0;

            // extract orientation
            hasRotation = (flags & _utils_globals__WEBPACK_IMPORTED_MODULE_1__["KPF_ORIENTED"] != 0);
            rotation = !hasRotation ? 0.0 :
                ((2 * pixels[i+5]) / 255.0 - 1.0) * Math.PI;

            // extract score
            score = pixels[i+6] / 255.0;

            // extra bytes
            extraBytes = pixels.subarray(8 + i, 8 + i + extraSize);

            // descriptor bytes
            descriptorBytes = pixels.subarray(8 + i + extraSize, 8 + i + extraSize + descriptorSize);

            // something is off here
            if(descriptorBytes.length < descriptorSize || extraBytes.length < extraSize)
                continue; // discard

            // register keypoint
            keypoints.push(
                new _speedy_feature__WEBPACK_IMPORTED_MODULE_0__["SpeedyFeature"](x, y, lod, rotation, score, flags, extraBytes, descriptorBytes)
            );
        }

        // done!
        return keypoints;
    }
}

/***/ }),

/***/ "./src/core/keypoints/feature-tracking-algorithm.js":
/*!**********************************************************!*\
  !*** ./src/core/keypoints/feature-tracking-algorithm.js ***!
  \**********************************************************/
/*! exports provided: FeatureTrackingAlgorithm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeatureTrackingAlgorithm", function() { return FeatureTrackingAlgorithm; });
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _feature_algorithm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./feature-algorithm */ "./src/core/keypoints/feature-algorithm.js");
/* harmony import */ var _feature_downloader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./feature-downloader */ "./src/core/keypoints/feature-downloader.js");
/* harmony import */ var _feature_encoder__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./feature-encoder */ "./src/core/keypoints/feature-encoder.js");
/* harmony import */ var _speedy_feature__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../speedy-feature */ "./src/core/speedy-feature.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
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
 * feature-tracking-algorithm.js
 * Abstract feature tracking algorithm
 */











/**
 * Abstract feature tracking algorithm
 * @abstract
 */
class FeatureTrackingAlgorithm extends _feature_algorithm__WEBPACK_IMPORTED_MODULE_3__["FeatureAlgorithm"]
{
    /**
     * Class constructor
     */
    constructor()
    {
        super(0, 0);

        /** @type {SpeedyTexture} previous image */
        this._prevImage = null;

        /** @type {SpeedyTexture} tiny texture with encoded keypoints */
        this._prevKeypoints = null;

        /** @type {FeatureDownloader} keypoint downloader */
        this._downloader = new _feature_downloader__WEBPACK_IMPORTED_MODULE_4__["FeatureDownloader"]();
    }

    /**
     * To "run" this algorithm means: to track feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image (nextImage)
     * @returns {SpeedyTexture} tiny texture with encoded keypoints (the result of tracking)
     */
    run(gpu, inputTexture)
    {
        return this._track(gpu, inputTexture);
    }

    /**
     * Get previous image (time: t-1)
     * @returns {SpeedyTexture}
     */
    get prevImage()
    {
        return this._prevImage;
    }

    /**
     * Set previous image (time: t-1)
     * @param {SpeedyTexture} texture
     */
    set prevImage(texture)
    {
        this._prevImage = texture;
    }

    /**
     * Get previous keypoints (time: t-1)
     * as a tiny texture with encoded data
     * @returns {SpeedyTexture}
     */
    get prevKeypoints()
    {
        return this._prevKeypoints;
    }

    /**
     * Set previous keypoints (time: t-1)
     * as a tiny texture with encoded data
     * @param {SpeedyTexture} texture
     */
    set prevKeypoints(texture)
    {
        this._prevKeypoints = texture;
    }

    /**
     * Download feature points from the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} encodedKeypoints tiny texture with encoded keypoints
     * @param {FeatureDownloaderFlag} [flags] will be passed to the downloader
     * @returns {SpeedyPromise<SpeedyFeature[]>}
     */
    download(gpu, encodedKeypoints, flags = 0)
    {
        if(flags & _feature_downloader__WEBPACK_IMPORTED_MODULE_4__["FeatureDownloader"].USE_BUFFERED_DOWNLOADS != 0)
            _utils_utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].warning(`Feature trackers shouldn't use buffered downloads`);

        return this._downloader.download(gpu, encodedKeypoints, this.descriptorSize, this.extraSize, flags);
    }

    /**
     * Size of the keypoint encoder texture
     * @returns {number}
     */
    get encoderLength()
    {
        return this._downloader.encoderLength;
    }

    /**
     * The feature downloader
     * @returns {FeatureDownloader}
     */
    get downloader()
    {
        return this._downloader;
    }

    /**
     * Upload feature points to the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyFeature[]} keypoints feature points
     * @returns {SpeedyTexture} tiny texture
     */
    upload(gpu, keypoints)
    {
        const encoderLength = _feature_encoder__WEBPACK_IMPORTED_MODULE_5__["FeatureEncoder"].minLength(keypoints.length, this.descriptorSize, this.extraSize);
        return gpu.programs.encoders.uploadKeypoints(keypoints, this.descriptorSize, this.extraSize, encoderLength);
    }

    /**
     * Track a set of feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} nextImage next image (time: t)
     * @returns {SpeedyTexture} nextKeypoints tiny texture with encoded keypoints (time: t)
     */
    _track(gpu, nextImage)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["AbstractMethodError"]();
    }
}

/***/ }),

/***/ "./src/core/keypoints/trackers/lk.js":
/*!*******************************************!*\
  !*** ./src/core/keypoints/trackers/lk.js ***!
  \*******************************************/
/*! exports provided: LKFeatureTrackingAlgorithm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LKFeatureTrackingAlgorithm", function() { return LKFeatureTrackingAlgorithm; });
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _feature_tracking_algorithm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../feature-tracking-algorithm */ "./src/core/keypoints/feature-tracking-algorithm.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/globals */ "./src/utils/globals.js");
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
 * lk.js
 * Lucas-Kanade feature tracker in a pyramid
 */







// Constants
const DEFAULT_WINDOW_SIZE = 15;
const DEFAULT_DEPTH = Math.min(6, _utils_globals__WEBPACK_IMPORTED_MODULE_4__["PYRAMID_MAX_LEVELS"]);
const DEFAULT_NUMBER_OF_ITERATIONS = 5;
const DEFAULT_DISCARD_THRESHOLD = 0.0001;
const DEFAULT_EPSILON = 0.01;

/**
 * Lucas-Kanade feature tracker in a pyramid
 */
class LKFeatureTrackingAlgorithm extends _feature_tracking_algorithm__WEBPACK_IMPORTED_MODULE_2__["FeatureTrackingAlgorithm"]
{
    /**
     * Constructor
     */
    constructor()
    {
        super();
        this._windowSize = DEFAULT_WINDOW_SIZE;
        this._depth = DEFAULT_DEPTH;
        this._numberOfIterations = DEFAULT_NUMBER_OF_ITERATIONS;
        this._discardThreshold = DEFAULT_DISCARD_THRESHOLD;
        this._epsilon = DEFAULT_EPSILON;
    }

    /**
     * Get neighborhood size
     * @returns {number}
     */
    get windowSize()
    {
        return this._windowSize;
    }

    /**
     * Set neighborhood size
     * @param {number} value positive odd number
     */
    set windowSize(value)
    {
        this._windowSize = value | 0;
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(this._windowSize % 2 === 1 && this._windowSize >= 1);
    }

    /**
     * Get depth, i.e., how many pyramid levels will be scanned
     * @returns {number}
     */
    get depth()
    {
        return this._depth;
    }

    /**
     * Set depth, i.e., how many pyramid levels will be scanned
     * @param {number} value positive integer (1, 2, 3, 4...)
     */
    set depth(value)
    {
        this._depth = value | 0;
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(this._depth >= 1 && this._depth <= _utils_globals__WEBPACK_IMPORTED_MODULE_4__["PYRAMID_MAX_LEVELS"]);
    }

    /**
     * Get the maximum number of iterations of the pyramidal LK algorithm
     * @returns {number}
     */
    get numberOfIterations()
    {
        return this._numberOfIterations;
    }

    /**
     * Set the maximum number of iterations of the pyramidal LK algorithm
     * @param {number} value
     */
    set numberOfIterations(value)
    {
        this._numberOfIterations = value | 0;
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(this._numberOfIterations >= 1);
    }

    /**
     * Get the discard threshold, used to discard "bad" keypoints
     * @returns {number}
     */
    get discardThreshold()
    {
        return this._discardThreshold;
    }

    /**
     * Set the discard threshold, used to discard "bad" keypoints
     * @param {number} value typically 10^(-4) - increase to discard more
     */
    set discardThreshold(value)
    {
        this._discardThreshold = +value;
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(this._discardThreshold >= 0);
    }

    /**
     * Get the accuracy threshold, used to stop LK iterations
     * @returns {number}
     */
    get epsilon()
    {
        return this._epsilon;
    }

    /**
     * Get the accuracy threshold, used to stop LK iterations
     * @param {number} value typically 0.01
     */
    set epsilon(value)
    {
        this._epsilon = +value;
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(this._epsilon >= 0);
    }

    /**
     * Track a set of feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} nextImage next image (time: t)
     * @returns {SpeedyTexture} nextKeypoints tiny texture with encoded keypoints (time: t)
     */
    _track(gpu, nextImage)
    {
        const prevImage = this.prevImage;
        const prevKeypoints = this.prevKeypoints;
        const descriptorSize = this.descriptorSize;
        const extraSize = this.extraSize;
        const encoderLength = this.encoderLength;
        const windowSize = this.windowSize;
        const depth = this.depth;
        const numberOfIterations = this.numberOfIterations;
        const discardThreshold = this.discardThreshold;
        const epsilon = this.epsilon;

        // create pyramids
        const nextPyramid = nextImage.generateMipmaps(gpu);
        const prevPyramid = prevImage.generateMipmaps(gpu);

        // track feature points
        return gpu.programs.trackers.lk(nextPyramid, prevPyramid, prevKeypoints, windowSize, depth, numberOfIterations, discardThreshold, epsilon, descriptorSize, extraSize, encoderLength);
    }
}

/***/ }),

/***/ "./src/core/math/bound-matrix-operation.js":
/*!*************************************************!*\
  !*** ./src/core/math/bound-matrix-operation.js ***!
  \*************************************************/
/*! exports provided: BoundMatrixOperation, BoundMatrixOperationTree */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BoundMatrixOperation", function() { return BoundMatrixOperation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BoundMatrixOperationTree", function() { return BoundMatrixOperationTree; });
/* harmony import */ var _matrix_operations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrix-operations */ "./src/core/math/matrix-operations.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./matrix */ "./src/core/math/matrix.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * bound-matrix-operation.js
 * Bound matrix operations
 */






/**
 * A MatrixOperation bound with input & output matrices
 */
class BoundMatrixOperation
{
    /**
     * Constructor
     * @param {?MatrixOperation} operation if null, this is just a helper no-op
     * @param {SpeedyMatrix} outputMatrix
     * @param {SpeedyMatrix[]} inputMatrices
     */
    constructor(operation, outputMatrix, inputMatrices)
    {
        /** @type {?MatrixOperation} matrix operation */
        this.operation = operation;

        /** @type {SpeedyMatrix} output matrix */
        this.outputMatrix = outputMatrix;

        /** @type {SpeedyMatrix[]} input matrices */
        this.inputMatrices = inputMatrices;

        // validate
        if(this.operation !== null)
            _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(this.operation.numberOfInputMatrices() === this.inputMatrices.length);

        // make it immutable
        return Object.freeze(this);
    }
}

/**
 * A tree of bound matrix operations
 */
class BoundMatrixOperationTree
{
    /**
     * Constructor
     * @param {?MatrixOperation} operation operation of this node
     * @param {SpeedyMatrix} outputMatrix output of this operation tree
     * @param {BoundMatrixOperationTree[]} [children] child nodes
     * @param {BoundMatrixOperationTree[]} [subroutines] callbacks
     */
    constructor(operation, outputMatrix, children = [], subroutines = [])
    {
        /** @type {BoundMatrixOperation} operation of this node */
        this._boundOperation = new BoundMatrixOperation(
            operation, // if operation is null, this is just an empty node to help construct the tree
            outputMatrix,
            children.map(child => child._boundOperation.outputMatrix)
        );

        /** @type {BoundMatrixOperationTree[]} child nodes */
        this._children = children;

        /** @type {Array<pair<string,BoundMatrixOperationTree>>} subroutines are packed within this node */
        this._subroutines = subroutines;

        // make it immutable
        return Object.freeze(this);
    }

    /**
     * The operation associated with this node of the tree
     * @returns {MatrixOperation}
     */
    get operation()
    {
        return this._boundOperation.operation;
    }

    /**
     * The output matrix of this node of the tree
     * @returns {SpeedyMatrix}
     */
    get outputMatrix()
    {
        return this._boundOperation.outputMatrix;
    }

    /**
     * Pack the tree into a single BoundMatrixOperation
     * @returns {BoundMatrixOperation}
     */
    pack()
    {
        const matrices = []; // matrices of the ENTIRE tree
        const stack = [ [ this, false ] ];
        const steps = [];

        // transform the tree into a sequence of operations
        while(stack.length > 0) {
            const [ node, done ] = stack.pop();
            if(!done) {
                // visit children (in increasing order)
                stack.push([ node, true ]);
                for(let i = node._children.length - 1; i >= 0; i--)
                    stack.push([ node._children[i], false ]);
            }
            else if(node._boundOperation.operation !== null) {
                // visit this node (we skip it if the operation is null)
                const { operation, outputMatrix, inputMatrices } = node._boundOperation;
                const indexOfOutputMatrix = this._findOrAdd(matrices, outputMatrix);
                const indicesOfInputMatrices = inputMatrices.map(inputMatrix => this._findOrAdd(matrices, inputMatrix));

                // the operation of this node contains other operations
                for(let i = node._subroutines.length - 1; i >= 0; i--) {
                    const [ subname, subtree ] = node._subroutines[i];
                    const sub = subtree.pack();
                    const remap = mat => this._findOrAdd(indicesOfInputMatrices, this._findOrAdd(matrices, mat));
                    sub.operation.adjustIndices(remap, sub.inputMatrices);
                    operation.setStepsOf(subname, sub.operation.steps());
                }

                // this node becomes a step in a sequence of operations
                const step = _matrix_operations__WEBPACK_IMPORTED_MODULE_0__["MatrixOperationSequence"].step(operation, indexOfOutputMatrix, indicesOfInputMatrices)
                step.header.updateMetadata(outputMatrix, inputMatrices);
                steps.push(step);
            }
        }

        // bind the sequence of operations to the appropriate matrices
        return new BoundMatrixOperation(
            new _matrix_operations__WEBPACK_IMPORTED_MODULE_0__["MatrixOperationSequence"](
                matrices.length,
                this.outputMatrix.shape,
                steps
            ),
            this.outputMatrix,
            matrices
        );
    }

    /**
     * Find an element in an array. If it doesn't exist, add it.
     * @param {Array} array
     * @param {object|number} element
     * @return {number} index of the element in the array
     */
    _findOrAdd(array, element)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(element !== undefined);
        const idx = array.lastIndexOf(element);
        return idx >= 0 ? idx : array.push(element) - 1;
    }
}

/***/ }),

/***/ "./src/core/math/linalg/basic.js":
/*!***************************************!*\
  !*** ./src/core/math/linalg/basic.js ***!
  \***************************************/
/*! exports provided: nop, fill, copy, transpose, add, subtract, multiply, multiplylt, multiplyrt, multiply3, multiplyvec, scale, compmult, outer, addInPlace */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nop", function() { return nop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fill", function() { return fill; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "copy", function() { return copy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transpose", function() { return transpose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add", function() { return add; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subtract", function() { return subtract; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "multiply", function() { return multiply; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "multiplylt", function() { return multiplylt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "multiplyrt", function() { return multiplyrt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "multiply3", function() { return multiply3; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "multiplyvec", function() { return multiplyvec; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scale", function() { return scale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compmult", function() { return compmult; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "outer", function() { return outer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addInPlace", function() { return addInPlace; });
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
 * basic.js
 * Basic matrix operations
 */

/**
 * No-operation
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function nop(header, output, inputs)
{
}

/**
 * Fill the matrix with a constant value
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function fill(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const { value } = header.custom;
    const length = output.length;

    // use a memset-like operation if possible
    if(rows * columns == length) {
        output.fill(value, 0, length);
        return;
    }

    // fill the columns one by one
    for(let j = 0; j < columns; j++)
        output.fill(value, j * stride, j * stride + rows);
}

/**
 * Copy matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function copy(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ istride ] = header.strideOfInputs;
    const [ input ] = inputs;
    const length = output.length;

    // use a memcpy-like operation if possible
    if(length == header.lengthOfInputs[0] && rows * columns == length) {
        output.set(input, 0, length);
        return;
    }

    // copy values one by one
    let i, j, oj, ij;
    for(oj = ij = j = 0; j < columns; j++, oj += stride, ij += istride) {
        for(i = 0; i < rows; i++)
            output[oj + i] = input[ij + i];
    }
}

/**
 * Transpose matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function transpose(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ strideT ] = header.strideOfInputs;
    const [ input ] = inputs;

    let i, j, ii, oj;
    for(ii = i = 0; i < rows; i++, ii += strideT) {
        for(oj = j = 0; j < columns; j++, oj += stride)
            output[oj + i] = input[ii + j];
    }
}

/**
 * Add two matrices
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function add(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ strideA, strideB ] = header.strideOfInputs;
    const [ a, b ] = inputs;

    let i, j, oj, aj, bj;
    for(aj = bj = oj = j = 0; j < columns; j++, oj += stride, bj += strideB, aj += strideA) {
        for(i = 0; i < rows; i++)
            output[oj + i] = a[aj + i] + b[bj + i];
    }
}

/**
 * Subtract two matrices
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function subtract(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ strideA, strideB ] = header.strideOfInputs;
    const [ a, b ] = inputs;

    let i, j, oj, aj, bj;
    for(aj = bj = oj = j = 0; j < columns; j++, oj += stride, bj += strideB, aj += strideA) {
        for(i = 0; i < rows; i++)
            output[oj + i] = a[aj + i] - b[bj + i];
    }
}

/**
 * Multiply two matrices (e.g., C = A B)
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function multiply(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ columnsA, columnsB ] = header.columnsOfInputs;
    const [ strideA, strideB ] = header.strideOfInputs;
    const [ a, b ] = inputs;
    const length = output.length;

    // clear matrix
    if(rows * columns != length) {
        for(let c = 0; c < columns; c++)
            output.fill(0, c * stride, c * stride + rows);
    }
    else
        output.fill(0, 0, length);

    // multiply taking cache locality into account
    let i, j, k, ok, aj, bk, bjk;
    for(ok = bk = k = 0; k < columnsB; k++, ok += stride, bk += strideB) {
        for(aj = j = 0; j < columnsA; j++, aj += strideA) {
            bjk = b[bk + j];
            for(i = 0; i < rows; i++)
                output[ok + i] += a[aj + i] * bjk;
        }
    }
}

/**
 * Multiply two matrices, transposing the left operand
 * (e.g., C = A^T B)
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function multiplylt(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ columnsA, columnsB ] = header.columnsOfInputs;
    const [ rowsA, rowsB ] = header.rowsOfInputs;
    const [ strideA, strideB ] = header.strideOfInputs;
    const [ a, b ] = inputs;

    // multiply taking cache locality into account
    let i, j, k, aj, bk, ok, ojk;
    for(ok = bk = k = 0; k < columnsB; k++, ok += stride, bk += strideB) {
        for(aj = j = 0; j < columnsA; j++, aj += strideA) {
            output[ojk = ok + j] = 0;
            for(i = 0; i < rowsB; i++)
                output[ojk] += a[aj + i] * b[bk + i];
        }
    }
}

/**
 * Multiply two matrices, transposing the right operand
 * (e.g., C = A B^T)
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function multiplyrt(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ columnsA, columnsB ] = header.columnsOfInputs;
    const [ rowsA, rowsB ] = header.rowsOfInputs;
    const [ strideA, strideB ] = header.strideOfInputs;
    const [ a, b ] = inputs;
    const length = output.length;

    // clear matrix
    if(rows * columns != length) {
        for(let c = 0; c < columns; c++)
            output.fill(0, c * stride, c * stride + rows);
    }
    else
        output.fill(0, 0, length);

    // multiply taking cache locality into account
    let i, j, k, ok, aj, bj, bkj;
    for(aj = bj = j = 0; j < columnsA; j++, aj += strideA, bj += strideB) {
        for(ok = k = 0; k < rowsB; k++, ok += stride) {
            bkj = b[bj + k];
            for(i = 0; i < rows; i++)
                output[ok + i] += a[aj + i] * bkj;
        }
    }
}

/**
 * Fast multiplication of two 3x3 matrices (A * B)
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function multiply3(header, output, inputs)
{
    const { stride } = header;
    const [ matA, matB ] = inputs;
    const [ sa, sb ] = header.strideOfInputs;
    const sa2 = sa + sa, sb2 = sb + sb;
    const stride2 = stride + stride;
    const a = matA[0], b = matA[0 + sa], c = matA[0 + sa2],
          d = matA[1], e = matA[1 + sa], f = matA[1 + sa2],
          g = matA[2], h = matA[2 + sa], i = matA[2 + sa2],
          j = matB[0], k = matB[0 + sb], l = matB[0 + sb2],
          m = matB[1], n = matB[1 + sb], o = matB[1 + sb2],
          p = matB[2], q = matB[2 + sb], r = matB[2 + sb2];

    output[0] = a*j + b*m + c*p;
    output[1] = d*j + e*m + f*p;
    output[2] = g*j + h*m + i*p;

    output[0 + stride] = a*k + b*n + c*q;
    output[1 + stride] = d*k + e*n + f*q;
    output[2 + stride] = g*k + h*n + i*q;

    output[0 + stride2] = a*l + b*o + c*r;
    output[1 + stride2] = d*l + e*o + f*r;
    output[2 + stride2] = g*l + h*o + i*r;
}

/**
 * Multiply by a column-vector
 * (i.e., y = A x)
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function multiplyvec(header, output, inputs)
{
    const [ irows ] = header.rowsOfInputs;
    const [ icolumns ] = header.columnsOfInputs;
    const [ istride ] = header.strideOfInputs;
    const [ a, x ] = inputs;

    output.fill(0, 0, irows);

    let i, j, aj, xj;
    for(aj = j = 0; j < icolumns; j++, aj += istride) {
        xj = x[j];
        for(i = 0; i < irows; i++)
            output[i] += a[aj + i] * xj;
    }
}

/**
 * Multiply by a constant
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function scale(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const { scalar } = header.custom;
    const [ input ] = inputs;

    let i, j, oj;
    for(j = 0; j < columns; j++) {
        oj = j * stride;
        for(i = 0; i < rows; i++)
            output[oj + i] = input[oj + i] * scalar;
    }
}

/**
 * Component-wise multiplication
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function compmult(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ strideA, strideB ] = header.strideOfInputs;
    const [ a, b ] = inputs;

    let i, j, oj, aj, bj;
    for(aj = bj = oj = j = 0; j < columns; j++, oj += stride, aj += strideA, bj += strideB) {
        for(i = 0; i < rows; i++)
            output[oj + i] = a[aj + i] * b[bj + i];
    }
}

/**
 * Outer product (m x 1 vector by 1 x n vector)
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function outer(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ strideA, strideB ] = header.strideOfInputs;
    const [ a, b ] = inputs;       

    let i, j, bj, oj, obj;
    for(obj = oj = j = 0; j < columns; j++, oj += stride, obj += strideB) {
        bj = b[obj]; //b[j * strideB];
        for(i = 0; i < rows; i++)
            output[oj + i] = a[i] * bj;
    }
}

/**
 * Given matrices A and B, scalars alpha and beta,
 * compute the sum (alpha A + beta B). The output
 * array can be one of the input arrays
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function addInPlace(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ strideA, strideB ] = header.strideOfInputs;
    const { alpha, beta } = header.custom;
    const [ a, b ] = inputs;

    let i, j, oj, aj, bj;
    for(aj = bj = oj = j = 0; j < columns; j++, oj += stride, aj += strideA, bj += strideB) {
        for(i = 0; i < rows; i++)
            output[oj + i] = alpha * a[aj + i] + beta * b[bj + i];
    }
}

/***/ }),

/***/ "./src/core/math/linalg/functional.js":
/*!********************************************!*\
  !*** ./src/core/math/linalg/functional.js ***!
  \********************************************/
/*! exports provided: map, reduce, sort */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "map", function() { return map; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reduce", function() { return reduce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sort", function() { return sort; });
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * functional.js
 * Functional programming
 */

/**
 * Map the blocks of a matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function map(header, output, inputs)
{
    const [ input, mapfn, bi, index ] = inputs;
    const { rows, columns, stride } = header;
    const [ istride, mstride, bistride ] = header.strideOfInputs;
    const [ outputBlockRows, outputBlockColumns ] = [ header.rowsOfInputs[1], header.columnsOfInputs[1] ];
    const [ blockRows, blockColumns ] = [ header.rowsOfInputs[2], header.columnsOfInputs[2] ];
    const [ ilength, bilength ] = [ inputs[0].length, inputs[2].length ];
    const n = columns / blockColumns;
    const biidx = 2; //inputs.indexOf(bi);
    const blkopt = (bistride === istride && bilength === ilength);
    const block = blkopt ? Array.from({ length: n }, (_, i) => input.subarray(i * istride * blockColumns, (i+1) * istride * blockColumns)) : null;
    let b, i, j, ij, oj;

    // for each block
    for(b = 0; b < n; b++) {
        // copy block[b] to bi
        if(block != null)
            inputs[biidx] = block[b];
        else for(oj = 0, ij = b * istride * blockColumns, j = 0; j < blockColumns; j++, oj += bistride, ij += istride) {
            for(i = 0; i < blockRows; i++)
                bi[oj + i] = input[ij + i];
        }

        // call mapfn(bi, index)
        index[0] = b;
        this.subroutine('mapfn', header, inputs);

        // copy mapfn to outputBlock[b]
        for(oj = b * outputBlockColumns * stride, ij = 0, j = 0; j < outputBlockColumns; j++, oj += stride, ij += mstride) {
            for(i = 0; i < outputBlockRows; i++)
                output[oj + i] = mapfn[ij + i];
        }
    }

    // restore pointer
    inputs[biidx] = bi;
}

/**
 * Reduce the blocks of a matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function reduce(header, output, inputs)
{
    const [ input, reducefn, accumulator, bi, index, initial ] = inputs;
    const { rows, columns, stride } = header;
    const [ istride, rstride, astride, bistride, indexstride, initialstride ] = header.strideOfInputs;
    const [ ilength, rlength, alength, bilength, indexlength, initiallength ] = inputs.map(m => m.length);
    const [ blockRows, blockColumns ] = [ header.rowsOfInputs[3], header.columnsOfInputs[3] ];
    const length = output.length;
    const begopt = (astride === initialstride && alength === initiallength);
    const midopt = (astride === rstride && alength === rlength);
    const endopt = (astride === stride && alength === length);
    const blkopt = (bistride === istride && bilength === ilength);
    const n = header.columnsOfInputs[0] / blockColumns;
    const biidx = 3; //inputs.indexOf(bi);
    const block = blkopt ? Array.from({ length: n }, (_, i) => input.subarray(i * istride * blockColumns, (i+1) * istride * blockColumns)) : null;
    let b, i, j, ij, oj;

    // copy the initial matrix to the accumulator
    if(begopt) // optimize copy
        accumulator.set(initial); // memcpy()-like - is it required that dtype of accumulator === dtype of initial ?
    else for(oj = 0, ij = 0, j = 0; j < columns; j++, ij += initialstride, oj += astride) {
        for(i = 0; i < rows; i++)
            accumulator[oj + i] = initial[ij + i];
    }

    // for each block
    for(b = 0; b < n; b++) {
        // copy block[b] to bi
        if(block != null)
            inputs[biidx] = block[b];
        else for(oj = 0, ij = b * istride * blockColumns, j = 0; j < blockColumns; j++, oj += bistride, ij += istride) {
            for(i = 0; i < blockRows; i++)
                bi[oj + i] = input[ij + i];
        }

        // call reducefn(accumulator, bi, index)
        index[0] = b;
        this.subroutine('reducefn', header, inputs);

        // copy reducefn to the accumulator
        if(midopt)
            accumulator.set(reducefn);
        else for(oj = 0, ij = 0, j = 0; j < columns; j++, ij += rstride, oj += astride) {
            for(i = 0; i < rows; i++)
                accumulator[oj + i] = reducefn[ij + i];
        }
    }

    // copy the accumulator to the output
    if(endopt)
        output.set(accumulator);
    else for(oj = 0, ij = 0, j = 0; j < columns; j++, ij += astride, oj += stride) {
        for(i = 0; i < rows; i++)
            output[oj + i] = accumulator[ij + i];
    }

    // restore pointer
    inputs[biidx] = bi;
}

/**
 * Sort the blocks of a matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function sort(header, output, inputs)
{
    const [ input, cmp, bi, bj ] = inputs;
    const { rows, columns, stride } = header;
    const [ istride, cmpstride, bistride, bjstride ] = header.strideOfInputs;
    const [ ilength, cmplength, bilength, bjlength ] = inputs.map(m => m.length);
    const [ blockRows, blockColumns ] = [ header.rowsOfInputs[2], header.columnsOfInputs[2] ];
    const n = columns / blockColumns;
    const biidx = 2, bjidx = 3; //const biidx = inputs.indexOf(bi), bjidx = inputs.indexOf(bj);
    const biopt = (bistride === istride && bilength === ilength), bjopt = (bjstride === istride && bjlength === ilength); // note: bistride === bjstride
    const block = biopt && bjopt ? Array.from({ length: n }, (_, i) => input.subarray(i * istride * blockColumns, (i+1) * istride * blockColumns)) : null;
    const permutation = this.range(n);
    const stack = (new Array(n)).fill(0);
    let top = -1, l = 0, r = 0, p = 0, pivot = 0;
    let i, j, oj, ij;
    let a, b, c, t;

    // quicksort on a permutation of indices of blocks
    stack[++top] = 0;
    stack[++top] = n - 1;
    while(top >= 0) {
        r = stack[top--];
        l = stack[top--];

        // partition
        p = (l + r) >>> 1;
        pivot = permutation[p];

        // copy block[pivot] to bj
        if(block != null)
            inputs[bjidx] = block[pivot]; // it's faster if we just set a reference
        else for(oj = 0, ij = pivot * istride * blockColumns, j = 0; j < blockColumns; j++, oj += bjstride, ij += istride) {
            for(i = 0; i < blockRows; i++)
                bj[oj + i] = input[ij + i];
        }

        a = l - 1; b = r + 1;
        for(;;) {
            do {
                a++;

                // copy block[permutation[a]] to bi
                if(block != null)
                    inputs[biidx] = block[permutation[a]];
                else for(oj = 0, ij = permutation[a] * istride * blockColumns, j = 0; j < blockColumns; j++, oj += bistride, ij += istride) {
                    for(i = 0; i < blockRows; i++)
                        bi[oj + i] = input[ij + i];
                }

                // is block[permutation[a]] < block[pivot] ?
                this.subroutine('cmp', header, inputs);
            } while(cmp[0] < 0 && a < r);

            do {
                b--;

                // copy block[permutation[b]] to bi
                if(block != null)
                    inputs[biidx] = block[permutation[b]];
                else for(oj = 0, ij = permutation[b] * istride * blockColumns, j = 0; j < blockColumns; j++, oj += bistride, ij += istride) {
                    for(i = 0; i < blockRows; i++)
                        bi[oj + i] = input[ij + i];
                }

                // is block[permutation[b]] > block[pivot] ?
                this.subroutine('cmp', header, inputs);
            } while(cmp[0] > 0 && b > l);

            // swap elements
            if(a < b) {
                t = permutation[a];
                permutation[a] = permutation[b];
                permutation[b] = t;
            }
            else break;
        }

        // recursion
        p = b;
        if(l < p) {
            stack[++top] = l;
            stack[++top] = p;
        }
        if(r > p + 1) {
            stack[++top] = p + 1;
            stack[++top] = r;
        }
    }

    // apply permutation
    for(b = 0; b < n; b++) { // for each block...
        c = permutation[b] * blockColumns; // for each column...
        for(oj = b * blockColumns * stride, ij = c * istride, j = 0; j < blockColumns; j++, oj += stride, ij += istride) {
            for(i = 0; i < blockRows; i++)
                output[oj + i] = input[ij + i];
        }
    }

    // restore pointers
    inputs[biidx] = bi;
    inputs[bjidx] = bj;
}

/***/ }),

/***/ "./src/core/math/linalg/homography.js":
/*!********************************************!*\
  !*** ./src/core/math/linalg/homography.js ***!
  \********************************************/
/*! exports provided: homography4p, homographynorm4p, homographydlt, homographynormdlt, dltnorm2d */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "homography4p", function() { return homography4p; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "homographynorm4p", function() { return homographynorm4p; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "homographydlt", function() { return homographydlt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "homographynormdlt", function() { return homographynormdlt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dltnorm2d", function() { return dltnorm2d; });
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * homography.js
 * Find homography matrix
 */

/*

Suppose that we want to use 4 correspondences (uk, vk) <-> (xk, yk) to
find a homography matrix H that maps (u,v) to (x,y):

    [ a  b  c ]
H = [ d  e  f ]
    [ g  h  i ]

One way to do it is to solve the equation below (we set i = 1):

[ u0  v0  1   0   0   0  -u0*x0  -v0*x0 ] [ a ]   [ x0 ]
[ u1  v1  1   0   0   0  -u1*x1  -v1*x1 ] [ b ]   [ x1 ]
[ u2  v2  1   0   0   0  -u2*x2  -v2*x2 ] [ c ]   [ x2 ]
[ u3  v3  1   0   0   0  -u3*x3  -v3*x3 ] [ d ] = [ x3 ]
[ 0   0   0   u0  v0  1  -u0*y0  -v0*y0 ] [ e ]   [ y0 ]
[ 0   0   0   u1  v1  1  -u1*y1  -v1*y1 ] [ f ]   [ y1 ]
[ 0   0   0   u2  v2  1  -u2*y2  -v2*y2 ] [ g ]   [ y2 ]
[ 0   0   0   u3  v3  1  -u3*y3  -v3*y3 ] [ h ]   [ y3 ]

It turns out that this equation gets a bit simpler if we transform
points to/from the unit square centered at 0.5, i.e., [0,1] x [0,1].

In fact, I can solve this equation using pen and paper and type in a
closed formula, which I did!

No Gaussian elimination, no SVD, no loops, nothing! This should run
very fast.

Note: it's also possible to solve this equation directly (without the
unit square). However, the algebra is quite messy and I'm not sure it
will be any better, numerically speaking, than the approach I'm taking.

*/

/**
 * Find a homography using 4 correspondences of points. We'll map
 * (u,v) to (x,y). The input matrices are expected to have the form:
 * 
 * [ u0  u1  u2  u3 ] [ x0  x1  x2  x3 ]
 * [ v0  v1  v2  v3 ] [ y0  y1  y2  y3 ]
 * 
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function homography4p(header, output, inputs)
{
    const stride = header.stride;
    const sstride = header.strideOfInputs[0];
    const dstride = header.strideOfInputs[1];
    const src = inputs[0], dest = inputs[1];
    const eps = 1e-6; // avoid division by small numbers

    let m00, m01, m10, m11, z0, z1, det, idet;
    let a1, b1, c1, d1, e1, f1, g1, h1, i1;
    let a2, b2, c2, d2, e2, f2, g2, h2, i2;
    let a, b, c, d, e, f, g, h, i;

    //
    // Initialization
    //

    // Read (ui, vi) - source
    const u0 = src[0],
          v0 = src[1],
          u1 = src[0 + sstride],
          v1 = src[1 + sstride],
          u2 = src[0 + 2 * sstride],
          v2 = src[1 + 2 * sstride],
          u3 = src[0 + 3 * sstride],
          v3 = src[1 + 3 * sstride];

    // Read (xi, yi) - destination
    const x0 = dest[0],
          y0 = dest[1],
          x1 = dest[0 + dstride],
          y1 = dest[1 + dstride],
          x2 = dest[0 + 2 * dstride],
          y2 = dest[1 + 2 * dstride],
          x3 = dest[0 + 3 * dstride],
          y3 = dest[1 + 3 * dstride];

    // This is supposed to be executed many times.
    // Should we normalize the input/output points
    // at this stage? Let the user decide! See
    // function homographynorm4p() below.

    // Initialize homography H
    a = b = c = d = e = f = g = h = i = Number.NaN;

    do {

    //
    // From source to unit square
    //

    // Compute a few "cross products" (signed areas)
    const alpha = (u3 - u0) * (v1 - v0) - (v3 - v0) * (u1 - u0);
    const beta = (u3 - u0) * (v2 - v0) - (v3 - v0) * (u2 - u0);
    const phi = (u1 - u0) * (v2 - v0) - (v1 - v0) * (u2 - u0);
    const chi = (u3 - u1) * (v2 - v1) - (v3 - v1) * (u2 - u1);
    const theta = -alpha;

    // We require a quadrilateral, not a triangle,
    // nor a line, nor a single point! Are 3 or 4
    // points colinear?
    if(
        Math.abs(alpha) < eps || Math.abs(beta) < eps ||
        Math.abs(phi) < eps || Math.abs(chi) < eps
    )
        break; // goto end;

    // Find M and Z
    m00 = u2 * alpha - u1 * beta;
    m01 = v2 * alpha - v1 * beta;
    m10 = u3 * phi - u2 * theta;
    m11 = v3 * phi - v2 * theta;
    z0 = beta - alpha;
    z1 = theta - phi;

    // Solve M p = z for p = [ g  h ]^t
    det = m00 * m11 - m01 * m10;
    if(Math.abs(det) < eps) break; // shouldn't happen
    idet = 1.0 / det;
    g1 = (m11 * z0 - m01 * z1) * idet;
    h1 = (m00 * z1 - m10 * z0) * idet;

    // Find the remaining entries of the homography
    if(Math.abs(alpha) > Math.abs(beta)) {
        a1 = (1.0 + g1 * u1 + h1 * v1) * (v3 - v0) / (-alpha);
        b1 = (1.0 + g1 * u1 + h1 * v1) * (u3 - u0) / alpha;
    }
    else {
        a1 = (1.0 + g1 * u2 + h1 * v2) * (v3 - v0) / (-beta);
        b1 = (1.0 + g1 * u2 + h1 * v2) * (u3 - u0) / beta;
    }

    if(Math.abs(phi) > Math.abs(theta)) {
        d1 = (1.0 + g1 * u2 + h1 * v2) * (v1 - v0) / (-phi);
        e1 = (1.0 + g1 * u2 + h1 * v2) * (u1 - u0) / phi;
    }
    else {
        d1 = (1.0 + g1 * u3 + h1 * v3) * (v1 - v0) / (-theta);
        e1 = (1.0 + g1 * u3 + h1 * v3) * (u1 - u0) / theta;
    }

    c1 = -a1 * u0 - b1 * v0;
    f1 = -d1 * u0 - e1 * v0;
    i1 = 1.0;

    // Bad homography?
    det = a1*e1*i1 + b1*f1*g1 + c1*d1*h1 - b1*d1*i1 - a1*f1*h1 - c1*e1*g1;
    if(Math.abs(det) < eps) break; // goto end;

    //
    // From unit square to destination
    //

    // Find M and z
    m00 = x1 - x2;
    m01 = x3 - x2;
    m10 = y1 - y2;
    m11 = y3 - y2;
    z0 = (x0 - x1) + (x2 - x3);
    z1 = (y0 - y1) + (y2 - y3);

    // Solve M p = z for p = [ g  h ]^t
    det = m00 * m11 - m01 * m10;
    if(Math.abs(det) < eps) break; // goto end;
    idet = 1.0 / det;
    g2 = (m11 * z0 - m01 * z1) * idet;
    h2 = (m00 * z1 - m10 * z0) * idet;

    // Find the remaining entries of the homography
    a2 = g2 * x1 + (x1 - x0);
    b2 = h2 * x3 + (x3 - x0);
    c2 = x0;
    d2 = g2 * y1 + (y1 - y0);
    e2 = h2 * y3 + (y3 - y0);
    f2 = y0;
    i2 = 1.0;

    // Bad homography?
    det = a2*e2*i2 + b2*f2*g2 + c2*d2*h2 - b2*d2*i2 - a2*f2*h2 - c2*e2*g2;
    if(Math.abs(det) < eps) break; // goto end;

    //
    // From source to destination
    //

    // Find homography
    a = a2 * a1 + b2 * d1 + c2 * g1;
    b = a2 * b1 + b2 * e1 + c2 * h1;
    c = a2 * c1 + b2 * f1 + c2 * i1;
    d = d2 * a1 + e2 * d1 + f2 * g1;
    e = d2 * b1 + e2 * e1 + f2 * h1;
    f = d2 * c1 + e2 * f1 + f2 * i1;
    g = g2 * a1 + h2 * d1 + i2 * g1;
    h = g2 * b1 + h2 * e1 + i2 * h1;
    i = g2 * c1 + h2 * f1 + i2 * i1;

    } while(0);

    // end:

    // Write the matrix to the output
    output[0] = a;
    output[1] = d;
    output[2] = g;
    output[0 + stride] = b;
    output[1 + stride] = e;
    output[2 + stride] = h;
    output[0 + 2 * stride] = c;
    output[1 + 2 * stride] = f;
    output[2 + 2 * stride] = i;
}

/**
 * Find a homography using 4 correspondences of points, given as
 * two 2 x 4 matrices. The points will be normalized FAST!
 * @param {object} header
 * @param {ArrayBufferView} output 3x3
 * @param {ArrayBufferView[]} inputs [src, dst] 2x4
 */
function homographynorm4p(header, output, inputs)
{
    const stride = header.stride;
    const sstride = header.strideOfInputs[0];
    const dstride = header.strideOfInputs[1];
    const stride2 = stride * 2;
    const sstride2 = sstride * 2, sstride3 = sstride * 3;
    const dstride2 = dstride * 2, dstride3 = dstride * 3;
    const src = inputs[0], dst = inputs[1];

    // store the points
    const u0 = src[0],
          v0 = src[1],
          u1 = src[0 + sstride],
          v1 = src[1 + sstride],
          u2 = src[0 + sstride2],
          v2 = src[1 + sstride2],
          u3 = src[0 + sstride3],
          v3 = src[1 + sstride3],
          x0 = dst[0],
          y0 = dst[1],
          x1 = dst[0 + dstride],
          y1 = dst[1 + dstride],
          x2 = dst[0 + dstride2],
          y2 = dst[1 + dstride2],
          x3 = dst[0 + dstride3],
          y3 = dst[1 + dstride3];

    // find the centers of mass (scx, scy) and (dcx, dcy)
    const scx = (u0 + u1 + u2 + u3) * 0.25,
          scy = (v0 + v1 + v2 + v3) * 0.25,
          dcx = (x0 + x1 + x2 + x3) * 0.25,
          dcy = (y0 + y1 + y2 + y3) * 0.25;

    // find suitable scale factors (via RMS distance)
    const sdist = (u0 - scx) * (u0 - scx) + (v0 - scy) * (v0 - scy) +
                  (u1 - scx) * (u1 - scx) + (v1 - scy) * (v1 - scy) +
                  (u2 - scx) * (u2 - scx) + (v2 - scy) * (v2 - scy) +
                  (u3 - scx) * (u3 - scx) + (v3 - scy) * (v3 - scy);
    const ddist = (x0 - dcx) * (x0 - dcx) + (y0 - dcy) * (y0 - dcy) +
                  (x1 - dcx) * (x1 - dcx) + (y1 - dcy) * (y1 - dcy) +
                  (x2 - dcx) * (x2 - dcx) + (y2 - dcy) * (y2 - dcy) +
                  (x3 - dcx) * (x3 - dcx) + (y3 - dcy) * (y3 - dcy);
    const sscale = Math.sqrt(8.0 / sdist),
          dscale = Math.sqrt(8.0 / ddist);

    // normalize the points
    src[0] = sscale * (u0 - scx);
    src[1] = sscale * (v0 - scy);
    src[0 + sstride] = sscale * (u1 - scx);
    src[1 + sstride] = sscale * (v1 - scy);
    src[0 + sstride2] = sscale * (u2 - scx);
    src[1 + sstride2] = sscale * (v2 - scy);
    src[0 + sstride3] = sscale * (u3 - scx);
    src[1 + sstride3] = sscale * (v3 - scy);
    dst[0] = dscale * (x0 - dcx);
    dst[1] = dscale * (y0 - dcy);
    dst[0 + dstride] = dscale * (x1 - dcx);
    dst[1 + dstride] = dscale * (y1 - dcy);
    dst[0 + dstride2] = dscale * (x2 - dcx);
    dst[1 + dstride2] = dscale * (y2 - dcy);
    dst[0 + dstride3] = dscale * (x3 - dcx);
    dst[1 + dstride3] = dscale * (y3 - dcy);

    // find a homography using the normalized points
    this.homography4p(header, output, inputs);

    // denormalize the points
    src[0] = u0;
    src[1] = v0;
    src[0 + sstride] = u1;
    src[1 + sstride] = v1;
    src[0 + sstride2] = u2;
    src[1 + sstride2] = v2;
    src[0 + sstride3] = u3;
    src[1 + sstride3] = v3;
    dst[0] = x0;
    dst[1] = y0;
    dst[0 + dstride] = x1;
    dst[1 + dstride] = y1;
    dst[0 + dstride2] = x2;
    dst[1 + dstride2] = y2;
    dst[0 + dstride3] = x3;
    dst[1 + dstride3] = y3;

    // embed normalization and denormalization in the homography, i.e.,
    // normalize (src space) -> apply homography -> denormalize (dst space)
    const h00 = output[0], h01 = output[0 + stride], h02 = output[0 + stride2],
          h10 = output[1], h11 = output[1 + stride], h12 = output[1 + stride2],
          h20 = output[2], h21 = output[2 + stride], h22 = output[2 + stride2];
    const s = sscale, z = 1.0 / dscale;
    const tmp = h22 - s * (scx * h20 + scy * h21);

    output[0] = s * (z * h00 + dcx * h20);
    output[1] = s * (z * h10 + dcy * h20);
    output[2] = s * h20;
    output[0 + stride] = s * (z * h01 + dcx * h21);
    output[1 + stride] = s * (z * h11 + dcy * h21);
    output[2 + stride] = s * h21;
    output[0 + stride2] = dcx * tmp + z * (h02 - s * (scx * h00 + scy * h01));
    output[1 + stride2] = dcy * tmp + z * (h12 - s * (scx * h10 + scy * h11));
    output[2 + stride2] = tmp;
}

/**
 * Find a homography using n >= 4 correspondences of points (u,v) to (x,y)
 * using Direct Linear Transform (DLT). It's recommended to normalize the
 * input before calling this function (see homographynormdlt() below).
 * The input matrices are expected to be 2 x n.
 * @param {object} header
 * @param {ArrayBufferView} output 3x3 homography matrix
 * @param {ArrayBufferView[]} inputs [ src, dest ]
 */
function homographydlt(header, output, inputs)
{
    const dtype = header.dtype;
    const n = header.columnsOfInputs[0]; // number of correspondences
    const src = inputs[0], dest = inputs[1];
    const stride = header.stride;
    const sstride = header.strideOfInputs[0];
    const dstride = header.strideOfInputs[1];
    const astride = 2 * n;
    const matA = this.createTypedArray(dtype, 16 * n).fill(0.0); // 2n x 8 matrix
    const vecB = this.createTypedArray(dtype, 2 * n); // 2n x 1 matrix
    const vecH = this.createTypedArray(dtype, 8); // 8x1 matrix
    const eps = 1e-6;
    let u, v, x, y, k, j, ij, iij;
    let a, b, c, d, e, f, g, h, i, det;

    /*
    // create system of linear equations
    [ uj  vj  1   0   0   0  -uj*xj  -vj*xj ] h  =  [ xj ]
    [ 0   0   0   uj  vj  1  -uj*yj  -vj*yj ]       [ yj ]
    */
    for(ij = 0, iij = 0, j = 0, k = 0; k < n; k++, j += 2, ij += sstride, iij += dstride) {
        u = src[ij + 0];
        v = src[ij + 1];
        x = dest[iij + 0];
        y = dest[iij + 1];

        matA[0 + j] = u;
        //matA[1 + j] = 0;
        matA[astride + 0 + j] = v;
        //matA[astride + 1 + j] = 0.0;
        matA[2 * astride + 0 + j] = 1.0;
        //matA[2 * astride + 1 + j] = 0.0;
        //matA[3 * astride + 0 + j] = 0.0;
        matA[3 * astride + 1 + j] = u;
        //matA[4 * astride + 0 + j] = 0.0;
        matA[4 * astride + 1 + j] = v;
        //matA[5 * astride + 0 + j] = 0.0;
        matA[5 * astride + 1 + j] = 1.0;
        matA[6 * astride + 0 + j] = -u*x;
        matA[6 * astride + 1 + j] = -u*y;
        matA[7 * astride + 0 + j] = -v*x;
        matA[7 * astride + 1 + j] = -v*y;

        vecB[0 + j] = x;
        vecB[1 + j] = y;
    }

    // solve Ah = b for h
    this.run(this.lssolve, dtype, [
        // output
        8, 1, 8,

        // inputs
        2*n, 8, 2*n,
        2*n, 1, 2*n,
    ], [ vecH, matA, vecB ]);

    // read homography
    a = vecH[0]; b = vecH[1]; c = vecH[2];
    d = vecH[3]; e = vecH[4]; f = vecH[5];
    g = vecH[6]; h = vecH[7]; i = 1.0;

    // bad homography?
    det = a*e*i + b*f*g + c*d*h - b*d*i - a*f*h - c*e*g;
    if(Number.isNaN(det) || Math.abs(det) < eps)
        a = b = c = d = e = f = g = h = i = Number.NaN;

    // write homography to the output
    const stride2 = stride + stride;
    output[0] = a;
    output[1] = d;
    output[2] = g;
    output[stride + 0] = b;
    output[stride + 1] = e;
    output[stride + 2] = h;
    output[stride2 + 0] = c;
    output[stride2 + 1] = f;
    output[stride2 + 2] = i;
}

/**
 * Find a homography using n >= 4 correspondences of points (u,v) to (x,y)
 * using the normalized Direct Linear Transform (nDLT). The input matrices
 * are expected to be 2 x n.
 * @param {object} header
 * @param {ArrayBufferView} output 3x3 homography matrix
 * @param {ArrayBufferView[]} inputs [ src, dest ]
 */
function homographynormdlt(header, output, inputs)
{
    const { dtype, stride } = header;
    const n = header.columnsOfInputs[0];
    const sstride = header.strideOfInputs[0];
    const dstride = header.strideOfInputs[1];
    const src = inputs[0], dst = inputs[1];
    const ptsbuf = this.createTypedArray(dtype, 4 * n); // two 2 x n matrices
    const matbuf = this.createTypedArray(dtype, 9 * 4); // four 3 x 3 matrices
    const srcnormpts = ptsbuf.subarray(0, 2 * n);
    const dstnormpts = ptsbuf.subarray(2 * n, 4 * n);
    const srcnormmat = matbuf.subarray(0, 9);
    const srcdenormmat = matbuf.subarray(9, 18); // unused results
    const dstnormmat = matbuf.subarray(18, 27); // unused results
    const dstdenormmat = matbuf.subarray(27, 36);
    const hommat = dstnormmat;
    const tmpmat = srcdenormmat;

    // Normalize source points
    this.run(this.dltnorm2d, dtype, [
        // output
        2, n, 2,

        // inputs
        2, n, sstride,
        3, 3, 3,
        3, 3, 3,
    ], [ srcnormpts, src, srcnormmat, srcdenormmat ]);

    // Normalize destination points
    this.run(this.dltnorm2d, dtype, [
        // output
        2, n, 2,

        // inputs
        2, n, dstride,
        3, 3, 3,
        3, 3, 3,
    ], [ dstnormpts, dst, dstnormmat, dstdenormmat ]);

    // DLT using the normalized points
    this.run(this.homographydlt, dtype, [
        // output
        3, 3, 3,

        // inputs
        2, n, 2,
        2, n, 2,
    ], [ hommat, srcnormpts, dstnormpts ]);

    // Compute normalized DLT using matrix multiplications
    this.run(this.multiply3, dtype, [
        // output
        3, 3, 3,

        // inputs
        3, 3, 3,
        3, 3, 3,
    ], [ tmpmat, hommat, srcnormmat ]);

    this.run(this.multiply3, dtype, [
        // output
        3, 3, stride,

        // inputs
        3, 3, 3,
        3, 3, 3,
    ], [ output, dstdenormmat, tmpmat ]);

    /*
    // Normalize the entries of the resulting matrix
    let i = 0;
    let norm2 = 0.0, inorm = 0.0;
    const stride2 = stride + stride;

    for(i = 0; i < 3; i++) {
        norm2 += output[i] * output[i];
        norm2 += output[i + stride] * output[i + stride];
        norm2 += output[i + stride2] * output[i + stride2];
    }

    inorm = 1.0 / Math.sqrt(norm2);
    for(i = 0; i < 3; i++) {
        output[i] *= inorm;
        output[i + stride] *= inorm;
        output[i + stride2] *= inorm;
    }
    */
}

/**
 * Given a set of n points (xi, yi) encoded in a 2 x n matrix,
 * find normalization and denormalization matrices (3x3) so that
 * the average distance of the normalized points to the origin
 * becomes a small constant. Returns the transformed points as
 * the output.
 * @param {object} header
 * @param {ArrayBufferView} output normalized points (2xn)
 * @param {ArrayBufferView[]} inputs [ input points (2xn), out norm matrix (3x3), out denorm matrix (3x3) ]
 */
function dltnorm2d(header, output, inputs)
{
    const stride = header.stride;
    const pstride = header.strideOfInputs[0];
    const nstride = header.strideOfInputs[1];
    const dstride = header.strideOfInputs[2];
    const n = header.columnsOfInputs[0];
    const pts = inputs[0], normmat = inputs[1], denormmat = inputs[2];
    let cx = 0.0, cy = 0.0, dx = 0.0, dy = 0.0, d = 0.0, s = 0.0, z = 0.0;
    let i = 0, ip = 0, io = 0;

    // find the center of mass (cx, cy) = c
    for(ip = i = 0; i < n; i++, ip += pstride) {
        cx += pts[ip];
        cy += pts[ip + 1];
    }
    cx /= n;
    cy /= n;

    // find the RMS distance to the center of mass
    for(ip = i = 0; i < n; i++, ip += pstride) {
        dx = pts[ip] - cx;
        dy = pts[ip + 1] - cy;
        d += dx * dx + dy * dy;
    }
    d = Math.sqrt(d / n);

    // find the scale factor s
    const SQRT2 = 1.4142135623730951;
    s = SQRT2 / d;
    z = d / SQRT2; // = 1/s

    // write the normalization matrix
    // given a point p, set p_normalized := s(p - c)
    const nstride2 = nstride + nstride;
    normmat[0] = s; normmat[0 + nstride] = 0; normmat[0 + nstride2] = -s * cx;
    normmat[1] = 0; normmat[1 + nstride] = s; normmat[1 + nstride2] = -s * cy;
    normmat[2] = 0; normmat[2 + nstride] = 0; normmat[2 + nstride2] = 1;

    // write the denormalization matrix
    // given a normalized point q, set q_denormalized := q/s + c
    const dstride2 = dstride + dstride;
    denormmat[0] = z; denormmat[0 + dstride] = 0; denormmat[0 + dstride2] = cx;
    denormmat[1] = 0; denormmat[1 + dstride] = z; denormmat[1 + dstride2] = cy;
    denormmat[2] = 0; denormmat[2 + dstride] = 0; denormmat[2 + dstride2] = 1;

    // normalize the points
    for(io = 0, ip = 0, i = 0; i < n; i++, ip += pstride, io += stride) {
        output[io] = s * (pts[ip] - cx);
        output[io + 1] = s * (pts[ip + 1] - cy);
    }
}

/***/ }),

/***/ "./src/core/math/linalg/inverse.js":
/*!*****************************************!*\
  !*** ./src/core/math/linalg/inverse.js ***!
  \*****************************************/
/*! exports provided: inverse1, inverse2, inverse3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse1", function() { return inverse1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse2", function() { return inverse2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse3", function() { return inverse3; });
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * inverse.js
 * Inverse of a matrix
 */

/**
 * Inverse of a 1x1 matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function inverse1(header, output, inputs)
{
    output[0] = 1.0 / inputs[0][0];
}

/**
 * Inverse of a 2x2 matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function inverse2(header, output, inputs)
{
    const stride = header.stride;
    const istride = header.strideOfInputs[0];
    const input = inputs[0];

    // read entries of the matrix
    const a11 = input[0];
    const a21 = input[1];
    const a12 = input[0 + istride];
    const a22 = input[1 + istride];

    // compute the determinant
    const det = a11 * a22 - a12 * a21;
    const d = 1.0 / det;

    // set up the inverse
    output[0] = a22 * d;
    output[1] = -a21 * d;
    output[0 + stride] = -a12 * d;
    output[1 + stride] = a11 * d;
}

/**
 * Inverse of a 3x3 matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function inverse3(header, output, inputs)
{
    const stride = header.stride;
    const istride = header.strideOfInputs[0];
    const input = inputs[0];

    // read entries of the matrix
    const a11 = input[0];
    const a21 = input[1];
    const a31 = input[2];
    const a12 = input[0 + istride];
    const a22 = input[1 + istride];
    const a32 = input[2 + istride];
    const a13 = input[0 + istride + istride];
    const a23 = input[1 + istride + istride];
    const a33 = input[2 + istride + istride];

    // compute auxiliary values
    const b1 = a33 * a22 - a32 * a23;
    const b2 = a33 * a12 - a32 * a13;
    const b3 = a23 * a12 - a22 * a13;

    // compute the determinant
    const det = a11 * b1 - a21 * b2 + a31 * b3;
    const d = 1.0 / det;

    // set up the inverse
    const stride2 = stride + stride;
    output[0] = b1 * d;
    output[1] = -(a33 * a21 - a31 * a23) * d;
    output[2] = (a32 * a21 - a31 * a22) * d;
    output[0 + stride] = -b2 * d;
    output[1 + stride] = (a33 * a11 - a31 * a13) * d;
    output[2 + stride] = -(a32 * a11 - a31 * a12) * d;
    output[0 + stride2] = b3 * d;
    output[1 + stride2] = -(a23 * a11 - a21 * a13) * d;
    output[2 + stride2] = (a22 * a11 - a21 * a12) * d;
}

/***/ }),

/***/ "./src/core/math/linalg/linalg.js":
/*!****************************************!*\
  !*** ./src/core/math/linalg/linalg.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * linalg.js
 * Plug & Play Linear algebra methods
 */

const { MatrixType } = __webpack_require__(/*! ../matrix-type */ "./src/core/math/matrix-type.js");
const LinAlgLib = {
    ...__webpack_require__(/*! ./basic */ "./src/core/math/linalg/basic.js"),
    ...__webpack_require__(/*! ./inverse */ "./src/core/math/linalg/inverse.js"),
    ...__webpack_require__(/*! ./solve */ "./src/core/math/linalg/solve.js"),
    ...__webpack_require__(/*! ./qr */ "./src/core/math/linalg/qr.js"),
    ...__webpack_require__(/*! ./sequence */ "./src/core/math/linalg/sequence.js"),
    ...__webpack_require__(/*! ./functional */ "./src/core/math/linalg/functional.js"),
    ...__webpack_require__(/*! ./homography */ "./src/core/math/linalg/homography.js"),
    ...__webpack_require__(/*! ./transform */ "./src/core/math/linalg/transform.js"),
    ...__webpack_require__(/*! ./ransac */ "./src/core/math/linalg/ransac.js"),
    ...__webpack_require__(/*! ./utils */ "./src/core/math/linalg/utils.js"),
};

/**
 * Plug & Play Linear Algebra methods
 * The actual Linear Algebra methods will be plugged in!
 * This is a class of static methods that can be "exported" to a WebWorker.
 * Currently, LinAlgLib methods cannot import things external to LinAlg.
 * @class
 */
const LinAlg = (function() {
'use strict';
function LinAlg() { }

/** @type {object} linear algebra library */
LinAlg.lib = Object.create(null);

/** @type {object} source code of methods */
const _src = Object.create(null);

/**
 * Register a method
 * @param {string} name method name
 * @param {Function} fn function code
 */
LinAlg.register = function(name, fn)
{
    // validate
    if(typeof fn !== `function`)
        throw new Error(`Not a function: ${name}`);
    else if(typeof name !== `string` || !name.match(/^[a-z_][0-9a-z_]*$/i))
        throw new Error(`Undesirable identifier: ${name}`);
    else if(LinAlg.hasMethod(name))
        throw new Error(`Can't redefine method ${name}`);

    // register method
    const readonly = { enumerable: true, writable: false, configurable: false };
    Object.defineProperty(LinAlg.lib, name, {
        value: fn.bind(LinAlg.lib), // methods will be bound to LinAlg.lib
        ...readonly
    });
    Object.defineProperty(_src, name, {
        value: fn.toString(),
        ...readonly
    });
};

/**
 * Check if a method has been registered
 * @param {string} name method name
 * @returns {boolean}
 */
LinAlg.hasMethod = function(name)
{
    return Object.prototype.hasOwnProperty.call(LinAlg.lib, name);
}

/**
 * Convert this Plug & Play class to a string
 * @returns {string}
 */
LinAlg.toString = function()
{
    const methods = Object.keys(_src)
            .map(x => `LinAlg.lib.${x} = (${_src[x]}).bind(LinAlg.lib);`)
            .join('\n');

    return `` + // IIFE
`(function() {
'use strict';
function LinAlg() { }
LinAlg.lib = Object.create(null);
LinAlg.lib.MatrixType = (${MatrixType.toString()}).freeze();

${methods}

Object.freeze(LinAlg.lib);
return Object.freeze(LinAlg);
})()`;
};

// Import MatrixType into the lib
Object.defineProperty(LinAlg.lib, 'MatrixType', {
    value: MatrixType.freeze(),
    writable: false,
    configurable: false,
    enumerable: false,
});

// Plug in the Linear Algebra methods
Object.keys(LinAlgLib).forEach(method => {
    LinAlg.register(method, LinAlgLib[method]);
});

// done!
return Object.freeze(LinAlg);
})();

module.exports = { LinAlg };

/***/ }),

/***/ "./src/core/math/linalg/qr.js":
/*!************************************!*\
  !*** ./src/core/math/linalg/qr.js ***!
  \************************************/
/*! exports provided: qr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "qr", function() { return qr; });
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
 * qr.js
 * QR decomposition
 */

/**
 * QR decomposition
 * @param {object} header
 * @param {ArrayBufferView} output becomes [ Q | R ] or [ Q'x | R ] or [ Qx | R ]
 * @param {ArrayBufferView[]} inputs
 */
function qr(header, output, inputs)
{
    const { stride, dtype } = header;
    const [ orows, ocolumns ] = [ header.rows, header.columns ];
    const [ irows, xrows ] = header.rowsOfInputs;
    const [ icolumns, xcolumns ] = header.columnsOfInputs;
    const [ istride ] = header.strideOfInputs;
    const [ input, x ] = inputs;
    const { mode } = header.custom;
    const wantMatrices = (mode == 'full-qr' || mode == 'reduced-qr');

    // create temporary storage
    const storage = this.createTypedArray(dtype, 2 * irows * icolumns + icolumns);
    const reflect = storage.subarray(0, irows * icolumns);
    const tmprow = storage.subarray(irows * icolumns, irows * icolumns + icolumns);
    const tmp = storage.subarray(irows * icolumns + icolumns, 2 * irows * icolumns + icolumns);

    // create soon-to-be upper triangular matrix R
    const rstride = stride;
    const triangular = !wantMatrices ? output.subarray(stride) :
        output.subarray(((mode == 'reduced-qr') ? icolumns : irows) * stride);

    // input matrix is m x n and should be such that m >= n
    if(irows < icolumns)
        throw new Error(`Can't compute the QR decomposition of a ${irows} x ${icolumns} matrix`);

    // validate the number of rows of the output
    if(orows != irows)
        throw new Error(`Can't compute the QR decomposition of a ${irows} x ${icolumns} matrix: expected an output matrix of ${irows} rows, but found a matrix of ${orows} rows`);

    // copy input[:,:] to triangular[:,:]
    if(input.length != triangular.length) {
        this.runWithBlocks(this.copy, dtype, [
            // output: 1st row, last row, 1st col, last col, stride
            0, irows-1, 0, icolumns-1, rstride,

            // inputs
            0, irows-1, 0, icolumns-1, istride,
        ], [ triangular, input ]);
    }
    else
        triangular.set(input, 0, input.length);

    // Compute the reflection vectors and the upper triangular matrix R
    let i, j, k, n, norm, sign, fkk, rkk;
    for(k = 0; k < icolumns; k++) {
        fkk = k * irows + k; // reflector index
        rkk = k * rstride + k; // upper-triangular R

        n = irows - k; // the k-th reflection vector has n components
        sign = (+(triangular[rkk] >= 0)) - (+(triangular[rkk] < 0)); // sign(triangular[k,k]) is +1 or -1

        // use reflect[k:irows-1,k] to temporarily store the k-th reflection vector
        for(i = 0; i < n; i++) // copy triangular[k:irows-1,k] to reflect[k:irows-1,k]
            reflect[fkk + i] = triangular[rkk + i];
        reflect[fkk] += sign * this.norm2(reflect, fkk, n); // 1st coordinate

        // normalize the k-th reflection vector
        norm = this.norm2(reflect, fkk, n);
        // if(norm > 0) // error
        for(i = fkk + n - 1; i >= fkk; i--)
            reflect[i] /= norm;

        // compute tmprow[0,0:icolumns-k-1] = reflect[k:irows-1,k]^T * triangular[k:irows-1,k:icolumns-1]
        this.runWithBlocks(this.multiplylt, dtype, [
            // output: 1st row, last row, 1st col, last col, stride
            0, 0, 0, icolumns-k-1, 1, // row vector tmprow[0,0:icolumns-k-1]

            // inputs
            k, irows-1, k, k, irows, // reflect[k:irows-1,k]
            k, irows-1, k, icolumns-1, rstride, // triangular[k:irows-1,k:icolumns-1]
        ], [ tmprow, reflect, triangular ]);

        // compute tmp[0:irows-k-1,0:icolumns-k-1] = reflect[k:irows-1,k] * tmprow[0,0:icolumns-k-1]
        this.runWithBlocks(this.outer, dtype, [
            // output: 1st row, last row, 1st col, last col, stride
            0, irows-k-1, 0, icolumns-k-1, irows, // tmp[0:irows-k-1,0:icolumns-k-1]

            // inputs
            k, irows-1, k, k, irows, // reflect[k:irows-1,k]
            0, 0, 0, icolumns-k-1, 1, // tmprow[0,0:icolumns-k-1], the result of the previous calculation
        ], [ tmp, reflect, tmprow ]);

        // apply Householder reflector to set the column vector triangular[k+1:irows-1,k] to zero
        // i.e., run triangular[k:irows-1,k:icolumns-1] -= 2 * tmp[0:irows-k-1,0:icolumns-k-1]
        this.runWithBlocks(this.addInPlace, dtype, [
            // output: 1st row, last row, 1st col, last col, stride
            k, irows-1, k, icolumns-1, rstride, // triangular[k:irows-1,k:icolumns-1]

            // inputs
            k, irows-1, k, icolumns-1, rstride, // triangular[k:irows-1,k:icolumns-1]
            0, irows-k-1, 0, icolumns-k-1, irows, // tmp[0:irows-k-1,0:icolumns-k-1], the result of the previous calculation
        ], [ triangular, triangular, tmp ], { alpha: 1, beta: -2 });
    }

    // Compute the unitary matrix Q
    switch(mode) {

        //
        // Full QR decomposition
        // Q: m x m, R: m x n
        //
        case 'full-qr': {
            const qstride = stride;
            const unitary = output.subarray(0, qstride * irows).fill(0);
            let fk, qj, dot;

            // validate output size
            if(orows != irows || ocolumns != icolumns + irows)
                throw new Error(`Can't compute the full QR decomposition of a ${irows} x ${icolumns} matrix: expected an output matrix of size ${irows} x ${icolumns + irows}, found ${orows} x ${ocolumns}`);

            // apply Householder reflectors to e_j = e_1, ... , e_m
            for(j = 0; j < irows; j++) { // for each e_j
                qj = j * qstride;
                unitary[qj + j] = 1; // setup e_j = [ 0 0 0 ... 1 ... 0 0 0 ]^T
                for(k = icolumns - 1; k >= 0; k--) { // compute Q e_j = ( Q_1 ... Q_n ) e_j
                    fk = k * irows;
                    dot = -2 * this.dot(unitary, reflect, qj + k, fk + k, irows - k);
                    for(i = irows - 1; i >= k; i--)
                        unitary[qj + i] += dot * reflect[fk + i];
                }
            }

            /*
            // fill the lower part of R with zeros
            let rk;
            for(rk = k = 0; k < icolumns; k++, rk += rstride) {
                for(i = icolumns; i < irows; i++)
                    triangular[rk + i] = 0;
            }
            */

            break;
        }

        //
        // Reduced QR decomposition
        // Q: m x n, R: n x n
        //
        case 'reduced-qr': {
            const qstride = stride;
            const unitary = output.subarray(0, qstride * icolumns).fill(0);
            let fk, qj, dot;

            // validate output size
            if(orows != irows || ocolumns != icolumns + icolumns)
                throw new Error(`Can't compute the reduced QR decomposition of a ${irows} x ${icolumns} matrix: expected an output matrix of size ${irows} x ${icolumns + icolumns}, found ${orows} x ${ocolumns}`);

            // apply Householder reflectors to e_j = e_1, ... , e_n (n <= m)
            for(j = 0; j < icolumns; j++) { // for each e_j
                qj = j * qstride;
                unitary[qj + j] = 1; // setup e_j = [ 0 0 0 ... 1 ... 0 0 0 ]^T
                for(k = icolumns - 1; k >= 0; k--) { // compute Q e_j = ( Q_1 ... Q_n ) e_j
                    fk = k * irows;
                    dot = -2 * this.dot(unitary, reflect, qj + k, fk + k, irows - k);
                    for(i = irows - 1; i >= k; i--)
                        unitary[qj + i] += dot * reflect[fk + i];
                }
            }

            break;
        }

        //
        // Compute y = Q'x for an input vector x (Q' means Q^T)
        // x: m x 1, y: m x 1
        //
        case 'Q\'x': {
            const ystride = stride;
            const y = output.subarray(0, ystride);
            const m = irows, n = icolumns;
            let fk, dot;

            // validate input / output size
            if(m != xrows || 1 != xcolumns)
                throw new Error(`QR decomposition: the input vector is expected to be ${m} x 1, but is ${xrows} x ${xcolumns}`);
            else if(m != orows || 1 + n != ocolumns)
                throw new Error(`QR decomposition: the output matrix is expected to be ${m} x ${1+n}, but is ${orows} x ${ocolumns}`);

            // initialize output vector
            for(i = 0; i < m; i++)
                y[i] = x[i];

            // apply Householder reflectors to input x
            for(k = 0; k < n; k++) { // compute Q'x = ( Q_n ... Q_1 ) x
                fk = k * irows; // get the k-th reflector
                dot = -2 * this.dot(y, reflect, k, fk + k, m - k);
                for(i = k; i < m; i++)
                    y[i] += dot * reflect[fk + i];
            }

            break;
        }

        //
        // Compute Qx for an input vector x
        // x: m x 1, y: m x 1
        //
        case 'Qx': {
            const ystride = stride;
            const y = output.subarray(0, ystride);
            const m = irows, n = icolumns;
            let fk, dot;

            // validate input / output size
            if(m != xrows || 1 != xcolumns)
                throw new Error(`QR decomposition: the input vector is expected to be ${m} x 1, but is ${xrows} x ${xcolumns}`);
            else if(m != orows || 1 + n != ocolumns)
                throw new Error(`QR decomposition: the output matrix is expected to be ${m} x ${1+n}, but is ${orows} x ${ocolumns}`);

            // initialize output vector
            for(i = 0; i < m; i++)
                y[i] = x[i];

            // apply Householder reflectors to input x
            for(k = n - 1; k >= 0; k--) { // compute Qx = ( Q_1 ... Q_n ) x
                fk = k * irows; // get the k-th reflector
                dot = -2 * this.dot(y, reflect, k, fk + k, m - k);
                for(i = k; i < m; i++)
                    y[i] += dot * reflect[fk + i];
            }

            break;
        }

        //
        // Compute y = Q'x for an input vector x using reduced QR
        // x: m x 1, y: m x 1
        //
        case 'reduced-Q\'x': {
            const m = irows, n = icolumns;
            const y = output.subarray(0, n); // output[n..m-1] is unused
            const e = tmp.subarray(0, m); // e_j is m x 1, for all j = 0, 1 .. n-1
            let fk, dot;

            // validate input / output size
            if(m != xrows || 1 != xcolumns)
                throw new Error(`QR decomposition: the input vector is expected to be ${m} x 1, but is ${xrows} x ${xcolumns}`);
            else if(m != orows || 1 + n != ocolumns)
                throw new Error(`QR decomposition: the output matrix is expected to be ${m} x ${1+n}, but is ${orows} x ${ocolumns}`);

            // apply Householder reflectors
            for(j = 0; j < n; j++) { // for each e_j
                // setup e_j = [ 0 0 0 ... 1 ... 0 0 0 ]^T
                e.fill(0);
                e[j] = 1;

                // compute Q e_j = ( Q_1 ... Q_n ) e_j
                for(k = n - 1; k >= 0; k--) {
                    fk = k * irows;
                    dot = -2 * this.dot(e, reflect, k, fk + k, m - k);
                    for(i = m - 1; i >= k; i--)
                        e[i] += dot * reflect[fk + i];
                }

                // compute y_j = dot(x, Q e_j)
                y[j] = this.dot(x, e, 0, 0, m);
            }

            break;
        }

        default:
            throw new Error(`QR decomposition: unknown mode "${mode}"`);
    }
}

/***/ }),

/***/ "./src/core/math/linalg/ransac.js":
/*!****************************************!*\
  !*** ./src/core/math/linalg/ransac.js ***!
  \****************************************/
/*! exports provided: pransacHomography */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pransacHomography", function() { return pransacHomography; });
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * ransac.js
 * Variants of RANSAC
 */

/**
 * P-RANSAC for homography estimation
 * This is a new JavaScript implementation based on Nister's preemptive RANSAC idea
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function pransacHomography(header, output, inputs)
{
    const { dtype, rows, columns, stride } = header;
    const src = inputs[0], dst = inputs[1]; // 2 x n matrices featuring source & destination points
    const mask = inputs[2]; // 1 x n matrix
    const n = header.columnsOfInputs[0]; // number of points
    const sstride = header.strideOfInputs[0];
    const dstride = header.strideOfInputs[1];
    const mstride = header.strideOfInputs[2];
    const { numberOfHypotheses, bundleSize, reprojectionError } = header.custom;
    const reprojErr2 = reprojectionError * reprojectionError;
    const ptsPerHyp = 4 * numberOfHypotheses; // need 4 points per hypothesis
    const len = ptsPerHyp + n - (ptsPerHyp % n); // pick a multiple of n that is >= ptsPerHyp
    const ptidx = Array.from({ length: len }, (_, i) => i % n); // indices of points
    const permutation = this.shuffle(this.range(n));
    const hypbuf = this.createTypedArray(dtype, 9 * numberOfHypotheses);
    function Hypothesis(mat) { this.mat = mat; this.err = 0; }
    const hypothesis = Array.from({ length: numberOfHypotheses },
        (_, i) => new Hypothesis(hypbuf.subarray(9 * i, 9 * (i+1)))
    );
    const smat = this.createTypedArray(dtype, 8), dmat = this.createTypedArray(dtype, 8);
    const hompts = [ smat, dmat ];
    const homheader = this.run(null, dtype, [ 3, 3, 3, 2, 4, 2, 2, 4, 2 ], [ hypothesis[0].mat, smat, dmat ]);
    const cmp = (hi, hj) => hi.err - hj.err;
    const b = bundleSize;
    let m = numberOfHypotheses;
    let h = 0, i = 0, j = 0, ij = 0, iij = 0, oj = 0;
    let p0 = 0, p1 = 0, p2 = 0, p3 = 0;
    let x = 0.0, y = 0.0, z = 0.0, dx = 0.0, dy = 0.0, sx = 0.0, sy = 0.0, hx = 0.0, hy = 0.0;
    let hom = hypothesis[0].mat;
    let badcnt = 0;

    // Shuffle input
    for(i = 0; i < len; i += n)
        this.shuffle(ptidx, i, i+n);

    // Generate m hypotheses
    for(h = 0; h < m; h++) {
        // pick 4 points at random
        j = 4 * h;
        p0 = ptidx[j]
        p1 = ptidx[j + 1];
        p2 = ptidx[j + 2];
        p3 = ptidx[j + 3];

        // set reference
        hom = hypothesis[h].mat;

        // grab source points
        smat[0] = src[sstride * p0 + 0];
        smat[1] = src[sstride * p0 + 1];
        smat[2] = src[sstride * p1 + 0];
        smat[3] = src[sstride * p1 + 1];
        smat[4] = src[sstride * p2 + 0];
        smat[5] = src[sstride * p2 + 1];
        smat[6] = src[sstride * p3 + 0];
        smat[7] = src[sstride * p3 + 1];

        // grab destination points
        dmat[0] = dst[dstride * p0 + 0];
        dmat[1] = dst[dstride * p0 + 1];
        dmat[2] = dst[dstride * p1 + 0];
        dmat[3] = dst[dstride * p1 + 1];
        dmat[4] = dst[dstride * p2 + 0];
        dmat[5] = dst[dstride * p2 + 1];
        dmat[6] = dst[dstride * p3 + 0];
        dmat[7] = dst[dstride * p3 + 1];

        // generate hypothesis
        this.homographynorm4p(homheader, hom, hompts);
        //this.homography4p(homheader, hom, hompts);

        // bad homography?
        if(Number.isNaN(hom[0])) {
            hypothesis[h].err = n; // all points are outliers
            badcnt++;
        }
    }

    // Remove bad homographies
    badcnt = badcnt < m ? badcnt : m - 1;
    hypothesis.sort(cmp);
    hypothesis.length = (m -= badcnt);

    // For each correspondence
    for(i = 0; i < n ; i++) {
        // cut the number of hypotheses in half (every b iterations)
        if(i % b == 0 && m > 1) {
            hypothesis.sort(cmp); // keep the best ones
            m = m >>> 1; // m div 2
            hypothesis.length = m;
        }

        // we've got only 1 hypothesis left
        if(m == 1)
            break;

        // pick a correspondence of points
        //p0 = (Math.random() * n) | 0; // pick a random correspondence with replacement
        p0 = permutation[i]; // pick a random correspondence without replacement
        sx = src[sstride * p0 + 0]; // src_x
        sy = src[sstride * p0 + 1]; // src_y
        hx = dst[dstride * p0 + 0]; // dst_x
        hy = dst[dstride * p0 + 1]; // dst_y

        // evaluate the m best hypotheses so far using the p0-th correspondence
        for(h = 0; h < m; h++) {
            hom = hypothesis[h].mat;
            z = hom[2] * sx + hom[5] * sy + hom[8];
            x = (hom[0] * sx + hom[3] * sy + hom[6]) / z;
            y = (hom[1] * sx + hom[4] * sy + hom[7]) / z;
            dx = x - hx; dy = y - hy;
            hypothesis[h].err += (dx * dx + dy * dy > reprojErr2) | 0;
        }
    }

    // pick the best hypothesis j
    for(j = 0, h = 1; h < m; h++) {
        if(hypothesis[h].err < hypothesis[j].err)
            j = h;
    }
    hom = hypothesis[j].mat;

    // read the entries of the best homography
    const h00 = hom[0], h01 = hom[3], h02 = hom[6],
          h10 = hom[1], h11 = hom[4], h12 = hom[7],
          h20 = hom[2], h21 = hom[5], h22 = hom[8];

    // separate inliers from outliers
    const inliers = [];
    for(ij = 0, iij = 0, oj = 0, j = 0; j < n; j++, ij += sstride, iij += dstride, oj += mstride) {
        sx = src[ij + 0];
        sy = src[ij + 1];

        z = h20 * sx + h21 * sy + h22;
        x = (h00 * sx + h01 * sy + h02) / z;
        y = (h10 * sx + h11 * sy + h12) / z;

        dx = x - dst[iij + 0];
        dy = y - dst[iij + 1];
        if((mask[oj] = (dx * dx + dy * dy <= reprojErr2) | 0))
            inliers.push(j);
    }

    // write the best homography to the output
    const stride2 = stride + stride;
    output[0] = h00;
    output[1] = h10;
    output[2] = h20;
    output[0 + stride] = h01;
    output[1 + stride] = h11;
    output[2 + stride] = h21;
    output[0 + stride2] = h02;
    output[1 + stride2] = h12;
    output[2 + stride2] = h22;

    // refine the homography: use only inliers
    if(inliers.length > 4) {
        const cnt = inliers.length;
        const buf = this.createTypedArray(dtype, 4 * cnt); // two 2 x cnt matrices
        const isrc = buf.subarray(0, 2 * cnt);
        const idst = buf.subarray(2 * cnt, 4 * cnt);

        // copy the inliers to isrc and idst
        for(i = j = 0; j < cnt; j++, i += 2) {
            p0 = inliers[j];
            isrc[i + 0] = src[sstride * p0 + 0];
            isrc[i + 1] = src[sstride * p0 + 1];
            idst[i + 0] = dst[dstride * p0 + 0];
            idst[i + 1] = dst[dstride * p0 + 1];
        }

        // normalized DLT using inliers only
        this.run(this.homographynormdlt, dtype, [
            // output
            rows, columns, stride,

            // inputs
            2, cnt, 2,
            2, cnt, 2,
        ], [ output, isrc, idst ]);

        // Note: should we recompute the inliers mask?
    }

    // bad homography!
    else if(inliers.length < 4) {
        for(i = 0; i < 3; i++)
            output[i] = output[i + stride] = output[i + stride2] = Number.NaN;
    }
}

/***/ }),

/***/ "./src/core/math/linalg/sequence.js":
/*!******************************************!*\
  !*** ./src/core/math/linalg/sequence.js ***!
  \******************************************/
/*! exports provided: sequence */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sequence", function() { return sequence; });
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * sequence.js
 * Sequences of matrix operations
 */

/**
 * A sequence of matrix operations encapsulated into one
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function sequence(header, output, inputs)
{
    this.subroutine('sequence', header, inputs);
}

/***/ }),

/***/ "./src/core/math/linalg/solve.js":
/*!***************************************!*\
  !*** ./src/core/math/linalg/solve.js ***!
  \***************************************/
/*! exports provided: backsub, lssolve */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "backsub", function() { return backsub; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lssolve", function() { return lssolve; });
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
 * solve.js
 * Utilities for solving linear systems of equations
 */

/**
 * Back-substitution: solve Rx = b for x,
 * where R is n x n upper triangular
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs a single input of the form [ b | R ]
 */
function backsub(header, output, inputs)
{
    const { rows, columns } = header;
    const [ input ] = inputs;
    const [ irows ] = header.rowsOfInputs;
    const [ icolumns ] = header.columnsOfInputs;
    const [ istride ] = header.strideOfInputs;

    if(icolumns !== irows + 1)
        throw new Error(`Invalid input for backsub: expected ${irows} x ${irows+1} or ${icolumns-1} x ${icolumns} matrix, but found ${irows} x ${icolumns} matrix`);
    else if(rows !== irows || columns !== 1)
        throw new Error(`Invalid output for backsub: expected ${irows} x 1 matrix, but found ${rows} x ${columns} matrix`);

    // Back-substitution
    const n = irows;
    const x = output; // x is n x 1 vector (output)
    const b = input.subarray(0, istride); // b is n x 1 vector
    const r = input.subarray(istride); // R is n x n upper triangular
    let i, j, rjj, rj = (n-1) * istride; // column index

    x[n-1] = b[n-1] / r[rj + (n-1)];
    for(j = n-2; j >= 0; j--) {
        x[j] = b[j];
        for(i = j+1; i < n; i++)
            x[j] -= x[i] * r[istride * i + j];

        rj -= istride;
        rjj = r[rj + j];
        /*
        if(rjj === 0)
            throw new Error(`Invalid input for backsub: ${j+1}-th diagonal element of the upper triangular matrix is zero`);
        */
        x[j] /= rjj;
    }
}

/**
 * Find best-fit solution of Ax = b with least-squares method
 * A is m x n, b is m x 1, output x is n x 1
 * (m equations, n unknowns, m >= n)
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs [ A, b ]
 */
function lssolve(header, output, inputs)
{
    const { stride, dtype } = header;
    const [ m, n ] = [ header.rowsOfInputs[0], header.columnsOfInputs[0] ];
    const [ matA, vecB ] = inputs;
    const [ strideA, strideB ] = header.strideOfInputs;
    const tmp = this.createTypedArray(dtype, m * (n+1));

    // find [ Q'b | R ] with a reduced QR of A
    this.run(this.qr, dtype, [
        // output: rows, columns, stride
        m, n+1, m,

        // inputs
        m, n, strideA,
        m, 1, strideB,
    ], [ tmp, matA, vecB ], { mode: "reduced-Q'x" });

    // extract the top n x (n+1) submatrix of [ Q'b | R ]
    // (the bottom rows are zeros) to solve R x = Q'b for x
    this.runWithBlocks(this.backsub, dtype, [
        // output: 1st row, last row, 1st col, last col, stride
        0, n-1, 0, 0, stride, // output[0:n-1,0]

        // inputs
        0, n-1, 0, n, m, // tmp[0:n-1,0:n]
    ], [ output, tmp ]);
}

/***/ }),

/***/ "./src/core/math/linalg/transform.js":
/*!*******************************************!*\
  !*** ./src/core/math/linalg/transform.js ***!
  \*******************************************/
/*! exports provided: applyHomography, applyAffine, applyLinear2d */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "applyHomography", function() { return applyHomography; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "applyAffine", function() { return applyAffine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "applyLinear2d", function() { return applyLinear2d; });
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * transform.js
 * Geometric transformations
 */

/**
 * Apply a homography matrix to a set of 2D points
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function applyHomography(header, output, inputs)
{
    const { columns, stride } = header;
    const [ hom, pts ] = inputs;
    const [ hstride, pstride ] = header.strideOfInputs;
    const hstride2 = hstride + hstride;

    // read the entries of the homography
    const h00 = hom[0];
    const h10 = hom[1];
    const h20 = hom[2];
    const h01 = hom[0 + hstride];
    const h11 = hom[1 + hstride];
    const h21 = hom[2 + hstride];
    const h02 = hom[0 + hstride2];
    const h12 = hom[1 + hstride2];
    const h22 = hom[2 + hstride2];

    // for each point (column of pts), apply the homography
    // (we use homogeneous coordinates internally)
    let j, ij, oj, x, y, d;
    for(ij = oj = j = 0; j < columns; j++, ij += pstride, oj += stride) {
        x = pts[ij];
        y = pts[ij + 1];
        d = h20 * x + h21 * y + h22;
        output[oj] = (h00 * x + h01 * y + h02) / d;
        output[oj + 1] = (h10 * x + h11 * y + h12) / d;
    }
}

/**
 * Apply an affine transformation to a set of 2D points
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function applyAffine(header, output, inputs)
{
    const { columns, stride } = header;
    const [ mat, pts ] = inputs;
    const [ mstride, pstride ] = header.strideOfInputs;
    const mstride2 = mstride + mstride;

    // read the entries of the transformation
    const m00 = mat[0];
    const m10 = mat[1];
    const m01 = mat[0 + mstride];
    const m11 = mat[1 + mstride];
    const m02 = mat[0 + mstride2];
    const m12 = mat[1 + mstride2];

    // for each point (column of pts), apply the transformation
    let j, ij, oj, x, y;
    for(ij = oj = j = 0; j < columns; j++, ij += pstride, oj += stride) {
        x = pts[ij];
        y = pts[ij + 1];
        output[oj] = m00 * x + m01 * y + m02;
        output[oj + 1] = m10 * x + m11 * y + m12;
    }
}

/**
 * Apply a 2x2 linear transformation to a set of 2D points
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
function applyLinear2d(header, output, inputs)
{
    const { columns, stride } = header;
    const [ mat, pts ] = inputs;
    const [ mstride, pstride ] = header.strideOfInputs;

    // read the entries of the transformation
    const m00 = mat[0];
    const m10 = mat[1];
    const m01 = mat[0 + mstride];
    const m11 = mat[1 + mstride];

    // for each point (column of pts), apply the transformation
    let j, ij, oj, x, y;
    for(ij = oj = j = 0; j < columns; j++, ij += pstride, oj += stride) {
        x = pts[ij];
        y = pts[ij + 1];
        output[oj] = m00 * x + m01 * y;
        output[oj + 1] = m10 * x + m11 * y;
    }
}

/***/ }),

/***/ "./src/core/math/linalg/utils.js":
/*!***************************************!*\
  !*** ./src/core/math/linalg/utils.js ***!
  \***************************************/
/*! exports provided: execute, run, runWithBlocks, subroutine, createTypedArray, norm2, dot, shuffle, range */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "execute", function() { return execute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "run", function() { return run; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "runWithBlocks", function() { return runWithBlocks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subroutine", function() { return subroutine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createTypedArray", function() { return createTypedArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "norm2", function() { return norm2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dot", function() { return dot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shuffle", function() { return shuffle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "range", function() { return range; });
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
 * utils.js
 * Low-level utilities for Linear Algebra routines
 */

/**
 * Call a Linear Algebra routine
 * @param {MatrixOperationHeader} header
 * @param {ArrayBuffer} outputBuffer
 * @param {ArrayBuffer[]} inputBuffers
 */
function execute(header, outputBuffer, inputBuffers)
{
    // wrap the incoming buffers with the appropriate TypedArrays
    const output = this.createTypedArray(header.dtype, outputBuffer, header.byteOffset, header.length);
    const inputs = inputBuffers.map((inputBuffer, i) =>
        this.createTypedArray(header.dtype, inputBuffer, header.byteOffsetOfInputs[i], header.lengthOfInputs[i])
    );

    // perform the computation
    (this[header.method])(header, output, inputs);
}

/**
 * Fast & handy wrapper to run a Linear Algebra routine from another one
 * @param {?Function} fn the function that you wish to call
 * @param {string} dtypes data types
 * @param {number[]} shapes flattened triples (rows, columns, stride) of output, input1, input2, input3...
 * @param {ArrayBufferView[]} data flattened array containing output array, input1 array, input2 array...
 * @param {object} [custom] user-data
 * @returns {object} the header object that was used to call the routine
 */
function run(fn, dtypes, shapes, data, custom = {})
{
    const n = data.length - 1; // number of input matrices
    if(3 * n + 3 !== shapes.length || n < 0)
        throw new Error(`Can't run() routine with invalid input`);

    const inputs = new Array(n);
    const rowsOfInputs = new Array(n);
    const columnsOfInputs = new Array(n);
    const strideOfInputs = new Array(n);
    //const lengthOfInputs = new Array(n);
    //const byteOffsetOfInputs = new Array(n);

    for(let j = 3, i = 0; i < n; i++, j += 3) {
        inputs[i] = data[i+1];
        rowsOfInputs[i] = shapes[j];
        columnsOfInputs[i] = shapes[j+1];
        strideOfInputs[i] = shapes[j+2];
        //lengthOfInputs[i] = data[i+1].length;
        //byteOffsetOfInputs[i] = data[i+1].byteOffset;
    }

    const header = {
        method: '', dtype: dtypes, custom: custom,

        rows: shapes[0],
        columns: shapes[1],
        stride: shapes[2],

        rowsOfInputs: rowsOfInputs,
        columnsOfInputs: columnsOfInputs,
        strideOfInputs: strideOfInputs,

        /*length: data[0].length,
        lengthOfInputs: lengthOfInputs,
        byteOffset: data[0].byteOffset,
        byteOffsetOfInputs: byteOffsetOfInputs,*/
        length: 0, lengthOfInputs: [],
        byteOffset: 0, byteOffsetOfInputs: [],
    };

    if(fn != null)
        fn.call(this, header, data[0], inputs);

    return header;
}

/**
 * Similar to run(), but this function extracts blocks of the matrices
 * Make sure you get the indices right, because they won't be checked!
 * @param {?Function} fn the function that you wish to call
 * @param {string} dtypes data types
 * @param {number[]} shapesOfBlocks flattened tuples (firstRow, lastRow, firstCol, lastCol, stride) of output, input1...
 * @param {ArrayBufferView[]} originalData flattened array containing output array, input1 array, input2 array...
 * @param {object} [custom] user-data
 * @returns {object} the header object that was used to call the routine
 */
function runWithBlocks(fn, dtypes, shapesOfBlocks, originalData, custom = {})
{
    const n = originalData.length;
    if(shapesOfBlocks.length !== 5 * n)
        throw new Error(`Can't runWithBlocks() with invalid input`);

    const newShapes = new Array(3 * n);
    const newArrays = new Array(n);

    for(let baseAddr = 0, stride = 0, j = 0, i = 0; i < n; i++, j += 3, baseAddr += 5) {
        // compute the shape of the block
        newShapes[j+0] = shapesOfBlocks[baseAddr+1] - shapesOfBlocks[baseAddr+0] + 1; // number of rows
        newShapes[j+1] = shapesOfBlocks[baseAddr+3] - shapesOfBlocks[baseAddr+2] + 1; // number of columns
        newShapes[j+2] = stride = shapesOfBlocks[baseAddr+4]; // stride

        // extract subarray
        newArrays[i] = originalData[i].subarray(
            shapesOfBlocks[baseAddr+2] * stride + shapesOfBlocks[baseAddr+0], // 1st col * stride + 1st row
            shapesOfBlocks[baseAddr+3] * stride + shapesOfBlocks[baseAddr+1] + 1
        );
    }

    return this.run(fn, dtypes, newShapes, newArrays, custom);
}

/**
 * Call a stored subroutine
 * @param {string} subname
 * @param {object} header
 * @param {ArrayBufferView[]} inputs
 */
function subroutine(subname, header, inputs)
{
    const steps = header.custom.subroutine[subname];

    // run a sequence of operations
    for(let i = 0, n = steps.length; i < n; i++) {
        const step = steps[i];
        const stepOutput = inputs[step.indexOfOutputMatrix];
        const stepInputs = step.indicesOfInputMatrices.map(index => inputs[index]);
        const stepMethod = this[step.header.method];

        stepMethod(step.header, stepOutput, stepInputs);
    }
}

/**
 * Create a TypedArray of the specified type
 * @param {MatrixDataType} dtype data type
 * @param {any[]} args will be passed to the constructor of the TypedArray
 * @returns {ArrayBufferView}
 */
function createTypedArray(dtype, ...args)
{
    return this.MatrixType.createTypedArray(dtype, ...args);
}

/**
 * The 2-norm of a column vector
 * @param {ArrayBufferView} column
 * @param {number} [begin] first index
 * @param {number} [length]
 * @returns {number}
 */
function norm2(column, begin = 0, length = column.length)
{
    let norm = 0, end = begin + length, i;

    // Since we store data in column-major format,
    // we don't need to use stride
    for(i = begin; i < end; i++)
        norm += column[i] * column[i];

    return Math.sqrt(norm);
}

/**
 * The dot product of two column vectors
 * @param {ArrayBufferView} u
 * @param {ArrayBufferView} v
 * @param {number} [uBegin] first index 
 * @param {number} [vBegin] first index 
 * @param {number} [length] 
 */
function dot(u, v, uBegin = 0, vBegin = 0, length = u.length)
{
    let dot = 0, i;

    for(i = 0; i < length; i++)
        dot += u[uBegin + i] * v[vBegin + i];

    return dot;
}

/**
 * Fisher-Yates shuffle
 * @param {Array} array
 * @param {number} [begin] the index of the beginning of the subarray, inclusive
 * @param {number} [end] last index of the subarray, exclusive
 * @returns {Array} the input array, shuffled
 */
function shuffle(array, begin = 0, end = array.length)
{
    begin = Math.max(begin, 0);
    end = Math.min(end, array.length);

    for(let t, j, i = end - 1; i > begin; i--) {
        j = ((Math.random() * (i+1 - begin)) | 0) + begin;
        t = array[i];
        array[i] = array[j];
        array[j] = t;
    }

    return array;
}

/**
 * Range from 0 to n-1
 * @param {number} n
 * @returns {number[]} array of length n
 */
function range(n)
{
    return Array.from({ length: n }, (_, i) => i);
}


/***/ }),

/***/ "./src/core/math/matrix-buffer.js":
/*!****************************************!*\
  !*** ./src/core/math/matrix-buffer.js ***!
  \****************************************/
/*! exports provided: MatrixBuffer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixBuffer", function() { return MatrixBuffer; });
/* harmony import */ var _matrix_type__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrix-type */ "./src/core/math/matrix-type.js");
/* harmony import */ var _matrix_type__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_matrix_type__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * matrix-buffer.js
 * Storage for elements of matrices
 */






/**
 * Stores the contents of a matrix
 */
class MatrixBuffer
{
    /**
     * Class constructor
     * @param {number} length number of elements of the buffer
     * @param {number[]|ArrayBufferView|null} [values] initial values in column-major format
     * @param {MatrixDataType} [dtype] the type of the elements of the matrix
     * @param {?MatrixBuffer} [parent] the buffer that originated this one, if any
     */
    constructor(length, values = null, dtype = _matrix_type__WEBPACK_IMPORTED_MODULE_0__["MatrixType"].default, parent = null)
    {
        length |= 0;

        // validate
        if(!_matrix_type__WEBPACK_IMPORTED_MODULE_0__["MatrixType"].isValid(dtype))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["IllegalArgumentError"](`Invalid data type: "${dtype}"`);
        if(length <= 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["IllegalArgumentError"](`Invalid matrix length`);

        // allocate new TypedArray
        const data =
            (values == null) ? _matrix_type__WEBPACK_IMPORTED_MODULE_0__["MatrixType"].createTypedArray(dtype, length) : (
            Array.isArray(values) ? _matrix_type__WEBPACK_IMPORTED_MODULE_0__["MatrixType"].createTypedArray(dtype, values) :
            values);



        // store data

        /** @type {MatrixDataType} data type */
        this._dtype = dtype;

        /** @type {ArrayBufferView} a reference to the TypedArray (storage) */
        this._data = data;

        /** @type {number} TypedArray byte offset: assumed to be constant */
        this._byteOffset = data.byteOffset;

        /** @type {number} TypedArray length: assumed to be constant */
        this._length = data.length;



        // concurrency control

        /** @type {number} number of pending operations that read from or write to the buffer */
        this._pendingOperations = parent ? parent._pendingOperations : 0;

        /** @type {Array<function()>} a list of Function<void> to be called as soon as there are no pending operations */
        this._pendingAccessesQueue = [];

        /** @type {MatrixBuffer[]} a list of MatrixBuffers that share their internal memory with this one (we create a tree structure) */
        this._children = [];

        /** @type {?MatrixBuffer} the buffer that originated this one, if any (null if none) */
        this._parent = parent;
    }

    /**
     * Data type
     * @returns {MatrixDataType}
     */
    get dtype()
    {
        return this._dtype;
    }

    /**
     * Get the internal TypedArray that holds the entries of the Matrix
     * Make sure the buffer is ready() before accessing this property
     * @returns {ArrayBufferView}
     */
    get data()
    {
        return this._data;
    }

    /**
     * Wait for buffer readiness. Since the buffer holds
     * a Transferable object, the data may or may not be
     * available right now. The returned SpeedyPromise will be
     * resolved as soon as the buffer is available for
     * reading and writing
     * @returns {SpeedyPromise<MatrixBuffer>}
     */
    ready()
    {
        if(this._pendingOperations > 0) {
            // we're not ready yet: there are calculations taking place...
            // we'll resolve this promise as soon as there are no pending calculations
            return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__["SpeedyPromise"](resolve => {
                this._pendingAccessesQueue.push(() => resolve(this));
            });
        }
        else {
            // we're ready to go!
            // no pending operations
            return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__["SpeedyPromise"].resolve(this);
        }
    }

    /**
     * Lock the buffer, so it can't be read from nor written to
     * @param {boolean} [ascend] internal
     */
    lock(ascend = true)
    {
        let my = this;

        // climb the tree
        if(ascend && my._parent) {
            do { my = my._parent; } while(my._parent);
        }

        // lock this buffer
        ++my._pendingOperations;

        // broadcast
        for(let i = my._children.length - 1; i >= 0; i--)
            my._children[i].lock(false);
    }

    /**
     * Unlock the buffer and resolve all pending read/write operations
     * @param {boolean} [ascend] internal
     */
    unlock(ascend = true)
    {
        let my = this;

        // climb the tree
        if(ascend && my._parent) {
            do { my = my._parent; } while(my._parent);
        }

        // unlock this buffer
        if(--my._pendingOperations <= 0) {
            const callbackQueue = my._pendingAccessesQueue.slice(0); // fast clone
            const n = callbackQueue.length;

            my._pendingOperations = 0;
            my._pendingAccessesQueue.length = 0;

            for(let i = 0; i < n; i++) {
                // if the buffer has been locked again, put the functions back in the queue
                if(my._pendingOperations > 0) {
                    for(let j = n - 1; j >= i; j--) {
                        my._pendingAccessesQueue.unshift(callbackQueue[j]);
                    }
                    break; // note: for each lock() we need an unlock()
                }

                // if the buffer remains unlocked, we're cool
                callbackQueue[i].call(my);
            }
        }

        // broadcast
        for(let i = my._children.length - 1; i >= 0; i--)
            my._children[i].unlock(false);
    }

    /**
     * Replace the internal buffer of the TypedArray
     * @param {ArrayBuffer} arrayBuffer new internal buffer
     */
    replace(arrayBuffer)
    {
        if(this._data.buffer !== arrayBuffer)
            this._replace(arrayBuffer, true);
    }

    /**
     * Create a MatrixBuffer that shares its internal memory with this one
     * @param {number} [begin] index of the first element of the TypedArray
     * @param {number} [length] number of elements of the TypedArray
     * @returns {SpeedyPromise<MatrixBuffer>}
     */
    createSharedBuffer(begin = 0, length = this._length)
    {
        return this.ready().then(() => {
            // obtain shared area of memory
            const end = Math.min(begin + length, this._length);
            const data = this._data.subarray(begin, end); // the main thread must own this._data

            // create shared buffer
            const sharedBuffer = new MatrixBuffer(length, data, this._dtype, this);
            this._children.push(sharedBuffer);

            // done!
            return sharedBuffer;
        });
    }

    /**
     * Replace the internal buffer of the TypedArray
     * @param {ArrayBuffer} arrayBuffer new internal buffer
     * @param {boolean} [ascend] internal
     */
    _replace(arrayBuffer, ascend = true)
    {
        let my = this;

        // climb the tree
        if(my._parent && ascend) {
            do { my = my._parent; } while(my._parent);
        }

        // replace the internal buffer
        my._data = _matrix_type__WEBPACK_IMPORTED_MODULE_0__["MatrixType"].createTypedArray(this._dtype, arrayBuffer, my._byteOffset, my._length);

        // broadcast
        for(let i = my._children.length - 1; i >= 0; i--)
            my._children[i]._replace(arrayBuffer, false);
    }
}

/***/ }),

/***/ "./src/core/math/matrix-expression-factory.js":
/*!****************************************************!*\
  !*** ./src/core/math/matrix-expression-factory.js ***!
  \****************************************************/
/*! exports provided: SpeedyMatrixExprFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMatrixExprFactory", function() { return SpeedyMatrixExprFactory; });
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _matrix_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./matrix-type */ "./src/core/math/matrix-type.js");
/* harmony import */ var _matrix_type__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_matrix_type__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _matrix_shape__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./matrix-shape */ "./src/core/math/matrix-shape.js");
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./matrix */ "./src/core/math/matrix.js");
/* harmony import */ var _matrix_settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./matrix-settings */ "./src/core/math/matrix-settings.js");
/* harmony import */ var _speedy_point__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./speedy-point */ "./src/core/math/speedy-point.js");
/* harmony import */ var _matrix_expressions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./matrix-expressions */ "./src/core/math/matrix-expressions.js");
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
 * matrix-expression-factory.js
 * A factory of matrix expressions
 */









/**
 * A factory of matrix expressions
 */
class SpeedyMatrixExprFactory extends Function
{
    // ==============================================
    // Matrices with known entries
    // ==============================================

    /**
     * The factory can be invoked as a function
     * This is an alias to SpeedyMatrixExprFactory._create()
     */
    constructor()
    {
        super('...args', 'return this._create(...args)');
        return this.bind(this);
    }

    /**
     * Create a new matrix filled with zeroes
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns (defaults to the number of rows)
     * @param {number[]} [values] initial values in column-major format
     * @param {MatrixDataType} [dtype] data type of the elements of the matrix
     * @returns {SpeedyMatrixElementaryExpr}
     */
    Zeros(rows, columns = rows, dtype = _matrix_type__WEBPACK_IMPORTED_MODULE_1__["MatrixType"].default)
    {
        const values = (new Array(rows * columns)).fill(0);
        return this._create(rows, columns, values, dtype);
    }

    /**
     * Create a new matrix filled with ones
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns (defaults to the number of rows)
     * @param {number[]} [values] initial values in column-major format
     * @param {MatrixDataType} [dtype] data type of the elements of the matrix
     * @returns {SpeedyMatrixElementaryExpr}
     */
    Ones(rows, columns = rows, dtype = _matrix_type__WEBPACK_IMPORTED_MODULE_1__["MatrixType"].default)
    {
        const values = (new Array(rows * columns)).fill(1);
        return this._create(rows, columns, values, dtype);
    }

    /**
     * Create a new identity matrix
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns (defaults to the number of rows)
     * @param {number[]} [values] initial values in column-major format
     * @param {MatrixDataType} [dtype] data type of the elements of the matrix
     * @returns {SpeedyMatrixElementaryExpr}
     */
    Eye(rows, columns = rows, dtype = _matrix_type__WEBPACK_IMPORTED_MODULE_1__["MatrixType"].default)
    {
        const values = (new Array(rows * columns)).fill(0);
        for(let j = Math.min(rows, columns) - 1; j >= 0; j--)
            values[j * rows + j] = 1;

        return this._create(rows, columns, values, dtype);
    }

    /**
     * Create a new SpeedyMatrixExpr that evaluates to a user-defined matrix
     * (or to a matrix without data if its entries are not provided)
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns (defaults to the number of rows)
     * @param {MatrixDataType} [dtype] data type of the elements of the matrix
     * @param {number[]} [values] initial values in column-major format
     * @returns {SpeedyMatrixElementaryExpr}
     */
    _create(rows, columns = rows, values = null, dtype = _matrix_type__WEBPACK_IMPORTED_MODULE_1__["MatrixType"].default)
    {
        let shape = new _matrix_shape__WEBPACK_IMPORTED_MODULE_2__["MatrixShape"](rows, columns, dtype), matrix = null;

        if(values != null) {
            if(!Array.isArray(values))
                throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Can't initialize SpeedyMatrix with values ${values}`);
            if(values.length > 0)
                matrix = new _matrix__WEBPACK_IMPORTED_MODULE_3__["SpeedyMatrix"](shape, values);
        }

        return new _matrix_expressions__WEBPACK_IMPORTED_MODULE_6__["SpeedyMatrixElementaryExpr"](shape, matrix);
    }




    // ==============================================
    // General Utilities
    // ==============================================

    /**
     * Settings object
     * @returns {SpeedyMatrixSettings}
     */
    get Settings()
    {
        return _matrix_settings__WEBPACK_IMPORTED_MODULE_4__["SpeedyMatrixSettings"].instance;
    }

    /**
     * Evaluate the expression and store the result in a new matrix
     * @param {SpeedyMatrixExpr} expr matrix expression
     * @returns {SpeedyPromise<SpeedyMatrixLvalueExpr>}
     */
    evaluate(expr)
    {
        const mat = new _matrix_expressions__WEBPACK_IMPORTED_MODULE_6__["SpeedyMatrixElementaryExpr"](expr._shape);
        return mat.assign(expr);
    }

    /**
     * Convert an array of points to a matrix representation
     * @param {SpeedyPoint2[]} points a non-empty array
     * @param {MatrixDataType} [dtype] data type of the elements of the matrix
     * @returns {SpeedyMatrixExpr} 2 x n matrix with the coordinates of the points
     */
    fromPoints(points, dtype = _matrix_type__WEBPACK_IMPORTED_MODULE_1__["MatrixType"].default)
    {
        if(!(Array.isArray(points) && points.length > 0))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Can't create matrix from points: ${points}`);

        const entries = [], n = points.length;
        for(let i = 0; i < n; i++) {
            entries.push(points[i].x);
            entries.push(points[i].y);
        }

        return this._create(2, n, entries, dtype);
    }

    /**
     * Convert a 2 x n matrix to an array of points
     * @param {SpeedyMatrixExpr} matrix
     * @returns {SpeedyPromise<SpeedyPoint2[]>}
     */
    toPoints(matrix)
    {
        if(matrix.rows !== 2)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Can't convert ${matrix._shape.toString()} matrix to points`);

        return matrix.read().then(entries => {
            const points = [], n = entries.length;
            for(let i = 0; i < n; i += 2)
                points.push(new _speedy_point__WEBPACK_IMPORTED_MODULE_5__["SpeedyPoint2"](entries[i], entries[i+1]));

            return points;
        });
    }



    // ==============================================
    // Matrix decompositions
    // ==============================================

    /**
     * QR decomposition
     * @param {SpeedyMatrixExpr} mat m x n matrix to be decomposed (m >= n)
     * @param {QROptions} [options] configuration object
     * @returns {SpeedyPromise<SpeedyMatrixExpr[]>} two matrices: [Q, R]
     * 
     * @typedef {object} QROptions
     * @property {string} [mode] "reduced" | "full"
     */
    QR(mat, options = {})
    {
        const m = mat.rows, n = mat.columns, dtype = mat.dtype;

        // if full, Q is m x m and R is m x n
        // if reduced, Q is m x n and R is n x n
        const full = (options.mode == 'full');
        const matQR = full ? this._create(m, m+n, null, dtype) : this._create(m, n+n, null, dtype);
        const matQ = full ? matQR.block(0, m-1, 0, m-1) : matQR.block(0, m-1, 0, n-1);
        const matR = full ? matQR.block(0, m-1, m, m+n-1) : matQR.block(0, n-1, n, n+n-1);

        return matQR.assign(mat.qr(options.mode)).then(() => [ matQ, matR ]).turbocharge();
    }





    // ==============================================
    // Geometric transformations
    // ==============================================

    /**
     * Compute a perspective transformation using 4 correspondences of points
     * @param {SpeedyMatrixExpr} source 2x4 matrix with coordinates of 4 points (ui, vi)
     * @param {SpeedyMatrixExpr} destination 2x4 matrix with coordinates of 4 points (xi, yi)
     * @returns {SpeedyMatrixExpr} 3x3 matrix: perspective transformation
     */
    Perspective(source, destination)
    {
        if(!(source.rows === 2 && source.columns === 4 && source._shape.equals(destination._shape)))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Can't compute perspective transformation using ${source} and ${destination}. 4 correspondences of points are required`);

        return new _matrix_expressions__WEBPACK_IMPORTED_MODULE_6__["SpeedyMatrixHomography4pExpr"](source, destination);
    }

    /**
     * Find a homography matrix using 4 or more correspondences of points
     * @param {SpeedyMatrixExpr} source 2 x n matrix with coordinates of n points (n >= 4)
     * @param {SpeedyMatrixExpr} destination 2 x n matrix with coordinates of n points
     * @param {FindHomographyOptions} [options]
     *
     * @typedef {object} FindHomographyOptions
     * @property {string} method One of the following: "p-ransac"
     * @property {FindHomographyMethodParameters} [parameters]
     *
     * @typedef {object} FindHomographyMethodParameters
     * @property {?SpeedyMatrixLvalueExpr} [mask] 1 x n output matrix to separate inliers (1) from outliers (0)
     * @property {number} [reprojectionError] threshold in pixels to separate inliers from outliers (RANSAC variants)
     * @property {number} [numberOfHypotheses] for p-ransac only
     * @property {number} [bundleSize] for p-ransac only
     */
    findHomography(source, destination, options = {})
    {
        // default options
        options.method = options.method || 'p-ransac';
        options.parameters = Object.assign({
            mask: null,
            numberOfHypotheses: 500,
            bundleSize: 100,
            reprojectionError: 2
        }, options.parameters || {});

        // validate shapes
        if(!(source.rows === 2 && source.columns >= 4 && source._shape.equals(destination._shape)))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Can't compute homography matrix using ${source} and ${destination}. 4 or more correspondences of points are required`);

        // returns a node according to the method
        const parameters = options.parameters;
        if(options.method === 'p-ransac') {
            // create an output inlier-outlier mask if one is not supplied
            const maskShape = new _matrix_shape__WEBPACK_IMPORTED_MODULE_2__["MatrixShape"](1, source.columns, source.dtype); // expected shape
            const mask = parameters.mask || new _matrix_expressions__WEBPACK_IMPORTED_MODULE_6__["SpeedyMatrixElementaryExpr"](maskShape, new _matrix__WEBPACK_IMPORTED_MODULE_3__["SpeedyMatrix"](maskShape));

            // cast to number
            const numberOfHypotheses = parameters.numberOfHypotheses | 0;
            const bundleSize = parameters.bundleSize | 0;
            const reprojectionError = +(parameters.reprojectionError);

            // validate
            if(!(mask instanceof _matrix_expressions__WEBPACK_IMPORTED_MODULE_6__["SpeedyMatrixLvalueExpr"] && mask._shape.equals(maskShape)))
                throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Can't compute homography matrix: invalid mask`);
            else if(numberOfHypotheses <= 0 || bundleSize <= 0 || reprojectionError < 0)
                throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Can't compute homography matrix: invalid parameters for "${options.method}"`);

            // done!
            return new _matrix_expressions__WEBPACK_IMPORTED_MODULE_6__["SpeedyMatrixPransacHomographyExpr"](
                source,
                destination,
                numberOfHypotheses,
                bundleSize,
                reprojectionError,
                mask,
            );
        }
        else if(options.method === 'dlt') {
            return new _matrix_expressions__WEBPACK_IMPORTED_MODULE_6__["SpeedyMatrixHomographyDLTExpr"](
                source,
                destination
            );
        }
        else {
            // invalid method
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Can't compute homography matrix using method "${options.method}"`);
        }
    }

    /**
     * Apply a transformation matrix to a set of 2D points
     * @param {SpeedyMatrixExpr} mat homography (3x3) or affine (2x3) or linear (2x2)
     * @param {SpeedyMatrixExpr} points a set of n 2D points (2xn)
     * @returns {SpeedyMatrixExpr} a 2xn matrix
     */
    transform(mat, points)
    {
        if(points.rows !== 2)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Can't apply transform: invalid set of points (${points._shape.toString()})`);

        if(mat.columns === 3) {
            if(mat.rows === 3)
                return new _matrix_expressions__WEBPACK_IMPORTED_MODULE_6__["SpeedyMatrixApplyHomographyExpr"](mat, points);
            else if(mat.rows === 2)
                return new _matrix_expressions__WEBPACK_IMPORTED_MODULE_6__["SpeedyMatrixApplyAffineExpr"](mat, points);
        }
        else if(mat.columns === 2 && mat.rows === 2)
            return new _matrix_expressions__WEBPACK_IMPORTED_MODULE_6__["SpeedyMatrixApplyLinear2dExpr"](mat, points);

        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Can't apply transformation: invalid transformation matrix (${mat._shape.toString()})`);
    }
}

/***/ }),

/***/ "./src/core/math/matrix-expressions.js":
/*!*********************************************!*\
  !*** ./src/core/math/matrix-expressions.js ***!
  \*********************************************/
/*! exports provided: SpeedyMatrixExpr, SpeedyMatrixLvalueExpr, SpeedyMatrixElementaryExpr, SpeedyMatrixConstantExpr, SpeedyMatrixHomography4pExpr, SpeedyMatrixHomographyDLTExpr, SpeedyMatrixApplyHomographyExpr, SpeedyMatrixApplyAffineExpr, SpeedyMatrixApplyLinear2dExpr, SpeedyMatrixPransacHomographyExpr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMatrixExpr", function() { return SpeedyMatrixExpr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMatrixLvalueExpr", function() { return SpeedyMatrixLvalueExpr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMatrixElementaryExpr", function() { return SpeedyMatrixElementaryExpr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMatrixConstantExpr", function() { return SpeedyMatrixConstantExpr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMatrixHomography4pExpr", function() { return SpeedyMatrixHomography4pExpr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMatrixHomographyDLTExpr", function() { return SpeedyMatrixHomographyDLTExpr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMatrixApplyHomographyExpr", function() { return SpeedyMatrixApplyHomographyExpr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMatrixApplyAffineExpr", function() { return SpeedyMatrixApplyAffineExpr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMatrixApplyLinear2dExpr", function() { return SpeedyMatrixApplyLinear2dExpr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMatrixPransacHomographyExpr", function() { return SpeedyMatrixPransacHomographyExpr; });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrix */ "./src/core/math/matrix.js");
/* harmony import */ var _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bound-matrix-operation */ "./src/core/math/bound-matrix-operation.js");
/* harmony import */ var _matrix_shape__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./matrix-shape */ "./src/core/math/matrix-shape.js");
/* harmony import */ var _matrix_operations_queue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./matrix-operations-queue */ "./src/core/math/matrix-operations-queue.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_sorting_networks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/sorting-networks */ "./src/utils/sorting-networks.js");
/* harmony import */ var _matrix_operations__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./matrix-operations */ "./src/core/math/matrix-operations.js");
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
 * matrix-expressions.js
 * Abstract Matrix Algebra
 */











// constants
const matrixOperationsQueue = _matrix_operations_queue__WEBPACK_IMPORTED_MODULE_3__["MatrixOperationsQueue"].instance;


// ================================================
// ABSTRACT TYPES
// ================================================

/**
 * An abstract algebraic expression with matrices
 * All expressions must be immutable from the outside
 * @abstract
 */
class SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {MatrixShape} shape the shape of the resulting (evaluated) expression
     */
    constructor(shape)
    {
        /** @type {MatrixShape} the shape of the evaluated matrix expression */
        this._shape = shape;

        /** @type {BoundMatrixOperation} this expression, compiled */
        this._compiledExpr = null; // to be computed lazily
    }

    /**
     * Number of rows of the resulting matrix
     * @returns {number}
     */
    get rows()
    {
        return this._shape.rows;
    }

    /**
     * Number of columns of the resulting matrix
     * @returns {number}
     */
    get columns()
    {
        return this._shape.columns;
    }

    /**
     * Type of the resulting matrix
     * @returns {MatrixDataType}
     */
    get dtype()
    {
        return this._shape.dtype;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["AbstractMethodError"]();
    }

    /**
     * Compile and evaluate this expression, so
     * that the WebWorker will be invoked ONCE
     * for the entire expression
     * @returns {SpeedyPromise<SpeedyMatrixExpr>}
     */
    _compileAndEvaluate()
    {
        // We can store an expression in compiled form as long
        // as the pointers of the internal matrices, i.e., the
        // matrices bound to the matrix operations, do not change
        // in time. If they do change, we need to recompile the
        // expression. It is assumed that the structure of the
        // expression tree does not change. This means that all
        // descendants of this node remain the same.
        if(this._compiledExpr === null) {
            return this._compile().then(result =>
                this._compiledExpr = result.pack() // store the compiled object
            ).then(compiledExpr =>
                matrixOperationsQueue.enqueue(
                    compiledExpr.operation,
                    compiledExpr.outputMatrix, // should be === this._matrix
                    compiledExpr.inputMatrices
                )
            ).then(() => this);
        }
        else {
            return matrixOperationsQueue.enqueue(
                this._compiledExpr.operation,
                this._compiledExpr.outputMatrix,
                this._compiledExpr.inputMatrices
            ).then(() => this);
        }
    }

    /**
     * Get the matrix associated with the result of this expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["AbstractMethodError"]();
    }

    /**
     * Assign a matrix
     * @param {SpeedyMatrix} matrix
     * @returns {SpeedyPromise<void>} resolves as soon as the assignment is done
     */
    _assign(matrix)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalOperationError"](`Can't assign matrix: not a l-value`);
    }

    /**
     * Compile an assignment operation
     * @param {BoundMatrixOperationTree} value
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compileAssignment(value)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalOperationError"](`Can't assign matrix: not a l-value`);
    }

    /**
     * Assert matrix shape and type
     * @param {MatrixShape} actual
     * @param {MatrixShape} expected
     */
    static _assertSameShape(actual, expected)
    {
        if(actual.equals(expected))
            return;
        else if(actual.dtype !== expected.dtype)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalOperationError"](`Incompatible matrix data type (expected "${expected.dtype}", found "${actual.dtype}")`);
        else
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalOperationError"](`Incompatible matrix shape (expected ${expected.rows} x ${expected.columns}, found ${actual.rows} x ${actual.columns})`);
    }



    //
    // GENERIC UTILITIES
    //

    /**
     * Assign an expression (i.e., this := expr)
     * @param {SpeedyMatrixExpr|number[]} expr
     * @returns {SpeedyPromise<SpeedyMatrixAssignmentExpr>}
     */
    assign(expr)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalOperationError"](`Can't assign matrix: not a l-value`);
    }

    /**
     * Fill the matrix with a constant value
     * @param {number} value
     * @returns {SpeedyPromise<SpeedyMatrixAssignmentExpr>}
     */
    fill(value)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalOperationError"](`Can't fill matrix: not a l-value`);
    }

    /**
     * Read the entries of this matrix
     * Results are given in column-major format
     * @returns {SpeedyPromise<number[]>}
     */
    read()
    {
        return this._compileAndEvaluate().then(expr => expr._matrix.read()).turbocharge();
    }

    /**
     * Print the result of this matrix expression to the console
     * @param {number} [decimals] format numbers to a number of decimals
     * @param {Function} [printFunction] prints a string
     * @returns {SpeedyPromise<void>} a promise that resolves as soon as the matrix is printed
     */
    print(decimals = undefined, printFunction = undefined)
    {
        return this._compileAndEvaluate().then(expr => expr._matrix.print(decimals, printFunction)).turbocharge();
    }

    /**
     * Convert to string
     * @returns {string}
     */
    toString()
    {
        return this._matrix.toString();
    }






    //
    // ACCESS BY BLOCK
    //

    /**
     * Extract a (lastRow - firstRow + 1) x (lastColumn - firstColumn + 1)
     * block from the matrix. All indices are 0-based. Note that the
     * memory of the block is shared with the memory of the matrix.
     * @param {number} firstRow
     * @param {number} lastRow
     * @param {number} firstColumn
     * @param {number} lastColumn
     * @returns {SpeedyMatrixReadonlyBlockExpr}
     */
    block(firstRow, lastRow, firstColumn, lastColumn)
    {
        return new SpeedyMatrixReadonlyBlockExpr(this, firstRow, lastRow, firstColumn, lastColumn);
    }

    /**
     * Get the i-th row of the matrix
     * @param {number} i 0-based index
     */
    row(i)
    {
        return this.block(i, i, 0, this.columns - 1);
    }

    /**
     * Get the j-th column of the matrix
     * @param {number} j 0-based index
     */
    column(j)
    {
        return this.block(0, this.rows - 1, j, j);
    }

    /**
     * Get (lastRow - firstRow + 1) contiguous rows. Both indices are inclusive.
     * @param {number} firstRow
     * @param {number} lastRow
     */
    rowSpan(firstRow, lastRow)
    {
        return this.block(firstRow, lastRow, 0, this.columns - 1);
    }

    /**
     * Get (lastColumn - firstColumn + 1) contiguous columns. Both indices are inclusive.
     * @param {number} firstColumn
     * @param {number} lastColumn
     */
    columnSpan(firstColumn, lastColumn)
    {
        return this.block(0, this.rows - 1, firstColumn, lastColumn);
    }

    /**
     * Get the main diagonal of the matrix. Internal buffer is shared.
     * @returns {SpeedyMatrixReadonlyDiagonalExpr}
     */
    diagonal()
    {
        return new SpeedyMatrixReadonlyDiagonalExpr(this);
    }




    //
    // GENERAL OPERATIONS
    //


    /**
     * Transpose matrix
     * @returns {SpeedyMatrixExpr}
     */
    transpose()
    {
        return new SpeedyMatrixTransposeExpr(this);
    }

    /**
     * Add this matrix to another
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixExpr}
     */
    plus(expr)
    {
        return new SpeedyMatrixAddExpr(this, expr);
    }

    /**
     * Subtract another matrix from this
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixExpr}
     */
    minus(expr)
    {
        return new SpeedyMatrixSubtractExpr(this, expr);
    }

    /**
     * Multiply by a matrix or by a number
     * @param {SpeedyMatrixExpr|number} expr
     * @returns {SpeedyMatrixExpr}
     */
    times(expr)
    {
        if(expr instanceof SpeedyMatrixExpr)
            return new SpeedyMatrixMultiplyExpr(this, expr);
        else
            return new SpeedyMatrixScaleExpr(this, expr);
    }

    /**
     * Component-wise multiplication
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixExpr}
     */
    compMult(expr)
    {
        return new SpeedyMatrixCompMultExpr(this, expr);
    }

    /**
     * Compute the inverse of this matrix
     * @returns {SpeedyMatrixExpr}
     */
    inverse()
    {
        return new SpeedyMatrixInverseExpr(this);
    }





    //
    // Misc
    //

    /**
     * Similar to the comma operator in C/++
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixExpr}
     */
    followedBy(expr)
    {
        return new SpeedyMatrixSequenceExpr(this, expr);
    }

    /**
     * Creates an assignment expression (i.e., this := expr),
     * without actually computing or changing any numbers
     * @param {SpeedyMatrixExpr | number[]} expr
     * @returns {SpeedyMatrixAssignmentExpr}
     */
    setTo(expr)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalOperationError"](`Can't create an assignment expression: not a l-value`);
    }








    //
    // Functional programming
    //

    /**
     * Map function (applied per block), analogous to Array.prototype.map()
     * @param {number} blockRows number of rows of each block (must be the same as the number of rows of the input matrix expression)
     * @param {number} blockColumns number of columns of each block (the number of columns of the input matrix expression must be a multiple of this)
     * @param {Function} fn mapping function: receives a blockRows x blockColumns matrix and must return a SpeedyMatrixExpr
     */
    map(blockRows, blockColumns, fn)
    {
        // validate arguments
        if(typeof fn !== 'function')
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`map() expects a mapping function`);
        if(blockRows !== this.rows)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`map() expects blockRows (${blockRows}) to be the number of rows of the matrix (${this.rows})`);
        if(blockColumns <= 0 || this.columns % blockColumns !== 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`map() expects the number of columns of the matrix (${this.columns}) to be divisible by blockColumns (${blockColumns})`);

        // What is the matrix expression returned by fn?
        const blockShape = new _matrix_shape__WEBPACK_IMPORTED_MODULE_2__["MatrixShape"](blockRows, blockColumns, this.dtype);
        const indexShape = new _matrix_shape__WEBPACK_IMPORTED_MODULE_2__["MatrixShape"](1, 1, this.dtype /*'int32'*/ );
        const bi = new SpeedyMatrixElementaryExpr(blockShape, new _matrix__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrix"](blockShape));
        const index = new SpeedyMatrixElementaryExpr(indexShape, new _matrix__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrix"](indexShape));
        const input = new SpeedyMatrixConstantExpr(this);
        const mapfn = fn(bi, index, input);
        if(!(mapfn instanceof SpeedyMatrixExpr))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalOperationError"](`map() expects that the mapping function returns a matrix expression for all input blocks`);

        // create the map expression
        return new SpeedyMatrixMapExpr(this, mapfn, bi._matrix, index._matrix);
    }

    /**
     * Reduce function (applied per block), analogous to Array.prototype.reduce()
     * @param {number} blockRows number of rows of each block (must be the same as the number of rows of the input matrix expression)
     * @param {number} blockColumns number of columns of each block (the number of columns of the input matrix expression must be a multiple of this)
     * @param {Function} fn reducer function: receives a blockRows x blockColumns matrix and must return a SpeedyMatrixExpr
     * @param {SpeedyMatrixExpr} initialMatrix initial matrix, used as the accumulator on the first invocation of fn
     */
    reduce(blockRows, blockColumns, fn, initialMatrix)
    {
        // validate arguments
        if(typeof fn !== 'function')
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`reduce() expects a reducer function`);
        if(blockRows !== this.rows)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`reduce() expects blockRows (${blockRows}) to be the number of rows of the matrix (${this.rows})`);
        if(blockColumns <= 0 || this.columns % blockColumns !== 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`reduce() expects the number of columns of the matrix (${this.columns}) to be divisible by blockColumns (${blockColumns})`);
        if(!(initialMatrix instanceof SpeedyMatrixExpr))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`reduce() expects initialMatrix to be a SpeedyMatrixExpr`);

        // What is the matrix expression returned by fn?
        const blockShape = new _matrix_shape__WEBPACK_IMPORTED_MODULE_2__["MatrixShape"](blockRows, blockColumns, this.dtype);
        const indexShape = new _matrix_shape__WEBPACK_IMPORTED_MODULE_2__["MatrixShape"](1, 1, this.dtype /*'int32'*/ );
        const bi = new SpeedyMatrixElementaryExpr(blockShape, new _matrix__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrix"](blockShape));
        const accumulator = new SpeedyMatrixElementaryExpr(initialMatrix._shape, new _matrix__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrix"](initialMatrix._shape));
        const index = new SpeedyMatrixElementaryExpr(indexShape, new _matrix__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrix"](indexShape));
        const input = new SpeedyMatrixConstantExpr(this);
        const reducefn = fn(accumulator, bi, index, input);
        if(!(reducefn instanceof SpeedyMatrixExpr))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalOperationError"](`reduce() expects that the reducer function returns a SpeedyMatrixExpr for all input blocks`);
        else if(!reducefn._shape.equals(initialMatrix._shape))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalOperationError"](`reduce() expects that the reducer function returns matrices of the same shape as the initial matrix for all input blocks`);

        // create the reduce expression
        return new SpeedyMatrixReduceExpr(this, reducefn, accumulator._matrix, bi._matrix, index._matrix, initialMatrix);
    }

    /**
     * Sort matrix blocks, analogous to Array.prototype.sort()
     * @param {number} blockRows number of rows of each block (must be the same as the number of rows of the input matrix expression)
     * @param {number} blockColumns number of columns of each block (the number of columns of the input matrix expression must be a multiple of this)
     * @param {Function} cmp compare function: receives a pair of blockRows x blockColumns matrices and must return a 1x1 SpeedyMatrixExpr
     */
    sort(blockRows, blockColumns, cmp)
    {
         // validate arguments
        if(typeof cmp !== 'function')
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`sort() expects a comparison function`);
        if(blockRows !== this.rows)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`sort() expects blockRows (${blockRows}) to be the number of rows of the matrix (${this.rows})`);
        if(blockColumns <= 0 || this.columns % blockColumns !== 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`sort() expects the number of columns of the matrix (${this.columns}) to be divisible by blockColumns (${blockColumns})`);

        // create input blocks for cmp()
        const blockShape = new _matrix_shape__WEBPACK_IMPORTED_MODULE_2__["MatrixShape"](blockRows, blockColumns, this.dtype);
        const bi = new SpeedyMatrixElementaryExpr(blockShape, new _matrix__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrix"](blockShape));
        const bj = new SpeedyMatrixElementaryExpr(blockShape, new _matrix__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrix"](blockShape));

        // cmp() must return a 1x1 SpeedyMatrixExpr
        const comparator = cmp(bi, bj);
        if(!(comparator instanceof SpeedyMatrixExpr && comparator._shape.rows === 1 && comparator._shape.columns === 1))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalOperationError"](`sort() expects that the comparator function returns a 1x1 matrix expression for all comparison pairs`);

        // we're ready to sort the blocks
        return new SpeedyMatrixSortExpr(this, comparator, bi._matrix, bj._matrix);
    }



    //
    // Linear Algebra
    //

    /**
     * QR decomposition
     * @param {string} [mode] 'full' | 'reduced'
     * @returns {SpeedyMatrixExpr}
     */
    qr(mode = 'reduced')
    {
        return new SpeedyMatrixQRExpr(this, mode);
    }

    /**
     * Find least squares solution for a system of linear equations,
     * i.e., find x such that the 2-norm |b - Ax| is minimized.
     * A is this (m x n) matrix expression, satisfying m >= n
     * m is the number of equations and n is the number of unknowns
     * @param {SpeedyMatrixExpr} b m x 1 matrix
     */
    lssolve(b)
    {
        return new SpeedyMatrixLSSolveNodeExpr(this, b);
    }

    /**
     * Solve a linear system of equations,
     * i.e., solve Ax = b for x. A is this
     * (m x m) expression and b is m x 1
     * @param {SpeedyMatrixExpr} b
     * @param {string} [method] 'qr'
     */
    solve(b, method = 'qr')
    {
        // m: rows (number of equations), n: columns (number of unknowns)
        const rows = this.rows, columns = this.columns;

        // validate size
        if(rows !== columns)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`solve expects a square matrix, but received a ${rows} x ${columns} matrix`);
        else if(b.rows !== rows || b.columns !== 1)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`solve expected a ${rows} x 1 input vector, but received a ${b.rows} x ${b.columns} matrix`);

        // solve system of equations
        switch(method)
        {
            case 'qr':
                return this.lssolve(b);

            // TODO: Gaussian elimination
            //case 'lu':

            default:
                throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Unknown method for solve: "${method}"`);
        }
    }







    //
    // Internal utilities
    //

    /**
     * Create a new matrix expression
     * @param {number} rows
     * @param {number} columns
     * @param {number[]} values in column-major format
     * @returns {SpeedyMatrixElementaryExpr}
     */
    static create(rows, columns, values)
    {
        const shape = new _matrix_shape__WEBPACK_IMPORTED_MODULE_2__["MatrixShape"](rows, columns);
        const matrix = new _matrix__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrix"](shape, values);

        return new SpeedyMatrixElementaryExpr(shape, matrix);
    }

    /**
     * Internal QR solver: Ax = b
     * This creates a matrix [ (Q^T) b | R ] using reduced QR
     * All (m-n) entries at the bottom are zeros
     * @param {SpeedyMatrixExpr} b
     * @returns {SpeedyMatrixExpr}
     */
    _qrSolve(b)
    {
        return new SpeedyMatrixQRSolverNodeExpr(this, b);
    }

    /**
     * Internal back-substitution algorithm. It assumes this
     * matrix expression is of the form [ b | R ] for some
     * upper-triangular R matrix and some column-vector b
     */
    _backSubstitution()
    {
        return new SpeedyMatrixBackSubstitutionNodeExpr(this);
    }
}

/**
 * The result of an intermediate calculation (e.g., A + B)
 * A temporary matrix for storing the result of the calculation is created
 * @abstract
 */
class SpeedyMatrixTempExpr extends SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {MatrixShape} shape the shape of the resulting expression
     */
    constructor(shape)
    {
        super(shape);

        /** @type {SpeedyMatrix} used for temporary calculations */
        this._tmpmatrix = new _matrix__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrix"](shape);
    }

    /**
     * Get the matrix associated with this expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._tmpmatrix;
    }
}

/**
 * Unary expression
 * @abstract
 */
class SpeedyMatrixUnaryExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr input expression
     * @param {MatrixOperation} operation unary operation
     */
    constructor(expr, operation)
    {
        super(operation.shape);

        /** @type {SpeedyMatrixExpr} input expression */
        this._expr = expr;

        /** @type {MatrixOperation} unary operation */
        this._operation = operation;

        // validate
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(operation.numberOfInputMatrices() === 1); // must be unary
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._expr._compile().then(node =>
            new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](
                this._operation,
                this._matrix,
                [ node ]
            )
        );
    }

    /**
     * Input expression
     * @returns {SpeedyMatrixExpr}
     */
    get child()
    {
        return this._expr;
    }
}

/**
 * Binary expression
 * @abstract
 */
class SpeedyMatrixBinaryExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} leftExpr left operand/expression
     * @param {SpeedyMatrixExpr} rightExpr right operand/expression
     * @param {MatrixOperation} operation binary operation
     */
    constructor(leftExpr, rightExpr, operation)
    {
        super(operation.shape);

        /** @type {SpeedyMatrixExpr} left operand */
        this._leftExpr = leftExpr;

        /** @type {SpeedyMatrixExpr} right operand */
        this._rightExpr = rightExpr;

        /** @type {MatrixOperation} binary operation */
        this._operation = operation;

        // validate
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(operation.numberOfInputMatrices() === 2); // must be a binary operation
        if(rightExpr.dtype !== leftExpr.dtype) // just in case...
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Found a binary expression with different data types: "${leftExpr.dtype}" (left operand) x "${rightExpr.dtype}" (right operand)`);
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_5__["SpeedyPromise"].all([
            this._leftExpr._compile().turbocharge(),
            this._rightExpr._compile().turbocharge()
        ]).then(([ leftNode, rightNode ]) =>
            new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](
                this._operation,
                this._matrix,
                [ leftNode, rightNode ]
            )
        );
    }

    /**
     * Left input expression
     * @returns {SpeedyMatrixExpr}
     */
    get leftChild()
    {
        return this._leftExpr;
    }

    /**
     * Right input expression
     * @returns {SpeedyMatrixExpr}
     */
    get rightChild()
    {
        return this._rightExpr;
    }
}

/**
 * Ternary expression
 * @abstract
 */
class SpeedyMatrixTernaryExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} firstExpr
     * @param {SpeedyMatrixExpr} secondExpr
     * @param {SpeedyMatrixExpr} thirdExpr
     * @param {MatrixOperation} operation ternary operation
     */
    constructor(firstExpr, secondExpr, thirdExpr, operation)
    {
        super(operation.shape);

        /** @type {SpeedyMatrixExpr} first operand */
        this._firstExpr = firstExpr;

        /** @type {SpeedyMatrixExpr} second operand */
        this._secondExpr = secondExpr;

        /** @type {SpeedyMatrixExpr} third operand */
        this._thirdExpr = thirdExpr;

        /** @type {MatrixOperation} ternary operation */
        this._operation = operation;

        // validate
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(operation.numberOfInputMatrices() === 3); // must be a ternary operation
        if(firstExpr.dtype !== secondExpr.dtype || firstExpr.dtype !== thirdExpr.dtype)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Found a ternary expression with different data types: "${firstExpr.dtype}" (first operand) x "${secondExpr.dtype}" (second operand) x "${thirdExpr.dtype}" (third operand)`);
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_5__["SpeedyPromise"].all([
            this._firstExpr._compile().turbocharge(),
            this._secondExpr._compile().turbocharge(),
            this._thirdExpr._compile().turbocharge()
        ]).then(([ firstNode, secondNode, thirdNode ]) =>
            new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](
                this._operation,
                this._matrix,
                [ firstNode, secondNode, thirdNode ]
            )
        );
    }

    /**
     * First operand
     * @returns {SpeedyMatrixExpr}
     */
    get firstChild()
    {
        return this._firstExpr;
    }

    /**
     * Second operand
     * @returns {SpeedyMatrixExpr}
     */
    get secondChild()
    {
        return this._secondExpr;
    }

    /**
     * Third operand
     * @returns {SpeedyMatrixExpr}
     */
    get thirdChild()
    {
        return this._thirdExpr;
    }
}

/**
 * Extract a read-only block submatrix from a matrix expression
 */
class SpeedyMatrixReadonlyBlockExpr extends SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr originating matrix expression
     * @param {number} firstRow indexed by 0
     * @param {number} lastRow
     * @param {number} firstColumn
     * @param {number} lastColumn
     */
    constructor(expr, firstRow, lastRow, firstColumn, lastColumn)
    {
        super(new _matrix_shape__WEBPACK_IMPORTED_MODULE_2__["MatrixShape"](lastRow - firstRow + 1, lastColumn - firstColumn + 1, expr.dtype));

        /** @type {SpeedyMatrixExpr} originating matrix expression */
        this._expr = expr;

        /** @type {number} index of the top-most row (starts at zero) */
        this._firstRow = firstRow;

        /** @type {number} index of the last row */
        this._lastRow = lastRow;

        /** @type {number} index of the left-most column (starts at zero) */
        this._firstColumn = firstColumn;

        /** @type {number} index of the right-most column */
        this._lastColumn = lastColumn;

        /** @type {?SpeedyMatrix} the matrix associated with this expression */
        this._submatrix = null;

        /** @type {?SpeedyMatrix} used for caching */
        this._cachedMatrix = null;
    }

    /**
     * Get the matrix associated with this expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._submatrix;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._expr._compile().then(node => {
            if(node.outputMatrix !== this._cachedMatrix || this._submatrix === null) {
                this._cachedMatrix = node.outputMatrix;
                return this._cachedMatrix.block(
                    this._firstRow,
                    this._lastRow,
                    this._firstColumn,
                    this._lastColumn
                ).then(submatrix => {
                    this._submatrix = submatrix;
                    return node;
                });
            }
            return node;
        }).then(node =>
            new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](
                null,
                this._matrix,
                [ node ]
            )
        );
    }
}

/**
 * Extract a read-only diagonal from a matrix expression
 */
class SpeedyMatrixReadonlyDiagonalExpr extends SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr originating matrix expression
     */
    constructor(expr)
    {
        const diagonalLength = Math.min(expr.rows, expr.columns);
        super(new _matrix_shape__WEBPACK_IMPORTED_MODULE_2__["MatrixShape"](1, diagonalLength, expr.dtype));

        /** @type {SpeedyMatrixExpr} originating matrix expression */
        this._expr = expr;

        /** @type {?SpeedyMatrix} the matrix associated with this expression */
        this._diagonal = null;

        /** @type {?SpeedyMatrix} used for caching */
        this._cachedMatrix = null;
    }

    /**
     * Get the matrix associated with this expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._diagonal;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._expr._compile().then(node => {
            if(node.outputMatrix !== this._cachedMatrix || this._diagonal === null) {
                this._cachedMatrix = node.outputMatrix;
                return this._cachedMatrix.diagonal().then(diagonal => {
                    this._diagonal = diagonal;
                    return node;
                });
            }
            return node;
        }).then(node =>
            new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](
                null,
                this._matrix,
                [ node ]
            )
        );
    }
}

/**
 * Assignment expression
 * Assign rvalue to lvalue (i.e., lvalue := rvalue)
 */
class SpeedyMatrixAssignmentExpr extends SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixLvalueExpr} lvalue
     * @param {SpeedyMatrixExpr} rvalue
     */
    constructor(lvalue, rvalue)
    {
        super(lvalue._shape);

        /** @type {SpeedyMatrixLvalueExpr} */
        this._lvalue = lvalue;

        /** @type {SpeedyMatrixExpr} */
        this._rvalue = rvalue;

        // validate
        SpeedyMatrixExpr._assertSameShape(lvalue._shape, rvalue._shape);
        //Utils.assert(lvalue instanceof SpeedyMatrixLvalueExpr);
    }

    /**
     * Get the matrix associated with this lvalue expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._lvalue._matrix;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_5__["SpeedyPromise"].all([
            this._lvalue._compile().turbocharge(),
            this._rvalue._compile().turbocharge()
        ]).then(([ lvalue, rvalue ]) =>
            this._lvalue._compileAssignment(rvalue).then(assignment =>
                new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](
                    null,
                    this._matrix, // this is lvalue.outputMatrix
                    [ lvalue, assignment ]
                )
            )
        );
    }
}

/**
 * A sequence expression, similar to the comma operator in C/C++ and JavaScript
 * e.g., the (A, B) expression evaluates to B
 */
class SpeedyMatrixSequenceExpr extends SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} first we'll discard this result
     * @param {SpeedyMatrixExpr} second we'll use this as the result of this expression
     */
    constructor(first, second)
    {
        super(second._shape);

        /** @type {SpeedyMatrixExpr} we'll discard this result */
        this._first = first;

        /** @type {SpeedyMatrixExpr} the result of this expression */
        this._second = second;
    }

    /**
     * Get the matrix associated with this expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._second._matrix;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_5__["SpeedyPromise"].all([
            this._first._compile().turbocharge(),
            this._second._compile().turbocharge(),
        ]).then(([ first, second ]) =>
            new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](
                null,
                this._matrix,
                [ first, second ]
            )
        );
    }
}



// ================================================
// L-VALUES
// ================================================

/**
 * An lvalue (locator value) expression represents a user-owned object stored in memory
 * @abstract
 */
class SpeedyMatrixLvalueExpr extends SpeedyMatrixExpr
{
    /**
     * Get the matrix associated with this lvalue expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["AbstractMethodError"]();
    }

    /**
     * Evaluate this lvalue
     * @returns {SpeedyPromise<SpeedyMatrixLvalueExpr>}
     */
    _evaluateLvalue()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["AbstractMethodError"]();
    }

    /**
     * Assign a matrix
     * @param {SpeedyMatrix} matrix
     * @returns {SpeedyPromise<void>} resolves as soon as the assignment is done
     */
    _assign(matrix)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["AbstractMethodError"]();
    }

    /**
     * Compile an assignment operation
     * @param {BoundMatrixOperationTree} value
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compileAssignment(value)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["AbstractMethodError"]();
    }

    /**
     * Assign an expression to this lvalue
     * @param {SpeedyMatrixExpr|number[]} expr
     * @returns {SpeedyPromise<SpeedyMatrixLvalueExpr>} resolves as soon as the assignment is done
     */
    assign(expr)
    {
        // got an array of numbers?
        if(Array.isArray(expr)) {
            const mat = new _matrix__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrix"](this._shape, expr);
            return this._evaluateLvalue().then(lvalue =>
                lvalue._assign(mat)
            ).then(() => this);
        }

        // compile expr and get the data
        return this._evaluateLvalue().then(lvalue =>
            expr._compileAndEvaluate().then(result => lvalue._assign(result._matrix))
        ).then(() => this);
    }

    /**
     * Fill the matrix with a constant value
     * @param {number} value
     * @returns {SpeedyPromise<SpeedyMatrixLvalueExpr>}
     */
    fill(value)
    {
        // FIXME: currently inefficient (compiles new fill expr multiple times)
        return this.assign(new SpeedyMatrixFillExpr(this._shape, +value));
    }

    /**
     * Creates an assignment expression (i.e., this := expr),
     * without actually computing or changing any numbers
     * @param {SpeedyMatrixExpr|number[]} expr matrix expression or an array of numbers in column-major format
     * @returns {SpeedyMatrixAssignmentExpr}
     */
    setTo(expr)
    {
        // got an array of numbers?
        if(Array.isArray(expr)) {
            const mat = new _matrix__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrix"](this._shape, expr);
            expr = new SpeedyMatrixElementaryExpr(mat.shape, mat);
        }

        // return assignment expression
        return new SpeedyMatrixAssignmentExpr(this, expr);
    }

    /**
     * Extract a (lastRow - firstRow + 1) x (lastColumn - firstColumn + 1)
     * block from the matrix. All indices are 0-based. Note that the
     * memory of the block is shared with the memory of the matrix.
     * @param {number} firstRow
     * @param {number} lastRow
     * @param {number} firstColumn
     * @param {number} lastColumn
     * @returns {SpeedyMatrixReadwriteBlockExpr}
     */
    block(firstRow, lastRow, firstColumn, lastColumn)
    {
        return new SpeedyMatrixReadwriteBlockExpr(this, firstRow, lastRow, firstColumn, lastColumn);
    }

    /**
     * Get the main diagonal of the matrix. Internal buffer is shared.
     * @returns {SpeedyMatrixReadwriteDiagonalExpr}
     */
    diagonal()
    {
        return new SpeedyMatrixReadwriteDiagonalExpr(this);
    }
}

/**
 * An elementary expression representing a single matrix
 * (e.g., expression 'A' represents a single matrix)
 */
class SpeedyMatrixElementaryExpr extends SpeedyMatrixLvalueExpr
{
    /**
     * Constructor
     * @param {MatrixShape} shape shape of the matrix
     * @param {?SpeedyMatrix} [matrix] user matrix
     */
    constructor(shape, matrix = null)
    {
        super(shape);

        /** @type {SpeedyMatrix} the matrix associated with this expression */
        this._usermatrix = matrix || new _matrix__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrix"](this._shape);

        /** @type {MatrixOperation} copy operation, used in compiled mode */
        this._copy = new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationCopy"](this._shape);

        // validate
        if(matrix != null)
            SpeedyMatrixExpr._assertSameShape(this._shape, matrix.shape);
    }

    /**
     * Read the entries of this matrix
     * Results are given in column-major format
     * @returns {SpeedyPromise<number[]>}
     */
    read()
    {
        // this is an elementary expression, so we've got the data
        return this._usermatrix.read().turbocharge();
    }

    /**
     * Get the matrix associated with this lvalue expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._usermatrix;
    }

    /**
     * Evaluate this lvalue
     * @returns {SpeedyPromise<SpeedyMatrixLvalueExpr>}
     */
    _evaluateLvalue()
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_5__["SpeedyPromise"].resolve(this);
    }

    /**
     * Assign a matrix
     * @param {SpeedyMatrix} matrix
     * @returns {SpeedyPromise<void>} resolves as soon as the assignment is done
     */
    _assign(matrix)
    {
        return matrixOperationsQueue.enqueue(
            this._copy,
            this._matrix,
            [ matrix ]
        );
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_5__["SpeedyPromise"].resolve(new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](
            null,
            this._matrix,
            []
        ));
    }

    /**
     * Compile an assignment operation
     * @param {BoundMatrixOperationTree} value
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compileAssignment(value)
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_5__["SpeedyPromise"].resolve(new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](
            this._copy,
            this._matrix,
            [ value ]
        ));
    }
}

/**
 * Extract a read-write block submatrix from a matrix expression
 */
class SpeedyMatrixReadwriteBlockExpr extends SpeedyMatrixLvalueExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixLvalueExpr} expr originating matrix expression
     * @param {number} firstRow indexed by 0
     * @param {number} lastRow
     * @param {number} firstColumn
     * @param {number} lastColumn
     */
    constructor(expr, firstRow, lastRow, firstColumn, lastColumn)
    {
        super(new _matrix_shape__WEBPACK_IMPORTED_MODULE_2__["MatrixShape"](lastRow - firstRow + 1, lastColumn - firstColumn + 1, expr.dtype));

        /** @type {SpeedyMatrixLvalueExpr} originating matrix expression */
        this._expr = expr;

        /** @type {number} index of the top-most row (starts at zero) */
        this._firstRow = firstRow;

        /** @type {number} index of the last row */
        this._lastRow = lastRow;

        /** @type {number} index of the left-most column (starts at zero) */
        this._firstColumn = firstColumn;

        /** @type {number} index of the right-most column */
        this._lastColumn = lastColumn;

        /** @type {?SpeedyMatrix} the matrix associated with this expression */
        this._submatrix = null;

        /** @type {?SpeedyMatrix} used for caching */
        this._cachedMatrix = null;

        /** @type {MatrixOperation} matrix operation */
        this._copy = new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationCopy"](this._shape);
    }

    /**
     * Get the matrix associated with this lvalue expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._submatrix;
    }

    /**
     * Evaluate this lvalue
     * @returns {SpeedyPromise<SpeedyMatrixLvalueExpr>}
     */
    _evaluateLvalue()
    {
        return this._expr._evaluateLvalue().then(result => {
            if(result._matrix !== this._cachedMatrix || this._submatrix === null) {
                this._cachedMatrix = result._matrix;
                return this._cachedMatrix.block(this._firstRow, this._lastRow, this._firstColumn, this._lastColumn);
            }
            return this._submatrix; // we've already extracted the submatrix
        }).then(submatrix => {
            this._submatrix = submatrix;
            return this;
        });
    }

    /**
     * Assign a matrix
     * Since this is a submatrix, we can't just assign pointers.
     * We need to copy the data
     * @param {SpeedyMatrix} matrix
     * @returns {SpeedyPromise<void>} resolves as soon as the assignment is done
     */
    _assign(matrix)
    {
        return matrixOperationsQueue.enqueue(
            this._copy,
            this._matrix,
            [ matrix ]
        );
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._expr._compile().then(node => {
            if(node.outputMatrix !== this._cachedMatrix || this._submatrix === null) {
                this._cachedMatrix = node.outputMatrix;
                return this._cachedMatrix.block(
                    this._firstRow,
                    this._lastRow,
                    this._firstColumn,
                    this._lastColumn
                ).then(submatrix => {
                    this._submatrix = submatrix;
                    return node;
                });
            }
            return node;
        }).then(node =>
            new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](
                null,
                this._matrix,
                [ node ]
            )
        );
    }

    /**
     * Compile an assignment operation
     * @param {BoundMatrixOperationTree} value
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compileAssignment(value)
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_5__["SpeedyPromise"].resolve(new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](
            this._copy,
            this._matrix,
            [ value ]
        ));
    }
}

/**
 * Extract a read-write diagonal from a matrix expression
 */
class SpeedyMatrixReadwriteDiagonalExpr extends SpeedyMatrixLvalueExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixLvalueExpr} expr originating matrix expression
     */
    constructor(expr)
    {
        const diagonalLength = Math.min(expr.rows, expr.columns);
        super(new _matrix_shape__WEBPACK_IMPORTED_MODULE_2__["MatrixShape"](1, diagonalLength, expr.dtype));

        /** @type {SpeedyMatrixLvalueExpr} originating matrix expression */
        this._expr = expr;

        /** @type {?SpeedyMatrix} the matrix associated with this expression */
        this._diagonal = null;

        /** @type {?SpeedyMatrix} used for caching */
        this._cachedMatrix = null;

        /** @type {MatrixOperation} copy operation */
        this._copy = new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationCopy"](this._shape);
    }

    /**
     * Get the matrix associated with this expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._diagonal;
    }

    /**
     * Evaluate this lvalue
     * @returns {SpeedyPromise<SpeedyMatrixLvalueExpr>}
     */
    _evaluateLvalue()
    {
        return this._expr._evaluateLvalue().then(result => {
            if(result._matrix !== this._cachedMatrix || this._diagonal === null) {
                this._cachedMatrix = result._matrix;
                return this._cachedMatrix.diagonal();
            }
            return this._diagonal; // we've already extracted the diagonal
        }).then(diagonal => {
            this._diagonal = diagonal;
            return this;
        });
    }

    /**
     * Assign a matrix
     * Since this is a diagonal, we can't just assign pointers.
     * We need to copy the data
     * @param {SpeedyMatrix} matrix
     * @returns {SpeedyPromise<void>} resolves as soon as the assignment is done
     */
    _assign(matrix)
    {
        return matrixOperationsQueue.enqueue(
            this._copy,
            this._matrix,
            [ matrix ]
        );
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._expr._compile().then(node => {
            if(node.outputMatrix !== this._cachedMatrix || this._diagonal === null) {
                this._cachedMatrix = node.outputMatrix;
                return this._cachedMatrix.diagonal().then(diagonal => {
                    this._diagonal = diagonal;
                    return node;
                });
            }
            return node;
        }).then(node =>
            new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](
                null,
                this._matrix,
                [ node ]
            )
        );
    }

    /**
     * Compile an assignment operation
     * @param {BoundMatrixOperationTree} value
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compileAssignment(value)
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_5__["SpeedyPromise"].resolve(new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](
            this._copy,
            this._matrix,
            [ value ]
        ));
    }
}


// ================================================
// BASIC OPERATIONS
// ================================================

/**
 * Make an expression constant
 */
class SpeedyMatrixConstantExpr extends SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr the expression to be made constant, possibly a lvalue
     */
    constructor(expr)
    {
        super(expr._shape);

        /** @type {SpeedyMatrixExpr} the expression to be made constant, possibly a lvalue */
        this._expr = expr;
    }

    /**
     * Get the matrix associated with this expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._expr._matrix;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._expr._compile();
    }
}

/**
 * Fill the output matrix with a constant value
 */
class SpeedyMatrixFillExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {MatrixShape} shape the shape of the resulting expression
     * @param {number} value will fill the output matrix with this constant value
     */
    constructor(shape, value)
    {
        super(shape);

        /** @type {MatrixOperation} fill operation */
        this._operation = new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationFill"](this._shape, value);
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_5__["SpeedyPromise"].resolve(new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](
            this._operation,
            this._matrix,
            []
        ));
    }
}

/**
 * Tranpose a matrix,
 * e.g., A = B^T
 */
class SpeedyMatrixTransposeExpr extends SpeedyMatrixUnaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr
     */
    constructor(expr)
    {
        // optimize if the input expression is a transposition
        if(expr instanceof SpeedyMatrixTransposeExpr) {
            // A = (A^T)^T
            return expr.child;
        }

        // regular transposition
        super(expr, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationTranspose"](expr._shape));
    }
}

/**
 * Compute the inverse of a matrix,
 * e.g., A = B^(-1)
 */
class SpeedyMatrixInverseExpr extends SpeedyMatrixUnaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr
     */
    constructor(expr)
    {
        if(expr.rows !== expr.columns)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalOperationError"](`Can't compute the inverse of a non-square matrix`);
        if(expr.rows > 3)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["NotSupportedError"](`Currently, only matrices up to 3x3 may be inverted`);

        super(expr, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationInverse"](expr._shape));
    }
}

/**
 * Add two matrix expressions,
 * e.g., A = B + C
 */
class SpeedyMatrixAddExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} leftExpr
     * @param {SpeedyMatrixExpr} rightExpr
     */
    constructor(leftExpr, rightExpr)
    {
        SpeedyMatrixExpr._assertSameShape(leftExpr._shape, rightExpr._shape);
        super(leftExpr, rightExpr, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationAdd"](leftExpr._shape, rightExpr._shape));
    }
}

/**
 * Subtract two matrix expressions,
 * e.g., A = B - C
 */
class SpeedyMatrixSubtractExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} leftExpr
     * @param {SpeedyMatrixExpr} rightExpr
     */
    constructor(leftExpr, rightExpr)
    {
        SpeedyMatrixExpr._assertSameShape(leftExpr._shape, rightExpr._shape);
        super(leftExpr, rightExpr, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationSubtract"](leftExpr._shape, rightExpr._shape));
    }
}

/**
 * Multiply two matrix expressions,
 * e.g., A = B * C
 */
class SpeedyMatrixMultiplyExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} leftExpr
     * @param {SpeedyMatrixExpr} rightExpr
     */
    constructor(leftExpr, rightExpr)
    {
        // optimize if the input expressions are transposed
        const lt = leftExpr instanceof SpeedyMatrixTransposeExpr;
        const rt = rightExpr instanceof SpeedyMatrixTransposeExpr;
        if(lt && rt) {
            // A = (B^T) (C^T) = (C B)^T
            return new SpeedyMatrixTransposeExpr(
                new SpeedyMatrixMultiplyExpr(rightExpr.child, leftExpr.child)
            );
        }
        else if(lt && !rt) {
            // A = (B^T) C
            return new SpeedyMatrixMultiplyLTExpr(leftExpr.child, rightExpr);
        }
        else if(!lt && rt) {
            // A = B (C^T)
            return new SpeedyMatrixMultiplyRTExpr(leftExpr, rightExpr.child);
        }

        // multiply by a column-vector
        if(rightExpr.columns === 1)
            return new SpeedyMatrixMultiplyVecExpr(leftExpr, rightExpr);

        // regular multiplication
        if(leftExpr.columns !== rightExpr.rows)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Can't multiply a ${leftExpr.rows} x ${leftExpr.columns} matrix by a ${rightExpr.rows} x ${rightExpr.columns} matrix`);

        super(leftExpr, rightExpr, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationMultiply"](leftExpr._shape, rightExpr._shape));
    }
}

/**
 * Multiply two matrix expressions, transposing the left operand
 * e.g., A = B^T * C
 */
class SpeedyMatrixMultiplyLTExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} leftExpr
     * @param {SpeedyMatrixExpr} rightExpr
     */
    constructor(leftExpr, rightExpr)
    {
        if(leftExpr.rows !== rightExpr.rows)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Can't multiply a ${leftExpr.columns} x ${leftExpr.rows} (transposed) matrix by a ${rightExpr.rows} x ${rightExpr.columns} matrix`);

        super(leftExpr, rightExpr, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationMultiplyLT"](leftExpr._shape, rightExpr._shape));
    }
}

/**
 * Multiply two matrix expressions, transposing the right operand
 * e.g., A = B * C^T
 */
class SpeedyMatrixMultiplyRTExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} leftExpr
     * @param {SpeedyMatrixExpr} rightExpr
     */
    constructor(leftExpr, rightExpr)
    {
        if(leftExpr.columns !== rightExpr.columns)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Can't multiply a ${leftExpr.rows} x ${leftExpr.columns} matrix by a ${rightExpr.columns} x ${rightExpr.rows} (transposed) matrix`);

        super(leftExpr, rightExpr, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationMultiplyRT"](leftExpr._shape, rightExpr._shape));
    }
}

/**
 * Multiply a matrix A by a column-vector x,
 * e.g., y = A x
 */
class SpeedyMatrixMultiplyVecExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} leftExpr
     * @param {SpeedyMatrixExpr} rightExpr
     */
    constructor(leftExpr, rightExpr)
    {
        if(leftExpr.columns !== rightExpr.rows || rightExpr.columns !== 1)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Can't multiply a ${leftExpr.rows} x ${leftExpr.columns} matrix by a ${rightExpr.rows} x ${rightExpr.columns} matrix / column-vector`);

        super(leftExpr, rightExpr, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationMultiplyVec"](leftExpr._shape, rightExpr._shape));
    }
}

/**
 * Multiply a matrix expression by a number,
 * e.g., A = alpha B
 */
class SpeedyMatrixScaleExpr extends SpeedyMatrixUnaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr input expression
     * @param {number} scalar
     */
    constructor(expr, scalar)
    {
        super(expr, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationScale"](expr._shape, scalar));
    }
}

/**
 * Component-wise multiplication of two matrix expressions
 */
class SpeedyMatrixCompMultExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} leftExpr
     * @param {SpeedyMatrixExpr} rightExpr
     */
    constructor(leftExpr, rightExpr)
    {
        SpeedyMatrixExpr._assertSameShape(leftExpr._shape, rightExpr._shape);
        super(leftExpr, rightExpr, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationCompMult"](leftExpr._shape, rightExpr._shape));
    }
}

/**
 * QR decomposition
 */
class SpeedyMatrixQRExpr extends SpeedyMatrixUnaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr
     * @param {string} mode 'full' | 'reduced'
     */
    constructor(expr, mode)
    {
        if(expr.rows < expr.columns)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Can't compute the QR decomposition of a ${expr.rows} x ${expr.columns} matrix`);

        super(expr, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationQR"](expr._shape, mode));
    }
}

/**
 * map() expression
 */
class SpeedyMatrixMapExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} inputMatrix input data
     * @param {SpeedyMatrixExpr} mapfn mapping function
     * @param {SpeedyMatrix} bi input to the mapping function - it has the shape of a block of the input matrix
     * @param {SpeedyMatrix} index input to the mapping function - 1x1 index (0, 1, 2, 3, ... numBlocks-1)
     */
    constructor(inputMatrix, mapfn, bi, index)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(bi.shape.rows === inputMatrix.rows && inputMatrix.columns % bi.shape.columns === 0);
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(inputMatrix.dtype === mapfn.dtype);
        const numBlocks = inputMatrix.columns / bi.shape.columns;
        const outputShape = new _matrix_shape__WEBPACK_IMPORTED_MODULE_2__["MatrixShape"](mapfn.rows, mapfn.columns * numBlocks, mapfn.dtype);
        super(outputShape);

        /** @type {SpeedyMatrixExpr} input data */
        this._inputMatrix = inputMatrix;

        /** @type {SpeedyMatrixExpr} mapping function to be applied to each block */
        this._mapfn = mapfn;

        /** @type {SpeedyMatrix} input to the mapping function - a block of the input matrix */
        this._bi = bi;

        /** @type {SpeedyMatrix} 1x1 index (0 represents the left-most block, 1 the block next to it, and so on) */
        this._index = index;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._inputMatrix._compile().then(inputMatrix =>
            this._mapfn._compile().then(mapfn =>
                new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](
                    new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationMap"](this._shape),
                    this._matrix, [
                        inputMatrix,
                        new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](null, mapfn.outputMatrix),
                        new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](null, this._bi),
                        new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](null, this._index)
                    ], [
                        ['mapfn', mapfn]
                    ]
                )
            )
        );
    }
}

/**
 * reduce() expression
 */
class SpeedyMatrixReduceExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} inputMatrix input data
     * @param {SpeedyMatrixExpr} reducefn reduce expression
     * @param {SpeedyMatrix} accumulator partial output of reduce()
     * @param {SpeedyMatrix} bi a block of the input matrix
     * @param {SpeedyMatrix} index 1x1 matrix
     * @param {SpeedyMatrixExpr} initialMatrix initial value to be used as the accumulator
     */
    constructor(inputMatrix, reducefn, accumulator, bi, index, initialMatrix)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(bi.shape.rows === inputMatrix.rows && inputMatrix.columns % bi.shape.columns === 0);
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(inputMatrix.dtype === reducefn.dtype);
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(reducefn._shape.equals(initialMatrix._shape));
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(reducefn._shape.equals(accumulator.shape));
        super(reducefn._shape);

        /** @type {SpeedyMatrixExpr} input data */
        this._inputMatrix = inputMatrix;

        /** @type {SpeedyMatrixExpr} reduce expression */
        this._reducefn = reducefn;

        /** @type {SpeedyMatrix} input to the reduce function - accumulator matrix */
        this._accumulator = accumulator;

        /** @type {SpeedyMatrix} input to the reduce function - a block of the input matrix */
        this._bi = bi;

        /** @type {SpeedyMatrix} 1x1 index (0 represents the left-most block, 1 the block next to it, and so on) */
        this._index = index;

        /** @type {SpeedyMatrixExpr} initial value to be used as the accumulator */
        this._initialMatrix = initialMatrix;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._inputMatrix._compile().then(inputMatrix =>
            this._initialMatrix._compile().then(initialMatrix =>
                this._reducefn._compile().then(reducefn =>
                    new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](
                        new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationReduce"](this._shape),
                        this._matrix, [
                            inputMatrix,
                            new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](null, reducefn.outputMatrix),
                            new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](null, this._accumulator),
                            new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](null, this._bi),
                            new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](null, this._index),
                            initialMatrix
                        ], [
                            [ 'reducefn', reducefn ]
                        ]
                    )
                )
            )
        );
    }
}

/**
 * sort() expression
 */
class SpeedyMatrixSortExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} inputMatrix data to be sorted
     * @param {SpeedyMatrixExpr} comparator compares bi to bj
     * @param {SpeedyMatrix} bi
     * @param {SpeedyMatrix} bj
     */
    constructor(inputMatrix, comparator, bi, bj)
    {
        super(inputMatrix._shape);
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(bi.shape.equals(bj.shape));
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(bi.rows === inputMatrix.rows && inputMatrix.columns % bi.columns === 0);

        /** @type {SpeedyMatrixExpr} data to be sorted */
        this._inputMatrix = inputMatrix;

        /** @type {SpeedyMatrixExpr} an expression comparing bi to bj */
        this._comparator = comparator;

        /** @type {MatrixShape} shape of the blocks */
        this._blockShape = bi.shape;

        /** @type {SpeedyMatrix} storage for block comparisons */
        this._bi = bi;

        /** @type {SpeedyMatrix} storage for block comparisons */
        this._bj = bj;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._inputMatrix._compile().then(inputMatrix => {
            return this._comparator._compile().then(comparator => {
                return new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](
                    new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationSort"](this._shape, this._blockShape),
                    this._matrix, [
                        inputMatrix,
                        new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](null, comparator.outputMatrix),
                        new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](null, this._bi),
                        new _bound_matrix_operation__WEBPACK_IMPORTED_MODULE_1__["BoundMatrixOperationTree"](null, this._bj),
                    ], [
                        [ 'cmp', comparator ]
                    ]
                );
            });
        });
    }
}



// ==============================================
// GEOMETRIC TRANSFORMATIONS
// ==============================================

/**
 * Compute a homography matrix using 4 correspondences of points
 */
class SpeedyMatrixHomography4pExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} source 2x4 matrix: source points (ui, vi)
     * @param {SpeedyMatrixExpr} destination 2x4 matrix: destination points (xi, vi)
     */
    constructor(source, destination)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(source._shape.rows === 2 && source._shape.columns === 4);
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(source._shape.equals(destination._shape));
        super(source, destination, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationHomography4p"](source._shape, destination._shape));
    }
}

/**
 * Compute a homography matrix using n >= 4 correspondences of points via DLT
 */
class SpeedyMatrixHomographyDLTExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} source 2 x n matrix: source points (ui, vi)
     * @param {SpeedyMatrixExpr} destination 2 x n matrix: destination points (xi, vi)
     */
    constructor(source, destination)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(source._shape.rows === 2 && source._shape.columns >= 4);
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(source._shape.equals(destination._shape));
        super(source, destination, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationHomographyDLT"](source._shape, destination._shape));
    }
}

/**
 * Apply a homography matrix to a set of 2D points
 */
class SpeedyMatrixApplyHomographyExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} hom homography matrix (3x3)
     * @param {SpeedyMatrixExpr} pts set of n 2D points (2xn)
     */
    constructor(hom, pts)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(hom.rows === 3 && hom.columns === 3);
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(pts.rows === 2);
        super(hom, pts, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationApplyHomography"](hom._shape, pts._shape));
    }
}

/**
 * Apply an affine transformation to a set of 2D points
 */
class SpeedyMatrixApplyAffineExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} mat transformation matrix (2x3)
     * @param {SpeedyMatrixExpr} pts set of n 2D points (2xn)
     */
    constructor(mat, pts)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(mat.rows === 2 && mat.columns === 3);
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(pts.rows === 2);
        super(mat, pts, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationApplyAffine"](mat._shape, pts._shape));
    }
}

/**
 * Apply a linear transformation to a set of 2D points
 * (this is basically matrix multiplication)
 */
class SpeedyMatrixApplyLinear2dExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} mat transformation matrix (2x2)
     * @param {SpeedyMatrixExpr} pts set of n 2D points (2xn)
     */
    constructor(mat, pts)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(mat.rows === 2 && mat.columns === 2);
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(pts.rows === 2);
        super(mat, pts, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationApplyLinear2d"](mat._shape, pts._shape));
    }
}

/**
 * Compute a homography matrix using P-RANSAC
 */
class SpeedyMatrixPransacHomographyExpr extends SpeedyMatrixTernaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} source 2 x n matrix: source points (ui, vi), n >= 4
     * @param {SpeedyMatrixExpr} destination 2 x n matrix: destination points (xi, vi)
     * @param {number} numberOfHypotheses positive integer
     * @param {number} bundleSize positive integer
     * @param {number} reprojectionError in pixels
     * @param {SpeedyMatrixLvalueExpr} mask 1 x n output inlier-outlier mask
     */
    constructor(source, destination, numberOfHypotheses, bundleSize, reprojectionError, mask)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(source.rows === 2 && source.columns >= 4);
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(source._shape.equals(destination._shape));
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(mask.rows === 1 && mask.columns === source.columns);
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(mask.dtype === source.dtype);
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(mask instanceof SpeedyMatrixLvalueExpr);
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(numberOfHypotheses > 0 && bundleSize > 0 && reprojectionError >= 0);

        super(source, destination, mask, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationPransacHomography"](
            source._shape, destination._shape,
            numberOfHypotheses, bundleSize,
            reprojectionError, mask._shape
        ));
    }
}





// ==============================================
// INTERNAL UTILITIES
// ==============================================

/**
 * Internal QR solver (Ax = b)
 */
class SpeedyMatrixQRSolverNodeExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} matrixA m x n matrix
     * @param {SpeedyMatrixExpr} vectorB m x 1 vector
     */
    constructor(matrixA, vectorB)
    {
        if(matrixA.rows < matrixA.columns)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Can't compute the QR decomposition of a ${matrixA.rows} x ${matrixA.columns} matrix`);
        else if(vectorB.columns != 1 || vectorB.rows != matrixA.rows)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Expected a ${matrixA.rows} x 1 column-vector, but found a ${vectorB.rows} x ${vectorB.columns} matrix`);

        super(matrixA, vectorB, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationQRSolve"](matrixA._shape, vectorB._shape));
    }
}

/**
 * Back-substitution algorithm
 * (solve Rx = b for x, R is upper-triangular)
 */
class SpeedyMatrixBackSubstitutionNodeExpr extends SpeedyMatrixUnaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} input [b | R] matrix
     */
    constructor(input)
    {
        if(input.columns != input.rows + 1)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Expected a ${input.rows} x ${input.rows + 1} matrix, but found a ${input.rows} x ${input.columns} matrix`);

        super(input, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationBackSubstitution"](input._shape));
    }
}

/**
 * Find best-fit solution x of Ax = b with least-squares method
 * A is m x n, b is m x 1, output x is n x 1
 * (m equations, n unknowns, m >= n)
 */
class SpeedyMatrixLSSolveNodeExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} matrixA m x n matrix
     * @param {SpeedyMatrixExpr} vectorB m x 1 vector
     */
    constructor(matrixA, vectorB)
    {
        const [ m, n ] = [ matrixA.rows, matrixA.columns ];

        if(m < n)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Input matrix has more columns than rows - it's ${m} x ${n}`);
        else if(vectorB.rows != m || vectorB.columns != 1)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Expected a ${m} x 1 column-vector, but found a ${vectorB.rows} x ${vectorB.columns} matrix`);

        super(matrixA, vectorB, new _matrix_operations__WEBPACK_IMPORTED_MODULE_8__["MatrixOperationLSSolve"](matrixA._shape, vectorB._shape));
    }
}

/***/ }),

/***/ "./src/core/math/matrix-operation-header.js":
/*!**************************************************!*\
  !*** ./src/core/math/matrix-operation-header.js ***!
  \**************************************************/
/*! exports provided: MatrixOperationHeader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationHeader", function() { return MatrixOperationHeader; });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrix */ "./src/core/math/matrix.js");
/* harmony import */ var _matrix_shape__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./matrix-shape */ "./src/core/math/matrix-shape.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * matrix-operation-header.js
 * Serializable metadata for matrix operations
 */





/**
 * Serializable metadata related to a matrix operation
 */
class MatrixOperationHeader
{
    /**
     * Constructor
     * @param {string} method method name
     * @param {number} numberOfInputMatrices how many input matrices do we require?
     * @param {MatrixShape} outputShape shape of the output matrix
     * @param {?object} [userData] custom serializable user-data
     */
    constructor(method, numberOfInputMatrices, outputShape, userData = null)
    {
        // ALL FIELDS ARE SERIALIZABLE
        const n = numberOfInputMatrices | 0;
        //Utils.assert(n >= 0);

        /** @type {string} method name */
        this.method = String(method);

        /** @type {MatrixDataType} type of all matrices (input & output) */
        this.dtype = outputShape.dtype;

        /** @type {number} number of rows of the output matrix */
        this.rows = outputShape.rows;

        /** @type {number} number of columns of the output matrix */
        this.columns = outputShape.columns;

        /** @type {number} stride of the output matrix */
        this.stride = 0; // initially unknown

        /** @type {number} byte offset used to recover the data view */
        this.byteOffset = 0; // initially unknown

        /** @type {number} length in bytes used to recover the data view */
        this.length = 0; // initially unknown

        /** @type {number[]} number of rows of the input matrices */
        this.rowsOfInputs = (new Array(n)).fill(0); // to be determined later

        /** @type {number[]} number of columns of the input matrices */
        this.columnsOfInputs = (new Array(n)).fill(0); // to be determined layer

        /** @type {number[]} strides of the input matrices */
        this.strideOfInputs = (new Array(n)).fill(0); // to be determined later - buffer may be locked

        /** @type {number[]} byte offsets used to recover the data view */
        this.byteOffsetOfInputs = (new Array(n)).fill(0); // to be determined later - buffer may be locked

        /** @type {number[]} length in bytes used to recover the data view */
        this.lengthOfInputs = (new Array(n)).fill(0); // to be determined later - buffer may be locked

        /** @type {object} custom serializable user-data */
        this.custom = new Object(userData);
    }

    /**
     * Update fields (stride, byte offset, etc.)
     * before executing an operation
     * @param {SpeedyMatrix} outputMatrix 
     * @param {SpeedyMatrix[]} inputMatrices 
     */
    updateMetadata(outputMatrix, inputMatrices)
    {
        this._updateOutputMetadata(outputMatrix);
        this._updateInputMetadata(inputMatrices);
    }

    /**
     * Update fields related to the output matrix
     * @param {SpeedyMatrix} outputMatrix 
     */
    _updateOutputMetadata(outputMatrix)
    {
        const output = outputMatrix.buffer.data;

        this.stride = outputMatrix.stride;
        this.byteOffset = output.byteOffset;
        this.length = output.length;

        // can't change the shape of the output matrix
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].assert(outputMatrix.rows === this.rows && outputMatrix.columns === this.columns && outputMatrix.dtype === this.dtype);
    }

    /**
     * Update fields related to the input matrices
     * The order of the input matrices shall be preserved
     * @param {SpeedyMatrix[]} inputMatrices 
     */
    _updateInputMetadata(inputMatrices)
    {
        const n = inputMatrices.length;
        const firstIteration = this.rowsOfInputs.length == 0 || this.rowsOfInputs[0] == 0; // short-circuit
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].assert(this.rowsOfInputs.length === n);

        for(let i = 0; i < n; i++) {
            const inputMatrix = inputMatrices[i];
            const input = inputMatrix.buffer.data;

            this.strideOfInputs[i] = inputMatrix.stride;
            this.byteOffsetOfInputs[i] = input.byteOffset;
            this.lengthOfInputs[i] = input.length;

            if(firstIteration) {
                this.rowsOfInputs[i] = inputMatrix.rows;
                this.columnsOfInputs[i] = inputMatrix.columns;
            }
            else {
                // can't change the shape of the input matrices
                _utils_utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].assert(inputMatrix.rows === this.rowsOfInputs[i] && inputMatrix.columns === this.columnsOfInputs[i] && inputMatrix.dtype === this.dtype);
            }
        }
    }
}

/***/ }),

/***/ "./src/core/math/matrix-operations-queue.js":
/*!**************************************************!*\
  !*** ./src/core/math/matrix-operations-queue.js ***!
  \**************************************************/
/*! exports provided: MatrixOperationsQueue */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationsQueue", function() { return MatrixOperationsQueue; });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrix */ "./src/core/math/matrix.js");
/* harmony import */ var _matrix_operations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./matrix-operations */ "./src/core/math/matrix-operations.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * matrix-operations-queue.js
 * Run matrix operations in a FIFO fashion
 */





let instance = null;

/**
 * Used to run matrix operations in a FIFO fashion
 */
class MatrixOperationsQueue
{
    /**
     * Class constructor
     */
    constructor()
    {
        /** @type {Array<Array>} queue of operations */
        this._queue = [];

        /** @type {boolean} whether we have a calculation taking place */
        this._busy = false;

        /** @type {boolean} should we run the operations in a Web Worker? */
        this._useWorker = true;
    }

    /**
     * Get Singleton
     * @returns {MatrixOperationsQueue}
     */
    static get instance()
    {
        return instance || (instance = new MatrixOperationsQueue());
    }

    /**
     * Should we run the operations in a Web Worker?
     * @param {boolean} value
     */
    set useWorker(value)
    {
        this._useWorker = Boolean(value);
    }

    /**
     * Should we run the operations in a Web Worker?
     * @returns {boolean}
     */
    get useWorker()
    {
        return this._useWorker;
    }

    /**
     * Enqueue matrix operation
     * @param {MatrixOperation} matrixOperation 
     * @param {SpeedyMatrix} outputMatrix
     * @param {SpeedyMatrix[]} inputMatrices
     * @returns {SpeedyPromise<void>} a promise that resolves as soon as the operation is complete
     */
    enqueue(matrixOperation, outputMatrix, inputMatrices)
    {
        // enqueue operation
        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__["SpeedyPromise"](resolve => {
            this._queue.push([ matrixOperation, inputMatrices, outputMatrix, resolve ]);
            if(!this._busy) {
                this._busy = true;
                this._resolveAll();
            }
        });
    }

    /**
     * Run all enqueued matrix operations
     */
    _resolveAll()
    {
        // finished the processing?
        if(this._queue.length == 0) {
            this._busy = false;
            return;
        }

        // obtain the next operation
        const [ matrixOperation, inputMatrices, outputMatrix, resolve ] = this._queue.shift();

        // lock matrices
        outputMatrix.lock();
        for(let i = inputMatrices.length - 1; i >= 0; i--)
            inputMatrices[i].lock();

        // run the next operation
        matrixOperation.run(inputMatrices, outputMatrix, this._useWorker).then(() => {
            // unlock matrices
            for(let j = inputMatrices.length - 1; j >= 0; j--)
                inputMatrices[j].unlock();
            outputMatrix.unlock();

            // this operation is done
            resolve();
            this._resolveAll();
        }).turbocharge();

    }
}

/***/ }),

/***/ "./src/core/math/matrix-operations.js":
/*!********************************************!*\
  !*** ./src/core/math/matrix-operations.js ***!
  \********************************************/
/*! exports provided: MatrixOperation, MatrixOperationNop, MatrixOperationFill, MatrixOperationCopy, MatrixOperationTranspose, MatrixOperationInverse, MatrixOperationAdd, MatrixOperationSubtract, MatrixOperationMultiply, MatrixOperationScale, MatrixOperationCompMult, MatrixOperationMultiplyLT, MatrixOperationMultiplyRT, MatrixOperationMultiplyVec, MatrixOperationQR, MatrixOperationQRSolve, MatrixOperationBackSubstitution, MatrixOperationLSSolve, MatrixOperationWithSubroutine, MatrixOperationSequence, MatrixOperationSort, MatrixOperationMap, MatrixOperationReduce, MatrixOperationHomography4p, MatrixOperationHomographyDLT, MatrixOperationApplyHomography, MatrixOperationApplyAffine, MatrixOperationApplyLinear2d, MatrixOperationPransacHomography */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperation", function() { return MatrixOperation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationNop", function() { return MatrixOperationNop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationFill", function() { return MatrixOperationFill; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationCopy", function() { return MatrixOperationCopy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationTranspose", function() { return MatrixOperationTranspose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationInverse", function() { return MatrixOperationInverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationAdd", function() { return MatrixOperationAdd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationSubtract", function() { return MatrixOperationSubtract; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationMultiply", function() { return MatrixOperationMultiply; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationScale", function() { return MatrixOperationScale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationCompMult", function() { return MatrixOperationCompMult; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationMultiplyLT", function() { return MatrixOperationMultiplyLT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationMultiplyRT", function() { return MatrixOperationMultiplyRT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationMultiplyVec", function() { return MatrixOperationMultiplyVec; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationQR", function() { return MatrixOperationQR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationQRSolve", function() { return MatrixOperationQRSolve; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationBackSubstitution", function() { return MatrixOperationBackSubstitution; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationLSSolve", function() { return MatrixOperationLSSolve; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationWithSubroutine", function() { return MatrixOperationWithSubroutine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationSequence", function() { return MatrixOperationSequence; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationSort", function() { return MatrixOperationSort; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationMap", function() { return MatrixOperationMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationReduce", function() { return MatrixOperationReduce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationHomography4p", function() { return MatrixOperationHomography4p; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationHomographyDLT", function() { return MatrixOperationHomographyDLT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationApplyHomography", function() { return MatrixOperationApplyHomography; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationApplyAffine", function() { return MatrixOperationApplyAffine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationApplyLinear2d", function() { return MatrixOperationApplyLinear2d; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixOperationPransacHomography", function() { return MatrixOperationPransacHomography; });
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./matrix */ "./src/core/math/matrix.js");
/* harmony import */ var _matrix_shape__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./matrix-shape */ "./src/core/math/matrix-shape.js");
/* harmony import */ var _matrix_worker__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./matrix-worker */ "./src/core/math/matrix-worker.js");
/* harmony import */ var _matrix_operation_header__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./matrix-operation-header */ "./src/core/math/matrix-operation-header.js");
/* harmony import */ var _linalg_linalg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./linalg/linalg */ "./src/core/math/linalg/linalg.js");
/* harmony import */ var _linalg_linalg__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_linalg_linalg__WEBPACK_IMPORTED_MODULE_7__);
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
 * matrix-operations.js
 * Matrix operations
 */










// Worker
const worker = _matrix_worker__WEBPACK_IMPORTED_MODULE_5__["MatrixWorker"].instance;

/**
 * Abstract matrix operation
 * @abstract
 */
class MatrixOperation
{
    /**
     * (protected) Class constructor
     * @param {string} method method name
     * @param {number} requiredNumberOfInputMatrices how many input matrices do we require?
     * @param {MatrixShape} outputShape shape of the output matrix
     * @param {?object} [userData] custom user-data, serializable
     */
    constructor(method, requiredNumberOfInputMatrices, outputShape, userData = null)
    {
        // is it a valid operation?
        //if(!LinAlg.hasMethod(method))
        //    throw new IllegalArgumentError(`Invalid method: "${method}"`);

        /** @type {MatrixShape} shape of the output matrix */
        this._shape = outputShape;

        /** @type {MatrixOperationHeader} metadata related to the operation */
        this._header = new _matrix_operation_header__WEBPACK_IMPORTED_MODULE_6__["MatrixOperationHeader"](
            method,
            requiredNumberOfInputMatrices,
            outputShape,
            userData
        );
    }

    /**
     * The required number of rows of the output matrix
     * @returns {number}
     */
    get rows()
    {
        return this._shape.rows;
    }

    /**
     * The required number of columns of the output matrix
     * @returns {number}
     */
    get columns()
    {
        return this._shape.columns;
    }

    /**
     * The required type of the output matrix
     * @returns {MatrixDataType}
     */
    get dtype()
    {
        return this._shape.dtype;
    }

    /**
     * The required shape of the output matrix
     * @returns {MatrixShape}
     */
    get shape()
    {
        return this._shape;
    }

    /**
     * The expected number of input matrices
     * @return {number} a non-negative integer
     */
    numberOfInputMatrices()
    {
        return this._header.rowsOfInputs.length;
    }

    /**
     * Run the matrix operation
     * @param {SpeedyMatrix[]} inputMatrices
     * @param {SpeedyMatrix} outputMatrix
     * @param {boolean} [useWorker] should we do the number crunching in a Web Worker?
     * @returns {SpeedyPromise<void>} a promise that resolves as soon as the operation is complete
     */
    run(inputMatrices, outputMatrix, useWorker = true)
    {
        if(useWorker)
            return this._runInWorker(inputMatrices, outputMatrix);
        else
            return this._runLocally(inputMatrices, outputMatrix);
    }

    /**
     * Run the matrix operation in a Web Worker
     * The internal buffers of the input & the output matrices are assumed to be locked
     * @param {SpeedyMatrix[]} inputMatrices
     * @param {SpeedyMatrix} outputMatrix
     * @returns {SpeedyPromise<void>} a promise that resolves as soon as the operation is complete
     */
    _runInWorker(inputMatrices, outputMatrix)
    {
        // do we have a compatible output matrix?
        this._assertCompatibility(outputMatrix.shape);

        // optimization: drop if this is a sequence with no
        // operations, such as a compiled constant expression
        if(inputMatrices.length == 0)
            return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__["SpeedyPromise"].resolve();

        // prepare the operation header
        this._header.updateMetadata(outputMatrix, inputMatrices);
        
        // crunch numbers in a WebWorker
        return worker.run(
            this._header,
            this._arrayBufferOf(outputMatrix),
            this._arrayBuffersOf(inputMatrices)
        ).then(([newOutputBuffer, newInputBuffers]) => {
            // update the internal buffers with the new data
            outputMatrix.buffer.replace(newOutputBuffer);
            for(let i = inputMatrices.length - 1; i >= 0; i--)
                inputMatrices[i].buffer.replace(newInputBuffers[i]);
        });
    }

    /**
     * Run matrix operation in the same thread
     * @param {SpeedyMatrix[]} inputMatrices
     * @param {SpeedyMatrix} outputMatrix
     * @returns {SpeedyPromise<void>} a promise that resolves as soon as the operation is complete
     */
    _runLocally(inputMatrices, outputMatrix)
    {
        // do we have a compatible output matrix?
        this._assertCompatibility(outputMatrix.shape);

        // optimization: drop if this is a sequence with no
        // operations, such as a compiled constant expression
        if(inputMatrices.length == 0)
            return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__["SpeedyPromise"].resolve();

        // prepare the operation header
        this._header.updateMetadata(outputMatrix, inputMatrices);
        
        // crunch numbers locally
        _linalg_linalg__WEBPACK_IMPORTED_MODULE_7__["LinAlg"].lib.execute(
            this._header,
            this._arrayBufferOf(outputMatrix),
            this._arrayBuffersOf(inputMatrices)
        );
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__["SpeedyPromise"].resolve();
    }

    /**
     * Assert matrix size and type
     * @param {MatrixShape} requiredShape will test the shape of the output matrix against requiredShape
     */
    _assertCompatibility(requiredShape)
    {
        if(this._shape.equals(requiredShape))
            return;
        else if(this.dtype !== requiredShape.dtype)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalOperationError"](`Incompatible matrix type: expected "${requiredShape.dtype}", found "${this.dtype}"`);
        else
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalOperationError"](`Invalid matrix size: ${this.rows} x ${this.columns} (expected ${requiredShape.rows} x ${requiredShape.columns})`);
    }

    /**
     * Compute a measure of the workload of an operation
     * @param {SpeedyMatrix[]} matrices all matrices involved
     * @returns {number}
     */
    _computeWorkload(matrices)
    {
        let w = 0;
        for(let i = matrices.length - 1; i >= 0; i--)
            w += matrices[i].rows * matrices[i].columns;

        return w;
    }

    /**
     * Get the internal buffers of the matrices passed as arguments
     * Preserve the relative order of the matrices <-> buffers
     * @param {SpeedyMatrix[]} matrices
     * @return {ArrayBuffer[]}
     */
    _arrayBuffersOf(matrices)
    {
        const buffers = new Array(matrices.length);
        for(let i = buffers.length - 1; i >= 0; i--)
            buffers[i] = matrices[i].buffer.data.buffer;

        return buffers;
        //return matrices.map(this._arrayBufferOf);
    }

    /**
     * Get the internal buffer of the matrix passed as argument
     * @param {SpeedyMatrix} matrix
     * @return {ArrayBuffer}
     */
    _arrayBufferOf(matrix)
    {
        return matrix.buffer.data.buffer;
    }
}

/**
 * No-operation
 */
class MatrixOperationNop extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} shape the shape of the output matrix
     */
    constructor(shape)
    {
        super('nop', 0, shape);
    }
}

/**
 * Fill matrix with a number
 */
class MatrixOperationFill extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} shape the shape of the output matrix
     * @param {number} value the value we'll use to fill the matrix
     */
    constructor(shape, value)
    {
        super('fill', 0, shape, { value: +value });
    }
}

/**
 * Copy matrix
 */
class MatrixOperationCopy extends MatrixOperation
{
    /**
     * Constructor
     * @param {MatrixShape} shape the shape of the input & output matrices
     */
    constructor(shape)
    {
        super('copy', 1, shape);
    }
}

/**
 * Transpose Matrix
 */
class MatrixOperationTranspose extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} shape the shape of the INPUT matrix
     */
    constructor(shape)
    {
        super('transpose', 1, new _matrix_shape__WEBPACK_IMPORTED_MODULE_4__["MatrixShape"](shape.columns, shape.rows, shape.dtype));
    }
}

/**
 * Compute the inverse of a matrix
 */
class MatrixOperationInverse extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} shape the shape of the input matrix
     */
    constructor(shape)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(shape.rows === shape.columns && shape.rows <= 3);
        super('inverse' + String(shape.rows), 1, shape);
    }
}

/**
 * Add two matrices
 * e.g., A + B
 */
class MatrixOperationAdd extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} leftShape shape of the left operand
     * @param {MatrixShape} rightShape shape of the right operand
     */
    constructor(leftShape, rightShape)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(leftShape.equals(rightShape));
        super('add', 2, leftShape);
    }
}

/**
 * Subtract two matrices
 * e.g., A - B
 */
class MatrixOperationSubtract extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} leftShape shape of the left operand
     * @param {MatrixShape} rightShape shape of the right operand
     */
    constructor(leftShape, rightShape)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(leftShape.equals(rightShape));
        super('subtract', 2, leftShape);
    }
}

/**
 * Multiply two matrices
 * e.g., A * B
 */
class MatrixOperationMultiply extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} leftShape shape of the left operand
     * @param {MatrixShape} rightShape shape of the right operand
     */
    constructor(leftShape, rightShape)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(leftShape.columns === rightShape.rows && leftShape.dtype === rightShape.dtype);
        const opt3 = (leftShape.rows === 3 && leftShape.columns === 3 && rightShape.columns === 3);
        const method = opt3 ? 'multiply3' : 'multiply'; // optimize for two 3x3 matrices

        super(method, 2, new _matrix_shape__WEBPACK_IMPORTED_MODULE_4__["MatrixShape"](leftShape.rows, rightShape.columns, leftShape.dtype));
    }
}

/**
 * Multiply by a scalar
 * e.g., alpha * A
 */
class MatrixOperationScale extends MatrixOperation
{
    /**
     * Constructor
     * @param {MatrixShape} shape the shape of the input & output matrices
     * @param {number} scalar
     */
    constructor(shape, scalar)
    {
        super('scale', 1, shape, { scalar: +scalar });
    }
}

/**
 * Component-wise multiplication
 */
class MatrixOperationCompMult extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} leftShape shape of the left operand
     * @param {MatrixShape} rightShape shape of the right operand
     */
    constructor(leftShape, rightShape)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(leftShape.equals(rightShape));
        super('compmult', 2, leftShape);
    }
}

/**
 * Multiply two matrices, transposing the left operand
 * e.g., A^T * B
 */
class MatrixOperationMultiplyLT extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} leftShape shape of the left operand
     * @param {MatrixShape} rightShape shape of the right operand
     */
    constructor(leftShape, rightShape)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(leftShape.rows === rightShape.rows && leftShape.dtype === rightShape.dtype);
        super('multiplylt', 2, new _matrix_shape__WEBPACK_IMPORTED_MODULE_4__["MatrixShape"](leftShape.columns, rightShape.columns, leftShape.dtype));
    }
}

/**
 * Multiply two matrices, transposing the right operand
 * e.g., A * B^T
 */
class MatrixOperationMultiplyRT extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} leftShape shape of the left operand
     * @param {MatrixShape} rightShape shape of the right operand
     */
    constructor(leftShape, rightShape)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(leftShape.columns === rightShape.columns && leftShape.dtype === rightShape.dtype);
        super('multiplyrt', 2, new _matrix_shape__WEBPACK_IMPORTED_MODULE_4__["MatrixShape"](leftShape.rows, rightShape.rows, leftShape.dtype));
    }
}

/**
 * Multiply by a column vector,
 * e.g., y = A x
 */
class MatrixOperationMultiplyVec extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} leftShape shape of the left operand
     * @param {MatrixShape} rightShape shape of the right operand (must be a column-vector)
     */
    constructor(leftShape, rightShape)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(leftShape.columns === rightShape.rows && rightShape.columns === 1 && leftShape.dtype === rightShape.dtype);
        super('multiplyvec', 2, new _matrix_shape__WEBPACK_IMPORTED_MODULE_4__["MatrixShape"](leftShape.rows, 1, leftShape.dtype));
    }
}

/**
 * QR decomposition
 */
class MatrixOperationQR extends MatrixOperation
{
    /**
     * Constructor
     * @param {MatrixShape} shape shape of the input matrix (must satisfy rows >= columns)
     * @param {string} mode 'full' | 'reduced'
     */
    constructor(shape, mode)
    {
        const m = ({ 'full': 'full-qr', 'reduced': 'reduced-qr' })[mode];
        if(m === undefined)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`QR decomposition: unknown mode "${mode}"`)

        //Utils.assert(shape.rows >= shape.columns);
        const columns = m == 'full-qr' ? shape.columns + shape.rows : 2 * shape.columns;
        super('qr', 1, new _matrix_shape__WEBPACK_IMPORTED_MODULE_4__["MatrixShape"](shape.rows, columns, shape.dtype), { mode: m });
    }
}

/**
 * Internal QR solver (Ax = b) produces
 * the matrix [(Q^T)b | R] using reduced QR(*)
 * A is m x n (m >= n), b is m x 1,
 * (Q^T)b is m x 1 and R is m x n
 *
 * (*) The last (m-n) rows of the output matrix
 * will be filled with zeros. Those rows are
 * required by the calculation. You may extract
 * the first n rows
 */
class MatrixOperationQRSolve extends MatrixOperation
{
    /**
     * Constructor
     * @param {MatrixShape} shapeA required shape of the input matrix A
     * @param {MatrixShape} shapeB required shape of the input matrix B (must be a column-vector)
     */
    constructor(shapeA, shapeB)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(shapeA.rows === shapeB.rows && shapeB.columns === 1 && shapeA.dtype === shapeB.dtype);
        super('qr', 2, new _matrix_shape__WEBPACK_IMPORTED_MODULE_4__["MatrixShape"](shapeA.rows, shapeA.columns + 1, shapeA.dtype), { mode: 'reduced-Q\'x' });
    }
}

/**
 * Given an input matrix of the form [b | R]
 * where b is n x 1 and R is an n x n upper
 * triangular matrix, solve Rx = b for x
 */
class MatrixOperationBackSubstitution extends MatrixOperation
{
    /**
     * Constructor
     * @param {MatrixShape} shape shape of the input matrix
     */
    constructor(shape)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(shape.columns === shape.rows + 1);
        super('backsub', 1, new _matrix_shape__WEBPACK_IMPORTED_MODULE_4__["MatrixShape"](shape.rows, 1, shape.dtype));
    }
}

/**
 * Find best-fit solution x of Ax = b with least-squares method
 * A is m x n, b is m x 1, output x is n x 1
 * (m equations, n unknowns, m >= n)
 */
class MatrixOperationLSSolve extends MatrixOperation
{
    /**
     * Constructor
     * @param {MatrixShape} shapeA required shape of the input matrix A
     * @param {MatrixShape} shapeB required shape of the input matrix B (must be a column-vector)
     */
    constructor(shapeA, shapeB)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(shapeA.rows === shapeB.rows && shapeB.columns === 1 && shapeA.dtype === shapeB.dtype);
        super('lssolve', 2, new _matrix_shape__WEBPACK_IMPORTED_MODULE_4__["MatrixShape"](shapeA.columns, 1, shapeA.dtype));
    }
}

/**
 * A matrix operation containing other matrix operations within it
 * @abstract
 */
class MatrixOperationWithSubroutine extends MatrixOperation
{
    /**
     * Constructor
     * @param {string} method method name
     * @param {number} requiredNumberOfInputMatrices how many input matrices do we require?
     * @param {MatrixShape} outputShape shape of the output matrix
     * @param {string[]} [subroutines] names of the subroutines
     * @param {object} [userData] custom user-data, serializable
     */
    constructor(method, requiredNumberOfInputMatrices, outputShape, subroutines, userData = {})
    {
        super(method, requiredNumberOfInputMatrices, outputShape, {
            ...userData,
            subroutine: subroutines.reduce((obj, sub) => Object.assign(obj, { [sub]: [] }), {})
        });
    }

    /**
     * New step of a subroutine
     * @param {MatrixOperation} operation
     * @param {number} indexOfOutputMatrix
     * @param {number[]} indicesOfInputMatrices
     * @returns {StepOfSubroutineOfMatrixOperation}
     */
    static step(operation, indexOfOutputMatrix, indicesOfInputMatrices)
    {
        // The trick is to map the input & output matrices of each step of
        // all subroutines to specific input matrices of the entire operation
        const header = operation._header;

        /** @typedef {object} StepOfSubroutineOfMatrixOperation */
        return { header, indexOfOutputMatrix, indicesOfInputMatrices };
    }

    /**
     * The steps performed by a subroutine, as provided in the constructor
     * @param {string} subname name of the subroutine
     * @return {StepOfSubroutineOfMatrixOperation[]}
     */
    _stepsOf(subname)
    {
        const subroutine = this._header.custom.subroutine;
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(Object.prototype.hasOwnProperty.call(subroutine, subname));
        return subroutine[subname];
    }

    /**
     * Set the steps of a declared subroutine
     * @param {string} subname name of the subroutine
     * @param {StepOfSubroutineOfMatrixOperation[]} steps
     */
    setStepsOf(subname, steps)
    {
        const subroutine = this._header.custom.subroutine;
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(Array.isArray(subroutine[subname]) && subroutine[subname].length == 0);
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(Array.isArray(steps));
        subroutine[subname] = steps;
    }

    /**
     * Adjust the indices of all steps of the subroutine according to a given function
     * @param {Function} newIndexOf maps a matrix to new matrix index
     * @param {SpeedyMatrix[]} mats matrices with original indexing
     */
    adjustIndices(newIndexOf, mats)
    {
        const subroutines = this._header.custom.subroutine;
        //(function adjust(subroutines) {
        for(let sub in subroutines) {
            if(Object.prototype.hasOwnProperty.call(subroutines, sub)) {
                const steps = subroutines[sub];
                for(let i = 0, n = steps.length, step = null; i < n; i++) {
                    step = steps[i];
                    step.indexOfOutputMatrix = newIndexOf(mats[step.indexOfOutputMatrix]);
                    for(let j = step.indicesOfInputMatrices.length - 1; j >= 0; j--)
                        step.indicesOfInputMatrices[j] = newIndexOf(mats[step.indicesOfInputMatrices[j]]);
                    /* // this is a no go when subroutines call other subroutines:
                    if(Object.prototype.hasOwnProperty.call(step.header.custom, 'subroutine'))
                        adjust(step.header.custom.subroutine); */
                }
            }
        }
        //})(this._header.custom.subroutine);
    }
}

/**
 * A sequence of MatrixOperations encapsulated into one
 */
class MatrixOperationSequence extends MatrixOperationWithSubroutine
{
    /**
     * Constructor
     * @param {number} n number of input matrices
     * @param {MatrixShape} shape shape of the output matrix
     * @param {StepOfSubroutineOfMatrixOperation[]} steps steps to be performed, as returned by step() <static>
     */
    constructor(n, shape, steps)
    {
        super('sequence', n, shape, ['sequence']);
        this.setStepsOf('sequence', steps);
    }

    /**
     * The steps performed by this sequence, as provided in the constructor
     * @returns {StepOfSubroutineOfMatrixOperation[]}
     */
    steps()
    {
        return this._stepsOf('sequence');
    }
}

/**
 * Sort blocks of a matrix
 */
class MatrixOperationSort extends MatrixOperationWithSubroutine
{
    /**
     * Constructor
     * @param {MatrixShape} outputShape shape of the output matrix
     */
    constructor(outputShape)
    {
        super('sort', 4, outputShape, ['cmp']);
    }
}

/**
 * Map blocks of a matrix
 */
class MatrixOperationMap extends MatrixOperationWithSubroutine
{
    /**
     * Constructor
     * @param {MatrixShape} outputShape shape of the output matrix
     */
    constructor(outputShape)
    {
        super('map', 4, outputShape, ['mapfn']);
    }
}

/**
 * Reduce blocks of a matrix
 */
class MatrixOperationReduce extends MatrixOperationWithSubroutine
{
    /**
     * Constructor
     * @param {MatrixShape} outputShape shape of the output matrix
     */
    constructor(outputShape)
    {
        super('reduce', 6, outputShape, ['reducefn']);
    }
}

/**
 * Compute a homography matrix using 4 correspondences of points
 */
class MatrixOperationHomography4p extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} srcShape shape of the src operand (must be 2x4)
     * @param {MatrixShape} dstShape shape of the dst operand (must be 2x4)
     */
    constructor(srcShape, dstShape)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(srcShape.equals(dstShape));
        super('homographynorm4p', 2, new _matrix_shape__WEBPACK_IMPORTED_MODULE_4__["MatrixShape"](3, 3, srcShape.dtype));
    }
}

/**
 * Compute a homography matrix using n >= 4 correspondences of points via DLT
 */
class MatrixOperationHomographyDLT extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} srcShape shape of the src operand (must be 2 x n, n >= 4)
     * @param {MatrixShape} dstShape shape of the dst operand (must be 2 x n)
     */
    constructor(srcShape, dstShape)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(srcShape.equals(dstShape));
        super('homographynormdlt', 2, new _matrix_shape__WEBPACK_IMPORTED_MODULE_4__["MatrixShape"](3, 3, srcShape.dtype));
    }
}

/**
 * Apply a homography matrix to a set of 2D points
 */
class MatrixOperationApplyHomography extends MatrixOperation
{
    /**
     * Constructor
     * @param {MatrixShape} homShape shape of the homography matrix (must be 3x3)
     * @param {MatrixShape} ptsShape shape of the matrix of the input points (must be 2xn)
     */
    constructor(homShape, ptsShape)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(ptsShape.dtype === homShape.dtype);
        super('applyHomography', 2, ptsShape);
    }
}

/**
 * Apply an affine transformation to a set of 2D points
 */
class MatrixOperationApplyAffine extends MatrixOperation
{
    /**
     * Constructor
     * @param {MatrixShape} matShape shape of the transformation matrix (must be 2x3)
     * @param {MatrixShape} ptsShape shape of the matrix of the input points (must be 2xn)
     */
    constructor(matShape, ptsShape)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(ptsShape.dtype === matShape.dtype);
        super('applyAffine', 2, ptsShape);
    }
}

/**
 * Apply a linear transformation to a set of 2D points
 */
class MatrixOperationApplyLinear2d extends MatrixOperation
{
    /**
     * Constructor
     * @param {MatrixShape} matShape shape of the transformation matrix (must be 2x2)
     * @param {MatrixShape} ptsShape shape of the matrix of the input points (must be 2xn)
     */
    constructor(matShape, ptsShape)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(ptsShape.dtype === matShape.dtype);
        super('applyLinear2d', 2, ptsShape);
    }
}

/**
 * Compute a homography matrix using P-RANSAC
 */
class MatrixOperationPransacHomography extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} srcShape source coordinates: must be 2 x n (n >= 4)
     * @param {MatrixShape} dstShape destination coordinates: must be 2 x n
     * @param {number} numberOfHypotheses positive integer
     * @param {number} bundleSize positive integer
     * @param {number} reprojectionError in pixels
     * @param {MatrixShape} maskShape inlier-outlier output mask: must be 1 x n
     */
    constructor(srcShape, dstShape, numberOfHypotheses, bundleSize, reprojectionError, maskShape)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(srcShape.equals(dstShape));
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(srcShape.columns === maskShape.columns);
        super('pransacHomography', 3, new _matrix_shape__WEBPACK_IMPORTED_MODULE_4__["MatrixShape"](3, 3, srcShape.dtype), {
            numberOfHypotheses, bundleSize, reprojectionError
        });
    }
}

/***/ }),

/***/ "./src/core/math/matrix-settings.js":
/*!******************************************!*\
  !*** ./src/core/math/matrix-settings.js ***!
  \******************************************/
/*! exports provided: SpeedyMatrixSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMatrixSettings", function() { return SpeedyMatrixSettings; });
/* harmony import */ var _matrix_operations_queue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrix-operations-queue */ "./src/core/math/matrix-operations-queue.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * matrix-settings.js
 * Global settings singleton
 */



let instance = null;

/**
 * Global settings singleton
 */
class SpeedyMatrixSettings
{
    /**
     * Get singleton
     * @returns {SpeedyMatrixSettings}
     */
    static get instance()
    {
        return instance || (instance = new SpeedyMatrixSettings());
    }

    /**
     * Should we run the matrix operations in a Web Worker?
     * @returns {boolean}
     */
    get useWorker()
    {
        return _matrix_operations_queue__WEBPACK_IMPORTED_MODULE_0__["MatrixOperationsQueue"].instance.useWorker;
    }

    /**
     * Should we run the matrix operations in a Web Worker?
     * @param {boolean} value
     */
    set useWorker(value)
    {
        _matrix_operations_queue__WEBPACK_IMPORTED_MODULE_0__["MatrixOperationsQueue"].instance.useWorker = Boolean(value);
    }
}

/***/ }),

/***/ "./src/core/math/matrix-shape.js":
/*!***************************************!*\
  !*** ./src/core/math/matrix-shape.js ***!
  \***************************************/
/*! exports provided: MatrixShape */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixShape", function() { return MatrixShape; });
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _matrix_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./matrix-type */ "./src/core/math/matrix-type.js");
/* harmony import */ var _matrix_type__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_matrix_type__WEBPACK_IMPORTED_MODULE_1__);
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * matrix-shape.js
 * A convenient immutable object that represents the shape of a matrix
 */




/**
 * A convenient immutable object that represents the shape of a matrix
 */
class MatrixShape
{
    /**
     * Constructor
     * @param {number} rows number of rows of the matrix
     * @param {number} columns number of columns of the matrix
     * @param {MatrixDataType} [dtype] data type of the matrix
     */
    constructor(rows, columns, dtype = _matrix_type__WEBPACK_IMPORTED_MODULE_1__["MatrixType"].default)
    {
        /** @type {number} number of rows of the matrix */
        this.rows = rows | 0;

        /** @type {number} number of columns of the matrix */
        this.columns = columns | 0;

        /** @type {MatrixDataType} data type of the matrix */
        this.dtype = String(dtype);

        // validate
        if(!_matrix_type__WEBPACK_IMPORTED_MODULE_1__["MatrixType"].isValid(this.dtype))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Invalid matrix data type: "${this.dtype}"`);
        else if(this.rows < 1 || this.columns < 1)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Invalid matrix size: ${this.rows} x ${this.columns}`);

        // make it immutable
        return Object.freeze(this);
    }

    /**
     * Checks if two shapes are equal
     * @param {MatrixShape} shape
     * @returns {boolean}
     */
    equals(shape)
    {
        return this.rows === shape.rows && this.columns === shape.columns && this.dtype === shape.dtype;
    }

    /**
     * String representation of the matrix shape
     * @returns {string}
     */
    toString()
    {
        return `MatrixShape(rows=${this.rows},cols=${this.columns},dtype="${this.dtype}")`;
    }
}

/***/ }),

/***/ "./src/core/math/matrix-type.js":
/*!**************************************!*\
  !*** ./src/core/math/matrix-type.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * matrix-type.js
 * Data types of matrices
 */

//! No imports here
//! MatrixType is exported to a WebWorker

/**
 * Types of matrices: utilities
 * 
 * Matrices store data of a certain type
 * (e.g., 'float32', 'float64', etc.)
 * 
 * @typedef {string} MatrixDataType
 */
class MatrixType
{
    /**
     * Is the specified matrix data type valid?
     * @param {MatrixDataType} dtype data type
     * @returns {boolean}
     */
    static isValid(dtype)
    {
        return Object.prototype.hasOwnProperty.call(this._classOf, dtype);
    }

    /**
     * Create a TypedArray of the specified type
     * @param {MatrixDataType} dtype data type
     * @param {any[]} args will be passed to the constructor of the TypedArray
     * @returns {ArrayBufferView}
     */
    static createTypedArray(dtype, ...args)
    {
        if(!this.isValid(dtype))
            throw new Error(`Invalid matrix type: "${dtype}"`);

        return Reflect.construct(this._classOf[dtype], args);
    }

    /**
     * Default data type for matrices
     * @returns {MatrixDataType}
     */
    static get default()
    {
        return 'float32';
    }

    /**
     * A mapping between MatrixDataType and
     * corresponding TypedArray constructors
     * @returns {object}
     */
    static get _classOf()
    {
        return this._dataType || (this._dataType = Object.freeze({

            /** 32-bit float */
            'float32': Float32Array,

            /** 64-bit float */
            'float64': Float64Array,

            /** 32-bit signed integer */
            'int32': Int32Array,

            /** 8-bit unsigned integer */
            'uint8': Uint8Array,

        }));
    }

    /**
     * Freeze this class
     * @returns {Function} this class
     */
    static freeze()
    {
        const target = (this._classOf, this);
        return Object.freeze(target);
    }
}

module.exports = { MatrixType: MatrixType.freeze() };

/***/ }),

/***/ "./src/core/math/matrix-worker.js":
/*!****************************************!*\
  !*** ./src/core/math/matrix-worker.js ***!
  \****************************************/
/*! exports provided: MatrixWorker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatrixWorker", function() { return MatrixWorker; });
/* harmony import */ var _linalg_linalg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./linalg/linalg */ "./src/core/math/linalg/linalg.js");
/* harmony import */ var _linalg_linalg__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_linalg_linalg__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _matrix_operation_header__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./matrix-operation-header */ "./src/core/math/matrix-operation-header.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * matrix-worker.js
 * Web Worker bridge
 */






// Constants
const MAX_MESSAGE_ID = 0x7FFFFFFF; // use the form 2^n - 1
const NOP = 'nop'; // no operation

/**
 * A bridge between the main thread and a Web Worker
 * that performs matrix computations
 */
class MatrixWorker
{
    /**
     * Get Singleton
     * @returns {MatrixWorker}
     */
    static get instance()
    {
        return this._instance || (this._instance = new MatrixWorker());
    }

    /**
     * Class constructor
     */
    constructor()
    {
        /** @type {number} message counter */
        this._msgId = 0;

        /** @type {Map<number,Function>} callback table */
        this._callbackTable = new Map();

        /** @type {Worker} WebWorker */
        this._worker = this._createWorker();
    }

    /**
     * Run computation in a Web Worker
     * @param {MatrixOperationHeader} header serializable data
     * @param {ArrayBuffer} outputBuffer data of the output matrix
     * @param {ArrayBuffer[]} inputBuffers data of the input matrices
     * @returns {SpeedyPromise<Array>} resolves as soon as the computation is complete
     */
    run(header, outputBuffer, inputBuffers)
    {
        if(header.method === NOP) // save some time
            return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_3__["SpeedyPromise"].resolve([outputBuffer, inputBuffers]);

        const id = (this._msgId = (this._msgId + 1) & MAX_MESSAGE_ID);
        const transferables = inputBuffers.concat(outputBuffer).filter(
            (x, i, arr) => arr.indexOf(x) === i // remove duplicates
        );
        const msg = { id, header, outputBuffer, inputBuffers, transferables };

        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_3__["SpeedyPromise"](resolve => {
            this._callbackTable.set(id, resolve);
            this._worker.postMessage(msg, transferables);
        });
    }

    /**
     * Create a Web Worker capable of performing Matrix computations
     * @returns {Worker}
     */
    _createWorker()
    {
        // setup the code
        const js = 'self.LinAlg = ' + _linalg_linalg__WEBPACK_IMPORTED_MODULE_0__["LinAlg"].toString() + ';\n' +
                   'self.onmessage = ' + onmessage.toString() + ';';
        const blob = new Blob([ js ], { type: 'application/javascript' });
        //console.log(js);

        // setup the Worker
        const worker = new Worker(URL.createObjectURL(blob));
        worker.onmessage = ev => {
            const msg = ev.data;
            const resolve = this._callbackTable.get(msg.id);
            resolve([msg.outputBuffer, msg.inputBuffers]);
            this._callbackTable.delete(msg.id);
        };
        worker.onerror = ev => {
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`Worker error: ${ev.message}`);
        };

        // done!
        return worker;
    }
}

/**
 * This function runs in the Web Worker
 * @param {MessageEvent} ev
 */
function onmessage(ev)
{
    // extract input
    const { id, header, outputBuffer, inputBuffers, transferables } = ev.data;

    // perform the computation
    self.LinAlg.lib.execute(header, outputBuffer, inputBuffers);

    // send the result of the computation back to the main thread
    const msg = { id, outputBuffer, inputBuffers };
    self.postMessage(msg, transferables);
}

/***/ }),

/***/ "./src/core/math/matrix.js":
/*!*********************************!*\
  !*** ./src/core/math/matrix.js ***!
  \*********************************/
/*! exports provided: SpeedyMatrix */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMatrix", function() { return SpeedyMatrix; });
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _matrix_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./matrix-type */ "./src/core/math/matrix-type.js");
/* harmony import */ var _matrix_type__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_matrix_type__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _matrix_shape__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./matrix-shape */ "./src/core/math/matrix-shape.js");
/* harmony import */ var _matrix_buffer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./matrix-buffer */ "./src/core/math/matrix-buffer.js");
/* harmony import */ var _matrix_operations_queue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./matrix-operations-queue */ "./src/core/math/matrix-operations-queue.js");
/* harmony import */ var _matrix_operations__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./matrix-operations */ "./src/core/math/matrix-operations.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * matrix.js
 * Matrix type
 */











// Constants
const matrixOperationsQueue = _matrix_operations_queue__WEBPACK_IMPORTED_MODULE_4__["MatrixOperationsQueue"].instance;



/**
 * Matrix class
 */
class SpeedyMatrix
{
    /**
     * Class constructor
     * @param {MatrixShape} shape shape of the matrix
     * @param {?number[]} [values] initial values in column-major format
     * @param {number} [stride] custom stride
     * @param {MatrixBuffer} [buffer] custom buffer
     */
    constructor(shape, values = null, stride = shape.rows, buffer = null)
    {
        /** @type {MatrixShape} the shape of the matrix */
        this._shape = shape;

        /** @type {number} the number of entries, in the internal buffer, between the beginning of two columns */
        this._stride = stride | 0;

        /** @type {MatrixBuffer} internal buffer */
        this._buffer = buffer || new _matrix_buffer__WEBPACK_IMPORTED_MODULE_3__["MatrixBuffer"](this.stride * this.columns, values, this.dtype);

        /** @type {MatrixOperationNop} no-op utility, spawned lazily */
        this._nop = null;

        // validate
        if(this.stride < this.rows)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Invalid stride (expected ${this.rows} or greater, found ${this.stride})`);
        else if(Array.isArray(values) && values.length != this.rows * this.columns)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Incorrect number of matrix elements (expected ${this.rows * this.columns}, found ${values.length})`);
    }



    // ====================================
    // MATRIX PROPERTIES
    // ====================================

    /**
     * Number of rows of the matrix
     * @returns {number}
     */
    get rows()
    {
        return this._shape.rows;
    }

    /**
     * Number of columns of the matrix
     * @returns {number}
     */
    get columns()
    {
        return this._shape.columns;
    }

    /**
     * Data type
     * @returns {MatrixDataType}
     */
    get dtype()
    {
        return this._shape.dtype;
    }

    /**
     * The number of entries, in the MatrixBuffer,
     * between the beginning of two columns
     * @returns {number}
     */
    get stride()
    {
        return this._stride;
    }

    /**
     * The shape of the matrix
     * @returns {MatrixShape}
     */
    get shape()
    {
        return this._shape;
    }



    // ====================================
    // READ MATRIX
    // ====================================

    /**
     * Read entries of the matrix. Note that this method is asynchronous.
     * It will read the data as soon as all relevant calculations have been
     * completed. Make sure you await.
     * The entries of the matrix will be returned as a flattened array of
     * numbers in column-major format.
     * @returns {SpeedyPromise<number[]>} a promise that resolves to the requested entries
     */
    read()
    {
        const rows = this.rows, cols = this.columns, stride = this.stride;

        return this.sync().then(() => this._buffer.ready().turbocharge()).then(buffer => {
            const data = buffer.data;
            const n = rows * cols;
            const result = new Array(n);

            // write entries in column-major format
            let i, j, k = 0;
            for(j = 0; j < cols; j++) {
                for(i = 0; i < rows; i++)
                    result[k++] = data[j * stride + i];
            }

            // done!
            return result;
        }).turbocharge();
    }

    /**
     * Print the matrix. Useful for debugging
     * @param {number} [decimals] format numbers to a number of decimals
     * @param {Function} [printFunction] prints a string
     * @returns {SpeedyPromise<void>} a promise that resolves as soon as the matrix is printed
     */
    print(decimals = undefined, printFunction = console.log)
    {
        return this.read().then(data => {
            const rows = this.rows, columns = this.columns;
            const row = new Array(rows);
            let i, j;

            for(i = 0; i < rows; i++) {
                row[i] = new Array(columns);
                for(j = 0; j < columns; j++)
                    row[i][j] = data[j * rows + i];
            }

            const fix = decimals !== undefined ? x => x.toFixed(decimals) : x => x;
            const fmt = row.map(r => '    ' + r.map(fix).join(', ')).join(',\n');
            const str = `SpeedyMatrix(rows=${rows}, cols=${columns}, dtype="${this.dtype}", data=[\n${fmt}\n])`;
            printFunction(str);
        });
    }





    // ====================================
    // ACCESS BY BLOCK
    // ====================================

    /**
     * Create a submatrix using the range [firstRow:lastRow, firstColumn:lastColumn].
     * It will have size (lastRow - firstRow + 1) x (lastColumn - firstColumn + 1).
     * The internal buffer of the matrix will be shared with the submatrix,
     * so if you modify one, you'll modify the other.
     * @param {number} firstRow indexed by 0
     * @param {number} lastRow indexed by 0
     * @param {number} firstColumn indexed by 0
     * @param {number} lastColumn indexed by 0
     * @returns {SpeedyPromise<SpeedyMatrix>}
     */
    block(firstRow, lastRow, firstColumn, lastColumn)
    {
        const rows = this.rows, columns = this.columns;

        // validate range
        if(lastRow < firstRow || lastColumn < firstColumn)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Can't create empty submatrix - invalid range [${firstRow}:${lastRow}, ${firstColumn}:${lastColumn}]`);
        else if(firstRow < 0 || lastRow >= rows || firstColumn < 0 || lastColumn >= columns)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Can't create submatrix - invalid range [${firstRow}:${lastRow}, ${firstColumn}:${lastColumn}] of ${rows} x ${columns} matrix`);

        // compute the dimensions of the new submatrix
        const subRows = lastRow - firstRow + 1;
        const subColumns = lastColumn - firstColumn + 1;
        const subShape = new _matrix_shape__WEBPACK_IMPORTED_MODULE_2__["MatrixShape"](subRows, subColumns, this.dtype);

        // obtain the relevant portion of the data
        const stride = this.stride;
        const begin = firstColumn * stride + firstRow;
        const length = (lastColumn - firstColumn) * stride + subRows;

        // create submatrix
        return this._buffer.createSharedBuffer(begin, length).then(sharedBuffer =>
            new SpeedyMatrix(subShape, undefined, stride, sharedBuffer)
        );
    }

    /**
     * Creates a vector featuring the elements of the main diagonal
     * of the matrix. The internal buffers of the column-vector and of the
     * matrix are shared, so if you change the data in one, you'll change
     * the data in the other.
     * @returns {SpeedyPromise<SpeedyMatrix>}
     */
    diagonal()
    {
        const rows = this.rows, stride = this.stride;
        const diagonalLength = Math.min(rows, this.columns);
        const bufferLength = (diagonalLength - 1) * stride + rows;
        const shape = new _matrix_shape__WEBPACK_IMPORTED_MODULE_2__["MatrixShape"](1, diagonalLength, this.dtype);

        return this._buffer.createSharedBuffer(0, bufferLength).then(sharedBuffer =>
            new SpeedyMatrix(shape, undefined, stride + 1, sharedBuffer)
        );
    }





    // ====================================
    // MATRIX UTILITIES
    // ====================================

    /**
     * Convert to string
     * @returns {string}
     */
    toString()
    {
        return `SpeedyMatrix(rows=${this.rows}, cols=${this.columns}, dtype="${this.dtype}")`;
    }

    /**
     * Locks the internal buffer of this matrix,
     * so it can't be read from nor written to
     */
    lock()
    {
        this._buffer.lock();
    }

    /**
     * Unlocks the internal buffer of this matrix and
     * resolves all pending read/write operations
     */
    unlock()
    {
        this._buffer.unlock();
    }

    /**
     * The internal buffer of this matrix
     * @returns {MatrixBuffer}
     */
    get buffer()
    {
        return this._buffer;
    }

    /**
     * Returns a promise that resolves as soon as all
     * operations submitted UP TO NOW have finished
     * @returns {SpeedyPromise<void>}
     */
    sync()
    {
        this._nop = this._nop || (this._nop = new _matrix_operations__WEBPACK_IMPORTED_MODULE_5__["MatrixOperationNop"](this.shape));
        return matrixOperationsQueue.enqueue(this._nop, this, []);
    }
}

/***/ }),

/***/ "./src/core/math/speedy-point.js":
/*!***************************************!*\
  !*** ./src/core/math/speedy-point.js ***!
  \***************************************/
/*! exports provided: SpeedyPoint2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPoint2", function() { return SpeedyPoint2; });
/* harmony import */ var _speedy_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-vector */ "./src/core/math/speedy-vector.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * speedy-point.js
 * Points in space
 */



/**
 * 2D point
 */
class SpeedyPoint2
{
    /**
     * Create a 2D point
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y)
    {
        /** @type {number} x coordinate */
        this.x = +x;

        /** @type {number} y coordinate */
        this.y = +y;

        // make it immutable
        return Object.freeze(this);
    }



    //
    // ===== METHODS =====
    //

    /**
     * Convert to string
     * @returns {string}
     */
    toString()
    {
        return `SpeedyPoint2(${this.x.toFixed(5)}, ${this.y.toFixed(5)})`;
    }

    /**
     * Add a vector to this point
     * @param {SpeedyVector2} v 
     * @returns {SpeedyPoint2}
     */
    plus(v)
    {
        return new SpeedyPoint2(this.x + v.x, this.y + v.y);
    }

    /**
     * Subtracts a point p from this point
     * @param {SpeedyPoint2} p 
     * @returns {SpeedyVector2}
     */
    minus(p)
    {
        return new _speedy_vector__WEBPACK_IMPORTED_MODULE_0__["SpeedyVector2"](this.x - p.x, this.y - p.y);
    }

    /**
     * Is this point equal to p?
     * @param {SpeedyPoint2} p
     * @returns {boolean}
     */
    equals(p)
    {
        return this.x === p.x && this.y === p.y;
    }
}

/***/ }),

/***/ "./src/core/math/speedy-size.js":
/*!**************************************!*\
  !*** ./src/core/math/speedy-size.js ***!
  \**************************************/
/*! exports provided: SpeedySize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedySize", function() { return SpeedySize; });
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * speedy-size.js
 * Size of a rectangle
 */

/**
 * Size of a rectangle
 */
class SpeedySize
{
    /**
     * Constructor
     * @param {number} width non-negative number
     * @param {number} height non-negative number
     */
    constructor(width, height)
    {
        /** @type {number} width */
        this.width = Math.max(0, +width);

        /** @type {number} height */
        this.height = Math.max(0, +height);

        // make it immutable
        return Object.freeze(this);
    }



    //
    // ===== METHODS =====
    //

    /**
     * Convert to string
     * @returns {string}
     */
    toString()
    {
        return `SpeedySize(${this.width}, ${this.height})`;
    }

    /**
     * Is this size equal to anotherSize?
     * @param {SpeedySize} anotherSize
     * @returns {boolean}
     */
    equals(anotherSize)
    {
        return this.width === anotherSize.width && this.height === anotherSize.height;
    }
}

/***/ }),

/***/ "./src/core/math/speedy-vector.js":
/*!****************************************!*\
  !*** ./src/core/math/speedy-vector.js ***!
  \****************************************/
/*! exports provided: SpeedyVector2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyVector2", function() { return SpeedyVector2; });
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
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
 * speedy-vector.js
 * Vectors
 */



/**
 * 2D vector of floating-point numbers
 */
class SpeedyVector2
{
    /**
     * Create a 2D vector
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y)
    {
        /** @type {number} x coordinate */
        this.x = +x;

        /** @type {number} y coordinate */
        this.y = +y;

        // make it immutable
        return Object.freeze(this);
    }



    //
    // ===== METHODS =====
    //

    /**
     * Convert to string
     * @returns {string}
     */
    toString()
    {
        return `SpeedyVector2(${this.x.toFixed(5)}, ${this.y.toFixed(5)})`;
    }

    /**
     * Is this vector equal to v?
     * @param {SpeedyVector2} v
     * @returns {boolean}
     */
    equals(v)
    {
        return this.x === v.x && this.y === v.y;
    }

    /**
     * Dot product between this vector and another vector
     * @param {SpeedyVector2} v another vector
     * @returns {number}
     */
    dot(v)
    {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * The distance between this vector and another vector
     * @param {SpeedyVector2} v another vector
     * @returns {number}
     */
    distanceTo(v)
    {
        const dx = this.x - v.x;
        const dy = this.y - v.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Euclidean norm
     * @returns {number}
     */
    length()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Returns a normalized version of this vector
     * @returns {SpeedyVector2}
     */
    normalized()
    {
        const len = this.length();

        if(len > 0.0)
            return new SpeedyVector2(this.x / len, this.y / len);
        else
            return new SpeedyVector2(0.0, 0.0);
    }

    /**
     * Returns a copy of this vector translated by offset
     * @param {SpeedyVector2} offset
     * @returns {SpeedyVector2}
     */
    plus(offset)
    {
        return new SpeedyVector2(this.x + offset.x, this.y + offset.y);
    }

    /**
     * Returns a copy of this vector translated by -offset
     * @param {SpeedyVector2} offset
     * @returns {SpeedyVector2}
     */
    minus(offset)
    {
        return new SpeedyVector2(this.x - offset.x, this.y - offset.y);
    }

    /**
     * Returns a copy of this vector scaled by a scalar
     * @param {number} scalar
     * @returns {SpeedyVector2}
     */
    times(scalar)
    {
        return new SpeedyVector2(this.x * scalar, this.y * scalar);
    }
}

/***/ }),

/***/ "./src/core/pipeline/factories/filter-factory.js":
/*!*******************************************************!*\
  !*** ./src/core/pipeline/factories/filter-factory.js ***!
  \*******************************************************/
/*! exports provided: SpeedyPipelineFilterFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineFilterFactory", function() { return SpeedyPipelineFilterFactory; });
/* harmony import */ var _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../speedy-namespace */ "./src/core/speedy-namespace.js");
/* harmony import */ var _nodes_filters_greyscale__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../nodes/filters/greyscale */ "./src/core/pipeline/nodes/filters/greyscale.js");
/* harmony import */ var _nodes_filters_gaussian_blur__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../nodes/filters/gaussian-blur */ "./src/core/pipeline/nodes/filters/gaussian-blur.js");
/* harmony import */ var _nodes_filters_simple_blur__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../nodes/filters/simple-blur */ "./src/core/pipeline/nodes/filters/simple-blur.js");
/* harmony import */ var _nodes_filters_median_blur__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../nodes/filters/median-blur */ "./src/core/pipeline/nodes/filters/median-blur.js");
/* harmony import */ var _nodes_filters_convolution__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../nodes/filters/convolution */ "./src/core/pipeline/nodes/filters/convolution.js");
/* harmony import */ var _nodes_filters_nightvision__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../nodes/filters/nightvision */ "./src/core/pipeline/nodes/filters/nightvision.js");
/* harmony import */ var _nodes_filters_normalize__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../nodes/filters/normalize */ "./src/core/pipeline/nodes/filters/normalize.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * filter-factory.js
 * Image filters
 */










/**
 * Image filters
 */
class SpeedyPipelineFilterFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__["SpeedyNamespace"]
{
    /**
     * Convert image to greyscale
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeGreyscale}
     */
    static Greyscale(name = undefined)
    {
        return new _nodes_filters_greyscale__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineNodeGreyscale"](name);
    }

    /**
     * Gaussian Blur
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeGaussianBlur}
     */
    static GaussianBlur(name = undefined)
    {
        return new _nodes_filters_gaussian_blur__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineNodeGaussianBlur"](name);
    }

    /**
     * Simple Blur (Box Filter)
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeSimpleBlur}
     */
    static SimpleBlur(name = undefined)
    {
        return new _nodes_filters_simple_blur__WEBPACK_IMPORTED_MODULE_3__["SpeedyPipelineNodeSimpleBlur"](name);
    }

    /**
     * Median Blur
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeSimpleBlur}
     */
    static MedianBlur(name = undefined)
    {
        return new _nodes_filters_median_blur__WEBPACK_IMPORTED_MODULE_4__["SpeedyPipelineNodeMedianBlur"](name);
    }

    /**
     * Image Convolution
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeSimpleBlur}
     */
    static Convolution(name = undefined)
    {
        return new _nodes_filters_convolution__WEBPACK_IMPORTED_MODULE_5__["SpeedyPipelineNodeConvolution"](name);
    }

    /**
     * Nightvision
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeSimpleBlur}
     */
    static Nightvision(name = undefined)
    {
        return new _nodes_filters_nightvision__WEBPACK_IMPORTED_MODULE_6__["SpeedyPipelineNodeNightvision"](name);
    }

    /**
     * Normalize image
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeNormalize}
     */
    static Normalize(name = undefined)
    {
        return new _nodes_filters_normalize__WEBPACK_IMPORTED_MODULE_7__["SpeedyPipelineNodeNormalize"](name);
    }
}

/***/ }),

/***/ "./src/core/pipeline/factories/keypoint-factory.js":
/*!*********************************************************!*\
  !*** ./src/core/pipeline/factories/keypoint-factory.js ***!
  \*********************************************************/
/*! exports provided: SpeedyPipelineKeypointFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineKeypointFactory", function() { return SpeedyPipelineKeypointFactory; });
/* harmony import */ var _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../speedy-namespace */ "./src/core/speedy-namespace.js");
/* harmony import */ var _nodes_keypoints_detectors_fast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../nodes/keypoints/detectors/fast */ "./src/core/pipeline/nodes/keypoints/detectors/fast.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * keypoint-factory.js
 * Keypoint-related nodes
 */




/**
 * Keypoint detectors
 */
class SpeedyPipelineKeypointDetectorFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__["SpeedyNamespace"]
{
    /**
     * FAST corner detector
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeFASTKeypointDetector}
     */
    static FAST(name = undefined)
    {
        return new _nodes_keypoints_detectors_fast__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineNodeFASTKeypointDetector"](name);
    }
}

/**
 * Keypoint-related nodes
 */
class SpeedyPipelineKeypointFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__["SpeedyNamespace"]
{
    /**
     * Keypoint detectors
     * @returns {Function}
     */
    static get Detector()
    {
        return SpeedyPipelineKeypointDetectorFactory;
    }
}

/***/ }),

/***/ "./src/core/pipeline/factories/pipeline-factory.js":
/*!*********************************************************!*\
  !*** ./src/core/pipeline/factories/pipeline-factory.js ***!
  \*********************************************************/
/*! exports provided: SpeedyPipelineFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineFactory", function() { return SpeedyPipelineFactory; });
/* harmony import */ var _pipeline__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../pipeline */ "./src/core/pipeline/pipeline.js");
/* harmony import */ var _nodes_pipeline_image_source__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../nodes/pipeline/image-source */ "./src/core/pipeline/nodes/pipeline/image-source.js");
/* harmony import */ var _nodes_pipeline_image_sink__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../nodes/pipeline/image-sink */ "./src/core/pipeline/nodes/pipeline/image-sink.js");
/* harmony import */ var _nodes_pipeline_image_multiplexer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../nodes/pipeline/image-multiplexer */ "./src/core/pipeline/nodes/pipeline/image-multiplexer.js");
/* harmony import */ var _nodes_pipeline_keypoint_sink__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../nodes/pipeline/keypoint-sink */ "./src/core/pipeline/nodes/pipeline/keypoint-sink.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * pipeline-factory.js
 * Pipeline factory
 */







/**
 * Pipeline factory
 */
class SpeedyPipelineFactory extends Function
{
    /**
     * Constructor
     */
    constructor()
    {
        super('return this._create();');
        return this.bind(this);
    }

    /**
     * Create a new pipeline
     * @returns {SpeedyPipeline}
     */
    _create()
    {
        return new _pipeline__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipeline"]();
    }

    /**
     * Create an image source
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageSource}
     */
    ImageSource(name = undefined)
    {
        return new _nodes_pipeline_image_source__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineNodeImageSource"](name);
    }

    /**
     * Create an image sink
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageSink}
     */
    ImageSink(name = 'image')
    {
        return new _nodes_pipeline_image_sink__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineNodeImageSink"](name);
    }

    /**
     * Create an image multiplexer
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageMultiplexer}
     */
    ImageMultiplexer(name = undefined)
    {
        return new _nodes_pipeline_image_multiplexer__WEBPACK_IMPORTED_MODULE_3__["SpeedyPipelineNodeImageMultiplexer"](name);
    }

    /**
     * Creates a sink of keypoints
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeKeypointSink}
     */
    KeypointSink(name = 'keypoints')
    {
        return new _nodes_pipeline_keypoint_sink__WEBPACK_IMPORTED_MODULE_4__["SpeedyPipelineNodeKeypointSink"](name);
    }
}

/***/ }),

/***/ "./src/core/pipeline/factories/transform-factory.js":
/*!**********************************************************!*\
  !*** ./src/core/pipeline/factories/transform-factory.js ***!
  \**********************************************************/
/*! exports provided: SpeedyPipelineTransformFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineTransformFactory", function() { return SpeedyPipelineTransformFactory; });
/* harmony import */ var _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../speedy-namespace */ "./src/core/speedy-namespace.js");
/* harmony import */ var _nodes_transforms_perspective_warp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../nodes/transforms/perspective-warp */ "./src/core/pipeline/nodes/transforms/perspective-warp.js");
/* harmony import */ var _nodes_transforms_resize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../nodes/transforms/resize */ "./src/core/pipeline/nodes/transforms/resize.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * transform-factory.js
 * Image transforms
 */





/**
 * Image transforms
 */
class SpeedyPipelineTransformFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__["SpeedyNamespace"]
{
    /**
     * Resize image
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeNormalize}
     */
    static Resize(name = undefined)
    {
        return new _nodes_transforms_resize__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineNodeResize"](name);
    }

    /**
     * Warp an image using a perspective transformation
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeNormalize}
     */
    static PerspectiveWarp(name = undefined)
    {
        return new _nodes_transforms_perspective_warp__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineNodePerspectiveWarp"](name);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/filters/convolution.js":
/*!********************************************************!*\
  !*** ./src/core/pipeline/nodes/filters/convolution.js ***!
  \********************************************************/
/*! exports provided: SpeedyPipelineNodeConvolution */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeConvolution", function() { return SpeedyPipelineNodeConvolution; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _math_speedy_size__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../math/speedy-size */ "./src/core/math/speedy-size.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _math_matrix__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../math/matrix */ "./src/core/math/matrix.js");
/* harmony import */ var _math_matrix_shape__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../math/matrix-shape */ "./src/core/math/matrix-shape.js");
/* harmony import */ var _math_matrix_expressions__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../math/matrix-expressions */ "./src/core/math/matrix-expressions.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * Image convolution
 */















// 2D convolution programs
const CONVOLUTION = {
    3: 'convolution3',
    5: 'convolution5',
    7: 'convolution7',
};

/**
 * Image convolution
 */
class SpeedyPipelineNodeConvolution extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
        ]);


        /** @type {SpeedyMatrixExpr} convolution kernel (square matrix) */
        this._kernel = _math_matrix_expressions__WEBPACK_IMPORTED_MODULE_12__["SpeedyMatrixExpr"].create(3, 3, [0, 0, 0, 0, 1, 0, 0, 0, 0]); // identity transform
    }

    /**
     * Convolution kernel
     * @returns {SpeedyMatrixExpr}
     */
    get kernel()
    {
        return this._kernel;
    }

    /**
     * Convolution kernel
     * @param {SpeedyMatrixExpr} kernel
     */
    set kernel(kernel)
    {
        if(kernel.rows != kernel.columns)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__["NotSupportedError"](`Use a square kernel`);
        else if(!(kernel.rows == 3 || kernel.rows == 5 || kernel.rows == 7))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__["NotSupportedError"](`Invalid kernel size. Supported sizes: 3x3, 5x5, 7x7`);

        this._kernel = kernel;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = this.input().read();
        const width = image.width, height = image.height;
        const outputTexture = this._outputTexture;
        const ksize = this._kernel.rows;
        const conv = CONVOLUTION[ksize];

        return this._kernel.read().then(kernel => {
            (gpu.programs.filters[conv]
                .outputs(width, height, outputTexture)
            )(image, kernel);

            this.output().swrite(outputTexture, format);
        });
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/filters/gaussian-blur.js":
/*!**********************************************************!*\
  !*** ./src/core/pipeline/nodes/filters/gaussian-blur.js ***!
  \**********************************************************/
/*! exports provided: SpeedyPipelineNodeGaussianBlur */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeGaussianBlur", function() { return SpeedyPipelineNodeGaussianBlur; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _math_speedy_size__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../math/speedy-size */ "./src/core/math/speedy-size.js");
/* harmony import */ var _math_speedy_vector__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../math/speedy-vector */ "./src/core/math/speedy-vector.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * gaussian-blur.js
 * Gaussian Blur
 */













// Default kernels for different sizes: 3x3, 5x5, 7x7... (use sigma_x = sigma_y)
// Heuristics: in order to pick a sigma, we set radius = 2 * sigma. Since
// ksize = 1 + 2 * radius, it follows that sigma = (ksize - 1) / 4. When
// ksize is 3, we set sigma = 1. Therefore, sigma = max(1, (ksize - 1) / 4).
const DEFAULT_KERNEL = {
    3: [ 0.27901008925473514, 0.44197982149052983, 0.27901008925473514 ], // 1D convolution (sigma = 1)
    5: [ 0.06135959781344021, 0.2447701955296099, 0.3877404133138998, 0.2447701955296099, 0.06135959781344021 ], // 1D convolution (separable kernel)
    7: [ 0.03873542500847274, 0.11308485700794121, 0.2150068609928349, 0.26634571398150225, 0.2150068609928349, 0.11308485700794121, 0.03873542500847274 ],
    9: [ 0.028532262603370988, 0.067234535494912, 0.12400932997922749, 0.17904386461741617, 0.20236001461014655, 0.17904386461741617, 0.12400932997922749, 0.067234535494912, 0.028532262603370988 ],
    11:[ 0.022656882730580346, 0.04610857898527292, 0.08012661469398517, 0.11890414969751599, 0.15067709325491124, 0.16305336127546846, 0.15067709325491124, 0.11890414969751599, 0.08012661469398517, 0.04610857898527292, 0.022656882730580346 ],
    13:[ 0.018815730430644363, 0.03447396964662016, 0.05657737457255748, 0.08317258170844948, 0.10952340502389682, 0.12918787500405662, 0.13649812722755, 0.12918787500405662, 0.10952340502389682, 0.08317258170844948, 0.05657737457255748, 0.03447396964662016, 0.018815730430644363 ],
    15:[ 0.016100340991695383, 0.027272329212157102, 0.042598338587449644, 0.06135478775568558, 0.08148767614129326, 0.09979838342934616, 0.11270444144735056, 0.11736740487004466, 0.11270444144735056, 0.09979838342934616, 0.08148767614129326, 0.06135478775568558, 0.042598338587449644, 0.027272329212157102, 0.016100340991695383 ],
    //3: [ 0.25, 0.5, 0.25 ],
    //5: [ 0.05, 0.25, 0.4, 0.25, 0.05 ],
};

// when we set sigma_x = sigma_y = 0, we use the above rule to compute sigma
const DEFAULT_SIGMA = new _math_speedy_vector__WEBPACK_IMPORTED_MODULE_6__["SpeedyVector2"](0,0);

// convolution programs (x-axis)
const CONVOLUTION_X = {
    3: 'convolution3x',
    5: 'convolution5x',
    7: 'convolution7x',
    9: 'convolution9x',
    11: 'convolution11x',
    13: 'convolution13x',
    15: 'convolution15x',
};

// convolution programs (y-axis)
const CONVOLUTION_Y = {
    3: 'convolution3y',
    5: 'convolution5y',
    7: 'convolution7y',
    9: 'convolution9y',
    11: 'convolution11y',
    13: 'convolution13y',
    15: 'convolution15y',
};

/**
 * Gaussian Blur
 */
class SpeedyPipelineNodeGaussianBlur extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
        ]);

        /** @type {SpeedySize} size of the kernel */
        this._kernelSize = new _math_speedy_size__WEBPACK_IMPORTED_MODULE_5__["SpeedySize"](5,5);

        /** @type {SpeedyVector2} sigma of the Gaussian kernel (0 means: use default settings) */
        this._sigma = DEFAULT_SIGMA;

        /** @type {Object.<string,number[]>} convolution kernel */
        this._kernel = {
            x: DEFAULT_KERNEL[this._kernelSize.width],
            y: DEFAULT_KERNEL[this._kernelSize.height]
        };
    }

    /**
     * Size of the kernel
     * @returns {SpeedySize}
     */
    get kernelSize()
    {
        return this._kernelSize;
    }

    /**
     * Size of the kernel
     * @param {SpeedySize} kernelSize
     */
    set kernelSize(kernelSize)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].assert(kernelSize instanceof _math_speedy_size__WEBPACK_IMPORTED_MODULE_5__["SpeedySize"]);

        const kw = kernelSize.width, kh = kernelSize.height;
        if(kw < 3 || kh < 3 || kw > 15 || kh > 15 || kw % 2 == 0 || kh % 2 == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_9__["NotSupportedError"](`Unsupported kernel size: ${kw}x${kh}`);

        this._kernelSize = kernelSize;
        this._updateKernel();
    }

    /**
     * Sigma of the Gaussian kernel
     * @returns {SpeedyVector2}
     */
    get sigma()
    {
        return this._sigma;
    }

    /**
     * Sigma of the Gaussian kernel
     * @param {SpeedyVector2} sigma
     */
    set sigma(sigma)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].assert(sigma instanceof _math_speedy_vector__WEBPACK_IMPORTED_MODULE_6__["SpeedyVector2"], `Sigma must be a SpeedyVector2`);
        _utils_utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].assert(sigma.x >= 0 && sigma.y >= 0);

        this._sigma = sigma;
        this._updateKernel();
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = this.input().read();
        const width = image.width, height = image.height;
        const outputTexture = this._outputTexture;
        const kernX = this._kernel.x;
        const kernY = this._kernel.y;
        const convX = CONVOLUTION_X[this._kernelSize.width];
        const convY = CONVOLUTION_Y[this._kernelSize.height];
        const tex = gpu.texturePool.allocate();

        (gpu.programs.filters[convX]
            .outputs(width, height, tex)
        )(image, kernX);

        (gpu.programs.filters[convY]
            .outputs(width, height, outputTexture)
        )(tex, kernY);

        gpu.texturePool.free(tex);
        this.output().swrite(outputTexture, format);
    }

    /**
     * Update the internal kernel to match
     * sigma and kernelSize
     */
    _updateKernel()
    {
        if(this._sigma.x == DEFAULT_SIGMA.x)
            this._kernel.x = DEFAULT_KERNEL[this._kernelSize.width];
        else
            this._kernel.x = _utils_utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].gaussianKernel(this._sigma.x, this._kernelSize.width, true);

        if(this._sigma.y == DEFAULT_SIGMA.y)
            this._kernel.y = DEFAULT_KERNEL[this._kernelSize.height];
        else
            this._kernel.y = _utils_utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].gaussianKernel(this._sigma.y, this._kernelSize.height, true);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/filters/greyscale.js":
/*!******************************************************!*\
  !*** ./src/core/pipeline/nodes/filters/greyscale.js ***!
  \******************************************************/
/*! exports provided: SpeedyPipelineNodeGreyscale */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeGreyscale", function() { return SpeedyPipelineNodeGreyscale; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * greyscale.js
 * Convert an image to greyscale
 */










/**
 * Convert an image to greyscale
 */
class SpeedyPipelineNodeGreyscale extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
        ]);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image } = this.input().read();
        const width = image.width, height = image.height;
        const outputTexture = this._outputTexture;

        (gpu.programs.colors.rgb2grey
            .outputs(width, height, outputTexture)
        )(image);

        this.output().swrite(outputTexture, _utils_types__WEBPACK_IMPORTED_MODULE_6__["ImageFormat"].GREY);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/filters/median-blur.js":
/*!********************************************************!*\
  !*** ./src/core/pipeline/nodes/filters/median-blur.js ***!
  \********************************************************/
/*! exports provided: SpeedyPipelineNodeMedianBlur */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeMedianBlur", function() { return SpeedyPipelineNodeMedianBlur; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _math_speedy_size__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../math/speedy-size */ "./src/core/math/speedy-size.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * median-blur.js
 * Median Blur
 */












// Median programs
const MEDIAN = {
    3: 'median3',
    5: 'median5',
    7: 'median7',
};

/**
 * Median Blur
 */
class SpeedyPipelineNodeMedianBlur extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image).satisfying(
                msg => msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_7__["ImageFormat"].GREY
            ),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
        ]);

        /** @type {SpeedySize} size of the kernel (assumed to be square) */
        this._kernelSize = new _math_speedy_size__WEBPACK_IMPORTED_MODULE_5__["SpeedySize"](5,5);
    }

    /**
     * Size of the kernel
     * @returns {SpeedySize}
     */
    get kernelSize()
    {
        return this._kernelSize;
    }

    /**
     * Size of the kernel
     * @param {SpeedySize} kernelSize
     */
    set kernelSize(kernelSize)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(kernelSize instanceof _math_speedy_size__WEBPACK_IMPORTED_MODULE_5__["SpeedySize"]);

        const ksize = kernelSize.width;
        if(!(ksize == 3 || ksize == 5 || ksize == 7))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__["NotSupportedError"](`Supported kernel sizes: 3x3, 5x5, 7x7`);
        else if(kernelSize.width != kernelSize.height)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__["NotSupportedError"](`Use a square kernel`);

        this._kernelSize = kernelSize;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = this.input().read();
        const width = image.width, height = image.height;
        const outputTexture = this._outputTexture;
        const ksize = this._kernelSize.width;
        const med = MEDIAN[ksize];

        (gpu.programs.filters[med]
            .outputs(width, height, outputTexture)
        )(image);

        this.output().swrite(outputTexture, format);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/filters/nightvision.js":
/*!********************************************************!*\
  !*** ./src/core/pipeline/nodes/filters/nightvision.js ***!
  \********************************************************/
/*! exports provided: SpeedyPipelineNodeNightvision */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeNightvision", function() { return SpeedyPipelineNodeNightvision; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * nightvision.js
 * Nightvision filter
 */











/**
 * @typedef {"high"|"medium"|"low"} NightvisionQualityLevel
 */

/**
 * Nightvision filter: "see in the dark"
 */
class SpeedyPipelineNodeNightvision extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image).satisfying(
                msg => msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_7__["ImageFormat"].RGBA || msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_7__["ImageFormat"].GREY
            ),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
        ]);

        /** @type {number} a value typically in [0,1]: larger number => higher contrast */
        this._gain = 0.5;

        /** @type {number} a value typically in [0,1]: controls brightness */
        this._offset = 0.5;

        /** @type {number} gain decay, a value in [0,1] */
        this._decay = 0.0;

        /** @type {NightvisionQualityLevel} quality level */
        this._quality = 'medium';
    }

    /**
     * Gain, a value typically in [0,1]: larger number => higher contrast
     * @returns {number}
     */
    get gain()
    {
        return this._gain;
    }

    /**
     * Gain, a value typically in [0,1]: larger number => higher contrast
     * @param {number} gain
     */
    set gain(gain)
    {
        this._gain = +gain;
    }

    /**
     * Offset, a value typically in [0,1] that controls the brightness
     * @returns {number}
     */
    get offset()
    {
        return this._offset;
    }

    /**
     * Offset, a value typically in [0,1] that controls the brightness
     * @param {number} offset
     */
    set offset(offset)
    {
        this._offset = +offset;
    }

    /**
     * Gain decay, a value in [0,1] that controls how the gain decays from the center of the image
     * @returns {number}
     */
    get decay()
    {
        return this._decay;
    }

    /**
     * Gain decay, a value in [0,1] that controls how the gain decays from the center of the image
     * @param {number} decay
     */
    set decay(decay)
    {
        this._decay = Math.max(0.0, Math.min(+decay, 1.0));
    }

    /**
     * Quality level of the filter
     * @returns {NightvisionQualityLevel}
     */
    get quality()
    {
        return this._quality;
    }

    /**
     * Quality level of the filter
     * @param {NightvisionQualityLevel} quality
     */
    set quality(quality)
    {
        if(!(quality == 'high' || quality == 'medium' || quality == 'low'))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_6__["IllegalArgumentError"](`Invalid quality level for the Nightvision filter: "${quality}"`);

        this._quality = String(quality);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = this.input().read();
        const width = image.width, height = image.height;
        const outputTexture = this._outputTexture;
        const gain = this._gain;
        const offset = this._offset;
        const decay = this._decay;
        const quality = this._quality;
        const program = gpu.programs.enhancements;

        // compute illumination map
        const tmp = gpu.texturePool.allocate();
        const illuminationMap = gpu.texturePool.allocate();

        if(quality == 'medium') {
            (program._illuminationMapX
                .outputs(width, height, tmp)
            )(image);

            (program._illuminationMapY
                .outputs(width, height, illuminationMap)
            )(tmp);
        }
        else if(quality == 'high') {
            (program._illuminationMapHiX
                .outputs(width, height, tmp)
            )(image);

            (program._illuminationMapHiY
                .outputs(width, height, illuminationMap)
            )(tmp);
        }
        else if(quality == 'low') {
            (program._illuminationMapLoX
                .outputs(width, height, tmp)
            )(image);

            (program._illuminationMapLoY
                .outputs(width, height, illuminationMap)
            )(tmp);
        }

        // run nightvision
        if(format === _utils_types__WEBPACK_IMPORTED_MODULE_7__["ImageFormat"].GREY) {
            (program._nightvisionGreyscale
                .outputs(width, height, outputTexture)
            )(image, illuminationMap, gain, offset, decay);
        }
        else if(format === _utils_types__WEBPACK_IMPORTED_MODULE_7__["ImageFormat"].RGBA) {
            (program._nightvision
                .outputs(width, height, outputTexture)
            )(image, illuminationMap, gain, offset, decay);
        }

        // done!
        gpu.texturePool.free(illuminationMap);
        gpu.texturePool.free(tmp);
        this.output().swrite(outputTexture, format);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/filters/normalize.js":
/*!******************************************************!*\
  !*** ./src/core/pipeline/nodes/filters/normalize.js ***!
  \******************************************************/
/*! exports provided: SpeedyPipelineNodeNormalize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeNormalize", function() { return SpeedyPipelineNodeNormalize; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * normalize.js
 * Normalize image to a range
 */










/**
 * Normalize image to a range
 */
class SpeedyPipelineNodeNormalize extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image).satisfying(
                msg => msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_6__["ImageFormat"].GREY
            ),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
        ]);

        /** @type {number} a value in [0,255] */
        this._minValue = 0;

        /** @type {number} a value in [0,255] */
        this._maxValue = 255;
    }

    /**
     * Minimum intensity in the output image, a value in [0,255]
     * @returns {number}
     */
    get minValue()
    {
        return this._minValue;
    }

    /**
     * Minimum intensity in the output image, a value in [0,255]
     * @param {number} minValue
     */
    set minValue(minValue)
    {
        this._minValue = Math.max(0, Math.min(+minValue, 255));
    }

    /**
     * Maximum intensity in the output image, a value in [0,255]
     * @returns {number}
     */
    get maxValue()
    {
        return this._maxValue;
    }

    /**
     * Maximum intensity in the output image, a value in [0,255]
     * @param {number} maxValue
     */
    set maxValue(maxValue)
    {
        this._maxValue = Math.max(0, Math.min(+maxValue, 255));
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = this.input().read();
        const width = image.width, height = image.height;
        const outputTexture = this._outputTexture;
        let minValue = this._minValue;
        let maxValue = this._maxValue;

        if(minValue > maxValue)
            minValue = maxValue = (minValue + maxValue) / 2;

        const tex = [
            gpu.texturePool.allocate(),
            gpu.texturePool.allocate(),
            gpu.texturePool.allocate()
        ];

        const minmax = this._scanMinMax(gpu, tex, image, _utils_types__WEBPACK_IMPORTED_MODULE_6__["PixelComponent"].GREEN);

        (gpu.programs.enhancements._normalizeGreyscaleImage
            .outputs(width, height, outputTexture)
        )(minmax, minValue, maxValue);

        gpu.texturePool.free(tex[2]);
        gpu.texturePool.free(tex[1]);
        gpu.texturePool.free(tex[0]);

        this.output().swrite(outputTexture, format);
    }

    /**
     * Scan a single component in all pixels of the image and find the min & max intensities
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture[]} tex temporary textures (3)
     * @param {SpeedyTexture} image input image
     * @param {PixelComponent} pixelComponent a single PixelComponent flag
     * @returns {SpeedyDrawableTexture} RGBA = (max, min, max - min, original_pixel)
     */
    _scanMinMax(gpu, tex, image, pixelComponent)
    {
        const program = gpu.programs.utils;
        const width = image.width, height = image.height;
        const numIterations = Math.ceil(Math.log2(Math.max(width, height))) | 0;

        _utils_utils__WEBPACK_IMPORTED_MODULE_5__["Utils"].assert(tex.length === 3);
        _utils_utils__WEBPACK_IMPORTED_MODULE_5__["Utils"].assert(_utils_types__WEBPACK_IMPORTED_MODULE_6__["ColorComponentId"][pixelComponent] !== undefined);

        program._copyComponents.outputs(width, height, tex[2]);
        program._scanMinMax2D.outputs(width, height, tex[0], tex[1]);
        
        let texture = program._copyComponents(image, image, _utils_types__WEBPACK_IMPORTED_MODULE_6__["PixelComponent"].ALL, _utils_types__WEBPACK_IMPORTED_MODULE_6__["ColorComponentId"][pixelComponent]);
        for(let i = 0; i < numIterations; i++)
            texture = program._scanMinMax2D(texture, i);

        return texture;
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/filters/simple-blur.js":
/*!********************************************************!*\
  !*** ./src/core/pipeline/nodes/filters/simple-blur.js ***!
  \********************************************************/
/*! exports provided: SpeedyPipelineNodeSimpleBlur */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeSimpleBlur", function() { return SpeedyPipelineNodeSimpleBlur; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _math_speedy_size__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../math/speedy-size */ "./src/core/math/speedy-size.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * simple-blur.js
 * Simple Blur (Box Filter)
 */












// 1D convolution filters
const BOX_FILTER = {
    3: (new Array(3)).fill(1/3),
    5: (new Array(5)).fill(1/5),
    7: (new Array(7)).fill(1/7),
    9: (new Array(9)).fill(1/9),
    11: (new Array(11)).fill(1/11),
    13: (new Array(13)).fill(1/13),
    15: (new Array(15)).fill(1/15),
};

// convolution programs (x-axis)
const CONVOLUTION_X = {
    3: 'convolution3x',
    5: 'convolution5x',
    7: 'convolution7x',
    9: 'convolution9x',
    11: 'convolution11x',
    13: 'convolution13x',
    15: 'convolution15x',
};

// convolution programs (y-axis)
const CONVOLUTION_Y = {
    3: 'convolution3y',
    5: 'convolution5y',
    7: 'convolution7y',
    9: 'convolution9y',
    11: 'convolution11y',
    13: 'convolution13y',
    15: 'convolution15y',
};

/**
 * Simple Blur (Box Filter)
 */
class SpeedyPipelineNodeSimpleBlur extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
        ]);

        /** @type {SpeedySize} size of the kernel */
        this._kernelSize = new _math_speedy_size__WEBPACK_IMPORTED_MODULE_5__["SpeedySize"](5,5);

        /** @type {Object.<string,number[]>} convolution kernel */
        this._kernel = {
            x: BOX_FILTER[this._kernelSize.width],
            y: BOX_FILTER[this._kernelSize.height]
        };
    }

    /**
     * Size of the kernel
     * @returns {SpeedySize}
     */
    get kernelSize()
    {
        return this._kernelSize;
    }

    /**
     * Size of the kernel
     * @param {SpeedySize} kernelSize
     */
    set kernelSize(kernelSize)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(kernelSize instanceof _math_speedy_size__WEBPACK_IMPORTED_MODULE_5__["SpeedySize"]);

        const kw = kernelSize.width, kh = kernelSize.height;
        if(kw < 3 || kh < 3 || kw > 15 || kh > 15 || kw % 2 == 0 || kh % 2 == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__["NotSupportedError"](`Unsupported kernel size: ${kw}x${kh}`);

        this._kernelSize = kernelSize;
        this._kernel.x = BOX_FILTER[this._kernelSize.width];
        this._kernel.y = BOX_FILTER[this._kernelSize.height];
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = this.input().read();
        const width = image.width, height = image.height;
        const outputTexture = this._outputTexture;
        const kernX = this._kernel.x;
        const kernY = this._kernel.y;
        const convX = CONVOLUTION_X[this._kernelSize.width];
        const convY = CONVOLUTION_Y[this._kernelSize.height];
        const tex = gpu.texturePool.allocate();

        (gpu.programs.filters[convX]
            .outputs(width, height, tex)
        )(image, kernX);

        (gpu.programs.filters[convY]
            .outputs(width, height, outputTexture)
        )(tex, kernY);

        gpu.texturePool.free(tex);
        this.output().swrite(outputTexture, format);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/detectors/fast.js":
/*!*************************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/detectors/fast.js ***!
  \*************************************************************/
/*! exports provided: SpeedyPipelineNodeFASTKeypointDetector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeFASTKeypointDetector", function() { return SpeedyPipelineNodeFASTKeypointDetector; });
/* harmony import */ var _keypoint_detector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keypoint-detector */ "./src/core/pipeline/nodes/keypoints/detectors/keypoint-detector.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../utils/globals */ "./src/utils/globals.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * FAST corner detector
 */











// Constants
const DEFAULT_THRESHOLD = 20;
const DEFAULT_SCALE_FACTOR = 1.4142135623730951; // sqrt(2)



/**
 * FAST corner detector
 */
class SpeedyPipelineNodeFASTKeypointDetector extends _keypoint_detector__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNodeKeypointDetector"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image).satisfying(
                msg => msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_5__["ImageFormat"].GREY
            ),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Keypoints),
        ]);

        /** @type {number} FAST threshold in [0,255] */
        this._threshold = DEFAULT_THRESHOLD;

        /** @type {number} number of pyramid levels */
        this._levels = 1;

        /** @type {number} scale factor between two pyramid levels */
        this._scaleFactor = DEFAULT_SCALE_FACTOR;
    }

    /**
     * FAST threshold in [0,255]
     * @returns {number}
     */
    get threshold()
    {
        return this._threshold;
    }

    /**
     * FAST threshold in [0,255]
     * @param {number} threshold
     */
    set threshold(threshold)
    {
        this._threshold = Math.max(0, Math.min(threshold | 0, 255));
    }

    /**
     * Number of pyramid levels
     * @returns {number}
     */
    get levels()
    {
        return this._levels;
    }

    /**
     * Number of pyramid levels
     * @param {number} levels
     */
    set levels(levels)
    {
        this._levels = Math.max(1, Math.min(levels | 0, _utils_globals__WEBPACK_IMPORTED_MODULE_8__["PYRAMID_MAX_LEVELS"]));
    }

    /**
     * Scale factor between two pyramid levels
     * @returns {number}
     */
    get scaleFactor()
    {
        return this._scaleFactor;
    }

    /**
     * Scale factor between two pyramid levels
     * @param {number} scaleFactor should be greater than 1
     */
    set scaleFactor(scaleFactor)
    {
        this._scaleFactor = Math.max(1.0, Math.min(+scaleFactor, 2.0));
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const image = this.input().read().image;
        const width = image.width, height = image.height;
        const normalizedThreshold = this._threshold / 255.0;
        const keypoints = gpu.programs.keypoints;

        // allocate textures
        const tex = [
            gpu.texturePool.allocate(),
            gpu.texturePool.allocate(),
        ];

        // FAST (TODO FIXME)
        const corners = (keypoints._fast9
            .outputs(width, height, tex[1])
        )(image, normalizedThreshold);

        const cornersWithScore = (keypoints._fastScore16
            .outputs(width, height, tex[0])
        )(corners, normalizedThreshold);

        // non-maximum suppression
        const suppressedCorners = (keypoints._nonMaxSuppression
            .outputs(width, height, tex[1])
        )(cornersWithScore, 0);

        // convert scores to 8 bit
        const finalCorners = (keypoints.encodeFastScore
            .outputs(width, height, tex[0])
        )(suppressedCorners);

        // encode keypoints
        const encodedKeypoints = this._encodeKeypoints(gpu, finalCorners, this._outputTexture);
        const encoderLength = encodedKeypoints.width;

        // release textures
        gpu.texturePool.free(tex[1]);
        gpu.texturePool.free(tex[0]);

        // done!
        this.output().swrite(encodedKeypoints, 0, 0, encoderLength);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/detectors/keypoint-detector.js":
/*!**************************************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/detectors/keypoint-detector.js ***!
  \**************************************************************************/
/*! exports provided: SpeedyPipelineNodeKeypointDetector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeKeypointDetector", function() { return SpeedyPipelineNodeKeypointDetector; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../utils/globals */ "./src/utils/globals.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * keypoint-detector.js
 * Abstract keypoint detector
 */











// Constants
const ENCODER_PASSES = 8; // number of passes of the keypoint encoder: directly impacts performance
const LONG_SKIP_OFFSET_PASSES = 2; // number of passes of the long skip offsets shader
const MIN_CAPACITY = 16; // minimum number of keypoints we can encode
const MAX_CAPACITY = 8192; // maximum number of keypoints we can encode

/**
 * Abstract keypoint detector
 * @abstract
 */
class SpeedyPipelineNodeKeypointDetector extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = undefined, portBuilders = undefined)
    {
        super(name, portBuilders);

        /** @type {number} encoder capacity */
        this._capacity = MAX_CAPACITY;
    }

    /**
     * We can encode up to this many keypoints. If you find a
     * tight bound for this, download times will be faster.
     * @returns {number}
     */
    get capacity()
    {
        return this._capacity;
    }

    /**
     * We can encode up to this many keypoints. If you find a
     * tight bound for this, download times will be faster.
     * @param {number} capacity
     */
    set capacity(capacity)
    {
        this._capacity = Math.min(Math.max(MIN_CAPACITY, capacity | 0), MAX_CAPACITY);
    }

    /**
     * Create a tiny texture with encoded keypoints out of
     * an encoded corners texture
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} corners input
     * @param {SpeedyDrawableTexture} encodedKeypoints output
     * @returns {SpeedyDrawableTexture} encodedKeypoints
     */
    _encodeKeypoints(gpu, corners, encodedKeypoints)
    {
        const encoders = gpu.programs.encoders;
        const encoderLength = SpeedyPipelineNodeKeypointDetector._encoderLength(this._capacity, 0, 0);
        const width = corners.width, height = corners.height;
        const imageSize = [ width, height ];

        // allocate textures
        const tex = [
            gpu.texturePool.allocate(),
            gpu.texturePool.allocate(),
            gpu.texturePool.allocate(),
        ];

        // prepare programs
        encoders._encodeKeypointSkipOffsets.outputs(width, height, tex[0]);
        encoders._encodeKeypointLongSkipOffsets.outputs(width, height, tex[1], tex[2]);
        encoders._encodeKeypoints.outputs(encoderLength, encoderLength, tex[0], encodedKeypoints);

        // encode skip offsets
        let offsets = encoders._encodeKeypointSkipOffsets(corners, imageSize);
        for(let i = 0; i < LONG_SKIP_OFFSET_PASSES; i++) // to boost performance
            offsets = encoders._encodeKeypointLongSkipOffsets(corners, imageSize);

        /*
        // debug: view corners
        let cornerview = offsets;
        gpu.programs.utils.fillComponents.outputs(width,height,null);
        gpu.programs.utils.identity.outputs(width,height,null);
        cornerview = gpu.programs.utils.fillComponents(cornerview, PixelComponent.GREEN, 0);
        cornerview = gpu.programs.utils.identity(cornerview);
        cornerview = gpu.programs.utils.fillComponents(cornerview, PixelComponent.RED, 0);
        cornerview = gpu.programs.utils.identity(cornerview);
        cornerview = gpu.programs.utils.fillComponents(cornerview, PixelComponent.ALPHA, 1);
        const canvas = gpu.renderToCanvas(cornerview);
        if(!window._ww) document.body.appendChild(canvas);
        window._ww = 1;
        */

        // encode keypoints
        const numPasses = ENCODER_PASSES;
        let encodedKps = encodedKeypoints.resize(encoderLength, encoderLength).clear();
        for(let passId = 0; passId < numPasses; passId++)
            encodedKps = encoders._encodeKeypoints(offsets, encodedKps, imageSize, passId, numPasses, 0, 0, encoderLength);

        // write to encodedKeypoints
        if(encodedKps != encodedKeypoints) // depends on numPasses
            encodedKps.copyTo(encodedKeypoints);

        // release textures
        gpu.texturePool.free(tex[2]);
        gpu.texturePool.free(tex[1]);
        gpu.texturePool.free(tex[0]);

        // done!
        return encodedKeypoints;
    }

    /**
     * Compute the length of the keypoint encoder, given its capacity
     * @param {number} encoderCapacity how many keypoints can we fit?
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     */
    static _encoderLength(encoderCapacity, descriptorSize, extraSize)
    {
        const pixelsPerKeypoint = Math.ceil((_utils_globals__WEBPACK_IMPORTED_MODULE_8__["MIN_KEYPOINT_SIZE"] + descriptorSize + extraSize) / 4);
        const numberOfPixels = encoderCapacity * pixelsPerKeypoint;

        return Math.max(1, Math.ceil(Math.sqrt(numberOfPixels)));
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/pipeline/image-multiplexer.js":
/*!***************************************************************!*\
  !*** ./src/core/pipeline/nodes/pipeline/image-multiplexer.js ***!
  \***************************************************************/
/*! exports provided: SpeedyPipelineNodeImageMultiplexer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeImageMultiplexer", function() { return SpeedyPipelineNodeImageMultiplexer; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _speedy_media__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../speedy-media */ "./src/core/speedy-media.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * image-multiplexer.js
 * Image multiplexer
 */











/**
 * @typedef {0|1} ImageMultiplexerPortNumber
 */

/** @type {string[]} the names of the input ports indexed by their number */
const INPUT_PORT = [ 'in0', 'in1' ];

/**
 * Image multiplexer
 */
class SpeedyPipelineNodeImageMultiplexer extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            ...(INPUT_PORT.map(portName => Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])(portName).expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image))),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
        ]);

        /** @type {ImageMultiplexerPortNumber} which port should be linked to the output? */
        this._port = 0;
    }

    /**
     * The number of the port that should be linked to the output
     * @returns {ImageMultiplexerPortNumber}
     */
    get port()
    {
        return this._port;
    }

    /**
     * The number of the port that should be linked to the output
     * @param {ImageMultiplexerPortNumber} port
     */
    set port(port)
    {
        if(port < 0 || port >= INPUT_PORT.length)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__["IllegalArgumentError"](`Invalid port: ${port}`);

        this._port = port | 0;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const message = this.input(INPUT_PORT[this._port]).read();

        this.output().write(message);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/pipeline/image-sink.js":
/*!********************************************************!*\
  !*** ./src/core/pipeline/nodes/pipeline/image-sink.js ***!
  \********************************************************/
/*! exports provided: SpeedyPipelineNodeImageSink */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeImageSink", function() { return SpeedyPipelineNodeImageSink; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _speedy_media__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../speedy-media */ "./src/core/speedy-media.js");
/* harmony import */ var _speedy_media_source__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../speedy-media-source */ "./src/core/speedy-media-source.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * image-output.js
 * Gets an image out of a pipeline
 */












/**
 * Gets an image out of a pipeline
 */
class SpeedyPipelineNodeImageSink extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineSinkNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image)
        ]);

        /** @type {ImageBitmap} output bitmap */
        this._bitmap = null;

        /** @type {ImageFormat} output format */
        this._format = _utils_types__WEBPACK_IMPORTED_MODULE_8__["ImageFormat"].RGBA;
    }

    /**
     * Export data from this node to the user
     * @returns {SpeedyPromise<any>}
     */
    export()
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].assert(this._bitmap != null);

        return _speedy_media_source__WEBPACK_IMPORTED_MODULE_6__["SpeedyMediaSource"].load(this._bitmap).then(source =>
            new _speedy_media__WEBPACK_IMPORTED_MODULE_5__["SpeedyMedia"](source, { lightweight: 1 /* FIXME */ }) //, this._format ?
        );
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = this.input().read();

        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_9__["SpeedyPromise"](resolve => {
            const canvas = gpu.renderToCanvas(image);
            createImageBitmap(canvas, 0, canvas.height - image.height, image.width, image.height).then(bitmap => {
                this._bitmap = bitmap;
                this._format = format;
                resolve();
            });
        });
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/pipeline/image-source.js":
/*!**********************************************************!*\
  !*** ./src/core/pipeline/nodes/pipeline/image-source.js ***!
  \**********************************************************/
/*! exports provided: SpeedyPipelineNodeImageSource */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeImageSource", function() { return SpeedyPipelineNodeImageSource; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _speedy_media__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../speedy-media */ "./src/core/speedy-media.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * image-input.js
 * Gets an image into a pipeline
 */












/**
 * Gets an image into a pipeline
 */
class SpeedyPipelineNodeImageSource extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineSourceNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image)
        ]);

        /** @type {SpeedyMedia} source media */
        this._media = null;
    }

    /**
     * Source media
     * @returns {SpeedyMedia}
     */
    get media()
    {
        return this._media;
    }

    /**
     * Source media
     * @param {SpeedyMedia} media
     */
    set media(media)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(media instanceof _speedy_media__WEBPACK_IMPORTED_MODULE_5__["SpeedyMedia"]);
        this._media = media;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        gpu.upload(this._media._source, this._outputTexture);

        this.output().swrite(this._outputTexture, _utils_types__WEBPACK_IMPORTED_MODULE_7__["ImageFormat"].RGBA);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/pipeline/keypoint-sink.js":
/*!***********************************************************!*\
  !*** ./src/core/pipeline/nodes/pipeline/keypoint-sink.js ***!
  \***********************************************************/
/*! exports provided: SpeedyPipelineNodeKeypointSink */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeKeypointSink", function() { return SpeedyPipelineNodeKeypointSink; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture_reader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture-reader */ "./src/gpu/speedy-texture-reader.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _speedy_media__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../speedy-media */ "./src/core/speedy-media.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _speedy_keypoint__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../speedy-keypoint */ "./src/core/speedy-keypoint.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../utils/globals */ "./src/utils/globals.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * keypoint-sink.js
 * Gets keypoints out of the pipeline
 */

















/**
 * Gets keypoints out of the pipeline
 */
class SpeedyPipelineNodeKeypointSink extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineSinkNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Keypoints)
        ]);

        /** @type {SpeedyKeypoint[]} keypoints (output) */
        this._keypoints = [];

        /** @type {SpeedyTextureReader} texture reader */
        this._textureReader = new _gpu_speedy_texture_reader__WEBPACK_IMPORTED_MODULE_4__["SpeedyTextureReader"]();
    }

    /**
     * Export data from this node to the user
     * @returns {SpeedyPromise<SpeedyKeypoint[]>}
     */
    export()
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_10__["SpeedyPromise"].resolve(this._keypoints);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = this.input().read();
        const useBufferedDownloads = false; // TODO

        return this._textureReader.readPixelsAsync(encodedKeypoints, useBufferedDownloads).then(pixels => {
            this._keypoints = SpeedyPipelineNodeKeypointSink._decode(pixels, descriptorSize, extraSize, encoderLength);
        });
    }

    /**
     * Decode a sequence of keypoints, given a flattened image of encoded pixels
     * @param {Uint8Array[]} pixels pixels in the [r,g,b,a,...] format
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     * @returns {SpeedyKeypoint[]} keypoints
     */
    static _decode(pixels, descriptorSize, extraSize, encoderLength)
    {
        const pixelsPerKeypoint = Math.ceil((_utils_globals__WEBPACK_IMPORTED_MODULE_12__["MIN_KEYPOINT_SIZE"] + descriptorSize + extraSize) / 4);
        let x, y, lod, rotation, score, flags, extraBytes, descriptorBytes;
        let hasLod, hasRotation;
        const keypoints = [];

        // how many bytes should we read?
        const e = encoderLength;
        const e2 = e * e * pixelsPerKeypoint * 4;
        const size = Math.min(pixels.length, e2);

        // copy the data (we use shared buffers when receiving pixels[])
        if(descriptorSize + extraSize > 0)
            pixels = new Uint8Array(pixels);

        // for each encoded keypoint
        for(let i = 0; i < size; i += 4 /* RGBA */ * pixelsPerKeypoint) {
            // extract fixed-point coordinates
            x = (pixels[i+1] << 8) | pixels[i];
            y = (pixels[i+3] << 8) | pixels[i+2];
            if(x >= 0xFFFF && y >= 0xFFFF) // if end of list
                break;

            // We've cleared the texture to black.
            // Likely to be incorrect black pixels
            // due to resize. Bad for encoderLength
            if(x + y == 0 && pixels[i+6] == 0)
                continue; // discard, it's noise

            // convert from fixed-point
            x /= _utils_globals__WEBPACK_IMPORTED_MODULE_12__["FIX_RESOLUTION"];
            y /= _utils_globals__WEBPACK_IMPORTED_MODULE_12__["FIX_RESOLUTION"];

            // extract flags
            flags = pixels[i+7];

            // extract LOD
            hasLod = (pixels[i+4] < 255);
            lod = !hasLod ? 0.0 :
                -_utils_globals__WEBPACK_IMPORTED_MODULE_12__["LOG2_PYRAMID_MAX_SCALE"] + (_utils_globals__WEBPACK_IMPORTED_MODULE_12__["LOG2_PYRAMID_MAX_SCALE"] + _utils_globals__WEBPACK_IMPORTED_MODULE_12__["PYRAMID_MAX_LEVELS"]) * pixels[i+4] / 255.0;

            // extract orientation
            hasRotation = (flags & _utils_globals__WEBPACK_IMPORTED_MODULE_12__["KPF_ORIENTED"] != 0);
            rotation = !hasRotation ? 0.0 :
                ((2 * pixels[i+5]) / 255.0 - 1.0) * Math.PI;

            // extract score
            score = pixels[i+6] / 255.0;

            // extra bytes
            extraBytes = pixels.subarray(8 + i, 8 + i + extraSize);

            // descriptor bytes
            descriptorBytes = pixels.subarray(8 + i + extraSize, 8 + i + extraSize + descriptorSize);

            // something is off here
            if(descriptorBytes.length < descriptorSize || extraBytes.length < extraSize)
                continue; // discard

            // register keypoint
            keypoints.push(
                new _speedy_keypoint__WEBPACK_IMPORTED_MODULE_11__["SpeedyKeypoint"](x, y, lod, rotation, score, flags, descriptorBytes, extraBytes)
            );
        }

        // done!
        return keypoints;
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/transforms/perspective-warp.js":
/*!****************************************************************!*\
  !*** ./src/core/pipeline/nodes/transforms/perspective-warp.js ***!
  \****************************************************************/
/*! exports provided: SpeedyPipelineNodePerspectiveWarp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodePerspectiveWarp", function() { return SpeedyPipelineNodePerspectiveWarp; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _math_matrix__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../math/matrix */ "./src/core/math/matrix.js");
/* harmony import */ var _math_matrix_shape__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../math/matrix-shape */ "./src/core/math/matrix-shape.js");
/* harmony import */ var _math_matrix_expressions__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../math/matrix-expressions */ "./src/core/math/matrix-expressions.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * perspective-warp.js
 * Warp an image using a perspective transformation
 */














// Used when an invalid matrix is provided
const SINGULAR_MATRIX = [0,0,0,0,0,0,0,0,1];

/**
 * Warp an image using a perspective transformation
 */
class SpeedyPipelineNodePerspectiveWarp extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
        ]);

        /** @type {SpeedyMatrixExpr} perspective transformation */
        this._transform = _math_matrix_expressions__WEBPACK_IMPORTED_MODULE_11__["SpeedyMatrixExpr"].create(3, 3, [1, 0, 0, 0, 1, 0, 0, 0, 1]); // identity matrix
    }

    /**
     * Perspective transform, a 3x3 homography matrix
     * @returns {SpeedyMatrixExpr}
     */
    get transform()
    {
        return this._transform;
    }

    /**
     * Perspective transform, a 3x3 homography matrix
     * @param {SpeedyMatrixExpr} transform
     */
    set transform(transform)
    {
        if(!(transform.rows == 3 && transform.columns == 3))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__["IllegalArgumentError"](`Not a 3x3 transformation matrix: ${transform}`);

        this._transform = transform;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = this.input().read();
        const width = image.width, height = image.height;
        const outputTexture = this._outputTexture;

        return this._transform.read().then(homography => {
            let inverseHomography = this._inverse3(homography);

            if(Number.isNaN(inverseHomography[0]))
                inverseHomography = SINGULAR_MATRIX;

            (gpu.programs.transforms._warpPerspective
                .outputs(width, height, outputTexture)
            )(image, inverseHomography);

            this.output().swrite(outputTexture, format);
        });
    }

    /**
     * Compute the inverse of a 3x3 matrix IN-PLACE (do it fast!)
     * @param {number[]} mat 3x3 matrix in column-major format
     * @param {number} [eps] epsilon
     * @returns {number[]} 3x3 inverse matrix in column-major format
     */
    _inverse3(mat, eps = 1e-6)
    {
        // read the entries of the matrix
        const a11 = mat[0];
        const a21 = mat[1];
        const a31 = mat[2];
        const a12 = mat[3];
        const a22 = mat[4];
        const a32 = mat[5];
        const a13 = mat[6];
        const a23 = mat[7];
        const a33 = mat[8];

        // compute cofactors
        const b1 = a33 * a22 - a32 * a23; // b11
        const b2 = a33 * a12 - a32 * a13; // b21
        const b3 = a23 * a12 - a22 * a13; // b31

        // compute the determinant
        const det = a11 * b1 - a21 * b2 + a31 * b3;

        // set up the inverse
        if(!(Math.abs(det) < eps)) {
            const d = 1.0 / det;
            mat[0] = b1 * d;
            mat[1] = -(a33 * a21 - a31 * a23) * d;
            mat[2] = (a32 * a21 - a31 * a22) * d;
            mat[3] = -b2 * d;
            mat[4] = (a33 * a11 - a31 * a13) * d;
            mat[5] = -(a32 * a11 - a31 * a12) * d;
            mat[6] = b3 * d;
            mat[7] = -(a23 * a11 - a21 * a13) * d;
            mat[8] = (a22 * a11 - a21 * a12) * d;
        }
        else
            mat.fill(Number.NaN, 0, 9);

        // done!
        return mat;
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/transforms/resize.js":
/*!******************************************************!*\
  !*** ./src/core/pipeline/nodes/transforms/resize.js ***!
  \******************************************************/
/*! exports provided: SpeedyPipelineNodeResize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeResize", function() { return SpeedyPipelineNodeResize; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _math_speedy_size__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../math/speedy-size */ "./src/core/math/speedy-size.js");
/* harmony import */ var _math_speedy_vector__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../math/speedy-vector */ "./src/core/math/speedy-vector.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * resize.js
 * Resize image
 */













/**
 * @typedef {"nearest"|"bilinear"} ResizeInterpolationMethod
 */

/**
 * Resize image
 */
class SpeedyPipelineNodeResize extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
        ]);

        /** @type {SpeedySize} size of the output image, in pixels */
        this._size = new _math_speedy_size__WEBPACK_IMPORTED_MODULE_8__["SpeedySize"](0, 0);

        /** @type {SpeedyVector2} size of the output relative to the size of the input */
        this._scale = new _math_speedy_vector__WEBPACK_IMPORTED_MODULE_9__["SpeedyVector2"](1, 1);

        /** @type {ResizeInterpolationMethod} interpolation method */
        this._method = 'bilinear';
    }

    /**
     * Size of the output image, in pixels (use 0 to use scale)
     * @returns {SpeedySize}
     */
    get size()
    {
        return this._size;
    }

    /**
     * Size of the output image, in pixels (use 0 to use scale)
     * @param {SpeedySize} size
     */
    set size(size)
    {
        this._size = size;
    }

    /**
     * Size of the output image relative to the size of the input image
     * @returns {SpeedyVector2}
     */
    get scale()
    {
        return this._scale;
    }

    /**
     * Size of the output image relative to the size of the input image
     * @param {SpeedyVector2} scale
     */
    set scale(scale)
    {
        this._scale = scale;
    }

    /**
     * Interpolation method
     * @returns {ResizeInterpolationMethod}
     */
    get method()
    {
        return this._method;
    }

    /**
     * Interpolation method
     * @param {ResizeInterpolationMethod} method
     */
    set method(method)
    {
        if(method !== 'nearest' && method !== 'bilinear')
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_6__["IllegalArgumentError"](`Invalid method method: "${method}"`);

        this._method = method;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = this.input().read();
        const width = image.width, height = image.height;
        const outputTexture = this._outputTexture;
        const method = this._method;
        const newWidth = this._size.width || Math.max(1, this._scale.x * width);
        const newHeight = this._size.height || Math.max(1, this._scale.y * height);

        if(method == 'bilinear') {
            (gpu.programs.transforms.resizeBI
                .outputs(newWidth, newHeight, outputTexture)
            )(image);
        }
        else if(method == 'nearest') {
            (gpu.programs.transforms.resizeNN
                .outputs(newWidth, newHeight, outputTexture)
            )(image);
        }

        this.output().swrite(outputTexture, format);
    }
}

/***/ }),

/***/ "./src/core/pipeline/pipeline-message.js":
/*!***********************************************!*\
  !*** ./src/core/pipeline/pipeline-message.js ***!
  \***********************************************/
/*! exports provided: SpeedyPipelineMessageType, SpeedyPipelineMessage, SpeedyPipelineMessageWithNothing, SpeedyPipelineMessageWithImage, SpeedyPipelineMessageWithKeypoints */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineMessageType", function() { return SpeedyPipelineMessageType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineMessage", function() { return SpeedyPipelineMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineMessageWithNothing", function() { return SpeedyPipelineMessageWithNothing; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineMessageWithImage", function() { return SpeedyPipelineMessageWithImage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineMessageWithKeypoints", function() { return SpeedyPipelineMessageWithKeypoints; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * pipeline-message.js
 * A message that is shared between nodes of a pipeline
 */






/**
 * Types of messages
 * @enum {number}
 */
const SpeedyPipelineMessageType = Object.freeze({
    Nothing: 0,
    Image: 1,
    Keypoints: 2,
});

/**
 * A message that is shared between nodes of a pipeline
 * @abstract
 */
class SpeedyPipelineMessage
{
    /**
     * Constructor
     * @param {SpeedyPipelineMessageType} type message type
     */
    constructor(type)
    {
        /** @type {SpeedyPipelineMessageType} message type */
        this._type = type;
    }

    /**
     * Message type
     * @returns {SpeedyPipelineMessageType}
     */
    get type()
    {
        return this._type;
    }

    /**
     * Checks if the type of this message is equal to parameter type
     * @param {SpeedyPipelineMessageType} type
     * @returns {boolean}
     */
    hasType(type)
    {
        return this._type === type;
    }

    /**
     * Is this an empty message?
     * @returns {boolean}
     */
    isEmpty()
    {
        return this.hasType(SpeedyPipelineMessageType.Nothing);
    }

    /**
     * Convert to string
     * @returns {string}
     */
    toString()
    {
        const type = Object.keys(SpeedyPipelineMessageType).find(
            type => SpeedyPipelineMessageType[type] === this.type
        );

        return `message of type ${type}`;
    }

    /**
     * Set parameters
     * @param  {...any} args
     * @returns {SpeedyPipelineMessage} this message
     */
    set(...args)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["AbstractMethodError"]();
    }

    /**
     * Create a message of the specified type
     * @param {SpeedyPipelineMessageType} type
     * @returns {SpeedyPipelineMessage}
     */
    static create(type)
    {
        return createMessage(type);
    }
}

/**
 * An empty message carrying nothing
 */
class SpeedyPipelineMessageWithNothing extends SpeedyPipelineMessage
{
    /**
     * Constructor
     */
    constructor()
    {
        super(SpeedyPipelineMessageType.Nothing, null);
    }

    /**
     * Set parameters
     * @returns {SpeedyPipelineMessage} this message
     */
    set()
    {
        return this;
    }
}

/**
 * A message transporting an image
 */
class SpeedyPipelineMessageWithImage extends SpeedyPipelineMessage
{
    /**
     * Constructor
     */
    constructor()
    {
        super(SpeedyPipelineMessageType.Image);

        /** @type {SpeedyTexture} the image we carry */
        this._image = null;

        /** @type {ImageFormat} image format */
        this._format = _utils_types__WEBPACK_IMPORTED_MODULE_1__["ImageFormat"].RGBA;
    }

    /**
     * Set parameters
     * @param {SpeedyTexture} image the image we carry
     * @param {ImageFormat} [format] image format
     * @returns {SpeedyPipelineMessage} this message
     */
    set(image, format = _utils_types__WEBPACK_IMPORTED_MODULE_1__["ImageFormat"].RGBA)
    {
        // set parameters
        this._image = image;
        this._format = format;

        // done!
        return this;
    }

    /**
     * The image we carry
     * @returns {SpeedyTexture}
     */
    get image()
    {
        return this._image;
    }

    /**
     * Image format
     * @returns {ImageFormat}
     */
    get format()
    {
        return this._format;
    }
}

/**
 * A message transporting keypoints
 */
class SpeedyPipelineMessageWithKeypoints extends SpeedyPipelineMessage
{
    /**
     * Constructor
     */
    constructor()
    {
        super(SpeedyPipelineMessageType.Keypoints);

        /** @type {SpeedyDrawableTexture} encoded keypoints */
        this._encodedKeypoints = null;

        /** @type {number} descriptor size in bytes */
        this._descriptorSize = 0;

        /** @type {number} extra size in bytes */
        this._extraSize = 0;

        /** @type {number} encoder length */
        this._encoderLength = 1;
    }

    /**
     * Set parameters
     * @param {SpeedyDrawableTexture} encodedKeypoints encoded keypoints
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength positive integer
     * @returns {SpeedyPipelineMessage} this message
     */
    set(encodedKeypoints, descriptorSize, extraSize, encoderLength)
    {
        // set parameters
        this._encodedKeypoints = encodedKeypoints;
        this._descriptorSize = descriptorSize | 0;
        this._extraSize = extraSize | 0;
        this._encoderLength = encoderLength | 0;

        // validate
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(this._descriptorSize >= 0 && this._extraSize >= 0);
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(this._encoderLength === this._encodedKeypoints.width, 'Invalid encoderLength');
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(this._encodedKeypoints.width === this._encodedKeypoints.height, 'Invalid encodedKeypoints texture');

        // done!
        return this;
    }

    /**
     * Encoded keypoints
     * @returns {SpeedyDrawableTexture}
     */
    get encodedKeypoints()
    {
        return this._encodedKeypoints;
    }

    /**
     * Descriptor size, in bytes
     * @returns {number}
     */
    get descriptorSize()
    {
        return this._descriptorSize;
    }

    /**
     * Extra size, in bytes
     * @returns {number}
     */
    get extraSize()
    {
        return this._extraSize;
    }

    /**
     * Encoder length
     * @returns {number}
     */
    get encoderLength()
    {
        return this._encoderLength;
    }

    /**
     * Do we have keypoint descriptors in this message?
     * @returns {boolean}
     */
    hasDescriptors()
    {
        return this._descriptorSize > 0;
    }

    /**
     * Do we have keypoint matches in this message?
     * @returns {boolean}
     */
    hasMatches()
    {
        // FIXME - find a better solution
        return this._extraSize > 0;
    }
}







//
// Utilities
//



// Map message type to message class
const MESSAGE_CLASS = Object.freeze({
    [SpeedyPipelineMessageType.Nothing]: SpeedyPipelineMessageWithNothing,
    [SpeedyPipelineMessageType.Image]: SpeedyPipelineMessageWithImage,
    [SpeedyPipelineMessageType.Keypoints]: SpeedyPipelineMessageWithKeypoints,
});

/**
 * Create a message of the specified type
 * @param {SpeedyPipelineMessageType} type
 * @returns {SpeedyPipelineMessage}
 */
function createMessage(type)
{
    //return Reflect.construct(MESSAGE_CLASS[type], []);
    return new MESSAGE_CLASS[type];
}

/***/ }),

/***/ "./src/core/pipeline/pipeline-node.js":
/*!********************************************!*\
  !*** ./src/core/pipeline/pipeline-node.js ***!
  \********************************************/
/*! exports provided: SpeedyPipelineNode, SpeedyPipelineSourceNode, SpeedyPipelineSinkNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNode", function() { return SpeedyPipelineNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineSourceNode", function() { return SpeedyPipelineSourceNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineSinkNode", function() { return SpeedyPipelineSinkNode; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _pipeline_port__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pipeline-port */ "./src/core/pipeline/pipeline-port.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * pipeline-node.js
 * Node of a pipeline
 */









/**
 * A PortDictionary is an object with null prototype storing instances of SpeedyPipelinePort
 * @typedef {Object.<string,SpeedyPipelinePort>} PortDictionary
 * @typedef {Object.<string,SpeedyPipelineInputPort>} InputPortDictionary
 * @typedef {Object.<string,SpeedyPipelineOutputPort>} OutputPortDictionary
 */

/**
 * Map an array of ports to a PortDictionary whose keys are their names
 * @param {SpeedyPipelinePort[]} ports
 * @returns {PortDictionary}
 */
const PortDictionary = ports =>
    ports.reduce((dict, port) => ((dict[port.name] = port), dict), Object.create(null));
    //ports.reduce((dict, port) => Object.assign(dict, { [port.name]: port }), Object.create(null));

/**
 * Generate a unique ID
 * @returns {number}
 */
const generateUniqueID = (function() {
    let counter = 0;
    return () => counter++;
})();

/**
 * Generate a random name for a node
 * @returns {string}
 */
const generateRandomName = () =>
    Math.random().toString(16).substr(2);

/**
 * Node of a pipeline
 * @abstract
 */
class SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] the name of this node
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = generateRandomName(), portBuilders = [])
    {
        /** @type {number} the ID of this node (unique) */
        this._id = generateUniqueID(); // node names may be the same...

        /** @type {string} the name of this node */
        this._name = String(name);



        // build the ports
        const ports = portBuilders.map(builder => builder.build(this));

        /** @type {InputPortDictionary} input ports */
        this._inputPorts = PortDictionary(ports.filter(port => port.isInputPort()));

        /** @type {OutputPortDictionary} output ports */
        this._outputPorts = PortDictionary(ports.filter(port => port.isOutputPort()));



        // other properties

        /** @type {SpeedyDrawableTexture[]} output texture(s) */
        this._outputTextures = (new Array(this._outputPorts.length)).fill(null);



        // got a valid name?
        if(this._name.length == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalArgumentError"](`Invalid name "${this._name}" for node ${this.fullName}`);

        // got some ports?
        if(portBuilders.length == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalArgumentError"](`No ports have been found in node ${this.fullName}`);
    }

    /**
     * The name of this node
     * @returns {string}
     */
    get name()
    {
        return this._name;
    }

    /**
     * Name and type of this node
     * @returns {string}
     */
    get fullName()
    {
        return `${this.constructor.name}[${this.name}]`;
    }

    /**
     * The unique ID of this node
     * @returns {number}
     */
    get id()
    {
        return this._id;
    }

    /**
     * Find input port by name
     * @param {string} [portName]
     * @returns {SpeedyPipelineInputPort}
     */
    input(portName = _pipeline_port__WEBPACK_IMPORTED_MODULE_3__["SpeedyPipelineInputPort"].DEFAULT_NAME)
    {
        if(portName in this._inputPorts)
            return this._inputPorts[portName];

        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalArgumentError"](`Can't find input port ${portName} in node ${this.fullName}`);
    }

    /**
     * Find output port by name
     * @param {string} [portName]
     * @returns {SpeedyPipelineOutputPort}
     */
    output(portName = _pipeline_port__WEBPACK_IMPORTED_MODULE_3__["SpeedyPipelineOutputPort"].DEFAULT_NAME)
    {
        if(portName in this._outputPorts)
            return this._outputPorts[portName];

        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalArgumentError"](`Can't find output port ${portName} in node ${this.fullName}`);
    }

    /**
     * Get data from the input ports and execute
     * the task that this node is supposed to!
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    execute(gpu)
    {
        let portName;

        // clear output ports
        for(portName in this._outputPorts)
            this._outputPorts[portName].clearMessage();

        // let the input ports receive what is due
        for(portName in this._inputPorts)
            this._inputPorts[portName].pullMessage(this.fullName);

        // run the task
        const runTask = this._run(gpu);
        if(runTask == undefined) {
            for(portName in this._outputPorts) // ensure that no output ports are empty
                _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(this._outputPorts[portName].hasMessage(), `Did you forget to write data to the output port ${portName} of ${this.fullName}?`);

            return undefined;
        }
        else return runTask.then(() => {
            for(portName in this._outputPorts) // ensure that no output ports are empty
                _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(this._outputPorts[portName].hasMessage(), `Did you forget to write data to the output port ${portName} of ${this.fullName}?`);
        });
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["AbstractMethodError"]();
    }

    /**
     * Is this a source node, i.e., it has no input ports?
     * @returns {boolean}
     */
    isSource()
    {
        return Object.keys(this._inputPorts).length == 0;
    }

    /**
     * Is this a sink node, i.e., it has no output ports?
     * @returns {boolean}
     */
    isSink()
    {
        return Object.keys(this._outputPorts).length == 0;
    }

    /**
     * Clear all ports
     */
    clearPorts()
    {
        let portName;

        for(portName in this._inputPorts)
            this._inputPorts[portName].clearMessage();

        for(portName in this._outputPorts)
            this._outputPorts[portName].clearMessage();
    }

    /**
     * Find all nodes that feed input to this node
     * @returns {SpeedyPipelineNode[]}
     */
    inputNodes()
    {
        const nodes = [];

        for(const portName in this._inputPorts) {
            const port = this._inputPorts[portName];
            if(port.incomingLink != null)
                nodes.push(port.incomingLink.node);
        }

        return nodes;
    }

    /**
     * Set the output texture(s) of this node
     * @param {function(SpeedyDrawableTexture|null): SpeedyDrawableTexture|null} getOutputTexture to be called for each required output texture
     */
    setOutputTextures(getOutputTexture)
    {
        for(let i = 0; i < this._outputTextures.length; i++)
            this._outputTextures[i] = getOutputTexture(this._outputTextures[i]);
    }

    /**
     * Output texture
     * @returns {SpeedyDrawableTexture}
     */
    get _outputTexture()
    {
        // don't use this helper if there are multiple output ports!
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(this._outputTextures.length == 1);
        return this._outputTextures[0];
    }
}

/**
 * Source node (located at the beginning of a pipeline)
 * @abstract
 */
class SpeedyPipelineSourceNode extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] the name of this node
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = undefined, portBuilders = undefined)
    {
        super(name, portBuilders);
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(this.isSource());
    }
}

/**
 * Sink node (located at the end of a pipeline)
 * @abstract
 */
class SpeedyPipelineSinkNode extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] the name of this node
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = undefined, portBuilders = undefined)
    {
        super(name, portBuilders);
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(this.isSink());
    }

    /**
     * Export data from this node to the user
     * @returns {SpeedyPromise<any>}
     */
    export()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["AbstractMethodError"]();
    }
}

/***/ }),

/***/ "./src/core/pipeline/pipeline-port.js":
/*!********************************************!*\
  !*** ./src/core/pipeline/pipeline-port.js ***!
  \********************************************/
/*! exports provided: SpeedyPipelinePort, SpeedyPipelineOutputPort, SpeedyPipelineInputPort */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelinePort", function() { return SpeedyPipelinePort; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineOutputPort", function() { return SpeedyPipelineOutputPort; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineInputPort", function() { return SpeedyPipelineInputPort; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _pipeline_portspec__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pipeline-portspec */ "./src/core/pipeline/pipeline-portspec.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * pipeline-port.js
 * Port of a node of a pipeline
 */







// Constants
const DEFAULT_INPUT_PORT_NAME = 'in';
const DEFAULT_OUTPUT_PORT_NAME = 'out';
const ACCEPTABLE_PORT_NAME = /^[a-z][a-zA-Z0-9]*$/;
const EMPTY_MESSAGE = new _pipeline_message__WEBPACK_IMPORTED_MODULE_3__["SpeedyPipelineMessageWithNothing"]();

/**
 * Port of a node of a pipeline
 * @abstract
 */
class SpeedyPipelinePort
{
    /**
     * Constructor
     * @param {string} name the name of this port 
     * @param {SpeedyPipelinePortSpec} spec port specification
     * @param {SpeedyPipelineNode} node the node to which this port belongs
     */
    constructor(name, spec, node)
    {
        /** @type {string} the name of this port */
        this._name = String(name);

        /** @type {SpeedyPipelinePortSpec} the specification of this port */
        this._spec = spec;

        /** @type {SpeedyPipelineNode} the node to which this port belongs */
        this._node = node;

        /** @type {SpeedyPipelineMessage} the message located in this port */
        this._message = EMPTY_MESSAGE;


        // check if we've got an acceptable port name
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(ACCEPTABLE_PORT_NAME.test(this._name), `Port name "${this._name}" is not acceptable`);
    }

    /**
     * The name of this port
     * @returns {string}
     */
    get name()
    {
        return this._name;
    }

    /**
     * The node to which this port belongs
     * @returns {SpeedyPipelineNode}
     */
    get node()
    {
        return this._node;
    }

    /**
     * Connect this port to another
     * @param {SpeedyPipelinePort} port
     */
    connectTo(port)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["AbstractMethodError"]();
    }

    /**
     * Is this an input port?
     * @returns {boolean}
     */
    isInputPort()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["AbstractMethodError"]();
    }

    /**
     * Is this an output port?
     * @returns {boolean}
     */
    isOutputPort()
    {
        return !this.isInputPort();
    }

    /**
     * Clear the message stored in this port
     */
    clearMessage()
    {
        this._message = EMPTY_MESSAGE;
    }

    /**
     * Is there a valid message located in this port?
     * @returns {boolean}
     */
    hasMessage()
    {
        return !this._message.isEmpty();
    }

    /**
     * Read the message that is in this port
     * @returns {SpeedyPipelineMessage}
     */
    read()
    {
        if(this._message.isEmpty())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["IllegalOperationError"](`Can't read from port ${this.name}: nothing to read`);

        return this._message;
    }

    /**
     * Write a message to this port
     * @param {SpeedyPipelineMessage} message
     */
    write(message)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["NotSupportedError"](`Can't write ${message} to port ${this.name}: unsupported operation`);
    }

    /**
     * Default port name
     * @returns {string}
     */
    static get DEFAULT_NAME()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["AbstractMethodError"]();
    }
}

/**
 * Output port
 */
class SpeedyPipelineOutputPort extends SpeedyPipelinePort
{
    /**
     * Constructor
     * @param {string} name the name of this port 
     * @param {SpeedyPipelinePortSpec} spec port specification
     * @param {SpeedyPipelineNode} node the node to which this port belongs
     */
    constructor(name, spec, node)
    {
        super(name, spec, node);

        /** @type {SpeedyPipelineMessage} cached message */
        this._cachedMessage = null;
    }

    /**
     * Connect this port to another
     * @param {SpeedyPipelinePort} port
     */
    connectTo(port)
    {
        if(!port.isInputPort())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["IllegalArgumentError"](`Can't connect output port ${this.name} to port ${port.name}: expected an input port`);

        port.connectTo(this);
    }

    /**
     * Is this an input port?
     * @returns {boolean}
     */
    isInputPort()
    {
        return false;
    }

    /**
     * Write a message to this port
     * @param {SpeedyPipelineMessage} message
     */
    write(message)
    {
        if(!this._spec.accepts(message))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["IllegalArgumentError"](`Can't write ${message} to port ${this.name}. ${this._spec}`);

        this._message = message;
    }

    /**
     * Write a message to this port using a cached message object
     * @param  {...any} args to be passed to SpeedyPipelineMessage.set()
     */
    swrite(...args)
    {
        if(this._cachedMessage == null)
            this._cachedMessage = _pipeline_message__WEBPACK_IMPORTED_MODULE_3__["SpeedyPipelineMessage"].create(this._spec.expectedMessageType);

        this.write(this._cachedMessage.set(...args));
    }

    /**
     * Default port name
     * @returns {string}
     */
    static get DEFAULT_NAME()
    {
        return DEFAULT_OUTPUT_PORT_NAME;
    }
}

/**
 * Input port
 */
class SpeedyPipelineInputPort extends SpeedyPipelinePort
{
    /**
     * Constructor
     * @param {string} name the name of this port 
     * @param {SpeedyPipelinePortSpec} spec port specification
     * @param {SpeedyPipelineNode} node the node to which this port belongs
     */
    constructor(name, spec, node)
    {
        super(name, spec, node);

        /** @type {SpeedyPipelineOutputPort?} incoming link */
        this._incomingLink = null;
    }

    /**
     * Incoming link
     * @returns {SpeedyPipelineOutputPort|null}
     */
    get incomingLink()
    {
        return this._incomingLink;
    }

    /**
     * Connect this port to another
     * @param {SpeedyPipelinePort} port
     */
    connectTo(port)
    {
        if(!port.isOutputPort())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["IllegalArgumentError"](`Can't connect input port ${this.name} to port ${port.name}: expected an output port`);
        else if(!this._spec.isCompatibleWith(port._spec))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["IllegalArgumentError"](`Can't connect ports ${this.name} and ${port.name}: incompatible types`);

        this._incomingLink = port;
    }

    /**
     * Unlink this port
     */
    disconnect()
    {
        this._incomingLink = null;
    }

    /**
     * Is this an input port?
     * @returns {boolean}
     */
    isInputPort()
    {
        return true;
    }

    /**
     * Receive a message using the incoming link
     * @param {string} [nodeName]
     * @returns {SpeedyPipelineMessage}
     */
    pullMessage(nodeName = '')
    {
        const name = nodeName.length > 0 ? `${this.name} of ${nodeName}` : this.name;

        if(this._incomingLink == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["IllegalOperationError"](`No incoming link for input port ${name}`);

        const message = this._incomingLink.read();
        if(!this._spec.accepts(message))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["IllegalArgumentError"](`Can't receive ${message} at port ${name}: ${this._spec}`);

        return (this._message = message);
    }

    /**
     * Default port name
     * @returns {string}
     */
    static get DEFAULT_NAME()
    {
        return DEFAULT_INPUT_PORT_NAME;
    }
}

/***/ }),

/***/ "./src/core/pipeline/pipeline-portbuilder.js":
/*!***************************************************!*\
  !*** ./src/core/pipeline/pipeline-portbuilder.js ***!
  \***************************************************/
/*! exports provided: SpeedyPipelinePortBuilder, InputPort, OutputPort */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelinePortBuilder", function() { return SpeedyPipelinePortBuilder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InputPort", function() { return InputPort; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OutputPort", function() { return OutputPort; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _pipeline_port__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pipeline-port */ "./src/core/pipeline/pipeline-port.js");
/* harmony import */ var _pipeline_portspec__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pipeline-portspec */ "./src/core/pipeline/pipeline-portspec.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * pipeline-portbuilder.js
 * Builder of a port of a node of a pipeline
 */







/**
 * Builder of a port of a node of a pipeline
 */
class SpeedyPipelinePortBuilder
{
    /**
     * Constructor
     * @param {Function} portClass input or output?
     * @param {string} portName
     */
    constructor(portClass, portName)
    {
        /** @type {Function} input or output? */
        this._class = portClass;

        /** @type {string} port name */
        this._name = String(portName);

        /** @type {SpeedyPipelineMessageType} accepted message type */
        this._type = _pipeline_message__WEBPACK_IMPORTED_MODULE_3__["SpeedyPipelineMessageType"].Nothing;

        /** @type {SpeedyPipelineMessageConstraint} message validation function */
        this._messageConstraint = undefined;
    }

    /**
     * Declare that the new port expects a certain type of message
     * @param {SpeedyPipelineMessageType} type expected type
     * @returns {SpeedyPipelinePortBuilder} this builder
     */
    expects(type)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(this._type == _pipeline_message__WEBPACK_IMPORTED_MODULE_3__["SpeedyPipelineMessageType"].Nothing);
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(type != _pipeline_message__WEBPACK_IMPORTED_MODULE_3__["SpeedyPipelineMessageType"].Nothing);

        this._type = type;

        return this;
    }

    /**
     * Declare that the new port expects messages satisfying a constraint
     * @param {SpeedyPipelineMessageConstraint} constraint
     * @returns {SpeedyPipelinePortBuilder} this builder
     */
    satisfying(constraint)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(this._type != _pipeline_message__WEBPACK_IMPORTED_MODULE_3__["SpeedyPipelineMessageType"].Nothing, 'You must first declare what type of message this port expects');
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(this._messageConstraint === undefined);
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(typeof constraint === 'function');

        this._messageConstraint = constraint;

        return this;
    }

    /**
     * Build a port
     * @param {SpeedyPipelineNode} node the node to which the new port will belong
     * @returns {SpeedyPipelinePort}
     */
    build(node)
    {
        const spec = new _pipeline_portspec__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelinePortSpec"](this._type, this._messageConstraint);
        return Reflect.construct(this._class, [this._name, spec, node]);
    }
}

/**
 * Creates a builder for an input port
 * @param {string} [portName]
 * @returns {SpeedyPipelinePortBuilder}
 */
function InputPort(portName = _pipeline_port__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineInputPort"].DEFAULT_NAME)
{
    return new SpeedyPipelinePortBuilder(_pipeline_port__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineInputPort"], portName);
}

/**
 * Creates a builder for an output port
 * @param {string} [portName]
 * @returns {SpeedyPipelinePortBuilder}
 */
function OutputPort(portName = _pipeline_port__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineOutputPort"].DEFAULT_NAME)
{
    return new SpeedyPipelinePortBuilder(_pipeline_port__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineOutputPort"], portName);
}

/***/ }),

/***/ "./src/core/pipeline/pipeline-portspec.js":
/*!************************************************!*\
  !*** ./src/core/pipeline/pipeline-portspec.js ***!
  \************************************************/
/*! exports provided: SpeedyPipelinePortSpec */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelinePortSpec", function() { return SpeedyPipelinePortSpec; });
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * pipeline-portspec.js
 * Specification (requirements) of a port of a node of a pipeline
 */




/**
 * A message constraint is a message validation predicate
 * @typedef {function(SpeedyPipelineMessage): boolean} SpeedyPipelineMessageConstraint
 */

/**
 * A validation predicate that validates all messages
 * @type {SpeedyPipelineMessageConstraint}
 */
const none = message => true;

/**
 * Specification (requirements) of a port of a node of a pipeline
 */
class SpeedyPipelinePortSpec
{
    /**
     * Constructor
     * @param {SpeedyPipelineMessageType} expectedMessageType expected message type
     * @param {SpeedyPipelineMessageConstraint} [messageConstraint] message validation function
     */
    constructor(expectedMessageType, messageConstraint = none)
    {
        /** @type {SpeedyPipelineMessageType} expected message type */
        this._expectedMessageType = expectedMessageType;

        /** @type {SpeedyPipelineMessageConstraint} message validation function */
        this._isValidMessage = (typeof messageConstraint === 'function') ? messageConstraint : none;


        // expect a valid type
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(this._expectedMessageType != _pipeline_message__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineMessageType"].Nothing);
    }

    /**
     * Checks if two specs have the same expected type
     * @param {SpeedyPipelinePortSpec} spec
     * @returns {boolean}
     */
    isCompatibleWith(spec)
    {
        return this._expectedMessageType == spec._expectedMessageType;
    }

    /**
     * Is the given message accepted by a port that abides by this specification?
     * @param {SpeedyPipelineMessage} message
     * @returns {boolean}
     */
    accepts(message)
    {
        return message.hasType(this._expectedMessageType) && this._isValidMessage(message);
    }

    /**
     * Convert to string
     * @returns {string}
     */
    toString()
    {
        const type = Object.keys(_pipeline_message__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineMessageType"]).find(
            type => _pipeline_message__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineMessageType"][type] === this._expectedMessageType
        );

        return `Port expects ${type} satisfying ${this._isValidMessage}`;
    }

    /**
     * Expected message type
     * @returns {SpeedyPipelineMessageType}
     */
    get expectedMessageType()
    {
        return this._expectedMessageType;
    }
}

/***/ }),

/***/ "./src/core/pipeline/pipeline.js":
/*!***************************************!*\
  !*** ./src/core/pipeline/pipeline.js ***!
  \***************************************/
/*! exports provided: SpeedyPipeline */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipeline", function() { return SpeedyPipeline; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_port__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pipeline-port */ "./src/core/pipeline/pipeline-port.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _speedy_media__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../speedy-media */ "./src/core/speedy-media.js");
/* harmony import */ var _speedy_feature__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../speedy-feature */ "./src/core/speedy-feature.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * pipeline.js
 * A pipeline is a network of nodes in which data flows to a sink
 */










/**
 * @typedef {Object.<string,(SpeedyMedia|SpeedyFeature[])>} SpeedyPipelineOutput
 * indexed by the names of the sink nodes
 */

/**
 * A pipeline is a network of nodes in which data flows to a sink
 */
class SpeedyPipeline
{
    /**
     * Constructor
     */
    constructor()
    {
        /** @type {SpeedyPipelineNode[]} the collection of all nodes that belong to this pipeline */
        this._nodes = [];

        /** @type {SpeedyPipelineNode[]} a sequence of nodes: from the source(s) to the sink */
        this._sequence = [];

        /** @type {SpeedyPipelineOutput} output template */
        this._template = SpeedyPipeline._createOutputTemplate();

        /** @type {SpeedyGPU} GPU instance */
        this._gpu = null;
    }

    /**
     * Find a node by its name
     * @param {string} name
     * @returns {SpeedyPipelineNode|null}
     */
    node(name)
    {
        for(let i = 0, n = this._nodes.length; i < n; i++) {
            if(this._nodes[i].name === name)
                return this._nodes[i];
        }

        return null;
    }

    /**
     * Initialize the pipeline
     * @param  {...SpeedyPipelineNode} nodes
     * @returns {SpeedyPipeline} this pipeline
     */
    init(...nodes)
    {
        // validate
        if(this._gpu != null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`The pipeline has already been initialized`);
        else if(nodes.length == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalArgumentError"](`Can't initialize the pipeline. Please specify its nodes`);

        // create a GPU instance
        this._gpu = new _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_5__["SpeedyGPU"](1, 1);

        // add nodes to the network
        for(let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if(!this._nodes.includes(node))
                this._nodes.push(node);
        }

        // generate the sequence of nodes
        this._sequence = SpeedyPipeline._tsort(this._nodes);
        SpeedyPipeline._validateSequence(this._sequence);

        // generate the output template
        this._template = SpeedyPipeline._createOutputTemplate(this._nodes);

        // done!
        return this;
    }

    /**
     * Release the resources associated with this pipeline
     * @returns {null}
     */
    release()
    {
        if(this._gpu == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`The pipeline has already been released or has never been initialized`);

        this._gpu = this._gpu.release();
        this._sequence.length = 0;
        this._nodes.length = 0;
        this._template = SpeedyPipeline._createOutputTemplate();

        return null;
    }

    /**
     * Run the pipeline
     * @returns {SpeedyPromise<SpeedyPipelineOutput>} results are indexed by the names of the sink nodes
     */
    run()
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(this._gpu != null, `Pipeline has not been initialized or has been released`);

        // find the sinks
        const sinks = this._sequence.filter(node => node.isSink());

        // set the output textures of each node
        const valid = _ => this._gpu.texturePool.allocate();
        for(let i = this._sequence.length - 1; i >= 0; i--)
            this._sequence[i].setOutputTextures(valid);

        // run the pipeline
        return SpeedyPipeline._runSequence(this._sequence, this._gpu).then(() =>

            // export results
            _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__["SpeedyPromise"].all(sinks.map(sink => sink.export())).then(results =>

                // aggregate results by the names of the sinks
                results.reduce((obj, val, idx) => ((obj[sinks[idx].name] = val), obj), this._template)
            )
        ).then(aggregate => {
            // unset the output textures of the nodes and clear all ports
            const nil = tex => this._gpu.texturePool.free(tex);
            for(let i = this._sequence.length - 1; i >= 0; i--) {
                this._sequence[i].setOutputTextures(nil);
                this._sequence[i].clearPorts();
            }

            // done!
            return aggregate;
        }).turbocharge();
    }

    /**
     * Execute the tasks of a sequence of nodes
     * @param {SpeedyPipelineNode[]} sequence sequence of nodes
     * @param {SpeedyGPU} gpu GPU instance
     * @param {number} [i] in [0,n)
     * @param {number} [n] number of nodes
     * @returns {SpeedyPromise<void>}
     */
    static _runSequence(sequence, gpu, i = 0, n = sequence.length)
    {
        if(i >= n)
            return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__["SpeedyPromise"].resolve();

        const runTask = sequence[i].execute(gpu);
        if(runTask == undefined)
            return SpeedyPipeline._runSequence(sequence, gpu, i+1, n);

        return runTask.then(() => SpeedyPipeline._runSequence(sequence, gpu, i+1, n));
    }

    /**
     * Topological sorting
     * @param {SpeedyPipelineNode[]} nodes 
     * @returns {SpeedyPipelineNode[]}
     */
    static _tsort(nodes)
    {
        const outlinks = SpeedyPipeline._outlinks(nodes);
        const stack = nodes.map(node => [ node, false ]);
        const trash = new Set();
        const sorted = new Array(nodes.length);
        let j = sorted.length;

        while(stack.length > 0) {
            const [ node, done ] = stack.pop();
            if(!done) {
                if(!trash.has(node)) {
                    const outnodes = outlinks.get(node);

                    trash.add(node);
                    stack.push([ node, true ]);
                    stack.push(...(outnodes.map(node => [ node, false ])));

                    if(outnodes.some(node => trash.has(node) && !sorted.includes(node)))
                        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`Pipeline networks cannot have cycles!`);
                }
            }
            else
                sorted[--j] = node;
        }

        return sorted;
    }

    /**
     * Figure out the outgoing links of all nodes
     * @param {SpeedyPipelineNode[]} nodes
     * @returns {Map<SpeedyPipelineNode,SpeedyPipelineNode[]>}
     */
    static _outlinks(nodes)
    {
        const outlinks = new Map();

        for(let k = 0; k < nodes.length; k++)
            outlinks.set(nodes[k], []);

        for(let i = 0; i < nodes.length; i++) {
            const to = nodes[i];
            const inputs = to.inputNodes();

            for(let j = 0; j < inputs.length; j++) {
                const from = inputs[j];
                const links = outlinks.get(from);

                if(!links)
                    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`Can't initialize the pipeline. Missing node: ${from.fullName}. Did you forget to add it to the initialization list?`);

                if(!links.includes(to))
                    links.push(to);
            }
        }

        return outlinks;
    }

    /**
     * Generate the output template by aggregating the names of the sinks
     * @param {SpeedyPipelineNode[]} [nodes]
     * @returns {SpeedyPipelineOutput}
     */
    static _createOutputTemplate(nodes = [])
    {
        const template = Object.create(null);
        const sinks = nodes.filter(node => node.isSink());

        return sinks.reduce((obj, sink) => ((obj[sink.name] = null), obj), template);
    }

    /**
     * Validate a sequence of nodes
     * @param {SpeedyPipelineNode[]} sequence
     */
    static _validateSequence(sequence)
    {
        if(sequence.length == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`Pipeline doesn't have nodes`);
        else if(!sequence[0].isSource())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`Pipeline doesn't have a source`);
        else if(!sequence[sequence.length - 1].isSink())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`Pipeline doesn't have a sink`);
    }
}


/***/ }),

/***/ "./src/core/speedy-descriptor.js":
/*!***************************************!*\
  !*** ./src/core/speedy-descriptor.js ***!
  \***************************************/
/*! exports provided: SpeedyDescriptor, BinaryDescriptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyDescriptor", function() { return SpeedyDescriptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BinaryDescriptor", function() { return BinaryDescriptor; });
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * speedy-descriptor.js
 * Feature descriptor
 */



/**
 * Abstract feature descriptor
 */
class SpeedyDescriptor
{
    /**
     * Abstract constructor
     */
    constructor()
    {
        /*if(this.constructor === SpeedyDescriptor)
            throw new AbstractMethodError();*/
    }
    
    /**
     * Descriptor data
     * @returns {null}
     */
    get data()
    {
        return null;
    }

    /**
     * Descriptor size, in bytes
     * @returns {number}
     */
    get size()
    {
        return 0;
    }
}

/**
 * Binary feature descriptor
 */
class BinaryDescriptor extends SpeedyDescriptor
{
    /**
     * Class constructor
     * @param {Uint8Array} bytes descriptor data
     */
    constructor(bytes)
    {
        super();
        this._data = bytes;
        this._size = bytes.length;
    }

    /**
     * Descriptor data
     * @returns {Uint8Array}
     */
    get data()
    {
        return this._data;
    }

    /**
     * Descriptor size, in bytes
     * @returns {number}
     */
    get size()
    {
        return this._size;
    }
}

/***/ }),

/***/ "./src/core/speedy-feature-decorator.js":
/*!**********************************************!*\
  !*** ./src/core/speedy-feature-decorator.js ***!
  \**********************************************/
/*! exports provided: SpeedyFeatureDecorator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyFeatureDecorator", function() { return SpeedyFeatureDecorator; });
/* harmony import */ var _keypoints_feature_algorithm_decorator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keypoints/feature-algorithm-decorator */ "./src/core/keypoints/feature-algorithm-decorator.js");
/* harmony import */ var _keypoints_feature_algorithm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keypoints/feature-algorithm */ "./src/core/keypoints/feature-algorithm.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
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
 * speedy-feature-decorator.js
 * A wrapper around a FeatureAlgorithmDecorator
 */





/**
 * A wrapper around a FeatureAlgorithmDecorator
 */
class SpeedyFeatureDecorator
{
    /**
     * Constructor
     * @param {Function} decorator a FeatureAlgorithmDecorator
     * @param {any[]} [args] additional arguments to be passed when instantiating the decorator
     */
    constructor(decorator, ...args)
    {
        this._decorator = decorator;
        this._args = args;
    }

    /**
     * Decorate an algorithm
     * @param {FeatureAlgorithm} algorithm 
     * @returns {FeatureAlgorithmDecorator}
     */
    decorate(algorithm)
    {
        const decoratedAlgorithm = Reflect.construct(this._decorator, [ algorithm ].concat(this._args));
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].assert(decoratedAlgorithm instanceof _keypoints_feature_algorithm_decorator__WEBPACK_IMPORTED_MODULE_0__["FeatureAlgorithmDecorator"]);

        return decoratedAlgorithm;
    }
}

/***/ }),

/***/ "./src/core/speedy-feature-descriptor-factory.js":
/*!*******************************************************!*\
  !*** ./src/core/speedy-feature-descriptor-factory.js ***!
  \*******************************************************/
/*! exports provided: SpeedyFeatureDescriptorFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyFeatureDescriptorFactory", function() { return SpeedyFeatureDescriptorFactory; });
/* harmony import */ var _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-namespace */ "./src/core/speedy-namespace.js");
/* harmony import */ var _speedy_feature_decorator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-feature-decorator */ "./src/core/speedy-feature-decorator.js");
/* harmony import */ var _keypoints_descriptors_orb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keypoints/descriptors/orb */ "./src/core/keypoints/descriptors/orb.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * speedy-feature-descriptor-factory.js
 * Factory of feature descriptors
 */





/**
 * A collection of methods for decorating Feature Detectors &
 * Feature Trackers with Descriptors
 */
class SpeedyFeatureDescriptorFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__["SpeedyNamespace"]
{
    /**
     * ORB descriptor
     * @returns {SpeedyFeatureDecorator}
     */
    static ORB()
    {
        return new _speedy_feature_decorator__WEBPACK_IMPORTED_MODULE_1__["SpeedyFeatureDecorator"](_keypoints_descriptors_orb__WEBPACK_IMPORTED_MODULE_2__["ORBFeatures"]);
    }
}

/***/ }),

/***/ "./src/core/speedy-feature-detector-factory.js":
/*!*****************************************************!*\
  !*** ./src/core/speedy-feature-detector-factory.js ***!
  \*****************************************************/
/*! exports provided: SpeedyFeatureDetectorFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyFeatureDetectorFactory", function() { return SpeedyFeatureDetectorFactory; });
/* harmony import */ var _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-namespace */ "./src/core/speedy-namespace.js");
/* harmony import */ var _speedy_feature_detector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-feature-detector */ "./src/core/speedy-feature-detector.js");
/* harmony import */ var _speedy_feature_descriptor_factory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./speedy-feature-descriptor-factory */ "./src/core/speedy-feature-descriptor-factory.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * speedy-feature-detector-factory.js
 * A collection of methods for instantiating SpeedyFeatureDetectors
 */







/**
 * A collection of methods for instantiating SpeedyFeatureDetectors
 */
class SpeedyFeatureDetectorFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__["SpeedyNamespace"]
{
    /**
     * FAST feature detector
     * @param {number} [n] Variant of the algorithm. Must be 9, 7 or 5.
     * @returns {FASTFeatureDetector}
     */
    static FAST(n = 9)
    {
        return new _speedy_feature_detector__WEBPACK_IMPORTED_MODULE_1__["FASTFeatureDetector"](n);
    }

    /**
     * FAST feature detector in scale-space
     * @param {number} [n] Variant of the algorithm. Must be 9.
     * @returns {MultiscaleFASTFeatureDetector}
     */
    static MultiscaleFAST(n = 9)
    {
        return new _speedy_feature_detector__WEBPACK_IMPORTED_MODULE_1__["MultiscaleFASTFeatureDetector"](n);
    }

    /**
     * Harris corner detector
     * @returns {HarrisFeatureDetector}
     */
    static Harris()
    {
        return new _speedy_feature_detector__WEBPACK_IMPORTED_MODULE_1__["HarrisFeatureDetector"]();
    }

    /**
     * Harris corner detector in scale-space
     * @returns {MultiscaleHarrisFeatureDetector}
     */
    static MultiscaleHarris()
    {
        return new _speedy_feature_detector__WEBPACK_IMPORTED_MODULE_1__["MultiscaleHarrisFeatureDetector"]();
    }

    /**
     * ORB feature detector & descriptor
     * @returns {MultiscaleHarrisFeatureDetector} decorated with ORB
     */
    static ORB()
    {
        const orb = _speedy_feature_descriptor_factory__WEBPACK_IMPORTED_MODULE_2__["SpeedyFeatureDescriptorFactory"].ORB();
        const detector = (new _speedy_feature_detector__WEBPACK_IMPORTED_MODULE_1__["MultiscaleHarrisFeatureDetector"]()).link(orb);
        detector.scaleFactor = 1.19; // approx. 2^0.25
        return detector;
    }

    /**
     * BRISK feature detector & descriptor
     * @returns {BRISKFeatureDetector}
     */
    static BRISK()
    {
        //return new BRISKFeatureDetector();
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["NotImplementedError"]();
    }
}

/***/ }),

/***/ "./src/core/speedy-feature-detector.js":
/*!*********************************************!*\
  !*** ./src/core/speedy-feature-detector.js ***!
  \*********************************************/
/*! exports provided: SpeedyFeatureDetector, FASTFeatureDetector, MultiscaleFASTFeatureDetector, HarrisFeatureDetector, MultiscaleHarrisFeatureDetector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyFeatureDetector", function() { return SpeedyFeatureDetector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FASTFeatureDetector", function() { return FASTFeatureDetector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MultiscaleFASTFeatureDetector", function() { return MultiscaleFASTFeatureDetector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HarrisFeatureDetector", function() { return HarrisFeatureDetector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MultiscaleHarrisFeatureDetector", function() { return MultiscaleHarrisFeatureDetector; });
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/types */ "./src/utils/types.js");
/* harmony import */ var _speedy_flags__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./speedy-flags */ "./src/core/speedy-flags.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _speedy_media__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./speedy-media */ "./src/core/speedy-media.js");
/* harmony import */ var _keypoints_feature_detection_algorithm__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./keypoints/feature-detection-algorithm */ "./src/core/keypoints/feature-detection-algorithm.js");
/* harmony import */ var _keypoints_feature_description_algorithm__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./keypoints/feature-description-algorithm */ "./src/core/keypoints/feature-description-algorithm.js");
/* harmony import */ var _keypoints_feature_downloader__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./keypoints/feature-downloader */ "./src/core/keypoints/feature-downloader.js");
/* harmony import */ var _keypoints_detectors_fast__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./keypoints/detectors/fast */ "./src/core/keypoints/detectors/fast.js");
/* harmony import */ var _keypoints_detectors_harris__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./keypoints/detectors/harris */ "./src/core/keypoints/detectors/harris.js");
/* harmony import */ var _speedy_feature_decorator__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./speedy-feature-decorator */ "./src/core/speedy-feature-decorator.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * speedy-feature-detector.js
 * Feature detection API
 */

















/**
 * Basic feature detection & description API
 * This is an easy-to-use wrapper around the internal
 * FeatureDetectionAlgorithm class, which deals with encoded
 * textures and is not suitable for end-user usage
 * @abstract
 */
class SpeedyFeatureDetector
{
    /**
     * Class constructor
     * @param {FeatureDetectionAlgorithm} algorithm
     */
    constructor(algorithm)
    {
        /** @type {FeatureDetectionAlgorithm} the feature detection algorithm */
        this._algorithm = algorithm;

        /** @type {FeatureDetectionAlgorithm} the decorated feature detection algorithm */
        this._decoratedAlgorithm = this._algorithm;

        /** @type {number} sensitivity: the higher the value, the more feature points you get */
        this._sensitivity = 0; // a value in [0,1]

        /** @type {number|undefined} should we cap the number of keypoints? */
        this._max = undefined;

        /** @type {Function} internal */
        this._capKeypoints = this._capKeypoints.bind(this);

        /** @type {object} enhance the image in different ways before detecting the features */
        this._enhancements = {
            denoise: true,
            illumination: false,
            nightvision: null,
        };

        /** @type {boolean} optimize downloads when working with dynamic media? */
        this._useBufferedDownloads = true;
    }

    /**
     * Decorate the underlying algorithm
     * @param {SpeedyFeatureDecorator} decorator
     * @returns {SpeedyFeatureDetector} this instance, now decorated
     */
    link(decorator)
    {
        this._decoratedAlgorithm = decorator.decorate(this._decoratedAlgorithm);
        return this;
    }

    /**
     * Detect & describe feature points
     * @param {SpeedyMedia} media
     * @returns {Promise<SpeedyFeature[]>}
     */
    detect(media)
    {
        const gpu = media._gpu;
        const isStaticMedia = (media.options.usage == 'static');
        const descriptorSize = this._decoratedAlgorithm.descriptorSize;
        const extraSize = this._decoratedAlgorithm.extraSize;
        let downloaderFlags = 0;

        // check if the media has been released
        if(media.isReleased())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalOperationError"](`Can't detect features: the SpeedyMedia has been released`);

        // Check usage hint: dynamic or static
        if(isStaticMedia) {
            // Allocate encoder space for static media
            const MAX_KEYPOINT_GUESS = 8192; // hmmmmmmmm...
            this._algorithm.downloader.reserveSpace(MAX_KEYPOINT_GUESS, descriptorSize, extraSize);
        }
        else if(this._useBufferedDownloads) {
            // Use buffered downloads for dynamic media
            downloaderFlags |= _keypoints_feature_downloader__WEBPACK_IMPORTED_MODULE_9__["FeatureDownloader"].USE_BUFFERED_DOWNLOADS;
        }

        /* ----- REMOVED -----
        // Reset encoder capacity & downloader state
        if(flags & SpeedyFlags.FEATURE_DETECTOR_RESET_CAPACITY) {
            // Speedy performs optimizations behind the scenes,
            // specially when detecting features in videos.
            // This flag will undo some optimizations. Use it
            // when you expect a sudden increase in the number
            // of keypoints (between two consecutive frames).
            downloaderFlags |= FeatureDownloader.RESET_DOWNLOADER_STATE;

            // since we're resizing the encoder, we can't use
            // buffered downloads in this framestep
            downloaderFlags &= ~(FeatureDownloader.USE_BUFFERED_DOWNLOADS);
        }
        */

        // Upload & preprocess media
        const texture = media._upload();
        const preprocessedTexture = this._preprocessTexture(
            gpu,
            texture,
            this._enhancements.denoise == true,
            media._colorFormat != _utils_types__WEBPACK_IMPORTED_MODULE_2__["ColorFormat"].Greyscale
        );

        // Feature detection & description
        this._algorithm.setEnhancements(
            this._enhancements.nightvision || this._enhancements.illumination
        );
        const encodedKeypoints = this._decoratedAlgorithm.run(gpu, preprocessedTexture);

        // Download keypoints from the GPU
        return this._decoratedAlgorithm.download(
            gpu,
            encodedKeypoints,
            downloaderFlags
        ).then(this._capKeypoints);
    }

    /**
     * Get the current detector sensitivity
     * @returns {number} a value in [0,1]
     */
    get sensitivity()
    {
        return this._sensitivity;
    }

    /**
     * Set the sensitivity of the feature detector
     * The higher the sensitivity, the more features you get
     * @param {number} sensitivity a value in [0,1]
     */
    set sensitivity(sensitivity)
    {
        this._sensitivity = Math.max(0, Math.min(+sensitivity, 1));
        this._onSensitivityChange(this._sensitivity);
    }

    /**
     * The maximum number of keypoints that will be
     * returned by the feature detector. If it's
     * undefined, then there is no pre-defined limit
     * @returns {number | undefined}
     */
    get max()
    {
        return this._max;
    }

    /**
     * The maximum number of keypoints that will be
     * returned by the feature detector. Set it to
     * undefined to disable any limits
     * @param {number | undefined} maxFeaturePoints
     */
    set max(maxFeaturePoints)
    {
        if(maxFeaturePoints !== undefined)
            this._max = Math.max(0, maxFeaturePoints | 0);
        else
            this._max = undefined;
    }

    /**
     * Specify different enhancements to applied
     * to the image before detecting the features
     * @param {object} enhancements
     */
    enhance(enhancements)
    {
        // validate parameter
        if(typeof enhancements !== 'object')
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"]('enhancements must be an object');

        // merge enhancements object
        this._enhancements = Object.assign(this._enhancements, enhancements);
    }

    /**
     * Optimize downloads of data from the GPU
     * when working with dynamic media
     * @returns {boolean}
     */
    get useBufferedDownloads()
    {
        return this._useBufferedDownloads;
    }

    /**
     * Optimize downloads of data from the GPU
     * when working with dynamic media
     * @param {boolean} value
     */
    set useBufferedDownloads(value)
    {
        this._useBufferedDownloads = Boolean(value);
    }

    /**
     * Preprocess a texture for feature detection & description
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture a RGB or greyscale image
     * @param {boolean} [denoise] should we smooth the media a bit?
     * @param {boolean} [convertToGreyscale] set to true if the texture is not greyscale
     * @returns {SpeedyTexture} pre-processed greyscale image
     */
    _preprocessTexture(gpu, inputTexture, denoise = true, convertToGreyscale = true)
    {
        let texture = inputTexture;

        if(denoise)
            texture = gpu.programs.filters.gauss5(texture);

        if(convertToGreyscale)
            texture = gpu.programs.colors.rgb2grey(texture);

        return texture;
    }

    /**
     * Convert a normalized sensitivity into an
     * algorithm-specific value such as a threshold
     * 
     * Sensitivity is a generic parameter that can be
     * mapped to different feature detectors. The
     * higher the sensitivity, the more features
     * you should get
     *
     * @param {number} sensitivity a value in [0,1]
     */
    _onSensitivityChange(sensitivity)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["AbstractMethodError"]();
    }

    /**
     * Compare two keypoints for sorting (higher scores come first)
     * @param {SpeedyFeature} a
     * @param {SpeedyFeature} b
     * @returns {number}
     */
    _compareKeypoints(a, b)
    {
        return (+(b.score)) - (+(a.score));
    }

    /**
     * Cap the number of keypoints, so that only the ones with
     * the highest scores will be returned to the user
     * @param {SpeedyFeature[]} keypoints
     * @returns {SpeedyFeature[]}
     */
    _capKeypoints(keypoints)
    {
        // nothing to do
        if(this._max === undefined)
            return keypoints;

        // cap the number of keypoints
        keypoints.sort(this._compareKeypoints);
        keypoints.length = Math.min(keypoints.length, this._max);
        return keypoints;
    }
}




/**
 * FAST feature detector
 */
class FASTFeatureDetector extends SpeedyFeatureDetector
{
    /**
     * Class constructor
     * @param {number} [n] FAST variant: 9, 7 or 5
     */
    constructor(n = 9)
    {
        // Create algorithm
        super(new _keypoints_detectors_fast__WEBPACK_IMPORTED_MODULE_10__["FASTFeatures"]());

        // Validate FAST variant
        if(!(n === 9 || n === 7 || n === 5))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["NotSupportedError"](`Can't create FAST feature detector with n = ${n}`);

        // Set FAST variant
        this._algorithm.n = n;
    }

    /**
     * Get FAST variant
     * @returns {number}
     */
    get n()
    {
        return this._algorithm.n;
    }

    /**
     * Get FAST threshold
     * @returns {number} a value in [0,255]
     */
    get threshold()
    {
        return this._algorithm.threshold;
    }

    /**
     * Set FAST threshold
     * @param {number} threshold an integer in [0,255]
     */
    set threshold(threshold)
    {
        this._algorithm.threshold = threshold;
    }

    /**
     * Convert a normalized sensitivity to a FAST threshold
     * @param {number} sensitivity 
     */
    _onSensitivityChange(sensitivity)
    {
        this.threshold = Math.round(255.0 * (1.0 - Math.tanh(2.77 * sensitivity)));
    }
}



/**
 * FAST feature detector in an image pyramid
 */
class MultiscaleFASTFeatureDetector extends SpeedyFeatureDetector
{
    /**
     * Class constructor
     * @param {number} [n] Multiscale FAST variant. Must be 9
     */
    constructor(n = 9)
    {
        // setup algorithm
        super(new _keypoints_detectors_fast__WEBPACK_IMPORTED_MODULE_10__["MultiscaleFASTFeatures"]());

        // Validate FAST variant
        if(n !== 9)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["NotSupportedError"](`Can't create Multiscale FAST feature detector with n = ${n}`);

        // Set FAST variant
        this._algorithm.n = n;
    }

    /**
     * Get FAST variant
     * @returns {number}
     */
    get n()
    {
        return this._algorithm.n;
    }

    /**
     * Get FAST threshold
     * @returns {number} a value in [0,255]
     */
    get threshold()
    {
        return this._algorithm.threshold;
    }

    /**
     * Set FAST threshold
     * @param {number} threshold an integer in [0,255]
     */
    set threshold(threshold)
    {
        this._algorithm.threshold = threshold;
    }

    /**
     * Get the depth of the algorithm: how many pyramid layers will be scanned
     * @returns {number}
     */
    get depth()
    {
        return this._algorithm.depth;
    }

    /**
     * Set the depth of the algorithm: how many pyramid layers will be scanned
     * @param {number} depth
     */
    set depth(depth)
    {
        this._algorithm.depth = depth;
    }

    /**
     * Get the scale factor between consecutive pyramid layers
     * @returns {number}
     */
    get scaleFactor()
    {
        return this._algorithm.scaleFactor;
    }

    /**
     * Set the scale factor between consecutive pyramid layers
     * @param {number} value must be greater than 1 and less than or equal to 2
     */
    set scaleFactor(value)
    {
        this._algorithm.scaleFactor = value;
    }

    /**
     * Convert a normalized sensitivity to a FAST threshold
     * @param {number} sensitivity 
     */
    _onSensitivityChange(sensitivity)
    {
        this.threshold = Math.round(255.0 * (1.0 - Math.tanh(2.77 * sensitivity)));
    }
}




/**
 * Harris corner detector
 */
class HarrisFeatureDetector extends SpeedyFeatureDetector
{
    /**
     * Class constructor
     */
    constructor()
    {
        // setup the algorithm
        super(new _keypoints_detectors_harris__WEBPACK_IMPORTED_MODULE_11__["HarrisFeatures"]());
    }

    /**
     * Get current quality level
     * We will pick corners having score >= quality * max(score)
     * @returns {number} a value in [0,1]
     */
    get quality()
    {
        return this._algorithm.quality;
    }

    /**
     * Set quality level
     * We will pick corners having score >= quality * max(score)
     * @param {number} quality a value in [0,1]
     */
    set quality(quality)
    {
        this._algorithm.quality = Math.max(0, Math.min(quality, 1));
    }

    /**
     * Convert a normalized sensitivity to a quality value
     * @param {number} sensitivity 
     */
    _onSensitivityChange(sensitivity)
    {
        this.quality = 1.0 - sensitivity;
    }
}



/**
 * Harris corner detector in an image pyramid
 */
class MultiscaleHarrisFeatureDetector extends SpeedyFeatureDetector
{
    /**
     * Class constructor
     */
    constructor()
    {
        // setup algorithm
        super(new _keypoints_detectors_harris__WEBPACK_IMPORTED_MODULE_11__["MultiscaleHarrisFeatures"]());
    }

    /**
     * Get the depth of the algorithm: how many pyramid layers will be scanned
     * @returns {number}
     */
    get depth()
    {
        return this._algorithm.depth;
    }

    /**
     * Set the depth of the algorithm: how many pyramid layers will be scanned
     * @param {number} depth a number between 1 and PYRAMID_MAX_LEVELS, inclusive
     */
    set depth(depth)
    {
        this._algorithm.depth = depth;
    }

    /**
     * Get the scale factor between consecutive pyramid layers
     * @returns {number}
     */
    get scaleFactor()
    {
        return this._algorithm.scaleFactor;
    }

    /**
     * Set the scale factor between consecutive pyramid layers
     * @param {number} value must be greater than 1
     */
    set scaleFactor(value)
    {
        this._algorithm.scaleFactor = value;
    }

    /**
     * Get current quality level
     * We will pick corners having score >= quality * max(score)
     * @returns {number} a value in [0,1]
     */
    get quality()
    {
        return this._algorithm.quality;
    }

    /**
     * Set quality level
     * We will pick corners having score >= quality * max(score)
     * @param {number} quality a value in [0,1]
     */
    set quality(quality)
    {
        this._algorithm.quality = Math.max(0, Math.min(quality, 1));
    }

    /**
     * Convert a normalized sensitivity to a quality value
     * @param {number} sensitivity 
     */
    _onSensitivityChange(sensitivity)
    {
        this.quality = 1.0 - sensitivity;
    }
}

/***/ }),

/***/ "./src/core/speedy-feature-tracker-factory.js":
/*!****************************************************!*\
  !*** ./src/core/speedy-feature-tracker-factory.js ***!
  \****************************************************/
/*! exports provided: SpeedyFeatureTrackerFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyFeatureTrackerFactory", function() { return SpeedyFeatureTrackerFactory; });
/* harmony import */ var _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-namespace */ "./src/core/speedy-namespace.js");
/* harmony import */ var _speedy_media__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-media */ "./src/core/speedy-media.js");
/* harmony import */ var _speedy_feature_tracker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./speedy-feature-tracker */ "./src/core/speedy-feature-tracker.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * speedy-feature-tracker-factory.js
 * A collection of methods for instantiating Feature Trackers
 */





/**
 * A collection of methods for instantiating Feature Trackers
 */
class SpeedyFeatureTrackerFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__["SpeedyNamespace"]
{
    /**
     * Spawns a LK feature tracker
     * @param {SpeedyMedia} media
     * @returns {LKFeatureTracker}
     */
    static LK(media)
    {
        return new _speedy_feature_tracker__WEBPACK_IMPORTED_MODULE_2__["LKFeatureTracker"](media);
    }
}

/***/ }),

/***/ "./src/core/speedy-feature-tracker.js":
/*!********************************************!*\
  !*** ./src/core/speedy-feature-tracker.js ***!
  \********************************************/
/*! exports provided: SpeedyFeatureTracker, LKFeatureTracker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyFeatureTracker", function() { return SpeedyFeatureTracker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LKFeatureTracker", function() { return LKFeatureTracker; });
/* harmony import */ var _keypoints_feature_tracking_algorithm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keypoints/feature-tracking-algorithm */ "./src/core/keypoints/feature-tracking-algorithm.js");
/* harmony import */ var _keypoints_feature_algorithm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keypoints/feature-algorithm */ "./src/core/keypoints/feature-algorithm.js");
/* harmony import */ var _keypoints_feature_downloader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keypoints/feature-downloader */ "./src/core/keypoints/feature-downloader.js");
/* harmony import */ var _speedy_media__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./speedy-media */ "./src/core/speedy-media.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _math_speedy_vector__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./math/speedy-vector */ "./src/core/math/speedy-vector.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils/globals */ "./src/utils/globals.js");
/* harmony import */ var _keypoints_trackers_lk__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./keypoints/trackers/lk */ "./src/core/keypoints/trackers/lk.js");
/* harmony import */ var _speedy_feature_decorator__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./speedy-feature-decorator */ "./src/core/speedy-feature-decorator.js");
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
 * speedy-feature-tracker.js
 * An easy-to-use class for working with feature trackers
 */














/**
 * An easy-to-use class for working with feature trackers
 * (it performs sparse optical-flow)
 * @abstract
 */
class SpeedyFeatureTracker
{
    /**
     * Class constructor
     * @param {FeatureTrackingAlgorithm} trackingAlgorithm used to track the features
     * @param {SpeedyMedia} media the media that holds the features
     */
    constructor(trackingAlgorithm, media)
    {
        /** @type {FeatureTrackingAlgorithm} tracking algorithm */
        this._trackingAlgorithm = trackingAlgorithm;

        /** @type {FeatureAlgorithm} decorated tracking algorithm */
        this._decoratedAlgorithm = this._trackingAlgorithm;

        /** @type {SpeedyMedia} the media we're using to track the features */
        this._media = media;

        /** @type {SpeedyTexture} image at time t */
        this._inputTexture = null;

        /** @type {SpeedyTexture} image at time t-1 */
        this._prevInputTexture = null;
    }

    /**
     * Decorate the underlying algorithm
     * @param {SpeedyFeatureDecorator} decorator
     * @returns {SpeedyFeatureTracker} this instance, now decorated
     */
    link(decorator)
    {
        this._decoratedAlgorithm = decorator.decorate(this._decoratedAlgorithm);
        return this;
    }

    /**
     * Track keypoints in the media
     * @param {SpeedyFeature[]} keypoints the keypoints you want to track
     * @param {SpeedyVector2[]|null} [flow] output parameter: flow vector for the i-th keypoint
     * @param {boolean[]|null} [found] output parameter: found[i] will be true if the i-th keypoint has been found
     * @returns {Promise<SpeedyFeature[]>}
     */
    track(keypoints, flow = null, found = null)
    {
        const gpu = this._media._gpu; // friend class?!
        const descriptorSize = this._decoratedAlgorithm.descriptorSize;
        const extraSize = this._decoratedAlgorithm.extraSize;
        const flags = 0;

        // validate arguments
        if(!Array.isArray(keypoints) || (found != null && !Array.isArray(found)) || (flow != null && !Array.isArray(flow)))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__["IllegalArgumentError"]();

        // upload media to the GPU
        const [ nextImage, prevImage ] = this._updatedImages(this._media, gpu, this._inputTexture);
        this._prevInputTexture = prevImage;
        this._inputTexture = nextImage;

        // adjust the size of the encoder
        this._trackingAlgorithm.downloader.reserveSpace(keypoints.length, descriptorSize, extraSize, true);

        // upload & track keypoints
        this._trackingAlgorithm.prevImage = prevImage;
        this._trackingAlgorithm.prevKeypoints = this._trackingAlgorithm.upload(gpu, keypoints);
        const encodedKeypoints = this._decoratedAlgorithm.run(gpu, nextImage);

        // download keypoints
        return this._decoratedAlgorithm.download(gpu, encodedKeypoints, flags).then(trackedKeypoints => {
            const filteredKeypoints = [];

            // initialize output arrays
            if(found != null)
                found.length = trackedKeypoints.length;
            if(flow != null)
                flow.length = trackedKeypoints.length;

            // compute additional data and filter out discarded keypoints
            for(let i = 0; i < trackedKeypoints.length; i++) {
                const goodFeature = ((trackedKeypoints[i].flags & _utils_globals__WEBPACK_IMPORTED_MODULE_9__["KPF_DISCARD"]) == 0);

                if(goodFeature)
                    filteredKeypoints.push(trackedKeypoints[i]);

                if(found != null)
                    found[i] = goodFeature;

                if(flow != null) {
                    flow[i] = goodFeature ? 
                        new _math_speedy_vector__WEBPACK_IMPORTED_MODULE_6__["SpeedyVector2"](trackedKeypoints[i].x - keypoints[i].x, trackedKeypoints[i].y - keypoints[i].y) :
                        new _math_speedy_vector__WEBPACK_IMPORTED_MODULE_6__["SpeedyVector2"](0, 0);
                }
            }

            // done!
            return filteredKeypoints;
        });
    }

    /**
     * Upload the media to GPU and keep track of the previous frame
     * @param {SpeedyMedia} media
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture|null} prevImage
     * @returns {SpeedyTexture[]} [nextImage, prevImage] tuple
     */
    _updatedImages(media, gpu, prevImage)
    {
        // validate the media
        if(media.isReleased())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__["IllegalOperationError"](`The media has been released`);

        // upload the media
        const nextImage = media._upload();
        if(nextImage == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__["IllegalOperationError"](`Tracking error: can't upload image to the GPU ${media.source}`);

        // done!
        return [ nextImage, prevImage || nextImage ];
    }
}


/**
 * LK feature tracker with image pyramids
 */
class LKFeatureTracker extends SpeedyFeatureTracker
{
    /**
     * Class constructor
     * @param {SpeedyMedia} media media to track
     */
    constructor(media)
    {
        const algorithm = new _keypoints_trackers_lk__WEBPACK_IMPORTED_MODULE_10__["LKFeatureTrackingAlgorithm"]();
        super(algorithm, media);
    }

    /**
     * Neighborhood size
     * @returns {number}
     */
    get windowSize()
    {
        return this._trackingAlgorithm.windowSize;
    }

    /**
     * Neighborhood size
     * @param {number} newSize a positive odd integer, typically 21 or 15
     */
    set windowSize(newSize)
    {
        this._trackingAlgorithm.windowSize = newSize | 0;
    }

    /**
     * How many pyramid levels will be scanned
     * @returns {number}
     */
    get depth()
    {
        return this._trackingAlgorithm.depth;
    }

    /**
     * How many pyramid levels will be scanned
     * @param {number} newDepth positive integer
     */
    set depth(newDepth)
    {
        this._trackingAlgorithm.depth = newDepth | 0;
    }

    /**
     * A threshold used to discard "bad" keypoints
     * @returns {number}
     */
    get discardThreshold()
    {
        return this._trackingAlgorithm.discardThreshold;
    }

    /**
     * A threshold used to discard "bad" keypoints
     * @param {number} threshold typically 0.0001 - increase to discard more keypoints
     */
    set discardThreshold(threshold)
    {
        this._trackingAlgorithm.discardThreshold = +threshold;
    }

    /**
     * Get the maximum number of iterations of the pyramidal LK algorithm
     * @returns {number}
     */
    get numberOfIterations()
    {
        return this._trackingAlgorithm.numberOfIterations;
    }

    /**
     * Set the maximum number of iterations of the pyramidal LK algorithm
     * @param {number} count
     */
    set numberOfIterations(count)
    {
        this._trackingAlgorithm.numberOfIterations = count | 0;
    }

    /**
     * Get the accuracy threshold, used to stop LK iterations
     * @returns {number}
     */
    get epsilon()
    {
        return this._trackingAlgorithm.epsilon;
    }

    /**
     * Get the accuracy threshold, used to stop LK iterations
     * @param {number} value
     */
    set epsilon(value)
    {
        this._trackingAlgorithm.epsilon = +value;
    }
}

/***/ }),

/***/ "./src/core/speedy-feature.js":
/*!************************************!*\
  !*** ./src/core/speedy-feature.js ***!
  \************************************/
/*! exports provided: SpeedyFeature, SpeedyFeatureWithDescriptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyFeature", function() { return SpeedyFeature; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyFeatureWithDescriptor", function() { return SpeedyFeatureWithDescriptor; });
/* harmony import */ var _speedy_descriptor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-descriptor */ "./src/core/speedy-descriptor.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * Feature Point class
 */




// Constants
const noBytes = new Uint8Array([]);



/**
 * A SpeedyFeature is a keypoint in an image,
 * with optional scale, rotation and
 * descriptor bytes / extra bytes
 */
class SpeedyFeature
{
    /**
     * Constructor
     * @param {number} x X position
     * @param {number} y Y position
     * @param {number} [lod] Level-of-detail
     * @param {number} [rotation] Rotation in radians
     * @param {number} [score] Cornerness measure
     * @param {number} [flags] Keypoint flags
     * @param {Uint8Array} [extraBytes] extra bytes of the header, if any
     * @param {Uint8Array} [descriptorBytes] bytes of the feature descriptor, if any
     */
    constructor(x, y, lod = 0.0, rotation = 0.0, score = 0.0, flags = 0, extraBytes = null, descriptorBytes = null)
    {
        this._x = +x;
        this._y = +y;
        this._lod = +lod;
        this._rotation = +rotation;
        this._score = +score;
        this._scale = Math.pow(2, +lod);
        this._flags = flags | 0;
        this._extraBytes = extraBytes || noBytes;
        this._descriptorBytes = descriptorBytes || noBytes;
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
     * The pyramid level-of-detail from which
     * this feature point was extracted
     */
    get lod()
    {
        return this._lod;
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
     * Score: a cornerness measure
     * @returns {number} Score
     */
    get score()
    {
        return this._score;
    }

    /**
     * Internal flags
     * @returns {number}
     */
    get flags()
    {
        return this._flags;
    }
}

/**
 * A feature point with a descriptor
 */
class SpeedyFeatureWithDescriptor extends SpeedyFeature
{
    /**
     * Constructor
     * @param {SpeedyFeature} feature
     * @param {function(Uint8Array): SpeedyDescriptor} spawnDescriptor spawns a descriptor given a sequence of bytes
     */
    constructor(feature, spawnDescriptor)
    {
        // copy values
        super(
            feature._x,
            feature._y,
            feature._lod,
            feature._rotation,
            feature._score,
            feature._flags,
            feature._extraBytes,
            feature._descriptorBytes
        );

        // setup descriptor
        this._descriptor = spawnDescriptor(this._descriptorBytes);
    }

    /**
     * The descriptor of the feature point
     * @returns {SpeedyDescriptor} feature descriptor
     */
    get descriptor()
    {
        return this._descriptor;
    }
}

/***/ }),

/***/ "./src/core/speedy-flags.js":
/*!**********************************!*\
  !*** ./src/core/speedy-flags.js ***!
  \**********************************/
/*! exports provided: SpeedyFlags */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyFlags", function() { return SpeedyFlags; });
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * speedy-flags.js
 * Flags available to users
 */

const SpeedyFlags = Object.freeze({

    // Feature detectors
    //FEATURE_DETECTOR_RESET_CAPACITY: 0x1, // removed

});

/***/ }),

/***/ "./src/core/speedy-keypoint.js":
/*!*************************************!*\
  !*** ./src/core/speedy-keypoint.js ***!
  \*************************************/
/*! exports provided: SpeedyKeypoint */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyKeypoint", function() { return SpeedyKeypoint; });
/* harmony import */ var _math_speedy_point__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math/speedy-point */ "./src/core/math/speedy-point.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * speedy-keypoint.js
 * Keypoint class
 */



// Constants
const noBytes = new Uint8Array([]);

/**
 * Represents a keypoint
 */
class SpeedyKeypoint
{
    /**
     * Constructor
     * @param {number} x X position
     * @param {number} y Y position
     * @param {number} [lod] Level-of-detail
     * @param {number} [rotation] Rotation in radians
     * @param {number} [score] Cornerness measure
     * @param {number} [flags] Keypoint flags
     * @param {Uint8Array} [descriptorBytes] bytes of the feature descriptor, if any
     * @param {Uint8Array} [extraBytes] extra bytes of the header, if any
     */
    constructor(x, y, lod = 0.0, rotation = 0.0, score = 0.0, flags = 0, descriptorBytes = null, extraBytes = null)
    {
        this._position = new _math_speedy_point__WEBPACK_IMPORTED_MODULE_0__["SpeedyPoint2"](+x, +y);
        this._lod = +lod;
        this._rotation = +rotation;
        this._score = +score;
        this._flags = flags | 0;
        this._extraBytes = extraBytes || noBytes;
        this._descriptorBytes = descriptorBytes || noBytes;
    }

    /**
     * Converts a SpeedyFeature to a representative string
     * @returns {string}
     */
    toString()
    {
        return `(${this.x},${this.y})`;
    }

    /**
     * The position of the feature point
     * @returns {SpeedyPoint2}
     */
    get position()
    {
        return this._position;
    }

    /**
     * X-position of the feature point
     * @returns {number}
     */
    get x()
    {
        return this._position.x;
    }

    /**
     * Y-position of the feature point
     * @returns {number}
     */
    get y()
    {
        return this._position.y;
    }

    /**
     * The pyramid level-of-detail from which
     * this feature point was extracted
     */
    get lod()
    {
        return this._lod;
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
     * Score: a cornerness measure
     * @returns {number} Score
     */
    get score()
    {
        return this._score;
    }

    /**
     * Internal flags
     * @returns {number}
     */
    get flags()
    {
        return this._flags;
    }

    /**
     * Descriptor data
     * @return {Uint8Array}
     */
    get descriptor()
    {
        return this._descriptorBytes;
    }
}

/***/ }),

/***/ "./src/core/speedy-media-source.js":
/*!*****************************************!*\
  !*** ./src/core/speedy-media-source.js ***!
  \*****************************************/
/*! exports provided: SpeedyMediaSource */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMediaSource", function() { return SpeedyMediaSource; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/types */ "./src/utils/types.js");
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
 * speedy-media-source.js
 * Wrappers around <img>, <video>, <canvas>, etc.
 */






/**
 * An abstract media source: a wrapper around native
 * elements such as: HTMLImageElement, HTMLVideoElement,
 * and so on
 * @abstract
 */
class SpeedyMediaSource
{
    /**
     * Constructor
     */
    constructor()
    {
        /** @type {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap} underlying media object */
        this._data = null;

        /** @type {number} media width, in pixels */
        this._width = 0;

        /** @type {number} media height, in pixels */
        this._height = 0;
    }

    /**
     * Load a media source
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap} wrapperObject
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    static load(wrappedObject)
    {
        const constructor = wrappedObject.constructor.name;

        if(constructor == 'HTMLImageElement')
            return new SpeedyImageMediaSource()._load(wrappedObject);
        else if(constructor == 'HTMLVideoElement')
            return new SpeedyVideoMediaSource()._load(wrappedObject);
        else if(constructor == 'HTMLCanvasElement')
            return new SpeedyCanvasMediaSource()._load(wrappedObject);
        else if(constructor == 'ImageBitmap')
            return new SpeedyBitmapMediaSource()._load(wrappedObject);
        else
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalArgumentError"](`Unsupported media type: ${wrappedObject}`);
    }

    /**
     * The underlying wrapped object
     * @returns {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap}
     */
    get data()
    {
        return this._data;
    }

    /**
     * Media width, in pixels
     * @returns {number}
     */
    get width()
    {
        return this._width;
    }

    /**
     * Media height, in pixels
     * @returns {number}
     */
    get height()
    {
        return this._height;
    }

    /**
     * Is the underlying media loaded?
     * @returns {boolean}
     */
    isLoaded()
    {
        return this._data !== null;
    }

    /**
     * The type of the underlying media source
     * @returns {Symbol} MediaType enum
     */
    get type()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["AbstractMethodError"]();
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["AbstractMethodError"]();
    }

    /**
     * Load the underlying media
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["AbstractMethodError"]();
    }

    /**
     * Wait for an event to be triggered in this._data
     * @param {Element} element
     * @param {string} eventName
     * @param {number} [timeout] in ms
     * @returns {SpeedyPromise<Element>}
     */
    _waitUntil(element, eventName, timeout = 30000)
    {
        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__["SpeedyPromise"]((resolve, reject) => {
            _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].log(`Waiting for ${eventName} to be triggered in ${element}...`);

            const timer = setTimeout(() => {
                reject(new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["TimeoutError"](`${eventName} has not been triggered in ${element}: timeout (${timeout}ms)`));
            }, timeout);

            element.addEventListener(eventName, () => {
                clearTimeout(timer);
                resolve(element);
            }, false);
        });
    }
}

/**
 * Image media source:
 * a wrapper around HTMLImageElement
 */
class SpeedyImageMediaSource extends SpeedyMediaSource
{
    /**
     * The type of the underlying media source
     * @returns {Symbol} MediaType enum
     */
    get type()
    {
        return _utils_types__WEBPACK_IMPORTED_MODULE_3__["MediaType"].Image;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`Media not loaded`);

        const newNode = this._data.cloneNode(true);
        const newSource = new SpeedyImageMediaSource();
        return newSource._load(newNode);
    }

    /**
     * Load the underlying media
     * @param {HTMLImageElement} image
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(image)
    {
        if(image.complete && image.naturalWidth !== 0) { // already loaded?
            return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__["SpeedyPromise"].resolve().then(() => {
                this._data = image;
                this._width = image.naturalWidth;
                this._height = image.naturalHeight;
                return this;
            });
        }
        else {
            return this._waitUntil(image, 'load').then(() => {
                this._data = image;
                this._width = image.naturalWidth;
                this._height = image.naturalHeight;
                return this;
            });
        }
    }
}

/**
 * Video media source:
 * a wrapper around HTMLVideoElement
 */
class SpeedyVideoMediaSource extends SpeedyMediaSource
{
    /**
     * The type of the underlying media source
     * @returns {Symbol} MediaType enum
     */
    get type()
    {
        return _utils_types__WEBPACK_IMPORTED_MODULE_3__["MediaType"].Video;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`Media not loaded`);

        const newNode = this._data.cloneNode(true);
        const newSource = new SpeedyVideoMediaSource();
        return newSource._load(newNode);
    }

    /**
     * Load the underlying media
     * @param {HTMLVideoElement} video
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(video)
    {
        if(video.readyState >= 4) { // already loaded?
            return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__["SpeedyPromise"].resolve().then(() => {
                this._data = video;
                this._width = video.videoWidth;
                this._height = video.videoHeight;
                return this;
            });
        }
        else {
            // waitUntil('canplay'); // use readyState >= 3
            return this._waitUntil(video, 'canplaythrough').then(() => {
                this._data = video;
                this._width = video.videoWidth;
                this._height = video.videoHeight;
                return this;
            })
        }
    }
}

/**
 * Canvas media source:
 * a wrapper around HTMLCanvasElement
 */
class SpeedyCanvasMediaSource extends SpeedyMediaSource
{
    /**
     * The type of the underlying media source
     * @returns {Symbol} MediaType enum
     */
    get type()
    {
        return _utils_types__WEBPACK_IMPORTED_MODULE_3__["MediaType"].Canvas;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`Media not loaded`);

        const newCanvas = _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].createCanvas(this._width, this._height);
        const newContext = newCanvas.getContext('2d');
        newContext.draw(this._data, 0, 0);

        const newSource = new SpeedyCanvasMediaSource();
        return newSource._load(newCanvas);
    }

    /**
     * Load the underlying media
     * @param {HTMLCanvasElement} canvas
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(canvas)
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__["SpeedyPromise"].resolve().then(() => {
            this._data = canvas;
            this._width = canvas.width;
            this._height = canvas.height;
            return this;
        });
    }
}

/**
 * Bitmap media source:
 * a wrapper around ImageBitmap
 */
class SpeedyBitmapMediaSource extends SpeedyMediaSource
{
    /**
     * The type of the underlying media source
     * @returns {Symbol} MediaType enum
     */
    get type()
    {
        return _utils_types__WEBPACK_IMPORTED_MODULE_3__["MediaType"].Bitmap;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`Media not loaded`);

        const newSource = new SpeedyBitmapMediaSource();
        return createImageBitmap(this._data).then(
            newBitmap => newSource._load(newBitmap)
        );
    }

    /**
     * Load the underlying media
     * @param {ImageBitmap} bitmap
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(bitmap)
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__["SpeedyPromise"].resolve().then(() => {
            this._data = bitmap;
            this._width = bitmap.width;
            this._height = bitmap.height;
            return this;
        });
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
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _speedy_media_source__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./speedy-media-source */ "./src/core/speedy-media-source.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
     * Constructor. It receives a VALID media source that is ALREADY LOADED.
     * @private
     * @param {SpeedyMediaSource} source
     * @param {object} [options] options object
     * @param {ColorFormat} [colorFormat]
     */
    constructor(source, options = {}, colorFormat = _utils_types__WEBPACK_IMPORTED_MODULE_2__["ColorFormat"].RGB)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].assert(source.isLoaded());

        /** @type {SpeedyMediaSource} media source */
        this._source = source;

        /** @type {object} options */
        this._options = this._buildOptions(options, {
            usage: (this._source.type == _utils_types__WEBPACK_IMPORTED_MODULE_2__["MediaType"].Video) ? 'dynamic' : 'static',
        });

        /** @type {ColorFormat} color format */
        this._colorFormat = colorFormat;

        /** @type {SpeedyGPU} GPU-accelerated routines */ // FIXME
        this._gpu = options.lightweight ? Object.create(null) : new _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_0__["SpeedyGPU"](this._source.width, this._source.height);

        // warning: loading a canvas without an explicit usage flag
        if(this._source.type == _utils_types__WEBPACK_IMPORTED_MODULE_2__["MediaType"].Canvas && this._options.usage === undefined)
            _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].warning('Loading a canvas without an explicit usage flag. I will set the usage to "static". This will result in suboptimal performance if the canvas is animated');
    }

    /**
     * Load a media source
     * Will wait until the HTML media source is loaded
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap} mediaSource An image, video or canvas
     * @param {object} [options] options object
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static load(mediaSource, options = { })
    {
        return _speedy_media_source__WEBPACK_IMPORTED_MODULE_5__["SpeedyMediaSource"].load(mediaSource).then(source => {
            _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].assert(source.width !== 0 && source.height !== 0);

            const media = new SpeedyMedia(source, options);
            _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].log(`Loaded SpeedyMedia with a ${mediaSource}.`);

            return media;
        });
    }

    /**
     * Loads a camera stream
     * @param {number} width width of the stream
     * @param {number} height height of the stream
     * @param {object} [cameraOptions] additional options to pass to getUserMedia()
     * @param {object} [mediaOptions] additional options for advanced configuration of the SpeedyMedia
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static loadCameraStream(width, height, cameraOptions = { }, mediaOptions = { })
    {
        return _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].requestCameraStream(width, height, cameraOptions).then(
            video => SpeedyMedia.load(video, mediaOptions)
        );
    }

    /**
     * The media element (image, video, canvas) encapsulated by this SpeedyMedia object
     * @returns {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap} the media element
     */
    get source()
    {
        return this._source.data;
    }

    /**
     * Gets the width of the media
     * @returns {number} media width
     */
    get width()
    {
        return this._source.width;
    }

    /**
     * Gets the height of the media
     * @returns {number} media height
     */
    get height()
    {
        return this._source.height;
    }

    /**
     * The type of the media attached to this SpeedyMedia object
     * @returns {string} "image" | "video" | "canvas" | "bitmap"
     */
    get type()
    {
        switch(this._source.type) {
            case _utils_types__WEBPACK_IMPORTED_MODULE_2__["MediaType"].Image:
                return 'image';

            case _utils_types__WEBPACK_IMPORTED_MODULE_2__["MediaType"].Video:
                return 'video';

            case _utils_types__WEBPACK_IMPORTED_MODULE_2__["MediaType"].Canvas:
                return 'canvas';

            case _utils_types__WEBPACK_IMPORTED_MODULE_2__["MediaType"].Bitmap:
                return 'bitmap';

            default: // this shouldn't happen
                return 'unknown';
        }
    }

    /**
     * Returns a read-only object featuring advanced options
     * related to this SpeedyMedia object
     * @returns {object}
     */
    get options()
    {
        return this._options;
    }

    /**
     * Releases resources associated with this media
     * @returns {null}
     */
    release()
    {
        if(!this.isReleased()) {
            _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].log('Releasing SpeedyMedia object...');
            this._gpu = this._gpu.release();
        }

        return null;
    }

    /**
     * Has this media been released?
     * @returns {boolean}
     */
    isReleased()
    {
        return this._gpu == null;
    }

    /**
     * Clones the SpeedyMedia object
     * @returns {SpeedyPromise<SpeedyMedia>} a clone object
     */
    clone()
    {
        // has the media been released?
        if(this.isReleased())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["IllegalOperationError"](`Can't clone a SpeedyMedia that has been released`);

        // clone the object
        const clone = new SpeedyMedia(this._source, this.options, this._colorFormat);

        // done!
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_6__["SpeedyPromise"].resolve(clone);
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
        // fail silently if the media been released
        if(this.isReleased())
            return;

        // validate parameters
        width = Math.max(+width, 0);
        height = Math.max(+height, 0);

        // draw
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this._source.data, +x, +y, width, height);
    }

    /**
     * Converts the media to an ImageBitmap
     * @returns {SpeedyPromise<ImageBitmap>}
     */
    toBitmap()
    {
        if(this.isReleased())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["IllegalOperationError"]('Can\'t convert SpeedyMedia to ImageBitmap: the media has been released');
        else if(!this._source.isLoaded())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["IllegalOperationError"]('Can\'t convert SpeedyMedia to bitmap: the media hasn\'t been loaded');

        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_6__["SpeedyPromise"]((resolve, reject) => createImageBitmap(this._source.data).then(resolve, reject));
    }

    /**
     * Build & validate options object
     * @param {object} options
     * @param {object} defaultOptions
     * @returns {object}
     */
    _buildOptions(options, defaultOptions)
    {
        // build options object
        options = Object.assign({ }, defaultOptions, options);

        // validate
        if(options.usage != 'dynamic' && options.usage != 'static') {
            _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].warning(`Can't load media. Unrecognized usage option: "${options.usage}"`);
            options.usage = defaultOptions.usage;
            _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].assert(options.usage == 'dynamic' || options.usage == 'static');
        }

        // done!
        return Object.freeze(options); // must be read-only
    }

    /**
     * Upload the media to the GPU
     * @returns {SpeedyTexture}
     */
    _upload()
    {
        return this._gpu.upload(this._source);
    }
}

/***/ }),

/***/ "./src/core/speedy-namespace.js":
/*!**************************************!*\
  !*** ./src/core/speedy-namespace.js ***!
  \**************************************/
/*! exports provided: SpeedyNamespace */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyNamespace", function() { return SpeedyNamespace; });
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * speedy-namespace.js
 * Symbolizes a namespace
 */



/**
 * An abstract namespace
 * @abstract
 */
class SpeedyNamespace
{
    /**
     * Namespaces can't be instantiated.
     * Only static methods are allowed.
     * @throws SpeedyError
     */
    constructor()
    {
        // only static methods are allowed
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__["AbstractMethodError"](`Namespaces can't be instantiated`);
    }
}

/***/ }),

/***/ "./src/core/speedy.js":
/*!****************************!*\
  !*** ./src/core/speedy.js ***!
  \****************************/
/*! exports provided: Speedy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Speedy", function() { return Speedy; });
/* harmony import */ var _speedy_media__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-media */ "./src/core/speedy-media.js");
/* harmony import */ var _utils_fps_counter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/fps-counter */ "./src/utils/fps-counter.js");
/* harmony import */ var _speedy_feature_detector_factory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./speedy-feature-detector-factory */ "./src/core/speedy-feature-detector-factory.js");
/* harmony import */ var _speedy_feature_tracker_factory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./speedy-feature-tracker-factory */ "./src/core/speedy-feature-tracker-factory.js");
/* harmony import */ var _speedy_feature_descriptor_factory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./speedy-feature-descriptor-factory */ "./src/core/speedy-feature-descriptor-factory.js");
/* harmony import */ var _speedy_flags__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./speedy-flags */ "./src/core/speedy-flags.js");
/* harmony import */ var _math_speedy_vector__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./math/speedy-vector */ "./src/core/math/speedy-vector.js");
/* harmony import */ var _math_speedy_point__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./math/speedy-point */ "./src/core/math/speedy-point.js");
/* harmony import */ var _math_speedy_size__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./math/speedy-size */ "./src/core/math/speedy-size.js");
/* harmony import */ var _math_matrix_expression_factory__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./math/matrix-expression-factory */ "./src/core/math/matrix-expression-factory.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _pipeline_factories_pipeline_factory__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./pipeline/factories/pipeline-factory */ "./src/core/pipeline/factories/pipeline-factory.js");
/* harmony import */ var _pipeline_factories_filter_factory__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./pipeline/factories/filter-factory */ "./src/core/pipeline/factories/filter-factory.js");
/* harmony import */ var _pipeline_factories_transform_factory__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./pipeline/factories/transform-factory */ "./src/core/pipeline/factories/transform-factory.js");
/* harmony import */ var _pipeline_factories_keypoint_factory__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./pipeline/factories/keypoint-factory */ "./src/core/pipeline/factories/keypoint-factory.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../utils/globals */ "./src/utils/globals.js");
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
 * speedy.js
 * Speedy's main class
 */



















// Constants
const matrixExprFactory = new _math_matrix_expression_factory__WEBPACK_IMPORTED_MODULE_9__["SpeedyMatrixExprFactory"]();
const pipelineFactory = new _pipeline_factories_pipeline_factory__WEBPACK_IMPORTED_MODULE_11__["SpeedyPipelineFactory"]();

/**
 * Speedy's main class
 */
class Speedy
{
    /**
     * Loads a SpeedyMedia object based on the provided source element
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} sourceElement The source media
     * @param {object} [options] Additional options for advanced configuration
     * @returns {Promise<SpeedyMedia>}
     */
    static load(sourceElement, options = { })
    {
        return _speedy_media__WEBPACK_IMPORTED_MODULE_0__["SpeedyMedia"].load(sourceElement, options);
    }

    /**
     * Loads a camera stream
     * @param {number} [width] width of the stream
     * @param {number} [height] height of the stream
     * @param {object} [cameraOptions] additional options to pass to getUserMedia()
     * @param {object} [mediaOptions] additional options for advanced configuration of the SpeedyMedia
     * @returns {Promise<SpeedyMedia>}
     */
    static camera(width = 640, height = 360, cameraOptions = {}, mediaOptions = {})
    {
        return _speedy_media__WEBPACK_IMPORTED_MODULE_0__["SpeedyMedia"].loadCameraStream(width, height, cameraOptions, mediaOptions);
    }

    /**
     * The version of the library
     * @returns {string} The version of the library
     */
    static get version()
    {
        return "0.7.0-wip";
    }

    /**
     * The FPS rate
     * @returns {number} Frames per second (FPS)
     */
    static get fps()
    {
        return _utils_fps_counter__WEBPACK_IMPORTED_MODULE_1__["FPSCounter"].instance.fps;
    }

    /**
     * Feature detectors
     * @returns {SpeedyFeatureDetectorFactory}
     */
    static get FeatureDetector()
    {
        return _speedy_feature_detector_factory__WEBPACK_IMPORTED_MODULE_2__["SpeedyFeatureDetectorFactory"];
    }

    /**
     * Feature trackers
     * @returns {SpeedyFeatureTrackerFactory}
     */
    static get FeatureTracker()
    {
        return _speedy_feature_tracker_factory__WEBPACK_IMPORTED_MODULE_3__["SpeedyFeatureTrackerFactory"];
    }

    /**
     * Feature descriptors
     * @returns {SpeedyFeatureDescriptorFactory}
     */
    static get FeatureDescriptor()
    {
        return _speedy_feature_descriptor_factory__WEBPACK_IMPORTED_MODULE_4__["SpeedyFeatureDescriptorFactory"];
    }

    /**
     * Create a 2D vector
     * @param {number} x
     * @param {number} y
     */
    static Vector2(x, y)
    {
        return new _math_speedy_vector__WEBPACK_IMPORTED_MODULE_6__["SpeedyVector2"](x, y);
    }

    /**
     * Create a 2D point
     * @param {number} x
     * @param {number} y
     */
    static Point2(x, y)
    {
        return new _math_speedy_point__WEBPACK_IMPORTED_MODULE_7__["SpeedyPoint2"](x, y);
    }

    /**
     * Create a new size object
     * @param {number} width
     * @param {number} height
     */
    static Size(width, height)
    {
        return new _math_speedy_size__WEBPACK_IMPORTED_MODULE_8__["SpeedySize"](width, height);
    }

    /**
     * Matrix routines
     * @returns {SpeedyMatrixExprFactory}
     */
    static get Matrix()
    {
        return matrixExprFactory;
    }

    /**
     * Speedy Promises
     * @returns {Function}
     */
    static get Promise()
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_10__["SpeedyPromise"];
    }

    /**
     * Speedy Pipeline
     * @returns {SpeedyPipelineFactory}
     */
    static get Pipeline()
    {
        return pipelineFactory;
    }

    /**
     * Image filters
     * @returns {Function}
     */
    static get Filter()
    {
        return _pipeline_factories_filter_factory__WEBPACK_IMPORTED_MODULE_12__["SpeedyPipelineFilterFactory"];
    }

    /**
     * Image transforms
     * @returns {Function}
     */
    static get Transform()
    {
        return _pipeline_factories_transform_factory__WEBPACK_IMPORTED_MODULE_13__["SpeedyPipelineTransformFactory"];
    }

    /**
     * Keypoint-related nodes
     * @returns {Function}
     */
    static get Keypoint()
    {
        return _pipeline_factories_keypoint_factory__WEBPACK_IMPORTED_MODULE_14__["SpeedyPipelineKeypointFactory"];
    }
}

// Mix SpeedyFlags with Speedy
Object.assign(Speedy.constructor.prototype, _speedy_flags__WEBPACK_IMPORTED_MODULE_5__["SpeedyFlags"]);

// Big-endian machine? Currently untested.
if(!_utils_globals__WEBPACK_IMPORTED_MODULE_16__["LITTLE_ENDIAN"])
    _utils_utils__WEBPACK_IMPORTED_MODULE_15__["Utils"].warn('Running on a big-endian machine');

/***/ }),

/***/ "./src/gpu/gl-utils.js":
/*!*****************************!*\
  !*** ./src/gpu/gl-utils.js ***!
  \*****************************/
/*! exports provided: GLUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GLUtils", function() { return GLUtils; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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







//
// Constants
//
const isFirefox = navigator.userAgent.includes('Firefox');



/**
 * WebGL Utilities
 */
class GLUtils
{
    /**
     * Get an error object describing the latest WebGL error
     * @param {WebGL2RenderingContext} gl 
     * @returns {GLError}
     */
    static getError(gl)
    {
        const recognizedErrors = [
            'NO_ERROR',
            'INVALID_ENUM',
            'INVALID_VALUE',
            'INVALID_OPERATION',
            'INVALID_FRAMEBUFFER_OPERATION',
            'OUT_OF_MEMORY',
            'CONTEXT_LOST_WEBGL',
        ];

        const glError = gl.getError();
        const message = recognizedErrors.find(error => gl[error] == glError) || 'Unknown';
        return new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["GLError"](message);
    }

    /**
     * Waits for a sync object to become signaled
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLSync} sync sync object
     * @param {GLbitfield} [flags] may be gl.SYNC_FLUSH_COMMANDS_BIT or 0
     * @returns {SpeedyPromise} a promise that resolves as soon as the sync object becomes signaled
     */
    static clientWaitAsync(gl, sync, flags = 0)
    {
        this._checkStatus = this._checkStatus || (this._checkStatus = function checkStatus(gl, sync, flags, resolve, reject) {
            const status = gl.clientWaitSync(sync, flags, 0);
            if(status == gl.TIMEOUT_EXPIRED) {
                _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].setZeroTimeout(() => checkStatus.call(this, gl, sync, flags, resolve, reject)); // better performance (preferred)
                //setTimeout(() => checkStatus.call(this, gl, sync, flags, resolve, reject), 0); // easier on the CPU
            }
            else if(status == gl.WAIT_FAILED) {
                if(isFirefox && gl.getError() == gl.NO_ERROR) { // firefox bug?
                    _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].setZeroTimeout(() => checkStatus.call(this, gl, sync, flags, resolve, reject));
                    //setTimeout(() => checkStatus.call(this, gl, sync, flags, resolve, reject), 0);
                }
                else {
                    reject(GLUtils.getError(gl));
                }
            }
            else {
                resolve();
            }
        });

        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__["SpeedyPromise"]((resolve, reject) => {
            this._checkStatus(gl, sync, flags, resolve, reject);
        });
    }

    /**
     * Reads data from a WebGLBuffer into an ArrayBufferView
     * This is like gl.getBufferSubData(), but async
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLBuffer} glBuffer will be bound to target
     * @param {GLenum} target
     * @param {GLintptr} srcByteOffset usually 0
     * @param {ArrayBufferView} destBuffer
     * @param {GLuint} [destOffset]
     * @param {GLuint} [length]
     * @returns {SpeedyPromise<number>} a promise that resolves to the time it took to read the data (in ms)
     */
    static getBufferSubDataAsync(gl, glBuffer, target, srcByteOffset, destBuffer, destOffset = 0, length = 0)
    {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        const start = performance.now();

        // empty internal command queues and send them to the GPU asap
        gl.flush(); // make sure the sync command is read

        // wait for the commands to be processed by the GPU
        return GLUtils.clientWaitAsync(gl, sync).then(() => {
            gl.bindBuffer(target, glBuffer);
            gl.getBufferSubData(target, srcByteOffset, destBuffer, destOffset, length);
            gl.bindBuffer(target, null);
            return performance.now() - start;
        }).catch(err => {
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`Can't getBufferSubDataAsync(): error in clientWaitAsync()`, err);
        }).finally(() => {
            gl.deleteSync(sync);
        });
    }
}

/***/ }),

/***/ "./src/gpu/programs/colors.js":
/*!************************************!*\
  !*** ./src/gpu/programs/colors.js ***!
  \************************************/
/*! exports provided: GPUColors */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GPUColors", function() { return GPUColors; });
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * Color routines & conversion algorithms
 */






//
// Shaders
//

// Convert to greyscale
const rgb2grey = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('colors/rgb2grey.glsl').withArguments('image');




/**
 * GPUColors
 * Color routines & conversion algorithms
 */
class GPUColors extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgramGroup"]
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            // convert to greyscale
            .declare('rgb2grey', rgb2grey)
        ;
    }
}

/***/ }),

/***/ "./src/gpu/programs/encoders.js":
/*!**************************************!*\
  !*** ./src/gpu/programs/encoders.js ***!
  \**************************************/
/*! exports provided: GPUEncoders */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GPUEncoders", function() { return GPUEncoders; });
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _speedy_texture_reader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../speedy-texture-reader */ "./src/gpu/speedy-texture-reader.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _core_speedy_feature__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../core/speedy-feature */ "./src/core/speedy-feature.js");
/* harmony import */ var _core_keypoints_feature_encoder__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../core/keypoints/feature-encoder */ "./src/core/keypoints/feature-encoder.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../utils/globals */ "./src/utils/globals.js");
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
 * encoders.js
 * Texture encoders
 */












// Constants
const MIN_PIXELS_PER_KEYPOINT = _utils_globals__WEBPACK_IMPORTED_MODULE_9__["MIN_KEYPOINT_SIZE"] / 4; // encodes a keypoint header
const UBO_MAX_BYTES = 16384; // UBOs can hold at least 16KB of data: gl.MAX_UNIFORM_BLOCK_SIZE >= 16384 according to the GL ES 3 reference
const KEYPOINT_BUFFER_LENGTH = (UBO_MAX_BYTES / 16) | 0; // maximum number of keypoints that can be uploaded to the GPU via UBOs (each keypoint uses 16 bytes)
const ENCODER_PASSES = 8; // number of passes of the keypoint encoder: directly impacts performance
const LONG_SKIP_OFFSET_PASSES = 2; // number of passes of the long skip offsets shader
const MAX_SKIP_OFFSET_ITERATIONS = [ 32, 32 ]; // used when computing skip offsets




//
// Shaders
//

// encode keypoint offsets: maxIterations is an experimentally determined integer
const encodeKeypointSkipOffsets = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_3__["importShader"])('encoders/encode-keypoint-offsets.glsl')
                                 .withArguments('image', 'imageSize')
                                 .withDefines({ 'MAX_ITERATIONS': MAX_SKIP_OFFSET_ITERATIONS[0] });

// encode long offsets for improved performance
const encodeKeypointLongSkipOffsets = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_3__["importShader"])('encoders/encode-keypoint-long-offsets.glsl')
                                     .withArguments('offsetsImage', 'imageSize')
                                     .withDefines({ 'MAX_ITERATIONS': MAX_SKIP_OFFSET_ITERATIONS[1] });

// encode keypoints
const encodeKeypoints = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_3__["importShader"])('encoders/encode-keypoints.glsl')
                       .withArguments('offsetsImage', 'encodedKeypoints', 'imageSize', 'passId', 'numPasses', 'descriptorSize', 'extraSize', 'encoderLength');

// resize encoded keypoints
const resizeEncodedKeypoints = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_3__["importShader"])('encoders/resize-encoded-keypoints.glsl')
                              .withArguments('inputTexture', 'inputDescriptorSize', 'inputExtraSize', 'inputEncoderLength', 'outputDescriptorSize', 'outputExtraSize', 'outputEncoderLength');

// helper for downloading the keypoints
const downloadKeypoints = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_3__["importShader"])('utils/identity.glsl')
                         .withArguments('image');

// upload keypoints via UBO
const uploadKeypoints = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_3__["importShader"])('encoders/upload-keypoints.glsl')
                       .withArguments('keypointCount', 'encoderLength', 'descriptorSize', 'extraSize')
                       .withDefines({
                           'KEYPOINT_BUFFER_LENGTH': KEYPOINT_BUFFER_LENGTH
                       });




/**
 * GPUEncoders
 * Keypoint encoding
 */
class GPUEncoders extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgramGroup"]
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            // encode skip offsets
            .declare('_encodeKeypointSkipOffsets', encodeKeypointSkipOffsets)
            .declare('_encodeKeypointLongSkipOffsets', encodeKeypointLongSkipOffsets, {
                ...this.program.usesPingpongRendering()
            })

            // tiny textures
            .declare('_encodeKeypoints', encodeKeypoints, {
                ...this.program.hasTextureSize(_utils_globals__WEBPACK_IMPORTED_MODULE_9__["INITIAL_ENCODER_LENGTH"], _utils_globals__WEBPACK_IMPORTED_MODULE_9__["INITIAL_ENCODER_LENGTH"]),
                ...this.program.usesPingpongRendering()
            })
            .declare('_resizeEncodedKeypoints', resizeEncodedKeypoints, {
                ...this.program.hasTextureSize(_utils_globals__WEBPACK_IMPORTED_MODULE_9__["INITIAL_ENCODER_LENGTH"], _utils_globals__WEBPACK_IMPORTED_MODULE_9__["INITIAL_ENCODER_LENGTH"])
            })
            .declare('_downloadEncodedKeypoints', downloadKeypoints, {
                ...this.program.hasTextureSize(_utils_globals__WEBPACK_IMPORTED_MODULE_9__["INITIAL_ENCODER_LENGTH"], _utils_globals__WEBPACK_IMPORTED_MODULE_9__["INITIAL_ENCODER_LENGTH"])
            })
            .declare('_uploadKeypoints', uploadKeypoints, {
                ...this.program.hasTextureSize(_utils_globals__WEBPACK_IMPORTED_MODULE_9__["INITIAL_ENCODER_LENGTH"], _utils_globals__WEBPACK_IMPORTED_MODULE_9__["INITIAL_ENCODER_LENGTH"])
            })
        ;



        // setup internal data

        /** @type {SpeedyTextureReader} Texture Reader */
        this._textureReader = new _speedy_texture_reader__WEBPACK_IMPORTED_MODULE_2__["SpeedyTextureReader"]();

        /** @type {Float32Array} UBO stuff */
        this._uploadBuffer = null; // lazy spawn
    }

    /**
     * Encodes the keypoints of an image into a compressed texture
     * @param {SpeedyTexture} corners texture with corners
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     * @returns {SpeedyDrawableTexture} texture with encoded keypoints
     */
    encodeKeypoints(corners, descriptorSize, extraSize, encoderLength)
    {
        // parameters
        const imageSize = [ this._width, this._height ];

        // encode skip offsets
        let offsets = this._encodeKeypointSkipOffsets(corners, imageSize);
        for(let i = 0; i < LONG_SKIP_OFFSET_PASSES; i++) // meant to boost performance
            offsets = this._encodeKeypointLongSkipOffsets(offsets, imageSize);

        /*
        // debug: view corners
        let cornerview = corners;
        cornerview = this._gpu.programs.utils.fillComponents(cornerview, PixelComponent.GREEN, 0);
        cornerview = this._gpu.programs.utils.identity(cornerview);
        cornerview = this._gpu.programs.utils.fillComponents(cornerview, PixelComponent.ALPHA, 1);
        this._gpu.renderToCanvas(cornerview);
        if(!window._ww) document.body.appendChild(this._gpu.canvas);
        window._ww = 1;
        */

        // encode keypoints
        const numPasses = ENCODER_PASSES;
        const pixelsPerKeypointHeader = MIN_PIXELS_PER_KEYPOINT;
        const keypointCapacity = _core_keypoints_feature_encoder__WEBPACK_IMPORTED_MODULE_5__["FeatureEncoder"].capacity(descriptorSize, extraSize, encoderLength);
        const headerEncoderLength = Math.max(1, Math.ceil(Math.sqrt(keypointCapacity * pixelsPerKeypointHeader)));
        this._encodeKeypoints.setOutputSize(headerEncoderLength, headerEncoderLength);
        let encodedKeypointHeaders = this._encodeKeypoints.clear();
        for(let passId = 0; passId < numPasses; passId++)
            encodedKeypointHeaders = this._encodeKeypoints(offsets, encodedKeypointHeaders, imageSize, passId, numPasses, 0, 0, headerEncoderLength);

        // transfer keypoints to a elastic tiny texture with storage for descriptors & extra data
        this._resizeEncodedKeypoints.setOutputSize(encoderLength, encoderLength);
        return this._resizeEncodedKeypoints(encodedKeypointHeaders, 0, 0, headerEncoderLength, descriptorSize, extraSize, encoderLength);
    }

    /**
     * Download RAW encoded keypoint data from the GPU - this is a bottleneck!
     * @param {SpeedyTexture} encodedKeypoints texture with keypoints that have already been encoded
     * @param {boolean} [useBufferedDownloads] download keypoints detected in the previous framestep (optimization)
     * @returns {SpeedyPromise<Uint8Array[]>} pixels in the [r,g,b,a, ...] format
     */
    downloadEncodedKeypoints(encodedKeypoints, useBufferedDownloads = true)
    {
        // helper shader
        if(!(encodedKeypoints instanceof _speedy_texture__WEBPACK_IMPORTED_MODULE_1__["SpeedyDrawableTexture"])) {
            this._downloadEncodedKeypoints.setOutputSize(encodedKeypoints.width, encodedKeypoints.height);
            encodedKeypoints = this._downloadEncodedKeypoints(encodedKeypoints);
        }

        // read data from the GPU
        return this._textureReader.readPixelsAsync(encodedKeypoints, useBufferedDownloads).catch(err =>
            new _utils_errors__WEBPACK_IMPORTED_MODULE_8__["IllegalOperationError"](`Can't download the encoded keypoint texture`, err)
        );
    }

    /**
     * Upload keypoints to the GPU
     * The descriptor & orientation of the keypoints will be lost
     * (need to recalculate)
     * @param {SpeedyFeature[]} keypoints
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     * @returns {SpeedyDrawableTexture} encodedKeypoints
     */
    uploadKeypoints(keypoints, descriptorSize, extraSize, encoderLength)
    {
        // Too many keypoints?
        const keypointCount = keypoints.length;
        if(keypointCount > KEYPOINT_BUFFER_LENGTH) {
            // TODO: multipass
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__["NotSupportedError"](`Can't upload ${keypointCount} keypoints: maximum is currently ${KEYPOINT_BUFFER_LENGTH}`);
        }

        // Insufficient encoderLength?
        if(encoderLength < _core_keypoints_feature_encoder__WEBPACK_IMPORTED_MODULE_5__["FeatureEncoder"].minLength(keypointCount, descriptorSize, extraSize))
            _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].warning(`Insufficient encoderLength (${encoderLength}) for ${keypoints.length} keypoints (descriptorSize: ${descriptorSize}, extraSize: ${extraSize})`);

        // Create a buffer for uploading the data
        if(this._uploadBuffer === null) {
            const sizeofVec4 = Float32Array.BYTES_PER_ELEMENT * 4; // 16
            const internalBuffer = new ArrayBuffer(sizeofVec4 * KEYPOINT_BUFFER_LENGTH);
            _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(internalBuffer.byteLength <= UBO_MAX_BYTES);
            this._uploadBuffer = new Float32Array(internalBuffer);
        }

        // Format data as follows: (xpos, ypos, lod, score)
        for(let i = 0; i < keypointCount; i++) {
            const keypoint = keypoints[i];
            const j = i * 4;

            // this will be uploaded into a vec4
            this._uploadBuffer[j]   = +(keypoint.x) || 0;
            this._uploadBuffer[j+1] = +(keypoint.y) || 0;
            this._uploadBuffer[j+2] = +(keypoint.lod) || 0;
            this._uploadBuffer[j+3] = +(keypoint.score) || 0;
        }

        // Upload data
        this._uploadKeypoints.setOutputSize(encoderLength, encoderLength);
        this._uploadKeypoints.setUBO('KeypointBuffer', this._uploadBuffer);
        return this._uploadKeypoints(keypointCount, encoderLength, descriptorSize, extraSize);
    }
}

/***/ }),

/***/ "./src/gpu/programs/enhancements.js":
/*!******************************************!*\
  !*** ./src/gpu/programs/enhancements.js ***!
  \******************************************/
/*! exports provided: GPUEnhancements */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GPUEnhancements", function() { return GPUEnhancements; });
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shaders/filters/convolution */ "./src/gpu/shaders/filters/convolution.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * enhancements.js
 * Image enhancement methods
 */









//
// Shaders
//

// Normalize image
const normalizeGreyscaleImage = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('enhancements/normalize-image.glsl')
                               .withArguments('minmax2d', 'minValue', 'maxValue')
                               .withDefines({ 'GREYSCALE': 1 });
const normalizeColoredImage = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('enhancements/normalize-image.glsl')
                             .withArguments('minmax2dRGB', 'minValue', 'maxValue');

// Nightvision
const nightvision = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('enhancements/nightvision.glsl')
                   .withArguments('image', 'illuminationMap', 'gain', 'offset', 'decay');
const nightvisionGreyscale = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('enhancements/nightvision.glsl')
                            .withArguments('image', 'illuminationMap', 'gain', 'offset', 'decay')
                            .withDefines({ 'GREYSCALE': 1 });




/**
 * GPUEnhancements
 * Image enhancement algorithms
 */
class GPUEnhancements extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgramGroup"]
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            // normalize a greyscale image
            .declare('_normalizeGreyscaleImage', normalizeGreyscaleImage)

            // normalize a colored image
            .declare('_normalizeColoredImage', normalizeColoredImage)

            // nightvision
            .declare('_nightvision', nightvision)
            .declare('_nightvisionGreyscale', nightvisionGreyscale)
            .compose('_illuminationMapLo', '_illuminationMapLoX', '_illuminationMapLoY')
            .declare('_illuminationMapLoX', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])(_utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].gaussianKernel(80, 31)))
            .declare('_illuminationMapLoY', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])(_utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].gaussianKernel(80, 31)))
            .compose('_illuminationMap', '_illuminationMapX', '_illuminationMapY')
            .declare('_illuminationMapX', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])(_utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].gaussianKernel(80, 63)))
            .declare('_illuminationMapY', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])(_utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].gaussianKernel(80, 63)))
            .compose('_illuminationMapHi', '_illuminationMapHiX', '_illuminationMapHiY')
            .declare('_illuminationMapHiX', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])(_utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].gaussianKernel(80, 255)))
            .declare('_illuminationMapHiY', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])(_utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].gaussianKernel(80, 255)))
        ;
    }

    /**
     * Normalize a greyscale image
     * @param {SpeedyTexture} image greyscale image (RGB components are the same)
     * @param {number} [minValue] minimum desired pixel intensity (from 0 to 255, inclusive)
     * @param {number} [maxValue] maximum desired pixel intensity (from 0 to 255, inclusive)
     * @returns {SpeedyTexture}
     */
    normalizeGreyscaleImage(image, minValue = 0, maxValue = 255)
    {
        const gpu = this._gpu;
        const minmax2d = gpu.programs.utils._scanMinMax(image, _utils_types__WEBPACK_IMPORTED_MODULE_3__["PixelComponent"].GREEN);
        return this._normalizeGreyscaleImage(minmax2d, Math.min(minValue, maxValue), Math.max(minValue, maxValue));
    }

    /**
     * Normalize a RGB image
     * @param {SpeedyTexture} image
     * @param {number} [minValue] minimum desired pixel intensity (from 0 to 255, inclusive)
     * @param {number} [maxValue] maximum desired pixel intensity (from 0 to 255, inclusive)
     * @returns {SpeedyTexture}
     */
    normalizeColoredImage(image, minValue = 0, maxValue = 255)
    {
        const gpu = this._gpu;
        
        // TODO: normalize on a luminance channel instead (e.g., use HSL color space)
        const minmax2d = new Array(3);
        minmax2d[0] = gpu.programs.utils._scanMinMax(image, _utils_types__WEBPACK_IMPORTED_MODULE_3__["PixelComponent"].RED).clone();
        minmax2d[1] = gpu.programs.utils._scanMinMax(image, _utils_types__WEBPACK_IMPORTED_MODULE_3__["PixelComponent"].GREEN).clone();
        minmax2d[2] = gpu.programs.utils._scanMinMax(image, _utils_types__WEBPACK_IMPORTED_MODULE_3__["PixelComponent"].BLUE);

        const normalized = this._normalizeColoredImage(minmax2d, Math.min(minValue, maxValue), Math.max(minValue, maxValue));

        minmax2d[1].release();
        minmax2d[0].release();

        return normalized;
    }

    /**
     * Nightvision filter: "see in the dark"
     * @param {SpeedyTexture} image
     * @param {number} [gain] typically in [0,1]; higher values => higher contrast
     * @param {number} [offset] brightness, typically in [0,1]
     * @param {number} [decay] gain decay, in the [0,1] range
     * @param {string} [quality] "high" | "medium" | "low" (more quality -> more expensive)
     * @param {boolean} [greyscale] use the greyscale variant of the algorithm
     * @returns {SpeedyTexture}
     */
    nightvision(image, gain = 0.5, offset = 0.5, decay = 0.0, quality = 'medium', greyscale = false)
    {
        // compute illumination map
        let illuminationMap = null;
        if(quality == 'medium')
            illuminationMap = this._illuminationMap(image);
        else if(quality == 'high')
            illuminationMap = this._illuminationMapHi(image);
        else if(quality == 'low')
            illuminationMap = this._illuminationMapLo(image);
        else
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`Invalid quality level for nightvision: "${quality}"`);

        // run nightvision
        const strategy = greyscale ? this._nightvisionGreyscale : this._nightvision;
        const enhancedImage = strategy(image, illuminationMap, gain, offset, decay);
        return enhancedImage;
    }
}

/***/ }),

/***/ "./src/gpu/programs/filters.js":
/*!*************************************!*\
  !*** ./src/gpu/programs/filters.js ***!
  \*************************************/
/*! exports provided: GPUFilters */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GPUFilters", function() { return GPUFilters; });
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shaders/filters/convolution */ "./src/gpu/shaders/filters/convolution.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
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
 * filters.js
 * Image filtering on the GPU
 */








// Convolution
const convolution = [3, 5, 7].reduce((obj, ksize) => ((obj[ksize] =
                        Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('filters/convolution2d.glsl')
                       .withDefines({ 'KERNEL_SIZE_SQUARED': ksize * ksize })
                       .withArguments('image', 'kernel')
                    ), obj), {});

// Separable convolution
const convolutionX = [3, 5, 7, 9, 11, 13, 15].reduce((obj, ksize) => ((obj[ksize] =
                         Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('filters/convolution1d.glsl')
                        .withDefines({ 'KERNEL_SIZE': ksize, 'AXIS': 0 })
                        .withArguments('image', 'kernel')
                     ), obj), {});

const convolutionY = [3, 5, 7, 9, 11, 13, 15].reduce((obj, ksize) => ((obj[ksize] =
                         Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('filters/convolution1d.glsl')
                        .withDefines({ 'KERNEL_SIZE': ksize, 'AXIS': 1 })
                        .withArguments('image', 'kernel')
                     ), obj), {});
// Median filter
const median = [3, 5, 7].reduce((obj, ksize) => ((obj[ksize] =
                   Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('filters/fast-median.glsl')
                  .withDefines({ 'KERNEL_SIZE': ksize })
                  .withArguments('image')
               ), obj), {});



//
// Utilities
//

// Handy conversion for Gaussian filters
// (symmetric kernel, approx. zero after 3*sigma)
const ksize2sigma = ksize => Math.max(1.0, ksize / 6.0);

/**
 * GPUFilters
 * Image filtering
 */
class GPUFilters extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgramGroup"]
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            // gaussian filters
            .compose('gauss3', '_gauss3x', '_gauss3y') // size: 3x3 (sigma ~ 1.0)
            .compose('gauss5', '_gauss5x', '_gauss5y') // size: 5x5 (sigma ~ 1.0)
            .compose('gauss7', '_gauss7x', '_gauss7y') // size: 7x7
            .compose('gauss9', '_gauss9x', '_gauss9y') // size: 9x9
            .compose('gauss11', '_gauss11x', '_gauss11y') // size: 11x11

            // box filters
            .compose('box3', '_box3x', '_box3y') // size: 3x3
            .compose('box5', '_box5x', '_box5y') // size: 5x5
            .compose('box7', '_box7x', '_box7y') // size: 7x7
            .compose('box9', '_box9x', '_box9y') // size: 9x9
            .compose('box11', '_box11x', '_box11y') // size: 11x11

            // median filters
            .declare('median3', median[3]) // 3x3 window
            .declare('median5', median[5]) // 5x5 window
            .declare('median7', median[7]) // 7x7 window

            // convolution
            .declare('convolution3', convolution[3]) // 3x3 kernel
            .declare('convolution5', convolution[5]) // 5x5 kernel
            .declare('convolution7', convolution[7]) // 7x7 kernel

            // separable convolution
            .declare('convolution3x', convolutionX[3]) // 1x3 kernel
            .declare('convolution3y', convolutionY[3]) // 3x1 kernel
            .declare('convolution5x', convolutionX[5]) // 1x5 kernel
            .declare('convolution5y', convolutionY[5]) // 5x1 kernel
            .declare('convolution7x', convolutionX[7])
            .declare('convolution7y', convolutionY[7])
            .declare('convolution9x', convolutionX[9])
            .declare('convolution9y', convolutionY[9])
            .declare('convolution11x', convolutionX[11])
            .declare('convolution11y', convolutionY[11])
            .declare('convolution13x', convolutionX[13])
            .declare('convolution13y', convolutionY[13])
            .declare('convolution15x', convolutionX[15])
            .declare('convolution15y', convolutionY[15])

            // separable kernels (Gaussian)
            // see also: http://dev.theomader.com/gaussian-kernel-calculator/
            .declare('_gauss3x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])([ // sigma ~ 1.0
                0.25, 0.5, 0.25
                //0.27901, 0.44198, 0.27901
            ]))
            .declare('_gauss3y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])([
                0.25, 0.5, 0.25
                //0.27901, 0.44198, 0.27901
            ]))
            .declare('_gauss5x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])([ // sigma ~ 1.0
                0.05, 0.25, 0.4, 0.25, 0.05
                //0.06136, 0.24477, 0.38774, 0.24477, 0.06136
            ]))
            .declare('_gauss5y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])([
                0.05, 0.25, 0.4, 0.25, 0.05
                //0.06136, 0.24477, 0.38774, 0.24477, 0.06136
            ]))
            /*.declare('_gauss5', conv2D([ // for testing
                1, 4, 7, 4, 1,
                4, 16, 26, 16, 4,
                7, 26, 41, 26, 7,
                4, 16, 26, 16, 4,
                1, 4, 7, 4, 1,
            ], 1 / 237))*/
            .declare('_gauss7x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])(_utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].gaussianKernel(ksize2sigma(7), 7)))
            .declare('_gauss7y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])(_utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].gaussianKernel(ksize2sigma(7), 7)))
            .declare('_gauss9x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])(_utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].gaussianKernel(ksize2sigma(9), 9)))
            .declare('_gauss9y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])(_utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].gaussianKernel(ksize2sigma(9), 9)))
            .declare('_gauss11x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])(_utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].gaussianKernel(ksize2sigma(11), 11)))
            .declare('_gauss11y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])(_utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].gaussianKernel(ksize2sigma(11), 11)))

            // separable kernels (Box filter)
            .declare('_box3x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])((new Array(3)).fill(1 / 3)))
            .declare('_box3y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])((new Array(3)).fill(1 / 3)))
            .declare('_box5x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])((new Array(5)).fill(1 / 5)))
            .declare('_box5y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])((new Array(5)).fill(1 / 5)))
            .declare('_box7x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])((new Array(7)).fill(1 / 7)))
            .declare('_box7y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])((new Array(7)).fill(1 / 7)))
            .declare('_box9x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])((new Array(9)).fill(1 / 9)))
            .declare('_box9y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])((new Array(9)).fill(1 / 9)))
            .declare('_box11x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])((new Array(11)).fill(1 / 11)))
            .declare('_box11y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])((new Array(11)).fill(1 / 11)))
        ;
    }
}


/***/ }),

/***/ "./src/gpu/programs/keypoints.js":
/*!***************************************!*\
  !*** ./src/gpu/programs/keypoints.js ***!
  \***************************************/
/*! exports provided: GPUKeypoints */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GPUKeypoints", function() { return GPUKeypoints; });
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _core_keypoints_feature_encoder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/keypoints/feature-encoder */ "./src/core/keypoints/feature-encoder.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/globals */ "./src/utils/globals.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
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
 * keypoints.js
 * Facade for various keypoint detection algorithms
 */










//
// FAST corner detector
//

// FAST-9_16: requires 9 contiguous pixels
// on a circumference of 16 pixels
const fast9 = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/fast/fast9.glsl').withArguments('image', 'threshold');

// FAST-7_12: requires 7 contiguous pixels
// on a circumference of 12 pixels
const fast7 = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/fast/fast7.glsl').withArguments('image', 'threshold');

// FAST-5_8: requires 5 contiguous pixels
// on a circumference of 8 pixels
const fast5 = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/fast/fast5.glsl').withArguments('image', 'threshold');

// compute corner score considering a
// neighboring circumference of 16 pixels
const fastScore16 = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/fast/fast-score16.glsl').withArguments('image', 'threshold');

// compute corner score considering a
// neighboring circumference of 12 pixels
const fastScore12 = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/fast/fast-score12.glsl').withArguments('image', 'threshold');

// compute corner score considering a
// neighboring circumference of 8 pixels
const fastScore8 = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/fast/fast-score8.glsl').withArguments('image', 'threshold');

// FAST-9_16 on scale-space
// Requires image mipmap
const multiscaleFast = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/fast/multiscale-fast.glsl')
                      .withArguments('pyramid', 'threshold', 'numberOfLayers', 'lodStep');

// encode FAST score in an 8-bit component
const encodeFastScore = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/fast/encode-fast-score.glsl').withArguments('image');



//
// Harris-Shi-Tomasi corner detector
//

// compute corner responses (score map)
const multiscaleHarris = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/harris/multiscale-harris.glsl')
                        .withDefines({ 'MAX_LAYERS': 2 * _utils_globals__WEBPACK_IMPORTED_MODULE_4__["PYRAMID_MAX_LEVELS"] - 1 })
                        .withArguments('pyramid', 'windowSize', 'numberOfLayers', 'lodStep', 'sobelDerivatives');

// discard corners below a specified quality level
const harrisCutoff = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/harris/harris-cutoff.glsl').withArguments('corners', 'maxScore', 'quality');

// encode harris score in an 8-bit component
const encodeHarrisScore = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/harris/encode-harris-score.glsl').withArguments('image');

// find the maximum harris score in an image
const maxHarrisScore = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/harris/max-harris-score.glsl').withArguments('self', 'iterationNumber');

// Sobel derivatives
const multiscaleSobel = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/harris/multiscale-sobel.glsl').withArguments('pyramid', 'lod');



//
// BRISK feature detection
//
const brisk = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/brisk.glsl')
             .withArguments('image', 'layerA', 'layerB', 'scaleA', 'scaleB', 'lgM', 'h');



//
// ORB feature description
//
const orb = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/orb/orb-descriptor.glsl')
           .withArguments('pyramid', 'encodedCorners', 'extraSize', 'encoderLength');

const orbOrientation = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/orb/orb-orientation.glsl')
                      .withArguments('pyramid', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');




//
// Generic keypoint routines
//

// non-maximum suppression
const nonMaxSuppression = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/nonmax-suppression.glsl')
                         .withArguments('image', 'lodStep');
const multiscaleNonMaxSuppression = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/nonmax-suppression.glsl')
                                   .withArguments('image', 'lodStep')
                                   .withDefines({ 'MULTISCALE': 1 });

// transfer keypoint orientation
const transferOrientation = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/transfer-orientation.glsl')
                           .withArguments('encodedOrientations', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

// suppress feature descriptors
const suppressDescriptors = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/suppress-descriptors.glsl')
                           .withArguments('encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'suppressedEncoderLength');



/**
 * GPUKeypoints
 * Keypoint detection
 */
class GPUKeypoints extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgramGroup"]
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            // FAST-9,16
            .compose('fast9', '_fast9', '_fastScore16')
            .declare('_fast9', fast9) // find corners
            .declare('_fastScore16', fastScore16) // compute scores

            // FAST-7,12
            .compose('fast7', '_fast7', '_fastScore12')
            .declare('_fast7', fast7)
            .declare('_fastScore12', fastScore12)

            // FAST-5,8
            .compose('fast5', '_fast5', '_fastScore8')
            .declare('_fast5', fast5)
            .declare('_fastScore8', fastScore8)

            // FAST-9,16 (multi-scale)
            .declare('multiscaleFast', multiscaleFast)
            .declare('encodeFastScore', encodeFastScore)

            // BRISK Scale-Space Non-Maximum Suppression & Interpolation
            .declare('brisk', brisk)

            // Harris-Shi-Tomasi corner detector
            .declare('multiscaleHarris', multiscaleHarris) // scale-space
            .declare('harrisCutoff', harrisCutoff)
            .declare('encodeHarrisScore', encodeHarrisScore)
            .declare('maxHarrisScore', maxHarrisScore, {
                ...this.program.usesPingpongRendering()
            })

            // Non-maximum suppression
            .declare('_nonMaxSuppression', nonMaxSuppression)
            .declare('_multiscaleNonMaxSuppression', multiscaleNonMaxSuppression)

            // ORB
            .declare('_orb', orb)
            .declare('_orbOrientation', orbOrientation)
            .declare('multiscaleSobel', multiscaleSobel) // scale-space

            // Transfer keypoint orientation
            .declare('_transferOrientation', transferOrientation)

            // Suppress feature descriptors
            .declare('_suppressDescriptors', suppressDescriptors)
        ;
    }

    /**
     * Non-maximum suppression
     * @param {SpeedyTexture} corners scores are encoded as float16
     * @param {number} [lodStep] log2(scaleFactor) - specify if multi-scale
     * @returns {SpeedyDrawableTexture}
     */
    nonMaxSuppression(corners, lodStep = 0)
    {
        if(lodStep > 0)
            return this._multiscaleNonMaxSuppression(corners, lodStep);
        else
            return this._nonMaxSuppression(corners, 0);
    }

    /**
     * Compute ORB descriptor (256 bits)
     * @param {SpeedyTexture} pyramid pre-smoothed on the intensity channel
     * @param {SpeedyTexture} encodedKeypoints tiny texture
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     * @returns {SpeedyDrawableTexture}
     */
    orb(pyramid, encodedKeypoints, descriptorSize, extraSize, encoderLength)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_5__["Utils"].assert(descriptorSize === 32);
        this._orb.setOutputSize(encoderLength, encoderLength);
        return this._orb(pyramid, encodedKeypoints, extraSize, encoderLength);
    }

    /**
     * Finds the orientation of all keypoints given a texture with encoded keypoints
     * (using the centroid method, as in ORB)
     * @param {SpeedyTexture} pyramid image pyramid
     * @param {SpeedyTexture} encodedKeypoints tiny texture
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     * @returns {SpeedyDrawableTexture}
     */
    orbOrientation(pyramid, encodedKeypoints, descriptorSize, extraSize, encoderLength)
    {
        const numberOfKeypoints = _core_keypoints_feature_encoder__WEBPACK_IMPORTED_MODULE_3__["FeatureEncoder"].capacity(descriptorSize, extraSize, encoderLength);
        const orientationEncoderLength = Math.max(1, Math.ceil(Math.sqrt(numberOfKeypoints))); // 1 pixel per keypoint

        this._orbOrientation.setOutputSize(orientationEncoderLength, orientationEncoderLength);
        const encodedOrientations = this._orbOrientation(pyramid, encodedKeypoints, descriptorSize, extraSize, encoderLength);

        this._transferOrientation.setOutputSize(encoderLength, encoderLength);
        return this._transferOrientation(encodedOrientations, encodedKeypoints, descriptorSize, extraSize, encoderLength);
    }

    /**
     * Suppress feature descriptors from a texture with encoded keypoints
     * @param {SpeedyTexture} encodedKeypoints tiny texture
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     * @param {number} suppressedEncoderLength equivalent to encoderLength, but without the descriptors
     * @returns {SpeedyDrawableTexture}
     */
    suppressDescriptors(encodedKeypoints, descriptorSize, extraSize, encoderLength, suppressedEncoderLength)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_5__["Utils"].assert(suppressedEncoderLength <= encoderLength);
        this._suppressDescriptors.setOutputSize(suppressedEncoderLength, suppressedEncoderLength);
        return this._suppressDescriptors(encodedKeypoints, descriptorSize, extraSize, encoderLength, suppressedEncoderLength);
    }
}

/***/ }),

/***/ "./src/gpu/programs/pyramids.js":
/*!**************************************!*\
  !*** ./src/gpu/programs/pyramids.js ***!
  \**************************************/
/*! exports provided: GPUPyramids */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GPUPyramids", function() { return GPUPyramids; });
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _speedy_gpu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _speedy_program__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../speedy-program */ "./src/gpu/speedy-program.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../shaders/filters/convolution */ "./src/gpu/shaders/filters/convolution.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
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
 * pyramids.js
 * Image pyramids
 */











//
// Shaders
//

// pyramid generation
const upsample2 = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_4__["importShader"])('pyramids/upsample2.glsl').withArguments('image');
const downsample2 = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_4__["importShader"])('pyramids/downsample2.glsl').withArguments('image');
//const upsample3 = importShader('pyramids/upsample3.glsl').withArguments('image');
//const downsample3 = importShader('pyramids/downsample3.glsl').withArguments('image');

// debug
//const flipY = importShader('utils/flip-y.glsl').withArguments('image');



/**
 * GPUPyramids
 * Image pyramids
 */
class GPUPyramids extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgramGroup"]
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            // pyramid operations (scale = 2)
            .compose('_reduce', '_smoothX', '_smoothY', '_downsample2')
            .compose('_expand', '_upsample2', '_smoothX2', '_smoothY2')
           
            /*
            // intra-pyramid operations (scale = 1.5)
            .compose('_intraReduce', '_upsample2', '_smoothX2', '_smoothY2', '_downsample3/2')
            .compose('_intraExpand', '_upsample3', '_smoothX3', '_smoothY3', '_downsample2/3')
            */

            /*
            // utilities for debugging
            .declare('output1', flipY, {
                ...this.program.hasTextureSize(this._width, this._height),
                ...this.program.rendersToCanvas()
            })

            .declare('outputHalf', flipY, {
                ...this.program.hasTextureSize(Math.floor(this._width / 2), Math.floor(this._height / 2)),
                ...this.program.rendersToCanvas()
            })

            .declare('output2', flipY, {
                ...this.program.hasTextureSize(2 * this._width, 2 * this._height),
                ...this.program.rendersToCanvas()
            })
            */
            
            // separable kernels for gaussian smoothing
            // use [c, b, a, b, c] where a+2c = 2b and a+2b+2c = 1
            // pick a = 0.4 for gaussian approximation
            .declare('_smoothX', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_5__["convX"])([
                0.05, 0.25, 0.4, 0.25, 0.05
            ]))
            .declare('_smoothY', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_5__["convY"])([
                0.05, 0.25, 0.4, 0.25, 0.05
            ]))

            // smoothing for 2x image
            // same rules as above with sum(k) = 2
            .declare('_smoothX2', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_5__["convX"])([
                0.1, 0.5, 0.8, 0.5, 0.1 // NOTE: this would saturate the image, but we apply it on a 2x upsampled version with lots of zero pixels
            ]), {
                ...(this.program.hasTextureSize(2 * this._width, 2 * this._height))
            })

            .declare('_smoothY2', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_5__["convY"])([
                0.1, 0.5, 0.8, 0.5, 0.1
            ], 1.0 / 2.0), {
                ...(this.program.hasTextureSize(2 * this._width, 2 * this._height))
            })

            /*
            // smoothing for 3x image
            // use [1-b, b, 1, b, 1-b], where 0 < b < 1
            .declare('_smoothX3', convX([
                0.2, 0.8, 1.0, 0.8, 0.2
            ]), this.program.hasTextureSize(3 * this._width, 3 * this._height))

            .declare('_smoothY3', convY([
                0.2, 0.8, 1.0, 0.8, 0.2
            ], 1.0 / 3.0), this.program.hasTextureSize(3 * this._width, 3 * this._height))
            */

            // upsampling & downsampling
            .declare('_upsample2', upsample2, {
                ...(this.program.hasTextureSize(2 * this._width, 2 * this._height))
            })

            .declare('_downsample2', downsample2, {
                ...(this.program.hasTextureSize(Math.max(1, Math.floor(this._width / 2)), Math.max(1, Math.floor(this._height / 2))))
            })

            /*
            .declare('_upsample3', upsample3,
                this.program.hasTextureSize(3 * this._width, 3 * this._height))

            .declare('_downsample3', downsample3,
                this.program.hasTextureSize(Math.floor(this._width / 3), Math.floor(this._height / 3)))

            .declare('_downsample2/3', downsample2,
                this.program.hasTextureSize(Math.floor(3 * this._width / 2), Math.floor(3 * this._height / 2)))

            .declare('_downsample3/2', downsample3,
                this.program.hasTextureSize(Math.floor(2 * this._width / 3), Math.floor(2 * this._height / 3)))
            */
        ;
    }

    /**
     * Reduce the image (0.5x)
     * @param {SpeedyTexture} image
     * @returns {SpeedyDrawableTexture}
     */
    reduce(image)
    {
        return this._reduce(image);
    }

    /**
     * Expand the image (2x)
     * @param {SpeedyTexture} image
     * @returns {SpeedyDrawableTexture}
     */
    expand(image)
    {
        return this._expand(image);
    }
}

/***/ }),

/***/ "./src/gpu/programs/trackers.js":
/*!**************************************!*\
  !*** ./src/gpu/programs/trackers.js ***!
  \**************************************/
/*! exports provided: GPUTrackers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GPUTrackers", function() { return GPUTrackers; });
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/globals */ "./src/utils/globals.js");
/* harmony import */ var _core_keypoints_feature_encoder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/keypoints/feature-encoder */ "./src/core/keypoints/feature-encoder.js");
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
 * trackers.js
 * Feature trackers
 */








//
// Shaders
//

// LK
const LK_MAX_WINDOW_SIZE = 21; // 21x21 window
const LK_MAX_WINDOW_SIZE_SMALL = 15; // 15x15 window - the smaller the window, the easier it is on the GPU
const LK_MAX_WINDOW_SIZE_SMALLER = 11; // 11x11 window - works best on mobile
const LK_MAX_WINDOW_SIZE_SMALLEST = 7; // 7x7 window
const LK_MIN_WINDOW_SIZE = 5; // 5x5 window: (-2, -1, 0, 1, 2) x (-2, -1, 0, 1, 2)

const lk = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('trackers/lk.glsl')
           .withArguments('encodedFlow', 'prevKeypoints', 'nextPyramid', 'prevPyramid', 'windowSize', 'level', 'depth', 'numberOfIterations', 'discardThreshold', 'epsilon', 'descriptorSize', 'extraSize', 'encoderLength')
           .withDefines({
               'MAX_WINDOW_SIZE': LK_MAX_WINDOW_SIZE,
           });

const lkSmall = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('trackers/lk.glsl')
                .withArguments('encodedFlow', 'prevKeypoints', 'nextPyramid', 'prevPyramid', 'windowSize', 'level', 'depth', 'numberOfIterations', 'discardThreshold', 'epsilon', 'descriptorSize', 'extraSize', 'encoderLength')
                .withDefines({
                    'MAX_WINDOW_SIZE': LK_MAX_WINDOW_SIZE_SMALL,
                });

const lkSmaller = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('trackers/lk.glsl')
                  .withArguments('encodedFlow', 'prevKeypoints', 'nextPyramid', 'prevPyramid', 'windowSize', 'level', 'depth', 'numberOfIterations', 'discardThreshold', 'epsilon', 'descriptorSize', 'extraSize', 'encoderLength')
                  .withDefines({
                      'MAX_WINDOW_SIZE': LK_MAX_WINDOW_SIZE_SMALLER,
                  });

const lkSmallest = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('trackers/lk.glsl')
                   .withArguments('encodedFlow', 'prevKeypoints', 'nextPyramid', 'prevPyramid', 'windowSize', 'level', 'depth', 'numberOfIterations', 'discardThreshold', 'epsilon', 'descriptorSize', 'extraSize', 'encoderLength')
                   .withDefines({
                       'MAX_WINDOW_SIZE': LK_MAX_WINDOW_SIZE_SMALLEST,
                   });

const lkDiscard = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('trackers/lk-discard.glsl')
                  .withArguments('pyramid', 'encodedKeypoints', 'windowSize', 'discardThreshold', 'descriptorSize', 'extraSize', 'encoderLength');

const transferFlow = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('trackers/transfer-flow.glsl')
                     .withArguments('encodedFlow', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');


/**
 * GPUTrackers
 * Feature trackers
 */
class GPUTrackers extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgramGroup"]
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            // LK
            .declare('_lk', lk, {
                ...this.program.usesPingpongRendering()
            })
            .declare('_lkSmall', lkSmall, {
                ...this.program.usesPingpongRendering()
            })
            .declare('_lkSmaller', lkSmaller, {
                ...this.program.usesPingpongRendering()
            })
            .declare('_lkSmallest', lkSmallest, {
                ...this.program.usesPingpongRendering()
            })
            .declare('_lkDiscard', lkDiscard)

            // Transfer optical-flow
            .declare('_transferFlow', transferFlow)
        ;
    }

    /**
     * LK feature tracker
     * @param {SpeedyTexture} nextPyramid image pyramid at time t
     * @param {SpeedyTexture} prevPyramid image pyramid at time t-1
     * @param {SpeedyTexture} prevKeypoints tiny texture of encoded keypoints at time t-1
     * @param {number} windowSize neighborhood size, an odd number (5, 7, 9, 11...)
     * @param {number} depth how many pyramid layers will be scanned
     * @param {number} numberOfIterations for iterative LK
     * @param {number} discardThreshold used to discard "bad" keypoints, typically 10^(-4)
     * @param {number} epsilon accuracy threshold to stop iterations, typically 0.01
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     * @returns {SpeedyTexture}
     */
    lk(nextPyramid, prevPyramid, prevKeypoints, windowSize, depth, numberOfIterations, discardThreshold, epsilon, descriptorSize, extraSize, encoderLength)
    {
        // make sure we get a proper depth
        const MIN_DEPTH = 1, MAX_DEPTH = _utils_globals__WEBPACK_IMPORTED_MODULE_2__["PYRAMID_MAX_LEVELS"];
        depth = Math.max(MIN_DEPTH, Math.min(depth | 0, MAX_DEPTH));

        // windowSize must be a positive odd number
        windowSize = windowSize + ((windowSize + 1) % 2);
        windowSize = Math.max(LK_MIN_WINDOW_SIZE, Math.min(windowSize, LK_MAX_WINDOW_SIZE));

        // we want at least one iteration
        numberOfIterations = Math.max(1, numberOfIterations);

        // select program
        let lk = null;
        if(windowSize <= LK_MAX_WINDOW_SIZE_SMALLEST)
            lk = this._lkSmallest;
        else if(windowSize <= LK_MAX_WINDOW_SIZE_SMALLER)
            lk = this._lkSmaller;
        else if(windowSize <= LK_MAX_WINDOW_SIZE_SMALL)
            lk = this._lkSmall;
        else
            lk = this._lk;

        //
        // Optimization!
        // because this is such a demanding algorithm, we'll
        // split the work into multiple passes of the shader
        // (so we don't get WebGL context loss on mobile)
        //
        const numKeypoints = _core_keypoints_feature_encoder__WEBPACK_IMPORTED_MODULE_3__["FeatureEncoder"].capacity(descriptorSize, extraSize, encoderLength);
        const lkEncoderLength = Math.max(1, Math.ceil(Math.sqrt(numKeypoints)));
        lk.setOutputSize(lkEncoderLength, lkEncoderLength);

        // compute optical-flow
        let flow = lk.clear();
        for(let level = depth - 1; level >= 0; level--)
            flow = lk(flow, prevKeypoints, nextPyramid, prevPyramid, windowSize, level, depth, numberOfIterations, discardThreshold, epsilon, descriptorSize, extraSize, encoderLength);

        // transfer optical-flow to nextKeypoints
        this._transferFlow.setOutputSize(encoderLength, encoderLength);
        const nextKeypoints = this._transferFlow(flow, prevKeypoints, descriptorSize, extraSize, encoderLength);

        // discard "bad" keypoints
        this._lkDiscard.setOutputSize(encoderLength, encoderLength);
        const goodKeypoints = this._lkDiscard(nextPyramid, nextKeypoints, windowSize, discardThreshold, descriptorSize, extraSize, encoderLength);

        // done!
        return goodKeypoints;
    }
}

/***/ }),

/***/ "./src/gpu/programs/transforms.js":
/*!****************************************!*\
  !*** ./src/gpu/programs/transforms.js ***!
  \****************************************/
/*! exports provided: GPUTransforms */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GPUTransforms", function() { return GPUTransforms; });
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * transforms.js
 * Geometric transformations
 */







//
// Shaders
//

// Perspective warp
const warpPerspective = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('transforms/warp-perspective.glsl').withArguments('image', 'inverseHomography');

// Resize image
const resizeNN = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('transforms/resize.glsl')
                 .withDefines({
                     'INTERPOLATION_METHOD': 0 // Nearest neighbors
                 })
                 .withArguments('image');

const resizeBI = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('transforms/resize.glsl')
                 .withDefines({
                     'INTERPOLATION_METHOD': 1 // Bilinear interpolation
                 })
                 .withArguments('image');


/**
 * GPUTransforms
 * Geometric transformations
 */
class GPUTransforms extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgramGroup"]
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            .declare('_warpPerspective', warpPerspective)
            .declare('resizeNN', resizeNN)
            .declare('resizeBI', resizeBI)
        ;
    }

    /**
     * Dense perspective transform
     * @param {SpeedyTexture} image
     * @param {number[]} homography 3x3 homography matrix in column-major format
     * @returns {SpeedyTexture}
     */
    warpPerspective(image, homography)
    {
        if(!(Array.isArray(homography) && homography.length == 9))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalArgumentError"](`Not a homography: ${homography}`);

        const inverseHomography = this._inverse3(homography);
        if(!Number.isNaN(inverseHomography[0]))
            return this._warpPerspective(image, inverseHomography);
        else
            return this._warpPerspective(image, [0,0,0,0,0,0,0,0,1]); // singular matrix
    }

    /**
     * Compute the inverse of a 3x3 matrix
     * @param {number[]} mat 3x3 matrix in column-major format
     * @returns {number[]} 3x3 inverse matrix in column-major format
     */
    _inverse3(mat)
    {
        const nan = Number.NaN, eps = 1e-6;
        const inv = [ nan, nan, nan, nan, nan, nan, nan, nan, nan ];

        // read the entries of the matrix
        const a11 = mat[0];
        const a21 = mat[1];
        const a31 = mat[2];
        const a12 = mat[3];
        const a22 = mat[4];
        const a32 = mat[5];
        const a13 = mat[6];
        const a23 = mat[7];
        const a33 = mat[8];

        // compute cofactors
        const b1 = a33 * a22 - a32 * a23; // b11
        const b2 = a33 * a12 - a32 * a13; // b21
        const b3 = a23 * a12 - a22 * a13; // b31

        // compute the determinant
        const det = a11 * b1 - a21 * b2 + a31 * b3;

        // set up the inverse
        if(!(Math.abs(det) < eps)) {
            const d = 1.0 / det;
            inv[0] = b1 * d;
            inv[1] = -(a33 * a21 - a31 * a23) * d;
            inv[2] = (a32 * a21 - a31 * a22) * d;
            inv[3] = -b2 * d;
            inv[4] = (a33 * a11 - a31 * a13) * d;
            inv[5] = -(a32 * a11 - a31 * a12) * d;
            inv[6] = b3 * d;
            inv[7] = -(a23 * a11 - a21 * a13) * d;
            inv[8] = (a22 * a11 - a21 * a12) * d;
        }

        // done!
        return inv;
    }
}

/***/ }),

/***/ "./src/gpu/programs/utils.js":
/*!***********************************!*\
  !*** ./src/gpu/programs/utils.js ***!
  \***********************************/
/*! exports provided: GPUUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GPUUtils", function() { return GPUUtils; });
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
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
 * utils.js
 * GPU utilities
 */










//
// Shaders
//

// Identity shader: no-operation
const identity = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('utils/identity.glsl').withArguments('image');

// Flip y-axis for output
const flipY = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('utils/flip-y.glsl').withArguments('image');

// Fill image with a constant
const fill = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('utils/fill.glsl').withArguments('value');

// Fill zero or more color components of the input image with a constant value
const fillComponents = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('utils/fill-components.glsl').withArguments('image', 'pixelComponents', 'value');

// Copy the src component of src to zero or more color components of a copy of dest
const copyComponents = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('utils/copy-components.glsl').withArguments('dest', 'src', 'destComponents', 'srcComponentId');

// Scan the entire image and find the minimum & maximum pixel intensity for each row and column
//const scanMinMax1D = importShader('utils/scan-minmax1d.glsl').withArguments('image', 'iterationNumber');

// Scan the entire image and find the minimum & maximum pixel intensity
const scanMinMax2D = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('utils/scan-minmax2d.glsl').withArguments('image', 'iterationNumber');



/**
 * GPUUtils
 * Utility operations
 */
class GPUUtils extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgramGroup"]
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            // no-operation
            .declare('identity', identity)

            // render to the canvas
            .declare('_renderToCanvas', flipY, {
                ...this.program.rendersToCanvas()
            })
                
            // flip y-axis
            .declare('flipY', flipY)

            // Fill image with a constant
            .declare('fill', fill)

            // Fill zero or more color components of the input image with a constant value
            .declare('fillComponents', fillComponents)

            // Copy the src component of src to zero or more color components of a copy of dest
            .declare('_copyComponents', copyComponents)

            // find minimum & maximum pixel intensity for each row and column
            /*.declare('_scanMinMax1D', scanMinMax1D, {
                ...this.program.usesPingpongRendering()
            })*/

            // find minimum & maximum pixel intensity
            .declare('_scanMinMax2D', scanMinMax2D, {
                ...this.program.usesPingpongRendering()
            })
        ;
    }

    /**
     * Renders an image to (the bottom-left of) the canvas
     * @param {SpeedyTexture} image
     * @returns {HTMLCanvasElement} returned for convenience
     */
    renderToCanvas(image)
    {
        const width = image.width;
        const height = image.height;
        const canvas = this._gpu.canvas;

        // do we need to resize the program?
        if(width != this._renderToCanvas.width || height != this._renderToCanvas.height)
            this._renderToCanvas.setOutputSize(width, height);

        // do we need to resize the canvas?
        if(width > canvas.width || height > canvas.height) {
            _utils_utils__WEBPACK_IMPORTED_MODULE_5__["Utils"].warning(`Resizing the canvas to ${width} x ${height}`);
            canvas.width = width;
            canvas.height = height;
        }

        // render
        this._renderToCanvas(image);

        // done!
        return canvas;
    }

    /**
     * Scan a single component in all pixels of the image and find the maximum intensity
     * @param {SpeedyTexture} image 
     * @param {number} pixelComponent a single PixelComponent flag
     * @returns {SpeedyDrawableTexture} such that pixel[component] = max(image_pixel[component])
     *                                                           for all image_pixels
     */
    scanMax(image, pixelComponent)
    {
        const minmax2d = this._scanMinMax(image, pixelComponent);
        return this.copyComponents(image, minmax2d, pixelComponent, _utils_types__WEBPACK_IMPORTED_MODULE_3__["PixelComponent"].RED);
    }

    /**
     * Scan a single component in all pixels of the image and find the minimum intensity
     * @param {SpeedyTexture} image 
     * @param {number} pixelComponent a single PixelComponent flag
     * @returns {SpeedyDrawableTexture} such that pixel[component] = min(image_pixel[component])
     *                                                           for all image_pixels
     */
    scanMin(image, pixelComponent)
    {
        const minmax2d = this._scanMinMax(image, pixelComponent);
        return this.copyComponents(image, minmax2d, pixelComponent, _utils_types__WEBPACK_IMPORTED_MODULE_3__["PixelComponent"].GREEN);
    }

    /**
     * Copy color component
     * @param {SpeedyTexture} dest
     * @param {SpeedyTexture} src 
     * @param {number} destComponents one or more PixelComponent flags
     * @param {number} srcComponent a single PixelComponent flag
     * @returns {SpeedyDrawableTexture} a copy of dest with its destComponents replaced by the srcComponent of src
     */
    copyComponents(dest, src, destComponents, srcComponent)
    {
        if(!Object.prototype.hasOwnProperty.call(_utils_types__WEBPACK_IMPORTED_MODULE_3__["ColorComponentId"], srcComponent))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Invalid srcComponent: ${srcComponent}`)

        const srcComponentId = _utils_types__WEBPACK_IMPORTED_MODULE_3__["ColorComponentId"][srcComponent];
        return this._copyComponents(dest, src, destComponents, srcComponentId);
    }

    /**
     * Scan a single component in all pixels of the image and find the min & max intensities
     * @param {SpeedyTexture} image 
     * @param {number} pixelComponent a single PixelComponent flag
     * @returns {SpeedyDrawableTexture} RGBA = (max, min, max - min, original_pixel)
     */
    _scanMinMax(image, pixelComponent)
    {
        //
        // FIXME: combinations of PixelComponent (e.g., PixelComponent.ALL)
        //        are currently unsupported. Make separate calls.
        //
        const numIterations = Math.ceil(Math.log2(Math.max(this._width, this._height))) | 0;
        let texture = this.copyComponents(image, image, _utils_types__WEBPACK_IMPORTED_MODULE_3__["PixelComponent"].ALL, pixelComponent);

        for(let i = 0; i < numIterations; i++)
            texture = this._scanMinMax2D(texture, i);

        return texture;
    }
}

/***/ }),

/***/ "./src/gpu/shader-declaration.js":
/*!***************************************!*\
  !*** ./src/gpu/shader-declaration.js ***!
  \***************************************/
/*! exports provided: ShaderDeclaration, importShader, createShader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShaderDeclaration", function() { return ShaderDeclaration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "importShader", function() { return importShader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createShader", function() { return createShader; });
/* harmony import */ var _shader_preprocessor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shader-preprocessor */ "./src/gpu/shader-preprocessor.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
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
 * shader-declaration.js
 * Encapsulates a shader declaration
 */




const DEFAULT_ATTRIBUTES = Object.freeze({
    position: 'a_position',
    texCoord: 'a_texCoord'
});

const DEFAULT_ATTRIBUTES_LOCATION = Object.freeze({
    position: 0, // use location 0; see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
    texCoord: 1,
});

const DEFAULT_VERTEX_SHADER = `#version 300 es
layout (location=${DEFAULT_ATTRIBUTES_LOCATION.position}) in vec2 ${DEFAULT_ATTRIBUTES.position};
layout (location=${DEFAULT_ATTRIBUTES_LOCATION.texCoord}) in vec2 ${DEFAULT_ATTRIBUTES.texCoord};
out vec2 texCoord;

void main() {
    gl_Position = vec4(${DEFAULT_ATTRIBUTES.position}, 0.0f, 1.0f);
    texCoord = ${DEFAULT_ATTRIBUTES.texCoord};
}\n`;

const DEFAULT_FRAGMENT_SHADER_PREFIX = `#version 300 es
precision highp int; // int32
precision mediump float; // ~float16
precision mediump sampler2D;

out vec4 color;
in vec2 texCoord;
uniform vec2 texSize;

@include "global.glsl"\n\n`;

/**
 * Shader Declaration
 */
class ShaderDeclaration
{
    /**
     * @private Constructor
     * @param {object} options
     * @param {string} [options.filepath]
     * @param {string} [options.source]
     */
    constructor(options)
    {
        const filepath = options.filepath || null;
        const source = filepath ? __webpack_require__("./src/gpu/shaders sync recursive ^\\.\\/.*$")("./" + filepath) : (options.source || '');
        if(source.length == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["IllegalArgumentError"](`Can't import shader: empty code`);

        /** @type {string} original source code provided by the user */
        this._userSource = source;

        /** @type {string} preprocessed source code of the vertex shader */
        this._vertexSource = _shader_preprocessor__WEBPACK_IMPORTED_MODULE_0__["ShaderPreprocessor"].run(DEFAULT_VERTEX_SHADER);

        /** @type {string} preprocessed source code of the fragment shader */
        this._fragmentSource = _shader_preprocessor__WEBPACK_IMPORTED_MODULE_0__["ShaderPreprocessor"].run(DEFAULT_FRAGMENT_SHADER_PREFIX + this._userSource);

        /** @type {string} the filepath from which the (fragment) shader was imported */
        this._filepath = filepath || '<in-memory>';

        /** @type {string[]} an ordered list of uniform names */
        this._arguments = [];

        /** @type {Map<string,string>} it maps uniform names to their types */
        this._uniforms = this._autodetectUniforms(this._fragmentSource);

        /** @type {Map<string,number>} it maps externally #defined constants to their values */
        this._defines = new Map();
    }

    /**
     * Creates a new Shader directly from a GLSL source
     * @param {string} source
     * @returns {ShaderDeclaration}
     */
    static create(source)
    {
        return new ShaderDeclaration({ source });
    }

    /**
     * Import a Shader from a file containing a GLSL source
     * @param {string} filepath path to .glsl file relative to the shaders/ folder
     * @returns {ShaderDeclaration}
     */
    static import(filepath)
    {
        if(!String(filepath).match(/^[a-zA-Z0-9_\-\/]+\.glsl$/))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["FileNotFoundError"](`Can't import shader: "${filepath}"`);

        return new ShaderDeclaration({ filepath });
    }

    /**
     * Specify the list & order of arguments to be
     * passed to the shader
     * @param  {...string} args argument names
     * @returns {ShaderDeclaration} this
     */
    withArguments(...args)
    {
        // the list of arguments may be declared only once
        if(this._arguments.length > 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["IllegalOperationError"](`Redefinition of shader arguments`);

        // get arguments
        this._arguments = args.map(arg => String(arg));

        // validate
        for(const argname of this._arguments) {
            if(!this._uniforms.has(argname)) {
                if(!this._uniforms.has(argname + '[0]'))
                    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["IllegalArgumentError"](`Argument "${argname}" has not been declared in the shader`);
            }
        }

        // done!
        return this;
    }

    /**
     * Specify a set of #defines to be prepended to the fragment shader
     * @param {Object.<string,number>} defines key-value pairs (define-name: define-value)
     * @returns {ShaderDeclaration} this
     */
    withDefines(defines)
    {
        // the list of #defines may be defined only once
        if(this._defines.size > 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["IllegalOperationError"](`Redefinition of externally defined constants of a shader`);

        // store and write the #defines
        const defs = [];
        for(const key of Object.keys(defines)) {
            const value = Number(defines[key]); // force numeric values
            this._defines.set(key, value);
            defs.push(`#define ${key} ${value}\n`);
        }

        // update the fragment shader & the uniforms
        const source = DEFAULT_FRAGMENT_SHADER_PREFIX + defs.join('') + this._userSource;
        this._fragmentSource = _shader_preprocessor__WEBPACK_IMPORTED_MODULE_0__["ShaderPreprocessor"].run(source, this._defines);
        this._uniforms = this._autodetectUniforms(this._fragmentSource);

        // done!
        return this;
    }

    /**
     * Return the GLSL source of the fragment shader
     * @returns {string}
     */
    get fragmentSource()
    {
        return this._fragmentSource;
    }

    /**
     * Return the GLSL source of the vertex shader
     * @returns {string}
     */
    get vertexSource()
    {
        return this._vertexSource;
    }

    /**
     * Get the names of the vertex shader attributes
     * @returns {Object.<string,string>}
     */
    get attributes()
    {
        return DEFAULT_ATTRIBUTES;
    }

    /**
     * Get the pre-defined locations of the vertex shader attributes
     * @returns {Object.<string,number>}
     */
    get locationOfAttributes()
    {
        return DEFAULT_ATTRIBUTES_LOCATION;
    }

    /**
     * Names of the arguments that will be passed to the Shader,
     * corresponding to GLSL uniforms, in the order they will be passed
     * @returns {string[]}
     */
    get arguments()
    {
        return this._arguments;
    }

    /**
     * Names of the uniforms declared in the shader
     * @returns {string[]}
     */
    get uniforms()
    {
        return Array.from(this._uniforms.keys());
    }

    /**
     * The GLSL type of a uniform variable declared in the shader
     * @param {string} name
     * @returns {string}
     */
    uniformType(name)
    {
        if(!this._uniforms.has(name))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["IllegalArgumentError"](`Unrecognized uniform variable: "${name}"`);

        return this._uniforms.get(name);
    }

    /**
     * The value of an externally defined constant, i.e., via withDefines()
     * @param {string} name 
     * @returns {number}
     */
    definedConstant(name)
    {
        if(!this._defines.has(name))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["IllegalArgumentError"](`Unrecognized externally defined constant: "${name}"`);

        return this._defines.get(name);
    }

    /**
     * Parses a GLSL source and detects the uniform variables,
     * as well as their types
     * @param {string} preprocessedSource 
     * @returns {Map<string,string>} specifies the types of all uniforms
     */
    _autodetectUniforms(preprocessedSource)
    {
        const sourceWithoutComments = preprocessedSource; // assume we've preprocessed the source already
        const regex = /^\s*uniform\s+(highp\s+|mediump\s+|lowp\s+)?(\w+)\s+([^;]+)/gm;
        const uniforms = new Map();

        let match;
        while((match = regex.exec(sourceWithoutComments)) !== null) {
            const type = match[2];
            const names = match[3].split(',').map(name => name.trim()).filter(name => name); // trim & remove empty names

            for(const name of names) {
                if(name.endsWith(']')) {
                    // is it an array?
                    if(!(match = name.match(/(\w+)\s*\[\s*(\d+)\s*\]$/)))
                        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__["ParseError"](`Unspecified array length for uniform "${name}" in the shader`);

                    // read array name & size
                    const [ array, size ] = [ match[1], Number(match[2]) ];

                    // register uniforms
                    for(let i = 0; i < size; i++)
                        uniforms.set(`${array}[${i}]`, type);
                }
                else {
                    // register a regular uniform
                    uniforms.set(name, type);
                }
            }
        }

        return uniforms;
    }
}

/**
 * Import a ShaderDeclaration from a GLSL file
 * @param {string} filepath relative to the shaders/ folder
 * @returns {ShaderDeclaration}
 */
function importShader(filepath)
{
    return ShaderDeclaration.import(filepath);
}

/**
 * Create a ShaderDeclaration from a GLSL source
 * @param {string} source
 * @returns {ShaderDeclaration}
 */
function createShader(source)
{
    return ShaderDeclaration.create(source);
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
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/globals */ "./src/utils/globals.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
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
 * shader-preprocessor.js
 * Custom preprocessor for shaders
 */






// Regular Expressions
const commentsRegex = [ /\/\*(.|\s)*?\*\//g , /\/\/.*$/gm ];
const includeRegex = /^\s*@\s*include\s+"(.*?)"/gm;
const constantRegex = /@(\w+)@/g;
const unrollRegex = [
    /@\s*unroll\s+?for\s*\(\s*(int|)\s*(?<counter>\w+)\s*\=\s*(-?\d+|\w+)\s*;\s*\k<counter>\s*(<=?)\s*(-?\d+|\w+)\s*;\s*\k<counter>\s*\+\+()\s*\)\s*\{\s*([\s\S]+?)\s*\}/g,
    /@\s*unroll\s+?for\s*\(\s*(int|)\s*(?<counter>\w+)\s*\=\s*(-?\d+|\w+)\s*;\s*\k<counter>\s*(<=?)\s*(-?\d+|\w+)\s*;\s*\k<counter>\s*\+=\s*(-?\d+)\s*\)\s*\{\s*([\s\S]+?)\s*\}/g,
];

// Constants accessible by all shaders
const constants = Object.freeze({
    // general
    'MAX_TEXTURE_LENGTH': _utils_globals__WEBPACK_IMPORTED_MODULE_0__["MAX_TEXTURE_LENGTH"],
    'LITTLE_ENDIAN': _utils_globals__WEBPACK_IMPORTED_MODULE_0__["LITTLE_ENDIAN"] ? 1 : 0,

    // pyramids
    'PYRAMID_MAX_LEVELS': _utils_globals__WEBPACK_IMPORTED_MODULE_0__["PYRAMID_MAX_LEVELS"],
    'LOG2_PYRAMID_MAX_SCALE': _utils_globals__WEBPACK_IMPORTED_MODULE_0__["LOG2_PYRAMID_MAX_SCALE"],

    // colors
    'PIXELCOMPONENT_RED': _utils_types__WEBPACK_IMPORTED_MODULE_2__["PixelComponent"].RED,
    'PIXELCOMPONENT_GREEN': _utils_types__WEBPACK_IMPORTED_MODULE_2__["PixelComponent"].GREEN,
    'PIXELCOMPONENT_BLUE': _utils_types__WEBPACK_IMPORTED_MODULE_2__["PixelComponent"].BLUE,
    'PIXELCOMPONENT_ALPHA': _utils_types__WEBPACK_IMPORTED_MODULE_2__["PixelComponent"].ALPHA,

    // fixed-point math
    'FIX_BITS': _utils_globals__WEBPACK_IMPORTED_MODULE_0__["FIX_BITS"],
    'FIX_RESOLUTION': _utils_globals__WEBPACK_IMPORTED_MODULE_0__["FIX_RESOLUTION"],

    // keypoints
    'MAX_DESCRIPTOR_SIZE': _utils_globals__WEBPACK_IMPORTED_MODULE_0__["MAX_DESCRIPTOR_SIZE"],
    'MIN_KEYPOINT_SIZE': _utils_globals__WEBPACK_IMPORTED_MODULE_0__["MIN_KEYPOINT_SIZE"],
    'KPF_NONE': _utils_globals__WEBPACK_IMPORTED_MODULE_0__["KPF_NONE"],
    'KPF_ORIENTED': _utils_globals__WEBPACK_IMPORTED_MODULE_0__["KPF_ORIENTED"],
    'KPF_DISCARD': _utils_globals__WEBPACK_IMPORTED_MODULE_0__["KPF_DISCARD"],
});

/**
 * Custom preprocessor for shaders
 */
class ShaderPreprocessor
{
    /**
     * Runs the preprocessor
     * @param {string} code 
     * @param {Map<string,number>} [defines]
     * @returns {string} preprocessed code
     */
    static run(code, defines = new Map())
    {
        const errors = []; // compile-time errors

        //
        // The preprocessor will remove comments from GLSL code,
        // include requested GLSL files and import global constants
        // defined for all shaders (see above)
        //
        return unrollLoops(
            String(code)
                .replace(commentsRegex[0], '')
                .replace(commentsRegex[1], '')
                .replace(includeRegex, (_, filename) =>
                    // FIXME: no cycle detection for @include
                    ShaderPreprocessor.run(readfileSync(filename), defines)
                )
                .replace(constantRegex, (_, name) => String(
                    // Find a global constant. If not possible, find a defined constant
                    constants[name] !== undefined ? Number(constants[name]) : (
                        defines.has(name) ? Number(defines.get(name)) : (
                            errors.push(`Undefined constant: ${name}`), 0
                        )
                    )
                )),
            defines
        ) + (errors.length > 0 ? errors.map(msg => `\n#error ${msg}\n`).join('') : '');
    }
}

 /**
 * Reads a shader from the shaders/include/ folder
 * @param {string} filename
 * @returns {string}
 */
function readfileSync(filename)
{
    if(String(filename).match(/^[a-zA-Z0-9_\-]+\.glsl$/))
        return __webpack_require__("./src/gpu/shaders/include sync recursive ^\\.\\/.*$")("./" + filename);

    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["FileNotFoundError"](`Shader preprocessor: can't read file "${filename}"`);
}

/**
 * Unroll for loops in our own preprocessor
 * @param {string} code
 * @param {Map<string,number>} defines
 * @returns {string}
 */
function unrollLoops(code, defines)
{
    //
    // Currently, only integer for loops with positive step values
    // can be unrolled. (TODO: negative step values?)
    //
    // The current implementation does not support curly braces
    // inside unrolled loops. You may define macros to get around
    // this, but do you actually need to unroll such loops?
    //
    // Loops that don't fit the supported pattern will crash
    // the preprocessor if you try to unroll them.
    //
    const fn = unroll.bind(defines); // CRAZY!
    const n = unrollRegex.length;

    for(let i = 0; i < n; i++)
        code = code.replace(unrollRegex[i], fn);

    return code;
}

/**
 * Unroll a loop pattern (regexp)
 * @param {string} match the matched for loop
 * @param {...string} pi matched expression
 * @returns {string} unrolled loop
 */
function unroll(match, type, counter, start, cmp, end, step, loopcode)
{
    const defines = this;

    // check if the loop limits are numeric constants or #defined numbers from the outside
    start = Number.isFinite(+start) ? start : defines.get(start);
    end = Number.isFinite(+end) ? end : defines.get(end);
    if(start === undefined || end === undefined) {
        if(defines.size > 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["ParseError"](`Can't unroll loop: unknown limits (start=${start}, end=${end}). Code:\n\n${match}`);
        else
            return match; // don't unroll now, because defines is empty - maybe we'll succeed in the next pass
    }

    // parse limits
    start = parseInt(start);
    end = parseInt(end);
    step = (step.length == 0) ? 1 : parseInt(step);
    _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(start <= end && step > 0);

    /*
    // debug
    console.log(`Encontrei "${match}"`);
    console.log(`type="${type}"`);
    console.log(`counter="${counter}"`);
    console.log(`start="${start}"`);
    console.log(`cmp="${cmp}"`);
    console.log(`end="${end}"`);
    console.log(`step="${step}"`);
    console.log(`loopcode="${loopcode}"`)
    console.log('Defines:', defines);
    */

    // continue statements are not supported inside unrolled loops
    // and will generate a compiler error. Using break is ok.
    const hasBreak = (loopcode.match(/\bbreak\s*;/) !== null);

    // create a new scope
    let unrolledCode = hasBreak ? 'switch(1) { default:\n' : '{\n';

    // declare counter
    unrolledCode += `${type} ${counter};\n`;

    // unroll loop
    end += (cmp == '<=') ? 1 : 0;
    for(let i = start; i < end; i += step)
        unrolledCode += `{\n${counter} = ${i};\n${loopcode}\n}\n`;

    // close scope
    unrolledCode += '}\n';
    //console.log('Unrolled code:\n\n' + unrolledCode);

    // done!
    return unrolledCode;
}

/***/ }),

/***/ "./src/gpu/shaders sync recursive ^\\.\\/.*$":
/*!***************************************!*\
  !*** ./src/gpu/shaders sync ^\.\/.*$ ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./colors/rgb2grey.glsl": "./src/gpu/shaders/colors/rgb2grey.glsl",
	"./encoders/encode-keypoint-long-offsets.glsl": "./src/gpu/shaders/encoders/encode-keypoint-long-offsets.glsl",
	"./encoders/encode-keypoint-offsets.glsl": "./src/gpu/shaders/encoders/encode-keypoint-offsets.glsl",
	"./encoders/encode-keypoints.glsl": "./src/gpu/shaders/encoders/encode-keypoints.glsl",
	"./encoders/resize-encoded-keypoints.glsl": "./src/gpu/shaders/encoders/resize-encoded-keypoints.glsl",
	"./encoders/upload-keypoints.glsl": "./src/gpu/shaders/encoders/upload-keypoints.glsl",
	"./enhancements/nightvision.glsl": "./src/gpu/shaders/enhancements/nightvision.glsl",
	"./enhancements/normalize-image.glsl": "./src/gpu/shaders/enhancements/normalize-image.glsl",
	"./filters/convolution": "./src/gpu/shaders/filters/convolution.js",
	"./filters/convolution.js": "./src/gpu/shaders/filters/convolution.js",
	"./filters/convolution1d.glsl": "./src/gpu/shaders/filters/convolution1d.glsl",
	"./filters/convolution2d.glsl": "./src/gpu/shaders/filters/convolution2d.glsl",
	"./filters/fast-median.glsl": "./src/gpu/shaders/filters/fast-median.glsl",
	"./include/colors.glsl": "./src/gpu/shaders/include/colors.glsl",
	"./include/fixed-point.glsl": "./src/gpu/shaders/include/fixed-point.glsl",
	"./include/float16.glsl": "./src/gpu/shaders/include/float16.glsl",
	"./include/global.glsl": "./src/gpu/shaders/include/global.glsl",
	"./include/keypoints.glsl": "./src/gpu/shaders/include/keypoints.glsl",
	"./include/math.glsl": "./src/gpu/shaders/include/math.glsl",
	"./include/orientation.glsl": "./src/gpu/shaders/include/orientation.glsl",
	"./include/pyramids.glsl": "./src/gpu/shaders/include/pyramids.glsl",
	"./include/quickselect.glsl": "./src/gpu/shaders/include/quickselect.glsl",
	"./include/sobel.glsl": "./src/gpu/shaders/include/sobel.glsl",
	"./include/subpixel.glsl": "./src/gpu/shaders/include/subpixel.glsl",
	"./keypoints/brisk.glsl": "./src/gpu/shaders/keypoints/brisk.glsl",
	"./keypoints/fast/encode-fast-score.glsl": "./src/gpu/shaders/keypoints/fast/encode-fast-score.glsl",
	"./keypoints/fast/fast-score12.glsl": "./src/gpu/shaders/keypoints/fast/fast-score12.glsl",
	"./keypoints/fast/fast-score16.glsl": "./src/gpu/shaders/keypoints/fast/fast-score16.glsl",
	"./keypoints/fast/fast-score8.glsl": "./src/gpu/shaders/keypoints/fast/fast-score8.glsl",
	"./keypoints/fast/fast5.glsl": "./src/gpu/shaders/keypoints/fast/fast5.glsl",
	"./keypoints/fast/fast7.glsl": "./src/gpu/shaders/keypoints/fast/fast7.glsl",
	"./keypoints/fast/fast9.glsl": "./src/gpu/shaders/keypoints/fast/fast9.glsl",
	"./keypoints/fast/multiscale-fast.glsl": "./src/gpu/shaders/keypoints/fast/multiscale-fast.glsl",
	"./keypoints/harris/encode-harris-score.glsl": "./src/gpu/shaders/keypoints/harris/encode-harris-score.glsl",
	"./keypoints/harris/harris-cutoff.glsl": "./src/gpu/shaders/keypoints/harris/harris-cutoff.glsl",
	"./keypoints/harris/max-harris-score.glsl": "./src/gpu/shaders/keypoints/harris/max-harris-score.glsl",
	"./keypoints/harris/multiscale-harris.glsl": "./src/gpu/shaders/keypoints/harris/multiscale-harris.glsl",
	"./keypoints/harris/multiscale-sobel.glsl": "./src/gpu/shaders/keypoints/harris/multiscale-sobel.glsl",
	"./keypoints/nonmax-suppression.glsl": "./src/gpu/shaders/keypoints/nonmax-suppression.glsl",
	"./keypoints/orb/orb-descriptor.glsl": "./src/gpu/shaders/keypoints/orb/orb-descriptor.glsl",
	"./keypoints/orb/orb-orientation.glsl": "./src/gpu/shaders/keypoints/orb/orb-orientation.glsl",
	"./keypoints/sort-by-score.glsl": "./src/gpu/shaders/keypoints/sort-by-score.glsl",
	"./keypoints/suppress-descriptors.glsl": "./src/gpu/shaders/keypoints/suppress-descriptors.glsl",
	"./keypoints/transfer-orientation.glsl": "./src/gpu/shaders/keypoints/transfer-orientation.glsl",
	"./pyramids/downsample2.glsl": "./src/gpu/shaders/pyramids/downsample2.glsl",
	"./pyramids/upsample2.glsl": "./src/gpu/shaders/pyramids/upsample2.glsl",
	"./trackers/lk-discard.glsl": "./src/gpu/shaders/trackers/lk-discard.glsl",
	"./trackers/lk.glsl": "./src/gpu/shaders/trackers/lk.glsl",
	"./trackers/transfer-flow.glsl": "./src/gpu/shaders/trackers/transfer-flow.glsl",
	"./transforms/resize.glsl": "./src/gpu/shaders/transforms/resize.glsl",
	"./transforms/warp-perspective.glsl": "./src/gpu/shaders/transforms/warp-perspective.glsl",
	"./utils/copy-components.glsl": "./src/gpu/shaders/utils/copy-components.glsl",
	"./utils/fill-components.glsl": "./src/gpu/shaders/utils/fill-components.glsl",
	"./utils/fill.glsl": "./src/gpu/shaders/utils/fill.glsl",
	"./utils/flip-y.glsl": "./src/gpu/shaders/utils/flip-y.glsl",
	"./utils/identity.glsl": "./src/gpu/shaders/utils/identity.glsl",
	"./utils/scan-minmax2d.glsl": "./src/gpu/shaders/utils/scan-minmax2d.glsl"
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
webpackContext.id = "./src/gpu/shaders sync recursive ^\\.\\/.*$";

/***/ }),

/***/ "./src/gpu/shaders/colors/rgb2grey.glsl":
/*!**********************************************!*\
  !*** ./src/gpu/shaders/colors/rgb2grey.glsl ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "const vec4 grey = vec4(0.299f, 0.587f, 0.114f, 0.0f);\nuniform sampler2D image;\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nfloat g = dot(pixel, grey);\ncolor = vec4(g, g, g, 1.0f);\n}"

/***/ }),

/***/ "./src/gpu/shaders/encoders/encode-keypoint-long-offsets.glsl":
/*!********************************************************************!*\
  !*** ./src/gpu/shaders/encoders/encode-keypoint-long-offsets.glsl ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D offsetsImage;\nuniform ivec2 imageSize;\n#ifndef MAX_ITERATIONS\n#error Must define MAX_ITERATIONS\n#endif\n#define decodeSkipOffset(pixel) int((pixel).b * 255.0f) | (int((pixel).a * 255.0f) << 8)\n#define encodeSkipOffset(offset) vec2((offset) & 255, (offset) >> 8) / 255.0f\nvoid main()\n{\nvec4 pixel = threadPixel(offsetsImage);\nivec2 thread = threadLocation();\nvec2 prefix = pixel.rg;\nint rasterIndex = thread.y * imageSize.x + thread.x;\nint offset = decodeSkipOffset(pixel);\nint totalOffset = offset;\nivec2 pos = thread;\n#if 0\nwhile(offset < MAX_ITERATIONS && pos.y < imageSize.y && pixel.r == 0.0f) {\nrasterIndex += offset;\npos = ivec2(rasterIndex % imageSize.x, rasterIndex / imageSize.x);\npixel = pixelAt(offsetsImage, pos);\noffset = decodeSkipOffset(pixel);\ntotalOffset += offset;\n}\n#else\nint allow = 1;\nfor(int i = 0; i < MAX_ITERATIONS; i++) {\nallow *= int(pos.y < imageSize.y) * int(pixel.r == 0.0f);\nrasterIndex += allow * offset;\npos = ivec2(rasterIndex % imageSize.x, rasterIndex / imageSize.x);\npixel = pixelAt(offsetsImage, pos);\noffset = decodeSkipOffset(pixel);\ntotalOffset += allow * offset;\n}\n#endif\ntotalOffset = min(totalOffset, 65535);\ncolor = vec4(prefix, encodeSkipOffset(totalOffset));\n}"

/***/ }),

/***/ "./src/gpu/shaders/encoders/encode-keypoint-offsets.glsl":
/*!***************************************************************!*\
  !*** ./src/gpu/shaders/encoders/encode-keypoint-offsets.glsl ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nuniform ivec2 imageSize;\n#if !defined(MAX_ITERATIONS)\n#error Must define MAX_ITERATIONS\n#elif MAX_ITERATIONS > 255\n#error MAX_ITERATIONS must be less than 256\n#endif\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nivec2 pos = threadLocation();\nvec2 prefix = pixel.ra;\nint offset = 0;\n#if 0\nwhile(offset < MAX_ITERATIONS && pos.y < imageSize.y && pixelAt(image, pos).r == 0.0f) {\n++offset;\npos.x = (pos.x + 1) % imageSize.x;\npos.y += int(pos.x == 0);\n}\n#else\nint allow = 1;\nfor(int i = 0; i < MAX_ITERATIONS; i++) {\nallow *= int(pos.y < imageSize.y) * int(pixel.r == 0.0f);\noffset += allow;\npos.x = (pos.x + 1) % imageSize.x;\npos.y += int(pos.x == 0);\npixel = pixelAt(image, pos);\n}\n#endif\ncolor = vec4(prefix, float(offset) / 255.0f, 0.0f);\n}"

/***/ }),

/***/ "./src/gpu/shaders/encoders/encode-keypoints.glsl":
/*!********************************************************!*\
  !*** ./src/gpu/shaders/encoders/encode-keypoints.glsl ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D offsetsImage;\nuniform sampler2D encodedKeypoints;\nuniform ivec2 imageSize;\nuniform int passId;\nuniform int numPasses;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#define decodeSkipOffset(pixel) int((pixel).b * 255.0f) | (int((pixel).a * 255.0f) << 8)\nbool findQthKeypoint(int q, int p, inout ivec2 position, out vec4 pixel)\n{\nint notFirstPass = int(passId > 0);\nposition *= notFirstPass;\np |= -(1 - notFirstPass);\np -= notFirstPass;\nint rasterIndex = position.y * imageSize.x + position.x;\nwhile(position.y < imageSize.y && p != q) {\nposition = ivec2(rasterIndex % imageSize.x, rasterIndex / imageSize.x);\npixel = texelFetch(offsetsImage, position, 0);\np += int(pixel.r > 0.0f);\nrasterIndex += max(1, decodeSkipOffset(pixel));\n}\nreturn (p == q);\n}\nvoid main()\n{\nivec2 thread = threadLocation();\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint q = findKeypointIndex(address, descriptorSize, extraSize);\ncolor = vec4(0.0f);\nif(address.offset > 1)\nreturn;\ncolor = threadPixel(encodedKeypoints);\nint numPixels = encoderLength * encoderLength;\nint maxKeypoints = numPixels / pixelsPerKeypoint;\nint maxKeypointsPerPass = maxKeypoints / numPasses + int(maxKeypoints % numPasses != 0);\nint targetPassId = q / maxKeypointsPerPass;\nif(passId != targetPassId)\nreturn;\n#if 1\nint lastIndexFromPrevPass = passId * maxKeypointsPerPass - 1;\nKeypointAddress lastAddressFromPrevPass = KeypointAddress(max(0, lastIndexFromPrevPass) * pixelsPerKeypoint, 0);\nKeypoint lastKeypointFromPrevPass = decodeKeypoint(encodedKeypoints, encoderLength, lastAddressFromPrevPass);\nivec2 position = ivec2(lastKeypointFromPrevPass.position);\n#else\nint lastIndexFromPrevPass = -1; ivec2 position = ivec2(0);\n#endif\nvec4 pixel;\ncolor = encodeNullKeypoint();\nif(q >= maxKeypoints || !findQthKeypoint(q, lastIndexFromPrevPass, position, pixel))\nreturn;\ncolor = (address.offset == 1) ? vec4(\npixel.g,\n0.0f,\npixel.r,\nencodeKeypointFlags(KPF_NONE)\n) : encodeKeypointPosition(\nvec2(position)\n);\n}"

/***/ }),

/***/ "./src/gpu/shaders/encoders/resize-encoded-keypoints.glsl":
/*!****************************************************************!*\
  !*** ./src/gpu/shaders/encoders/resize-encoded-keypoints.glsl ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D inputTexture;\nuniform int inputDescriptorSize;\nuniform int inputExtraSize;\nuniform int inputEncoderLength;\nuniform int outputDescriptorSize;\nuniform int outputExtraSize;\nuniform int outputEncoderLength;\nvoid main()\n{\nvec4 pixel = threadPixel(inputTexture);\nivec2 thread = threadLocation();\nKeypointAddress myAddress = findKeypointAddress(\nthread,\noutputEncoderLength,\noutputDescriptorSize,\noutputExtraSize\n);\nint myIndex = findKeypointIndex(\nmyAddress,\noutputDescriptorSize,\noutputExtraSize\n);\nint pixelsPerKeypoint = sizeofEncodedKeypoint(inputDescriptorSize, inputExtraSize) / 4;\nKeypointAddress otherAddress = KeypointAddress(\nmyIndex * pixelsPerKeypoint,\nmyAddress.offset\n);\nint head = MIN_KEYPOINT_SIZE / 4;\ncolor = (myAddress.offset >= head) ? vec4(0.0f) :\nreadKeypointData(inputTexture, inputEncoderLength, otherAddress);\n}"

/***/ }),

/***/ "./src/gpu/shaders/encoders/upload-keypoints.glsl":
/*!********************************************************!*\
  !*** ./src/gpu/shaders/encoders/upload-keypoints.glsl ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform int keypointCount;\nuniform int encoderLength;\nuniform int descriptorSize;\nuniform int extraSize;\n#ifndef KEYPOINT_BUFFER_LENGTH\n#error Must specify KEYPOINT_BUFFER_LENGTH\n#endif\nlayout(std140) uniform KeypointBuffer\n{\nvec4 keypointBuffer[KEYPOINT_BUFFER_LENGTH];\n};\nvoid main()\n{\nivec2 thread = threadLocation();\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint q = findKeypointIndex(address, descriptorSize, extraSize);\ncolor = vec4(1.0f);\nif(q >= keypointCount)\nreturn;\nvec4 data = keypointBuffer[q];\nswitch(address.offset) {\ncase 0: {\nfixed2_t pos = vec2tofix(data.xy);\nfixed2_t lo = pos & 255;\nfixed2_t hi = pos >> 8;\ncolor = vec4(float(lo.x), float(hi.x), float(lo.y), float(hi.y)) / 255.0f;\nbreak;\n}\ncase 1: {\nfloat score = data.w;\nfloat scale = encodeLod(data.z);\nfloat rotation = encodeOrientation(0.0f);\ncolor = vec4(scale, rotation, score, 0.0f);\nbreak;\n}\ndefault: {\ncolor = vec4(0.0f);\nbreak;\n}\n}\n}"

/***/ }),

/***/ "./src/gpu/shaders/enhancements/nightvision.glsl":
/*!*******************************************************!*\
  !*** ./src/gpu/shaders/enhancements/nightvision.glsl ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nuniform sampler2D illuminationMap;\nuniform float gain;\nuniform float offset;\nuniform float decay;\nconst mat3 rgb2yuv = mat3(\n0.299f, -0.14713f, 0.615f,\n0.587f, -0.28886f, -0.51499f,\n0.114f, 0.436f, -0.10001f\n);\nconst mat3 yuv2rgb = mat3(\n1.0f, 1.0f, 1.0f,\n0.0f, -0.39465f, 2.03211f,\n1.13983f, -0.58060f, 0.0f\n);\nconst float eps = 0.0001f;\nconst float sqrt2 = 1.4142135623730951f;\nconst float magic = 20.0f;\nconst vec2 center = vec2(0.5f);\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nvec4 imapPixel = threadPixel(illuminationMap);\nfloat lambda = -sqrt2 * log(max(1.0f - decay, eps));\nfloat dist = length(texCoord - center);\nfloat vgain = gain * exp(-lambda * dist);\nfloat normalizedGain = 2.0f * vgain;\nfloat normalizedOffset = 2.0f * offset - 1.0f;\n#ifdef GREYSCALE\nfloat luma = 1.0 / (1.0 + exp(-normalizedGain * magic * (pixel.g - imapPixel.g)));\nluma = clamp(luma + normalizedOffset, 0.0f, 1.0f);\ncolor = vec4(luma, luma, luma, 1.0f);\n#else\nvec3 yuvPixel = rgb2yuv * pixel.rgb;\nvec3 yuvImapPixel = rgb2yuv * imapPixel.rgb;\nfloat luma = 1.0 / (1.0 + exp(-normalizedGain * magic * (yuvPixel.r - yuvImapPixel.r)));\nluma += normalizedOffset;\nvec3 rgbCorrectedPixel = yuv2rgb * vec3(luma, yuvPixel.gb);\nrgbCorrectedPixel = clamp(rgbCorrectedPixel, 0.0f, 1.0f);\ncolor = vec4(rgbCorrectedPixel, 1.0f);\n#endif\n}"

/***/ }),

/***/ "./src/gpu/shaders/enhancements/normalize-image.glsl":
/*!***********************************************************!*\
  !*** ./src/gpu/shaders/enhancements/normalize-image.glsl ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#ifdef GREYSCALE\nuniform sampler2D minmax2d;\n#else\nuniform sampler2D minmax2dRGB[3];\n#endif\nuniform float minValue;\nuniform float maxValue;\nconst float eps = 1.0f / 255.0f;\nvoid main()\n{\nvec2 minmax = clamp(vec2(minValue, maxValue), 0.0f, 255.0f) / 255.0f;\nvec4 newMin = vec4(minmax.x);\nvec4 newRange = vec4(minmax.y - minmax.x);\nvec4 alpha = vec4(1.0f, newMin.x, newRange.x, 1.0f);\n#ifdef GREYSCALE\nvec4 pixel = threadPixel(minmax2d);\nmat4 channel = mat4(pixel, pixel, pixel, alpha);\n#else\nmat4 channel = mat4(\nthreadPixel(minmax2dRGB[0]),\nthreadPixel(minmax2dRGB[1]),\nthreadPixel(minmax2dRGB[2]),\nalpha\n);\n#endif\nvec4 oldMin = vec4(channel[0].g, channel[1].g, channel[2].g, channel[3].g);\nvec4 oldRange = max(vec4(channel[0].b, channel[1].b, channel[2].b, channel[3].b), eps);\nvec4 oldIntensity = vec4(channel[0].a, channel[1].a, channel[2].a, channel[3].a);\nvec4 newIntensity = (oldIntensity - oldMin) * newRange / oldRange + newMin;\ncolor = newIntensity;\n}"

/***/ }),

/***/ "./src/gpu/shaders/filters/convolution.js":
/*!************************************************!*\
  !*** ./src/gpu/shaders/filters/convolution.js ***!
  \************************************************/
/*! exports provided: conv2D, convX, convY */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "conv2D", function() { return conv2D; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convX", function() { return convX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convY", function() { return convY; });
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/errors */ "./src/utils/errors.js");
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
 * convolution.js
 * Convolution shader generators
 */







/**
 * Generate a 2D convolution with a square kernel
 * @param {Array<number>} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 */
function conv2D(kernel, normalizationConstant = 1.0)
{
    const kernel32 = new Float32Array(kernel.map(x => (+x) * (+normalizationConstant)));
    const kSize = Math.sqrt(kernel32.length) | 0;
    const N = kSize >> 1; // idiv 2

    // validate input
    if(kSize < 1 || kSize % 2 == 0)
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalArgumentError"](`Can't perform a 2D convolution with an invalid kSize of ${kSize}`);
    else if(kSize * kSize != kernel32.length)
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalArgumentError"](`Invalid 2D convolution kernel of ${kernel32.length} elements (expected: square)`);

    // select the appropriate pixel function
    const pixelAtOffset = (N <= 7) ? 'pixelAtShortOffset' : 'pixelAtLongOffset';

    // code generator
    const foreachKernelElement = fn => _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].cartesian(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].symmetricRange(N), _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].symmetricRange(N)).map(
        cur => fn(
            kernel32[(cur[0] + N) * kSize + (cur[1] + N)],
            cur[0], cur[1]
        )
    ).join('\n');

    const generateCode = (k, dy, dx) => `
        result += ${pixelAtOffset}(image, ivec2(${(-dx) | 0}, ${(-dy) | 0})) * float(${+k});
    `;

    // shader
    const source = `
    uniform sampler2D image;

    void main()
    {
        float alpha = threadPixel(image).a;
        vec4 result = vec4(0.0f);

        ${foreachKernelElement(generateCode)}

        color = vec4(result.rgb, alpha);
    }
    `;

    // done!
    return Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_0__["createShader"])(source).withArguments('image');
}




/**
 * Generate a 1D convolution function on the x-axis
 * @param {Array<number>} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 */
function convX(kernel, normalizationConstant = 1.0)
{
    return conv1D('x', kernel, normalizationConstant);
}




/**
 * Generate a 1D convolution function on the y-axis
 * @param {Array<number>} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 */
function convY(kernel, normalizationConstant = 1.0)
{
    return conv1D('y', kernel, normalizationConstant);
}




/**
 * 1D convolution function generator
 * @param {string} axis either "x" or "y"
 * @param {Array<number>} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 */
function conv1D(axis, kernel, normalizationConstant = 1.0)
{
    const kernel32 = new Float32Array(kernel.map(x => (+x) * (+normalizationConstant)));
    const kSize = kernel32.length;
    const N = kSize >> 1; // idiv 2

    // validate input
    if(kSize < 1 || kSize % 2 == 0)
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalArgumentError"](`Can't perform a 1D convolution with an invalid kSize of ${kSize}`);
    else if(axis != 'x' && axis != 'y')
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalArgumentError"](`Can't perform 1D convolution: invalid axis "${axis}"`); // this should never happen

    // select the appropriate pixel function
    const pixelAtOffset = (N <= 7) ? 'pixelAtShortOffset' : 'pixelAtLongOffset';

    // code generator
    const foreachKernelElement = fn => _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].symmetricRange(N).reduce(
        (acc, cur) => acc + fn(kernel32[cur + N], cur),
    '');
    const generateCode = (k, i) => ((axis == 'x') ? `
        pixel += ${pixelAtOffset}(image, ivec2(${(-i) | 0}, 0)) * float(${+k});
    ` : `
        pixel += ${pixelAtOffset}(image, ivec2(0, ${(-i) | 0})) * float(${+k});
    `);

    // shader
    const source = `
    uniform sampler2D image;

    void main()
    {
        float alpha = threadPixel(image).a;
        vec4 pixel = vec4(0.0f);

        ${foreachKernelElement(generateCode)}

        color = vec4(pixel.rgb, alpha);
    }
    `;

    // done!
    return Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_0__["createShader"])(source).withArguments('image');
}

/***/ }),

/***/ "./src/gpu/shaders/filters/convolution1d.glsl":
/*!****************************************************!*\
  !*** ./src/gpu/shaders/filters/convolution1d.glsl ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#if !defined(KERNEL_SIZE) || !defined(AXIS)\n#define Must define KERNEL_SIZE and AXIS\n#endif\nuniform sampler2D image;\nuniform float kernel[@KERNEL_SIZE@];\n#define S(x,y,k) result += pixelAtShortOffset(image, ivec2((x),(y))) * kernel[k]\nvoid main()\n{\nvec4 result = vec4(0.0f);\n#if AXIS == 0 && KERNEL_SIZE == 3\nS(-1, 0, 2);\nS( 0, 0, 1);\nS( 1, 0, 0);\n#elif AXIS == 1 && KERNEL_SIZE == 3\nS( 0,-1, 2);\nS( 0, 0, 1);\nS( 0, 1, 0);\n#elif AXIS == 0 && KERNEL_SIZE == 5\nS(-2, 0, 4);\nS(-1, 0, 3);\nS( 0, 0, 2);\nS( 1, 0, 1);\nS( 2, 0, 0);\n#elif AXIS == 1 && KERNEL_SIZE == 5\nS(0,-2, 4);\nS(0,-1, 3);\nS(0, 0, 2);\nS(0, 1, 1);\nS(0, 2, 0);\n#elif AXIS == 0 && KERNEL_SIZE == 7\nS(-3, 0, 6);\nS(-2, 0, 5);\nS(-1, 0, 4);\nS( 0, 0, 3);\nS( 1, 0, 2);\nS( 2, 0, 1);\nS( 3, 0, 0);\n#elif AXIS == 1 && KERNEL_SIZE == 7\nS(0,-3, 6);\nS(0,-2, 5);\nS(0,-1, 4);\nS(0, 0, 3);\nS(0, 1, 2);\nS(0, 2, 1);\nS(0, 3, 0);\n#elif AXIS == 0 && KERNEL_SIZE == 9\nS(-4, 0, 8);\nS(-3, 0, 7);\nS(-2, 0, 6);\nS(-1, 0, 5);\nS( 0, 0, 4);\nS( 1, 0, 3);\nS( 2, 0, 2);\nS( 3, 0, 1);\nS( 4, 0, 0);\n#elif AXIS == 1 && KERNEL_SIZE == 9\nS(0,-4, 8);\nS(0,-3, 7);\nS(0,-2, 6);\nS(0,-1, 5);\nS(0, 0, 4);\nS(0, 1, 3);\nS(0, 2, 2);\nS(0, 3, 1);\nS(0, 4, 0);\n#elif AXIS == 0 && KERNEL_SIZE == 11\nS(-5, 0, 10);\nS(-4, 0, 9);\nS(-3, 0, 8);\nS(-2, 0, 7);\nS(-1, 0, 6);\nS( 0, 0, 5);\nS( 1, 0, 4);\nS( 2, 0, 3);\nS( 3, 0, 2);\nS( 4, 0, 1);\nS( 5, 0, 0);\n#elif AXIS == 1 && KERNEL_SIZE == 11\nS(0,-5, 10);\nS(0,-4, 9);\nS(0,-3, 8);\nS(0,-2, 7);\nS(0,-1, 6);\nS(0, 0, 5);\nS(0, 1, 4);\nS(0, 2, 3);\nS(0, 3, 2);\nS(0, 4, 1);\nS(0, 5, 0);\n#elif AXIS == 0 && KERNEL_SIZE == 13\nS(-6, 0, 12);\nS(-5, 0, 11);\nS(-4, 0, 10);\nS(-3, 0, 9);\nS(-2, 0, 8);\nS(-1, 0, 7);\nS( 0, 0, 6);\nS( 1, 0, 5);\nS( 2, 0, 4);\nS( 3, 0, 3);\nS( 4, 0, 2);\nS( 5, 0, 1);\nS( 6, 0, 0);\n#elif AXIS == 1 && KERNEL_SIZE == 13\nS(0,-6, 12);\nS(0,-5, 11);\nS(0,-4, 10);\nS(0,-3, 9);\nS(0,-2, 8);\nS(0,-1, 7);\nS(0, 0, 6);\nS(0, 1, 5);\nS(0, 2, 4);\nS(0, 3, 3);\nS(0, 4, 2);\nS(0, 5, 1);\nS(0, 6, 0);\n#elif AXIS == 0 && KERNEL_SIZE == 15\nS(-7, 0, 14);\nS(-6, 0, 13);\nS(-5, 0, 12);\nS(-4, 0, 11);\nS(-3, 0, 10);\nS(-2, 0, 9);\nS(-1, 0, 8);\nS( 0, 0, 7);\nS( 1, 0, 6);\nS( 2, 0, 5);\nS( 3, 0, 4);\nS( 4, 0, 3);\nS( 5, 0, 2);\nS( 6, 0, 1);\nS( 7, 0, 0);\n#elif AXIS == 1 && KERNEL_SIZE == 15\nS(0,-7, 14);\nS(0,-6, 13);\nS(0,-5, 12);\nS(0,-4, 11);\nS(0,-3, 10);\nS(0,-2, 9);\nS(0,-1, 8);\nS(0, 0, 7);\nS(0, 1, 6);\nS(0, 2, 5);\nS(0, 3, 4);\nS(0, 4, 3);\nS(0, 5, 2);\nS(0, 6, 1);\nS(0, 7, 0);\n#else\n#error Invalid parameters\n#endif\ncolor = vec4(result.rgb, 1.0f);\n}"

/***/ }),

/***/ "./src/gpu/shaders/filters/convolution2d.glsl":
/*!****************************************************!*\
  !*** ./src/gpu/shaders/filters/convolution2d.glsl ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#ifndef KERNEL_SIZE_SQUARED\n#define Must define KERNEL_SIZE_SQUARED\n#endif\nuniform sampler2D image;\nuniform float kernel[@KERNEL_SIZE_SQUARED@];\n#define S(x,y,k) result += pixelAtShortOffset(image, ivec2((x),(y))) * kernel[k]\nvoid main()\n{\nvec4 result = vec4(0.0f);\n#if KERNEL_SIZE_SQUARED == 9\nS(-1,-1, 8);\nS(-1, 0, 7);\nS(-1, 1, 6);\nS( 0,-1, 5);\nS( 0, 0, 4);\nS( 0, 1, 3);\nS( 1,-1, 2);\nS( 1, 0, 1);\nS( 1, 1, 0);\n#elif KERNEL_SIZE_SQUARED == 25\nS(-2,-2, 24);\nS(-2,-1, 23);\nS(-2, 0, 22);\nS(-2, 1, 21);\nS(-2, 2, 20);\nS(-1,-2, 19);\nS(-1,-1, 18);\nS(-1, 0, 17);\nS(-1, 1, 16);\nS(-1, 2, 15);\nS( 0,-2, 14);\nS( 0,-1, 13);\nS( 0, 0, 12);\nS( 0, 1, 11);\nS( 0, 2, 10);\nS( 1,-2, 9);\nS( 1,-1, 8);\nS( 1, 0, 7);\nS( 1, 1, 6);\nS( 1, 2, 5);\nS( 2,-2, 4);\nS( 2,-1, 3);\nS( 2, 0, 2);\nS( 2, 1, 1);\nS( 2, 2, 0);\n#elif KERNEL_SIZE_SQUARED == 49\nS(-3,-3, 48);\nS(-3,-2, 47);\nS(-3,-1, 46);\nS(-3, 0, 45);\nS(-3, 1, 44);\nS(-3, 2, 43);\nS(-3, 3, 42);\nS(-2,-3, 41);\nS(-2,-2, 40);\nS(-2,-1, 39);\nS(-2, 0, 38);\nS(-2, 1, 37);\nS(-2, 2, 36);\nS(-2, 3, 35);\nS(-1,-3, 34);\nS(-1,-2, 33);\nS(-1,-1, 32);\nS(-1, 0, 31);\nS(-1, 1, 30);\nS(-1, 2, 29);\nS(-1, 3, 28);\nS( 0,-3, 27);\nS( 0,-2, 26);\nS( 0,-1, 25);\nS( 0, 0, 24);\nS( 0, 1, 23);\nS( 0, 2, 22);\nS( 0, 3, 21);\nS( 1,-3, 20);\nS( 1,-2, 19);\nS( 1,-1, 18);\nS( 1, 0, 17);\nS( 1, 1, 16);\nS( 1, 2, 15);\nS( 1, 3, 14);\nS( 2,-3, 13);\nS( 2,-2, 12);\nS( 2,-1, 11);\nS( 2, 0, 10);\nS( 2, 1, 9);\nS( 2, 2, 8);\nS( 2, 3, 7);\nS( 3,-3, 6);\nS( 3,-2, 5);\nS( 3,-1, 4);\nS( 3, 0, 3);\nS( 3, 1, 2);\nS( 3, 2, 1);\nS( 3, 3, 0);\n#else\n#error Invalid KERNEL_SIZE_SQUARED\n#endif\ncolor = vec4(result.rgb, 1.0f);\n}"

/***/ }),

/***/ "./src/gpu/shaders/filters/fast-median.glsl":
/*!**************************************************!*\
  !*** ./src/gpu/shaders/filters/fast-median.glsl ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\n#define X(i,j) t = vec2(min(p[i], p[j]), max(p[i], p[j])); p[i] = t.x; p[j] = t.y;\n#define S(i,x,y) p[i] = pixelAtShortOffset(image, ivec2((x),(y))).g\nvoid main()\n{\nfloat median;\nvec2 t;\n#if !defined(KERNEL_SIZE)\n#error Must define KERNEL_SIZE\n#elif KERNEL_SIZE == 3\nfloat p[9];\nS(0,-1,-1);\nS(1, 0,-1);\nS(2, 1,-1);\nS(3,-1, 0);\nS(4, 0, 0);\nS(5, 1, 0);\nS(6,-1, 1);\nS(7, 0, 1);\nS(8, 1, 1);\nX(1,2);X(4,5);X(7,8);X(0,1);X(3,4);X(6,7);X(1,2);X(4,5);X(7,8);X(0,3);X(5,8);X(4,7);X(3,6);X(1,4);X(2,5);X(4,7);X(4,2);X(6,4);X(4,2);\nmedian = p[4];\n#elif KERNEL_SIZE == 5\nfloat p[25];\nS( 0,-2,-2);\nS( 1,-1,-2);\nS( 2, 0,-2);\nS( 3, 1,-2);\nS( 4, 2,-2);\nS( 5,-2,-1);\nS( 6,-1,-1);\nS( 7, 0,-1);\nS( 8, 1,-1);\nS( 9, 2,-1);\nS(10,-2, 0);\nS(11,-1, 0);\nS(12, 0, 0);\nS(13, 1, 0);\nS(14, 2, 0);\nS(15,-2, 1);\nS(16,-1, 1);\nS(17, 0, 1);\nS(18, 1, 1);\nS(19, 2, 1);\nS(20,-2, 2);\nS(21,-1, 2);\nS(22, 0, 2);\nS(23, 1, 2);\nS(24, 2, 2);\nX(0,1);X(3,4);X(2,4);X(2,3);X(6,7);X(5,7);X(5,6);X(9,10);X(8,10);X(8,9);X(12,13);X(11,13);X(11,12);X(15,16);X(14,16);X(14,15);X(18,19);X(17,19);X(17,18);X(21,22);X(20,22);X(20,21);X(23,24);X(2,5);X(3,6);X(0,6);X(0,3);X(4,7);X(1,7);X(1,4);X(11,14);X(8,14);X(8,11);X(12,15);X(9,15);X(9,12);X(13,16);X(10,16);X(10,13);X(20,23);X(17,23);X(17,20);X(21,24);X(18,24);X(18,21);X(19,22);X(8,17);X(9,18);X(0,18);X(0,9);X(10,19);X(1,19);X(1,10);X(11,20);X(2,20);X(2,11);X(12,21);X(3,21);X(3,12);X(13,22);X(4,22);X(4,13);X(14,23);X(5,23);X(5,14);X(15,24);X(6,24);X(6,15);X(7,16);X(7,19);X(13,21);X(15,23);X(7,13);X(7,15);X(1,9);X(3,11);X(5,17);X(11,17);X(9,17);X(4,10);X(6,12);X(7,14);X(4,6);X(4,7);X(12,14);X(10,14);X(6,7);X(10,12);X(6,10);X(6,17);X(12,17);X(7,17);X(7,10);X(12,18);X(7,12);X(10,18);X(12,20);X(10,20);X(10,12);\nmedian = p[12];\n#elif KERNEL_SIZE == 7\nfloat p[49];\nS( 0,-3,-3);\nS( 1,-2,-3);\nS( 2,-1,-3);\nS( 3, 0,-3);\nS( 4, 1,-3);\nS( 5, 2,-3);\nS( 6, 3,-3);\nS( 7,-3,-2);\nS( 8,-2,-2);\nS( 9,-1,-2);\nS(10, 0,-2);\nS(11, 1,-2);\nS(12, 2,-2);\nS(13, 3,-2);\nS(14,-3,-1);\nS(15,-2,-1);\nS(16,-1,-1);\nS(17, 0,-1);\nS(18, 1,-1);\nS(19, 2,-1);\nS(20, 3,-1);\nS(21,-3, 0);\nS(22,-2, 0);\nS(23,-1, 0);\nS(24, 0, 0);\nS(25, 1, 0);\nS(26, 2, 0);\nS(27, 3, 0);\nS(28,-3, 1);\nS(29,-2, 1);\nS(30,-1, 1);\nS(31, 0, 1);\nS(32, 1, 1);\nS(33, 2, 1);\nS(34, 3, 1);\nS(35,-3, 2);\nS(36,-2, 2);\nS(37,-1, 2);\nS(38, 0, 2);\nS(39, 1, 2);\nS(40, 2, 2);\nS(41, 3, 2);\nS(42,-3, 3);\nS(43,-2, 3);\nS(44,-1, 3);\nS(45, 0, 3);\nS(46, 1, 3);\nS(47, 2, 3);\nS(48, 3, 3);\nX(0,1);X(2,3);X(0,2);X(1,3);X(1,2);X(4,5);X(6,7);X(4,6);X(5,7);X(5,6);X(0,4);X(2,6);X(2,4);X(1,5);X(3,7);X(3,5);X(1,2);X(3,4);X(5,6);X(8,9);X(10,11);X(8,10);X(9,11);X(9,10);X(12,13);X(14,15);X(12,14);X(13,15);X(13,14);X(8,12);X(10,14);X(10,12);X(9,13);X(11,15);X(11,13);X(9,10);X(11,12);X(13,14);X(0,8);X(4,12);X(4,8);X(2,10);X(6,14);X(6,10);X(2,4);X(6,8);X(10,12);X(1,9);X(5,13);X(5,9);X(3,11);X(7,15);X(7,11);X(3,5);X(7,9);X(11,13);X(1,2);X(3,4);X(5,6);X(7,8);X(9,10);X(11,12);X(13,14);X(16,17);X(18,19);X(16,18);X(17,19);X(17,18);X(20,21);X(22,23);X(20,22);X(21,23);X(21,22);X(16,20);X(18,22);X(18,20);X(17,21);X(19,23);X(19,21);X(17,18);X(19,20);X(21,22);X(24,25);X(26,27);X(24,26);X(25,27);X(25,26);X(28,29);X(30,31);X(28,30);X(29,31);X(29,30);X(24,28);X(26,30);X(26,28);X(25,29);X(27,31);X(27,29);X(25,26);X(27,28);X(29,30);X(16,24);X(20,28);X(20,24);X(18,26);X(22,30);X(22,26);X(18,20);X(22,24);X(26,28);X(17,25);X(21,29);X(21,25);X(19,27);X(23,31);X(23,27);X(19,21);X(23,25);X(27,29);X(17,18);X(19,20);X(21,22);X(23,24);X(25,26);X(27,28);X(29,30);X(0,16);X(8,24);X(8,16);X(4,20);X(12,28);X(12,20);X(4,8);X(12,16);X(20,24);X(2,18);X(10,26);X(10,18);X(6,22);X(14,30);X(14,22);X(6,10);X(14,18);X(22,26);X(2,4);X(6,8);X(10,12);X(14,16);X(18,20);X(22,24);X(26,28);X(1,17);X(9,25);X(9,17);X(5,21);X(13,29);X(13,21);X(5,9);X(13,17);X(21,25);X(3,19);X(11,27);X(11,19);X(7,23);X(15,31);X(15,23);X(7,11);X(15,19);X(23,27);X(3,5);X(7,9);X(11,13);X(15,17);X(19,21);X(23,25);X(27,29);X(1,2);X(3,4);X(5,6);X(7,8);X(9,10);X(11,12);X(13,14);X(15,16);X(17,18);X(19,20);X(21,22);X(23,24);X(25,26);X(27,28);X(29,30);X(32,33);X(34,35);X(32,34);X(33,35);X(33,34);X(36,37);X(38,39);X(36,38);X(37,39);X(37,38);X(32,36);X(34,38);X(34,36);X(33,37);X(35,39);X(35,37);X(33,34);X(35,36);X(37,38);X(40,41);X(42,43);X(40,42);X(41,43);X(41,42);X(44,45);X(46,47);X(44,46);X(45,47);X(45,46);X(40,44);X(42,46);X(42,44);X(41,45);X(43,47);X(43,45);X(41,42);X(43,44);X(45,46);X(32,40);X(36,44);X(36,40);X(34,42);X(38,46);X(38,42);X(34,36);X(38,40);X(42,44);X(33,41);X(37,45);X(37,41);X(35,43);X(39,47);X(39,43);X(35,37);X(39,41);X(43,45);X(33,34);X(35,36);X(37,38);X(39,40);X(41,42);X(43,44);X(45,46);X(32,48);X(40,48);X(36,40);X(44,48);X(38,42);X(34,36);X(38,40);X(42,44);X(46,48);X(37,41);X(39,43);X(35,37);X(39,41);X(43,45);X(33,34);X(35,36);X(37,38);X(39,40);X(41,42);X(43,44);X(45,46);X(47,48);X(0,32);X(16,48);X(16,32);X(8,40);X(24,40);X(8,16);X(24,32);X(40,48);X(4,36);X(20,36);X(12,44);X(28,44);X(12,20);X(28,36);X(4,8);X(12,16);X(20,24);X(28,32);X(36,40);X(44,48);X(2,34);X(18,34);X(10,42);X(26,42);X(10,18);X(26,34);X(6,38);X(22,38);X(14,46);X(30,46);X(14,22);X(30,38);X(6,10);X(14,18);X(22,26);X(30,34);X(38,42);X(2,4);X(6,8);X(10,12);X(14,16);X(18,20);X(22,24);X(26,28);X(30,32);X(34,36);X(38,40);X(42,44);X(46,48);X(1,33);X(17,33);X(9,41);X(25,41);X(9,17);X(25,33);X(5,37);X(21,37);X(13,45);X(29,45);X(13,21);X(29,37);X(5,9);X(13,17);X(21,25);X(29,33);X(37,41);X(3,35);X(19,35);X(11,43);X(27,43);X(11,19);X(27,35);X(7,39);X(23,39);X(15,47);X(31,47);X(15,23);X(31,39);X(7,11);X(15,19);X(23,27);X(31,35);X(39,43);X(3,5);X(7,9);X(11,13);X(15,17);X(19,21);X(23,25);X(27,29);X(31,33);X(35,37);X(39,41);X(43,45);X(1,2);X(3,4);X(5,6);X(7,8);X(9,10);X(11,12);X(13,14);X(15,16);X(17,18);X(19,20);X(21,22);X(23,24);\nmedian = p[24];\n#else\n#error Unsupported kernel size\n#endif\ncolor = vec4(median, median, median, 1.0f);\n}"

/***/ }),

/***/ "./src/gpu/shaders/include sync recursive ^\\.\\/.*$":
/*!***********************************************!*\
  !*** ./src/gpu/shaders/include sync ^\.\/.*$ ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./colors.glsl": "./src/gpu/shaders/include/colors.glsl",
	"./fixed-point.glsl": "./src/gpu/shaders/include/fixed-point.glsl",
	"./float16.glsl": "./src/gpu/shaders/include/float16.glsl",
	"./global.glsl": "./src/gpu/shaders/include/global.glsl",
	"./keypoints.glsl": "./src/gpu/shaders/include/keypoints.glsl",
	"./math.glsl": "./src/gpu/shaders/include/math.glsl",
	"./orientation.glsl": "./src/gpu/shaders/include/orientation.glsl",
	"./pyramids.glsl": "./src/gpu/shaders/include/pyramids.glsl",
	"./quickselect.glsl": "./src/gpu/shaders/include/quickselect.glsl",
	"./sobel.glsl": "./src/gpu/shaders/include/sobel.glsl",
	"./subpixel.glsl": "./src/gpu/shaders/include/subpixel.glsl"
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
webpackContext.id = "./src/gpu/shaders/include sync recursive ^\\.\\/.*$";

/***/ }),

/***/ "./src/gpu/shaders/include/colors.glsl":
/*!*********************************************!*\
  !*** ./src/gpu/shaders/include/colors.glsl ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#ifndef _COLORS_GLSL\n#define _COLORS_GLSL\n#define PIXELCOMPONENT_RED   @PIXELCOMPONENT_RED@\n#define PIXELCOMPONENT_GREEN @PIXELCOMPONENT_GREEN@\n#define PIXELCOMPONENT_BLUE  @PIXELCOMPONENT_BLUE@\n#define PIXELCOMPONENT_ALPHA @PIXELCOMPONENT_ALPHA@\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/fixed-point.glsl":
/*!**************************************************!*\
  !*** ./src/gpu/shaders/include/fixed-point.glsl ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#ifndef _FIXEDPOINT_GLSL\n#define _FIXEDPOINT_GLSL\n#define fixed_t int\n#define fixed2_t ivec2\nconst int FIX_BITS = int(@FIX_BITS@);\nconst float FIX_RESOLUTION = float(@FIX_RESOLUTION@);\n#define itofix(x) fixed_t((x) << FIX_BITS)\n#define fixtoi(f) int((x) >> FIX_BITS)\n#define ftofix(x) fixed_t((x) * FIX_RESOLUTION + 0.5f)\n#define fixtof(f) (float(f) / FIX_RESOLUTION)\n#define ivec2tofix(x) fixed2_t((x) << FIX_BITS)\n#define fixtoivec2(f) ivec2((f) >> FIX_BITS)\n#define vec2tofix(v) fixed2_t((v) * FIX_RESOLUTION + vec2(0.5f))\n#define fixtovec2(f) (vec2(f) / FIX_RESOLUTION)\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/float16.glsl":
/*!**********************************************!*\
  !*** ./src/gpu/shaders/include/float16.glsl ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#ifndef _FLOAT16_GLSL\n#define _FLOAT16_GLSL\n#define encodeFloat16(f) (vec2(packf16(f)) / 255.0f)\n#define decodeFloat16(v) unpackf16(uvec2((v) * 255.0f))\nuvec2 packf16( float f)\n{\nuint y = packHalf2x16(vec2(f, 0.0f));\nreturn uvec2(y, y >> 8) & 0xFFu;\n}\nfloat unpackf16(uvec2 v)\n{\nv &= 0xFFu;\nreturn unpackHalf2x16(v.x | (v.y << 8)).x;\n}\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/global.glsl":
/*!*********************************************!*\
  !*** ./src/gpu/shaders/include/global.glsl ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#ifndef _GLOBAL_GLSL\n#define _GLOBAL_GLSL\n#define threadLocation() ivec2(texCoord * texSize)\n#define outputSize() ivec2(texSize)\n#define threadPixel(img) textureLod((img), texCoord, 0.0f)\n#define pixelAt(img, pos) texelFetch((img), (pos), 0)\n#define pixelAtShortOffset(img, offset) textureLodOffset((img), texCoord, 0.0f, (offset))\n#define pixelAtLongOffset(img, offset) textureLod((img), texCoord + vec2(offset) / texSize, 0.0f)\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/keypoints.glsl":
/*!************************************************!*\
  !*** ./src/gpu/shaders/include/keypoints.glsl ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#ifndef _KEYPOINTS_GLSL\n#define _KEYPOINTS_GLSL\n@include \"pyramids.glsl\"\n@include \"orientation.glsl\"\n@include \"fixed-point.glsl\"\nstruct Keypoint\n{\nvec2 position;\nfloat orientation;\nfloat lod;\nfloat score;\nint flags;\n};\nstruct KeypointAddress\n{\nint base;\nint offset;\n};\nconst int MAX_DESCRIPTOR_SIZE = int(@MAX_DESCRIPTOR_SIZE@);\nconst int MIN_KEYPOINT_SIZE = int(@MIN_KEYPOINT_SIZE@);\nconst int KPF_NONE = int(@KPF_NONE@);\nconst int KPF_ORIENTED = int(@KPF_ORIENTED@);\nconst int KPF_DISCARD = int(@KPF_DISCARD@);\nvec4 readKeypointData(sampler2D encodedKeypoints, int encoderLength, KeypointAddress address)\n{\nint rasterIndex = address.base + address.offset;\nreturn pixelAt(encodedKeypoints, ivec2(rasterIndex % encoderLength, rasterIndex / encoderLength));\n}\n#define sizeofEncodedKeypoint(descriptorSize, extraSize) (MIN_KEYPOINT_SIZE + (descriptorSize) + (extraSize))\n#define findKeypointIndex(address, descriptorSize, extraSize) ((address).base / ((sizeofEncodedKeypoint((descriptorSize), (extraSize))) / 4))\nKeypointAddress findKeypointAddress(ivec2 thread, int encoderLength, int descriptorSize, int extraSize)\n{\nint threadRaster = thread.y * encoderLength + thread.x;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nint keypointIndex = int(threadRaster / pixelsPerKeypoint);\nKeypointAddress address = KeypointAddress(\nkeypointIndex * pixelsPerKeypoint,\nthreadRaster % pixelsPerKeypoint\n);\nreturn address;\n}\nKeypoint decodeKeypoint(sampler2D encodedKeypoints, int encoderLength, KeypointAddress address)\n{\nconst vec4 ones = vec4(1.0f);\nKeypoint keypoint;\nKeypointAddress positionAddress = KeypointAddress(address.base, 0);\nKeypointAddress propertiesAddress = KeypointAddress(address.base, 1);\nvec4 rawEncodedPosition = readKeypointData(encodedKeypoints, encoderLength, positionAddress);\nivec4 encodedPosition = ivec4(rawEncodedPosition * 255.0f);\nkeypoint.position = fixtovec2(fixed2_t(\nencodedPosition.r | (encodedPosition.g << 8),\nencodedPosition.b | (encodedPosition.a << 8)\n));\nvec4 encodedProperties = readKeypointData(encodedKeypoints, encoderLength, propertiesAddress);\nkeypoint.orientation = decodeOrientation(encodedProperties.g);\nkeypoint.lod = decodeLod(encodedProperties.r);\nkeypoint.score = encodedProperties.b;\nkeypoint.flags = int(encodedProperties.a * 255.0f);\nbool isNull = all(greaterThanEqual(rawEncodedPosition, ones));\nkeypoint.score = keypoint.score * float(!isNull) - float(isNull);\nkeypoint.score -= float(keypoint.score == 0.0f) * float(all(equal(keypoint.position, vec2(0.0f))));\nreturn keypoint;\n}\nvec4 encodeKeypointPosition(vec2 position)\n{\nconst vec2 zeros = vec2(0.0f);\nfixed2_t pos = vec2tofix(max(position, zeros));\nfixed2_t lo = pos & 255;\nfixed2_t hi = pos >> 8;\nreturn vec4(lo.x, hi.x, lo.y, hi.y) / 255.0f;\n}\n#define encodeNullKeypoint() (vec4(1.0f))\n#define isBadKeypoint(keypoint) ((keypoint).score < 0.0f)\n#define encodeKeypointPositionAtInfinity() (vec4(254.0f / 255.0f, vec3(1.0f)))\nbool isKeypointAtInfinity(Keypoint keypoint)\n{\nconst vec2 V2_MAX_TEXTURE_LENGTH = vec2(@MAX_TEXTURE_LENGTH@);\nreturn any(greaterThan(keypoint.position, V2_MAX_TEXTURE_LENGTH));\n}\n#define encodeKeypointFlags(flags) (float(flags) / 255.0f)\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/math.glsl":
/*!*******************************************!*\
  !*** ./src/gpu/shaders/include/math.glsl ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#ifndef _MATH_GLSL\n#define _MATH_GLSL\n#define TWO_PI          6.28318530718f\n#define PI              3.14159265359f\n#define PI_OVER_2       1.57079632679f\n#define PI_OVER_4       0.78539816339f\n#define INV_PI          0.3183098861837907f\n#define USE_FAST_ATAN\n#ifdef USE_FAST_ATAN\nfloat fastAtan(float x)\n{\nfloat w = 1.0f - abs(x);\nreturn (w >= 0.0f) ? ((PI_OVER_4 + 0.273 * w) * x) :\n(sign(x) * PI_OVER_2 - (PI_OVER_4 + 0.273 * (1.0f - abs(1.0f / x))) / x);\n}\n#else\n#define fastAtan(x) atan(x)\n#endif\n#ifdef USE_FAST_ATAN\nfloat fastAtan2(float y, float x)\n{\nreturn (x == 0.0f) ? PI_OVER_2 * sign(y) : fastAtan(y / x) + float(x < 0.0f) * PI * sign(y);\n}\n#else\n#define fastAtan2(y, x) atan((y), (x))\n#endif\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/orientation.glsl":
/*!**************************************************!*\
  !*** ./src/gpu/shaders/include/orientation.glsl ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#ifndef _ORIENTATION_GLSL\n#define _ORIENTATION_GLSL\n@include \"math.glsl\"\n#define encodeOrientation(angle) ((angle) * INV_PI + 1.0f) * 0.5f\n#define decodeOrientation(value) ((value) * 2.0f - 1.0f) * PI\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/pyramids.glsl":
/*!***********************************************!*\
  !*** ./src/gpu/shaders/include/pyramids.glsl ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#ifndef _PYRAMIDS_GLSL\n#define _PYRAMIDS_GLSL\n#define pyrPixel(pyr, lod) textureLod((pyr), texCoord, (lod))\n#define pyrPixelAtOffset(pyr, lod, pot, offset) textureLod((pyr), texCoord + ((pot) * vec2(offset)) / texSize, (lod))\n#define pyrPixelAt(pyr, pos, lod) textureLod((pyr), (vec2(pos) + vec2(0.5f)) / texSize, (lod))\n#define pyrPixelAtEx(pyr, pos, lod, pyrBaseSize) textureLod((pyr), (vec2(pos) + vec2(0.5f)) / vec2(pyrBaseSize), (lod))\n#define pyrSubpixelAtEx(pyr, pos, lod, pyrBaseSize) textureLod((pyr), ((pos) + vec2(0.5f)) / vec2(pyrBaseSize), (lod))\n#define pyrSubpixelAtExOffset(pyr, pos, lod, pot, offset, pyrBaseSize) textureLod((pyr), (((pos) + vec2(0.5f)) + ((pot) * vec2(offset))) / vec2(pyrBaseSize), (lod))\nconst int PYRAMID_MAX_LEVELS = int(@PYRAMID_MAX_LEVELS@);\nconst float F_PYRAMID_MAX_LEVELS = float(@PYRAMID_MAX_LEVELS@);\nconst float LOG2_PYRAMID_MAX_SCALE = float(@LOG2_PYRAMID_MAX_SCALE@);\nfloat encodeLod(float lod)\n{\nreturn (LOG2_PYRAMID_MAX_SCALE + lod) / (LOG2_PYRAMID_MAX_SCALE + F_PYRAMID_MAX_LEVELS);\n}\nfloat decodeLod(float encodedLod)\n{\nfloat lod = encodedLod * (LOG2_PYRAMID_MAX_SCALE + F_PYRAMID_MAX_LEVELS) - LOG2_PYRAMID_MAX_SCALE;\nreturn lod * float(encodedLod < 1.0f);\n}\n#define isSameEncodedLod(alpha1, alpha2) (abs((alpha1) - (alpha2)) < encodedLodEps)\nconst float encodedLodEps = 0.2f / (LOG2_PYRAMID_MAX_SCALE + F_PYRAMID_MAX_LEVELS);\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/quickselect.glsl":
/*!**************************************************!*\
  !*** ./src/gpu/shaders/include/quickselect.glsl ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#ifndef _QUICKSELECT_GLSL\n#define _QUICKSELECT_GLSL\n#if defined(QUICKSELECT_UNSIGNED) && !defined(QUICKSELECT_SIGNED)\n#define QS_TYPE uint\n#define QS_TYPE4 uvec4\n#elif !defined(QUICKSELECT_UNSIGNED) && defined(QUICKSELECT_SIGNED)\n#define QS_TYPE int\n#define QS_TYPE4 ivec4\n#else\n#error Must define either QUICKSELECT_SIGNED or QUICKSELECT_UNSIGNED before including quickselect\n#endif\n#if defined(QUICKSELECT_ASCENDING) && !defined(QUICKSELECT_DESCENDING)\n#define QS_ORD(element,pivot) ((element) < (pivot))\n#elif defined(QUICKSELECT_DESCENDING) && !defined(QUICKSELECT_ASCENDING)\n#define QS_ORD(element,pivot) ((element) > (pivot))\n#else\n#error Must define either QUICKSELECT_ASCENDING or QUICKSELECT_DESCENDING before including quickselect\n#endif\n#ifdef QUICKSELECT_ARRAY\n#define QS_ARRAY QUICKSELECT_ARRAY\n#else\n#error Must define QUICKSELECT_ARRAY before including quickselect\n#endif\nint qspart(int l, int r, int p)\n{\n#define QS_SWAP(a,b) t = QS_ARRAY[(a)]; QS_ARRAY[(a)] = QS_ARRAY[(b)]; QS_ARRAY[(b)] = t\nhighp QS_TYPE e, t, mask, pivot = QS_ARRAY[p];\nhighp QS_TYPE4 tmp;\nint q, cond;\nQS_SWAP(p, r);\nq = l;\nfor(int i = l; i < r; i++) {\ne = QS_ARRAY[i];\nt = QS_ARRAY[q];\ncond = int(QS_ORD(e, pivot));\nmask = QS_TYPE(-cond);\ntmp = QS_TYPE4(mask & t, (~mask) & e, mask & e, (~mask) & t);\nQS_ARRAY[i] = tmp.x | tmp.y;\nQS_ARRAY[q] = tmp.z | tmp.w;\nq += cond;\n}\nQS_SWAP(q, r);\nreturn q;\n}\nhighp QS_TYPE quickselect(int l, int r, int k)\n{\nint p = -1337;\nivec2 idx = ivec2(l, r);\nwhile(idx.s < idx.t && p != k) {\np = qspart(idx.s, idx.t, (idx.s + idx.t) / 2);\nidx = int(k < p) * ivec2(idx.s, p-1) + int(k >= p) * ivec2(p+1, idx.t);\n}\nreturn (p == k) ? QS_ARRAY[k] : QS_ARRAY[idx.s];\n}\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/sobel.glsl":
/*!********************************************!*\
  !*** ./src/gpu/shaders/include/sobel.glsl ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#ifndef _SOBEL_GLSL\n#define _SOBEL_GLSL\nvec4 encodeSobel(vec2 df)\n{\n#ifdef SOBEL_USE_LOG\nconst vec2 zero = vec2(0.0f);\nvec2 dmax = -max(df, zero);\nvec2 dmin = min(df, zero);\nreturn exp2(vec4(dmax, dmin));\n#else\nuint data = packHalf2x16(df);\nuvec4 bytes = uvec4(data, data >> 8, data >> 16, data >> 24) & 255u;\nreturn vec4(bytes) / 255.0f;\n#endif\n}\nvec2 decodeSobel(vec4 encodedSobel)\n{\n#ifdef SOBEL_USE_LOG\nvec4 lg = log2(encodedSobel);\nreturn vec2(lg.b - lg.r, lg.a - lg.g);\n#else\nuvec4 bytes = uvec4(encodedSobel * 255.0f);\nuint data = bytes.r | (bytes.g << 8) | (bytes.b << 16) | (bytes.a << 24);\nreturn unpackHalf2x16(data);\n#endif\n}\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/subpixel.glsl":
/*!***********************************************!*\
  !*** ./src/gpu/shaders/include/subpixel.glsl ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#ifndef _SUBPIXEL_GLSL\n#define _SUBPIXEL_GLSL\n#define subpixelAtHW(image, pos) textureLod((image), ((pos) + vec2(0.5f)) / texSize, 0.0f)\nvec4 subpixelAtBI(sampler2D image, vec2 pos)\n{\nvec2 frc = fract(pos);\nvec2 ifrc = vec2(1.0f) - frc;\nvec2 p = (floor(pos) + vec2(0.5f)) / vec2(textureSize(image, 0));\nvec4 pix00 = textureLod(image, p, 0.0f);\nvec4 pix10 = textureLodOffset(image, p, 0.0f, ivec2(1,0));\nvec4 pix01 = textureLodOffset(image, p, 0.0f, ivec2(0,1));\nvec4 pix11 = textureLodOffset(image, p, 0.0f, ivec2(1,1));\nmat4 pix = mat4(pix00, pix10, pix01, pix11);\nvec4 mul = vec4(ifrc.x * ifrc.y, frc.x * ifrc.y, ifrc.x * frc.y, frc.x * frc.y);\nreturn pix * mul;\n}\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/brisk.glsl":
/*!**********************************************!*\
  !*** ./src/gpu/shaders/keypoints/brisk.glsl ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image, layerA, layerB;\nuniform float scaleA, scaleB, lgM, h;\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nfloat score = pixel.r;\nivec2 zero = ivec2(0, 0);\nivec2 sizeA = textureSize(layerA, 0);\nivec2 sizeB = textureSize(layerB, 0);\nvec2 mid = (texCoord * texSize) + vec2(0.5f, 0.5f);\nivec2 pa = clamp(ivec2(ceil(mid * scaleA - 1.0f)), zero, sizeA - 2);\nivec2 pb = clamp(ivec2(ceil(mid * scaleB - 1.0f)), zero, sizeB - 2);\nvec4 a00 = pixelAt(layerA, pa);\nvec4 a10 = pixelAt(layerA, pa + ivec2(1, 0));\nvec4 a01 = pixelAt(layerA, pa + ivec2(0, 1));\nvec4 a11 = pixelAt(layerA, pa + ivec2(1, 1));\nvec4 b00 = pixelAt(layerB, pb);\nvec4 b10 = pixelAt(layerB, pb + ivec2(1, 0));\nvec4 b01 = pixelAt(layerB, pb + ivec2(0, 1));\nvec4 b11 = pixelAt(layerB, pb + ivec2(1, 1));\nfloat maxScore = max(\nmax(max(a00.r, a10.r), max(a01.r, a11.r)),\nmax(max(b00.r, b10.r), max(b01.r, b11.r))\n);\ncolor = vec4(0.0f, pixel.gba);\nif(score < maxScore || score == 0.0f)\nreturn;\nvec2 ea = fract(mid * scaleA);\nvec2 eb = fract(mid * scaleB);\nfloat isa = a00.b * (1.0f - ea.x) * (1.0f - ea.y) +\na10.b * ea.x * (1.0f - ea.y) +\na01.b * (1.0f - ea.x) * ea.y +\na11.b * ea.x * ea.y;\nfloat isb = b00.b * (1.0f - eb.x) * (1.0f - eb.y) +\nb10.b * eb.x * (1.0f - eb.y) +\nb01.b * (1.0f - eb.x) * eb.y +\nb11.b * eb.x * eb.y;\ncolor = (isa > score && isa > isb) ? vec4(isa, pixel.gb, a00.a) : pixel;\ncolor = (isb > score && isb > isa) ? vec4(isb, pixel.gb, b00.a) : pixel;\nfloat y1 = isa, y2 = isb, y3 = score;\nfloat x1 = lgM - (lgM + h) * a00.a;\nfloat x2 = lgM - (lgM + h) * b00.a;\nfloat x3 = lgM - (lgM + h) * pixel.a;\nfloat dn = (x1 - x2) * (x1 - x3) * (x2 - x3);\nif(abs(dn) < 0.00001f)\nreturn;\nfloat a = (x3 * (y2 - y1) + x2 * (y1 - y3) + x1 * (y3 - y2)) / dn;\nif(a >= 0.0f)\nreturn;\nfloat b = (x3 * x3 * (y1 - y2) + x2 * x2 * (y3 - y1) + x1 * x1 * (y2 - y3)) / dn;\nfloat c = (x2 * x3 * (x2 - x3) * y1 + x3 * x1 * (x3 - x1) * y2 + x1 * x2 * (x1 - x2) * y3) / dn;\nfloat xv = -b / (2.0f * a);\nfloat yv = c - (b * b) / (4.0f * a);\nif(xv < min(x1, min(x2, x3)) || xv > max(x1, max(x2, x3)))\nreturn;\nfloat interpolatedScale = (lgM - xv) / (lgM + h);\nfloat interpolatedScore = clamp(yv, 0.0f, 1.0f);\ncolor = vec4(interpolatedScore, pixel.gb, interpolatedScale);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/fast/encode-fast-score.glsl":
/*!***************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/fast/encode-fast-score.glsl ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"float16.glsl\"\nuniform sampler2D image;\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nfloat score = decodeFloat16(pixel.rb);\nconst float mul = 6.0f;\nfloat score8 = clamp(score * mul, 0.0f, 1.0f);\ncolor = vec4(score8, pixel.g, 0.0f, pixel.a);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/fast/fast-score12.glsl":
/*!**********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/fast/fast-score12.glsl ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"float16.glsl\"\nuniform sampler2D image;\nuniform float threshold;\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nfloat t = clamp(threshold, 0.0f, 1.0f);\nfloat ct = pixel.g + t, c_t = pixel.g - t;\nfloat p0 = pixelAtShortOffset(image, ivec2(0, 2)).g;\nfloat p1 = pixelAtShortOffset(image, ivec2(1, 2)).g;\nfloat p2 = pixelAtShortOffset(image, ivec2(2, 1)).g;\nfloat p3 = pixelAtShortOffset(image, ivec2(2, 0)).g;\nfloat p4 = pixelAtShortOffset(image, ivec2(2, -1)).g;\nfloat p5 = pixelAtShortOffset(image, ivec2(1, -2)).g;\nfloat p6 = pixelAtShortOffset(image, ivec2(0, -2)).g;\nfloat p7 = pixelAtShortOffset(image, ivec2(-1, -2)).g;\nfloat p8 = pixelAtShortOffset(image, ivec2(-2, -1)).g;\nfloat p9 = pixelAtShortOffset(image, ivec2(-2, 0)).g;\nfloat p10 = pixelAtShortOffset(image, ivec2(-2, 1)).g;\nfloat p11 = pixelAtShortOffset(image, ivec2(-1, 2)).g;\nvec2 scores = vec2(0.0f, 0.0f);\nscores += vec2(max(c_t - p0, 0.0f), max(p0 - ct, 0.0f));\nscores += vec2(max(c_t - p1, 0.0f), max(p1 - ct, 0.0f));\nscores += vec2(max(c_t - p2, 0.0f), max(p2 - ct, 0.0f));\nscores += vec2(max(c_t - p3, 0.0f), max(p3 - ct, 0.0f));\nscores += vec2(max(c_t - p4, 0.0f), max(p4 - ct, 0.0f));\nscores += vec2(max(c_t - p5, 0.0f), max(p5 - ct, 0.0f));\nscores += vec2(max(c_t - p6, 0.0f), max(p6 - ct, 0.0f));\nscores += vec2(max(c_t - p7, 0.0f), max(p7 - ct, 0.0f));\nscores += vec2(max(c_t - p8, 0.0f), max(p8 - ct, 0.0f));\nscores += vec2(max(c_t - p9, 0.0f), max(p9 - ct, 0.0f));\nscores += vec2(max(c_t - p10, 0.0f), max(p10 - ct, 0.0f));\nscores += vec2(max(c_t - p11, 0.0f), max(p11 - ct, 0.0f));\nscores /= 12.0f;\nfloat score = max(scores.x, scores.y) * step(1.0f, pixel.r);\ncolor = pixel;\ncolor.rb = encodeFloat16(score);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/fast/fast-score16.glsl":
/*!**********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/fast/fast-score16.glsl ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"float16.glsl\"\nuniform sampler2D image;\nuniform float threshold;\nconst vec4 zeroes = vec4(0.0f, 0.0f, 0.0f, 0.0f);\nconst vec4 ones = vec4(1.0f, 1.0f, 1.0f, 1.0f);\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nfloat t = clamp(threshold, 0.0f, 1.0f);\nfloat ct = pixel.g + t, c_t = pixel.g - t;\nmat4 mp = mat4(\npixelAtShortOffset(image, ivec2(0, 3)).g,\npixelAtShortOffset(image, ivec2(1, 3)).g,\npixelAtShortOffset(image, ivec2(2, 2)).g,\npixelAtShortOffset(image, ivec2(3, 1)).g,\npixelAtShortOffset(image, ivec2(3, 0)).g,\npixelAtShortOffset(image, ivec2(3, -1)).g,\npixelAtShortOffset(image, ivec2(2, -2)).g,\npixelAtShortOffset(image, ivec2(1, -3)).g,\npixelAtShortOffset(image, ivec2(0, -3)).g,\npixelAtShortOffset(image, ivec2(-1, -3)).g,\npixelAtShortOffset(image, ivec2(-2, -2)).g,\npixelAtShortOffset(image, ivec2(-3, -1)).g,\npixelAtShortOffset(image, ivec2(-3, 0)).g,\npixelAtShortOffset(image, ivec2(-3, 1)).g,\npixelAtShortOffset(image, ivec2(-2, 2)).g,\npixelAtShortOffset(image, ivec2(-1, 3)).g\n);\nmat4 mct = mp - mat4(\nct, ct, ct, ct,\nct, ct, ct, ct,\nct, ct, ct, ct,\nct, ct, ct, ct\n), mc_t = mat4(\nc_t, c_t, c_t, c_t,\nc_t, c_t, c_t, c_t,\nc_t, c_t, c_t, c_t,\nc_t, c_t, c_t, c_t\n) - mp;\nvec4 bs = max(mc_t[0], zeroes), ds = max(mct[0], zeroes);\nbs += max(mc_t[1], zeroes); ds += max(mct[1], zeroes);\nbs += max(mc_t[2], zeroes); ds += max(mct[2], zeroes);\nbs += max(mc_t[3], zeroes); ds += max(mct[3], zeroes);\nfloat score = max(dot(bs, ones), dot(ds, ones)) * step(1.0f, pixel.r);\nscore /= 16.0f;\ncolor = pixel;\ncolor.rb = encodeFloat16(score);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/fast/fast-score8.glsl":
/*!*********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/fast/fast-score8.glsl ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"float16.glsl\"\nuniform sampler2D image;\nuniform float threshold;\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nfloat t = clamp(threshold, 0.0f, 1.0f);\nfloat ct = pixel.g + t, c_t = pixel.g - t;\nfloat p0 = pixelAtShortOffset(image, ivec2(0, 1)).g;\nfloat p1 = pixelAtShortOffset(image, ivec2(1, 1)).g;\nfloat p2 = pixelAtShortOffset(image, ivec2(1, 0)).g;\nfloat p3 = pixelAtShortOffset(image, ivec2(1, -1)).g;\nfloat p4 = pixelAtShortOffset(image, ivec2(0, -1)).g;\nfloat p5 = pixelAtShortOffset(image, ivec2(-1, -1)).g;\nfloat p6 = pixelAtShortOffset(image, ivec2(-1, 0)).g;\nfloat p7 = pixelAtShortOffset(image, ivec2(-1, 1)).g;\nvec2 scores = vec2(0.0f, 0.0f);\nscores += vec2(max(c_t - p0, 0.0f), max(p0 - ct, 0.0f));\nscores += vec2(max(c_t - p1, 0.0f), max(p1 - ct, 0.0f));\nscores += vec2(max(c_t - p2, 0.0f), max(p2 - ct, 0.0f));\nscores += vec2(max(c_t - p3, 0.0f), max(p3 - ct, 0.0f));\nscores += vec2(max(c_t - p4, 0.0f), max(p4 - ct, 0.0f));\nscores += vec2(max(c_t - p5, 0.0f), max(p5 - ct, 0.0f));\nscores += vec2(max(c_t - p6, 0.0f), max(p6 - ct, 0.0f));\nscores += vec2(max(c_t - p7, 0.0f), max(p7 - ct, 0.0f));\nscores /= 8.0f;\nfloat score = max(scores.x, scores.y) * step(1.0f, pixel.r);\ncolor = pixel;\ncolor.rb = encodeFloat16(score);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/fast/fast5.glsl":
/*!***************************************************!*\
  !*** ./src/gpu/shaders/keypoints/fast/fast5.glsl ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"pyramids.glsl\"\nuniform sampler2D image;\nuniform float threshold;\nvoid main()\n{\nivec2 thread = threadLocation();\nivec2 size = outputSize();\nvec4 pixel = threadPixel(image);\ncolor = vec4(0.0f, pixel.g, 0.0f, encodeLod(0.0f));\nif(\nthread.x >= 3 && thread.x < size.x - 3 &&\nthread.y >= 3 && thread.y < size.y - 3\n) {\nfloat t = clamp(threshold, 0.0f, 1.0f);\nfloat c = pixel.g;\nfloat ct = c + t, c_t = c - t;\nfloat p0 = pixelAtShortOffset(image, ivec2(0, 1)).g;\nfloat p1 = pixelAtShortOffset(image, ivec2(1, 1)).g;\nfloat p2 = pixelAtShortOffset(image, ivec2(1, 0)).g;\nfloat p3 = pixelAtShortOffset(image, ivec2(1, -1)).g;\nfloat p4 = pixelAtShortOffset(image, ivec2(0, -1)).g;\nfloat p5 = pixelAtShortOffset(image, ivec2(-1, -1)).g;\nfloat p6 = pixelAtShortOffset(image, ivec2(-1, 0)).g;\nfloat p7 = pixelAtShortOffset(image, ivec2(-1, 1)).g;\nbool possibleCorner =\n((c_t > p1 || c_t > p5) && (c_t > p3 || c_t > p7)) ||\n((ct < p1  || ct < p5)  && (ct < p3  || ct < p7))  ;\nif(possibleCorner) {\nint bright = 0, dark = 0, bc = 0, dc = 0;\nif(c_t > p0) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p0) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p1) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p1) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p2) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p2) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p3) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p3) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p4) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p4) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p5) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p5) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p6) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p6) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p7) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p7) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(bright < 5 && dark < 5) {\nif(bc > 0 && bc < 5) do {\nif(c_t > p0)           bc += 1; else break;\nif(c_t > p1 && bc < 5) bc += 1; else break;\nif(c_t > p2 && bc < 5) bc += 1; else break;\nif(c_t > p3 && bc < 5) bc += 1; else break;\n} while(false);\nif(dc > 0 && dc < 5) do {\nif(ct < p0)           dc += 1; else break;\nif(ct < p1 && dc < 5) dc += 1; else break;\nif(ct < p2 && dc < 5) dc += 1; else break;\nif(ct < p3 && dc < 5) dc += 1; else break;\n} while(false);\nif(bc >= 5 || dc >= 5)\ncolor.r = 1.0f;\n}\nelse {\ncolor.r = 1.0f;\n}\n}\n}\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/fast/fast7.glsl":
/*!***************************************************!*\
  !*** ./src/gpu/shaders/keypoints/fast/fast7.glsl ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"pyramids.glsl\"\nuniform sampler2D image;\nuniform float threshold;\nvoid main()\n{\nivec2 thread = threadLocation();\nivec2 size = outputSize();\nvec4 pixel = threadPixel(image);\ncolor = vec4(0.0f, pixel.g, 0.0f, encodeLod(0.0f));\nif(\nthread.x >= 3 && thread.x < size.x - 3 &&\nthread.y >= 3 && thread.y < size.y - 3\n) {\nfloat t = clamp(threshold, 0.0f, 1.0f);\nfloat c = pixel.g;\nfloat ct = c + t, c_t = c - t;\nfloat p0 = pixelAtShortOffset(image, ivec2(0, 2)).g;\nfloat p1 = pixelAtShortOffset(image, ivec2(1, 2)).g;\nfloat p2 = pixelAtShortOffset(image, ivec2(2, 1)).g;\nfloat p3 = pixelAtShortOffset(image, ivec2(2, 0)).g;\nfloat p4 = pixelAtShortOffset(image, ivec2(2, -1)).g;\nfloat p5 = pixelAtShortOffset(image, ivec2(1, -2)).g;\nfloat p6 = pixelAtShortOffset(image, ivec2(0, -2)).g;\nfloat p7 = pixelAtShortOffset(image, ivec2(-1, -2)).g;\nfloat p8 = pixelAtShortOffset(image, ivec2(-2, -1)).g;\nfloat p9 = pixelAtShortOffset(image, ivec2(-2, 0)).g;\nfloat p10 = pixelAtShortOffset(image, ivec2(-2, 1)).g;\nfloat p11 = pixelAtShortOffset(image, ivec2(-1, 2)).g;\nbool possibleCorner =\n((c_t > p0 || c_t > p6) && (c_t > p3 || c_t > p9)) ||\n((ct < p0  || ct < p6)  && (ct < p3  || ct < p9))  ;\nif(possibleCorner) {\nint bright = 0, dark = 0, bc = 0, dc = 0;\nif(c_t > p0) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p0) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p1) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p1) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p2) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p2) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p3) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p3) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p4) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p4) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p5) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p5) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p6) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p6) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p7) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p7) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p8) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p8) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p9) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p9) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p10) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p10) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(c_t > p11) { dc = 0; bc += 1; if(bc > bright) bright = bc; }\nelse { bc = 0; if(ct < p11) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }\nif(bright < 7 && dark < 7) {\nif(bc > 0 && bc < 7) do {\nif(c_t > p0)           bc += 1; else break;\nif(c_t > p1 && bc < 7) bc += 1; else break;\nif(c_t > p2 && bc < 7) bc += 1; else break;\nif(c_t > p3 && bc < 7) bc += 1; else break;\nif(c_t > p4 && bc < 7) bc += 1; else break;\nif(c_t > p5 && bc < 7) bc += 1; else break;\n} while(false);\nif(dc > 0 && dc < 7) do {\nif(ct < p0)           dc += 1; else break;\nif(ct < p1 && dc < 7) dc += 1; else break;\nif(ct < p2 && dc < 7) dc += 1; else break;\nif(ct < p3 && dc < 7) dc += 1; else break;\nif(ct < p4 && dc < 7) dc += 1; else break;\nif(ct < p5 && dc < 7) dc += 1; else break;\n} while(false);\nif(bc >= 7 || dc >= 7)\ncolor.r = 1.0f;\n}\nelse {\ncolor.r = 1.0f;\n}\n}\n}\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/fast/fast9.glsl":
/*!***************************************************!*\
  !*** ./src/gpu/shaders/keypoints/fast/fast9.glsl ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"pyramids.glsl\"\nuniform sampler2D image;\nuniform float threshold;\nconst ivec4 margin = ivec4(3, 3, 4, 4);\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nivec2 thread = threadLocation();\nivec2 size = outputSize();\ncolor = vec4(0.0f, pixel.g, 0.0f, encodeLod(0.0f));\nif(any(lessThan(ivec4(thread, size - thread), margin)))\nreturn;\nfloat t = clamp(threshold, 0.0f, 1.0f);\nfloat ct = pixel.g + t, c_t = pixel.g - t;\nfloat p0 = pixelAtShortOffset(image, ivec2(0, 3)).g;\nfloat p4 = pixelAtShortOffset(image, ivec2(3, 0)).g;\nfloat p8 = pixelAtShortOffset(image, ivec2(0, -3)).g;\nfloat p12 = pixelAtShortOffset(image, ivec2(-3, 0)).g;\nif(!(\n((c_t > p0 || c_t > p8) && (c_t > p4 || c_t > p12)) ||\n((ct < p0  || ct < p8)  && (ct < p4  || ct < p12))\n))\nreturn;\nfloat p1 = pixelAtShortOffset(image, ivec2(1, 3)).g;\nfloat p2 = pixelAtShortOffset(image, ivec2(2, 2)).g;\nfloat p3 = pixelAtShortOffset(image, ivec2(3, 1)).g;\nfloat p5 = pixelAtShortOffset(image, ivec2(3, -1)).g;\nfloat p6 = pixelAtShortOffset(image, ivec2(2, -2)).g;\nfloat p7 = pixelAtShortOffset(image, ivec2(1, -3)).g;\nfloat p9 = pixelAtShortOffset(image, ivec2(-1, -3)).g;\nfloat p10 = pixelAtShortOffset(image, ivec2(-2, -2)).g;\nfloat p11 = pixelAtShortOffset(image, ivec2(-3, -1)).g;\nfloat p13 = pixelAtShortOffset(image, ivec2(-3, 1)).g;\nfloat p14 = pixelAtShortOffset(image, ivec2(-2, 2)).g;\nfloat p15 = pixelAtShortOffset(image, ivec2(-1, 3)).g;\nbool A=(p0>ct),B=(p1>ct),C=(p2>ct),D=(p3>ct),E=(p4>ct),F=(p5>ct),G=(p6>ct),H=(p7>ct),I=(p8>ct),J=(p9>ct),K=(p10>ct),L=(p11>ct),M=(p12>ct),N=(p13>ct),O=(p14>ct),P=(p15>ct),a=(p0<c_t),b=(p1<c_t),c=(p2<c_t),d=(p3<c_t),e=(p4<c_t),f=(p5<c_t),g=(p6<c_t),h=(p7<c_t),i=(p8<c_t),j=(p9<c_t),k=(p10<c_t),l=(p11<c_t),m=(p12<c_t),n=(p13<c_t),o=(p14<c_t),p=(p15<c_t);\nbool isCorner=A&&(B&&(K&&L&&J&&(M&&N&&O&&P||G&&H&&I&&(M&&N&&O||F&&(M&&N||E&&(M||D))))||C&&(K&&L&&M&&(N&&O&&P||G&&H&&I&&J&&(N&&O||F&&(N||E)))||D&&(N&&(L&&M&&(K&&G&&H&&I&&J&&(O||F)||O&&P)||k&&l&&m&&e&&f&&g&&h&&i&&j)||E&&(O&&(M&&N&&(K&&L&&G&&H&&I&&J||P)||k&&l&&m&&n&&f&&g&&h&&i&&j)||F&&(P&&(N&&O||k&&l&&m&&n&&o&&g&&h&&i&&j)||G&&(O&&P||H&&(P||I)||k&&l&&m&&n&&o&&p&&h&&i&&j)||k&&l&&m&&n&&o&&h&&i&&j&&(p||g))||k&&l&&m&&n&&h&&i&&j&&(o&&(p||g)||f&&(o&&p||g)))||k&&l&&m&&h&&i&&j&&(n&&(o&&p||g&&(o||f))||e&&(n&&o&&p||g&&(n&&o||f))))||k&&l&&h&&i&&j&&(m&&(n&&o&&p||g&&(n&&o||f&&(n||e)))||d&&(m&&n&&o&&p||g&&(m&&n&&o||f&&(m&&n||e)))))||k&&h&&i&&j&&(l&&(m&&n&&o&&p||g&&(m&&n&&o||f&&(m&&n||e&&(m||d))))||c&&(l&&m&&n&&o&&p||g&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d))))))||K&&I&&J&&(L&&M&&N&&O&&P||G&&H&&(L&&M&&N&&O||F&&(L&&M&&N||E&&(L&&M||D&&(L||C)))))||h&&i&&j&&(b&&(k&&l&&m&&n&&o&&p||g&&(k&&l&&m&&n&&o||f&&(k&&l&&m&&n||e&&(k&&l&&m||d&&(k&&l||c)))))||k&&(l&&m&&n&&o&&p||g&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c)))))))||B&&(H&&I&&J&&(K&&L&&M&&N&&O&&P&&a||G&&(K&&L&&M&&N&&O&&a||F&&(K&&L&&M&&N&&a||E&&(K&&L&&M&&a||D&&(K&&L&&a||C)))))||a&&k&&i&&j&&(l&&m&&n&&o&&p||g&&h&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c))))))||C&&(K&&H&&I&&J&&(L&&M&&N&&O&&P&&a&&b||G&&(L&&M&&N&&O&&a&&b||F&&(L&&M&&N&&a&&b||E&&(L&&M&&a&&b||D))))||a&&b&&k&&l&&j&&(m&&n&&o&&p||g&&h&&i&&(m&&n&&o||f&&(m&&n||e&&(m||d)))))||D&&(K&&L&&H&&I&&J&&(M&&N&&O&&P&&a&&b&&c||G&&(M&&N&&O&&a&&b&&c||F&&(M&&N&&a&&b&&c||E)))||a&&b&&k&&l&&m&&c&&(n&&o&&p||g&&h&&i&&j&&(n&&o||f&&(n||e))))||E&&(K&&L&&M&&H&&I&&J&&(N&&O&&P&&a&&b&&c&&d||G&&(N&&O&&a&&b&&c&&d||F))||a&&b&&l&&m&&n&&c&&d&&(k&&g&&h&&i&&j&&(o||f)||o&&p))||F&&(K&&L&&M&&N&&H&&I&&J&&(O&&P&&a&&b&&c&&d&&e||G)||a&&b&&m&&n&&o&&c&&d&&e&&(k&&l&&g&&h&&i&&j||p))||G&&(K&&L&&M&&N&&O&&H&&I&&J||a&&b&&n&&o&&p&&c&&d&&e&&f)||H&&(K&&L&&M&&N&&O&&P&&I&&J||a&&b&&o&&p&&c&&d&&e&&f&&g)||a&&(b&&(k&&l&&j&&(m&&n&&o&&p||g&&h&&i&&(m&&n&&o||f&&(m&&n||e&&(m||d))))||c&&(k&&l&&m&&(n&&o&&p||g&&h&&i&&j&&(n&&o||f&&(n||e)))||d&&(l&&m&&n&&(k&&g&&h&&i&&j&&(o||f)||o&&p)||e&&(m&&n&&o&&(k&&l&&g&&h&&i&&j||p)||f&&(n&&o&&p||g&&(o&&p||h&&(p||i)))))))||k&&i&&j&&(l&&m&&n&&o&&p||g&&h&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c))))))||h&&i&&j&&(k&&l&&m&&n&&o&&p||g&&(k&&l&&m&&n&&o||f&&(k&&l&&m&&n||e&&(k&&l&&m||d&&(k&&l||c&&(b||k))))));\ncolor.r = float(isCorner);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/fast/multiscale-fast.glsl":
/*!*************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/fast/multiscale-fast.glsl ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"pyramids.glsl\"\n@include \"float16.glsl\"\nuniform sampler2D pyramid;\nuniform float threshold;\nuniform int numberOfLayers;\nuniform float lodStep;\nconst ivec4 margin = ivec4(3, 3, 4, 4);\nconst vec4 zeroes = vec4(0.0f, 0.0f, 0.0f, 0.0f);\nconst vec4 ones = vec4(1.0f, 1.0f, 1.0f, 1.0f);\nvoid main()\n{\nvec4 pixel = threadPixel(pyramid);\nivec2 thread = threadLocation();\nivec2 size = outputSize();\nfloat t = clamp(threshold, 0.0f, 1.0f);\nfloat ct = pixel.g + t, c_t = pixel.g - t;\nvec2 best = vec2(0.0f);\ncolor = vec4(0.0f, pixel.g, 0.0f, pixel.a);\nfloat lod = 0.0f, pot = 1.0f;\nfor(int layer = 0; layer < numberOfLayers; layer++) {\npixel = pyrPixel(pyramid, lod);\nct = pixel.g + t;\nc_t = pixel.g - t;\nvec4 p4k = vec4(\npyrPixelAtOffset(pyramid, lod, pot, ivec2(0, 3)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(3, 0)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(0, -3)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(-3, 0)).g\n);\nmat4 mp = mat4(\np4k.x,\np4k.y,\np4k.z,\np4k.w,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(1, 3)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(3, -1)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(-1, -3)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(-3, 1)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(2, 2)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(2, -2)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(-2, -2)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(-2, 2)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(3, 1)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(1, -3)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(-3, -1)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(-1, 3)).g\n);\nbool A=(mp[0][0]>ct),B=(mp[1][0]>ct),C=(mp[2][0]>ct),D=(mp[3][0]>ct),E=(mp[0][1]>ct),F=(mp[1][1]>ct),G=(mp[2][1]>ct),H=(mp[3][1]>ct),I=(mp[0][2]>ct),J=(mp[1][2]>ct),K=(mp[2][2]>ct),L=(mp[3][2]>ct),M=(mp[0][3]>ct),N=(mp[1][3]>ct),O=(mp[2][3]>ct),P=(mp[3][3]>ct),a=(mp[0][0]<c_t),b=(mp[1][0]<c_t),c=(mp[2][0]<c_t),d=(mp[3][0]<c_t),e=(mp[0][1]<c_t),f=(mp[1][1]<c_t),g=(mp[2][1]<c_t),h=(mp[3][1]<c_t),i=(mp[0][2]<c_t),j=(mp[1][2]<c_t),k=(mp[2][2]<c_t),l=(mp[3][2]<c_t),m=(mp[0][3]<c_t),n=(mp[1][3]<c_t),o=(mp[2][3]<c_t),p=(mp[3][3]<c_t);\nbool isCorner=A&&(B&&(K&&L&&J&&(M&&N&&O&&P||G&&H&&I&&(M&&N&&O||F&&(M&&N||E&&(M||D))))||C&&(K&&L&&M&&(N&&O&&P||G&&H&&I&&J&&(N&&O||F&&(N||E)))||D&&(N&&(L&&M&&(K&&G&&H&&I&&J&&(O||F)||O&&P)||k&&l&&m&&e&&f&&g&&h&&i&&j)||E&&(O&&(M&&N&&(K&&L&&G&&H&&I&&J||P)||k&&l&&m&&n&&f&&g&&h&&i&&j)||F&&(P&&(N&&O||k&&l&&m&&n&&o&&g&&h&&i&&j)||G&&(O&&P||H&&(P||I)||k&&l&&m&&n&&o&&p&&h&&i&&j)||k&&l&&m&&n&&o&&h&&i&&j&&(p||g))||k&&l&&m&&n&&h&&i&&j&&(o&&(p||g)||f&&(o&&p||g)))||k&&l&&m&&h&&i&&j&&(n&&(o&&p||g&&(o||f))||e&&(n&&o&&p||g&&(n&&o||f))))||k&&l&&h&&i&&j&&(m&&(n&&o&&p||g&&(n&&o||f&&(n||e)))||d&&(m&&n&&o&&p||g&&(m&&n&&o||f&&(m&&n||e)))))||k&&h&&i&&j&&(l&&(m&&n&&o&&p||g&&(m&&n&&o||f&&(m&&n||e&&(m||d))))||c&&(l&&m&&n&&o&&p||g&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d))))))||K&&I&&J&&(L&&M&&N&&O&&P||G&&H&&(L&&M&&N&&O||F&&(L&&M&&N||E&&(L&&M||D&&(L||C)))))||h&&i&&j&&(b&&(k&&l&&m&&n&&o&&p||g&&(k&&l&&m&&n&&o||f&&(k&&l&&m&&n||e&&(k&&l&&m||d&&(k&&l||c)))))||k&&(l&&m&&n&&o&&p||g&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c)))))))||B&&(H&&I&&J&&(K&&L&&M&&N&&O&&P&&a||G&&(K&&L&&M&&N&&O&&a||F&&(K&&L&&M&&N&&a||E&&(K&&L&&M&&a||D&&(K&&L&&a||C)))))||a&&k&&i&&j&&(l&&m&&n&&o&&p||g&&h&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c))))))||C&&(K&&H&&I&&J&&(L&&M&&N&&O&&P&&a&&b||G&&(L&&M&&N&&O&&a&&b||F&&(L&&M&&N&&a&&b||E&&(L&&M&&a&&b||D))))||a&&b&&k&&l&&j&&(m&&n&&o&&p||g&&h&&i&&(m&&n&&o||f&&(m&&n||e&&(m||d)))))||D&&(K&&L&&H&&I&&J&&(M&&N&&O&&P&&a&&b&&c||G&&(M&&N&&O&&a&&b&&c||F&&(M&&N&&a&&b&&c||E)))||a&&b&&k&&l&&m&&c&&(n&&o&&p||g&&h&&i&&j&&(n&&o||f&&(n||e))))||E&&(K&&L&&M&&H&&I&&J&&(N&&O&&P&&a&&b&&c&&d||G&&(N&&O&&a&&b&&c&&d||F))||a&&b&&l&&m&&n&&c&&d&&(k&&g&&h&&i&&j&&(o||f)||o&&p))||F&&(K&&L&&M&&N&&H&&I&&J&&(O&&P&&a&&b&&c&&d&&e||G)||a&&b&&m&&n&&o&&c&&d&&e&&(k&&l&&g&&h&&i&&j||p))||G&&(K&&L&&M&&N&&O&&H&&I&&J||a&&b&&n&&o&&p&&c&&d&&e&&f)||H&&(K&&L&&M&&N&&O&&P&&I&&J||a&&b&&o&&p&&c&&d&&e&&f&&g)||a&&(b&&(k&&l&&j&&(m&&n&&o&&p||g&&h&&i&&(m&&n&&o||f&&(m&&n||e&&(m||d))))||c&&(k&&l&&m&&(n&&o&&p||g&&h&&i&&j&&(n&&o||f&&(n||e)))||d&&(l&&m&&n&&(k&&g&&h&&i&&j&&(o||f)||o&&p)||e&&(m&&n&&o&&(k&&l&&g&&h&&i&&j||p)||f&&(n&&o&&p||g&&(o&&p||h&&(p||i)))))))||k&&i&&j&&(l&&m&&n&&o&&p||g&&h&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c))))))||h&&i&&j&&(k&&l&&m&&n&&o&&p||g&&(k&&l&&m&&n&&o||f&&(k&&l&&m&&n||e&&(k&&l&&m||d&&(k&&l||c&&(b||k))))));\nmat4 mct = mp - mat4(\nct, ct, ct, ct,\nct, ct, ct, ct,\nct, ct, ct, ct,\nct, ct, ct, ct\n), mc_t = mat4(\nc_t, c_t, c_t, c_t,\nc_t, c_t, c_t, c_t,\nc_t, c_t, c_t, c_t,\nc_t, c_t, c_t, c_t\n) - mp;\nvec4 bs = max(mc_t[0], zeroes), ds = max(mct[0], zeroes);\nbs += max(mc_t[1], zeroes); ds += max(mct[1], zeroes);\nbs += max(mc_t[2], zeroes); ds += max(mct[2], zeroes);\nbs += max(mc_t[3], zeroes); ds += max(mct[3], zeroes);\nfloat score = max(dot(bs, ones), dot(ds, ones)) / 16.0f;\nscore *= float(isCorner);\nbest = (score > best.x) ? vec2(score, lod) : best;\nlod += lodStep;\npot = exp2(lod);\n}\ncolor.rb = encodeFloat16(best.x);\ncolor.a = encodeLod(best.y);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/harris/encode-harris-score.glsl":
/*!*******************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/harris/encode-harris-score.glsl ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"float16.glsl\"\nuniform sampler2D image;\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nfloat score = decodeFloat16(pixel.rb);\nfloat score8 = 1.0f - exp2(-score);\ncolor = vec4(score8, pixel.g, 0.0f, pixel.a);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/harris/harris-cutoff.glsl":
/*!*************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/harris/harris-cutoff.glsl ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"float16.glsl\"\nuniform sampler2D corners;\nuniform sampler2D maxScore;\nuniform float quality;\nvoid main()\n{\nvec4 pixel = threadPixel(corners);\nfloat maxval = decodeFloat16(threadPixel(maxScore).rb);\nfloat score = decodeFloat16(pixel.rb);\nfloat threshold = maxval * clamp(quality, 0.0f, 1.0f);\ncolor = pixel;\ncolor.rb = score >= threshold ? color.rb : encodeFloat16(0.0f);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/harris/max-harris-score.glsl":
/*!****************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/harris/max-harris-score.glsl ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"float16.glsl\"\nuniform sampler2D self;\nuniform int iterationNumber;\nvoid main()\n{\nivec2 thread = threadLocation();\nivec2 last = outputSize() - ivec2(1);\nint jump = (1 << iterationNumber);\nint clusterLength = jump << 1;\nint clusterMask = clusterLength - 1;\nivec2 clusterPos = ivec2(thread >> (1 + iterationNumber)) << (1 + iterationNumber);\nivec2 next1 = clusterPos + ((thread - clusterPos + ivec2(jump, 0)) & clusterMask);\nivec2 next2 = clusterPos + ((thread - clusterPos + ivec2(0, jump)) & clusterMask);\nivec2 next3 = clusterPos + ((thread - clusterPos + ivec2(jump, jump)) & clusterMask);\nvec4 p0 = texelFetch(self, thread, 0);\nvec4 p1 = texelFetch(self, min(next1, last), 0);\nvec4 p2 = texelFetch(self, min(next2, last), 0);\nvec4 p3 = texelFetch(self, min(next3, last), 0);\nfloat s0 = decodeFloat16(p0.rb);\nfloat s1 = decodeFloat16(p1.rb);\nfloat s2 = decodeFloat16(p2.rb);\nfloat s3 = decodeFloat16(p3.rb);\nbool b0 = s0 >= s1 && s0 >= s2 && s0 >= s3;\nbool b1 = s1 >= s0 && s1 >= s2 && s1 >= s3;\nbool b2 = s2 >= s0 && s2 >= s1 && s2 >= s3;\ncolor = vec4(0.0f);\ncolor.rb = b0 ? p0.rb : (\nb1 ? p1.rb : (\nb2 ? p2.rb : p3.rb\n)\n);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/harris/multiscale-harris.glsl":
/*!*****************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/harris/multiscale-harris.glsl ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"sobel.glsl\"\n@include \"pyramids.glsl\"\n@include \"float16.glsl\"\n#if !defined(MAX_LAYERS) || MAX_LAYERS < 7 || MAX_LAYERS > 16 || MAX_LAYERS % 2 == 0\n#error Invalid MAX_LAYERS\n#endif\nuniform sampler2D pyramid;\nuniform int windowSize;\nuniform int numberOfLayers;\nuniform float lodStep;\nuniform sampler2D sobelDerivatives[@MAX_LAYERS@];\nvec4 pickSobelDerivatives(int index, ivec2 offset)\n{\n#define CASE(k) case k: return textureLod(sobelDerivatives[k], texCoord + vec2(offset) / texSize, 0.0f)\nswitch(index) {\n#if MAX_LAYERS > 15\nCASE(15);\n#elif MAX_LAYERS > 13\nCASE(14); CASE(13);\n#elif MAX_LAYERS > 11\nCASE(12); CASE(11);\n#elif MAX_LAYERS > 9\nCASE(10); CASE(9);\n#elif MAX_LAYERS > 7\nCASE(8); CASE(7);\n#endif\nCASE(6); CASE(5); CASE(4); CASE(3); CASE(2); CASE(1); CASE(0);\ndefault: return vec4(0.0f);\n}\n}\nvoid main()\n{\nivec2 thread = threadLocation();\nvec4 pixel = threadPixel(pyramid);\nint r = (windowSize - 1) / 2;\nfloat windowArea = float(windowSize * windowSize);\nvec2 tmp = vec2(0.0f);\nfor(int layer = 0; layer < numberOfLayers; layer++) {\nvec3 m = vec3(0.0f); vec2 df;\nfor(int j = 0; j < windowSize; j++) {\nfor(int i = 0; i < windowSize; i++) {\ndf = decodeSobel(pickSobelDerivatives(layer, ivec2(i-r, j-r)));\nm += vec3(df.x * df.x, df.x * df.y, df.y * df.y);\n}\n}\nfloat response = 0.5f * (m.x + m.z - sqrt((m.x - m.z) * (m.x - m.z) + 4.0f * m.y * m.y));\nfloat normalizer = 9.0f / windowArea;\nfloat score = response * normalizer;\nfloat lod = lodStep * float(layer);\ntmp = mix(tmp, vec2(score, lod), bvec2(score > tmp.x));\n}\nvec2 encodedScore = encodeFloat16(tmp.x);\nfloat encodedScale = encodeLod(tmp.y);\ncolor = vec4(0.0f, pixel.g, 0.0f, encodedScale);\ncolor.rb = encodedScore;\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/harris/multiscale-sobel.glsl":
/*!****************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/harris/multiscale-sobel.glsl ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"sobel.glsl\"\n@include \"pyramids.glsl\"\nuniform sampler2D pyramid;\nuniform float lod;\nconst mat3 horizontalKernel = mat3(\n-1.0f, 0.0f, 1.0f,\n-2.0f, 0.0f, 2.0f,\n-1.0f, 0.0f, 1.0f\n);\nconst mat3 verticalKernel = mat3(\n1.0f, 2.0f, 1.0f,\n0.0f, 0.0f, 0.0f,\n-1.0f,-2.0f,-1.0f\n);\nconst vec3 ones = vec3(1.0f, 1.0f, 1.0f);\nvoid main()\n{\nfloat pot = exp2(lod);\nmat3 neighbors = mat3(\npyrPixelAtOffset(pyramid, lod, pot, ivec2(-1, -1)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(0, -1)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(1, -1)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(-1, 0)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(0, 0)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(1, 0)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(-1, 1)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(0, 1)).g,\npyrPixelAtOffset(pyramid, lod, pot, ivec2(1, 1)).g\n);\nmat3 sobelX = matrixCompMult(horizontalKernel, neighbors);\nmat3 sobelY = matrixCompMult(verticalKernel, neighbors);\nvec2 df = vec2(\ndot(sobelX[0] + sobelX[1] + sobelX[2], ones),\ndot(sobelY[0] + sobelY[1] + sobelY[2], ones)\n);\ncolor = encodeSobel(df);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/nonmax-suppression.glsl":
/*!***********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/nonmax-suppression.glsl ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"pyramids.glsl\"\n@include \"float16.glsl\"\nuniform sampler2D image;\nuniform float lodStep;\n#if defined(MULTISCALE) && MULTISCALE != 0\n# define ENABLE_INNER_RING\n# define ENABLE_MIDDLE_RING\n# define ENABLE_OUTER_RING\n# define LOD_STEP (lodStep)\n#else\n# define ENABLE_INNER_RING\n# define LOD_STEP (0.0f)\n#endif\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nfloat lod = decodeLod(pixel.a);\nfloat score = decodeFloat16(pixel.rb);\ncolor = pixel;\nif(score == 0.0f)\nreturn;\n#ifdef ENABLE_INNER_RING\nvec4 p0 = pixelAtShortOffset(image, ivec2(0, 1));\nvec4 p1 = pixelAtShortOffset(image, ivec2(1, 1));\nvec4 p2 = pixelAtShortOffset(image, ivec2(1, 0));\nvec4 p3 = pixelAtShortOffset(image, ivec2(1, -1));\nvec4 p4 = pixelAtShortOffset(image, ivec2(0, -1));\nvec4 p5 = pixelAtShortOffset(image, ivec2(-1, -1));\nvec4 p6 = pixelAtShortOffset(image, ivec2(-1, 0));\nvec4 p7 = pixelAtShortOffset(image, ivec2(-1, 1));\n#else\nvec4 p0, p1, p2, p3, p4, p5, p6, p7;\np0 = p1 = p2 = p3 = p4 = p5 = p6 = p7 = vec4(0.0f);\n#endif\n#ifdef ENABLE_MIDDLE_RING\nvec4 q0 = pixelAtShortOffset(image, ivec2(0, 2));\nvec4 q1 = pixelAtShortOffset(image, ivec2(1, 2));\nvec4 q2 = pixelAtShortOffset(image, ivec2(2, 2));\nvec4 q3 = pixelAtShortOffset(image, ivec2(2, 1));\nvec4 q4 = pixelAtShortOffset(image, ivec2(2, 0));\nvec4 q5 = pixelAtShortOffset(image, ivec2(2, -1));\nvec4 q6 = pixelAtShortOffset(image, ivec2(2, -2));\nvec4 q7 = pixelAtShortOffset(image, ivec2(1, -2));\nvec4 q8 = pixelAtShortOffset(image, ivec2(0, -2));\nvec4 q9 = pixelAtShortOffset(image, ivec2(-1, -2));\nvec4 q10 = pixelAtShortOffset(image, ivec2(-2, -2));\nvec4 q11 = pixelAtShortOffset(image, ivec2(-2, -1));\nvec4 q12 = pixelAtShortOffset(image, ivec2(-2, 0));\nvec4 q13 = pixelAtShortOffset(image, ivec2(-2, 1));\nvec4 q14 = pixelAtShortOffset(image, ivec2(-2, 2));\nvec4 q15 = pixelAtShortOffset(image, ivec2(-1, 2));\n#else\nvec4 q0, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15;\nq0 = q1 = q2 = q3 = q4 = q5 = q6 = q7 = q8 = q9 = q10 =\nq11 = q12 = q13 = q14 = q15 = vec4(0.0f);\n#endif\n#ifdef ENABLE_OUTER_RING\nvec4 r0 = pixelAtShortOffset(image, ivec2(0, 3));\nvec4 r1 = pixelAtShortOffset(image, ivec2(1, 3));\nvec4 r2 = pixelAtShortOffset(image, ivec2(3, 1));\nvec4 r3 = pixelAtShortOffset(image, ivec2(3, 0));\nvec4 r4 = pixelAtShortOffset(image, ivec2(3, -1));\nvec4 r5 = pixelAtShortOffset(image, ivec2(1, -3));\nvec4 r6 = pixelAtShortOffset(image, ivec2(0, -3));\nvec4 r7 = pixelAtShortOffset(image, ivec2(-1, -3));\nvec4 r8 = pixelAtShortOffset(image, ivec2(-3, -1));\nvec4 r9 = pixelAtShortOffset(image, ivec2(-3, 0));\nvec4 r10 = pixelAtShortOffset(image, ivec2(-3, 1));\nvec4 r11 = pixelAtShortOffset(image, ivec2(-1, 3));\nvec4 r12 = pixelAtShortOffset(image, ivec2(0, 4));\nvec4 r13 = pixelAtShortOffset(image, ivec2(4, 0));\nvec4 r14 = pixelAtShortOffset(image, ivec2(0, -4));\nvec4 r15 = pixelAtShortOffset(image, ivec2(-4, 0));\n#else\nvec4 r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15;\nr0 = r1 = r2 = r3 = r4 = r5 = r6 = r7 = r8 = r9 = r10 =\nr11 = r12 = r13 = r14 = r15 = vec4(0.0f);\n#endif\nfloat lodPlus = lod + LOD_STEP;\nfloat lodMinus = lod - LOD_STEP;\nfloat alphaPlus = encodeLod(lodPlus);\nfloat alphaMinus = encodeLod(lodMinus);\nfloat alpha = encodeLod(lod);\nmat3 innerScore = mat3(\ndecodeFloat16(p0.rb) * float(isSameEncodedLod(p0.a, alpha) || isSameEncodedLod(p0.a, alphaPlus) || isSameEncodedLod(p0.a, alphaMinus)),\ndecodeFloat16(p1.rb) * float(isSameEncodedLod(p1.a, alpha) || isSameEncodedLod(p1.a, alphaPlus) || isSameEncodedLod(p1.a, alphaMinus)),\ndecodeFloat16(p2.rb) * float(isSameEncodedLod(p2.a, alpha) || isSameEncodedLod(p2.a, alphaPlus) || isSameEncodedLod(p2.a, alphaMinus)),\ndecodeFloat16(p3.rb) * float(isSameEncodedLod(p3.a, alpha) || isSameEncodedLod(p3.a, alphaPlus) || isSameEncodedLod(p3.a, alphaMinus)),\ndecodeFloat16(p4.rb) * float(isSameEncodedLod(p4.a, alpha) || isSameEncodedLod(p4.a, alphaPlus) || isSameEncodedLod(p4.a, alphaMinus)),\ndecodeFloat16(p5.rb) * float(isSameEncodedLod(p5.a, alpha) || isSameEncodedLod(p5.a, alphaPlus) || isSameEncodedLod(p5.a, alphaMinus)),\ndecodeFloat16(p6.rb) * float(isSameEncodedLod(p6.a, alpha) || isSameEncodedLod(p6.a, alphaPlus) || isSameEncodedLod(p6.a, alphaMinus)),\ndecodeFloat16(p7.rb) * float(isSameEncodedLod(p7.a, alpha) || isSameEncodedLod(p7.a, alphaPlus) || isSameEncodedLod(p7.a, alphaMinus)),\n0.0f\n);\nmat4 middleScore = mat4(\ndecodeFloat16(q0.rb) * float(isSameEncodedLod(q0.a, alphaPlus) || isSameEncodedLod(q0.a, alphaMinus)),\ndecodeFloat16(q1.rb) * float(isSameEncodedLod(q1.a, alphaPlus) || isSameEncodedLod(q1.a, alphaMinus)),\ndecodeFloat16(q2.rb) * float(isSameEncodedLod(q2.a, alphaPlus) || isSameEncodedLod(q2.a, alphaMinus)),\ndecodeFloat16(q3.rb) * float(isSameEncodedLod(q3.a, alphaPlus) || isSameEncodedLod(q3.a, alphaMinus)),\ndecodeFloat16(q4.rb) * float(isSameEncodedLod(q4.a, alphaPlus) || isSameEncodedLod(q4.a, alphaMinus)),\ndecodeFloat16(q5.rb) * float(isSameEncodedLod(q5.a, alphaPlus) || isSameEncodedLod(q5.a, alphaMinus)),\ndecodeFloat16(q6.rb) * float(isSameEncodedLod(q6.a, alphaPlus) || isSameEncodedLod(q6.a, alphaMinus)),\ndecodeFloat16(q7.rb) * float(isSameEncodedLod(q7.a, alphaPlus) || isSameEncodedLod(q7.a, alphaMinus)),\ndecodeFloat16(q8.rb) * float(isSameEncodedLod(q8.a, alphaPlus) || isSameEncodedLod(q8.a, alphaMinus)),\ndecodeFloat16(q9.rb) * float(isSameEncodedLod(q9.a, alphaPlus) || isSameEncodedLod(q9.a, alphaMinus)),\ndecodeFloat16(q10.rb) * float(isSameEncodedLod(q10.a, alphaPlus) || isSameEncodedLod(q10.a, alphaMinus)),\ndecodeFloat16(q11.rb) * float(isSameEncodedLod(q11.a, alphaPlus) || isSameEncodedLod(q11.a, alphaMinus)),\ndecodeFloat16(q12.rb) * float(isSameEncodedLod(q12.a, alphaPlus) || isSameEncodedLod(q12.a, alphaMinus)),\ndecodeFloat16(q13.rb) * float(isSameEncodedLod(q13.a, alphaPlus) || isSameEncodedLod(q13.a, alphaMinus)),\ndecodeFloat16(q14.rb) * float(isSameEncodedLod(q14.a, alphaPlus) || isSameEncodedLod(q14.a, alphaMinus)),\ndecodeFloat16(q15.rb) * float(isSameEncodedLod(q15.a, alphaPlus) || isSameEncodedLod(q15.a, alphaMinus))\n);\nmat4 outerScore = mat4(\ndecodeFloat16(r0.rb) * float(isSameEncodedLod(r0.a, alphaPlus) || isSameEncodedLod(r0.a, alphaMinus)),\ndecodeFloat16(r1.rb) * float(isSameEncodedLod(r1.a, alphaPlus) || isSameEncodedLod(r1.a, alphaMinus)),\ndecodeFloat16(r2.rb) * float(isSameEncodedLod(r2.a, alphaPlus) || isSameEncodedLod(r2.a, alphaMinus)),\ndecodeFloat16(r3.rb) * float(isSameEncodedLod(r3.a, alphaPlus) || isSameEncodedLod(r3.a, alphaMinus)),\ndecodeFloat16(r4.rb) * float(isSameEncodedLod(r4.a, alphaPlus) || isSameEncodedLod(r4.a, alphaMinus)),\ndecodeFloat16(r5.rb) * float(isSameEncodedLod(r5.a, alphaPlus) || isSameEncodedLod(r5.a, alphaMinus)),\ndecodeFloat16(r6.rb) * float(isSameEncodedLod(r6.a, alphaPlus) || isSameEncodedLod(r6.a, alphaMinus)),\ndecodeFloat16(r7.rb) * float(isSameEncodedLod(r7.a, alphaPlus) || isSameEncodedLod(r7.a, alphaMinus)),\ndecodeFloat16(r8.rb) * float(isSameEncodedLod(r8.a, alphaPlus) || isSameEncodedLod(r8.a, alphaMinus)),\ndecodeFloat16(r9.rb) * float(isSameEncodedLod(r9.a, alphaPlus) || isSameEncodedLod(r9.a, alphaMinus)),\ndecodeFloat16(r10.rb) * float(isSameEncodedLod(r10.a, alphaPlus) || isSameEncodedLod(r10.a, alphaMinus)),\ndecodeFloat16(r11.rb) * float(isSameEncodedLod(r11.a, alphaPlus) || isSameEncodedLod(r11.a, alphaMinus)),\ndecodeFloat16(r12.rb) * float(isSameEncodedLod(r12.a, alphaPlus) || isSameEncodedLod(r12.a, alphaMinus)),\ndecodeFloat16(r13.rb) * float(isSameEncodedLod(r13.a, alphaPlus) || isSameEncodedLod(r13.a, alphaMinus)),\ndecodeFloat16(r14.rb) * float(isSameEncodedLod(r14.a, alphaPlus) || isSameEncodedLod(r14.a, alphaMinus)),\ndecodeFloat16(r15.rb) * float(isSameEncodedLod(r15.a, alphaPlus) || isSameEncodedLod(r15.a, alphaMinus))\n);\nvec3 maxInnerScore3 = max(innerScore[0], max(innerScore[1], innerScore[2]));\nvec4 maxMiddleScore4 = max(max(middleScore[0], middleScore[1]), max(middleScore[2], middleScore[3]));\nvec4 maxOuterScore4 = max(max(outerScore[0], outerScore[1]), max(outerScore[2], outerScore[3]));\nfloat maxInnerScore = max(maxInnerScore3.x, max(maxInnerScore3.y, maxInnerScore3.z));\nfloat maxMiddleScore = max(max(maxMiddleScore4.x, maxMiddleScore4.y), max(maxMiddleScore4.z, maxMiddleScore4.w));\nfloat maxOuterScore = max(max(maxOuterScore4.x, maxOuterScore4.y), max(maxOuterScore4.z, maxOuterScore4.w));\nfloat maxScore = max(maxInnerScore, max(maxMiddleScore, maxOuterScore));\nfloat finalScore = step(maxScore, score) * score;\ncolor.rb = encodeFloat16(finalScore);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/orb/orb-descriptor.glsl":
/*!***********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/orb/orb-descriptor.glsl ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D encodedCorners;\nuniform int encoderLength;\nuniform sampler2D pyramid;\nuniform int extraSize;\nconst int descriptorSize = 32;\nconst ivec4 pat31[256] = ivec4[256](\nivec4(8,-3,9,5),\nivec4(4,2,7,-12),\nivec4(-11,9,-8,2),\nivec4(7,-12,12,-13),\nivec4(2,-13,2,12),\nivec4(1,-7,1,6),\nivec4(-2,-10,-2,-4),\nivec4(-13,-13,-11,-8),\nivec4(-13,-3,-12,-9),\nivec4(10,4,11,9),\nivec4(-13,-8,-8,-9),\nivec4(-11,7,-9,12),\nivec4(7,7,12,6),\nivec4(-4,-5,-3,0),\nivec4(-13,2,-12,-3),\nivec4(-9,0,-7,5),\nivec4(12,-6,12,-1),\nivec4(-3,6,-2,12),\nivec4(-6,-13,-4,-8),\nivec4(11,-13,12,-8),\nivec4(4,7,5,1),\nivec4(5,-3,10,-3),\nivec4(3,-7,6,12),\nivec4(-8,-7,-6,-2),\nivec4(-2,11,-1,-10),\nivec4(-13,12,-8,10),\nivec4(-7,3,-5,-3),\nivec4(-4,2,-3,7),\nivec4(-10,-12,-6,11),\nivec4(5,-12,6,-7),\nivec4(5,-6,7,-1),\nivec4(1,0,4,-5),\nivec4(9,11,11,-13),\nivec4(4,7,4,12),\nivec4(2,-1,4,4),\nivec4(-4,-12,-2,7),\nivec4(-8,-5,-7,-10),\nivec4(4,11,9,12),\nivec4(0,-8,1,-13),\nivec4(-13,-2,-8,2),\nivec4(-3,-2,-2,3),\nivec4(-6,9,-4,-9),\nivec4(8,12,10,7),\nivec4(0,9,1,3),\nivec4(7,-5,11,-10),\nivec4(-13,-6,-11,0),\nivec4(10,7,12,1),\nivec4(-6,-3,-6,12),\nivec4(10,-9,12,-4),\nivec4(-13,8,-8,-12),\nivec4(-13,0,-8,-4),\nivec4(3,3,7,8),\nivec4(5,7,10,-7),\nivec4(-1,7,1,-12),\nivec4(3,-10,5,6),\nivec4(2,-4,3,-10),\nivec4(-13,0,-13,5),\nivec4(-13,-7,-12,12),\nivec4(-13,3,-11,8),\nivec4(-7,12,-4,7),\nivec4(6,-10,12,8),\nivec4(-9,-1,-7,-6),\nivec4(-2,-5,0,12),\nivec4(-12,5,-7,5),\nivec4(3,-10,8,-13),\nivec4(-7,-7,-4,5),\nivec4(-3,-2,-1,-7),\nivec4(2,9,5,-11),\nivec4(-11,-13,-5,-13),\nivec4(-1,6,0,-1),\nivec4(5,-3,5,2),\nivec4(-4,-13,-4,12),\nivec4(-9,-6,-9,6),\nivec4(-12,-10,-8,-4),\nivec4(10,2,12,-3),\nivec4(7,12,12,12),\nivec4(-7,-13,-6,5),\nivec4(-4,9,-3,4),\nivec4(7,-1,12,2),\nivec4(-7,6,-5,1),\nivec4(-13,11,-12,5),\nivec4(-3,7,-2,-6),\nivec4(7,-8,12,-7),\nivec4(-13,-7,-11,-12),\nivec4(1,-3,12,12),\nivec4(2,-6,3,0),\nivec4(-4,3,-2,-13),\nivec4(-1,-13,1,9),\nivec4(7,1,8,-6),\nivec4(1,-1,3,12),\nivec4(9,1,12,6),\nivec4(-1,-9,-1,3),\nivec4(-13,-13,-10,5),\nivec4(7,7,10,12),\nivec4(12,-5,12,9),\nivec4(6,3,7,11),\nivec4(5,-13,6,10),\nivec4(2,-12,2,3),\nivec4(3,8,4,-6),\nivec4(2,6,12,-13),\nivec4(9,-12,10,3),\nivec4(-8,4,-7,9),\nivec4(-11,12,-4,-6),\nivec4(1,12,2,-8),\nivec4(6,-9,7,-4),\nivec4(2,3,3,-2),\nivec4(6,3,11,0),\nivec4(3,-3,8,-8),\nivec4(7,8,9,3),\nivec4(-11,-5,-6,-4),\nivec4(-10,11,-5,10),\nivec4(-5,-8,-3,12),\nivec4(-10,5,-9,0),\nivec4(8,-1,12,-6),\nivec4(4,-6,6,-11),\nivec4(-10,12,-8,7),\nivec4(4,-2,6,7),\nivec4(-2,0,-2,12),\nivec4(-5,-8,-5,2),\nivec4(7,-6,10,12),\nivec4(-9,-13,-8,-8),\nivec4(-5,-13,-5,-2),\nivec4(8,-8,9,-13),\nivec4(-9,-11,-9,0),\nivec4(1,-8,1,-2),\nivec4(7,-4,9,1),\nivec4(-2,1,-1,-4),\nivec4(11,-6,12,-11),\nivec4(-12,-9,-6,4),\nivec4(3,7,7,12),\nivec4(5,5,10,8),\nivec4(0,-4,2,8),\nivec4(-9,12,-5,-13),\nivec4(0,7,2,12),\nivec4(-1,2,1,7),\nivec4(5,11,7,-9),\nivec4(3,5,6,-8),\nivec4(-13,-4,-8,9),\nivec4(-5,9,-3,-3),\nivec4(-4,-7,-3,-12),\nivec4(6,5,8,0),\nivec4(-7,6,-6,12),\nivec4(-13,6,-5,-2),\nivec4(1,-10,3,10),\nivec4(4,1,8,-4),\nivec4(-2,-2,2,-13),\nivec4(2,-12,12,12),\nivec4(-2,-13,0,-6),\nivec4(4,1,9,3),\nivec4(-6,-10,-3,-5),\nivec4(-3,-13,-1,1),\nivec4(7,5,12,-11),\nivec4(4,-2,5,-7),\nivec4(-13,9,-9,-5),\nivec4(7,1,8,6),\nivec4(7,-8,7,6),\nivec4(-7,-4,-7,1),\nivec4(-8,11,-7,-8),\nivec4(-13,6,-12,-8),\nivec4(2,4,3,9),\nivec4(10,-5,12,3),\nivec4(-6,-5,-6,7),\nivec4(8,-3,9,-8),\nivec4(2,-12,2,8),\nivec4(-11,-2,-10,3),\nivec4(-12,-13,-7,-9),\nivec4(-11,0,-10,-5),\nivec4(5,-3,11,8),\nivec4(-2,-13,-1,12),\nivec4(-1,-8,0,9),\nivec4(-13,-11,-12,-5),\nivec4(-10,-2,-10,11),\nivec4(-3,9,-2,-13),\nivec4(2,-3,3,2),\nivec4(-9,-13,-4,0),\nivec4(-4,6,-3,-10),\nivec4(-4,12,-2,-7),\nivec4(-6,-11,-4,9),\nivec4(6,-3,6,11),\nivec4(-13,11,-5,5),\nivec4(11,11,12,6),\nivec4(7,-5,12,-2),\nivec4(-1,12,0,7),\nivec4(-4,-8,-3,-2),\nivec4(-7,1,-6,7),\nivec4(-13,-12,-8,-13),\nivec4(-7,-2,-6,-8),\nivec4(-8,5,-6,-9),\nivec4(-5,-1,-4,5),\nivec4(-13,7,-8,10),\nivec4(1,5,5,-13),\nivec4(1,0,10,-13),\nivec4(9,12,10,-1),\nivec4(5,-8,10,-9),\nivec4(-1,11,1,-13),\nivec4(-9,-3,-6,2),\nivec4(-1,-10,1,12),\nivec4(-13,1,-8,-10),\nivec4(8,-11,10,-6),\nivec4(2,-13,3,-6),\nivec4(7,-13,12,-9),\nivec4(-10,-10,-5,-7),\nivec4(-10,-8,-8,-13),\nivec4(4,-6,8,5),\nivec4(3,12,8,-13),\nivec4(-4,2,-3,-3),\nivec4(5,-13,10,-12),\nivec4(4,-13,5,-1),\nivec4(-9,9,-4,3),\nivec4(0,3,3,-9),\nivec4(-12,1,-6,1),\nivec4(3,2,4,-8),\nivec4(-10,-10,-10,9),\nivec4(8,-13,12,12),\nivec4(-8,-12,-6,-5),\nivec4(2,2,3,7),\nivec4(10,6,11,-8),\nivec4(6,8,8,-12),\nivec4(-7,10,-6,5),\nivec4(-3,-9,-3,9),\nivec4(-1,-13,-1,5),\nivec4(-3,-7,-3,4),\nivec4(-8,-2,-8,3),\nivec4(4,2,12,12),\nivec4(2,-5,3,11),\nivec4(6,-9,11,-13),\nivec4(3,-1,7,12),\nivec4(11,-1,12,4),\nivec4(-3,0,-3,6),\nivec4(4,-11,4,12),\nivec4(2,-4,2,1),\nivec4(-10,-6,-8,1),\nivec4(-13,7,-11,1),\nivec4(-13,12,-11,-13),\nivec4(6,0,11,-13),\nivec4(0,-1,1,4),\nivec4(-13,3,-9,-2),\nivec4(-9,8,-6,-3),\nivec4(-13,-6,-8,-2),\nivec4(5,-9,8,10),\nivec4(2,7,3,-9),\nivec4(-1,-6,-1,-1),\nivec4(9,5,11,-2),\nivec4(11,-3,12,-8),\nivec4(3,0,3,5),\nivec4(-1,4,0,10),\nivec4(3,-6,4,5),\nivec4(-13,0,-10,5),\nivec4(5,8,12,11),\nivec4(8,9,9,-6),\nivec4(7,-4,8,-12),\nivec4(-10,4,-10,9),\nivec4(7,3,12,4),\nivec4(9,-7,10,-2),\nivec4(7,0,12,-2),\nivec4(-1,-6,0,-11)\n);\nvoid getPair(int index, mat2 rot, out vec2 p, out vec2 q)\n{\nivec4 data = pat31[index];\nvec2 op = vec2(data.xy);\nvec2 oq = vec2(data.zw);\np = rot * op;\nq = rot * oq;\n}\nvoid main()\n{\nvec4 pixel = threadPixel(encodedCorners);\nivec2 thread = threadLocation();\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint descriptorCell = address.offset - sizeofEncodedKeypoint(0, extraSize) / 4;\ncolor = pixel;\nif(descriptorCell < 0)\nreturn;\nKeypoint keypoint = decodeKeypoint(encodedCorners, encoderLength, address);\nif(isBadKeypoint(keypoint))\nreturn;\nfloat degreesOrientation = round(360.0f + degrees(keypoint.orientation));\nfloat orientation = radians(degreesOrientation - mod(degreesOrientation, 12.0f));\nfloat kcos = cos(orientation);\nfloat ksin = sin(orientation);\nmat2 rot = mat2(kcos, ksin, -ksin, kcos);\nfloat pot = exp2(keypoint.lod);\nvec2 imageSize = vec2(textureSize(pyramid, 0));\nint patternStart = 32 * descriptorCell;\nuint test[4] = uint[4](0u, 0u, 0u, 0u);\nfor(int t = 0; t < 4; t++) {\nuint bits = 0u;\nvec2 p, q;\nvec4 a, b;\nint i = t * 8;\n@unroll\nfor(int j = 0; j < 8; j++) {\ngetPair(patternStart + i + j, rot, p, q);\na = pyrPixelAtEx(pyramid, round(keypoint.position + pot * p), keypoint.lod, imageSize);\nb = pyrPixelAtEx(pyramid, round(keypoint.position + pot * q), keypoint.lod, imageSize);\nbits |= uint(a.g < b.g) << j;\n}\ntest[t] = bits;\n}\ncolor = vec4(test[0], test[1], test[2], test[3]) / 255.0f;\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/orb/orb-orientation.glsl":
/*!************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/orb/orb-orientation.glsl ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D pyramid;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nconst int diskPointCount[16] = int[16](0, 4, 12, 28, 48, 80, 112, 148, 196, 252, 316, 376, 440, 528, 612, 708);\nconst ivec2 diskPoint[708] = ivec2[708](\nivec2(0,-1),ivec2(-1,0),ivec2(1,0),ivec2(0,1),\nivec2(-1,-1),ivec2(1,-1),ivec2(-1,1),ivec2(1,1),ivec2(0,-2),ivec2(-2,0),ivec2(2,0),ivec2(0,2),\nivec2(-1,-2),ivec2(1,-2),ivec2(-2,-1),ivec2(2,-1),ivec2(-2,1),ivec2(2,1),ivec2(-1,2),ivec2(1,2),ivec2(-2,-2),ivec2(2,-2),ivec2(-2,2),ivec2(2,2),ivec2(0,-3),ivec2(-3,0),ivec2(3,0),ivec2(0,3),\nivec2(-1,-3),ivec2(1,-3),ivec2(-3,-1),ivec2(3,-1),ivec2(-3,1),ivec2(3,1),ivec2(-1,3),ivec2(1,3),ivec2(-2,-3),ivec2(2,-3),ivec2(-3,-2),ivec2(3,-2),ivec2(-3,2),ivec2(3,2),ivec2(-2,3),ivec2(2,3),ivec2(0,-4),ivec2(-4,0),ivec2(4,0),ivec2(0,4),\nivec2(-1,-4),ivec2(1,-4),ivec2(-4,-1),ivec2(4,-1),ivec2(-4,1),ivec2(4,1),ivec2(-1,4),ivec2(1,4),ivec2(-3,-3),ivec2(3,-3),ivec2(-3,3),ivec2(3,3),ivec2(-2,-4),ivec2(2,-4),ivec2(-4,-2),ivec2(4,-2),ivec2(-4,2),ivec2(4,2),ivec2(-2,4),ivec2(2,4),ivec2(0,-5),ivec2(-3,-4),ivec2(3,-4),ivec2(-4,-3),ivec2(4,-3),ivec2(-5,0),ivec2(5,0),ivec2(-4,3),ivec2(4,3),ivec2(-3,4),ivec2(3,4),ivec2(0,5),\nivec2(-1,-5),ivec2(1,-5),ivec2(-5,-1),ivec2(5,-1),ivec2(-5,1),ivec2(5,1),ivec2(-1,5),ivec2(1,5),ivec2(-2,-5),ivec2(2,-5),ivec2(-5,-2),ivec2(5,-2),ivec2(-5,2),ivec2(5,2),ivec2(-2,5),ivec2(2,5),ivec2(-4,-4),ivec2(4,-4),ivec2(-4,4),ivec2(4,4),ivec2(-3,-5),ivec2(3,-5),ivec2(-5,-3),ivec2(5,-3),ivec2(-5,3),ivec2(5,3),ivec2(-3,5),ivec2(3,5),ivec2(0,-6),ivec2(-6,0),ivec2(6,0),ivec2(0,6),\nivec2(-1,-6),ivec2(1,-6),ivec2(-6,-1),ivec2(6,-1),ivec2(-6,1),ivec2(6,1),ivec2(-1,6),ivec2(1,6),ivec2(-2,-6),ivec2(2,-6),ivec2(-6,-2),ivec2(6,-2),ivec2(-6,2),ivec2(6,2),ivec2(-2,6),ivec2(2,6),ivec2(-4,-5),ivec2(4,-5),ivec2(-5,-4),ivec2(5,-4),ivec2(-5,4),ivec2(5,4),ivec2(-4,5),ivec2(4,5),ivec2(-3,-6),ivec2(3,-6),ivec2(-6,-3),ivec2(6,-3),ivec2(-6,3),ivec2(6,3),ivec2(-3,6),ivec2(3,6),ivec2(0,-7),ivec2(-7,0),ivec2(7,0),ivec2(0,7),\nivec2(-1,-7),ivec2(1,-7),ivec2(-5,-5),ivec2(5,-5),ivec2(-7,-1),ivec2(7,-1),ivec2(-7,1),ivec2(7,1),ivec2(-5,5),ivec2(5,5),ivec2(-1,7),ivec2(1,7),ivec2(-4,-6),ivec2(4,-6),ivec2(-6,-4),ivec2(6,-4),ivec2(-6,4),ivec2(6,4),ivec2(-4,6),ivec2(4,6),ivec2(-2,-7),ivec2(2,-7),ivec2(-7,-2),ivec2(7,-2),ivec2(-7,2),ivec2(7,2),ivec2(-2,7),ivec2(2,7),ivec2(-3,-7),ivec2(3,-7),ivec2(-7,-3),ivec2(7,-3),ivec2(-7,3),ivec2(7,3),ivec2(-3,7),ivec2(3,7),ivec2(-5,-6),ivec2(5,-6),ivec2(-6,-5),ivec2(6,-5),ivec2(-6,5),ivec2(6,5),ivec2(-5,6),ivec2(5,6),ivec2(0,-8),ivec2(-8,0),ivec2(8,0),ivec2(0,8),\nivec2(-1,-8),ivec2(1,-8),ivec2(-4,-7),ivec2(4,-7),ivec2(-7,-4),ivec2(7,-4),ivec2(-8,-1),ivec2(8,-1),ivec2(-8,1),ivec2(8,1),ivec2(-7,4),ivec2(7,4),ivec2(-4,7),ivec2(4,7),ivec2(-1,8),ivec2(1,8),ivec2(-2,-8),ivec2(2,-8),ivec2(-8,-2),ivec2(8,-2),ivec2(-8,2),ivec2(8,2),ivec2(-2,8),ivec2(2,8),ivec2(-6,-6),ivec2(6,-6),ivec2(-6,6),ivec2(6,6),ivec2(-3,-8),ivec2(3,-8),ivec2(-8,-3),ivec2(8,-3),ivec2(-8,3),ivec2(8,3),ivec2(-3,8),ivec2(3,8),ivec2(-5,-7),ivec2(5,-7),ivec2(-7,-5),ivec2(7,-5),ivec2(-7,5),ivec2(7,5),ivec2(-5,7),ivec2(5,7),ivec2(-4,-8),ivec2(4,-8),ivec2(-8,-4),ivec2(8,-4),ivec2(-8,4),ivec2(8,4),ivec2(-4,8),ivec2(4,8),ivec2(0,-9),ivec2(-9,0),ivec2(9,0),ivec2(0,9),\nivec2(-1,-9),ivec2(1,-9),ivec2(-9,-1),ivec2(9,-1),ivec2(-9,1),ivec2(9,1),ivec2(-1,9),ivec2(1,9),ivec2(-2,-9),ivec2(2,-9),ivec2(-6,-7),ivec2(6,-7),ivec2(-7,-6),ivec2(7,-6),ivec2(-9,-2),ivec2(9,-2),ivec2(-9,2),ivec2(9,2),ivec2(-7,6),ivec2(7,6),ivec2(-6,7),ivec2(6,7),ivec2(-2,9),ivec2(2,9),ivec2(-5,-8),ivec2(5,-8),ivec2(-8,-5),ivec2(8,-5),ivec2(-8,5),ivec2(8,5),ivec2(-5,8),ivec2(5,8),ivec2(-3,-9),ivec2(3,-9),ivec2(-9,-3),ivec2(9,-3),ivec2(-9,3),ivec2(9,3),ivec2(-3,9),ivec2(3,9),ivec2(-4,-9),ivec2(4,-9),ivec2(-9,-4),ivec2(9,-4),ivec2(-9,4),ivec2(9,4),ivec2(-4,9),ivec2(4,9),ivec2(-7,-7),ivec2(7,-7),ivec2(-7,7),ivec2(7,7),ivec2(0,-10),ivec2(-6,-8),ivec2(6,-8),ivec2(-8,-6),ivec2(8,-6),ivec2(-10,0),ivec2(10,0),ivec2(-8,6),ivec2(8,6),ivec2(-6,8),ivec2(6,8),ivec2(0,10),\nivec2(-1,-10),ivec2(1,-10),ivec2(-10,-1),ivec2(10,-1),ivec2(-10,1),ivec2(10,1),ivec2(-1,10),ivec2(1,10),ivec2(-2,-10),ivec2(2,-10),ivec2(-10,-2),ivec2(10,-2),ivec2(-10,2),ivec2(10,2),ivec2(-2,10),ivec2(2,10),ivec2(-5,-9),ivec2(5,-9),ivec2(-9,-5),ivec2(9,-5),ivec2(-9,5),ivec2(9,5),ivec2(-5,9),ivec2(5,9),ivec2(-3,-10),ivec2(3,-10),ivec2(-10,-3),ivec2(10,-3),ivec2(-10,3),ivec2(10,3),ivec2(-3,10),ivec2(3,10),ivec2(-7,-8),ivec2(7,-8),ivec2(-8,-7),ivec2(8,-7),ivec2(-8,7),ivec2(8,7),ivec2(-7,8),ivec2(7,8),ivec2(-4,-10),ivec2(4,-10),ivec2(-10,-4),ivec2(10,-4),ivec2(-10,4),ivec2(10,4),ivec2(-4,10),ivec2(4,10),ivec2(-6,-9),ivec2(6,-9),ivec2(-9,-6),ivec2(9,-6),ivec2(-9,6),ivec2(9,6),ivec2(-6,9),ivec2(6,9),ivec2(0,-11),ivec2(-11,0),ivec2(11,0),ivec2(0,11),\nivec2(-1,-11),ivec2(1,-11),ivec2(-11,-1),ivec2(11,-1),ivec2(-11,1),ivec2(11,1),ivec2(-1,11),ivec2(1,11),ivec2(-2,-11),ivec2(2,-11),ivec2(-5,-10),ivec2(5,-10),ivec2(-10,-5),ivec2(10,-5),ivec2(-11,-2),ivec2(11,-2),ivec2(-11,2),ivec2(11,2),ivec2(-10,5),ivec2(10,5),ivec2(-5,10),ivec2(5,10),ivec2(-2,11),ivec2(2,11),ivec2(-8,-8),ivec2(8,-8),ivec2(-8,8),ivec2(8,8),ivec2(-3,-11),ivec2(3,-11),ivec2(-7,-9),ivec2(7,-9),ivec2(-9,-7),ivec2(9,-7),ivec2(-11,-3),ivec2(11,-3),ivec2(-11,3),ivec2(11,3),ivec2(-9,7),ivec2(9,7),ivec2(-7,9),ivec2(7,9),ivec2(-3,11),ivec2(3,11),ivec2(-6,-10),ivec2(6,-10),ivec2(-10,-6),ivec2(10,-6),ivec2(-10,6),ivec2(10,6),ivec2(-6,10),ivec2(6,10),ivec2(-4,-11),ivec2(4,-11),ivec2(-11,-4),ivec2(11,-4),ivec2(-11,4),ivec2(11,4),ivec2(-4,11),ivec2(4,11),ivec2(0,-12),ivec2(-12,0),ivec2(12,0),ivec2(0,12),\nivec2(-1,-12),ivec2(1,-12),ivec2(-8,-9),ivec2(8,-9),ivec2(-9,-8),ivec2(9,-8),ivec2(-12,-1),ivec2(12,-1),ivec2(-12,1),ivec2(12,1),ivec2(-9,8),ivec2(9,8),ivec2(-8,9),ivec2(8,9),ivec2(-1,12),ivec2(1,12),ivec2(-5,-11),ivec2(5,-11),ivec2(-11,-5),ivec2(11,-5),ivec2(-11,5),ivec2(11,5),ivec2(-5,11),ivec2(5,11),ivec2(-2,-12),ivec2(2,-12),ivec2(-12,-2),ivec2(12,-2),ivec2(-12,2),ivec2(12,2),ivec2(-2,12),ivec2(2,12),ivec2(-7,-10),ivec2(7,-10),ivec2(-10,-7),ivec2(10,-7),ivec2(-10,7),ivec2(10,7),ivec2(-7,10),ivec2(7,10),ivec2(-3,-12),ivec2(3,-12),ivec2(-12,-3),ivec2(12,-3),ivec2(-12,3),ivec2(12,3),ivec2(-3,12),ivec2(3,12),ivec2(-6,-11),ivec2(6,-11),ivec2(-11,-6),ivec2(11,-6),ivec2(-11,6),ivec2(11,6),ivec2(-6,11),ivec2(6,11),ivec2(-4,-12),ivec2(4,-12),ivec2(-12,-4),ivec2(12,-4),ivec2(-12,4),ivec2(12,4),ivec2(-4,12),ivec2(4,12),ivec2(-9,-9),ivec2(9,-9),ivec2(-9,9),ivec2(9,9),ivec2(-8,-10),ivec2(8,-10),ivec2(-10,-8),ivec2(10,-8),ivec2(-10,8),ivec2(10,8),ivec2(-8,10),ivec2(8,10),ivec2(0,-13),ivec2(-5,-12),ivec2(5,-12),ivec2(-12,-5),ivec2(12,-5),ivec2(-13,0),ivec2(13,0),ivec2(-12,5),ivec2(12,5),ivec2(-5,12),ivec2(5,12),ivec2(0,13),\nivec2(-1,-13),ivec2(1,-13),ivec2(-7,-11),ivec2(7,-11),ivec2(-11,-7),ivec2(11,-7),ivec2(-13,-1),ivec2(13,-1),ivec2(-13,1),ivec2(13,1),ivec2(-11,7),ivec2(11,7),ivec2(-7,11),ivec2(7,11),ivec2(-1,13),ivec2(1,13),ivec2(-2,-13),ivec2(2,-13),ivec2(-13,-2),ivec2(13,-2),ivec2(-13,2),ivec2(13,2),ivec2(-2,13),ivec2(2,13),ivec2(-3,-13),ivec2(3,-13),ivec2(-13,-3),ivec2(13,-3),ivec2(-13,3),ivec2(13,3),ivec2(-3,13),ivec2(3,13),ivec2(-6,-12),ivec2(6,-12),ivec2(-12,-6),ivec2(12,-6),ivec2(-12,6),ivec2(12,6),ivec2(-6,12),ivec2(6,12),ivec2(-9,-10),ivec2(9,-10),ivec2(-10,-9),ivec2(10,-9),ivec2(-10,9),ivec2(10,9),ivec2(-9,10),ivec2(9,10),ivec2(-4,-13),ivec2(4,-13),ivec2(-8,-11),ivec2(8,-11),ivec2(-11,-8),ivec2(11,-8),ivec2(-13,-4),ivec2(13,-4),ivec2(-13,4),ivec2(13,4),ivec2(-11,8),ivec2(11,8),ivec2(-8,11),ivec2(8,11),ivec2(-4,13),ivec2(4,13),ivec2(-7,-12),ivec2(7,-12),ivec2(-12,-7),ivec2(12,-7),ivec2(-12,7),ivec2(12,7),ivec2(-7,12),ivec2(7,12),ivec2(-5,-13),ivec2(5,-13),ivec2(-13,-5),ivec2(13,-5),ivec2(-13,5),ivec2(13,5),ivec2(-5,13),ivec2(5,13),ivec2(0,-14),ivec2(-14,0),ivec2(14,0),ivec2(0,14),\nivec2(-1,-14),ivec2(1,-14),ivec2(-14,-1),ivec2(14,-1),ivec2(-14,1),ivec2(14,1),ivec2(-1,14),ivec2(1,14),ivec2(-2,-14),ivec2(2,-14),ivec2(-10,-10),ivec2(10,-10),ivec2(-14,-2),ivec2(14,-2),ivec2(-14,2),ivec2(14,2),ivec2(-10,10),ivec2(10,10),ivec2(-2,14),ivec2(2,14),ivec2(-9,-11),ivec2(9,-11),ivec2(-11,-9),ivec2(11,-9),ivec2(-11,9),ivec2(11,9),ivec2(-9,11),ivec2(9,11),ivec2(-3,-14),ivec2(3,-14),ivec2(-6,-13),ivec2(6,-13),ivec2(-13,-6),ivec2(13,-6),ivec2(-14,-3),ivec2(14,-3),ivec2(-14,3),ivec2(14,3),ivec2(-13,6),ivec2(13,6),ivec2(-6,13),ivec2(6,13),ivec2(-3,14),ivec2(3,14),ivec2(-8,-12),ivec2(8,-12),ivec2(-12,-8),ivec2(12,-8),ivec2(-12,8),ivec2(12,8),ivec2(-8,12),ivec2(8,12),ivec2(-4,-14),ivec2(4,-14),ivec2(-14,-4),ivec2(14,-4),ivec2(-14,4),ivec2(14,4),ivec2(-4,14),ivec2(4,14),ivec2(-7,-13),ivec2(7,-13),ivec2(-13,-7),ivec2(13,-7),ivec2(-13,7),ivec2(13,7),ivec2(-7,13),ivec2(7,13),ivec2(-5,-14),ivec2(5,-14),ivec2(-10,-11),ivec2(10,-11),ivec2(-11,-10),ivec2(11,-10),ivec2(-14,-5),ivec2(14,-5),ivec2(-14,5),ivec2(14,5),ivec2(-11,10),ivec2(11,10),ivec2(-10,11),ivec2(10,11),ivec2(-5,14),ivec2(5,14),ivec2(0,-15),ivec2(-9,-12),ivec2(9,-12),ivec2(-12,-9),ivec2(12,-9),ivec2(-15,0),ivec2(15,0),ivec2(-12,9),ivec2(12,9),ivec2(-9,12),ivec2(9,12),ivec2(0,15)\n);\nconst int DEFAULT_PATCH_RADIUS = 15;\nconst int MIN_PATCH_RADIUS = 2;\nvoid main()\n{\nvec4 pixel = threadPixel(encodedKeypoints);\nivec2 thread = threadLocation();\nint keypointIndex = thread.x + thread.y * outputSize().x;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);\nvec2 m = vec2(0.0f);\nfloat pot = exp2(keypoint.lod);\nivec2 pyrBaseSize = textureSize(pyramid, 0);\nint scaledRadius = int(ceil(float(DEFAULT_PATCH_RADIUS) / pot));\nint radius = max(scaledRadius, MIN_PATCH_RADIUS);\nint count = diskPointCount[radius];\nfor(int j = 0; j < count; j++) {\nvec2 offset = vec2(diskPoint[j]);\nvec2 position = keypoint.position + round(pot * offset);\nvec4 patchPixel = pyrPixelAtEx(pyramid, position, keypoint.lod, pyrBaseSize);\nm += offset * patchPixel.g;\n}\nfloat angle = fastAtan2(m.y, m.x);\nfloat encodedOrientation = encodeOrientation(angle);\nfloat encodedFlags = encodeKeypointFlags(keypoint.flags | KPF_ORIENTED);\ncolor = vec4(0.0f, encodedOrientation, 0.0f, encodedFlags);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/sort-by-score.glsl":
/*!******************************************************!*\
  !*** ./src/gpu/shaders/keypoints/sort-by-score.glsl ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D encodedKeypoints;\nuniform int estimatedKeypointCount;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#if !defined(MAX_KEYPOINTS)\n#error Must define MAX_KEYPOINTS\n#elif MAX_KEYPOINTS >= 65536\n#error MAX_KEYPOINTS is too large!\n#endif\nuint tuple[1 + MAX_KEYPOINTS];\nuint encodeTuple(Keypoint keypoint, int index)\n{\nuint mask = uint(-int(!isBadKeypoint(keypoint)));\nuint score = uint(clamp(keypoint.score, 0.0f, 1.0f) * 65535.0f);\nuint data = (uint(index) & 65535u) | (score << 16u);\nreturn data & mask;\n}\n#define decodeTupleIndex(tuple) int((tuple) & 16777215u)\n#define QUICKSELECT_UNSIGNED\n#define QUICKSELECT_DESCENDING\n#define QUICKSELECT_ARRAY tuple\n@include \"quickselect.glsl\"\nvoid main()\n{\nvec4 pixel = threadPixel(encodedKeypoints);\nivec2 thread = threadLocation();\nKeypointAddress myAddress = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint myIndex = findKeypointIndex(myAddress, descriptorSize, extraSize);\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\ncolor = pixel;\nif(myIndex >= estimatedKeypointCount)\nreturn;\nKeypoint keypoint;\nKeypointAddress address = KeypointAddress(0, 0);\nint actualKeypointCount = estimatedKeypointCount;\nfor(int i = 0; i < estimatedKeypointCount; i++) {\nkeypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);\ntuple[min(i, MAX_KEYPOINTS)] = encodeTuple(keypoint, i);\nactualKeypointCount = isBadKeypoint(keypoint) ? min(actualKeypointCount, i) : actualKeypointCount;\naddress.base += pixelsPerKeypoint;\n}\nint desiredTuple = quickselect(0, min(MAX_KEYPOINTS, actualKeypointCount - 1), myIndex);\nint desiredIndex = decodeTupleIndex(desiredTuple);\nKeypointAddress desiredAddress = KeypointAddress(desiredIndex * pixelsPerKeypoint, myAddress.offset);\nvec4 desiredPixel = readKeypointData(encodedKeypoints, encoderLength, desiredAddress);\ncolor = myIndex < actualKeypointCount ? desiredPixel : encodeNullKeypoint();\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/suppress-descriptors.glsl":
/*!*************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/suppress-descriptors.glsl ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nuniform int suppressedEncoderLength;\nvoid main()\n{\nivec2 thread = threadLocation();\nKeypointAddress myAddress = findKeypointAddress(thread, suppressedEncoderLength, 0, extraSize);\nint myIndex = findKeypointIndex(myAddress, 0, extraSize);\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress otherAddress = KeypointAddress(myIndex * pixelsPerKeypoint, myAddress.offset);\ncolor = readKeypointData(encodedKeypoints, encoderLength, otherAddress);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/transfer-orientation.glsl":
/*!*************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/transfer-orientation.glsl ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D encodedOrientations;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nvoid main()\n{\nvec4 pixel = threadPixel(encodedKeypoints);\nivec2 thread = threadLocation();\nKeypointAddress myAddress = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint myIndex = findKeypointIndex(myAddress, descriptorSize, extraSize);\nint orientationEncoderLength = textureSize(encodedOrientations, 0).x;\nivec2 location = ivec2(myIndex % orientationEncoderLength, myIndex / orientationEncoderLength);\nvec4 targetPixel = pixelAt(encodedOrientations, location);\nfloat encodedOrientation = targetPixel.g;\nfloat encodedFlags = targetPixel.a;\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, myAddress);\nbool isValid = !isBadKeypoint(keypoint);\ncolor = isValid && myAddress.offset == 1 ? vec4(pixel.r, encodedOrientation, pixel.b, encodedFlags) : pixel;\n}"

/***/ }),

/***/ "./src/gpu/shaders/pyramids/downsample2.glsl":
/*!***************************************************!*\
  !*** ./src/gpu/shaders/pyramids/downsample2.glsl ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nvoid main()\n{\nivec2 thread = threadLocation();\nivec2 pos = min(thread * 2, textureSize(image, 0) - ivec2(1));\ncolor = pixelAt(image, pos);\n}"

/***/ }),

/***/ "./src/gpu/shaders/pyramids/upsample2.glsl":
/*!*************************************************!*\
  !*** ./src/gpu/shaders/pyramids/upsample2.glsl ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nvoid main()\n{\nivec2 thread = threadLocation();\nvec4 pixel = pixelAt(image, thread / 2);\ncolor = (((thread.x + thread.y) & 1) == 0) ? pixel : vec4(0.0f, 0.0f, 0.0f, pixel.a);\n}"

/***/ }),

/***/ "./src/gpu/shaders/trackers/lk-discard.glsl":
/*!**************************************************!*\
  !*** ./src/gpu/shaders/trackers/lk-discard.glsl ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D pyramid;\nuniform sampler2D encodedKeypoints;\nuniform int windowSize;\nuniform float discardThreshold;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nbool isInsideImage(vec2 position)\n{\nvec2 imageSize = vec2(textureSize(pyramid, 0));\nfloat border = float(windowSize);\nreturn (\nposition.x > border && position.x < imageSize.x - border &&\nposition.y > border && position.y < imageSize.y - border\n);\n}\nvoid main()\n{\nvec4 pixel = threadPixel(encodedKeypoints);\nivec2 thread = threadLocation();\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\ncolor = pixel;\nif(address.offset != 1)\nreturn;\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);\nif(isBadKeypoint(keypoint))\nreturn;\nbool shouldDiscard = isKeypointAtInfinity(keypoint) || !isInsideImage(keypoint.position);\nint newFlag = shouldDiscard ? KPF_DISCARD : 0;\ncolor.a = encodeKeypointFlags(keypoint.flags | newFlag);\n}"

/***/ }),

/***/ "./src/gpu/shaders/trackers/lk.glsl":
/*!******************************************!*\
  !*** ./src/gpu/shaders/trackers/lk.glsl ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\n@include \"float16.glsl\"\nuniform sampler2D nextPyramid;\nuniform sampler2D prevPyramid;\nuniform sampler2D encodedFlow;\nuniform sampler2D prevKeypoints;\nuniform int windowSize;\nuniform int level;\nuniform int depth;\nuniform int numberOfIterations;\nuniform float discardThreshold;\nuniform float epsilon;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#ifndef MAX_WINDOW_SIZE\n#error Must define MAX_WINDOW_SIZE\n#endif\n#define NEXT_IMAGE 1\n#define PREV_IMAGE 0\nconst int MAX_WINDOW_SIZE_SQUARED = (MAX_WINDOW_SIZE) * (MAX_WINDOW_SIZE);\nconst int MAX_WINDOW_SIZE_PLUS = (MAX_WINDOW_SIZE) + 2;\nconst int MAX_WINDOW_SIZE_PLUS_SQUARED = MAX_WINDOW_SIZE_PLUS * MAX_WINDOW_SIZE_PLUS;\nconst int DBL_MAX_WINDOW_SIZE_PLUS_SQUARED = 2 * MAX_WINDOW_SIZE_PLUS_SQUARED;\nconst int MAX_WINDOW_RADIUS_PLUS = (MAX_WINDOW_SIZE_PLUS - 1) / 2;\nconst int MAX_WINDOW_RADIUS = ((MAX_WINDOW_SIZE) - 1) / 2;\nconst highp float FLT_SCALE = 0.00000095367431640625f;\nconst highp float FLT_EPSILON = 0.00000011920929f;\nconst highp float INFINITY = 1.0f / 0.0f;\n#define windowRadius() ((windowSize - 1) / 2)\nfloat pixelBuffer[DBL_MAX_WINDOW_SIZE_PLUS_SQUARED];\n#define prevPixel(index) pixelBuffer[(index)]\n#define nextPixel(index) pixelBuffer[MAX_WINDOW_SIZE_PLUS_SQUARED + (index)]\n#define pixelIndex(i, j) (((j) + MAX_WINDOW_RADIUS_PLUS) * MAX_WINDOW_SIZE_PLUS + ((i) + MAX_WINDOW_RADIUS_PLUS))\nivec2 derivBuffer[MAX_WINDOW_SIZE_SQUARED];\n#define derivativesAt(x, y) derivBuffer[((y) + MAX_WINDOW_RADIUS) * MAX_WINDOW_SIZE + ((x) + MAX_WINDOW_RADIUS)]\nvoid readWindow(vec2 center, float lod)\n{\nivec2 pyrBaseSize = textureSize(prevPyramid, 0);\nfloat pot = exp2(lod);\nint r = windowRadius();\nivec2 offset; int idx;\n#define readPixelsAt(ox, oy) offset = ivec2((ox), (oy)); \\\nidx = pixelIndex(offset.x, offset.y); \\\nnextPixel(idx) = pyrSubpixelAtExOffset(nextPyramid, center, lod, pot, offset, pyrBaseSize).g; \\\nprevPixel(idx) = pyrSubpixelAtExOffset(prevPyramid, center, lod, pot, offset, pyrBaseSize).g\nfor(int j = 0; j < windowSize; j++) {\nfor(int i = 0; i < windowSize; i++) {\nreadPixelsAt(i-r, j-r);\n}\n}\nint r1 = r+1;\nfor(int k = 0; k < windowSize; k++) {\nreadPixelsAt(-r1, k-r);\nreadPixelsAt( r1, k-r);\nreadPixelsAt(k-r,-r1);\nreadPixelsAt(k-r, r1);\n}\nreadPixelsAt(-r1,-r1);\nreadPixelsAt( r1,-r1);\nreadPixelsAt(-r1, r1);\nreadPixelsAt( r1, r1);\n}\nvec2 computeDerivatives(int imageCode, ivec2 offset)\n{\nconst mat3 dx = mat3(\n3, 0, -3,\n10, 0, -10,\n3, 0, -3\n);\nconst mat3 dy = mat3(\n3, 10, 3,\n0, 0, 0,\n-3, -10, -3\n);\nint indexOffset = imageCode * MAX_WINDOW_SIZE_PLUS_SQUARED;\nmat3 window = mat3(\npixelBuffer[indexOffset + pixelIndex(offset.x-1, offset.y-1)],\npixelBuffer[indexOffset + pixelIndex(offset.x+0, offset.y-1)],\npixelBuffer[indexOffset + pixelIndex(offset.x+1, offset.y-1)],\npixelBuffer[indexOffset + pixelIndex(offset.x-1, offset.y+0)],\n0.0f,\npixelBuffer[indexOffset + pixelIndex(offset.x+1, offset.y+0)],\npixelBuffer[indexOffset + pixelIndex(offset.x-1, offset.y+1)],\npixelBuffer[indexOffset + pixelIndex(offset.x+0, offset.y+1)],\npixelBuffer[indexOffset + pixelIndex(offset.x+1, offset.y+1)]\n);\nmat3 fx = matrixCompMult(dx, window);\nmat3 fy = matrixCompMult(dy, window);\nconst vec3 ones = vec3(1.0f);\nreturn vec2(\ndot(fx[0], ones) + dot(fx[1], ones) + dot(fx[2], ones),\ndot(fy[0], ones) + dot(fy[1], ones) + dot(fy[2], ones)\n);\n}\nfloat readBufferedPixel(int imageCode, ivec2 offset)\n{\nivec2 limit = ivec2(windowRadius());\noffset = clamp(offset, -limit, limit);\nint indexOffset = imageCode * MAX_WINDOW_SIZE_PLUS_SQUARED;\nreturn pixelBuffer[indexOffset + pixelIndex(offset.x, offset.y)];\n}\nfloat readBufferedSubpixel(int imageCode, vec2 offset)\n{\nivec2 p = ivec2(floor(offset));\nvec2 frc = fract(offset);\nvec2 ifrc = vec2(1.0f) - frc;\nvec4 pix4 = vec4(\nreadBufferedPixel(imageCode, p),\nreadBufferedPixel(imageCode, ivec2(p.x + 1, p.y)),\nreadBufferedPixel(imageCode, ivec2(p.x, p.y + 1)),\nreadBufferedPixel(imageCode, ivec2(p.x + 1, p.y + 1))\n);\nreturn dot(vec4(\npix4.x * ifrc.x * ifrc.y,\npix4.y * frc.x * ifrc.y,\npix4.z * ifrc.x * frc.y,\npix4.w * frc.x * frc.y\n), vec4(1.0f));\n}\nivec2 computeMismatch(highp vec2 pyrGuess, highp vec2 localGuess)\n{\nint timeDerivative;\nivec2 mismatch = ivec2(0);\nint x, y, r = windowRadius();\nhighp vec2 d = pyrGuess + localGuess;\nfor(int _y = 0; _y < windowSize; _y++) {\nfor(int _x = 0; _x < windowSize; _x++) {\nx = _x - r; y = _y - r;\ntimeDerivative = int(round(255.0f * (\nreadBufferedSubpixel(NEXT_IMAGE, vec2(x, y) + d) -\nreadBufferedPixel(PREV_IMAGE, ivec2(x, y))\n)));\nmismatch += derivativesAt(x, y) * timeDerivative;\n}\n}\nreturn mismatch;\n}\nvec4 encodeFlow(vec2 flow)\n{\nreturn vec4(encodeFloat16(flow.x), encodeFloat16(flow.y));\n}\nvec2 decodeFlow(vec4 pix)\n{\nreturn vec2(decodeFloat16(pix.rg), decodeFloat16(pix.ba));\n}\nvoid main()\n{\nvec4 pixel = threadPixel(encodedFlow);\nivec2 thread = threadLocation();\nfloat windowArea = float(windowSize * windowSize);\nint r = windowRadius();\nint keypointIndex = thread.x + thread.y * outputSize().x;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);\nKeypoint keypoint = decodeKeypoint(prevKeypoints, encoderLength, address);\ncolor = encodeFlow(vec2(0.0f));\nif(isBadKeypoint(keypoint))\nreturn;\nhighp vec2 pyrGuess = (level < depth - 1) ? decodeFlow(pixel) : vec2(0.0f);\nreadWindow(keypoint.position, float(level));\nivec2 derivatives;\nivec3 harris3i = ivec3(0);\nfor(int j = 0; j < windowSize; j++) {\nfor(int i = 0; i < windowSize; i++) {\nderivatives = ivec2(floor(255.0f * computeDerivatives(PREV_IMAGE, ivec2(i-r, j-r))));\nharris3i += ivec3(\nderivatives.x * derivatives.x,\nderivatives.x * derivatives.y,\nderivatives.y * derivatives.y\n);\nderivativesAt(i-r, j-r) = derivatives;\n}\n}\nhighp vec3 harris = vec3(harris3i) * FLT_SCALE;\nhighp float det = harris.x * harris.z - harris.y * harris.y;\nhighp float invDet = 1.0f / det;\nhighp mat2 invHarris = mat2(harris.z, -harris.y, -harris.y, harris.x);\nhighp float minEigenvalue = 0.5f * ((harris.x + harris.z) - sqrt(\n(harris.x - harris.z) * (harris.x - harris.z) + 4.0f * (harris.y * harris.y)\n));\nint niceNumbers = int(det >= FLT_EPSILON && minEigenvalue >= discardThreshold * windowArea);\nbool goodKeypoint = (level > 0) || (niceNumbers != 0);\nhighp float eps2 = epsilon * epsilon;\nhighp vec2 mismatch, delta, localGuess = vec2(0.0f);\nfor(int k = 0; k < numberOfIterations; k++) {\nmismatch = vec2(computeMismatch(pyrGuess, localGuess)) * FLT_SCALE;\ndelta = mismatch * invHarris * invDet;\nniceNumbers &= int(step(eps2, dot(delta, delta)));\nlocalGuess += niceNumbers != 0 ? delta : vec2(0.0f);\n}\npyrGuess = 2.0f * (pyrGuess + localGuess);\nvec2 opticalFlow = goodKeypoint ? pyrGuess : vec2(INFINITY);\ncolor = encodeFlow(opticalFlow);\n}"

/***/ }),

/***/ "./src/gpu/shaders/trackers/transfer-flow.glsl":
/*!*****************************************************!*\
  !*** ./src/gpu/shaders/trackers/transfer-flow.glsl ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\n@include \"float16.glsl\"\nuniform sampler2D encodedFlow;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nvec2 decodeFlow(vec4 pix)\n{\nreturn vec2(decodeFloat16(pix.rg), decodeFloat16(pix.ba));\n}\nvoid main()\n{\nvec4 pixel = threadPixel(encodedKeypoints);\nivec2 thread = threadLocation();\nKeypointAddress myAddress = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, myAddress);\nint myIndex = findKeypointIndex(myAddress, descriptorSize, extraSize);\nint len = textureSize(encodedFlow, 0).x;\nivec2 location = ivec2(myIndex % len, myIndex / len);\nvec4 targetPixel = pixelAt(encodedFlow, location);\nvec2 flow = decodeFlow(targetPixel);\nvec4 encodedPosition = any(isinf(flow)) ? encodeKeypointPositionAtInfinity() : encodeKeypointPosition(\nkeypoint.position + flow\n);\ncolor = myAddress.offset == 0 ? encodedPosition : pixel;\n}"

/***/ }),

/***/ "./src/gpu/shaders/transforms/resize.glsl":
/*!************************************************!*\
  !*** ./src/gpu/shaders/transforms/resize.glsl ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"subpixel.glsl\"\nuniform sampler2D image;\nvoid main()\n{\nvec2 imageSize = vec2(textureSize(image, 0));\n#if !defined(INTERPOLATION_METHOD)\n#error Must define INTERPOLATION_METHOD\n#elif INTERPOLATION_METHOD == 0\nvec2 pos = texCoord * imageSize;\ncolor = textureLod(image, (round(pos) + vec2(0.5f)) / imageSize, 0.0f);\n#elif INTERPOLATION_METHOD == 1\ncolor = subpixelAtBI(image, texCoord * imageSize);\n#else\n#error Invalid INTERPOLATION_METHOD\n#endif\n}"

/***/ }),

/***/ "./src/gpu/shaders/transforms/warp-perspective.glsl":
/*!**********************************************************!*\
  !*** ./src/gpu/shaders/transforms/warp-perspective.glsl ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"subpixel.glsl\"\nuniform sampler2D image;\nuniform mat3 inverseHomography;\nconst vec4 emptyColor = vec4(0.0f, 0.0f, 0.0f, 1.0f);\nvec2 perspectiveWarp(mat3 homography, vec2 p)\n{\nvec3 q = homography * vec3(p, 1.0f);\nreturn q.xy / q.z;\n}\nvoid main()\n{\nivec2 location = threadLocation();\nivec2 size = outputSize();\nconst vec2 zero = vec2(0.0f);\nvec2 target = perspectiveWarp(inverseHomography, vec2(location));\nbool withinBounds = all(bvec4(greaterThanEqual(target, zero), lessThan(target, vec2(size))));\ncolor = withinBounds ? subpixelAtBI(image, target) : emptyColor;\n}"

/***/ }),

/***/ "./src/gpu/shaders/utils/copy-components.glsl":
/*!****************************************************!*\
  !*** ./src/gpu/shaders/utils/copy-components.glsl ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"colors.glsl\"\nuniform sampler2D dest, src;\nuniform int destComponents;\nuniform int srcComponentId;\nvoid main()\n{\nvec4 destPixel = threadPixel(dest);\nvec4 srcPixel = threadPixel(src);\nbvec4 flags = bvec4(\n(destComponents & PIXELCOMPONENT_RED) != 0,\n(destComponents & PIXELCOMPONENT_GREEN) != 0,\n(destComponents & PIXELCOMPONENT_BLUE) != 0,\n(destComponents & PIXELCOMPONENT_ALPHA) != 0\n);\ncolor = mix(destPixel, vec4(srcPixel[srcComponentId]), flags);\n}"

/***/ }),

/***/ "./src/gpu/shaders/utils/fill-components.glsl":
/*!****************************************************!*\
  !*** ./src/gpu/shaders/utils/fill-components.glsl ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"colors.glsl\"\nuniform sampler2D image;\nuniform int pixelComponents;\nuniform float value;\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nbvec4 flags = bvec4(\n(pixelComponents & PIXELCOMPONENT_RED) != 0,\n(pixelComponents & PIXELCOMPONENT_GREEN) != 0,\n(pixelComponents & PIXELCOMPONENT_BLUE) != 0,\n(pixelComponents & PIXELCOMPONENT_ALPHA) != 0\n);\ncolor = mix(pixel, vec4(value), flags);\n}"

/***/ }),

/***/ "./src/gpu/shaders/utils/fill.glsl":
/*!*****************************************!*\
  !*** ./src/gpu/shaders/utils/fill.glsl ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform float value;\nvoid main()\n{\ncolor = vec4(value);\n}"

/***/ }),

/***/ "./src/gpu/shaders/utils/flip-y.glsl":
/*!*******************************************!*\
  !*** ./src/gpu/shaders/utils/flip-y.glsl ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nvoid main() {\nivec2 pos = threadLocation();\npos.y = int(texSize.y) - 1 - pos.y;\ncolor = pixelAt(image, pos);\n}"

/***/ }),

/***/ "./src/gpu/shaders/utils/identity.glsl":
/*!*********************************************!*\
  !*** ./src/gpu/shaders/utils/identity.glsl ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nvoid main()\n{\ncolor = threadPixel(image);\n}"

/***/ }),

/***/ "./src/gpu/shaders/utils/scan-minmax2d.glsl":
/*!**************************************************!*\
  !*** ./src/gpu/shaders/utils/scan-minmax2d.glsl ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nuniform int iterationNumber;\nvoid main()\n{\nivec2 thread = threadLocation();\nivec2 last = outputSize() - ivec2(1);\nint jump = (1 << iterationNumber);\nint clusterLength = jump << 1;\nint clusterMask = clusterLength - 1;\nivec2 clusterPos = ivec2(thread >> (1 + iterationNumber)) << (1 + iterationNumber);\nivec2 next1 = clusterPos + ((thread - clusterPos + ivec2(jump, 0)) & clusterMask);\nivec2 next2 = clusterPos + ((thread - clusterPos + ivec2(0, jump)) & clusterMask);\nivec2 next3 = clusterPos + ((thread - clusterPos + ivec2(jump, jump)) & clusterMask);\nvec4 p0 = texelFetch(image, thread, 0);\nvec4 p1 = texelFetch(image, min(next1, last), 0);\nvec4 p2 = texelFetch(image, min(next2, last), 0);\nvec4 p3 = texelFetch(image, min(next3, last), 0);\nvec4 pmax = max(max(p0, p1), max(p2, p3));\nvec4 pmin = min(min(p0, p1), min(p2, p3));\ncolor = vec4(pmax.r, pmin.g, pmax.r - pmin.g, p0.a);\n}"

/***/ }),

/***/ "./src/gpu/speedy-gl.js":
/*!******************************!*\
  !*** ./src/gpu/speedy-gl.js ***!
  \******************************/
/*! exports provided: SpeedyGL */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyGL", function() { return SpeedyGL; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_observable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/observable */ "./src/utils/observable.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * speedy-gl.js
 * A wrapper around the WebGL Rendering Context
 */






// Constants
const CANVAS_WIDTH = 2048; // this size should be compatible with everything...
const CANVAS_HEIGHT = 2048;
const SINGLETON_KEY = Symbol();

/** @type {SpeedyGL} Singleton */
let instance = null;

/**
 * A wrapper around the WebGL Rendering Context
 */
class SpeedyGL extends _utils_observable__WEBPACK_IMPORTED_MODULE_1__["Observable"]
{
    /**
     * Constructor
     * @param {Symbol} key
     * @private
     */
    constructor(key)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(key === SINGLETON_KEY);
        super();

        // does the browser support WebGL2?
        if(typeof WebGL2RenderingContext === 'undefined')
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["NotSupportedError"](`This application requires WebGL2. Please use a different browser.`);

        /** @type {HTMLCanvasElement} canvas */
        this._canvas = this._createCanvas(this._reinitialize.bind(this));

        /** @type {WebGL2RenderingContext} WebGL rendering context */
        this._gl = this._createContext(this._canvas);

        /** @type {boolean} internal flag */
        this._reinitializeOnContextLoss = true;
    }

    /**
     * Get Singleton
     * @returns {SpeedyGL}
     */
    static get instance()
    {
        return instance || (instance = new SpeedyGL(SINGLETON_KEY));
    }

    /**
     * The WebGL Rendering Context
     * Be careful not to cache this, as the WebGL Rendering Context may be lost!
     * @returns {WebGL2RenderingContext}
     */
    get gl()
    {
        return this._gl;
    }

    /**
     * The canvas
     * @returns {HTMLCanvasElement}
     */
    get canvas()
    {
        return this._canvas;
    }

    /**
     * Create a WebGL-capable canvas
     * @param {Function} reinitialize to be called if we get a WebGL context loss event
     * @returns {HTMLCanvasElement}
     */
    _createCanvas(reinitialize)
    {
        const canvas = _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

        canvas.addEventListener('webglcontextlost', ev => {
            _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].warning(`Lost WebGL2 context`);
            setTimeout(reinitialize, 0);
            ev.preventDefault();
        }, false);

        /*canvas.addEventListener('webglcontextrestored', ev => {
            Utils.warning(`Restored WebGL2 context`);
            ev.preventDefault();
        }, false);*/

        return canvas;
    }

    /**
     * Create a WebGL2 Rendering Context
     * @param {HTMLCanvasElement} canvas
     * @returns {WebGL2RenderingContext}
     */
    _createContext(canvas)
    {
         const gl = canvas.getContext('webgl2', {
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            //preferLowPowerToHighPerformance: false, // TODO user option?
            alpha: true,
            antialias: false,
            depth: false,
            stencil: false,
        });

        if(!gl)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["NotSupportedError"](`Can't create a WebGL2 Rendering Context. Try a different browser!`);       

        return gl;
    }

    /**
     * Reinitialize WebGL
     */
    _reinitialize()
    {
        // disable reinitialization?
        if(!this._reinitializeOnContextLoss)
            return;

        // warning
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].warning(`Reinitializing WebGL2...`);

        // create new canvas
        this._canvas.remove();
        this._canvas = this._createCanvas(this._reinitialize.bind(this));

        // create new context
        this._gl = this._createContext(this._canvas);

        // notify observers: we have a new context!
        // we need to recreate all textures...
        this._notify(this._gl);
    }

    /**
     * Lose the WebGL context. This is used to manually
     * free resources, and also for purposes of testing
     * @returns {WEBGL_lose_context}
     */
    loseContext()
    {
        const gl = this._gl;

        // nothing to do?
        if(gl.isContextLost())
            return;

        // find the appropriate extension
        const ext = gl.getExtension('WEBGL_lose_context');
        if(!ext)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["NotSupportedError"]('WEBGL_lose_context extension is unavailable');

        // disable reinitialization
        this._reinitializeOnContextLoss = false;

        // lose context
        ext.loseContext();

        // done!
        return ext;
    }

    /**
     * Lose & restore the WebGL context
     * @param {number} [secondsToRestore]
     * @return {SpeedyPromise<WEBGL_lose_context>} resolves as soon as the context is restored
     */
    loseAndRestoreContext(secondsToRestore = 1)
    {
        const ms = Math.max(secondsToRestore, 0) * 1000;
        const ext = this.loseContext();

        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__["SpeedyPromise"](resolve => {
            setTimeout(() => {
                //ext.restoreContext();
                this._reinitializeOnContextLoss = true;
                this._reinitialize();
                setTimeout(() => resolve(ext), 0); // next frame
            }, ms);
        });
    }
}

/***/ }),

/***/ "./src/gpu/speedy-gpu.js":
/*!*******************************!*\
  !*** ./src/gpu/speedy-gpu.js ***!
  \*******************************/
/*! exports provided: SpeedyGPU */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyGPU", function() { return SpeedyGPU; });
/* harmony import */ var _speedy_gl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-gl */ "./src/gpu/speedy-gl.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _speedy_program_center__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./speedy-program-center */ "./src/gpu/speedy-program-center.js");
/* harmony import */ var _speedy_texture_pool__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./speedy-texture-pool */ "./src/gpu/speedy-texture-pool.js");
/* harmony import */ var _speedy_texture_uploader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./speedy-texture-uploader */ "./src/gpu/speedy-texture-uploader.js");
/* harmony import */ var _core_speedy_media_source__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/speedy-media-source */ "./src/core/speedy-media-source.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/globals */ "./src/utils/globals.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
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
 * speedy-gpu.js
 * GPU-accelerated routines for Computer Vision
 */












/**
 * GPU-accelerated routines for Computer Vision
 */
class SpeedyGPU
{
    /**
     * Constructor
     * @param {number} width width of the image you're working with
     * @param {number} height height of the image you're working with
     */
    constructor(width, height)
    {
        // validate texture size
        if(width > _utils_globals__WEBPACK_IMPORTED_MODULE_7__["MAX_TEXTURE_LENGTH"] || height > _utils_globals__WEBPACK_IMPORTED_MODULE_7__["MAX_TEXTURE_LENGTH"])
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_6__["NotSupportedError"](`Maximum texture size exceeded. Using ${width} x ${height}, expected up to ${_utils_globals__WEBPACK_IMPORTED_MODULE_7__["MAX_TEXTURE_LENGTH"]} x ${_utils_globals__WEBPACK_IMPORTED_MODULE_7__["MAX_TEXTURE_LENGTH"]}.`);
        else if(width < 1 || height < 1)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_6__["IllegalArgumentError"](`Invalid texture size: ${width} x ${height}`);



        /** @type {SpeedyGL} cached reference */
        this._speedyGL = _speedy_gl__WEBPACK_IMPORTED_MODULE_0__["SpeedyGL"].instance;

        /** @type {number} width of the textures */
        this._width = width | 0;

        /** @type {number} height of the textures */
        this._height = height | 0;

        /** @type {SpeedyProgramCenter} GPU-based programs */
        this._programs = new _speedy_program_center__WEBPACK_IMPORTED_MODULE_2__["SpeedyProgramCenter"](this, this._width, this._height);

        /** @type {SpeedyTexturePool} texture pool */
        this._texturePool = new _speedy_texture_pool__WEBPACK_IMPORTED_MODULE_3__["SpeedyTexturePool"](this);

        /** @type {SpeedyTextureUploader} texture uploader */
        this._textureUploader = new _speedy_texture_uploader__WEBPACK_IMPORTED_MODULE_4__["SpeedyTextureUploader"](this);



        // recreate the state if necessary
        this._speedyGL.subscribe(this._reset = this._reset.bind(this));
    }

    /**
     * Access point to all GPU programs
     * @returns {SpeedyProgramCenter}
     */
    get programs()
    {
        return this._programs;
    }

    /**
     * The WebGL Rendering Context
     * Be careful not to cache this, as the WebGL Rendering Context may be lost!
     * @returns {WebGL2RenderingContext}
     */
    get gl()
    {
        return this._speedyGL.gl;
    }

    /**
     * Internal canvas
     * @returns {HTMLCanvasElement}
     */
    get canvas()
    {
        return this._speedyGL.canvas;
    }

    /**
     * Texture pool
     * @returns {SpeedyTexturePool}
     */
    get texturePool()
    {
        return this._texturePool;
    }

    /**
     * Renders a texture to the canvas
     * @param {SpeedyTexture} texture
     * @returns {HTMLCanvasElement} returned for convenience
     */
    renderToCanvas(texture)
    {
        return this.programs.utils.renderToCanvas(texture);
    }

    /**
     * Upload an image to the GPU
     * @param {SpeedyMediaSource} source
     * @param {SpeedyTexture} [outputTexture]
     * @returns {SpeedyTexture} an internal texture if an output texture is not provided
     */
    upload(source, outputTexture = null)
    {
        return this._textureUploader.upload(source, outputTexture);
    }

    /**
     * Releases resources
     * @returns {null}
     */
    release()
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].assert(!this.isReleased());

        // release internal components
        this._programs = this._programs.release();
        this._texturePool = this._texturePool.release();
        this._textureUploader = this._textureUploader.release();

        // unsubscribe
        this._speedyGL.unsubscribe(this._reset);
        return null;
    }

    /**
     * Has this SpeedyGPU been released?
     * @returns {boolean}
     */
    isReleased()
    {
        return this._programs == null;
    }

    /**
     * Lose & restore the WebGL context (useful for testing purposes)
     * @return {SpeedyPromise<void>} resolves as soon as the context is restored
     */
    loseAndRestoreWebGLContext()
    {
        return this._speedyGL.loseAndRestoreContext().then(() => void(0));
    }

    /**
     * Reset the internal state
     * (called on context reset)
     */
    _reset()
    {
        if(this.isReleased())
            return;

        this._programs = new _speedy_program_center__WEBPACK_IMPORTED_MODULE_2__["SpeedyProgramCenter"](this, this._width, this._height);
        this._texturePool = new _speedy_texture_pool__WEBPACK_IMPORTED_MODULE_3__["SpeedyTexturePool"](this);
        this._textureUploader = new _speedy_texture_uploader__WEBPACK_IMPORTED_MODULE_4__["SpeedyTextureUploader"](this);
    }
}

/***/ }),

/***/ "./src/gpu/speedy-program-center.js":
/*!******************************************!*\
  !*** ./src/gpu/speedy-program-center.js ***!
  \******************************************/
/*! exports provided: SpeedyProgramCenter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyProgramCenter", function() { return SpeedyProgramCenter; });
/* harmony import */ var _programs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./programs/utils */ "./src/gpu/programs/utils.js");
/* harmony import */ var _programs_colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./programs/colors */ "./src/gpu/programs/colors.js");
/* harmony import */ var _programs_filters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./programs/filters */ "./src/gpu/programs/filters.js");
/* harmony import */ var _programs_keypoints__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./programs/keypoints */ "./src/gpu/programs/keypoints.js");
/* harmony import */ var _programs_encoders__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./programs/encoders */ "./src/gpu/programs/encoders.js");
/* harmony import */ var _programs_pyramids__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./programs/pyramids */ "./src/gpu/programs/pyramids.js");
/* harmony import */ var _programs_enhancements__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./programs/enhancements */ "./src/gpu/programs/enhancements.js");
/* harmony import */ var _programs_trackers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./programs/trackers */ "./src/gpu/programs/trackers.js");
/* harmony import */ var _programs_transforms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./programs/transforms */ "./src/gpu/programs/transforms.js");
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/globals */ "./src/utils/globals.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
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
 * speedy-program-center.js
 * An access point to all programs that run on the GPU
 */














/**
 * An access point to all programs that run on the CPU
 * All program groups can be accessed via this class
 */
class SpeedyProgramCenter
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu reference to SpeedyGPU
     * @param {number} width default width for output textures
     * @param {number} height default height for output textures
     */
    constructor(gpu, width, height)
    {
        /** @type {SpeedyGPU} reference to SpeedyGPU */
        this._gpu = gpu;

        /** @type {number} default width for output textures */
        this._width = width;

        /** @type {number} default height for output textures */
        this._height = height;

        // program groups
        // (lazy instantiation)
        this._utils = null;
        this._colors = null;
        this._filters = null;
        this._keypoints = null;
        this._encoders = null;
        this._descriptors = null;
        this._enhancements = null;
        this._trackers = null;
        this._transforms = null;
        this._pyramids = (new Array(_utils_globals__WEBPACK_IMPORTED_MODULE_10__["PYRAMID_MAX_LEVELS"])).fill(null);
    }

    /**
     * Default width of the output texture of the programs
     * @returns {number}
     */
    get width()
    {
        return this._width;
    }

    /**
     * Default height of the output texture of the programs
     * @returns {number}
     */
    get height()
    {
        return this._height;
    }

    /**
     * Utility programs
     * @returns {GPUUtils}
     */
    get utils()
    {
        return this._utils || (this._utils = new _programs_utils__WEBPACK_IMPORTED_MODULE_0__["GPUUtils"](this._gpu, this._width, this._height));
    }

    /**
     * Programs related to color conversions
     * @returns {GPUColors}
     */
    get colors()
    {
        return this._colors || (this._colors = new _programs_colors__WEBPACK_IMPORTED_MODULE_1__["GPUColors"](this._gpu, this._width, this._height));
    }

    /**
     * Image filters & convolutions
     * @returns {GPUFilters}
     */
    get filters()
    {
        return this._filters || (this._filters = new _programs_filters__WEBPACK_IMPORTED_MODULE_2__["GPUFilters"](this._gpu, this._width, this._height));
    }

    /**
     * Keypoint detection & description
     * @returns {GPUKeypoints}
     */
    get keypoints()
    {
        return this._keypoints || (this._keypoints = new _programs_keypoints__WEBPACK_IMPORTED_MODULE_3__["GPUKeypoints"](this._gpu, this._width, this._height));
    }

    /**
     * Keypoint encoders
     * @returns {GPUEncoders}
     */
    get encoders()
    {
        return this._encoders || (this._encoders = new _programs_encoders__WEBPACK_IMPORTED_MODULE_4__["GPUEncoders"](this._gpu, this._width, this._height));
    }

    /**
     * Feature trackers
     * @returns {GPUTrackers}
     */
    get trackers()
    {
        return this._trackers || (this._trackers = new _programs_trackers__WEBPACK_IMPORTED_MODULE_7__["GPUTrackers"](this._gpu, this._width, this._height));
    }

    /**
     * Image enhancement algorithms
     * @returns {GPUEnhancements}
     */
    get enhancements()
    {
        return this._enhancements || (this._enhancements = new _programs_enhancements__WEBPACK_IMPORTED_MODULE_6__["GPUEnhancements"](this._gpu, this._width, this._height));
    }

    /**
     * Geometric transformations
     * @returns {GPUTransforms}
     */
    get transforms()
    {
        return this._transforms || (this._transforms = new _programs_transforms__WEBPACK_IMPORTED_MODULE_8__["GPUTransforms"](this._gpu, this._width, this._height));
    }

    /**
     * Image pyramids & scale-space
     * @param {number} [level] level-of-detail: 0, 1, 2, ... (PYRAMID_MAX_LEVELS - 1)
     * @returns {GPUPyramids}
     */
    pyramids(level = 0)
    {
        const lod = level | 0;
        const pot = 1 << lod;

        if(lod < 0 || lod >= _utils_globals__WEBPACK_IMPORTED_MODULE_10__["PYRAMID_MAX_LEVELS"])
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_11__["IllegalArgumentError"](`Invalid pyramid level: ${lod} (outside of range [0,${_utils_globals__WEBPACK_IMPORTED_MODULE_10__["PYRAMID_MAX_LEVELS"]-1}])`);

        // use max(1, floor(size / 2^lod)), in accordance to the OpenGL ES 3.0 spec sec 3.8.10.4 (Mipmapping)
        return this._pyramids[lod] || (this._pyramids[lod] = new _programs_pyramids__WEBPACK_IMPORTED_MODULE_5__["GPUPyramids"](this._gpu,
            Math.max(1, Math.floor(this._width / pot)),
            Math.max(1, Math.floor(this._height / pot))
        ));
    }

    /**
     * Release all programs from all groups. You'll
     * no longer be able to use any of them.
     * @returns {null}
     */
    release()
    {
        for(const key in this) {
            if(Object.prototype.hasOwnProperty.call(this, key)) {
                if(this[key] != null && (this[key] instanceof _speedy_program_group__WEBPACK_IMPORTED_MODULE_9__["SpeedyProgramGroup"]))
                    this[key].release();
            }
        }

        for(let i = 0; i < this._pyramids.length; i++) {
            if(this._pyramids[i] != null)
                this._pyramids[i].release();
        }

        return null;
    }
}

/***/ }),

/***/ "./src/gpu/speedy-program-group.js":
/*!*****************************************!*\
  !*** ./src/gpu/speedy-program-group.js ***!
  \*****************************************/
/*! exports provided: SpeedyProgramGroup */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyProgramGroup", function() { return SpeedyProgramGroup; });
/* harmony import */ var _speedy_program__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-program */ "./src/gpu/speedy-program.js");
/* harmony import */ var _speedy_gpu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-gpu */ "./src/gpu/speedy-gpu.js");
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
 * speedy-program-group.js
 * An abstract group of programs that run on the GPU
 */




/**
 * SpeedyProgramGroup
 * A semantically correlated group
 * of programs that run on the GPU
 * @abstract
 */
class SpeedyProgramGroup
{
    /**
     * Class constructor
     * @protected
     * @param {SpeedyGPU} gpu
     * @param {number} width Texture width (depends on the pyramid layer)
     * @param {number} height Texture height (depends on the pyramid layer)
     */
    constructor(gpu, width, height)
    {
        /** @type {SpeedyGPU} GPU-accelerated routines */
        this._gpu = gpu;

        /** @type {number} width of the output textures of the programs */
        this._width = width;

        /** @type {number} height of the output textures of the programs */
        this._height = height;

        /** @type {object?} helpers for declaring programs */
        this._helpers = null;

        /** @type {SpeedyProgram[]} the list of all programs that belong to this group */
        this._programs = [];
    }

    /**
     * Declare a program
     * @protected
     * @param {string} name Program name
     * @param {ShaderDeclaration} shaderdecl Shader declaration
     * @param {object} settings Program settings
     * @returns {SpeedyProgramGroup} This object
     */
    declare(name, shaderdecl, settings = {})
    {
        // lazy instantiation of kernels
        Object.defineProperty(this, name, {
            get: (() => {
                const key = '__k_' + name;
                return (function() {
                    return this[key] || (this[key] = this._createProgram(shaderdecl, settings));
                }).bind(this);
            })()
        });

        return this;
    }

    /**
     * Multi-pass composition
     * @protected
     * @param {string} name Program name
     * @param {string} fn Other programs
     * @returns {SpeedyProgramGroup} This object
     */
    compose(name, ...fn)
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
     * Neat helpers to be used when declaring programs
     * @returns {object}
     */
    get program()
    {
        return this._helpers || (this.helpers = {

            // Set texture input/output size
            // Dimensions are converted to integers
            hasTextureSize(width, height) {
                return {
                    output: [ Math.max(1, width | 0), Math.max(1, height | 0) ]
                };
            },

            // Render to canvas
            // Use it when we're supposed to see the texture
            rendersToCanvas() {
                return {
                    renderToTexture: false
                };
            },

            // Pingpong Rendering: the output texture of a
            // program cannot be used as an input to itself.
            // This is a convenient helper in these situations
            usesPingpongRendering() {
                return {
                    pingpong: true
                };
            },

        });
    }

    /**
     * Releases all programs from this group
     * @returns {null}
     */
    release()
    {
        for(let i = 0; i < this._programs.length; i++)
            this._programs[i].release();

        return null;
    }

    /**
     * Spawn a SpeedyProgram
     * @param {ShaderDeclaration} shaderdecl Shader declaration
     * @param {object} [settings] Program settings
     * @returns {SpeedyProgram}
     */
    _createProgram(shaderdecl, settings = {})
    {
        const program = new _speedy_program__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgram"](this._gpu.gl, shaderdecl, {
            output: [ this._width, this._height ], // default settings
            ...settings
        });

        this._programs.push(program);
        return program;
    }
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
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
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
 * speedy-program.js
 * SpeedyProgram class
 */







// Map uniform type to a gl function
const UNIFORM_SETTERS = Object.freeze({
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
    'mat2':     'uniformMatrix2fv',
    'mat3':     'uniformMatrix3fv',
    'mat4':     'uniformMatrix4fv',
});



/**
 * A SpeedyProgram is a Function that
 * runs GPU-accelerated GLSL code
 */
class SpeedyProgram extends Function
{
    /**
     * Creates a new SpeedyProgram
     * @param {WebGL2RenderingContext} gl WebGL context
     * @param {ShaderDeclaration} shaderdecl Shader declaration
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
     * Initialize the SpeedyProgram
     * @param {WebGL2RenderingContext} gl WebGL context
     * @param {ShaderDeclaration} shaderdecl Shader declaration
     * @param {object} options user options
     */
    _init(gl, shaderdecl, options)
    {
        // not a valid context?
        if(gl.isContextLost())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalOperationError"](`Can't initialize SpeedyProgram: lost context`);

        // options object
        options = Object.assign({
            // default options
            output: [ 1, 1 ], // size of the output texture
            renderToTexture: true, // render results to a texture?
            pingpong: false, // alternate output texture between calls
        }, options);



        /** @type {WebGL2RenderingContext} */
        this._gl = gl;

        /** @type {WebGLProgram} vertex shader + fragment shader */
        this._program = SpeedyProgram._compile(gl, shaderdecl.vertexSource, shaderdecl.fragmentSource);

        /** @type {ProgramGeometry} this is a quad */
        this._geometry = new ProgramGeometry(gl, {
            position: shaderdecl.locationOfAttributes.position,
            texCoord: shaderdecl.locationOfAttributes.texCoord
        });

        /** @type {string[]} names of the arguments of the SpeedyProgram */
        this._argnames = shaderdecl.arguments;

        /** @type {boolean[]} tells whether the i-th argument of the SpeedyProgram is an array or not */
        this._argIsArray = (new Array(this._argnames.length)).fill(false);

        /** @type {UBOHelper} UBO helper (lazy instantiation) */
        this._ubo = null;

        /** @type {boolean} should we render to a texture? If false, we render to the canvas */
        this._renderToTexture = Boolean(options.renderToTexture);

        /** @type {number} width of the output texture, in pixels */
        this._width = options.output[0] | 0;

        /** @type {number} height of the output texture, in pixels */
        this._height = options.output[1] | 0;

        /** @type {SpeedyDrawableTexture[]} internal texture(s) */
        this._ownTexture = Array.from({ length: options.pingpong ? 2 : 1 },
            () => new _speedy_texture__WEBPACK_IMPORTED_MODULE_0__["SpeedyDrawableTexture"](gl, this._width, this._height));

        /** @type {SpeedyDrawableTexture[]} output texture(s) */
        this._texture = [].concat(this._ownTexture);

        /** @type {number} used for pingpong rendering */
        this._textureIndex = 0;

        /** @type {Map<string,UniformVariable>} uniform variables */
        this._uniform = new Map();


        // autodetect uniforms
        gl.useProgram(this._program);
        for(const name of shaderdecl.uniforms) {
            const type = shaderdecl.uniformType(name);
            const location = gl.getUniformLocation(this._program, name);
            this._uniform.set(name, new UniformVariable(type, location));
        }

        // match arguments & uniforms
        for(let j = 0; j < this._argnames.length; j++) {
            const argname = this._argnames[j];
            if(!this._uniform.has(argname)) {
                this._argIsArray[j] = this._uniform.has(argname + '[0]');
                if(!this._argIsArray[j])
                    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalOperationError"](`Expected uniform "${argname}", as declared in the argument list`);
            }
        }
    }

    /**
     * Run the SpeedyProgram
     * @param  {...(number|number[]|SpeedyTexture|SpeedyTexture[])} args
     * @returns {SpeedyDrawableTexture}
     */
    _call(...args)
    {
        const gl = this._gl;
        const argnames = this._argnames;

        // matching arguments?
        if(args.length != argnames.length)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Can't run shader: incorrect number of arguments (expected ${argnames.length}, got ${args.length})`);

        // can't use the output texture as an input
        const flatArgs = args.flat(); // args.reduce((arr, val) => arr.concat(val), []);
        for(let j = flatArgs.length - 1; j >= 0; j--) {
            if(flatArgs[j] === this._texture[this._textureIndex])
                throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["NotSupportedError"](`Can't run shader: don't use its output texture as an input to itself. Consider using pingpong rendering!`);
        }

        // context loss?
        if(gl.isContextLost())
            return this._texture[this._textureIndex];

        // use program
        gl.useProgram(this._program);

        // bind the VAO
        gl.bindVertexArray(this._geometry.vao);

        // update texSize uniform (available in all fragment shaders)
        const texSize = this._uniform.get('texSize');
        gl.uniform2f(texSize.location, this.width, this.height);

        // set uniforms[i] to args[i]
        for(let i = 0, texNo = 0; i < args.length; i++) {
            const argname = argnames[i];

            if(!this._argIsArray[i]) {
                // uniform variable matches argument name
                const uniform = this._uniform.get(argname);
                texNo = uniform.setValue(gl, args[i], texNo);
            }
            else {
                // uniform array matches argument name
                const array = args[i];
                if(this._uniform.has(`${argname}[${array.length}]`))
                    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Can't run shader: too few elements in the "${argname}" array`);
                for(let j = 0, uniform = undefined; (uniform = this._uniform.get(`${argname}[${j}]`)) !== undefined; j++)
                    texNo = uniform.setValue(gl, array[j], texNo);
            }
        }

        // set Uniform Buffer Objects (if any)
        if(this._ubo !== null)
            this._ubo.update();

        // select the render target
        const texture = this._texture[this._textureIndex];
        const fbo = this._renderToTexture ? texture.glFbo : null;

        // bind the FBO
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

        // draw call
        gl.viewport(0, 0, this.width, this.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6); // mode, offset, count

        // unbind the FBO
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // unbind the VAO
        gl.bindVertexArray(null);

        // we've just changed the texture! discard the pyramid, if any
        texture.discardMipmaps();

        // ping-pong rendering
        this._pingpong();

        // done!
        return texture;
    }

    /**
     * Set the output texture(s) and its (their) shape(s)
     * @param {number} width new width, in pixels
     * @param {number} height new height, in pixels
     * @param  {...SpeedyDrawableTexture} texture output texture(s)
     * @returns {SpeedyProgram} this
     */
    outputs(width, height, ...texture)
    {
        this.setOutputTexture(...texture);
        this.setOutputSize(width, height);
        return this;
    }

    /**
     * Set the size of the output
     * @param {number} width new width, in pixels
     * @param {number} height new height, in pixels
     * @returns {SpeedyProgram} this
     */
    setOutputSize(width, height)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(width > 0 && height > 0);

        // update size
        this._width = width | 0;
        this._height = height | 0;

        // resize the output texture(s)
        for(let i = 0; i < this._texture.length; i++) {
            if(this._texture[i] != null)
                this._texture[i].resize(this._width, this._height);
        }

        // done!
        return this;
    }

    /**
     * Use the provided texture(s) as output
     * @param {...SpeedyDrawableTextur} texture set to null to use the internal texture(s)
     * @returns {SpeedyProgram} this
     */
    setOutputTexture(...texture)
    {
        const expectedTextures = this._texture.length;
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(texture.length === expectedTextures, `Incorrect number of textures (expected ${expectedTextures})`);

        // we need to keep the current size
        const width = this.width;
        const height = this.height;

        // update output texture(s)
        const useInternal = texture.every(tex => tex === null);
        this._texture = !useInternal ? [].concat(texture) : this._ownTexture;
        this._textureIndex = 0;

        // restore previous size
        this.setOutputSize(width, height);

        // done!
        return this;
    }

    /**
     * Clear the internal textures
     * @returns {SpeedyDrawableTexture}
     */
    clear()
    {
        const texture = this._texture[this._textureIndex];

        // clear internal textures
        for(let i = 0; i < this._texture.length; i++)
            this._texture[i].clear();

        // ping-pong rendering
        this._pingpong();

        // done!
        return texture;
    }

    /**
     * Set data using a Uniform Buffer Object
     * @param {string} blockName uniform block name
     * @param {ArrayBufferView} data
     */
    setUBO(blockName, data)
    {
        if(this._ubo === null)
            this._ubo = new UBOHelper(this._gl, this._program);

        this._ubo.set(blockName, data);
    }

    /**
     * Release the resources associated with this SpeedyProgram
     * @returns {null}
     */
    release()
    {
        const gl = this._gl;

        // Release UBOs (if any)
        if(this._ubo != null)
            this._ubo = this._ubo.release();

        // Release internal textures
        for(let i = 0; i < this._ownTexture.length; i++)
            this._ownTexture[i] = this._ownTexture[i].release();
        this._texture.fill(null);

        // Release geometry
        this._geometry = this._geometry.release();

        // Release program
        gl.deleteProgram(this._program);
        this._program = null;

        // Need to delete the shaders as well? In sec 5.14.9 Programs and shaders
        // of the WebGL 1.0 spec, it is mentioned that the underlying GL object
        // will automatically be marked for deletion when the JS object is
        // destroyed (i.e., garbage collected)

        // done!
        return null;
    }

    /**
     * Width of the output texture, in pixels
     * @returns {number}
     */
    get width()
    {
        return this._width;
    }

    /**
     * Height of the output texture, in pixels
     * @returns {number}
     */
    get height()
    {
        return this._height;
    }

    /**
     * Helper method for pingpong rendering: alternates
     * the texture index from 0 to 1 and vice-versa
     */
    _pingpong()
    {
        if(this._texture.length > 1)
            this._textureIndex = 1 - this._textureIndex;
    }

    /**
     * Compile and link GLSL shaders
     * @param {WebGL2RenderingContext} gl
     * @param {string} vertexShaderSource GLSL code of the vertex shader
     * @param {string} fragmentShaderSource GLSL code of the fragment shader
     * @returns {WebGLProgram}
     */
    static _compile(gl, vertexShaderSource, fragmentShaderSource)
    {
        const program = gl.createProgram();
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        // compile vertex shader
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);
        gl.attachShader(program, vertexShader);

        // compile fragment shader
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);
        gl.attachShader(program, fragmentShader);

        // link program
        gl.linkProgram(program);
        gl.validateProgram(program);

        // got an error?
        if(!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
            const errors = [
                gl.getShaderInfoLog(fragmentShader),
                gl.getShaderInfoLog(vertexShader),
                gl.getProgramInfoLog(program),
            ];

            gl.deleteProgram(program);
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);

            // display error
            const spaces = i => Math.max(0, 2 - Math.floor(Math.log10(i)));
            const col = k => Array(spaces(k)).fill(' ').join('') + k + '. ';
            const formattedSource = fragmentShaderSource.split('\n')
                .map((line, no) => col(1+no) + line)
                .join('\n');

            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["GLError"](
                `Can't create shader.\n\n` +
                `---------- ERROR ----------\n` +
                errors.join('\n') + '\n\n' +
                `---------- SOURCE CODE ----------\n` +
                formattedSource
            );
        }

        // done!
        return program;
    }
}





// ============================================================================
//                                  HELPERS
// ============================================================================






/**
 * Configure and store the VAO and the VBOs
 * @param {WebGL2RenderingContext} gl
 * @param {LocationOfAttributes} location
 * @returns {ProgramGeometry}
 *
 * @typedef {Object} LocationOfAttributes
 * @property {number} position
 * @property {number} texCoord
 *
 * @typedef {Object} BufferOfAttributes
 * @property {WebGLBuffer} position
 * @property {WebGLBuffer} texCoord
 */
function ProgramGeometry(gl, location)
{
    /** @type {WebGLVertexArrayObject} Vertex Array Object */
    this.vao = gl.createVertexArray();

    /** @type {BufferOfAttributes} Vertex Buffer Objects */
    this.vbo = Object.freeze({
        position: gl.createBuffer(),
        texCoord: gl.createBuffer()
    });

    /** @type {WebGL2RenderingContext} */
    this._gl = gl;



    // bind the VAO
    gl.bindVertexArray(this.vao);

    // set the position attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo.position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        // clip coordinates (CCW)
        -1, -1,
        1, -1,
        -1, 1,

        -1, 1,
        1, -1,
        1, 1,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location.position);
    gl.vertexAttribPointer(location.position, // attribute location
                            2,                // 2 components per vertex (x,y)
                            gl.FLOAT,         // type
                            false,            // don't normalize
                            0,                // default stride (tightly packed)
                            0);               // offset

    // set the texCoord attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo.texCoord);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        // texture coordinates (CCW)
        0, 0,
        1, 0,
        0, 1,

        0, 1,
        1, 0,
        1, 1,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location.texCoord);
    gl.vertexAttribPointer(location.texCoord, // attribute location
                            2,                // 2 components per vertex (x,y)
                            gl.FLOAT,         // type
                            false,            // don't normalize
                            0,                // default stride (tightly packed)
                            0);               // offset

    // unbind
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    // done!
    return Object.freeze(this);
}

/**
 * Releases the internal resources
 * @returns {null}
 */
ProgramGeometry.prototype.release = function()
{
    const gl = this._gl;

    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.vbo.position);
    gl.deleteBuffer(this.vbo.texCoord);

    return null;
}





/**
 * Helper class for storing data in GLSL uniform variables
 * @param {string} type
 * @param {WebGLUniformLocation} location
 */
function UniformVariable(type, location)
{
    /** @type {string} GLSL data type */
    this.type = String(type);
    if(!Object.prototype.hasOwnProperty.call(UNIFORM_SETTERS, this.type))
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["NotSupportedError"](`Unsupported uniform type: ${this.type}`);

    /** @type {WebGLUniformLocation} uniform location in a WebGL program */
    this.location = location;

    /** @type {string} setter function */
    this.setter = UNIFORM_SETTERS[this.type];
    const n = Number((this.setter.match(/^uniform(Matrix)?(\d)/))[2]) | 0;

    /** @type {number} is the uniform a scalar (0), a vector (1) or a matrix (2)? */
    this.dim = this.type.startsWith('mat') ? 2 : ((this.type.indexOf('vec') >= 0) | 0);

    /** @type {number} required number of scalars */
    this.length = (this.dim == 2) ? n * n : n;

    // done!
    return Object.freeze(this);
}

/**
 * Set the value of a uniform variable
 * @param {WebGL2RenderingContext} gl
 * @param {SpeedyTexture|number|boolean|number[]|boolean[]} value use column-major format for matrices
 * @param {number} texNo current texture index
 * @returns {number} new texture index
 */
UniformVariable.prototype.setValue = function(gl, value, texNo)
{
    const setValue = gl[this.setter];

    // check uniform type
    if(this.type == 'sampler2D') {
        // set texture
        if(texNo > gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["NotSupportedError"](`Can't bind ${texNo} textures to a program: max is ${gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS}`);
        else if(value == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Can't run shader: cannot use null as an input texture`);

        gl.activeTexture(gl.TEXTURE0 + texNo);
        gl.bindTexture(gl.TEXTURE_2D, value.glTexture);
        gl.uniform1i(this.location, texNo);
        texNo++;
    }
    else if(typeof value == 'number' || typeof value == 'boolean') {
        // set scalar value
        setValue.call(gl, this.location, value);
    }
    else if(Array.isArray(value)) {
        // set vector or matrix
        if(value.length === this.length) {
            if(this.dim == 2)
                setValue.call(gl, this.location, false, value); // matrix
            else
                setValue.call(gl, this.location, ...value); // vector
        }
        else
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Can't run shader: incorrect number of values for ${this.type}: "${value}"`);
    }
    else
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Can't run shader: unrecognized argument "${value}"`);

    // done
    return texNo;
}






/**
 * A helper class for handling Uniform Buffer Objects (UBOs)
 * @param {WebGL2RenderingContext} gl
 * @param {WebGLProgram} program
 */
function UBOHelper(gl, program)
{
    this._gl = gl;
    this._program = program;
    this._nextIndex = 0;
    this._ubo = Object.create(null);
}

/**
 * Set Uniform Buffer Object data
 * (the buffer will be uploaded when the program is executed)
 * @param {string} name uniform block name
 * @param {ArrayBufferView} data
 */
UBOHelper.prototype.set = function(name, data)
{
    const gl = this._gl;

    // create UBO entry
    if(this._ubo[name] === undefined) {
        this._ubo[name] = {
            buffer: gl.createBuffer(),
            blockBindingIndex: this._nextIndex++, // "global" binding index
            blockIndex: null, // UBO "location" in the program
            data: null
        };
    }

    // get UBO entry for the given block name
    const ubo = this._ubo[name];

    // read block index & assign binding point
    if(ubo.blockIndex === null) {
        const blockIndex = gl.getUniformBlockIndex(this._program, name);
        gl.uniformBlockBinding(this._program, blockIndex, ubo.blockBindingIndex);
        ubo.blockIndex = blockIndex;
    }

    // store the data - we'll upload it later
    ubo.data = data;
}

/**
 * Update UBO data
 * Called when we're using the appropriate WebGLProgram
 */
UBOHelper.prototype.update = function()
{
    const gl = this._gl;

    for(const name in this._ubo) {
        const ubo = this._ubo[name];

        gl.bindBuffer(gl.UNIFORM_BUFFER, ubo.buffer);
        gl.bufferData(gl.UNIFORM_BUFFER, ubo.data.byteLength, gl.DYNAMIC_DRAW); // buffer orphaning - needed?
        gl.bufferData(gl.UNIFORM_BUFFER, ubo.data, gl.DYNAMIC_DRAW);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, ubo.blockBindingIndex, ubo.buffer);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }
}

/**
 * Release allocated buffers
 * @returns {null}
 */
UBOHelper.prototype.release = function()
{
    const gl = this._gl;

    for(const name in this._ubo) {
        const ubo = this._ubo[name];

        gl.deleteBuffer(ubo.buffer);
        ubo.data = null;
    }

    return null;
}

/***/ }),

/***/ "./src/gpu/speedy-texture-pool.js":
/*!****************************************!*\
  !*** ./src/gpu/speedy-texture-pool.js ***!
  \****************************************/
/*! exports provided: SpeedyTexturePool */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyTexturePool", function() { return SpeedyTexturePool; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _speedy_gpu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * speedy-texture-pool.js
 * Texture pool
 */






// Constants
const DEFAULT_CAPACITY = 64;
const BUCKET = Symbol('Bucket');


/*

=== Heuristics to figure out the capacity of a texture pool ===

1. Decide the maximum amount of VRAM you'd like to use in a pool (say, 64 MB).

2. Figure out the average texture size in your application (say, 640x360 pixels).

3. Figure out the average texture size in bytes (say, 921600 bytes). Each pixel
   uses 4 bytes (RGBA format).

4. Divide the maximum amount of VRAM by the average texture size in bytes
   (say, 72). That's the capacity of the pool.

Note that textures are allocated lazily, so VRAM usage is kept to a minimum.

Adapted from: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices

*/



/**
 * @typedef {number} TextureBucketIndex index of a bucket in a pool
 */



/**
 * A bucket
 */
class TextureBucket
{
    /**
     * Constructor
     * @param {SpeedyDrawableTexture} texture managed texture
     * @param {TextureBucketIndex} index index of this bucket
     * @param {TextureBucketIndex} next index of the next bucket
     */
    constructor(texture, index, next)
    {
        /** @type {SpeedyDrawableTexture} managed texture */
        this.texture = texture;

        /** @type {TextureBucketIndex} index of this bucket */
        this.index = index;

        /** @type {TextureBucketIndex} index of the next bucket */
        this.next = next;

        /** @type {boolean} whether the texture is available or not */
        this.free = true;
    }
}



/**
 * Texture pool
 */
class SpeedyTexturePool
{
    /**
     * Constructor
     * @param {SpeedyGPU} gpu
     * @param {number} [capacity] number of textures in the pool
     */
    constructor(gpu, capacity = DEFAULT_CAPACITY)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(capacity > 0);

        /** @type {TextureBucket[]} buckets */
        this._bucket = Array.from({ length: capacity }, (_, i) => new TextureBucket(null, i, i - 1));

        /** @type {TextureBucketIndex} index of an available bucket */
        this._head = capacity - 1;

        /** @type {SpeedyGPU} GPU instance */
        this._gpu = gpu;
    }

    /**
     * Get a texture from the pool
     * @returns {SpeedyDrawableTexture}
     */
    allocate()
    {
        if(this._head < 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["OutOfMemoryError"](`Exhausted pool (capacity: ${this._bucket.length})`);

        const bucket = this._bucket[this._head];
        bucket.free = false;
        this._head = bucket.next;

        if(bucket.texture == null) // lazy instantiation
            bucket.texture = SpeedyTexturePool._createManagedTexture(this._gpu.gl, bucket);

        return bucket.texture;
    }

    /**
     * Put a texture back in the pool
     * @param {SpeedyDrawableTexture} texture
     * @returns {null}
     */
    free(texture)
    {
        const bucket = texture[BUCKET];
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(bucket !== undefined && !bucket.free, `Unmanaged texture or double free`);

        bucket.next = this._head;
        bucket.free = true;
        this._head = bucket.index;

        return null;
    }

    /**
     * Release the texture pool
     * @returns {null}
     */
    release()
    {
        for(let i = 0; i < this._bucket.length; i++) {
            if(this._bucket[i].texture != null)
                this._bucket[i].texture = this._bucket[i].texture.release();
        }

        return null;
    }

    /**
     * Create a texture with a reference to a bucket
     * @param {WebGL2RenderingContext} gl
     * @param {TextureBucket} bucket
     * @returns {SpeedyDrawableTexture}
     */
    static _createManagedTexture(gl, bucket)
    {
        const texture = new _speedy_texture__WEBPACK_IMPORTED_MODULE_2__["SpeedyDrawableTexture"](gl, 1, 1);
        return Object.defineProperty(texture, BUCKET, {
            configurable: false,
            enumerable: false,
            writable: false,
            value: bucket
        });
    }
}

/***/ }),

/***/ "./src/gpu/speedy-texture-reader.js":
/*!******************************************!*\
  !*** ./src/gpu/speedy-texture-reader.js ***!
  \******************************************/
/*! exports provided: SpeedyTextureReader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyTextureReader", function() { return SpeedyTextureReader; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _gl_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gl-utils */ "./src/gpu/gl-utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
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
 * speedy-texture-reader.js
 * Reads data from textures
 */







// number of pixel buffer objects
// used to get a performance boost in gl.readPixels()
// (1 seems to perform better on mobile, 2 on the PC?)
const DEFAULT_NUMBER_OF_BUFFERS = 1; //2;


/**
 * Reads data from textures
 */
class SpeedyTextureReader
{
    /**
     * Constructor
     * @param {number} [numberOfBuffers]
     */
    constructor(numberOfBuffers = DEFAULT_NUMBER_OF_BUFFERS)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(numberOfBuffers > 0);

        /** @type {Uint8Array[]} pixel buffers for data transfers (each stores RGBA data) */
        this._pixelBuffer = (new Array(numberOfBuffers)).fill(null).map(() => new Uint8Array(0));

        /** @type {number[]} for async data transfers (stores buffer indices) */
        this._consumerQueue = (new Array(numberOfBuffers)).fill(0).map((_, i) => i);

        /** @type {number[]} for async data transfers (stores buffer indices) */
        this._producerQueue = [];
    }

    /**
     * Read pixels from a texture, synchronously.
     * You may optionally specify a (x,y,width,height) sub-rectangle.
     * @param {SpeedyDrawableTexture} texture a texture with a FBO
     * @param {number} [x]
     * @param {number} [y] 
     * @param {number} [width]
     * @param {number} [height]
     * @returns {Uint8Array} pixels in the RGBA format
     */
    readPixelsSync(texture, x = 0, y = 0, width = texture.width, height = texture.height)
    {
        const gl = texture.gl;
        const fbo = texture.glFbo;

        // clamp values
        width = Math.max(0, Math.min(width, texture.width));
        height = Math.max(0, Math.min(height, texture.height));
        x = Math.max(0, Math.min(x, texture.width - width));
        y = Math.max(0, Math.min(y, texture.height - height));

        // buffer allocation
        const sizeofBuffer = width * height * 4; // 4 bytes per pixel (RGBA)
        this._reallocate(sizeofBuffer);

        // lost context?
        if(gl.isContextLost())
            return this._pixelBuffer[0].subarray(0, sizeofBuffer);

        // read pixels
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, this._pixelBuffer[0]);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // done!
        return this._pixelBuffer[0].subarray(0, sizeofBuffer);
    }

    /**
     * Read pixels from a texture, asynchronously, with PBOs.
     * You may optionally specify a (x,y,width,height) sub-rectangle.
     * @param {SpeedyDrawableTexture} texture a texture with a FBO
     * @param {boolean} [useBufferedDownloads] accelerate downloads by returning pixels from the texture of the previous call (useful for streaming)
     * @param {number} [x]
     * @param {number} [y] 
     * @param {number} [width]
     * @param {number} [height]
     * @returns {SpeedyPromise<Uint8Array>} resolves to an array of pixels in the RGBA format
     */
    readPixelsAsync(texture, useBufferedDownloads = false, x = 0, y = 0, width = texture.width, height = texture.height)
    {
        const gl = texture.gl;
        const fbo = texture.glFbo;

        // clamp values
        width = Math.max(0, Math.min(width, texture.width));
        height = Math.max(0, Math.min(height, texture.height));
        x = Math.max(0, Math.min(x, texture.width - width));
        y = Math.max(0, Math.min(y, texture.height - height));

        // buffer allocation
        const sizeofBuffer = width * height * 4; // 4 bytes per pixel (RGBA)
        this._reallocate(sizeofBuffer);

        // lost context?
        if(gl.isContextLost())
            return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__["SpeedyPromise"].resolve(this._pixelBuffer[0].subarray(0, sizeofBuffer));

        // do not optimize?
        if(!useBufferedDownloads) {
            return SpeedyTextureReader._readPixelsViaPBO(gl, this._pixelBuffer[0], fbo, x, y, width, height).then(() =>
                this._pixelBuffer[0].subarray(0, sizeofBuffer)
            );
        }

        // GPU needs to produce data
        if(this._producerQueue.length > 0) {
            const nextBufferIndex = this._producerQueue.shift();
            SpeedyTextureReader._readPixelsViaPBO(gl, this._pixelBuffer[nextBufferIndex], fbo, x, y, width, height).then(() => {
                this._consumerQueue.push(nextBufferIndex);
            });
        }
        else this._waitForQueueNotEmpty(this._producerQueue).then(() => {
            const nextBufferIndex = this._producerQueue.shift();
            SpeedyTextureReader._readPixelsViaPBO(gl, this._pixelBuffer[nextBufferIndex], fbo, x, y, width, height).then(() => {
                this._consumerQueue.push(nextBufferIndex);
            });
        }).turbocharge();

        // CPU needs to consume data
        if(this._consumerQueue.length > 0) {
            const readyBufferIndex = this._consumerQueue.shift();
            return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__["SpeedyPromise"](resolve => {
                resolve(this._pixelBuffer[readyBufferIndex].subarray(0, sizeofBuffer));
                this._producerQueue.push(readyBufferIndex); // enqueue AFTER resolve()
            });
        }
        else return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__["SpeedyPromise"](resolve => {
            this._waitForQueueNotEmpty(this._consumerQueue).then(() => {
                const readyBufferIndex = this._consumerQueue.shift();
                resolve(this._pixelBuffer[readyBufferIndex].subarray(0, sizeofBuffer));
                this._producerQueue.push(readyBufferIndex); // enqueue AFTER resolve()
            }).turbocharge();
        });
    }

    /**
     * Reallocate the pixel buffers, so that they can hold the required number of bytes
     * If the pixel buffers already have the required capacity, then nothing is done
     * @param {number} size in bytes
     */
    _reallocate(size)
    {
        // no need to reallocate
        if(size <= this._pixelBuffer[0].byteLength)
            return;

        // reallocate
        for(let i = 0; i < this._pixelBuffer.length; i++) {
            const newBuffer = new Uint8Array(size);
            newBuffer.set(this._pixelBuffer[i]); // make this optional?
            this._pixelBuffer[i] = newBuffer;
        }
    }

    /**
     * Wait for a queue to be not empty
     * @param {Array} queue
     * @returns {SpeedyPromise<void>}
     */
    _waitForQueueNotEmpty(queue)
    {
        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__["SpeedyPromise"](resolve => {
            (function wait() {
                if(queue.length > 0)
                    resolve();
                else
                    setTimeout(wait, 0); // Utils.setZeroTimeout may hinder performance (GLUtils already calls it)
                    //Utils.setZeroTimeout(wait);
            })();
        });
    }

    /**
     * Read pixels to a Uint8Array, asynchronously, using a Pixel Buffer Object (PBO)
     * It's assumed that the target texture is in the RGBA8 format
     * @param {WebGL2RenderingContext} gl
     * @param {Uint8Array} outputBuffer with size >= width * height * 4
     * @param {WebGLFramebuffer} fbo
     * @param {GLint} x
     * @param {GLint} y
     * @param {GLsizei} width
     * @param {GLsizei} height
     * @returns {SpeedyPromise}
     */
    static _readPixelsViaPBO(gl, outputBuffer, fbo, x, y, width, height)
    {
        // create temp buffer
        const pbo = gl.createBuffer();

        // validate outputBuffer
        if(!(outputBuffer.byteLength >= width * height * 4))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalArgumentError"](`Can't read pixels: invalid buffer size`);

        // bind the PBO
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, pbo);
        gl.bufferData(gl.PIXEL_PACK_BUFFER, outputBuffer.byteLength, gl.STREAM_READ);

        // read pixels into the PBO
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // unbind the PBO
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);

        // wait for DMA transfer
        return _gl_utils__WEBPACK_IMPORTED_MODULE_1__["GLUtils"].getBufferSubDataAsync(gl, pbo,
            gl.PIXEL_PACK_BUFFER,
            0,
            outputBuffer,
            0,
            0
        ).catch(err => {
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__["IllegalOperationError"](`Can't read pixels`, err);
        }).finally(() => {
            gl.deleteBuffer(pbo);
        });
    }
}

/***/ }),

/***/ "./src/gpu/speedy-texture-uploader.js":
/*!********************************************!*\
  !*** ./src/gpu/speedy-texture-uploader.js ***!
  \********************************************/
/*! exports provided: SpeedyTextureUploader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyTextureUploader", function() { return SpeedyTextureUploader; });
/* harmony import */ var _speedy_gpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _core_speedy_media_source__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/speedy-media-source */ "./src/core/speedy-media-source.js");
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
 * speedy-texture-uploader.js
 * A utility that helps uploading data to textures
 */





// Constants
const UPLOAD_BUFFER_SIZE = 2; // how many textures we allocate for uploading data

/**
 * A utility that helps uploading data to textures
 */
class SpeedyTextureUploader
{
    /**
     * Constructor
     * @param {SpeedyGPU} gpu
     */
    constructor(gpu)
    {
        /** @type {SpeedyGPU} GPU instance */
        this._gpu = gpu;

        /** @type {SpeedyTexture[]} upload textures (lazy instantiation) */
        this._texture = (new Array(UPLOAD_BUFFER_SIZE)).fill(null);

        /** @type {number} index of the texture that was just uploaded to the GPU */
        this._textureIndex = 0;
    }

    /**
     * Upload an image to the GPU
     * @param {SpeedyMediaSource} source
     * @param {SpeedyTexture} [outputTexture]
     * @returns {SpeedyTexture} an internal texture if an output texture is not provided
     */
    upload(source, outputTexture = null)
    {
        const gl = this._gpu.gl;
        const data = source.data;

        // create upload textures lazily
        if(outputTexture == null && this._texture[0] == null) {
            for(let i = 0; i < this._texture.length; i++)
                this._texture[i] = new _speedy_texture__WEBPACK_IMPORTED_MODULE_1__["SpeedyTexture"](gl, source.width, source.height);
        }

        // bugfix: if the media is a video, we can't really
        // upload it to the GPU unless it's ready
        if(data.constructor.name == 'HTMLVideoElement') {
            if(data.readyState < 2) {
                // this may happen when the video loops (Firefox)
                // return the previously uploaded texture
                //Utils.warning(`Trying to process a video that isn't ready yet`);
                return outputTexture || this._texture[this._textureIndex];
            }
        }

        // upload to the output texture, if one is provided
        if(outputTexture != null)
            return outputTexture.upload(data, source.width, source.height);

        // use round-robin to mitigate WebGL's implicit synchronization
        // and maybe minimize texture upload times
        this._textureIndex = (this._textureIndex + 1) % UPLOAD_BUFFER_SIZE;

        // upload to an internal texture
        return this._texture[this._textureIndex].upload(data, source.width, source.height);
    }

    /**
     * Release the texture uploader
     * @returns {null}
     */
    release()
    {
        for(let i = 0; i < this._texture.length; i++) {
            if(this._texture[i] != null)
                this._texture[i] = this._texture[i].release();
        }

        return null;
    }
}

/***/ }),

/***/ "./src/gpu/speedy-texture.js":
/*!***********************************!*\
  !*** ./src/gpu/speedy-texture.js ***!
  \***********************************/
/*! exports provided: SpeedyTexture, SpeedyDrawableTexture */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyTexture", function() { return SpeedyTexture; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyDrawableTexture", function() { return SpeedyDrawableTexture; });
/* harmony import */ var _speedy_gpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/globals */ "./src/utils/globals.js");
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
 * speedy-texture.js
 * A wrapper around WebGLTexture
 */






/**
 * A wrapper around WebGLTexture
 */
class SpeedyTexture
{
    /**
     * Constructor
     * @param {WebGL2RenderingContext} gl
     * @param {number} width texture width in pixels
     * @param {number} height texture height in pixels
     */
    constructor(gl, width, height)
    {
        /** @type {WebGL2RenderingContext} */
        this._gl = gl;

        /** @type {number} width of the texture */
        this._width = Math.max(1, width | 0);

        /** @type {number} height of the texture */
        this._height = Math.max(1, height | 0);

        /** @type {WebGLTexture} internal texture object */
        this._glTexture = SpeedyTexture._createTexture(this._gl, this._width, this._height);

        /** @type {boolean} have we generated mipmaps for this texture? */
        this._hasMipmaps = false;
    }

    /**
     * Releases the texture
     * @returns {null}
     */
    release()
    {
        const gl = this._gl;

        // already released?
        if(this._glTexture == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`The SpeedyTexture has already been released`);

        // release resources
        this.discardMipmaps();
        gl.deleteTexture(this._glTexture);
        this._glTexture = null;
        this._width = this._height = 0;

        // done!
        return null;
    }

    /**
     * Upload pixel data to the texture. The texture will be resized if needed.
     * @param {number} [width] in pixels
     * @param {number} [height] in pixels
     * @param {ImageBitmap|ImageData|ArrayBufferView|HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} pixels 
     * @return {SpeedyTexture} this
     */
    upload(pixels, width = this._width, height = this._height)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(width > 0 && height > 0);

        this.discardMipmaps();
        this._width = width;
        this._height = height;

        SpeedyTexture._upload(this._gl, this._glTexture, width, height, pixels, 0);
        return this;
    }

    /**
     * Generates an image pyramid
     * @param {SpeedyGPU} gpu
     * @param {boolean} [gaussian] should we compute a Gaussian pyramid? Recommended!
     * @returns {SpeedyTexture} this
     */
    generateMipmaps(gpu, gaussian = true)
    {
        // nothing to do
        if(this._hasMipmaps)
            return this;

        // let the hardware compute the all levels of the pyramid, up to 1x1
        // this might be a simple box filter...
        SpeedyTexture._generateDefaultMipmaps(this._gl, this._glTexture);
        this._hasMipmaps = true;

        // compute a few layers of a Gaussian pyramid for better results
        if(gaussian) {
            let layer = this, pyramid = null;
            for(let level = 1; level < _utils_globals__WEBPACK_IMPORTED_MODULE_3__["PYRAMID_MAX_LEVELS"]; level++) {
                if(Math.min(layer.width, layer.height) < 2)
                    break;

                pyramid = gpu.programs.pyramids(level - 1);
                layer = pyramid.reduce(layer);
                layer.copyTo(this, level);
            }
        }

        // done!
        return this;
    }

    /**
     * Clear the texture
     * @returns {SpeedyTexture} this texture
     */
    clear()
    {
        const gl = this._gl;

        // context loss?
        if(gl.isContextLost())
            return this;

        // clear texture data
        gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, this._width, this._height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindTexture(gl.TEXTURE_2D, null);

        // no mipmaps
        this.discardMipmaps();

        // done!
        return this;
    }

    /**
     * Invalidates previously generated mipmaps, if any
     */
    discardMipmaps()
    {
        this._hasMipmaps = false;
    }

    /**
     * Does this texture have mipmaps?
     * @returns {boolean}
     */
    hasMipmaps()
    {
        return this._hasMipmaps;
    }

    /**
     * Has this texture been released?
     * @returns {boolean}
     */
    isReleased()
    {
        return this._glTexture == null;
    }

    /**
     * The internal WebGLTexture
     * @returns {WebGLTexture}
     */
    get glTexture()
    {
        return this._glTexture;
    }

    /**
     * The width of the texture, in pixels
     * @returns {number}
     */
    get width()
    {
        return this._width;
    }

    /**
     * The height of the texture, in pixels
     * @returns {number}
     */
    get height()
    {
        return this._height;
    }

    /**
     * The WebGL Context
     * @returns {WebGL2RenderingContext}
     */
    get gl()
    {
        return this._gl;
    }

    /**
     * Create a WebGL texture
     * @param {WebGL2RenderingContext} gl
     * @param {number} width in pixels
     * @param {number} height in pixels
     * @returns {WebGLTexture}
     */
    static _createTexture(gl, width, height)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(width > 0 && height > 0);

        // create & bind texture
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // setup
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        //gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        // unbind & return
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    /**
     * Upload pixel data to a WebGL texture
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLTexture} texture
     * @param {GLsizei} width texture width
     * @param {GLsizei} height texture height
     * @param {ImageBitmap|ImageData|ArrayBufferView|HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} pixels 
     * @param {GLint} [lod] mipmap level-of-detail
     * @returns {WebGLTexture} texture
     */
    static _upload(gl, texture, width, height, pixels, lod = 0)
    {
        // Prefer calling _upload() before gl.useProgram() to avoid the
        // needless switching of GL programs internally. See also:
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
        gl.bindTexture(gl.TEXTURE_2D, texture);

        /*
        // slower than texImage2D, unlike the spec?
        gl.texSubImage2D(gl.TEXTURE_2D,     // target
                         lod,               // mip level
                         0,                 // x-offset
                         0,                 // y-offset
                         width,             // texture width
                         height,            // texture height
                         gl.RGBA,           // source format
                         gl.UNSIGNED_BYTE,  // source type
                         pixels);           // source data
        */

        gl.texImage2D(gl.TEXTURE_2D,        // target
                      lod,                  // mip level
                      gl.RGBA8,             // internal format
                      width,              // texture width
                      height,             // texture height
                      0,                  // border
                      gl.RGBA,              // source format
                      gl.UNSIGNED_BYTE,     // source type
                      pixels);              // source data

        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    /**
     * Generate texture mipmap via hardware
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLTexture} texture
     * @returns {WebGLTexture} the input texture
     */
    static _generateDefaultMipmaps(gl, texture)
    {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    }
}

/**
 * A SpeedyTexture with a framebuffer
 */
class SpeedyDrawableTexture extends SpeedyTexture
{
    /**
     * Constructor
     * @param {WebGL2RenderingContext} gl
     * @param {number} width texture width in pixels
     * @param {number} height texture height in pixels
     */
    constructor(gl, width, height)
    {
        super(gl, width, height);

        /** @type {WebGLFramebuffer} framebuffer */
        this._glFbo = SpeedyDrawableTexture._createFramebuffer(gl, this._glTexture);
    }

    /**
     * Releases the texture
     * @returns {null}
     */
    release()
    {
        const gl = this._gl;

        // already released?
        if(this._glFbo == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`The SpeedyDrawableTexture has already been released`);

        // release the framebuffer
        gl.deleteFramebuffer(this._glFbo);
        this._glFbo = null;

        // release the SpeedyTexture
        return super.release();
    }

    /**
     * The internal WebGLFramebuffer
     * @returns {WebGLFramebuffer}
     */
    get glFbo()
    {
        return this._glFbo;
    }

    /**
     * Copy this texture into another
     * @param {SpeedyTexture} texture target texture
     * @param {number} [lod] level-of-detail of the target texture
     */
    copyTo(texture, lod = 0)
    {
        const gl = this._gl;

        // context loss?
        if(gl.isContextLost())
            return;

        // compute texture size as max(1, floor(size / 2^lod)),
        // in accordance to the OpenGL ES 3.0 spec sec 3.8.10.4
        // (Mipmapping)
        const pot = 1 << (lod |= 0);
        const expectedWidth = Math.max(1, Math.floor(texture.width / pot));
        const expectedHeight = Math.max(1, Math.floor(texture.height / pot));

        // validate
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(this._width === expectedWidth && this._height === expectedHeight);

        // discard mipmaps, if any
        texture.discardMipmaps();

        // copy to texture
        SpeedyDrawableTexture._copyToTexture(gl, this._glFbo, texture.glTexture, 0, 0, this._width, this._height, lod);
    }

    /*
     **
     * Clone this texture
     * @returns {SpeedyDrawableTexture}
     *
    drawableClone()
    {
        const clone = new SpeedyDrawableTexture(this._gl, this._width, this._height);
        this.copyTo(clone);
        return clone;
    }
    */

    /**
     * Clone this texture. Note that the clone doesn't include a framebuffer
     * @returns {SpeedyTexture} non-drawable
     */
    clone()
    {
        const clone = new SpeedyTexture(this._gl, this._width, this._height);
        this.copyTo(clone);
        return clone;
    }

    /**
     * Resize this texture
     * @param {number} width new width, in pixels
     * @param {number} height new height, in pixels
     * @param {boolean} [preserveContent] should we preserve the content of the texture? EXPENSIVE!
     * @returns {SpeedyDrawableTexture} this texture
     */
    resize(width, height, preserveContent = false)
    {
        const gl = this._gl;

        // no need to resize?
        if(this._width === width && this._height === height)
            return this;

        // validate size
        width |= 0; height |= 0;
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(width > 0 && height > 0);

        // context loss?
        if(gl.isContextLost())
            return this;

        // do we need to copy the old content?
        if(!preserveContent) {
            // no; do a cheap resize
            gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        else {
            // allocate new texture
            const newTexture = SpeedyTexture._createTexture(gl, width, height);

            // initialize the new texture with zeros to avoid a
            // warning when calling copyTexSubImage2D() on Firefox
            // this may not be very efficient?
            const zeros = new Uint8Array(width * height * 4); // RGBA: 4 bytes per pixel
            SpeedyTexture._upload(gl, newTexture, width, height, zeros);

            // copy the old texture to the new one
            const oldWidth = this._width, oldHeight = this._height;
            SpeedyDrawableTexture._copyToTexture(gl, this._glFbo, newTexture, 0, 0, Math.min(width, oldWidth), Math.min(height, oldHeight));

            // bind FBO
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._glFbo);

            // invalidate old data (is this needed?)
            gl.invalidateFramebuffer(gl.FRAMEBUFFER, [gl.COLOR_ATTACHMENT0]);

            // attach the new texture to the existing framebuffer
            gl.framebufferTexture2D(gl.FRAMEBUFFER,         // target
                                    gl.COLOR_ATTACHMENT0,   // color buffer
                                    gl.TEXTURE_2D,          // tex target
                                    newTexture,             // texture
                                    0);                     // mipmap level

            // unbind FBO
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            // release the old texture and replace it
            gl.deleteTexture(this._glTexture);
            this._glTexture = newTexture;
        }

        // update dimensions & discard mipmaps
        this.discardMipmaps();
        this._width = width;
        this._height = height;

        // done!
        return this;
    }

    /**
     * Clear the texture to a color
     * @param {number} [r] red component, a value in [0,1]
     * @param {number} [g] green component, a value in [0,1]
     * @param {number} [b] blue component, a value in [0,1]
     * @param {number} [a] alpha component, a value in [0,1]
     * @returns {SpeedyDrawableTexture} this texture
     */
    clearToColor(r = 0, g = 0, b = 0, a = 0)
    {
        const gl = this._gl;

        // context loss?
        if(gl.isContextLost())
            return this;

        // clamp parameters
        r = Math.max(0.0, Math.min(+r, 1.0));
        g = Math.max(0.0, Math.min(+g, 1.0));
        b = Math.max(0.0, Math.min(+b, 1.0));
        a = Math.max(0.0, Math.min(+a, 1.0));

        // discard mipmaps, if any
        this.discardMipmaps();

        // clear the texture
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._glFbo);
        gl.viewport(0, 0, this._width, this._height);
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // done!
        return this;
    }

    /**
     * Create a FBO associated with an existing texture
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLTexture} texture
     * @returns {WebGLFramebuffer}
     */
    static _createFramebuffer(gl, texture)
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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["GLError"](`Can't create framebuffer: ${error} (${status})`);
        }

        // unbind & return
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return fbo;
    }

    /**
     * Copy data from a framebuffer into a texture
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLFramebuffer} fbo we'll read the data from this
     * @param {WebGLTexture} texture destination texture
     * @param {GLint} x xpos (where to start copying)
     * @param {GLint} y ypos (where to start copying)
     * @param {GLsizei} width width of the texture
     * @param {GLsizei} height height of the texture
     * @param {GLint} [lod] mipmap level-of-detail
     * @returns {WebGLTexture} texture
     */
    static _copyToTexture(gl, fbo, texture, x, y, width, height, lod = 0)
    {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

        gl.copyTexSubImage2D(
            gl.TEXTURE_2D, // target
            lod, // mipmap level
            0, // xoffset
            0, // yoffset
            x, // xpos (where to start copying)
            y, // ypos (where to start copying)
            width, // width of the texture
            height // height of the texture
        );

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    }
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * index.js
 * The entry point of the library
 */

module.exports = __webpack_require__(/*! ./core/speedy */ "./src/core/speedy.js").Speedy;

/***/ }),

/***/ "./src/utils/errors.js":
/*!*****************************!*\
  !*** ./src/utils/errors.js ***!
  \*****************************/
/*! exports provided: SpeedyError, NotSupportedError, NotImplementedError, GLError, AbstractMethodError, IllegalArgumentError, IllegalOperationError, OutOfMemoryError, FileNotFoundError, TimeoutError, ParseError, AssertionError, AccessDeniedError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyError", function() { return SpeedyError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotSupportedError", function() { return NotSupportedError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotImplementedError", function() { return NotImplementedError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GLError", function() { return GLError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AbstractMethodError", function() { return AbstractMethodError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IllegalArgumentError", function() { return IllegalArgumentError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IllegalOperationError", function() { return IllegalOperationError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OutOfMemoryError", function() { return OutOfMemoryError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileNotFoundError", function() { return FileNotFoundError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimeoutError", function() { return TimeoutError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ParseError", function() { return ParseError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AssertionError", function() { return AssertionError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccessDeniedError", function() { return AccessDeniedError; });
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
 * errors.js
 * Error classes
 */

/**
 * Generic error class for Speedy
 */
class SpeedyError extends Error
{
    /**
     * Class constructor
     * @param {string} message message text
     * @param {SpeedyError} [cause] cause of the error
     */
    constructor(message, cause = null)
    {
        super([
            message,
            cause ? cause.toString() : '[speedy-vision.js]'
        ].join('\n-> '));
        this._cause = cause;
    }

    /**
     * Error name
     * @returns {string}
     */
    get name()
    {
        return this.constructor.name;
    }

    /**
     * Set error name (ignored)
     * @param {string} _ ignored
     */
    set name(_)
    {
        ;
    }

    /**
     * Get the cause of the error. Available if
     * it has been specified in the constructor
     * @returns {SpeedyError|null}
     */
    get cause()
    {
        return this._cause;
    }
}

/**
 * Unsupported operation error
 * The requested operation is not supported
 */
class NotSupportedError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyError} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Unsupported operation. ${message}`, cause);
    }
}

/**
 * Not implemented error
 * The called method is not implemented
 */
class NotImplementedError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyError} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Method not implemented. ${message}`, cause);
    }
}

/**
 * WebGL error
 */
class GLError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyError} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`WebGL error. ${message}`, cause);
    }
}

/**
 * AbstractMethodError
 * Thrown when one tries to call an abstract method
 */
class AbstractMethodError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyError} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Can't call abstract method. ${message}`, cause);
    }
}

/**
 * Illegal argument error
 * A method has received one or more illegal arguments
 */
class IllegalArgumentError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyError} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Illegal argument. ${message}`, cause);
    }
}

/**
 * Illegal operation error
 * The method arguments are valid, but the method can't
 * be called due to the current the state of the object
 */
class IllegalOperationError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyError} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Illegal operation. ${message}`, cause);
    }
}

/**
 * Out of memory
 */
class OutOfMemoryError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyError} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Out of memory. ${message}`, cause);
    }
}

/**
 * File not found error
 */
class FileNotFoundError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyError} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`File not found. ${message}`, cause);
    }
}

/**
 * Timeout error
 */
class TimeoutError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyError} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Timeout error. ${message}`, cause);
    }
}

/**
 * Parse error
 */
class ParseError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyError} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Parse error. ${message}`, cause);
    }
}

/**
 * Assertion error
 */
class AssertionError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyError} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Assertion failed. ${message}`, cause);
    }
}

/**
 * Access denied
 */
class AccessDeniedError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyError} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Access denied. ${message}`, cause);
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
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors */ "./src/utils/errors.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
        this._boundUpdate = this._update.bind(this);

        // this should never happen...
        if(instance !== null)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__["IllegalOperationError"](`Can't have multiple instances of FPSCounter`);

        // start FPS counter
        this._boundUpdate();
    }

    /**
     * Gets an instance of the FPS counter.
     * We use lazy loading, i.e., we will not
     * create a FPS counter unless we need to!
     * @returns {FPSCounter}
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

    /**
     * Updates the FPS counter
     */
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
        requestAnimationFrame(this._boundUpdate);
    }
}

/***/ }),

/***/ "./src/utils/globals.js":
/*!******************************!*\
  !*** ./src/utils/globals.js ***!
  \******************************/
/*! exports provided: PYRAMID_MAX_LEVELS, PYRAMID_MAX_SCALE, LOG2_PYRAMID_MAX_SCALE, FIX_BITS, FIX_RESOLUTION, MAX_TEXTURE_LENGTH, MAX_DESCRIPTOR_SIZE, MIN_KEYPOINT_SIZE, INITIAL_ENCODER_LENGTH, KPF_NONE, KPF_ORIENTED, KPF_DISCARD, LITTLE_ENDIAN */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PYRAMID_MAX_LEVELS", function() { return PYRAMID_MAX_LEVELS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PYRAMID_MAX_SCALE", function() { return PYRAMID_MAX_SCALE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOG2_PYRAMID_MAX_SCALE", function() { return LOG2_PYRAMID_MAX_SCALE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIX_BITS", function() { return FIX_BITS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIX_RESOLUTION", function() { return FIX_RESOLUTION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAX_TEXTURE_LENGTH", function() { return MAX_TEXTURE_LENGTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAX_DESCRIPTOR_SIZE", function() { return MAX_DESCRIPTOR_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MIN_KEYPOINT_SIZE", function() { return MIN_KEYPOINT_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INITIAL_ENCODER_LENGTH", function() { return INITIAL_ENCODER_LENGTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KPF_NONE", function() { return KPF_NONE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KPF_ORIENTED", function() { return KPF_ORIENTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KPF_DISCARD", function() { return KPF_DISCARD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LITTLE_ENDIAN", function() { return LITTLE_ENDIAN; });
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
 * globals.js
 * Global constants
 */

// -----------------------------------------------------------------
// IMAGE PYRAMIDS & SCALE-SPACE
// -----------------------------------------------------------------

// The maximum number of levels in a pyramid, considering a scale factor of 2x between levels
const PYRAMID_MAX_LEVELS = 8; // i.e., maximum number of octaves

// The maximum supported scale for a pyramid level
const PYRAMID_MAX_SCALE = 1; // preferably a power of 2 (image scale can go up to this value)

// The base-2 logarithm of PYRAMID_MAX_SCALE
const LOG2_PYRAMID_MAX_SCALE = Math.log2(PYRAMID_MAX_SCALE);



// -----------------------------------------------------------------
// FIXED-POINT MATH
// -----------------------------------------------------------------

// How many bits do we use for storing the fractional data
const FIX_BITS = 4; // MAX_TEXTURE_LENGTH depends on this

// Fixed-point resolution
const FIX_RESOLUTION = 1.0 * (1 << FIX_BITS); // float(2^(FIX_BITS))



// -----------------------------------------------------------------
// TEXTURE LIMITS
// -----------------------------------------------------------------

// Maximum texture length
const MAX_TEXTURE_LENGTH = (1 << (16 - FIX_BITS)) - 2; // 2^n - 2 due to keypoint encoding



// -----------------------------------------------------------------
// KEYPOINTS
// -----------------------------------------------------------------

// Maximum size of a descriptor, in bytes (must be divisible by 4)
const MAX_DESCRIPTOR_SIZE = 64;

// Size of a keypoint header, in bytes (must be divisible by 4)
const MIN_KEYPOINT_SIZE = 8;

// Initial size of the keypoint encoder
const INITIAL_ENCODER_LENGTH = 32; // pick a small number to reduce processing load and not crash things on mobile

// Flag: no special flags
const KPF_NONE = 0x0;

// Flag: the keypoint is oriented
const KPF_ORIENTED = 0x1;

// Flag: should the keypoint be discarded? (in the next frame)
const KPF_DISCARD = 0x80;



// -----------------------------------------------------------------
// MISC
// -----------------------------------------------------------------

// Are we in a little-endian machine?
const LITTLE_ENDIAN = (function() {
    return 0xCAFE === (new Uint16Array(new Uint8Array([0xFE, 0xCA]).buffer))[0];
})();

/***/ }),

/***/ "./src/utils/observable.js":
/*!*********************************!*\
  !*** ./src/utils/observable.js ***!
  \*********************************/
/*! exports provided: Observable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Observable", function() { return Observable; });
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
 * observable.js
 * Observer design pattern
 */

/**
 * Implementation of the Observer design pattern
 * @abstract
 */
class Observable
{
    /**
     * Constructor
     */
    constructor()
    {
        /** @type {Function[]} subscribers / callbacks */
        this._subscribers = [];
    }

    /**
     * Add subscriber
     * @param {Function} fn callback
     */
    subscribe(fn)
    {
        if(this._subscribers.indexOf(fn) < 0)
            this._subscribers.push(fn);
    }

    /**
     * Remove subscriber
     * @param {Function} fn previously added callback
     */
    unsubscribe(fn)
    {
        this._subscribers = this._subscribers.filter(subscriber => subscriber !== fn);
    }

    /**
     * Notify all subscribers about a state change
     * @param {any} data generic data
     * @protected
     */
    _notify(data)
    {
        for(const fn of this._subscribers)
            fn(data);
    }
}

/***/ }),

/***/ "./src/utils/sorting-networks.js":
/*!***************************************!*\
  !*** ./src/utils/sorting-networks.js ***!
  \***************************************/
/*! exports provided: OddEvenMergesort */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OddEvenMergesort", function() { return OddEvenMergesort; });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors */ "./src/utils/errors.js");
/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * sorting-networks.js
 * Sorting Networks
 */



/**
 * An abstract Sorting Network
 * @abstract
 */
class SortingNetwork
{
    /**
     * Generate a sequence of comparators for a
     * sorting network supporting n data points
     * @param {number} n number of data points
     * @returns {Array<number[2]>}
     */
    static generate(n)
    {
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__["AbstractMethodError"]();
    }

    /**
     * Sort the given data points using this network
     * @param {Array} data data points
     * @param {Function} [cmp] comparator function, as in Array.prototype.sort()
     * @returns {Array} sorted data
     */
    static sort(data, cmp = ((a, b) => (+a) - (+b)))
    {
        const network = this.generate(data.length);

        for(const [a, b] of network) {
            if(cmp(data[a], data[b]) > 0)
                [ data[a], data[b] ] = [ data[b], data[a] ];
        }

        return data;
    }
}

/**
 * An implementation of Batcher's Odd-Even Mergesort
 */
class OddEvenMergesort extends SortingNetwork
{
    /*

    A reference for this algorithm can be found at:
    https://www.inf.hs-flensburg.de/lang/algorithmen/sortieren/networks/oemen.htm

    The algorithm will work if the size of the input array is a power of 2. In
    order to extend the algorithm so that it works with arrays of any size - say
    it's n - we use a very simple idea: extend the input array so that its size
    becomes a power of 2. Set the new entries to infinity. Sort the extended
    array and return its first n elements.

    Any comparator [i,j] where j >= n is comparing some value with infinity,
    meaning that no exchange will need to take place. Therefore, [i,j] can be
    dropped from the network.

    */

    /**
     * Generate a sequence of comparators for a
     * sorting network supporting n data points
     * @param {number} n number of data points
     * @returns {Array<number[2]>}
     */
    static generate(n)
    {
        const nextPot = 1 << Math.ceil(Math.log2(Math.max(n, 1)));
        return this._mergesort(n, [], 0, nextPot);
    }

    /**
     * Odd-Even Mergesort
     * @param {number} count number of data points
     * @param {Array<number[2]>} net sorting network
     * @param {number} lo starting index
     * @param {number} n sequence length, a power of 2
     * @returns {Array<number[2]>} net
     */
    static _mergesort(count, net, lo, n)
    {
        if(n > 1) {
            const m = n / 2;

            this._mergesort(count, net, lo, m);
            this._mergesort(count, net, lo + m, m);
            this._merge(count, net, lo, n, 1);
        }

        return net;
    }

    /**
     * Odd-Even Merge
     * @param {number} count number of data points
     * @param {Array<number[2]>} net sorting network
     * @param {number} lo starting index
     * @param {number} n a power of 2
     * @param {number} jmp a power of 2
     */
    static _merge(count, net, lo, n, jmp)
    {
        const dbljmp = jmp * 2;

        if(dbljmp < n) {
            this._merge(count, net, lo, n, dbljmp); // merge even subsequence
            this._merge(count, net, lo + jmp, n, dbljmp); // merge odd subsequence

            for(let i = lo + jmp; i + jmp < lo + n && i + jmp < count; i += dbljmp)
                net.push([i, i + jmp]);
        }
        else if(lo + jmp < count)
            net.push([lo, lo + jmp]);
    }
}

/***/ }),

/***/ "./src/utils/speedy-promise.js":
/*!*************************************!*\
  !*** ./src/utils/speedy-promise.js ***!
  \*************************************/
/*! exports provided: SpeedyPromise */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPromise", function() { return SpeedyPromise; });
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
 * speedy-promise.js
 * Speedy Promises: a fast implementation of Promises
 */

const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

const SUSPEND_ASYNC = 1;
const asap = (typeof queueMicrotask !== 'undefined' && queueMicrotask) || // browsers
             (typeof process !== 'undefined' && process.nextTick) || // node.js
             (f => Promise.resolve().then(f)); // most compatible

/**
 * SpeedyPromise: Super Fast Promises. SpeedyPromises can
 * interoperate with ES6 Promises. This implementation is
 * based on the Promises/A+ specification.
 * @template
 */
class SpeedyPromise
{
    /**
     * Constructor
     * @param {Function} callback
     */
    constructor(callback)
    {
        this._state = PENDING;
        this._value = undefined;

        this._onFulfillment = null;
        this._onRejection = null;
        this._children = 0;
        this[0] = this;
        this._parent = undefined;
        this._flags = 0;

        this._fulfill = this._fulfill.bind(this);
        this._reject = this._reject.bind(this);
        this._resolve = this._resolve.bind(this);
        this._broadcastIfAsync = this._broadcastIfAsync.bind(this);

        callback(this._fulfill, this._reject);
    }

    /**
     * Setup handlers
     * @param {Function} onFulfillment called when the SpeedyPromise is fulfilled
     * @param {Function} [onRejection] called when the SpeedyPromise is rejected
     * @returns {SpeedyPromise}
     */
    then(onFulfillment, onRejection = null)
    {
        const child = new SpeedyPromise(this._nop);
        child._onFulfillment = typeof onFulfillment === 'function' && onFulfillment;
        child._onRejection = typeof onRejection === 'function' && onRejection;
        child._parent = this;

        this[this._children++] = child; // attach child
        this._flags &= ~SUSPEND_ASYNC; // restore the async behavior
        this._notify();

        return child;
    }

    /**
     * Setup rejection handler
     * @param {Function} onRejection called when the SpeedyPromise is rejected
     * @returns {SpeedyPromise}
     */
    catch(onRejection)
    {
        return this.then(null, onRejection);
    }

    /**
     * Execute a callback when the promise is settled
     * (i.e., fulfilled or rejected)
     * @param {Function} onFinally
     * @returns {SpeedyPromise}
     */
    finally(onFinally)
    {
        const fn = val => { onFinally(); return val; };
        return this.then(fn, fn);
    }

    /**
     * Start the computation immediately, synchronously.
     * Can't afford to spend any time at all waiting for micro-tasks, etc.
     * @returns {SpeedyPromise} this
     */
    turbocharge()
    {
        let my = this;

        // suspend the async behavior
        this._flags |= SUSPEND_ASYNC;
        while(my._parent !== undefined) {
            my = my._parent;
            my._flags |= SUSPEND_ASYNC;
        }

        // notify the children of the root
        my._notify(); // will be synchronous

        // return this SpeedyPromise
        return this;
    }

    /**
     * Convert to string
     * @returns {string}
     */
    toString()
    {
        switch(this._state) {
            case PENDING:
                return `SpeedyPromise { <pending> }`;
            case FULFILLED:
                return `SpeedyPromise { <fulfilled> ${this._value} }`;
            case REJECTED:
                return `SpeedyPromise { <rejected> ${this._value} }`;
            default:
                return '';
        }
    }

    /**
     * Creates a resolved SpeedyPromise
     * @param {any} value
     * @returns {SpeedyPromise}
     */
    static resolve(value)
    {
        const promise = new SpeedyPromise(this._snop);

        if((typeof value === 'object' && value !== null && 'then' in value) || (typeof value === 'function' && 'then' in value)) {
            // resolve asynchronously
            promise._resolve(value);
        }
        else {
            // fulfill synchronously
            promise._value = value;
            promise._state = FULFILLED;
        }

        return promise;
    }

    /**
     * Creates a rejected SpeedyPromise
     * @param {any} reason usually an instance of Error
     * @returns {SpeedyPromise}
     */
    static reject(reason)
    {
        const promise = new SpeedyPromise(this._snop);
        promise._value = reason;
        promise._state = REJECTED;
        return promise;
    }

    /**
     * Returns a SpeedyPromise that resolves to an array
     * containing the results of the input promises/values,
     * in their given order. The returned SpeedyPromise will
     * resolve if all input promises resolve, or reject if
     * any input promise rejects.
     * @param {iterable} iterable e.g., a SpeedyPromise[]
     * @returns {SpeedyPromise}
     */
    static all(iterable)
    {
        return new SpeedyPromise((resolve, reject) => {
            const input = [];

            // get elements
            for(const element of iterable)
                input.push(element);

            // resolve synchronously if there are no elements
            const length = input.length;
            if(length == 0) {
                resolve([]);
                return;
            }

            // resolve asynchronously
            let counter = length;
            const output = new Array(length);
            const partialResolve = i => (val => { output[i] = val; if(0 == --counter) resolve(output); });
            for(let i = 0; i < length; i++) {
                const element = input[i];
                if(element.__proto__ === SpeedyPromise.prototype || element.__proto__ === Promise.prototype)
                    element.then(partialResolve(i), reject);
                else
                    SpeedyPromise.resolve(element).then(partialResolve(i), reject);
            }
        });
    }

    /**
     * Returns a promise that gets fulfilled or rejected as soon
     * as the first promise in the iterable gets fulfilled or
     * rejected (with its value/reason).
     * @param {iterable} iterable e.g., a SpeedyPromise[]
     * @returns {SpeedyPromise}
     */
    static race(iterable)
    {
        return new SpeedyPromise((resolve, reject) => {
            const input = [];

            // get elements
            for(const element of iterable)
                input.push(element);

            // if the iterable is empty, the promise
            // will be pending forever...

            // resolve asynchronously
            const length = input.length;
            for(let i = 0; i < length; i++) {
                const element = input[i];
                if(element.__proto__ === SpeedyPromise.prototype || element.__proto__ === Promise.prototype)
                    element.then(resolve, reject);
                else
                    SpeedyPromise.resolve(element).then(resolve, reject);
            }
        });
    }

    /**
     * Fulfill this promise with a value
     * @param {any} value
     */
    _fulfill(value)
    {
        this._setState(FULFILLED, value);
    }

    /**
     * Reject this promise with a reason
     * @param {any} reason
     */
    _reject(reason)
    {
        this._setState(REJECTED, reason);
    }

    /**
     * Set the state and the value of this promise
     * @param {number} state
     * @param {any} value
     */
    _setState(state, value)
    {
        // the promise is already fulfilled or rejected
        if(this._state != PENDING)
            return;

        // set the new state
        this._state = state;
        this._value = value;
        this._notify();
    }

    /**
     * Notify my children that this promise is no
     * longer pending. This is an async operation:
     * my childen will be notified "as soon
     * as possible" (it will be scheduled).
     * We may force this to be synchronous, though
     */
    _notify()
    {
        // nothing to do
        if(this._state == PENDING)
            return;

        // have we turbocharged this promise?
        if(this._flags & SUSPEND_ASYNC) {
            this._broadcast(); // execute synchronously
            return;
        }

        // install a timer (default behavior)
        asap(this._broadcastIfAsync);
    }

    /**
     * Helper method
     */
    _broadcastIfAsync()
    {
        // we may have installed a timer at some
        // point, but turbocharged the promise later
        if(!(this._flags & SUSPEND_ASYNC))
            this._broadcast();
    }

    /**
     * Tell my children that this promise
     * is either fulfilled or rejected.
     * This is a synchronous operation
     */
    _broadcast()
    {
        const children = this._children;
        const state = this._state;

        if(state === FULFILLED) {
            for(let i = 0; i < children; i++) {
                const child = this[i];
                const callback = child._onFulfillment;

                try {
                    if(callback) {
                        if(callback !== child._nop) {
                            child._resolve(callback(this._value)); // promise resolution procedure
                            child._onFulfillment = child._nop; // will not be called again
                        }
                    }
                    else
                        child._fulfill(this._value);
                }
                catch(e) {
                    child._reject(e);
                }
            }
        }
        else if(state === REJECTED) {
            for(let i = 0; i < children; i++) {
                const child = this[i];
                const callback = child._onRejection;

                try {
                    if(callback) {
                        if(callback !== child._nop) {
                            child._resolve(callback(this._value)); // promise resolution procedure
                            child._onRejection = child._nop; // will not be called again
                        }
                    }
                    else
                        child._reject(this._value);
                }
                catch(e) {
                    child._reject(e);
                }
            }
        }
    }

    /**
     * Promise Resolution Procedure
     * based on the Promises/A+ spec
     * @param {any} x
     */
    _resolve(x)
    {
        if((typeof x !== 'object' && typeof x !== 'function') || (x === null)) { // if(x !== Object(x))
            this._fulfill(x);
            return;
        }

        if(x === this)
            throw new TypeError(); // Circular reference

        if(x.__proto__ === SpeedyPromise.prototype || x.__proto__ === Promise.prototype) {
            x.then(this._resolve, this._reject);
            return;
        }

        try {
            const then = x.then;
            if(typeof then === 'function') {
                let resolve = this._resolve, reject = this._reject;
                try {
                    then.call(x,
                        y => { resolve(y); resolve = reject = this._nop; },
                        r => { reject(r); resolve = reject = this._nop; }
                    );
                }
                catch(e) {
                    if(resolve !== this._nop && reject !== this._nop)
                        this._reject(e);
                }
            }
            else {
                this._fulfill(x);
            }
        }
        catch(e) {
            this._reject(e);
        }
    }

    /**
     * No-operation
     */
    _nop()
    {
    }

    /**
     * Static no-operation
     */
    static _snop()
    {
    }
}

//module.exports = { SpeedyPromise };

/*
// Uncomment to test performance with regular Promises
module.exports = { SpeedyPromise: Promise };
Promise.prototype.turbocharge = function() { return this };
*/
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/utils/types.js":
/*!****************************!*\
  !*** ./src/utils/types.js ***!
  \****************************/
/*! exports provided: MediaType, ImageFormat, ColorFormat, PixelComponent, ColorComponentId */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaType", function() { return MediaType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImageFormat", function() { return ImageFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ColorFormat", function() { return ColorFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PixelComponent", function() { return PixelComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ColorComponentId", function() { return ColorComponentId; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils/utils.js");
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
 * types.js
 * Types & formats
 */



/**
 * Media types
 * @enum {MediaType}
 */
const MediaType = _utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].enum(
    'Image',
    'Video',
    'Canvas',
    'Bitmap'
);

/**
 * Image formats
 * @enum {number}
 */
const ImageFormat = Object.freeze({
    RGBA: 0,
    GREY: 1,
});

/**
 * Color formats
 * @enum
 */
const ColorFormat = _utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].enum(
    'RGB',
    'Greyscale',
    'Binary'
);

/**
 * Pixel component (bitwise flags)
 * @typedef {number} PixelComponent
 */
const PixelComponent = Object.freeze({
    RED:   1,
    GREEN: 2,
    BLUE:  4,
    ALPHA: 8,
    ALL:   15 // = RED | GREEN | BLUE | ALPHA
});

/**
 * Component ID utility
 */
const ColorComponentId = Object.freeze({
    [PixelComponent.RED]:   0,
    [PixelComponent.GREEN]: 1,
    [PixelComponent.BLUE]:  2,
    [PixelComponent.ALPHA]: 3
});

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
/* harmony import */ var _speedy_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-promise */ "./src/utils/speedy-promise.js");
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
 * utils.js
 * Generic utilities
 */




/**
 * Generic utilities
 */
class Utils
{
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
        if(true)
            console.log('[speedy-vision.js]', message);
        return message;
    }

    /**
     * Assertion
     * @param {boolean} expr expression
     * @param {string} [text] error message
     * @throws {AssertionError}
     */
    static assert(expr, text = '')
    {
        if(!expr)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__["AssertionError"](text);
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
     * Similar to setTimeout(fn, 0), but without the ~4ms delay.
     * Although much faster than setTimeout, this may be resource-hungry
     * (heavy on battery) if used in a loop. Use with caution.
     * Implementation based on David Baron's, but adapted for ES6 classes
     * @param {Function} fn
     */
    //static setZeroTimeout(fn) { setTimeout(fn, 0); } // easier on the CPU
    static setZeroTimeout(fn)
    {
        const ctx = (Utils._setZeroTimeoutContext = Utils._setZeroTimeoutContext || (Utils._setZeroTimeoutContext = {
            callbacks: new Map(),
            _setup: window.addEventListener('message', ev => {
                if(ev.source === window) {
                    const ctx = Utils._setZeroTimeoutContext;
                    const msgId = ev.data;
                    const fn = ctx.callbacks.get(msgId);
                    if(fn !== undefined) {
                        ev.stopPropagation();
                        fn.call(window);
                        ctx.callbacks.delete(msgId);
                    }
                }
            }, true)
        }));

        const msgId = '0%' + Math.random();
        ctx.callbacks.set(msgId, fn);
        window.postMessage(msgId, '*');
    }

    /**
     * Gets the names of the arguments of the specified function
     * @param {Function} fun 
     * @returns {Array<string>}
     */
    static functionArguments(fun)
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__["ParseError"](`Can't detect function arguments of ${code}`);

        return [];
    }

    /**
     * Get all property descriptors from an object,
     * traversing its entire prototype chain
     * @param {object} obj 
     * @returns {object}
     */
    static getAllPropertyDescriptors(obj)
    {
        if(obj) {
            const proto = Object.getPrototypeOf(obj);

            return {
                ...(Utils.getAllPropertyDescriptors(proto)),
                ...Object.getOwnPropertyDescriptors(obj)
            };
        }
        else
            return Object.create(null);
    }

    /**
     * Creates a HTMLCanvasElement with the given dimensions
     * @param {number} width in pixels
     * @param {number} height in pixels
     * @returns {HTMLCanvasElement}
     */
    static createCanvas(width, height)
    {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
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

    /**
     * Generate a 1D gaussian kernel with custom sigma
     * Tip: use kernelSize >= (5 * sigma), kernelSize odd
     * @param {number} sigma gaussian sigma
     * @param {number} [kernelSize] kernel size, odd number
     * @param {bool} [normalized] normalize entries so that their sum is 1
     */
    static gaussianKernel(sigma, kernelSize = 0, normalized = true)
    {
        /*
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
         */

        // default kernel size
        if(kernelSize == 0) {
            kernelSize = Math.ceil(5.0 * sigma) | 0;
            kernelSize += 1 - (kernelSize % 2);
        }

        // validate input
        kernelSize |= 0;
        if(kernelSize < 1 || kernelSize % 2 == 0)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Invalid kernel size given to gaussianKernel: ${kernelSize} x 1`);
        else if(sigma <= 0.0)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Invalid sigma given to gaussianKernel: ${sigma}`);

        // function erf(x) = -erf(-x) can be approximated numerically. See:
        // https://en.wikipedia.org/wiki/Error_function#Numerical_approximations
        const kernel = new Array(kernelSize);

        // set constants
        const N  =  kernelSize >> 1; // integer (floor, div 2)
        const c  =  (+sigma) * 1.4142135623730951; // sigma * sqrt(2)
        const m  =  0.3275911;
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;

        // compute the kernel
        let sum = 0.0;
        for(let j = 0; j < kernelSize; j++) {
            let xa = (j - N + 0.5) / c;
            let xb = (j - N - 0.5) / c;
            let sa = 1.0, sb = 1.0;

            if(xa < 0.0) { sa = -1.0; xa = -xa; }
            if(xb < 0.0) { sb = -1.0; xb = -xb; }

            const ta = 1.0 / (1.0 + m * xa);
            const tb = 1.0 / (1.0 + m * xb);
            const pa = ((((a5 * ta + a4) * ta + a3) * ta + a2) * ta + a1) * ta;
            const pb = ((((a5 * tb + a4) * tb + a3) * tb + a2) * tb + a1) * tb;
            const ya = 1.0 - pa * Math.exp(-xa * xa);
            const yb = 1.0 - pb * Math.exp(-xb * xb);

            const erfa = sa * ya;
            const erfb = sb * yb;
            const fp = (erfa - erfb) / (2.0 * c);

            kernel[j] = fp;
            sum += fp;
        }

        // done!
        return normalized ? kernel.map(k => k / sum) : kernel;
    }

    /**
     * Generate a 2D kernel in column-major format using two separable 1D kernels
     * @param {number[]} ka 1D kernel
     * @param {number[]} [kb]
     * @returns {number[]}
     */
    static kernel2d(ka, kb = ka)
    {
        const ksize = ka.length;
        Utils.assert(ka.length == ka.length);
        Utils.assert(ksize >= 1 && ksize % 2 == 1);

        // compute the outer product ka x kb
        let kernel2d = new Array(ksize * ksize), k = 0;
        for(let col = 0; col < ksize; col++) {
            for(let row = 0; row < ksize; row++)
                kernel2d[k++] = ka[row] * kb[col];
        }

        return kernel2d;
    }

    /**
     * Cartesian product a x b: [ [ai, bj] for all i, j ]
     * @param {Array<number>} a
     * @param {Array<number>} b
     * @returns {Array<number[2]>}
     */
    static cartesian(a, b)
    {
        return [].concat(...a.map(a => b.map(b => [a, b])));
    }

    /**
     * Symmetric range
     * @param {number} n non-negative integer
     * @returns {Array<number>} [ -n, ..., n ]
     */
    static symmetricRange(n)
    {
        if((n |= 0) < 0)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Expected a non-negative integer as input`);

        return [...(Array(2*n + 1).keys())].map(x => x - n);
    }

    /**
     * Compute the [0, n) range of integers
     * @param {number} n positive integer
     * @returns {Array<number>} [ 0, 1, ..., n-1 ]
     */
    static range(n)
    {
        if((n |= 0) <= 0)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentError"](`Expected a positive integer as input`);

        return [...(Array(n).keys())];
    }

    /**
     * Request webcam access (WebRTC)
     * @param {number} width in pixels
     * @param {number} height in pixels
     * @param {object} [options] will be passed to navigator.mediaDevices.getUserMedia() 
     * @returns {SpeedyPromise<HTMLVideoElement>}
     */
    static requestCameraStream(width, height, options = {})
    {
        Utils.log('Accessing the webcam...');

        if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__["NotSupportedError"]('Unsupported browser: no mediaDevices.getUserMedia()');

        return new _speedy_promise__WEBPACK_IMPORTED_MODULE_1__["SpeedyPromise"]((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    width: { ideal: width },
                    height: { ideal: height },
                    aspectRatio: width / height,
                    //resizeMode: 'crop-and-scale',
                    facingMode: 'environment',
                    frameRate: 30,
                },
                ...options
            })
            .then(stream => {
                const video = document.createElement('video');
                video.onloadedmetadata = () => {
                    video.play();
                    Utils.log('The camera device is turned on!');
                    resolve(video);
                };
                video.srcObject = stream;
            })
            .catch(err => {
                reject(new _errors__WEBPACK_IMPORTED_MODULE_0__["AccessDeniedError"](
                    `Please give access to the camera and reload the page`,
                    err
                ));
            });
        });
    }
}

/***/ })

/******/ });
//# sourceMappingURL=speedy-vision.js.map