/*!
 * speedy-vision.js v0.8.1-wip
 * GPU-accelerated Computer Vision for JavaScript
 * https://github.com/alemart/speedy-vision-js
 * 
 * Copyright 2020-2021 Alexandre Martins <alemartf(at)gmail.com> (https://github.com/alemart)
 * @license Apache-2.0
 * 
 * Date: 2021-09-29T01:27:07.766Z
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

/***/ "./src/core/pipeline/factories/image-factory.js":
/*!******************************************************!*\
  !*** ./src/core/pipeline/factories/image-factory.js ***!
  \******************************************************/
/*! exports provided: SpeedyPipelineImageFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineImageFactory", function() { return SpeedyPipelineImageFactory; });
/* harmony import */ var _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../speedy-namespace */ "./src/core/speedy-namespace.js");
/* harmony import */ var _nodes_images_source__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../nodes/images/source */ "./src/core/pipeline/nodes/images/source.js");
/* harmony import */ var _nodes_images_sink__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../nodes/images/sink */ "./src/core/pipeline/nodes/images/sink.js");
/* harmony import */ var _nodes_images_multiplexer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../nodes/images/multiplexer */ "./src/core/pipeline/nodes/images/multiplexer.js");
/* harmony import */ var _nodes_images_buffer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../nodes/images/buffer */ "./src/core/pipeline/nodes/images/buffer.js");
/* harmony import */ var _nodes_images_pyramid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../nodes/images/pyramid */ "./src/core/pipeline/nodes/images/pyramid.js");
/* harmony import */ var _nodes_images_mixer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../nodes/images/mixer */ "./src/core/pipeline/nodes/images/mixer.js");
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
 * image-factory.js
 * Image-related nodes
 */









/**
 * Image nodes
 */
class SpeedyPipelineImageFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__["SpeedyNamespace"]
{
    /**
     * Create an image source
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageSource}
     */
    static Source(name = undefined)
    {
        return new _nodes_images_source__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineNodeImageSource"](name);
    }

    /**
     * Create an image sink
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageSink}
     */
    static Sink(name = undefined)
    {
        return new _nodes_images_sink__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineNodeImageSink"](name);
    }

    /**
     * Create an image multiplexer
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageMultiplexer}
     */
    static Multiplexer(name = undefined)
    {
        return new _nodes_images_multiplexer__WEBPACK_IMPORTED_MODULE_3__["SpeedyPipelineNodeImageMultiplexer"](name);
    }

    /**
     * Create an image buffer
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageBuffer}
     */
    static Buffer(name = undefined)
    {
        return new _nodes_images_buffer__WEBPACK_IMPORTED_MODULE_4__["SpeedyPipelineNodeImageBuffer"](name);
    }

    /**
     * Image Pyramid
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImagePyramid}
     */
    static Pyramid(name = undefined)
    {
        return new _nodes_images_pyramid__WEBPACK_IMPORTED_MODULE_5__["SpeedyPipelineNodeImagePyramid"](name);
    }

    /**
     * Image Mixer (blending)
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageMixer}
     */
    static Mixer(name = undefined)
    {
        return new _nodes_images_mixer__WEBPACK_IMPORTED_MODULE_6__["SpeedyPipelineNodeImageMixer"](name);
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
/* harmony import */ var _nodes_keypoints_source__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../nodes/keypoints/source */ "./src/core/pipeline/nodes/keypoints/source.js");
/* harmony import */ var _nodes_keypoints_sink__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../nodes/keypoints/sink */ "./src/core/pipeline/nodes/keypoints/sink.js");
/* harmony import */ var _nodes_keypoints_clipper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../nodes/keypoints/clipper */ "./src/core/pipeline/nodes/keypoints/clipper.js");
/* harmony import */ var _nodes_keypoints_buffer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../nodes/keypoints/buffer */ "./src/core/pipeline/nodes/keypoints/buffer.js");
/* harmony import */ var _nodes_keypoints_mixer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../nodes/keypoints/mixer */ "./src/core/pipeline/nodes/keypoints/mixer.js");
/* harmony import */ var _nodes_keypoints_transformer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../nodes/keypoints/transformer */ "./src/core/pipeline/nodes/keypoints/transformer.js");
/* harmony import */ var _nodes_keypoints_detectors_fast__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../nodes/keypoints/detectors/fast */ "./src/core/pipeline/nodes/keypoints/detectors/fast.js");
/* harmony import */ var _nodes_keypoints_detectors_harris__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../nodes/keypoints/detectors/harris */ "./src/core/pipeline/nodes/keypoints/detectors/harris.js");
/* harmony import */ var _nodes_keypoints_descriptors_orb__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../nodes/keypoints/descriptors/orb */ "./src/core/pipeline/nodes/keypoints/descriptors/orb.js");
/* harmony import */ var _nodes_keypoints_descriptors_discard__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../nodes/keypoints/descriptors/discard */ "./src/core/pipeline/nodes/keypoints/descriptors/discard.js");
/* harmony import */ var _nodes_keypoints_trackers_lk__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../nodes/keypoints/trackers/lk */ "./src/core/pipeline/nodes/keypoints/trackers/lk.js");
/* harmony import */ var _nodes_keypoints_trackers_ncc__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../nodes/keypoints/trackers/ncc */ "./src/core/pipeline/nodes/keypoints/trackers/ncc.js");
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
        return new _nodes_keypoints_detectors_fast__WEBPACK_IMPORTED_MODULE_7__["SpeedyPipelineNodeFASTKeypointDetector"](name);
    }

    /**
     * Harris corner detector
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeFASTKeypointDetector}
     */
    static Harris(name = undefined)
    {
        return new _nodes_keypoints_detectors_harris__WEBPACK_IMPORTED_MODULE_8__["SpeedyPipelineNodeHarrisKeypointDetector"](name);
    }
}

/**
 * Keypoint descriptors
 */
class SpeedyPipelineKeypointDescriptorFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__["SpeedyNamespace"]
{
    /**
     * ORB descriptors
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeORBKeypointDescriptor}
     */
    static ORB(name = undefined)
    {
        return new _nodes_keypoints_descriptors_orb__WEBPACK_IMPORTED_MODULE_9__["SpeedyPipelineNodeORBKeypointDescriptor"](name);
    }

    /**
     * Discard descriptors
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeDiscardKeypointDescriptor}
     */
    static Discard(name = undefined)
    {
        return new _nodes_keypoints_descriptors_discard__WEBPACK_IMPORTED_MODULE_10__["SpeedyPipelineNodeDiscardKeypointDescriptor"](name);
    }
}

/**
 * Keypoint trackers
 */
class SpeedyPipelineKeypointTrackerFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__["SpeedyNamespace"]
{
    /**
     * LK optical-flow
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeLKKeypointTracker}
     */
    static LK(name = undefined)
    {
        return new _nodes_keypoints_trackers_lk__WEBPACK_IMPORTED_MODULE_11__["SpeedyPipelineNodeLKKeypointTracker"](name);
    }

    /**
     * NCC-based tracking
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeNCCKeypointTracker}
     */
    static NCC(name = undefined)
    {
        return new _nodes_keypoints_trackers_ncc__WEBPACK_IMPORTED_MODULE_12__["SpeedyPipelineNodeNCCKeypointTracker"](name);
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

    /**
     * Keypoint descriptors
     * @returns {Function}
     */
    static get Descriptor()
    {
        return SpeedyPipelineKeypointDescriptorFactory;
    }

    /**
     * Keypoint trackers
     * @returns {Function}
     */
    static get Tracker()
    {
        return SpeedyPipelineKeypointTrackerFactory;
    }

    /**
     * Create a keypoint source
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointSource}
     */
    static Source(name = undefined)
    {
        return new _nodes_keypoints_source__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineNodeKeypointSource"](name);
    }

    /**
     * Create a keypoint sink
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointSink}
     */
    static Sink(name = undefined)
    {
        return new _nodes_keypoints_sink__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineNodeKeypointSink"](name);
    }

    /**
     * Keypoint clipper
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointClipper}
     */
    static Clipper(name = undefined)
    {
        return new _nodes_keypoints_clipper__WEBPACK_IMPORTED_MODULE_3__["SpeedyPipelineNodeKeypointClipper"](name);
    }

    /**
     * Create a keypoint buffer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointBuffer}
     */
    static Buffer(name = undefined)
    {
        return new _nodes_keypoints_buffer__WEBPACK_IMPORTED_MODULE_4__["SpeedyPipelineNodeKeypointBuffer"](name);
    }

    /**
     * Create a keypoint mixer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointMixer}
     */
    static Mixer(name = undefined)
    {
        return new _nodes_keypoints_mixer__WEBPACK_IMPORTED_MODULE_5__["SpeedyPipelineNodeKeypointMixer"](name);
    }

    /**
     * Create a keypoint transformer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointTransformer}
     */
    static Transformer(name = undefined)
    {
        return new _nodes_keypoints_transformer__WEBPACK_IMPORTED_MODULE_6__["SpeedyPipelineNodeKeypointTransformer"](name);
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
/* harmony import */ var _speedy_size__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../speedy-size */ "./src/core/speedy-size.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _speedy_matrix__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../speedy-matrix */ "./src/core/speedy-matrix.js");
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
        super(name, 1, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
        ]);

        /** @type {SpeedyMatrix} convolution kernel (square matrix) */
        this._kernel = _speedy_matrix__WEBPACK_IMPORTED_MODULE_10__["SpeedyMatrix"].Create(3, 3, [0, 0, 0, 0, 1, 0, 0, 0, 0]); // identity transform
    }

    /**
     * Convolution kernel
     * @returns {SpeedyMatrix}
     */
    get kernel()
    {
        return this._kernel;
    }

    /**
     * Convolution kernel
     * @param {SpeedyMatrix} kernel
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
        const outputTexture = this._tex[0];
        const ksize = this._kernel.rows;
        const conv = CONVOLUTION[ksize];
        const kernel = this._kernel.read();

        (gpu.programs.filters[conv]
            .outputs(width, height, outputTexture)
        )(image, kernel);

        this.output().swrite(outputTexture, format);
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
/* harmony import */ var _speedy_size__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../speedy-size */ "./src/core/speedy-size.js");
/* harmony import */ var _speedy_vector__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../speedy-vector */ "./src/core/speedy-vector.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
const DEFAULT_SIGMA = new _speedy_vector__WEBPACK_IMPORTED_MODULE_6__["SpeedyVector2"](0,0);

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
        super(name, 2, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
        ]);

        /** @type {SpeedySize} size of the kernel */
        this._kernelSize = new _speedy_size__WEBPACK_IMPORTED_MODULE_5__["SpeedySize"](5,5);

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
        _utils_utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].assert(kernelSize instanceof _speedy_size__WEBPACK_IMPORTED_MODULE_5__["SpeedySize"]);

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
        _utils_utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].assert(sigma instanceof _speedy_vector__WEBPACK_IMPORTED_MODULE_6__["SpeedyVector2"], `Sigma must be a SpeedyVector2`);
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
        const kernX = this._kernel.x;
        const kernY = this._kernel.y;
        const convX = CONVOLUTION_X[this._kernelSize.width];
        const convY = CONVOLUTION_Y[this._kernelSize.height];
        const tex = this._tex[0];
        const outputTexture = this._tex[1];

        (gpu.programs.filters[convX]
            .outputs(width, height, tex)
        )(image, kernX);

        (gpu.programs.filters[convY]
            .outputs(width, height, outputTexture)
        )(tex, kernY);

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
        super(name, 1, [
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
        const outputTexture = this._tex[0];
        const filters = gpu.programs.filters;

        filters.rgb2grey.outputs(width, height, outputTexture);
        filters.rgb2grey(image);

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
/* harmony import */ var _speedy_size__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../speedy-size */ "./src/core/speedy-size.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
        super(name, 1, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image).satisfying(
                msg => msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_7__["ImageFormat"].GREY
            ),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
        ]);

        /** @type {SpeedySize} size of the kernel (assumed to be square) */
        this._kernelSize = new _speedy_size__WEBPACK_IMPORTED_MODULE_5__["SpeedySize"](5,5);
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(kernelSize instanceof _speedy_size__WEBPACK_IMPORTED_MODULE_5__["SpeedySize"]);

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
        const ksize = this._kernelSize.width;
        const med = MEDIAN[ksize];
        const outputTexture = this._tex[0];

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
        super(name, 3, [
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
        const gain = this._gain;
        const offset = this._offset;
        const decay = this._decay;
        const quality = this._quality;
        const filters = gpu.programs.filters;
        const tmp = this._tex[0];
        const illuminationMap = this._tex[1];
        const outputTexture = this._tex[2];

        // compute illumination map
        if(quality == 'medium') {
            filters.illuminationMapX.outputs(width, height, tmp);
            filters.illuminationMapY.outputs(width, height, illuminationMap);
            filters.illuminationMapX(image);
            filters.illuminationMapY(tmp);
        }
        else if(quality == 'high') {
            filters.illuminationMapHiX.outputs(width, height, tmp);
            filters.illuminationMapHiY.outputs(width, height, illuminationMap);
            filters.illuminationMapHiX(image);
            filters.illuminationMapHiY(tmp);
        }
        else if(quality == 'low') {
            filters.illuminationMapLoX.outputs(width, height, tmp);
            filters.illuminationMapLoY.outputs(width, height, illuminationMap);
            filters.illuminationMapLoX(image);
            filters.illuminationMapLoY(tmp);
        }

        // run nightvision
        if(format === _utils_types__WEBPACK_IMPORTED_MODULE_7__["ImageFormat"].GREY) {
            filters.nightvisionGreyscale.outputs(width, height, outputTexture);
            filters.nightvisionGreyscale(image, illuminationMap, gain, offset, decay);
        }
        else if(format === _utils_types__WEBPACK_IMPORTED_MODULE_7__["ImageFormat"].RGBA) {
            filters.nightvision.outputs(width, height, outputTexture);
            filters.nightvision(image, illuminationMap, gain, offset, decay);
        }

        // done!
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
        super(name, 4, [
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
        const outputTexture = this._tex[3];
        let minValue = this._minValue;
        let maxValue = this._maxValue;

        if(minValue > maxValue)
            minValue = maxValue = (minValue + maxValue) / 2;

        const minmax = this._scanMinMax(gpu, image, _utils_types__WEBPACK_IMPORTED_MODULE_6__["PixelComponent"].GREEN);
        gpu.programs.filters.normalizeGreyscale.outputs(width, height, outputTexture);
        gpu.programs.filters.normalizeGreyscale(minmax, minValue, maxValue);

        this.output().swrite(outputTexture, format);
    }

    /**
     * Scan a single component in all pixels of the image and find the min & max intensities
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} image input image
     * @param {PixelComponent} pixelComponent a single PixelComponent flag
     * @returns {SpeedyDrawableTexture} RGBA = (max, min, max - min, original_pixel)
     */
    _scanMinMax(gpu, image, pixelComponent)
    {
        const tex = this._tex;
        const program = gpu.programs.utils;
        const width = image.width, height = image.height;
        const numIterations = Math.ceil(Math.log2(Math.max(width, height))) | 0;

        _utils_utils__WEBPACK_IMPORTED_MODULE_5__["Utils"].assert(_utils_types__WEBPACK_IMPORTED_MODULE_6__["ColorComponentId"][pixelComponent] !== undefined);

        program.copyComponents.outputs(width, height, tex[2]);
        program.scanMinMax2D.outputs(width, height, tex[0], tex[1]);
        
        let texture = program.copyComponents(image, image, _utils_types__WEBPACK_IMPORTED_MODULE_6__["PixelComponent"].ALL, _utils_types__WEBPACK_IMPORTED_MODULE_6__["ColorComponentId"][pixelComponent]);
        for(let i = 0; i < numIterations; i++)
            texture = program.scanMinMax2D(texture, i);

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
/* harmony import */ var _speedy_size__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../speedy-size */ "./src/core/speedy-size.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
        super(name, 2, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
        ]);

        /** @type {SpeedySize} size of the kernel */
        this._kernelSize = new _speedy_size__WEBPACK_IMPORTED_MODULE_5__["SpeedySize"](5,5);

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
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(kernelSize instanceof _speedy_size__WEBPACK_IMPORTED_MODULE_5__["SpeedySize"]);

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
        const kernX = this._kernel.x;
        const kernY = this._kernel.y;
        const convX = CONVOLUTION_X[this._kernelSize.width];
        const convY = CONVOLUTION_Y[this._kernelSize.height];
        const tex = this._tex[0];
        const outputTexture = this._tex[1];

        (gpu.programs.filters[convX]
            .outputs(width, height, tex)
        )(image, kernX);

        (gpu.programs.filters[convY]
            .outputs(width, height, outputTexture)
        )(tex, kernY);

        this.output().swrite(outputTexture, format);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/images/buffer.js":
/*!**************************************************!*\
  !*** ./src/core/pipeline/nodes/images/buffer.js ***!
  \**************************************************/
/*! exports provided: SpeedyPipelineNodeImageBuffer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeImageBuffer", function() { return SpeedyPipelineNodeImageBuffer; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * buffer.js
 * Image Buffer
 */













/**
 * Image Buffer: a node with memory.
 * At time t, it outputs the image received at time t-1
 */
class SpeedyPipelineNodeImageBuffer extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 2, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image)
        ]);

        /** @type {number} current page: 0 or 1 */
        this._pageIndex = 0;

        /** @type {boolean} first run? */
        this._initialized = false;

        /** @type {ImageFormat} previous image format */
        this._previousFormat = _utils_types__WEBPACK_IMPORTED_MODULE_3__["ImageFormat"].RGBA;
    }

    /**
     * Releases this node
     * @param {SpeedyGPU} gpu
     */
    release(gpu)
    {
        this._initialized = false;
        super.release(gpu);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = this.input().read();
        const previousFormat = this._previousFormat;
        const page = this._tex;
        const previousInputTexture = page[1 - this._pageIndex];
        const outputTexture = page[this._pageIndex];

        // can't store pyramids
        if(image.hasMipmaps())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__["NotSupportedError"](`Can't bufferize a pyramid`);

        // store input
        this._previousFormat = format;
        previousInputTexture.resize(image.width, image.height);
        image.copyTo(previousInputTexture);

        // page flipping
        this._pageIndex = 1 - this._pageIndex;

        // first run?
        if(!this._initialized) {
            this._initialized = true;
            this.output().swrite(previousInputTexture, format);
            return;
        }

        // done!
        this.output().swrite(outputTexture, previousFormat);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/images/mixer.js":
/*!*************************************************!*\
  !*** ./src/core/pipeline/nodes/images/mixer.js ***!
  \*************************************************/
/*! exports provided: SpeedyPipelineNodeImageMixer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeImageMixer", function() { return SpeedyPipelineNodeImageMixer; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
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
 * mixer.js
 * Image Mixer
 */











/**
 * Image Mixer
 */
class SpeedyPipelineNodeImageMixer extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])('in0').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])('in1').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
        ]);

        /** @type {number} alpha coefficient (applied to image0) */
        this._alpha = 0.5;

        /** @type {number} beta coefficient (applied to image1) */
        this._beta = 0.5;

        /** @type {number} gamma coefficient (brightness control) */
        this._gamma = 0.0;
    }

    /**
     * Alpha coefficient (applied to image0)
     * @returns {number}
     */
    get alpha()
    {
        return this._alpha;
    }

    /**
     * Alpha coefficient (applied to image0)
     * @param {number} value
     */
    set alpha(value)
    {
        this._alpha = +value;
    }

    /**
     * Beta coefficient (applied to image1)
     * @returns {number}
     */
    get beta()
    {
        return this._beta;
    }

    /**
     * Beta coefficient (applied to image1)
     * @param {number} value
     */
    set beta(value)
    {
        this._beta = +value;
    }

    /**
     * Gamma coefficient (brightness control)
     * @returns {number}
     */
    get gamma()
    {
        return this._gamma;
    }

    /**
     * Gamma coefficient (brightness control)
     * @param {number} value
     */
    set gamma(value)
    {
        this._gamma = +value;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const in0 = this.input('in0').read();
        const in1 = this.input('in1').read();
        const image0 = in0.image, image1 = in1.image;
        const format0 = in0.format, format1 = in1.format;
        const width = Math.max(image0.width, image1.width);
        const height = Math.max(image0.height, image1.height);
        const alpha = this._alpha, beta = this._beta, gamma = this._gamma;
        const outputTexture = this._tex[0];

        if(format0 != format1)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__["NotSupportedError"](`Can't mix images of different formats`);

        gpu.programs.transforms.additiveMix.outputs(width, height, outputTexture);
        gpu.programs.transforms.additiveMix(image0, image1, alpha, beta, gamma);

        this.output().swrite(outputTexture, format0);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/images/multiplexer.js":
/*!*******************************************************!*\
  !*** ./src/core/pipeline/nodes/images/multiplexer.js ***!
  \*******************************************************/
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
        super(name, 0, [
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

/***/ "./src/core/pipeline/nodes/images/pyramid.js":
/*!***************************************************!*\
  !*** ./src/core/pipeline/nodes/images/pyramid.js ***!
  \***************************************************/
/*! exports provided: SpeedyPipelineNodeImagePyramid */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeImagePyramid", function() { return SpeedyPipelineNodeImagePyramid; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/globals */ "./src/utils/globals.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * pyramid.js
 * Generate pyramid
 */











// Constants
const MAX_LEVELS = _utils_globals__WEBPACK_IMPORTED_MODULE_6__["PYRAMID_MAX_LEVELS"];
const MAX_TEXTURES = 2 * MAX_LEVELS - 1;

/**
 * Generate pyramid
 */
class SpeedyPipelineNodeImagePyramid extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, MAX_TEXTURES + 1, [
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
        const { image, format } = this.input().read();
        const outputTexture = this._tex[0];
        const pyramids = gpu.programs.pyramids;
        let width = image.width, height = image.height;

        // number of mipmap images according to the OpenGL ES 3.0 spec (sec 3.8.10.4)
        const mipLevels = 1 + Math.floor(Math.log2(Math.max(width, height)));

        // get work textures
        const mip = new Array(MAX_TEXTURES + 1);
        for(let i = MAX_TEXTURES; i >= 1; i--)
            mip[i] = this._tex[i];
        mip[0] = image;

        // generate gaussian pyramid
        const numLevels = Math.min(mipLevels, MAX_LEVELS);
        for(let level = 1; level < numLevels; level++) {
            // use max(1, floor(size / 2^lod)), in accordance to
            // the OpenGL ES 3.0 spec sec 3.8.10.4 (Mipmapping)
            const halfWidth = Math.max(1, width >>> 1);
            const halfHeight = Math.max(1, height >>> 1);

            // reduce operation
            const tmp = (level - 1) + MAX_LEVELS;
            (pyramids.smoothX.outputs(width, height, mip[tmp]))(mip[level-1]);
            (pyramids.smoothY.outputs(width, height, mip[level-1]))(mip[tmp]);
            (pyramids.downsample2.outputs(halfWidth, halfHeight, mip[level]))(mip[level-1]);

            // next level
            width = halfWidth;
            height = halfHeight;
        }

        // copy to output & set mipmap
        outputTexture.resize(image.width, image.height);
        outputTexture.clear();
        image.copyTo(outputTexture);
        outputTexture.generateMipmaps(mip.slice(0, numLevels));

        // done!
        this.output().swrite(outputTexture, format);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/images/sink.js":
/*!************************************************!*\
  !*** ./src/core/pipeline/nodes/images/sink.js ***!
  \************************************************/
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
    constructor(name = 'image')
    {
        super(name, 0, [
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

/***/ "./src/core/pipeline/nodes/images/source.js":
/*!**************************************************!*\
  !*** ./src/core/pipeline/nodes/images/source.js ***!
  \**************************************************/
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
        super(name, 1, [
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
        if(!(media instanceof _speedy_media__WEBPACK_IMPORTED_MODULE_5__["SpeedyMedia"]))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__["IllegalArgumentError"](`Not a SpeedyMedia: ${media}`);

        this._media = media;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const outputTexture = this._tex[0];

        if(this._media == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__["IllegalOperationError"](`Did you forget to set the media of ${this.fullName}?`);

        gpu.upload(this._media._source, outputTexture);
        this.output().swrite(outputTexture, _utils_types__WEBPACK_IMPORTED_MODULE_7__["ImageFormat"].RGBA);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/buffer.js":
/*!*****************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/buffer.js ***!
  \*****************************************************/
/*! exports provided: SpeedyPipelineNodeKeypointBuffer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeKeypointBuffer", function() { return SpeedyPipelineNodeKeypointBuffer; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _detectors_detector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./detectors/detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * buffer.js
 * Keypoint Buffer
 */












/**
 * Keypoint Buffer: a node with memory.
 * At time t, it outputs the keypoints received at time t-1
 */
class SpeedyPipelineNodeKeypointBuffer extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 2, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineMessageType"].Keypoints),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineMessageType"].Keypoints)
        ]);

        /** @type {number} current page: 0 or 1 */
        this._pageIndex = 0;

        /** @type {boolean} first run? */
        this._initialized = false;

        /** @type {number} previous descriptor size, in bytes */
        this._previousDescriptorSize = 0;

        /** @type {number} previous extra size, in bytes */
        this._previousExtraSize = 0;

        /** @type {number} previous encoder length */
        this._previousEncoderLength = 0;
    }

    /**
     * Releases this node
     * @param {SpeedyGPU} gpu
     */
    release(gpu)
    {
        this._initialized = false;
        super.release(gpu);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = this.input().read();
        const previousDescriptorSize = this._previousDescriptorSize;
        const previousExtraSize = this._previousExtraSize;
        const previousEncoderLength = this._previousEncoderLength;
        const page = this._tex;
        const previousInputTexture = page[1 - this._pageIndex];
        const outputTexture = page[this._pageIndex];

        // store input
        this._previousDescriptorSize = descriptorSize;
        this._previousExtraSize = extraSize;
        this._previousEncoderLength = encoderLength;
        previousInputTexture.resize(encoderLength, encoderLength);
        encodedKeypoints.copyTo(previousInputTexture);

        // page flipping
        this._pageIndex = 1 - this._pageIndex;

        // first run?
        if(!this._initialized) {
            this._initialized = true;
            this.output().swrite(previousInputTexture, descriptorSize, extraSize, encoderLength);
            return;
        }

        // done!
        this.output().swrite(outputTexture, previousDescriptorSize, previousExtraSize, previousEncoderLength);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/clipper.js":
/*!******************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/clipper.js ***!
  \******************************************************/
/*! exports provided: SpeedyPipelineNodeKeypointClipper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeKeypointClipper", function() { return SpeedyPipelineNodeKeypointClipper; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _detectors_detector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./detectors/detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/globals */ "./src/utils/globals.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * clipper.js
 * Keypoint clipper
 */












// Constants
const LOG2_STRIDE = 5;
const MAX_SIZE = _utils_globals__WEBPACK_IMPORTED_MODULE_7__["MAX_ENCODER_CAPACITY"];



/**
 * Keypoint clipper: filters the best keypoints from a stream
 */
class SpeedyPipelineNodeKeypointClipper extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 4, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineMessageType"].Keypoints).satisfying(
                msg => msg.descriptorSize == 0 && msg.extraSize == 0
            ),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineMessageType"].Keypoints)
        ]);

        /** @type {number} the maximum number of keypoints in the output */
        this._size = MAX_SIZE;
    }

    /**
     * The maximum number of keypoints in the output
     * @returns {number}
     */
    get size()
    {
        return this._size;
    }

    /**
     * The maximum number of keypoints in the output
     * @param {number} size
     */
    set size(size)
    {
        this._size = Math.max(0, Math.min(size | 0, MAX_SIZE));
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = this.input().read();
        const keypoints = gpu.programs.keypoints;
        const clipValue = this._size;
        const tex = this._tex;
        const outputTexture = this._tex[3];

        // find the minimum power of 2 pot such that pot >= capacity
        const capacity = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineNodeKeypointDetector"].encoderCapacity(descriptorSize, extraSize, encoderLength);
        //const pot = 1 << (Math.ceil(Math.log2(capacity)) | 0);

        // find the dimensions of the sorting shaders
        const stride = 1 << LOG2_STRIDE; // must be a power of 2
        //const height = Math.max(1, pot >>> LOG2_STRIDE); // this is also a power of 2
        const height = Math.ceil(capacity / stride); // more economical, maybe not a power of 2
        const numberOfPixels = stride * height;

        // find the dimensions of the output texture
        const newCapacity = Math.min(capacity, clipValue);
        const newEncoderLength = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineNodeKeypointDetector"].encoderLength(newCapacity, descriptorSize, extraSize);

        // generate permutation of keypoints
        keypoints.sortCreatePermutation.outputs(stride, height, tex[0]);
        let permutation = keypoints.sortCreatePermutation(encodedKeypoints, descriptorSize, extraSize, encoderLength);

        // sort permutation
        const numPasses = Math.ceil(Math.log2(numberOfPixels));
        keypoints.sortMergePermutation.outputs(stride, height, tex[1], tex[2]);
        for(let i = 1; i <= numPasses; i++) {
            const blockSize = 1 << i; // 2, 4, 8...
            const dblLog2BlockSize = i << 1; // 2 * log2(blockSize)
            permutation = keypoints.sortMergePermutation(permutation, blockSize, dblLog2BlockSize);
        }

        // apply permutation
        keypoints.sortApplyPermutation.outputs(newEncoderLength, newEncoderLength, outputTexture);
        keypoints.sortApplyPermutation(permutation, newCapacity, encodedKeypoints, descriptorSize, extraSize);

        /*
        // debug (read the contents of the permutation)
        const pixels = this._inspect(permutation), debug = [];
        for(let i = 0; i < pixels.length; i += 4) {
            let id = pixels[i] | (pixels[i+1] << 8);
            let score = pixels[i+2] / 255.0;
            let valid = pixels[i+3] / 255.0;
            debug.push([ id, valid, score, ].join(', '));
        }
        console.log(debug);
        */

        // done!
        this.output().swrite(outputTexture, descriptorSize, extraSize, newEncoderLength);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/descriptors/descriptor.js":
/*!*********************************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/descriptors/descriptor.js ***!
  \*********************************************************************/
/*! exports provided: SpeedyPipelineNodeKeypointDescriptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeKeypointDescriptor", function() { return SpeedyPipelineNodeKeypointDescriptor; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _detectors_detector__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../detectors/detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../utils/utils */ "./src/utils/utils.js");
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
 * descriptor.js
 * Abstract keypoint descriptor
 */








/**
 * Abstract keypoint descriptor
 * @abstract
 */
class SpeedyPipelineNodeKeypointDescriptor extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     * @param {number} [texCount] number of work textures
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = undefined, texCount = 0, portBuilders = undefined)
    {
        super(name, texCount + 1, portBuilders);
    }

    /**
     * 
     * Allocate space for keypoint descriptors
     * @param {SpeedyGPU} gpu
     * @param {number} inputDescriptorSize should be 0
     * @param {number} inputExtraSize must be non-negative
     * @param {number} outputDescriptorSize in bytes, must be a multiple of 4
     * @param {number} outputExtraSize must be inputExtraSize
     * @param {SpeedyTexture} inputEncodedKeypoints input with no descriptors
     * @returns {SpeedyDrawableTexture} encodedKeypoints
     */
    _allocateDescriptors(gpu, inputDescriptorSize, inputExtraSize, outputDescriptorSize, outputExtraSize, inputEncodedKeypoints)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_5__["Utils"].assert(inputDescriptorSize >= 0 && inputExtraSize >= 0);
        _utils_utils__WEBPACK_IMPORTED_MODULE_5__["Utils"].assert(outputDescriptorSize >= 0 && outputDescriptorSize % 4 === 0 && outputExtraSize === inputExtraSize);

        const inputEncoderLength = inputEncodedKeypoints.width;
        const inputEncoderCapacity = _detectors_detector__WEBPACK_IMPORTED_MODULE_4__["SpeedyPipelineNodeKeypointDetector"].encoderCapacity(inputDescriptorSize, inputExtraSize, inputEncoderLength);
        const outputEncoderCapacity = inputEncoderCapacity;
        const outputEncoderLength = _detectors_detector__WEBPACK_IMPORTED_MODULE_4__["SpeedyPipelineNodeKeypointDetector"].encoderLength(outputEncoderCapacity, outputDescriptorSize, outputExtraSize);

        const tex = this._tex[this._tex.length - 1];
        return (gpu.programs.keypoints.allocateDescriptors
            .outputs(outputEncoderLength, outputEncoderLength, tex)
        )(inputEncodedKeypoints, inputDescriptorSize, inputExtraSize, inputEncoderLength, outputDescriptorSize, outputExtraSize, outputEncoderLength);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/descriptors/discard.js":
/*!******************************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/descriptors/discard.js ***!
  \******************************************************************/
/*! exports provided: SpeedyPipelineNodeDiscardKeypointDescriptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeDiscardKeypointDescriptor", function() { return SpeedyPipelineNodeDiscardKeypointDescriptor; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _detectors_detector__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../detectors/detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _descriptor__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./descriptor */ "./src/core/pipeline/nodes/keypoints/descriptors/descriptor.js");
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
 * discard.js
 * Discard keypoint descriptors
 */












/**
 * Discard keypoint descriptors
 */
class SpeedyPipelineNodeDiscardKeypointDescriptor extends _descriptor__WEBPACK_IMPORTED_MODULE_9__["SpeedyPipelineNodeKeypointDescriptor"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 0, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Keypoints).satisfying(
                msg => msg.descriptorSize > 0
            ),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Keypoints),
        ]);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = this.input().read();

        // allocate space
        const outputTexture = this._allocateDescriptors(gpu, descriptorSize, extraSize, 0, extraSize, encodedKeypoints);
        const newEncoderLength = outputTexture.width;

        // discard descriptors
        (gpu.programs.keypoints.discardDescriptors
            .outputs(newEncoderLength, newEncoderLength, outputTexture)
        )(encodedKeypoints, descriptorSize, extraSize, encoderLength, newEncoderLength);

        // done!
        this.output().swrite(outputTexture, 0, extraSize, newEncoderLength);
    }
}


/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/descriptors/orb.js":
/*!**************************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/descriptors/orb.js ***!
  \**************************************************************/
/*! exports provided: SpeedyPipelineNodeORBKeypointDescriptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeORBKeypointDescriptor", function() { return SpeedyPipelineNodeORBKeypointDescriptor; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _detectors_detector__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../detectors/detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _descriptor__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./descriptor */ "./src/core/pipeline/nodes/keypoints/descriptors/descriptor.js");
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
 * orb.js
 * ORB descriptors
 */












// Constants
const DESCRIPTOR_SIZE = 32; // 256 bits

/**
 * ORB descriptors
 */
class SpeedyPipelineNodeORBKeypointDescriptor extends _descriptor__WEBPACK_IMPORTED_MODULE_9__["SpeedyPipelineNodeKeypointDescriptor"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 3, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])('image').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image).satisfying(
                msg => msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_5__["ImageFormat"].GREY && msg.image.hasMipmaps()
            ),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])('keypoints').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Keypoints).satisfying(
                msg => msg.descriptorSize == 0 && msg.extraSize == 0
            ),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Keypoints),
        ]);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = this.input('keypoints').read();
        const pyramid = this.input('image').read().image;
        const tex = this._tex;
        const outputTexture = this._tex[2];

        // compute orientation
        const capacity = _detectors_detector__WEBPACK_IMPORTED_MODULE_8__["SpeedyPipelineNodeKeypointDetector"].encoderCapacity(descriptorSize, extraSize, encoderLength);
        const orientationEncoderLength = Math.max(1, Math.ceil(Math.sqrt(capacity))); // 1 pixel per keypoint
        const encodedOrientations = (gpu.programs.keypoints.orbOrientation
            .outputs(orientationEncoderLength, orientationEncoderLength, tex[0])
        )(pyramid, encodedKeypoints, descriptorSize, extraSize, encoderLength);
        const orientedKeypoints = (gpu.programs.keypoints.transferOrientation
            .outputs(encoderLength, encoderLength, tex[1])
        )(encodedOrientations, encodedKeypoints, descriptorSize, extraSize, encoderLength);

        // allocate space
        const encodedKps = this._allocateDescriptors(gpu, descriptorSize, extraSize, DESCRIPTOR_SIZE, extraSize, orientedKeypoints);
        const newEncoderLength = encodedKps.width;

        // compute descriptors (it's a good idea to blur the pyramid)
        const describedKeypoints = (gpu.programs.keypoints.orbDescriptor
            .outputs(newEncoderLength, newEncoderLength, outputTexture)
        )(pyramid, encodedKps, extraSize, newEncoderLength);

        // done!
        this.output().swrite(describedKeypoints, DESCRIPTOR_SIZE, extraSize, newEncoderLength);
    }
}


/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/detectors/detector.js":
/*!*****************************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/detectors/detector.js ***!
  \*****************************************************************/
/*! exports provided: SpeedyPipelineNodeKeypointDetector, SpeedyPipelineNodeMultiscaleKeypointDetector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeKeypointDetector", function() { return SpeedyPipelineNodeKeypointDetector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeMultiscaleKeypointDetector", function() { return SpeedyPipelineNodeMultiscaleKeypointDetector; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../utils/globals */ "./src/utils/globals.js");
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
 * detector.js
 * Abstract keypoint detectors
 */










// Constants
const ENCODER_PASSES = 8; // number of passes of the keypoint encoder: directly impacts performance
const LONG_SKIP_OFFSET_PASSES = 2; // number of passes of the long skip offsets shader
const MAX_CAPACITY = _utils_globals__WEBPACK_IMPORTED_MODULE_7__["MAX_ENCODER_CAPACITY"]; // maximum capacity of the encoder (up to this many keypoints can be stored)
const DEFAULT_CAPACITY = 2048; // default capacity of the encoder (64x64 texture with 2 pixels per keypoint)
const DEFAULT_SCALE_FACTOR = 1.4142135623730951; // sqrt(2)

/**
 * Abstract keypoint detector
 * @abstract
 */
class SpeedyPipelineNodeKeypointDetector extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     * @param {number} [texCount] number of work textures
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = undefined, texCount = 0, portBuilders = undefined)
    {
        super(name, texCount + 4, portBuilders);

        /** @type {number} encoder capacity */
        this._capacity = DEFAULT_CAPACITY; // must not be greater than MAX_ENCODER_CAPACITY
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
        this._capacity = Math.min(Math.max(0, capacity | 0), MAX_CAPACITY);
    }

    /**
     * Create a tiny texture with encoded keypoints out of
     * an encoded corners texture
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} corners input
     * @param {SpeedyDrawableTexture} encodedKeypoints output
     * @param {number} [descriptorSize] in bytes
     * @param {number} [extraSize] in bytes
     * @returns {SpeedyDrawableTexture} encodedKeypoints
     */
    _encodeKeypoints(gpu, corners, encodedKeypoints, descriptorSize = 0, extraSize = 0)
    {
        const capacity = this._capacity;
        const encoderLength = SpeedyPipelineNodeKeypointDetector.encoderLength(capacity, descriptorSize, extraSize);
        const width = corners.width, height = corners.height;
        const imageSize = [ width, height ];
        const tex = this._tex.slice(this._tex.length - 4);
        const keypoints = gpu.programs.keypoints;

        // prepare programs
        keypoints.encodeKeypointSkipOffsets.outputs(width, height, tex[0]);
        keypoints.encodeKeypointLongSkipOffsets.outputs(width, height, tex[1], tex[0]);
        keypoints.encodeKeypointPositions.outputs(encoderLength, encoderLength, tex[2], tex[3]);
        keypoints.encodeKeypointProperties.outputs(encoderLength, encoderLength, encodedKeypoints);

        // encode skip offsets
        let offsets = keypoints.encodeKeypointSkipOffsets(corners, imageSize);
        for(let i = 0; i < LONG_SKIP_OFFSET_PASSES; i++) // to boost performance
            offsets = keypoints.encodeKeypointLongSkipOffsets(offsets, imageSize);

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

        // encode keypoint positions
        let encodedKps = tex[3].clear();
        for(let j = 0; j < ENCODER_PASSES; j++)
            encodedKps = keypoints.encodeKeypointPositions(offsets, imageSize, j, ENCODER_PASSES, capacity, encodedKps, descriptorSize, extraSize, encoderLength);

        // encode keypoint properties
        return keypoints.encodeKeypointProperties(corners, encodedKps, descriptorSize, extraSize, encoderLength);
    }

    /**
     * Create a tiny texture with zero encoded keypoints
     * @param {SpeedyGPU} gpu
     * @param {SpeedyDrawableTexture} encodedKeypoints output texture
     * @param {number} [descriptorSize] in bytes
     * @param {number} [extraSize] in bytes
     * @returns {SpeedyDrawableTexture} encodedKeypoints
     */
    _encodeZeroKeypoints(gpu, encodedKeypoints, descriptorSize = 0, extraSize = 0)
    {
        const capacity = 0;
        const encoderLength = SpeedyPipelineNodeKeypointDetector.encoderLength(capacity, descriptorSize, extraSize);
        const keypoints = gpu.programs.keypoints;

        keypoints.encodeNullKeypoints.outputs(encoderLength, encoderLength, encodedKeypoints);
        keypoints.encodeNullKeypoints();

        return encodedKeypoints;
    }

    /**
     * Compute the length of the keypoint encoder, given its capacity
     * @param {number} encoderCapacity how many keypoints can we fit?
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     */
    static encoderLength(encoderCapacity, descriptorSize, extraSize)
    {
        const pixelsPerKeypoint = Math.ceil((_utils_globals__WEBPACK_IMPORTED_MODULE_7__["MIN_KEYPOINT_SIZE"] + descriptorSize + extraSize) / 4);
        const numberOfPixels = encoderCapacity * pixelsPerKeypoint;

        return Math.max(_utils_globals__WEBPACK_IMPORTED_MODULE_7__["MIN_ENCODER_LENGTH"], Math.ceil(Math.sqrt(numberOfPixels)));
    }

    /**
     * The maximum number of keypoints we can store using
     * a particular configuration of a keypoint encoder
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     */
    static encoderCapacity(descriptorSize, extraSize, encoderLength)
    {
        const pixelsPerKeypoint = Math.ceil((_utils_globals__WEBPACK_IMPORTED_MODULE_7__["MIN_KEYPOINT_SIZE"] + descriptorSize + extraSize) / 4);
        const numberOfPixels = encoderLength * encoderLength;

        return Math.floor(numberOfPixels / pixelsPerKeypoint);
    }
}

/**
 * Abstract scale-space keypoint detector
 * @abstract
 */
class SpeedyPipelineNodeMultiscaleKeypointDetector extends SpeedyPipelineNodeKeypointDetector
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     * @param {number} [texCount] number of work textures
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = undefined, texCount = undefined, portBuilders = undefined)
    {
        super(name, texCount, portBuilders);

        /** @type {number} number of pyramid levels */
        this._levels = 1;

        /** @type {number} scale factor between two pyramid levels */
        this._scaleFactor = DEFAULT_SCALE_FACTOR;
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
        this._levels = Math.max(1, levels | 0);
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
/* harmony import */ var _detector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../utils/globals */ "./src/utils/globals.js");
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












// Constants
const DEFAULT_THRESHOLD = 20;



/**
 * FAST corner detector
 */
class SpeedyPipelineNodeFASTKeypointDetector extends _detector__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNodeMultiscaleKeypointDetector"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 4, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image).satisfying(
                msg => msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_5__["ImageFormat"].GREY
            ),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Keypoints),
        ]);

        /** @type {number} FAST threshold in [0,255] */
        this._threshold = DEFAULT_THRESHOLD;
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
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const image = this.input().read().image;
        const width = image.width, height = image.height;
        const tex = this._tex;
        const outputTexture = this._tex[3];
        const capacity = this._capacity;
        const threshold = this._threshold;
        const lodStep = Math.log2(this.scaleFactor);
        const levels = this.levels;
        const keypoints = gpu.programs.keypoints;
        const nonmax = levels > 1 ? keypoints.pyrnonmax : keypoints.nonmax;

        // validate pyramid
        if(!(levels == 1 || image.hasMipmaps()))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__["IllegalOperationError"](`Expected a pyramid in ${this.fullName}`);

        // skip if the capacity is zero
        if(capacity == 0) {
            const encodedKeypoints = this._encodeZeroKeypoints(gpu, outputTexture);
            const encoderLength = encodedKeypoints.width;
            this.output().swrite(encodedKeypoints, 0, 0, encoderLength);
            return;
        }

        // FAST
        keypoints.fast9_16.outputs(width, height, tex[0], tex[1]);
        let corners = tex[1].clear();
        let last = Math.min(_utils_globals__WEBPACK_IMPORTED_MODULE_9__["PYRAMID_MAX_LEVELS"] - 1, (levels - 1) * lodStep);
        for(let i = 0, lod = 0.0; i < levels && lod < _utils_globals__WEBPACK_IMPORTED_MODULE_9__["PYRAMID_MAX_LEVELS"]; i++, lod += lodStep)
            corners = keypoints.fast9_16(corners, image, last - lod, threshold);

        // non-maximum suppression
        const finalCorners = (nonmax
            .outputs(width, height, tex[2])
        )(corners, lodStep);

        // encode keypoints
        const encodedKeypoints = this._encodeKeypoints(gpu, finalCorners, outputTexture);
        const encoderLength = encodedKeypoints.width;

        // done!
        this.output().swrite(encodedKeypoints, 0, 0, encoderLength);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/detectors/harris.js":
/*!***************************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/detectors/harris.js ***!
  \***************************************************************/
/*! exports provided: SpeedyPipelineNodeHarrisKeypointDetector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeHarrisKeypointDetector", function() { return SpeedyPipelineNodeHarrisKeypointDetector; });
/* harmony import */ var _detector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _speedy_size__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../speedy-size */ "./src/core/speedy-size.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../utils/globals */ "./src/utils/globals.js");
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













// Constants
const DEFAULT_QUALITY = 0.1;
const HARRIS = {
    1: 'harris1',
    3: 'harris3',
    5: 'harris5',
    7: 'harris7',
};


/**
 * Harris corner detector
 */
class SpeedyPipelineNodeHarrisKeypointDetector extends _detector__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNodeMultiscaleKeypointDetector"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 4, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image).satisfying(
                msg => msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_5__["ImageFormat"].GREY
            ),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Keypoints),
        ]);

        /** @type {SpeedySize} neighborhood size */
        this._windowSize = new _speedy_size__WEBPACK_IMPORTED_MODULE_6__["SpeedySize"](3, 3);

        /** @type {number} min corner quality in [0,1] */
        this._quality = DEFAULT_QUALITY;
    }

    /**
     * Minimum corner quality in [0,1] - this is a fraction of
     * the largest min. eigenvalue of the autocorrelation matrix
     * over the entire image
     * @returns {number}
     */
    get quality()
    {
        return this._quality;
    }

    /**
     * Minimum corner quality in [0,1]
     * @param {number} quality
     */
    set quality(quality)
    {
        this._quality = Math.max(0.0, Math.min(+quality, 1.0));
    }

    /**
     * Neighborhood size
     * @returns {SpeedySize}
     */
    get windowSize()
    {
        return this._windowSize;
    }

    /**
     * Neighborhood size
     * @param {SpeedySize} windowSize
     */
    set windowSize(windowSize)
    {
        const d = windowSize.width;
        if(!((d == windowSize.height) && (d == 1 || d == 3 || d == 5 || d == 7)))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__["IllegalArgumentError"](`Invalid window: ${windowSize}. Acceptable sizes: 1x1, 3x3, 5x5, 7x7`);

        this._windowSize = windowSize;
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
        const tex = this._tex;
        const outputTexture = this._tex[3];
        const capacity = this._capacity;
        const quality = this._quality;
        const windowSize = this._windowSize;
        const lodStep = Math.log2(this.scaleFactor);
        const levels = this.levels;
        const keypoints = gpu.programs.keypoints;
        const nonmax = levels > 1 ? keypoints.pyrnonmax : keypoints.nonmax;
        const harris = keypoints[HARRIS[windowSize.width]];

        // validate pyramid
        if(!(levels == 1 || image.hasMipmaps()))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__["IllegalOperationError"](`Expected a pyramid in ${this.fullName}`);

        // skip if the capacity is zero
        if(capacity == 0) {
            const encodedKeypoints = this._encodeZeroKeypoints(gpu, outputTexture);
            const encoderLength = encodedKeypoints.width;
            this.output().swrite(encodedKeypoints, 0, 0, encoderLength);
            return;
        }

        // compute corner response map
        harris.outputs(width, height, tex[0], tex[1]);
        keypoints.harrisDerivatives.outputs(width, height, tex[2]);
        let corners = tex[1].clear();
        for(let i = 0, lod = 0.0; i < levels && lod < _utils_globals__WEBPACK_IMPORTED_MODULE_10__["PYRAMID_MAX_LEVELS"]; i++, lod += lodStep) {
            const derivatives = keypoints.harrisDerivatives(image, lod);
            corners = harris(corners, derivatives, lod);
        }

        // non-maximum suppression
        const suppressedCorners = (nonmax
            .outputs(width, height, tex[2])
        )(corners, lodStep);

        // find the maximum corner response over the entire image
        keypoints.harrisScoreFindMax.outputs(width, height, tex[0], tex[1]);
        const npasses = Math.ceil(Math.log2(Math.max(width, height)));
        let maxScore = suppressedCorners;
        for(let j = 0; j < npasses; j++)
            maxScore = keypoints.harrisScoreFindMax(maxScore, j);

        // discard corners below a quality level
        const niceCorners = (keypoints.harrisScoreCutoff
            .outputs(width, height, maxScore == tex[0] ? tex[1] : tex[0])
        )(suppressedCorners, maxScore, quality);

        // encode keypoints
        const encodedKeypoints = this._encodeKeypoints(gpu, niceCorners, outputTexture);
        const encoderLength = encodedKeypoints.width;

        // done!
        this.output().swrite(encodedKeypoints, 0, 0, encoderLength);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/mixer.js":
/*!****************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/mixer.js ***!
  \****************************************************/
/*! exports provided: SpeedyPipelineNodeKeypointMixer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeKeypointMixer", function() { return SpeedyPipelineNodeKeypointMixer; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _detectors_detector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./detectors/detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/globals */ "./src/utils/globals.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * mixer.js
 * Keypoint Mixer
 */













// Constants
const LOG2_STRIDE = 5;



/**
 * Keypoint Mixer: merges two sets of keypoints
 */
class SpeedyPipelineNodeKeypointMixer extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 5, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__["InputPort"])('in0').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineMessageType"].Keypoints),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__["InputPort"])('in1').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineMessageType"].Keypoints),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineMessageType"].Keypoints)
        ]);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const kps0 = this.input('in0').read();
        const kps1 = this.input('in1').read();
        const descriptorSize = kps0.descriptorSize;
        const extraSize = kps0.extraSize;
        const keypoints = gpu.programs.keypoints;
        const tex = this._tex;
        const outputTexture = this._tex[4];

        // ensure that the format of kps0 equals the format of kps1
        if(!(kps0.descriptorSize === kps1.descriptorSize && kps0.extraSize === kps0.extraSize))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__["IllegalOperationError"](`Can't merge two sets of keypoints that have different formats`);

        // find the capacity of kps0 + kps1
        const cap0 = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineNodeKeypointDetector"].encoderCapacity(kps0.descriptorSize, kps0.extraSize, kps0.encoderLength);
        const cap1 = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineNodeKeypointDetector"].encoderCapacity(kps1.descriptorSize, kps1.extraSize, kps1.encoderLength);
        const capacity = cap0 + cap1;

        // find the dimensions of the output texture
        const encoderLength = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineNodeKeypointDetector"].encoderLength(capacity, descriptorSize, extraSize);

        // mix keypoints
        keypoints.mixKeypoints.outputs(encoderLength, encoderLength, tex[3]);
        const mixedKeypoints = keypoints.mixKeypoints(
            [ kps0.encodedKeypoints, kps1.encodedKeypoints ],
            [ kps0.encoderLength, kps1.encoderLength ],
            [ cap0, cap1 ],
            descriptorSize,
            extraSize,
            encoderLength
        );

        // find the dimensions of the sorting shaders
        const stride = 1 << LOG2_STRIDE; // must be a power of 2
        const height = Math.ceil(capacity / stride);
        const numberOfPixels = stride * height;

        // generate permutation of keypoints
        keypoints.sortCreatePermutation.outputs(stride, height, tex[0]);
        let permutation = keypoints.sortCreatePermutation(mixedKeypoints, descriptorSize, extraSize, encoderLength);

        // sort permutation
        const numPasses = Math.ceil(Math.log2(numberOfPixels));
        keypoints.sortMergePermutation.outputs(stride, height, tex[1], tex[2]);
        for(let i = 1; i <= numPasses; i++) {
            const blockSize = 1 << i; // 2, 4, 8...
            const dblLog2BlockSize = i << 1; // 2 * log2(blockSize)
            permutation = keypoints.sortMergePermutation(permutation, blockSize, dblLog2BlockSize);
        }

        // apply permutation
        keypoints.sortApplyPermutation.outputs(encoderLength, encoderLength, outputTexture);
        keypoints.sortApplyPermutation(permutation, capacity, mixedKeypoints, descriptorSize, extraSize);

        // done!
        this.output().swrite(outputTexture, descriptorSize, extraSize, encoderLength);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/sink.js":
/*!***************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/sink.js ***!
  \***************************************************/
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
/* harmony import */ var _speedy_keypoint_descriptor__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../speedy-keypoint-descriptor */ "./src/core/speedy-keypoint-descriptor.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../utils/globals */ "./src/utils/globals.js");
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
 * sink.js
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
    constructor(name = 'keypoints')
    {
        super(name, 0, [
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

        return this._textureReader.readPixelsAsync(encodedKeypoints).then(pixels => {
            this._keypoints = SpeedyPipelineNodeKeypointSink._decode(pixels, descriptorSize, extraSize, encoderLength);
        });
    }

    /**
     * Decode a sequence of keypoints, given a flattened image of encoded pixels
     * @param {Uint8Array} pixels pixels in the [r,g,b,a,...] format
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     * @returns {SpeedyKeypoint[]} keypoints
     */
    static _decode(pixels, descriptorSize, extraSize, encoderLength)
    {
        const bytesPerKeypoint = _utils_globals__WEBPACK_IMPORTED_MODULE_13__["MIN_KEYPOINT_SIZE"] + descriptorSize + extraSize;
        const m = _utils_globals__WEBPACK_IMPORTED_MODULE_13__["LOG2_PYRAMID_MAX_SCALE"], h = _utils_globals__WEBPACK_IMPORTED_MODULE_13__["PYRAMID_MAX_LEVELS"];
        const piOver255 = Math.PI / 255.0;
        const keypoints = [];
        let x, y, z, w, lod, rotation, score;
        let descriptorBytes, extraBytes, descriptor;

        // how many bytes should we read?
        const e = encoderLength;
        const e2 = e * e * bytesPerKeypoint;
        const size = Math.min(pixels.length, e2);

        // copy the data (we use shared buffers when receiving pixels[])
        if(descriptorSize + extraSize > 0)
            pixels = new Uint8Array(pixels);

        // for each encoded keypoint
        for(let i = 0; i < size; i += bytesPerKeypoint) {
            // extract encoded header
            x = (pixels[i+1] << 8) | pixels[i];
            y = (pixels[i+3] << 8) | pixels[i+2];
            z = (pixels[i+5] << 8) | pixels[i+4];
            w = (pixels[i+7] << 8) | pixels[i+6];

            // the keypoint is "null": we have reached the end of the list
            if(x >= 0xFFFF && y >= 0xFFFF)
                break;

            // the header is zero: discard the keypoint
            if(x + y + z + w == 0)
                continue;

            // extract extra & descriptor bytes
            if(extraSize > 0) {
                extraBytes = pixels.subarray(8 + i, 8 + i + extraSize);
                if(extraBytes.byteLength < extraSize)
                    continue; // something is off here; discard
            }
            if(descriptorSize > 0) {
                descriptorBytes = pixels.subarray(8 + i + extraSize, 8 + i + extraSize + descriptorSize);
                if(descriptorBytes.byteLength < descriptorSize)
                    continue; // something is off here; discard
            }

            // decode position: convert from fixed-point
            x /= _utils_globals__WEBPACK_IMPORTED_MODULE_13__["FIX_RESOLUTION"];
            y /= _utils_globals__WEBPACK_IMPORTED_MODULE_13__["FIX_RESOLUTION"];

            // decode level-of-detail
            lod = (pixels[i+4] < 255) ? -m + ((m + h) * pixels[i+4]) / 255.0 : 0.0;

            // decode orientation
            rotation = (2 * pixels[i+5] - 255) * piOver255;

            // decode score
            score = _utils_utils__WEBPACK_IMPORTED_MODULE_7__["Utils"].decodeFloat16(w);

            // read descriptor, if any
            descriptor = descriptorSize > 0 ? new _speedy_keypoint_descriptor__WEBPACK_IMPORTED_MODULE_12__["SpeedyKeypointDescriptor"](descriptorBytes) : null;

            // register keypoint
            keypoints.push(new _speedy_keypoint__WEBPACK_IMPORTED_MODULE_11__["SpeedyKeypoint"](x, y, lod, rotation, score, descriptor));
        }

        // done!
        return keypoints;
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/source.js":
/*!*****************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/source.js ***!
  \*****************************************************/
/*! exports provided: SpeedyPipelineNodeKeypointSource */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeKeypointSource", function() { return SpeedyPipelineNodeKeypointSource; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _detectors_detector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./detectors/detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _speedy_keypoint__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../speedy-keypoint */ "./src/core/speedy-keypoint.js");
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
 * source.js
 * Gets keypoints into the pipeline
 */












// Constants
const UBO_MAX_BYTES = 16384; // UBOs can hold at least 16KB of data: gl.MAX_UNIFORM_BLOCK_SIZE >= 16384 according to the GL ES 3 reference
const BUFFER_SIZE = 1024; // how many keypoints we can upload in one pass of the shader (as defined in the shader program)
const SIZEOF_VEC4 = Float32Array.BYTES_PER_ELEMENT * 4; // 16 bytes

/**
 * Gets keypoints into the pipeline
 */
class SpeedyPipelineNodeKeypointSource extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineSourceNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 2, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineMessageType"].Keypoints)
        ]);

        /** @type {SpeedyKeypoint[]} keypoints to be uploaded to the GPU */
        this._keypoints = [];

        /** @type {Float32Array} upload buffer (UBO) */
        this._buffer = SpeedyPipelineNodeKeypointSource._createUploadBuffer(BUFFER_SIZE);
    }

    /**
     * Keypoints to be uploaded
     * @returns {SpeedyKeypoint[]}
     */
    get keypoints()
    {
        return this._keypoints;
    }

    /**
     * Keypoints to be uploaded
     * @param {SpeedyKeypoint[]} keypoints
     */
    set keypoints(keypoints)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(Array.isArray(keypoints));
        this._keypoints = keypoints;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        // Orientation, descriptors and extra bytes will be lost
        const descriptorSize = 0, extraSize = 0;
        const keypoints = this._keypoints;
        const numKeypoints = keypoints.length;
        const numPasses = Math.max(1, Math.ceil(numKeypoints / BUFFER_SIZE));
        const buffer = this._buffer;
        const uploadKeypoints = gpu.programs.keypoints.uploadKeypoints;
        const encoderLength = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineNodeKeypointDetector"].encoderLength(numKeypoints, descriptorSize, extraSize);

        uploadKeypoints.outputs(encoderLength, encoderLength, this._tex[0], this._tex[1]);

        let startIndex = 0, encodedKeypoints = uploadKeypoints.clear();
        for(let i = 0; i < numPasses; i++) {
            const n = Math.min(BUFFER_SIZE, numKeypoints - startIndex);
            const endIndex = startIndex + n;

            uploadKeypoints.setUBO('KeypointBuffer', SpeedyPipelineNodeKeypointSource._fillUploadBuffer(buffer, keypoints, startIndex, endIndex));
            encodedKeypoints = uploadKeypoints(encodedKeypoints, startIndex, endIndex, descriptorSize, extraSize, encoderLength);

            startIndex = endIndex;
        }

        this.output().swrite(encodedKeypoints, descriptorSize, extraSize, encoderLength);
    }

    /**
     * Create an upload buffer
     * @param {number} bufferSize number of keypoints
     * @returns {Float32Array}
     */
    static _createUploadBuffer(bufferSize)
    {
        const internalBuffer = new ArrayBuffer(SIZEOF_VEC4 * bufferSize);

        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(internalBuffer.byteLength <= UBO_MAX_BYTES);

        return new Float32Array(internalBuffer);
    }

    /**
     * Fill upload buffer with keypoint data
     * @param {Float32Array} buffer
     * @param {SpeedyKeypoint[]} keypoints 
     * @param {number} start index, inclusive
     * @param {number} end index, exclusive
     * @returns {Float32Array} buffer
     */
    static _fillUploadBuffer(buffer, keypoints, start, end)
    {
        const n = end - start;
        for(let i = 0; i < n; i++) {
            const keypoint = keypoints[start + i];
            const j = i * 4;

            // Format data as follows:
            // vec4(xpos, ypos, lod, score)
            buffer[j]   = +(keypoint.position.x) || 0;
            buffer[j+1] = +(keypoint.position.y) || 0;
            buffer[j+2] = +(keypoint.lod) || 0;
            buffer[j+3] = +(keypoint.score) || 0;
        }

        // done!
        return buffer;
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/trackers/lk.js":
/*!**********************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/trackers/lk.js ***!
  \**********************************************************/
/*! exports provided: SpeedyPipelineNodeLKKeypointTracker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeLKKeypointTracker", function() { return SpeedyPipelineNodeLKKeypointTracker; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _detectors_detector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../detectors/detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _speedy_size__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../speedy-size */ "./src/core/speedy-size.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../utils/globals */ "./src/utils/globals.js");
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
 * LK optical-flow
 */














// Constants
const DEFAULT_WINDOW_SIZE = new _speedy_size__WEBPACK_IMPORTED_MODULE_7__["SpeedySize"](15, 15);
const DEFAULT_DEPTH = Math.min(6, _utils_globals__WEBPACK_IMPORTED_MODULE_11__["PYRAMID_MAX_LEVELS"]);
const DEFAULT_NUMBER_OF_ITERATIONS = 5;
const DEFAULT_DISCARD_THRESHOLD = 0.0001;
const DEFAULT_EPSILON = 0.01;
const MIN_WINDOW_SIZE = 5;
const MAX_WINDOW_SIZE = 21;


/**
 * LK optical-flow
 */
class SpeedyPipelineNodeLKKeypointTracker extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 4, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__["InputPort"])('previousImage').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineMessageType"].Image).satisfying(
                msg => msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_6__["ImageFormat"].GREY
            ),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__["InputPort"])('nextImage').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineMessageType"].Image).satisfying(
                msg => msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_6__["ImageFormat"].GREY
            ),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__["InputPort"])('previousKeypoints').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineMessageType"].Keypoints),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineMessageType"].Keypoints),
        ]);

        /** @type {SpeedySize} window size */
        this._windowSize = DEFAULT_WINDOW_SIZE;

        /** @type {number} number of pyramid levels to use */
        this._levels = DEFAULT_DEPTH;

        /** @type {number} minimum acceptable corner response */
        this._discardThreshold = DEFAULT_DISCARD_THRESHOLD;

        /** @type {number} number of iterations per pyramid level (termination criteria) */
        this._numberOfIterations = DEFAULT_NUMBER_OF_ITERATIONS;

        /** @type {number} minimum increment per iteration (termination criteria) */
        this._epsilon = DEFAULT_EPSILON;
    }

    /**
     * Window size (use odd numbers)
     * @returns {SpeedySize}
     */
    get windowSize()
    {
        return this._windowSize;
    }

    /**
     * Window size (use odd numbers)
     * @param {SpeedySize} windowSize must be a square window
     */
    set windowSize(windowSize)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].assert(windowSize.width == windowSize.height && windowSize.area() > 0);
        _utils_utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].assert(windowSize.width % 2 == 1 /*&& windowSize.height % 2 == 1*/);
        this._windowSize = windowSize;

        const wsize = this._windowSize.width;
        if(wsize > MAX_WINDOW_SIZE)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_9__["NotSupportedError"](`LK: window of size ${this._windowSize} is too large!`);
        else if(wsize < MIN_WINDOW_SIZE)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_9__["NotSupportedError"](`LK: window of size ${this._windowSize} is too small!`);
    }

    /**
     * Number of pyramid levels to use
     * @returns {number}
     */
    get levels()
    {
        return this._levels;
    }

    /**
     * Number of pyramid levels to use
     * @param {number} levels
     */
    set levels(levels)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].assert(levels >= 1 && levels <= _utils_globals__WEBPACK_IMPORTED_MODULE_11__["PYRAMID_MAX_LEVELS"]);
        this._levels = levels | 0;
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].assert(value >= 0);
        this._discardThreshold = +value;
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].assert(value >= 1);
        this._numberOfIterations = value | 0;
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].assert(value >= 0);
        this._epsilon = +value;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = this.input('previousKeypoints').read();
        const previousImage = this.input('previousImage').read().image;
        const nextImage = this.input('nextImage').read().image;
        const previousKeypoints = encodedKeypoints;
        const levels = this._levels;
        const windowSize = this._windowSize;
        const wsize = windowSize.width; // square window
        const numberOfIterations = this._numberOfIterations;
        const discardThreshold = this._discardThreshold;
        const epsilon = this._epsilon;
        const keypoints = gpu.programs.keypoints;
        const tex = this._tex;
        const outputTexture = this._tex[3];

        // do we need a pyramid?
        if(!(levels == 1 || (previousImage.hasMipmaps() && nextImage.hasMipmaps())))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_9__["IllegalOperationError"](`LK: a pyramid is required if levels > 1`);

        // select the appropriate program
        const lk = (
            (wsize <= 7  ? keypoints.lk7  :
            (wsize <= 11 ? keypoints.lk11 : 
            (wsize <= 15 ? keypoints.lk15 :
            (wsize <= 21 ? keypoints.lk21 : null
        )))));

        //
        // Optimization!
        // because this is such a demanding algorithm, we'll
        // split the work into multiple passes of the shader
        //
        const numKeypoints = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineNodeKeypointDetector"].encoderCapacity(descriptorSize, extraSize, encoderLength);
        const lkEncoderLength = Math.max(1, Math.ceil(Math.sqrt(numKeypoints)));
        lk.outputs(lkEncoderLength, lkEncoderLength, tex[0], tex[1]);

        // compute optical-flow
        let flow = tex[1].clear();
        for(let lod = levels - 1; lod >= 0; lod--)
            flow = lk(flow, previousKeypoints, nextImage, previousImage, wsize, lod, levels, numberOfIterations, discardThreshold, epsilon, descriptorSize, extraSize, encoderLength);

        // transfer optical-flow to nextKeypoints
        keypoints.transferFlow.outputs(encoderLength, encoderLength, tex[2]);
        const nextKeypoints = keypoints.transferFlow(flow, previousKeypoints, descriptorSize, extraSize, encoderLength);

        // discard "bad" keypoints
        keypoints.lkDiscard.outputs(encoderLength, encoderLength, outputTexture);
        const goodKeypoints = keypoints.lkDiscard(nextImage, wsize, nextKeypoints, descriptorSize, extraSize, encoderLength);

        // done!
        this.output().swrite(goodKeypoints, descriptorSize, extraSize, encoderLength);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/trackers/ncc.js":
/*!***********************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/trackers/ncc.js ***!
  \***********************************************************/
/*! exports provided: SpeedyPipelineNodeNCCKeypointTracker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeNCCKeypointTracker", function() { return SpeedyPipelineNodeNCCKeypointTracker; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _detectors_detector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../detectors/detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _speedy_size__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../speedy-size */ "./src/core/speedy-size.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../utils/globals */ "./src/utils/globals.js");
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
 * ncc.js
 * Coarse-to-fine NCC-based sparse optical-flow
 */














// Constants
const DEFAULT_WINDOW_SIZE = new _speedy_size__WEBPACK_IMPORTED_MODULE_7__["SpeedySize"](31, 31);
const DEFAULT_PATCH_SIZE = new _speedy_size__WEBPACK_IMPORTED_MODULE_7__["SpeedySize"](8, 8);
const MAX_WINDOW_SIZE = 31;
const MIN_WINDOW_SIZE = 11;
const MAX_PATCH_SIZE = 12;
const MIN_PATCH_SIZE = 4;


/**
 * Coarse-to-fine NCC-based sparse optical-flow (Normalized Cross Correlation)
 */
class SpeedyPipelineNodeNCCKeypointTracker extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 10, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__["InputPort"])('previousImage').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineMessageType"].Image).satisfying(
                msg => msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_6__["ImageFormat"].GREY
            ),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__["InputPort"])('nextImage').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineMessageType"].Image).satisfying(
                msg => msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_6__["ImageFormat"].GREY
            ),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__["InputPort"])('previousKeypoints').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineMessageType"].Keypoints),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__["SpeedyPipelineMessageType"].Keypoints),
        ]);

        /** @type {SpeedySize} size of the search window */
        this._windowSize = DEFAULT_WINDOW_SIZE;

        /** @type {SpeedySize} size of the template, i.e., the patch around the keypoint */
        this._patchSize = DEFAULT_PATCH_SIZE;
    }

    /**
     * Window size (use odd numbers)
     * @returns {SpeedySize}
     */
    get windowSize()
    {
        return this._windowSize;
    }

    /**
     * Window size (use odd numbers)
     * @param {SpeedySize} windowSize must be a square window
     */
    set windowSize(windowSize)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].assert(windowSize.width == windowSize.height && windowSize.area() > 0);
        _utils_utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].assert(windowSize.width % 2 == 1 /*&& windowSize.height % 2 == 1*/);
        this._windowSize = windowSize;

        const wsize = this._windowSize.width;
        if(wsize > MAX_WINDOW_SIZE)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_9__["NotSupportedError"](`NCC: window of size ${this._windowSize} is too large!`);
        else if(wsize < MIN_WINDOW_SIZE)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_9__["NotSupportedError"](`NCC: window of size ${this._windowSize} is too small!`);
    }

    /**
     * Patch size
     * @returns {SpeedySize}
     */
    get patchSize()
    {
        return this._patchSize;
    }

    /**
     * Patch size
     * @param {SpeedySize} patchSize must be square
     */
    set patchSize(patchSize)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_8__["Utils"].assert(patchSize.width === patchSize.height && patchSize.area() > 0);
        this._patchSize = patchSize;

        const psize = this._patchSize.width;
        if(psize > MAX_PATCH_SIZE)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_9__["NotSupportedError"](`NCC: patch of size ${this._patchSize} is too large!`);
        else if(psize < MIN_PATCH_SIZE)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_9__["NotSupportedError"](`NCC: patch of size ${this._patchSize} is too small!`);
    }

    /**
     * Pyramid operation: reduce (50% of size)
     * @param {SpeedyGPU} gpu
     * @param {SpeedyDrawableTexture} outtex output texture with two mipmap levels (0 and 1)
     * @param {SpeedyDrawableTexture} intex input texture
     * @param {SpeedyDrawableTexture} halftex temporary texture that will store the reduce()'d input texture (50% size)
     * @param {SpeedyDrawableTexture} tmptex temporary texture (100% size) used to compute reduce()
     * @returns {SpeedyDrawableTexture} outtex
     */
    _reduce(gpu, outtex, intex, halftex, tmptex)
    {
        const pyramids = gpu.programs.pyramids;
        const width = intex.width, height = intex.height;
        const halfWidth = Math.max(1, width >>> 1), halfHeight = Math.max(1, height >>> 1);

        (pyramids.smoothX.outputs(width, height, tmptex))(intex);
        (pyramids.smoothY.outputs(width, height, outtex))(tmptex);
        (pyramids.downsample2.outputs(halfWidth, halfHeight, halftex))(outtex);

        outtex.clear();
        intex.copyTo(outtex);
        //halftex.copyTo(outtex, 1);
        outtex.generateMipmaps([intex, halftex]);

        return outtex;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = this.input('previousKeypoints').read();
        const previousImage = this.input('previousImage').read().image;
        const nextImage = this.input('nextImage').read().image;
        const previousKeypoints = encodedKeypoints;
        const wsize = this._windowSize.width; // square window
        const psize = this._patchSize.width; // square patch
        const outputTexture = this._tex[0];

        // compute mipmap levels 0 and 1 of previousImage
        const pyrPreviousImage = this._tex[1];
        const halfPreviousImage = this._tex[2];
        const tmpPreviousImage = this._tex[3];
        this._reduce(gpu, pyrPreviousImage, previousImage, halfPreviousImage, tmpPreviousImage);

        // compute mipmap levels 0 and 1 of nextImage
        const pyrNextImage = this._tex[4];
        const halfNextImage = this._tex[5];
        const tmpNextImage = this._tex[6];
        this._reduce(gpu, pyrNextImage, nextImage, halfNextImage, tmpNextImage);

        // initialize flow textures
        const maxKeypoints = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineNodeKeypointDetector"].encoderCapacity(descriptorSize, extraSize, encoderLength);
        const nccEncoderLength = Math.max(1, Math.ceil(Math.sqrt(maxKeypoints)));
        const flow0 = this._tex[7], flow1 = this._tex[8];
        gpu.programs.keypoints.ncc.outputs(nccEncoderLength, nccEncoderLength, flow1, flow0);
        //flow0.clear(); flow1.clear();
        //lk.outputs(lkEncoderLength, lkEncoderLength, tex[0], tex[1]);

        // compute the search radii ri for lod = i, i = 0,1
        // note that 2 * r1 + 1 = (1/2^lod) * wsize
        let r0 = 2; // fair enough
        const r1 = Math.max(r0, (0.25 * wsize - 0.5) | 0);

        // compute the patch size pi for lod = i, i = 0,1
        let p0 = psize;
        const p1 = Math.max(1, p0 >>> 1);

        // coarse flow estimation (lod = 1)
        let flow = flow0.clear();
        //flow = gpu.programs.keypoints.ncc(flow, previousKeypoints, pyrPreviousImage, pyrNextImage, 2*r1+1, p1, 1, descriptorSize, extraSize, encoderLength);

        // fine flow estimation (lod = 0)
        r0 = 15;
        p0 = 7;
        flow = gpu.programs.keypoints.ncc(flow, previousKeypoints, pyrPreviousImage, pyrNextImage, 2*r0+1, p0, 0, descriptorSize, extraSize, encoderLength);

        // transfer optical-flow to nextKeypoints
        gpu.programs.keypoints.transferFlow.outputs(encoderLength, encoderLength, this._tex[9]);
        const nextKeypoints = gpu.programs.keypoints.transferFlow(flow, previousKeypoints, descriptorSize, extraSize, encoderLength);

        // discard "bad" keypoints
        gpu.programs.keypoints.lkDiscard.outputs(encoderLength, encoderLength, outputTexture);
        const goodKeypoints = gpu.programs.keypoints.lkDiscard(pyrNextImage, wsize, nextKeypoints, descriptorSize, extraSize, encoderLength);

        // done!
        this.output().swrite(goodKeypoints, descriptorSize, extraSize, encoderLength);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/transformer.js":
/*!**********************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/transformer.js ***!
  \**********************************************************/
/*! exports provided: SpeedyPipelineNodeKeypointTransformer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPipelineNodeKeypointTransformer", function() { return SpeedyPipelineNodeKeypointTransformer; });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _speedy_matrix__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../speedy-matrix */ "./src/core/speedy-matrix.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
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
 * transformer.js
 * Apply a transformation matrix to a set of keypoints
 */












/**
 * Apply a transformation matrix to a set of keypoints
 */
class SpeedyPipelineNodeKeypointTransformer extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__["SpeedyPipelineNode"]
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Keypoints),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Keypoints)
        ]);

        /** @type {SpeedyMatrix} transformation matrix */
        this._transform = _speedy_matrix__WEBPACK_IMPORTED_MODULE_7__["SpeedyMatrix"].Create(3, 3, [1, 0, 0, 0, 1, 0, 0, 0, 1]); // identity matrix
    }

    /**
     * Transformation matrix
     * @returns {SpeedyMatrix}
     */
    get transform()
    {
        return this._transform;
    }

    /**
     * Transformation matrix. Must be 3x3
     * @param {SpeedyMatrix} transform
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
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = this.input().read();
        const outputTexture = this._tex[0];
        const homography = this._transform.read();

        // apply homography
        (gpu.programs.keypoints.applyHomography
            .outputs(encodedKeypoints.width, encodedKeypoints.height, outputTexture)
        )(homography, encodedKeypoints, descriptorSize, extraSize, encoderLength);

        // done!
        this.output().swrite(outputTexture, descriptorSize, extraSize, encoderLength);
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
/* harmony import */ var _speedy_matrix__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../speedy-matrix */ "./src/core/speedy-matrix.js");
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
        super(name, 1, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
        ]);

        /** @type {SpeedyMatrix} perspective transformation */
        this._transform = _speedy_matrix__WEBPACK_IMPORTED_MODULE_9__["SpeedyMatrix"].Create(3, 3, [1, 0, 0, 0, 1, 0, 0, 0, 1]); // identity matrix
    }

    /**
     * Perspective transform, a 3x3 homography matrix
     * @returns {SpeedyMatrix}
     */
    get transform()
    {
        return this._transform;
    }

    /**
     * Perspective transform, a 3x3 homography matrix
     * @param {SpeedyMatrix} transform
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
        const outputTexture = this._tex[0];
        const homography = this._transform.read();
        const inverseHomography = this._inverse3(homography);
        const isValidHomography = !Number.isNaN(inverseHomography[0]);

        gpu.programs.transforms.warpPerspective.outputs(width, height, outputTexture);
        gpu.programs.transforms.warpPerspective(image, isValidHomography ? inverseHomography : SINGULAR_MATRIX);

        this.output().swrite(outputTexture, format);
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
/* harmony import */ var _speedy_size__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../speedy-size */ "./src/core/speedy-size.js");
/* harmony import */ var _speedy_vector__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../speedy-vector */ "./src/core/speedy-vector.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
        super(name, 1, [
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["InputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
            Object(_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__["OutputPort"])().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__["SpeedyPipelineMessageType"].Image),
        ]);

        /** @type {SpeedySize} size of the output image, in pixels */
        this._size = new _speedy_size__WEBPACK_IMPORTED_MODULE_8__["SpeedySize"](0, 0);

        /** @type {SpeedyVector2} size of the output relative to the size of the input */
        this._scale = new _speedy_vector__WEBPACK_IMPORTED_MODULE_9__["SpeedyVector2"](1, 1);

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
        const outputTexture = this._tex[0];
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
        super(SpeedyPipelineMessageType.Nothing);
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
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/globals */ "./src/utils/globals.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _pipeline_port__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pipeline-port */ "./src/core/pipeline/pipeline-port.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture_reader__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../gpu/speedy-texture-reader */ "./src/gpu/speedy-texture-reader.js");
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
 * Generate a random name for a node
 * @returns {string}
 */
const generateRandomName = () => Math.random().toString(16).substr(2);

/**
 * Node of a pipeline
 * @abstract
 */
class SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] the name of this node
     * @param {number} [texCount] number of work textures
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = generateRandomName(), texCount = 0, portBuilders = [])
    {
        /** @type {string} the name of this node */
        this._name = String(name);



        // build the ports
        const ports = portBuilders.map(builder => builder.build(this));

        /** @type {InputPortDictionary} input ports */
        this._inputPorts = PortDictionary(ports.filter(port => port.isInputPort()));

        /** @type {OutputPortDictionary} output ports */
        this._outputPorts = PortDictionary(ports.filter(port => port.isOutputPort()));



        // other properties

        /** @type {SpeedyDrawableTexture[]} work texture(s) */
        this._tex = (new Array(texCount)).fill(null);



        // got a valid name?
        if(this._name.length == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["IllegalArgumentError"](`Invalid name "${this._name}" for node ${this.fullName}`);

        // got some ports?
        if(portBuilders.length == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["IllegalArgumentError"](`No ports have been found in node ${this.fullName}`);
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
     * Find input port by name
     * @param {string} [portName]
     * @returns {SpeedyPipelineInputPort}
     */
    input(portName = _pipeline_port__WEBPACK_IMPORTED_MODULE_4__["SpeedyPipelineInputPort"].DEFAULT_NAME)
    {
        if(portName in this._inputPorts)
            return this._inputPorts[portName];

        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["IllegalArgumentError"](`Can't find input port ${portName} in node ${this.fullName}`);
    }

    /**
     * Find output port by name
     * @param {string} [portName]
     * @returns {SpeedyPipelineOutputPort}
     */
    output(portName = _pipeline_port__WEBPACK_IMPORTED_MODULE_4__["SpeedyPipelineOutputPort"].DEFAULT_NAME)
    {
        if(portName in this._outputPorts)
            return this._outputPorts[portName];

        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["IllegalArgumentError"](`Can't find output port ${portName} in node ${this.fullName}`);
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
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["AbstractMethodError"]();
    }

    /**
     * Initializes this node
     * @param {SpeedyGPU} gpu
     */
    init(gpu)
    {
        // allocate work texture(s)
        for(let j = 0; j < this._tex.length; j++)
            this._tex[j] = gpu.texturePool.allocate();
    }

    /**
     * Releases this node
     * @param {SpeedyGPU} gpu
     */
    release(gpu)
    {
        // deallocate work texture(s)
        for(let j = this._tex.length - 1; j >= 0; j--)
            this._tex[j] = gpu.texturePool.free(this._tex[j]);
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
     * Inspect the pixels of a texture for debugging purposes
     * @param {SpeedyTexture} texture
     * @returns {Uint8Array}
     */
    _inspect(texture)
    {
        this._textureReader = this._textureReader || new _gpu_speedy_texture_reader__WEBPACK_IMPORTED_MODULE_8__["SpeedyTextureReader"]();
        const pixels = this._textureReader.readPixelsSync(texture);
        return new Uint8Array(pixels); // copy the array
    }

    /**
     * Inspect the pixels of a texture as unsigned 32-bit integers
     * @param {SpeedyTexture} texture
     * @returns {Uint32Array}
     */
    _inspect32(texture)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(_utils_globals__WEBPACK_IMPORTED_MODULE_1__["LITTLE_ENDIAN"]); // make sure we use little-endian
        return new Uint32Array(this._inspect(texture).buffer);
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
     * @param {number} [texCount] number of work textures
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = undefined, texCount = undefined, portBuilders = undefined)
    {
        super(name, texCount, portBuilders);
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
     * @param {number} [texCount] number of work textures
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = undefined, texCount = undefined, portBuilders = undefined)
    {
        super(name, texCount, portBuilders);
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(this.isSink());
    }

    /**
     * Export data from this node to the user
     * @returns {SpeedyPromise<any>}
     */
    export()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["AbstractMethodError"]();
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
/* harmony import */ var _speedy_keypoint__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../speedy-keypoint */ "./src/core/speedy-keypoint.js");
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
 * pipeline.js
 * A pipeline is a network of nodes in which data flows to a sink
 */










/**
 * @typedef {Object.<string,(SpeedyMedia|SpeedyKeypoint[])>} SpeedyPipelineOutput
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

        /** @type {boolean} are we running the pipeline at this moment? */
        this._busy = false;
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
        if(this._nodes.length > 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`The pipeline has already been initialized`);
        else if(nodes.length == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalArgumentError"](`Can't initialize the pipeline. Please specify its nodes`);

        // create a GPU instance
        this._gpu = new _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_5__["SpeedyGPU"]();

        // add nodes to the network
        for(let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if(!this._nodes.includes(node))
                this._nodes.push(node);
        }

        // generate the output template
        this._template = SpeedyPipeline._createOutputTemplate(this._nodes);

        // generate the sequence of nodes
        this._sequence = SpeedyPipeline._tsort(this._nodes);
        SpeedyPipeline._validateSequence(this._sequence);

        // initialize nodes
        for(let i = 0; i < this._sequence.length; i++)
            this._sequence[i].init(this._gpu);

        // done!
        return this;
    }

    /**
     * Release the resources associated with this pipeline
     * @returns {null}
     */
    release()
    {
        if(this._nodes.length == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`The pipeline has already been released or has never been initialized`);

        // release nodes
        for(let i = this._sequence.length - 1; i >= 0; i--)
            this._sequence[i].release(this._gpu);
        this._sequence.length = 0;
        this._nodes.length = 0;

        // release GPU
        this._gpu = this._gpu.release();

        // release other properties
        this._template = SpeedyPipeline._createOutputTemplate();

        // done!
        return null;
    }

    /**
     * Run the pipeline
     * @returns {SpeedyPromise<SpeedyPipelineOutput>} results are indexed by the names of the sink nodes
     */
    run()
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(this._gpu != null, `Pipeline has not been initialized or has been released`);

        // is the pipeline busy?
        if(this._busy) {
            // if so, we need to wait 'til it finishes
            return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__["SpeedyPromise"]((resolve, reject) => {
                setTimeout(() => this.run().then(resolve, reject), 0);
            });
        }
        else {
            // the pipeline is now busy and won't accept concurrent tasks
            // (we allocate textures using a single pool)
            this._busy = true;
        }

        // find the sinks
        const sinks = this._sequence.filter(node => node.isSink());

        // run the pipeline
        return SpeedyPipeline._runSequence(this._sequence, this._gpu).then(() =>

            // export results
            _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__["SpeedyPromise"].all(sinks.map(sink => sink.export())).then(results =>

                // aggregate results by the names of the sinks
                results.reduce((obj, val, idx) => ((obj[sinks[idx].name] = val), obj), this._template)
            )
        ).then(aggregate => {
            // clear all ports
            for(let i = this._sequence.length - 1; i >= 0; i--)
                this._sequence[i].clearPorts();

            // the pipeline is no longer busy
            this._busy = false;

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
        gpu.gl.flush();

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

/***/ "./src/core/speedy-keypoint-descriptor.js":
/*!************************************************!*\
  !*** ./src/core/speedy-keypoint-descriptor.js ***!
  \************************************************/
/*! exports provided: SpeedyKeypointDescriptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyKeypointDescriptor", function() { return SpeedyKeypointDescriptor; });
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
 * speedy-keypoint-descriptor.js
 * Keypoint descriptor
 */

/**
 * Represents a keypoint descriptor
 */
class SpeedyKeypointDescriptor
{
    /**
     * Constructor
     * @param {Uint8Array} data descriptor bytes
     */
    constructor(data)
    {
        this._data = data;
        return Object.freeze(this);
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
     * The size of the descriptor, in bytes
     * @returns {number}
     */
    get size()
    {
        return this._data.byteLength;
    }

    /**
     * A string representation of the keypoint descriptor
     * @returns {string}
     */
    toString()
    {
        return `SpeedyKeypointDescriptor(${this._data.join(',')})`;
    }
}

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
/* harmony import */ var _speedy_keypoint_descriptor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-keypoint-descriptor */ "./src/core/speedy-keypoint-descriptor.js");
/* harmony import */ var _speedy_point__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-point */ "./src/core/speedy-point.js");
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
 * speedy-keypoint.js
 * Keypoint class
 */




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
     * @param {?SpeedyKeypointDescriptor} [descriptor] Keypoint descriptor, if any
     */
    constructor(x, y, lod = 0.0, rotation = 0.0, score = 0.0, descriptor = null)
    {
        this._position = new _speedy_point__WEBPACK_IMPORTED_MODULE_1__["SpeedyPoint2"](+x, +y);
        this._lod = +lod;
        this._rotation = +rotation;
        this._score = +score;
        this._descriptor = descriptor;

        return Object.freeze(this);
    }

    /**
     * Converts this keypoint to a descriptive string
     * @returns {string}
     */
    toString()
    {
        return `SpeedyKeypoint(${this.x},${this.y})`;
    }

    /**
     * The position of this keypoint
     * @returns {SpeedyPoint2}
     */
    get position()
    {
        return this._position;
    }

    /**
     * The x-position of this keypoint
     * @returns {number}
     */
    get x()
    {
        return this._position.x;
    }

    /**
     * The y-position of this keypoint
     * @returns {number}
     */
    get y()
    {
        return this._position.y;
    }

    /**
     * The pyramid level-of-detail from which this keypoint was extracted
     * @returns {number}
     */
    get lod()
    {
        return this._lod;
    }

    /**
     * Scale: 2^lod
     * @returns {number}
     */
    get scale()
    {
        return Math.pow(2, this._lod);
    }

    /**
     * The orientation of the keypoint, in radians
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
     * Keypoint descriptor
     * @return {?SpeedyKeypointDescriptor}
     */
    get descriptor()
    {
        return this._descriptor;
    }
}

/***/ }),

/***/ "./src/core/speedy-matrix-expr.js":
/*!****************************************!*\
  !*** ./src/core/speedy-matrix-expr.js ***!
  \****************************************/
/*! exports provided: SpeedyMatrixExpr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMatrixExpr", function() { return SpeedyMatrixExpr; });
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-matrix-wasm */ "./src/core/speedy-matrix-wasm.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
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
 * speedy-matrix-expr.js
 * Symbolic matrix expressions
 */






/**
 * @typedef {'float32'} SpeedyMatrixType data type
 */

/** @type {object.<SpeedyMatrixType,Function>} */
const DTYPE_TO_BUFFER_TYPE = Object.freeze({
    'float32': Float32Array
});


/**
 * @abstract Matrix expression
 * It's an opaque object representing an algebraic
 * expression. It has no data attached to it.
 */
class SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {number} rows
     * @param {number} columns
     * @param {SpeedyMatrixType} dtype
     */
    constructor(rows, columns, dtype)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].assert(rows > 0 && columns > 0);
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].assert(dtype === SpeedyMatrixExpr.DEFAULT_DTYPE); // we only support float32 for now

        /** @type {number} number of rows */
        this._rows = rows | 0;

        /** @type {number} number of columns */
        this._columns = columns | 0;

        /** @type {SpeedyMatrixType} data type */
        this._dtype = dtype;
    }

    /**
     * Number of rows
     * @returns {number}
     */
    get rows()
    {
        return this._rows;
    }

    /**
     * Number of rows
     * @returns {number}
     */
    get columns()
    {
        return this._columns;
    }

    /**
     * Data type
     * @returns {SpeedyMatrixType}
     */
    get dtype()
    {
        return this._dtype;
    }

    /**
     * Default data type
     * @returns {SpeedyMatrixType}
     */
    static get DEFAULT_DTYPE()
    {
        return 'float32';
    }

    /**
     * Buffer types
     * @returns {object.<SpeedyMatrixType,Function>}
     */
    static get BUFFER_TYPE()
    {
        return DTYPE_TO_BUFFER_TYPE;
    }

    /**
     * Matrix addition
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixExpr}
     */
    plus(expr)
    {
        return new SpeedyMatrixAddExpr(this, expr);
    }

    /**
     * Matrix subtraction
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixExpr}
     */
    minus(expr)
    {
        return new SpeedyMatrixSubtractExpr(this, expr);
    }

    /**
     * Matrix multiplication
     * @param {SpeedyMatrixExpr|number} expr
     * @returns {SpeedyMatrixExpr}
     */
    times(expr)
    {
        if(typeof expr === 'number')
            return new SpeedyMatrixScaleExpr(this, expr);
        else
            return new SpeedyMatrixMultiplyExpr(this, expr);
    }

    /**
     * Matrix transposition
     * @returns {SpeedyMatrixExpr}
     */
    transpose()
    {
        return new SpeedyMatrixTransposeExpr(this);
    }

    /**
     * Matrix inversion
     * @returns {SpeedyMatrixExpr}
     */
    inverse()
    {
        return new SpeedyMatrixInvertExpr(this);
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
     * Returns a human-readable string representation of the matrix expression
     * @returns {string}
     */
    toString()
    {
        return `SpeedyMatrixExpr(rows=${this.rows}, columns=${this.columns})`;
    }

    /**
     * Evaluate this expression
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @returns {SpeedyMatrix}
     */
    _evaluate(wasm, memory)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["AbstractMethodError"]();
    }
}

const { SpeedyMatrix } = __webpack_require__(/*! ./speedy-matrix */ "./src/core/speedy-matrix.js");

/**
 * @abstract operation storing a temporary matrix
 */
class SpeedyMatrixTempExpr extends SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {number} rows
     * @param {number} columns
     * @param {SpeedyMatrixType} dtype
     */
    constructor(rows, columns, dtype)
    {
        super(rows, columns, dtype);

        /** @type {SpeedyMatrix} holds the results of a computation */
        this._tempMatrix = SpeedyMatrix.Zeros(this.rows, this.columns, this.dtype);
    }
}

/**
 * @abstract unary operation
 */
class SpeedyMatrixUnaryOperationExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {number} rows rows of the output matrix
     * @param {number} columns columns of the output matrix
     * @param {SpeedyMatrixExpr} operand
     */
    constructor(rows, columns, operand)
    {
        super(rows, columns, operand.dtype);

        /** @type {SpeedyMatrixExpr} operand */
        this._operand = operand;
    }

    /**
     * Evaluate this expression
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @returns {SpeedyMatrix}
     */
    _evaluate(wasm, memory)
    {
        const operand = this._operand._evaluate(wasm, memory);
        const result = this._tempMatrix;

        // allocate matrices
        const resultptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, result);
        const operandptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, operand);

        // copy operand to WASM memory
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyToMat32(wasm, memory, operandptr, operand);

        // run the WASM routine
        this._compute(wasm, memory, resultptr, operandptr);

        // copy result from WASM memory
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyFromMat32(wasm, memory, resultptr, result);

        // deallocate matrices
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, operandptr);
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, resultptr);

        // done!
        return result;
    }

    /**
     * Compute the result of this operation
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} operandptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, operandptr)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["AbstractMethodError"]();
    }
}

/**
 * @abstract binary operation
 */
class SpeedyMatrixBinaryOperationExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {number} rows rows of the output matrix
     * @param {number} columns columns of the output matrix
     * @param {SpeedyMatrixExpr} left left operand
     * @param {SpeedyMatrixExpr} right right operand
     */
    constructor(rows, columns, left, right)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].assert(left.dtype === right.dtype);
        super(rows, columns, left.dtype);

        /** @type {SpeedyMatrixExpr} left operand */
        this._left = left;

        /** @type {SpeedyMatrixExpr} right operand */
        this._right = right;
    }

    /**
     * Evaluate this expression
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @returns {SpeedyMatrix}
     */
    _evaluate(wasm, memory)
    {
        const left = this._left._evaluate(wasm, memory);
        const right = this._right._evaluate(wasm, memory);
        const result = this._tempMatrix;

        // allocate matrices
        const resultptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, result);
        const leftptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, left);
        const rightptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, right);

        // copy input matrices to WASM memory
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyToMat32(wasm, memory, leftptr, left);
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyToMat32(wasm, memory, rightptr, right);

        // run the WASM routine
        this._compute(wasm, memory, resultptr, leftptr, rightptr);

        // copy output matrix from WASM memory
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyFromMat32(wasm, memory, resultptr, result);

        // deallocate matrices
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, rightptr);
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, leftptr);
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, resultptr);

        // done!
        return result;
    }

    /**
     * Compute the result of this operation
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} leftptr pointer to Mat32
     * @param {number} rightptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, leftptr, rightptr)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__["AbstractMethodError"]();
    }
}

/**
 * Transpose matrix
 */
class SpeedyMatrixTransposeExpr extends SpeedyMatrixUnaryOperationExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} operand
     */
    constructor(operand)
    {
        super(operand.columns, operand.rows, operand);
    }

    /**
     * Compute result = operand^T
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} operandptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, operandptr)
    {
        wasm.exports.Mat32_transpose(resultptr, operandptr);
    }
}

/**
 * Invert square matrix
 */
class SpeedyMatrixInvertExpr extends SpeedyMatrixUnaryOperationExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} operand
     */
    constructor(operand)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].assert(operand.rows === operand.columns);
        super(operand.rows, operand.columns, operand);

        /** @type {number} size of the matrix */
        this._size = operand.rows;
    }

    /**
     * Compute result = operand ^ (-1)
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} operandptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, operandptr)
    {
        switch(this._size) {
            case 0: break;
            case 1:
                wasm.exports.Mat32_inverse1(resultptr, operandptr);
                break;

            case 2:
                wasm.exports.Mat32_inverse2(resultptr, operandptr);
                break;

            case 3:
                wasm.exports.Mat32_inverse3(resultptr, operandptr);
                break;

            default:
                wasm.exports.Mat32_qr_inverse(resultptr, operandptr);
                break;
        }
    }
}

/**
 * Multiply matrix by a scalar value
 */
class SpeedyMatrixScaleExpr extends SpeedyMatrixUnaryOperationExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} operand
     * @param {number} scalar
     */
    constructor(operand, scalar)
    {
        super(operand.rows, operand.columns, operand);

        /** @type {number} scalar value */
        this._scalar = +scalar;
    }

    /**
     * Compute result = scalar * operand
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} operandptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, operandptr)
    {
        wasm.exports.Mat32_scale(resultptr, operandptr, this._scalar);
    }
}

/**
 * Matrix addition
 */
class SpeedyMatrixAddExpr extends SpeedyMatrixBinaryOperationExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} left left operand
     * @param {SpeedyMatrixExpr} right right operand
     */
    constructor(left, right)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].assert(left.rows === right.rows && left.columns === right.columns);
        super(left.rows, left.columns, left, right);
    }

    /**
     * Compute result = left + right
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} leftptr pointer to Mat32
     * @param {number} rightptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, leftptr, rightptr)
    {
        wasm.exports.Mat32_add(resultptr, leftptr, rightptr);
    }
}

/**
 * Matrix subtraction
 */
class SpeedyMatrixSubtractExpr extends SpeedyMatrixBinaryOperationExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} left left operand
     * @param {SpeedyMatrixExpr} right right operand
     */
    constructor(left, right)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].assert(left.rows === right.rows && left.columns === right.columns);
        super(left.rows, left.columns, left, right);
    }

    /**
     * Compute result = left - right
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} leftptr pointer to Mat32
     * @param {number} rightptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, leftptr, rightptr)
    {
        wasm.exports.Mat32_subtract(resultptr, leftptr, rightptr);
    }
}

/**
 * Matrix multiplication
 */
class SpeedyMatrixMultiplyExpr extends SpeedyMatrixBinaryOperationExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} left left operand
     * @param {SpeedyMatrixExpr} right right operand
     */
    constructor(left, right)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].assert(left.columns === right.rows);
        super(left.rows, right.columns, left, right);
    }

    /**
     * Compute result = left * right
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} leftptr pointer to Mat32
     * @param {number} rightptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, leftptr, rightptr)
    {
        wasm.exports.Mat32_multiply(resultptr, leftptr, rightptr);
    }
}

/**
 * Component-wise multiplication
 */
class SpeedyMatrixCompMultExpr extends SpeedyMatrixBinaryOperationExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} left left operand
     * @param {SpeedyMatrixExpr} right right operand
     */
    constructor(left, right)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__["Utils"].assert(left.rows === right.rows && left.columns === right.columns);
        super(right.rows, right.columns, left, right);
    }

    /**
     * Compute result = left <compMult> right
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} leftptr pointer to Mat32
     * @param {number} rightptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, leftptr, rightptr)
    {
        wasm.exports.Mat32_compmult(resultptr, leftptr, rightptr);
    }
}

/***/ }),

/***/ "./src/core/speedy-matrix-factory.js":
/*!*******************************************!*\
  !*** ./src/core/speedy-matrix-factory.js ***!
  \*******************************************/
/*! exports provided: SpeedyMatrixFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMatrixFactory", function() { return SpeedyMatrixFactory; });
/* harmony import */ var _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-matrix-expr */ "./src/core/speedy-matrix-expr.js");
/* harmony import */ var _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-matrix-wasm */ "./src/core/speedy-matrix-wasm.js");
/* harmony import */ var _speedy_matrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./speedy-matrix */ "./src/core/speedy-matrix.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
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
 * speedy-matrix-factory.js
 * A factory of matrices
 */








/**
 * A factory of matrices
 */
class SpeedyMatrixFactory extends Function
{
    /**
     * Constructor
     */
    constructor()
    {
        // This factory can be invoked as a function
        super('...args', 'return this._create(...args)');
        return this.bind(this);
    }

    /**
     * Create a new matrix filled with the specified size and entries
     * @param {number} rows
     * @param {number} [columns]
     * @param {number[]} [entries] in column-major format
     * @returns {SpeedyMatrix}
     */
    _create(rows, columns = rows, entries = [])
    {
        return _speedy_matrix__WEBPACK_IMPORTED_MODULE_2__["SpeedyMatrix"].Create(rows, columns, entries);
    }

    /**
     * Create a new matrix filled with zeros with the specified size
     * @param {number} rows
     * @param {number} [columns]
     * @returns {SpeedyMatrix}
     */
    Zeros(rows, columns = rows)
    {
        return _speedy_matrix__WEBPACK_IMPORTED_MODULE_2__["SpeedyMatrix"].Zeros(rows, columns);
    }

    /**
     * Create a new matrix filled with ones with the specified size
     * @param {number} rows
     * @param {number} [columns]
     * @returns {SpeedyMatrix}
     */
    Ones(rows, columns = rows)
    {
        return _speedy_matrix__WEBPACK_IMPORTED_MODULE_2__["SpeedyMatrix"].Ones(rows, columns);
    }

    /**
     * Create an identity matrix with the specified size
     * @param {number} rows
     * @param {number} [columns]
     * @returns {SpeedyMatrix}
     */
    Eye(rows, columns = rows)
    {
        return _speedy_matrix__WEBPACK_IMPORTED_MODULE_2__["SpeedyMatrix"].Eye(rows, columns);
    }

    /**
     * QR decomposition
     * @param {SpeedyMatrix} Q is m x n (reduced) or m x m (full), output
     * @param {SpeedyMatrix} R is n x n (reduced) or m x n (full), output
     * @param {SpeedyMatrix} mat is m x n, input
     * @param {object} [options]
     * @param {'reduced'|'full'} [options.mode]
     * @returns {SpeedyPromise<void>}
     */
    qr(Q, R, mat, { mode = 'reduced' } = {})
    {
        const A = mat, m = mat.rows, n = mat.columns;

        // validate shapes & mode
        if(mode == 'reduced') {
            if(Q.rows != m || Q.columns != n || R.rows != n || R.columns != n)
                throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`Invalid shape for reduced QR`);
        }
        else if(mode == 'full') {
            if(Q.rows != m || Q.columns != m || R.rows != m || R.columns != n)
                throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`Invalid shape for full QR`);
        }
        else
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`Invalid mode for QR: "${mode}"`);

        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].ready().then(([wasm, memory]) => {
            // allocate matrices
            const Qptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, Q);
            const Rptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, R);
            const Aptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, A);

            // copy input matrices to WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyToMat32(wasm, memory, Aptr, A);

            // run the WASM routine
            if(mode == 'reduced')
                wasm.exports.Mat32_qr_reduced(Qptr, Rptr, Aptr);
            else
                wasm.exports.Mat32_qr_full(Qptr, Rptr, Aptr);

            // copy output matrices from WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyFromMat32(wasm, memory, Qptr, Q);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyFromMat32(wasm, memory, Rptr, R);

            // deallocate matrices
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, Aptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, Rptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, Qptr);
        });
    }

    /**
     * Solve a possibly overdetermined system of linear
     * equations Ax = b for x using ordinary least squares
     * @param {SpeedyMatrix} solution n x 1, output
     * @param {SpeedyMatrix} A m x n, m >= n, input
     * @param {SpeedyMatrix} b m x 1, output
     * @param {object} [options]
     * @param {'qr'} [options.method] method of resolution
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to solution
     */
    ols(solution, A, b, { method = 'qr' } = {})
    {
        const m = A.rows, n = A.columns;
        const x = solution;

        // validate shapes
        if(m < n || n == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`Can't solve an underdetermined system of equations`);
        else if(b.rows != m || b.columns != 1 || x.rows != n || x.columns != 1)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`Invalid shapes`);

        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].ready().then(([wasm, memory]) => {
            // allocate matrices
            const Aptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, A);
            const bptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, b);
            const xptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, x);

            // copy input matrices to WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyToMat32(wasm, memory, Aptr, A);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyToMat32(wasm, memory, bptr, b);

            // run the WASM routine
            switch(method) {
                case 'qr':
                    wasm.exports.Mat32_qr_ols(xptr, Aptr, bptr, 2);
                    break;

                default: 
                    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`Invalid method: "${method}"`);
            }

            // copy output matrix from WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyFromMat32(wasm, memory, xptr, x);

            // deallocate matrices
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, xptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, bptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, Aptr);

            // done!
            return solution;
        });
    }

    /**
     * Solve a system of linear equations Ax = b for x
     * @param {SpeedyMatrix} solution m x 1, output
     * @param {SpeedyMatrix} A m x m, input
     * @param {SpeedyMatrix} b m x 1, output
     * @param {object} [options]
     * @param {'qr'} [options.method] method of resolution
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to solution
     */
    solve(solution, A, b, { method = 'qr' } = {})
    {
        const m = A.rows, n = A.columns;
        const x = solution;

        // validate shapes
        if(m != n)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`Can't solve an over or underdetermined system of equations`);
        else if(b.rows != m || b.columns != 1 || x.rows != m || x.columns != 1)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`Invalid shapes`);

        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].ready().then(([wasm, memory]) => {
            // select method
            switch(method) {
                case 'qr':
                    return this.ols(x, A, b, { method });

                /*case 'lu':
                    break;*/

                default:
                    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`Invalid method: "${method}"`);
            }
        });
    }

    /**
     * Compute a perspective transformation using 4 correspondences of points
     * @param {SpeedyMatrix} homography 3x3 output - homography matrix
     * @param {SpeedyMatrix} src 2x4 input points - source coordinates
     * @param {SpeedyMatrix} dest 2x4 input points - destination coordinates
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to homography
     */
    perspective(homography, src, dest)
    {
        // validate shapes
        if(src.rows != 2 || src.columns != 4 || dest.rows != 2 || dest.columns != 4)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`You need two 2x4 input matrices to compute a perspective transformation`);
        else if(homography.rows != 3 || homography.columns != 3)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`The output of perspective() is a 3x3 homography`);

        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].ready().then(([wasm, memory]) => {
            // allocate matrices
            const homptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, homography);
            const srcptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, src);
            const destptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, dest);

            // copy input matrices to WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyToMat32(wasm, memory, srcptr, src);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyToMat32(wasm, memory, destptr, dest);

            // run the WASM routine
            wasm.exports.Mat32_homography_ndlt4(homptr, srcptr, destptr);

            // copy output matrix from WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyFromMat32(wasm, memory, homptr, homography);

            // deallocate matrices
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, destptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, srcptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, homptr);

            // done!
            return homography;
        });
    }

    /**
     * Compute a perspective transformation using n >= 4 correspondences of points
     * @param {SpeedyMatrix} homography 3x3 output - homography matrix
     * @param {SpeedyMatrix} src 2 x n input points - source coordinates
     * @param {SpeedyMatrix} dest 2 x n input points - destination coordinates
     * @param {object} [options]
     * @param {'dlt'|'pransac'} [options.method] method of computation
     * @param {SpeedyMatrix|null} [options.mask] (pransac) 1 x n output: i-th entry will be 1 if the i-th input point is an inlier, or 0 otherwise
     * @param {number} [options.reprojectionError] (pransac) given in pixels, used to separate inliers from outliers of a particular model (e.g., 1 pixel)
     * @param {number} [options.numberOfHypotheses] (pransac) number of hypotheses to be generated up-front (e.g., 512)
     * @param {number} [options.bundleSize] (pransac) how many points should we check before reducing the number of viable hypotheses (e.g., 128)
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to homography
     */
    findHomography(homography, src, dest, {
        method = 'dlt',
        mask = null,
        reprojectionError = 3,
        numberOfHypotheses = 500,
        bundleSize = 100,
    } = {})
    {
        // validate shapes
        if(src.rows != 2 || src.columns < 4 || dest.rows != 2 || dest.columns != src.columns)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`You need two 2 x n (n >= 4) input matrices to compute a homography`);
        else if(homography.rows != 3 || homography.columns != 3)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`The output of findHomography() is a 3x3 homography`);
        else if(mask != null && (mask.rows != 1 || mask.columns != src.columns))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`Invalid shape of the inliers mask`);

        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].ready().then(([wasm, memory]) => {
            // allocate matrices
            const homptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, homography);
            const srcptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, src);
            const destptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, dest);
            const maskptr = mask != null ? _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, mask) : 0;

            // copy input matrices to WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyToMat32(wasm, memory, srcptr, src);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyToMat32(wasm, memory, destptr, dest);

            // run the WASM routine
            switch(method) {
                case 'pransac':
                    _utils_utils__WEBPACK_IMPORTED_MODULE_4__["Utils"].assert(reprojectionError >= 0 && numberOfHypotheses > 0 && bundleSize > 0);
                    wasm.exports.Mat32_pransac_homography(homptr, maskptr, srcptr, destptr, numberOfHypotheses, bundleSize, reprojectionError);
                    break;

                case 'dlt':
                    wasm.exports.Mat32_homography_ndlt(homptr, srcptr, destptr);
                    break;

                default:
                    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`Illegal method for findHomography(): "${method}"`);
            }

            // copy output matrices from WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyFromMat32(wasm, memory, homptr, homography);
            if(mask != null)
                _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyFromMat32(wasm, memory, maskptr, mask);

            // deallocate matrices
            if(mask != null)
                _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, maskptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, destptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, srcptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, homptr);

            // done!
            return homography;
        });
    }

    /**
     * Apply a perspective transformation to a set of 2D points
     * @param {SpeedyMatrix} dest 2 x n output matrix
     * @param {SpeedyMatrix} src 2 x n input matrix (a set of points)
     * @param {SpeedyMatrix} transform 3x3 homography matrix
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to dest
     */
    perspectiveTransform(dest, src, transform)
    {
        // validate shapes
        if(src.rows != 2 || dest.rows != 2 || src.columns != dest.columns)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`Invalid shapes`);
        else if(transform.rows != 3 || transform.columns != 3)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__["IllegalArgumentError"](`The perspective transformation must be a 3x3 matrix`);

        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].ready().then(([wasm, memory]) => {
            // allocate matrices
            const homptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, transform);
            const srcptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, src);
            const destptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].allocateMat32(wasm, memory, dest);

            // copy input matrices to WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyToMat32(wasm, memory, srcptr, src);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyToMat32(wasm, memory, homptr, transform);

            // run the WASM routine
            wasm.exports.Mat32_transform_perspective(destptr, srcptr, homptr);

            // copy output matrix from WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].copyFromMat32(wasm, memory, destptr, dest);

            // deallocate matrices
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, destptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, srcptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].deallocateMat32(wasm, memory, homptr);

            // done!
            return dest;
        });
    }
}

/***/ }),

/***/ "./src/core/speedy-matrix-wasm.js":
/*!****************************************!*\
  !*** ./src/core/speedy-matrix-wasm.js ***!
  \****************************************/
/*! exports provided: SpeedyMatrixWASM */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMatrixWASM", function() { return SpeedyMatrixWASM; });
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/globals */ "./src/utils/globals.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
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
 * speedy-matrix-wasm.js
 * WebAssembly bridge
 */






/** @type {Uint8Array} WebAssembly binary */
const WASM_BINARY = __webpack_require__(/*! ./wasm/speedy-matrix.wasm.txt */ "./src/core/wasm/speedy-matrix.wasm.txt");

/** @type {WebAssembly.Instance|null} WebAssembly Instance, to be loaded asynchronously */
let _instance = null;

/** @type {WebAssembly.Module|null} WebAssembly Module, to be loaded asynchronously */
let _module = null;

/**
 * @typedef {object} AugmentedMemory a union-like helper for accessing a WebAssembly.Memory
 * @property {object} as
 * @property {WebAssembly.Memory} as.object
 * @property {Uint8Array} as.uint8
 * @property {Int32Array} as.int32
 * @property {Uint32Array} as.uint32
 * @property {Float32Array} as.float32
 * @property {Float64Array} as.float64
 */

/** @type {AugmentedMemory} Augmented WebAssembly Memory object */
const _memory = (mem => ({
    as: {
        object: mem,
        uint8: new Uint8Array(mem.buffer),
        int32: new Int32Array(mem.buffer),
        uint32: new Uint32Array(mem.buffer),
        float32: new Float32Array(mem.buffer),
        float64: new Float64Array(mem.buffer),
    },
}))(new WebAssembly.Memory({
    initial: 16, // 1 MB
    maximum: 256
}));

/**
 * WebAssembly utilities
 */
class SpeedyMatrixWASM
{
    /**
     * Gets you the WASM instance, augmented memory & module
     * @returns {SpeedyPromise<[WebAssembly.Instance, AugmentedMemory, WebAssembly.Module]>}
     */
    static ready()
    {
        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__["SpeedyPromise"]((resolve, reject) => {
            SpeedyMatrixWASM._ready(resolve, reject);
        }).turbocharge();
    }

    /**
     * Gets you the WASM imports bound to a memory object
     * @param {AugmentedMemory} memory
     * @returns {Object.<string,Function>}
     */
    static imports(memory)
    {
        const obj = new SpeedyMatrixWASMImports(memory);

        return Object.getOwnPropertyNames(SpeedyMatrixWASMImports.prototype)
        .filter(property => typeof obj[property] === 'function' && property !== 'constructor')
        .reduce(
            (imports, methodName) => ((imports[methodName] = obj[methodName]), imports),
            Object.create(null)
        );
    }

    /**
     * Allocate a Mat32 in WebAssembly memory without copying any data
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @param {SpeedyMatrix} matrix
     * @returns {number} pointer to the new Mat32
     */
    static allocateMat32(wasm, memory, matrix)
    {
        const dataptr = wasm.exports.malloc(matrix.data.byteLength);
        const matptr = wasm.exports.Mat32_create(matrix.rows, matrix.columns, matrix.step0, matrix.step1, matrix._data.length, dataptr);

        return matptr;
    }

    /**
     * Deallocate a Mat32 in WebAssembly
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @param {number} matptr pointer to the allocated Mat32
     * @returns {number} NULL
     */
    static deallocateMat32(wasm, memory, matptr)
    {
        const dataptr = wasm.exports.Mat32_data(matptr);

        wasm.exports.free(matptr);
        wasm.exports.free(dataptr);

        return 0;
    }

    /**
     * Copy the data of a matrix to a WebAssembly Mat32
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @param {number} matptr pointer to a Mat32
     * @param {SpeedyMatrix} matrix
     * @returns {number} matptr
     */
    static copyToMat32(wasm, memory, matptr, matrix)
    {
        // We assume the following:
        // 1. the host uses little-endian byte ordering (just like WebAssembly)
        // 2. the allocated pointers are 4-byte aligned (the bump allocator guarantees this)
        // 3. the data type is float32

        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(
            //matrix.dtype === 'float32' &&
            matrix.data.byteLength === wasm.exports.Mat32_dataSize(matptr)
        );

        const dataptr = wasm.exports.Mat32_data(matptr);
        memory.as.float32.set(matrix.data, dataptr / Float32Array.BYTES_PER_ELEMENT);

        return matptr;
    }

    /**
     * Copy the data of a WebAssembly Mat32 to a matrix
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @param {number} matptr pointer to a Mat32
     * @param {SpeedyMatrix} matrix
     * @returns {number} matptr
     */
    static copyFromMat32(wasm, memory, matptr, matrix)
    {
        // We assume the following:
        // 1. the host uses little-endian byte ordering (just like WebAssembly)
        // 2. the allocated pointers are 4-byte aligned (the bump allocator guarantees this)
        // 3. the data type is float32

        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(
            //matrix.dtype === 'float32' &&
            matrix.data.byteLength === wasm.exports.Mat32_dataSize(matptr)
        );

        const base = wasm.exports.Mat32_data(matptr) / Float32Array.BYTES_PER_ELEMENT;
        for(let offset = matrix.data.length - 1; offset >= 0; offset--)
            matrix.data[offset] = memory.as.float32[base + offset];

        return matptr;
    }

    /**
     * Polls the WebAssembly instance until it's ready
     * @param {Function} resolve
     * @param {Function} reject
     * @param {number} [counter]
     */
    static _ready(resolve, reject, counter = 1000)
    {
        if(_instance !== null && _module !== null)
            resolve([_instance, _memory, _module]);
        else if(counter <= 0)
            reject(new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["TimeoutError"](`Can't load WASM instance`));
        else
            setTimeout(SpeedyMatrixWASM._ready, 0, resolve, reject, counter - 1);
    }
}

/**
 * Methods called from WASM
 */
class SpeedyMatrixWASMImports
{
    /**
     * Constructor
     * @param {AugmentedMemory} memory will be bound to this object
     */
    constructor(memory)
    {
        // find all methods of this object
        const methodNames = Object.getOwnPropertyNames(this.constructor.prototype)
                            .filter(property => typeof this[property] === 'function')
                            .filter(property => property !== 'constructor');

        // bind all methods to this object
        methodNames.forEach(methodName => {
            this[methodName] = this[methodName].bind(this);
        });

        /** @type {AugmentedMemory} WASM memory */
        this.memory = memory;

        /** @type {CStringUtils} utilities related to C strings */
        this.cstring = new CStringUtils(memory);

        // done!
        return Object.freeze(this);
    }

    /**
     * Prints a message
     * @param {number} ptr pointer to char
     */
    print(ptr)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].log(this.cstring.get(ptr));
    }

    /**
     * Throws an error
     * @param {number} ptr pointer to char
     */
    fatal(ptr)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["WebAssemblyError"](this.cstring.get(ptr));
    }

    /**
     * Fills a memory segment with a byte
     * @param {number} value byte
     * @param {number} start memory address, inclusive
     * @param {number} end memory address greater than start, exclusive
     */
    bytefill(value, start, end)
    {
        this.memory.as.uint8.fill(value, start, end);
    }

    /**
     * Copy a memory segment to another segment
     * @param {number} target memory address, where we'll start writing
     * @param {number} start memory address, where we'll start copying (inclusive)
     * @param {number} end memory address, where we'll end the copy (exclusive)
     */
    copyWithin(target, start, end)
    {
        this.memory.as.uint8.copyWithin(target, start, end);
    }
}

/**
 * Utilities related to C strings
 */
class CStringUtils
{
    /**
     * Constructor
     * @param {AugmentedMemory} memory
     */
    constructor(memory)
    {
        /** @type {TextDecoder} */
        this._decoder = new TextDecoder('utf-8');

        /** @type {AugmentedMemory} */
        this._memory = memory;
    }

    /**
     * Convert a C string to a JavaScript string
     * @param {number} ptr pointer to char
     * @returns {string}
     */
    get(ptr)
    {
        const byte = this._memory.as.uint8;
        const size = this._memory.as.uint8.byteLength;

        let p = ptr;
        while(p < size && 0 !== byte[p])
            ++p;

        return this._decoder.decode(byte.subarray(ptr, p));
    }
}

/**
 * WebAssembly loader
 * @param {AugmentedMemory} memory
 */
(function loadWASM(memory) {
    const base64decode = data => Uint8Array.from(atob(data), v => v.charCodeAt(0));

    // Endianness check
    if(!_utils_globals__WEBPACK_IMPORTED_MODULE_0__["LITTLE_ENDIAN"])
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["NotSupportedError"](`Can't run WebAssembly code: not in a little-endian machine!`);

    // Load the WASM binary
    _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__["SpeedyPromise"].resolve(WASM_BINARY)
    .then(data => base64decode(data))
    .then(bytes => WebAssembly.instantiate(bytes, {
        env: {
            memory: memory.as.object,
            ...SpeedyMatrixWASM.imports(memory),
        }
    }))
    .then(wasm => {
        _instance = wasm.instance;
        _module = wasm.module;

        wasm.instance.exports.srand((Date.now() * 0.001) & 0xffffffff); // srand(time(NULL))

        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].log(`The WebAssembly code has been loaded!`);
    })
    .catch(err => {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["WebAssemblyError"](`Can't load WebAssembly code: ${err}`, err);
    });
})(_memory);

/***/ }),

/***/ "./src/core/speedy-matrix.js":
/*!***********************************!*\
  !*** ./src/core/speedy-matrix.js ***!
  \***********************************/
/*! exports provided: SpeedyMatrix */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyMatrix", function() { return SpeedyMatrix; });
/* harmony import */ var _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-matrix-expr */ "./src/core/speedy-matrix-expr.js");
/* harmony import */ var _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-matrix-wasm */ "./src/core/speedy-matrix-wasm.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * speedy-matrix.js
 * Matrix class
 */







/**
 * Matrix class
 */
class SpeedyMatrix extends _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrixExpr"]
{
    /**
     * @private
     * 
     * Low-level constructor
     * @param {number} rows number of rows
     * @param {number} columns number of columns
     * @param {number} step0 step size between two consecutive elements (e.g., 1)
     * @param {number} step1 step size between two consecutive columns (e.g., rows)
     * @param {ArrayBufferView} data entries in column-major format
     */
    constructor(rows, columns, step0, step1, data)
    {
        super(rows, columns, _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrixExpr"].DEFAULT_DTYPE);

        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(data.constructor === _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrixExpr"].BUFFER_TYPE[this.dtype]);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(step0 > 0 && step1 >= step0);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(
            data.length + rows * columns === 0 || // empty matrix and empty buffer, or
            data.length === 1 + step0 * (rows - 1) + step1 * (columns - 1) // correctly sized buffer
        );

        /** @type {number} step size between two consecutive elements */
        this._step0 = step0 | 0;

        /** @type {number} step size between two consecutive columns */
        this._step1 = step1 | 0;

        /** @type {ArrayBufferView} buffer containing the entries of the matrix in column-major order */
        this._data = data;
    }

    /**
     * Create a new matrix with the specified size and entries
     * @param {number} rows number of rows
     * @param {number} columns number of columns
     * @param {number[]} entries in column-major format
     * @param {SpeedyMatrixType} [dtype] data type
     * @returns {SpeedyMatrix}
     */
    static Create(rows, columns, entries, dtype = _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrixExpr"].DEFAULT_DTYPE)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(rows * columns > 0, `Can't create a matrix without a shape`);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(rows * columns === entries.length, `Can't create matrix: expected ${rows * columns} entries, but found ${entries.length}`);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(Object.prototype.hasOwnProperty.call(_speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrixExpr"].BUFFER_TYPE, dtype), `Invalid dtype: "${dtype}"`);

        return new SpeedyMatrix(rows, columns, 1, rows, Reflect.construct(_speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrixExpr"].BUFFER_TYPE[dtype], [entries]));
    }

    /**
     * Create a new matrix filled with zeros with the specified size
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns
     * @param {SpeedyMatrixType} [dtype] data type
     * @returns {SpeedyMatrix}
     */
    static Zeros(rows, columns = rows, dtype = _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrixExpr"].DEFAULT_DTYPE)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(rows * columns > 0, `Can't create a matrix without a shape`);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(Object.prototype.hasOwnProperty.call(_speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrixExpr"].BUFFER_TYPE, dtype), `Invalid dtype: "${dtype}"`);

        return new SpeedyMatrix(rows, columns, 1, rows, Reflect.construct(_speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrixExpr"].BUFFER_TYPE[dtype], [rows * columns]));
    }

    /**
     * Create a new matrix filled with ones with the specified size
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns
     * @param {SpeedyMatrixType} [dtype] data type
     * @returns {SpeedyMatrix}
     */
    static Ones(rows, columns = rows, dtype = _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrixExpr"].DEFAULT_DTYPE)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(rows * columns > 0, `Can't create a matrix without a shape`);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(Object.prototype.hasOwnProperty.call(_speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrixExpr"].BUFFER_TYPE, dtype), `Invalid dtype: "${dtype}"`);

        return new SpeedyMatrix(rows, columns, 1, rows, Reflect.construct(_speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrixExpr"].BUFFER_TYPE[dtype], [rows * columns]).fill(1));
    }

    /**
     * Create a new identity matrix with the specified size
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns
     * @param {SpeedyMatrixType} [dtype] data type
     * @returns {SpeedyMatrix}
     */
    static Eye(rows, columns = rows, dtype = _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrixExpr"].DEFAULT_DTYPE)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(rows * columns > 0, `Can't create a matrix without a shape`);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(Object.prototype.hasOwnProperty.call(_speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrixExpr"].BUFFER_TYPE, dtype), `Invalid dtype: "${dtype}"`);

        const data = Reflect.construct(_speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__["SpeedyMatrixExpr"].BUFFER_TYPE[dtype], [rows * columns]);
        for(let j = Math.min(rows, columns) - 1; j >= 0; j--)
            data[j * rows + j] = 1;

        return new SpeedyMatrix(rows, columns, 1, rows, data);
    }

    /**
     * Get the underlying buffer
     * @returns {ArrayBufferView}
     */
    get data()
    {
        return this._data;
    }

    /**
     * Row-step
     * @returns {number} defaults to 1
     */
    get step0()
    {
        return this._step0;
    }

    /**
     * Column-step
     * @returns {number} defaults to this.rows
     */
    get step1()
    {
        return this._step1;
    }

    /**
     * Extract a block from this matrix. Use a shared underlying buffer
     * @param {number} firstRow
     * @param {number} lastRow
     * @param {number} firstColumn
     * @param {number} lastColumn
     * @returns {SpeedyMatrix}
     */
    block(firstRow, lastRow, firstColumn, lastColumn)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(
            firstRow <= lastRow && firstColumn <= lastColumn,
            `Invalid indices: [${firstRow}:${lastRow},${firstColumn}:${lastColumn}]`
        );

        // ensure that the indices are within bounds
        firstRow = Math.max(firstRow, 0);
        lastRow = Math.min(lastRow, this._rows - 1);
        firstColumn = Math.max(firstColumn, 0);
        lastColumn = Math.min(lastColumn, this._columns - 1);

        // compute the dimensions of the new submatrix
        const rows = lastRow - firstRow + 1;
        const columns = lastColumn - firstColumn + 1;

        // obtain the relevant portion of the data
        const step0 = this._step0, step1 = this._step1;
        const begin = firstRow * step0 + firstColumn * step1; // inclusive
        const end = 1 + lastRow * step0 + lastColumn * step1; // exclusive

        // create new matrix
        return new SpeedyMatrix(rows, columns, step0, step1, this._data.subarray(begin, end));
    }

    /**
     * Extract a row from this matrix
     * @param {number} index 0-based
     * @returns {SpeedyMatrix}
     */
    row(index)
    {
        return this.block(index, index, 0, this._columns - 1);
    }

    /**
     * Extract a column from this matrix
     * @param {number} index 0-based
     * @returns {SpeedyMatrix}
     */
    column(index)
    {
        return this.block(0, this._rows - 1, index, index);
    }

    /**
     * Extract the main diagonal from this matrix
     * @returns {SpeedyMatrix} as a column-vector
     */
    diagonal()
    {
        const diagsize = Math.min(this._rows, this._columns);

        // compute the dimensions of the new submatrix
        const rows = diagsize; // make it a column vector
        const columns = 1;

        // obtain the relevant portion of the data
        const diagstep = this._step0 + this._step1; // jump a row and a column
        const begin = 0; // inclusive
        const end = 1 + (diagsize - 1) * diagstep; // exclusive

        // create new matrix
        return new SpeedyMatrix(rows, columns, diagstep, diagstep, this._data.subarray(begin, end));
    }

    /**
     * Read a single entry of this matrix
     * @param {number} row 0-based index
     * @param {number} column 0-based index
     * @returns {number}
     */
    at(row, column)
    {
        if(row >= 0 && row < this._rows && column >= 0 && column < this._columns)
            return this._data[this._step0 * row + this._step1 * column];
        else
            return Number.NaN;
    }

    /**
     * Read the entries of the matrix in column-major format
     * @returns {number[]}
     */
    read()
    {
        const entries = new Array(this._rows * this._columns);
        const step0 = this._step0, step1 = this._step1;
        let i = 0;

        for(let column = 0; column < this._columns; column++) {
            for(let row = 0; row < this._rows; row++)
                entries[i++] = this._data[row * step0 + column * step1];
        }

        return entries;
    }

    /**
     * Returns a human-readable string representation of the matrix
     * @returns {string}
     */
    toString()
    {
        const DECIMALS = 5;
        const rows = this.rows, columns = this.columns;
        const entries = this.read();
        const mat = new Array(rows);

        for(let i = 0; i < rows; i++) {
            mat[i] = new Array(columns);
            for(let j = 0; j < columns; j++)
                mat[i][j] = entries[j * rows + i];
        }

        const fix = x => x.toFixed(DECIMALS);
        const fmt = mat.map(row => '    ' + row.map(fix).join(', ')).join(',\n');
        const str = `SpeedyMatrix(rows=${rows}, columns=${columns}, data=[\n${fmt}\n])`;

        return str;
    }

    /**
     * Set the contents of this matrix to the result of an expression
     * @param {SpeedyMatrixExpr} expr matrix expression
     * @returns {SpeedyPromise<SpeedyMatrix>}
     */
    setTo(expr)
    {
        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__["SpeedyMatrixWASM"].ready().then(([wasm, memory]) => {
            // evaluate the expression
            const result = expr._evaluate(wasm, memory);

            /*
            // shallow copy the results to this matrix
            // limitation: can't handle blocks properly
            // (a tree-like structure could be useful)
            this._rows = result.rows;
            this._columns = result.columns;
            //this._dtype = result.dtype;
            this._data = result.data;
            this._step0 = result.step0;
            this._step1 = result.step1;
            */

            // validate shape
            _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(
                this._rows === result._rows && this._columns === result._columns && this.dtype === result.dtype,
                `Can't set the values of a ${this.rows} x ${this.columns} ${this.dtype} matrix to those of a ${result.rows} x ${result.columns} ${result.dtype} matrix`
            );

            // deep copy
            const step0 = this._step0, step1 = this._step1, rstep0 = result._step0, rstep1 = result._step1;
            for(let column = this._columns - 1; column >= 0; column--) {
                for(let row = this._rows - 1; row >= 0; row--)
                    this._data[row * step0 + column * step1] = result._data[row * rstep0 + column * rstep1];
            }

            // done!
            return this;
        }).turbocharge();
    }

    /**
     * Fill this matrix with a scalar value
     * @param {number} value
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to this
     */
    fill(value)
    {
        value = +value;

        if(this._rows * this._columns === this._data.length) {
            this._data.fill(value);
            return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__["SpeedyPromise"].resolve(this);
        }

        for(let column = 0; column < this._columns; column++) {
            for(let row = 0; row < this._rows; row++) {
                this._data[row * this._step0 + column * this._step1] = value;
            }
        }

        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__["SpeedyPromise"].resolve(this);
    }

    /**
     * Evaluate this expression
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @returns {SpeedyMatrix}
     */
    _evaluate(wasm, memory)
    {
        return this;
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
        this._options = Object.freeze(options);

        /** @type {ColorFormat} color format */
        this._colorFormat = colorFormat;

        /** @type {SpeedyGPU} GPU-accelerated routines */ // FIXME
        this._gpu = options.lightweight ? Object.create(null) : new _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_0__["SpeedyGPU"]();
    }

    /**
     * Load a media source
     * Will wait until the HTML media source is loaded
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap} mediaSource An image, video or canvas
     * @param {object} [options] options object
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static load(mediaSource, options = {})
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
        const clone = new SpeedyMedia(this._source, this._options, this._colorFormat);

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

/***/ "./src/core/speedy-point.js":
/*!**********************************!*\
  !*** ./src/core/speedy-point.js ***!
  \**********************************/
/*! exports provided: SpeedyPoint2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyPoint2", function() { return SpeedyPoint2; });
/* harmony import */ var _speedy_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-vector */ "./src/core/speedy-vector.js");
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
        this._x = +x;

        /** @type {number} y coordinate */
        this._y = +y;
    }



    //
    // ===== METHODS =====
    //

    /**
     * x-coordinate
     * @returns {number}
     */
    get x()
    {
        return this._x;
    }

    /**
     * x-coordinate
     * @param {number} value
     */
    set x(value)
    {
        this._x = +value;
    }

    /**
     * y-coordinate
     * @returns {number}
     */
    get y()
    {
        return this._y;
    }

    /**
     * y-coordinate
     * @param {number} value
     */
    set y(value)
    {
        this._y = +value;
    }

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

/***/ "./src/core/speedy-size.js":
/*!*********************************!*\
  !*** ./src/core/speedy-size.js ***!
  \*********************************/
/*! exports provided: SpeedySize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedySize", function() { return SpeedySize; });
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
        this._width = Math.max(0, +width);

        /** @type {number} height */
        this._height = Math.max(0, +height);
    }



    //
    // ===== METHODS =====
    //

    /**
     * Width
     * @returns {number}
     */
    get width()
    {
        return this._width;
    }

    /**
     * Width
     * @param {number} value
     */
    set width(value)
    {
        this._width = Math.max(0, +value);
    }

    /**
     * Height
     * @returns {number}
     */
    get height()
    {
        return this._height;
    }

    /**
     * Height
     * @param {number} value
     */
    set height(value)
    {
        this._height = Math.max(0, +value);
    }

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

    /**
     * The area of the rectangle
     * @returns {number}
     */
    area()
    {
        return this.width * this.height;
    }
}

/***/ }),

/***/ "./src/core/speedy-vector.js":
/*!***********************************!*\
  !*** ./src/core/speedy-vector.js ***!
  \***********************************/
/*! exports provided: SpeedyVector2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyVector2", function() { return SpeedyVector2; });
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
        this._x = +x;

        /** @type {number} y coordinate */
        this._y = +y;
    }



    //
    // ===== METHODS =====
    //

    /**
     * x-coordinate
     * @returns {number}
     */
    get x()
    {
        return this._x;
    }

    /**
     * x-coordinate
     * @param {number} value
     */
    set x(value)
    {
        this._x = +value;
    }

    /**
     * y-coordinate
     * @returns {number}
     */
    get y()
    {
        return this._y;
    }

    /**
     * y-coordinate
     * @param {number} value
     */
    set y(value)
    {
        this._y = +value;
    }

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
/* harmony import */ var _speedy_vector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./speedy-vector */ "./src/core/speedy-vector.js");
/* harmony import */ var _speedy_point__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./speedy-point */ "./src/core/speedy-point.js");
/* harmony import */ var _speedy_size__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./speedy-size */ "./src/core/speedy-size.js");
/* harmony import */ var _speedy_matrix_factory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./speedy-matrix-factory */ "./src/core/speedy-matrix-factory.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _pipeline_pipeline__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pipeline/pipeline */ "./src/core/pipeline/pipeline.js");
/* harmony import */ var _pipeline_factories_image_factory__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pipeline/factories/image-factory */ "./src/core/pipeline/factories/image-factory.js");
/* harmony import */ var _pipeline_factories_filter_factory__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./pipeline/factories/filter-factory */ "./src/core/pipeline/factories/filter-factory.js");
/* harmony import */ var _pipeline_factories_transform_factory__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./pipeline/factories/transform-factory */ "./src/core/pipeline/factories/transform-factory.js");
/* harmony import */ var _pipeline_factories_keypoint_factory__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./pipeline/factories/keypoint-factory */ "./src/core/pipeline/factories/keypoint-factory.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/globals */ "./src/utils/globals.js");
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
const matrixFactory = new _speedy_matrix_factory__WEBPACK_IMPORTED_MODULE_5__["SpeedyMatrixFactory"]();

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
        return "0.8.1-wip";
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
     * Create a 2D vector
     * @param {number} x
     * @param {number} y
     */
    static Vector2(x, y)
    {
        return new _speedy_vector__WEBPACK_IMPORTED_MODULE_2__["SpeedyVector2"](x, y);
    }

    /**
     * Create a 2D point
     * @param {number} x
     * @param {number} y
     */
    static Point2(x, y)
    {
        return new _speedy_point__WEBPACK_IMPORTED_MODULE_3__["SpeedyPoint2"](x, y);
    }

    /**
     * Create a new size object
     * @param {number} width
     * @param {number} height
     */
    static Size(width, height)
    {
        return new _speedy_size__WEBPACK_IMPORTED_MODULE_4__["SpeedySize"](width, height);
    }

    /**
     * Matrix routines
     * @returns {SpeedyMatrixFactory}
     */
    static get Matrix()
    {
        return matrixFactory;
    }

    /**
     * Speedy Promises
     * @returns {Function}
     */
    static get Promise()
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_6__["SpeedyPromise"];
    }

    /**
     * Create a new Pipeline
     * @returns {SpeedyPipeline}
     */
    static Pipeline()
    {
        return new _pipeline_pipeline__WEBPACK_IMPORTED_MODULE_7__["SpeedyPipeline"]();
    }

    /**
     * Image-related nodes
     * @returns {Function}
     */
    static get Image()
    {
        return _pipeline_factories_image_factory__WEBPACK_IMPORTED_MODULE_8__["SpeedyPipelineImageFactory"];
    }

    /**
     * Image filters
     * @returns {Function}
     */
    static get Filter()
    {
        return _pipeline_factories_filter_factory__WEBPACK_IMPORTED_MODULE_9__["SpeedyPipelineFilterFactory"];
    }

    /**
     * Image transforms
     * @returns {Function}
     */
    static get Transform()
    {
        return _pipeline_factories_transform_factory__WEBPACK_IMPORTED_MODULE_10__["SpeedyPipelineTransformFactory"];
    }

    /**
     * Keypoint-related nodes
     * @returns {Function}
     */
    static get Keypoint()
    {
        return _pipeline_factories_keypoint_factory__WEBPACK_IMPORTED_MODULE_11__["SpeedyPipelineKeypointFactory"];
    }
}

// Big-endian machine? Currently untested.
if(!_utils_globals__WEBPACK_IMPORTED_MODULE_13__["LITTLE_ENDIAN"])
    _utils_utils__WEBPACK_IMPORTED_MODULE_12__["Utils"].warn('Running on a big-endian machine');

/***/ }),

/***/ "./src/core/wasm/speedy-matrix.wasm.txt":
/*!**********************************************!*\
  !*** ./src/core/wasm/speedy-matrix.wasm.txt ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = `AGFzbQEAAAABiwETYAABfmADf39/AX9gAX8AYAN/f38AYAF9AX9gAX8Bf2ACf38Bf2AFf39/f38B
f2AFf39/f38AYAZ/f39/f38Bf2AAAX9gAn99AX9gA39/fQF/YAJ/fwF9YAF/AX1gBH9/f38AYAR/
f39/AX9gEX98fHx8fHx8fHx8fHx8fHx8AGAHf39/f39/fQF/AjsEA2VudgZtZW1vcnkCAAIDZW52
BWZhdGFsAAIDZW52CGJ5dGVmaWxsAAMDZW52CmNvcHlXaXRoaW4AAwM7OgQFBgIGAQECBwgGAwAJ
AgYCBgYKBQUFCQsFBgEBDAEBBgYGAQEMAQ0OAwgPAxAIAwYBEQEBAQ8SAQEEBQFwAQUFBggBfwFB
0JcECwfGAxoGbWFsbG9jAAQEZnJlZQAGBXNyYW5kAAoMTWF0MzJfY3JlYXRlABANTWF0MzJfZGVz
dHJveQAXCk1hdDMyX2RhdGEAGA5NYXQzMl9kYXRhU2l6ZQAZD01hdDMyX3RyYW5zcG9zZQAdCU1h
dDMyX2FkZAAeDk1hdDMyX3N1YnRyYWN0AB8LTWF0MzJfc2NhbGUAIA5NYXQzMl9jb21wbXVsdAAh
Dk1hdDMyX211bHRpcGx5ACIOTWF0MzJfaW52ZXJzZTEAIw5NYXQzMl9pbnZlcnNlMgAkDk1hdDMy
X2ludmVyc2UzACUNTWF0MzJfcXJfZnVsbAAsEE1hdDMyX3FyX3JlZHVjZWQALwxNYXQzMl9xcl9v
bHMAMBBNYXQzMl9xcl9pbnZlcnNlADMVTWF0MzJfaG9tb2dyYXBoeV9kbHQ0ADQWTWF0MzJfaG9t
b2dyYXBoeV9uZGx0NAA2FE1hdDMyX2hvbW9ncmFwaHlfZGx0ADcVTWF0MzJfaG9tb2dyYXBoeV9u
ZGx0ADgYTWF0MzJfcHJhbnNhY19ob21vZ3JhcGh5ADobTWF0MzJfdHJhbnNmb3JtX3BlcnNwZWN0
aXZlADwJCgEAQQELBA8REzsKqJcBOiMBAX8gALwiAUGAgID8B3FBgICA/AdGIAFB////A3FBAEdx
C2kBAX9BAEEAKAKgl4CAAEEBajYCoJeAgABBAEEAKAKMl4CAACIBQQdxIAFqIgEgAGo2AoyXgIAA
AkBB0JeEgABBB3EgAWpB0JeEgABqIgA/AEEQdEkNAEGEiICAABCAgICAAEEADwsgAAt1AQJ/QQAh
AkEAQQAoAqCXgIAAQQFqNgKgl4CAAEEAQQAoAoyXgIAAIgNBB3EgA2oiAyAAajYCjJeAgAACQAJA
QdCXhIAAQQdxIANqQdCXhIAAaiIAPwBBEHRJDQAgAUUNASABEICAgIAAQQAPCyAAIQILIAILRgEC
f0EAQQAoAqCXgIAAIgFBf2oiAjYCoJeAgAACQCACDQBBAEEINgKMl4CAAA8LAkAgAUEASg0AQZOI
gIAAEICAgIAACwtGAQJ/QQBBACgCoJeAgAAiAkF/aiIDNgKgl4CAAAJAIAMNAEEAQQg2AoyXgIAA
QQAPCwJAIAJBAEoNACABEICAgIAAC0EACxcAIAFB/wFxIAAgACACahCBgICAACAACxMAIAAgASAB
IAJqEIKAgIAAIAALoQECAX8CfkEAKAKQl4CAACIBIACtQiCGIABBf3OthCICQqrw0/Sv7ry3PHwi
A0IeiCADhUK5y5Pn0e2RrL9/fiIDQhuIIAOFQuujxJmxt5LolH9+IgNCH4ggA4U3AwggASACQpX4
qfqXt96bnn98IgJCHoggAoVCucuT59Htkay/f34iAkIbiCAChULro8SZsbeS6JR/fiICQh+IIAKF
NwMAC0QBAX9B3oG33QAhBQJAIAJFDQAgAEUNACADRQ0AQQAhBSABQQJJDQAgACAAIAFBf2ogAmxq
IAIgAyAEEIyAgIAACyAFC60GAwR/AXwFfwJAAkAgASAASw0AIAEhBSAAIQYMAQtBACACayEHIAJB
BEshCANAIAEiBSAAIgZrIAJuIgFBCEkNAQJAAkBBACgClJeAgAARgICAgAAAQgyIQoCAgICAgID4
P4S/RAAAAAAAAPC/oCABQQFquKIiCUQAAAAAAADwQWMgCUQAAAAAAAAAAGZxRQ0AIAmrIQEMAQtB
ACEBCyAGIAEgAmxqIQogBSEBIAYhCwNAAkAgCyAKIAQgAxGBgICAAABBf0oNAANAIAsgAmoiCyAK
IAQgAxGBgICAAABBAEgNAAsLAkAgASAKIAQgAxGBgICAAABBAUgNAANAIAEgB2oiASAKIAQgAxGB
gICAAABBAEoNAAsLAkAgCyABTw0AIAEhACALIQwgAiENAkACQCAIDQACQAJAIAIOBQMBAQEAAwsg
CygCACEAIAsgASgCADYCACABIAA2AgAMAgsgASEAIAshDCACIQ0LA0AgDC0AACEOIAwgAC0AADoA
ACAAIA46AAAgAEEBaiEAIAxBAWohDCANQX9qIg0NAAsLIAEgCyAKIAogAUYbIAogC0YbIQogASAH
aiEBIAsgAmohCwwBCwsgCyACaiALIAsgAUYiABshDAJAAkAgASAHaiABIAAbIgEgBk0NACAMIAVP
DQACQCABIAZrIAUgDGtNDQAgDCAFIAIgAyAEEIyAgIAAIAYhAAwCCyAGIAEgAiADIAQQjICAgAAg
BSEBIAwhAAwBCyAGIAwgASAGSyIKGyEAIAEgBSAKGyEBIAoNACAMIAVPDQILIAEhBSAAIQYgASAA
Sw0ACwsCQCAGIAVPDQAgAkEESyEHA0AgBiINIAJqIgYhASANIQACQCAGIAVLDQADQCABIAAgASAA
IAQgAxGBgICAAABBAEgbIQAgASACaiIBIAVNDQALIAAgDUYNAAJAIAcNAAJAIAIOBQIBAQEAAgsg
ACgCACEBIAAgDSgCADYCACANIAE2AgAMAQtBACEBA0AgACABaiIMLQAAIQogDCANIAFqIgstAAA6
AAAgCyAKOgAAIAIgAUEBaiIBRw0ACwsgBiAFSQ0ACwsLNQECfwJAIAFBAUgNAEEAIQIgACEDA0Ag
AyACNgIAIANBBGohAyABIAJBAWoiAkcNAAsLIAALvgIFAn8BfAF/AXwEfwJAIAFBf2oiA0UNACAC
QQRLIQREAAAAAAAAAAAhBUEAIQYDQAJAAkBBACgClJeAgAARgICAgAAAQgyIQoCAgICAgID4P4S/
RAAAAAAAAPC/oCABIAZruKIgBaAiB0QAAAAAAADwQWMgB0QAAAAAAAAAAGZxRQ0AIAerIQgMAQtB
ACEICwJAIAYgCEYNAAJAIAQNAAJAIAIOBQIBAQEAAgsgACAGQQJ0aiIJKAIAIQogCSAAIAhBAnRq
IggoAgA2AgAgCCAKNgIADAELIAAgBiACbGohCSAAIAggAmxqIQggAiEKA0AgCS0AACELIAkgCC0A
ADoAACAIIAs6AAAgCEEBaiEIIAlBAWohCSAKQX9qIgoNAAsLIAVEAAAAAAAA8D+gIQUgBkEBaiIG
IANHDQALCwtFAQN+QQBBACkDuJeAgAAiAEEAKQOwl4CAACIBhSICQiWJNwO4l4CAAEEAIAFCGIkg
AoUgAkIQhoU3A7CXgIAAIAAgAXwLlAEBAX8CQAJAIAMgAkgNACAAQQFIDQAgAUEBSA0AIAJBAUgN
ACAAQX9qIAJsIAFBf2ogA2xqQQFqIARHDQAgBQ0BC0GfiICAABCAgICAAAtBHEG+iICAABCFgICA
ACIGIAM2AhQgBiACNgIQIAYgATYCDCAGIAA2AgggBiAENgIEIAZBgoCAgAA2AhggBiAFNgIAIAYL
AgALkwEBBH8CQAJAIABBAUgNACABQQBKDQELQdqIgIAAEICAgIAAC0EcQfmIgIAAEIWAgIAAIQIg
ASAAbCIDQQJ0IgRBlYmAgAAQhYCAgAAhBSACIAA2AhQgAkEBNgIQIAIgATYCDCACIAA2AgggAiAD
NgIEIAVBACAEEIiAgIAAIQAgAkGDgICAADYCGCACIAA2AgAgAgsRACAAQeeKgIAAEIeAgIAAGgv0
AQEEfwJAAkAgAEEBSA0AIAFBAEoNAQtB2oiAgAAQgICAgAALQRxB+YiAgAAQhYCAgAAhAiABIABs
IgNBAnQiBEGViYCAABCFgICAACEFIAIgADYCFCACQQE2AhAgAiABNgIMIAIgADYCCCACIAM2AgQg
BUEAIAQQiICAgAAhAyACQYOAgIAANgIYIAIgAzYCAAJAIAAgASAAIAFIGyIBQQFIDQAgAyACKAIU
IAIoAhBqIgQgAUF/amxBAnRqIQAgAUEBaiEBQQAgBEECdGshAwNAIABBgICA/AM2AgAgACADaiEA
IAFBf2oiAUEBSg0ACwsgAguYAgEKfwJAAkAgACgCCCABKAIIRw0AIAAoAgwgASgCDEYNAQtBx4qA
gAAQgICAgAALAkACQCAAKAIEIgIgASgCBEYNACAAKAIMIgNBAUgNAUEAIQQgACgCCCIFQQFIIQZB
ACEHA0ACQCAGDQAgACgCEEECdCEIIAEoAhBBAnQhCSAAKAIAIAAoAhQgBGxqIQIgASgCACABKAIU
IARsaiEKQQAhCwNAIAIgCigCADYCACACIAhqIQIgCiAJaiEKIAtBAWoiCyAFSA0ACwsgBEEEaiEE
IAdBAWoiByADSA0ADAILCwJAIAEoAgAiCiAAKAIAIgsgAkECdCICak8NACAKIAJqIAtLDQELIAsg
CiACEImAgIAAGgsgAAtVAQF/QRxBsYmAgAAQhYCAgAAiAEEYakEAKALoiYCAADYCACAAQRBqQQAp
AuCJgIAANwIAIABBCGpBACkC2ImAgAA3AgAgAEEAKQLQiYCAADcCACAACyEAIAAoAgAgACgCGBGC
gICAAAAgAEHsiYCAABCHgICAAAsHACAAKAIACwoAIAAoAgRBAnQL0AEBAn8CQCAAKAIYQYKAgIAA
Rg0AQYeKgIAAEICAgIAACwJAAkAgAyACSA0AIAJBAEgNACAFIARIDQAgBEEASA0AIAEoAgggA0wN
ACABKAIMIAVKDQELQaeKgIAAEICAgIAACyABKAIQIQYgAEEUaiABQRRqKAIAIgc2AgAgACAGNgIQ
IAAgBSAEa0EBajYCDCAAIAMgAmtBAWo2AgggACAGIANsIAcgBWxqIAcgBGwgBiACbGoiAmtBAWo2
AgQgACABKAIAIAJBAnRqNgIAIAALgQEBCH8CQCAAKAIMIgJBAUgNAEEAIQMgACgCCCIEQQFIIQVB
ACEGA0ACQCAFDQAgACgCEEECdCEHIAAoAgAgACgCFCADbGohCEEAIQkDQCAIIAE4AgAgCCAHaiEI
IAlBAWoiCSAESA0ACwsgA0EEaiEDIAZBAWoiBiACSA0ACwsgAAumAQEIfwJAIAAoAgwiASAAKAII
IgJsIgMgACgCBEcNACAAKAIAQQAgA0ECdBCIgICAABogAA8LAkAgAUEBSA0AIAJBAUghBEEAIQVB
ACEGA0ACQCAEDQAgACgCEEECdCEHIAAoAgAgACgCFCAFbGohAyACIQgDQCADQQA2AgAgAyAHaiED
IAhBf2oiCA0ACwsgBUEEaiEFIAZBAWoiBiABRw0ACwsgAAvcAQEKfwJAAkAgACgCCCABKAIMRw0A
IAAoAgwiAiABKAIIRg0BC0GBi4CAABCAgICAACAAKAIMIQILAkAgAkEBSA0AIAAoAgwhA0EAIQQg
ACgCCCIFQQFIIQZBACEHA0ACQCAGDQAgACgCEEECdCEIIAEoAhRBAnQhCSAAKAIAIAAoAhQgBGxq
IQIgASgCACABKAIQIARsaiEKQQAhCwNAIAIgCigCADYCACACIAhqIQIgCiAJaiEKIAtBAWoiCyAF
SA0ACwsgBEEEaiEEIAdBAWoiByADSA0ACwsgAAuZAgEMfwJAAkAgASgCCCIDIAIoAghHDQAgASgC
DCIEIAIoAgxHDQAgACgCCCADRw0AIAAoAgwgBEYNAQtBp4uAgAAQgICAgAAgACgCDCEECwJAIARB
AUgNACAAKAIMIQVBACEGIAAoAggiB0EBSCEIQQAhCQNAAkAgCA0AIAAoAhBBAnQhCiACKAIQQQJ0
IQsgASgCEEECdCEMIAAoAgAgACgCFCAGbGohBCACKAIAIAIoAhQgBmxqIQMgASgCACABKAIUIAZs
aiENQQAhDgNAIAQgDSoCACADKgIAkjgCACAEIApqIQQgAyALaiEDIA0gDGohDSAOQQFqIg4gB0gN
AAsLIAZBBGohBiAJQQFqIgkgBUgNAAsLIAALmQIBDH8CQAJAIAEoAggiAyACKAIIRw0AIAEoAgwi
BCACKAIMRw0AIAAoAgggA0cNACAAKAIMIARGDQELQc2LgIAAEICAgIAAIAAoAgwhBAsCQCAEQQFI
DQAgACgCDCEFQQAhBiAAKAIIIgdBAUghCEEAIQkDQAJAIAgNACAAKAIQQQJ0IQogAigCEEECdCEL
IAEoAhBBAnQhDCAAKAIAIAAoAhQgBmxqIQQgAigCACACKAIUIAZsaiEDIAEoAgAgASgCFCAGbGoh
DUEAIQ4DQCAEIA0qAgAgAyoCAJM4AgAgBCAKaiEEIAMgC2ohAyANIAxqIQ0gDkEBaiIOIAdIDQAL
CyAGQQRqIQYgCUEBaiIJIAVIDQALCyAAC98BAQp/AkACQCAAKAIIIAEoAghHDQAgACgCDCIDIAEo
AgxGDQELQfOLgIAAEICAgIAAIAAoAgwhAwsCQCADQQFIDQAgACgCDCEEQQAhBSAAKAIIIgZBAUgh
B0EAIQgDQAJAIAcNACAAKAIQQQJ0IQkgASgCEEECdCEKIAAoAgAgACgCFCAFbGohAyABKAIAIAEo
AhQgBWxqIQtBACEMA0AgAyALKgIAIAKUOAIAIAMgCWohAyALIApqIQsgDEEBaiIMIAZIDQALCyAF
QQRqIQUgCEEBaiIIIARIDQALCyAAC5kCAQx/AkACQCABKAIIIgMgAigCCEcNACABKAIMIgQgAigC
DEcNACAAKAIIIANHDQAgACgCDCAERg0BC0GZjICAABCAgICAACAAKAIMIQQLAkAgBEEBSA0AIAAo
AgwhBUEAIQYgACgCCCIHQQFIIQhBACEJA0ACQCAIDQAgACgCEEECdCEKIAIoAhBBAnQhCyABKAIQ
QQJ0IQwgACgCACAAKAIUIAZsaiEEIAIoAgAgAigCFCAGbGohAyABKAIAIAEoAhQgBmxqIQ1BACEO
A0AgBCANKgIAIAMqAgCUOAIAIAQgCmohBCADIAtqIQMgDSAMaiENIA5BAWoiDiAHSA0ACwsgBkEE
aiEGIAlBAWoiCSAFSA0ACwsgAAvOAgMLfwF9BX8CQAJAIAEoAgwgAigCCEcNACAAKAIIIAEoAghH
DQAgACgCDCACKAIMRg0BC0HAjICAABCAgICAAAsgABCcgICAABoCQCAAKAIMIgNBAUgNAEEAIQQg
AigCCCIFQQFIIQZBACEHA0ACQCAGDQAgAigCFCAHbCEIIAAoAgghCSACKAIQIQogAigCACELQQAh
DEEAIQ0DQAJAIAlBAUgNACALIAggCiANbGpBAnRqKgIAIQ4gACgCEEECdCEPIAEoAhBBAnQhECAA
KAIAIAQgACgCFGxqIREgASgCACABKAIUIAxsaiESQQAhEwNAIBEgDiASKgIAlCARKgIAkjgCACAR
IA9qIREgEiAQaiESIBNBAWoiEyAJSA0ACwsgDEEEaiEMIA1BAWoiDSAFSA0ACwsgBEEEaiEEIAdB
AWoiByADSA0ACwsgAAuIAQICfwF9AkACQCAAKAIIIgIgASgCCEcNACACQQFHDQAgAiAAKAIMIgNH
DQAgAyABKAIMRg0BC0HnjICAABCAgICAAAsCQAJAIAEoAgAqAgAiBIu7RI3ttaD3xrA+Y0EBcw0A
QQAqAoCIgIAAIQQMAQtDAACAPyAElSEECyAAKAIAIAQ4AgAgAAuNAgICfwV9AkACQCAAKAIIIgIg
ASgCCEcNACACQQJHDQAgAiAAKAIMIgNHDQAgAyABKAIMRg0BC0GOjYCAABCAgICAAAsCQAJAIAEo
AgAiAioCACIEIAIgAUEUaigCACIDIAEoAhAiAWpBAnRqKgIAIgWUIAIgAUECdGoqAgAiBiACIANB
AnRqKgIAIgeUkyIIi7tEje21oPfGsD5jQQFzDQBBACoCgIiAgAAhCAwBC0MAAIA/IAiVIQgLIAAo
AgAiASAFIAiUOAIAIAEgACgCECICQQJ0aiAIIAaMlDgCACABIABBFGooAgAiA0ECdGogCCAHjJQ4
AgAgASADIAJqQQJ0aiAEIAiUOAIAIAALnAQGAn8CfQF/BX0BfwZ9AkACQCAAKAIIIgIgASgCCEcN
ACACQQNHDQAgAiAAKAIMIgNHDQAgAyABKAIMRg0BC0G1jYCAABCAgICAAAsCQAJAIAEoAgAiAiAB
KAIQIgNBA3RqKgIAIgQgAiABQRRqKAIAIgFBAnRqKgIAIgUgAiABQQF0IgYgA2pBAnRqKgIAIgeU
IAIgASADakECdGoqAgAiCCACIAFBA3RqKgIAIgmUkyIKlCACKgIAIgsgCCACIAYgA0EBdCIMakEC
dGoqAgAiDZQgAiAMIAFqQQJ0aioCACIOIAeUkyIPlCACIANBAnRqKgIAIhAgBSANlCAOIAmUkyIR
lJOSIhKLu0SN7bWg98awPmNBAXMNAEEAKgKAiICAACESDAELQwAAgD8gEpUhEgsgACgCACICIA8g
EpQ4AgAgAiAAKAIQIgFBAnRqIBIgECANlCAEIAeUk4yUOAIAIAIgAUEDdGogECAOlCAEIAiUkyAS
lDgCACACIABBFGooAgAiA0ECdGogEiARjJQ4AgAgAiADIAFqIgZBAnRqIAsgDZQgBCAJlJMgEpQ4
AgAgAiADIAFBAXRqQQJ0aiASIAsgDpQgBCAFlJOMlDgCACACIANBA3RqIAogEpQ4AgAgAiABIANB
AXRqQQJ0aiASIAsgB5QgECAJlJOMlDgCACACIAZBA3RqIAsgCJQgECAFlJMgEpQ4AgAgAAvZAgIR
fwF9AkACQCABKAIIIAIoAghHDQAgACgCCCABKAIMRw0AIAAoAgwiAyACKAIMRg0BC0HcjYCAABCA
gICAACAAKAIMIQMLAkAgA0EBSA0AIAAoAgwhBCAAKAIIIgVBAUghBkEAIQdBACEIA0ACQCAGDQAg
ACgCFCAIbCEJIAIoAgghCiAAKAIQIQsgACgCACEMQQAhDUEAIQ4DQCAMIAkgCyAObGpBAnRqIg9B
ADYCAAJAIApBAUgNACACKAIQQQJ0IRAgASgCEEECdCERIAIoAgAgByACKAIUbGohAyABKAIAIAEo
AhQgDWxqIRJBACETQwAAAAAhFANAIA8gFCASKgIAIAMqAgCUkiIUOAIAIAMgEGohAyASIBFqIRIg
E0EBaiITIApIDQALCyANQQRqIQ0gDkEBaiIOIAVIDQALCyAHQQRqIQcgCEEBaiIIIARIDQALCyAA
C5sFBAR/An0DfxB9AkACQCAAKAIIIgMgACgCDEcNACABKAIIIgQgASgCDEcNACACKAIIIgVBA0cN
ACAEQQNHDQAgA0EDRw0AIAUgAigCDEYNAQtBg46AgAAQgICAgAALIAIoAgAiAyACQRRqKAIAIgRB
AXQiBiACKAIQIgVBAXQiAmpBAnRqKgIAIQcgAyACIARqQQJ0aioCACEIIAEoAgAiAiABKAIQIglB
AXQiCiABQRRqKAIAIgtqQQJ0aioCACEMIAIgC0EBdCIBIApqQQJ0aioCACENIAMgBEEDdGoqAgAh
DiADIAYgBWpBAnRqKgIAIQ8gAyAEQQJ0aioCACEQIAMgBCAFakECdGoqAgAhESACIAlBA3RqKgIA
IRIgAiAJQQJ0aioCACETIAIgCyAJakECdGoqAgAhFCACIAEgCWpBAnRqKgIAIRUgACgCACIBIAIq
AgAiFiADKgIAIheUIAIgC0ECdGoqAgAiGCADIAVBAnRqKgIAIhmUkiACIAtBA3RqKgIAIhogAyAF
QQN0aioCACIblJI4AgAgASAAKAIQIgNBAnRqIBMgF5QgFCAZlJIgFSAblJI4AgAgASADQQN0aiAS
IBeUIAwgGZSSIA0gG5SSOAIAIAEgAEEUaigCACICQQJ0aiAWIBCUIBggEZSSIBogCJSSOAIAIAEg
AiADaiIEQQJ0aiATIBCUIBQgEZSSIBUgCJSSOAIAIAEgAiADQQF0akECdGogEiAQlCAMIBGUkiAN
IAiUkjgCACABIAJBA3RqIBYgDpQgGCAPlJIgGiAHlJI4AgAgASADIAJBAXRqQQJ0aiATIA6UIBQg
D5SSIBUgB5SSOAIAIAEgBEEDdGogEiAOlCAMIA+UkiANIAeUkjgCACAAC+UBAQp/AkACQCAAKAII
IAEoAghHDQAgACgCDCIDIAEoAgxGDQELQaqOgIAAEICAgIAAIAAoAgwhAwsCQCADQQFIDQAgACgC
DCEEQQAhBSAAKAIIIgZBAUghB0EAIQgDQAJAIAcNACAAKAIQQQJ0IQkgASgCEEECdCEKIAAoAgAg
ACgCFCAFbGohAyABKAIAIAEoAhQgBWxqIQtBACEMA0AgAyALKgIAIAKUIAMqAgCSOAIAIAMgCWoh
AyALIApqIQsgDEEBaiIMIAZIDQALCyAFQQRqIQUgCEEBaiIIIARIDQALCyAAC48CAwh/AX0DfwJA
AkAgASgCDEEBRw0AIAIoAghBAUcNACAAKAIIIAEoAghHDQAgACgCDCIDIAIoAgxGDQELQdGOgIAA
EICAgIAAIAAoAgwhAwsCQCADQQFIDQAgAkEUaigCACEEIAAoAgwhBSACKAIAIQZBACEHIAAoAggi
CEEBSCEJQQAhCgNAAkAgCQ0AIAYgBCAKbEECdGoqAgAhCyAAKAIQQQJ0IQwgASgCEEECdCENIAAo
AgAgACgCFCAHbGohAiABKAIAIQNBACEOA0AgAiALIAMqAgCUOAIAIAIgDGohAiADIA1qIQMgDkEB
aiIOIAhIDQALCyAHQQRqIQcgCkEBaiIKIAVIDQALCyAAC70BAwF/AX0DfwJAAkAgACgCDEEBRw0A
IAEoAgxBAUcNACAAKAIIIgIgASgCCEYNAQtB+I6AgAAQgICAgAAgASgCCCECCwJAAkAgAkEBTg0A
QwAAAAAhAwwBCyABKAIQQQJ0IQQgACgCEEECdCEFIAEoAgghBiABKAIAIQEgACgCACEAQwAAAAAh
A0EAIQIDQCADIAAqAgAgASoCAJSSIQMgASAEaiEBIAAgBWohACACQQFqIgIgBkgNAAsLIAMLggEE
AX8BfQJ/AX0CQCAAKAIMQQFGDQBBn4+AgAAQgICAgAALAkACQCAAKAIIIgFBAU4NAEMAAAAAIQIM
AQsgACgCEEECdCEDIAAoAgAhAEEAIQRDAAAAACECA0AgAiAAKgIAIgUgBZSSIQIgACADaiEAIARB
AWoiBCABSA0ACwsgApELsQIBBX8CQCACKAIIIgMgAigCDCIETg0AQcaPgIAAEICAgIAACwJAAkAg
ACgCCCADRw0AIAAoAgwgA0cNACABKAIIIANHDQAgASgCDCAERg0BC0Hlj4CAABCAgICAAAsgBEEC
dEGfkYCAABCFgICAACEFAkACQCAEQQFIDQBBACEGIAUhBwNAIAcgAyAGakEBEJKAgIAANgIAIAdB
BGohByAEIAZBf2oiBmoNAAsgAyAEIAUgASACEK2AgIAAIAMgBCAFIAAQroCAgAAgBEEBaiEHIARB
AnQgBWpBfGohBgNAIAYoAgAQl4CAgAAaIAZBfGohBiAHQX9qIgdBAUoNAAwCCwsgAyAEIAUgASAC
EK2AgIAAIAMgBCAFIAAQroCAgAALIAVBlZKAgAAQh4CAgAAaC5AEAgl/An0CQCAAIAFODQBBupGA
gAAQgICAgAALAkACQCAEKAIIIABHDQAgBCgCDCABRw0AIAMoAgggAEcNACADKAIMIAFGDQELQdiR
gIAAEICAgIAACxCWgICAACEFEJaAgIAAIQYQloCAgAAhBxCWgICAACEIIABBAWoiCSABQQFqIgoQ
koCAgAAhCyAJIAoQkoCAgAAhDCADIAQQlYCAgAAaAkAgAUEBSA0AIAFBf2ohDSAAQX9qIQpBACEA
A0AgBSADIAAgCiAAIAAQmoCAgAAiBCgCACoCACEOIAIoAgAgBBCVgICAABogBBCrgICAACEPIAIo
AgAiBCgCACIJIA8gDkMAAAAAYCAOQwAAAABda7KUIAkqAgCSOAIAAkAgBBCrgICAACIOi7tEje21
oPfGsD5jDQAgAigCACIEIARDAACAPyAOlRCggICAABogBiADIAAgCiAAIA0QmoCAgAAhBCAHIAtB
ASACKAIAKAIMQQEgBCgCDBCagICAACACKAIAIAQQpoCAgAAhCSAEIAggDEEBIAIoAgAoAghBASAE
KAIMEJqAgIAAIAIoAgAgCRCpgICAAEMAAADAEKiAgIAAGgsgAkEEaiECIAEgAEEBaiIARw0ACwsg
DBCXgICAABogCxCXgICAABogCBCXgICAABogBxCXgICAABogBhCXgICAABogBRCXgICAABoL8gIC
CH8BfQJAAkAgAygCCCAARw0AIAMoAgwiBCAARg0BIAQgAUYNAQtB9pGAgAAQgICAgAALEJaAgIAA
IQUQloCAgAAhBiADEJyAgIAAGgJAIAMoAgwiB0EBSA0AIAMoAgAgA0EUaigCACADKAIQaiIIIAdB
f2psQQJ0aiEEIAdBAWohCUEAIAhBAnRrIQgDQCAEQYCAgPwDNgIAIAQgCGohBCAJQX9qIglBAUoN
AAsgB0EBSA0AIAFBAWohCiAAQX9qIQAgAUECdCACakF8aiELQQAhAgNAIAUgA0EAIAAgAiACEJqA
gIAAIQcgCyEEIAohCQJAIAFBAUgNAANAIAYgByAJQX5qIABBAEEAEJqAgIAAIQggBCgCACAIEKqA
gIAAIQwgCCAEKAIAIAxDAAAAwJQQqICAgAAaIARBfGohBCAJQX9qIglBAUoNAAsLIAJBAWoiAiAD
KAIMSA0ACwsgBhCXgICAABogBRCXgICAABoLlwMBB38CQCACKAIIIgMgAigCDCIETg0AQYSQgIAA
EICAgIAACwJAAkAgACgCCCADRw0AIAAoAgwgBEcNACABKAIIIARHDQAgASgCDCAERg0BC0GjkICA
ABCAgICAAAsQloCAgAAhBSADIAQQkoCAgAAhBiAEQQJ0QZ+RgIAAEIWAgIAAIQcCQAJAIARBAUgN
AEEAIQggByEJA0AgCSADIAhqQQEQkoCAgAA2AgAgCUEEaiEJIAQgCEF/aiIIag0ACyADIAQgByAG
IAIQrYCAgAAgAyAEIAcgABCugICAACABIAUgBkEAIARBf2oiCEEAIAgQmoCAgAAQlYCAgAAaIARB
AWohCSAEQQJ0IAdqQXxqIQgDQCAIKAIAEJeAgIAAGiAIQXxqIQggCUF/aiIJQQFKDQAMAgsLIAMg
BCAHIAYgAhCtgICAACADIAQgByAAEK6AgIAAIAEgBSAGQQAgBEF/aiIIQQAgCBCagICAABCVgICA
ABoLIAdBlZKAgAAQh4CAgAAaIAYQl4CAgAAaIAUQl4CAgAAaC+QDAQp/AkAgASgCCCIEIAEoAgwi
BU4NAEHCkICAABCAgICAAAsCQAJAIAIoAgggBEcNACACKAIMQQFHDQAgACgCCCAFRw0AIAAoAgxB
AUYNAQtB4ZCAgAAQgICAgAALIAQgBRCSgICAACEGIARBARCSgICAACEHIARBARCSgICAACEIIAVB
ARCSgICAACEJIAVBAnRBn5GAgAAQhYCAgAAhCgJAIAVBAUgNACAEIQsgCiEMIAUhDQNAIAwgC0EB
EJKAgIAANgIAIAtBf2ohCyAMQQRqIQwgDUF/aiINDQALCyAEIAUgCiAGIAEQrYCAgAAgBCAFIAog
ByACELGAgIAAIAAgBiAHELKAgIAAAkAgA0EBSA0AIANBAWohCwNAIAggAiAHIAEgABCigICAABCf
gICAABogBCAFIAogByAIELGAgIAAIAkgBiAHELKAgIAAIAAgCUMAAIA/EKiAgIAAGiALQX9qIgtB
AUoNAAsLAkAgBUEBSA0AIAVBAWohDCAFQQJ0IApqQXxqIQsDQCALKAIAEJeAgIAAGiALQXxqIQsg
DEF/aiIMQQFKDQALCyAKQZWSgIAAEIeAgIAAGiAJEJeAgIAAGiAIEJeAgIAAGiAHEJeAgIAAGiAG
EJeAgIAAGiAAC+MCAwh/AX0BfwJAAkAgAygCCCAARw0AIAMoAgxBAUcNACAEKAIIIABHDQAgBCgC
DEEBRg0BC0GukoCAABCAgICAAAsgAyAEEJWAgIAAGgJAIAFBAUgNAEEAIQUgACEGQQAhBwNAAkAg
ByAATiIIDQAgAygCECIEQQJ0IQkgAygCACAEIAVsaiEEIAIgB0ECdGoiCigCACILKAIQQQJ0IQwg
CygCACELQwAAAAAhDSAGIQ4DQCANIAsqAgAgBCoCAJSSIQ0gBCAJaiEEIAsgDGohCyAOQX9qIg4N
AAsgCA0AIA0gDZIhDSADKAIQIgRBAnQhCSADKAIAIAQgBWxqIQQgCigCACILKAIQQQJ0IQwgCygC
ACELIAYhDgNAIAQgBCoCACANIAsqAgCUkzgCACAEIAlqIQQgCyAMaiELIA5Bf2oiDg0ACwsgBUEE
aiEFIAZBf2ohBiAHQQFqIgcgAUcNAAsLC7IDAwx/An0DfwJAIAEoAggiAyABKAIMIgRODQBBzZKA
gAAQgICAgAALAkACQCAAKAIIIARHDQAgACgCDEEBRw0AIAIoAgggA0cNACACKAIMQQFGDQELQeyS
gIAAEICAgIAACwJAIARBAUgNAEEAIQVBACABQRRqKAIAIgNBAnQiBiABKAIQIgdBAnRqayEIIAEo
AgAiCSADIARsIAcgBEF/amxqQQJ0aiEKIARBAnQhCyADIAdqIQwgBCENA0ACQCAJIAwgDUF/aiIO
bEECdGoqAgAiD4u7RI3ttaD3xrA+Y0EBcw0AIABBACoCgIiAgAAQm4CAgAAaDwsgAigCACACKAIQ
IA5sQQJ0aioCACEQAkACQCANIARIDQAgACgCECERIAAoAgAhEgwBCyAAKAIQIhFBAnQhEyAAKAIA
IhIgESALbGohASAKIQMgBSEHA0AgECADKgIAIAEqAgCUkyEQIAEgE2ohASADIAZqIQMgB0F/aiIH
DQALCyASIBEgDmxBAnRqIBAgD5U4AgAgC0F8aiELIAogCGohCiAFQQFqIQUgDUEBSiEBIA4hDSAB
DQALCwvCAwEKfwJAAkAgACgCCCICIAAoAgxHDQAgAiABKAIIIgNHDQAgAyABKAIMRg0BC0GAkYCA
ABCAgICAACAAKAIMIQILIAIgAhCUgICAACEEIAIgAhCSgICAACEFIAJBARCSgICAACEGEJaAgIAA
IQcQloCAgAAhCCACQQJ0QZ+RgIAAEIWAgIAAIQkCQAJAIAJBAUgNACAJIQMgAiEKA0AgAyAKQQEQ
koCAgAA2AgAgA0EEaiEDIApBf2oiCg0ACyACIAIgCSAFIAEQrYCAgAAgAkEBSA0BIAJBf2ohCkEA
IQMDQCAHIARBACAKIAMgAxCagICAACEBIAggAEEAIAogAyADEJqAgIAAIQsgAiACIAkgBiABELGA
gIAAIAsgBSAGELKAgIAAIAIgA0EBaiIDRw0ACyACQQFIDQEgAkEBaiEKIAJBAnQgCWpBfGohAwNA
IAMoAgAQl4CAgAAaIANBfGohAyAKQX9qIgpBAUoNAAwCCwsgAiACIAkgBSABEK2AgIAACyAJQZWS
gIAAEIeAgIAAGiAIEJeAgIAAGiAHEJeAgIAAGiAGEJeAgIAAGiAFEJeAgIAAGiAEEJeAgIAAGiAA
C9YCAQJ/AkACQCAAKAIIQQNHDQAgACgCDEEDRw0AIAEoAghBAkcNACABKAIMQQRHDQAgAigCCEEC
Rw0AIAIoAgxBBEYNAQtBi5OAgAAQgICAgAALIAAgASgCACIDKgIAuyADIAEoAhAiBEECdGoqAgC7
IAMgAUEUaigCACIBQQJ0aioCALsgAyABIARqQQJ0aioCALsgAyABQQN0aioCALsgAyABQQF0IARq
QQJ0aioCALsgAyABQQNsIgFBAnRqKgIAuyADIAEgBGpBAnRqKgIAuyACKAIAIgMqAgC7IAMgAigC
ECIEQQJ0aioCALsgAyACQRRqKAIAIgFBAnRqKgIAuyADIAEgBGpBAnRqKgIAuyADIAFBA3RqKgIA
uyADIAFBAXQgBGpBAnRqKgIAuyADIAFBA2wiAUECdGoqAgC7IAMgASAEakECdGoqAgC7ELWAgIAA
IAAL9QoCFnwDf0EAKgKAiICAALshEQJAAkAgAiAEoSISIAWiIAQgBqEiEyABoiAGIAKhIhQgA6Kg
oCAKIAyhIhUgDaIgDCAOoSIWIAmiIA4gCqEgC6KgoKJEAAAAAAAAAABjDQAgEyAHoiAGIAihIhcg
A6IgCCAEoSIYIAWioKAgFiAPoiAOIBChIhkgC6IgECAMoSANoqCgokQAAAAAAAAAAGMNACASIAei
IAQgCKEgAaIgCCACoSITIAOioKAgFSAPoiAMIBChIAmiIBAgCqEiEiALoqCgokQAAAAAAAAAAGMN
ACACIAahIAeiIBcgAaIgEyAFoqCgIAogDqEgD6IgGSAJoiASIA2ioKCiRAAAAAAAAAAAYw0AIAQg
AqEiGiAHIAGhIheiIAMgAaEiGyAToqEiHJkiHUSN7bWg98awPmMNACAUIBeiIAUgAaEiHiAToqEi
H5kiIESN7bWg98awPmMNACAbIBSiIBogHqKhIhSZIiFEje21oPfGsD5jDQAgBiAEoSAHIAOhoiAF
IAOhIBiioZlEje21oPfGsD5jDQAgHCAFoiIYIB8gA6KhIiIgFCAIoiAcIAaiIh6gIiOiIB4gHyAE
oqEiHiAUIAeiIBigIhiioSIkmUSN7bWg98awPmMNACAcmiIlIBShIiYgIqIgHyAcoSIiIBiioUQA
AAAAAADwPyAkoyIkoiEYICIgI6IgJiAeoqEgJKIhHgJAAkAgHSAgZEEBcw0AIBMgGCAEoiAeIAOi
RAAAAAAAAPA/oKAiBKIgJaMhHSAcIR8MAQsgEyAYIAaiIB4gBaJEAAAAAAAA8D+goCIEoiAfmqMh
HQsgFyAEoiAfoyETAkACQCAhICWZZEEBcw0AIBogGCAGoiAeIAWiRAAAAAAAAPA/oKAiBKIgFJqj
IQcMAQsgGiAYIAiiIB4gB6JEAAAAAAAA8D+goCIEoiAcoyEHICUhFAsgGCAdmiABoiATIAKioSIX
IAeioiAdIBsgBKIgFKMiFKIgHiATIAeaIAGiIBQgAqKhIhyioqCgIBMgB6KhIBggHSAcoqKhIB4g
FyAUoqKhmUSN7bWg98awPmMNACALIA2hIhsgECAOoSIaoiAWIA8gDaEiH6KhIiCZRI3ttaD3xrA+
Yw0AIBEhBCARIQIgESEGIBEhDiARIQEgESEDIBEhBSARIQggGyAVIBmgIhWiIBYgCSALoSANIA+h
oCIZoqFEAAAAAAAA8D8gIKMiFqIiDSAMIAqhIBogGaIgHyAVoqEgFqIiFiAMoqAiDCAJoqIgCyAJ
oSAWIAuioCILIBIgDSAQoqAiEKIgFiAPIAmhIA0gD6KgIg8gCqKioKAgDyAMoqEgDSALIAqioqEg
FiAQIAmioqGZRI3ttaD3xrA+Yw0BIBYgF6IgDSAcoqBEAAAAAAAA8D+gIQUgGCAWIBOiIA0gFKKg
oCEDIB4gFiAdoiANIAeioKAhASAMIBeiIBAgHKKgIAqgIQ4gGCAKoiAMIBOiIBAgFKKgoCEGIB4g
CqIgDCAdoiAQIAeioKAhAiALIBeiIA8gHKKgIAmgIQQgGCAJoiALIBOiIA8gFKKgoCERIB4gCaIg
CyAdoiAPIAeioKAhCAwBCyARIQQgESECIBEhBiARIQ4gESEBIBEhAyARIQUgESEICyAAKAIAIicg
CLY4AgAgJyAAQRRqKAIAIihBAnRqIBG2OAIAICcgKEEDdGogBLY4AgAgJyAAKAIQIgBBAnRqIAK2
OAIAICcgACAoaiIpQQJ0aiAGtjgCACAnIAAgKEEBdGpBAnRqIA62OAIAICcgAEEDdGogAbY4AgAg
JyAoIABBAXRqQQJ0aiADtjgCACAnIClBA3RqIAW2OAIAC58ICgF/AX0BfwJ9AX8KfQF/AX0DfwF9
AkACQCAAKAIIQQNHDQAgACgCDEEDRw0AIAEoAghBAkcNACABKAIMQQRHDQAgAigCCEECRw0AIAIo
AgxBBEYNAQtBspOAgAAQgICAgAALIAAgASgCACIDKgIAIgQgBCADIAFBFGooAgAiBUECdGoqAgAi
BpIgAyAFQQN0aioCACIHkiADIAVBA2wiCEECdGoqAgAiCZJDAACAPpQiCpMiBEMAAABBIAMgCCAB
KAIQIgFqQQJ0aioCACILIAsgAyABQQJ0aioCACIMIAMgBSABakECdGoqAgAiDZIgAyAFQQF0IAFq
QQJ0aioCACIOkpJDAACAPpQiD5MiCyALlCAJIAqTIgkgCZQgDiAPkyIOIA6UIAcgCpMiByAHlCAN
IA+TIg0gDZQgBiAKkyIGIAaUIAQgBJQgDCAPkyIMIAyUkpKSkpKSkpWRIgSUuyAMIASUuyAGIASU
uyANIASUuyAHIASUuyAOIASUuyAJIASUuyALIASUuyACKAIAIgMqAgAiCyALIAMgAkEUaigCACIF
QQJ0aioCACIQkiADIAVBA3RqKgIAIgySIAMgBUEDbCIIQQJ0aioCACINkkMAAIA+lCIJkyILQwAA
AEEgAyAIIAIoAhAiAWpBAnRqKgIAIg4gDiADIAFBAnRqKgIAIhEgAyAFIAFqQQJ0aioCACISkiAD
IAVBAXQgAWpBAnRqKgIAIgaSkkMAAIA+lCIOkyIHIAeUIA0gCZMiDSANlCAGIA6TIgYgBpQgDCAJ
kyIMIAyUIBIgDpMiEiASlCAQIAmTIhAgEJQgCyALlCARIA6TIhEgEZSSkpKSkpKSlZEiC5S7IBEg
C5S7IBAgC5S7IBIgC5S7IAwgC5S7IAYgC5S7IA0gC5S7IAcgC5S7ELWAgIAAIAAoAgAiAyAAQRRq
KAIAIgVBAXQiAiAAKAIQIgFBAXQiCGpBAnRqKgIAIRAgAyAIIAVqQQJ0aiIIKgIAIQcgAyACIAFq
QQJ0aiICKgIAIREgAyAFQQN0aiITKgIAIRQgAyAFIAFqIhVBAnRqIhYqAgAhBiADIAVBAnRqIgUq
AgAhDCADIAFBAnRqIhcqAgAhEiADIAQgCSADIAFBA3RqIgEqAgAiDZQgAyoCACIYQwAAgD8gC5Ui
C5SSlDgCACAXIAQgDiANlCASIAuUkpQ4AgAgASAEIA2UOAIAIAUgBCAJIAeUIAwgC5SSlDgCACAW
IAQgDiAHlCAGIAuUkpQ4AgAgCCAEIAeUOAIAIBMgFCAEIAogGJQgDyAMlJKUkyALlCAJIBAgBCAK
IA2UIA8gB5SSlJMiB5SSOAIAIAIgESAEIAogEpQgDyAGlJKUkyALlCAOIAeUkjgCACADIBVBA3Rq
IAc4AgAgAAu6BwIWfwp9AkACQCAAKAIIQQNHDQAgACgCDEEDRw0AIAEoAghBAkcNACABKAIMIgNB
BEgNACACKAIIQQJHDQAgAigCDCADRg0BC0HZk4CAABCAgICAACABKAIMIQMLIANBAXQiBEEIEJKA
gIAAIQUgBEEBEJKAgIAAIQZBCEEBEJKAgIAAIQcCQCADQQFIDQAgBUEUaigCACIEQQxsIAUoAhAi
CEECdCIJaiEKIARBBHQgCWohCyAEQRRsIAlqIQwgBEEYbCINIAlqIQ4gBEEcbCIPIAlqIRAgAigC
EEECdCERIAEoAhBBAnQhEiAIQQN0IQggBigCECIJQQN0IRMgCUECdCEUIAJBFGooAgBBAnQhFSAB
QRRqKAIAQQJ0IRYgBEEDdCEXIARBAnQhGCAGKAIAIQkgBSgCACEEIAIoAgAhAiABKAIAIQEDQCAC
IBFqKgIAIRkgASASaioCACEaIAIqAgAhGyAEIAEqAgAiHDgCACAEIBhqIBo4AgAgBCAXakGAgID8
AzYCACAEIApqIBw4AgAgBCALaiAaOAIAIAQgDGpBgICA/AM2AgAgBCANaiAbIByMIhyUOAIAIAQg
DmogGSAclDgCACAEIA9qIBsgGowiGpQ4AgAgBCAQaiAZIBqUOAIAIAkgGzgCACAJIBRqIBk4AgAg
AiAVaiECIAEgFmohASAEIAhqIQQgCSATaiEJIANBf2oiAw0ACwsgByAFIAZBAxCwgICAABoCQAJA
IAcoAgAiBCoCACIZIAQgBygCECIJQQR0aioCACIalCAEIAlBAnRqKgIAIhsgBCAJQRRsaioCACIc
lCAEIAlBGGxqKgIAIh2UkiAEIAlBA3RqKgIAIh4gBCAJQQxsaioCACIflCAEIAlBHGxqKgIAIiCU
kiAbIB+UkyAZIByUICCUkyAeIBqUIB2UkyIhEIOAgIAADQBDAACAPyEiICGLu0SN7bWg98awPmNB
AXMNAQtBACoCgIiAgAAiGSEbIBkhHiAZIR8gGSEaIBkhHCAZIR0gGSEgIBkhIgsgACgCACIEIBk4
AgAgBCAAQRRqKAIAIglBAnRqIBs4AgAgBCAJQQN0aiAeOAIAIAQgACgCECICQQJ0aiAfOAIAIAQg
AiAJaiIBQQJ0aiAaOAIAIAQgAiAJQQF0akECdGogHDgCACAEIAJBA3RqIB04AgAgBCAJIAJBAXRq
QQJ0aiAgOAIAIAQgAUEDdGogIjgCACAHEJeAgIAAGiAGEJeAgIAAGiAFEJeAgIAAGiAAC5sCAQZ/
AkACQCAAKAIIQQNHDQAgACgCDEEDRw0AIAEoAghBAkcNACABKAIMIgNBBEgNACACKAIIQQJHDQAg
AigCDCADRg0BC0GAlICAABCAgICAACABKAIMIQMLQQIgAxCSgICAACEEQQIgAxCSgICAACEFQQNB
AxCSgICAACEGQQNBAxCSgICAACEHQQNBAxCSgICAACEIIAQgASAGQQNBAxCSgICAACIDELmAgIAA
IAUgAiADIAcQuYCAgAAgAyAIIAQgBRC3gICAACIBIAYQp4CAgAAaIAAgByADEKeAgIAAGiADEJeA
gIAAGiABEJeAgIAAGiAHEJeAgIAAGiAGEJeAgIAAGiAFEJeAgIAAGiAEEJeAgIAAGiAAC4cICAF/
AX0BfwN9A38BfQF8An8CQAJAAkAgASgCCEECRw0AIAEoAgwiBEEBSA0AIAAoAghBAkcNACAAKAIM
IARHDQAgAigCCEEDRw0AIAIoAgxBA0cNACADKAIIQQNHDQAgAygCDEEDRw0AIASyIQUMAQtBp5SA
gAAQgICAgABBACEGIAEoAgwiBLIhBSAEQQBKDQBDAAAAACEHQwAAAAAgBZUiCCEJDAELIAEoAhBB
AnQhCiABQRRqKAIAQQJ0IQsgASgCACEGQwAAAAAhByAEIQxDAAAAACENA0AgByAGKgIAkiEHIA0g
BiAKaioCAJIhDSAGIAtqIQYgDEF/aiIMDQALIA0gBZUhCCAHIAWVIQkgASgCEEECdCEKIAFBFGoo
AgBBAnQhCyABKAIAIQZDAAAAACEHIAQhDANAIAcgBioCACAJkyINIA2UIAYgCmoqAgAgCJMiDSAN
lJKSIQcgBiALaiEGIAxBf2oiDA0AC0EBIQYLAkAgByAFlZEiB4u7RI3ttaD3xrA+Y0UNACACEJyA
gIAAGiADEJyAgIAAGiADKAIAIgZBgICA/AM2AgAgAigCACIMQYCAgPwDNgIAIAYgA0EUaigCACAD
KAIQaiIKQQJ0akGAgID8AzYCACAMIAJBFGooAgAgAigCEGoiC0ECdGpBgICA/AM2AgAgBiAKQQN0
akGAgID8AzYCACAMIAtBA3RqQYCAgPwDNgIAIAAgARCVgICAABoPCyAHuyIORM07f2aeoPY/o7Yh
DUTNO39mnqD2PyAOo7YhBwJAIAZFDQAgACgCEEECdCEKIAEoAhBBAnQhCyAAQRRqKAIAQQJ0IQ8g
AUEUaigCAEECdCEQIAAoAgAhBiABKAIAIQwDQCAGIAwqAgAgCZMgB5Q4AgAgBiAKaiAMIAtqKgIA
IAiTIAeUOAIAIAYgD2ohBiAMIBBqIQwgBEF/aiIEDQALCyACKAIAIgYgBzgCACAGIAJBFGooAgAi
DEECdGpBADYCACAGIAxBA3RqIAkgB4wiBZQ4AgAgBiACKAIQIgpBAnRqQQA2AgAgBiAKIAxqIgtB
AnRqIAc4AgAgBiAKIAxBAXRqQQJ0aiAIIAWUOAIAIAYgCkEDdGpBADYCACAGIAwgCkEBdGpBAnRq
QQA2AgAgBiALQQN0akGAgID8AzYCACADKAIAIgYgDTgCACAGIANBFGooAgAiDEECdGpBADYCACAG
IAxBA3RqIAk4AgAgBiADKAIQIgpBAnRqQQA2AgAgBiAKIAxqIgtBAnRqIA04AgAgBiAKIAxBAXRq
QQJ0aiAIOAIAIAYgCkEDdGpBADYCACAGIAwgCkEBdGpBAnRqQQA2AgAgBiALQQN0akGAgID8AzYC
AAuZFAIcfw19I4CAgIAAQRBrIgckgICAgAACQAJAIAAoAghBA0cNACAAKAIMQQNHDQAgAigCCEEC
Rw0AIAIoAgwiCEEESA0AIAMoAghBAkcNACADKAIMIAhHDQACQCABRQ0AIAEoAghBAUcNASABKAIM
IAhHDQELIARBAUgNACAFQQFIDQAgBkMAAAAAYA0BC0HOlICAABCAgICAACACKAIMIQgLAkAgAUUN
ACABQwAAAAAQm4CAgAAaCyAIQQJ0IglB8JSAgAAQhYCAgAAhCiAJQY+VgIAAEIWAgIAAIAgQjYCA
gAAiCyAIQQQQjoCAgAAgCCAEQQJ0IgwgCG9rIAxqIg1BAnRBrpWAgAAQhYCAgAAhDgJAIA1BAUgN
AEEAIQ8gCEEBSCEQIA4hEQNAAkAgEA0AQQAhDCARIRIDQCASIAw2AgAgEkEEaiESIAggDEEBaiIM
Rw0ACwsgDiAPQQJ0aiAIQQQQjoCAgAAgESAJaiERIA8gCGoiDyANSA0ACwtBAkEEEJKAgIAAIRNB
AkEEEJKAgIAAIRQgBEEDdEHNlYCAABCFgICAACEVIAQhFgJAIARBAUgNACAVIRcgDiEJIAQhGCAE
IRYDQCAHIAkoAgAiGTYCACAHIAlBBGooAgAiGjYCBCAHIAlBCGooAgAiGzYCCCAHIAlBDGooAgA2
AgwgFCgCFCENIBMoAhQhECADKAIQIRwgFCgCECEdIBQoAgAhDCADKAIAIRIgAygCFCEeIAIoAhAh
HyATKAIQISAgEygCACIPIAIoAgAiESAZIAIoAhQiIWwiIkECdGooAgA2AgAgDyAgQQJ0aiARIB8g
ImpBAnRqKAIANgIAIAwgEiAeIBlsIhlBAnRqKAIANgIAIAwgHUECdGogEiAcIBlqQQJ0aigCADYC
ACAPIBBBAnRqIBEgISAabCIZQQJ0aigCADYCACAPICAgEGpBAnRqIBEgHyAZakECdGooAgA2AgAg
DCANQQJ0aiASIB4gGmwiGUECdGooAgA2AgAgDCAdIA1qQQJ0aiASIBwgGWpBAnRqKAIANgIAIA8g
EEEDdGogESAhIBtsIhlBAnRqKAIANgIAIA8gICAQQQF0akECdGogESAfIBlqQQJ0aigCADYCACAM
IA1BA3RqIBIgHiAbbCIZQQJ0aigCADYCACAMIB0gDUEBdGpBAnRqIBIgHCAZakECdGooAgA2AgAg
DyAQQQNsIhBBAnRqIBEgISAHKAIMIhlsIiFBAnRqKAIANgIAIA8gICAQakECdGogESAfICFqQQJ0
aigCADYCACAMIA1BA2wiD0ECdGogEiAeIBlsIhFBAnRqKAIANgIAIAwgHSAPakECdGogEiAcIBFq
QQJ0aigCADYCAEEDQQMQkoCAgAAhDCAXQQRqIhJBADYCACAXIAw2AgAgDCATIBQQtICAgAAaAkAg
FygCACgCACoCABCDgICAAEUNACASQX82AgAgFkF/aiEWCyAXQQhqIRcgCUEQaiEJIBhBf2oiGA0A
CwsCQAJAIBYNACAAQQAqAoCIgIAAEJuAgIAAGgwBCyAGIAaUISNBACEXIBUgBEEIQYSAgIAAQQAQ
i4CAgAAaAkACQCAIQQFIDQBBACEcA0AgHCISQQFqIhwgBW8hDAJAIBZBAkgNACAMDQAgFSAWQQhB
hICAgABBABCLgICAABogFkEBdiEWCwJAIBZBAUcNAEEAIRcMAwsCQCAWQQFIDQAgAygCACIMIAMo
AhQgCyASQQJ0aigCACISbCIPQQJ0aioCACEkIAIoAgAiESACKAIUIBJsIhJBAnRqKgIAIQYgDCAP
IAMoAhBqQQJ0aioCACElIBEgEiACKAIQakECdGoqAgAhJiAVIREgFiEJA0AgEUEEaiIMIAwoAgAg
ESgCACIPKAIAIgwgD0EUaigCACISQQF0Ig0gDygCECIPakECdGoqAgAgBiAMIA9BAnRqKgIAlCAm
IAwgEiAPakECdGoqAgCUkpIgDCANIA9BAXQiEGpBAnRqKgIAIAYgDCAPQQN0aioCAJQgJiAMIBAg
EmpBAnRqKgIAlJKSIieVICWTIiggKJQgDCASQQN0aioCACAGIAwqAgCUICYgDCASQQJ0aioCAJSS
kiAnlSAkkyInICeUkiAjX2o2AgAgEUEIaiERIAlBf2oiCQ0ACwsgHCAIRw0ACwsgFkECSA0AIBVB
DGohDEEAIRdBASESA0AgEiAXIAwoAgAgFSAXQQN0aigCBEobIRcgDEEIaiEMIBYgEkEBaiISRw0A
CwsCQCAIQQFIDQAgFSAXQQN0aigCACIPKAIAIgwgDygCECISQQN0aioCACEkIAwgEkECdGoqAgAh
JSAMIA9BFGooAgAiD0EDdGoqAgAhKSAMIA9BAnRqKgIAISogDCASQQF0IhEgD2pBAnRqKgIAISsg
DCAPIBJqQQJ0aioCACEsIAwgD0EBdCIPIBFqQQJ0aioCACEtIAwgDyASakECdGoqAgAhLiAMKgIA
IS8gAygCACEPIAIoAgAhEUEAIRJBACEMA0ACQCApIC8gESACKAIUIAxsIglBAnRqKgIAIgaUICog
ESAJIAIoAhBqQQJ0aioCACImlJKSIC0gJCAGlCArICaUkpIiJ5UgDyADKAIUIAxsIglBAnRqKgIA
kyIoICiUIC4gJSAGlCAsICaUkpIgJ5UgDyAJIAMoAhBqQQJ0aioCAJMiBiAGlJIgI19BAXMNACAK
IBJBAnRqIAw2AgAgEkEBaiESIAFFDQAgASgCACABKAIUIAxsQQJ0akGAgID8AzYCAAsgCCAMQQFq
IgxHDQALIBJBA0wNAEECIBIQkoCAgAAhFkECIBIQkoCAgAAiGSgCEEECdCEXIBZBFGooAgBBAnQh
HCAWKAIQQQJ0IR0gGUEUaigCAEECdCEeIBkoAgAhDCADQRRqKAIAIR8gFigCACEPIAJBFGooAgAh
ICADKAIQISEgAygCACEIIAIoAhAhAyACKAIAIQkgCiERA0AgDyAJICAgESgCACINbCIQQQJ0aigC
ADYCACAPIB1qIAkgAyAQakECdGooAgA2AgAgDCAIIB8gDWwiDUECdGooAgA2AgAgDCAXaiAIICEg
DWpBAnRqKAIANgIAIAwgHmohDCAPIBxqIQ8gEUEEaiERIBJBf2oiEg0ACyAAIBYgGRC4gICAABog
GRCXgICAABogFhCXgICAABoMAQsgAEEAKgKAiICAABCbgICAABoLAkAgBEEBSA0AIARBAWohEiAE
QQN0IBVqQXhqIQwDQCAMKAIAEJeAgIAAGiAMQXhqIQwgEkF/aiISQQFKDQALCyAVQe2VgIAAEIeA
gIAAGiAUEJeAgIAAGiATEJeAgIAAGiAOQYuWgIAAEIeAgIAAGiALQamWgIAAEIeAgIAAGiAKQceW
gIAAEIeAgIAAGiAHQRBqJICAgIAAIAALDQAgASgCBCAAKAIEawviAwgDfwJ9AX8DfQF/BH0BfwN9
AkACQCAAKAIIQQJHDQAgASgCCEECRw0AIAAoAgwiAyABKAIMRw0AIAIoAghBA0cNACACKAIMQQNG
DQELQeWWgIAAEICAgIAAIAEoAgwhAwsCQCACKAIAIgQgAigCECIFQQN0aioCACIGIAQgAkEUaigC
ACICQQJ0aioCACIHIAQgAkEBdCIIIAVqQQJ0aioCACIJlCAEIAJBA3RqKgIAIgogBCACIAVqQQJ0
aioCACILlJOUIAQgBUEBdCIMIAJqQQJ0aioCACINIAogBCAFQQJ0aioCACIOlCAEKgIAIg8gCZST
lJIgDyALlCAHIA6UkyAEIAggDGpBAnRqKgIAIhCUkou7RI3ttaD3xrA+Yw0AAkAgA0EBSA0AIAAo
AhBBAnQhAiABKAIQQQJ0IQggAEEUaigCAEECdCEMIAFBFGooAgBBAnQhESAAKAIAIQQgASgCACEF
A0AgBCAKIA8gBSoCACISlCAHIAUgCGoqAgAiE5SSkiAQIAYgEpQgDSATlJKSIhSVOAIAIAQgAmog
CSAOIBKUIAsgE5SSkiAUlTgCACAEIAxqIQQgBSARaiEFIANBf2oiAw0ACwsgAA8LIABBACoCgIiA
gAAQm4CAgAALC84PAwBBgAgLig8AAPh/T3V0IG9mIG1lbW9yeSEARG91YmxlIGZyZWUAQXNzZXJ0
aW9uIGZhaWxlZCBhdCBtYXQzMi5jOjYxAE91dCBvZiBtZW1vcnkgYXQgbWF0MzIuYzo2MwBBc3Nl
cnRpb24gZmFpbGVkIGF0IG1hdDMyLmM6ODQAT3V0IG9mIG1lbW9yeSBhdCBtYXQzMi5jOjg2AE91
dCBvZiBtZW1vcnkgYXQgbWF0MzIuYzo4OQBPdXQgb2YgbWVtb3J5IGF0IG1hdDMyLmM6MTM2AAAA
wAsAAAEAAAAAAAAAAAAAAAEAAAABAAAAAgAAAERvdWJsZSBmcmVlIGF0IG1hdDMyLmM6MTQ5AEFz
c2VydGlvbiBmYWlsZWQgYXQgbWF0MzIuYzoxODQAQXNzZXJ0aW9uIGZhaWxlZCBhdCBtYXQzMi5j
OjE4OABBc3NlcnRpb24gZmFpbGVkIGF0IG1hdDMyLmM6Mjc1AERvdWJsZSBmcmVlIGF0IG1hdDMy
LmM6MjkAQXNzZXJ0aW9uIGZhaWxlZCBhdCBhcml0aG1ldGljMzIuYzozNgBBc3NlcnRpb24gZmFp
bGVkIGF0IGFyaXRobWV0aWMzMi5jOjU4AEFzc2VydGlvbiBmYWlsZWQgYXQgYXJpdGhtZXRpYzMy
LmM6ODAAQXNzZXJ0aW9uIGZhaWxlZCBhdCBhcml0aG1ldGljMzIuYzo5OQBBc3NlcnRpb24gZmFp
bGVkIGF0IGFyaXRobWV0aWMzMi5jOjEyMQBBc3NlcnRpb24gZmFpbGVkIGF0IGFyaXRobWV0aWMz
Mi5jOjE0MwBBc3NlcnRpb24gZmFpbGVkIGF0IGFyaXRobWV0aWMzMi5jOjE2OABBc3NlcnRpb24g
ZmFpbGVkIGF0IGFyaXRobWV0aWMzMi5jOjE4OQBBc3NlcnRpb24gZmFpbGVkIGF0IGFyaXRobWV0
aWMzMi5jOjIxOABBc3NlcnRpb24gZmFpbGVkIGF0IGFyaXRobWV0aWMzMi5jOjI3MQBBc3NlcnRp
b24gZmFpbGVkIGF0IGFyaXRobWV0aWMzMi5jOjMyMgBBc3NlcnRpb24gZmFpbGVkIGF0IGFyaXRo
bWV0aWMzMi5jOjM1NgBBc3NlcnRpb24gZmFpbGVkIGF0IGFyaXRobWV0aWMzMi5jOjM3OABBc3Nl
cnRpb24gZmFpbGVkIGF0IGFyaXRobWV0aWMzMi5jOjQyMABBc3NlcnRpb24gZmFpbGVkIGF0IGFy
aXRobWV0aWMzMi5jOjQzNgBBc3NlcnRpb24gZmFpbGVkIGF0IHFyMzIuYzoyNjEAQXNzZXJ0aW9u
IGZhaWxlZCBhdCBxcjMyLmM6MjY1AEFzc2VydGlvbiBmYWlsZWQgYXQgcXIzMi5jOjI4NgBBc3Nl
cnRpb24gZmFpbGVkIGF0IHFyMzIuYzoyOTAAQXNzZXJ0aW9uIGZhaWxlZCBhdCBxcjMyLmM6MzIx
AEFzc2VydGlvbiBmYWlsZWQgYXQgcXIzMi5jOjMyNQBBc3NlcnRpb24gZmFpbGVkIGF0IHFyMzIu
YzozNzkAT3V0IG9mIG1lbW9yeSBhdCBxcjMyLmM6MzYAQXNzZXJ0aW9uIGZhaWxlZCBhdCBxcjMy
LmM6NjkAQXNzZXJ0aW9uIGZhaWxlZCBhdCBxcjMyLmM6NzMAQXNzZXJ0aW9uIGZhaWxlZCBhdCBx
cjMyLmM6MTg0AERvdWJsZSBmcmVlIGF0IHFyMzIuYzo1NQBBc3NlcnRpb24gZmFpbGVkIGF0IHFy
MzIuYzoxNDgAQXNzZXJ0aW9uIGZhaWxlZCBhdCBxcjMyLmM6MjI0AEFzc2VydGlvbiBmYWlsZWQg
YXQgcXIzMi5jOjIyOABBc3NlcnRpb24gZmFpbGVkIGF0IGhvbW9ncmFwaHkzMi5jOjMyNABBc3Nl
cnRpb24gZmFpbGVkIGF0IGhvbW9ncmFwaHkzMi5jOjM1OQBBc3NlcnRpb24gZmFpbGVkIGF0IGhv
bW9ncmFwaHkzMi5jOjQ0NABBc3NlcnRpb24gZmFpbGVkIGF0IGhvbW9ncmFwaHkzMi5jOjUyNABB
c3NlcnRpb24gZmFpbGVkIGF0IGhvbW9ncmFwaHkzMi5jOjI0MgBBc3NlcnRpb24gZmFpbGVkIGF0
IHJhbnNhYzMyLmM6NzAAT3V0IG9mIG1lbW9yeSBhdCByYW5zYWMzMi5jOjgzAE91dCBvZiBtZW1v
cnkgYXQgcmFuc2FjMzIuYzo4NwBPdXQgb2YgbWVtb3J5IGF0IHJhbnNhYzMyLmM6OTIAT3V0IG9m
IG1lbW9yeSBhdCByYW5zYWMzMi5jOjEwNgBEb3VibGUgZnJlZSBhdCByYW5zYWMzMi5jOjIzNwBE
b3VibGUgZnJlZSBhdCByYW5zYWMzMi5jOjI0NABEb3VibGUgZnJlZSBhdCByYW5zYWMzMi5jOjI0
NwBEb3VibGUgZnJlZSBhdCByYW5zYWMzMi5jOjI1MABBc3NlcnRpb24gZmFpbGVkIGF0IHRyYW5z
Zm9ybTMyLmM6MzkAAEGMFwsMCAAAALALAAABAAAAAEGgFwskAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAA
`

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
 * gl-utils.js
 * WebGL utilities
 */







//
// Constants
//
const IS_FIREFOX = navigator.userAgent.includes('Firefox');



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
        //const start = performance.now();

        // empty internal command queues and send them to the GPU asap
        gl.flush(); // make sure the sync command is read

        // wait for the commands to be processed by the GPU
        return this.clientWaitAsync(gl, sync).then(() => {
            gl.bindBuffer(target, glBuffer);
            gl.getBufferSubData(target, srcByteOffset, destBuffer, destOffset, length);
            gl.bindBuffer(target, null);
            return 0; // disable timers
            //return performance.now() - start;
        }).catch(err => {
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalOperationError"](`Can't getBufferSubDataAsync(): error in clientWaitAsync()`, err);
        }).finally(() => {
            gl.deleteSync(sync);
        });
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
        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__["SpeedyPromise"]((resolve, reject) => {
            this._checkStatus(gl, sync, flags, resolve, reject);
        });
    }

    /**
     * Auxiliary method for clientWaitAsync()
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLSync} sync
     * @param {GLbitfield} flags
     * @param {Function} resolve
     * @param {Function} reject
     */
    static _checkStatus(gl, sync, flags, resolve, reject)
    {
        const status = gl.clientWaitSync(sync, flags, 0);
        if(status == gl.TIMEOUT_EXPIRED) {
            //Utils.setZeroTimeout(GLUtils._checkStatus, gl, sync, flags, resolve, reject); // no ~4ms delay
            setTimeout(GLUtils._checkStatus, 0, gl, sync, flags, resolve, reject); // easier on the CPU
        }
        else if(status == gl.WAIT_FAILED) {
            if(IS_FIREFOX && gl.getError() == gl.NO_ERROR) { // firefox bug?
                //Utils.setZeroTimeout(GLUtils._checkStatus, gl, sync, flags, resolve, reject);
                setTimeout(GLUtils._checkStatus, 0, gl, sync, flags, resolve, reject);
            }
            else {
                reject(GLUtils.getError(gl));
            }
        }
        else {
            resolve();
        }
    }
}


/***/ }),

/***/ "./src/gpu/programs/filters.js":
/*!*************************************!*\
  !*** ./src/gpu/programs/filters.js ***!
  \*************************************/
/*! exports provided: SpeedyProgramGroupFilters */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyProgramGroupFilters", function() { return SpeedyProgramGroupFilters; });
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








//
// Shaders
//

// Convert to greyscale
const rgb2grey = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('filters/rgb2grey.glsl')
                .withArguments('image');

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

// Normalize image
const normalizeGreyscale = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('filters/normalize-image.glsl')
                          .withDefines({ 'GREYSCALE': 1 })
                          .withArguments('minmax2d', 'minValue', 'maxValue');

const normalizeColored = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('filters/normalize-image.glsl')
                        .withDefines({ 'GREYSCALE': 0 })
                        .withArguments('minmax2dRGB', 'minValue', 'maxValue');

// Nightvision
const nightvision = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('filters/nightvision.glsl')
                   .withDefines({ 'GREYSCALE': 0 })
                   .withArguments('image', 'illuminationMap', 'gain', 'offset', 'decay');

const nightvisionGreyscale = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('filters/nightvision.glsl')
                            .withDefines({ 'GREYSCALE': 1 })
                            .withArguments('image', 'illuminationMap', 'gain', 'offset', 'decay');



//
// Utilities
//

// Handy conversion for Gaussian filters
// (symmetric kernel, approx. zero after 3*sigma)
const ksize2sigma = ksize => Math.max(1.0, ksize / 6.0);

// Generate a 1D Gaussian kernel
const gaussian = ksize => _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].gaussianKernel(ksize2sigma(ksize), ksize);

// Generate a 1D Box filter
const box = ksize => (new Array(ksize)).fill(1.0 / ksize);



/**
 * SpeedyProgramGroupFilters
 * Image filtering
 */
class SpeedyProgramGroupFilters extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgramGroup"]
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     */
    constructor(gpu)
    {
        super(gpu);
        this
            // convert to greyscale
            .declare('rgb2grey', rgb2grey)

            // median filters
            .declare('median3', median[3]) // 3x3 window
            .declare('median5', median[5]) // 5x5 window
            .declare('median7', median[7]) // 7x7 window

            // 2D convolution
            .declare('convolution3', convolution[3]) // 3x3 kernel
            .declare('convolution5', convolution[5]) // 5x5 kernel
            .declare('convolution7', convolution[7]) // 7x7 kernel

            // 1D separable convolution
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

            // normalize image
            .declare('normalizeGreyscale', normalizeGreyscale)
            .declare('normalizeColored', normalizeColored)

            // nightvision
            .declare('nightvision', nightvision)
            .declare('nightvisionGreyscale', nightvisionGreyscale)
            .declare('illuminationMapLoX', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])(_utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].gaussianKernel(80, 31)))
            .declare('illuminationMapLoY', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])(_utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].gaussianKernel(80, 31)))
            .declare('illuminationMapX', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])(_utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].gaussianKernel(80, 63)))
            .declare('illuminationMapY', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])(_utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].gaussianKernel(80, 63)))
            .declare('illuminationMapHiX', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])(_utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].gaussianKernel(80, 255)))
            .declare('illuminationMapHiY', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])(_utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].gaussianKernel(80, 255)))

            // gaussian: separable kernels
            // see also: http://dev.theomader.com/gaussian-kernel-calculator/
            .declare('gaussian3x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])([ 0.25, 0.5, 0.25 ])) // sigma ~ 1.0
            .declare('gaussian3y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])([ 0.25, 0.5, 0.25 ]))
            .declare('gaussian5x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])([ 0.05, 0.25, 0.4, 0.25, 0.05 ])) // sigma ~ 1.0
            .declare('gaussian5y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])([ 0.05, 0.25, 0.4, 0.25, 0.05 ]))
            .declare('gaussian7x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])(gaussian(7)))
            .declare('gaussian7y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])(gaussian(7)))
            .declare('gaussian9x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])(gaussian(9)))
            .declare('gaussian9y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])(gaussian(9)))
            .declare('gaussian11x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])(gaussian(11)))
            .declare('gaussian11y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])(gaussian(11)))

            // box filter: separable kernels
            .declare('box3x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])(box(3)))
            .declare('box3y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])(box(3)))
            .declare('box5x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])(box(5)))
            .declare('box5y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])(box(5)))
            .declare('box7x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])(box(7)))
            .declare('box7y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])(box(7)))
            .declare('box9x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])(box(9)))
            .declare('box9y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])(box(9)))
            .declare('box11x', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convX"])(box(11)))
            .declare('box11y', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_2__["convY"])(box(11)))
        ;
    }
}


/***/ }),

/***/ "./src/gpu/programs/keypoints.js":
/*!***************************************!*\
  !*** ./src/gpu/programs/keypoints.js ***!
  \***************************************/
/*! exports provided: SpeedyProgramGroupKeypoints */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyProgramGroupKeypoints", function() { return SpeedyProgramGroupKeypoints; });
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
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






// FAST corner detector
const fast9_16 = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/fast.glsl')
                .withDefines({ 'FAST_TYPE': 916 })
                .withArguments('corners', 'pyramid', 'lod', 'threshold');

// Harris corner detector
const harris = [1, 3, 5, 7].reduce((obj, win) => ((obj[win] =
                   Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/harris.glsl')
                  .withDefines({ 'WINDOW_SIZE': win })
                  .withArguments('corners', 'derivatives', 'lod')
               ), obj), {});

const harrisDerivatives = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/harris-derivatives.glsl')
                         .withArguments('pyramid', 'lod');

const harrisScoreFindMax = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/score-findmax.glsl')
                          .withArguments('corners', 'iterationNumber');

const harrisScoreCutoff = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/harris-cutoff.glsl')
                         .withArguments('corners', 'maxScore', 'quality');

// ORB descriptors
const allocateDescriptors = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/allocate-descriptors.glsl')
                            .withArguments('inputEncodedKeypoints', 'inputDescriptorSize', 'inputExtraSize', 'inputEncoderLength', 'outputDescriptorSize', 'outputExtraSize', 'outputEncoderLength');

const orbDescriptor = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/orb-descriptor.glsl')
                     .withArguments('pyramid', 'encodedCorners', 'extraSize', 'encoderLength');

const orbOrientation = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/orb-orientation.glsl')
                      .withArguments('pyramid', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

// Non-maximum suppression
const nonMaxSuppression = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/nonmax-suppression.glsl')
                         .withDefines({ 'MULTISCALE': 0 })
                         .withArguments('image', 'lodStep');

const multiscaleNonMaxSuppression = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/nonmax-suppression.glsl')
                                   .withDefines({ 'MULTISCALE': 1 })
                                   .withArguments('image', 'lodStep');

// Keypoint tracking & optical-flow
const lk = [7, 11, 15, 21].reduce((obj, win) => ((obj[win] = 
               Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/lk.glsl')
               .withDefines({ 'MAX_WINDOW_SIZE': win })
               .withArguments('encodedFlow', 'prevKeypoints', 'nextPyramid', 'prevPyramid', 'windowSize', 'level', 'depth', 'numberOfIterations', 'discardThreshold', 'epsilon', 'descriptorSize', 'extraSize', 'encoderLength')
           ), obj), {});

const lkDiscard = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/lk-discard.glsl')
                  .withArguments('pyramid', 'windowSize', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const transferFlow = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/transfer-flow.glsl')
                     .withArguments('encodedFlow', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const ncc = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/ncc.glsl')
            .withDefines({ 'MAX_WINDOW_SIZE_LOD1': 15, 'MAX_PATCH_SIZE': 12 })
            .withArguments('encodedFlow', 'prevKeypoints', 'prevPyramid', 'nextPyramid', 'windowSize', 'patchSize', 'level', 'descriptorSize', 'extraSize', 'encoderLength');


// Keypoint sorting
const sortCreatePermutation = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/sort-createperm.glsl')
                             .withArguments('encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const sortMergePermutation = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/sort-mergeperm.glsl')
                            .withArguments('permutation', 'blockSize', 'dblLog2BlockSize');

const sortApplyPermutation = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/sort-applyperm.glsl')
                            .withArguments('permutation', 'maxKeypoints', 'encodedKeypoints', 'descriptorSize', 'extraSize');

// Keypoint encoding
const encodeKeypointSkipOffsets = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/encode-keypoint-offsets.glsl')
                                 .withDefines({ 'MAX_ITERATIONS': 32 })
                                 .withArguments('corners', 'imageSize');

const encodeKeypointLongSkipOffsets = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/encode-keypoint-long-offsets.glsl')
                                     .withDefines({ 'MAX_ITERATIONS': 32 })
                                     .withArguments('offsetsImage', 'imageSize');

const encodeKeypointPositions = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/encode-keypoint-positions.glsl')
                               .withArguments('offsetsImage', 'imageSize', 'passId', 'numPasses', 'keypointLimit', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const encodeKeypointProperties = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/encode-keypoint-properties.glsl')
                                .withArguments('corners', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const encodeNullKeypoints = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/encode-null-keypoints.glsl')
                           .withArguments();

const transferOrientation = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/transfer-orientation.glsl')
                           .withArguments('encodedOrientations', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const discardDescriptors = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/discard-descriptors.glsl')
                           .withArguments('encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'newEncoderLength');

const uploadKeypoints = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/upload-keypoints.glsl')
                       .withDefines({
                            // UBOs can hold at least 16KB of data;
                            // gl.MAX_UNIFORM_BLOCK_SIZE >= 16384
                            // according to the GL ES 3 reference.
                            // Each keypoint uses 16 bytes (vec4)
                           'BUFFER_SIZE': 1024 //16384 / 16
                        })
                       .withArguments('encodedKeypoints', 'startIndex', 'endIndex', 'descriptorSize', 'extraSize', 'encoderLength');

const mixKeypoints = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/mix-keypoints.glsl')
                    .withArguments('encodedKeypoints', 'encoderLength', 'encoderCapacity', 'descriptorSize', 'extraSize', 'outEncoderLength');

// Geometric transformations
const applyHomography = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('keypoints/apply-homography.glsl')
                        .withArguments('homography', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');





/**
 * SpeedyProgramGroupKeypoints
 * Keypoint detection
 */
class SpeedyProgramGroupKeypoints extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgramGroup"]
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     */
    constructor(gpu)
    {
        super(gpu);
        this
            //
            // FAST corner detector
            //
            .declare('fast9_16', fast9_16, {
                ...this.program.usesPingpongRendering()
            })

            //
            // Harris corner detector
            //
            .declare('harris1', harris[1], {
                ...this.program.usesPingpongRendering()
            })
            .declare('harris3', harris[3], {
                ...this.program.usesPingpongRendering()
            })
            .declare('harris5', harris[5], {
                ...this.program.usesPingpongRendering()
            })
            .declare('harris7', harris[7], {
                ...this.program.usesPingpongRendering()
            })
            .declare('harrisDerivatives', harrisDerivatives)
            .declare('harrisScoreFindMax', harrisScoreFindMax, {
                ...this.program.usesPingpongRendering()
            })
            .declare('harrisScoreCutoff', harrisScoreCutoff)

            //
            // ORB descriptors
            //
            .declare('allocateDescriptors', allocateDescriptors)
            .declare('orbDescriptor', orbDescriptor)
            .declare('orbOrientation', orbOrientation)

            //
            // Non-maximum suppression
            //
            .declare('nonmax', nonMaxSuppression)
            .declare('pyrnonmax', multiscaleNonMaxSuppression)

            //
            // LK optical-flow
            //
            .declare('lk21', lk[21], { // up to 21x21 window
                ...this.program.usesPingpongRendering()
            })
            .declare('lk15', lk[15], { // up to 15x15 window
                ...this.program.usesPingpongRendering()
            })
            .declare('lk11', lk[11], { // up to 11x11 window (nice on mobile)
                ...this.program.usesPingpongRendering()
            })
            .declare('lk7', lk[7], { // up to 7x7 window (faster)
                ...this.program.usesPingpongRendering()
            })
            .declare('lkDiscard', lkDiscard)
            .declare('transferFlow', transferFlow)
            .declare('ncc', ncc, {
                ...this.program.usesPingpongRendering()
            })

            //
            // Keypoint sorting
            //
            .declare('sortCreatePermutation', sortCreatePermutation)
            .declare('sortMergePermutation', sortMergePermutation, {
                ...this.program.usesPingpongRendering()
            })
            .declare('sortApplyPermutation', sortApplyPermutation)

            //
            // Keypoint encoders
            //
            .declare('encodeKeypointSkipOffsets', encodeKeypointSkipOffsets)
            .declare('encodeKeypointLongSkipOffsets', encodeKeypointLongSkipOffsets, {
                ...this.program.usesPingpongRendering()
            })
            .declare('encodeKeypointPositions', encodeKeypointPositions, {
                ...this.program.usesPingpongRendering()
            })
            .declare('encodeKeypointProperties', encodeKeypointProperties)
            .declare('encodeNullKeypoints', encodeNullKeypoints)
            .declare('transferOrientation', transferOrientation)
            .declare('discardDescriptors', discardDescriptors)
            .declare('uploadKeypoints', uploadKeypoints, {
                ...this.program.usesPingpongRendering()
            })
            .declare('mixKeypoints', mixKeypoints)

            //
            // Geometric transformations
            //
            .declare('applyHomography', applyHomography)
        ;
    }
}

/***/ }),

/***/ "./src/gpu/programs/pyramids.js":
/*!**************************************!*\
  !*** ./src/gpu/programs/pyramids.js ***!
  \**************************************/
/*! exports provided: SpeedyProgramGroupPyramids */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyProgramGroupPyramids", function() { return SpeedyProgramGroupPyramids; });
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _speedy_gpu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shaders/filters/convolution */ "./src/gpu/shaders/filters/convolution.js");
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

const upsample2 = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_3__["importShader"])('pyramids/upsample2.glsl').withArguments('image');
const downsample2 = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_3__["importShader"])('pyramids/downsample2.glsl').withArguments('image');


/**
 * SpeedyProgramGroupPyramids
 * Image pyramids
 */
class SpeedyProgramGroupPyramids extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgramGroup"]
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     */
    constructor(gpu)
    {
        super(gpu);
        this
            // upsampling & downsampling
            .declare('upsample2', upsample2)
            .declare('downsample2', downsample2)

            // separable kernels for gaussian smoothing
            // use [c, b, a, b, c] where a+2c = 2b and a+2b+2c = 1
            // pick a = 0.4 for gaussian approximation
            .declare('smoothX', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_4__["convX"])([
                0.05, 0.25, 0.4, 0.25, 0.05
            ]))
            .declare('smoothY', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_4__["convY"])([
                0.05, 0.25, 0.4, 0.25, 0.05
            ]))

            // smoothing for 2x image
            // same rules as above with sum(k) = 2
            .declare('smoothX2', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_4__["convX"])([
                0.1, 0.5, 0.8, 0.5, 0.1
                // NOTE: this would saturate the image, but we apply it
                // on a 2x upsampled version with lots of zero pixels
            ]))
            .declare('smoothY2', Object(_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_4__["convY"])([
                0.1, 0.5, 0.8, 0.5, 0.1
            ], 1.0 / 2.0))
        ;
    }
}

/***/ }),

/***/ "./src/gpu/programs/transforms.js":
/*!****************************************!*\
  !*** ./src/gpu/programs/transforms.js ***!
  \****************************************/
/*! exports provided: SpeedyProgramGroupTransforms */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyProgramGroupTransforms", function() { return SpeedyProgramGroupTransforms; });
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
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
 * transforms.js
 * Geometric transformations
 */







//
// Shaders
//

// Perspective warp
const warpPerspective = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('transforms/warp-perspective.glsl')
                        .withArguments('image', 'inverseHomography');

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

// Additive mix (TODO create a new program group?)
const additiveMix = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_1__["importShader"])('transforms/additive-mix.glsl')
                    .withArguments('image0', 'image1', 'alpha', 'beta', 'gamma');

/**
 * SpeedyProgramGroupTransforms
 * Geometric transformations
 */
class SpeedyProgramGroupTransforms extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgramGroup"]
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     */
    constructor(gpu)
    {
        super(gpu);
        this
            .declare('warpPerspective', warpPerspective)
            .declare('resizeNN', resizeNN)
            .declare('resizeBI', resizeBI)
            .declare('additiveMix', additiveMix)
        ;
    }
}

/***/ }),

/***/ "./src/gpu/programs/utils.js":
/*!***********************************!*\
  !*** ./src/gpu/programs/utils.js ***!
  \***********************************/
/*! exports provided: SpeedyProgramGroupUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeedyProgramGroupUtils", function() { return SpeedyProgramGroupUtils; });
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
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

// Scan the entire image and find the minimum & maximum pixel intensity
const scanMinMax2D = Object(_shader_declaration__WEBPACK_IMPORTED_MODULE_2__["importShader"])('utils/scan-minmax2d.glsl').withArguments('image', 'iterationNumber');



/**
 * SpeedyProgramGroupUtils
 * Utility operations
 */
class SpeedyProgramGroupUtils extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgramGroup"]
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     */
    constructor(gpu)
    {
        super(gpu);
        this
            // no-operation
            .declare('identity', identity)

            // render to the canvas
            .declare('renderToCanvas', flipY, {
                ...this.program.rendersToCanvas()
            })
                
            // Fill image with a constant
            .declare('fill', fill)

            // Fill zero or more color components of the input image with a constant value
            .declare('fillComponents', fillComponents)

            // Copy the src component of src to zero or more color components of a copy of dest
            .declare('copyComponents', copyComponents)

            // find minimum & maximum pixel intensity
            .declare('scanMinMax2D', scanMinMax2D, {
                ...this.program.usesPingpongRendering()
            })
        ;
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
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
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





// Import numeric globals
const globals = __webpack_require__(/*! ../utils/globals */ "./src/utils/globals.js");
const numericGlobals = Object.keys(globals).filter(key => typeof globals[key] == 'number').reduce(
    (obj, key) => ((obj[key] = globals[key]), obj), {}
);

// Constants accessible by all shaders
const constants = Object.freeze({
    // numeric globals
    ...numericGlobals,

    // colors
    'PIXELCOMPONENT_RED': _utils_types__WEBPACK_IMPORTED_MODULE_1__["PixelComponent"].RED,
    'PIXELCOMPONENT_GREEN': _utils_types__WEBPACK_IMPORTED_MODULE_1__["PixelComponent"].GREEN,
    'PIXELCOMPONENT_BLUE': _utils_types__WEBPACK_IMPORTED_MODULE_1__["PixelComponent"].BLUE,
    'PIXELCOMPONENT_ALPHA': _utils_types__WEBPACK_IMPORTED_MODULE_1__["PixelComponent"].ALPHA,
});

// Regular Expressions
const commentsRegex = [ /\/\*(.|\s)*?\*\//g , /\/\/.*$/gm ];
const includeRegex = /^\s*@\s*include\s+"(.*?)"/gm;
const constantRegex = /@(\w+)@/g;
const unrollRegex = [
    /@\s*unroll\s+?for\s*\(\s*(int|)\s*(?<counter>\w+)\s*\=\s*(-?\d+|\w+)\s*;\s*\k<counter>\s*(<=?)\s*(-?\d+|\w+)\s*;\s*\k<counter>\s*\+\+()\s*\)\s*\{\s*([\s\S]+?)\s*\}/g,
    /@\s*unroll\s+?for\s*\(\s*(int|)\s*(?<counter>\w+)\s*\=\s*(-?\d+|\w+)\s*;\s*\k<counter>\s*(<=?)\s*(-?\d+|\w+)\s*;\s*\k<counter>\s*\+=\s*(-?\d+)\s*\)\s*\{\s*([\s\S]+?)\s*\}/g,
];

/**
 * Custom preprocessor for the shaders
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

    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["FileNotFoundError"](`Shader preprocessor: can't read file "${filename}"`);
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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["ParseError"](`Can't unroll loop: unknown limits (start=${start}, end=${end}). Code:\n\n${match}`);
        else
            return match; // don't unroll now, because defines is empty - maybe we'll succeed in the next pass
    }

    // parse limits
    start = parseInt(start);
    end = parseInt(end);
    step = (step.length == 0) ? 1 : parseInt(step);
    _utils_utils__WEBPACK_IMPORTED_MODULE_0__["Utils"].assert(start <= end && step > 0);

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
	"./filters/convolution": "./src/gpu/shaders/filters/convolution.js",
	"./filters/convolution.js": "./src/gpu/shaders/filters/convolution.js",
	"./filters/convolution1d.glsl": "./src/gpu/shaders/filters/convolution1d.glsl",
	"./filters/convolution2d.glsl": "./src/gpu/shaders/filters/convolution2d.glsl",
	"./filters/fast-median.glsl": "./src/gpu/shaders/filters/fast-median.glsl",
	"./filters/nightvision.glsl": "./src/gpu/shaders/filters/nightvision.glsl",
	"./filters/normalize-image.glsl": "./src/gpu/shaders/filters/normalize-image.glsl",
	"./filters/rgb2grey.glsl": "./src/gpu/shaders/filters/rgb2grey.glsl",
	"./include/colors.glsl": "./src/gpu/shaders/include/colors.glsl",
	"./include/fixed-point.glsl": "./src/gpu/shaders/include/fixed-point.glsl",
	"./include/float16.glsl": "./src/gpu/shaders/include/float16.glsl",
	"./include/global.glsl": "./src/gpu/shaders/include/global.glsl",
	"./include/keypoints.glsl": "./src/gpu/shaders/include/keypoints.glsl",
	"./include/math.glsl": "./src/gpu/shaders/include/math.glsl",
	"./include/pyramids.glsl": "./src/gpu/shaders/include/pyramids.glsl",
	"./include/subpixel.glsl": "./src/gpu/shaders/include/subpixel.glsl",
	"./keypoints/allocate-descriptors.glsl": "./src/gpu/shaders/keypoints/allocate-descriptors.glsl",
	"./keypoints/apply-homography.glsl": "./src/gpu/shaders/keypoints/apply-homography.glsl",
	"./keypoints/discard-descriptors.glsl": "./src/gpu/shaders/keypoints/discard-descriptors.glsl",
	"./keypoints/encode-keypoint-long-offsets.glsl": "./src/gpu/shaders/keypoints/encode-keypoint-long-offsets.glsl",
	"./keypoints/encode-keypoint-offsets.glsl": "./src/gpu/shaders/keypoints/encode-keypoint-offsets.glsl",
	"./keypoints/encode-keypoint-positions.glsl": "./src/gpu/shaders/keypoints/encode-keypoint-positions.glsl",
	"./keypoints/encode-keypoint-properties.glsl": "./src/gpu/shaders/keypoints/encode-keypoint-properties.glsl",
	"./keypoints/encode-null-keypoints.glsl": "./src/gpu/shaders/keypoints/encode-null-keypoints.glsl",
	"./keypoints/fast.glsl": "./src/gpu/shaders/keypoints/fast.glsl",
	"./keypoints/harris-cutoff.glsl": "./src/gpu/shaders/keypoints/harris-cutoff.glsl",
	"./keypoints/harris-derivatives.glsl": "./src/gpu/shaders/keypoints/harris-derivatives.glsl",
	"./keypoints/harris.glsl": "./src/gpu/shaders/keypoints/harris.glsl",
	"./keypoints/lk-discard.glsl": "./src/gpu/shaders/keypoints/lk-discard.glsl",
	"./keypoints/lk.glsl": "./src/gpu/shaders/keypoints/lk.glsl",
	"./keypoints/mix-keypoints.glsl": "./src/gpu/shaders/keypoints/mix-keypoints.glsl",
	"./keypoints/ncc.glsl": "./src/gpu/shaders/keypoints/ncc.glsl",
	"./keypoints/nonmax-suppression.glsl": "./src/gpu/shaders/keypoints/nonmax-suppression.glsl",
	"./keypoints/orb-descriptor.glsl": "./src/gpu/shaders/keypoints/orb-descriptor.glsl",
	"./keypoints/orb-orientation.glsl": "./src/gpu/shaders/keypoints/orb-orientation.glsl",
	"./keypoints/score-findmax.glsl": "./src/gpu/shaders/keypoints/score-findmax.glsl",
	"./keypoints/sort-applyperm.glsl": "./src/gpu/shaders/keypoints/sort-applyperm.glsl",
	"./keypoints/sort-createperm.glsl": "./src/gpu/shaders/keypoints/sort-createperm.glsl",
	"./keypoints/sort-mergeperm.glsl": "./src/gpu/shaders/keypoints/sort-mergeperm.glsl",
	"./keypoints/transfer-flow.glsl": "./src/gpu/shaders/keypoints/transfer-flow.glsl",
	"./keypoints/transfer-orientation.glsl": "./src/gpu/shaders/keypoints/transfer-orientation.glsl",
	"./keypoints/upload-keypoints.glsl": "./src/gpu/shaders/keypoints/upload-keypoints.glsl",
	"./pyramids/downsample2.glsl": "./src/gpu/shaders/pyramids/downsample2.glsl",
	"./pyramids/upsample2.glsl": "./src/gpu/shaders/pyramids/upsample2.glsl",
	"./transforms/additive-mix.glsl": "./src/gpu/shaders/transforms/additive-mix.glsl",
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

/***/ "./src/gpu/shaders/filters/nightvision.glsl":
/*!**************************************************!*\
  !*** ./src/gpu/shaders/filters/nightvision.glsl ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D image;\nuniform sampler2D illuminationMap;\nuniform float gain;\nuniform float offset;\nuniform float decay;\n#ifndef GREYSCALE\n#error Must define GREYSCALE\n#endif\n#if GREYSCALE == 0\nconst mat3 rgb2yuv = mat3(\n0.299f, -0.14713f, 0.615f,\n0.587f, -0.28886f, -0.51499f,\n0.114f, 0.436f, -0.10001f\n);\nconst mat3 yuv2rgb = mat3(\n1.0f, 1.0f, 1.0f,\n0.0f, -0.39465f, 2.03211f,\n1.13983f, -0.58060f, 0.0f\n);\n#endif\nconst float eps = 0.0001f;\nconst float sqrt2 = 1.4142135623730951f;\nconst float magic = 20.0f;\nconst vec2 center = vec2(0.5f);\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nvec4 imapPixel = threadPixel(illuminationMap);\nfloat lambda = -sqrt2 * log(max(1.0f - decay, eps));\nfloat dist = length(texCoord - center);\nfloat vgain = gain * exp(-lambda * dist);\nfloat normalizedGain = 2.0f * vgain;\nfloat normalizedOffset = 2.0f * offset - 1.0f;\n#if GREYSCALE != 0\nfloat luma = 1.0 / (1.0 + exp(-normalizedGain * magic * (pixel.g - imapPixel.g)));\nluma = clamp(luma + normalizedOffset, 0.0f, 1.0f);\ncolor = vec4(luma, luma, luma, 1.0f);\n#else\nvec3 yuvPixel = rgb2yuv * pixel.rgb;\nvec3 yuvImapPixel = rgb2yuv * imapPixel.rgb;\nfloat luma = 1.0 / (1.0 + exp(-normalizedGain * magic * (yuvPixel.r - yuvImapPixel.r)));\nluma += normalizedOffset;\nvec3 rgbCorrectedPixel = yuv2rgb * vec3(luma, yuvPixel.gb);\nrgbCorrectedPixel = clamp(rgbCorrectedPixel, 0.0f, 1.0f);\ncolor = vec4(rgbCorrectedPixel, 1.0f);\n#endif\n}"

/***/ }),

/***/ "./src/gpu/shaders/filters/normalize-image.glsl":
/*!******************************************************!*\
  !*** ./src/gpu/shaders/filters/normalize-image.glsl ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#ifndef GREYSCALE\n#error Must define GREYSCALE\n#endif\n#if GREYSCALE != 0\nuniform sampler2D minmax2d;\n#else\nuniform sampler2D minmax2dRGB[3];\n#endif\nuniform float minValue;\nuniform float maxValue;\nconst float eps = 1.0f / 255.0f;\nvoid main()\n{\nvec2 minmax = clamp(vec2(minValue, maxValue), 0.0f, 255.0f) / 255.0f;\nvec4 newMin = vec4(minmax.x);\nvec4 newRange = vec4(minmax.y - minmax.x);\nvec4 alpha = vec4(1.0f, newMin.x, newRange.x, 1.0f);\n#if GREYSCALE != 0\nvec4 pixel = threadPixel(minmax2d);\nmat4 channel = mat4(pixel, pixel, pixel, alpha);\n#else\nmat4 channel = mat4(\nthreadPixel(minmax2dRGB[0]),\nthreadPixel(minmax2dRGB[1]),\nthreadPixel(minmax2dRGB[2]),\nalpha\n);\n#endif\nvec4 oldMin = vec4(channel[0].g, channel[1].g, channel[2].g, channel[3].g);\nvec4 oldRange = max(vec4(channel[0].b, channel[1].b, channel[2].b, channel[3].b), eps);\nvec4 oldIntensity = vec4(channel[0].a, channel[1].a, channel[2].a, channel[3].a);\nvec4 newIntensity = (oldIntensity - oldMin) * newRange / oldRange + newMin;\ncolor = newIntensity;\n}"

/***/ }),

/***/ "./src/gpu/shaders/filters/rgb2grey.glsl":
/*!***********************************************!*\
  !*** ./src/gpu/shaders/filters/rgb2grey.glsl ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "const vec4 grey = vec4(0.299f, 0.587f, 0.114f, 0.0f);\nuniform sampler2D image;\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nfloat g = dot(pixel, grey);\ncolor = vec4(g, g, g, 1.0f);\n}"

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
	"./pyramids.glsl": "./src/gpu/shaders/include/pyramids.glsl",
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

module.exports = "#ifndef _FLOAT16_GLSL\n#define _FLOAT16_GLSL\n#define encodeFloat16(f) (vec2(packf16(f)) / 255.0f)\n#define decodeFloat16(v) unpackf16(uvec2((v) * 255.0f))\nuvec2 packf16( float f)\n{\nuint y = packHalf2x16(vec2(f, 0.0f));\nreturn uvec2(y, y >> 8u) & 0xFFu;\n}\nfloat unpackf16(uvec2 v)\n{\nv &= 0xFFu;\nreturn unpackHalf2x16(v.x | (v.y << 8u)).x;\n}\nbool isEncodedFloat16Zero(vec2 v)\n{\nuvec2 w = uvec2(v * 255.0f);\nreturn 0u == w.x + w.y * (0x80u - w.y);\n}\n#endif"

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

module.exports = "#ifndef _KEYPOINTS_GLSL\n#define _KEYPOINTS_GLSL\n@include \"math.glsl\"\n@include \"fixed-point.glsl\"\n@include \"float16.glsl\"\n@include \"pyramids.glsl\"\nstruct Keypoint\n{\nvec2 position;\nfloat lod;\nfloat orientation;\nfloat score;\nuint flags;\n};\nstruct KeypointAddress\n{\nint base;\nint offset;\n};\nconst int MIN_KEYPOINT_SIZE = int(@MIN_KEYPOINT_SIZE@);\nconst uint KPF_NONE = 0u;\nconst uint KPF_INFINITY = 1u;\n#define encodeKeypointScore(score) encodeFloat16(score)\n#define decodeKeypointScore(encodedScore) decodeFloat16(encodedScore)\n#define encodeKeypointOrientation(angle) ((angle) * INV_PI_OVER_2 + 0.5f)\n#define decodeKeypointOrientation(value) ((value) * TWO_PI - PI)\n#define encodeNullKeypoint() (vec4(1.0f))\n#define encodeDiscardedKeypoint() (vec4(0.0f))\n#define isBadKeypoint(keypoint) ((keypoint).score < 0.0f)\n#define sizeofEncodedKeypoint(descriptorSize, extraSize) (MIN_KEYPOINT_SIZE + (descriptorSize) + (extraSize))\n#define findKeypointIndex(address, descriptorSize, extraSize) ((address).base / ((sizeofEncodedKeypoint((descriptorSize), (extraSize))) / 4))\nvec4 readKeypointData(sampler2D encodedKeypoints, int encoderLength, KeypointAddress address)\n{\nint rasterIndex = address.base + address.offset;\nvec4 data = pixelAt(encodedKeypoints, ivec2(rasterIndex % encoderLength, rasterIndex / encoderLength));\nreturn rasterIndex < encoderLength * encoderLength ? data : encodeNullKeypoint();\n}\nKeypointAddress findKeypointAddress(ivec2 thread, int encoderLength, int descriptorSize, int extraSize)\n{\nint threadRaster = thread.y * encoderLength + thread.x;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nint keypointIndex = int(threadRaster / pixelsPerKeypoint);\nKeypointAddress address = KeypointAddress(\nkeypointIndex * pixelsPerKeypoint,\nthreadRaster % pixelsPerKeypoint\n);\nreturn address;\n}\nKeypoint decodeKeypoint(sampler2D encodedKeypoints, int encoderLength, KeypointAddress address)\n{\nKeypoint keypoint;\nKeypointAddress positionAddress = KeypointAddress(address.base, 0);\nKeypointAddress propertiesAddress = KeypointAddress(address.base, 1);\nvec4 rawEncodedPosition = readKeypointData(encodedKeypoints, encoderLength, positionAddress);\nivec4 encodedPosition = ivec4(rawEncodedPosition * 255.0f);\nkeypoint.position = fixtovec2(fixed2_t(\nencodedPosition.r | (encodedPosition.g << 8),\nencodedPosition.b | (encodedPosition.a << 8)\n));\nvec4 encodedProperties = readKeypointData(encodedKeypoints, encoderLength, propertiesAddress);\nkeypoint.lod = decodeLod(encodedProperties.r);\nkeypoint.orientation = decodeKeypointOrientation(encodedProperties.g);\nkeypoint.score = decodeKeypointScore(encodedProperties.ba);\nbool isNull = all(equal(rawEncodedPosition, vec4(1)));\nbool isDiscarded = all(equal(rawEncodedPosition + encodedProperties, vec4(0)));\nkeypoint.score = (isNull || isDiscarded) ? -1.0f : keypoint.score;\nkeypoint.flags = KPF_NONE;\nkeypoint.flags |= KPF_INFINITY * uint(all(equal(encodedPosition, ivec4(254, 255, 255, 255))));\nreturn keypoint;\n}\nvec4 encodeKeypointPosition(vec2 position)\n{\nconst vec2 zeros = vec2(0.0f);\nfixed2_t pos = vec2tofix(max(position, zeros));\nfixed2_t lo = pos & 255;\nfixed2_t hi = pos >> 8;\nreturn vec4(lo.x, hi.x, lo.y, hi.y) / 255.0f;\n}\n#define encodeKeypointPositionAtInfinity() (vec4(254, 255, 255, 255) / 255.0f)\n#define isKeypointAtInfinity(keypoint) (((keypoint.flags) & KPF_INFINITY) != 0u)\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/math.glsl":
/*!*******************************************!*\
  !*** ./src/gpu/shaders/include/math.glsl ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#ifndef _MATH_GLSL\n#define _MATH_GLSL\n#define TWO_PI          6.28318530718f\n#define PI              3.14159265359f\n#define PI_OVER_2       1.57079632679f\n#define PI_OVER_4       0.78539816339f\n#define INV_PI          0.3183098861837907f\n#define INV_PI_OVER_2   0.15915494309189535f\nconst highp float INFINITY = 1.0f / 0.0f;\nfloat fastAtan(float x)\n{\nfloat w = 1.0f - abs(x);\nreturn (w >= 0.0f) ? ((PI_OVER_4 + 0.273f * w) * x) :\n(sign(x) * PI_OVER_2 - (PI_OVER_4 + 0.273f * (1.0f - abs(1.0f / x))) / x);\n}\nfloat fastAtan2(float y, float x)\n{\nreturn (x == 0.0f) ? PI_OVER_2 * sign(y) : fastAtan(y / x) + float(x < 0.0f) * PI * sign(y);\n}\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/pyramids.glsl":
/*!***********************************************!*\
  !*** ./src/gpu/shaders/include/pyramids.glsl ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#ifndef _PYRAMIDS_GLSL\n#define _PYRAMIDS_GLSL\n#define pyrPixel(pyr, lod) textureLod((pyr), texCoord, (lod))\n#define pyrPixelAtOffset(pyr, lod, pot, offset) textureLod((pyr), texCoord + ((pot) * vec2(offset)) / texSize, (lod))\n#define pyrPixelAt(pyr, pos, lod) textureLod((pyr), (vec2(pos) + vec2(0.5f)) / texSize, (lod))\n#define pyrPixelAtEx(pyr, pos, lod, pyrBaseSize) textureLod((pyr), (vec2(pos) + vec2(0.5f)) / vec2(pyrBaseSize), (lod))\n#define pyrSubpixelAtEx(pyr, pos, lod, pyrBaseSize) textureLod((pyr), ((pos) + vec2(0.5f)) / vec2(pyrBaseSize), (lod))\n#define pyrSubpixelAtExOffset(pyr, pos, lod, pot, offset, pyrBaseSize) textureLod((pyr), (((pos) + vec2(0.5f)) + ((pot) * vec2(offset))) / vec2(pyrBaseSize), (lod))\nconst int PYRAMID_MAX_LEVELS = int(@PYRAMID_MAX_LEVELS@);\nconst float F_PYRAMID_MAX_LEVELS = float(@PYRAMID_MAX_LEVELS@);\nconst float LOG2_PYRAMID_MAX_SCALE = float(@LOG2_PYRAMID_MAX_SCALE@);\n#define encodeLod(lod) ((LOG2_PYRAMID_MAX_SCALE + (lod)) / (LOG2_PYRAMID_MAX_SCALE + F_PYRAMID_MAX_LEVELS))\nfloat decodeLod(float encodedLod)\n{\nfloat lod = encodedLod * (LOG2_PYRAMID_MAX_SCALE + F_PYRAMID_MAX_LEVELS) - LOG2_PYRAMID_MAX_SCALE;\nreturn lod - lod * step(1.0f, encodedLod);\n}\nconst float ENCODED_LOD_EPS = 0.125f / (LOG2_PYRAMID_MAX_SCALE + F_PYRAMID_MAX_LEVELS);\n#define isSameEncodedLod(alpha1, alpha2) (abs((alpha1) - (alpha2)) < ENCODED_LOD_EPS)\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/subpixel.glsl":
/*!***********************************************!*\
  !*** ./src/gpu/shaders/include/subpixel.glsl ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#ifndef _SUBPIXEL_GLSL\n#define _SUBPIXEL_GLSL\n#define subpixelAt(image, pos) textureLod((image), ((pos) + vec2(0.5f)) / texSize, 0.0f)\nvec4 subpixelAtBI(sampler2D image, vec2 pos)\n{\nvec2 frc = fract(pos);\nvec2 ifrc = vec2(1.0f) - frc;\nvec2 p = (floor(pos) + vec2(0.5f)) / vec2(textureSize(image, 0));\nvec4 pix00 = textureLod(image, p, 0.0f);\nvec4 pix10 = textureLodOffset(image, p, 0.0f, ivec2(1,0));\nvec4 pix01 = textureLodOffset(image, p, 0.0f, ivec2(0,1));\nvec4 pix11 = textureLodOffset(image, p, 0.0f, ivec2(1,1));\nmat4 pix = mat4(pix00, pix10, pix01, pix11);\nvec4 mul = vec4(ifrc.x * ifrc.y, frc.x * ifrc.y, ifrc.x * frc.y, frc.x * frc.y);\nreturn pix * mul;\n}\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/allocate-descriptors.glsl":
/*!*************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/allocate-descriptors.glsl ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D inputEncodedKeypoints;\nuniform int inputDescriptorSize;\nuniform int inputExtraSize;\nuniform int inputEncoderLength;\nuniform int outputDescriptorSize;\nuniform int outputExtraSize;\nuniform int outputEncoderLength;\nconst vec4 EMPTY_DESCRIPTOR = vec4(0.0f);\nvoid main()\n{\nivec2 thread = threadLocation();\nKeypointAddress myAddress = findKeypointAddress(thread, outputEncoderLength, outputDescriptorSize, outputExtraSize);\nint myIndex = findKeypointIndex(myAddress, outputDescriptorSize, outputExtraSize);\nint headerSize = sizeofEncodedKeypoint(0, 0);\nbool isDescriptor = (myAddress.offset >= (headerSize + outputExtraSize) / 4);\nint addressOffset = myAddress.offset;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(inputDescriptorSize, inputExtraSize) / 4;\nKeypointAddress otherAddress = KeypointAddress(myIndex * pixelsPerKeypoint, addressOffset);\ncolor = isDescriptor ? EMPTY_DESCRIPTOR : readKeypointData(inputEncodedKeypoints, inputEncoderLength, otherAddress);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/apply-homography.glsl":
/*!*********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/apply-homography.glsl ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform mat3 homography;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nvoid main()\n{\nvec4 pixel = threadPixel(encodedKeypoints);\nivec2 thread = threadLocation();\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\ncolor = pixel;\nif(address.offset != 0)\nreturn;\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);\nif(isBadKeypoint(keypoint))\nreturn;\nvec3 pos3 = homography * vec3(keypoint.position, 1.0f);\ncolor = encodeKeypointPosition(pos3.xy / pos3.z);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/discard-descriptors.glsl":
/*!************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/discard-descriptors.glsl ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nuniform int newEncoderLength;\nvoid main()\n{\nivec2 thread = threadLocation();\nKeypointAddress myAddress = findKeypointAddress(thread, newEncoderLength, 0, extraSize);\nint myIndex = findKeypointIndex(myAddress, 0, extraSize);\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress otherAddress = KeypointAddress(myIndex * pixelsPerKeypoint, myAddress.offset);\ncolor = readKeypointData(encodedKeypoints, encoderLength, otherAddress);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/encode-keypoint-long-offsets.glsl":
/*!*********************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/encode-keypoint-long-offsets.glsl ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"float16.glsl\"\nuniform sampler2D offsetsImage;\nuniform ivec2 imageSize;\n#ifndef MAX_ITERATIONS\n#error Must define MAX_ITERATIONS\n#endif\n#define decodeSkipOffset(pixel) (int((pixel).g * 255.0f) | (int((pixel).a * 255.0f) << 8))\n#define encodeSkipOffset(offset) (vec2((offset) & 255, (offset) >> 8) / 255.0f)\nvoid main()\n{\nvec4 pixel = threadPixel(offsetsImage);\nivec2 thread = threadLocation();\nint rasterIndex = thread.y * imageSize.x + thread.x;\nint offset = decodeSkipOffset(pixel);\nint totalOffset = offset;\nvec2 encodedScore = pixel.rb;\nivec2 pos = thread; int allow = 1;\nfor(int i = 0; i < MAX_ITERATIONS; i++) {\nallow *= int(pos.y < imageSize.y) * int(isEncodedFloat16Zero(pixel.rb));\nrasterIndex += allow * offset;\npos = ivec2(rasterIndex % imageSize.x, rasterIndex / imageSize.x);\npixel = pixelAt(offsetsImage, pos);\noffset = decodeSkipOffset(pixel);\ntotalOffset += allow * offset;\n}\ntotalOffset = min(totalOffset, 65535);\ncolor.rb = encodedScore;\ncolor.ga = encodeSkipOffset(totalOffset);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/encode-keypoint-offsets.glsl":
/*!****************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/encode-keypoint-offsets.glsl ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"float16.glsl\"\nuniform sampler2D corners;\nuniform ivec2 imageSize;\n#if !defined(MAX_ITERATIONS)\n#error Must define MAX_ITERATIONS\n#elif MAX_ITERATIONS > 255\n#error MAX_ITERATIONS must be less than 256\n#endif\nvoid main()\n{\nvec4 pixel = threadPixel(corners);\nivec2 pos = threadLocation();\nvec2 encodedScore = pixel.rb;\nint offset = 0, allow = 1;\nfor(int i = 0; i < MAX_ITERATIONS; i++) {\nallow *= int(pos.y < imageSize.y) * int(isEncodedFloat16Zero(pixel.rb));\noffset += allow;\npos.x = (pos.x + 1) % imageSize.x;\npos.y += int(pos.x == 0);\npixel = pixelAt(corners, pos);\n}\ncolor.rb = encodedScore;\ncolor.ga = vec2(offset, 0) / 255.0f;\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/encode-keypoint-positions.glsl":
/*!******************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/encode-keypoint-positions.glsl ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D offsetsImage;\nuniform ivec2 imageSize;\nuniform int passId;\nuniform int numPasses;\nuniform int keypointLimit;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#define decodeSkipOffset(pixel) (int((pixel).g * 255.0f) | (int((pixel).a * 255.0f) << 8))\nbool findQthKeypoint(int q, int p, inout ivec2 position, out vec4 pixel)\n{\nint notFirstPass = int(passId > 0);\nposition *= notFirstPass;\np |= -(1 - notFirstPass);\np -= notFirstPass;\nint rasterIndex = position.y * imageSize.x + position.x;\nwhile(position.y < imageSize.y && p != q) {\nposition = ivec2(rasterIndex % imageSize.x, rasterIndex / imageSize.x);\npixel = texelFetch(offsetsImage, position, 0);\np += int(!isEncodedFloat16Zero(pixel.rb));\nrasterIndex += max(1, decodeSkipOffset(pixel));\n}\nreturn (p == q);\n}\nvoid main()\n{\nivec2 thread = threadLocation();\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint q = findKeypointIndex(address, descriptorSize, extraSize);\ncolor = vec4(0.0f);\nif(address.offset != 0)\nreturn;\ncolor = threadPixel(encodedKeypoints);\nint numPixels = encoderLength * encoderLength;\nint maxKeypoints = numPixels / pixelsPerKeypoint;\nint maxKeypointsPerPass = maxKeypoints / numPasses + int(maxKeypoints % numPasses != 0);\nint targetPassId = q / maxKeypointsPerPass;\nif(passId != targetPassId)\nreturn;\nint lastIndexFromPrevPass = passId * maxKeypointsPerPass - 1;\nKeypointAddress lastAddressFromPrevPass = KeypointAddress(max(0, lastIndexFromPrevPass) * pixelsPerKeypoint, 0);\nKeypoint lastKeypointFromPrevPass = decodeKeypoint(encodedKeypoints, encoderLength, lastAddressFromPrevPass);\nivec2 position = ivec2(lastKeypointFromPrevPass.position);\nvec4 pixel;\ncolor = encodeNullKeypoint();\nif(q >= min(maxKeypoints, keypointLimit) || !findQthKeypoint(q, lastIndexFromPrevPass, position, pixel))\nreturn;\ncolor = encodeKeypointPosition(vec2(position));\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/encode-keypoint-properties.glsl":
/*!*******************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/encode-keypoint-properties.glsl ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D corners;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nvoid main()\n{\nivec2 thread = threadLocation();\nvec4 pixel = threadPixel(encodedKeypoints);\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint q = findKeypointIndex(address, descriptorSize, extraSize);\ncolor = pixel;\nif(address.offset != 1)\nreturn;\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);\nvec4 kpix = pixelAt(corners, ivec2(keypoint.position));\nkeypoint.score = decodeFloat16(kpix.rb);\ncolor.r = kpix.a;\ncolor.g = encodeKeypointOrientation(0.0f);\ncolor.ba = encodeKeypointScore(keypoint.score);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/encode-null-keypoints.glsl":
/*!**************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/encode-null-keypoints.glsl ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nvoid main()\n{\ncolor = encodeNullKeypoint();\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/fast.glsl":
/*!*********************************************!*\
  !*** ./src/gpu/shaders/keypoints/fast.glsl ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"pyramids.glsl\"\n@include \"float16.glsl\"\nuniform sampler2D corners;\nuniform sampler2D pyramid;\nuniform float lod;\nuniform int threshold;\n#define PIX(x,y) pyrPixelAtOffset(pyramid, lod, pot, ivec2((x),(y))).g\nvoid main()\n{\nfloat pixel = threadPixel(pyramid).g;\nvec4 prev = threadPixel(corners);\nivec2 thread = threadLocation();\nivec2 size = outputSize();\nfloat pot = exp2(lod);\nfloat t = float(clamp(threshold, 0, 255)) / 255.0f;\nfloat ct = pixel + t, c_t = pixel - t;\ncolor = vec4(prev.r, pixel, prev.ba);\n#if !defined(FAST_TYPE)\n#error Must define FAST_TYPE\n#elif FAST_TYPE == 916\nconst ivec4 margin = ivec4(3, 3, 4, 4);\nif(any(lessThan(ivec4(thread, size - thread), margin)))\nreturn;\nfloat p0 = PIX(0,3), p4 = PIX(3,0), p8 = PIX(0,-3), p12 = PIX(-3,0);\nbvec4 brighter = bvec4(p0 > ct, p4 > ct, p8 > ct, p12 > ct);\nbvec4 darker = bvec4(p0 < c_t, p4 < c_t, p8 < c_t, p12 < c_t);\nbvec4 bpairs = bvec4(all(brighter.xy), all(brighter.yz), all(brighter.zw), all(brighter.wx));\nbvec4 dpairs = bvec4(all(darker.xy), all(darker.yz), all(darker.zw), all(darker.wx));\nif(!(any(bpairs) || any(dpairs)))\nreturn;\nfloat p1 = PIX(1,3), p2 = PIX(2,2), p3 = PIX(3,1);\nfloat p5 = PIX(3,-1), p6 = PIX(2,-2), p7 = PIX(1,-3);\nfloat p9 = PIX(-1,-3), p10 = PIX(-2,-2), p11 = PIX(-3,-1);\nfloat p13 = PIX(-3,1), p14 = PIX(-2,2), p15 = PIX(-1,3);\nbool A=(p0>ct),B=(p1>ct),C=(p2>ct),D=(p3>ct),E=(p4>ct),F=(p5>ct),G=(p6>ct),H=(p7>ct),I=(p8>ct),J=(p9>ct),K=(p10>ct),L=(p11>ct),M=(p12>ct),N=(p13>ct),O=(p14>ct),P=(p15>ct),a=(p0<c_t),b=(p1<c_t),c=(p2<c_t),d=(p3<c_t),e=(p4<c_t),f=(p5<c_t),g=(p6<c_t),h=(p7<c_t),i=(p8<c_t),j=(p9<c_t),k=(p10<c_t),l=(p11<c_t),m=(p12<c_t),n=(p13<c_t),o=(p14<c_t),p=(p15<c_t);\nbool isCorner=A&&(B&&(K&&L&&J&&(M&&N&&O&&P||G&&H&&I&&(M&&N&&O||F&&(M&&N||E&&(M||D))))||C&&(K&&L&&M&&(N&&O&&P||G&&H&&I&&J&&(N&&O||F&&(N||E)))||D&&(N&&(L&&M&&(K&&G&&H&&I&&J&&(O||F)||O&&P)||k&&l&&m&&e&&f&&g&&h&&i&&j)||E&&(O&&(M&&N&&(K&&L&&G&&H&&I&&J||P)||k&&l&&m&&n&&f&&g&&h&&i&&j)||F&&(P&&(N&&O||k&&l&&m&&n&&o&&g&&h&&i&&j)||G&&(O&&P||H&&(P||I)||k&&l&&m&&n&&o&&p&&h&&i&&j)||k&&l&&m&&n&&o&&h&&i&&j&&(p||g))||k&&l&&m&&n&&h&&i&&j&&(o&&(p||g)||f&&(o&&p||g)))||k&&l&&m&&h&&i&&j&&(n&&(o&&p||g&&(o||f))||e&&(n&&o&&p||g&&(n&&o||f))))||k&&l&&h&&i&&j&&(m&&(n&&o&&p||g&&(n&&o||f&&(n||e)))||d&&(m&&n&&o&&p||g&&(m&&n&&o||f&&(m&&n||e)))))||k&&h&&i&&j&&(l&&(m&&n&&o&&p||g&&(m&&n&&o||f&&(m&&n||e&&(m||d))))||c&&(l&&m&&n&&o&&p||g&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d))))))||K&&I&&J&&(L&&M&&N&&O&&P||G&&H&&(L&&M&&N&&O||F&&(L&&M&&N||E&&(L&&M||D&&(L||C)))))||h&&i&&j&&(b&&(k&&l&&m&&n&&o&&p||g&&(k&&l&&m&&n&&o||f&&(k&&l&&m&&n||e&&(k&&l&&m||d&&(k&&l||c)))))||k&&(l&&m&&n&&o&&p||g&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c)))))))||B&&(H&&I&&J&&(K&&L&&M&&N&&O&&P&&a||G&&(K&&L&&M&&N&&O&&a||F&&(K&&L&&M&&N&&a||E&&(K&&L&&M&&a||D&&(K&&L&&a||C)))))||a&&k&&i&&j&&(l&&m&&n&&o&&p||g&&h&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c))))))||C&&(K&&H&&I&&J&&(L&&M&&N&&O&&P&&a&&b||G&&(L&&M&&N&&O&&a&&b||F&&(L&&M&&N&&a&&b||E&&(L&&M&&a&&b||D))))||a&&b&&k&&l&&j&&(m&&n&&o&&p||g&&h&&i&&(m&&n&&o||f&&(m&&n||e&&(m||d)))))||D&&(K&&L&&H&&I&&J&&(M&&N&&O&&P&&a&&b&&c||G&&(M&&N&&O&&a&&b&&c||F&&(M&&N&&a&&b&&c||E)))||a&&b&&k&&l&&m&&c&&(n&&o&&p||g&&h&&i&&j&&(n&&o||f&&(n||e))))||E&&(K&&L&&M&&H&&I&&J&&(N&&O&&P&&a&&b&&c&&d||G&&(N&&O&&a&&b&&c&&d||F))||a&&b&&l&&m&&n&&c&&d&&(k&&g&&h&&i&&j&&(o||f)||o&&p))||F&&(K&&L&&M&&N&&H&&I&&J&&(O&&P&&a&&b&&c&&d&&e||G)||a&&b&&m&&n&&o&&c&&d&&e&&(k&&l&&g&&h&&i&&j||p))||G&&(K&&L&&M&&N&&O&&H&&I&&J||a&&b&&n&&o&&p&&c&&d&&e&&f)||H&&(K&&L&&M&&N&&O&&P&&I&&J||a&&b&&o&&p&&c&&d&&e&&f&&g)||a&&(b&&(k&&l&&j&&(m&&n&&o&&p||g&&h&&i&&(m&&n&&o||f&&(m&&n||e&&(m||d))))||c&&(k&&l&&m&&(n&&o&&p||g&&h&&i&&j&&(n&&o||f&&(n||e)))||d&&(l&&m&&n&&(k&&g&&h&&i&&j&&(o||f)||o&&p)||e&&(m&&n&&o&&(k&&l&&g&&h&&i&&j||p)||f&&(n&&o&&p||g&&(o&&p||h&&(p||i)))))))||k&&i&&j&&(l&&m&&n&&o&&p||g&&h&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c))))))||h&&i&&j&&(k&&l&&m&&n&&o&&p||g&&(k&&l&&m&&n&&o||f&&(k&&l&&m&&n||e&&(k&&l&&m||d&&(k&&l||c&&(b||k))))));\nif(!isCorner)\nreturn;\nmat4 mp = mat4(p0,p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12,p13,p14,p15);\nmat4 mct = mp - mat4(ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct);\nmat4 mc_t = mat4(c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t) - mp;\nconst vec4 zeros = vec4(0.0f), ones = vec4(1.0f);\nvec4 bs = max(mct[0], zeros), ds = max(mc_t[0], zeros);\nbs += max(mct[1], zeros);     ds += max(mc_t[1], zeros);\nbs += max(mct[2], zeros);     ds += max(mc_t[2], zeros);\nbs += max(mct[3], zeros);     ds += max(mc_t[3], zeros);\nfloat thisScore = max(dot(bs, ones), dot(ds, ones)) / 16.0f;\nfloat prevScore = decodeFloat16(prev.rb);\nvec3 thisResult = vec3(encodeFloat16(thisScore), encodeLod(lod));\ncolor.rba = thisScore > prevScore ? thisResult : color.rba;\n#else\n#error Unrecognized FAST_TYPE\n#endif\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/harris-cutoff.glsl":
/*!******************************************************!*\
  !*** ./src/gpu/shaders/keypoints/harris-cutoff.glsl ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"float16.glsl\"\nuniform sampler2D corners;\nuniform sampler2D maxScore;\nuniform float quality;\nvoid main()\n{\nvec4 pixel = threadPixel(corners);\nfloat score = decodeFloat16(pixel.rb);\nfloat maxval = decodeFloat16(threadPixel(maxScore).rb);\nfloat threshold = maxval * clamp(quality, 0.0f, 1.0f);\ncolor = pixel;\ncolor.rb = score >= threshold ? color.rb : encodeFloat16(0.0f);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/harris-derivatives.glsl":
/*!***********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/harris-derivatives.glsl ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"pyramids.glsl\"\n@include \"float16.glsl\"\nuniform sampler2D pyramid;\nuniform float lod;\nconst mat3 hkern = mat3(\n1.0f, 0.0f,-1.0f,\n2.0f, 0.0f,-2.0f,\n1.0f, 0.0f,-1.0f\n), vkern = mat3(\n1.0f, 2.0f, 1.0f,\n0.0f, 0.0f, 0.0f,\n-1.0f,-2.0f,-1.0f\n);\n#define PIX(x,y) pyrPixelAtOffset(pyramid, lod, pot, ivec2((x),(y))).g\nconst vec3 ones = vec3(1.0f);\nvoid main()\n{\nfloat pot = exp2(lod);\nmat3 win = mat3(\nPIX(-1,-1), PIX(0,-1), PIX(1,-1),\nPIX(-1,0), PIX(0,0), PIX(1,0),\nPIX(-1,1), PIX(0,1), PIX(1,1)\n);\nmat3 dx = matrixCompMult(hkern, win);\nmat3 dy = matrixCompMult(vkern, win);\nvec2 df = vec2(\ndot(dx[0] + dx[1] + dx[2], ones),\ndot(dy[0] + dy[1] + dy[2], ones)\n);\ncolor = vec4(encodeFloat16(df.x), encodeFloat16(df.y));\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/harris.glsl":
/*!***********************************************!*\
  !*** ./src/gpu/shaders/keypoints/harris.glsl ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"pyramids.glsl\"\n@include \"float16.glsl\"\nuniform sampler2D corners;\nuniform sampler2D derivatives;\nuniform float lod;\n#define H(ox,oy) dpix = pixelAtShortOffset(derivatives, ivec2((ox),(oy))); \\\ndf = vec2(decodeFloat16(dpix.xy), decodeFloat16(dpix.zw)); \\\nh += vec3(df.x * df.x, df.x * df.y, df.y * df.y)\nvoid main()\n{\nvec4 pixel = threadPixel(corners);\nvec4 dpix = vec4(0.0f);\nvec2 df = vec2(0.0f);\nvec3 h = vec3(0.0f);\ncolor = pixel;\n#if !defined(WINDOW_SIZE)\n#error Must define WINDOW_SIZE\n#elif WINDOW_SIZE == 1\nH(0,0);\n#elif WINDOW_SIZE == 3\nH(-1,-1); H(0,-1); H(1,-1);\nH(-1,0); H(0,0); H(1,0);\nH(-1,1); H(0,1); H(1,1);\n#elif WINDOW_SIZE == 5\nH(-2,-2); H(-1,-2); H(0,-2); H(1,-2); H(2,-2);\nH(-2,-1); H(-1,-1); H(0,-1); H(1,-1); H(2,-1);\nH(-2,0); H(-1,0); H(0,0); H(1,0); H(2,0);\nH(-2,1); H(-1,1); H(0,1); H(1,1); H(2,1);\nH(-2,2); H(-1,2); H(0,2); H(1,2); H(2,2);\n#elif WINDOW_SIZE == 7\nH(-3,-3); H(-2,-3); H(-1,-3); H(0,-3); H(1,-3); H(2,-3); H(3,-3);\nH(-3,-2); H(-2,-2); H(-1,-2); H(0,-2); H(1,-2); H(2,-2); H(3,-2);\nH(-3,-1); H(-2,-1); H(-1,-1); H(0,-1); H(1,-1); H(2,-1); H(3,-1);\nH(-3,0); H(-2,0); H(-1,0); H(0,0); H(1,0); H(2,0); H(3,0);\nH(-3,1); H(-2,1); H(-1,1); H(0,1); H(1,1); H(2,1); H(3,1);\nH(-3,2); H(-2,2); H(-1,2); H(0,2); H(1,2); H(2,2); H(3,2);\nH(-3,3); H(-2,3); H(-1,3); H(0,3); H(1,3); H(2,3); H(3,3);\n#else\n#error Invalid WINDOW_SIZE\n#endif\nfloat response = 0.5f * (h.x + h.z - sqrt((h.x - h.z) * (h.x - h.z) + 4.0f * h.y * h.y));\nvec3 result = vec3(encodeFloat16(response), encodeLod(lod));\nfloat prevResponse = decodeFloat16(pixel.rb);\ncolor.rba = response > prevResponse ? result : pixel.rba;\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/lk-discard.glsl":
/*!***************************************************!*\
  !*** ./src/gpu/shaders/keypoints/lk-discard.glsl ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D pyramid;\nuniform int windowSize;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nbool isInsideImage(vec2 position)\n{\nvec2 imageSize = vec2(textureSize(pyramid, 0));\nfloat border = float(windowSize);\nreturn (\nposition.x > border && position.x < imageSize.x - border &&\nposition.y > border && position.y < imageSize.y - border\n);\n}\nvoid main()\n{\nvec4 pixel = threadPixel(encodedKeypoints);\nivec2 thread = threadLocation();\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);\nbool shouldDiscard = isBadKeypoint(keypoint) || isKeypointAtInfinity(keypoint) || !isInsideImage(keypoint.position);\ncolor = shouldDiscard ? encodeDiscardedKeypoint() : pixel;\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/lk.glsl":
/*!*******************************************!*\
  !*** ./src/gpu/shaders/keypoints/lk.glsl ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\n@include \"float16.glsl\"\nuniform sampler2D nextPyramid;\nuniform sampler2D prevPyramid;\nuniform sampler2D encodedFlow;\nuniform sampler2D prevKeypoints;\nuniform int windowSize;\nuniform int level;\nuniform int depth;\nuniform int numberOfIterations;\nuniform float discardThreshold;\nuniform float epsilon;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#ifndef MAX_WINDOW_SIZE\n#error Must define MAX_WINDOW_SIZE\n#endif\n#define NEXT_IMAGE 1\n#define PREV_IMAGE 0\nconst int MAX_WINDOW_SIZE_SQUARED = (MAX_WINDOW_SIZE) * (MAX_WINDOW_SIZE);\nconst int MAX_WINDOW_SIZE_PLUS = (MAX_WINDOW_SIZE) + 2;\nconst int MAX_WINDOW_SIZE_PLUS_SQUARED = MAX_WINDOW_SIZE_PLUS * MAX_WINDOW_SIZE_PLUS;\nconst int DBL_MAX_WINDOW_SIZE_PLUS_SQUARED = 2 * MAX_WINDOW_SIZE_PLUS_SQUARED;\nconst int MAX_WINDOW_RADIUS_PLUS = (MAX_WINDOW_SIZE_PLUS - 1) / 2;\nconst int MAX_WINDOW_RADIUS = ((MAX_WINDOW_SIZE) - 1) / 2;\nconst highp float FLT_SCALE = 0.00000095367431640625f;\nconst highp float FLT_EPSILON = 0.00000011920929f;\n#define windowRadius() ((windowSize - 1) / 2)\nfloat pixelBuffer[DBL_MAX_WINDOW_SIZE_PLUS_SQUARED];\n#define prevPixel(index) pixelBuffer[(index)]\n#define nextPixel(index) pixelBuffer[MAX_WINDOW_SIZE_PLUS_SQUARED + (index)]\n#define pixelIndex(i, j) (((j) + MAX_WINDOW_RADIUS_PLUS) * MAX_WINDOW_SIZE_PLUS + ((i) + MAX_WINDOW_RADIUS_PLUS))\nivec2 derivBuffer[MAX_WINDOW_SIZE_SQUARED];\n#define derivativesAt(x, y) derivBuffer[((y) + MAX_WINDOW_RADIUS) * MAX_WINDOW_SIZE + ((x) + MAX_WINDOW_RADIUS)]\nvoid readWindow(vec2 center, float lod)\n{\nivec2 pyrBaseSize = textureSize(prevPyramid, 0);\nfloat pot = exp2(lod);\nint r = windowRadius();\nivec2 offset; int idx;\n#define readPixelsAt(ox, oy) offset = ivec2((ox), (oy)); \\\nidx = pixelIndex(offset.x, offset.y); \\\nnextPixel(idx) = pyrSubpixelAtExOffset(nextPyramid, center, lod, pot, offset, pyrBaseSize).g; \\\nprevPixel(idx) = pyrSubpixelAtExOffset(prevPyramid, center, lod, pot, offset, pyrBaseSize).g\nfor(int j = 0; j < windowSize; j++) {\nfor(int i = 0; i < windowSize; i++) {\nreadPixelsAt(i-r, j-r);\n}\n}\nint r1 = r+1;\nfor(int k = 0; k < windowSize; k++) {\nreadPixelsAt(-r1, k-r);\nreadPixelsAt( r1, k-r);\nreadPixelsAt(k-r,-r1);\nreadPixelsAt(k-r, r1);\n}\nreadPixelsAt(-r1,-r1);\nreadPixelsAt( r1,-r1);\nreadPixelsAt(-r1, r1);\nreadPixelsAt( r1, r1);\n}\nvec2 computeDerivatives(int imageCode, ivec2 offset)\n{\nconst mat3 dx = mat3(\n3, 0, -3,\n10, 0, -10,\n3, 0, -3\n);\nconst mat3 dy = mat3(\n3, 10, 3,\n0, 0, 0,\n-3, -10, -3\n);\nint indexOffset = imageCode * MAX_WINDOW_SIZE_PLUS_SQUARED;\nmat3 window = mat3(\npixelBuffer[indexOffset + pixelIndex(offset.x-1, offset.y-1)],\npixelBuffer[indexOffset + pixelIndex(offset.x+0, offset.y-1)],\npixelBuffer[indexOffset + pixelIndex(offset.x+1, offset.y-1)],\npixelBuffer[indexOffset + pixelIndex(offset.x-1, offset.y+0)],\n0.0f,\npixelBuffer[indexOffset + pixelIndex(offset.x+1, offset.y+0)],\npixelBuffer[indexOffset + pixelIndex(offset.x-1, offset.y+1)],\npixelBuffer[indexOffset + pixelIndex(offset.x+0, offset.y+1)],\npixelBuffer[indexOffset + pixelIndex(offset.x+1, offset.y+1)]\n);\nmat3 fx = matrixCompMult(dx, window);\nmat3 fy = matrixCompMult(dy, window);\nconst vec3 ones = vec3(1.0f);\nreturn vec2(\ndot(fx[0], ones) + dot(fx[1], ones) + dot(fx[2], ones),\ndot(fy[0], ones) + dot(fy[1], ones) + dot(fy[2], ones)\n);\n}\nfloat readBufferedPixel(int imageCode, ivec2 offset)\n{\nivec2 limit = ivec2(windowRadius());\noffset = clamp(offset, -limit, limit);\nint indexOffset = imageCode * MAX_WINDOW_SIZE_PLUS_SQUARED;\nreturn pixelBuffer[indexOffset + pixelIndex(offset.x, offset.y)];\n}\nfloat readBufferedSubpixel(int imageCode, vec2 offset)\n{\nivec2 p = ivec2(floor(offset));\nvec2 frc = fract(offset);\nvec2 ifrc = vec2(1.0f) - frc;\nvec4 pix4 = vec4(\nreadBufferedPixel(imageCode, p),\nreadBufferedPixel(imageCode, ivec2(p.x + 1, p.y)),\nreadBufferedPixel(imageCode, ivec2(p.x, p.y + 1)),\nreadBufferedPixel(imageCode, ivec2(p.x + 1, p.y + 1))\n);\nreturn dot(vec4(\npix4.x * ifrc.x * ifrc.y,\npix4.y * frc.x * ifrc.y,\npix4.z * ifrc.x * frc.y,\npix4.w * frc.x * frc.y\n), vec4(1.0f));\n}\nivec2 computeMismatch(highp vec2 pyrGuess, highp vec2 localGuess)\n{\nint timeDerivative;\nivec2 mismatch = ivec2(0);\nint x, y, r = windowRadius();\nhighp vec2 d = pyrGuess + localGuess;\nfor(int _y = 0; _y < windowSize; _y++) {\nfor(int _x = 0; _x < windowSize; _x++) {\nx = _x - r; y = _y - r;\ntimeDerivative = int(round(255.0f * (\nreadBufferedSubpixel(NEXT_IMAGE, vec2(x, y) + d) -\nreadBufferedPixel(PREV_IMAGE, ivec2(x, y))\n)));\nmismatch += derivativesAt(x, y) * timeDerivative;\n}\n}\nreturn mismatch;\n}\nvec4 encodeFlow(vec2 flow)\n{\nreturn vec4(encodeFloat16(flow.x), encodeFloat16(flow.y));\n}\nvec2 decodeFlow(vec4 pix)\n{\nreturn vec2(decodeFloat16(pix.rg), decodeFloat16(pix.ba));\n}\n#define encodeInvalidFlow() (vec4(1.0f))\nvoid main()\n{\nvec4 pixel = threadPixel(encodedFlow);\nivec2 thread = threadLocation();\nfloat windowArea = float(windowSize * windowSize);\nint r = windowRadius();\nint keypointIndex = thread.x + thread.y * outputSize().x;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);\nKeypoint keypoint = decodeKeypoint(prevKeypoints, encoderLength, address);\ncolor = encodeFlow(vec2(0.0f));\nif(isBadKeypoint(keypoint))\nreturn;\nhighp vec2 pyrGuess = (level < depth - 1) ? decodeFlow(pixel) : vec2(0.0f);\nreadWindow(keypoint.position, float(level));\nivec2 derivatives;\nivec3 harris3i = ivec3(0);\nfor(int j = 0; j < windowSize; j++) {\nfor(int i = 0; i < windowSize; i++) {\nderivatives = ivec2(floor(255.0f * computeDerivatives(PREV_IMAGE, ivec2(i-r, j-r))));\nharris3i += ivec3(\nderivatives.x * derivatives.x,\nderivatives.x * derivatives.y,\nderivatives.y * derivatives.y\n);\nderivativesAt(i-r, j-r) = derivatives;\n}\n}\nhighp vec3 harris = vec3(harris3i) * FLT_SCALE;\nhighp float det = harris.x * harris.z - harris.y * harris.y;\nhighp float invDet = 1.0f / det;\nhighp mat2 invHarris = mat2(harris.z, -harris.y, -harris.y, harris.x);\nhighp float minEigenvalue = 0.5f * ((harris.x + harris.z) - sqrt(\n(harris.x - harris.z) * (harris.x - harris.z) + 4.0f * (harris.y * harris.y)\n));\nint niceNumbers = int(det >= FLT_EPSILON && minEigenvalue >= discardThreshold * windowArea);\nbool goodKeypoint = (level > 0) || (niceNumbers != 0);\nhighp float eps2 = epsilon * epsilon;\nhighp vec2 mismatch, delta, localGuess = vec2(0.0f);\nfor(int k = 0; k < numberOfIterations; k++) {\nmismatch = vec2(computeMismatch(pyrGuess, localGuess)) * FLT_SCALE;\ndelta = mismatch * invHarris * invDet;\nniceNumbers *= int(eps2 <= dot(delta, delta));\nlocalGuess += float(niceNumbers) * delta;\n}\npyrGuess = 2.0f * (pyrGuess + localGuess);\nvec2 opticalFlow = pyrGuess;\ncolor = goodKeypoint ? encodeFlow(opticalFlow) : encodeInvalidFlow();\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/mix-keypoints.glsl":
/*!******************************************************!*\
  !*** ./src/gpu/shaders/keypoints/mix-keypoints.glsl ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D encodedKeypoints[2];\nuniform int encoderLength[2];\nuniform int encoderCapacity[2];\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int outEncoderLength;\nvoid main()\n{\nivec2 thread = threadLocation();\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress outAddr = findKeypointAddress(thread, outEncoderLength, descriptorSize, extraSize);\nint outIndex = findKeypointIndex(outAddr, descriptorSize, extraSize);\nint encoderIndex = int(outIndex >= encoderCapacity[0]);\nint inIndex = (outIndex - encoderCapacity[0] * encoderIndex);\nKeypointAddress inAddr = KeypointAddress(\ninIndex * pixelsPerKeypoint,\noutAddr.offset\n);\nvec4 data[2] = vec4[2](\nreadKeypointData(encodedKeypoints[0], encoderLength[0], inAddr),\nreadKeypointData(encodedKeypoints[1], encoderLength[1], inAddr)\n);\nbool valid = (inIndex < max(encoderCapacity[0], encoderCapacity[1]));\ncolor = valid ? data[encoderIndex] : encodeNullKeypoint();\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/ncc.glsl":
/*!********************************************!*\
  !*** ./src/gpu/shaders/keypoints/ncc.glsl ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\n@include \"float16.glsl\"\nuniform sampler2D encodedFlow;\nuniform sampler2D prevKeypoints;\nuniform sampler2D prevPyramid;\nuniform sampler2D nextPyramid;\nuniform int windowSize;\nuniform int patchSize;\nuniform int level;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#if !defined(MAX_WINDOW_SIZE_LOD1)\n#error Must define MAX_WINDOW_SIZE_LOD1\n#elif !defined(MAX_PATCH_SIZE)\n#define Must define MAX_PATCH_SIZE\n#endif\nconst int MAX_WINDOW_RADIUS = (MAX_WINDOW_SIZE_LOD1 - 1) / 2;\nconst int WINDOW_BUFFER_STRIDE = MAX_WINDOW_SIZE_LOD1 + (MAX_PATCH_SIZE - 1);\nconst int WINDOW_BUFFER_SIZE = WINDOW_BUFFER_STRIDE * WINDOW_BUFFER_STRIDE;\nfloat windowBuffer[WINDOW_BUFFER_SIZE];\nfloat windowMean;\nconst int PATCH_BUFFER_SIZE = MAX_PATCH_SIZE * MAX_PATCH_SIZE;\nfloat patchBuffer[PATCH_BUFFER_SIZE];\nfloat patchMean;\n#define windowIndex(i, j) (((j) + MAX_WINDOW_RADIUS) * WINDOW_BUFFER_STRIDE + ((i) + MAX_WINDOW_RADIUS))\n#define patchIndex(i, j) (((j) * MAX_PATCH_SIZE) + (i))\n#define windowRadius() ((windowSize - 1) / 2)\n#define windowPixel(i, j) windowBuffer[windowIndex((i), (j))]\n#define patchPixel(i, j) patchBuffer[patchIndex((i), (j))]\nvoid readWindow(vec2 center, float lod)\n{\nivec2 pyrBaseSize = textureSize(nextPyramid, 0);\nfloat pot = exp2(lod);\nint r = windowRadius();\nint i, j;\nivec2 offset;\nfloat sum = 0.0f;\nfor(j = 0; j < windowSize; j++) {\nfor(i = 0; i < windowSize; i++) {\noffset = ivec2(i-r, j-r);\nsum += (windowPixel(i-r, j-r) = pyrSubpixelAtExOffset(nextPyramid, center, lod, pot, offset, pyrBaseSize).g);\n}\n}\nfor(j = 1; j < patchSize; j++) {\nfor(i = 0; i < windowSize; i++) {\noffset = ivec2(i-r, r+j);\nsum += (windowPixel(i-r, r+j) = pyrSubpixelAtExOffset(nextPyramid, center, lod, pot, offset, pyrBaseSize).g);\nsum += (windowPixel(r+j, i-r) = pyrSubpixelAtExOffset(nextPyramid, center, lod, pot, offset.yx, pyrBaseSize).g);\n}\n}\nfor(j = 1; j < patchSize; j++) {\nfor(i = 1; i < patchSize; i++) {\noffset = ivec2(r+i, r+j);\nsum += (windowPixel(r+i, r+j) = pyrSubpixelAtExOffset(nextPyramid, center, lod, pot, offset, pyrBaseSize).g);\n}\n}\nint p = patchSize, w = windowSize;\nint windowArea = w * w + 2 * w * (p-1) + (p-1) * (p-1);\nwindowMean = sum / float(windowArea);\n}\nvoid readPatch(vec2 center, float lod)\n{\nivec2 pyrBaseSize = textureSize(prevPyramid, 0);\nfloat pot = exp2(lod);\nfloat sum = 0.0f;\nint r = patchSize / 2;\nivec2 offset;\nfor(int j = 0; j < patchSize; j++) {\nfor(int i = 0; i < patchSize; i++) {\noffset = ivec2(i-r, j-r);\nsum += (patchPixel(i, j) = pyrSubpixelAtExOffset(prevPyramid, center, lod, pot, offset, pyrBaseSize).g);\n}\n}\nint patchArea = patchSize * patchSize;\npatchMean = sum / float(patchArea);\n}\nvec4 encodeFlow(vec2 flow)\n{\nreturn vec4(encodeFloat16(flow.x), encodeFloat16(flow.y));\n}\nvec2 decodeFlow(vec4 pix)\n{\nreturn vec2(decodeFloat16(pix.rg), decodeFloat16(pix.ba));\n}\n#define encodeInvalidFlow() (vec4(1.0f))\nfloat computeNCC(ivec2 offset)\n{\nint r = windowRadius();\nint x = clamp(offset.x, -r, r), y = clamp(offset.y, -r, r);\n#if 1\nfloat win = 0.0f, tpl = 0.0f;\nfloat covar = 0.0f, winvar = 0.0f, tplvar = 0.0f;\nfor(int i = 0; i < patchSize; i++) {\nfor(int j = 0; j < patchSize; j++) {\nwin = windowPixel(x+i, y+j) - windowMean;\ntpl = patchPixel(i, j) - patchMean;\ncovar += win * tpl;\nwinvar += win * win;\ntplvar += tpl * tpl;\n}\n}\nreturn covar / sqrt(winvar * tplvar);\n#else\nint covar = 0, winvar = 0, tplvar = 0;\nint wmean = int(round(255.0f * windowMean)), pmean = int(round(255.0f * patchMean));\nfor(int i = 0; i < patchSize; i++) {\nfor(int j = 0; j < patchSize; j++) {\nint win = int(255.0f * windowPixel(x+i, y+j)) - wmean;\nint tpl = int(255.0f * patchPixel(i, j)) - pmean;\ncovar += win * tpl;\nwinvar += win * win;\ntplvar += tpl * tpl;\n}\n}\nreturn (float(covar) / 65025.0f) / sqrt((float(winvar) / 65025.0f) * (float(tplvar) / 65025.0f));\n#endif\n}\nvec2 refineSubpixel(ivec2 flow)\n{\nfloat q1 = computeNCC(flow + ivec2(-1,-1));\nfloat q2 = computeNCC(flow + ivec2( 0,-1));\nfloat q3 = computeNCC(flow + ivec2( 1,-1));\nfloat q4 = computeNCC(flow + ivec2(-1, 0));\nfloat q5 = computeNCC(flow + ivec2( 0, 0));\nfloat q6 = computeNCC(flow + ivec2( 1, 0));\nfloat q7 = computeNCC(flow + ivec2(-1, 1));\nfloat q8 = computeNCC(flow + ivec2( 0, 1));\nfloat q9 = computeNCC(flow + ivec2( 1, 1));\nfloat a = (q1 - 2.0f * q2 + q3 + q4 - 2.0f * q5 + q6 + q7 - 2.0f * q8 + q9) / 6.0f;\nfloat b = (q1 - q3 - q7 + q9) / 4.0f;\nfloat c = (q1 + q2 + q3 - 2.0f * q4 - 2.0f * q5 - 2.0f * q6 + q7 + q8 + q9) / 6.0f;\nfloat d = (-q1 + q3 - q4 + q6 - q7 + q9) / 6.0f;\nfloat e = (-q1 - q2 - q3 + q7 + q8 + q9) / 6.0f;\nfloat hdet = 4.0f * a * c - b * b;\nbool hasMax = hdet > 0.0f && a < 0.0f;\nfloat det = hdet;\nvec2 pixelFlow = vec2(flow);\nvec2 subpixelFlow = hasMax ? vec2(b * e - 2.0f * c * d, b * d - 2.0f * a * e) / det : pixelFlow;\nreturn subpixelFlow;\nreturn distance(subpixelFlow, pixelFlow) < 2.0f ? subpixelFlow : pixelFlow;\n}\nvoid main()\n{\nvec4 pixel = threadPixel(encodedFlow);\nivec2 thread = threadLocation();\nint keypointIndex = thread.x + thread.y * outputSize().x;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);\nKeypoint keypoint = decodeKeypoint(prevKeypoints, encoderLength, address);\ncolor = encodeFlow(vec2(0.0f));\nif(isBadKeypoint(keypoint))\nreturn;\nconst int MAX_LOD = 1;\nvec2 flow = level < MAX_LOD ? decodeFlow(pixel) : vec2(0.0f);\nflow *= 2.0f;\nfloat lod = float(level);\nreadWindow(keypoint.position + flow, lod);\nreadPatch(keypoint.position + flow, lod);\nivec2 bestOffset = ivec2(0), currOffset;\nfloat bestNCC = -2.0f, currNCC;\nint r = windowRadius();\nfor(int j = 0; j < windowSize; j++) {\nfor(int i = 0; i < windowSize; i++) {\ncurrOffset = ivec2(i-r, j-r);\ncurrNCC = computeNCC(currOffset);\nif(currNCC > bestNCC) {\nbestNCC = currNCC;\nbestOffset = currOffset;\n}\n}\n}\nflow += refineSubpixel(bestOffset);\ncolor = bestNCC >= 0.3f ? encodeFlow(flow) : encodeInvalidFlow();\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/nonmax-suppression.glsl":
/*!***********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/nonmax-suppression.glsl ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"pyramids.glsl\"\n@include \"float16.glsl\"\nuniform sampler2D image;\nuniform float lodStep;\n#if !defined(MULTISCALE)\n#error Must define MULTISCALE\n#elif MULTISCALE != 0\n#define LOD_STEP (lodStep)\n#define USE_MIDDLE_RING\n#else\n#define LOD_STEP (0.0f)\n#endif\n#define PIX(x,y) pixelAtShortOffset(image, ivec2((x),(y)))\n#define L2(v,i) bvec2(isSameEncodedLod(v[i].a, alphaMinus), isSameEncodedLod(v[i].a, alphaPlus))\n#define L3(v,i) bvec3(isSameEncodedLod(v[i].a, alpha), isSameEncodedLod(v[i].a, alphaMinus), isSameEncodedLod(v[i].a, alphaPlus))\n#define S3(v,i) decodeFloat16(v[i].rb) * float(any(L3(v,i)))\n#define S2(v,i) decodeFloat16(v[i].rb) * float(any(L2(v,i)))\n#define P(i) S3(p,i)\n#define Q(i) S2(q,i)\n#define R(i) S2(r,i)\nconst vec4 O = vec4(0.0f);\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nfloat lod = decodeLod(pixel.a);\nfloat score = decodeFloat16(pixel.rb);\ncolor = pixel;\nif(score == 0.0f)\nreturn;\nvec4 p[8] = vec4[8](\nPIX(0,1), PIX(1,1), PIX(1,0), PIX(1,-1),\nPIX(0,-1), PIX(-1,-1), PIX(-1,0), PIX(-1,1)\n);\n#ifdef USE_MIDDLE_RING\nvec4 q[16] = vec4[16](\nPIX(0,2), PIX(1,2), PIX(2,2), PIX(2,1),\nPIX(2,0), PIX(2,-1), PIX(2,-2), PIX(1,-2),\nPIX(0,-2), PIX(-1,-2), PIX(-2,-2), PIX(-2,-1),\nPIX(-2,0), PIX(-2,1), PIX(-2,2), PIX(-1,2)\n);\n#else\nvec4 q[16] = vec4[16](O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O);\n#endif\n#ifdef USE_OUTER_RING\nvec4 r[16] = vec4[16](\nPIX(0,3), PIX(1,3), PIX(3,1), PIX(3,0),\nPIX(3,-1), PIX(1,-3), PIX(0,-3), PIX(-1,-3),\nPIX(-3,-1), PIX(-3,0), PIX(-3,1), PIX(-1,3),\nPIX(0,4), PIX(4,0), PIX(0,-4), PIX(-4,0)\n);\n#else\nvec4 r[16] = vec4[16](O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O);\n#endif\nfloat alphaPlus = encodeLod(lod + LOD_STEP);\nfloat alphaMinus = encodeLod(lod - LOD_STEP);\nfloat alpha = encodeLod(lod);\nmat3 innerScore = mat3(\nP(0), P(1), P(2), P(3),\nP(4), P(5), P(6), P(7),\n0.0f);\nmat4 middleScore = mat4(\nQ(0), Q(1), Q(2), Q(3),\nQ(4), Q(5), Q(6), Q(7),\nQ(8), Q(9), Q(10), Q(11),\nQ(12), Q(13), Q(14), Q(15)\n);\nmat4 outerScore = mat4(\nR(0), R(1), R(2), R(3),\nR(4), R(5), R(6), R(7),\nR(8), R(9), R(10), R(11),\nR(12), R(13), R(14), R(15)\n);\nvec3 maxInnerScore3 = max(innerScore[0], max(innerScore[1], innerScore[2]));\nvec4 maxMiddleScore4 = max(max(middleScore[0], middleScore[1]), max(middleScore[2], middleScore[3]));\nvec4 maxOuterScore4 = max(max(outerScore[0], outerScore[1]), max(outerScore[2], outerScore[3]));\nfloat maxInnerScore = max(maxInnerScore3.x, max(maxInnerScore3.y, maxInnerScore3.z));\nfloat maxMiddleScore = max(max(maxMiddleScore4.x, maxMiddleScore4.y), max(maxMiddleScore4.z, maxMiddleScore4.w));\nfloat maxOuterScore = max(max(maxOuterScore4.x, maxOuterScore4.y), max(maxOuterScore4.z, maxOuterScore4.w));\nfloat maxScore = max(maxInnerScore, max(maxMiddleScore, maxOuterScore));\nfloat finalScore = step(maxScore, score) * score;\ncolor.rb = encodeFloat16(finalScore);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/orb-descriptor.glsl":
/*!*******************************************************!*\
  !*** ./src/gpu/shaders/keypoints/orb-descriptor.glsl ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D encodedCorners;\nuniform int encoderLength;\nuniform sampler2D pyramid;\nuniform int extraSize;\nconst int descriptorSize = 32;\n#define P(a,b,c,d) ivec4((a),(b),(c),(d))\nconst ivec4 pat31[256] = ivec4[256](\nP(8,-3,9,5),\nP(4,2,7,-12),\nP(-11,9,-8,2),\nP(7,-12,12,-13),\nP(2,-13,2,12),\nP(1,-7,1,6),\nP(-2,-10,-2,-4),\nP(-13,-13,-11,-8),\nP(-13,-3,-12,-9),\nP(10,4,11,9),\nP(-13,-8,-8,-9),\nP(-11,7,-9,12),\nP(7,7,12,6),\nP(-4,-5,-3,0),\nP(-13,2,-12,-3),\nP(-9,0,-7,5),\nP(12,-6,12,-1),\nP(-3,6,-2,12),\nP(-6,-13,-4,-8),\nP(11,-13,12,-8),\nP(4,7,5,1),\nP(5,-3,10,-3),\nP(3,-7,6,12),\nP(-8,-7,-6,-2),\nP(-2,11,-1,-10),\nP(-13,12,-8,10),\nP(-7,3,-5,-3),\nP(-4,2,-3,7),\nP(-10,-12,-6,11),\nP(5,-12,6,-7),\nP(5,-6,7,-1),\nP(1,0,4,-5),\nP(9,11,11,-13),\nP(4,7,4,12),\nP(2,-1,4,4),\nP(-4,-12,-2,7),\nP(-8,-5,-7,-10),\nP(4,11,9,12),\nP(0,-8,1,-13),\nP(-13,-2,-8,2),\nP(-3,-2,-2,3),\nP(-6,9,-4,-9),\nP(8,12,10,7),\nP(0,9,1,3),\nP(7,-5,11,-10),\nP(-13,-6,-11,0),\nP(10,7,12,1),\nP(-6,-3,-6,12),\nP(10,-9,12,-4),\nP(-13,8,-8,-12),\nP(-13,0,-8,-4),\nP(3,3,7,8),\nP(5,7,10,-7),\nP(-1,7,1,-12),\nP(3,-10,5,6),\nP(2,-4,3,-10),\nP(-13,0,-13,5),\nP(-13,-7,-12,12),\nP(-13,3,-11,8),\nP(-7,12,-4,7),\nP(6,-10,12,8),\nP(-9,-1,-7,-6),\nP(-2,-5,0,12),\nP(-12,5,-7,5),\nP(3,-10,8,-13),\nP(-7,-7,-4,5),\nP(-3,-2,-1,-7),\nP(2,9,5,-11),\nP(-11,-13,-5,-13),\nP(-1,6,0,-1),\nP(5,-3,5,2),\nP(-4,-13,-4,12),\nP(-9,-6,-9,6),\nP(-12,-10,-8,-4),\nP(10,2,12,-3),\nP(7,12,12,12),\nP(-7,-13,-6,5),\nP(-4,9,-3,4),\nP(7,-1,12,2),\nP(-7,6,-5,1),\nP(-13,11,-12,5),\nP(-3,7,-2,-6),\nP(7,-8,12,-7),\nP(-13,-7,-11,-12),\nP(1,-3,12,12),\nP(2,-6,3,0),\nP(-4,3,-2,-13),\nP(-1,-13,1,9),\nP(7,1,8,-6),\nP(1,-1,3,12),\nP(9,1,12,6),\nP(-1,-9,-1,3),\nP(-13,-13,-10,5),\nP(7,7,10,12),\nP(12,-5,12,9),\nP(6,3,7,11),\nP(5,-13,6,10),\nP(2,-12,2,3),\nP(3,8,4,-6),\nP(2,6,12,-13),\nP(9,-12,10,3),\nP(-8,4,-7,9),\nP(-11,12,-4,-6),\nP(1,12,2,-8),\nP(6,-9,7,-4),\nP(2,3,3,-2),\nP(6,3,11,0),\nP(3,-3,8,-8),\nP(7,8,9,3),\nP(-11,-5,-6,-4),\nP(-10,11,-5,10),\nP(-5,-8,-3,12),\nP(-10,5,-9,0),\nP(8,-1,12,-6),\nP(4,-6,6,-11),\nP(-10,12,-8,7),\nP(4,-2,6,7),\nP(-2,0,-2,12),\nP(-5,-8,-5,2),\nP(7,-6,10,12),\nP(-9,-13,-8,-8),\nP(-5,-13,-5,-2),\nP(8,-8,9,-13),\nP(-9,-11,-9,0),\nP(1,-8,1,-2),\nP(7,-4,9,1),\nP(-2,1,-1,-4),\nP(11,-6,12,-11),\nP(-12,-9,-6,4),\nP(3,7,7,12),\nP(5,5,10,8),\nP(0,-4,2,8),\nP(-9,12,-5,-13),\nP(0,7,2,12),\nP(-1,2,1,7),\nP(5,11,7,-9),\nP(3,5,6,-8),\nP(-13,-4,-8,9),\nP(-5,9,-3,-3),\nP(-4,-7,-3,-12),\nP(6,5,8,0),\nP(-7,6,-6,12),\nP(-13,6,-5,-2),\nP(1,-10,3,10),\nP(4,1,8,-4),\nP(-2,-2,2,-13),\nP(2,-12,12,12),\nP(-2,-13,0,-6),\nP(4,1,9,3),\nP(-6,-10,-3,-5),\nP(-3,-13,-1,1),\nP(7,5,12,-11),\nP(4,-2,5,-7),\nP(-13,9,-9,-5),\nP(7,1,8,6),\nP(7,-8,7,6),\nP(-7,-4,-7,1),\nP(-8,11,-7,-8),\nP(-13,6,-12,-8),\nP(2,4,3,9),\nP(10,-5,12,3),\nP(-6,-5,-6,7),\nP(8,-3,9,-8),\nP(2,-12,2,8),\nP(-11,-2,-10,3),\nP(-12,-13,-7,-9),\nP(-11,0,-10,-5),\nP(5,-3,11,8),\nP(-2,-13,-1,12),\nP(-1,-8,0,9),\nP(-13,-11,-12,-5),\nP(-10,-2,-10,11),\nP(-3,9,-2,-13),\nP(2,-3,3,2),\nP(-9,-13,-4,0),\nP(-4,6,-3,-10),\nP(-4,12,-2,-7),\nP(-6,-11,-4,9),\nP(6,-3,6,11),\nP(-13,11,-5,5),\nP(11,11,12,6),\nP(7,-5,12,-2),\nP(-1,12,0,7),\nP(-4,-8,-3,-2),\nP(-7,1,-6,7),\nP(-13,-12,-8,-13),\nP(-7,-2,-6,-8),\nP(-8,5,-6,-9),\nP(-5,-1,-4,5),\nP(-13,7,-8,10),\nP(1,5,5,-13),\nP(1,0,10,-13),\nP(9,12,10,-1),\nP(5,-8,10,-9),\nP(-1,11,1,-13),\nP(-9,-3,-6,2),\nP(-1,-10,1,12),\nP(-13,1,-8,-10),\nP(8,-11,10,-6),\nP(2,-13,3,-6),\nP(7,-13,12,-9),\nP(-10,-10,-5,-7),\nP(-10,-8,-8,-13),\nP(4,-6,8,5),\nP(3,12,8,-13),\nP(-4,2,-3,-3),\nP(5,-13,10,-12),\nP(4,-13,5,-1),\nP(-9,9,-4,3),\nP(0,3,3,-9),\nP(-12,1,-6,1),\nP(3,2,4,-8),\nP(-10,-10,-10,9),\nP(8,-13,12,12),\nP(-8,-12,-6,-5),\nP(2,2,3,7),\nP(10,6,11,-8),\nP(6,8,8,-12),\nP(-7,10,-6,5),\nP(-3,-9,-3,9),\nP(-1,-13,-1,5),\nP(-3,-7,-3,4),\nP(-8,-2,-8,3),\nP(4,2,12,12),\nP(2,-5,3,11),\nP(6,-9,11,-13),\nP(3,-1,7,12),\nP(11,-1,12,4),\nP(-3,0,-3,6),\nP(4,-11,4,12),\nP(2,-4,2,1),\nP(-10,-6,-8,1),\nP(-13,7,-11,1),\nP(-13,12,-11,-13),\nP(6,0,11,-13),\nP(0,-1,1,4),\nP(-13,3,-9,-2),\nP(-9,8,-6,-3),\nP(-13,-6,-8,-2),\nP(5,-9,8,10),\nP(2,7,3,-9),\nP(-1,-6,-1,-1),\nP(9,5,11,-2),\nP(11,-3,12,-8),\nP(3,0,3,5),\nP(-1,4,0,10),\nP(3,-6,4,5),\nP(-13,0,-10,5),\nP(5,8,12,11),\nP(8,9,9,-6),\nP(7,-4,8,-12),\nP(-10,4,-10,9),\nP(7,3,12,4),\nP(9,-7,10,-2),\nP(7,0,12,-2),\nP(-1,-6,0,-11)\n);\nvoid getPair(int index, mat2 rot, out vec2 p, out vec2 q)\n{\nivec4 data = pat31[index];\nvec2 op = vec2(data.xy);\nvec2 oq = vec2(data.zw);\np = rot * op;\nq = rot * oq;\n}\nvoid main()\n{\nvec4 pixel = threadPixel(encodedCorners);\nivec2 thread = threadLocation();\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint descriptorCell = address.offset - sizeofEncodedKeypoint(0, extraSize) / 4;\ncolor = pixel;\nif(descriptorCell < 0)\nreturn;\nKeypoint keypoint = decodeKeypoint(encodedCorners, encoderLength, address);\nif(isBadKeypoint(keypoint))\nreturn;\nfloat degreesOrientation = round(360.0f + degrees(keypoint.orientation));\nfloat orientation = radians(degreesOrientation - mod(degreesOrientation, 12.0f));\nfloat kcos = cos(orientation);\nfloat ksin = sin(orientation);\nmat2 rot = mat2(kcos, ksin, -ksin, kcos);\nfloat pot = exp2(keypoint.lod);\nvec2 imageSize = vec2(textureSize(pyramid, 0));\nint patternStart = 32 * descriptorCell;\nuint test[4] = uint[4](0u, 0u, 0u, 0u);\nfor(int t = 0; t < 4; t++) {\nuint bits = 0u;\nvec2 p, q;\nvec4 a, b;\nint i = t * 8;\n@unroll\nfor(int j = 0; j < 8; j++) {\ngetPair(patternStart + i + j, rot, p, q);\na = pyrPixelAtEx(pyramid, round(keypoint.position + pot * p), keypoint.lod, imageSize);\nb = pyrPixelAtEx(pyramid, round(keypoint.position + pot * q), keypoint.lod, imageSize);\nbits |= uint(a.g < b.g) << j;\n}\ntest[t] = bits;\n}\ncolor = vec4(test[0], test[1], test[2], test[3]) / 255.0f;\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/orb-orientation.glsl":
/*!********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/orb-orientation.glsl ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D pyramid;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#define P(x,y) ivec2((x),(y))\nconst int diskPointCount[16] = int[16](0, 4, 12, 28, 48, 80, 112, 148, 196, 252, 316, 376, 440, 528, 612, 708);\nconst ivec2 diskPoint[708] = ivec2[708](\nP(0,-1),P(-1,0),P(1,0),P(0,1),\nP(-1,-1),P(1,-1),P(-1,1),P(1,1),P(0,-2),P(-2,0),P(2,0),P(0,2),\nP(-1,-2),P(1,-2),P(-2,-1),P(2,-1),P(-2,1),P(2,1),P(-1,2),P(1,2),P(-2,-2),P(2,-2),P(-2,2),P(2,2),P(0,-3),P(-3,0),P(3,0),P(0,3),\nP(-1,-3),P(1,-3),P(-3,-1),P(3,-1),P(-3,1),P(3,1),P(-1,3),P(1,3),P(-2,-3),P(2,-3),P(-3,-2),P(3,-2),P(-3,2),P(3,2),P(-2,3),P(2,3),P(0,-4),P(-4,0),P(4,0),P(0,4),\nP(-1,-4),P(1,-4),P(-4,-1),P(4,-1),P(-4,1),P(4,1),P(-1,4),P(1,4),P(-3,-3),P(3,-3),P(-3,3),P(3,3),P(-2,-4),P(2,-4),P(-4,-2),P(4,-2),P(-4,2),P(4,2),P(-2,4),P(2,4),P(0,-5),P(-3,-4),P(3,-4),P(-4,-3),P(4,-3),P(-5,0),P(5,0),P(-4,3),P(4,3),P(-3,4),P(3,4),P(0,5),\nP(-1,-5),P(1,-5),P(-5,-1),P(5,-1),P(-5,1),P(5,1),P(-1,5),P(1,5),P(-2,-5),P(2,-5),P(-5,-2),P(5,-2),P(-5,2),P(5,2),P(-2,5),P(2,5),P(-4,-4),P(4,-4),P(-4,4),P(4,4),P(-3,-5),P(3,-5),P(-5,-3),P(5,-3),P(-5,3),P(5,3),P(-3,5),P(3,5),P(0,-6),P(-6,0),P(6,0),P(0,6),\nP(-1,-6),P(1,-6),P(-6,-1),P(6,-1),P(-6,1),P(6,1),P(-1,6),P(1,6),P(-2,-6),P(2,-6),P(-6,-2),P(6,-2),P(-6,2),P(6,2),P(-2,6),P(2,6),P(-4,-5),P(4,-5),P(-5,-4),P(5,-4),P(-5,4),P(5,4),P(-4,5),P(4,5),P(-3,-6),P(3,-6),P(-6,-3),P(6,-3),P(-6,3),P(6,3),P(-3,6),P(3,6),P(0,-7),P(-7,0),P(7,0),P(0,7),\nP(-1,-7),P(1,-7),P(-5,-5),P(5,-5),P(-7,-1),P(7,-1),P(-7,1),P(7,1),P(-5,5),P(5,5),P(-1,7),P(1,7),P(-4,-6),P(4,-6),P(-6,-4),P(6,-4),P(-6,4),P(6,4),P(-4,6),P(4,6),P(-2,-7),P(2,-7),P(-7,-2),P(7,-2),P(-7,2),P(7,2),P(-2,7),P(2,7),P(-3,-7),P(3,-7),P(-7,-3),P(7,-3),P(-7,3),P(7,3),P(-3,7),P(3,7),P(-5,-6),P(5,-6),P(-6,-5),P(6,-5),P(-6,5),P(6,5),P(-5,6),P(5,6),P(0,-8),P(-8,0),P(8,0),P(0,8),\nP(-1,-8),P(1,-8),P(-4,-7),P(4,-7),P(-7,-4),P(7,-4),P(-8,-1),P(8,-1),P(-8,1),P(8,1),P(-7,4),P(7,4),P(-4,7),P(4,7),P(-1,8),P(1,8),P(-2,-8),P(2,-8),P(-8,-2),P(8,-2),P(-8,2),P(8,2),P(-2,8),P(2,8),P(-6,-6),P(6,-6),P(-6,6),P(6,6),P(-3,-8),P(3,-8),P(-8,-3),P(8,-3),P(-8,3),P(8,3),P(-3,8),P(3,8),P(-5,-7),P(5,-7),P(-7,-5),P(7,-5),P(-7,5),P(7,5),P(-5,7),P(5,7),P(-4,-8),P(4,-8),P(-8,-4),P(8,-4),P(-8,4),P(8,4),P(-4,8),P(4,8),P(0,-9),P(-9,0),P(9,0),P(0,9),\nP(-1,-9),P(1,-9),P(-9,-1),P(9,-1),P(-9,1),P(9,1),P(-1,9),P(1,9),P(-2,-9),P(2,-9),P(-6,-7),P(6,-7),P(-7,-6),P(7,-6),P(-9,-2),P(9,-2),P(-9,2),P(9,2),P(-7,6),P(7,6),P(-6,7),P(6,7),P(-2,9),P(2,9),P(-5,-8),P(5,-8),P(-8,-5),P(8,-5),P(-8,5),P(8,5),P(-5,8),P(5,8),P(-3,-9),P(3,-9),P(-9,-3),P(9,-3),P(-9,3),P(9,3),P(-3,9),P(3,9),P(-4,-9),P(4,-9),P(-9,-4),P(9,-4),P(-9,4),P(9,4),P(-4,9),P(4,9),P(-7,-7),P(7,-7),P(-7,7),P(7,7),P(0,-10),P(-6,-8),P(6,-8),P(-8,-6),P(8,-6),P(-10,0),P(10,0),P(-8,6),P(8,6),P(-6,8),P(6,8),P(0,10),\nP(-1,-10),P(1,-10),P(-10,-1),P(10,-1),P(-10,1),P(10,1),P(-1,10),P(1,10),P(-2,-10),P(2,-10),P(-10,-2),P(10,-2),P(-10,2),P(10,2),P(-2,10),P(2,10),P(-5,-9),P(5,-9),P(-9,-5),P(9,-5),P(-9,5),P(9,5),P(-5,9),P(5,9),P(-3,-10),P(3,-10),P(-10,-3),P(10,-3),P(-10,3),P(10,3),P(-3,10),P(3,10),P(-7,-8),P(7,-8),P(-8,-7),P(8,-7),P(-8,7),P(8,7),P(-7,8),P(7,8),P(-4,-10),P(4,-10),P(-10,-4),P(10,-4),P(-10,4),P(10,4),P(-4,10),P(4,10),P(-6,-9),P(6,-9),P(-9,-6),P(9,-6),P(-9,6),P(9,6),P(-6,9),P(6,9),P(0,-11),P(-11,0),P(11,0),P(0,11),\nP(-1,-11),P(1,-11),P(-11,-1),P(11,-1),P(-11,1),P(11,1),P(-1,11),P(1,11),P(-2,-11),P(2,-11),P(-5,-10),P(5,-10),P(-10,-5),P(10,-5),P(-11,-2),P(11,-2),P(-11,2),P(11,2),P(-10,5),P(10,5),P(-5,10),P(5,10),P(-2,11),P(2,11),P(-8,-8),P(8,-8),P(-8,8),P(8,8),P(-3,-11),P(3,-11),P(-7,-9),P(7,-9),P(-9,-7),P(9,-7),P(-11,-3),P(11,-3),P(-11,3),P(11,3),P(-9,7),P(9,7),P(-7,9),P(7,9),P(-3,11),P(3,11),P(-6,-10),P(6,-10),P(-10,-6),P(10,-6),P(-10,6),P(10,6),P(-6,10),P(6,10),P(-4,-11),P(4,-11),P(-11,-4),P(11,-4),P(-11,4),P(11,4),P(-4,11),P(4,11),P(0,-12),P(-12,0),P(12,0),P(0,12),\nP(-1,-12),P(1,-12),P(-8,-9),P(8,-9),P(-9,-8),P(9,-8),P(-12,-1),P(12,-1),P(-12,1),P(12,1),P(-9,8),P(9,8),P(-8,9),P(8,9),P(-1,12),P(1,12),P(-5,-11),P(5,-11),P(-11,-5),P(11,-5),P(-11,5),P(11,5),P(-5,11),P(5,11),P(-2,-12),P(2,-12),P(-12,-2),P(12,-2),P(-12,2),P(12,2),P(-2,12),P(2,12),P(-7,-10),P(7,-10),P(-10,-7),P(10,-7),P(-10,7),P(10,7),P(-7,10),P(7,10),P(-3,-12),P(3,-12),P(-12,-3),P(12,-3),P(-12,3),P(12,3),P(-3,12),P(3,12),P(-6,-11),P(6,-11),P(-11,-6),P(11,-6),P(-11,6),P(11,6),P(-6,11),P(6,11),P(-4,-12),P(4,-12),P(-12,-4),P(12,-4),P(-12,4),P(12,4),P(-4,12),P(4,12),P(-9,-9),P(9,-9),P(-9,9),P(9,9),P(-8,-10),P(8,-10),P(-10,-8),P(10,-8),P(-10,8),P(10,8),P(-8,10),P(8,10),P(0,-13),P(-5,-12),P(5,-12),P(-12,-5),P(12,-5),P(-13,0),P(13,0),P(-12,5),P(12,5),P(-5,12),P(5,12),P(0,13),\nP(-1,-13),P(1,-13),P(-7,-11),P(7,-11),P(-11,-7),P(11,-7),P(-13,-1),P(13,-1),P(-13,1),P(13,1),P(-11,7),P(11,7),P(-7,11),P(7,11),P(-1,13),P(1,13),P(-2,-13),P(2,-13),P(-13,-2),P(13,-2),P(-13,2),P(13,2),P(-2,13),P(2,13),P(-3,-13),P(3,-13),P(-13,-3),P(13,-3),P(-13,3),P(13,3),P(-3,13),P(3,13),P(-6,-12),P(6,-12),P(-12,-6),P(12,-6),P(-12,6),P(12,6),P(-6,12),P(6,12),P(-9,-10),P(9,-10),P(-10,-9),P(10,-9),P(-10,9),P(10,9),P(-9,10),P(9,10),P(-4,-13),P(4,-13),P(-8,-11),P(8,-11),P(-11,-8),P(11,-8),P(-13,-4),P(13,-4),P(-13,4),P(13,4),P(-11,8),P(11,8),P(-8,11),P(8,11),P(-4,13),P(4,13),P(-7,-12),P(7,-12),P(-12,-7),P(12,-7),P(-12,7),P(12,7),P(-7,12),P(7,12),P(-5,-13),P(5,-13),P(-13,-5),P(13,-5),P(-13,5),P(13,5),P(-5,13),P(5,13),P(0,-14),P(-14,0),P(14,0),P(0,14),\nP(-1,-14),P(1,-14),P(-14,-1),P(14,-1),P(-14,1),P(14,1),P(-1,14),P(1,14),P(-2,-14),P(2,-14),P(-10,-10),P(10,-10),P(-14,-2),P(14,-2),P(-14,2),P(14,2),P(-10,10),P(10,10),P(-2,14),P(2,14),P(-9,-11),P(9,-11),P(-11,-9),P(11,-9),P(-11,9),P(11,9),P(-9,11),P(9,11),P(-3,-14),P(3,-14),P(-6,-13),P(6,-13),P(-13,-6),P(13,-6),P(-14,-3),P(14,-3),P(-14,3),P(14,3),P(-13,6),P(13,6),P(-6,13),P(6,13),P(-3,14),P(3,14),P(-8,-12),P(8,-12),P(-12,-8),P(12,-8),P(-12,8),P(12,8),P(-8,12),P(8,12),P(-4,-14),P(4,-14),P(-14,-4),P(14,-4),P(-14,4),P(14,4),P(-4,14),P(4,14),P(-7,-13),P(7,-13),P(-13,-7),P(13,-7),P(-13,7),P(13,7),P(-7,13),P(7,13),P(-5,-14),P(5,-14),P(-10,-11),P(10,-11),P(-11,-10),P(11,-10),P(-14,-5),P(14,-5),P(-14,5),P(14,5),P(-11,10),P(11,10),P(-10,11),P(10,11),P(-5,14),P(5,14),P(0,-15),P(-9,-12),P(9,-12),P(-12,-9),P(12,-9),P(-15,0),P(15,0),P(-12,9),P(12,9),P(-9,12),P(9,12),P(0,15)\n);\nconst int DEFAULT_PATCH_RADIUS = 15;\nconst int MIN_PATCH_RADIUS = 2;\nvoid main()\n{\nvec4 pixel = threadPixel(encodedKeypoints);\nivec2 thread = threadLocation();\nint keypointIndex = thread.x + thread.y * outputSize().x;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);\nvec2 m = vec2(0.0f);\nfloat pot = exp2(keypoint.lod);\nivec2 pyrBaseSize = textureSize(pyramid, 0);\nint scaledRadius = int(ceil(float(DEFAULT_PATCH_RADIUS) / pot));\nint radius = max(scaledRadius, MIN_PATCH_RADIUS);\nint count = diskPointCount[radius];\nfor(int j = 0; j < count; j++) {\nvec2 offset = vec2(diskPoint[j]);\nvec2 position = keypoint.position + round(pot * offset);\nvec4 patchPixel = pyrPixelAtEx(pyramid, position, keypoint.lod, pyrBaseSize);\nm += offset * patchPixel.g;\n}\nfloat angle = fastAtan2(m.y, m.x);\nfloat encodedOrientation = encodeKeypointOrientation(angle);\ncolor = vec4(0.0f, encodedOrientation, 0.0f, 0.0f);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/score-findmax.glsl":
/*!******************************************************!*\
  !*** ./src/gpu/shaders/keypoints/score-findmax.glsl ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"float16.glsl\"\nuniform sampler2D corners;\nuniform int iterationNumber;\nvoid main()\n{\nivec2 thread = threadLocation();\nivec2 bounds = outputSize();\nint jump = (1 << iterationNumber);\nint clusterLength = jump << 1;\nint clusterMask = clusterLength - 1;\nivec2 clusterPos = ivec2(thread >> (1 + iterationNumber)) << (1 + iterationNumber);\nivec2 next1 = clusterPos + ((thread - clusterPos + ivec2(jump, 0)) & clusterMask);\nivec2 next2 = clusterPos + ((thread - clusterPos + ivec2(0, jump)) & clusterMask);\nivec2 next3 = clusterPos + ((thread - clusterPos + ivec2(jump, jump)) & clusterMask);\nvec4 p0 = texelFetch(corners, thread, 0);\nvec4 p1 = texelFetch(corners, next1 % bounds, 0);\nvec4 p2 = texelFetch(corners, next2 % bounds, 0);\nvec4 p3 = texelFetch(corners, next3 % bounds, 0);\nfloat s0 = decodeFloat16(p0.rb);\nfloat s1 = decodeFloat16(p1.rb);\nfloat s2 = decodeFloat16(p2.rb);\nfloat s3 = decodeFloat16(p3.rb);\nbool b0 = s0 >= s1 && s0 >= s2 && s0 >= s3;\nbool b1 = s1 >= s0 && s1 >= s2 && s1 >= s3;\nbool b2 = s2 >= s0 && s2 >= s1 && s2 >= s3;\ncolor = vec4(0.0f);\ncolor.rb = b0 ? p0.rb : (\nb1 ? p1.rb : (\nb2 ? p2.rb : p3.rb\n)\n);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/sort-applyperm.glsl":
/*!*******************************************************!*\
  !*** ./src/gpu/shaders/keypoints/sort-applyperm.glsl ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D permutation;\nuniform int maxKeypoints;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nstruct PermutationElement\n{\nint keypointIndex;\nfloat score;\nbool valid;\n};\nPermutationElement decodePermutationElement(vec4 pixel)\n{\nconst vec2 ones = vec2(1.0f);\nPermutationElement element;\nelement.keypointIndex = int(pixel.r * 255.0f) | (int(pixel.g * 255.0f) << 8);\nelement.valid = !all(equal(pixel.ba, ones));\nelement.score = element.valid ? decodeFloat16(pixel.ba) : -1.0f;\nreturn element;\n}\nPermutationElement readPermutationElement(sampler2D permutation, int elementIndex, int stride, int height)\n{\nconst vec4 INVALID_PIXEL = vec4(0.0f);\nivec2 pos = ivec2(elementIndex % stride, elementIndex / stride);\nvec4 pixel = pos.y < height ? pixelAt(permutation, pos) : INVALID_PIXEL;\nreturn decodePermutationElement(pixel);\n}\nvoid main()\n{\nivec2 thread = threadLocation();\nint newEncoderLength = outputSize().x;\nKeypointAddress myAddress = findKeypointAddress(thread, newEncoderLength, descriptorSize, extraSize);\nint myKeypointIndex = findKeypointIndex(myAddress, descriptorSize, extraSize);\nivec2 psize = textureSize(permutation, 0);\nPermutationElement element = readPermutationElement(permutation, myKeypointIndex, psize.x, psize.y);\nint oldEncoderLength = textureSize(encodedKeypoints, 0).x;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = KeypointAddress(element.keypointIndex * pixelsPerKeypoint, myAddress.offset);\nvec4 keypointData = readKeypointData(encodedKeypoints, oldEncoderLength, address);\ncolor = myKeypointIndex < maxKeypoints && element.valid ? keypointData : encodeNullKeypoint();\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/sort-createperm.glsl":
/*!********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/sort-createperm.glsl ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nstruct PermutationElement\n{\nint keypointIndex;\nfloat score;\nbool valid;\n};\nvec4 encodePermutationElement(PermutationElement element)\n{\nconst vec2 ones = vec2(1.0f);\nvec2 encodedScore = element.valid ? encodeFloat16(element.score) : ones;\nvec2 encodedIndex = vec2(element.keypointIndex & 255, (element.keypointIndex >> 8) & 255) / 255.0f;\nreturn vec4(encodedIndex, encodedScore);\n}\nvoid main()\n{\nivec2 thread = threadLocation();\nint stride = outputSize().x;\nint keypointIndex = thread.y * stride + thread.x;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);\nPermutationElement element;\nelement.keypointIndex = keypointIndex;\nelement.score = keypoint.score;\nelement.valid = !isBadKeypoint(keypoint);\ncolor = encodePermutationElement(element);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/sort-mergeperm.glsl":
/*!*******************************************************!*\
  !*** ./src/gpu/shaders/keypoints/sort-mergeperm.glsl ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D permutation;\nuniform int blockSize;\nuniform int dblLog2BlockSize;\nstruct PermutationElement\n{\nint keypointIndex;\nfloat score;\nbool valid;\n};\nPermutationElement decodePermutationElement(vec4 pixel)\n{\nconst vec2 ones = vec2(1.0f);\nPermutationElement element;\nelement.keypointIndex = int(pixel.r * 255.0f) | (int(pixel.g * 255.0f) << 8);\nelement.valid = !all(equal(pixel.ba, ones));\nelement.score = element.valid ? decodeFloat16(pixel.ba) : -1.0f;\nreturn element;\n}\nvec4 encodePermutationElement(PermutationElement element)\n{\nconst vec2 ones = vec2(1.0f);\nvec2 encodedScore = element.valid ? encodeFloat16(element.score) : ones;\nvec2 encodedIndex = vec2(element.keypointIndex & 255, (element.keypointIndex >> 8) & 255) / 255.0f;\nreturn vec4(encodedIndex, encodedScore);\n}\nPermutationElement readPermutationElement(sampler2D permutation, int elementIndex, int stride, int height)\n{\nconst vec4 INVALID_PIXEL = vec4(0.0f);\nivec2 pos = ivec2(elementIndex % stride, elementIndex / stride);\nvec4 pixel = pos.y < height ? pixelAt(permutation, pos) : INVALID_PIXEL;\nreturn decodePermutationElement(pixel);\n}\nPermutationElement selectKth(int k, int la, int ra, int lb, int rb)\n{\nPermutationElement a, b;\nint ha, hb, ma, mb;\nbool discard1stHalf, altb;\nbool locked = false;\nint tmp, result = 0;\nint stride = outputSize().x;\nint height = outputSize().y;\nfor(int i = 0; i < dblLog2BlockSize; i++) {\ntmp = (lb > rb && !locked) ? (la+k) : result;\nresult = (la > ra && !locked) ? (lb+k) : tmp;\nlocked = locked || (la > ra) || (lb > rb);\nha = (ra - la + 1) / 2;\nhb = (rb - lb + 1) / 2;\nma = la + ha;\nmb = lb + hb;\na = readPermutationElement(permutation, ma, stride, height);\nb = readPermutationElement(permutation, mb, stride, height);\ndiscard1stHalf = (k > ha + hb);\naltb = (-a.score < -b.score);\nk -= int(discard1stHalf && altb) * (ha + 1);\nk -= int(discard1stHalf && !altb) * (hb + 1);\nla += int(discard1stHalf && altb) * (ma + 1 - la);\nlb += int(discard1stHalf && !altb) * (mb + 1 - lb);\nra += int(!discard1stHalf && !altb) * (ma - 1 - ra);\nrb += int(!discard1stHalf && altb) * (mb - 1 - rb);\n}\nreturn readPermutationElement(permutation, result, stride, height);\n}\nvoid main()\n{\nivec2 thread = threadLocation();\nint stride = outputSize().x;\nint elementIndex = thread.y * stride + thread.x;\nint blockIndex = elementIndex / blockSize;\nint blockOffset = elementIndex % blockSize;\nint la = blockIndex * blockSize;\nint lb = la + blockSize / 2;\nint ra = lb - 1;\nint rb = (blockIndex + 1) * blockSize - 1;\nint k = blockOffset;\nPermutationElement element = selectKth(k, la, ra, lb, rb);\ncolor = encodePermutationElement(element);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/transfer-flow.glsl":
/*!******************************************************!*\
  !*** ./src/gpu/shaders/keypoints/transfer-flow.glsl ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\n@include \"float16.glsl\"\nuniform sampler2D encodedFlow;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nvec2 decodeFlow(vec4 pix)\n{\nreturn vec2(decodeFloat16(pix.rg), decodeFloat16(pix.ba));\n}\n#define isInvalidFlow(pix) (all(equal((pix), vec4(1.0f))))\nvoid main()\n{\nvec4 pixel = threadPixel(encodedKeypoints);\nivec2 thread = threadLocation();\nKeypointAddress myAddress = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, myAddress);\nint myIndex = findKeypointIndex(myAddress, descriptorSize, extraSize);\nint len = textureSize(encodedFlow, 0).x;\nivec2 location = ivec2(myIndex % len, myIndex / len);\nvec4 targetPixel = pixelAt(encodedFlow, location);\nvec2 flow = decodeFlow(targetPixel);\nvec4 newPosition = encodeKeypointPosition(keypoint.position + flow);\nvec4 encodedPosition = isInvalidFlow(targetPixel) ? encodeKeypointPositionAtInfinity() : newPosition;\ncolor = myAddress.offset == 0 ? encodedPosition : pixel;\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/transfer-orientation.glsl":
/*!*************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/transfer-orientation.glsl ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D encodedOrientations;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nvoid main()\n{\nvec4 pixel = threadPixel(encodedKeypoints);\nivec2 thread = threadLocation();\nKeypointAddress myAddress = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint myIndex = findKeypointIndex(myAddress, descriptorSize, extraSize);\nint orientationEncoderLength = textureSize(encodedOrientations, 0).x;\nivec2 location = ivec2(myIndex % orientationEncoderLength, myIndex / orientationEncoderLength);\nvec4 targetPixel = pixelAt(encodedOrientations, location);\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, myAddress);\nbool isValid = !isBadKeypoint(keypoint);\nfloat encodedOrientation = targetPixel.g;\ncolor = isValid && myAddress.offset == 1 ? vec4(pixel.r, encodedOrientation, pixel.ba) : pixel;\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/upload-keypoints.glsl":
/*!*********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/upload-keypoints.glsl ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D encodedKeypoints;\nuniform int startIndex;\nuniform int endIndex;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#ifndef BUFFER_SIZE\n#error Undefined BUFFER_SIZE\n#endif\nlayout(std140) uniform KeypointBuffer\n{\nvec4 keypointBuffer[BUFFER_SIZE];\n};\nvoid main()\n{\nvec4 pixel = threadPixel(encodedKeypoints);\nivec2 thread = threadLocation();\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint index = findKeypointIndex(address, descriptorSize, extraSize);\ncolor = pixel;\nif(index < startIndex)\nreturn;\ncolor = encodeNullKeypoint();\nif(index >= endIndex)\nreturn;\nvec4 data = keypointBuffer[index - startIndex];\nswitch(address.offset) {\ncase 0: {\nfixed2_t pos = vec2tofix(data.xy);\nfixed2_t lo = pos & 255;\nfixed2_t hi = (pos >> 8) & 255;\ncolor = vec4(float(lo.x), float(hi.x), float(lo.y), float(hi.y)) / 255.0f;\nbreak;\n}\ncase 1: {\nvec2 score = encodeKeypointScore(max(data.w, 0.0f));\nfloat scale = encodeLod(data.z);\nfloat rotation = encodeKeypointOrientation(0.0f);\ncolor = vec4(scale, rotation, score);\nbreak;\n}\ndefault: {\ncolor = vec4(0.0f);\nbreak;\n}\n}\n}"

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

/***/ "./src/gpu/shaders/transforms/additive-mix.glsl":
/*!******************************************************!*\
  !*** ./src/gpu/shaders/transforms/additive-mix.glsl ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@include \"subpixel.glsl\"\nuniform sampler2D image0;\nuniform sampler2D image1;\nuniform float alpha;\nuniform float beta;\nuniform float gamma;\nconst vec4 BACKGROUND = vec4(0.0f);\nvoid main()\n{\nivec2 location = threadLocation();\nivec2 size0 = textureSize(image0, 0);\nivec2 size1 = textureSize(image1, 0);\nvec4 pix0 = all(lessThan(location, size0)) ? pixelAt(image0, location) : BACKGROUND;\nvec4 pix1 = all(lessThan(location, size1)) ? pixelAt(image1, location) : BACKGROUND;\nvec4 pix = clamp(alpha * pix0 + beta * pix1 + gamma, 0.0f, 1.0f);\ncolor = vec4(pix.rgb, 1.0f);\n}"

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
 * speedy-gl.js
 * A wrapper around the WebGL Rendering Context
 */






// Constants
const SINGLETON_KEY = Symbol();

//
// We use a small canvas to improve the performance
// of createImageBitmap() on Firefox.
//
// A large canvas (2048x2048) causes a FPS drop, even
// if we only extract a small region of it (this is
// unlike Chrome, which is fast).
//
// Note: we automatically increase the size of the
// canvas (as needed) when rendering to it.
//
const CANVAS_WIDTH = 16, CANVAS_HEIGHT = 16;

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
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
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
     */
    constructor()
    {
        /** @type {SpeedyGL} cached reference */
        this._speedyGL = _speedy_gl__WEBPACK_IMPORTED_MODULE_0__["SpeedyGL"].instance;

        /** @type {SpeedyProgramCenter} GPU-based programs */
        this._programs = new _speedy_program_center__WEBPACK_IMPORTED_MODULE_2__["SpeedyProgramCenter"](this);

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
        const width = texture.width;
        const height = texture.height;
        const canvas = this.canvas;

        // do we need to resize the canvas?
        if(width > canvas.width || height > canvas.height) {
            _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].warning(`Resizing the canvas to ${width} x ${height}`);
            canvas.width = width;
            canvas.height = height;
        }

        // render
        this.programs.utils.renderToCanvas.outputs(width, height, null);
        this.programs.utils.renderToCanvas(texture);

        // done!
        return canvas;
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__["Utils"].assert(!this.isReleased());

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

        this._programs = new _speedy_program_center__WEBPACK_IMPORTED_MODULE_2__["SpeedyProgramCenter"](this);
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
/* harmony import */ var _programs_filters__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./programs/filters */ "./src/gpu/programs/filters.js");
/* harmony import */ var _programs_keypoints__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./programs/keypoints */ "./src/gpu/programs/keypoints.js");
/* harmony import */ var _programs_pyramids__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./programs/pyramids */ "./src/gpu/programs/pyramids.js");
/* harmony import */ var _programs_transforms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./programs/transforms */ "./src/gpu/programs/transforms.js");
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./speedy-program-group */ "./src/gpu/speedy-program-group.js");
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
     */
    constructor(gpu)
    {
        // Note: we instantiate the program groups lazily

        /** @type {SpeedyGPU} reference to SpeedyGPU */
        this._gpu = gpu;

        /** @type {SpeedyProgramGroupFilters} image filters */
        this._filters = null;

        /** @type {SpeedyProgramGroupTransforms} geometric transformations */
        this._transforms = null;

        /** @type {SpeedyProgramGroupPyramids} pyramids & scale-space */
        this._pyramids = null;

        /** @type {SpeedyProgramGroupKeypoints} keypoint routines */
        this._keypoints = null;

        /** @type {SpeedyProgramGroupUtils} utility programs */
        this._utils = null;
    }

    /**
     * Image filters & convolutions
     * @returns {SpeedyProgramGroupFilters}
     */
    get filters()
    {
        return this._filters || (this._filters = new _programs_filters__WEBPACK_IMPORTED_MODULE_1__["SpeedyProgramGroupFilters"](this._gpu));
    }

    /**
     * Geometric transformations
     * @returns {SpeedyProgramGroupTransforms}
     */
    get transforms()
    {
        return this._transforms || (this._transforms = new _programs_transforms__WEBPACK_IMPORTED_MODULE_4__["SpeedyProgramGroupTransforms"](this._gpu));
    }

    /**
     * Image pyramids & scale-space
     * @returns {SpeedyProgramGroupPyramids}
     */
    get pyramids()
    {
        return this._pyramids || (this._pyramids = new _programs_pyramids__WEBPACK_IMPORTED_MODULE_3__["SpeedyProgramGroupPyramids"](this._gpu));
    }

    /**
     * Keypoint detection & description
     * @returns {SpeedyProgramGroupKeypoints}
     */
    get keypoints()
    {
        return this._keypoints || (this._keypoints = new _programs_keypoints__WEBPACK_IMPORTED_MODULE_2__["SpeedyProgramGroupKeypoints"](this._gpu));
    }

    /**
     * Utility programs
     * @returns {SpeedyProgramGroupUtils}
     */
    get utils()
    {
        return this._utils || (this._utils = new _programs_utils__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgramGroupUtils"](this._gpu));
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
                if(this[key] != null && (this[key] instanceof _speedy_program_group__WEBPACK_IMPORTED_MODULE_5__["SpeedyProgramGroup"]))
                    this[key].release();
            }
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




/** @type {object} Program settings generator */
const PROGRAM_HELPERS = {
    // Pingpong Rendering: the output texture of a
    // program cannot be used as an input to itself.
    // This is a convenient helper in these situations
    usesPingpongRendering() {
        return {
            pingpong: true
        };
    },

    // Render to canvas
    // Use it when we're supposed to see the texture
    rendersToCanvas() {
        return {
            renderToTexture: false
        };
    },
};


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
     */
    constructor(gpu)
    {
        /** @type {SpeedyGPU} GPU-accelerated routines */
        this._gpu = gpu;

        /** @type {SpeedyProgram[]} the list of all programs that belong to this group */
        this._programs = [];
    }

    /**
     * Declare a program
     * @protected
     * @param {string} name Program name
     * @param {ShaderDeclaration} shaderdecl Shader declaration
     * @param {object} [settings] Program settings
     * @returns {SpeedyProgramGroup} This object
     */
    declare(name, shaderdecl, settings = {})
    {
        // lazy instantiation of kernels
        Object.defineProperty(this, name, {
            get: (() => {
                const key = Symbol(name);
                return (function() {
                    return this[key] || (this[key] = this._createProgram(shaderdecl, settings));
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
        return PROGRAM_HELPERS;
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
        const program = new _speedy_program__WEBPACK_IMPORTED_MODULE_0__["SpeedyProgram"](this._gpu.gl, shaderdecl, settings);
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

        /** @type {number} width of the output */
        this._width = 1;

        /** @type {number} height of the output */
        this._height = 1;

        /** @type {SpeedyDrawableTexture[]} output texture(s) */
        this._texture = (new Array(options.pingpong ? 2 : 1)).fill(null);

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

        // select the render target
        const texture = this._texture[this._textureIndex];
        const fbo = this._renderToTexture ? texture.glFbo : null;

        // update texSize uniform (available in all fragment shaders)
        const width = this._width, height = this._height;
        const texSize = this._uniform.get('texSize');
        gl.uniform2f(texSize.location, width, height);

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

        // bind the FBO
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

        // draw call
        gl.viewport(0, 0, width, height);
        gl.drawArrays(gl.TRIANGLES, 0, 6); // mode, offset, count

        // unbind the FBO
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // unbind the VAO
        gl.bindVertexArray(null);

        // we've just changed the texture! discard the pyramid, if any
        if(texture != null)
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
     * @param  {...SpeedyDrawableTexture|null} texture output texture(s)
     * @returns {SpeedyProgram} this
     */
    outputs(width, height, ...texture)
    {
        this._setOutputTexture(...texture);
        this._setOutputSize(width, height);
        return this;
    }

    /**
     * Set the size of the output
     * @param {number} width new width, in pixels
     * @param {number} height new height, in pixels
     * @returns {SpeedyProgram} this
     */
    _setOutputSize(width, height)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(width > 0 && height > 0);

        // update output size
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
     * @param {...SpeedyDrawableTexture} texture set to null to use the internal texture(s)
     * @returns {SpeedyProgram} this
     */
    _setOutputTexture(...texture)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__["Utils"].assert(texture.length === this._texture.length, `Incorrect number of textures (expected ${this._texture.length})`);

        // update output texture(s)
        for(let i = 0; i < this._texture.length; i++)
            this._texture[i] = texture[i];
        this._textureIndex = 0;

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

        // Unlink textures
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
 * speedy-texture-pool.js
 * Texture pool
 */






// Constants
const DEFAULT_CAPACITY = 256;
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
     * @param {number} [x]
     * @param {number} [y] 
     * @param {number} [width]
     * @param {number} [height]
     * @param {boolean} [useBufferedDownloads] accelerate downloads by returning pixels from the texture of the previous call (useful for streaming)
     * @returns {SpeedyPromise<Uint8Array>} resolves to an array of pixels in the RGBA format
     */
    readPixelsAsync(texture, x = 0, y = 0, width = texture.width, height = texture.height, useBufferedDownloads = false)
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
 * Get a buffer filled with zeros
 * @param {number} size number of bytes
 * @returns {Uint8Array}
 */
/*
const zeros = (function() {
    let buffer = new Uint8Array(4);

    return function(size) {
        if(size > buffer.length)
            buffer = new Uint8Array(size);

        return buffer.subarray(0, size);
    }
})();
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
     * Resize this texture. Its content will be lost!
     * @param {number} width new width, in pixels
     * @param {number} height new height, in pixels
     * @returns {SpeedyTexture} this texture
     */
    resize(width, height)
    {
        const gl = this._gl;

        // no need to resize?
        if(this._width === width && this._height === height)
            return this;

        // validate size
        width |= 0; height |= 0;
        if(width > _utils_globals__WEBPACK_IMPORTED_MODULE_3__["MAX_TEXTURE_LENGTH"] || height > _utils_globals__WEBPACK_IMPORTED_MODULE_3__["MAX_TEXTURE_LENGTH"])
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["NotSupportedError"](`Maximum texture size exceeded. Using ${width} x ${height}, expected up to ${_utils_globals__WEBPACK_IMPORTED_MODULE_3__["MAX_TEXTURE_LENGTH"]} x ${_utils_globals__WEBPACK_IMPORTED_MODULE_3__["MAX_TEXTURE_LENGTH"]}.`);
        else if(width < 1 || height < 1)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__["IllegalArgumentError"](`Invalid texture size: ${width} x ${height}`);

        // context loss?
        if(gl.isContextLost())
            return this;

        // update dimensions
        this._width = width;
        this._height = height;

        // resize
        // Note: this is fast on Chrome, but seems slow on Firefox
        gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindTexture(gl.TEXTURE_2D, null);

        // no mipmaps
        this.discardMipmaps();

        // done!
        return this;
    }

    /**
     * Generate mipmap
     * @param {SpeedyDrawableTexture[]} [mipmap] custom texture for each mip level
     * @returns {SpeedyTexture} this
     */
    generateMipmaps(mipmap = [])
    {
        const gl = this._gl;

        // nothing to do
        if(this._hasMipmaps)
            return this;

        // let the hardware compute the all levels of the pyramid, up to 1x1
        // we also specify the TEXTURE_MIN_FILTER to be used from now on
        gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        // accept custom textures
        if(mipmap.length > 0) {
            const width = this.width, height = this.height;

            // expect number of mipmap images according to the OpenGL ES 3.0 spec (sec 3.8.10.4)
            const numMipmaps = 1 + Math.floor(Math.log2(Math.max(width, height)));
            _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(mipmap.length <= numMipmaps);

            // verify the dimensions of each level
            for(let level = 1; level < mipmap.length; level++) {
                // use max(1, floor(size / 2^lod)), in accordance to
                // the OpenGL ES 3.0 spec sec 3.8.10.4 (Mipmapping)
                const w = Math.max(1, width >>> level);
                const h = Math.max(1, height >>> level);

                // verify the dimensions of this level
                _utils_utils__WEBPACK_IMPORTED_MODULE_1__["Utils"].assert(mipmap[level].width === w && mipmap[level].height === h);

                // copy to mipmap
                mipmap[level].copyTo(this, level);
            }
        }

        // done!
        this._hasMipmaps = true;
        return this;
    }

    /**
     * Invalidates previously generated mipmap, if any
     */
    discardMipmaps()
    {
        const gl = this._gl;

        // nothing to do
        if(!this._hasMipmaps)
            return;

        // reset the min filter
        gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);

        // done!
        this._hasMipmaps = false;
    }

    /**
     * Does this texture have a mipmap?
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
     * The size of this texture, in bytes
     * @returns {number}
     */
    size()
    {
        // RGBA8: 32 bits per pixel
        return 4 * this._width * this._height;
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
     * (you may have to discard the mipmaps after calling this function)
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
    /*resize(width, height, preserveContent = false)
    {
        const gl = this._gl;

        // no need to preserve the content?
        if(!preserveContent)
            return super.resize(width, height);

        // no need to resize?
        if(this._width === width && this._height === height)
            return this;

        // validate size
        width |= 0; height |= 0;
        Utils.assert(width > 0 && height > 0);

        // context loss?
        if(gl.isContextLost())
            return this;

        // allocate new texture
        const newTexture = SpeedyTexture._createTexture(gl, width, height);

        // initialize the new texture with zeros to avoid a
        // warning when calling copyTexSubImage2D() on Firefox
        // this may not be very efficient?
        SpeedyTexture._upload(gl, newTexture, width, height, zeros(width * height * 4)); // RGBA: 4 bytes per pixel

        // copy the old texture to the new one
        const oldWidth = this._width, oldHeight = this._height;
        SpeedyDrawableTexture._copyToTexture(gl, this._glFbo, newTexture, 0, 0, Math.min(width, oldWidth), Math.min(height, oldHeight), 0);

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

        // update dimensions & discard mipmaps
        this.discardMipmaps();
        this._width = width;
        this._height = height;

        // done!
        return this;
    }
    */

    /**
     * Clear the texture
     * @returns {SpeedyDrawableTexture} this texture
     */
    clear()
    {
        //
        // When we pass null to texImage2D(), it seems that Firefox
        // doesn't clear the texture. Instead, it displays this warning:
        //
        // "WebGL warning: drawArraysInstanced:
        //  Tex image TEXTURE_2D level 0 is incurring lazy initialization."
        //
        // Here is a workaround:
        //
        return this.clearToColor(0, 0, 0, 0);
    }

    /**
     * Clear the texture to a color
     * @param {number} r red component, a value in [0,1]
     * @param {number} g green component, a value in [0,1]
     * @param {number} b blue component, a value in [0,1]
     * @param {number} a alpha component, a value in [0,1]
     * @returns {SpeedyDrawableTexture} this texture
     */
    clearToColor(r, g, b, a)
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
     * Copy data from a framebuffer to a texture
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
        //gl.activeTexture(gl.TEXTURE0);
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
 * index.js
 * The entry point of the library
 */

module.exports = __webpack_require__(/*! ./core/speedy */ "./src/core/speedy.js").Speedy;

/***/ }),

/***/ "./src/utils/errors.js":
/*!*****************************!*\
  !*** ./src/utils/errors.js ***!
  \*****************************/
/*! exports provided: SpeedyError, NotSupportedError, NotImplementedError, GLError, AbstractMethodError, IllegalArgumentError, IllegalOperationError, OutOfMemoryError, FileNotFoundError, TimeoutError, ParseError, AssertionError, AccessDeniedError, WebAssemblyError */
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebAssemblyError", function() { return WebAssemblyError; });
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

/**
 * WebAssembly error
 */
class WebAssemblyError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyError} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`WebAssembly error. ${message}`, cause);
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
/*! exports provided: PYRAMID_MAX_LEVELS, PYRAMID_MAX_SCALE, LOG2_PYRAMID_MAX_SCALE, FIX_BITS, FIX_RESOLUTION, MAX_TEXTURE_LENGTH, MIN_KEYPOINT_SIZE, MIN_ENCODER_LENGTH, MAX_ENCODER_CAPACITY, LITTLE_ENDIAN */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PYRAMID_MAX_LEVELS", function() { return PYRAMID_MAX_LEVELS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PYRAMID_MAX_SCALE", function() { return PYRAMID_MAX_SCALE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOG2_PYRAMID_MAX_SCALE", function() { return LOG2_PYRAMID_MAX_SCALE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIX_BITS", function() { return FIX_BITS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIX_RESOLUTION", function() { return FIX_RESOLUTION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAX_TEXTURE_LENGTH", function() { return MAX_TEXTURE_LENGTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MIN_KEYPOINT_SIZE", function() { return MIN_KEYPOINT_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MIN_ENCODER_LENGTH", function() { return MIN_ENCODER_LENGTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAX_ENCODER_CAPACITY", function() { return MAX_ENCODER_CAPACITY; });
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

/** @type {number} The maximum number of levels in a pyramid, considering a scale factor of 2x between levels */
const PYRAMID_MAX_LEVELS = 8; // i.e., maximum number of octaves

/** @type {number} The maximum supported scale for a pyramid level */
const PYRAMID_MAX_SCALE = 1; // preferably a power of 2 (image scale can go up to this value)

/** @type {number} The base-2 logarithm of PYRAMID_MAX_SCALE */
const LOG2_PYRAMID_MAX_SCALE = Math.log2(PYRAMID_MAX_SCALE);



// -----------------------------------------------------------------
// FIXED-POINT MATH
// -----------------------------------------------------------------

/** @type {number} How many bits do we use to store fractional data? */
const FIX_BITS = 4; // step size: 0.0625

/** @type {number} Fixed-point resolution */
const FIX_RESOLUTION = 1 << FIX_BITS; // float(2^(FIX_BITS))



// -----------------------------------------------------------------
// TEXTURE LIMITS
// -----------------------------------------------------------------

/** @type {number} Maximum texture length (width, height) */
const MAX_TEXTURE_LENGTH = (1 << (16 - FIX_BITS)) - 2; // must be 2^n - 2 due to keypoint encoding



// -----------------------------------------------------------------
// KEYPOINTS
// -----------------------------------------------------------------

/** @type {number} Size of a keypoint header, in bytes (must be divisible by 4) */
const MIN_KEYPOINT_SIZE = 8;

/** @type {number} Minimum length of a keypoint encoder, in pixels (encodes at least 1 keypoint) */
const MIN_ENCODER_LENGTH = Math.ceil(Math.sqrt(MIN_KEYPOINT_SIZE / 4)); // encodes 2, actually

/** @type {number} Maximum number of keypoints we can encode (the actual length of the encoder may vary) */
const MAX_ENCODER_CAPACITY = 8192;



// -----------------------------------------------------------------
// MISC
// -----------------------------------------------------------------

/** @type {boolean} Are we in a little-endian machine? */
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
     * @param {...any} [args] optional arguments to be passed to fn
     */
    static setZeroTimeout(fn, ...args)
    {
        const ctx = (Utils._setZeroTimeoutContext = Utils._setZeroTimeoutContext || (Utils._setZeroTimeoutContext = {
            callbacks: new Map(),
            _setup: window.addEventListener('message', ev => {
                if(ev.source === window) {
                    const ctx = Utils._setZeroTimeoutContext;
                    const msgId = ev.data;
                    const { fn, args } = ctx.callbacks.get(msgId);
                    if(fn !== undefined) {
                        ev.stopPropagation();
                        fn.apply(window, args);
                        ctx.callbacks.delete(msgId);
                    }
                }
            }, true)
        }));

        const msgId = '0%' + Math.random();
        ctx.callbacks.set(msgId, { fn, args });
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
     * @param {boolean} [normalized] normalize entries so that their sum is 1
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
     * Decode a 16-bit float from a
     * unsigned 16-bit integer
     * @param {number} uint16
     * @returns {number}
     */
    static decodeFloat16(uint16)
    {
        // decode according to sec 2.1.2
        // 16-Bit Floating Point Numbers
        // of the OpenGL ES 3 spec
        const s = (uint16 & 0xFFFF) >> 15; // sign bit
        const e = (uint16 & 0x7FFF) >> 10; // exponent
        const m = (uint16 & 0x3FF); // mantissa
        const sign = 1 - 2 * s; // (-1)^s

        if(e == 0)
            return m == 0 ? sign * 0.0 : sign * m * 5.960464477539063e-8; // zero / subnormal
        else if(e == 31)
            return m == 0 ? sign * Number.POSITIVE_INFINITY : Number.NaN;

        const f = e >= 15 ? (1 << (e-15)) : 1.0 / (1 << (15-e)); // 2^(e-15)
        return sign * f * (1.0 + m * 0.0009765625); // normal
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