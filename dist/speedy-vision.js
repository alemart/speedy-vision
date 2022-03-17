/*!
 * speedy-vision v0.9.0-wip
 * GPU-accelerated Computer Vision for JavaScript
 * https://github.com/alemart/speedy-vision
 *
 * Copyright 2020-2022 Alexandre Martins <alemartf(at)gmail.com> (https://github.com/alemart)
 * @license Apache-2.0
 *
 * Date: 2022-03-17T17:28:03.995Z
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Speedy"] = factory();
	else
		root["Speedy"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/pipeline/factories/filter-factory.js":
/*!*******************************************************!*\
  !*** ./src/core/pipeline/factories/filter-factory.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineFilterFactory": () => (/* binding */ SpeedyPipelineFilterFactory)
/* harmony export */ });
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
 * filter-factory.js
 * Image filters
 */










/**
 * Image filters
 */
class SpeedyPipelineFilterFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__.SpeedyNamespace
{
    /**
     * Convert image to greyscale
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeGreyscale}
     */
    static Greyscale(name = undefined)
    {
        return new _nodes_filters_greyscale__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodeGreyscale(name);
    }

    /**
     * Gaussian Blur
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeGaussianBlur}
     */
    static GaussianBlur(name = undefined)
    {
        return new _nodes_filters_gaussian_blur__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineNodeGaussianBlur(name);
    }

    /**
     * Simple Blur (Box Filter)
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeSimpleBlur}
     */
    static SimpleBlur(name = undefined)
    {
        return new _nodes_filters_simple_blur__WEBPACK_IMPORTED_MODULE_3__.SpeedyPipelineNodeSimpleBlur(name);
    }

    /**
     * Median Blur
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeMedianBlur}
     */
    static MedianBlur(name = undefined)
    {
        return new _nodes_filters_median_blur__WEBPACK_IMPORTED_MODULE_4__.SpeedyPipelineNodeMedianBlur(name);
    }

    /**
     * Image Convolution
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeConvolution}
     */
    static Convolution(name = undefined)
    {
        return new _nodes_filters_convolution__WEBPACK_IMPORTED_MODULE_5__.SpeedyPipelineNodeConvolution(name);
    }

    /**
     * Nightvision
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeNightvision}
     */
    static Nightvision(name = undefined)
    {
        return new _nodes_filters_nightvision__WEBPACK_IMPORTED_MODULE_6__.SpeedyPipelineNodeNightvision(name);
    }

    /**
     * Normalize image
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeNormalize}
     */
    static Normalize(name = undefined)
    {
        return new _nodes_filters_normalize__WEBPACK_IMPORTED_MODULE_7__.SpeedyPipelineNodeNormalize(name);
    }
}

/***/ }),

/***/ "./src/core/pipeline/factories/image-factory.js":
/*!******************************************************!*\
  !*** ./src/core/pipeline/factories/image-factory.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineImagePortalFactory": () => (/* binding */ SpeedyPipelineImagePortalFactory),
/* harmony export */   "SpeedyPipelineImageFactory": () => (/* binding */ SpeedyPipelineImageFactory)
/* harmony export */ });
/* harmony import */ var _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../speedy-namespace */ "./src/core/speedy-namespace.js");
/* harmony import */ var _nodes_images_source__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../nodes/images/source */ "./src/core/pipeline/nodes/images/source.js");
/* harmony import */ var _nodes_images_sink__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../nodes/images/sink */ "./src/core/pipeline/nodes/images/sink.js");
/* harmony import */ var _nodes_images_multiplexer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../nodes/images/multiplexer */ "./src/core/pipeline/nodes/images/multiplexer.js");
/* harmony import */ var _nodes_images_buffer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../nodes/images/buffer */ "./src/core/pipeline/nodes/images/buffer.js");
/* harmony import */ var _nodes_images_pyramid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../nodes/images/pyramid */ "./src/core/pipeline/nodes/images/pyramid.js");
/* harmony import */ var _nodes_images_mixer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../nodes/images/mixer */ "./src/core/pipeline/nodes/images/mixer.js");
/* harmony import */ var _nodes_images_portal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../nodes/images/portal */ "./src/core/pipeline/nodes/images/portal.js");
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
 * image-factory.js
 * Image-related nodes
 */










/**
 * Portal nodes
 */
class SpeedyPipelineImagePortalFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__.SpeedyNamespace
{
    /**
     * Create an image portal source
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImagePortalSource}
     */
    static Source(name = undefined)
    {
        return new _nodes_images_portal__WEBPACK_IMPORTED_MODULE_7__.SpeedyPipelineNodeImagePortalSource(name);
    }

    /**
     * Create an image portal sink
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImagePortalSink}
     */
    static Sink(name = undefined)
    {
        return new _nodes_images_portal__WEBPACK_IMPORTED_MODULE_7__.SpeedyPipelineNodeImagePortalSink(name);
    }
}

/**
 * Image nodes
 */
class SpeedyPipelineImageFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__.SpeedyNamespace
{
    /**
     * Create an image source
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageSource}
     */
    static Source(name = undefined)
    {
        return new _nodes_images_source__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodeImageSource(name);
    }

    /**
     * Create an image sink
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageSink}
     */
    static Sink(name = undefined)
    {
        return new _nodes_images_sink__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineNodeImageSink(name);
    }

    /**
     * Create an image multiplexer
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageMultiplexer}
     */
    static Multiplexer(name = undefined)
    {
        return new _nodes_images_multiplexer__WEBPACK_IMPORTED_MODULE_3__.SpeedyPipelineNodeImageMultiplexer(name);
    }

    /**
     * Create an image buffer
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageBuffer}
     */
    static Buffer(name = undefined)
    {
        return new _nodes_images_buffer__WEBPACK_IMPORTED_MODULE_4__.SpeedyPipelineNodeImageBuffer(name);
    }

    /**
     * Image Pyramid
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImagePyramid}
     */
    static Pyramid(name = undefined)
    {
        return new _nodes_images_pyramid__WEBPACK_IMPORTED_MODULE_5__.SpeedyPipelineNodeImagePyramid(name);
    }

    /**
     * Image Mixer (blending)
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageMixer}
     */
    static Mixer(name = undefined)
    {
        return new _nodes_images_mixer__WEBPACK_IMPORTED_MODULE_6__.SpeedyPipelineNodeImageMixer(name);
    }

    /**
     * Image Portals
     * @returns {typeof SpeedyPipelineImagePortalFactory}
     */
    static get Portal()
    {
        return SpeedyPipelineImagePortalFactory;
    }
}

/***/ }),

/***/ "./src/core/pipeline/factories/keypoint-factory.js":
/*!*********************************************************!*\
  !*** ./src/core/pipeline/factories/keypoint-factory.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineKeypointPortalFactory": () => (/* binding */ SpeedyPipelineKeypointPortalFactory),
/* harmony export */   "SpeedyPipelineKeypointFactory": () => (/* binding */ SpeedyPipelineKeypointFactory)
/* harmony export */ });
/* harmony import */ var _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../speedy-namespace */ "./src/core/speedy-namespace.js");
/* harmony import */ var _nodes_keypoints_source__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../nodes/keypoints/source */ "./src/core/pipeline/nodes/keypoints/source.js");
/* harmony import */ var _nodes_keypoints_sink__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../nodes/keypoints/sink */ "./src/core/pipeline/nodes/keypoints/sink.js");
/* harmony import */ var _nodes_keypoints_clipper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../nodes/keypoints/clipper */ "./src/core/pipeline/nodes/keypoints/clipper.js");
/* harmony import */ var _nodes_keypoints_border_clipper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../nodes/keypoints/border-clipper */ "./src/core/pipeline/nodes/keypoints/border-clipper.js");
/* harmony import */ var _nodes_keypoints_buffer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../nodes/keypoints/buffer */ "./src/core/pipeline/nodes/keypoints/buffer.js");
/* harmony import */ var _nodes_keypoints_mixer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../nodes/keypoints/mixer */ "./src/core/pipeline/nodes/keypoints/mixer.js");
/* harmony import */ var _nodes_keypoints_shuffler__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../nodes/keypoints/shuffler */ "./src/core/pipeline/nodes/keypoints/shuffler.js");
/* harmony import */ var _nodes_keypoints_multiplexer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../nodes/keypoints/multiplexer */ "./src/core/pipeline/nodes/keypoints/multiplexer.js");
/* harmony import */ var _nodes_keypoints_transformer__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../nodes/keypoints/transformer */ "./src/core/pipeline/nodes/keypoints/transformer.js");
/* harmony import */ var _nodes_keypoints_subpixel__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../nodes/keypoints/subpixel */ "./src/core/pipeline/nodes/keypoints/subpixel.js");
/* harmony import */ var _nodes_keypoints_detectors_fast__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../nodes/keypoints/detectors/fast */ "./src/core/pipeline/nodes/keypoints/detectors/fast.js");
/* harmony import */ var _nodes_keypoints_detectors_harris__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../nodes/keypoints/detectors/harris */ "./src/core/pipeline/nodes/keypoints/detectors/harris.js");
/* harmony import */ var _nodes_keypoints_descriptors_orb__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../nodes/keypoints/descriptors/orb */ "./src/core/pipeline/nodes/keypoints/descriptors/orb.js");
/* harmony import */ var _nodes_keypoints_trackers_lk__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../nodes/keypoints/trackers/lk */ "./src/core/pipeline/nodes/keypoints/trackers/lk.js");
/* harmony import */ var _nodes_keypoints_matchers_lsh_static_tables__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../nodes/keypoints/matchers/lsh-static-tables */ "./src/core/pipeline/nodes/keypoints/matchers/lsh-static-tables.js");
/* harmony import */ var _nodes_keypoints_matchers_lsh_knn__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../nodes/keypoints/matchers/lsh-knn */ "./src/core/pipeline/nodes/keypoints/matchers/lsh-knn.js");
/* harmony import */ var _nodes_keypoints_matchers_bf_knn__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../nodes/keypoints/matchers/bf-knn */ "./src/core/pipeline/nodes/keypoints/matchers/bf-knn.js");
/* harmony import */ var _nodes_keypoints_distance_filter__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../nodes/keypoints/distance-filter */ "./src/core/pipeline/nodes/keypoints/distance-filter.js");
/* harmony import */ var _nodes_keypoints_hamming_distance_filter__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../nodes/keypoints/hamming-distance-filter */ "./src/core/pipeline/nodes/keypoints/hamming-distance-filter.js");
/* harmony import */ var _nodes_keypoints_portal__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../nodes/keypoints/portal */ "./src/core/pipeline/nodes/keypoints/portal.js");
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
 * keypoint-factory.js
 * Keypoint-related nodes
 */























/**
 * Keypoint detectors
 */
class SpeedyPipelineKeypointDetectorFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__.SpeedyNamespace
{
    /**
     * FAST corner detector
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeFASTKeypointDetector}
     */
    static FAST(name = undefined)
    {
        return new _nodes_keypoints_detectors_fast__WEBPACK_IMPORTED_MODULE_11__.SpeedyPipelineNodeFASTKeypointDetector(name);
    }

    /**
     * Harris corner detector
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeHarrisKeypointDetector}
     */
    static Harris(name = undefined)
    {
        return new _nodes_keypoints_detectors_harris__WEBPACK_IMPORTED_MODULE_12__.SpeedyPipelineNodeHarrisKeypointDetector(name);
    }
}

/**
 * Keypoint descriptors
 */
class SpeedyPipelineKeypointDescriptorFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__.SpeedyNamespace
{
    /**
     * ORB descriptors
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeORBKeypointDescriptor}
     */
    static ORB(name = undefined)
    {
        return new _nodes_keypoints_descriptors_orb__WEBPACK_IMPORTED_MODULE_13__.SpeedyPipelineNodeORBKeypointDescriptor(name);
    }
}

/**
 * Keypoint trackers
 */
class SpeedyPipelineKeypointTrackerFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__.SpeedyNamespace
{
    /**
     * LK optical-flow
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeLKKeypointTracker}
     */
    static LK(name = undefined)
    {
        return new _nodes_keypoints_trackers_lk__WEBPACK_IMPORTED_MODULE_14__.SpeedyPipelineNodeLKKeypointTracker(name);
    }
}

/**
 * Keypoint matchers
 */
class SpeedyPipelineKeypointMatcherFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__.SpeedyNamespace
{
    /**
     * Static LSH tables
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeStaticLSHTables}
     */
    static StaticLSHTables(name = undefined)
    {
        return new _nodes_keypoints_matchers_lsh_static_tables__WEBPACK_IMPORTED_MODULE_15__.SpeedyPipelineNodeStaticLSHTables(name);
    }

    /**
     * LSH-based K-approximate nearest neighbors
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeLSHKNNMatcher}
     */
    static LSHKNN(name = undefined)
    {
        return new _nodes_keypoints_matchers_lsh_knn__WEBPACK_IMPORTED_MODULE_16__.SpeedyPipelineNodeLSHKNNMatcher(name);
    }

    /**
     * Brute-force K-nearest neighbors keypoint matcher
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeBruteForceKNNKeypointMatcher}
     */
    static BFKNN(name = undefined)
    {
        return new _nodes_keypoints_matchers_bf_knn__WEBPACK_IMPORTED_MODULE_17__.SpeedyPipelineNodeBruteForceKNNKeypointMatcher(name);
    }
}

/**
 * Portal nodes
 */
class SpeedyPipelineKeypointPortalFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__.SpeedyNamespace
{
    /**
     * Create an image portal source
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeKeypointPortalSource}
     */
    static Source(name = undefined)
    {
        return new _nodes_keypoints_portal__WEBPACK_IMPORTED_MODULE_20__.SpeedyPipelineNodeKeypointPortalSource(name);
    }

    /**
     * Create an image portal sink
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeKeypointPortalSink}
     */
    static Sink(name = undefined)
    {
        return new _nodes_keypoints_portal__WEBPACK_IMPORTED_MODULE_20__.SpeedyPipelineNodeKeypointPortalSink(name);
    }
}

/**
 * Keypoint-related nodes
 */
class SpeedyPipelineKeypointFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__.SpeedyNamespace
{
    /**
     * Keypoint detectors
     * @returns {typeof SpeedyPipelineKeypointDetectorFactory}
     */
    static get Detector()
    {
        return SpeedyPipelineKeypointDetectorFactory;
    }

    /**
     * Keypoint descriptors
     * @returns {typeof SpeedyPipelineKeypointDescriptorFactory}
     */
    static get Descriptor()
    {
        return SpeedyPipelineKeypointDescriptorFactory;
    }

    /**
     * Keypoint trackers
     * @returns {typeof SpeedyPipelineKeypointTrackerFactory}
     */
    static get Tracker()
    {
        return SpeedyPipelineKeypointTrackerFactory;
    }

    /**
     * Keypoint matchers
     * @returns {typeof SpeedyPipelineKeypointMatcherFactory}
     */
    static get Matcher()
    {
        return SpeedyPipelineKeypointMatcherFactory;
    }

    /**
     * Keypoint Portals
     * @returns {typeof SpeedyPipelineKeypointPortalFactory}
     */
    static get Portal()
    {
        return SpeedyPipelineKeypointPortalFactory;
    }

    /**
     * Create a keypoint source
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointSource}
     */
    static Source(name = undefined)
    {
        return new _nodes_keypoints_source__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodeKeypointSource(name);
    }

    /**
     * Create a keypoint sink
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointSink}
     */
    static Sink(name = undefined)
    {
        return new _nodes_keypoints_sink__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineNodeKeypointSink(name);
    }

    /**
     * Create a sink of tracked keypoints
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeTrackedKeypointSink}
     */
    static SinkOfTrackedKeypoints(name = undefined)
    {
        return new _nodes_keypoints_sink__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineNodeTrackedKeypointSink(name);
    }

    /**
     * Create a sink of matched keypoints
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeMatchedKeypointSink}
     */
    static SinkOfMatchedKeypoints(name = undefined)
    {
        return new _nodes_keypoints_sink__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineNodeMatchedKeypointSink(name);
    }

    /**
     * Keypoint clipper
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointClipper}
     */
    static Clipper(name = undefined)
    {
        return new _nodes_keypoints_clipper__WEBPACK_IMPORTED_MODULE_3__.SpeedyPipelineNodeKeypointClipper(name);
    }

    /**
     * Border Clipper
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointBorderClipper}
     */
    static BorderClipper(name = undefined)
    {
        return new _nodes_keypoints_border_clipper__WEBPACK_IMPORTED_MODULE_4__.SpeedyPipelineNodeKeypointBorderClipper(name);
    }

    /**
     * Create a keypoint buffer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointBuffer}
     */
    static Buffer(name = undefined)
    {
        return new _nodes_keypoints_buffer__WEBPACK_IMPORTED_MODULE_5__.SpeedyPipelineNodeKeypointBuffer(name);
    }

    /**
     * Create a keypoint mixer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointMixer}
     */
    static Mixer(name = undefined)
    {
        return new _nodes_keypoints_mixer__WEBPACK_IMPORTED_MODULE_6__.SpeedyPipelineNodeKeypointMixer(name);
    }

    /**
     * Create a keypoint shuffler
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointShuffler}
     */
    static Shuffler(name = undefined)
    {
        return new _nodes_keypoints_shuffler__WEBPACK_IMPORTED_MODULE_7__.SpeedyPipelineNodeKeypointShuffler(name);
    }

    /**
     * Create a keypoint multiplexer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointMultiplexer}
     */
    static Multiplexer(name = undefined)
    {
        return new _nodes_keypoints_multiplexer__WEBPACK_IMPORTED_MODULE_8__.SpeedyPipelineNodeKeypointMultiplexer(name);
    }

    /**
     * Create a keypoint transformer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointTransformer}
     */
    static Transformer(name = undefined)
    {
        return new _nodes_keypoints_transformer__WEBPACK_IMPORTED_MODULE_9__.SpeedyPipelineNodeKeypointTransformer(name);
    }

    /**
     * Create a subpixel refiner of keypoint locations
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointSubpixelRefiner}
     */
    static SubpixelRefiner(name = undefined)
    {
        return new _nodes_keypoints_subpixel__WEBPACK_IMPORTED_MODULE_10__.SpeedyPipelineNodeKeypointSubpixelRefiner(name);
    }

    /**
     * Distance filter
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeDistanceFilter}
     */
    static DistanceFilter(name = undefined)
    {
        return new _nodes_keypoints_distance_filter__WEBPACK_IMPORTED_MODULE_18__.SpeedyPipelineNodeKeypointDistanceFilter(name);
    }

    /**
     * Hamming distance filter
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeHammingDistanceFilter}
     */
    static HammingDistanceFilter(name = undefined)
    {
        return new _nodes_keypoints_hamming_distance_filter__WEBPACK_IMPORTED_MODULE_19__.SpeedyPipelineNodeKeypointHammingDistanceFilter(name);
    }
}


/***/ }),

/***/ "./src/core/pipeline/factories/transform-factory.js":
/*!**********************************************************!*\
  !*** ./src/core/pipeline/factories/transform-factory.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineTransformFactory": () => (/* binding */ SpeedyPipelineTransformFactory)
/* harmony export */ });
/* harmony import */ var _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../speedy-namespace */ "./src/core/speedy-namespace.js");
/* harmony import */ var _nodes_transforms_perspective_warp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../nodes/transforms/perspective-warp */ "./src/core/pipeline/nodes/transforms/perspective-warp.js");
/* harmony import */ var _nodes_transforms_resize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../nodes/transforms/resize */ "./src/core/pipeline/nodes/transforms/resize.js");
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
 * transform-factory.js
 * Image transforms
 */





/**
 * Image transforms
 */
class SpeedyPipelineTransformFactory extends _speedy_namespace__WEBPACK_IMPORTED_MODULE_0__.SpeedyNamespace
{
    /**
     * Resize image
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeResize}
     */
    static Resize(name = undefined)
    {
        return new _nodes_transforms_resize__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineNodeResize(name);
    }

    /**
     * Warp an image using a perspective transformation
     * @param {string} [name]
     * @returns {SpeedyPipelineNodePerspectiveWarp}
     */
    static PerspectiveWarp(name = undefined)
    {
        return new _nodes_transforms_perspective_warp__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodePerspectiveWarp(name);
    }
}

/***/ }),

/***/ "./src/core/pipeline/factories/vector2-factory.js":
/*!********************************************************!*\
  !*** ./src/core/pipeline/factories/vector2-factory.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineVector2Factory": () => (/* binding */ SpeedyPipelineVector2Factory)
/* harmony export */ });
/* harmony import */ var _speedy_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../speedy-vector */ "./src/core/speedy-vector.js");
/* harmony import */ var _nodes_vector2_sink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../nodes/vector2/sink */ "./src/core/pipeline/nodes/vector2/sink.js");
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
 * vector2-factory.js
 * 2D vectors
 */




/**
 * 2D vectors
 */
class SpeedyPipelineVector2Factory extends Function
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
     * @private
     *
     * Create a 2D vector
     * @param {number} x x-coordinate
     * @param {number} y y-coordinate
     * @returns {SpeedyVector2}
     */
    _create(x, y)
    {
        return new _speedy_vector__WEBPACK_IMPORTED_MODULE_0__.SpeedyVector2(x, y);
    }

    /**
     * Create a Vector2 sink
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeVector2Sink}
     */
    Sink(name = undefined)
    {
        return new _nodes_vector2_sink__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodeVector2Sink(name);
    }
}


/***/ }),

/***/ "./src/core/pipeline/nodes/filters/convolution.js":
/*!********************************************************!*\
  !*** ./src/core/pipeline/nodes/filters/convolution.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeConvolution": () => (/* binding */ SpeedyPipelineNodeConvolution)
/* harmony export */ });
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
class SpeedyPipelineNodeConvolution extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
        ]);

        /** @type {SpeedyMatrix} convolution kernel (square matrix) */
        this._kernel = _speedy_matrix__WEBPACK_IMPORTED_MODULE_10__.SpeedyMatrix.Create(3, 3, [0, 0, 0, 0, 1, 0, 0, 0, 0]); // identity transform
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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.NotSupportedError(`Use a square kernel`);
        else if(!(kernel.rows == 3 || kernel.rows == 5 || kernel.rows == 7))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.NotSupportedError(`Invalid kernel size. Supported sizes: 3x3, 5x5, 7x7`);

        this._kernel = kernel;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeGaussianBlur": () => (/* binding */ SpeedyPipelineNodeGaussianBlur)
/* harmony export */ });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _speedy_size__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../speedy-size */ "./src/core/speedy-size.js");
/* harmony import */ var _speedy_vector__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../speedy-vector */ "./src/core/speedy-vector.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * gaussian-blur.js
 * Gaussian Blur
 */











/**
 * Default kernels for different sizes: 3x3, 5x5, 7x7... (use sigma_x = sigma_y)
 * Heuristics: in order to pick a sigma, we set radius = 2 * sigma. Since
 * ksize = 1 + 2 * radius, it follows that sigma = (ksize - 1) / 4. When
 * ksize is 3, we set sigma = 1. Therefore, sigma = max(1, (ksize - 1) / 4).
 */
const DEFAULT_KERNEL = Object.freeze({
    3: [ 0.27901008925473514, 0.44197982149052983, 0.27901008925473514 ], // 1D convolution (sigma = 1)
    5: [ 0.06135959781344021, 0.2447701955296099, 0.3877404133138998, 0.2447701955296099, 0.06135959781344021 ], // 1D convolution (separable kernel)
    7: [ 0.03873542500847274, 0.11308485700794121, 0.2150068609928349, 0.26634571398150225, 0.2150068609928349, 0.11308485700794121, 0.03873542500847274 ],
    9: [ 0.028532262603370988, 0.067234535494912, 0.12400932997922749, 0.17904386461741617, 0.20236001461014655, 0.17904386461741617, 0.12400932997922749, 0.067234535494912, 0.028532262603370988 ],
    11:[ 0.022656882730580346, 0.04610857898527292, 0.08012661469398517, 0.11890414969751599, 0.15067709325491124, 0.16305336127546846, 0.15067709325491124, 0.11890414969751599, 0.08012661469398517, 0.04610857898527292, 0.022656882730580346 ],
    13:[ 0.018815730430644363, 0.03447396964662016, 0.05657737457255748, 0.08317258170844948, 0.10952340502389682, 0.12918787500405662, 0.13649812722755, 0.12918787500405662, 0.10952340502389682, 0.08317258170844948, 0.05657737457255748, 0.03447396964662016, 0.018815730430644363 ],
    15:[ 0.016100340991695383, 0.027272329212157102, 0.042598338587449644, 0.06135478775568558, 0.08148767614129326, 0.09979838342934616, 0.11270444144735056, 0.11736740487004466, 0.11270444144735056, 0.09979838342934616, 0.08148767614129326, 0.06135478775568558, 0.042598338587449644, 0.027272329212157102, 0.016100340991695383 ],
    //3: [ 0.25, 0.5, 0.25 ],
    //5: [ 0.05, 0.25, 0.4, 0.25, 0.05 ],
});

/** Zero vector. When we set sigma_x = sigma_y = 0, we use the default rule to compute the actual sigma */
const DEFAULT_SIGMA = new _speedy_vector__WEBPACK_IMPORTED_MODULE_5__.SpeedyVector2(0,0);

/** convolution programs (x-axis) */
const CONVOLUTION_X = Object.freeze({
    3: 'convolution3x',
    5: 'convolution5x',
    7: 'convolution7x',
    9: 'convolution9x',
    11: 'convolution11x',
    13: 'convolution13x',
    15: 'convolution15x',
});

/** convolution programs (y-axis) */
const CONVOLUTION_Y = Object.freeze({
    3: 'convolution3y',
    5: 'convolution5y',
    7: 'convolution7y',
    9: 'convolution9y',
    11: 'convolution11y',
    13: 'convolution13y',
    15: 'convolution15y',
});

/**
 * @typedef {object} SeparableConvolutionKernel
 * @property {number[]} x
 * @property {number[]} y
 */

/**
 * Gaussian Blur
 */
class SpeedyPipelineNodeGaussianBlur extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 2, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
        ]);

        /** @type {SpeedySize} size of the kernel */
        this._kernelSize = new _speedy_size__WEBPACK_IMPORTED_MODULE_4__.SpeedySize(5,5);

        /** @type {SpeedyVector2} sigma of the Gaussian kernel (0 means: use default settings) */
        this._sigma = DEFAULT_SIGMA;

        /** @type {SeparableConvolutionKernel} convolution kernel */
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__.Utils.assert(kernelSize instanceof _speedy_size__WEBPACK_IMPORTED_MODULE_4__.SpeedySize);

        const kw = kernelSize.width, kh = kernelSize.height;
        if(kw < 3 || kh < 3 || kw > 15 || kh > 15 || kw % 2 == 0 || kh % 2 == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.NotSupportedError(`Unsupported kernel size: ${kw}x${kh}`);

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
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__.Utils.assert(sigma instanceof _speedy_vector__WEBPACK_IMPORTED_MODULE_5__.SpeedyVector2, `Sigma must be a SpeedyVector2`);
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__.Utils.assert(sigma.x >= 0 && sigma.y >= 0);

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
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
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
            this._kernel.x = _utils_utils__WEBPACK_IMPORTED_MODULE_6__.Utils.gaussianKernel(this._sigma.x, this._kernelSize.width, true);

        if(this._sigma.y == DEFAULT_SIGMA.y)
            this._kernel.y = DEFAULT_KERNEL[this._kernelSize.height];
        else
            this._kernel.y = _utils_utils__WEBPACK_IMPORTED_MODULE_6__.Utils.gaussianKernel(this._sigma.y, this._kernelSize.height, true);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/filters/greyscale.js":
/*!******************************************************!*\
  !*** ./src/core/pipeline/nodes/filters/greyscale.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeGreyscale": () => (/* binding */ SpeedyPipelineNodeGreyscale)
/* harmony export */ });
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
 * greyscale.js
 * Convert an image to greyscale
 */










/**
 * Convert an image to greyscale
 */
class SpeedyPipelineNodeGreyscale extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
        ]);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
        const width = image.width, height = image.height;
        const outputTexture = this._tex[0];
        const filters = gpu.programs.filters;

        filters.rgb2grey.outputs(width, height, outputTexture);
        filters.rgb2grey(image);

        this.output().swrite(outputTexture, _utils_types__WEBPACK_IMPORTED_MODULE_6__.ImageFormat.GREY);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/filters/median-blur.js":
/*!********************************************************!*\
  !*** ./src/core/pipeline/nodes/filters/median-blur.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeMedianBlur": () => (/* binding */ SpeedyPipelineNodeMedianBlur)
/* harmony export */ });
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
class SpeedyPipelineNodeMedianBlur extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image).satisfying(
                ( /** @type {SpeedyPipelineMessageWithImage} */ msg ) =>
                    msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_7__.ImageFormat.GREY
            ),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
        ]);

        /** @type {SpeedySize} size of the kernel (assumed to be square) */
        this._kernelSize = new _speedy_size__WEBPACK_IMPORTED_MODULE_5__.SpeedySize(5,5);
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__.Utils.assert(kernelSize instanceof _speedy_size__WEBPACK_IMPORTED_MODULE_5__.SpeedySize);

        const ksize = kernelSize.width;
        if(!(ksize == 3 || ksize == 5 || ksize == 7))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.NotSupportedError(`Supported kernel sizes: 3x3, 5x5, 7x7`);
        else if(kernelSize.width != kernelSize.height)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.NotSupportedError(`Use a square kernel`);

        this._kernelSize = kernelSize;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeNightvision": () => (/* binding */ SpeedyPipelineNodeNightvision)
/* harmony export */ });
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
 * nightvision.js
 * Nightvision filter
 */











/**
 * @typedef {"high"|"medium"|"low"} NightvisionQualityLevel
 */

/**
 * Nightvision filter: "see in the dark"
 */
class SpeedyPipelineNodeNightvision extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 3, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image).satisfying(
                ( /** @type {SpeedyPipelineMessageWithImage} */ msg ) =>
                    msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_7__.ImageFormat.RGBA ||
                    msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_7__.ImageFormat.GREY
            ),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
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
        if(quality === 'high' || quality === 'medium' || quality === 'low')
            this._quality = quality;
        else
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_6__.IllegalArgumentError(`Invalid quality level for the Nightvision filter: "${quality}"`);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
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
        if(format === _utils_types__WEBPACK_IMPORTED_MODULE_7__.ImageFormat.GREY) {
            filters.nightvisionGreyscale.outputs(width, height, outputTexture);
            filters.nightvisionGreyscale(image, illuminationMap, gain, offset, decay);
        }
        else if(format === _utils_types__WEBPACK_IMPORTED_MODULE_7__.ImageFormat.RGBA) {
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeNormalize": () => (/* binding */ SpeedyPipelineNodeNormalize)
/* harmony export */ });
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
 * normalize.js
 * Normalize image to a range
 */










/**
 * Normalize image to a range
 */
class SpeedyPipelineNodeNormalize extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 4, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image).satisfying(
                ( /** @type {SpeedyPipelineMessageWithImage} */ msg ) =>
                    msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_6__.ImageFormat.GREY
            ),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
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
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
        const width = image.width, height = image.height;
        const outputTexture = this._tex[3];
        let minValue = this._minValue;
        let maxValue = this._maxValue;

        if(minValue > maxValue)
            minValue = maxValue = (minValue + maxValue) / 2;

        const minmax = this._scanMinMax(gpu, image, _utils_types__WEBPACK_IMPORTED_MODULE_6__.PixelComponent.GREEN);
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

        _utils_utils__WEBPACK_IMPORTED_MODULE_5__.Utils.assert(_utils_types__WEBPACK_IMPORTED_MODULE_6__.ColorComponentId[pixelComponent] !== undefined);

        program.copyComponents.outputs(width, height, tex[2]);
        program.scanMinMax2D.outputs(width, height, tex[0], tex[1]);
        
        let texture = program.copyComponents(image, image, _utils_types__WEBPACK_IMPORTED_MODULE_6__.PixelComponent.ALL, _utils_types__WEBPACK_IMPORTED_MODULE_6__.ColorComponentId[pixelComponent]);
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeSimpleBlur": () => (/* binding */ SpeedyPipelineNodeSimpleBlur)
/* harmony export */ });
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
 * simple-blur.js
 * Simple Blur (Box Filter)
 */












/** 1D convolution filters */
const BOX_FILTER = Object.freeze({
    3: (new Array(3)).fill(1/3),
    5: (new Array(5)).fill(1/5),
    7: (new Array(7)).fill(1/7),
    9: (new Array(9)).fill(1/9),
    11: (new Array(11)).fill(1/11),
    13: (new Array(13)).fill(1/13),
    15: (new Array(15)).fill(1/15),
});

/** convolution programs (x-axis) */
const CONVOLUTION_X = Object.freeze({
    3: 'convolution3x',
    5: 'convolution5x',
    7: 'convolution7x',
    9: 'convolution9x',
    11: 'convolution11x',
    13: 'convolution13x',
    15: 'convolution15x',
});

/** convolution programs (y-axis) */
const CONVOLUTION_Y = Object.freeze({
    3: 'convolution3y',
    5: 'convolution5y',
    7: 'convolution7y',
    9: 'convolution9y',
    11: 'convolution11y',
    13: 'convolution13y',
    15: 'convolution15y',
});

/**
 * @typedef {object} SeparableConvolutionKernel
 * @property {number[]} x
 * @property {number[]} y
 */

/**
 * Simple Blur (Box Filter)
 */
class SpeedyPipelineNodeSimpleBlur extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 2, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
        ]);

        /** @type {SpeedySize} size of the kernel */
        this._kernelSize = new _speedy_size__WEBPACK_IMPORTED_MODULE_5__.SpeedySize(5,5);

        /** @type {SeparableConvolutionKernel} convolution kernel */
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_6__.Utils.assert(kernelSize instanceof _speedy_size__WEBPACK_IMPORTED_MODULE_5__.SpeedySize);

        const kw = kernelSize.width, kh = kernelSize.height;
        if(kw < 3 || kh < 3 || kw > 15 || kh > 15 || kw % 2 == 0 || kh % 2 == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.NotSupportedError(`Unsupported kernel size: ${kw}x${kh}`);

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
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeImageBuffer": () => (/* binding */ SpeedyPipelineNodeImageBuffer)
/* harmony export */ });
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
 * buffer.js
 * Image Buffer
 */













/**
 * Image Buffer: a node with memory.
 * At time t, it outputs the image received at time t-1
 */
class SpeedyPipelineNodeImageBuffer extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 2, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image)
        ]);

        /** @type {number} current page: 0 or 1 */
        this._pageIndex = 0;

        /** @type {boolean} first run? */
        this._initialized = false;

        /** @type {ImageFormat} previous image format */
        this._previousFormat = _utils_types__WEBPACK_IMPORTED_MODULE_3__.ImageFormat.RGBA;

        /** @type {boolean} frozen buffer? */
        this._frozen = false;
    }

    /**
     * A frozen buffer discards the input, effectively increasing the buffering time
     * @returns {boolean}
     */
    get frozen()
    {
        return this._frozen;
    }

    /**
     * A frozen buffer discards the input, effectively increasing the buffering time
     * @param {boolean} value
     */
    set frozen(value)
    {
        this._frozen = Boolean(value);
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
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
        const previousFormat = this._previousFormat;
        const page = this._tex;
        const previousInputTexture = page[1 - this._pageIndex];
        const outputTexture = page[this._pageIndex];

        // can't store pyramids
        if(image.hasMipmaps())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.NotSupportedError(`${this.fullName} can't bufferize a pyramid`);

        // bufferize
        if(!this._frozen || !this._initialized) {
            // store input
            this._previousFormat = format;
            previousInputTexture.resize(image.width, image.height);
            image.copyTo(previousInputTexture);

            // page flipping
            this._pageIndex = 1 - this._pageIndex;
        }

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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeImageMixer": () => (/* binding */ SpeedyPipelineNodeImageMixer)
/* harmony export */ });
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
 * mixer.js
 * Image Mixer
 */











/**
 * Image Mixer
 */
class SpeedyPipelineNodeImageMixer extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)('in0').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)('in1').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
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
        const in0 = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input('in0').read() );
        const in1 = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input('in1').read() );
        const image0 = in0.image, image1 = in1.image;
        const format0 = in0.format, format1 = in1.format;
        const width = Math.max(image0.width, image1.width);
        const height = Math.max(image0.height, image1.height);
        const alpha = this._alpha, beta = this._beta, gamma = this._gamma;
        const outputTexture = this._tex[0];

        if(format0 != format1)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.NotSupportedError(`Can't mix images of different formats`);

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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeImageMultiplexer": () => (/* binding */ SpeedyPipelineNodeImageMultiplexer)
/* harmony export */ });
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
 * multiplexer.js
 * Image multiplexer
 */











/** @type {string[]} the names of the input ports indexed by their number */
const INPUT_PORT = [ 'in0', 'in1' ];

/**
 * Image multiplexer
 */
class SpeedyPipelineNodeImageMultiplexer extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 0, [
            ...(INPUT_PORT.map(portName => (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)(portName).expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image))),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
        ]);

        /** @type {number} which port should be linked to the output? */
        this._port = 0;
    }

    /**
     * The number of the port that should be linked to the output
     * @returns {number}
     */
    get port()
    {
        return this._port;
    }

    /**
     * The number of the port that should be linked to the output
     * @param {number} port
     */
    set port(port)
    {
        if(port < 0 || port >= INPUT_PORT.length)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalArgumentError(`Invalid port: ${port}`);

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

/***/ "./src/core/pipeline/nodes/images/portal.js":
/*!**************************************************!*\
  !*** ./src/core/pipeline/nodes/images/portal.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeImagePortalSink": () => (/* binding */ SpeedyPipelineNodeImagePortalSink),
/* harmony export */   "SpeedyPipelineNodeImagePortalSource": () => (/* binding */ SpeedyPipelineNodeImagePortalSource)
/* harmony export */ });
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
 * portal.js
 * Image Portals
 */













/**
 * A sink of an Image Portal
 * This is not a pipeline sink - it doesn't export any data!
 */
class SpeedyPipelineNodeImagePortalSink extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
        ]);

        /** @type {ImageFormat} stored image format */
        this._format = _utils_types__WEBPACK_IMPORTED_MODULE_3__.ImageFormat.RGBA;

        /** @type {boolean} is this node initialized? */
        this._initialized = false;
    }

    /**
     * Stored image
     * @returns {SpeedyTexture}
     */
    get image()
    {
        if(!this._initialized)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalOperationError(`Portal error: ${this.fullName} holds no data`);

        return this._tex[0];
    }

    /**
     * Stored image format
     * @returns {ImageFormat}
     */
    get format()
    {
        if(!this._initialized)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalOperationError(`Portal error: ${this.fullName} holds no data`);

        return this._format;
    }

    /**
     * Initializes this node
     * @param {SpeedyGPU} gpu
     */
    init(gpu)
    {
        super.init(gpu);

        this._tex[0].resize(1, 1).clear(); // initial texture
        this._format = _utils_types__WEBPACK_IMPORTED_MODULE_3__.ImageFormat.RGBA;

        this._initialized = true;
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
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
        const tex = this._tex[0];

        // can't store pyramids
        if(image.hasMipmaps())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.NotSupportedError(`${this.fullName} can't store a pyramid`);

        // copy input
        this._format = format;
        tex.resize(image.width, image.height);
        image.copyTo(tex);
    }
}



/**
 * A source of an Image Portal
 */
class SpeedyPipelineNodeImagePortalSource extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineSourceNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 0, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
        ]);

        /** @type {SpeedyPipelineNodeImagePortalSink|null} portal sink */
        this._source = null;
    }

    /**
     * Data source
     * @returns {SpeedyPipelineNodeImagePortalSink|null}
     */
    get source()
    {
        return this._source;
    }

    /**
     * Data source
     * @param {SpeedyPipelineNodeImagePortalSink|null} node
     */
    set source(node)
    {
        if(node !== null && !(node instanceof SpeedyPipelineNodeImagePortalSink))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalArgumentError(`Incompatible source for ${this.fullName}`);

        this._source = node;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        if(this._source == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalOperationError(`${this.fullName} has no source`);

        this.output().swrite(this._source.image, this._source.format);
    }
}


/***/ }),

/***/ "./src/core/pipeline/nodes/images/pyramid.js":
/*!***************************************************!*\
  !*** ./src/core/pipeline/nodes/images/pyramid.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeImagePyramid": () => (/* binding */ SpeedyPipelineNodeImagePyramid)
/* harmony export */ });
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
 * pyramid.js
 * Generate pyramid
 */











// Constants
const MAX_LEVELS = _utils_globals__WEBPACK_IMPORTED_MODULE_6__.PYRAMID_MAX_LEVELS; //14; // supposing image size <= 8K = 2^13 (downto 1)
const MAX_TEXTURES = 2 * MAX_LEVELS; //MAX_LEVELS;

/**
 * Generate pyramid
 */
class SpeedyPipelineNodeImagePyramid extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, MAX_TEXTURES + 1, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
        ]);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
        const outputTexture = this._tex[0];
        const pyramids = gpu.programs.pyramids;
        let width = image.width, height = image.height;

        // number of mipmap levels according to the OpenGL ES 3.0 spec (sec 3.8.10.4)
        const mipLevels = 1 + Math.floor(Math.log2(Math.max(width, height)));

        // get work textures
        const mip = new Array(MAX_TEXTURES + 1);
        for(let i = MAX_TEXTURES; i >= 1; i--)
            mip[i-1] = this._tex[i];

        // get a copy of the input image
        mip[0].resize(width, height);
        image.copyTo(mip[0]);

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
            /*
            (pyramids.reduce.outputs(width, height, mip[tmp]))(mip[level-1]);
            (pyramids.downsample2.outputs(halfWidth, halfHeight, mip[level]))(mip[tmp]);
            */

            // flush
            gpu.gl.flush();

            // next level
            width = halfWidth;
            height = halfHeight;

            /*
            // debug: view pyramid
            const view = mip[level-1];
            const canvas = gpu.renderToCanvas(view);
            if(!window._ww) document.body.appendChild(canvas);
            window._ww = 1;
            */
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeImageSink": () => (/* binding */ SpeedyPipelineNodeImageSink)
/* harmony export */ });
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
 * image-output.js
 * Gets an image out of a pipeline
 */












/**
 * Gets an image out of a pipeline
 */
class SpeedyPipelineNodeImageSink extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineSinkNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = 'image')
    {
        super(name, 0, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image)
        ]);

        /** @type {ImageBitmap} output bitmap */
        this._bitmap = null;

        /** @type {ImageFormat} output format */
        this._format = _utils_types__WEBPACK_IMPORTED_MODULE_8__.ImageFormat.RGBA;
    }

    /**
     * Export data from this node to the user
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    export()
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_7__.Utils.assert(this._bitmap != null);
        return _speedy_media__WEBPACK_IMPORTED_MODULE_5__.SpeedyMedia.load(this._bitmap, { format: this._format }, false);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );

        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_9__.SpeedyPromise(resolve => {
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeImageSource": () => (/* binding */ SpeedyPipelineNodeImageSource)
/* harmony export */ });
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
 * image-input.js
 * Gets an image into a pipeline
 */












// Constants
const UPLOAD_BUFFER_SIZE = 2; // how many textures we allocate for uploading data

/**
 * Gets an image into a pipeline
 */
class SpeedyPipelineNodeImageSource extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineSourceNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, UPLOAD_BUFFER_SIZE, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image)
        ]);

        /** @type {SpeedyMedia|null} source media */
        this._media = null;

        /** @type {number} texture index */
        this._textureIndex = 0;
    }

    /**
     * Source media
     * @returns {SpeedyMedia|null}
     */
    get media()
    {
        return this._media;
    }

    /**
     * Source media
     * @param {SpeedyMedia|null} media
     */
    set media(media)
    {
        if(media !== null && !(media instanceof _speedy_media__WEBPACK_IMPORTED_MODULE_5__.SpeedyMedia))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.IllegalArgumentError(`Not a SpeedyMedia: ${media}`);

        this._media = media;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        if(this._media == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.IllegalOperationError(`Did you forget to set the media of ${this.fullName}?`);

        // use round-robin to mitigate WebGL's implicit synchronization
        // and maybe minimize texture upload times
        this._textureIndex = (this._textureIndex + 1) % this._tex.length;

        // upload texture
        const outputTexture = this._tex[this._textureIndex];
        gpu.upload(this._media._source, outputTexture);
        this.output().swrite(outputTexture, this._media._format);
    }
}


/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/border-clipper.js":
/*!*************************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/border-clipper.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeKeypointBorderClipper": () => (/* binding */ SpeedyPipelineNodeKeypointBorderClipper)
/* harmony export */ });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _detectors_detector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./detectors/detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _speedy_size__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../speedy-size */ "./src/core/speedy-size.js");
/* harmony import */ var _speedy_vector__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../speedy-vector */ "./src/core/speedy-vector.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../utils/globals */ "./src/utils/globals.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * border-clipper.js
 * Keypoint Border Clipper
 */















/**
 * The Border Clipper removes all keypoints within a border of the edges of an image
 */
class SpeedyPipelineNodeKeypointBorderClipper extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 5, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints)
        ]);

        /** @type {SpeedySize} image size, in pixels */
        this._imageSize = new _speedy_size__WEBPACK_IMPORTED_MODULE_5__.SpeedySize(0,0);

        /** @type {SpeedyVector2} border size, in pixels */
        this._borderSize = new _speedy_vector__WEBPACK_IMPORTED_MODULE_6__.SpeedyVector2(0,0);
    }

    /**
     * Image size, in pixels
     * @returns {SpeedySize}
     */
    get imageSize()
    {
        return this._imageSize;
    }

    /**
     * Image size, in pixels
     * @param {SpeedySize} imageSize
     */
    set imageSize(imageSize)
    {
        this._imageSize = imageSize;
    }

    /**
     * Border size, in pixels
     * @returns {SpeedyVector2}
     */
    get borderSize()
    {
        return this._borderSize;
    }

    /**
     * Border size, in pixels
     * @param {SpeedyVector2} borderSize
     */
    set borderSize(borderSize)
    {
        this._borderSize = borderSize;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input().read() );
        const keypoints = gpu.programs.keypoints;
        const imageSize = this._imageSize;
        const borderSize = this._borderSize;
        const imageWidth = imageSize.width, imageHeight = imageSize.height;
        const borderLeft = borderSize.x, borderRight = borderSize.x;
        const borderTop = borderSize.y, borderBottom = borderSize.y;
        const tex = this._tex;

        // validate
        if(imageWidth == 0 || imageHeight == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_9__.IllegalOperationError(`BorderClipper: did you forget to set the image size?`);

        // find the capacity of the keypoint stream
        const capacity = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        const mixEncoderLength = Math.max(1, Math.ceil(Math.sqrt(capacity)));

        // prepare programs
        keypoints.clipBorder.outputs(encoderLength, encoderLength, tex[0]);
        keypoints.mixKeypointsInit.outputs(mixEncoderLength, mixEncoderLength, tex[1]);
        keypoints.mixKeypointsSort.outputs(mixEncoderLength, mixEncoderLength, tex[2], tex[3]);
        keypoints.mixKeypointsApply.outputs(encoderLength, encoderLength, tex[4]);

        // clip keypoints
        let clippedKeypoints = keypoints.clipBorder(
            imageWidth, imageHeight,
            borderTop, borderRight, borderBottom, borderLeft,
            encodedKeypoints, descriptorSize, extraSize, encoderLength
        );

        // sort keypoints
        let sortedKeypoints = keypoints.mixKeypointsInit(
            clippedKeypoints, descriptorSize, extraSize, encoderLength, capacity
        );

        for(let b = 1; b < capacity; b *= 2)
            sortedKeypoints = keypoints.mixKeypointsSort(sortedKeypoints, b);

        clippedKeypoints = keypoints.mixKeypointsApply(
            sortedKeypoints, clippedKeypoints, descriptorSize, extraSize, encoderLength
        );

        /*
        // debug: view keypoints
        keypoints.mixKeypointsView.outputs(mixEncoderLength, mixEncoderLength, tex[1]);
        this._visualize(gpu, keypoints.mixKeypointsView(sortedKeypoints));
        */

        // done!
        this.output().swrite(clippedKeypoints, descriptorSize, extraSize, encoderLength);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/buffer.js":
/*!*****************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/buffer.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeKeypointBuffer": () => (/* binding */ SpeedyPipelineNodeKeypointBuffer)
/* harmony export */ });
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
 * buffer.js
 * Keypoint Buffer
 */












/**
 * Keypoint Buffer: a node with memory.
 * At time t, it outputs the keypoints received at time t-1
 */
class SpeedyPipelineNodeKeypointBuffer extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 2, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints)
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

        /** @type {boolean} frozen buffer? */
        this._frozen = false;
    }

    /**
     * A frozen buffer discards the input, effectively increasing the buffering time
     * @returns {boolean}
     */
    get frozen()
    {
        return this._frozen;
    }

    /**
     * A frozen buffer discards the input, effectively increasing the buffering time
     * @param {boolean} value
     */
    set frozen(value)
    {
        this._frozen = Boolean(value);
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
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input().read() );
        const previousDescriptorSize = this._previousDescriptorSize;
        const previousExtraSize = this._previousExtraSize;
        const previousEncoderLength = this._previousEncoderLength;
        const page = this._tex;
        const previousInputTexture = page[1 - this._pageIndex];
        const outputTexture = page[this._pageIndex];

        // bufferize
        if(!this._frozen || !this._initialized) {
            // store input
            this._previousDescriptorSize = descriptorSize;
            this._previousExtraSize = extraSize;
            this._previousEncoderLength = encoderLength;
            previousInputTexture.resize(encoderLength, encoderLength);
            encodedKeypoints.copyTo(previousInputTexture);

            // page flipping
            this._pageIndex = 1 - this._pageIndex;
        }

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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeKeypointClipper": () => (/* binding */ SpeedyPipelineNodeKeypointClipper)
/* harmony export */ });
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
 * clipper.js
 * Keypoint clipper
 */












// Constants
const LOG2_STRIDE = 5;
const MAX_SIZE = _utils_globals__WEBPACK_IMPORTED_MODULE_7__.MAX_ENCODER_CAPACITY;



/**
 * Keypoint clipper: filters the best keypoints from a stream
 */
class SpeedyPipelineNodeKeypointClipper extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 4, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints)
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
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input().read() );
        const keypoints = gpu.programs.keypoints;
        const clipValue = this._size;
        const tex = this._tex;
        const outputTexture = this._tex[3];

        // find the minimum power of 2 pot such that pot >= capacity
        const capacity = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        //const pot = 1 << (Math.ceil(Math.log2(capacity)) | 0);

        // find the dimensions of the sorting shaders
        const stride = 1 << LOG2_STRIDE; // must be a power of 2
        //const height = Math.max(1, pot >>> LOG2_STRIDE); // this is also a power of 2
        const height = Math.ceil(capacity / stride); // more economical, maybe not a power of 2
        const numberOfPixels = stride * height;

        // find the dimensions of the output texture
        const newCapacity = Math.min(capacity, clipValue);
        const newEncoderLength = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodeKeypointDetector.encoderLength(newCapacity, descriptorSize, extraSize);

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
        const pixels = this._inspect(gpu, permutation), debug = [];
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeKeypointDescriptor": () => (/* binding */ SpeedyPipelineNodeKeypointDescriptor)
/* harmony export */ });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _detectors_detector__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../detectors/detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../utils/utils */ "./src/utils/utils.js");
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
 * descriptor.js
 * Abstract keypoint descriptor
 */








/**
 * Abstract keypoint descriptor
 * @abstract
 */
class SpeedyPipelineNodeKeypointDescriptor extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_5__.Utils.assert(inputDescriptorSize >= 0 && inputExtraSize >= 0);
        _utils_utils__WEBPACK_IMPORTED_MODULE_5__.Utils.assert(outputDescriptorSize >= 0 && outputDescriptorSize % 4 === 0 && outputExtraSize === inputExtraSize);

        const inputEncoderLength = inputEncodedKeypoints.width;
        const inputEncoderCapacity = _detectors_detector__WEBPACK_IMPORTED_MODULE_4__.SpeedyPipelineNodeKeypointDetector.encoderCapacity(inputDescriptorSize, inputExtraSize, inputEncoderLength);
        const outputEncoderCapacity = inputEncoderCapacity;
        const outputEncoderLength = _detectors_detector__WEBPACK_IMPORTED_MODULE_4__.SpeedyPipelineNodeKeypointDetector.encoderLength(outputEncoderCapacity, outputDescriptorSize, outputExtraSize);

        const tex = this._tex[this._tex.length - 1];
        return (gpu.programs.keypoints.allocateDescriptors
            .outputs(outputEncoderLength, outputEncoderLength, tex)
        )(inputEncodedKeypoints, inputDescriptorSize, inputExtraSize, inputEncoderLength, outputDescriptorSize, outputExtraSize, outputEncoderLength);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/descriptors/orb.js":
/*!**************************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/descriptors/orb.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeORBKeypointDescriptor": () => (/* binding */ SpeedyPipelineNodeORBKeypointDescriptor)
/* harmony export */ });
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
 * orb.js
 * ORB descriptors
 */












// Constants
const DESCRIPTOR_SIZE = 32; // 256 bits

/**
 * ORB descriptors
 */
class SpeedyPipelineNodeORBKeypointDescriptor extends _descriptor__WEBPACK_IMPORTED_MODULE_9__.SpeedyPipelineNodeKeypointDescriptor
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 3, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)('image').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image).satisfying(
                ( /** @type {SpeedyPipelineMessageWithImage} */ msg ) =>
                    msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_5__.ImageFormat.GREY
            ),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)('keypoints').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints),
        ]);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('keypoints').read() );
        const image = ( /** @type {SpeedyPipelineMessageWithImage} */ ( this.input('image').read() ) ).image;
        const tex = this._tex;
        const outputTexture = this._tex[2];

        // compute orientation
        const capacity = _detectors_detector__WEBPACK_IMPORTED_MODULE_8__.SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        const orientationEncoderLength = Math.max(1, Math.ceil(Math.sqrt(capacity))); // 1 pixel per keypoint
        const encodedOrientations = (gpu.programs.keypoints.orbOrientation
            .outputs(orientationEncoderLength, orientationEncoderLength, tex[0])
        )(image, encodedKeypoints, descriptorSize, extraSize, encoderLength);
        const orientedKeypoints = (gpu.programs.keypoints.transferOrientation
            .outputs(encoderLength, encoderLength, tex[1])
        )(encodedOrientations, encodedKeypoints, descriptorSize, extraSize, encoderLength);

        // allocate space
        const encodedKps = this._allocateDescriptors(gpu, descriptorSize, extraSize, DESCRIPTOR_SIZE, extraSize, orientedKeypoints);
        const newEncoderLength = encodedKps.width;

        // compute descriptors (it's a good idea to blur the image)
        const describedKeypoints = (gpu.programs.keypoints.orbDescriptor
            .outputs(newEncoderLength, newEncoderLength, outputTexture)
        )(image, encodedKps, extraSize, newEncoderLength);

        // done!
        this.output().swrite(describedKeypoints, DESCRIPTOR_SIZE, extraSize, newEncoderLength);
    }
}


/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/detectors/detector.js":
/*!*****************************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/detectors/detector.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeKeypointDetector": () => (/* binding */ SpeedyPipelineNodeKeypointDetector),
/* harmony export */   "SpeedyPipelineNodeMultiscaleKeypointDetector": () => (/* binding */ SpeedyPipelineNodeMultiscaleKeypointDetector)
/* harmony export */ });
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
 * detector.js
 * Abstract keypoint detectors
 */










// Constants
const MAX_CAPACITY = _utils_globals__WEBPACK_IMPORTED_MODULE_7__.MAX_ENCODER_CAPACITY; // maximum capacity of the encoder (up to this many keypoints can be stored)
const DEFAULT_CAPACITY = _utils_globals__WEBPACK_IMPORTED_MODULE_7__.DEFAULT_ENCODER_CAPACITY; // default capacity of the encoder
const DEFAULT_SCALE_FACTOR = 1.4142135623730951; // sqrt(2)
const NUMBER_OF_RGBA16_TEXTURES = 2;

// legacy constants
const NUMBER_OF_INTERNAL_TEXTURES = 0; //5; // number of internal textures used to encode the keypoints
const ENCODER_PASSES = 4; // number of passes of the keypoint encoder: directly impacts performance
const LONG_SKIP_OFFSET_PASSES = 2; // number of passes of the long skip offsets shader

/**
 * Abstract keypoint detector
 * @abstract
 */
class SpeedyPipelineNodeKeypointDetector extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     * @param {number} [texCount] number of work textures
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = undefined, texCount = 0, portBuilders = undefined)
    {
        super(name, texCount + NUMBER_OF_INTERNAL_TEXTURES, portBuilders);

        /** @type {number} encoder capacity */
        this._capacity = DEFAULT_CAPACITY; // must not be greater than MAX_ENCODER_CAPACITY

        /** @type {GLint} auxiliary storage */
        this._oldWrapS = 0;

        /** @type {SpeedyDrawableTexture[]} textures with 8-bytes per pixel */
        this._tex16 = new Array(NUMBER_OF_RGBA16_TEXTURES).fill(null);
    }

    /**
     * Initialize this node
     * @param {SpeedyGPU} gpu
     */
    init(gpu)
    {
        // initialize
        super.init(gpu);

        // encodeKeypointSkipOffsets() relies on this
        this._oldWrapS = this._setupSpecialTexture(gpu.gl.TEXTURE_WRAP_S, gpu.gl.REPEAT);

        // allocate RGBA16 textures
        this._allocateTex16(gpu);
        gpu.subscribe(this._allocateTex16, this, gpu);
    }

    /**
     * Release this node
     * @param {SpeedyGPU} gpu
     */
    release(gpu)
    {
        // deallocate RGBA16 textures
        gpu.unsubscribe(this._allocateTex16, this);
        this._deallocateTex16(gpu);

        // we need to restore the texture parameter because textures come from a pool!
        this._setupSpecialTexture(gpu.gl.TEXTURE_WRAP_S, this._oldWrapS);

        // release
        super.release(gpu);
    }

    /**
     * Set a parameter of the special texture
     * @param {GLenum} pname
     * @param {GLint} param new value
     * @returns {GLint} old value of param
     */
    _setupSpecialTexture(pname, param)
    {
        if(NUMBER_OF_INTERNAL_TEXTURES == 0)
            return;

        // legacy code
        const texture = this._tex[this._tex.length - 1];
        const gl = texture.gl;

        gl.bindTexture(gl.TEXTURE_2D, texture.glTexture);
        const oldval = gl.getTexParameter(gl.TEXTURE_2D, pname);
        gl.texParameteri(gl.TEXTURE_2D, pname, param);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return oldval;
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
        const encoderCapacity = this._capacity;
        const encoderLength = SpeedyPipelineNodeKeypointDetector.encoderLength(encoderCapacity, descriptorSize, extraSize);
        const width = 1 << (Math.ceil(Math.log2(corners.width * corners.height)) >>> 1); // power of two
        const height = Math.ceil(corners.width * corners.height / width); // probabilistic approach in Parallel Ale Sort 2D
        //const width = corners.width, height = corners.height; // independent texture reads approach in Parallel Ale Sort 2D
        const maxSize = Math.max(width, height);
        const keypoints = gpu.programs.keypoints;

        // prepare programs
        keypoints.initLookupTable.outputs(width, height, this._tex16[1]);
        keypoints.sortLookupTable.outputs(width, height, this._tex16[0], this._tex16[1]);
        keypoints.encodeKeypoints.outputs(encoderLength, encoderLength, encodedKeypoints);

        // compute lookup table
        let lookupTable = keypoints.initLookupTable(corners);
        for(let b = 1; b < maxSize; b *= 2)
            lookupTable = keypoints.sortLookupTable(lookupTable, b, width, height);

        /*
        // debug: view texture
        const lookupView = (keypoints.viewLookupTable.outputs(
            width, height, this._tex[0]
        ))(lookupTable);
        const canvas = gpu.renderToCanvas(lookupView);
        if(!this._ww) document.body.appendChild(canvas);
        this._ww = 1;
        */

        // encode keypoints
        return keypoints.encodeKeypoints(corners, lookupTable, width, descriptorSize, extraSize, encoderLength, encoderCapacity);
    }

    _encodeKeypointsOLD(gpu, corners, encodedKeypoints, descriptorSize = 0, extraSize = 0)
    {
        const capacity = this._capacity;
        const encoderLength = SpeedyPipelineNodeKeypointDetector.encoderLength(capacity, descriptorSize, extraSize);
        const width = corners.width, height = corners.height;
        const imageSize = [ width, height ];
        const tex = this._tex.slice(this._tex.length - NUMBER_OF_INTERNAL_TEXTURES); // array of internal textures
        const keypoints = gpu.programs.keypoints;
        const specialTexture = tex.pop(); // gl.TEXTURE_WRAP_S is set to gl.REPEAT

        // prepare programs
        keypoints.encodeKeypointSkipOffsets.outputs(width, height, tex[0]);
        keypoints.encodeKeypointLongSkipOffsets.outputs(width, height, tex[1], tex[0]);
        keypoints.encodeKeypointPositions.outputs(encoderLength, encoderLength, tex[2], tex[3]);
        keypoints.encodeKeypointProperties.outputs(encoderLength, encoderLength, encodedKeypoints);

        // copy the input corners to a special texture
        // that is needed by encodeKeypointSkipOffsets()
        corners = (gpu.programs.utils.copy
            .outputs(width, height, specialTexture)
        )(corners);

        // encode skip offsets
        let offsets = keypoints.encodeKeypointSkipOffsets(corners, imageSize);
        for(let i = 0; i < LONG_SKIP_OFFSET_PASSES; i++) { // to boost performance
            // the maximum skip offset of pass p=1,2,3... is 7 * (1+m)^p,
            // where m = MAX_ITERATIONS of encodeKeypointLongSkipOffsets()
            offsets = keypoints.encodeKeypointLongSkipOffsets(offsets, imageSize); // **bottleneck**
        }

        /*
        // debug: view corners
        let cornerview = offsets;
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
        return keypoints.encodeNullKeypoints();
    }

    /**
     * Allocate RGBA16 textures
     * @param {SpeedyGPU} gpu
     */
    _allocateTex16(gpu)
    {
        const gl = gpu.gl;

        // RGBA16UI is color renderable according to the OpenGL ES 3 spec
        for(let i = 0; i < this._tex16.length; i++)
            this._tex16[i] = new _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__.SpeedyDrawableTexture(gl, 1, 1, gl.RGBA_INTEGER, gl.RGBA16UI, gl.UNSIGNED_SHORT, gl.NEAREST, gl.CLAMP_TO_EDGE);
    }

    /**
     * Deallocate RGBA16 textures
     * @param {SpeedyGPU} gpu
     */
    _deallocateTex16(gpu)
    {
        for(let i = 0; i < this._tex16.length; i++)
            this._tex16[i] = this._tex16[i].release();
    }

    /**
     * Compute the length of the keypoint encoder, given its capacity
     * @param {number} encoderCapacity how many keypoints can we fit?
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     */
    static encoderLength(encoderCapacity, descriptorSize, extraSize)
    {
        const pixelsPerKeypoint = Math.ceil((_utils_globals__WEBPACK_IMPORTED_MODULE_7__.MIN_KEYPOINT_SIZE + descriptorSize + extraSize) / 4);
        const numberOfPixels = encoderCapacity * pixelsPerKeypoint;

        return Math.max(_utils_globals__WEBPACK_IMPORTED_MODULE_7__.MIN_ENCODER_LENGTH, Math.ceil(Math.sqrt(numberOfPixels)));
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
        const pixelsPerKeypoint = Math.ceil((_utils_globals__WEBPACK_IMPORTED_MODULE_7__.MIN_KEYPOINT_SIZE + descriptorSize + extraSize) / 4);
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeFASTKeypointDetector": () => (/* binding */ SpeedyPipelineNodeFASTKeypointDetector)
/* harmony export */ });
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
 * fast.js
 * FAST corner detector
 */












// Constants
const DEFAULT_THRESHOLD = 20;



/**
 * FAST corner detector
 */
class SpeedyPipelineNodeFASTKeypointDetector extends _detector__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNodeMultiscaleKeypointDetector
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 5, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image).satisfying(
                ( /** @type {SpeedyPipelineMessageWithImage} */ msg ) =>
                    msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_5__.ImageFormat.GREY
            ),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints),
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
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
        const width = image.width, height = image.height;
        const tex = this._tex;
        const capacity = this._capacity;
        const threshold = this._threshold;
        const lodStep = Math.log2(this.scaleFactor);
        const levels = this.levels;

        // validate pyramid
        if(!(levels == 1 || image.hasMipmaps()))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalOperationError(`Expected a pyramid in ${this.fullName}`);

        // skip if the capacity is zero
        if(capacity == 0) {
            const encodedKeypoints = this._encodeZeroKeypoints(gpu, tex[4]);
            const encoderLength = encodedKeypoints.width;
            this.output().swrite(encodedKeypoints, 0, 0, encoderLength);
            return;
        }

        // FAST
        gpu.programs.keypoints.fast9_16.outputs(width, height, tex[0], tex[1]);
        gpu.programs.keypoints.nonmaxSpace.outputs(width, height, tex[2]);
        let corners = tex[1].clear();
        let numPasses = Math.max(1, Math.min(levels, (_utils_globals__WEBPACK_IMPORTED_MODULE_9__.PYRAMID_MAX_LEVELS / lodStep) | 0));
        for(let lod = lodStep * (numPasses - 1); numPasses-- > 0; lod -= lodStep) {
            corners = gpu.programs.keypoints.fast9_16(corners, image, lod, threshold);
            //corners = gpu.programs.keypoints.nonmaxSpace(corners); // see below*
        }

        // Same-scale non-maximum suppression
        // *nicer results inside the loop; faster outside
        // Hard to notice a difference when using FAST
        corners = gpu.programs.keypoints.nonmaxSpace(corners);

        // Multi-scale non-maximum suppression
        // (doesn't seem to remove many keypoints)
        if(levels > 1) {
            corners = (gpu.programs.keypoints.nonmaxScaleSimple
                .outputs(width, height, tex[1])
            )(corners, image, lodStep);
        }

        // encode keypoints
        let encodedKeypoints = this._encodeKeypoints(gpu, corners, tex[3]);
        const encoderLength = encodedKeypoints.width;

        // scale refinement
        if(levels > 1) {
            encodedKeypoints = (gpu.programs.keypoints.refineScaleFAST916
                .outputs(encoderLength, encoderLength, tex[4])
            )(image, lodStep, encodedKeypoints, 0, 0, encoderLength, threshold);
        }

        // done!
        this.output().swrite(encodedKeypoints, 0, 0, encoderLength);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/detectors/harris.js":
/*!***************************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/detectors/harris.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeHarrisKeypointDetector": () => (/* binding */ SpeedyPipelineNodeHarrisKeypointDetector)
/* harmony export */ });
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
 * harris.js
 * Harris corner detector
 */













/** Window size helper */
const HARRIS = Object.freeze({
    1: 'harris1',
    3: 'harris3',
    5: 'harris5',
    7: 'harris7',
});

/**
 * Harris corner detector
 */
class SpeedyPipelineNodeHarrisKeypointDetector extends _detector__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNodeMultiscaleKeypointDetector
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 6, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image).satisfying(
                ( /** @type {SpeedyPipelineMessageWithImage} */ msg ) =>
                    msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_5__.ImageFormat.GREY
            ),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints),
        ]);

        /** @type {SpeedySize} neighborhood size */
        this._windowSize = new _speedy_size__WEBPACK_IMPORTED_MODULE_6__.SpeedySize(3, 3);

        /** @type {number} min corner quality in [0,1] */
        this._quality = 0.1;
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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.IllegalArgumentError(`Invalid window: ${windowSize}. Acceptable sizes: 1x1, 3x3, 5x5, 7x7`);

        this._windowSize = windowSize;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
        const width = image.width, height = image.height;
        const capacity = this._capacity;
        const quality = this._quality;
        const windowSize = this._windowSize.width;
        const levels = this.levels;
        const lodStep = Math.log2(this.scaleFactor);
        const intFactor = levels > 1 ? this.scaleFactor : 1;
        const harris = gpu.programs.keypoints[HARRIS[windowSize]];
        const tex = this._tex;

        // validate pyramid
        if(!(levels == 1 || image.hasMipmaps()))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.IllegalOperationError(`Expected a pyramid in ${this.fullName}`);

        // skip if the capacity is zero
        if(capacity == 0) {
            const encodedKeypoints = this._encodeZeroKeypoints(gpu, tex[5]);
            const encoderLength = encodedKeypoints.width;
            this.output().swrite(encodedKeypoints, 0, 0, encoderLength);
            return;
        }

        // compute corner response map
        harris.outputs(width, height, tex[0], tex[1]);
        gpu.programs.utils.sobelDerivatives.outputs(width, height, tex[2]);
        gpu.programs.keypoints.nonmaxSpace.outputs(width, height, tex[3]);
        let corners = tex[1].clear();
        let numPasses = Math.max(1, Math.min(levels, (_utils_globals__WEBPACK_IMPORTED_MODULE_10__.PYRAMID_MAX_LEVELS / lodStep) | 0));
        for(let lod = lodStep * (numPasses - 1); numPasses-- > 0; lod -= lodStep) {
            const gaussian = _utils_utils__WEBPACK_IMPORTED_MODULE_7__.Utils.gaussianKernel(intFactor * (1 + lod), windowSize);
            const derivatives = gpu.programs.utils.sobelDerivatives(image, lod);
            corners = harris(corners, image, derivatives, lod, lodStep, gaussian);
            corners = gpu.programs.keypoints.nonmaxSpace(corners); // see below*
        }

        // Same-scale non-maximum suppression
        // *performs better inside the loop
        //corners = gpu.programs.keypoints.nonmaxSpace(corners);

        // Multi-scale non-maximum suppression
        // (doesn't seem to remove many keypoints)
        if(levels > 1) {
            const laplacian = (gpu.programs.keypoints.laplacian
                .outputs(width, height, tex[0])
            )(corners, image, lodStep, 0);

            corners = (gpu.programs.keypoints.nonmaxScale
                .outputs(width, height, tex[2])
            )(corners, image, laplacian, lodStep);
        }

        // find the maximum corner response over the entire image
        gpu.programs.keypoints.harrisScoreFindMax.outputs(width, height, tex[0], tex[1]);
        numPasses = Math.ceil(Math.log2(Math.max(width, height)));
        let maxScore = corners;
        for(let j = 0; j < numPasses; j++)
            maxScore = gpu.programs.keypoints.harrisScoreFindMax(maxScore, j);

        // discard corners below a quality level
        corners = (gpu.programs.keypoints.harrisScoreCutoff
            .outputs(width, height, maxScore == tex[0] ? tex[1] : tex[0])
        )(corners, maxScore, quality);

        // encode keypoints
        let encodedKeypoints = this._encodeKeypoints(gpu, corners, tex[4]);
        const encoderLength = encodedKeypoints.width;

        // scale refinement
        if(levels > 1) {
            encodedKeypoints = (gpu.programs.keypoints.refineScaleLoG
                .outputs(encoderLength, encoderLength, tex[5])
            )(image, lodStep, encodedKeypoints, 0, 0, encoderLength);
        }

        // done!
        this.output().swrite(encodedKeypoints, 0, 0, encoderLength);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/distance-filter.js":
/*!**************************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/distance-filter.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeKeypointDistanceFilter": () => (/* binding */ SpeedyPipelineNodeKeypointDistanceFilter)
/* harmony export */ });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _speedy_matrix__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../speedy-matrix */ "./src/core/speedy-matrix.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/globals */ "./src/utils/globals.js");
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
 * distance-filter.js
 * Given a set of pairs of keypoints, discard all pairs whose distance is
 * above a user-defined threshold. Useful for bidirectional optical-flow.
 */













/**
 * Given a set of pairs of keypoints, discard all pairs whose distance is
 * above a user-defined threshold. Useful for bidirectional optical-flow.
 * 
 * The pairs of keypoints are provided as two separate sets, "in" and
 * "reference". Keypoints that are kept will have their data extracted
 * from the "in" set.
 */
class SpeedyPipelineNodeKeypointDistanceFilter extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)('in').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)('reference').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints)
        ]);

        /** @type {number} maximum accepted distance */
        this._threshold = _utils_globals__WEBPACK_IMPORTED_MODULE_9__.MAX_TEXTURE_LENGTH + 1;
    }

    /**
     * Maximum accepted distance
     * @returns {number}
     */
    get threshold()
    {
        return this._threshold;
    }

    /**
     * Maximum accepted distance
     * @param {number} value
     */
    set threshold(value)
    {
        this._threshold = Math.max(0, +value);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const set0 = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('in').read() );
        const set1 = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('reference').read() );
        const threshold = this._threshold;

        // validate shapes
        if(set0.descriptorSize != set1.descriptorSize || set0.extraSize != set1.extraSize)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.IllegalOperationError(`The distance filter requires two compatible shapes of keypoint streams`);

        // calculate the shape of the output
        const outputTexture = this._tex[0];
        const encoderLength = Math.max(set0.encoderLength, set1.encoderLength);
        const descriptorSize = set0.descriptorSize;
        const extraSize = set0.extraSize;

        // apply the distance filter
        (gpu.programs.keypoints.distanceFilter
            .outputs(encoderLength, encoderLength, outputTexture)
        )(set0.encodedKeypoints, set0.encoderLength, set1.encodedKeypoints, set1.encoderLength, descriptorSize, extraSize, encoderLength, threshold);

        // done!
        this.output().swrite(outputTexture, descriptorSize, extraSize, encoderLength);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/hamming-distance-filter.js":
/*!**********************************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/hamming-distance-filter.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeKeypointHammingDistanceFilter": () => (/* binding */ SpeedyPipelineNodeKeypointHammingDistanceFilter)
/* harmony export */ });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _speedy_matrix__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../speedy-matrix */ "./src/core/speedy-matrix.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/globals */ "./src/utils/globals.js");
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
 * hamming-distance-filter.js
 * Given a set of pairs of keypoints, discard all pairs whose hamming
 * distance (of descriptor) is above a user-defined threshold
 */












/** @type {Object<number,string>} Program names */
const PROGRAM_NAME = {
    32: 'hammingDistanceFilter32',
    64: 'hammingDistanceFilter64',
};


/**
 * Given a set of pairs of keypoints, discard all pairs whose hamming
 * distance (of descriptor) is above a user-defined threshold
 * 
 * The pairs of keypoints are provided as two separate sets, "in" and
 * "reference". Keypoints that are kept will have their data extracted
 * from the "in" set.
 */
class SpeedyPipelineNodeKeypointHammingDistanceFilter extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)('in').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints).satisfying(
                ( /** @type {SpeedyPipelineMessageWithKeypoints} */ msg ) =>
                    msg.descriptorSize > 0
            ),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)('reference').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints).satisfying(
                ( /** @type {SpeedyPipelineMessageWithKeypoints} */ msg ) =>
                    msg.descriptorSize > 0
            ),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints)
        ]);

        /** @type {number} distance threshold, an integer */
        this._threshold = _utils_globals__WEBPACK_IMPORTED_MODULE_9__.MAX_DESCRIPTOR_SIZE * 8; // convert from bytes to bits
    }

    /**
     * Distance threshold, an integer
     * @returns {number}
     */
    get threshold()
    {
        return this._threshold;
    }

    /**
     * Distance threshold, an integer
     * @param {number} value
     */
    set threshold(value)
    {
        this._threshold = Math.max(0, value | 0);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const set0 = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('in').read() );
        const set1 = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('reference').read() );
        const threshold = this._threshold;

        // validate shapes
        if(set0.descriptorSize != set1.descriptorSize || set0.extraSize != set1.extraSize)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.IllegalOperationError(`The Hamming distance filter requires two compatible shapes of keypoint streams`);

        // validate descriptor size
        if(!Object.prototype.hasOwnProperty.call(PROGRAM_NAME, set0.descriptorSize))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.NotSupportedError(`Hamming distance filter - invalid descriptor size: ${set0.descriptorSize}`);

        // calculate the shape of the output
        const outputTexture = this._tex[0];
        const encoderLength = Math.max(set0.encoderLength, set1.encoderLength);
        const descriptorSize = set0.descriptorSize;
        const extraSize = set0.extraSize;

        // apply the distance filter
        const program = PROGRAM_NAME[set0.descriptorSize];
        (gpu.programs.keypoints[program]
            .outputs(encoderLength, encoderLength, outputTexture)
        )(set0.encodedKeypoints, set0.encoderLength, set1.encodedKeypoints, set1.encoderLength, descriptorSize, extraSize, encoderLength, threshold);

        // done!
        this.output().swrite(outputTexture, descriptorSize, extraSize, encoderLength);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/matchers/bf-knn.js":
/*!**************************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/matchers/bf-knn.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeBruteForceKNNKeypointMatcher": () => (/* binding */ SpeedyPipelineNodeBruteForceKNNKeypointMatcher)
/* harmony export */ });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _detectors_detector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../detectors/detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * bf-knn.js
 * Brute Force KNN Keypoint Matcher
 */











/** @type {Object<number,string>} program name indexed by descriptor size */
const PROGRAM_NAME = {
    32: 'bfMatcher32',
    64: 'bfMatcher64',
};

/**
 * Brute Force KNN Keypoint Matcher. Make sure to use a Keypoint Clipper before
 * invoking this (use a database of 50 keypoints or so - your mileage may vary)
 */
class SpeedyPipelineNodeBruteForceKNNKeypointMatcher extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 6, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)('keypoints').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints).satisfying(
                ( /** @type {SpeedyPipelineMessageWithKeypoints} */ msg ) =>
                    msg.descriptorSize > 0
            ),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)('database').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints).satisfying(
                ( /** @type {SpeedyPipelineMessageWithKeypoints} */ msg ) =>
                    msg.descriptorSize > 0
            ),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.KeypointMatches),
        ]);

        /** @type {number} number of matches per keypoint (the "k" of knn) */
        this._matchesPerKeypoint = 1;
    }

    /**
     * Number of matches per keypoint
     * @returns {number}
     */
    get k()
    {
        return this._matchesPerKeypoint;
    }

    /**
     * Number of matches per keypoint
     * @param {number} value
     */
    set k(value)
    {
        this._matchesPerKeypoint = Math.max(1, value | 0);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('keypoints').read() );
        const database = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('database').read() );
        const candidatesA = this._tex[0];
        const candidatesB = this._tex[1];
        const candidatesC = this._tex[2];
        const encodedFiltersA = this._tex[3];
        const encodedMatchesA = this._tex[4];
        const encodedMatchesB = this._tex[5];
        const matchesPerKeypoint = this._matchesPerKeypoint;
        const keypoints = gpu.programs.keypoints;

        // validate parameters
        if(descriptorSize !== database.descriptorSize)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalArgumentError(`Incompatible descriptors in ${this.fullName}`);
        else if(!Object.prototype.hasOwnProperty.call(PROGRAM_NAME, descriptorSize))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.NotSupportedError(`Unsupported descriptor size (${descriptorSize}) in ${this.fullName}`);

        // prepare the brute force matching
        const bfMatcher = keypoints[PROGRAM_NAME[descriptorSize]];
        const capacity = _detectors_detector__WEBPACK_IMPORTED_MODULE_3__.SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        const dbCapacity = _detectors_detector__WEBPACK_IMPORTED_MODULE_3__.SpeedyPipelineNodeKeypointDetector.encoderCapacity(database.descriptorSize, database.extraSize, database.encoderLength);
        const numberOfKeypointsPerPass = bfMatcher.definedConstant('NUMBER_OF_KEYPOINTS_PER_PASS');
        const numberOfPasses = Math.ceil(dbCapacity / numberOfKeypointsPerPass);
        const partialMatcherLength = Math.max(1, Math.ceil(Math.sqrt(capacity)));
        const matcherLength = Math.max(1, Math.ceil(Math.sqrt(capacity * matchesPerKeypoint)));
        keypoints.bfMatcherTransfer.outputs(matcherLength, matcherLength, encodedMatchesA, encodedMatchesB);
        keypoints.bfMatcherInitCandidates.outputs(partialMatcherLength, partialMatcherLength, candidatesC);
        keypoints.bfMatcherInitFilters.outputs(partialMatcherLength, partialMatcherLength, encodedFiltersA);
        bfMatcher.outputs(partialMatcherLength, partialMatcherLength, candidatesA, candidatesB);

        // match keypoints
        let encodedMatches = encodedMatchesB.clear(); // will hold all best matches
        let encodedFilters = keypoints.bfMatcherInitFilters();
        for(let k = 0; k < matchesPerKeypoint; k++) {
            let encodedPartialMatches = keypoints.bfMatcherInitCandidates(); // hold the (k+1)-th best matches

            // find the (k+1)-th best match
            for(let passId = 0; passId < numberOfPasses; passId++) {
                encodedPartialMatches = bfMatcher(
                    encodedPartialMatches, encodedFilters, partialMatcherLength,
                    database.encodedKeypoints, database.descriptorSize, database.extraSize, database.encoderLength,
                    encodedKeypoints, descriptorSize, extraSize, encoderLength,
                    passId
                );
                gpu.gl.flush();
            }

            // copy the (k+1)-th best match to the filter
            if(matchesPerKeypoint > 1)
                encodedPartialMatches.copyTo(encodedFilters);

            // aggregate matches
            encodedMatches = keypoints.bfMatcherTransfer(
                encodedMatches, encodedPartialMatches, matchesPerKeypoint, k
            );
        }

        // done!
        this.output().swrite(encodedMatches, matchesPerKeypoint);
    }
}


/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/matchers/lsh-knn.js":
/*!***************************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/matchers/lsh-knn.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeLSHKNNMatcher": () => (/* binding */ SpeedyPipelineNodeLSHKNNMatcher)
/* harmony export */ });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _detectors_detector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../detectors/detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_lsh__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../gpu/speedy-lsh */ "./src/gpu/speedy-lsh.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * lsh-knn.js
 * K approximate nearest neighbors matcher
 */












/** @typedef {'fastest' | 'default' | 'demanding'} LSHKNNQualityLevel quality of the approximate matching */

/** @type {number} how many neighbors to search for, by default */
const DEFAULT_K = 1;

/** @type {LSHKNNQualityLevel} default quality level */
const DEFAULT_QUALITY = 'default';

/** @type {{ [key in LSHKNNQualityLevel]: number }} maps quality level to bit swaps */
const NUMBER_OF_BIT_SWAPS = {
    'fastest': 0,
    'default': 1,
    'demanding': 2,
};

/** @type {object} program names indexed as LSH_KNN[descriptorSize][hashSize][level] */
const LSH_KNN = (fd => _gpu_speedy_lsh__WEBPACK_IMPORTED_MODULE_5__.LSH_ACCEPTABLE_DESCRIPTOR_SIZES.reduce((o,d) => ((o[d] = fd(d)), o), {}))(
    d => ((fh => _gpu_speedy_lsh__WEBPACK_IMPORTED_MODULE_5__.LSH_ACCEPTABLE_HASH_SIZES.reduce((o,h) => ((o[h] = fh(h)), o), {}))(
        h => ((fl => [0,1,2].reduce((o,l) => ((o[l] = fl(l)), o), {}))(
            l => `lshKnn${d}h${h}lv${l}`
        ))
    ))
);



/**
 * K approximate nearest neighbors matcher
 */
class SpeedyPipelineNodeLSHKNNMatcher extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 6, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)('keypoints').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints).satisfying(
                ( /** @type {SpeedyPipelineMessageWithKeypoints} */ msg ) =>
                    msg.descriptorSize > 0
            ),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)('lsh').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.LSHTables),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.KeypointMatches),
        ]);

        /** @type {number} how many neighbors do you want? */
        this._k = DEFAULT_K;

        /** @type {LSHKNNQualityLevel} quality of the matching */
        this._quality = DEFAULT_QUALITY;
    }

    /**
     * How many neighbors do you want?
     * @returns {number}
     */
    get k()
    {
        return this._k;
    }

    /**
     * How many neighbors do you want?
     * @param {number} k number of neighbors
     */
    set k(k)
    {
        this._k = Math.max(1, k | 0);
    }

    /**
     * Quality of the matching
     * @returns {LSHKNNQualityLevel}
     */
    get quality()
    {
        return this._quality;
    }

    /**
     * Quality of the matching
     * @param {LSHKNNQualityLevel} quality
     */
    set quality(quality)
    {
        if(!Object.prototype.hasOwnProperty.call(NUMBER_OF_BIT_SWAPS, quality))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.IllegalArgumentError(`Invalid quality level: "${quality}"`);

        this._quality = quality;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('keypoints').read() );
        /** @type {SpeedyLSH} */ const lsh = this.input('lsh').read().lsh;
        const keypoints = gpu.programs.keypoints;
        const tables = lsh.tables;
        const descriptorDB = lsh.descriptorDB;
        const tablesStride = tables.width;
        const descriptorDBStride = descriptorDB.width;
        const tableCount = lsh.tableCount;
        const hashSize = lsh.hashSize;
        const bucketCapacity = lsh.bucketCapacity;
        const bucketsPerTable = lsh.bucketsPerTable;
        const sequences = lsh.sequences;
        const candidatesA = this._tex[0];
        const candidatesB = this._tex[1];
        const candidatesC = this._tex[2];
        const filters = this._tex[3];
        const transferA = this._tex[4];
        const transferB = this._tex[5];
        const level = NUMBER_OF_BIT_SWAPS[this._quality];
        const matchesPerKeypoint = this._k;

        // validate parameters
        if(descriptorSize !== lsh.descriptorSize)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.IllegalArgumentError(`Can't match different types of descriptors in ${this.fullName}`);

        _utils_utils__WEBPACK_IMPORTED_MODULE_7__.Utils.assert(LSH_KNN[descriptorSize] != undefined);
        _utils_utils__WEBPACK_IMPORTED_MODULE_7__.Utils.assert(LSH_KNN[descriptorSize][hashSize] != undefined);
        _utils_utils__WEBPACK_IMPORTED_MODULE_7__.Utils.assert(LSH_KNN[descriptorSize][hashSize][level] != undefined);

        // configure the output texture
        const capacity = _detectors_detector__WEBPACK_IMPORTED_MODULE_3__.SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        const matcherLength = Math.max(1, Math.ceil(Math.sqrt(capacity * matchesPerKeypoint)));
        let encodedMatches = transferB;
        keypoints.lshKnnTransfer.outputs(matcherLength, matcherLength, transferA, transferB);

        // prepare the LSH matching
        const kthMatcherLength = Math.max(1, Math.ceil(Math.sqrt(capacity)));
        keypoints.lshKnnInitCandidates.outputs(kthMatcherLength, kthMatcherLength, candidatesA);
        keypoints.lshKnnInitFilters.outputs(kthMatcherLength, kthMatcherLength, filters);

        const lshKnn = keypoints[LSH_KNN[descriptorSize][hashSize][level]];
        lshKnn.outputs(kthMatcherLength, kthMatcherLength, candidatesB, candidatesC);
        lshKnn.setUBO('LSHSequences', sequences);

        // match keypoints
        encodedMatches.clear();
        keypoints.lshKnnInitFilters();
        for(let i = 0; i < matchesPerKeypoint; i++) {
            // find the (i+1)-th best match
            let candidates = keypoints.lshKnnInitCandidates();
            for(let tableIndex = 0; tableIndex < tableCount; tableIndex++) {
                candidates = lshKnn(candidates, filters, kthMatcherLength, tables, descriptorDB, tableIndex, bucketCapacity, bucketsPerTable, tablesStride, descriptorDBStride, encodedKeypoints, descriptorSize, extraSize, encoderLength);
                gpu.gl.flush();
            }
            candidates.copyTo(filters);

            // transfer matches to an encoded matches texture
            encodedMatches = keypoints.lshKnnTransfer(encodedMatches, candidates, matchesPerKeypoint, i);
        }

        // done
        this.output().swrite(encodedMatches, matchesPerKeypoint);

        /*
        // debug
        let data = this._inspect32(filters), debug = [];
        for(let i = 0; i < data.length; i++) {
            const bits = MATCH_INDEX_BITS;
            const mask = (1 << bits) - 1;
            const u32 = data[i];
            const index = u32 & mask, distance = u32 >>> bits;
            //debug.push('|'+[ u32 ].toString());
            debug.push('|'+[ index, distance ].toString());
        }
        console.log(debug.join(','));
        */
    }
}


/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/matchers/lsh-static-tables.js":
/*!*************************************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/matchers/lsh-static-tables.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeStaticLSHTables": () => (/* binding */ SpeedyPipelineNodeStaticLSHTables)
/* harmony export */ });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _speedy_keypoint__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../speedy-keypoint */ "./src/core/speedy-keypoint.js");
/* harmony import */ var _speedy_keypoint_descriptor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../speedy-keypoint-descriptor */ "./src/core/speedy-keypoint-descriptor.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _gpu_speedy_lsh__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../gpu/speedy-lsh */ "./src/gpu/speedy-lsh.js");
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
 * lsh-static-tables.js
 * Static LSH tables
 */















/**
 * Static LSH tables
 */
class SpeedyPipelineNodeStaticLSHTables extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineSourceNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 2, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.LSHTables)
        ]);

        /** @type {SpeedyKeypoint[]} "training" keypoints */
        this._keypoints = [];

        /** @type {SpeedyKeypoint[]} internal copy of the "training" keypoints */
        this._keypointsCopy = [];

        /** @type {number} number of tables in the LSH data structure */
        this._numberOfTables = _gpu_speedy_lsh__WEBPACK_IMPORTED_MODULE_10__.LSH_DEFAULT_NUMBER_OF_TABLES;

        /** @type {number} number of bits of a hash */
        this._hashSize = _gpu_speedy_lsh__WEBPACK_IMPORTED_MODULE_10__.LSH_DEFAULT_HASH_SIZE;

        /** @type {SpeedyLSH|null} LSH data structure */
        this._lsh = null;
    }

    /**
     * "Training" keypoints
     * @returns {SpeedyKeypoint[]}
     */
    get keypoints()
    {
        return this._keypoints;
    }

    /**
     * "Training" keypoints
     * @param {SpeedyKeypoint[]} keypoints
     */
    set keypoints(keypoints)
    {
        if(!Array.isArray(keypoints) || keypoints.find(keypoint => !(keypoint instanceof _speedy_keypoint__WEBPACK_IMPORTED_MODULE_3__.SpeedyKeypoint)))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalArgumentError(`Static LSH tables: an invalid set of keypoints has been provided`);

        if(this._keypoints !== keypoints) {
            this._keypoints = keypoints; // update internal pointer
            this._keypointsCopy = keypoints.slice(0); // clone the array, so it won't be modified externally
            this._lsh = null; // (re)train the model
        }
    }

    /**
     * Number of tables in the LSH data structure
     * @returns {number}
     */
    get numberOfTables()
    {
        return this._numberOfTables;
    }

    /**
     * Number of tables in the LSH data structure
     * @param {number} n
     */
    set numberOfTables(n)
    {
        if(!_gpu_speedy_lsh__WEBPACK_IMPORTED_MODULE_10__.LSH_ACCEPTABLE_NUMBER_OF_TABLES.includes(n))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalArgumentError(`Invalid number of tables: ${n}. Acceptable values: ${_gpu_speedy_lsh__WEBPACK_IMPORTED_MODULE_10__.LSH_ACCEPTABLE_NUMBER_OF_TABLES.join(', ')}`);

        if(n !== this._numberOfTables) {
            this._numberOfTables = n | 0;
            this._lsh = null; // need to retrain the model
        }
    }

    /**
     * Number of bits of a hash
     * @returns {number}
     */
    get hashSize()
    {
        return this._hashSize;
    }

    /**
     * Number of bits of a hash
     * @param {number} h
     */
    set hashSize(h)
    {
        if(!_gpu_speedy_lsh__WEBPACK_IMPORTED_MODULE_10__.LSH_ACCEPTABLE_HASH_SIZES.includes(h))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalArgumentError(`Invalid hash size: ${h}. Acceptable values: ${_gpu_speedy_lsh__WEBPACK_IMPORTED_MODULE_10__.LSH_ACCEPTABLE_HASH_SIZES.join(', ')}`);

        if(h !== this._hashSize) {
            this._hashSize = h | 0;
            this._lsh = null; // need to retrain the model
        }
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        // Need to train the model?
        if(this._lsh == null) {
            // internal work textures are only available after initialization,
            // i.e., after calling this._init()
            this._lsh = this._train();
        }

        // Pass it forward
        this.output().swrite(this._lsh);
    }

    /**
     * Train the model
     * @returns {SpeedyLSH}
     */
    _train()
    {
        const keypoints = this._keypointsCopy;
        const numberOfTables = this._numberOfTables;
        const hashSize = this._hashSize;

        if(keypoints.find(keypoint => keypoint.descriptor == null))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalOperationError(`Static LSH tables: can't train the model with no keypoint descriptors!`);

        const descriptors = keypoints.map(keypoint => keypoint.descriptor.data);
        const lshTables = this._tex[0];
        const descriptorDB = this._tex[1];

        return new _gpu_speedy_lsh__WEBPACK_IMPORTED_MODULE_10__.SpeedyLSH(lshTables, descriptorDB, descriptors, numberOfTables, hashSize);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/mixer.js":
/*!****************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/mixer.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeKeypointMixer": () => (/* binding */ SpeedyPipelineNodeKeypointMixer)
/* harmony export */ });
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
 * mixer.js
 * Keypoint Mixer
 */












/**
 * Keypoint Mixer: merges two sets of keypoints
 */
class SpeedyPipelineNodeKeypointMixer extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 5, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.InputPort)('in0').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.InputPort)('in1').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints)
        ]);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const kps0 = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('in0').read() );
        const kps1 = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('in1').read() );
        const descriptorSize = kps0.descriptorSize;
        const extraSize = kps0.extraSize;
        const keypoints = gpu.programs.keypoints;
        const tex = this._tex;

        // ensure that the format of kps0 equals the format of kps1
        if(!(kps0.descriptorSize === kps1.descriptorSize && kps0.extraSize === kps0.extraSize))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalOperationError(`Can't merge two sets of keypoints that have different formats`);

        // find the capacity of kps0 + kps1
        const cap0 = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodeKeypointDetector.encoderCapacity(kps0.descriptorSize, kps0.extraSize, kps0.encoderLength);
        const cap1 = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodeKeypointDetector.encoderCapacity(kps1.descriptorSize, kps1.extraSize, kps1.encoderLength);
        const capacity = cap0 + cap1;

        // find the dimensions of the output texture
        const encoderLength = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodeKeypointDetector.encoderLength(capacity, descriptorSize, extraSize);
        const mixEncoderLength = Math.max(1, Math.ceil(Math.sqrt(capacity)));

        // prepare programs
        keypoints.mixKeypointsPreInit.outputs(encoderLength, encoderLength, tex[0]);
        keypoints.mixKeypointsInit.outputs(mixEncoderLength, mixEncoderLength, tex[1]);
        keypoints.mixKeypointsSort.outputs(mixEncoderLength, mixEncoderLength, tex[2], tex[3]);
        keypoints.mixKeypointsApply.outputs(encoderLength, encoderLength, tex[4]);

        // mix keypoints
        let mixedKeypoints = keypoints.mixKeypointsPreInit(
            kps0.encodedKeypoints, kps1.encodedKeypoints,
            kps0.encoderLength, kps1.encoderLength,
            cap0, cap1,
            descriptorSize,
            extraSize,
            encoderLength
        );

        let sortedKeypoints = keypoints.mixKeypointsInit(
            mixedKeypoints, descriptorSize, extraSize, encoderLength, capacity
        );

        for(let b = 1; b < capacity; b *= 2)
            sortedKeypoints = keypoints.mixKeypointsSort(sortedKeypoints, b);

        mixedKeypoints = keypoints.mixKeypointsApply(
            sortedKeypoints, mixedKeypoints, descriptorSize, extraSize, encoderLength
        );

        /*
        // debug: view keypoints
        keypoints.mixKeypointsView.outputs(mixEncoderLength, mixEncoderLength, tex[1]);
        this._visualize(gpu, keypoints.mixKeypointsView(sortedKeypoints));
        */

        this.output().swrite(mixedKeypoints, descriptorSize, extraSize, encoderLength);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/multiplexer.js":
/*!**********************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/multiplexer.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeKeypointMultiplexer": () => (/* binding */ SpeedyPipelineNodeKeypointMultiplexer)
/* harmony export */ });
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
 * multiplexer.js
 * Keypoint multiplexer
 */











/** @type {string[]} the names of the input ports indexed by their number */
const INPUT_PORT = [ 'in0', 'in1' ];

/**
 * Keypoint multiplexer
 */
class SpeedyPipelineNodeKeypointMultiplexer extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 0, [
            ...(INPUT_PORT.map(portName => (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)(portName).expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints))),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints),
        ]);

        /** @type {number} which port should be linked to the output? */
        this._port = 0;
    }

    /**
     * The number of the port that should be linked to the output
     * @returns {number}
     */
    get port()
    {
        return this._port;
    }

    /**
     * The number of the port that should be linked to the output
     * @param {number} port
     */
    set port(port)
    {
        if(port < 0 || port >= INPUT_PORT.length)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalArgumentError(`Invalid port: ${port}`);

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

/***/ "./src/core/pipeline/nodes/keypoints/portal.js":
/*!*****************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/portal.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeKeypointPortalSink": () => (/* binding */ SpeedyPipelineNodeKeypointPortalSink),
/* harmony export */   "SpeedyPipelineNodeKeypointPortalSource": () => (/* binding */ SpeedyPipelineNodeKeypointPortalSource)
/* harmony export */ });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _detectors_detector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./detectors/detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * portal.js
 * Keypoint Portals
 */













/**
 * A sink of a Keypoint Portal
 * This is not a pipeline sink - it doesn't export any data!
 */
class SpeedyPipelineNodeKeypointPortalSink extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints),
        ]);

        /** @type {number} descriptor size, in bytes */
        this._descriptorSize = 0;

        /** @type {number} extra size, in bytes */
        this._extraSize = 0;

        /** @type {number} extra size */
        this._encoderLength = 0;

        /** @type {boolean} is this node initialized? */
        this._initialized = false;
    }

    /**
     * Encoded keypoints
     * @returns {SpeedyTexture}
     */
    get encodedKeypoints()
    {
        if(!this._initialized)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalOperationError(`Portal error: ${this.fullName} holds no data`);

        return this._tex[0];
    }

    /**
     * Descriptor size, in bytes
     * @returns {number}
     */
    get descriptorSize()
    {
        if(!this._initialized)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalOperationError(`Portal error: ${this.fullName} holds no data`);

        return this._descriptorSize;
    }

    /**
     * Extra size, in bytes
     * @returns {number}
     */
    get extraSize()
    {
        if(!this._initialized)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalOperationError(`Portal error: ${this.fullName} holds no data`);

        return this._extraSize;
    }

    /**
     * Encoder length
     * @returns {number}
     */
    get encoderLength()
    {
        if(!this._initialized)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalOperationError(`Portal error: ${this.fullName} holds no data`);

        return this._encoderLength;
    }

    /**
     * Initializes this node
     * @param {SpeedyGPU} gpu
     */
    init(gpu)
    {
        super.init(gpu);

        const encoderLength = _detectors_detector__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineNodeKeypointDetector.encoderLength(0, 0, 0);
        this._tex[0].resize(encoderLength, encoderLength).clearToColor(1,1,1,1); // initial texture
        this._descriptorSize = this._extraSize = 0;
        this._encoderLength = encoderLength;

        this._initialized = true;
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
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input().read() );
        const tex = this._tex[0];

        // copy input
        tex.resize(encodedKeypoints.width, encodedKeypoints.height);
        encodedKeypoints.copyTo(tex);
        this._descriptorSize = descriptorSize;
        this._extraSize = extraSize;
        this._encoderLength = encoderLength;
    }
}



/**
 * A source of a Keypoint Portal
 */
class SpeedyPipelineNodeKeypointPortalSource extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineSourceNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 0, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints),
        ]);

        /** @type {SpeedyPipelineNodeKeypointPortalSink|null} portal sink */
        this._source = null;
    }

    /**
     * Data source
     * @returns {SpeedyPipelineNodeKeypointPortalSink|null}
     */
    get source()
    {
        return this._source;
    }

    /**
     * Data source
     * @param {SpeedyPipelineNodeKeypointPortalSink|null} node
     */
    set source(node)
    {
        if(node !== null && !(node instanceof SpeedyPipelineNodeKeypointPortalSink))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalArgumentError(`Incompatible source for ${this.fullName}`);

        this._source = node;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        if(this._source == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalOperationError(`${this.fullName} has no source`);

        this.output().swrite(this._source.encodedKeypoints, this._source.descriptorSize, this._source.extraSize, this._source.encoderLength);
    }
}


/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/shuffler.js":
/*!*******************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/shuffler.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeKeypointShuffler": () => (/* binding */ SpeedyPipelineNodeKeypointShuffler)
/* harmony export */ });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _detectors_detector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./detectors/detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * shuffler.js
 * Keypoint Shuffler
 */










/**
 * The Keypoint Shuffler shuffles a list of keypoints
 */
class SpeedyPipelineNodeKeypointShuffler extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 6, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints)
        ]);

        /** @type {number} maximum number of keypoints */
        this._maxKeypoints = Number.NaN;
    }

    /**
     * Maximum number of keypoints (optional)
     * @returns {number}
     */
    get maxKeypoints()
    {
        return this._maxKeypoints;
    }

    /**
     * Maximum number of keypoints (optional)
     * @param {number} value
     */
    set maxKeypoints(value)
    {
        if(!Number.isNaN(value))
            this._maxKeypoints = Math.max(0, value | 0);
        else
            this._maxKeypoints = Number.NaN;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        let { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input().read() );
        const capacity = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        const maxKeypoints = this._maxKeypoints;

        // shuffle the keypoints (including nulls)
        const permutationMaxLength = gpu.programs.keypoints.shuffle.definedConstant('PERMUTATION_MAXLEN');
        const permutationLength = Math.min(permutationMaxLength, capacity);
        const permutation = this._generatePermutation(permutationLength, permutationMaxLength);
        encodedKeypoints = (gpu.programs.keypoints.shuffle
            .setUBO('Permutation', permutation)
            .outputs(encoderLength, encoderLength, this._tex[0])
        )(encodedKeypoints, descriptorSize, extraSize, encoderLength);

        // sort the keypoints
        gpu.programs.keypoints.mixKeypointsInit.outputs(encoderLength, encoderLength, this._tex[1]);
        gpu.programs.keypoints.mixKeypointsSort.outputs(encoderLength, encoderLength, this._tex[2], this._tex[3]);
        gpu.programs.keypoints.mixKeypointsApply.outputs(encoderLength, encoderLength, this._tex[4]);

        let sortedKeypoints = gpu.programs.keypoints.mixKeypointsInit(
            encodedKeypoints, descriptorSize, extraSize, encoderLength, capacity
        );

        for(let b = 1; b < capacity; b *= 2)
            sortedKeypoints = gpu.programs.keypoints.mixKeypointsSort(sortedKeypoints, b);

        encodedKeypoints = gpu.programs.keypoints.mixKeypointsApply(
            sortedKeypoints, encodedKeypoints, descriptorSize, extraSize, encoderLength
        );

        // clip the output?
        if(!Number.isNaN(maxKeypoints) && maxKeypoints < capacity) {
            const newEncoderLength = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodeKeypointDetector.encoderLength(maxKeypoints, descriptorSize, extraSize);
            encodedKeypoints = (gpu.programs.keypoints.clip
                .outputs(newEncoderLength, newEncoderLength, this._tex[5])
            )(encodedKeypoints, descriptorSize, extraSize, encoderLength, maxKeypoints);
            encoderLength = newEncoderLength;
        }

        // done!
        this.output().swrite(encodedKeypoints, descriptorSize, extraSize, encoderLength);
    }

    /**
     * Generate a permutation p of { 0, 1, ..., n-1 } such that p(p(x)) = x for all x
     * @param {number} n positive integer
     * @param {number} [bufsize] size of the output array
     * @returns {Int32Array} permutation
     */
    _generatePermutation(n, bufsize = n)
    {
        const array = new Int32Array(bufsize);
        const p = array.subarray(0, n).fill(-1);
        const q = _utils_utils__WEBPACK_IMPORTED_MODULE_5__.Utils.shuffle(_utils_utils__WEBPACK_IMPORTED_MODULE_5__.Utils.range(n));

        for(let i = 0, j = 0; i < n; i++) {
            if(p[i] < 0) {
                do { p[i] = q[j++]; } while(p[i] < i);
                p[p[i]] = i;
            }
        }

        return array; // padded with zeros
    }
}


/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/sink.js":
/*!***************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/sink.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeKeypointSink": () => (/* binding */ SpeedyPipelineNodeKeypointSink),
/* harmony export */   "SpeedyPipelineNodeTrackedKeypointSink": () => (/* binding */ SpeedyPipelineNodeTrackedKeypointSink),
/* harmony export */   "SpeedyPipelineNodeMatchedKeypointSink": () => (/* binding */ SpeedyPipelineNodeMatchedKeypointSink)
/* harmony export */ });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _detectors_detector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./detectors/detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture_reader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../gpu/speedy-texture-reader */ "./src/gpu/speedy-texture-reader.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _speedy_media__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../speedy-media */ "./src/core/speedy-media.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _speedy_keypoint__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../speedy-keypoint */ "./src/core/speedy-keypoint.js");
/* harmony import */ var _speedy_keypoint_descriptor__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../speedy-keypoint-descriptor */ "./src/core/speedy-keypoint-descriptor.js");
/* harmony import */ var _speedy_keypoint_match__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../speedy-keypoint-match */ "./src/core/speedy-keypoint-match.js");
/* harmony import */ var _speedy_vector__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../speedy-vector */ "./src/core/speedy-vector.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../utils/globals */ "./src/utils/globals.js");
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
 * sink.js
 * Gets keypoints out of the pipeline
 */



















/** next power of 2 */
const nextPot = x => x > 1 ? 1 << Math.ceil(Math.log2(x)) : 1;

/** empty array of bytes */
const ZERO_BYTES = new Uint8Array([]);


/**
 * Gets keypoints out of the pipeline
 * @template {SpeedyKeypoint} T
 * @abstract
 */
class SpeedyPipelineNodeAbstractKeypointSink extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineSinkNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     * @param {number} [texCount]
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders]
     */
    constructor(name = 'keypoints', texCount = 0, portBuilders = [])
    {
        super(name, texCount + 2, portBuilders);

        /** @type {Array<T|null>} keypoints (output) */
        this._keypoints = [];

        /** @type {SpeedyTextureReader} texture reader */
        this._textureReader = new _gpu_speedy_texture_reader__WEBPACK_IMPORTED_MODULE_5__.SpeedyTextureReader();

        /** @type {number} page flipping index */
        this._page = 0;

        /** @type {boolean} accelerate GPU-CPU transfers */
        this._turbo = false;

        /** @type {boolean} should discarded keypoints be exported as null or dropped altogether? */
        this._includeDiscarded = false;
    }

    /**
     * Accelerate GPU-CPU transfers
     * @returns {boolean}
     */
    get turbo()
    {
        return this._turbo;
    }

    /**
     * Accelerate GPU-CPU transfers
     * @param {boolean} value
     */
    set turbo(value)
    {
        this._turbo = Boolean(value);
    }

    /**
     * Should discarded keypoints be exported as null or dropped altogether?
     * @returns {boolean}
     */
    get includeDiscarded()
    {
        return this._includeDiscarded;
    }

    /**
     * Should discarded keypoints be exported as null or dropped altogether?
     * @param {boolean} value
     */
    set includeDiscarded(value)
    {
        this._includeDiscarded = Boolean(value);
    }

    /**
     * Initializes this node
     * @param {SpeedyGPU} gpu
     */
    init(gpu)
    {
        super.init(gpu);
        this._textureReader.init(gpu);
    }

    /**
     * Releases this node
     * @param {SpeedyGPU} gpu
     */
    release(gpu)
    {
        this._textureReader.release(gpu);
        super.release(gpu);
    }

    /**
     * Export data from this node to the user
     * @returns {SpeedyPromise<Array<T|null>>}
     */
    export()
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_11__.SpeedyPromise.resolve(this._keypoints);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input().read() );
        return this._download(gpu, encodedKeypoints, descriptorSize, extraSize, encoderLength);
    }

    /**
     * Download and decode keypoints from the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyDrawableTexture} encodedKeypoints
     * @param {number} descriptorSize
     * @param {number} extraSize
     * @param {number} encoderLength
     * @returns {SpeedyPromise<void>}
     */
    _download(gpu, encodedKeypoints, descriptorSize, extraSize, encoderLength)
    {
        const useBufferedDownloads = this._turbo;

        /*

        I have found experimentally that, in Firefox, readPixelsAsync()
        performs MUCH better if the width of the target texture is a power
        of two. I have no idea why this is the case, nor if it's related to
        some interaction with the GL drivers, somehow. This seems to make no
        difference on Chrome, however. In any case, let's convert the input
        texture to POT.

        */
        const encoderWidth = nextPot(encoderLength);
        //const encoderHeight = nextPot(Math.ceil(encoderLength * encoderLength / encoderWidth));
        const encoderHeight = Math.ceil(encoderLength * encoderLength / encoderWidth);
        //const encoderWidth=encoderLength,encoderHeight=encoderLength;

        // copy the set of keypoints to an internal texture
        const copiedTexture = this._tex[(this._tex.length - 1) - this._page];
        (gpu.programs.utils.copyKeypoints
            .outputs(encoderWidth, encoderHeight, copiedTexture)
        )(encodedKeypoints);

        // flip page
        this._page = 1 - this._page;

        // download the internal texture
        return this._textureReader.readPixelsAsync(copiedTexture, 0, 0, copiedTexture.width, copiedTexture.height, useBufferedDownloads).then(pixels => {

            // decode the keypoints and store them in this._keypoints
            this._keypoints = this._decode(pixels, descriptorSize, extraSize, encoderWidth, encoderHeight);

        });
    }

    /**
     * Decode a sequence of keypoints, given a flattened image of encoded pixels
     * @param {Uint8Array} pixels pixels in the [r,g,b,a,...] format
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderWidth
     * @param {number} encoderHeight
     * @returns {Array<T|null>} keypoints
     */
    _decode(pixels, descriptorSize, extraSize, encoderWidth, encoderHeight)
    {
        const bytesPerKeypoint = _utils_globals__WEBPACK_IMPORTED_MODULE_16__.MIN_KEYPOINT_SIZE + descriptorSize + extraSize;
        const m = _utils_globals__WEBPACK_IMPORTED_MODULE_16__.LOG2_PYRAMID_MAX_SCALE, h = _utils_globals__WEBPACK_IMPORTED_MODULE_16__.PYRAMID_MAX_LEVELS;
        const piOver255 = Math.PI / 255.0;
        const keypoints = /** @type {Array<T|null>} */ ( [] );
        const includeDiscarded = this._includeDiscarded;
        let descriptorBytes = ZERO_BYTES, extraBytes = ZERO_BYTES;
        let x, y, z, w, lod, rotation, score;
        let keypoint;

        // validate
        if(descriptorSize % 4 != 0 || extraSize % 4 != 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_10__.IllegalArgumentError(`Invalid descriptorSize (${descriptorSize}) / extraSize (${extraSize})`);

        // how many bytes should we read?
        const e2 = encoderWidth * encoderHeight * 4;
        const size = pixels.byteLength;
        if(size != e2)
            _utils_utils__WEBPACK_IMPORTED_MODULE_8__.Utils.warning(`Expected ${e2} bytes when decoding a set of keypoints, found ${size}`);

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
            if(x == 0xFFFF && y == 0xFFFF)
                break;

            // the header is zero: discard the keypoint
            if(x + y + z + w == 0) {
                if(includeDiscarded)
                    keypoints.push(null);
                continue;
            }

            // extract extra & descriptor bytes
            if(extraSize > 0) {
                extraBytes = pixels.subarray(8 + i, 8 + i + extraSize);
                if(extraBytes.byteLength < extraSize) {
                    _utils_utils__WEBPACK_IMPORTED_MODULE_8__.Utils.warning(`KeypointSink: expected ${extraSize} extra bytes when decoding the ${i/bytesPerKeypoint}-th keypoint, found ${extraBytes.byteLength} instead`);
                    continue; // something is off here; discard
                }
            }
            if(descriptorSize > 0) {
                descriptorBytes = pixels.subarray(8 + i + extraSize, 8 + i + extraSize + descriptorSize);
                if(descriptorBytes.byteLength < descriptorSize) {
                    _utils_utils__WEBPACK_IMPORTED_MODULE_8__.Utils.warning(`KeypointSink: expected ${descriptorSize} descriptor bytes when decoding the ${i/bytesPerKeypoint}-th keypoint, found ${descriptorBytes.byteLength} instead`);
                    continue; // something is off here; discard
                }
            }

            // decode position: convert from fixed-point
            x /= _utils_globals__WEBPACK_IMPORTED_MODULE_16__.FIX_RESOLUTION;
            y /= _utils_globals__WEBPACK_IMPORTED_MODULE_16__.FIX_RESOLUTION;

            // decode level-of-detail
            lod = (pixels[i+4] < 255) ? -m + ((m + h) * pixels[i+4]) / 255.0 : 0.0;

            // decode orientation
            rotation = (2 * pixels[i+5] - 255) * piOver255;

            // decode score
            score = _utils_utils__WEBPACK_IMPORTED_MODULE_8__.Utils.decodeFloat16(w);

            // create keypoint
            keypoint = this._createKeypoint(x, y, lod, rotation, score, descriptorBytes, extraBytes);

            // register keypoint
            keypoints.push(keypoint);
        }

        // done!
        return keypoints;
    }

    /**
     * Instantiate a new keypoint
     * @param {number} x
     * @param {number} y
     * @param {number} lod
     * @param {number} rotation
     * @param {number} score
     * @param {Uint8Array} descriptorBytes
     * @param {Uint8Array} extraBytes
     * @returns {T}
     */
    _createKeypoint(x, y, lod, rotation, score, descriptorBytes, extraBytes)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_10__.AbstractMethodError();
    }

    /**
     * Allocate extra soace
     * @param {SpeedyGPU} gpu
     * @param {SpeedyDrawableTexture} output output texture
     * @param {SpeedyTexture} inputEncodedKeypoints input with no extra space
     * @param {number} inputDescriptorSize in bytes, must be positive
     * @param {number} inputExtraSize must be 0
     * @param {number} outputDescriptorSize must be inputDescriptorSize
     * @param {number} outputExtraSize in bytes, must be positive and a multiple of 4
     * @returns {SpeedyDrawableTexture} encodedKeypoints with extra space
     */
    _allocateExtra(gpu, output, inputEncodedKeypoints, inputDescriptorSize, inputExtraSize, outputDescriptorSize, outputExtraSize)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_8__.Utils.assert(inputExtraSize === 0);
        _utils_utils__WEBPACK_IMPORTED_MODULE_8__.Utils.assert(outputDescriptorSize === inputDescriptorSize && outputExtraSize > 0 && outputExtraSize % 4 === 0);

        const inputEncoderLength = inputEncodedKeypoints.width;
        const inputEncoderCapacity = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodeKeypointDetector.encoderCapacity(inputDescriptorSize, inputExtraSize, inputEncoderLength);
        const outputEncoderCapacity = inputEncoderCapacity;
        const outputEncoderLength = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodeKeypointDetector.encoderLength(outputEncoderCapacity, outputDescriptorSize, outputExtraSize);

        return (gpu.programs.keypoints.allocateExtra
            .outputs(outputEncoderLength, outputEncoderLength, output)
        )(inputEncodedKeypoints, inputDescriptorSize, inputExtraSize, inputEncoderLength, outputDescriptorSize, outputExtraSize, outputEncoderLength);
    }
}

/**
 * Gets standard keypoints out of the pipeline
 * @extends {SpeedyPipelineNodeAbstractKeypointSink<SpeedyKeypoint>}
 */
class SpeedyPipelineNodeKeypointSink extends SpeedyPipelineNodeAbstractKeypointSink
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = 'keypoints')
    {
        super(name, 0, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints)
        ]);
    }

    /**
     * Instantiate a new keypoint
     * @param {number} x
     * @param {number} y
     * @param {number} lod
     * @param {number} rotation
     * @param {number} score
     * @param {Uint8Array} descriptorBytes
     * @param {Uint8Array} extraBytes
     * @returns {SpeedyKeypoint}
     */
    _createKeypoint(x, y, lod, rotation, score, descriptorBytes, extraBytes)
    {
        const descriptorSize = descriptorBytes.byteLength;

        // read descriptor, if any
        const descriptor = descriptorSize > 0 ? new _speedy_keypoint_descriptor__WEBPACK_IMPORTED_MODULE_13__.SpeedyKeypointDescriptor(descriptorBytes) : null;

        // create keypoint
        return new _speedy_keypoint__WEBPACK_IMPORTED_MODULE_12__.SpeedyKeypoint(x, y, lod, rotation, score, descriptor);
    }
}

/**
 * Gets tracked keypoints out of the pipeline
 * @extends {SpeedyPipelineNodeAbstractKeypointSink<SpeedyTrackedKeypoint>}
 */
class SpeedyPipelineNodeTrackedKeypointSink extends SpeedyPipelineNodeAbstractKeypointSink
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = 'keypoints')
    {
        super(name, 2, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints).satisfying(
                ( /** @type {SpeedyPipelineMessageWithKeypoints} */ msg ) =>
                    msg.extraSize == 0
            ),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.InputPort)('flow').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Vector2)
        ]);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input().read() );
        const { vectors } = /** @type {SpeedyPipelineMessageWith2DVectors} */ ( this.input('flow').read() );

        // allocate extra space
        const newDescriptorSize = descriptorSize;
        const newExtraSize = 4; // 1 pixel per flow vector per keypoint
        const encodedKeypointsWithExtraSpace = this._allocateExtra(gpu, this._tex[0], encodedKeypoints, descriptorSize, extraSize, newDescriptorSize, newExtraSize);

        // attach flow vectors
        const newEncoderLength = encodedKeypointsWithExtraSpace.width;
        const newEncodedKeypoints = (gpu.programs.keypoints.transferToExtra
            .outputs(newEncoderLength, newEncoderLength, this._tex[1])
        )(vectors, vectors.width, encodedKeypointsWithExtraSpace, newDescriptorSize, newExtraSize, newEncoderLength);

        // done!
        return this._download(gpu, newEncodedKeypoints, newDescriptorSize, newExtraSize, newEncoderLength);
    }

    /**
     * Instantiate a new keypoint
     * @param {number} x
     * @param {number} y
     * @param {number} lod
     * @param {number} rotation
     * @param {number} score
     * @param {Uint8Array} descriptorBytes
     * @param {Uint8Array} extraBytes
     * @returns {SpeedyTrackedKeypoint}
     */
    _createKeypoint(x, y, lod, rotation, score, descriptorBytes, extraBytes)
    {
        const descriptorSize = descriptorBytes.byteLength;
        const extraSize = extraBytes.byteLength;

        // read descriptor, if any
        const descriptor = descriptorSize > 0 ? new _speedy_keypoint_descriptor__WEBPACK_IMPORTED_MODULE_13__.SpeedyKeypointDescriptor(descriptorBytes) : null;

        // read flow vector
        const fx = _utils_utils__WEBPACK_IMPORTED_MODULE_8__.Utils.decodeFloat16((extraBytes[1] << 8) | extraBytes[0]);
        const fy = _utils_utils__WEBPACK_IMPORTED_MODULE_8__.Utils.decodeFloat16((extraBytes[3] << 8) | extraBytes[2]);
        const flow = new _speedy_vector__WEBPACK_IMPORTED_MODULE_15__.SpeedyVector2(fx, fy);

        // create keypoint
        return new _speedy_keypoint__WEBPACK_IMPORTED_MODULE_12__.SpeedyTrackedKeypoint(x, y, lod, rotation, score, descriptor, flow);
    }
}

/**
 * Gets matched keypoints out of the pipeline
 * @extends SpeedyPipelineNodeAbstractKeypointSink<SpeedyMatchedKeypoint>
 */
class SpeedyPipelineNodeMatchedKeypointSink extends SpeedyPipelineNodeAbstractKeypointSink
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = 'keypoints')
     {
        super(name, 2, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints).satisfying(
                ( /** @type {SpeedyPipelineMessageWithKeypoints} */ msg ) =>
                    msg.extraSize == 0
            ),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.InputPort)('matches').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.KeypointMatches)
        ]);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input().read() );
        const { encodedMatches, matchesPerKeypoint } = /** @type {SpeedyPipelineMessageWithKeypointMatches} */ ( this.input('matches').read() );

        // allocate space for the matches
        const newDescriptorSize = descriptorSize;
        const newExtraSize = matchesPerKeypoint * 4; // 4 bytes per pixel
        const encodedKeypointsWithExtraSpace = this._allocateExtra(gpu, this._tex[0], encodedKeypoints, descriptorSize, extraSize, newDescriptorSize, newExtraSize);

        // transfer matches to a new texture
        const newEncoderLength = encodedKeypointsWithExtraSpace.width;
        const newEncodedKeypoints = (gpu.programs.keypoints.transferToExtra
            .outputs(newEncoderLength, newEncoderLength, this._tex[1])
        )(encodedMatches, encodedMatches.width, encodedKeypointsWithExtraSpace, newDescriptorSize, newExtraSize, newEncoderLength);

        // done!
        return this._download(gpu, newEncodedKeypoints, newDescriptorSize, newExtraSize, newEncoderLength);
    }

    /**
     * Instantiate a new keypoint
     * @param {number} x
     * @param {number} y
     * @param {number} lod
     * @param {number} rotation
     * @param {number} score
     * @param {Uint8Array} descriptorBytes
     * @param {Uint8Array} extraBytes
     * @returns {SpeedyMatchedKeypoint}
     */
    _createKeypoint(x, y, lod, rotation, score, descriptorBytes, extraBytes)
    {
        const descriptorSize = descriptorBytes.byteLength;
        const extraSize = extraBytes.byteLength;

        // read descriptor, if any
        const descriptor = descriptorSize > 0 ? new _speedy_keypoint_descriptor__WEBPACK_IMPORTED_MODULE_13__.SpeedyKeypointDescriptor(descriptorBytes) : null;

        // decode matches
        const matchesPerKeypoint = extraSize / 4;
        const matches = /** @type {SpeedyKeypointMatch[]} */ ( new Array(matchesPerKeypoint) );
        for(let matchIndex = 0; matchIndex < matchesPerKeypoint; matchIndex++) {
            const base = matchIndex * 4;
            const u32 = extraBytes[base] | (extraBytes[base+1] << 8) | (extraBytes[base+2] << 16) | (extraBytes[base+3] << 24);
            const match = new _speedy_keypoint_match__WEBPACK_IMPORTED_MODULE_14__.SpeedyKeypointMatch(u32 & _utils_globals__WEBPACK_IMPORTED_MODULE_16__.MATCH_INDEX_MASK, u32 >>> _utils_globals__WEBPACK_IMPORTED_MODULE_16__.MATCH_INDEX_BITS);

            matches[matchIndex] = match;
        }

        // done!
        return new _speedy_keypoint__WEBPACK_IMPORTED_MODULE_12__.SpeedyMatchedKeypoint(x, y, lod, rotation, score, descriptor, matches);
    }
}


/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/source.js":
/*!*****************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/source.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeKeypointSource": () => (/* binding */ SpeedyPipelineNodeKeypointSource)
/* harmony export */ });
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
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../utils/globals */ "./src/utils/globals.js");
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
class SpeedyPipelineNodeKeypointSource extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineSourceNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 2, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints)
        ]);

        /** @type {SpeedyKeypoint[]} keypoints to be uploaded to the GPU */
        this._keypoints = [];

        /** @type {Float32Array} upload buffer (UBO) */
        this._buffer = SpeedyPipelineNodeKeypointSource._createUploadBuffer(BUFFER_SIZE);

        /** @type {number} maximum number of keypoints */
        this._capacity = _utils_globals__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_ENCODER_CAPACITY;
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
        if(!Array.isArray(keypoints))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_7__.IllegalArgumentError(`Not an array of keypoints`);

        this._keypoints = keypoints;
    }

    /**
     * The maximum number of keypoints we'll accept.
     * This should be a tight bound for better performance.
     * @returns {number}
     */
    get capacity()
    {
        return this._capacity;
    }

    /**
     * The maximum number of keypoints we'll accept.
     * This should be a tight bound for better performance.
     * @param {number} capacity
     */
    set capacity(capacity)
    {
        this._capacity = Math.min(Math.max(0, capacity | 0), _utils_globals__WEBPACK_IMPORTED_MODULE_10__.MAX_ENCODER_CAPACITY);
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
        const maxKeypoints = this._capacity;
        const numKeypoints = Math.min(keypoints.length, maxKeypoints);
        const numPasses = Math.max(1, Math.ceil(numKeypoints / BUFFER_SIZE));
        const buffer = this._buffer;
        const uploadKeypoints = gpu.programs.keypoints.uploadKeypoints;
        const encoderLength = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodeKeypointDetector.encoderLength(maxKeypoints, descriptorSize, extraSize); // we're using maxKeypoints to avoid constant texture resize (slow on Firefox)

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

        _utils_utils__WEBPACK_IMPORTED_MODULE_6__.Utils.assert(internalBuffer.byteLength <= UBO_MAX_BYTES);

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
            const hasPos = keypoint.position !== undefined;
            const j = i * 4;

            // Format data as follows:
            // vec4(xpos, ypos, lod, score)
            buffer[j]   = +(hasPos ? keypoint.position.x : keypoint.x) || 0;
            buffer[j+1] = +(hasPos ? keypoint.position.y : keypoint.y) || 0;
            buffer[j+2] = +(keypoint.lod) || 0;
            buffer[j+3] = +(keypoint.score) || 0;
        }

        // done!
        return buffer;
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/subpixel.js":
/*!*******************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/subpixel.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeKeypointSubpixelRefiner": () => (/* binding */ SpeedyPipelineNodeKeypointSubpixelRefiner)
/* harmony export */ });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _detectors_detector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./detectors/detector */ "./src/core/pipeline/nodes/keypoints/detectors/detector.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
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
 * subpixel.js
 * Subpixel refinement of keypoint location
 */












/** @typedef {"quadratic1d"|"taylor2d"|"bicubic-upsample"|"bilinear-upsample"} SubpixelRefinementMethod */

/** @const {Object<SubpixelRefinementMethod,string>} method name to program name */
const METHOD2PROGRAM = Object.freeze({
    'quadratic1d': 'subpixelQuadratic1d',
    'taylor2d': 'subpixelTaylor2d',
    'bicubic-upsample': 'subpixelBicubic',
    'bilinear-upsample': 'subpixelBilinear',
});

/**
 * Subpixel refinement of keypoint location
 */
class SpeedyPipelineNodeKeypointSubpixelRefiner extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 2, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.InputPort)('image').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Image).satisfying(
                ( /** @type {SpeedyPipelineMessageWithImage} */ msg ) =>
                    msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_6__.ImageFormat.GREY
            ),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.InputPort)('keypoints').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.OutputPort)('displacements').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Vector2),
        ]);

        /** @type {SubpixelRefinementMethod} subpixel refinement method */
        this._method = 'quadratic1d';

        /** @type {number} max iterations for the upsampling methods */
        this._maxIterations = 6;

        /** @type {number} convergence threshold for the upsampling methods */
        this._epsilon = 0.1;
    }

    /**
     * Subpixel refinement method
     * @returns {SubpixelRefinementMethod}
     */
    get method()
    {
        return this._method;
    }

    /**
     * Subpixel refinement method
     * @param {SubpixelRefinementMethod} name
     */
    set method(name)
    {
        if(!Object.prototype.hasOwnProperty.call(METHOD2PROGRAM, name))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.IllegalArgumentError(`Invalid method: "${name}"`);

        this._method = name;
    }

    /**
     * Max. iterations for the upsampling methods
     * @returns {number}
     */
    get maxIterations()
    {
        return this._maxIterations;
    }

    /**
     * Max. iterations for the upsampling methods
     * @param {number} value
     */
    set maxIterations(value)
    {
        this._maxIterations = Math.max(0, +value);
    }

    /**
     * Convergence threshold for the upsampling methods
     * @returns {number}
     */
    get epsilon()
    {
        return this._epsilon;
    }

    /**
     * Convergence threshold for the upsampling methods
     * @param {number} value
     */
    set epsilon(value)
    {
        this._epsilon = Math.max(0, +value);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('keypoints').read() );
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input('image').read() );
        const tex = this._tex;
        const program = METHOD2PROGRAM[this._method];
        const maxIterations = this._maxIterations;
        const epsilon = this._epsilon;

        // note: if you detected the keypoints using a pyramid,
        //       you need to pass that pyramid as input!

        // we'll compute the offsets for each keypoint
        const capacity = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        const offsetEncoderLength = Math.max(1, Math.ceil(Math.sqrt(capacity))); // 1 pixel per refinement offset
        const offsets = (gpu.programs.keypoints[program]
            .outputs(offsetEncoderLength, offsetEncoderLength, tex[0])
        )(image, encodedKeypoints, descriptorSize, extraSize, encoderLength, maxIterations, epsilon);

        // apply the offsets to the keypoints
        const refinedKeypoints = (gpu.programs.keypoints.transferFlow
            .outputs(encoderLength, encoderLength, tex[1])
        )(offsets, encodedKeypoints, descriptorSize, extraSize, encoderLength);

        // done!
        this.output().swrite(refinedKeypoints, descriptorSize, extraSize, encoderLength);
        this.output('displacements').swrite(offsets);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/trackers/lk.js":
/*!**********************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/trackers/lk.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeLKKeypointTracker": () => (/* binding */ SpeedyPipelineNodeLKKeypointTracker)
/* harmony export */ });
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
 * lk.js
 * LK optical-flow
 */














// Constants
const DEFAULT_WINDOW_SIZE = new _speedy_size__WEBPACK_IMPORTED_MODULE_7__.SpeedySize(11, 11); // nice on mobile?
const DEFAULT_DEPTH = Math.min(3, _utils_globals__WEBPACK_IMPORTED_MODULE_11__.PYRAMID_MAX_LEVELS);
const DEFAULT_NUMBER_OF_ITERATIONS = 30;
const DEFAULT_DISCARD_THRESHOLD = 0.0001;
const DEFAULT_EPSILON = 0.01;
const LK_PROGRAM = {
    3: 'lk3',
    5: 'lk5',
    7: 'lk7',
    9: 'lk9',
    11: 'lk11',
    13: 'lk13',
    15: 'lk15',
    17: 'lk17',
    19: 'lk19',
    21: 'lk21',
};


/**
 * LK optical-flow
 */
class SpeedyPipelineNodeLKKeypointTracker extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 3, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.InputPort)('previousImage').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Image).satisfying(
                ( /** @type {SpeedyPipelineMessageWithImage} */ msg ) =>
                    msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_6__.ImageFormat.GREY
            ),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.InputPort)('nextImage').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Image).satisfying(
                ( /** @type {SpeedyPipelineMessageWithImage} */ msg ) =>
                    msg.format === _utils_types__WEBPACK_IMPORTED_MODULE_6__.ImageFormat.GREY
            ),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.InputPort)('previousKeypoints').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Keypoints),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_3__.OutputPort)('flow').expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelineMessageType.Vector2),
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
        if(windowSize.width != windowSize.height) {
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_9__.NotSupportedError(`LK: window ${this._windowSize.toString()} is not square!`);
        }
        else if(!Object.prototype.hasOwnProperty.call(LK_PROGRAM, windowSize.width)) {
            const SUPPORTED_WINDOWS = Object.keys(LK_PROGRAM).sort((a,b) => a-b).map(k => k+'x'+k).join(', ');
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_9__.NotSupportedError(`LK: window of size ${this._windowSize.toString()} is not supported! Supported sizes: ${SUPPORTED_WINDOWS}`);
        }

        this._windowSize = windowSize;
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_8__.Utils.assert(levels >= 1 && levels <= _utils_globals__WEBPACK_IMPORTED_MODULE_11__.PYRAMID_MAX_LEVELS);
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_8__.Utils.assert(value >= 0);
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_8__.Utils.assert(value >= 1);
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_8__.Utils.assert(value >= 0);
        this._epsilon = +value;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('previousKeypoints').read() );
        const previousImage = ( /** @type {SpeedyPipelineMessageWithImage} */ ( this.input('previousImage').read() )).image;
        const nextImage = ( /** @type {SpeedyPipelineMessageWithImage} */ ( this.input('nextImage').read() )).image;
        const previousKeypoints = encodedKeypoints;
        const levels = this._levels;
        const windowSize = this._windowSize;
        const wsize = windowSize.width; // square window
        const numberOfIterations = this._numberOfIterations;
        const discardThreshold = this._discardThreshold;
        const epsilon = this._epsilon;
        const keypoints = gpu.programs.keypoints;
        const tex = this._tex;

        // do we need a pyramid?
        if(!(levels == 1 || (previousImage.hasMipmaps() && nextImage.hasMipmaps())))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_9__.IllegalOperationError(`LK: a pyramid is required if levels > 1`);
        else if(previousImage.width !== nextImage.width || previousImage.height !== nextImage.height)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_9__.IllegalOperationError(`LK: can't use input images of different size`);

        // select the appropriate program
        const lk = keypoints[LK_PROGRAM[wsize]];

        // find the dimensions of the flow texture (1 pixel per flow vector)
        const numKeypoints = _detectors_detector__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        const lkEncoderLength = Math.max(1, Math.ceil(Math.sqrt(numKeypoints)));
        lk.outputs(lkEncoderLength, lkEncoderLength, tex[0], tex[1]);

        // compute optical-flow
        let flow = lk.clear();
        for(let lod = levels - 1; lod >= 0; lod--)
            flow = lk(flow, previousKeypoints, nextImage, previousImage, lod, levels, numberOfIterations, discardThreshold, epsilon, descriptorSize, extraSize, encoderLength);

        // transfer optical-flow to nextKeypoints
        keypoints.transferFlow.outputs(encoderLength, encoderLength, tex[2]);
        const nextKeypoints = keypoints.transferFlow(flow, previousKeypoints, descriptorSize, extraSize, encoderLength);

        // done!
        this.output().swrite(nextKeypoints, descriptorSize, extraSize, encoderLength);
        this.output('flow').swrite(flow);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/keypoints/transformer.js":
/*!**********************************************************!*\
  !*** ./src/core/pipeline/nodes/keypoints/transformer.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeKeypointTransformer": () => (/* binding */ SpeedyPipelineNodeKeypointTransformer)
/* harmony export */ });
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
 * transformer.js
 * Apply a transformation matrix to a set of keypoints
 */












/**
 * Apply a transformation matrix to a set of keypoints
 */
class SpeedyPipelineNodeKeypointTransformer extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Keypoints)
        ]);

        /** @type {SpeedyMatrix} transformation matrix */
        this._transform = _speedy_matrix__WEBPACK_IMPORTED_MODULE_7__.SpeedyMatrix.Create(3, 3, [1, 0, 0, 0, 1, 0, 0, 0, 1]); // identity matrix
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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.IllegalArgumentError(`Not a 3x3 transformation matrix: ${transform}`);

        this._transform = transform;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input().read() );
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodePerspectiveWarp": () => (/* binding */ SpeedyPipelineNodePerspectiveWarp)
/* harmony export */ });
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
 * perspective-warp.js
 * Warp an image using a perspective transformation
 */












// Used when an invalid matrix is provided
const SINGULAR_MATRIX = [0,0,0,0,0,0,0,0,1];

/**
 * Warp an image using a perspective transformation
 */
class SpeedyPipelineNodePerspectiveWarp extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
        ]);

        /** @type {SpeedyMatrix} perspective transformation */
        this._transform = _speedy_matrix__WEBPACK_IMPORTED_MODULE_9__.SpeedyMatrix.Create(3, 3, [1, 0, 0, 0, 1, 0, 0, 0, 1]); // identity matrix
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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_8__.IllegalArgumentError(`Not a 3x3 transformation matrix: ${transform}`);

        this._transform = transform;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeResize": () => (/* binding */ SpeedyPipelineNodeResize)
/* harmony export */ });
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
 * resize.js
 * Resize image
 */













/** @typedef {"bilinear"|"nearest"} SpeedyPipelineNodeResizeMethod */

/**
 * Resize image
 */
class SpeedyPipelineNodeResize extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.OutputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Image),
        ]);

        /** @type {SpeedySize} size of the output image, in pixels */
        this._size = new _speedy_size__WEBPACK_IMPORTED_MODULE_8__.SpeedySize(0, 0);

        /** @type {SpeedyVector2} size of the output relative to the size of the input */
        this._scale = new _speedy_vector__WEBPACK_IMPORTED_MODULE_9__.SpeedyVector2(1, 1);

        /** @type {SpeedyPipelineNodeResizeMethod} interpolation method */
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
     * @returns {SpeedyPipelineNodeResizeMethod}
     */
    get method()
    {
        return this._method;
    }

    /**
     * Interpolation method
     * @param {SpeedyPipelineNodeResizeMethod} method
     */
    set method(method)
    {
        if(method !== 'nearest' && method !== 'bilinear')
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_6__.IllegalArgumentError(`Invalid method method: "${method}"`);

        this._method = method;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
        const width = image.width, height = image.height;
        const outputTexture = this._tex[0];
        const method = this._method;
        const newWidth = this._size.width || Math.max(1, this._scale.x * width);
        const newHeight = this._size.height || Math.max(1, this._scale.y * height);

        if(method == 'bilinear') {
            (gpu.programs.transforms.resizeBilinear
                .outputs(newWidth, newHeight, outputTexture)
            )(image);
        }
        else if(method == 'nearest') {
            (gpu.programs.transforms.resizeNearest
                .outputs(newWidth, newHeight, outputTexture)
            )(image);
        }

        this.output().swrite(outputTexture, format);
    }
}

/***/ }),

/***/ "./src/core/pipeline/nodes/vector2/sink.js":
/*!*************************************************!*\
  !*** ./src/core/pipeline/nodes/vector2/sink.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNodeVector2Sink": () => (/* binding */ SpeedyPipelineNodeVector2Sink)
/* harmony export */ });
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pipeline-node */ "./src/core/pipeline/pipeline-node.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture_reader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../gpu/speedy-texture-reader */ "./src/gpu/speedy-texture-reader.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _speedy_vector__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../speedy-vector */ "./src/core/speedy-vector.js");
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
 * sink.js
 * Gets keypoints out of the pipeline
 */











// next power of 2
const nextPot = x => x > 1 ? 1 << Math.ceil(Math.log2(x)) : 1;


/**
 * Gets 2D vectors out of the pipeline
 */
class SpeedyPipelineNodeVector2Sink extends _pipeline_node__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineSinkNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = 'vec2')
    {
        super(name, 2, [
            (0,_pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_2__.InputPort)().expects(_pipeline_message__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineMessageType.Vector2)
        ]);

        /** @type {SpeedyVector2[]} 2D vectors (output) */
        this._vectors = [];

        /** @type {SpeedyTextureReader} texture reader */
        this._textureReader = new _gpu_speedy_texture_reader__WEBPACK_IMPORTED_MODULE_4__.SpeedyTextureReader();

        /** @type {number} page flipping index */
        this._page = 0;

        /** @type {boolean} accelerate GPU-CPU transfers */
        this._turbo = false;
    }

    /**
     * Accelerate GPU-CPU transfers
     * @returns {boolean}
     */
    get turbo()
    {
        return this._turbo;
    }

    /**
     * Accelerate GPU-CPU transfers
     * @param {boolean} value
     */
    set turbo(value)
    {
        this._turbo = Boolean(value);
    }

    /**
     * Initializes this node
     * @param {SpeedyGPU} gpu
     */
    init(gpu)
    {
        super.init(gpu);
        this._textureReader.init(gpu);
    }

    /**
     * Releases this node
     * @param {SpeedyGPU} gpu
     */
    release(gpu)
    {
        this._textureReader.release(gpu);
        super.release(gpu);
    }

    /**
     * Export data from this node to the user
     * @returns {SpeedyPromise<SpeedyVector2[]>}
     */
    export()
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_7__.SpeedyPromise.resolve(this._vectors);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { vectors } = /** @type {SpeedyPipelineMessageWith2DVectors} */ ( this.input().read() );
        const useBufferedDownloads = this._turbo;
        const encoderLength = vectors.width;

        /*

        I have found experimentally that, in Firefox, readPixelsAsync()
        performs MUCH better if the width of the target texture is a power
        of two. I have no idea why this is the case, nor if it's related to
        some interaction with the GL drivers, somehow. This seems to make no
        difference on Chrome, however. In any case, let's convert the input
        texture to POT.

        */
        const encoderWidth = nextPot(encoderLength);
        const encoderHeight = nextPot(Math.ceil(encoderLength * encoderLength / encoderWidth));
        //const encoderHeight = (Math.ceil(encoderLength * encoderLength / encoderWidth));

        // copy the set of vectors to an internal texture
        const copiedTexture = this._tex[this._page];
        (gpu.programs.utils.copy2DVectors
            .outputs(encoderWidth, encoderHeight, copiedTexture)
        )(vectors);

        // flip page
        this._page = 1 - this._page;

        // download the internal texture
        return this._textureReader.readPixelsAsync(copiedTexture, 0, 0, copiedTexture.width, copiedTexture.height, useBufferedDownloads).then(pixels => {
            this._vectors = SpeedyPipelineNodeVector2Sink._decode(pixels, encoderWidth, encoderHeight);
        });
    }

    /**
     * Decode a sequence of vectors, given a flattened image of encoded pixels
     * @param {Uint8Array} pixels pixels in the [r,g,b,a,...] format
     * @param {number} encoderWidth
     * @param {number} encoderHeight
     * @returns {SpeedyVector2[]} vectors
     */
    static _decode(pixels, encoderWidth, encoderHeight)
    {
        const bytesPerVector = 4; // 1 pixel per vector
        const vectors = [];
        let hi = 0, lo = 0;
        let x = 0, y = 0;

        // how many bytes should we read?
        const e2 = encoderWidth * encoderHeight * bytesPerVector;
        const size = Math.min(pixels.length, e2);

        // for each encoded vector
        for(let i = 0; i < size; i += bytesPerVector) {
            // extract 16-bit words
            lo = (pixels[i+1] << 8) | pixels[i];
            hi = (pixels[i+3] << 8) | pixels[i+2];

            // the vector is "null": we have reached the end of the list
            if(lo == 0xFFFF && hi == 0xFFFF)
                break;

            // the vector must be discarded
            if(lo == 0xFF00 && hi == 0xFF00)
                continue;

            // decode floats
            x = _utils_utils__WEBPACK_IMPORTED_MODULE_6__.Utils.decodeFloat16(lo);
            y = _utils_utils__WEBPACK_IMPORTED_MODULE_6__.Utils.decodeFloat16(hi);

            // register vector
            vectors.push(new _speedy_vector__WEBPACK_IMPORTED_MODULE_8__.SpeedyVector2(x, y));
        }

        // done!
        return vectors;
    }
}

/***/ }),

/***/ "./src/core/pipeline/pipeline-message.js":
/*!***********************************************!*\
  !*** ./src/core/pipeline/pipeline-message.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineMessageType": () => (/* binding */ SpeedyPipelineMessageType),
/* harmony export */   "SpeedyPipelineMessage": () => (/* binding */ SpeedyPipelineMessage),
/* harmony export */   "SpeedyPipelineMessageWithNothing": () => (/* binding */ SpeedyPipelineMessageWithNothing),
/* harmony export */   "SpeedyPipelineMessageWithImage": () => (/* binding */ SpeedyPipelineMessageWithImage),
/* harmony export */   "SpeedyPipelineMessageWithKeypoints": () => (/* binding */ SpeedyPipelineMessageWithKeypoints),
/* harmony export */   "SpeedyPipelineMessageWith2DVectors": () => (/* binding */ SpeedyPipelineMessageWith2DVectors),
/* harmony export */   "SpeedyPipelineMessageWithLSHTables": () => (/* binding */ SpeedyPipelineMessageWithLSHTables),
/* harmony export */   "SpeedyPipelineMessageWithKeypointMatches": () => (/* binding */ SpeedyPipelineMessageWithKeypointMatches)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _gpu_speedy_lsh__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../gpu/speedy-lsh */ "./src/gpu/speedy-lsh.js");
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
 * pipeline-message.js
 * A message that is shared between nodes of a pipeline
 */







/**
 * Types of messages
 * @enum {Symbol}
 */
const SpeedyPipelineMessageType = Object.freeze({
    Nothing: Symbol('Nothing'),
    Image: Symbol('Image'),
    Keypoints: Symbol('Keypoints'),
    Vector2: Symbol('Vector2'),
    LSHTables: Symbol('LSHTables'),
    KeypointMatches: Symbol('KeypointMatches'),
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
     * @abstract
     * @param  {...any} args
     * @returns {SpeedyPipelineMessage} this message
     */
    set(...args)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.AbstractMethodError();
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

        /** @type {SpeedyDrawableTexture} the image we carry */
        this._image = null;

        /** @type {ImageFormat} image format */
        this._format = _utils_types__WEBPACK_IMPORTED_MODULE_1__.ImageFormat.RGBA;
    }

    /**
     * Set parameters
     * @param {SpeedyDrawableTexture} image the image we carry
     * @param {ImageFormat} [format] image format
     * @returns {SpeedyPipelineMessage} this message
     */
    set(image, format = _utils_types__WEBPACK_IMPORTED_MODULE_1__.ImageFormat.RGBA)
    {
        // set parameters
        this._image = image;
        this._format = format;

        // done!
        return this;
    }

    /**
     * The image we carry
     * @returns {SpeedyDrawableTexture}
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(this._descriptorSize >= 0 && this._extraSize >= 0);
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(this._encoderLength === this._encodedKeypoints.width, 'Invalid encoderLength');
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(this._encodedKeypoints.width === this._encodedKeypoints.height, 'Invalid encodedKeypoints texture');

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
}

/*
 * A message transporting a set of 2D vectors
 */
class SpeedyPipelineMessageWith2DVectors extends SpeedyPipelineMessage
{
    /**
     * Constructor
     */
    constructor()
    {
        super(SpeedyPipelineMessageType.Vector2);

        /** @type {SpeedyDrawableTexture} the set of vectors */
        this._vectors = null;
    }

    /**
     * Set parameters
     * @param {SpeedyDrawableTexture} vectors the set of vectors
     * @returns {SpeedyPipelineMessage} this message
     */
    set(vectors)
    {
        // set parameters
        this._vectors = vectors;

        // done!
        return this;
    }

    /**
     * The set of vectors
     * @returns {SpeedyDrawableTexture}
     */
    get vectors()
    {
        return this._vectors;
    }
}

/**
 * A message transporting LSH tables
 */
class SpeedyPipelineMessageWithLSHTables extends SpeedyPipelineMessage
{
    /**
     * Constructor
     */
    constructor()
    {
        super(SpeedyPipelineMessageType.LSHTables);

        /** @type {SpeedyLSH} LSH data structure */
        this._lsh = null;
    }

    /**
     * Set parameters
     * @param {SpeedyLSH} lsh
     * @returns {SpeedyPipelineMessage} this message
     */
    set(lsh)
    {
        // set parameters
        this._lsh = lsh;

        // done!
        return this;
    }

    /**
     * LSH data structure
     * @returns {SpeedyLSH}
     */
    get lsh()
    {
        return this._lsh;
    }
}

/*
 * A message transporting a set of keypoint matches
 */
class SpeedyPipelineMessageWithKeypointMatches extends SpeedyPipelineMessage
{
    /**
     * Constructor
     */
    constructor()
    {
        super(SpeedyPipelineMessageType.KeypointMatches);

        /** @type {SpeedyDrawableTexture} keypoint matches (note: 1 pixel encodes 1 match) */
        this._encodedMatches = null;

        /** @type {number} number of matches per keypoint */
        this._matchesPerKeypoint = 1;
    }

    /**
     * Set parameters
     * @param {SpeedyDrawableTexture} encodedMatches
     * @param {number} matchesPerKeypoint
     * @returns {SpeedyPipelineMessage} this message
     */
    set(encodedMatches, matchesPerKeypoint)
    {
        // set parameters
        this._encodedMatches = encodedMatches;
        this._matchesPerKeypoint = matchesPerKeypoint | 0;

        // validate
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(this._matchesPerKeypoint > 0);

        // done!
        return this;
    }

    /**
     * The matches
     * @returns {SpeedyDrawableTexture}
     */
    get encodedMatches()
    {
        return this._encodedMatches;
    }

    /**
     * Number of matches per keypoint
     * @returns {number}
     */
    get matchesPerKeypoint()
    {
        return this._matchesPerKeypoint;
    }
}






//
// Utilities
//



/** Map message type to message class */
const MESSAGE_CLASS = Object.freeze({
    [SpeedyPipelineMessageType.Nothing]: SpeedyPipelineMessageWithNothing,
    [SpeedyPipelineMessageType.Image]: SpeedyPipelineMessageWithImage,
    [SpeedyPipelineMessageType.Keypoints]: SpeedyPipelineMessageWithKeypoints,
    [SpeedyPipelineMessageType.Vector2]: SpeedyPipelineMessageWith2DVectors,
    [SpeedyPipelineMessageType.LSHTables]: SpeedyPipelineMessageWithLSHTables,
    [SpeedyPipelineMessageType.KeypointMatches]: SpeedyPipelineMessageWithKeypointMatches,
});

/**
 * Create a message of the specified type
 * @param {SpeedyPipelineMessageType} type
 * @returns {SpeedyPipelineMessage}
 */
function createMessage(type)
{
    //return Reflect.construct(MESSAGE_CLASS[type], []);
    return new MESSAGE_CLASS[
        // error TS2538: Type 'Symbol' cannot be used as an index type.
        // heck, what the hack...
        /** @type {any} */ ( type )
    ];
}

/***/ }),

/***/ "./src/core/pipeline/pipeline-node.js":
/*!********************************************!*\
  !*** ./src/core/pipeline/pipeline-node.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelineNode": () => (/* binding */ SpeedyPipelineNode),
/* harmony export */   "SpeedyPipelineSourceNode": () => (/* binding */ SpeedyPipelineSourceNode),
/* harmony export */   "SpeedyPipelineSinkNode": () => (/* binding */ SpeedyPipelineSinkNode)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/globals */ "./src/utils/globals.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _pipeline_port__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pipeline-port */ "./src/core/pipeline/pipeline-port.js");
/* harmony import */ var _pipeline_portbuilder__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pipeline-portbuilder */ "./src/core/pipeline/pipeline-portbuilder.js");
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _gpu_speedy_texture_reader__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../gpu/speedy-texture-reader */ "./src/gpu/speedy-texture-reader.js");
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
 * pipeline-node.js
 * Node of a pipeline
 */











/** @typedef {Object<string,SpeedyPipelineInputPort>} InputPortDictionary */
/** @typedef {Object<string,SpeedyPipelineOutputPort>} OutputPortDictionary */

/** Generate a random name for a node */
const generateRandomName = () => Math.random().toString(16).substr(2);

/** Create an empty input port dictionary */
const createInputPortDictionary = () => /** @type {InputPortDictionary} */ ( Object.create(null) );

/** Create an empty output port dictionary */
const createOutputPortDictionary = () => /** @type {OutputPortDictionary} */ ( Object.create(null) );

/**
 * Map an array of input ports to an InputPortDictionary whose keys are their names
 * @param {SpeedyPipelineInputPort[]} ports
 * @returns {InputPortDictionary}
 */
function InputPortDictionary(ports)
{
    return ports.reduce((dict, port) => ((dict[port.name] = port), dict), createInputPortDictionary());
}

/**
 * Map an array of output ports to an OutputPortDictionary whose keys are their names
 * @param {SpeedyPipelineOutputPort[]} ports
 * @returns {OutputPortDictionary}
 */
function OutputPortDictionary(ports)
{
    return ports.reduce((dict, port) => ((dict[port.name] = port), dict), createOutputPortDictionary());
}

/** A flag used for debugging purposes */
let _texView = false;



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

        /** @type {SpeedyDrawableTexture[]} work texture(s) */
        this._tex = (new Array(texCount)).fill(null);



        // build the ports
        const ports = portBuilders.map(builder => builder.build(this));
        const inputPorts = /** @type {SpeedyPipelineInputPort[]} */ ( ports.filter(port => port.isInputPort()) );
        const outputPorts = /** @type {SpeedyPipelineOutputPort[]} */ ( ports.filter(port => port.isOutputPort()) );

        /** @type {InputPortDictionary} input ports */
        this._inputPorts = InputPortDictionary(inputPorts);

        /** @type {OutputPortDictionary} output ports */
        this._outputPorts = OutputPortDictionary(outputPorts);



        // validate
        if(this._name.length == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.IllegalArgumentError(`Invalid name "${this._name}" for node ${this.fullName}`);
        else if(portBuilders.length == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.IllegalArgumentError(`No ports have been found in node ${this.fullName}`);
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
    input(portName = _pipeline_port__WEBPACK_IMPORTED_MODULE_4__.SpeedyPipelineInputPort.DEFAULT_NAME)
    {
        if(portName in this._inputPorts)
            return this._inputPorts[portName];

        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.IllegalArgumentError(`Can't find input port ${portName} in node ${this.fullName}`);
    }

    /**
     * Find output port by name
     * @param {string} [portName]
     * @returns {SpeedyPipelineOutputPort}
     */
    output(portName = _pipeline_port__WEBPACK_IMPORTED_MODULE_4__.SpeedyPipelineOutputPort.DEFAULT_NAME)
    {
        if(portName in this._outputPorts)
            return this._outputPorts[portName];

        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.IllegalArgumentError(`Can't find output port ${portName} in node ${this.fullName}`);
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
        if(typeof runTask === 'undefined') {
            for(portName in this._outputPorts) // ensure that no output ports are empty
                _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(this._outputPorts[portName].hasMessage(), `Did you forget to write data to the output port ${portName} of ${this.fullName}?`);

            return undefined;
        }
        else return runTask.then(() => {
            for(portName in this._outputPorts) // ensure that no output ports are empty
                _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(this._outputPorts[portName].hasMessage(), `Did you forget to write data to the output port ${portName} of ${this.fullName}?`);
        });
    }

    /**
     * Run the specific task of this node
     * @abstract
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.AbstractMethodError();
    }

    /**
     * Initializes this node
     * @param {SpeedyGPU} gpu
     */
    init(gpu)
    {
        gpu.subscribe(this._allocateWorkTextures, this, gpu);
        this._allocateWorkTextures(gpu);
    }

    /**
     * Releases this node
     * @param {SpeedyGPU} gpu
     */
    release(gpu)
    {
        this._deallocateWorkTextures(gpu);
        gpu.unsubscribe(this._allocateWorkTextures, this);
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
     * Is this a source of the pipeline?
     * @returns {boolean}
     */
    isSource()
    {
        return false;
    }

    /**
     * Is this a sink of the pipeline?
     * @returns {boolean}
     */
    isSink()
    {
        return false;

        // note: a portal sink has no output ports, but it isn't a sink of the pipeline!
        //return Object.keys(this._outputPorts).length == 0;
    }

    /**
     * Allocate work texture(s)
     * @param {SpeedyGPU} gpu
     */
    _allocateWorkTextures(gpu)
    {
        for(let j = 0; j < this._tex.length; j++)
            this._tex[j] = gpu.texturePool.allocate();
    }

    /**
     * Deallocate work texture(s)
     * @param {SpeedyGPU} gpu
     */
    _deallocateWorkTextures(gpu)
    {
        for(let j = this._tex.length - 1; j >= 0; j--)
            this._tex[j] = gpu.texturePool.free(this._tex[j]);
    }

    /**
     * Inspect the pixels of a texture for debugging purposes
     * @param {SpeedyGPU} gpu
     * @param {SpeedyDrawableTexture} texture
     * @returns {Uint8Array}
     */
    _inspect(gpu, texture)
    {
        const textureReader = new _gpu_speedy_texture_reader__WEBPACK_IMPORTED_MODULE_8__.SpeedyTextureReader();
        textureReader.init(gpu);
        const pixels = textureReader.readPixelsSync(texture);
        textureReader.release(gpu);

        return new Uint8Array(pixels); // copy the array
    }

    /**
     * Inspect the pixels of a texture as unsigned 32-bit integers
     * @param {SpeedyGPU} gpu
     * @param {SpeedyDrawableTexture} texture
     * @returns {Uint32Array}
     */
    _inspect32(gpu, texture)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(_utils_globals__WEBPACK_IMPORTED_MODULE_1__.LITTLE_ENDIAN); // make sure we use little-endian
        return new Uint32Array(this._inspect(gpu, texture).buffer);
    }

    /**
     * Visually inspect a texture for debugging purposes
     * @param {SpeedyGPU} gpu
     * @param {SpeedyDrawableTexture} texture
     */
    _visualize(gpu, texture)
    {
        const canvas = gpu.renderToCanvas(texture);
        if(!_texView) {
            document.body.appendChild(canvas);
            _texView = true;
        }
    }
}

/**
 * Source node (a node with no input ports)
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(Object.keys(this._inputPorts).length == 0);
    }

    /**
     * Is this a source of the pipeline?
     * @returns {boolean}
     */
    isSource()
    {
        return true;
    }
}

/**
 * Sink node (a node with no output ports)
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(Object.keys(this._outputPorts).length == 0);
    }

    /**
     * Export data from this node to the user
     * @abstract
     * @returns {SpeedyPromise<any>}
     */
    export()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.AbstractMethodError();
    }

    /**
     * Is this a sink of the pipeline?
     * @returns {boolean}
     */
    isSink()
    {
        return true;
    }
}

/***/ }),

/***/ "./src/core/pipeline/pipeline-port.js":
/*!********************************************!*\
  !*** ./src/core/pipeline/pipeline-port.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelinePort": () => (/* binding */ SpeedyPipelinePort),
/* harmony export */   "SpeedyPipelineOutputPort": () => (/* binding */ SpeedyPipelineOutputPort),
/* harmony export */   "SpeedyPipelineInputPort": () => (/* binding */ SpeedyPipelineInputPort)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _pipeline_portspec__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pipeline-portspec */ "./src/core/pipeline/pipeline-portspec.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pipeline-node */ "./src/core/pipeline/pipeline-node.js");
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
 * pipeline-port.js
 * Port of a node of a pipeline
 */







// Constants
const DEFAULT_INPUT_PORT_NAME = 'in';
const DEFAULT_OUTPUT_PORT_NAME = 'out';
const ACCEPTABLE_PORT_NAME = /^[a-z][a-zA-Z0-9]*$/;
const EMPTY_MESSAGE = new _pipeline_message__WEBPACK_IMPORTED_MODULE_3__.SpeedyPipelineMessageWithNothing();

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
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(ACCEPTABLE_PORT_NAME.test(this._name), `Port name "${this._name}" is not acceptable`);
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
     * @abstract
     * @param {SpeedyPipelinePort} port
     */
    connectTo(port)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.AbstractMethodError();
    }

    /**
     * Is this an input port?
     * @abstract
     * @returns {boolean}
     */
    isInputPort()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.AbstractMethodError();
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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.IllegalOperationError(`Can't read from port ${this.name}: nothing to read`);

        return this._message;
    }

    /**
     * Write a message to this port
     * @param {SpeedyPipelineMessage} message
     */
    write(message)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.NotSupportedError(`Can't write ${message} to port ${this.name}: unsupported operation`);
    }

    /**
     * Default port name
     * @abstract
     * @returns {string}
     */
    static get DEFAULT_NAME()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.AbstractMethodError();
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
     * @param {SpeedyPipelineInputPort} port
     */
    connectTo(port)
    {
        if(!port.isInputPort())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.IllegalArgumentError(`Can't connect output port ${this.name} to port ${port.name}: expected an input port`);

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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.IllegalArgumentError(`Can't write ${message} to port ${this.name}. ${this._spec}`);

        this._message = message;
    }

    /**
     * Write a message to this port using a cached message object
     * @param  {...any} args to be passed to SpeedyPipelineMessage.set()
     */
    swrite(...args)
    {
        if(this._cachedMessage == null)
            this._cachedMessage = _pipeline_message__WEBPACK_IMPORTED_MODULE_3__.SpeedyPipelineMessage.create(this._spec.expectedMessageType);

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

        /** @type {SpeedyPipelineOutputPort|null} incoming link */
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
     * @param {SpeedyPipelineOutputPort} port
     */
    connectTo(port)
    {
        if(!port.isOutputPort())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.IllegalArgumentError(`Can't connect input port ${this.name} of "${this.node.fullName}" to input port ${port.name} of "${port.node.fullName}": expected an output port`);
        else if(!this._spec.isCompatibleWith(port._spec))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.IllegalArgumentError(`Can't connect port ${this.name} of "${this.node.fullName}" to port ${port.name} of "${port.node.fullName}": incompatible types`);

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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.IllegalOperationError(`No incoming link for input port ${name}`);

        const message = this._incomingLink.read();
        if(!this._spec.accepts(message))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.IllegalArgumentError(`Can't receive ${message} at port ${name}: ${this._spec}`);

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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelinePortBuilder": () => (/* binding */ SpeedyPipelinePortBuilder),
/* harmony export */   "InputPort": () => (/* binding */ InputPort),
/* harmony export */   "OutputPort": () => (/* binding */ OutputPort)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _pipeline_port__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pipeline-port */ "./src/core/pipeline/pipeline-port.js");
/* harmony import */ var _pipeline_portspec__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pipeline-portspec */ "./src/core/pipeline/pipeline-portspec.js");
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _pipeline_node__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pipeline-node */ "./src/core/pipeline/pipeline-node.js");
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
 * pipeline-portbuilder.js
 * Builder of a port of a node of a pipeline
 */







/**
 * @typedef {import('./pipeline-portspec').SpeedyPipelineMessageConstraint} SpeedyPipelineMessageConstraint
 */

/**
 * Builder of a port of a node of a pipeline
 */
class SpeedyPipelinePortBuilder
{
    /**
     * Constructor
     * @param {typeof SpeedyPipelinePort} portClass input or output?
     * @param {string} portName
     */
    constructor(portClass, portName)
    {
        /** @type {typeof SpeedyPipelinePort} input or output? */
        this._class = portClass;

        /** @type {string} port name */
        this._name = String(portName);

        /** @type {SpeedyPipelineMessageType} accepted message type */
        this._type = _pipeline_message__WEBPACK_IMPORTED_MODULE_3__.SpeedyPipelineMessageType.Nothing;

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
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(this._type == _pipeline_message__WEBPACK_IMPORTED_MODULE_3__.SpeedyPipelineMessageType.Nothing);
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(type != _pipeline_message__WEBPACK_IMPORTED_MODULE_3__.SpeedyPipelineMessageType.Nothing);

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
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(this._type != _pipeline_message__WEBPACK_IMPORTED_MODULE_3__.SpeedyPipelineMessageType.Nothing, 'You must first declare what type of message this port expects');
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(this._messageConstraint === undefined);
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(typeof constraint === 'function');

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
        const spec = new _pipeline_portspec__WEBPACK_IMPORTED_MODULE_2__.SpeedyPipelinePortSpec(this._type, this._messageConstraint);
        return Reflect.construct(this._class, [this._name, spec, node]);
    }
}

/**
 * Creates a builder for an input port
 * @param {string} [portName]
 * @returns {SpeedyPipelinePortBuilder}
 */
function InputPort(portName = _pipeline_port__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineInputPort.DEFAULT_NAME)
{
    return new SpeedyPipelinePortBuilder(_pipeline_port__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineInputPort, portName);
}

/**
 * Creates a builder for an output port
 * @param {string} [portName]
 * @returns {SpeedyPipelinePortBuilder}
 */
function OutputPort(portName = _pipeline_port__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineOutputPort.DEFAULT_NAME)
{
    return new SpeedyPipelinePortBuilder(_pipeline_port__WEBPACK_IMPORTED_MODULE_1__.SpeedyPipelineOutputPort, portName);
}

/***/ }),

/***/ "./src/core/pipeline/pipeline-portspec.js":
/*!************************************************!*\
  !*** ./src/core/pipeline/pipeline-portspec.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipelinePortSpec": () => (/* binding */ SpeedyPipelinePortSpec)
/* harmony export */ });
/* harmony import */ var _pipeline_message__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pipeline-message */ "./src/core/pipeline/pipeline-message.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.assert(this._expectedMessageType != _pipeline_message__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineMessageType.Nothing);
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
        const type = Object.keys(_pipeline_message__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineMessageType).find(
            type => _pipeline_message__WEBPACK_IMPORTED_MODULE_0__.SpeedyPipelineMessageType[type] === this._expectedMessageType
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPipeline": () => (/* binding */ SpeedyPipeline)
/* harmony export */ });
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
 * pipeline.js
 * A pipeline is a network of nodes in which data flows to a sink
 */










/**
 * A dictionary indexed by the names of the sink nodes
 * @typedef {Object<string,any>} SpeedyPipelineOutput
 */

/** @type {SpeedyGPU} shared GPU programs & textures */
let gpu = null;

/** @type {number} gpu reference count */
let referenceCount = 0;



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

        /** @type {boolean} are we running the pipeline at this moment? */
        this._busy = false;
    }

    /**
     * Find a node by its name
     * @template T extends SpeedyPipelineNode
     * @param {string} name
     * @returns {T|null}
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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalOperationError(`The pipeline has already been initialized`);
        else if(nodes.length == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalArgumentError(`Can't initialize the pipeline. Please specify its nodes`);

        // create a GPU instance and increase the reference count
        if(0 == referenceCount++) {
            _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(!gpu, 'Duplicate SpeedyGPU instance');
            gpu = new _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_5__.SpeedyGPU();
        }

        // add nodes to the network
        for(let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if(!this._nodes.includes(node))
                this._nodes.push(node);
        }

        // generate the sequence of nodes
        this._sequence = SpeedyPipeline._tsort(this._nodes);
        SpeedyPipeline._validateSequence(this._sequence);

        // initialize nodes
        for(let i = 0; i < this._sequence.length; i++)
            this._sequence[i].init(gpu);

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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalOperationError(`The pipeline has already been released or has never been initialized`);

        // release nodes
        for(let i = this._sequence.length - 1; i >= 0; i--)
            this._sequence[i].release(gpu);
        this._sequence.length = 0;
        this._nodes.length = 0;

        // decrease reference count and release GPU if necessary
        if(0 == --referenceCount)
            gpu = gpu.release();

        // done!
        return null;
    }

    /**
     * Run the pipeline
     * @returns {SpeedyPromise<SpeedyPipelineOutput>} results are indexed by the names of the sink nodes
     */
    run()
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(this._sequence.length > 0, `The pipeline has not been initialized or has been released`);

        // is the pipeline busy?
        if(this._busy) {
            // if so, we need to wait 'til it finishes
            return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__.SpeedyPromise((resolve, reject) => {
                setTimeout(() => this.run().then(resolve, reject), 0);
            });
        }
        else {
            // the pipeline is now busy and won't accept concurrent tasks
            // (we allocate textures using a single pool)
            this._busy = true;
        }

        // find the sinks
        const sinks = /** @type {SpeedyPipelineSinkNode[]} */ ( this._sequence.filter(node => node.isSink()) );

        // create output template
        const template = SpeedyPipeline._createOutputTemplate(sinks);

        // run the pipeline
        return SpeedyPipeline._runSequence(this._sequence).then(() =>

            // export results
            _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__.SpeedyPromise.all(sinks.map(sink => sink.export().turbocharge())).then(results =>

                // aggregate results by the names of the sinks
                results.reduce((obj, val, idx) => ((obj[sinks[idx].name] = val), obj), template)

            )

        ).finally(() => {

            // clear all ports
            for(let i = this._sequence.length - 1; i >= 0; i--)
                this._sequence[i].clearPorts();

            // the pipeline is no longer busy
            this._busy = false;

        }).turbocharge();
    }

    /**
     * @private
     *
     * GPU instance
     * @returns {SpeedyGPU}
     */
    get _gpu()
    {
        return gpu;
    }

    /**
     * Execute the tasks of a sequence of nodes
     * @param {SpeedyPipelineNode[]} sequence sequence of nodes
     * @param {number} [i] in [0,n)
     * @param {number} [n] number of nodes
     * @returns {SpeedyPromise<void>}
     */
    static _runSequence(sequence, i = 0, n = sequence.length)
    {
        for(; i < n; i++) {
            const runTask = sequence[i].execute(gpu);

            // this call greatly improves performance when downloading pixel data using PBOs
            gpu.gl.flush();

            if(typeof runTask !== 'undefined')
                return runTask.then(() => SpeedyPipeline._runSequence(sequence, i+1, n));
        }

        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__.SpeedyPromise.resolve();
    }

    /**
     * Topological sorting
     * @param {SpeedyPipelineNode[]} nodes 
     * @returns {SpeedyPipelineNode[]}
     */
    static _tsort(nodes)
    {
        /** @typedef {[SpeedyPipelineNode, boolean]} StackNode */

        const outlinks = SpeedyPipeline._outlinks(nodes);
        const stack = nodes.map(node => /** @type {StackNode} */ ([ node, false ]) );
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
                    stack.push(...(outnodes.map(node => /** @type {StackNode} */ ([ node, false ]) )));

                    if(outnodes.some(node => trash.has(node) && !sorted.includes(node)))
                        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalOperationError(`Pipeline networks cannot have cycles!`);
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
                    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalOperationError(`Can't initialize the pipeline. Missing node: ${from.fullName}. Did you forget to add it to the initialization list?`);

                if(!links.includes(to))
                    links.push(to);
            }
        }

        return outlinks;
    }

    /**
     * Generate the output template by aggregating the names of the sinks
     * @param {SpeedyPipelineNode[]} [sinks]
     * @returns {SpeedyPipelineOutput}
     */
    static _createOutputTemplate(sinks = [])
    {
        const template = Object.create(null);

        for(let i = sinks.length - 1; i >= 0; i--)
            template[sinks[i].name] = null;

        return template;
    }

    /**
     * Validate a sequence of nodes
     * @param {SpeedyPipelineNode[]} sequence
     */
    static _validateSequence(sequence)
    {
        if(sequence.length == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalOperationError(`Pipeline doesn't have nodes`);
        else if(!sequence[0].isSource())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalOperationError(`Pipeline doesn't have a source`);
        else if(!sequence.find(node => node.isSink()))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalOperationError(`Pipeline doesn't have a sink`);
    }
}


/***/ }),

/***/ "./src/core/speedy-keypoint-descriptor.js":
/*!************************************************!*\
  !*** ./src/core/speedy-keypoint-descriptor.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyKeypointDescriptor": () => (/* binding */ SpeedyKeypointDescriptor)
/* harmony export */ });
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

/***/ "./src/core/speedy-keypoint-match.js":
/*!*******************************************!*\
  !*** ./src/core/speedy-keypoint-match.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyKeypointMatch": () => (/* binding */ SpeedyKeypointMatch)
/* harmony export */ });
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/globals */ "./src/utils/globals.js");
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
 * speedy-match.js
 * A match between two keypoint descriptors
 */



// Constants
const MATCH_NOT_FOUND = -1;

/**
 * A match between two keypoint descriptors
 */
class SpeedyKeypointMatch
{
    /**
     * Constructor
     * @param {number} index index of the stored keypoint, a non-negative integer
     * @param {number} distance a measure of the quality of the match, a non-negative number
     */
    constructor(index, distance)
    {
        const isValid = distance < _utils_globals__WEBPACK_IMPORTED_MODULE_0__.MATCH_MAX_DISTANCE;

        /** @type {number} index of the stored keypoint */
        this._index = isValid ? (index | 0) : MATCH_NOT_FOUND;

        /** @type {number} a measure of the quality of the match */
        this._distance = isValid ? +distance : Number.POSITIVE_INFINITY;

        // done!
        return Object.freeze(this);
    }

    /**
     * The index of the stored keypoint
     * @returns {number}
     */
    get index()
    {
        return this._index;
    }

    /**
     * A measure of the quality of the match (lower values indicate better matches)
     * @returns {number}
     */
    get distance()
    {
        return this._distance;
    }

    /**
     * A string representation of the keypoint match
     * @returns {string}
     */
    toString()
    {
        return `SpeedyKeypointMatch(${this.index},${this.distance})`;
    }
}

/***/ }),

/***/ "./src/core/speedy-keypoint.js":
/*!*************************************!*\
  !*** ./src/core/speedy-keypoint.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyKeypoint": () => (/* binding */ SpeedyKeypoint),
/* harmony export */   "SpeedyTrackedKeypoint": () => (/* binding */ SpeedyTrackedKeypoint),
/* harmony export */   "SpeedyMatchedKeypoint": () => (/* binding */ SpeedyMatchedKeypoint)
/* harmony export */ });
/* harmony import */ var _speedy_keypoint_descriptor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-keypoint-descriptor */ "./src/core/speedy-keypoint-descriptor.js");
/* harmony import */ var _speedy_keypoint_match__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-keypoint-match */ "./src/core/speedy-keypoint-match.js");
/* harmony import */ var _speedy_point__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./speedy-point */ "./src/core/speedy-point.js");
/* harmony import */ var _speedy_vector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./speedy-vector */ "./src/core/speedy-vector.js");
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
     * @param {SpeedyKeypointDescriptor|null} [descriptor] Keypoint descriptor, if any
     */
    constructor(x, y, lod = 0.0, rotation = 0.0, score = 0.0, descriptor = null)
    {
        /** @type {SpeedyPoint2} keypoint position */
        this._position = new _speedy_point__WEBPACK_IMPORTED_MODULE_2__.SpeedyPoint2(+x, +y);

        /** @type {number} level of detail */
        this._lod = +lod;

        /** @type {number} rotation in radians */
        this._rotation = +rotation;

        /** @type {number} a cornerness measure */
        this._score = +score;

        /** @type {SpeedyKeypointDescriptor|null} keypoint descriptor, if any */
        this._descriptor = descriptor;
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
     * The x-position of this keypoint
     * @param {number} value
     */
    set x(value)
    {
        this._position.x = +value;
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
     * The y-position of this keypoint
     * @param {number} value
     */
    set y(value)
    {
        this._position.y = +value;
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
     * @return {SpeedyKeypointDescriptor|null}
     */
    get descriptor()
    {
        return this._descriptor;
    }
}

/**
 * Represents a tracked keypoint
 */
class SpeedyTrackedKeypoint extends SpeedyKeypoint
{
    /**
     * Constructor
     * @param {number} x X position
     * @param {number} y Y position
     * @param {number} [lod] Level-of-detail
     * @param {number} [rotation] Rotation in radians
     * @param {number} [score] Cornerness measure
     * @param {SpeedyKeypointDescriptor|null} [descriptor] Keypoint descriptor, if any
     * @param {SpeedyVector2} [flow] flow vector
     */
    constructor(x, y, lod = 0.0, rotation = 0.0, score = 0.0, descriptor = null, flow = new _speedy_vector__WEBPACK_IMPORTED_MODULE_3__.SpeedyVector2(0,0))
    {
        super(x, y, lod, rotation, score, descriptor);

        /** @type {SpeedyVector2} flow vector */
        this._flow = flow;
    }

    /**
     * Flow vector
     * @returns {SpeedyVector2}
     */
    get flow()
    {
        return this._flow;
    }
}

/**
 * Represents a matched keypoint
 */
class SpeedyMatchedKeypoint extends SpeedyKeypoint
{
    /**
     * Constructor
     * @param {number} x X position
     * @param {number} y Y position
     * @param {number} [lod] Level-of-detail
     * @param {number} [rotation] Rotation in radians
     * @param {number} [score] Cornerness measure
     * @param {SpeedyKeypointDescriptor|null} [descriptor] Keypoint descriptor, if any
     * @param {SpeedyKeypointMatch[]} [matches] Keypoint matches, if any
     */
    constructor(x, y, lod = 0.0, rotation = 0.0, score = 0.0, descriptor = null, matches = [])
    {
        super(x, y, lod, rotation, score, descriptor);

        /** @type {SpeedyKeypointMatch[]} keypoint matches */
        this._matches = matches;
    }

    /**
     * Keypoint matches
     * @returns {SpeedyKeypointMatch[]}
     */
    get matches()
    {
        return this._matches;
    }
}


/***/ }),

/***/ "./src/core/speedy-matrix-expr.js":
/*!****************************************!*\
  !*** ./src/core/speedy-matrix-expr.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyMatrixExpr": () => (/* binding */ SpeedyMatrixExpr)
/* harmony export */ });
/* harmony import */ var _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-matrix-wasm */ "./src/core/speedy-matrix-wasm.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
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
 * speedy-matrix-expr.js
 * Symbolic matrix expressions
 */





/** @typedef {import('./speedy-matrix').SpeedyMatrixDtype} SpeedyMatrixDtype */
/** @typedef {import('./speedy-matrix').SpeedyMatrixBufferType} SpeedyMatrixBufferType */
/** @typedef {import('./speedy-matrix').SpeedyMatrixBufferTypeConstructor} SpeedyMatrixBufferTypeConstructor */
/** @typedef {import('./speedy-matrix-wasm').SpeedyMatrixWASMMemory} SpeedyMatrixWASMMemory */

/** @typedef {Object<SpeedyMatrixDtype,SpeedyMatrixBufferTypeConstructor>} Dtype2BufferType */

/** @const {Dtype2BufferType} */
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
     * @param {SpeedyMatrixDtype} dtype
     */
    constructor(rows, columns, dtype)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.assert(rows > 0 && columns > 0);
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.assert(dtype === SpeedyMatrixExpr.DEFAULT_DTYPE); // we only support float32 for now

        /** @type {number} number of rows */
        this._rows = rows | 0;

        /** @type {number} number of columns */
        this._columns = columns | 0;

        /** @type {SpeedyMatrixDtype} data type */
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
     * Number of columns
     * @returns {number}
     */
    get columns()
    {
        return this._columns;
    }

    /**
     * Data type
     * @returns {SpeedyMatrixDtype}
     */
    get dtype()
    {
        return this._dtype;
    }

    /**
     * Default data type
     * @returns {SpeedyMatrixDtype}
     */
    static get DEFAULT_DTYPE()
    {
        return 'float32';
    }

    /**
     * Buffer types
     * @returns {Dtype2BufferType}
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
     * @abstract
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @returns {SpeedyMatrix}
     */
    _evaluate(wasm, memory)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.AbstractMethodError();
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
     * @param {SpeedyMatrixDtype} dtype
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
     * @param {SpeedyMatrixWASMMemory} memory
     * @returns {SpeedyMatrix}
     */
    _evaluate(wasm, memory)
    {
        const operand = this._operand._evaluate(wasm, memory);
        const result = this._tempMatrix;

        // allocate matrices
        const resultptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixWASM.allocateMat32(wasm, memory, result);
        const operandptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixWASM.allocateMat32(wasm, memory, operand);

        // copy operand to WASM memory
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixWASM.copyToMat32(wasm, memory, operandptr, operand);

        // run the WASM routine
        this._compute(wasm, memory, resultptr, operandptr);

        // copy result from WASM memory
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixWASM.copyFromMat32(wasm, memory, resultptr, result);

        // deallocate matrices
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, operandptr);
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, resultptr);

        // done!
        return result;
    }

    /**
     * Compute the result of this operation
     * @abstract
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} operandptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, operandptr)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.AbstractMethodError();
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.assert(left.dtype === right.dtype);
        super(rows, columns, left.dtype);

        /** @type {SpeedyMatrixExpr} left operand */
        this._left = left;

        /** @type {SpeedyMatrixExpr} right operand */
        this._right = right;
    }

    /**
     * Evaluate this expression
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @returns {SpeedyMatrix}
     */
    _evaluate(wasm, memory)
    {
        const left = this._left._evaluate(wasm, memory);
        const right = this._right._evaluate(wasm, memory);
        const result = this._tempMatrix;

        // allocate matrices
        const resultptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixWASM.allocateMat32(wasm, memory, result);
        const leftptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixWASM.allocateMat32(wasm, memory, left);
        const rightptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixWASM.allocateMat32(wasm, memory, right);

        // copy input matrices to WASM memory
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixWASM.copyToMat32(wasm, memory, leftptr, left);
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixWASM.copyToMat32(wasm, memory, rightptr, right);

        // run the WASM routine
        this._compute(wasm, memory, resultptr, leftptr, rightptr);

        // copy output matrix from WASM memory
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixWASM.copyFromMat32(wasm, memory, resultptr, result);

        // deallocate matrices
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, rightptr);
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, leftptr);
        _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, resultptr);

        // done!
        return result;
    }

    /**
     * Compute the result of this operation
     * @abstract
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} leftptr pointer to Mat32
     * @param {number} rightptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, leftptr, rightptr)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.AbstractMethodError();
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
     * @param {SpeedyMatrixWASMMemory} memory
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.assert(operand.rows === operand.columns);
        super(operand.rows, operand.columns, operand);

        /** @type {number} size of the matrix */
        this._size = operand.rows;
    }

    /**
     * Compute result = operand ^ (-1)
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
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
     * @param {SpeedyMatrixWASMMemory} memory
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.assert(left.rows === right.rows && left.columns === right.columns);
        super(left.rows, left.columns, left, right);
    }

    /**
     * Compute result = left + right
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.assert(left.rows === right.rows && left.columns === right.columns);
        super(left.rows, left.columns, left, right);
    }

    /**
     * Compute result = left - right
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.assert(left.columns === right.rows);
        super(left.rows, right.columns, left, right);
    }

    /**
     * Compute result = left * right
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.assert(left.rows === right.rows && left.columns === right.columns);
        super(right.rows, right.columns, left, right);
    }

    /**
     * Compute result = left <compMult> right
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyMatrixFactory": () => (/* binding */ SpeedyMatrixFactory)
/* harmony export */ });
/* harmony import */ var _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-matrix-expr */ "./src/core/speedy-matrix-expr.js");
/* harmony import */ var _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-matrix-wasm */ "./src/core/speedy-matrix-wasm.js");
/* harmony import */ var _speedy_matrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./speedy-matrix */ "./src/core/speedy-matrix.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
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
 * speedy-matrix-factory.js
 * A factory of matrices
 */








/**
 * Matrix routines
 */
class SpeedyMatrixFactory extends Function
{
    /**
     * Constructor
     */
    constructor()
    {
        // This factory can be invoked as a function
        super('...args', 'return args.length > 1 ? this._create(...args) : this._from(args[0])');
        return this.bind(this);
    }

    /**
     * @private
     *
     * Create a new matrix filled with the specified size and entries
     * @param {number} rows
     * @param {number} [columns]
     * @param {number[]} [entries] in column-major format
     * @returns {SpeedyMatrix}
     */
    _create(rows, columns = rows, entries = [])
    {
        return _speedy_matrix__WEBPACK_IMPORTED_MODULE_2__.SpeedyMatrix.Create(rows, columns, entries);
    }

    /**
     * @private
     *
     * Evaluate an expression synchronously and store the result in a new matrix
     * @param {SpeedyMatrixExpr} expr matrix expression
     * @returns {SpeedyMatrix}
     */
    _from(expr)
    {
        return _speedy_matrix__WEBPACK_IMPORTED_MODULE_2__.SpeedyMatrix.From(expr);
    }

    /**
     * Create a new matrix filled with zeros with the specified size
     * @param {number} rows
     * @param {number} [columns]
     * @returns {SpeedyMatrix}
     */
    Zeros(rows, columns = rows)
    {
        return _speedy_matrix__WEBPACK_IMPORTED_MODULE_2__.SpeedyMatrix.Zeros(rows, columns);
    }

    /**
     * Create a new matrix filled with ones with the specified size
     * @param {number} rows
     * @param {number} [columns]
     * @returns {SpeedyMatrix}
     */
    Ones(rows, columns = rows)
    {
        return _speedy_matrix__WEBPACK_IMPORTED_MODULE_2__.SpeedyMatrix.Ones(rows, columns);
    }

    /**
     * Create an identity matrix with the specified size
     * @param {number} rows
     * @param {number} [columns]
     * @returns {SpeedyMatrix}
     */
    Eye(rows, columns = rows)
    {
        return _speedy_matrix__WEBPACK_IMPORTED_MODULE_2__.SpeedyMatrix.Eye(rows, columns);
    }

    /**
     * Returns a promise that resolves immediately if the WebAssembly routines
     * are ready to be used, or as soon as they do become ready
     * @returns {SpeedyPromise<void>}
     */
    ready()
    {
        return _speedy_matrix__WEBPACK_IMPORTED_MODULE_2__.SpeedyMatrix.ready();
    }

    /**
     * QR decomposition
     * @param {SpeedyMatrix} Q is m x n (reduced) or m x m (full), output
     * @param {SpeedyMatrix} R is n x n (reduced) or m x n (full), output
     * @param {SpeedyMatrix} mat is m x n, input
     * @param {object} [options]
     * @param {'reduced'|'full'} [options.mode]
     * @returns {SpeedyPromise<[SpeedyMatrix,SpeedyMatrix]>} resolves to [Q,R]
     */
    qr(Q, R, mat, { mode = 'reduced' } = {})
    {
        const A = mat, m = mat.rows, n = mat.columns;

        // validate shapes & mode
        if(mode == 'reduced') {
            if(Q.rows != m || Q.columns != n || R.rows != n || R.columns != n)
                throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`Invalid shape for reduced QR`);
        }
        else if(mode == 'full') {
            if(Q.rows != m || Q.columns != m || R.rows != m || R.columns != n)
                throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`Invalid shape for full QR`);
        }
        else
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`Invalid mode for QR: "${mode}"`);

        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.ready().then(({wasm, memory}) => {
            // allocate matrices
            const Qptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, Q);
            const Rptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, R);
            const Aptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, A);

            // copy input matrices to WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyToMat32(wasm, memory, Aptr, A);

            // run the WASM routine
            if(mode == 'reduced')
                wasm.exports.Mat32_qr_reduced(Qptr, Rptr, Aptr);
            else
                wasm.exports.Mat32_qr_full(Qptr, Rptr, Aptr);

            // copy output matrices from WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyFromMat32(wasm, memory, Qptr, Q);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyFromMat32(wasm, memory, Rptr, R);

            // deallocate matrices
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, Aptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, Rptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, Qptr);

            // done!
            return [Q, R];
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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`Can't solve an underdetermined system of equations`);
        else if(b.rows != m || b.columns != 1 || x.rows != n || x.columns != 1)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`Invalid shapes`);

        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.ready().then(({wasm, memory}) => {
            // allocate matrices
            const Aptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, A);
            const bptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, b);
            const xptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, x);

            // copy input matrices to WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyToMat32(wasm, memory, Aptr, A);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyToMat32(wasm, memory, bptr, b);

            // run the WASM routine
            switch(method) {
                case 'qr':
                    wasm.exports.Mat32_qr_ols(xptr, Aptr, bptr, 2);
                    break;

                default: 
                    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`Invalid method: "${method}"`);
            }

            // copy output matrix from WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyFromMat32(wasm, memory, xptr, x);

            // deallocate matrices
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, xptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, bptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, Aptr);

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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`Can't solve an over or underdetermined system of equations`);
        else if(b.rows != m || b.columns != 1 || x.rows != m || x.columns != 1)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`Invalid shapes`);

        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.ready().then(({wasm, memory}) => {
            // select method
            switch(method) {
                case 'qr':
                    return this.ols(x, A, b, { method });

                /*case 'lu':
                    break;*/

                default:
                    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`Invalid method: "${method}"`);
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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`You need two 2x4 input matrices to compute a perspective transformation`);
        else if(homography.rows != 3 || homography.columns != 3)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`The output of perspective() is a 3x3 homography`);

        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.ready().then(({wasm, memory}) => {
            // allocate matrices
            const homptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, homography);
            const srcptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, src);
            const destptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, dest);

            // copy input matrices to WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyToMat32(wasm, memory, srcptr, src);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyToMat32(wasm, memory, destptr, dest);

            // run the WASM routine
            wasm.exports.Mat32_homography_ndlt4(homptr, srcptr, destptr);

            // copy output matrix from WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyFromMat32(wasm, memory, homptr, homography);

            // deallocate matrices
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, destptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, srcptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, homptr);

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
     * @param {'default'|'pransac'} [options.method] method of computation
     * @param {SpeedyMatrix|null} [options.mask] (pransac) 1 x n output: i-th entry will be 1 if the i-th input point is an inlier, or 0 otherwise
     * @param {number} [options.reprojectionError] (pransac) given in pixels, used to separate inliers from outliers of a particular model (e.g., 1 pixel)
     * @param {number} [options.numberOfHypotheses] (pransac) number of hypotheses to be generated up-front (e.g., 512)
     * @param {number} [options.bundleSize] (pransac) how many points should we check before reducing the number of viable hypotheses (e.g., 128)
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to homography
     */
    findHomography(homography, src, dest, {
        method = 'default',
        mask = null,
        reprojectionError = 3,
        numberOfHypotheses = 512,
        bundleSize = 128,
    } = {})
    {
        // validate shapes
        if(src.rows != 2 || src.columns < 4 || dest.rows != 2 || dest.columns != src.columns)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`You need two 2 x n (n >= 4) input matrices to compute a homography`);
        else if(homography.rows != 3 || homography.columns != 3)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`The output of findHomography() is a 3x3 homography`);
        else if(mask != null && (mask.rows != 1 || mask.columns != src.columns))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`Invalid shape of the inliers mask`);

        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.ready().then(({wasm, memory}) => {
            // allocate matrices
            const homptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, homography);
            const srcptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, src);
            const destptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, dest);
            const maskptr = mask != null ? _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, mask) : 0;

            // copy input matrices to WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyToMat32(wasm, memory, srcptr, src);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyToMat32(wasm, memory, destptr, dest);

            // run the WASM routine
            switch(method) {
                case 'pransac':
                    _utils_utils__WEBPACK_IMPORTED_MODULE_4__.Utils.assert(reprojectionError >= 0 && numberOfHypotheses > 0 && bundleSize > 0);
                    wasm.exports.Mat32_pransac_homography(homptr, maskptr, srcptr, destptr, numberOfHypotheses, bundleSize, reprojectionError);
                    break;

                case 'default':
                case 'dlt': // obsolete
                    wasm.exports.Mat32_homography_ndlt(homptr, srcptr, destptr);
                    break;

                default:
                    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`Illegal method for findHomography(): "${method}"`);
            }

            // copy output matrices from WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyFromMat32(wasm, memory, homptr, homography);
            if(mask != null)
                _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyFromMat32(wasm, memory, maskptr, mask);

            // deallocate matrices
            if(mask != null)
                _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, maskptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, destptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, srcptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, homptr);

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
    applyPerspectiveTransform(dest, src, transform)
    {
        // validate shapes
        if(src.rows != 2 || dest.rows != 2 || src.columns != dest.columns)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`Invalid shapes`);
        else if(transform.rows != 3 || transform.columns != 3)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`The perspective transformation must be a 3x3 matrix`);

        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.ready().then(({wasm, memory}) => {
            // allocate matrices
            const matptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, transform);
            const srcptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, src);
            const destptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, dest);

            // copy input matrices to WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyToMat32(wasm, memory, srcptr, src);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyToMat32(wasm, memory, matptr, transform);

            // run the WASM routine
            wasm.exports.Mat32_transform_perspective(destptr, srcptr, matptr);

            // copy output matrix from WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyFromMat32(wasm, memory, destptr, dest);

            // deallocate matrices
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, destptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, srcptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, matptr);

            // done!
            return dest;
        });
    }

    /**
     * Compute an affine transform using 3 correspondences of points
     * @param {SpeedyMatrix} transform 2x3 output - affine transform
     * @param {SpeedyMatrix} src 2x3 input points - source coordinates
     * @param {SpeedyMatrix} dest 2x3 input points - destination coordinates
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to homography
     */
    affine(transform, src, dest)
    {
        // validate shapes
        if(src.rows != 2 || src.columns != 3 || dest.rows != 2 || dest.columns != 3)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`You need two 2x3 input matrices to compute an affine transform`);
        else if(transform.rows != 2 || transform.columns != 3)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`The output of affine() is a 2x3 matrix`);

        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.ready().then(({wasm, memory}) => {
            // allocate matrices
            const matptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, transform);
            const srcptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, src);
            const destptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, dest);

            // copy input matrices to WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyToMat32(wasm, memory, srcptr, src);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyToMat32(wasm, memory, destptr, dest);

            // run the WASM routine
            wasm.exports.Mat32_affine_direct3(matptr, srcptr, destptr);

            // copy output matrix from WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyFromMat32(wasm, memory, matptr, transform);

            // deallocate matrices
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, destptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, srcptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, matptr);

            // done!
            return transform;
        });
    }

    /**
     * Compute an affine transformation using n >= 3 correspondences of points
     * @param {SpeedyMatrix} transform 2x3 output - affine transform
     * @param {SpeedyMatrix} src 2 x n input points - source coordinates
     * @param {SpeedyMatrix} dest 2 x n input points - destination coordinates
     * @param {object} [options]
     * @param {'default'|'pransac'} [options.method] method of computation
     * @param {SpeedyMatrix|null} [options.mask] (pransac) 1 x n output: i-th entry will be 1 if the i-th input point is an inlier, or 0 otherwise
     * @param {number} [options.reprojectionError] (pransac) given in pixels, used to separate inliers from outliers of a particular model (e.g., 1 pixel)
     * @param {number} [options.numberOfHypotheses] (pransac) number of hypotheses to be generated up-front (e.g., 512)
     * @param {number} [options.bundleSize] (pransac) how many points should we check before reducing the number of viable hypotheses (e.g., 128)
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to an affine transform
     */
    findAffineTransform(transform, src, dest, {
        method = 'default',
        mask = null,
        reprojectionError = 3,
        numberOfHypotheses = 512,
        bundleSize = 128,
    } = {})
    {
        // validate shapes
        if(src.rows != 2 || src.columns < 3 || dest.rows != 2 || dest.columns != src.columns)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`You need two 2 x n (n >= 3) input matrices to compute an affine transform`);
        else if(transform.rows != 2 || transform.columns != 3)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`The output of findAffineTransform() is a 2x3 matrix`);
        else if(mask != null && (mask.rows != 1 || mask.columns != src.columns))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`Invalid shape of the inliers mask`);

        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.ready().then(({wasm, memory}) => {
            // allocate matrices
            const matptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, transform);
            const srcptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, src);
            const destptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, dest);
            const maskptr = mask != null ? _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, mask) : 0;

            // copy input matrices to WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyToMat32(wasm, memory, srcptr, src);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyToMat32(wasm, memory, destptr, dest);

            // run the WASM routine
            switch(method) {
                case 'pransac':
                    _utils_utils__WEBPACK_IMPORTED_MODULE_4__.Utils.assert(reprojectionError >= 0 && numberOfHypotheses > 0 && bundleSize > 0);
                    wasm.exports.Mat32_pransac_affine(matptr, maskptr, srcptr, destptr, numberOfHypotheses, bundleSize, reprojectionError);
                    break;

                case 'default':
                    wasm.exports.Mat32_affine_direct(matptr, srcptr, destptr);
                    break;

                default:
                    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`Illegal method for findAffineTransform(): "${method}"`);
            }

            // copy output matrices from WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyFromMat32(wasm, memory, matptr, transform);
            if(mask != null)
                _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyFromMat32(wasm, memory, maskptr, mask);

            // deallocate matrices
            if(mask != null)
                _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, maskptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, destptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, srcptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, matptr);

            // done!
            return transform;
        });
    }

    /**
     * Apply an affine transformation to a set of 2D points
     * @param {SpeedyMatrix} dest 2 x n output matrix
     * @param {SpeedyMatrix} src 2 x n input matrix (a set of points)
     * @param {SpeedyMatrix} transform 2x3 affine transform
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to dest
     */
    applyAffineTransform(dest, src, transform)
    {
        // validate shapes
        if(src.rows != 2 || dest.rows != 2 || src.columns != dest.columns)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`Invalid shapes`);
        else if(transform.rows != 2 || transform.columns != 3)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalArgumentError(`The affine transformation must be a 2x3 matrix`);

        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.ready().then(({wasm, memory}) => {
            // allocate matrices
            const matptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, transform);
            const srcptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, src);
            const destptr = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.allocateMat32(wasm, memory, dest);

            // copy input matrices to WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyToMat32(wasm, memory, srcptr, src);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyToMat32(wasm, memory, matptr, transform);

            // run the WASM routine
            wasm.exports.Mat32_transform_affine(destptr, srcptr, matptr);

            // copy output matrix from WASM memory
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.copyFromMat32(wasm, memory, destptr, dest);

            // deallocate matrices
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, destptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, srcptr);
            _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.deallocateMat32(wasm, memory, matptr);

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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyMatrixWASM": () => (/* binding */ SpeedyMatrixWASM)
/* harmony export */ });
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/globals */ "./src/utils/globals.js");
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
 * speedy-matrix-wasm.js
 * WebAssembly bridge
 */






/** @typedef {import('./speedy-matrix').SpeedyMatrix} SpeedyMatrix */

/**
 * @typedef {object} SpeedyMatrixWASMMemory a union-like helper for accessing a WebAssembly.Memory object
 * @property {object} as
 * @property {WebAssembly.Memory} as.object
 * @property {Uint8Array} as.uint8
 * @property {Int32Array} as.int32
 * @property {Uint32Array} as.uint32
 * @property {Float32Array} as.float32
 * @property {Float64Array} as.float64
 */

/**
 * @typedef {object} SpeedyMatrixWASMHandle
 * @property {WebAssembly.Instance} wasm
 * @property {SpeedyMatrixWASMMemory} memory
 * @property {WebAssembly.Module} module
 */

/** @type {Uint8Array} WebAssembly binary */
const WASM_BINARY = __webpack_require__(/*! ./wasm/speedy-matrix.wasm.txt */ "./src/core/wasm/speedy-matrix.wasm.txt");

/** @type {WebAssembly.Instance|null} WebAssembly Instance, to be loaded asynchronously */
let _instance = null;

/** @type {WebAssembly.Module|null} WebAssembly Module, to be loaded asynchronously */
let _module = null;

/** @type {SpeedyMatrixWASMMemory} Augmented WebAssembly Memory object */
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
     * @returns {SpeedyPromise<SpeedyMatrixWASMHandle>}
     */
    static ready()
    {
        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_0__.SpeedyPromise((resolve, reject) => {
            SpeedyMatrixWASM._ready(resolve, reject);
        });
    }

    /**
     * Synchronously gets you the WASM instance, augmented memory & module
     * @returns {SpeedyMatrixWASMHandle}
     */
    static get handle()
    {
        if(!_instance || !_module)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.WebAssemblyError(`Can't get WASM handle: routines not yet loaded`);

        return {
            wasm: _instance,
            memory: _memory,
            module: _module,
        };
    }

    /**
     * Gets you the WASM imports bound to a memory object
     * @param {SpeedyMatrixWASMMemory} memory
     * @returns {Object<string,Function>}
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
     * @param {SpeedyMatrixWASMMemory} memory
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
     * @param {SpeedyMatrixWASMMemory} memory
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
     * @param {SpeedyMatrixWASMMemory} memory
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

        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.assert(
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
     * @param {SpeedyMatrixWASMMemory} memory
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

        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.assert(
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
     * @param {function(SpeedyMatrixWASMHandle): void} resolve
     * @param {function(Error): void} reject
     * @param {number} [counter]
     */
    static _ready(resolve, reject, counter = 1000)
    {
        if(_instance !== null && _module !== null)
            resolve({ wasm: _instance, memory: _memory, module: _module });
        else if(counter <= 0)
            reject(new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.TimeoutError(`Can't load WASM routines`));
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
     * @param {SpeedyMatrixWASMMemory} memory will be bound to this object
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

        /** @type {SpeedyMatrixWASMMemory} WASM memory */
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.log(this.cstring.get(ptr));
    }

    /**
     * Throws an error
     * @param {number} ptr pointer to char
     */
    fatal(ptr)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.WebAssemblyError(this.cstring.get(ptr));
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
     * @param {SpeedyMatrixWASMMemory} memory
     */
    constructor(memory)
    {
        /** @type {TextDecoder} */
        this._decoder = new TextDecoder('utf-8');

        /** @type {SpeedyMatrixWASMMemory} */
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
 * @param {SpeedyMatrixWASMMemory} memory
 */
(function loadWASM(memory) {
    const base64decode = data => Uint8Array.from(atob(data), v => v.charCodeAt(0));

    // Endianness check
    if(!_utils_globals__WEBPACK_IMPORTED_MODULE_3__.LITTLE_ENDIAN)
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.NotSupportedError(`Can't run WebAssembly code: not in a little-endian machine!`);

    // Load the WASM binary
    _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_0__.SpeedyPromise.resolve(WASM_BINARY)
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

        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.log(`The WebAssembly routines have been loaded!`);
    })
    .catch(err => {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.WebAssemblyError(`Can't load the WebAssembly routines: ${err}`, err);
    });
})(_memory);


/***/ }),

/***/ "./src/core/speedy-matrix.js":
/*!***********************************!*\
  !*** ./src/core/speedy-matrix.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyMatrix": () => (/* binding */ SpeedyMatrix)
/* harmony export */ });
/* harmony import */ var _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-matrix-expr */ "./src/core/speedy-matrix-expr.js");
/* harmony import */ var _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-matrix-wasm */ "./src/core/speedy-matrix-wasm.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
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
 * speedy-matrix.js
 * Matrix class
 */






/** @typedef {"float32"} SpeedyMatrixDtype Matrix data type */
/** @typedef {Float32Array} SpeedyMatrixBufferType Buffer type */
/** @typedef {Float32ArrayConstructor} SpeedyMatrixBufferTypeConstructor Buffer class */
/** @typedef {import('./speedy-matrix-wasm').SpeedyMatrixWASMMemory} SpeedyMatrixWASMMemory */
/** @typedef {import('./speedy-matrix-wasm').SpeedyMatrixWASMHandle} SpeedyMatrixWASMHandle */

/**
 * Matrix class
 */
class SpeedyMatrix extends _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixExpr
{
    /**
     * @private
     * 
     * Low-level constructor
     * @param {number} rows number of rows
     * @param {number} columns number of columns
     * @param {number} step0 step size between two consecutive elements (e.g., 1)
     * @param {number} step1 step size between two consecutive columns (e.g., rows)
     * @param {SpeedyMatrixBufferType} data entries in column-major format
     */
    constructor(rows, columns, step0, step1, data)
    {
        super(rows, columns, _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixExpr.DEFAULT_DTYPE);

        _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Utils.assert(data.constructor === _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixExpr.BUFFER_TYPE[this.dtype]);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Utils.assert(step0 > 0 && step1 >= step0);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Utils.assert(
            data.length + rows * columns === 0 || // empty matrix and empty buffer, or
            data.length === 1 + step0 * (rows - 1) + step1 * (columns - 1) // correctly sized buffer
        );

        /** @type {number} step size between two consecutive elements */
        this._step0 = step0 | 0;

        /** @type {number} step size between two consecutive columns */
        this._step1 = step1 | 0;

        /** @type {SpeedyMatrixBufferType} buffer containing the entries of the matrix in column-major order */
        this._data = data;
    }

    /**
     * Create a new matrix with the specified size and entries
     * @param {number} rows number of rows
     * @param {number} columns number of columns
     * @param {number[]} entries in column-major format
     * @param {SpeedyMatrixDtype} [dtype] data type
     * @returns {SpeedyMatrix}
     */
    static Create(rows, columns, entries, dtype = _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixExpr.DEFAULT_DTYPE)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Utils.assert(rows * columns > 0, `Can't create a matrix without a shape`);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Utils.assert(rows * columns === entries.length, `Can't create matrix: expected ${rows * columns} entries, but found ${entries.length}`);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Utils.assert(Object.prototype.hasOwnProperty.call(_speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixExpr.BUFFER_TYPE, dtype), `Invalid dtype: "${dtype}"`);

        return new SpeedyMatrix(rows, columns, 1, rows, Reflect.construct(_speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixExpr.BUFFER_TYPE[dtype], [entries]));
    }

    /**
     * Create a new matrix filled with zeros with the specified size
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns
     * @param {SpeedyMatrixDtype} [dtype] data type
     * @returns {SpeedyMatrix}
     */
    static Zeros(rows, columns = rows, dtype = _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixExpr.DEFAULT_DTYPE)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Utils.assert(rows * columns > 0, `Can't create a matrix without a shape`);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Utils.assert(Object.prototype.hasOwnProperty.call(_speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixExpr.BUFFER_TYPE, dtype), `Invalid dtype: "${dtype}"`);

        return new SpeedyMatrix(rows, columns, 1, rows, Reflect.construct(_speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixExpr.BUFFER_TYPE[dtype], [rows * columns]));
    }

    /**
     * Create a new matrix filled with ones with the specified size
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns
     * @param {SpeedyMatrixDtype} [dtype] data type
     * @returns {SpeedyMatrix}
     */
    static Ones(rows, columns = rows, dtype = _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixExpr.DEFAULT_DTYPE)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Utils.assert(rows * columns > 0, `Can't create a matrix without a shape`);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Utils.assert(Object.prototype.hasOwnProperty.call(_speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixExpr.BUFFER_TYPE, dtype), `Invalid dtype: "${dtype}"`);

        return new SpeedyMatrix(rows, columns, 1, rows, Reflect.construct(_speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixExpr.BUFFER_TYPE[dtype], [rows * columns]).fill(1));
    }

    /**
     * Create a new identity matrix with the specified size
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns
     * @param {SpeedyMatrixDtype} [dtype] data type
     * @returns {SpeedyMatrix}
     */
    static Eye(rows, columns = rows, dtype = _speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixExpr.DEFAULT_DTYPE)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Utils.assert(rows * columns > 0, `Can't create a matrix without a shape`);
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Utils.assert(Object.prototype.hasOwnProperty.call(_speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixExpr.BUFFER_TYPE, dtype), `Invalid dtype: "${dtype}"`);

        const data = Reflect.construct(_speedy_matrix_expr__WEBPACK_IMPORTED_MODULE_0__.SpeedyMatrixExpr.BUFFER_TYPE[dtype], [rows * columns]);
        for(let j = Math.min(rows, columns) - 1; j >= 0; j--)
            data[j * rows + j] = 1;

        return new SpeedyMatrix(rows, columns, 1, rows, data);
    }

    /**
     * Evaluate an expression synchronously and store the result in a new matrix
     * @param {SpeedyMatrixExpr} expr matrix expression
     * @returns {SpeedyMatrix}
     */
    static From(expr)
    {
        return SpeedyMatrix.Zeros(expr.rows, expr.columns, expr.dtype).setToSync(expr);
    }

    /**
     * Returns a promise that resolves immediately if the WebAssembly routines
     * are ready to be used, or as soon as they do become ready
     * @returns {SpeedyPromise<void>}
     */
    static ready()
    {
        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.ready().then(_ => void(0));
    }

    /**
     * Get the underlying buffer
     * @returns {SpeedyMatrixBufferType}
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Utils.assert(
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
        const mat = /** @type {number[][]} */ ( new Array(rows) );

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
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to this
     */
    setTo(expr)
    {
        return _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.ready().then(_ => {

            // TODO: add support for WebWorkers
            return this.setToSync(expr);

        });
    }

    /**
     * Synchronously set the contents of this matrix to the result of an expression
     * @param {SpeedyMatrixExpr} expr matrix expression
     * @returns {SpeedyMatrix} this
     */
    setToSync(expr)
    {
        const { wasm, memory } = _speedy_matrix_wasm__WEBPACK_IMPORTED_MODULE_1__.SpeedyMatrixWASM.handle;

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
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Utils.assert(
            this._rows === result._rows && this._columns === result._columns && this.dtype === result.dtype,
            `Can't set the values of a ${this.rows} x ${this.columns} ${this.dtype} matrix to those of a ${result.rows} x ${result.columns} ${result.dtype} matrix`
        );

        // deep copy
        const step0 = this._step0, step1 = this._step1, rstep0 = result._step0, rstep1 = result._step1;
        if(step0 === rstep0 && step1 === rstep1 && this._data.length === result._data.length) {
            // fast copy
            this._data.set(result._data);
        }
        else {
            // copy each element
            for(let column = this._columns - 1; column >= 0; column--) {
                for(let row = this._rows - 1; row >= 0; row--)
                    this._data[row * step0 + column * step1] = result._data[row * rstep0 + column * rstep1];
            }
        }

        // done!
        return this;
    }

    /**
     * Fill this matrix with a scalar value
     * @param {number} value
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to this
     */
    fill(value)
    {
        this.fillSync(value);
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__.SpeedyPromise.resolve(this);
    }

    /**
     * Synchronously fill this matrix with a scalar value
     * @param {number} value
     * @returns {SpeedyMatrix} this
     */
    fillSync(value)
    {
        value = +value;

        if(this._rows * this._columns === this._data.length) {
            this._data.fill(value);
            return this;
        }

        for(let column = 0; column < this._columns; column++) {
            for(let row = 0; row < this._rows; row++) {
                this._data[row * this._step0 + column * this._step1] = value;
            }
        }

        return this;
    }

    /**
     * Evaluate this expression
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyMediaSource": () => (/* binding */ SpeedyMediaSource)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/types */ "./src/utils/types.js");
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
 * speedy-media-source.js
 * Wrappers around <img>, <video>, <canvas>, etc.
 */






/** @typedef {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap} SpeedyMediaSourceNativeElement */

/** Internal token for protected constructors */
const PRIVATE_TOKEN = Symbol();

/**
 * An abstract media source: a wrapper around native
 * elements such as: HTMLImageElement, HTMLVideoElement,
 * and so on
 * @abstract
 */
class SpeedyMediaSource
{
    /**
     * @protected Constructor
     * @param {symbol} token
     */
    constructor(token)
    {
        // the constructor is not public
        if(token !== PRIVATE_TOKEN)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalOperationError();

        /** @type {SpeedyMediaSourceNativeElement} underlying media object */
        this._data = null;
    }

    /**
     * Load a media source
     * @param {SpeedyMediaSourceNativeElement} wrappedObject
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    static load(wrappedObject)
    {
        if(wrappedObject instanceof HTMLImageElement)
            return SpeedyImageMediaSource.load(wrappedObject);
        else if(wrappedObject instanceof HTMLVideoElement)
            return SpeedyVideoMediaSource.load(wrappedObject);
        else if(wrappedObject instanceof HTMLCanvasElement)
            return SpeedyCanvasMediaSource.load(wrappedObject);
        else if(wrappedObject instanceof ImageBitmap)
            return SpeedyBitmapMediaSource.load(wrappedObject);
        else
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalArgumentError(`Unsupported media type: ${wrappedObject}`);
    }

    /**
     * The underlying wrapped object
     * @returns {SpeedyMediaSourceNativeElement}
     */
    get data()
    {
        return this._data;
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
     * @abstract
     * @returns {MediaType}
     */
    get type()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.AbstractMethodError();
    }

    /**
     * Media width, in pixels
     * @abstract
     * @returns {number}
     */
    get width()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.AbstractMethodError();
    }

    /**
     * Media height, in pixels
     * @abstract
     * @returns {number}
     */
    get height()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.AbstractMethodError();
    }

    /**
     * Clone this media source
     * @abstract
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.AbstractMethodError();
    }

    /**
     * Release resources associated with this object
     * @returns {null}
     */
    release()
    {
        return (this._data = null);
    }

    /**
     * Load the underlying media
     * @abstract
     * @param {SpeedyMediaSourceNativeElement} element
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(element)
    {
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.AbstractMethodError();
    }

    /**
     * Wait for an event to be triggered in an element
     * @param {Element} element
     * @param {string} eventName
     * @param {number} [timeout] in ms
     * @returns {SpeedyPromise<Element>}
     */
    static _waitUntil(element, eventName, timeout = 30000)
    {
        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__.SpeedyPromise((resolve, reject) => {
            _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.log(`Waiting for ${eventName} to be triggered in ${element}...`);

            const timer = setTimeout(() => {
                reject(new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.TimeoutError(`${eventName} has not been triggered in ${element}: timeout (${timeout}ms)`));
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
     * @private Constructor
     * @param {symbol} token
     */
    constructor(token)
    {
        super(token);

        /** @type {HTMLImageElement} image element */
        this._data = null;
    }

    /**
     * The underlying wrapped object
     * @returns {HTMLImageElement}
     */
    get data()
    {
        return this._data;
    }

    /**
     * The type of the underlying media source
     * @returns {MediaType}
     */
    get type()
    {
        return _utils_types__WEBPACK_IMPORTED_MODULE_3__.MediaType.Image;
    }

    /**
     * Media width, in pixels
     * @returns {number}
     */
    get width()
    {
        return this._data ? this._data.naturalWidth : 0;
    }

    /**
     * Media height, in pixels
     * @returns {number}
     */
    get height()
    {
        return this._data ? this._data.naturalHeight : 0;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalOperationError(`Media not loaded`);

        const newNode = /** @type {HTMLImageElement} */ ( this._data.cloneNode(true) );
        return SpeedyImageMediaSource.load(newNode);
    }

    /**
     * Load the underlying media
     * @param {HTMLImageElement} image
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(image)
    {
        if(this.isLoaded())
            this.release();

        if(image.complete && image.naturalWidth !== 0) { // already loaded?
            return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__.SpeedyPromise(resolve => {
                this._data = image;
                resolve(this);
            });
        }
        else {
            return SpeedyMediaSource._waitUntil(image, 'load').then(() => {
                this._data = image;
                return this;
            });
        }
    }

    /**
     * Load the underlying media
     * @param {HTMLImageElement} image
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    static load(image)
    {
        return new SpeedyImageMediaSource(PRIVATE_TOKEN)._load(image);
    }
}

/**
 * Video media source:
 * a wrapper around HTMLVideoElement
 */
class SpeedyVideoMediaSource extends SpeedyMediaSource
{
    /**
     * @private Constructor
     * @param {symbol} token
     */
    constructor(token)
    {
        super(token);

        /** @type {HTMLVideoElement} video element */
        this._data = null;
    }

    /**
     * The underlying wrapped object
     * @returns {HTMLVideoElement}
     */
    get data()
    {
        return this._data;
    }

    /**
     * The type of the underlying media source
     * @returns {MediaType}
     */
    get type()
    {
        return _utils_types__WEBPACK_IMPORTED_MODULE_3__.MediaType.Video;
    }

    /**
     * Media width, in pixels
     * @returns {number}
     */
    get width()
    {
        // Warning: videoWidth & videoHeight may change at any time !!!
        // so you can't cache these dimensions
        return this._data ? this._data.videoWidth : 0;
    }

    /**
     * Media height, in pixels
     * @returns {number}
     */
    get height()
    {
        return this._data ? this._data.videoHeight : 0;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalOperationError(`Media not loaded`);

        const newNode = /** @type {HTMLVideoElement} */ ( this._data.cloneNode(true) );
        return SpeedyVideoMediaSource.load(newNode);
    }

    /**
     * Load the underlying media
     * @param {HTMLVideoElement} video
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(video)
    {
        if(this.isLoaded())
            this.release();

        if(video.readyState >= 4) { // already loaded?
            return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__.SpeedyPromise(resolve => {
                this._data = video;
                resolve(this);
            });
        }
        else {
            // waitUntil('canplay'); // use readyState >= 3
            return SpeedyMediaSource._waitUntil(video, 'canplaythrough').then(() => {
                this._data = video;
                return this;
            })
        }
    }

    /**
     * Load the underlying media
     * @param {HTMLVideoElement} video
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    static load(video)
    {
        return new SpeedyVideoMediaSource(PRIVATE_TOKEN)._load(video);
    }
}

/**
 * Canvas media source:
 * a wrapper around HTMLCanvasElement
 */
class SpeedyCanvasMediaSource extends SpeedyMediaSource
{
    /**
     * @private Constructor
     * @param {symbol} token
     */
    constructor(token)
    {
        super(token);

        /** @type {HTMLCanvasElement} canvas element */
        this._data = null;
    }

    /**
     * The underlying wrapped object
     * @returns {HTMLCanvasElement}
     */
    get data()
    {
        return this._data;
    }

    /**
     * The type of the underlying media source
     * @returns {MediaType}
     */
    get type()
    {
        return _utils_types__WEBPACK_IMPORTED_MODULE_3__.MediaType.Canvas;
    }

    /**
     * Media width, in pixels
     * @returns {number}
     */
    get width()
    {
        return this._data ? this._data.width : 0;
    }

    /**
     * Media height, in pixels
     * @returns {number}
     */
    get height()
    {
        return this._data ? this._data.height : 0;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalOperationError(`Media not loaded`);

        const newCanvas = _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.createCanvas(this.width, this.height);
        const newContext = newCanvas.getContext('2d');
        newContext.drawImage(this._data, 0, 0);

        return SpeedyCanvasMediaSource.load(newCanvas);
    }

    /**
     * Load the underlying media
     * @param {HTMLCanvasElement} canvas
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(canvas)
    {
        if(this.isLoaded())
            this.release();

        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__.SpeedyPromise(resolve => {
            this._data = canvas;
            resolve(this);
        });
    }

    /**
     * Load the underlying media
     * @param {HTMLCanvasElement} canvas
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    static load(canvas)
    {
        return new SpeedyCanvasMediaSource(PRIVATE_TOKEN)._load(canvas);
    }
}

/**
 * Bitmap media source:
 * a wrapper around ImageBitmap
 */
class SpeedyBitmapMediaSource extends SpeedyMediaSource
{
    /**
     * @private Constructor
     * @param {symbol} token
     */
    constructor(token)
    {
        super(token);

        /** @type {ImageBitmap} image bitmap */
        this._data = null;
    }

    /**
     * The underlying wrapped object
     * @returns {ImageBitmap}
     */
    get data()
    {
        return this._data;
    }

    /**
     * The type of the underlying media source
     * @returns {MediaType}
     */
    get type()
    {
        return _utils_types__WEBPACK_IMPORTED_MODULE_3__.MediaType.Bitmap;
    }

    /**
     * Media width, in pixels
     * @returns {number}
     */
    get width()
    {
        return this._data ? this._data.width : 0;
    }

    /**
     * Media height, in pixels
     * @returns {number}
     */
    get height()
    {
        return this._data ? this._data.height : 0;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalOperationError(`Media not loaded`);

        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__.SpeedyPromise((resolve, reject) => {
            createImageBitmap(this._data).then(
                newBitmap => {
                    const newSource = new SpeedyBitmapMediaSource(PRIVATE_TOKEN);
                    newSource._load(newBitmap).then(resolve, reject);
                },
                reject
            );
        });
    }

    /**
     * Release resources associated with this object
     * @returns {null}
     */
    release()
    {
        if(this._data != null)
            this._data.close();

        return super.release();
    }

    /**
     * Load the underlying media
     * @param {ImageBitmap} bitmap
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(bitmap)
    {
        if(this.isLoaded())
            this.release();

        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__.SpeedyPromise(resolve => {
            this._data = bitmap;
            resolve(this);
        });
    }

    /**
     * Load the underlying media
     * @param {ImageBitmap} bitmap
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    static load(bitmap)
    {
        return new SpeedyBitmapMediaSource(PRIVATE_TOKEN)._load(bitmap);
    }
}

/***/ }),

/***/ "./src/core/speedy-media.js":
/*!**********************************!*\
  !*** ./src/core/speedy-media.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyMedia": () => (/* binding */ SpeedyMedia)
/* harmony export */ });
/* harmony import */ var _gpu_speedy_gpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../gpu/speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _gpu_speedy_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../gpu/speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _speedy_media_source__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./speedy-media-source */ "./src/core/speedy-media-source.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _speedy_size__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./speedy-size */ "./src/core/speedy-size.js");
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
 * speedy-media.js
 * SpeedyMedia implementation
 */










/** @typedef {import('./speedy-media-source').SpeedyMediaSourceNativeElement} SpeedyMediaSourceNativeElement */

/**
 * @typedef {object} SpeedyMediaOptions
 * @property {ImageFormat} [format] default is RGBA
 */

/** A helper used to keep the constructor of SpeedyMedia private */
const PRIVATE_TOKEN = Symbol();

/**
 * SpeedyMedia encapsulates a media element
 * (e.g., image, video, canvas)
 */
class SpeedyMedia
{
    /**
     * @private Constructor. It receives a VALID media source that is ALREADY LOADED.
     * @param {symbol} token
     * @param {SpeedyMediaSource} source
     * @param {SpeedyMediaOptions} [options] options object
     */
    constructor(token, source, options = {})
    {
        // private constructor
        if(token !== PRIVATE_TOKEN)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.IllegalOperationError();



        /** @type {SpeedyMediaSource} media source */
        this._source = source;

        /** @type {ImageFormat} format */
        this._format = options.format !== undefined ? options.format : _utils_types__WEBPACK_IMPORTED_MODULE_2__.ImageFormat.RGBA;

        /** @type {SpeedyMediaOptions} options */
        this._options = Object.freeze({ ...options, format: this._format });



        // validate
        if(!source.isLoaded())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.IllegalOperationError(`Source not loaded: ${source}`);
        else if(this._format !== _utils_types__WEBPACK_IMPORTED_MODULE_2__.ImageFormat.RGBA && this._format !== _utils_types__WEBPACK_IMPORTED_MODULE_2__.ImageFormat.GREY)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.IllegalArgumentError(`Invalid format: ${this._format}`);
    }

    /**
     * Load a media source
     * Will wait until the HTML media source is loaded
     * @param {SpeedyMediaSourceNativeElement} mediaSource An image, video or canvas
     * @param {SpeedyMediaOptions} [options] options object
     * @param {boolean} [log] show log message?
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static load(mediaSource, options = {}, log = true)
    {
        return _speedy_media_source__WEBPACK_IMPORTED_MODULE_5__.SpeedyMediaSource.load(mediaSource).then(source => {
            _utils_utils__WEBPACK_IMPORTED_MODULE_4__.Utils.assert(source.width !== 0 && source.height !== 0);

            // FIXME user could pass an invalid format in options if ImageFormat is made public
            const media = new SpeedyMedia(PRIVATE_TOKEN, source, options);

            // show log message
            if(log)
                _utils_utils__WEBPACK_IMPORTED_MODULE_4__.Utils.log(`Loaded SpeedyMedia with a ${mediaSource}.`);

            // done!
            return media;
        });
    }

    /**
     * The media element (image, video, canvas) encapsulated by this SpeedyMedia object
     * @returns {SpeedyMediaSourceNativeElement} the media element
     */
    get source()
    {
        return this._source ? this._source.data : null;
    }

    /**
     * Gets the width of the media
     * @returns {number} media width
     */
    get width()
    {
        return this._source ? this._source.width : 0;
    }

    /**
     * Gets the height of the media
     * @returns {number} media height
     */
    get height()
    {
        return this._source ? this._source.height : 0;
    }

    /**
     * The type of the media attached to this SpeedyMedia object
     * @returns {"image" | "video" | "canvas" | "bitmap" | "unknown"}
     */
    get type()
    {
        if(this.isReleased())
            return 'unknown';

        switch(this._source.type) {
            case _utils_types__WEBPACK_IMPORTED_MODULE_2__.MediaType.Image:
                return 'image';

            case _utils_types__WEBPACK_IMPORTED_MODULE_2__.MediaType.Video:
                return 'video';

            case _utils_types__WEBPACK_IMPORTED_MODULE_2__.MediaType.Canvas:
                return 'canvas';

            case _utils_types__WEBPACK_IMPORTED_MODULE_2__.MediaType.Bitmap:
                return 'bitmap';

            default: // this shouldn't happen
                return 'unknown';
        }
    }

    /**
     * Returns a read-only object featuring advanced options
     * related to this SpeedyMedia object
     * @returns {SpeedyMediaOptions}
     */
    get options()
    {
        return this._options;
    }

    /**
     * The size of this media, in pixels
     * @returns {SpeedySize}
     */
    size()
    {
        return new _speedy_size__WEBPACK_IMPORTED_MODULE_7__.SpeedySize(this.width, this.height);
    }

    /**
     * Releases resources associated with this media
     * @returns {null}
     */
    release()
    {
        if(!this.isReleased()) {
            _utils_utils__WEBPACK_IMPORTED_MODULE_4__.Utils.log('Releasing SpeedyMedia object...');
            this._source = this._source.release();
        }

        return null;
    }

    /**
     * Has this media been released?
     * @returns {boolean}
     */
    isReleased()
    {
        return this._source == null;
    }

    /**
     * Clones the SpeedyMedia object
     * @returns {SpeedyPromise<SpeedyMedia>} a clone object
     */
    clone()
    {
        // has the media been released?
        if(this.isReleased())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.IllegalOperationError(`Can't clone a SpeedyMedia that has been released`);

        // clone the object
        const clone = new SpeedyMedia(PRIVATE_TOKEN, this._source, this._options);

        // done!
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_6__.SpeedyPromise.resolve(clone);
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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.IllegalOperationError('Can\'t convert SpeedyMedia to ImageBitmap: the media has been released');
        else if(!this._source.isLoaded())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.IllegalOperationError('Can\'t convert SpeedyMedia to bitmap: the media hasn\'t been loaded');
        else if(this._source.type == _utils_types__WEBPACK_IMPORTED_MODULE_2__.MediaType.Bitmap)
            return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_6__.SpeedyPromise.resolve(this._source.data);
        else
            return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_6__.SpeedyPromise((resolve, reject) => createImageBitmap(this._source.data).then(resolve, reject));
    }
}


/***/ }),

/***/ "./src/core/speedy-namespace.js":
/*!**************************************!*\
  !*** ./src/core/speedy-namespace.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyNamespace": () => (/* binding */ SpeedyNamespace)
/* harmony export */ });
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
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
     * @abstract
     * @throws SpeedyError
     */
    constructor()
    {
        // only static methods are allowed
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_0__.AbstractMethodError(`Namespaces can't be instantiated`);
    }
}

/***/ }),

/***/ "./src/core/speedy-point.js":
/*!**********************************!*\
  !*** ./src/core/speedy-point.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPoint2": () => (/* binding */ SpeedyPoint2)
/* harmony export */ });
/* harmony import */ var _speedy_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-vector */ "./src/core/speedy-vector.js");
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
        return new _speedy_vector__WEBPACK_IMPORTED_MODULE_0__.SpeedyVector2(this.x - p.x, this.y - p.y);
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedySize": () => (/* binding */ SpeedySize)
/* harmony export */ });
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyVector2": () => (/* binding */ SpeedyVector2)
/* harmony export */ });
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

/***/ "./src/gpu/programs/filters.js":
/*!*************************************!*\
  !*** ./src/gpu/programs/filters.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyProgramGroupFilters": () => (/* binding */ SpeedyProgramGroupFilters)
/* harmony export */ });
/* harmony import */ var _speedy_gpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shaders/filters/convolution */ "./src/gpu/shaders/filters/convolution.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
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
 * filters.js
 * Image filtering on the GPU
 */









//
// Shaders
//

// Convert to greyscale
const rgb2grey = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_2__.importShader)('filters/rgb2grey.glsl')
                .withArguments('image');

// Convolution
const convolution = [3, 5, 7].reduce((obj, ksize) => ((obj[ksize] =
                        (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_2__.importShader)('filters/convolution2d.glsl')
                       .withDefines({ 'KERNEL_SIZE_SQUARED': ksize * ksize })
                       .withArguments('image', 'kernel')
                    ), obj), {});

// Separable convolution
const convolutionX = [3, 5, 7, 9, 11, 13, 15].reduce((obj, ksize) => ((obj[ksize] =
                         (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_2__.importShader)('filters/convolution1d.glsl')
                        .withDefines({ 'KERNEL_SIZE': ksize, 'AXIS': 0 })
                        .withArguments('image', 'kernel')
                     ), obj), {});

const convolutionY = [3, 5, 7, 9, 11, 13, 15].reduce((obj, ksize) => ((obj[ksize] =
                         (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_2__.importShader)('filters/convolution1d.glsl')
                        .withDefines({ 'KERNEL_SIZE': ksize, 'AXIS': 1 })
                        .withArguments('image', 'kernel')
                     ), obj), {});
// Median filter
const median = [3, 5, 7].reduce((obj, ksize) => ((obj[ksize] =
                   (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_2__.importShader)('filters/fast-median.glsl')
                  .withDefines({ 'KERNEL_SIZE': ksize })
                  .withArguments('image')
               ), obj), {});

// Normalize image
const normalizeGreyscale = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_2__.importShader)('filters/normalize-image.glsl')
                          .withDefines({ 'GREYSCALE': 1 })
                          .withArguments('minmax2d', 'minValue', 'maxValue');

const normalizeColored = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_2__.importShader)('filters/normalize-image.glsl')
                        .withDefines({ 'GREYSCALE': 0 })
                        .withArguments('minmax2dRGB', 'minValue', 'maxValue');

// Nightvision
const nightvision = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_2__.importShader)('filters/nightvision.glsl')
                   .withDefines({ 'GREYSCALE': 0 })
                   .withArguments('image', 'illuminationMap', 'gain', 'offset', 'decay');

const nightvisionGreyscale = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_2__.importShader)('filters/nightvision.glsl')
                            .withDefines({ 'GREYSCALE': 1 })
                            .withArguments('image', 'illuminationMap', 'gain', 'offset', 'decay');



//
// Utilities
//

// Handy conversion for Gaussian filters
// (symmetric kernel, approx. zero after 3*sigma)
const ksize2sigma = ksize => Math.max(1.0, ksize / 6.0);

// Generate a 1D Gaussian kernel
const gaussian = ksize => _utils_utils__WEBPACK_IMPORTED_MODULE_4__.Utils.gaussianKernel(ksize2sigma(ksize), ksize);

// Generate a 1D Box filter
const box = ksize => (new Array(ksize)).fill(1.0 / ksize);



/**
 * SpeedyProgramGroupFilters
 * Image filtering
 */
class SpeedyProgramGroupFilters extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_1__.SpeedyProgramGroup
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
            .declare('illuminationMapLoX', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convX)(_utils_utils__WEBPACK_IMPORTED_MODULE_4__.Utils.gaussianKernel(80, 31)))
            .declare('illuminationMapLoY', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convY)(_utils_utils__WEBPACK_IMPORTED_MODULE_4__.Utils.gaussianKernel(80, 31)))
            .declare('illuminationMapX', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convX)(_utils_utils__WEBPACK_IMPORTED_MODULE_4__.Utils.gaussianKernel(80, 63)))
            .declare('illuminationMapY', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convY)(_utils_utils__WEBPACK_IMPORTED_MODULE_4__.Utils.gaussianKernel(80, 63)))
            .declare('illuminationMapHiX', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convX)(_utils_utils__WEBPACK_IMPORTED_MODULE_4__.Utils.gaussianKernel(80, 255)))
            .declare('illuminationMapHiY', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convY)(_utils_utils__WEBPACK_IMPORTED_MODULE_4__.Utils.gaussianKernel(80, 255)))

            // gaussian: separable kernels
            // see also: http://dev.theomader.com/gaussian-kernel-calculator/
            .declare('gaussian3x', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convX)([ 0.25, 0.5, 0.25 ])) // sigma ~ 1.0
            .declare('gaussian3y', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convY)([ 0.25, 0.5, 0.25 ]))
            .declare('gaussian5x', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convX)([ 0.05, 0.25, 0.4, 0.25, 0.05 ])) // sigma ~ 1.0
            .declare('gaussian5y', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convY)([ 0.05, 0.25, 0.4, 0.25, 0.05 ]))
            .declare('gaussian7x', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convX)(gaussian(7)))
            .declare('gaussian7y', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convY)(gaussian(7)))
            .declare('gaussian9x', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convX)(gaussian(9)))
            .declare('gaussian9y', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convY)(gaussian(9)))
            .declare('gaussian11x', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convX)(gaussian(11)))
            .declare('gaussian11y', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convY)(gaussian(11)))

            // box filter: separable kernels
            .declare('box3x', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convX)(box(3)))
            .declare('box3y', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convY)(box(3)))
            .declare('box5x', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convX)(box(5)))
            .declare('box5y', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convY)(box(5)))
            .declare('box7x', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convX)(box(7)))
            .declare('box7y', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convY)(box(7)))
            .declare('box9x', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convX)(box(9)))
            .declare('box9y', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convY)(box(9)))
            .declare('box11x', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convX)(box(11)))
            .declare('box11y', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_3__.convY)(box(11)))
        ;
    }
}


/***/ }),

/***/ "./src/gpu/programs/keypoints.js":
/*!***************************************!*\
  !*** ./src/gpu/programs/keypoints.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyProgramGroupKeypoints": () => (/* binding */ SpeedyProgramGroupKeypoints)
/* harmony export */ });
/* harmony import */ var _speedy_gpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _speedy_lsh__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../speedy-lsh */ "./src/gpu/speedy-lsh.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
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
 * keypoints.js
 * Facade for various keypoint detection algorithms
 */








// FAST corner detector
const fast9_16 = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/fast.glsl', 'keypoints/fast.vs.glsl')
                .withDefines({ 'FAST_TYPE': 916 })
                .withArguments('corners', 'pyramid', 'lod', 'threshold');

// Harris corner detector
const harris = [1, 3, 5, 7].reduce((obj, win) => ((obj[win] =
                   (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/harris.glsl')
                  .withDefines({ 'WINDOW_SIZE': win })
                  .withArguments('corners', 'pyramid', 'derivatives', 'lod', 'lodStep', 'gaussian')
               ), obj), {});

const harrisScoreFindMax = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/score-findmax.glsl')
                          .withArguments('corners', 'iterationNumber');

const harrisScoreCutoff = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/harris-cutoff.glsl')
                         .withArguments('corners', 'maxScore', 'quality');

// Subpixel refinement
const subpixelQuadratic1d = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/subpixel-refinement.glsl')
                           .withDefines({ 'METHOD': 0 })
                           .withArguments('pyramid', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'maxIterations', 'epsilon');

const subpixelTaylor2d = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/subpixel-refinement.glsl')
                        .withDefines({ 'METHOD': 1 })
                        .withArguments('pyramid', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'maxIterations', 'epsilon');

const subpixelBilinear = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/subpixel-refinement.glsl')
                        .withDefines({ 'METHOD': 2 })
                        .withArguments('pyramid', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'maxIterations', 'epsilon');

const subpixelBicubic = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/subpixel-refinement.glsl')
                       .withDefines({ 'METHOD': 3 })
                       .withArguments('pyramid', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'maxIterations', 'epsilon');

// Scale refinement
const refineScaleLoG = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/refine-scale.glsl')
                      .withDefines({ 'METHOD': 0 })
                      .withArguments('pyramid', 'lodStep', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const refineScaleFAST916 = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/refine-scale.glsl')
                          .withDefines({ 'METHOD': 1 })
                          .withArguments('pyramid', 'lodStep', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'threshold');

// Pixel allocation
const allocateDescriptors = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/allocate-descriptors.glsl')
                            .withArguments('inputEncodedKeypoints', 'inputDescriptorSize', 'inputExtraSize', 'inputEncoderLength', 'outputDescriptorSize', 'outputExtraSize', 'outputEncoderLength');

const allocateExtra = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/allocate-extra.glsl')
                     .withArguments('inputEncodedKeypoints', 'inputDescriptorSize', 'inputExtraSize', 'inputEncoderLength', 'outputDescriptorSize', 'outputExtraSize', 'outputEncoderLength');

const transferToExtra = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/transfer-to-extra.glsl')
                        .withArguments('encodedData', 'strideOfEncodedData', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

// ORB descriptors
const orbDescriptor = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/orb-descriptor.glsl')
                     .withArguments('image', 'encodedCorners', 'extraSize', 'encoderLength');

const orbOrientation = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/orb-orientation.glsl')
                      .withArguments('image', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

// Non-maximum suppression
const nonMaxSuppression = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/nonmax-suppression.glsl')
                         .withDefines({ 'MULTISCALE': 0 })
                         .withArguments('image', 'lodStep');

const multiscaleNonMaxSuppression = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/nonmax-suppression.glsl')
                                   .withDefines({ 'MULTISCALE': 1 })
                                   .withArguments('image', 'lodStep');

const nonmaxSpace = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/nonmax-space.glsl')
                    .withArguments('corners');

const nonmaxScale = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/nonmax-scale.glsl')
                    .withDefines({ 'USE_LAPLACIAN': 1 })
                    .withArguments('corners', 'pyramid', 'pyrLaplacian', 'lodStep');

const nonmaxScaleSimple = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/nonmax-scale.glsl')
                         .withDefines({ 'USE_LAPLACIAN': 0 })
                         .withArguments('corners', 'pyramid', 'lodStep');

const laplacian = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/laplacian.glsl')
                 .withArguments('corners', 'pyramid', 'lodStep', 'lodOffset');

// Keypoint tracking & optical-flow
const lk = [3, 5, 7, 9, 11, 13, 15, 17, 19, 21].reduce((obj, win) => ((obj[win] =
               (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/lk.glsl')
               .withDefines({ 'WINDOW_SIZE': win })
               .withArguments('encodedFlow', 'prevKeypoints', 'nextPyramid', 'prevPyramid', 'level', 'depth', 'numberOfIterations', 'discardThreshold', 'epsilon', 'descriptorSize', 'extraSize', 'encoderLength')
           ), obj), {});

const transferFlow = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/transfer-flow.glsl')
                     .withArguments('encodedFlow', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

// Brute-force matching
const bfMatcherInitCandidates = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/knn-init.glsl')
                               .withDefines({ 'ENCODE_FILTERS': 0 });

const bfMatcherInitFilters = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/knn-init.glsl')
                            .withDefines({ 'ENCODE_FILTERS': 1 });

const bfMatcherTransfer = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/knn-transfer.glsl')
                         .withArguments('encodedMatches', 'encodedKthMatches', 'numberOfMatchesPerKeypoint', 'kthMatch');

const bfMatcher32 = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/bf-knn.glsl')
                    .withDefines({
                        'DESCRIPTOR_SIZE': 32,
                        'NUMBER_OF_KEYPOINTS_PER_PASS': 16,
                    })
                    .withArguments('encodedMatches', 'encodedFilters', 'matcherLength', 'dbEncodedKeypoints', 'dbDescriptorSize', 'dbExtraSize', 'dbEncoderLength', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'passId');

const bfMatcher64 = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/bf-knn.glsl')
                    .withDefines({
                        'DESCRIPTOR_SIZE': 64,
                        'NUMBER_OF_KEYPOINTS_PER_PASS': 8,
                    })
                    .withArguments('encodedMatches', 'encodedFilters', 'matcherLength', 'dbEncodedKeypoints', 'dbDescriptorSize', 'dbExtraSize', 'dbEncoderLength', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'passId');

// LSH-based KNN matching
const lshKnnInitCandidates = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/knn-init.glsl')
                            .withDefines({ 'ENCODE_FILTERS': 0 });

const lshKnnInitFilters = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/knn-init.glsl')
                         .withDefines({ 'ENCODE_FILTERS': 1 });

const lshKnn = _speedy_lsh__WEBPACK_IMPORTED_MODULE_3__.LSH_ACCEPTABLE_DESCRIPTOR_SIZES.reduce((obj, descriptorSize) => ((obj[descriptorSize] = _speedy_lsh__WEBPACK_IMPORTED_MODULE_3__.LSH_ACCEPTABLE_HASH_SIZES.reduce((obj, hashSize) => ((obj[hashSize] = [0, 1, 2].reduce((obj, level) => ((obj[level] =
                  (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/lsh-knn.glsl')
                  .withDefines({
                      'DESCRIPTOR_SIZE': descriptorSize,
                      'HASH_SIZE': hashSize,
                      'LEVEL': level,
                      'SEQUENCE_MAXLEN': _speedy_lsh__WEBPACK_IMPORTED_MODULE_3__.LSH_SEQUENCE_MAXLEN,
                      'SEQUENCE_COUNT': _speedy_lsh__WEBPACK_IMPORTED_MODULE_3__.LSH_SEQUENCE_COUNT,
                  })
                  .withArguments('candidates', 'filters', 'matcherLength', 'tables', 'descriptorDB', 'tableIndex', 'bucketCapacity', 'bucketsPerTable', 'tablesStride', 'descriptorDBStride', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength')
              ), obj), {})), obj), {})), obj), {});

const lshKnnTransfer = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/knn-transfer.glsl')
                       .withArguments('encodedMatches', 'encodedKthMatches', 'numberOfMatchesPerKeypoint', 'kthMatch');

// Keypoint sorting
const sortCreatePermutation = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/sort-keypoints.glsl')
                             .withDefines({ 'STAGE': 1 })
                             .withArguments('encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const sortMergePermutation = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/sort-keypoints.glsl')
                            .withDefines({ 'STAGE': 2 })
                            .withArguments('permutation', 'blockSize', 'dblLog2BlockSize');

const sortApplyPermutation = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/sort-keypoints.glsl')
                            .withDefines({ 'STAGE': 3 })
                            .withArguments('permutation', 'maxKeypoints', 'encodedKeypoints', 'descriptorSize', 'extraSize');

// Keypoint mixing
const mixKeypointsPreInit = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/mix-keypoints.glsl')
                           .withDefines({ 'STAGE': 1 })
                           .withArguments('encodedKeypointsA', 'encodedKeypointsB', 'encoderLengthA', 'encoderLengthB', 'encoderCapacityA', 'encoderCapacityB', 'descriptorSize', 'extraSize', 'encoderLength');

const mixKeypointsInit = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/mix-keypoints.glsl')
                        .withDefines({ 'STAGE': 2 })
                        .withArguments('encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'maxKeypoints');

const mixKeypointsSort = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/mix-keypoints.glsl')
                        .withDefines({ 'STAGE': 3 })
                        .withArguments('array', 'blockSize');

const mixKeypointsView = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/mix-keypoints.glsl')
                        .withDefines({ 'STAGE': 5 })
                        .withArguments('array');

const mixKeypointsApply = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/mix-keypoints.glsl')
                         .withDefines({ 'STAGE': 4 })
                         .withArguments('array', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

// Keypoint encoding
const initLookupTable = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/lookup-of-locations.glsl')
                       .withDefines({ 'FS_OUTPUT_TYPE': 2, 'STAGE': 1 })
                       .withArguments('corners');

const sortLookupTable = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/lookup-of-locations.glsl', 'keypoints/lookup-of-locations.vs.glsl')
                       .withDefines({ 'FS_OUTPUT_TYPE': 2, 'FS_USE_CUSTOM_PRECISION': 1, 'STAGE': 2 })
                       .withArguments('lookupTable', 'blockSize', 'width', 'height');

const viewLookupTable = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/lookup-of-locations.glsl')
                       .withDefines({ 'STAGE': -1 })
                       .withArguments('lookupTable');

const encodeKeypoints = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/encode-keypoints.glsl')
                       .withArguments('corners', 'lookupTable', 'stride', 'descriptorSize', 'extraSize', 'encoderLength', 'encoderCapacity');

const encodeKeypointSkipOffsets = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/encode-keypoint-offsets.glsl')
                                 .withArguments('corners', 'imageSize');

const encodeKeypointLongSkipOffsets = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/encode-keypoint-long-offsets.glsl')
                                     .withDefines({ 'MAX_ITERATIONS': 6 }) // dependent texture reads :(
                                     .withArguments('offsetsImage', 'imageSize');

const encodeKeypointPositions = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/encode-keypoint-positions.glsl')
                               .withArguments('offsetsImage', 'imageSize', 'passId', 'numPasses', 'keypointLimit', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const encodeKeypointProperties = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/encode-keypoint-properties.glsl')
                                .withArguments('corners', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const encodeNullKeypoints = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/encode-null-keypoints.glsl')
                           .withArguments();

const transferOrientation = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/transfer-orientation.glsl')
                           .withArguments('encodedOrientations', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const uploadKeypoints = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/upload-keypoints.glsl')
                       .withDefines({
                            // UBOs can hold at least 16KB of data;
                            // gl.MAX_UNIFORM_BLOCK_SIZE >= 16384
                            // according to the GL ES 3 reference.
                            // Each keypoint uses 16 bytes (vec4)
                           'BUFFER_SIZE': 1024 //16384 / 16
                        })
                       .withArguments('encodedKeypoints', 'startIndex', 'endIndex', 'descriptorSize', 'extraSize', 'encoderLength');

// Geometric transformations
const applyHomography = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/apply-homography.glsl')
                        .withArguments('homography', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

// Keypoint filters
const clipBorder = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/clip-border.glsl')
                  .withArguments('imageWidth', 'imageHeight', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const distanceFilter = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/distance-filter.glsl')
                      .withArguments('encodedKeypointsA', 'encoderLengthA', 'encodedKeypointsB', 'encoderLengthB', 'descriptorSize', 'extraSize', 'encoderLength', 'threshold');

const hammingDistanceFilter32 = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/hamming-distance-filter.glsl')
                               .withDefines({ 'DESCRIPTOR_SIZE': 32 })
                               .withArguments('encodedKeypointsA', 'encoderLengthA', 'encodedKeypointsB', 'encoderLengthB', 'descriptorSize', 'extraSize', 'encoderLength', 'threshold');

const hammingDistanceFilter64 = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/hamming-distance-filter.glsl')
                               .withDefines({ 'DESCRIPTOR_SIZE': 64 })
                               .withArguments('encodedKeypointsA', 'encoderLengthA', 'encodedKeypointsB', 'encoderLengthB', 'descriptorSize', 'extraSize', 'encoderLength', 'threshold');

// Other utilities
const shuffle = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/shuffle.glsl')
               .withDefines({ 'PERMUTATION_MAXLEN': 2048 })
               .withArguments('encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const clip = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_4__.importShader)('keypoints/clip.glsl')
            .withArguments('encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'maxKeypoints');

/**
 * SpeedyProgramGroupKeypoints
 * Keypoint detection
 */
class SpeedyProgramGroupKeypoints extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_1__.SpeedyProgramGroup
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
            .declare('harrisScoreFindMax', harrisScoreFindMax, {
                ...this.program.usesPingpongRendering()
            })
            .declare('harrisScoreCutoff', harrisScoreCutoff)

            //
            // Subpixel refinement
            //
            .declare('subpixelQuadratic1d', subpixelQuadratic1d)
            .declare('subpixelTaylor2d', subpixelTaylor2d)
            .declare('subpixelBicubic', subpixelBicubic)
            .declare('subpixelBilinear', subpixelBilinear)

            //
            // Scale refinement
            //
            .declare('refineScaleLoG', refineScaleLoG)
            .declare('refineScaleFAST916', refineScaleFAST916)

            //
            // Pixel allocation
            //
            .declare('allocateDescriptors', allocateDescriptors)
            .declare('allocateExtra', allocateExtra)
            .declare('transferToExtra', transferToExtra)

            //
            // ORB descriptors
            //
            .declare('orbDescriptor', orbDescriptor)
            .declare('orbOrientation', orbOrientation)

            //
            // Non-maximum suppression
            //
            .declare('nonmax', nonMaxSuppression)
            .declare('pyrnonmax', multiscaleNonMaxSuppression)
            .declare('nonmaxSpace', nonmaxSpace)
            .declare('nonmaxScale', nonmaxScale)
            .declare('nonmaxScaleSimple', nonmaxScaleSimple)
            .declare('laplacian', laplacian)

            //
            // LK optical-flow
            //
            .declare('lk21', lk[21], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk19', lk[19], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk17', lk[17], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk15', lk[15], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk13', lk[13], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk11', lk[11], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk9', lk[9], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk7', lk[7], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk5', lk[5], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk3', lk[3], {
                ...this.program.usesPingpongRendering()
            })
            .declare('transferFlow', transferFlow)

            //
            // Brute-force KNN matching
            //
            .declare('bfMatcherInitCandidates', bfMatcherInitCandidates)
            .declare('bfMatcherInitFilters', bfMatcherInitFilters)
            .declare('bfMatcherTransfer', bfMatcherTransfer, {
                ...this.program.usesPingpongRendering()
            })
            .declare('bfMatcher32', bfMatcher32, {
                ...this.program.usesPingpongRendering()
            })
            .declare('bfMatcher64', bfMatcher64, {
                ...this.program.usesPingpongRendering()
            })

            //
            // LSH-based KNN matching
            //
            .declare('lshKnnInitCandidates', lshKnnInitCandidates)
            .declare('lshKnnInitFilters', lshKnnInitFilters)
            .declare('lshKnnTransfer', lshKnnTransfer, {
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
            // Keypoint mixing
            //
            .declare('mixKeypointsPreInit', mixKeypointsPreInit)
            .declare('mixKeypointsInit', mixKeypointsInit)
            .declare('mixKeypointsSort', mixKeypointsSort, {
                ...this.program.usesPingpongRendering()
            })
            .declare('mixKeypointsView', mixKeypointsView)
            .declare('mixKeypointsApply', mixKeypointsApply)

            //
            // Keypoint encoders
            //
            .declare('encodeNullKeypoints', encodeNullKeypoints)
            .declare('encodeKeypoints', encodeKeypoints)
            .declare('initLookupTable', initLookupTable)
            .declare('sortLookupTable', sortLookupTable, {
                ...this.program.usesPingpongRendering()
            })
            .declare('viewLookupTable', viewLookupTable)


            .declare('encodeKeypointSkipOffsets', encodeKeypointSkipOffsets)
            .declare('encodeKeypointLongSkipOffsets', encodeKeypointLongSkipOffsets, {
                ...this.program.usesPingpongRendering()
            })
            .declare('encodeKeypointPositions', encodeKeypointPositions, {
                ...this.program.usesPingpongRendering()
            })
            .declare('encodeKeypointProperties', encodeKeypointProperties)



            .declare('transferOrientation', transferOrientation)
            .declare('uploadKeypoints', uploadKeypoints, {
                ...this.program.usesPingpongRendering()
            })

            //
            // Geometric transformations
            //
            .declare('applyHomography', applyHomography)

            //
            // Keypoint filters
            //
            .declare('clipBorder', clipBorder)
            .declare('distanceFilter', distanceFilter)
            .declare('hammingDistanceFilter32', hammingDistanceFilter32)
            .declare('hammingDistanceFilter64', hammingDistanceFilter64)

            //
            // Other utilities
            //
            .declare('shuffle', shuffle)
            .declare('clip', clip)
        ;

        //
        // LSH-based KNN matching
        //
        for(const descriptorSize of Object.keys(lshKnn)) {
            for(const hashSize of Object.keys(lshKnn[descriptorSize])) {
                for(const level of Object.keys(lshKnn[descriptorSize][hashSize])) {
                    const name = `lshKnn${descriptorSize}h${hashSize}lv${level}`;
                    this.declare(name, lshKnn[descriptorSize][hashSize][level], {
                        ...this.program.usesPingpongRendering()
                    });
                }
            }
        }
    }
}

/***/ }),

/***/ "./src/gpu/programs/pyramids.js":
/*!**************************************!*\
  !*** ./src/gpu/programs/pyramids.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyProgramGroupPyramids": () => (/* binding */ SpeedyProgramGroupPyramids)
/* harmony export */ });
/* harmony import */ var _speedy_gpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shaders/filters/convolution */ "./src/gpu/shaders/filters/convolution.js");
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
 * pyramids.js
 * Image pyramids
 */









//
// Shaders
//

const upsample2 = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_3__.importShader)('pyramids/upsample2.glsl').withArguments('image');
const downsample2 = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_3__.importShader)('pyramids/downsample2.glsl').withArguments('image');


/**
 * SpeedyProgramGroupPyramids
 * Image pyramids
 */
class SpeedyProgramGroupPyramids extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_1__.SpeedyProgramGroup
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
            // pick a = 0.4 for gaussian approximation (sigma = 1)
            .declare('smoothX', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_4__.convX)([
                0.05, 0.25, 0.4, 0.25, 0.05
            ]))
            .declare('smoothY', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_4__.convY)([
                0.05, 0.25, 0.4, 0.25, 0.05
            ]))
            /*
            .declare('reduce', conv2D([
                0.00250, 0.01250, 0.02000, 0.01250, 0.00250,
                0.01250, 0.06250, 0.10000, 0.06250, 0.01250,
                0.02000, 0.10000, 0.16000, 0.10000, 0.02000,
                0.01250, 0.06250, 0.10000, 0.06250, 0.01250,
                0.00250, 0.01250, 0.02000, 0.01250, 0.00250
            ]))
            */

            // smoothing for 2x image
            // same rules as above with sum(k) = 2
            .declare('smoothX2', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_4__.convX)([
                0.1, 0.5, 0.8, 0.5, 0.1
                // NOTE: this would saturate the image, but we apply it
                // on a 2x upsampled version with lots of zero pixels
            ]))
            .declare('smoothY2', (0,_shaders_filters_convolution__WEBPACK_IMPORTED_MODULE_4__.convY)([
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyProgramGroupTransforms": () => (/* binding */ SpeedyProgramGroupTransforms)
/* harmony export */ });
/* harmony import */ var _speedy_gpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/errors */ "./src/utils/errors.js");
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
 * transforms.js
 * Geometric transformations
 */








//
// Shaders
//

// Perspective warp
const warpPerspective = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_2__.importShader)('transforms/warp-perspective.glsl')
                        .withArguments('image', 'inverseHomography');

// Resize image
const resizeNearest = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_2__.importShader)('transforms/resize.glsl')
                     .withDefines({
                         'INTERPOLATION_METHOD': 0 // Nearest neighbors
                     })
                     .withArguments('image');

const resizeBilinear = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_2__.importShader)('transforms/resize.glsl')
                      .withDefines({
                          'INTERPOLATION_METHOD': 1 // Bilinear interpolation
                      })
                      .withArguments('image');

// Additive mix (TODO create a new program group?)
const additiveMix = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_2__.importShader)('transforms/additive-mix.glsl')
                    .withArguments('image0', 'image1', 'alpha', 'beta', 'gamma');

/**
 * SpeedyProgramGroupTransforms
 * Geometric transformations
 */
class SpeedyProgramGroupTransforms extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_1__.SpeedyProgramGroup
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
            .declare('resizeNearest', resizeNearest)
            .declare('resizeBilinear', resizeBilinear)
            .declare('additiveMix', additiveMix)
        ;
    }
}

/***/ }),

/***/ "./src/gpu/programs/utils.js":
/*!***********************************!*\
  !*** ./src/gpu/programs/utils.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyProgramGroupUtils": () => (/* binding */ SpeedyProgramGroupUtils)
/* harmony export */ });
/* harmony import */ var _speedy_gpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../speedy-program-group */ "./src/gpu/speedy-program-group.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
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
 * utils.js
 * GPU utilities
 */









//
// Shaders
//

// Copy image
const copy = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_3__.importShader)('utils/copy.glsl').withArguments('image');

// Copy keypoints
const copyKeypoints = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_3__.importShader)('utils/copy-raster.glsl').withDefines({ 'TYPE': 1 }).withArguments('image');

// Copy 2D vectors
const copy2DVectors = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_3__.importShader)('utils/copy-raster.glsl').withDefines({ 'TYPE': 2 }).withArguments('image');

// Flip y-axis for output
const flipY = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_3__.importShader)('utils/copy.glsl', 'utils/flip-y.vs.glsl').withArguments('image');

// Fill image with a constant
const fill = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_3__.importShader)('utils/fill.glsl').withArguments('value');

// Fill zero or more color components of the input image with a constant value
const fillComponents = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_3__.importShader)('utils/fill-components.glsl').withArguments('image', 'pixelComponents', 'value');

// Copy the src component of src to zero or more color components of a copy of dest
const copyComponents = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_3__.importShader)('utils/copy-components.glsl').withArguments('dest', 'src', 'destComponents', 'srcComponentId');

// Scan the entire image and find the minimum & maximum pixel intensity
const scanMinMax2D = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_3__.importShader)('utils/scan-minmax2d.glsl').withArguments('image', 'iterationNumber');

// Compute the partial derivatives of an image
const sobelDerivatives = (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_3__.importShader)('utils/sobel-derivatives.glsl', 'utils/sobel-derivatives.vs.glsl').withArguments('pyramid', 'lod');




/**
 * SpeedyProgramGroupUtils
 * Utility operations
 */
class SpeedyProgramGroupUtils extends _speedy_program_group__WEBPACK_IMPORTED_MODULE_1__.SpeedyProgramGroup
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     */
    constructor(gpu)
    {
        super(gpu);
        this
            // render to the canvas
            .declare('renderToCanvas', flipY, {
                ...this.program.rendersToCanvas()
            })

            // copy image
            .declare('copy', copy)

            // copy keypoints
            .declare('copyKeypoints', copyKeypoints)

            // copy 2D vectors
            .declare('copy2DVectors', copy2DVectors)

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

            // Compute the partial derivatives of an image
            .declare('sobelDerivatives', sobelDerivatives)
        ;
    }
}

/***/ }),

/***/ "./src/gpu/shader-declaration.js":
/*!***************************************!*\
  !*** ./src/gpu/shader-declaration.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShaderDeclaration": () => (/* binding */ ShaderDeclaration),
/* harmony export */   "importShader": () => (/* binding */ importShader),
/* harmony export */   "createShader": () => (/* binding */ createShader)
/* harmony export */ });
/* harmony import */ var _shader_preprocessor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shader-preprocessor */ "./src/gpu/shader-preprocessor.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
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

const DEFAULT_VERTEX_SHADER_PREFIX = `#version 300 es
precision highp float;
precision highp int;

layout (location=${DEFAULT_ATTRIBUTES_LOCATION.position}) in vec2 ${DEFAULT_ATTRIBUTES.position};
layout (location=${DEFAULT_ATTRIBUTES_LOCATION.texCoord}) in vec2 ${DEFAULT_ATTRIBUTES.texCoord};
out highp vec2 texCoord;
uniform highp vec2 texSize;

#define vsinit() \
gl_Position = vec4(${DEFAULT_ATTRIBUTES.position}, 0.0f, 1.0f); \
texCoord = ${DEFAULT_ATTRIBUTES.texCoord};
\n\n`;

const DEFAULT_VERTEX_SHADER = `#define vsmain() ;`;

const DEFAULT_VERTEX_SHADER_SUFFIX = `\n\nvoid main() { vsinit(); vsmain(); }\n`;

const DEFAULT_FRAGMENT_SHADER_PREFIX = `#version 300 es

#if @FS_USE_CUSTOM_PRECISION@ == 0
precision mediump float; // ~float16
precision mediump sampler2D;
precision highp int; // int32
#endif

#if @FS_OUTPUT_TYPE@ == 0
#define OUT_TYPE mediump vec4
#elif @FS_OUTPUT_TYPE@ == 1
#define OUT_TYPE mediump ivec4
#elif @FS_OUTPUT_TYPE@ == 2
#define OUT_TYPE mediump uvec4
#else
#error Unknown FS_OUTPUT_TYPE
#endif

out OUT_TYPE color;
in highp vec2 texCoord;
uniform highp vec2 texSize;

@include "global.glsl"\n\n`;

const PRIVATE_TOKEN = Symbol();

/**
 * @typedef {object} ShaderDeclarationFilepathOptions
 * @property {"filepath"} type
 * @property {string} filepath
 * @property {string} [vsfilepath]
 *
 * @typedef {object} ShaderDeclarationSourceOptions
 * @property {"source"} type
 * @property {string} source
 * @property {string} [vssource]
 *
 * @typedef {ShaderDeclarationFilepathOptions | ShaderDeclarationSourceOptions} ShaderDeclarationOptions
 */

/** @typedef {import('./shader-preprocessor').ShaderDefines} ShaderDefines */

/**
 * Shader Declaration
 */
class ShaderDeclaration
{
    /**
     * @private Constructor
     * @param {ShaderDeclarationOptions} options
     * @param {Symbol} privateToken
     */
    constructor(options, privateToken)
    {
        if(privateToken !== PRIVATE_TOKEN)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.IllegalOperationError(); // private constructor!

        /** @type {string} original source code provided by the user (fragment shader) */
        this._source = (() => {
            switch(options.type) {
                case 'filepath': return __webpack_require__("./src/gpu/shaders sync recursive ^\\.\\/.*$")("./" + options.filepath);
                case 'source':   return options.source;
                default:         return /** @type {never} */ ( '' );
             }
        })();

        /** @type {string} vertex shader source code (without preprocessing) */
        this._vssource = (() => {
            switch(options.type) {
                case 'filepath': return options.vsfilepath ? __webpack_require__("./src/gpu/shaders sync recursive ^\\.\\/.*$")("./" + options.vsfilepath) : DEFAULT_VERTEX_SHADER;
                case 'source':   return options.vssource ? options.vssource : DEFAULT_VERTEX_SHADER;
                default:         return /** @type {never} */ ( '' );
             }
        })();

        /** @type {string} preprocessed source code of the fragment shader */
        this._fragmentSource = _shader_preprocessor__WEBPACK_IMPORTED_MODULE_0__.ShaderPreprocessor.run(DEFAULT_FRAGMENT_SHADER_PREFIX + this._source);

        /** @type {string} preprocessed source code of the vertex shader */
        this._vertexSource = _shader_preprocessor__WEBPACK_IMPORTED_MODULE_0__.ShaderPreprocessor.run(DEFAULT_VERTEX_SHADER_PREFIX + this._vssource + DEFAULT_VERTEX_SHADER_SUFFIX);

        /** @type {string} filepath of the fragment shader */
        this._filepath = options.type === 'filepath' ? options.filepath : '<in-memory>';

        /** @type {string} filepath of the vertex shader */
        this._vsfilepath = options.type === 'filepath' && options.vsfilepath ? options.vsfilepath : '<in-memory>';

        /** @type {string[]} an ordered list of uniform names */
        this._arguments = [];

        /** @type {Map<string,string>} it maps uniform names to their types */
        this._uniforms = this._autodetectUniforms(this._fragmentSource + '\n' + this._vertexSource);

        /** @type {ShaderDefines} it maps externally #defined constants to their values */
        this._defines = new Map();
    }

    /**
     * Creates a new Shader directly from a GLSL source
     * @param {string} source fragment shader
     * @param {string|null} [vssource] vertex shader
     * @returns {ShaderDeclaration}
     */
    static create(source, vssource = null)
    {
        return new ShaderDeclaration({ type: 'source', source, vssource }, PRIVATE_TOKEN);
    }

    /**
     * Import a Shader from a file containing a GLSL source
     * @param {string} filepath path to .glsl file relative to the shaders/ folder
     * @param {string} [vsfilepath] path to a .vs.glsl file relative to the shaders/ folder
     * @returns {ShaderDeclaration}
     */
    static import(filepath, vsfilepath = null)
    {
        if(!String(filepath).match(/^[a-zA-Z0-9_\-/]+\.glsl$/))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.FileNotFoundError(`Can't import fragment shader at "${filepath}"`);
        else if(vsfilepath != null && !String(vsfilepath).match(/^[a-zA-Z0-9_\-/]+\.vs\.glsl$/))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.FileNotFoundError(`Can't import vertex shader at "${vsfilepath}"`);

        return new ShaderDeclaration({ type: 'filepath', filepath, vsfilepath }, PRIVATE_TOKEN);
    }

    /**
     * Specify the list & order of arguments to be
     * passed to the shader
     * @param  {...string} args argument names
     * @returns {this}
     */
    withArguments(...args)
    {
        // the list of arguments may be declared only once
        if(this._arguments.length > 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.IllegalOperationError(`Redefinition of shader arguments`);

        // get arguments
        this._arguments = args.map(arg => String(arg));

        // validate
        for(const argname of this._arguments) {
            if(!this._uniforms.has(argname)) {
                if(!this._uniforms.has(argname + '[0]'))
                    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.IllegalArgumentError(`Argument "${argname}" has not been declared in the shader`);
            }
        }

        // done!
        return this;
    }

    /**
     * Specify a set of #defines to be prepended to the fragment shader
     * @param {Object<string,number>} defines key-value pairs (define-name: define-value)
     * @returns {this}
     */
    withDefines(defines)
    {
        // the list of #defines may be defined only once
        if(this._defines.size > 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.IllegalOperationError(`Redefinition of externally defined constants of a shader`);

        // store and write the #defines
        const defs = [], keys = Object.keys(defines);
        for(const key of keys) {
            const value = Number(defines[key]); // force numeric values (just in case)
            this._defines.set(key, value);
            defs.push(`#define ${key} ${value}\n`);
        }

        // update the shaders & the uniforms
        const source = DEFAULT_FRAGMENT_SHADER_PREFIX + defs.join('') + this._source;
        const vssource = DEFAULT_VERTEX_SHADER_PREFIX + defs.join('') + this._vssource + DEFAULT_VERTEX_SHADER_SUFFIX;
        this._fragmentSource = _shader_preprocessor__WEBPACK_IMPORTED_MODULE_0__.ShaderPreprocessor.run(source, this._defines);
        this._vertexSource = _shader_preprocessor__WEBPACK_IMPORTED_MODULE_0__.ShaderPreprocessor.run(vssource, this._defines);
        this._uniforms = this._autodetectUniforms(this._fragmentSource + '\n' + this._vertexSource);

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
     * @returns {typeof DEFAULT_ATTRIBUTES}
     */
    get attributes()
    {
        return DEFAULT_ATTRIBUTES;
    }

    /**
     * Get the pre-defined locations of the vertex shader attributes
     * @returns {typeof DEFAULT_ATTRIBUTES_LOCATION}
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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.IllegalArgumentError(`Unrecognized uniform variable: "${name}"`);

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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.IllegalArgumentError(`Unrecognized externally defined constant: "${name}"`);

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
                        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.ParseError(`Unspecified array length for uniform "${name}" in the shader`);

                    // read array name & size
                    const [ array, size ] = [ match[1], Number(match[2]) ];

                    // register uniforms
                    for(let i = 0; i < size; i++)
                        uniforms.set(`${array}[${i}]`, type);
                }
                else {
                    // register a regular uniform
                    if(!uniforms.has(name) || uniforms.get(name) === type)
                        uniforms.set(name, type);
                    else
                        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_1__.IllegalOperationError(`Redefinition of uniform "${name}" in the shader`);
                }
            }
        }

        return uniforms;
    }
}

/**
 * Import a ShaderDeclaration from a GLSL file
 * @param {string} filepath relative to the shaders/ folder (a .glsl file)
 * @param {string|null} [vsfilepath] optional vertex shader (a .vs.glsl file)
 * @returns {ShaderDeclaration}
 */
function importShader(filepath, vsfilepath = null)
{
    return ShaderDeclaration.import(filepath, vsfilepath);
}

/**
 * Create a ShaderDeclaration from a GLSL source code
 * @param {string} source fragment shader
 * @param {string|null} [vssource] optional vertex shader
 * @returns {ShaderDeclaration}
 */
function createShader(source, vssource = null)
{
    return ShaderDeclaration.create(source, vssource);
}

/***/ }),

/***/ "./src/gpu/shader-preprocessor.js":
/*!****************************************!*\
  !*** ./src/gpu/shader-preprocessor.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShaderPreprocessor": () => (/* binding */ ShaderPreprocessor)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/types */ "./src/utils/types.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
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

    // fragment shader
    'FS_USE_CUSTOM_PRECISION': 0, // use default precision settings
    'FS_OUTPUT_TYPE': 0, // normalized RGBA

    // colors
    'PIXELCOMPONENT_RED': _utils_types__WEBPACK_IMPORTED_MODULE_1__.PixelComponent.RED,
    'PIXELCOMPONENT_GREEN': _utils_types__WEBPACK_IMPORTED_MODULE_1__.PixelComponent.GREEN,
    'PIXELCOMPONENT_BLUE': _utils_types__WEBPACK_IMPORTED_MODULE_1__.PixelComponent.BLUE,
    'PIXELCOMPONENT_ALPHA': _utils_types__WEBPACK_IMPORTED_MODULE_1__.PixelComponent.ALPHA,
});

// Regular Expressions
const commentsRegex = [ /\/\*(.|\s)*?\*\//g , /\/\/.*$/gm ];
const includeRegex = /^\s*@\s*include\s+"(.*?)"/gm;
const constantRegex = /@(\w+)@/g;
const unrollRegex = [
    /@\s*unroll\s+?for\s*\(\s*(int|)\s*(?<counter>\w+)\s*=\s*(-?\d+|\w+)\s*;\s*\k<counter>\s*(<=?)\s*(-?\d+|\w+)\s*;\s*\k<counter>\s*\+\+()\s*\)\s*\{\s*([\s\S]+?)\s*\}/g,
    /@\s*unroll\s+?for\s*\(\s*(int|)\s*(?<counter>\w+)\s*=\s*(-?\d+|\w+)\s*;\s*\k<counter>\s*(<=?)\s*(-?\d+|\w+)\s*;\s*\k<counter>\s*\+=\s*(-?\d+)\s*\)\s*\{\s*([\s\S]+?)\s*\}/g,
];

/** @typedef {Map<string,number>} ShaderDefines */

/**
 * Custom preprocessor for the shaders
 */
class ShaderPreprocessor
{
    /**
     * Runs the preprocessor
     * @param {string} code 
     * @param {ShaderDefines} [defines]
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
                    // Find a defined constant. If not possible, find a global constant
                    defines.has(name) ? Number(defines.get(name)) : (
                        constants[name] !== undefined ? Number(constants[name]) : (
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
    if(String(filename).match(/^[a-zA-Z0-9_-]+\.glsl$/))
        return __webpack_require__("./src/gpu/shaders/include sync recursive ^\\.\\/.*$")("./" + filename);

    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.FileNotFoundError(`Shader preprocessor: can't read file "${filename}"`);
}

/**
 * Unroll for loops in our own preprocessor
 * @param {string} code
 * @param {ShaderDefines} defines
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
 * @param {string} type
 * @param {string} counter
 * @param {string} start
 * @param {string} cmp
 * @param {string} end
 * @param {string} step
 * @param {string} loopcode
 * @returns {string} unrolled loop
 */
function unroll(match, type, counter, start, cmp, end, step, loopcode)
{
    const defines = /** @type {ShaderDefines} */ ( this );

    // check if the loop limits are numeric constants or #defined numbers from the outside
    const hasStart = Number.isFinite(+start) || defines.has(start);
    const hasEnd = Number.isFinite(+end) || defines.has(end);
    if(!hasStart || !hasEnd) {
        if(defines.size > 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.ParseError(`Can't unroll loop: unknown limits (start=${start}, end=${end}). Code:\n\n${match}`);
        else
            return match; // don't unroll now, because defines is empty - maybe we'll succeed in the next pass
    }

    // parse and validate limits & step
    let istart = defines.has(start) ? defines.get(start) : parseInt(start);
    let iend = defines.has(end) ? defines.get(end) : parseInt(end);
    let istep = (step.length == 0) ? 1 : parseInt(step);
    _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(istart <= iend && istep > 0);

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
    iend += (cmp == '<=') ? 1 : 0;
    for(let i = istart; i < iend; i += istep)
        unrolledCode += `{\n${counter} = ${i};\n${loopcode}\n}\n`;

    // close scope
    unrolledCode += '}\n';
    //console.log('Unrolled code:\n\n' + unrolledCode);

    // done!
    return unrolledCode;
}

/***/ }),

/***/ "./src/gpu/shaders/filters/convolution.js":
/*!************************************************!*\
  !*** ./src/gpu/shaders/filters/convolution.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "conv2D": () => (/* binding */ conv2D),
/* harmony export */   "convX": () => (/* binding */ convX),
/* harmony export */   "convY": () => (/* binding */ convY)
/* harmony export */ });
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/errors */ "./src/utils/errors.js");
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
 * convolution.js
 * Convolution shader generators
 */







/**
 * Generate a 2D convolution with a square kernel
 * @param {number[]} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 */
function conv2D(kernel, normalizationConstant = 1.0)
{
    const kernel32 = new Float32Array(kernel.map(x => (+x) * (+normalizationConstant)));
    const kSize = Math.sqrt(kernel32.length) | 0;
    const N = kSize >> 1; // idiv 2

    // validate input
    if(kSize < 1 || kSize % 2 == 0)
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalArgumentError(`Can't perform a 2D convolution with an invalid kSize of ${kSize}`);
    else if(kSize * kSize != kernel32.length)
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalArgumentError(`Invalid 2D convolution kernel of ${kernel32.length} elements (expected: square)`);

    // select the appropriate pixel function
    const pixelAtOffset = (N <= 7) ? 'pixelAtShortOffset' : 'pixelAtLongOffset';

    // code generator
    const foreachKernelElement = fn => _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.cartesian(_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.symmetricRange(N), _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.symmetricRange(N)).map(
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
    return (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_0__.createShader)(source).withArguments('image');
}




/**
 * Generate a 1D convolution function on the x-axis
 * @param {number[]} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 */
function convX(kernel, normalizationConstant = 1.0)
{
    return conv1D('x', kernel, normalizationConstant);
}




/**
 * Generate a 1D convolution function on the y-axis
 * @param {number[]} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 */
function convY(kernel, normalizationConstant = 1.0)
{
    return conv1D('y', kernel, normalizationConstant);
}




/**
 * 1D convolution function generator
 * @param {string} axis either "x" or "y"
 * @param {number[]} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 */
function conv1D(axis, kernel, normalizationConstant = 1.0)
{
    const kernel32 = new Float32Array(kernel.map(x => (+x) * (+normalizationConstant)));
    const kSize = kernel32.length;
    const N = kSize >> 1; // idiv 2

    // validate input
    if(kSize < 1 || kSize % 2 == 0)
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalArgumentError(`Can't perform a 1D convolution with an invalid kSize of ${kSize}`);
    else if(axis != 'x' && axis != 'y')
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalArgumentError(`Can't perform 1D convolution: invalid axis "${axis}"`); // this should never happen

    // select the appropriate pixel function
    const pixelAtOffset = (N <= 7) ? 'pixelAtShortOffset' : 'pixelAtLongOffset';

    // code generator
    const foreachKernelElement = fn => _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.symmetricRange(N).reduce(
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
    return (0,_shader_declaration__WEBPACK_IMPORTED_MODULE_0__.createShader)(source).withArguments('image');
}

/***/ }),

/***/ "./src/gpu/shaders/include sync recursive ^\\.\\/.*$":
/*!************************************************!*\
  !*** ./src/gpu/shaders/include/ sync ^\.\/.*$ ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./colors.glsl": "./src/gpu/shaders/include/colors.glsl",
	"./filters.glsl": "./src/gpu/shaders/include/filters.glsl",
	"./fixed-point.glsl": "./src/gpu/shaders/include/fixed-point.glsl",
	"./float16.glsl": "./src/gpu/shaders/include/float16.glsl",
	"./global.glsl": "./src/gpu/shaders/include/global.glsl",
	"./int32.glsl": "./src/gpu/shaders/include/int32.glsl",
	"./keypoint-descriptors.glsl": "./src/gpu/shaders/include/keypoint-descriptors.glsl",
	"./keypoint-matches.glsl": "./src/gpu/shaders/include/keypoint-matches.glsl",
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

/***/ "./src/gpu/shaders sync recursive ^\\.\\/.*$":
/*!****************************************!*\
  !*** ./src/gpu/shaders/ sync ^\.\/.*$ ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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
	"./include/filters.glsl": "./src/gpu/shaders/include/filters.glsl",
	"./include/fixed-point.glsl": "./src/gpu/shaders/include/fixed-point.glsl",
	"./include/float16.glsl": "./src/gpu/shaders/include/float16.glsl",
	"./include/global.glsl": "./src/gpu/shaders/include/global.glsl",
	"./include/int32.glsl": "./src/gpu/shaders/include/int32.glsl",
	"./include/keypoint-descriptors.glsl": "./src/gpu/shaders/include/keypoint-descriptors.glsl",
	"./include/keypoint-matches.glsl": "./src/gpu/shaders/include/keypoint-matches.glsl",
	"./include/keypoints.glsl": "./src/gpu/shaders/include/keypoints.glsl",
	"./include/math.glsl": "./src/gpu/shaders/include/math.glsl",
	"./include/pyramids.glsl": "./src/gpu/shaders/include/pyramids.glsl",
	"./include/subpixel.glsl": "./src/gpu/shaders/include/subpixel.glsl",
	"./keypoints/allocate-descriptors.glsl": "./src/gpu/shaders/keypoints/allocate-descriptors.glsl",
	"./keypoints/allocate-extra.glsl": "./src/gpu/shaders/keypoints/allocate-extra.glsl",
	"./keypoints/apply-homography.glsl": "./src/gpu/shaders/keypoints/apply-homography.glsl",
	"./keypoints/bf-knn.glsl": "./src/gpu/shaders/keypoints/bf-knn.glsl",
	"./keypoints/clip-border.glsl": "./src/gpu/shaders/keypoints/clip-border.glsl",
	"./keypoints/clip.glsl": "./src/gpu/shaders/keypoints/clip.glsl",
	"./keypoints/distance-filter.glsl": "./src/gpu/shaders/keypoints/distance-filter.glsl",
	"./keypoints/encode-keypoint-long-offsets.glsl": "./src/gpu/shaders/keypoints/encode-keypoint-long-offsets.glsl",
	"./keypoints/encode-keypoint-offsets.glsl": "./src/gpu/shaders/keypoints/encode-keypoint-offsets.glsl",
	"./keypoints/encode-keypoint-positions.glsl": "./src/gpu/shaders/keypoints/encode-keypoint-positions.glsl",
	"./keypoints/encode-keypoint-properties.glsl": "./src/gpu/shaders/keypoints/encode-keypoint-properties.glsl",
	"./keypoints/encode-keypoints.glsl": "./src/gpu/shaders/keypoints/encode-keypoints.glsl",
	"./keypoints/encode-null-keypoints.glsl": "./src/gpu/shaders/keypoints/encode-null-keypoints.glsl",
	"./keypoints/fast.glsl": "./src/gpu/shaders/keypoints/fast.glsl",
	"./keypoints/fast.vs.glsl": "./src/gpu/shaders/keypoints/fast.vs.glsl",
	"./keypoints/hamming-distance-filter.glsl": "./src/gpu/shaders/keypoints/hamming-distance-filter.glsl",
	"./keypoints/harris-cutoff.glsl": "./src/gpu/shaders/keypoints/harris-cutoff.glsl",
	"./keypoints/harris.glsl": "./src/gpu/shaders/keypoints/harris.glsl",
	"./keypoints/knn-init.glsl": "./src/gpu/shaders/keypoints/knn-init.glsl",
	"./keypoints/knn-transfer.glsl": "./src/gpu/shaders/keypoints/knn-transfer.glsl",
	"./keypoints/laplacian.glsl": "./src/gpu/shaders/keypoints/laplacian.glsl",
	"./keypoints/lk.glsl": "./src/gpu/shaders/keypoints/lk.glsl",
	"./keypoints/lookup-of-locations.glsl": "./src/gpu/shaders/keypoints/lookup-of-locations.glsl",
	"./keypoints/lookup-of-locations.vs.glsl": "./src/gpu/shaders/keypoints/lookup-of-locations.vs.glsl",
	"./keypoints/lsh-knn.glsl": "./src/gpu/shaders/keypoints/lsh-knn.glsl",
	"./keypoints/mix-keypoints.glsl": "./src/gpu/shaders/keypoints/mix-keypoints.glsl",
	"./keypoints/nonmax-scale.glsl": "./src/gpu/shaders/keypoints/nonmax-scale.glsl",
	"./keypoints/nonmax-space.glsl": "./src/gpu/shaders/keypoints/nonmax-space.glsl",
	"./keypoints/nonmax-suppression.glsl": "./src/gpu/shaders/keypoints/nonmax-suppression.glsl",
	"./keypoints/orb-descriptor.glsl": "./src/gpu/shaders/keypoints/orb-descriptor.glsl",
	"./keypoints/orb-orientation.glsl": "./src/gpu/shaders/keypoints/orb-orientation.glsl",
	"./keypoints/refine-scale.glsl": "./src/gpu/shaders/keypoints/refine-scale.glsl",
	"./keypoints/score-findmax.glsl": "./src/gpu/shaders/keypoints/score-findmax.glsl",
	"./keypoints/shuffle.glsl": "./src/gpu/shaders/keypoints/shuffle.glsl",
	"./keypoints/sort-keypoints.glsl": "./src/gpu/shaders/keypoints/sort-keypoints.glsl",
	"./keypoints/subpixel-refinement.glsl": "./src/gpu/shaders/keypoints/subpixel-refinement.glsl",
	"./keypoints/transfer-flow.glsl": "./src/gpu/shaders/keypoints/transfer-flow.glsl",
	"./keypoints/transfer-orientation.glsl": "./src/gpu/shaders/keypoints/transfer-orientation.glsl",
	"./keypoints/transfer-to-extra.glsl": "./src/gpu/shaders/keypoints/transfer-to-extra.glsl",
	"./keypoints/upload-keypoints.glsl": "./src/gpu/shaders/keypoints/upload-keypoints.glsl",
	"./pyramids/downsample2.glsl": "./src/gpu/shaders/pyramids/downsample2.glsl",
	"./pyramids/upsample2.glsl": "./src/gpu/shaders/pyramids/upsample2.glsl",
	"./transforms/additive-mix.glsl": "./src/gpu/shaders/transforms/additive-mix.glsl",
	"./transforms/resize.glsl": "./src/gpu/shaders/transforms/resize.glsl",
	"./transforms/warp-perspective.glsl": "./src/gpu/shaders/transforms/warp-perspective.glsl",
	"./utils/copy-components.glsl": "./src/gpu/shaders/utils/copy-components.glsl",
	"./utils/copy-raster.glsl": "./src/gpu/shaders/utils/copy-raster.glsl",
	"./utils/copy.glsl": "./src/gpu/shaders/utils/copy.glsl",
	"./utils/fill-components.glsl": "./src/gpu/shaders/utils/fill-components.glsl",
	"./utils/fill.glsl": "./src/gpu/shaders/utils/fill.glsl",
	"./utils/flip-y.vs.glsl": "./src/gpu/shaders/utils/flip-y.vs.glsl",
	"./utils/scan-minmax2d.glsl": "./src/gpu/shaders/utils/scan-minmax2d.glsl",
	"./utils/sobel-derivatives.glsl": "./src/gpu/shaders/utils/sobel-derivatives.glsl",
	"./utils/sobel-derivatives.vs.glsl": "./src/gpu/shaders/utils/sobel-derivatives.vs.glsl"
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

/***/ "./src/gpu/speedy-descriptordb.js":
/*!****************************************!*\
  !*** ./src/gpu/speedy-descriptordb.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyDescriptorDB": () => (/* binding */ SpeedyDescriptorDB)
/* harmony export */ });
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _core_speedy_namespace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/speedy-namespace */ "./src/core/speedy-namespace.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
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
 * speedy-descriptordb.js
 * A database of binary descriptors in video memory
 */






//
// A database of binary descriptors is a texture that stores
// a set of (descriptor: uint8_t[]) entries.
//

/** @type {number} we use RGBA8 textures to store the descriptors */
const DESCRIPTORDB_BYTESPERPIXEL = 4;

/** @type {number} texture size goes up to 16 MB */
const DESCRIPTORDB_MAXLOG2STRIDE = 11; // 2048x2048 RGBA8 textures are guaranteed to be available in WebGL2 (where is the source of this?)

/**
 * Utility for generating a database of binary descriptors in video memory
 */
class SpeedyDescriptorDB extends _core_speedy_namespace__WEBPACK_IMPORTED_MODULE_1__.SpeedyNamespace
{
    /**
     * Create a database of binary descriptors
     * @param {SpeedyTexture} texture output texture
     * @param {Uint8Array[]} descriptors binary descriptors
     * @param {number} descriptorSize in bytes, a multiple of 4
     * @returns {SpeedyTexture} texture
     */
    static create(texture, descriptors, descriptorSize)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.assert(descriptorSize % DESCRIPTORDB_BYTESPERPIXEL == 0, `Invalid descriptorSize: ${descriptorSize}`);

        const numberOfDescriptors = descriptors.length;
        const pixelsPerDescriptor = descriptorSize / DESCRIPTORDB_BYTESPERPIXEL;

        // find an appropriate texture size
        const n = Math.log2(pixelsPerDescriptor * Math.max(numberOfDescriptors, 1)) / 2;
        const log2stride = Math.min(DESCRIPTORDB_MAXLOG2STRIDE, Math.ceil(n));

        // setup texture parameters
        const stride = 1 << log2stride;
        const width = stride, height = stride; // we use powers-of-two

        // are we within storage capacity?
        const capacity = (width * height) / pixelsPerDescriptor;
        if(numberOfDescriptors > capacity)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.NotSupportedError(`The capacity of the descriptorDB (${capacity} for ${descriptorSize * 8}-bit descriptors) has been exceeded`);

        // create texture data
        const data = new Uint8Array(width * height * DESCRIPTORDB_BYTESPERPIXEL);
        for(let i = 0; i < numberOfDescriptors; i++) {
            const byteOffset = i * descriptorSize;
            const descriptor = descriptors[i];

            // validate input
            _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.assert(descriptor.byteLength === descriptorSize);
            _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.assert(byteOffset + descriptorSize <= data.byteLength);

            // write data
            data.set(descriptor, byteOffset);
        }

        // log data for further study
        const MEGABYTE = 1048576;
        const totalSize = numberOfDescriptors * descriptorSize;
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.log(
            `Creating a ${width}x${height} database of ${numberOfDescriptors} ` +
            `${descriptorSize * 8}-bit descriptors ` +
            `(total size: ${(totalSize / MEGABYTE).toFixed(2)} MB)`
        );

        // upload to the texture
        texture.resize(width, height);
        texture.upload(data);
        return texture;
    }
}

/***/ }),

/***/ "./src/gpu/speedy-gl.js":
/*!******************************!*\
  !*** ./src/gpu/speedy-gl.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyGL": () => (/* binding */ SpeedyGL)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_observable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/observable */ "./src/utils/observable.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
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
 * speedy-gl.js
 * A wrapper around the WebGL Rendering Context
 */






/** @typedef {'default' | 'low-power' | 'high-performance'} SpeedyPowerPreference */

// Constants
const SINGLETON_KEY = Symbol();
const DEFAULT_POWER_PREFERENCE = 'default';

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

/** @type {SpeedyPowerPreference} power preference */
let powerPreference = DEFAULT_POWER_PREFERENCE;



/**
 * A wrapper around the WebGL Rendering Context
 */
class SpeedyGL extends _utils_observable__WEBPACK_IMPORTED_MODULE_1__.Observable
{
    /**
     * Constructor
     * @param {Symbol} key
     * @private
     */
    constructor(key)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(key === SINGLETON_KEY);
        super();



        /** @type {boolean} internal flag */
        this._reinitializeOnContextLoss = true;

        /** @type {HTMLCanvasElement} canvas */
        this._canvas = this._createCanvas(this._reinitialize.bind(this));

        /** @type {WebGL2RenderingContext} WebGL rendering context */
        this._gl = null;



        // create WebGL2 rendering context
        this._gl = this._createContext(this._canvas);
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
        const canvas = _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

        canvas.addEventListener('webglcontextlost', ev => {
            _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.warning(`Lost WebGL2 context`);
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.log(`Creating a ${powerPreference} WebGL2 rendering context...`);

        // does the browser support WebGL2?
        if(typeof WebGL2RenderingContext === 'undefined')
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.NotSupportedError(`This application requires WebGL2. Please use a different browser.`);

         const gl = canvas.getContext('webgl2', {
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            powerPreference: powerPreference,
            alpha: true, // see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#avoid_alphafalse_which_can_be_expensive
            antialias: false,
            depth: false,
            stencil: false,
            desynchronized: true,
        });

        if(!gl)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.NotSupportedError(`Can't create a WebGL2 Rendering Context. Try a different browser!`);

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
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.warning(`Reinitializing WebGL2...`);

        // create new canvas
        this._canvas.remove();
        this._canvas = this._createCanvas(this._reinitialize.bind(this));

        // create new context
        this._gl = this._createContext(this._canvas);

        // notify observers: we have a new context!
        // we need to recreate all textures...
        this._notify();
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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.NotSupportedError('WEBGL_lose_context extension is unavailable');

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

        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_2__.SpeedyPromise(resolve => {
            setTimeout(() => {
                //ext.restoreContext();
                this._reinitializeOnContextLoss = true;
                this._reinitialize();
                setTimeout(() => resolve(ext), 0); // next frame
            }, ms);
        });
    }

    /**
     * Power preference for the WebGL context
     * @returns {SpeedyPowerPreference}
     */
    static get powerPreference()
    {
        return powerPreference;
    }

    /**
     * Power preference for the WebGL context
     * @param {SpeedyPowerPreference} value
     */
    static set powerPreference(value)
    {
        // validate
        if(!(value === 'default' || value === 'low-power' || value === 'high-performance'))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.IllegalArgumentError(`Invalid powerPreference: "${value}"`);

        // the power preference should be set before we create the WebGL context
        if(instance == null || powerPreference !== value) {
            powerPreference = value;

            // recreate the context if it already exists. Experimental.
            if(instance != null)
                instance.loseAndRestoreContext();
        }
    }
}

/***/ }),

/***/ "./src/gpu/speedy-gpu.js":
/*!*******************************!*\
  !*** ./src/gpu/speedy-gpu.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyGPU": () => (/* binding */ SpeedyGPU)
/* harmony export */ });
/* harmony import */ var _speedy_gl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-gl */ "./src/gpu/speedy-gl.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _speedy_program_center__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./speedy-program-center */ "./src/gpu/speedy-program-center.js");
/* harmony import */ var _speedy_texture_pool__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./speedy-texture-pool */ "./src/gpu/speedy-texture-pool.js");
/* harmony import */ var _speedy_texture_uploader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./speedy-texture-uploader */ "./src/gpu/speedy-texture-uploader.js");
/* harmony import */ var _core_speedy_media_source__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/speedy-media-source */ "./src/core/speedy-media-source.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_observable__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/observable */ "./src/utils/observable.js");
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
 * speedy-gpu.js
 * GPU-accelerated routines for Computer Vision
 */












/**
 * GPU-accelerated routines for Computer Vision
 */
class SpeedyGPU extends _utils_observable__WEBPACK_IMPORTED_MODULE_8__.Observable
{
    /**
     * Constructor
     */
    constructor()
    {
        super();

        /** @type {SpeedyGL} cached reference */
        this._speedyGL = _speedy_gl__WEBPACK_IMPORTED_MODULE_0__.SpeedyGL.instance;

        /** @type {SpeedyProgramCenter} GPU-based programs */
        this._programs = new _speedy_program_center__WEBPACK_IMPORTED_MODULE_2__.SpeedyProgramCenter(this);

        /** @type {SpeedyTexturePool} texture pool */
        this._texturePool = new _speedy_texture_pool__WEBPACK_IMPORTED_MODULE_3__.SpeedyTexturePool(this);

        /** @type {SpeedyTextureUploader} texture uploader */
        this._textureUploader = new _speedy_texture_uploader__WEBPACK_IMPORTED_MODULE_4__.SpeedyTextureUploader(this);



        // recreate the state if necessary
        this._speedyGL.subscribe(this._reset, this);
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
            _utils_utils__WEBPACK_IMPORTED_MODULE_7__.Utils.warning(`Resizing the canvas to ${width} x ${height}`);
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
     * @param {SpeedyTexture} outputTexture
     * @returns {SpeedyTexture} outputTexture
     */
    upload(source, outputTexture)
    {
        return this._textureUploader.upload(source, outputTexture);
    }

    /**
     * Releases resources
     * @returns {null}
     */
    release()
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_7__.Utils.assert(!this.isReleased());

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

        this._programs = new _speedy_program_center__WEBPACK_IMPORTED_MODULE_2__.SpeedyProgramCenter(this);
        this._texturePool = new _speedy_texture_pool__WEBPACK_IMPORTED_MODULE_3__.SpeedyTexturePool(this);
        this._textureUploader = new _speedy_texture_uploader__WEBPACK_IMPORTED_MODULE_4__.SpeedyTextureUploader(this);

        this._notify();
    }
}

/***/ }),

/***/ "./src/gpu/speedy-lsh.js":
/*!*******************************!*\
  !*** ./src/gpu/speedy-lsh.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LSH_DEFAULT_NUMBER_OF_TABLES": () => (/* binding */ LSH_DEFAULT_NUMBER_OF_TABLES),
/* harmony export */   "LSH_DEFAULT_HASH_SIZE": () => (/* binding */ LSH_DEFAULT_HASH_SIZE),
/* harmony export */   "LSH_ACCEPTABLE_NUMBER_OF_TABLES": () => (/* binding */ LSH_ACCEPTABLE_NUMBER_OF_TABLES),
/* harmony export */   "LSH_ACCEPTABLE_HASH_SIZES": () => (/* binding */ LSH_ACCEPTABLE_HASH_SIZES),
/* harmony export */   "LSH_ACCEPTABLE_DESCRIPTOR_SIZES": () => (/* binding */ LSH_ACCEPTABLE_DESCRIPTOR_SIZES),
/* harmony export */   "LSH_SEQUENCE_MAXLEN": () => (/* binding */ LSH_SEQUENCE_MAXLEN),
/* harmony export */   "LSH_SEQUENCE_COUNT": () => (/* binding */ LSH_SEQUENCE_COUNT),
/* harmony export */   "SpeedyLSH": () => (/* binding */ SpeedyLSH)
/* harmony export */ });
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _speedy_descriptordb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-descriptordb */ "./src/gpu/speedy-descriptordb.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/globals */ "./src/utils/globals.js");
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
 * speedy-lsh.js
 * GPU-based LSH tables for fast matching of binary descriptors
 */






/*
 *              ALE'S GPU-BASED LSH FOR APPROXIMATE KNN MATCHING
 *              ------------------------------------------------
 *
 * Here is my variant of Locality Sensitive Hashing for GPU-based KNN matching!
 * Indices of keypoint descriptors are stored in several tables, each with many
 * buckets of fixed capacity. In a nutshell, I create a data structure of fixed
 * size to match the keypoints.
 *
 * Buckets in video memory may get full. Wouldn't it be cool if we could use a
 * probabilistic approach to let us work within their storage capacity?
 *
 * Let there be n buckets in a table, each with storage capacity c (holding
 * up to c elements). Buckets are numbered from 0 to n-1.
 *
 * We pick uniformly a random bucket to store a new element in the table. Let
 * X be the chosen bucket. The probability that we'll store the new element in
 * any particular bucket k is:
 *
 * P(X = k) = 1/n   (k = 0, 1, 2, ... n-1)
 *
 * On average, each new element stored in the table inserts 1/n of an element
 * in each bucket. If we add m new elements to the table, each bucket receives
 * m/n elements, on average(*).
 *
 * (*) for all k, define the Ik random variable as 1 if X = k and 0 otherwise.
 *     It follows that the expected value of Ik, E(Ik), is 1/n for all k. In
 *     addition, the expected value of (m Ik) is m * E(ik) = m/n.
 *
 * Now let Yi be the number of elements inserted in bucket i in m additions to
 * the table. We model Yi as Poisson(m/n), since on average, m additions to
 * the table result in m/n new elements being inserted in bucket i. Buckets
 * are picked independently. Hence, for all i, the probability that we insert
 * q elements in bucket i in m additions to the table is:
 *
 * P(Yi = q) = (m/n)^q * exp(-m/n) / q!   (q = 0, 1, 2...)
 *
 * Given that each bucket has storage capacity c, we require Yi <= c with a
 * high probability p (say, p = 0.99). This means that, in m additions, we
 * don't want to exceed the capacity c with high probability. So, let us find
 * a (large) value of m such that:
 *
 * P(Yi <= c) >= p
 *
 * Sounds good! We can find the largest matching m using binary search.
 *
 * I don't think we need to enforce a high probability that ALL buckets stay
 * within their capacity - n is large, we need to use the available space, and
 * we have multiple tables anyway.
 *
 * In practice, the assumption that buckets are picked uniformly doesn't hold:
 * keypoints that are nearby tend to have similar descriptors and buckets are
 * picked according to those descriptors. Still, this model works well enough
 * in practice and it is simple! That's what I like about it!
 *
 * ... now, how I actually do the matching is the theme of the next episode!
 */

/** @type {number} Default number of tables in a LSH data structure */
const LSH_DEFAULT_NUMBER_OF_TABLES = 8;

/** @type {number} Default number of bits of a hash */
const LSH_DEFAULT_HASH_SIZE = 15;

/** @type {number[]} Acceptable number of tables for a LSH data structure */
const LSH_ACCEPTABLE_NUMBER_OF_TABLES = [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32];

/** @type {number[]} Acceptable values for hashSize, in bits */
const LSH_ACCEPTABLE_HASH_SIZES = [10,11,12,13,14,15,16,17,18,19,20];

/** @type {number[]} Acceptable sizes for keypoint descriptors, in bytes */
const LSH_ACCEPTABLE_DESCRIPTOR_SIZES = [32,64];

/**
 * @typedef {Object} LSHProfile LSH profile
 * @property {string} name name of the profile
 * @property {number} capacity maximum number of keypoints that can be stored in such a table
 * @property {number} hashSize number of bits in a keypoint descriptor hash (at most 16)
 * @property {number} tableCount number of tables, preferably a power of 2 (at most 16)
 * @property {number} bucketCapacity maximum number of entries of a bucket of a table
 */

/** @type {function(number,number,number):LSHProfile[]|null} generate LSH profiles sorted by increasing capacity */
const generateLSHProfiles = (t,h,p) => !LSH_ACCEPTABLE_HASH_SIZES.includes(h) || !LSH_ACCEPTABLE_NUMBER_OF_TABLES.includes(t) ? null : [
    {
        name: 'x-small',
        bucketCapacity: 1,
        tableCount: t,
        hashSize: h,
        capacity: findTableCapacity(h, 1, p),
    },
    {
        name: 'small',
        bucketCapacity: 2,
        tableCount: t,
        hashSize: h,
        capacity: findTableCapacity(h, 2, p),
    },
    {
        name: 'small-plus',
        bucketCapacity: 3,
        tableCount: t,
        hashSize: h,
        capacity: findTableCapacity(h, 3, p),
    },
    {
        name: 'medium',
        bucketCapacity: 4,
        tableCount: t,
        hashSize: h,
        capacity: findTableCapacity(h, 4, p),
    },
    {
        name: 'medium-plus',
        bucketCapacity: 5,
        tableCount: t,
        hashSize: h,
        capacity: findTableCapacity(h, 5, p),
    },
    {
        name: 'large',
        bucketCapacity: 6,
        tableCount: t,
        hashSize: h,
        capacity: findTableCapacity(h, 6, p),
    },
    {
        name: 'x-large',
        bucketCapacity: 8,
        tableCount: t,
        hashSize: h,
        capacity: findTableCapacity(h, 8, p),
    },
];

//
// LSH hash sequences: random bits in increasing order
// We generate a few sequences (one for each table) supporting up to 16 hash bits
// We pad each sequence with invalid values at the end - we want to pick any bit with equal probability
//

/** @typedef {Uint32Array} BitSequences flattened array of LSH_SEQUENCE_COUNT sequences of LSH_SEQUENCE_MAXLEN elements each - each entry represents a bit index */
/** @typedef {Object<number,BitSequences>} BitSequencesIndexedByDescriptorSize */
/** @typedef {Object<number,BitSequencesIndexedByDescriptorSize>} LSHSequences */

/** @type {number} maximum number of elements of a sequence */
const LSH_SEQUENCE_MAXLEN = Math.max(...LSH_ACCEPTABLE_HASH_SIZES);

/** @type {number} number of sequences in a BitSequences object */
const LSH_SEQUENCE_COUNT = Math.max(...LSH_ACCEPTABLE_NUMBER_OF_TABLES);

/** @type {function(BitSequences): BitSequences} Sort subsequences of random bits in ascending order */
const partitionedSort = seq => (_utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.range(LSH_SEQUENCE_COUNT)
    .forEach(i => seq.subarray(i * LSH_SEQUENCE_MAXLEN, (i+1) * LSH_SEQUENCE_MAXLEN).sort()),
seq);

/** @type {function(number, BitSequences): BitSequences} Set the last p entries of the input subsequences to an invalid value */
const padSequences = (p, seq) => (_utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.range(LSH_SEQUENCE_COUNT)
    .forEach(i => seq.subarray((i+1) * LSH_SEQUENCE_MAXLEN - p, (i+1) * LSH_SEQUENCE_MAXLEN).fill(0xBADCAFE)),
seq);

/** @type {LSHSequences} the bits we pick to form the hashes, laid out in ascending order and indexed by descriptorSize and hashSize */
const LSH_SEQUENCES = (f => LSH_ACCEPTABLE_HASH_SIZES.reduce((p,o) => ((p[o]=f(o)), p), {}))(h => ({
    // for 256-bit descriptors
    32: partitionedSort(padSequences(LSH_SEQUENCE_MAXLEN - h, new Uint32Array([
        ...(_utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.shuffle(_utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.range(256))),
        ...(_utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.shuffle(_utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.range(256))),
        ...(_utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.shuffle(_utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.range(256))),
    ].slice(0, LSH_SEQUENCE_COUNT * LSH_SEQUENCE_MAXLEN)))),

    // for 512-bit descriptors
    64: partitionedSort(padSequences(LSH_SEQUENCE_MAXLEN - h, new Uint32Array([
        ...(_utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.shuffle(_utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.range(512))),
        ...(_utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.shuffle(_utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.range(512))),
    ].slice(0, LSH_SEQUENCE_COUNT * LSH_SEQUENCE_MAXLEN)))),
}));

//
// Misc
//

/** @type {number} we use RGBA8 textures (32 bits per pixel) as storage */
const LSH_BYTESPERPIXEL = 4;

/** @type {function(number): number} next power of 2 */
const nextPot = x => x > 1 ? 1 << Math.ceil(Math.log2(x)) : 1;



/**
 * GPU-based LSH tables for fast matching of binary descriptors
 */
class SpeedyLSH
{
    /**
     * Constructor
     * @param {SpeedyTexture} lshTables texture to be used as the set of LSH tables
     * @param {SpeedyTexture} descriptorDB texture to be used as the descriptor database
     * @param {Uint8Array[]} descriptors the binary descriptors you'll store (make sure you don't repeat them, otherwise they will just waste space)
     * @param {number} [tableCount] number of LSH tables, preferably a power of two
     * @param {number} [hashSize] number of bits of a hash of a descriptor
     * @param {number} [probability] probability of no discard events happening in the theoretical model
     */
    constructor(lshTables, descriptorDB, descriptors, tableCount = LSH_DEFAULT_NUMBER_OF_TABLES, hashSize = LSH_DEFAULT_HASH_SIZE, probability = 0.95)
    {
        const descriptorCount = descriptors.length;
        const descriptorSize = descriptorCount > 0 ? descriptors[0].byteLength : 0;
        const lshProfiles = generateLSHProfiles(tableCount, hashSize, probability);

        // validate input
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.assert(descriptorCount > 0, `Can't build LSH tables without descriptors!`);
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.assert(LSH_ACCEPTABLE_DESCRIPTOR_SIZES.includes(descriptorSize), `Can't build LSH tables: unacceptable descriptor size of ${descriptorSize} bytes`);
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.assert(descriptors.findIndex(d => d.byteLength !== descriptorSize) < 0, `Can't build LSH tables: incorrectly sized descriptors. Expected ${descriptorSize} bytes for each`);
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.assert(descriptorCount < _utils_globals__WEBPACK_IMPORTED_MODULE_3__.MATCH_MAX_INDEX, `Can't build LSH tables: too many descriptors (${descriptors.length})`);
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.assert(lshProfiles != null, `Can't build LSH tables: unacceptable number of tables (${tableCount}) x hash size (${hashSize})`);

        /** @type {LSHProfile} LSH profile */
        this._profile = lshProfiles.find(profile => descriptorCount <= profile.capacity) || lshProfiles[lshProfiles.length - 1];

        /** @type {number} descriptor size, in bytes */
        this._descriptorSize = descriptorSize;

        /** @type {number} number of descriptors */
        this._descriptorCount = descriptorCount;

        /** @type {BitSequences} bit sequences */
        this._sequences = this._pickSequences(this._descriptorSize);

        /** @type {SpeedyTexture} LSH tables storing indices of descriptors */
        this._tables = this._createStaticTables(lshTables, this._sequences, descriptors, descriptorSize);

        /** @type {SpeedyTexture} a storage of descriptors */
        this._descriptorDB = _speedy_descriptordb__WEBPACK_IMPORTED_MODULE_1__.SpeedyDescriptorDB.create(descriptorDB, descriptors, descriptorSize);
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
     * Number of descriptors stored in this LSH data structure
     * @returns {number}
     */
    get descriptorCount()
    {
        return this._descriptorCount;
    }

    /**
     * LSH bit sequences
     * @returns {BitSequences}
     */
    get sequences()
    {
        return this._sequences;
    }

    /**
     * Number of bits that make a hash
     * @returns {number}
     */
    get hashSize()
    {
        return this._profile.hashSize;
    }

    /**
     * Maximum number of descriptors that can be stored in a bucket of a table
     * @returns {number}
     */
    get bucketCapacity()
    {
        return this._profile.bucketCapacity;
    }

    /**
     * How many buckets per table do we have?
     * @returns {number}
     */
    get bucketsPerTable()
    {
        return 1 << this._profile.hashSize;
    }

    /**
     * Number of LSH tables
     * @returns {number}
     */
    get tableCount()
    {
        return this._profile.tableCount;
    }

    /**
     * Size of one LSH table, in bytes
     * @returns {number}
     */
    get tableSize()
    {
        return this.bucketsPerTable * this.bucketCapacity * LSH_BYTESPERPIXEL;
    }

    /**
     * Size of all LSH tables combined, in bytes
     * @returns {number}
     */
    get totalSize()
    {
        // actually, the total memory in VRAM may be a bit larger than
        // this value, depending on the actual size of the texture
        return this.tableCount * this.tableSize;
    }

    /**
     * LSH tables texture
     * @returns {SpeedyDrawableTexture}
     */
    get tables()
    {
        return this._tables;
    }

    /**
     * A collection of descriptors
     * @returns {SpeedyDrawableTexture}
     */
    get descriptorDB()
    {
        return this._descriptorDB;
    }

    /**
     * Pick the appropriate LSH sequences for a particular descriptor size
     * @param {number} descriptorSize in bytes
     * @returns {BitSequences}
     */
    _pickSequences(descriptorSize)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.assert(Object.prototype.hasOwnProperty.call(LSH_SEQUENCES, this.hashSize));
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.assert(Object.prototype.hasOwnProperty.call(LSH_SEQUENCES[this.hashSize], descriptorSize));

        return LSH_SEQUENCES[this.hashSize][descriptorSize];
    }

    /**
     * Create LSH tables
     * @param {SpeedyTexture} texture output texture
     * @param {BitSequences} sequences bit sequences
     * @param {Uint8Array[]} descriptors non-empty array of binary descriptors, ALL HAVING THE SAME SIZE
     * @param {number} descriptorSize in bytes
     * @returns {SpeedyTexture} texture
     */
    _createStaticTables(texture, sequences, descriptors, descriptorSize)
    {
        const END_OF_LIST = 0xFFFFFFFF;
        const profileName = this._profile.name;
        const tableCapacity = this._profile.capacity;
        const tableCount = this.tableCount;
        const bucketsPerTable = this.bucketsPerTable;
        const bucketSize = this.bucketCapacity * LSH_BYTESPERPIXEL;
        const hashSize = this.hashSize;
        const numberOfPixels = this.tableCount * this.bucketsPerTable * this.bucketCapacity; // watch for overflow?
        const textureWidth = Math.min(nextPot(Math.sqrt(numberOfPixels)), 4096); // 4096 is compatible with most devices according to MDN
        const textureHeight = Math.ceil(numberOfPixels / textureWidth);
        const numberOfDescriptors = descriptors.length;

        // validate input
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.assert(hashSize <= LSH_SEQUENCE_MAXLEN);
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.assert(tableCount <= LSH_SEQUENCE_COUNT);
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.assert(numberOfPixels <= textureWidth * textureHeight);

        // log
        const MEGABYTE = 1048576;
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.log(
            `Building ${tableCount} ${profileName} LSH tables with ${numberOfDescriptors} ` +
            `${descriptorSize * 8}-bit descriptors each and hashSize = ${hashSize} bits ` +
            `(${textureWidth}x${textureHeight}, with ${(this.tableSize / MEGABYTE).toFixed(2)} ` +
            `MB per table and total size = ${(this.totalSize / MEGABYTE).toFixed(2)} MB), `
        );

        // warn the user if there are too many descriptors
        if(numberOfDescriptors > tableCapacity) {
            const exceedingPercentage = 100 * numberOfDescriptors / tableCapacity;
            _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.warning(`There are too many descriptors (${numberOfDescriptors}) for a ${profileName} LSH table. That's ${exceedingPercentage.toFixed(2)}% of its theoretical capacity. Consider increasing the hashSize (currently set to ${hashSize}) or reducing the number of descriptors to avoid degradation.`);
        }

        // create empty LSH tables
        const buffer = new ArrayBuffer(textureWidth * textureHeight * LSH_BYTESPERPIXEL);
        const bytes = (new Uint8Array(buffer)).fill(0xFF);
        const data = new DataView(buffer);

        // shuffle the descriptors...
        // it seems like a good idea to handle collisions of similar descriptors,
        // which may be located next to each other in the array
        const permutation = _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.shuffle(_utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.range(numberOfDescriptors));

        // for each descriptor
        // do everything in little-endian format!
        const numberOfDiscardedDescriptorsPerTable = (new Array(tableCount)).fill(0);
        for(let i = 0; i < numberOfDescriptors; i++) {
            const descriptorIndex = permutation[i]; //i;
            const hashes = this._hashCodes(descriptors[descriptorIndex], sequences);

            // for each table
            for(let table = 0; table < tableCount; table++) {
                // compute hash & memory addresses
                const hash = hashes[table];
                const tableByteOffset = table * bucketsPerTable * bucketSize;
                const bucketByteOffset = tableByteOffset + hash * bucketSize;

                // find the end of the list
                let index = END_OF_LIST;
                for(let entryByteOffset = 0; entryByteOffset < bucketSize; entryByteOffset += LSH_BYTESPERPIXEL) {
                    const byteOffset = bucketByteOffset + entryByteOffset;
                    index = data.getUint32(byteOffset, true);

                    // add the keypoint
                    if(index == END_OF_LIST) {
                        data.setUint32(byteOffset, descriptorIndex, true);
                        break;
                    }
                }

                // note: if the bucket is full, we just discard the entry :\
                // we give this event a probabilistic treatment (see above),
                // so it happens with low probability
                if(index != END_OF_LIST)
                    numberOfDiscardedDescriptorsPerTable[table]++;
            }
        }

        // log data for further study
        const numberOfDiscardedDescriptors = numberOfDiscardedDescriptorsPerTable.reduce((sum, val) => sum + val, 0);
        const profile = numberOfDiscardedDescriptorsPerTable.map(d => 100 * d / numberOfDescriptors);
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.log(
            `When building ${tableCount} ${profileName} LSH tables with ${numberOfDescriptors} ` +
            `${descriptorSize * 8}-bit descriptors each and hashSize = ${hashSize} bits, ` +
            `I got the following discard profile: ` + profile.map(x => x.toFixed(2) + '%').join(', ') + `. ` +
            `Average: ${(100 * numberOfDiscardedDescriptors / (tableCount * numberOfDescriptors)).toFixed(2)}%. ` +
            `Minimum: ${Math.min(...profile).toFixed(2)}%. ` +
            `Table capacity: ${tableCapacity}.`
        );

        // upload the LSH tables to the GPU
        texture.resize(textureWidth, textureHeight);
        texture.upload(bytes);
        return texture;
    }

    /**
     * Pick bits from a binary descriptor
     * @param {Uint8Array} descriptor a single descriptor
     * @param {BitSequences} sequences flattened array of tableCount sequences of LSH_SEQUENCE_MAXLEN elements each
     * @returns {number[]} hash code for each table
     */
    _hashCodes(descriptor, sequences)
    {
        const tableCount = this.tableCount;
        const hashSize = this.hashSize;
        const bucketsPerTable = this.bucketsPerTable;
        const hashes = new Array(tableCount);
        //const descriptorSize = descriptor.length;

        // just to be sure...
        _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.assert(
            hashSize <= LSH_SEQUENCE_MAXLEN &&
            sequences.length >= LSH_SEQUENCE_MAXLEN * tableCount
        );

        // for each table
        for(let table = 0; table < tableCount; table++) {
            const offset = LSH_SEQUENCE_MAXLEN * table;

            // pick bits [ sequences[offset] .. sequences[offset + hashSize-1] ]
            let hash = 0;
            for(let i = 0; i < hashSize; i++) {
                let bit = sequences[offset + i];
                let b = bit >>> 3;
                let m = 1 << (bit & 7);

                //Utils.assert(b < descriptorSize);
                hash = (hash << 1) | ((descriptor[b] & m) != 0);
            }

            // validate & store
            _utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.assert(hash >= 0 && hash < bucketsPerTable);
            hashes[table] = hash;
        }

        // done!
        return hashes;
    }
}

/**
 * Compute P(X <= k), where X ~ Poisson(lambda)
 * @param {number} lambda positive number
 * @param {number} k non-negative integer
 * @returns {number}
 */
function cumulativePoisson(lambda, k)
{
    const exp = Math.exp(-lambda);
    let sum = 1, fat = 1, pow = 1;

    // k should be small!!!
    for(let i = 1; i <= k; i++)
        sum += (pow *= lambda) / (fat *= i);

    return sum * exp;
}

/**
 * Find the maximum number of keypoint descriptors that a table can hold
 * @param {number} hashSize positive integer
 * @param {number} bucketCapacity positive integer
 * @param {number} [probability] probability of no discard events happening in the theoretical model
 * @return {number} optimal table capacity
 */
function findTableCapacity(hashSize, bucketCapacity, probability = 0.99)
{
    const n = 1 << hashSize // number of buckets
    const c = bucketCapacity;
    const p = probability;

    let l = 1, r = n * c; // watch for overflow!
    let m = 0, pm = 0;

    // binary search
    while(l < r) {
        m = Math.floor((l + r) / 2);
        pm = cumulativePoisson(m / n, c);

        if(pm > p) //if(1-pm < 1-p)
            l = m + 1;
        else
            r = m;
    }

    return m;
}


/***/ }),

/***/ "./src/gpu/speedy-program-center.js":
/*!******************************************!*\
  !*** ./src/gpu/speedy-program-center.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyProgramCenter": () => (/* binding */ SpeedyProgramCenter)
/* harmony export */ });
/* harmony import */ var _speedy_gpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _programs_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./programs/utils */ "./src/gpu/programs/utils.js");
/* harmony import */ var _programs_filters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./programs/filters */ "./src/gpu/programs/filters.js");
/* harmony import */ var _programs_keypoints__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./programs/keypoints */ "./src/gpu/programs/keypoints.js");
/* harmony import */ var _programs_pyramids__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./programs/pyramids */ "./src/gpu/programs/pyramids.js");
/* harmony import */ var _programs_transforms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./programs/transforms */ "./src/gpu/programs/transforms.js");
/* harmony import */ var _speedy_program_group__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./speedy-program-group */ "./src/gpu/speedy-program-group.js");
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
        return this._filters || (this._filters = new _programs_filters__WEBPACK_IMPORTED_MODULE_2__.SpeedyProgramGroupFilters(this._gpu));
    }

    /**
     * Geometric transformations
     * @returns {SpeedyProgramGroupTransforms}
     */
    get transforms()
    {
        return this._transforms || (this._transforms = new _programs_transforms__WEBPACK_IMPORTED_MODULE_5__.SpeedyProgramGroupTransforms(this._gpu));
    }

    /**
     * Image pyramids & scale-space
     * @returns {SpeedyProgramGroupPyramids}
     */
    get pyramids()
    {
        return this._pyramids || (this._pyramids = new _programs_pyramids__WEBPACK_IMPORTED_MODULE_4__.SpeedyProgramGroupPyramids(this._gpu));
    }

    /**
     * Keypoint detection & description
     * @returns {SpeedyProgramGroupKeypoints}
     */
    get keypoints()
    {
        return this._keypoints || (this._keypoints = new _programs_keypoints__WEBPACK_IMPORTED_MODULE_3__.SpeedyProgramGroupKeypoints(this._gpu));
    }

    /**
     * Utility programs
     * @returns {SpeedyProgramGroupUtils}
     */
    get utils()
    {
        return this._utils || (this._utils = new _programs_utils__WEBPACK_IMPORTED_MODULE_1__.SpeedyProgramGroupUtils(this._gpu));
    }

    /**
     * Release all programs from all groups. You'll
     * no longer be able to use any of them.
     * @returns {null}
     */
    release()
    {
        for(const key in this) {
            if(Object.prototype.hasOwnProperty.call(this, key) && this[key] != null) {
                const group = this[key];
                if(group instanceof _speedy_program_group__WEBPACK_IMPORTED_MODULE_6__.SpeedyProgramGroup)
                    group.release();
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyProgramGroup": () => (/* binding */ SpeedyProgramGroup)
/* harmony export */ });
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _speedy_program__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-program */ "./src/gpu/speedy-program.js");
/* harmony import */ var _speedy_gpu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./speedy-gpu */ "./src/gpu/speedy-gpu.js");
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
 * speedy-program-group.js
 * An abstract group of programs that run on the GPU
 */





/** @typedef {import('./speedy-program').SpeedyProgramOptions} SpeedyProgramOptions */

/**
 * @typedef {object} SpeedyProgramHelpers
 * @property {function(): SpeedyProgramOptions} usesPingpongRendering
 * @property {function(): SpeedyProgramOptions} rendersToCanvas
*/

/** @const {SpeedyProgramHelpers} Program settings generator */
const PROGRAM_HELPERS = Object.freeze({

    /**
     * Pingpong Rendering: the output texture of a
     * program cannot be used as an input to itself.
     * This is a convenient helper in these situations
     * @returns {SpeedyProgramOptions}
     */
    usesPingpongRendering() {
        return {
            pingpong: true
        };
    },

    /**
     * Render to canvas
     * Use it when we're supposed to see the texture
     * @returns {SpeedyProgramOptions}
     */
    rendersToCanvas() {
        return {
            renderToTexture: false
        };
    },

});


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
     * @param {SpeedyProgramOptions} [options] Program settings
     * @returns {this}
     */
    declare(name, shaderdecl, options = {})
    {
        // lazy instantiation of kernels
        Object.defineProperty(this, name, {
            get: (() => {
                // Why cast a symbol to symbol?
                // Suppress error TS9005: Declaration emit for this file requires using private name 'key'.
                const key = /** @type {symbol} */ ( Symbol(name) );
                return () => this[key] || (this[key] = this._createProgram(shaderdecl, options));
            })()
        });

        return this;
    }

    /**
     * Neat helpers to be used when declaring programs
     * @returns {SpeedyProgramHelpers}
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
     * @param {SpeedyProgramOptions} [options] Program settings
     * @returns {SpeedyProgram}
     */
    _createProgram(shaderdecl, options = {})
    {
        const program = new _speedy_program__WEBPACK_IMPORTED_MODULE_1__.SpeedyProgram(this._gpu.gl, shaderdecl, options);
        this._programs.push(program);
        return program;
    }
}

/***/ }),

/***/ "./src/gpu/speedy-program.js":
/*!***********************************!*\
  !*** ./src/gpu/speedy-program.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyProgram": () => (/* binding */ SpeedyProgram)
/* harmony export */ });
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _shader_declaration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shader-declaration */ "./src/gpu/shader-declaration.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
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
 * speedy-program.js
 * SpeedyProgram class
 */







/** @const {Object<string,string>} Map uniform type to a gl function */
const UNIFORM_SETTERS = Object.freeze({
    'sampler2D': 'uniform1i',
    'isampler2D':'uniform1i',
    'usampler2D':'uniform1i',
    'float':     'uniform1f',
    'int':       'uniform1i',
    'uint':      'uniform1ui',
    'bool':      'uniform1i',
    'vec2':      'uniform2f',
    'vec3':      'uniform3f',
    'vec4':      'uniform4f',
    'ivec2':     'uniform2i',
    'ivec3':     'uniform3i',
    'ivec4':     'uniform4i',
    'uvec2':     'uniform2ui',
    'uvec3':     'uniform3ui',
    'uvec4':     'uniform4ui',
    'bvec2':     'uniform2i',
    'bvec3':     'uniform3i',
    'bvec4':     'uniform4i',
    'mat2':      'uniformMatrix2fv',
    'mat3':      'uniformMatrix3fv',
    'mat4':      'uniformMatrix4fv',
});

/**
 * @typedef {object} SpeedyProgramOptions
 * @property {boolean} [renderToTexture] render results to a texture?
 * @property {boolean} [pingpong] alternate output texture between calls
 */

/** @typedef {number|number[]|boolean|boolean[]|SpeedyTexture} SpeedyProgramUniformValue */

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
     * @param {SpeedyProgramOptions} [options] user options
     */
    constructor(gl, shaderdecl, options = { })
    {
        super('...args', 'return this._self._call(...args)');

        /** @type {SpeedyProgram} this function bound to this function! */
        this._self = this.bind(this);

        this._self._init(gl, shaderdecl, options);
        return this._self;
    }

    /**
     * Initialize the SpeedyProgram
     * @param {WebGL2RenderingContext} gl WebGL context
     * @param {ShaderDeclaration} shaderdecl Shader declaration
     * @param {SpeedyProgramOptions} options user options
     */
    _init(gl, shaderdecl, options)
    {
        // not a valid context?
        if(gl.isContextLost())
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__.IllegalOperationError(`Can't initialize SpeedyProgram: lost context`);

        // options object
        options = Object.assign({
            // default options
            renderToTexture: true,
            pingpong: false,
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

        /** @type {ShaderDeclaration} shader declaration */
        this._shaderdecl = shaderdecl;


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
                    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__.IllegalOperationError(`Expected uniform "${argname}", as declared in the argument list`);
            }
        }
    }

    /**
     * Run the SpeedyProgram
     * @param  {...SpeedyProgramUniformValue} args
     * @returns {SpeedyDrawableTexture}
     */
    _call(...args)
    {
        const gl = this._gl;
        const argnames = this._argnames;

        // matching arguments?
        if(args.length != argnames.length)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__.IllegalArgumentError(`Can't run shader: incorrect number of arguments (expected ${argnames.length}, got ${args.length})`);

        // can't use the output texture as an input
        const flatArgs = _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Utils.flatten(args);
        for(let j = flatArgs.length - 1; j >= 0; j--) {
            if(flatArgs[j] === this._texture[this._textureIndex])
                throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__.NotSupportedError(`Can't run shader: don't use its output texture as an input to itself. Consider using pingpong rendering!`);
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
        texSize.setValue(gl, [ width, height ]);
        //gl.uniform2f(texSize.location, width, height);

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
                if(Array.isArray(array)) {
                    if(this._uniform.has(`${argname}[${array.length}]`))
                        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__.IllegalArgumentError(`Can't run shader: too few elements in the "${argname}" array`);
                    for(let j = 0, uniform = undefined; (uniform = this._uniform.get(`${argname}[${j}]`)) !== undefined; j++)
                        texNo = uniform.setValue(gl, array[j], texNo);
                }
                else
                    throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__.IllegalArgumentError(`Can't run shader: expected an array for "${argname}"`);
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Utils.assert(width > 0 && height > 0);

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
        _utils_utils__WEBPACK_IMPORTED_MODULE_3__.Utils.assert(texture.length === this._texture.length, `Incorrect number of textures (expected ${this._texture.length})`);

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
     * @returns {SpeedyProgram} this
     */
    setUBO(blockName, data)
    {
        if(this._ubo === null)
            this._ubo = new UBOHelper(this._gl, this._program);

        this._ubo.set(blockName, data);
        return this;
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
     * A constant #defined in the shader declaration
     * @param {string} name
     * @returns {number}
     */
    definedConstant(name)
    {
        return this._shaderdecl.definedConstant(name);
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

        // return on success
        if(gl.getProgramParameter(program, gl.LINK_STATUS))
            return program;

        // display an error
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
        const col = k => new Array(spaces(k)).fill(' ').join('') + k + '. ';
        const source = errors[0] ? fragmentShaderSource : vertexShaderSource;
        const formattedSource = source.split('\n')
            .map((line, no) => col(1+no) + line)
            .join('\n');

        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__.GLError(
            `\n\n---------- ERROR ----------\n\n` +
            errors.filter(err => err).join('\n') +
            `\n\n---------- SOURCE CODE ----------\n\n` +
            formattedSource + '\n'
        );
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
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__.NotSupportedError(`Unsupported uniform type: ${this.type}`);

    /** @type {WebGLUniformLocation} uniform location in a WebGL program */
    this.location = location;

    /** @type {string} setter function */
    this.setter = UNIFORM_SETTERS[this.type];
    const n = Number((this.setter.match(/^uniform(Matrix)?(\d)/))[2]) | 0;

    /** @type {number} is the uniform a scalar (0), a vector (1) or a matrix (2)? */
    this.dim = this.type.startsWith('mat') ? 2 : ((this.type.indexOf('vec') >= 0) ? 1 : 0);

    /** @type {number} required number of scalars */
    this.length = (this.dim == 2) ? n * n : n;

    /** @type {SpeedyProgramUniformValue|null} cached value */
    this._value = null;
}

/**
 * Set the value of a uniform variable
 * @param {WebGL2RenderingContext} gl
 * @param {SpeedyProgramUniformValue} value use column-major format for matrices
 * @param {number} [texNo] current texture index
 * @returns {number} new texture index
 */
UniformVariable.prototype.setValue = function(gl, value, texNo = -1)
{
    const setValue = /** @type {Function} */ ( gl[this.setter] );

    // check uniform type
    if(typeof value === 'object' && this.type.endsWith('sampler2D')) {
        // set texture
        if(texNo >= gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__.NotSupportedError(`Can't activate texture unit ${texNo}: max is ${gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS}`);
        else if(Array.isArray(value))
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__.NotSupportedError(`Can't pass arrays of textures to shaders`);
        else if(value == null)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__.IllegalArgumentError(`Can't run shader: cannot use ${value} as an input texture`);
        else if(texNo < 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__.IllegalArgumentError(`Missing texNo`);

        const tex = value;
        gl.activeTexture(gl.TEXTURE0 + texNo);
        gl.bindTexture(gl.TEXTURE_2D, tex.glTexture);
        gl.uniform1i(this.location, texNo);

        texNo++;
    }
    else if(value === this._value) {
        // do not update the uniform if it hasn't changed
        void(0);
    }
    else if(typeof value === 'number' || typeof value === 'boolean') {
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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__.IllegalArgumentError(`Can't run shader: incorrect number of values for ${this.type}: "${value}"`);
    }
    else
        throw new _utils_errors__WEBPACK_IMPORTED_MODULE_4__.IllegalArgumentError(`Can't run shader: unrecognized argument "${value}"`);

    // cache the value
    this._value = value;

    // done
    return texNo;
}




/**
 * @typedef {object} UBOStuff
 * @property {WebGLBuffer} buffer
 * @property {number} blockBindingIndex "global" binding index
 * @property {number} blockIndex UBO "location" in the program
 * @property {ArrayBufferView|null} data user-data
 */

/**
 * A helper class for handling Uniform Buffer Objects (UBOs)
 * @param {WebGL2RenderingContext} gl
 * @param {WebGLProgram} program
 */
function UBOHelper(gl, program)
{
    /** @type {WebGL2RenderingContext} */
    this._gl = gl;

    /** @type {WebGLProgram} */
    this._program = program;

    /** @type {number} auto-increment counter */
    this._nextIndex = 0;

    /** @type {Object<string,UBOStuff>} UBO dictionary indexed by uniform block names */
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
            blockBindingIndex: this._nextIndex++,
            blockIndex: -1,
            data: null
        };
    }

    // get UBO entry for the given block name
    const ubo = this._ubo[name];

    // read block index & assign binding point
    if(ubo.blockIndex < 0) {
        const blockIndex = gl.getUniformBlockIndex(this._program, name); // GLuint
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyTexturePool": () => (/* binding */ SpeedyTexturePool)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _speedy_gpu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
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
 * speedy-texture-pool.js
 * Texture pool
 */






// Constants
const DEFAULT_CAPACITY = 1024;
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(capacity > 0);

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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_3__.OutOfMemoryError(`Exhausted pool (capacity: ${this._bucket.length})`);

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
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(bucket !== undefined && !bucket.free, `Unmanaged texture or double free`);

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
        const texture = new _speedy_texture__WEBPACK_IMPORTED_MODULE_2__.SpeedyDrawableTexture(gl, 1, 1);
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyTextureReader": () => (/* binding */ SpeedyTextureReader)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_observable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/observable */ "./src/utils/observable.js");
/* harmony import */ var _speedy_gpu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
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
 * speedy-texture-reader.js
 * Reads data from textures
 */








//const USE_TWO_BUFFERS = /Firefox|Opera|OPR\//.test(navigator.userAgent);

/**
 * @type {number} number of PBOs; used to get a performance boost in gl.readPixels()
 */
const DEFAULT_NUMBER_OF_BUFFERS = 2;
//const DEFAULT_NUMBER_OF_BUFFERS = USE_TWO_BUFFERS ? 2 : 1;

/**
 * @type {(fn: Function, ...args: any[]) => number} Run function fn on the "next frame"
 */
const runOnNextFrame = navigator.userAgent.includes('Firefox') ?
    ((fn, ...args) => setTimeout(fn, 10, ...args)) : // RAF produces a warning on Firefox
    ((fn, ...args) => requestAnimationFrame(() => fn.apply(window, args))); // reduce battery usage

/**
 * A Queue that notifies observers when it's not empty
 * @template T
 */
class ObservableQueue extends _utils_observable__WEBPACK_IMPORTED_MODULE_1__.Observable
{
    /**
     * Constructor
     */
    constructor()
    {
        super();

        /** @type {T[]} elements of the queue */
        this._data = [];
    }

    /**
     * Number of elements in the queue
     * @returns {number}
     */
    get size()
    {
        return this._data.length;
    }

    /**
     * Enqueue an element
     * @param {T} x
     */
    enqueue(x)
    {
        this._data.push(x);
        this._notify();
    }

    /**
     * Remove and return the first element of the queue
     * @returns {T}
     */
    dequeue()
    {
        if(this._data.length == 0)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalOperationError(`Empty queue`);

        return this._data.shift();
    }
}

/** @typedef {number} BufferIndex */

/**
 * @typedef {object} Consumable helper for async GPU-CPU transfers
 * @property {BufferIndex} bufferIndex
 * @property {Uint8Array} pixelBuffer
 */

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
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(numberOfBuffers > 0);

        /** @type {Uint8Array[]} pixel buffers for data transfers (each stores RGBA data) */
        this._pixelBuffer = (new Array(numberOfBuffers)).fill(null).map(() => new Uint8Array(0));

        /** @type {WebGLBuffer[]} Pixel Buffer Objects (PBOs) */
        this._pbo = (new Array(numberOfBuffers)).fill(null);

        /** @type {ObservableQueue<Consumable>} for async data transfers */
        this._consumer = new ObservableQueue();

        /** @type {ObservableQueue<BufferIndex>} for async data transfers (stores buffer indices) */
        this._producer = new ObservableQueue();

        /** @type {boolean} is this object initialized? */
        this._initialized = false;

        /** @type {boolean} is the producer-consumer mechanism initialized? */
        this._initializedProducerConsumer = false;
    }

    /**
     * Initialize this object
     * @param {SpeedyGPU} gpu
     */
    init(gpu)
    {
        this._allocatePBOs(gpu);
        gpu.subscribe(this._allocatePBOs, this, gpu);

        this._initialized = true;
    }

    /**
     * Release resources
     * @param {SpeedyGPU} gpu
     * @returns {null}
     */
    release(gpu)
    {
        gpu.unsubscribe(this._allocatePBOs, this);
        this._deallocatePBOs(gpu);

        this._initialized = false;
        return null;
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
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(this._initialized);

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
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(this._initialized);

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
            return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_3__.SpeedyPromise.resolve(this._pixelBuffer[0].subarray(0, sizeofBuffer));

        // do not optimize?
        if(!useBufferedDownloads) {
            const pixelBuffer = this._pixelBuffer[0].subarray(0, sizeofBuffer);
            return SpeedyTextureReader._readPixelsViaPBO(gl, this._pbo[0], pixelBuffer, fbo, x, y, width, height).then(() =>
                pixelBuffer
            );
        }

        //console.log("------------- new frame");

        // GPU needs to produce data
        this._producer.subscribe(function produce(gl, fbo, x, y, width, height, sizeofBuffer) {
            this._producer.unsubscribe(produce, this);

            const bufferIndex = this._producer.dequeue();
            const pixelBuffer = this._pixelBuffer[bufferIndex].subarray(0, sizeofBuffer);

            //console.log("will produce",bufferIndex);
            SpeedyTextureReader._readPixelsViaPBO(gl, this._pbo[bufferIndex], pixelBuffer, fbo, x, y, width, height).then(() => {
                //console.log("has produced",bufferIndex);
                // this._pixelBuffer[bufferIndex] is ready to be consumed
                this._consumer.enqueue({ bufferIndex, pixelBuffer });
            });
        }, this, gl, fbo, x, y, width, height, sizeofBuffer);

        // CPU needs to consume data
        const promise = new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_3__.SpeedyPromise(resolve => {
            function consume(resolve) {
                this._consumer.unsubscribe(consume, this);

                const obj = this._consumer.dequeue();
                const bufferIndex = obj.bufferIndex, pixelBuffer = obj.pixelBuffer;

                //console.log("will CONSUME",bufferIndex);
                resolve(pixelBuffer);

                this._producer.enqueue(bufferIndex); // enqueue AFTER resolve()
            }

            if(this._consumer.size > 0)
                consume.call(this, resolve);
            else
                this._consumer.subscribe(consume, this, resolve);
        });

        // initialize the producer-consumer mechanism
        if(!this._initializedProducerConsumer) {
            this._initializedProducerConsumer = true;
            for(let i = this._pixelBuffer.length - 1; i >= 0; i--)
                this._consumer.enqueue({ bufferIndex: i, pixelBuffer: this._pixelBuffer[i] });
        }

        //console.log("====== end of frame");

        // done!
        return promise;
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
            //newBuffer.set(this._pixelBuffer[i]); // make this optional?
            this._pixelBuffer[i] = newBuffer;
        }
    }

    /**
     * Allocate PBOs
     * @param {SpeedyGPU} gpu
     */
    _allocatePBOs(gpu)
    {
        const gl = gpu.gl;

        for(let i = 0; i < this._pbo.length; i++)
            this._pbo[i] = gl.createBuffer();
    }

    /**
     * Deallocate PBOs
     * @param {SpeedyGPU} gpu
     */
    _deallocatePBOs(gpu)
    {
        const gl = gpu.gl;

        for(let i = this._pbo.length - 1; i >= 0; i--) {
            gl.deleteBuffer(this._pbo[i]);
            this._pbo[i] = null;
        }
    }

    /**
     * Read pixels to a Uint8Array, asynchronously, using a Pixel Buffer Object (PBO)
     * It's assumed that the target texture is in the RGBA8 format
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLBuffer} pbo
     * @param {Uint8Array} outputBuffer with size >= width * height * 4
     * @param {WebGLFramebuffer} fbo
     * @param {GLint} x
     * @param {GLint} y
     * @param {GLsizei} width
     * @param {GLsizei} height
     * @returns {SpeedyPromise<void>}
     */
    static _readPixelsViaPBO(gl, pbo, outputBuffer, fbo, x, y, width, height)
    {
        /*

        When testing Speedy on Chrome (mobile) using about:tracing with the
        --enable-gpu-service-tracing flag, I found that A LOT of time is spent
        in TraceGLAPI::glMapBufferRange, which takes place just after
        GLES2DecoderImpl::HandleReadPixels and GLES2DecoderImpl::glReadPixels.

        Using multiple PBOs doesn't seem to impact Chrome too much. Performance
        is much better on Firefox. This suggests there is room for improvement.
        I do not yet understand clearly the cause for this lag on Chrome. It
        may be a CPU-GPU synchronization issue.

        EDIT: I have found that using gl.flush() aggressively greatly improves
              things. WebGL commands will be pushed frequently!

        See also:
        https://www.khronos.org/registry/webgl/specs/latest/2.0/#3.7.3 (Buffer objects)
        https://github.com/chromium/chromium/blob/master/docs/gpu/debugging_gpu_related_code.md

        */
        const size = width * height * 4;

        // validate outputBuffer
        _utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(outputBuffer.byteLength >= size, `Invalid buffer size`);

        // read pixels into the PBO
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, pbo);
        gl.bufferData(gl.PIXEL_PACK_BUFFER, size, gl.DYNAMIC_READ);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);

        // create a fence
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush(); // make sure the sync command is read

        // wait for the commands to be processed by the GPU
        return new _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_3__.SpeedyPromise((resolve, reject) => {
            // according to the WebGL2 spec sec 3.7.14 Sync objects,
            // "sync objects may only transition to the signaled state
            // when the user agent's event loop is not executing a task"
            // in other words, it won't be signaled in the same frame
            runOnNextFrame(SpeedyTextureReader._clientWaitAsync, gl, sync, 0, resolve, reject);
        }).then(() => {
            gl.bindBuffer(gl.PIXEL_PACK_BUFFER, pbo);
            gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, outputBuffer);
            gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
        }).catch(err => {
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.IllegalOperationError(`Can't getBufferSubDataAsync(): error in clientWaitAsync()`, err);
        }).finally(() => {
            gl.deleteSync(sync);
        });
    }

    /**
     * Waits for a sync object to become signaled
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLSync} sync
     * @param {GLbitfield} flags may be gl.SYNC_FLUSH_COMMANDS_BIT or 0
     * @param {Function} resolve
     * @param {Function} reject
     * @param {number} [pollInterval] in milliseconds
     * @param {number} [remainingAttempts] for timeout
     */
    static _clientWaitAsync(gl, sync, flags, resolve, reject, pollInterval = 10, remainingAttempts = 1000)
    {
        (function poll() {
            const status = gl.clientWaitSync(sync, flags, 0);

            if(remainingAttempts-- <= 0) {
                reject(new _utils_errors__WEBPACK_IMPORTED_MODULE_5__.TimeoutError(`_checkStatus() is taking too long.`, _utils_errors__WEBPACK_IMPORTED_MODULE_5__.GLError.from(gl)));
            }
            else if(status === gl.CONDITION_SATISFIED || status === gl.ALREADY_SIGNALED) {
                resolve();
            }
            else {
                //Utils.setZeroTimeout(poll); // no ~4ms delay, resource-hungry
                //setTimeout(poll, pollInterval); // easier on the CPU
                requestAnimationFrame(poll); // RAF is a rather unusual way to do polling at ~60 fps. Does it reduce CPU usage?
            }
        })();
    }
}

/***/ }),

/***/ "./src/gpu/speedy-texture-uploader.js":
/*!********************************************!*\
  !*** ./src/gpu/speedy-texture-uploader.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyTextureUploader": () => (/* binding */ SpeedyTextureUploader)
/* harmony export */ });
/* harmony import */ var _speedy_gpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _speedy_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-texture */ "./src/gpu/speedy-texture.js");
/* harmony import */ var _core_speedy_media_source__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/speedy-media-source */ "./src/core/speedy-media-source.js");
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
 * speedy-texture-uploader.js
 * A utility that helps uploading data to textures
 */





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
    }

    /**
     * Upload an image to the GPU
     * @param {SpeedyMediaSource} source
     * @param {SpeedyTexture} outputTexture
     * @returns {SpeedyTexture} output texture
     */
    upload(source, outputTexture)
    {
        const data = source.data;

        // bugfix: if the media is a video, we can't really
        // upload it to the GPU unless it's ready
        //if(data.constructor.name == 'HTMLVideoElement') {
        if(data instanceof HTMLVideoElement) {
            if(data.readyState < 2) {
                // this may happen when the video loops (Firefox)
                // return the previously uploaded texture
                //Utils.warning(`Trying to process a video that isn't ready yet`);
                return outputTexture;
            }
        }

        // upload to the output texture
        return outputTexture.upload(data, source.width, source.height);
    }

    /**
     * Release the texture uploader
     * @returns {null}
     */
    release()
    {
        return null;
    }
}

/***/ }),

/***/ "./src/gpu/speedy-texture.js":
/*!***********************************!*\
  !*** ./src/gpu/speedy-texture.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyTexture": () => (/* binding */ SpeedyTexture),
/* harmony export */   "SpeedyDrawableTexture": () => (/* binding */ SpeedyDrawableTexture)
/* harmony export */ });
/* harmony import */ var _speedy_gpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedy-gpu */ "./src/gpu/speedy-gpu.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/errors */ "./src/utils/errors.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/globals */ "./src/utils/globals.js");
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
     * @param {number} [format]
     * @param {number} [internalFormat]
     * @param {number} [dataType]
     * @param {number} [filter]
     * @param {number} [wrap]
     */
    constructor(gl, width, height, format = gl.RGBA, internalFormat = gl.RGBA8, dataType = gl.UNSIGNED_BYTE, filter = gl.NEAREST, wrap = gl.MIRRORED_REPEAT)
    {
        /** @type {WebGL2RenderingContext} rendering context */
        this._gl = gl;

        /** @type {number} width of the texture */
        this._width = Math.max(1, width | 0);

        /** @type {number} height of the texture */
        this._height = Math.max(1, height | 0);

        /** @type {boolean} have we generated mipmaps for this texture? */
        this._hasMipmaps = false;

        /** @type {number} texture format */
        this._format = format;

        /** @type {number} internal format (usually a sized format) */
        this._internalFormat = internalFormat;

        /** @type {number} data type */
        this._dataType = dataType;

        /** @type {number} texture filtering (min & mag) */
        this._filter = filter;

        /** @type {number} texture wrapping */
        this._wrap = wrap;

        /** @type {WebGLTexture} internal texture object */
        this._glTexture = SpeedyTexture._createTexture(this._gl, this._width, this._height, this._format, this._internalFormat, this._dataType, this._filter, this._wrap);
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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalOperationError(`The SpeedyTexture has already been released`);

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
     * @param {TexImageSource} pixels
     * @param {number} [width] in pixels
     * @param {number} [height] in pixels
     * @return {SpeedyTexture} this
     */
    upload(pixels, width = this._width, height = this._height)
    {
        const gl = this._gl;
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.assert(width > 0 && height > 0);

        this.discardMipmaps();
        this._width = width;
        this._height = height;
        this._internalFormat = gl.RGBA8;
        this._format = gl.RGBA;
        this._dataType = gl.UNSIGNED_BYTE;

        SpeedyTexture._upload(gl, this._glTexture, this._width, this._height, pixels, 0, this._format, this._internalFormat, this._dataType);
        return this;
    }

    /**
     * Clear the texture
     * @returns {this}
     */
    clear()
    {
        const gl = this._gl;

        // context loss?
        if(gl.isContextLost())
            return this;

        // clear texture data
        gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, this._internalFormat, this._width, this._height, 0, this._format, this._dataType, null);
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
     * @returns {this}
     */
    resize(width, height)
    {
        const gl = this._gl;

        // no need to resize?
        if(this._width === width && this._height === height)
            return this;

        // validate size
        width |= 0; height |= 0;
        if(width > _utils_globals__WEBPACK_IMPORTED_MODULE_3__.MAX_TEXTURE_LENGTH || height > _utils_globals__WEBPACK_IMPORTED_MODULE_3__.MAX_TEXTURE_LENGTH)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.NotSupportedError(`Maximum texture size exceeded. Using ${width} x ${height}, expected up to ${_utils_globals__WEBPACK_IMPORTED_MODULE_3__.MAX_TEXTURE_LENGTH} x ${_utils_globals__WEBPACK_IMPORTED_MODULE_3__.MAX_TEXTURE_LENGTH}.`);
        else if(width < 1 || height < 1)
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalArgumentError(`Invalid texture size: ${width} x ${height}`);

        // context loss?
        if(gl.isContextLost())
            return this;

        // update dimensions
        this._width = width;
        this._height = height;

        // resize
        // Note: this is fast on Chrome, but seems slow on Firefox
        gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, this._internalFormat, this._width, this._height, 0, this._format, this._dataType, null);
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
            // expected number of mipmap levels according to the OpenGL ES 3.0 spec (sec 3.8.10.4)
            const width = this.width, height = this.height;
            const numMipmaps = 1 + Math.floor(Math.log2(Math.max(width, height)));
            _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.assert(mipmap.length <= numMipmaps);

            // verify the dimensions of each level
            for(let level = 1; level < mipmap.length; level++) {
                // use max(1, floor(size / 2^lod)), in accordance to
                // the OpenGL ES 3.0 spec sec 3.8.10.4 (Mipmapping)
                const w = Math.max(1, width >>> level);
                const h = Math.max(1, height >>> level);

                // verify the dimensions of this level
                _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.assert(mipmap[level].width === w && mipmap[level].height === h);

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
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._filter);
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
     * @param {number} format usually gl.RGBA
     * @param {number} internalFormat usually gl.RGBA8
     * @param {number} dataType usually gl.UNSIGNED_BYTE
     * @param {number} filter usually gl.NEAREST or gl.LINEAR
     * @param {number} wrap gl.REPEAT, gl.MIRRORED_REPEAT or gl.CLAMP_TO_EDGE
     * @returns {WebGLTexture}
     */
    static _createTexture(gl, width, height, format, internalFormat, dataType, filter, wrap)
    {
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.assert(width > 0 && height > 0);

        // create & bind texture
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // setup
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
        //gl.texStorage2D(gl.TEXTURE_2D, 1, internalFormat, width, height);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, dataType, null);

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
     * @param {TexImageSource} pixels
     * @param {GLint} lod mipmap level-of-detail
     * @param {number} format
     * @param {number} internalFormat
     * @param {number} dataType
     * @returns {WebGLTexture} texture
     */
    static _upload(gl, texture, width, height, pixels, lod, format, internalFormat, dataType)
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
                      internalFormat,       // internal format
                      width,                // texture width
                      height,               // texture height
                      0,                    // border
                      format,               // source format
                      dataType,             // source type
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
     * @param {number} [format]
     * @param {number} [internalFormat]
     * @param {number} [dataType]
     * @param {number} [filter]
     * @param {number} [wrap]
     */
    constructor(gl, width, height, format = undefined, internalFormat = undefined, dataType = undefined, filter = undefined, wrap = undefined)
    {
        super(gl, width, height, format, internalFormat, dataType, filter, wrap);

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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.IllegalOperationError(`The SpeedyDrawableTexture has already been released`);

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
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.assert(this._width === expectedWidth && this._height === expectedHeight);

        // copy to texture
        SpeedyDrawableTexture._copyToTexture(gl, this._glFbo, texture.glTexture, 0, 0, this._width, this._height, lod);
    }

    /*
     * Resize this texture
     * @param {number} width new width, in pixels
     * @param {number} height new height, in pixels
     * @param {boolean} [preserveContent] should we preserve the content of the texture? EXPENSIVE!
     * @returns {this}
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
     * @returns {this}
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
     * @returns {this}
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
            throw new _utils_errors__WEBPACK_IMPORTED_MODULE_2__.GLError(`Can't create framebuffer: ${error} (${status})`);
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

        /*
        gl.copyTexImage2D(
            gl.TEXTURE_2D, // target
            lod, // mipmap level
            gl.RGBA, // internal format
            x, // xpos (where to start copying)
            y, // ypos (where to start copying)
            width, // width of the texture
            height, // height of the texture
            0 // border
        );
        */

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    }
}

/***/ }),

/***/ "./src/utils/errors.js":
/*!*****************************!*\
  !*** ./src/utils/errors.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyError": () => (/* binding */ SpeedyError),
/* harmony export */   "NotSupportedError": () => (/* binding */ NotSupportedError),
/* harmony export */   "NotImplementedError": () => (/* binding */ NotImplementedError),
/* harmony export */   "GLError": () => (/* binding */ GLError),
/* harmony export */   "AbstractMethodError": () => (/* binding */ AbstractMethodError),
/* harmony export */   "IllegalArgumentError": () => (/* binding */ IllegalArgumentError),
/* harmony export */   "IllegalOperationError": () => (/* binding */ IllegalOperationError),
/* harmony export */   "OutOfMemoryError": () => (/* binding */ OutOfMemoryError),
/* harmony export */   "FileNotFoundError": () => (/* binding */ FileNotFoundError),
/* harmony export */   "TimeoutError": () => (/* binding */ TimeoutError),
/* harmony export */   "ParseError": () => (/* binding */ ParseError),
/* harmony export */   "AssertionError": () => (/* binding */ AssertionError),
/* harmony export */   "AccessDeniedError": () => (/* binding */ AccessDeniedError),
/* harmony export */   "WebAssemblyError": () => (/* binding */ WebAssemblyError)
/* harmony export */ });
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
 * errors.js
 * Error classes
 */

/** @typedef {SpeedyError|Error|null} SpeedyErrorCause */

/**
 * Generic error class for Speedy
 */
class SpeedyError extends Error
{
    /**
     * Class constructor
     * @param {string} message message text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message, cause = null)
    {
        super([
            message,
            cause ? cause.toString() : '[speedy-vision.js]'
        ].join('\n-> '));

        /** @type {SpeedyErrorCause} cause of the error */
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
        void(0);
    }

    /**
     * Get the cause of the error. Available if
     * it has been specified in the constructor
     * @returns {SpeedyErrorCause}
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
     * @param {SpeedyErrorCause} [cause] cause of the error
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
     * @param {SpeedyErrorCause} [cause] cause of the error
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
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`WebGL error. ${message}`, cause);
    }

    /**
     * Get an error object describing the latest WebGL error
     * @param {WebGL2RenderingContext} gl
     * @returns {GLError}
     */
    static from(gl)
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
        return new GLError(message);
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
     * @param {SpeedyErrorCause} [cause] cause of the error
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
     * @param {SpeedyErrorCause} [cause] cause of the error
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
     * @param {SpeedyErrorCause} [cause] cause of the error
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
     * @param {SpeedyErrorCause} [cause] cause of the error
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
     * @param {SpeedyErrorCause} [cause] cause of the error
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
     * @param {SpeedyErrorCause} [cause] cause of the error
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
     * @param {SpeedyErrorCause} [cause] cause of the error
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
     * @param {SpeedyErrorCause} [cause] cause of the error
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
     * @param {SpeedyErrorCause} [cause] cause of the error
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
     * @param {SpeedyErrorCause} [cause] cause of the error
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FPSCounter": () => (/* binding */ FPSCounter)
/* harmony export */ });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors */ "./src/utils/errors.js");
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
 * fps-counter.js
 * A FPS counter
 */



/** @const {number} update interval in milliseconds */
const UPDATE_INTERVAL = 500;

/** @type {FPSCounter|null} Singleton */
let instance = null;

/**
 * FPS counter
 */
class FPSCounter
{
    /**
     * Creates a new FPSCounter
     * @private
     */
    constructor()
    {
        /** @type {number} current FPS rate */
        this._fps = 60;

        /** @type {number} frame counter */
        this._frames = 0;

        /** @type {number} update interval in milliseconds */
        this._updateInterval = UPDATE_INTERVAL;

        /** @type {number} time of the last update */
        this._lastUpdate = performance.now();

        /** @type {function(): void} bound update function */
        this._boundUpdate = this._update.bind(this);



        // this should never happen...
        if(instance !== null)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__.IllegalOperationError(`Can't have multiple instances of FPSCounter`);

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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PYRAMID_MAX_LEVELS": () => (/* binding */ PYRAMID_MAX_LEVELS),
/* harmony export */   "LOG2_PYRAMID_MAX_SCALE": () => (/* binding */ LOG2_PYRAMID_MAX_SCALE),
/* harmony export */   "PYRAMID_MAX_SCALE": () => (/* binding */ PYRAMID_MAX_SCALE),
/* harmony export */   "FIX_BITS": () => (/* binding */ FIX_BITS),
/* harmony export */   "FIX_RESOLUTION": () => (/* binding */ FIX_RESOLUTION),
/* harmony export */   "MAX_TEXTURE_LENGTH": () => (/* binding */ MAX_TEXTURE_LENGTH),
/* harmony export */   "MIN_KEYPOINT_SIZE": () => (/* binding */ MIN_KEYPOINT_SIZE),
/* harmony export */   "MIN_ENCODER_LENGTH": () => (/* binding */ MIN_ENCODER_LENGTH),
/* harmony export */   "MAX_ENCODER_CAPACITY": () => (/* binding */ MAX_ENCODER_CAPACITY),
/* harmony export */   "DEFAULT_ENCODER_CAPACITY": () => (/* binding */ DEFAULT_ENCODER_CAPACITY),
/* harmony export */   "LOG2_MAX_DESCRIPTOR_SIZE": () => (/* binding */ LOG2_MAX_DESCRIPTOR_SIZE),
/* harmony export */   "MAX_DESCRIPTOR_SIZE": () => (/* binding */ MAX_DESCRIPTOR_SIZE),
/* harmony export */   "MATCH_INDEX_BITS": () => (/* binding */ MATCH_INDEX_BITS),
/* harmony export */   "MATCH_INDEX_MASK": () => (/* binding */ MATCH_INDEX_MASK),
/* harmony export */   "MATCH_MAX_INDEX": () => (/* binding */ MATCH_MAX_INDEX),
/* harmony export */   "MATCH_MAX_DISTANCE": () => (/* binding */ MATCH_MAX_DISTANCE),
/* harmony export */   "LITTLE_ENDIAN": () => (/* binding */ LITTLE_ENDIAN)
/* harmony export */ });
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
 * globals.js
 * Global constants
 */

// -----------------------------------------------------------------
// IMAGE PYRAMIDS & SCALE-SPACE
// -----------------------------------------------------------------

/** @type {number} The maximum number of levels in a pyramid, considering a scale factor of 2x between levels */
const PYRAMID_MAX_LEVELS = 8;

/** @type {number} The base-2 logarithm of PYRAMID_MAX_SCALE */
const LOG2_PYRAMID_MAX_SCALE = 0;

/** @type {number} The maximum supported scale for a pyramid level */
const PYRAMID_MAX_SCALE = 1 << LOG2_PYRAMID_MAX_SCALE;



// -----------------------------------------------------------------
// FIXED-POINT MATH
// -----------------------------------------------------------------

/** @type {number} How many bits do we use to store fractional data? */
const FIX_BITS = 3; // step size: 0.125 = 1/2^FIX_BITS

/** @type {number} Fixed-point resolution */
const FIX_RESOLUTION = 1 << FIX_BITS; // float(2^(FIX_BITS))



// -----------------------------------------------------------------
// TEXTURE LIMITS
// -----------------------------------------------------------------

/** @type {number} Maximum texture length (width, height) */
const MAX_TEXTURE_LENGTH = (1 << (16 - FIX_BITS)) - 1; // must be 2^n - 1 due to keypoint encoding



// -----------------------------------------------------------------
// KEYPOINTS
// -----------------------------------------------------------------

/** @type {number} Size of a keypoint header, in bytes (must be divisible by 4) */
const MIN_KEYPOINT_SIZE = 8;

/** @type {number} Minimum length of a keypoint encoder, in pixels (encodes at least 1 keypoint) */
const MIN_ENCODER_LENGTH = 2; // capacity computations are based on this // Math.ceil(Math.sqrt(MIN_KEYPOINT_SIZE / 4));

/** @type {number} Maximum number of keypoints we can encode (the actual length of the encoder may vary) */
const MAX_ENCODER_CAPACITY = 8192;

/** @type {number} Default capacity of a keypoint encoder (64x64 texture with 2 pixels per keypoint) */
const DEFAULT_ENCODER_CAPACITY = 2048;

/** @type {number} log2 of MAX_DESCRIPTOR_SIZE */
const LOG2_MAX_DESCRIPTOR_SIZE = 6;

/** @type {number} maximum size of a keypoint descriptor, in bytes */
const MAX_DESCRIPTOR_SIZE = 1 << LOG2_MAX_DESCRIPTOR_SIZE;

/** @type {number} How many bits will we use when encoding the index of a keypoint match? */
const MATCH_INDEX_BITS = 32 - (LOG2_MAX_DESCRIPTOR_SIZE + 3); // 32 - log2(MAX_DESCRIPTOR_SIZE * 8)

/** @type {number} Bitwise mask to extract a keypoint index from an encoded match */
const MATCH_INDEX_MASK = (1 << MATCH_INDEX_BITS) - 1;

/** @type {number} Maximum size of the database of keypoints for matching */
const MATCH_MAX_INDEX = (1 << MATCH_INDEX_BITS) - 1;

/** @type {number} The maximum distance that can be stored in a match */
const MATCH_MAX_DISTANCE = (1 << (32 - MATCH_INDEX_BITS)) - 1;



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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Observable": () => (/* binding */ Observable)
/* harmony export */ });
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

        /** @type {object[]} "this" pointers */
        this._thisptr = [];

        /** @type {Array<any[]>} function arguments */
        this._args = [];
    }

    /**
     * Add subscriber
     * @param {Function} fn callback
     * @param {object} [thisptr] "this" pointer to be used when invoking the callback
     * @param {...any} args arguments to be passed to the callback
     */
    subscribe(fn, thisptr, ...args)
    {
        this._subscribers.push(fn);
        this._thisptr.push(thisptr);
        this._args.push(args);
    }

    /**
     * Remove subscriber
     * @param {Function} fn previously added callback
     * @param {object} [thisptr] "this" pointer
     */
    unsubscribe(fn, thisptr)
    {
        for(let j = this._subscribers.length - 1; j >= 0; j--) {
            if(this._subscribers[j] === fn && this._thisptr[j] === thisptr) {
                this._subscribers.splice(j, 1);
                this._thisptr.splice(j, 1);
                this._args.splice(j, 1);
                break;
            }
        }
    }

    /**
     * Notify all subscribers about a state change
     * @protected
     */
    _notify()
    {
        for(let i = 0; i < this._subscribers.length; i++)
            this._subscribers[i].call(this._thisptr[i], ...(this._args[i]));
    }
}

/***/ }),

/***/ "./src/utils/speedy-promise.js":
/*!*************************************!*\
  !*** ./src/utils/speedy-promise.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpeedyPromise": () => (/* binding */ SpeedyPromise)
/* harmony export */ });
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
 * speedy-promise.js
 * Speedy Promises: a fast implementation of Promises
 */

const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

const SUSPEND_ASYNC = 1;
const asap = (typeof queueMicrotask !== 'undefined' && queueMicrotask) || // browsers
             (typeof process !== 'undefined' && process.nextTick) || // node.js
             (f => Promise.resolve().then(() => f())); // most compatible

/**
 * SpeedyPromise: Super Fast Promises. SpeedyPromises can
 * interoperate with ES6 Promises. This implementation is
 * based on the Promises/A+ specification.
 * @template T
 */
class SpeedyPromise
{
    /**
     * Constructor
     * @param {function(function(T=): void, function(Error): void): void} callback
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
     * @template U, V=never
     * @param {null|undefined|(function(T): U|PromiseLike<U>|SpeedyPromise<U>)} onFulfillment called when the SpeedyPromise is fulfilled
     * @param {null|undefined|(function(Error): V|PromiseLike<V>|SpeedyPromise<V>)} [onRejection] called when the SpeedyPromise is rejected
     * @returns {SpeedyPromise<U>}
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
     * @template U, V=never
     * @param {null|undefined|(function(Error): V|PromiseLike<V>|SpeedyPromise<V>)} [onRejection] called when the SpeedyPromise is rejected
     * @returns {SpeedyPromise<V>}
     */
    catch(onRejection)
    {
        return this.then(null, onRejection);
    }

    /**
     * Execute a callback when the promise is settled
     * (i.e., fulfilled or rejected)
     * @param {function(): void} onFinally
     * @returns {SpeedyPromise<T>}
     */
    finally(onFinally)
    {
        const fn = val => { onFinally(); return val; };
        return this.then(fn, fn);
    }

    /**
     * Start the computation immediately, synchronously.
     * Can't afford to spend any time at all waiting for micro-tasks, etc.
     * @returns {SpeedyPromise<T>} this
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
     * Symbol.toStringTag
     * @returns {string}
     */
    get [Symbol.toStringTag]()
    {
        return 'SpeedyPromise';
    }

    /**
     * Creates a resolved SpeedyPromise
     * @template U
     * @param {U} [value]
     * @returns {SpeedyPromise<U>}
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
     * @template U
     * @param {Error} reason
     * @returns {SpeedyPromise<U>}
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
     * @template U
     * @param {Iterable<U>|Iterable<SpeedyPromise<U>>|Iterable<Promise<U>>} iterable e.g., a SpeedyPromise[], a thenable[]
     * @returns {SpeedyPromise<U[]>}
     *
     * FIXME iterables need not be all <U>
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
     * @template U
     * @param {Iterable<U>|Iterable<SpeedyPromise<U>>|Iterable<Promise<U>>} iterable e.g., a SpeedyPromise[], a thenable[]
     * @returns {SpeedyPromise<U>}
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
     * @param {T} value
     */
    _fulfill(value)
    {
        this._setState(FULFILLED, value);
    }

    /**
     * Reject this promise with a reason
     * @param {Error} reason
     */
    _reject(reason)
    {
        this._setState(REJECTED, reason);
    }

    /**
     * Set the state and the value of this promise
     * @param {number} state
     * @param {T|Error} value
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
     * @param {T} x
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


/***/ }),

/***/ "./src/utils/types.js":
/*!****************************!*\
  !*** ./src/utils/types.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MediaType": () => (/* binding */ MediaType),
/* harmony export */   "ImageFormat": () => (/* binding */ ImageFormat),
/* harmony export */   "PixelComponent": () => (/* binding */ PixelComponent),
/* harmony export */   "ColorComponentId": () => (/* binding */ ColorComponentId)
/* harmony export */ });
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
 * types.js
 * Types & formats
 */

/**
 * Media types
 * @enum {Symbol}
 */
const MediaType = Object.freeze({
    Image: Symbol('Image'),
    Video: Symbol('Video'),
    Canvas: Symbol('Canvas'),
    Bitmap: Symbol('Bitmap'),
});

/**
 * Image formats
 * @enum {Symbol}
 */
const ImageFormat = Object.freeze({
    RGBA: Symbol('RGBA'),
    GREY: Symbol('GREY'),
});

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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Utils": () => (/* binding */ Utils)
/* harmony export */ });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors */ "./src/utils/errors.js");
/* harmony import */ var _speedy_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./speedy-promise */ "./src/utils/speedy-promise.js");
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
 * utils.js
 * Generic utilities
 */




/** @typedef {{fn: Function, args: any[]}} ZeroTimeoutCallback */
/** @typedef {Map<string,ZeroTimeoutCallback>} ZeroTimeoutContext */

/** @type {function(): ZeroTimeoutContext} helper for setZeroTimeout */
const zeroTimeoutContext = (() => {
    const callbacks = /** @type {ZeroTimeoutContext} */ ( new Map() );
    let initialized = false;

    return (function() {
        if(!initialized) {
            initialized = true;
            window.addEventListener('message', ev => {
                if(ev.source === window) {
                    const msgId = ev.data;
                    const obj = callbacks.get(msgId);
                    if(obj !== undefined) {
                        obj.fn.apply(window, obj.args);
                        callbacks.delete(msgId);
                    }
                }
            });
        }

        return callbacks;
    });
})();



/**
 * Generic utilities
 */
class Utils
{
    /**
     * Generates a warning
     * @param {string} text message text
     * @param  {...string} args optional text
     */
    static warning(text, ...args)
    {
        console.warn('[speedy-vision]', text, ...args);
    }

    /**
     * Logs a message
     * @param {string} text message text
     * @param  {...string} args optional text
     */
    static log(text, ...args)
    {
        console.log('[speedy-vision]', text, ...args);
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__.AssertionError(text);
    }

    /**
     * Similar to setTimeout(fn, 0), but without the ~4ms delay.
     * Although much faster than setTimeout, this may be resource-hungry
     * (heavy on battery) if used in a loop. Use with caution.
     * Implementation based on David Baron's, but adapted for ES6 classes
     * @param {Function} fn
     * @param {any[]} args optional arguments to be passed to fn
     */
    static setZeroTimeout(fn, ...args)
    {
        const ctx = zeroTimeoutContext();
        const msgId = '0%' + String(Math.random());

        ctx.set(msgId, { fn, args });
        window.postMessage(msgId, '*');
    }

    /**
     * Gets the names of the arguments of the specified function
     * @param {Function} fun 
     * @returns {string[]}
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__.ParseError(`Can't detect function arguments of ${code}`);
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
     * @returns {number[]}
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__.IllegalArgumentError(`Invalid kernel size given to gaussianKernel: ${kernelSize} x 1`);
        else if(sigma <= 0.0)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__.IllegalArgumentError(`Invalid sigma given to gaussianKernel: ${sigma}`);

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

        // normalize the kernel
        if(normalized) {
            for(let j = 0; j < kernelSize; j++)
                kernel[j] /= sum;
        }

        // done!
        return kernel;
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
     * @param {number[]} a
     * @param {number[]} b
     * @returns {Array<[number,number]>}
     */
    static cartesian(a, b)
    {
        return [].concat(...a.map(a => b.map(b => [a, b])));
    }

    /**
     * Symmetric range
     * @param {number} n non-negative integer
     * @returns {number[]} [ -n, ..., n ]
     */
    static symmetricRange(n)
    {
        if((n |= 0) < 0)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__.IllegalArgumentError(`Expected a non-negative integer as input`);

        return [...(Array(2*n + 1).keys())].map(x => x - n);
    }

    /**
     * Compute the [0, n) range of integers
     * @param {number} n positive integer
     * @returns {number[]} [ 0, 1, ..., n-1 ]
     */
    static range(n)
    {
        if((n |= 0) <= 0)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__.IllegalArgumentError(`Expected a positive integer as input`);

        return [...(Array(n).keys())];
    }

    /**
     * Shuffle in-place
     * @template T
     * @param {T[]} arr
     * @returns {T[]} arr
     */
    static shuffle(arr)
    {
        const len = arr.length;
        const m = len - 1;

        // Fisher-Yattes
        for(let i = 0; i < m; i++) {
            const j = i + ((Math.random() * (len - i)) | 0); // i <= j < arr.length

            if(i !== j) {
                const t = arr[i];
                arr[i] = arr[j];
                arr[j] = t;
            }
        }

        return arr;
    }

    /**
     * Flatten an array (1 level only)
     * @template U
     * @param {U[]} array
     * @returns {U[]}
     */
    static flatten(array)
    {
        //return array.flat();
        //return array.reduce((arr, val) => arr.concat(val), []);

        const flat = [];

        for(let i = 0, n = array.length; i < n; i++) {
            const entry = array[i];

            if(Array.isArray(entry)) {
                for(let j = 0, m = entry.length; j < m; j++)
                    flat.push(entry[j]);
            }
            else
                flat.push(entry);
        }

        return flat;
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
     * Wrapper around getUserMedia()
     * @param {MediaStreamConstraints} [constraints] will be passed to getUserMedia()
     * @returns {SpeedyPromise<HTMLVideoElement>}
     */
    static requestCameraStream(constraints = { audio: false, video: true })
    {
        Utils.log('Accessing the webcam...');

        if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__.NotSupportedError('Unsupported browser: no mediaDevices.getUserMedia()');

        return new _speedy_promise__WEBPACK_IMPORTED_MODULE_1__.SpeedyPromise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                const video = document.createElement('video');
                video.onloadedmetadata = () => {
                    video.play();
                    Utils.log(`The camera is on! Resolution: ${video.videoWidth} x ${video.videoHeight}`);
                    resolve(video);
                };
                video.srcObject = stream;
            })
            .catch(err => {
                reject(new _errors__WEBPACK_IMPORTED_MODULE_0__.AccessDeniedError(
                    `Please give access to the camera and reload the page`,
                    err
                ));
            });
        });
    }
}


/***/ }),

/***/ "./src/gpu/shaders/filters/convolution1d.glsl":
/*!****************************************************!*\
  !*** ./src/gpu/shaders/filters/convolution1d.glsl ***!
  \****************************************************/
/***/ ((module) => {

module.exports = "#if !defined(KERNEL_SIZE) || !defined(AXIS) || (AXIS != 0 && AXIS != 1)\n#error Undefined KERNEL_SIZE / AXIS\n#endif\nuniform sampler2D image;\nuniform float kernel[@KERNEL_SIZE@];\nconst ivec2 axis = ivec2(1-AXIS, AXIS);\n#define S(x,k) result += pixelAtShortOffset(image, ivec2((x),(x)) * axis) * kernel[k]\nvoid main()\n{\nvec4 result = vec4(0.0f);\n#if KERNEL_SIZE == 3\nS(-1, 2);\nS( 0, 1);\nS( 1, 0);\n#elif KERNEL_SIZE == 5\nS(-2, 4);\nS(-1, 3);\nS( 0, 2);\nS( 1, 1);\nS( 2, 0);\n#elif KERNEL_SIZE == 7\nS(-3, 6);\nS(-2, 5);\nS(-1, 4);\nS( 0, 3);\nS( 1, 2);\nS( 2, 1);\nS( 3, 0);\n#elif KERNEL_SIZE == 9\nS(-4, 8);\nS(-3, 7);\nS(-2, 6);\nS(-1, 5);\nS( 0, 4);\nS( 1, 3);\nS( 2, 2);\nS( 3, 1);\nS( 4, 0);\n#elif KERNEL_SIZE == 11\nS(-5, 10);\nS(-4, 9);\nS(-3, 8);\nS(-2, 7);\nS(-1, 6);\nS( 0, 5);\nS( 1, 4);\nS( 2, 3);\nS( 3, 2);\nS( 4, 1);\nS( 5, 0);\n#elif KERNEL_SIZE == 13\nS(-6, 12);\nS(-5, 11);\nS(-4, 10);\nS(-3, 9);\nS(-2, 8);\nS(-1, 7);\nS( 0, 6);\nS( 1, 5);\nS( 2, 4);\nS( 3, 3);\nS( 4, 2);\nS( 5, 1);\nS( 6, 0);\n#elif KERNEL_SIZE == 15\nS(-7, 14);\nS(-6, 13);\nS(-5, 12);\nS(-4, 11);\nS(-3, 10);\nS(-2, 9);\nS(-1, 8);\nS( 0, 7);\nS( 1, 6);\nS( 2, 5);\nS( 3, 4);\nS( 4, 3);\nS( 5, 2);\nS( 6, 1);\nS( 7, 0);\n#else\n#error Invalid parameters\n#endif\ncolor = vec4(result.rgb, 1.0f);\n}"

/***/ }),

/***/ "./src/gpu/shaders/filters/convolution2d.glsl":
/*!****************************************************!*\
  !*** ./src/gpu/shaders/filters/convolution2d.glsl ***!
  \****************************************************/
/***/ ((module) => {

module.exports = "#ifndef KERNEL_SIZE_SQUARED\n#define Must define KERNEL_SIZE_SQUARED\n#endif\nuniform sampler2D image;\nuniform float kernel[@KERNEL_SIZE_SQUARED@];\n#define S(x,y,k) result += pixelAtShortOffset(image, ivec2((x),(y))) * kernel[k]\nvoid main()\n{\nvec4 result = vec4(0.0f);\n#if KERNEL_SIZE_SQUARED == 9\nS(-1,-1, 8);\nS(-1, 0, 7);\nS(-1, 1, 6);\nS( 0,-1, 5);\nS( 0, 0, 4);\nS( 0, 1, 3);\nS( 1,-1, 2);\nS( 1, 0, 1);\nS( 1, 1, 0);\n#elif KERNEL_SIZE_SQUARED == 25\nS(-2,-2, 24);\nS(-2,-1, 23);\nS(-2, 0, 22);\nS(-2, 1, 21);\nS(-2, 2, 20);\nS(-1,-2, 19);\nS(-1,-1, 18);\nS(-1, 0, 17);\nS(-1, 1, 16);\nS(-1, 2, 15);\nS( 0,-2, 14);\nS( 0,-1, 13);\nS( 0, 0, 12);\nS( 0, 1, 11);\nS( 0, 2, 10);\nS( 1,-2, 9);\nS( 1,-1, 8);\nS( 1, 0, 7);\nS( 1, 1, 6);\nS( 1, 2, 5);\nS( 2,-2, 4);\nS( 2,-1, 3);\nS( 2, 0, 2);\nS( 2, 1, 1);\nS( 2, 2, 0);\n#elif KERNEL_SIZE_SQUARED == 49\nS(-3,-3, 48);\nS(-3,-2, 47);\nS(-3,-1, 46);\nS(-3, 0, 45);\nS(-3, 1, 44);\nS(-3, 2, 43);\nS(-3, 3, 42);\nS(-2,-3, 41);\nS(-2,-2, 40);\nS(-2,-1, 39);\nS(-2, 0, 38);\nS(-2, 1, 37);\nS(-2, 2, 36);\nS(-2, 3, 35);\nS(-1,-3, 34);\nS(-1,-2, 33);\nS(-1,-1, 32);\nS(-1, 0, 31);\nS(-1, 1, 30);\nS(-1, 2, 29);\nS(-1, 3, 28);\nS( 0,-3, 27);\nS( 0,-2, 26);\nS( 0,-1, 25);\nS( 0, 0, 24);\nS( 0, 1, 23);\nS( 0, 2, 22);\nS( 0, 3, 21);\nS( 1,-3, 20);\nS( 1,-2, 19);\nS( 1,-1, 18);\nS( 1, 0, 17);\nS( 1, 1, 16);\nS( 1, 2, 15);\nS( 1, 3, 14);\nS( 2,-3, 13);\nS( 2,-2, 12);\nS( 2,-1, 11);\nS( 2, 0, 10);\nS( 2, 1, 9);\nS( 2, 2, 8);\nS( 2, 3, 7);\nS( 3,-3, 6);\nS( 3,-2, 5);\nS( 3,-1, 4);\nS( 3, 0, 3);\nS( 3, 1, 2);\nS( 3, 2, 1);\nS( 3, 3, 0);\n#else\n#error Invalid KERNEL_SIZE_SQUARED\n#endif\ncolor = vec4(result.rgb, 1.0f);\n}"

/***/ }),

/***/ "./src/gpu/shaders/filters/fast-median.glsl":
/*!**************************************************!*\
  !*** ./src/gpu/shaders/filters/fast-median.glsl ***!
  \**************************************************/
/***/ ((module) => {

module.exports = "uniform sampler2D image;\n#define X(i,j) t = vec2(min(p[i], p[j]), max(p[i], p[j])); p[i] = t.x; p[j] = t.y;\n#define S(i,x,y) p[i] = pixelAtShortOffset(image, ivec2((x),(y))).g\nvoid main()\n{\nfloat median;\nvec2 t;\n#if !defined(KERNEL_SIZE)\n#error Must define KERNEL_SIZE\n#elif KERNEL_SIZE == 3\nfloat p[9];\nS(0,-1,-1);\nS(1, 0,-1);\nS(2, 1,-1);\nS(3,-1, 0);\nS(4, 0, 0);\nS(5, 1, 0);\nS(6,-1, 1);\nS(7, 0, 1);\nS(8, 1, 1);\nX(1,2);X(4,5);X(7,8);X(0,1);X(3,4);X(6,7);X(1,2);X(4,5);X(7,8);X(0,3);X(5,8);X(4,7);X(3,6);X(1,4);X(2,5);X(4,7);X(4,2);X(6,4);X(4,2);\nmedian = p[4];\n#elif KERNEL_SIZE == 5\nfloat p[25];\nS( 0,-2,-2);\nS( 1,-1,-2);\nS( 2, 0,-2);\nS( 3, 1,-2);\nS( 4, 2,-2);\nS( 5,-2,-1);\nS( 6,-1,-1);\nS( 7, 0,-1);\nS( 8, 1,-1);\nS( 9, 2,-1);\nS(10,-2, 0);\nS(11,-1, 0);\nS(12, 0, 0);\nS(13, 1, 0);\nS(14, 2, 0);\nS(15,-2, 1);\nS(16,-1, 1);\nS(17, 0, 1);\nS(18, 1, 1);\nS(19, 2, 1);\nS(20,-2, 2);\nS(21,-1, 2);\nS(22, 0, 2);\nS(23, 1, 2);\nS(24, 2, 2);\nX(0,1);X(3,4);X(2,4);X(2,3);X(6,7);X(5,7);X(5,6);X(9,10);X(8,10);X(8,9);X(12,13);X(11,13);X(11,12);X(15,16);X(14,16);X(14,15);X(18,19);X(17,19);X(17,18);X(21,22);X(20,22);X(20,21);X(23,24);X(2,5);X(3,6);X(0,6);X(0,3);X(4,7);X(1,7);X(1,4);X(11,14);X(8,14);X(8,11);X(12,15);X(9,15);X(9,12);X(13,16);X(10,16);X(10,13);X(20,23);X(17,23);X(17,20);X(21,24);X(18,24);X(18,21);X(19,22);X(8,17);X(9,18);X(0,18);X(0,9);X(10,19);X(1,19);X(1,10);X(11,20);X(2,20);X(2,11);X(12,21);X(3,21);X(3,12);X(13,22);X(4,22);X(4,13);X(14,23);X(5,23);X(5,14);X(15,24);X(6,24);X(6,15);X(7,16);X(7,19);X(13,21);X(15,23);X(7,13);X(7,15);X(1,9);X(3,11);X(5,17);X(11,17);X(9,17);X(4,10);X(6,12);X(7,14);X(4,6);X(4,7);X(12,14);X(10,14);X(6,7);X(10,12);X(6,10);X(6,17);X(12,17);X(7,17);X(7,10);X(12,18);X(7,12);X(10,18);X(12,20);X(10,20);X(10,12);\nmedian = p[12];\n#elif KERNEL_SIZE == 7\nfloat p[49];\nS( 0,-3,-3);\nS( 1,-2,-3);\nS( 2,-1,-3);\nS( 3, 0,-3);\nS( 4, 1,-3);\nS( 5, 2,-3);\nS( 6, 3,-3);\nS( 7,-3,-2);\nS( 8,-2,-2);\nS( 9,-1,-2);\nS(10, 0,-2);\nS(11, 1,-2);\nS(12, 2,-2);\nS(13, 3,-2);\nS(14,-3,-1);\nS(15,-2,-1);\nS(16,-1,-1);\nS(17, 0,-1);\nS(18, 1,-1);\nS(19, 2,-1);\nS(20, 3,-1);\nS(21,-3, 0);\nS(22,-2, 0);\nS(23,-1, 0);\nS(24, 0, 0);\nS(25, 1, 0);\nS(26, 2, 0);\nS(27, 3, 0);\nS(28,-3, 1);\nS(29,-2, 1);\nS(30,-1, 1);\nS(31, 0, 1);\nS(32, 1, 1);\nS(33, 2, 1);\nS(34, 3, 1);\nS(35,-3, 2);\nS(36,-2, 2);\nS(37,-1, 2);\nS(38, 0, 2);\nS(39, 1, 2);\nS(40, 2, 2);\nS(41, 3, 2);\nS(42,-3, 3);\nS(43,-2, 3);\nS(44,-1, 3);\nS(45, 0, 3);\nS(46, 1, 3);\nS(47, 2, 3);\nS(48, 3, 3);\nX(0,1);X(2,3);X(0,2);X(1,3);X(1,2);X(4,5);X(6,7);X(4,6);X(5,7);X(5,6);X(0,4);X(2,6);X(2,4);X(1,5);X(3,7);X(3,5);X(1,2);X(3,4);X(5,6);X(8,9);X(10,11);X(8,10);X(9,11);X(9,10);X(12,13);X(14,15);X(12,14);X(13,15);X(13,14);X(8,12);X(10,14);X(10,12);X(9,13);X(11,15);X(11,13);X(9,10);X(11,12);X(13,14);X(0,8);X(4,12);X(4,8);X(2,10);X(6,14);X(6,10);X(2,4);X(6,8);X(10,12);X(1,9);X(5,13);X(5,9);X(3,11);X(7,15);X(7,11);X(3,5);X(7,9);X(11,13);X(1,2);X(3,4);X(5,6);X(7,8);X(9,10);X(11,12);X(13,14);X(16,17);X(18,19);X(16,18);X(17,19);X(17,18);X(20,21);X(22,23);X(20,22);X(21,23);X(21,22);X(16,20);X(18,22);X(18,20);X(17,21);X(19,23);X(19,21);X(17,18);X(19,20);X(21,22);X(24,25);X(26,27);X(24,26);X(25,27);X(25,26);X(28,29);X(30,31);X(28,30);X(29,31);X(29,30);X(24,28);X(26,30);X(26,28);X(25,29);X(27,31);X(27,29);X(25,26);X(27,28);X(29,30);X(16,24);X(20,28);X(20,24);X(18,26);X(22,30);X(22,26);X(18,20);X(22,24);X(26,28);X(17,25);X(21,29);X(21,25);X(19,27);X(23,31);X(23,27);X(19,21);X(23,25);X(27,29);X(17,18);X(19,20);X(21,22);X(23,24);X(25,26);X(27,28);X(29,30);X(0,16);X(8,24);X(8,16);X(4,20);X(12,28);X(12,20);X(4,8);X(12,16);X(20,24);X(2,18);X(10,26);X(10,18);X(6,22);X(14,30);X(14,22);X(6,10);X(14,18);X(22,26);X(2,4);X(6,8);X(10,12);X(14,16);X(18,20);X(22,24);X(26,28);X(1,17);X(9,25);X(9,17);X(5,21);X(13,29);X(13,21);X(5,9);X(13,17);X(21,25);X(3,19);X(11,27);X(11,19);X(7,23);X(15,31);X(15,23);X(7,11);X(15,19);X(23,27);X(3,5);X(7,9);X(11,13);X(15,17);X(19,21);X(23,25);X(27,29);X(1,2);X(3,4);X(5,6);X(7,8);X(9,10);X(11,12);X(13,14);X(15,16);X(17,18);X(19,20);X(21,22);X(23,24);X(25,26);X(27,28);X(29,30);X(32,33);X(34,35);X(32,34);X(33,35);X(33,34);X(36,37);X(38,39);X(36,38);X(37,39);X(37,38);X(32,36);X(34,38);X(34,36);X(33,37);X(35,39);X(35,37);X(33,34);X(35,36);X(37,38);X(40,41);X(42,43);X(40,42);X(41,43);X(41,42);X(44,45);X(46,47);X(44,46);X(45,47);X(45,46);X(40,44);X(42,46);X(42,44);X(41,45);X(43,47);X(43,45);X(41,42);X(43,44);X(45,46);X(32,40);X(36,44);X(36,40);X(34,42);X(38,46);X(38,42);X(34,36);X(38,40);X(42,44);X(33,41);X(37,45);X(37,41);X(35,43);X(39,47);X(39,43);X(35,37);X(39,41);X(43,45);X(33,34);X(35,36);X(37,38);X(39,40);X(41,42);X(43,44);X(45,46);X(32,48);X(40,48);X(36,40);X(44,48);X(38,42);X(34,36);X(38,40);X(42,44);X(46,48);X(37,41);X(39,43);X(35,37);X(39,41);X(43,45);X(33,34);X(35,36);X(37,38);X(39,40);X(41,42);X(43,44);X(45,46);X(47,48);X(0,32);X(16,48);X(16,32);X(8,40);X(24,40);X(8,16);X(24,32);X(40,48);X(4,36);X(20,36);X(12,44);X(28,44);X(12,20);X(28,36);X(4,8);X(12,16);X(20,24);X(28,32);X(36,40);X(44,48);X(2,34);X(18,34);X(10,42);X(26,42);X(10,18);X(26,34);X(6,38);X(22,38);X(14,46);X(30,46);X(14,22);X(30,38);X(6,10);X(14,18);X(22,26);X(30,34);X(38,42);X(2,4);X(6,8);X(10,12);X(14,16);X(18,20);X(22,24);X(26,28);X(30,32);X(34,36);X(38,40);X(42,44);X(46,48);X(1,33);X(17,33);X(9,41);X(25,41);X(9,17);X(25,33);X(5,37);X(21,37);X(13,45);X(29,45);X(13,21);X(29,37);X(5,9);X(13,17);X(21,25);X(29,33);X(37,41);X(3,35);X(19,35);X(11,43);X(27,43);X(11,19);X(27,35);X(7,39);X(23,39);X(15,47);X(31,47);X(15,23);X(31,39);X(7,11);X(15,19);X(23,27);X(31,35);X(39,43);X(3,5);X(7,9);X(11,13);X(15,17);X(19,21);X(23,25);X(27,29);X(31,33);X(35,37);X(39,41);X(43,45);X(1,2);X(3,4);X(5,6);X(7,8);X(9,10);X(11,12);X(13,14);X(15,16);X(17,18);X(19,20);X(21,22);X(23,24);\nmedian = p[24];\n#else\n#error Unsupported kernel size\n#endif\ncolor = vec4(median, median, median, 1.0f);\n}"

/***/ }),

/***/ "./src/gpu/shaders/filters/nightvision.glsl":
/*!**************************************************!*\
  !*** ./src/gpu/shaders/filters/nightvision.glsl ***!
  \**************************************************/
/***/ ((module) => {

module.exports = "uniform sampler2D image;\nuniform sampler2D illuminationMap;\nuniform float gain;\nuniform float offset;\nuniform float decay;\n#ifndef GREYSCALE\n#error Must define GREYSCALE\n#endif\n#if GREYSCALE == 0\nconst mat3 rgb2yuv = mat3(\n0.299f, -0.14713f, 0.615f,\n0.587f, -0.28886f, -0.51499f,\n0.114f, 0.436f, -0.10001f\n);\nconst mat3 yuv2rgb = mat3(\n1.0f, 1.0f, 1.0f,\n0.0f, -0.39465f, 2.03211f,\n1.13983f, -0.58060f, 0.0f\n);\n#endif\nconst float eps = 0.0001f;\nconst float sqrt2 = 1.4142135623730951f;\nconst float magic = 20.0f;\nconst vec2 center = vec2(0.5f);\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nvec4 imapPixel = threadPixel(illuminationMap);\nfloat lambda = -sqrt2 * log(max(1.0f - decay, eps));\nfloat dist = length(texCoord - center);\nfloat vgain = gain * exp(-lambda * dist);\nfloat normalizedGain = 2.0f * vgain;\nfloat normalizedOffset = 2.0f * offset - 1.0f;\n#if GREYSCALE != 0\nfloat luma = 1.0 / (1.0 + exp(-normalizedGain * magic * (pixel.g - imapPixel.g)));\nluma = clamp(luma + normalizedOffset, 0.0f, 1.0f);\ncolor = vec4(luma, luma, luma, 1.0f);\n#else\nvec3 yuvPixel = rgb2yuv * pixel.rgb;\nvec3 yuvImapPixel = rgb2yuv * imapPixel.rgb;\nfloat luma = 1.0 / (1.0 + exp(-normalizedGain * magic * (yuvPixel.r - yuvImapPixel.r)));\nluma += normalizedOffset;\nvec3 rgbCorrectedPixel = yuv2rgb * vec3(luma, yuvPixel.gb);\nrgbCorrectedPixel = clamp(rgbCorrectedPixel, 0.0f, 1.0f);\ncolor = vec4(rgbCorrectedPixel, 1.0f);\n#endif\n}"

/***/ }),

/***/ "./src/gpu/shaders/filters/normalize-image.glsl":
/*!******************************************************!*\
  !*** ./src/gpu/shaders/filters/normalize-image.glsl ***!
  \******************************************************/
/***/ ((module) => {

module.exports = "#ifndef GREYSCALE\n#error Must define GREYSCALE\n#endif\n#if GREYSCALE != 0\nuniform sampler2D minmax2d;\n#else\nuniform sampler2D minmax2dRGB[3];\n#endif\nuniform float minValue;\nuniform float maxValue;\nconst float eps = 1.0f / 255.0f;\nvoid main()\n{\nvec2 minmax = clamp(vec2(minValue, maxValue), 0.0f, 255.0f) / 255.0f;\nvec4 newMin = vec4(minmax.x);\nvec4 newRange = vec4(minmax.y - minmax.x);\nvec4 alpha = vec4(1.0f, newMin.x, newRange.x, 1.0f);\n#if GREYSCALE != 0\nvec4 pixel = threadPixel(minmax2d);\nmat4 channel = mat4(pixel, pixel, pixel, alpha);\n#else\nmat4 channel = mat4(\nthreadPixel(minmax2dRGB[0]),\nthreadPixel(minmax2dRGB[1]),\nthreadPixel(minmax2dRGB[2]),\nalpha\n);\n#endif\nvec4 oldMin = vec4(channel[0].g, channel[1].g, channel[2].g, channel[3].g);\nvec4 oldRange = max(vec4(channel[0].b, channel[1].b, channel[2].b, channel[3].b), eps);\nvec4 oldIntensity = vec4(channel[0].a, channel[1].a, channel[2].a, channel[3].a);\nvec4 newIntensity = (oldIntensity - oldMin) * newRange / oldRange + newMin;\ncolor = newIntensity;\n}"

/***/ }),

/***/ "./src/gpu/shaders/filters/rgb2grey.glsl":
/*!***********************************************!*\
  !*** ./src/gpu/shaders/filters/rgb2grey.glsl ***!
  \***********************************************/
/***/ ((module) => {

module.exports = "const vec4 grey = vec4(0.299f, 0.587f, 0.114f, 0.0f);\nuniform sampler2D image;\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nfloat g = dot(pixel, grey);\ncolor = vec4(g, g, g, 1.0f);\n}"

/***/ }),

/***/ "./src/gpu/shaders/include/colors.glsl":
/*!*********************************************!*\
  !*** ./src/gpu/shaders/include/colors.glsl ***!
  \*********************************************/
/***/ ((module) => {

module.exports = "#ifndef _COLORS_GLSL\n#define _COLORS_GLSL\n#define PIXELCOMPONENT_RED   @PIXELCOMPONENT_RED@\n#define PIXELCOMPONENT_GREEN @PIXELCOMPONENT_GREEN@\n#define PIXELCOMPONENT_BLUE  @PIXELCOMPONENT_BLUE@\n#define PIXELCOMPONENT_ALPHA @PIXELCOMPONENT_ALPHA@\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/filters.glsl":
/*!**********************************************!*\
  !*** ./src/gpu/shaders/include/filters.glsl ***!
  \**********************************************/
/***/ ((module) => {

module.exports = "#ifndef _FILTERS_GLSL\n#define _FILTERS_GLSL\nfloat laplacian(sampler2D pyramid, vec2 position, float lod)\n{\nfloat pot = exp2(lod);\nivec2 pyrBaseSize = textureSize(pyramid, 0);\nconst vec3 ones = vec3(1.0f);\nconst mat3 kernel = mat3(\n0,-1, 0,\n-1, 4,-1,\n0,-1, 0\n);\n#define LPC(x,y) pyrSubpixelAtExOffset(pyramid, position, lod, pot, ivec2((x),(y)), pyrBaseSize).g\nmat3 neighborhood = mat3(\n0.0f, LPC(0,-1), 0.0f,\nLPC(-1,0), LPC(0,0), LPC(1,0),\n0.0f, LPC(0,1), 0.0f\n);\nmat3 m = matrixCompMult(neighborhood, kernel);\nreturn dot(ones, vec3(\ndot(m[0], ones),\ndot(m[1], ones),\ndot(m[2], ones)\n)) * (1.0f + lod);\n}\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/fixed-point.glsl":
/*!**************************************************!*\
  !*** ./src/gpu/shaders/include/fixed-point.glsl ***!
  \**************************************************/
/***/ ((module) => {

module.exports = "#ifndef _FIXEDPOINT_GLSL\n#define _FIXEDPOINT_GLSL\n#define fixed_t int\n#define fixed2_t ivec2\nconst int FIX_BITS = int(@FIX_BITS@);\nconst float FIX_RESOLUTION = float(@FIX_RESOLUTION@);\n#define itofix(x) fixed_t((x) << FIX_BITS)\n#define fixtoi(f) int((x) >> FIX_BITS)\n#define ftofix(x) fixed_t((x) * FIX_RESOLUTION + 0.5f)\n#define fixtof(f) (float(f) / FIX_RESOLUTION)\n#define ivec2tofix(x) fixed2_t((x) << FIX_BITS)\n#define fixtoivec2(f) ivec2((f) >> FIX_BITS)\n#define vec2tofix(v) fixed2_t((v) * FIX_RESOLUTION + vec2(0.5f))\n#define fixtovec2(f) (vec2(f) / FIX_RESOLUTION)\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/float16.glsl":
/*!**********************************************!*\
  !*** ./src/gpu/shaders/include/float16.glsl ***!
  \**********************************************/
/***/ ((module) => {

module.exports = "#ifndef _FLOAT16_GLSL\n#define _FLOAT16_GLSL\n#define encodeFloat16(f) (vec2(packf16(f)) / 255.0f)\n#define decodeFloat16(v) unpackf16(uvec2((v) * 255.0f))\n#define encodePairOfFloat16(f) vec4(encodeFloat16((f).x), encodeFloat16((f).y))\n#define decodePairOfFloat16(v) vec2(decodeFloat16((v).rg), decodeFloat16((v).ba))\n#define encodeNullPairOfFloat16() vec4(1.0f)\n#define isNullPairOfFloat16(v) all(equal((v), encodeNullPairOfFloat16()))\n#define encodeDiscardedPairOfFloat16() vec4(0.0f, 1.0f, 0.0f, 1.0f)\n#define isDiscardedPairOfFloat16(v) all(equal((v), encodeDiscardedPairOfFloat16()))\n#define encodeFloat16NaN() vec2(0.5f, 1.0f)\n#define isEncodedFloat16NaN(v) all(equal((v), encodeFloat16NaN()))\nuvec2 packf16( float f)\n{\nuint y = packHalf2x16(vec2(f, 0.0f));\nreturn uvec2(y, y >> 8u) & 0xFFu;\n}\nfloat unpackf16(uvec2 v)\n{\nv &= 0xFFu;\nreturn unpackHalf2x16(v.x | (v.y << 8u)).x;\n}\nbool isEncodedFloat16Zero(vec2 v)\n{\nuvec2 w = uvec2(v * 255.0f);\nreturn 0u == w.x + w.y * (0x80u - w.y);\n}\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/global.glsl":
/*!*********************************************!*\
  !*** ./src/gpu/shaders/include/global.glsl ***!
  \*********************************************/
/***/ ((module) => {

module.exports = "#ifndef _GLOBAL_GLSL\n#define _GLOBAL_GLSL\n#define threadLocation() ivec2(texCoord * texSize)\n#define outputSize() ivec2(texSize)\n#define threadPixel(img) textureLod((img), texCoord, 0.0f)\n#define pixelAt(img, pos) texelFetch((img), (pos), 0)\n#define pixelAtShortOffset(img, offset) textureLodOffset((img), texCoord, 0.0f, (offset))\n#define pixelAtLongOffset(img, offset) textureLod((img), texCoord + vec2(offset) / texSize, 0.0f)\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/int32.glsl":
/*!********************************************!*\
  !*** ./src/gpu/shaders/include/int32.glsl ***!
  \********************************************/
/***/ ((module) => {

module.exports = "#ifndef _INT32_GLSL\n#define _INT32_GLSL\nuint decodeUint32(vec4 rgba)\n{\nuvec4 v = uvec4(rgba * 255.0f) & 255u;\nreturn v.x | (v.y << 8u) | (v.z << 16u) | (v.w << 24u);\n}\nvec4 encodeUint32(uint value)\n{\nuvec4 v = uvec4(value, value >> 8u, value >> 16u, value >> 24u) & 255u;\nreturn vec4(v) / 255.0f;\n}\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/keypoint-descriptors.glsl":
/*!***********************************************************!*\
  !*** ./src/gpu/shaders/include/keypoint-descriptors.glsl ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = "#ifndef _KEYPOINT_DESCRIPTORS_GLSL\n#define _KEYPOINT_DESCRIPTORS_GLSL\n#if !defined(DESCRIPTOR_SIZE)\n#error Must define DESCRIPTOR_SIZE\n#elif !defined(_KEYPOINTS_GLSL)\n#error Must include keypoints.glsl\n#endif\nuint[DESCRIPTOR_SIZE] readKeypointDescriptor(sampler2D encodedKeypoints, int descriptorSize, int extraSize, int encoderLength, KeypointAddress address)\n{\nint descriptorOffset = sizeofEncodedKeypoint(0, extraSize) / 4;\nKeypointAddress descriptorAddress = KeypointAddress(address.base, descriptorOffset);\nuint[DESCRIPTOR_SIZE] descriptor;\nvec4 pixel; uvec4 bytes;\n@unroll\nfor(int i = 0; i < DESCRIPTOR_SIZE; i += 4) {\npixel = readKeypointData(encodedKeypoints, encoderLength, descriptorAddress);\nbytes = uvec4(pixel * 255.0f);\ndescriptor[i]   = bytes.r;\ndescriptor[i+1] = bytes.g;\ndescriptor[i+2] = bytes.b;\ndescriptor[i+3] = bytes.a;\ndescriptorAddress.offset++;\n}\nreturn descriptor;\n}\nuint[DESCRIPTOR_SIZE] readKeypointDescriptorFromDB(sampler2D descriptorDB, int descriptorDBStride, int index)\n{\nuint[DESCRIPTOR_SIZE] descriptor;\nint rasterIndex = index * (DESCRIPTOR_SIZE / 4) * int(index >= 0);\nvec4 pixel; uvec4 bytes; ivec2 pos;\n@unroll\nfor(int i = 0; i < DESCRIPTOR_SIZE; i += 4) {\npos = ivec2(rasterIndex % descriptorDBStride, rasterIndex / descriptorDBStride);\npixel = (index >= 0) ? texelFetch(descriptorDB, pos, 0) : vec4(0.0f);\nbytes = uvec4(pixel * 255.0f);\ndescriptor[i]   = bytes.r;\ndescriptor[i+1] = bytes.g;\ndescriptor[i+2] = bytes.b;\ndescriptor[i+3] = bytes.a;\nrasterIndex++;\n}\nreturn descriptor;\n}\nint distanceBetweenKeypointDescriptors(uint[DESCRIPTOR_SIZE] a, uint[DESCRIPTOR_SIZE] b)\n{\nconst int[256] POPCNT = int[256](0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,4,5,5,6,5,6,6,7,5,6,6,7,6,7,7,8);\nuvec4 xor, u, v;\nint dist = 0;\nivec4 bits;\n@unroll\nfor(int i = 0; i < DESCRIPTOR_SIZE; i += 4) {\nu = uvec4(a[i], a[i+1], a[i+2], a[i+3]);\nv = uvec4(b[i], b[i+1], b[i+2], b[i+3]);\nxor = (u ^ v) & 255u;\nbits = ivec4(POPCNT[xor.x], POPCNT[xor.y], POPCNT[xor.z], POPCNT[xor.w]);\ndist += bits.x + bits.y + bits.z + bits.w;\n}\nreturn dist;\n}\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/keypoint-matches.glsl":
/*!*******************************************************!*\
  !*** ./src/gpu/shaders/include/keypoint-matches.glsl ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = "#ifndef _KEYPOINT_MATCHES_GLSL\n#define _KEYPOINT_MATCHES_GLSL\n@include \"int32.glsl\"\nconst int MATCH_INDEX_BITS = int(@MATCH_INDEX_BITS@);\nconst int MATCH_INDEX_MASK = int(@MATCH_INDEX_MASK@);\nconst int MATCH_MAX_INDEX = int(@MATCH_MAX_INDEX@);\nconst int MATCH_MAX_DISTANCE = int(@MATCH_MAX_DISTANCE@);\nstruct KeypointMatch\n{\nint index;\nint dist;\n};\nvec4 encodeKeypointMatch(KeypointMatch candidate)\n{\nuint index = uint(candidate.index & MATCH_INDEX_MASK);\nuint dist = uint(clamp(candidate.dist, 0, MATCH_MAX_DISTANCE));\nuint u32 = index | (dist << MATCH_INDEX_BITS);\nreturn encodeUint32(u32);\n}\nKeypointMatch decodeKeypointMatch(vec4 rgba)\n{\nuint u32 = decodeUint32(rgba);\nint dist = int(u32 >> MATCH_INDEX_BITS);\nint index = int(u32 & uint(MATCH_INDEX_MASK));\nreturn KeypointMatch(index, dist);\n}\nconst KeypointMatch MATCH_NOT_FOUND = KeypointMatch(MATCH_MAX_INDEX, MATCH_MAX_DISTANCE);\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/keypoints.glsl":
/*!************************************************!*\
  !*** ./src/gpu/shaders/include/keypoints.glsl ***!
  \************************************************/
/***/ ((module) => {

module.exports = "#ifndef _KEYPOINTS_GLSL\n#define _KEYPOINTS_GLSL\n@include \"math.glsl\"\n@include \"fixed-point.glsl\"\n@include \"float16.glsl\"\n@include \"pyramids.glsl\"\nstruct Keypoint\n{\nvec2 position;\nfloat lod;\nfloat orientation;\nfloat score;\nuint flags;\n};\nstruct KeypointAddress\n{\nint base;\nint offset;\n};\nconst int MIN_KEYPOINT_SIZE = int(@MIN_KEYPOINT_SIZE@);\nconst int MAX_DESCRIPTOR_SIZE = int(@MAX_DESCRIPTOR_SIZE@);\nconst uint KPF_NONE = 0u;\nconst uint KPF_NULL = 1u;\nconst uint KPF_DISCARDED = 2u;\n#define encodeKeypointScore(score) encodeFloat16(score)\n#define decodeKeypointScore(encodedScore) decodeFloat16(encodedScore)\n#define encodeKeypointOrientation(angle) ((angle) * INV_PI_OVER_2 + 0.5f)\n#define decodeKeypointOrientation(value) ((value) * TWO_PI - PI)\n#define encodeNullKeypoint() (vec4(1.0f))\n#define encodeDiscardedKeypoint() (vec4(0.0f))\n#define isNullKeypoint(keypoint) ((((keypoint).flags) & KPF_NULL) != 0u)\n#define isDiscardedKeypoint(keypoint) ((((keypoint).flags) & KPF_DISCARDED) != 0u)\n#define isBadKeypoint(keypoint) ((keypoint).score < 0.0f)\n#define sizeofEncodedKeypoint(descriptorSize, extraSize) (MIN_KEYPOINT_SIZE + (descriptorSize) + (extraSize))\n#define sizeofEncodedKeypointHeader() sizeofEncodedKeypoint(0,0)\n#define findKeypointIndex(address, descriptorSize, extraSize) ((address).base / ((sizeofEncodedKeypoint((descriptorSize), (extraSize))) / 4))\nvec4 readKeypointData(sampler2D encodedKeypoints, int encoderLength, KeypointAddress address)\n{\nint rasterIndex = address.base + address.offset;\nvec4 data = pixelAt(encodedKeypoints, ivec2(rasterIndex % encoderLength, rasterIndex / encoderLength));\nreturn rasterIndex < encoderLength * encoderLength ? data : encodeNullKeypoint();\n}\nKeypointAddress findKeypointAddress(ivec2 thread, int encoderLength, int descriptorSize, int extraSize)\n{\nint threadRaster = thread.y * encoderLength + thread.x;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nint keypointIndex = int(threadRaster / pixelsPerKeypoint);\nKeypointAddress address = KeypointAddress(\nkeypointIndex * pixelsPerKeypoint,\nthreadRaster % pixelsPerKeypoint\n);\nreturn address;\n}\nKeypoint decodeKeypoint(sampler2D encodedKeypoints, int encoderLength, KeypointAddress address)\n{\nKeypoint keypoint;\nKeypointAddress positionAddress = KeypointAddress(address.base, 0);\nKeypointAddress propertiesAddress = KeypointAddress(address.base, 1);\nvec4 rawEncodedPosition = readKeypointData(encodedKeypoints, encoderLength, positionAddress);\nivec4 encodedPosition = ivec4(rawEncodedPosition * 255.0f);\nkeypoint.position = fixtovec2(fixed2_t(\nencodedPosition.r | (encodedPosition.g << 8),\nencodedPosition.b | (encodedPosition.a << 8)\n));\nvec4 rawEncodedProperties = readKeypointData(encodedKeypoints, encoderLength, propertiesAddress);\nkeypoint.lod = decodeLod(rawEncodedProperties.r);\nkeypoint.orientation = decodeKeypointOrientation(rawEncodedProperties.g);\nkeypoint.score = decodeKeypointScore(rawEncodedProperties.ba);\nbool isNull = all(equal(rawEncodedPosition, vec4(1)));\nbool isDiscarded = all(equal(rawEncodedPosition + rawEncodedProperties, vec4(0)));\nkeypoint.score = (isNull || isDiscarded) ? -1.0f : keypoint.score;\nkeypoint.flags = KPF_NONE;\nkeypoint.flags |= KPF_NULL * uint(isNull);\nkeypoint.flags |= KPF_DISCARDED * uint(isDiscarded);\nreturn keypoint;\n}\nvec4 encodeKeypointPosition(vec2 position)\n{\nconst vec2 zeros = vec2(0.0f);\nfixed2_t pos = vec2tofix(max(position, zeros));\nfixed2_t lo = pos & 255;\nfixed2_t hi = (pos >> 8) & 255;\nreturn vec4(lo.x, hi.x, lo.y, hi.y) / 255.0f;\n}\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/math.glsl":
/*!*******************************************!*\
  !*** ./src/gpu/shaders/include/math.glsl ***!
  \*******************************************/
/***/ ((module) => {

module.exports = "#ifndef _MATH_GLSL\n#define _MATH_GLSL\n#define TWO_PI          6.28318530718f\n#define PI              3.14159265359f\n#define PI_OVER_2       1.57079632679f\n#define PI_OVER_4       0.78539816339f\n#define INV_PI          0.3183098861837907f\n#define INV_PI_OVER_2   0.15915494309189535f\nconst highp float INFINITY = 1.0f / 0.0f;\nfloat fastAtan(float x)\n{\nfloat w = 1.0f - abs(x);\nreturn (w >= 0.0f) ? ((PI_OVER_4 + 0.273f * w) * x) :\n(sign(x) * PI_OVER_2 - (PI_OVER_4 + 0.273f * (1.0f - abs(1.0f / x))) / x);\n}\nfloat fastAtan2(float y, float x)\n{\nreturn (x == 0.0f) ? PI_OVER_2 * sign(y) : fastAtan(y / x) + float(x < 0.0f) * PI * sign(y);\n}\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/pyramids.glsl":
/*!***********************************************!*\
  !*** ./src/gpu/shaders/include/pyramids.glsl ***!
  \***********************************************/
/***/ ((module) => {

module.exports = "#ifndef _PYRAMIDS_GLSL\n#define _PYRAMIDS_GLSL\n#define pyrPixel(pyr, lod) textureLod((pyr), texCoord, (lod))\n#define pyrPixelAtOffset(pyr, lod, pot, offset) textureLod((pyr), texCoord + ((pot) * vec2(offset)) / texSize, (lod))\n#define pyrPixelAt(pyr, pos, lod) textureLod((pyr), (vec2(pos) + vec2(0.5f)) / texSize, (lod))\n#define pyrPixelAtEx(pyr, pos, lod, pyrBaseSize) textureLod((pyr), (vec2(pos) + vec2(0.5f)) / vec2(pyrBaseSize), (lod))\n#define pyrSubpixelAtEx(pyr, pos, lod, pyrBaseSize) textureLod((pyr), ((pos) + vec2(0.5f)) / vec2(pyrBaseSize), (lod))\n#define pyrSubpixelAtExOffset(pyr, pos, lod, pot, offset, pyrBaseSize) textureLod((pyr), (((pos) + vec2(0.5f)) + ((pot) * vec2(offset))) / vec2(pyrBaseSize), (lod))\nconst int PYRAMID_MAX_LEVELS = int(@PYRAMID_MAX_LEVELS@);\nconst float F_PYRAMID_MAX_LEVELS = float(@PYRAMID_MAX_LEVELS@);\nconst float LOG2_PYRAMID_MAX_SCALE = float(@LOG2_PYRAMID_MAX_SCALE@);\n#define encodeLod(lod) ((LOG2_PYRAMID_MAX_SCALE + (lod)) / (LOG2_PYRAMID_MAX_SCALE + F_PYRAMID_MAX_LEVELS))\nfloat decodeLod(float encodedLod)\n{\nfloat lod = encodedLod * (LOG2_PYRAMID_MAX_SCALE + F_PYRAMID_MAX_LEVELS) - LOG2_PYRAMID_MAX_SCALE;\nreturn lod - lod * step(1.0f, encodedLod);\n}\n#define LOD_EPS 0.0625f\nconst float ENCODED_LOD_EPS = (LOD_EPS / (LOG2_PYRAMID_MAX_SCALE + F_PYRAMID_MAX_LEVELS));\n#define isSameLod(lod1, lod2) (abs((lod1) - (lod2)) < LOD_EPS)\n#define isSameEncodedLod(alpha1, alpha2) (abs((alpha1) - (alpha2)) < ENCODED_LOD_EPS)\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/include/subpixel.glsl":
/*!***********************************************!*\
  !*** ./src/gpu/shaders/include/subpixel.glsl ***!
  \***********************************************/
/***/ ((module) => {

module.exports = "#ifndef _SUBPIXEL_GLSL\n#define _SUBPIXEL_GLSL\n#define subpixelAt(image, pos) textureLod((image), ((pos) + vec2(0.5f)) / texSize, 0.0f)\nvec4 subpixelAtBI(sampler2D image, vec2 pos)\n{\nvec2 frc = fract(pos);\nvec2 ifrc = vec2(1.0f) - frc;\nvec2 p = (floor(pos) + vec2(0.5f)) / vec2(textureSize(image, 0));\nvec4 pix00 = textureLod(image, p, 0.0f);\nvec4 pix10 = textureLodOffset(image, p, 0.0f, ivec2(1,0));\nvec4 pix01 = textureLodOffset(image, p, 0.0f, ivec2(0,1));\nvec4 pix11 = textureLodOffset(image, p, 0.0f, ivec2(1,1));\nmat4 pix = mat4(pix00, pix10, pix01, pix11);\nvec4 mul = vec4(ifrc.x * ifrc.y, frc.x * ifrc.y, ifrc.x * frc.y, frc.x * frc.y);\nreturn pix * mul;\n}\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/allocate-descriptors.glsl":
/*!*************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/allocate-descriptors.glsl ***!
  \*************************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D inputEncodedKeypoints;\nuniform int inputDescriptorSize;\nuniform int inputExtraSize;\nuniform int inputEncoderLength;\nuniform int outputDescriptorSize;\nuniform int outputExtraSize;\nuniform int outputEncoderLength;\nconst vec4 EMPTY_DESCRIPTOR = vec4(0.0f);\nvoid main()\n{\nivec2 thread = threadLocation();\nKeypointAddress myAddress = findKeypointAddress(thread, outputEncoderLength, outputDescriptorSize, outputExtraSize);\nint myIndex = findKeypointIndex(myAddress, outputDescriptorSize, outputExtraSize);\nint headerSize = sizeofEncodedKeypointHeader();\nbool isDescriptor = (myAddress.offset >= (headerSize + outputExtraSize) / 4);\nint addressOffset = myAddress.offset;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(inputDescriptorSize, inputExtraSize) / 4;\nKeypointAddress otherAddress = KeypointAddress(myIndex * pixelsPerKeypoint, addressOffset);\ncolor = isDescriptor ? EMPTY_DESCRIPTOR : readKeypointData(inputEncodedKeypoints, inputEncoderLength, otherAddress);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/allocate-extra.glsl":
/*!*******************************************************!*\
  !*** ./src/gpu/shaders/keypoints/allocate-extra.glsl ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D inputEncodedKeypoints;\nuniform int inputDescriptorSize;\nuniform int inputExtraSize;\nuniform int inputEncoderLength;\nuniform int outputDescriptorSize;\nuniform int outputExtraSize;\nuniform int outputEncoderLength;\nvoid main()\n{\nivec2 thread = threadLocation();\nKeypointAddress myAddress = findKeypointAddress(thread, outputEncoderLength, outputDescriptorSize, outputExtraSize);\nint myIndex = findKeypointIndex(myAddress, outputDescriptorSize, outputExtraSize);\nint headerSize = sizeofEncodedKeypointHeader();\nbool isHead = (myAddress.offset < headerSize / 4);\nbool isDescriptor = (myAddress.offset >= (headerSize + outputExtraSize) / 4);\nbool isExtra = (!isHead && !isDescriptor);\nint numberOfExtraPixels = outputExtraSize / 4;\nint addressOffset = myAddress.offset - int(isDescriptor) * numberOfExtraPixels;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(inputDescriptorSize, inputExtraSize) / 4;\nKeypointAddress otherAddress = KeypointAddress(myIndex * pixelsPerKeypoint, addressOffset);\ncolor = isExtra ? vec4(0.0f) : readKeypointData(inputEncodedKeypoints, inputEncoderLength, otherAddress);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/apply-homography.glsl":
/*!*********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/apply-homography.glsl ***!
  \*********************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\nuniform mat3 homography;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nvoid main()\n{\nvec4 pixel = threadPixel(encodedKeypoints);\nivec2 thread = threadLocation();\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\ncolor = pixel;\nif(address.offset != 0)\nreturn;\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);\nif(isBadKeypoint(keypoint))\nreturn;\nvec3 pos3 = homography * vec3(keypoint.position, 1.0f);\ncolor = encodeKeypointPosition(pos3.xy / pos3.z);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/bf-knn.glsl":
/*!***********************************************!*\
  !*** ./src/gpu/shaders/keypoints/bf-knn.glsl ***!
  \***********************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\n@include \"keypoint-descriptors.glsl\"\n@include \"keypoint-matches.glsl\"\nuniform sampler2D encodedMatches;\nuniform sampler2D encodedFilters;\nuniform int matcherLength;\nuniform sampler2D dbEncodedKeypoints;\nuniform int dbDescriptorSize;\nuniform int dbExtraSize;\nuniform int dbEncoderLength;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nuniform int passId;\n#ifndef NUMBER_OF_KEYPOINTS_PER_PASS\n#error Undefined NUMBER_OF_KEYPOINTS_PER_PASS\n#endif\nconst int INFINITE_DISTANCE = MATCH_MAX_DISTANCE + 1;\nvoid main()\n{\nivec2 thread = threadLocation();\nint keypointIndex = thread.x + thread.y * matcherLength;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);\ncolor = encodeKeypointMatch(MATCH_NOT_FOUND);\nif(isBadKeypoint(keypoint))\nreturn;\nKeypointMatch bestMatch = decodeKeypointMatch(threadPixel(encodedMatches));\nKeypointMatch filterMatch = decodeKeypointMatch(threadPixel(encodedFilters));\nuint[DESCRIPTOR_SIZE] descriptor = readKeypointDescriptor(encodedKeypoints, descriptorSize, extraSize, encoderLength, address);\nuint[DESCRIPTOR_SIZE] dbDescriptor;\nint dbPixelsPerKeypoint = sizeofEncodedKeypoint(dbDescriptorSize, dbExtraSize) / 4;\nfor(int i = 0; i < NUMBER_OF_KEYPOINTS_PER_PASS; i++) {\nint dbKeypointIndex = passId * NUMBER_OF_KEYPOINTS_PER_PASS + i;\nKeypointAddress dbAddress = KeypointAddress(dbKeypointIndex * dbPixelsPerKeypoint, 0);\nKeypoint dbKeypoint = decodeKeypoint(dbEncodedKeypoints, dbEncoderLength, dbAddress);\ndbDescriptor = readKeypointDescriptor(dbEncodedKeypoints, dbDescriptorSize, dbExtraSize, dbEncoderLength, dbAddress);\nint dist = !isBadKeypoint(dbKeypoint) ? distanceBetweenKeypointDescriptors(descriptor, dbDescriptor) : INFINITE_DISTANCE;\nbestMatch.index = all(bvec2(\ndist < bestMatch.dist || (dist == bestMatch.dist && dbKeypointIndex > bestMatch.index),\ndist > filterMatch.dist || (dist == filterMatch.dist && dbKeypointIndex < filterMatch.index)\n)) ? dbKeypointIndex : bestMatch.index;\nbestMatch.dist = dbKeypointIndex == bestMatch.index ? dist : bestMatch.dist;\n}\ncolor = encodeKeypointMatch(bestMatch);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/clip-border.glsl":
/*!****************************************************!*\
  !*** ./src/gpu/shaders/keypoints/clip-border.glsl ***!
  \****************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\nuniform int imageWidth;\nuniform int imageHeight;\nuniform int borderTop;\nuniform int borderRight;\nuniform int borderBottom;\nuniform int borderLeft;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nvoid main()\n{\nivec2 thread = threadLocation();\nKeypointAddress addr = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, addr);\nvec2 p = keypoint.position;\nbool withinBorder = any(lessThan(\nvec4(p.x, p.y, -p.x, -p.y),\nvec4(borderLeft, borderTop, borderRight - (imageWidth - 1), borderBottom - (imageHeight - 1))\n));\nvec4 pixel = threadPixel(encodedKeypoints);\nvec4 nullPixel = encodeNullKeypoint();\ncolor = withinBorder ? nullPixel : pixel;\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/clip.glsl":
/*!*********************************************!*\
  !*** ./src/gpu/shaders/keypoints/clip.glsl ***!
  \*********************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nuniform int maxKeypoints;\nvoid main()\n{\nivec2 thread = threadLocation();\nint newEncoderLength = outputSize().x;\nKeypointAddress address = findKeypointAddress(thread, newEncoderLength, descriptorSize, extraSize);\nint index = findKeypointIndex(address, descriptorSize, extraSize);\nvec4 pixel = readKeypointData(encodedKeypoints, encoderLength, address);\ncolor = index < maxKeypoints ? pixel : encodeNullKeypoint();\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/distance-filter.glsl":
/*!********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/distance-filter.glsl ***!
  \********************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D encodedKeypointsA;\nuniform int encoderLengthA;\nuniform sampler2D encodedKeypointsB;\nuniform int encoderLengthB;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nuniform float threshold;\nvoid main()\n{\nivec2 thread = threadLocation();\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint index = findKeypointIndex(address, descriptorSize, extraSize);\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nvec4 data = readKeypointData(encodedKeypointsA, encoderLengthA, address);\ncolor = data;\nif(address.offset >= sizeofEncodedKeypointHeader() / 4)\nreturn;\nKeypoint keypointA = decodeKeypoint(encodedKeypointsA, encoderLengthA, address);\nKeypoint keypointB = decodeKeypoint(encodedKeypointsB, encoderLengthB, address);\ncolor = encodeNullKeypoint();\nif(isNullKeypoint(keypointA) && isNullKeypoint(keypointB))\nreturn;\ncolor = encodeDiscardedKeypoint();\nif(isDiscardedKeypoint(keypointA) || isDiscardedKeypoint(keypointB))\nreturn;\ncolor = encodeDiscardedKeypoint();\nif(isNullKeypoint(keypointA) || isNullKeypoint(keypointB))\nreturn;\nvec2 delta = keypointA.position - keypointB.position;\nbool shouldKeep = (dot(delta, delta) <= threshold * threshold);\ncolor = shouldKeep ? data : encodeDiscardedKeypoint();\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/encode-keypoint-long-offsets.glsl":
/*!*********************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/encode-keypoint-long-offsets.glsl ***!
  \*********************************************************************/
/***/ ((module) => {

module.exports = "@include \"float16.glsl\"\nuniform sampler2D offsetsImage;\nuniform ivec2 imageSize;\n#ifndef MAX_ITERATIONS\n#error Undefined MAX_ITERATIONS\n#endif\n#define decodeSkipOffset(pixel) (int((pixel).g * 255.0f) | (int((pixel).a * 255.0f) << 8))\n#define encodeSkipOffset(offset) (vec2((offset) & 255, (offset) >> 8) / 255.0f)\nvoid main()\n{\nvec4 pixel = threadPixel(offsetsImage);\nivec2 thread = threadLocation();\nint rasterIndex = thread.y * imageSize.x + thread.x;\nint offset = decodeSkipOffset(pixel);\nint totalOffset = offset;\nvec2 encodedScore = pixel.rb;\nivec2 pos = thread; int allow = 1;\n@unroll\nfor(int i = 0; i < MAX_ITERATIONS; i++) {\nallow *= int(pos.y < imageSize.y) * int(isEncodedFloat16Zero(pixel.rb));\nrasterIndex += allow * offset;\npos = ivec2(rasterIndex % imageSize.x, rasterIndex / imageSize.x);\npixel = pixelAt(offsetsImage, pos);\noffset = decodeSkipOffset(pixel);\ntotalOffset += allow * offset;\n}\ntotalOffset = min(totalOffset, 65535);\ncolor.rb = encodedScore;\ncolor.ga = encodeSkipOffset(totalOffset);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/encode-keypoint-offsets.glsl":
/*!****************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/encode-keypoint-offsets.glsl ***!
  \****************************************************************/
/***/ ((module) => {

module.exports = "@include \"float16.glsl\"\nuniform sampler2D corners;\nuniform ivec2 imageSize;\nvoid main()\n{\nvec4 pixel = threadPixel(corners);\nivec2 pos = threadLocation();\nvec2 encodedScore = pixel.rb;\nint offset = 0, allow = 1, jumped = 0;\n#define READ(j) ; \\\nallow *= int(pos.y < imageSize.y) * int(isEncodedFloat16Zero(pixel.rb)); \\\noffset += allow; \\\npos.x = (pos.x + 1) % imageSize.x; \\\npos.y += int(pos.x == 0); \\\npixel = (0 != (jumped |= int(pos.x == 0))) ? pixelAtShortOffset(corners, ivec2((j),1)) : pixelAtShortOffset(corners, ivec2((j),0))\nREAD(1); READ(2); READ(3); READ(4); READ(5); READ(6); READ(7);\ncolor.rb = encodedScore;\ncolor.ga = vec2(offset, 0) / 255.0f;\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/encode-keypoint-positions.glsl":
/*!******************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/encode-keypoint-positions.glsl ***!
  \******************************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D offsetsImage;\nuniform ivec2 imageSize;\nuniform int passId;\nuniform int numPasses;\nuniform int keypointLimit;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#define decodeSkipOffset(pixel) (int((pixel).g * 255.0f) | (int((pixel).a * 255.0f) << 8))\nbool findQthKeypoint(int q, int p, inout ivec2 position, out vec4 pixel)\n{\nint notFirstPass = int(passId > 0);\nposition *= notFirstPass;\np |= -(1 - notFirstPass);\np -= notFirstPass;\nint rasterIndex = position.y * imageSize.x + position.x;\nwhile(position.y < imageSize.y && p != q) {\nposition = ivec2(rasterIndex % imageSize.x, rasterIndex / imageSize.x);\npixel = texelFetch(offsetsImage, position, 0);\np += int(!isEncodedFloat16Zero(pixel.rb));\nrasterIndex += max(1, decodeSkipOffset(pixel));\n}\nreturn (p == q);\n}\nvoid main()\n{\nivec2 thread = threadLocation();\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint q = findKeypointIndex(address, descriptorSize, extraSize);\ncolor = vec4(0.0f);\nif(address.offset != 0)\nreturn;\ncolor = threadPixel(encodedKeypoints);\nint numPixels = encoderLength * encoderLength;\nint maxKeypoints = numPixels / pixelsPerKeypoint;\nint maxKeypointsPerPass = maxKeypoints / numPasses + int(maxKeypoints % numPasses != 0);\nint targetPassId = q / maxKeypointsPerPass;\nif(passId != targetPassId)\nreturn;\nint lastIndexFromPrevPass = passId * maxKeypointsPerPass - 1;\nKeypointAddress lastAddressFromPrevPass = KeypointAddress(max(0, lastIndexFromPrevPass) * pixelsPerKeypoint, 0);\nKeypoint lastKeypointFromPrevPass = decodeKeypoint(encodedKeypoints, encoderLength, lastAddressFromPrevPass);\nivec2 position = passId > 0 ? ivec2(lastKeypointFromPrevPass.position) : ivec2(0);\nvec4 pixel;\ncolor = encodeNullKeypoint();\nif(q >= min(maxKeypoints, keypointLimit) || !findQthKeypoint(q, lastIndexFromPrevPass, position, pixel))\nreturn;\ncolor = encodeKeypointPosition(vec2(position));\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/encode-keypoint-properties.glsl":
/*!*******************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/encode-keypoint-properties.glsl ***!
  \*******************************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D corners;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nvoid main()\n{\nivec2 thread = threadLocation();\nvec4 pixel = threadPixel(encodedKeypoints);\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint q = findKeypointIndex(address, descriptorSize, extraSize);\ncolor = pixel;\nif(address.offset != 1)\nreturn;\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);\nvec4 kpix = pixelAt(corners, ivec2(keypoint.position));\nkeypoint.score = decodeFloat16(kpix.rb);\ncolor.r = kpix.a;\ncolor.g = encodeKeypointOrientation(0.0f);\ncolor.ba = encodeKeypointScore(keypoint.score);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/encode-keypoints.glsl":
/*!*********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/encode-keypoints.glsl ***!
  \*********************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D corners;\nuniform mediump usampler2D lookupTable;\nuniform int stride;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nuniform int encoderCapacity;\nconst uvec2 NULL_ELEMENT = uvec2(0xFFFFu);\nvoid main()\n{\nivec2 thread = threadLocation();\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint index = findKeypointIndex(address, descriptorSize, extraSize);\nivec2 pos = ivec2(index % stride, index / stride);\nuvec4 entry = texelFetch(lookupTable, pos, 0);\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nint rasterIndex = address.base + address.offset;\nint numberOfPixels = encoderLength * encoderLength;\nint numberOfValidPixels = numberOfPixels - (numberOfPixels % pixelsPerKeypoint);\nint maxEncoderCapacity = numberOfValidPixels / pixelsPerKeypoint;\ncolor = encodeNullKeypoint();\nif(all(equal(entry.xy, NULL_ELEMENT)) || index >= min(encoderCapacity, maxEncoderCapacity))\nreturn;\ncolor = encodeKeypointPosition(vec2(entry.xy));\nif(address.offset == 0)\nreturn;\ncolor = vec4(0.0f);\nif(address.offset >= sizeofEncodedKeypointHeader() / 4)\nreturn;\nvec4 pixel = texelFetch(corners, ivec2(entry.xy), 0);\nvec2 encodedScore = encodeKeypointScore(decodeFloat16(pixel.rb));\nfloat encodedOrientation = encodeKeypointOrientation(0.0f);\nfloat encodedLod = pixel.a;\ncolor = vec4(encodedLod, encodedOrientation, encodedScore);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/encode-null-keypoints.glsl":
/*!**************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/encode-null-keypoints.glsl ***!
  \**************************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\nvoid main()\n{\ncolor = encodeNullKeypoint();\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/fast.glsl":
/*!*********************************************!*\
  !*** ./src/gpu/shaders/keypoints/fast.glsl ***!
  \*********************************************/
/***/ ((module) => {

module.exports = "@include \"pyramids.glsl\"\n@include \"float16.glsl\"\nuniform sampler2D corners;\nuniform sampler2D pyramid;\nuniform float lod;\nuniform int threshold;\n#define USE_VARYINGS 1\n#if !defined(FAST_TYPE)\n#error Undefined FAST_TYPE\n#elif FAST_TYPE == 916\nin vec2 v_pix0, v_pix1, v_pix2, v_pix3, v_pix4, v_pix5, v_pix6, v_pix7,\nv_pix8, v_pix9, v_pix10,v_pix11,v_pix12,v_pix13,v_pix14,v_pix15;\n#else\n#error Invalid FAST_TYPE\n#endif\n#define PIX(x,y) pyrPixelAtOffset(pyramid, lod, pot, ivec2((x),(y))).g\n#define XIP(v) textureLod(pyramid, (v), lod).g\nvoid main()\n{\nfloat pixel = threadPixel(pyramid).g;\nvec4 prev = threadPixel(corners);\nivec2 thread = threadLocation();\nivec2 size = outputSize();\nfloat pot = exp2(lod);\nfloat t = float(clamp(threshold, 0, 255)) / 255.0f;\nfloat ct = pixel + t, c_t = pixel - t;\ncolor = vec4(prev.r, pixel, prev.ba);\n#if FAST_TYPE == 916\nconst ivec4 margin = ivec4(3, 3, 4, 4);\nif(any(lessThan(ivec4(thread, size - thread), margin)))\nreturn;\n#if USE_VARYINGS\nfloat p0 = XIP(v_pix0), p4 = XIP(v_pix4), p8 = XIP(v_pix8), p12 = XIP(v_pix12);\n#else\nfloat p0 = PIX(0,3), p4 = PIX(3,0), p8 = PIX(0,-3), p12 = PIX(-3,0);\n#endif\nbvec4 brighter = bvec4(p0 > ct, p4 > ct, p8 > ct, p12 > ct);\nbvec4 darker = bvec4(p0 < c_t, p4 < c_t, p8 < c_t, p12 < c_t);\nbvec4 bpairs = bvec4(all(brighter.xy), all(brighter.yz), all(brighter.zw), all(brighter.wx));\nbvec4 dpairs = bvec4(all(darker.xy), all(darker.yz), all(darker.zw), all(darker.wx));\nif(!(any(bpairs) || any(dpairs)))\nreturn;\n#if USE_VARYINGS\nfloat p1 = XIP(v_pix1), p2 = XIP(v_pix2), p3 = XIP(v_pix3),\np5 = XIP(v_pix5), p6 = XIP(v_pix6), p7 = XIP(v_pix7),\np9 = XIP(v_pix9), p10 = XIP(v_pix10), p11 = XIP(v_pix11),\np13 = XIP(v_pix13), p14 = XIP(v_pix14), p15 = XIP(v_pix15);\n#else\nfloat p1 = PIX(1,3), p2 = PIX(2,2), p3 = PIX(3,1),\np5 = PIX(3,-1), p6 = PIX(2,-2), p7 = PIX(1,-3),\np9 = PIX(-1,-3), p10 = PIX(-2,-2), p11 = PIX(-3,-1),\np13 = PIX(-3,1), p14 = PIX(-2,2), p15 = PIX(-1,3);\n#endif\nbool A=(p0>ct),B=(p1>ct),C=(p2>ct),D=(p3>ct),E=(p4>ct),F=(p5>ct),G=(p6>ct),H=(p7>ct),I=(p8>ct),J=(p9>ct),K=(p10>ct),L=(p11>ct),M=(p12>ct),N=(p13>ct),O=(p14>ct),P=(p15>ct),a=(p0<c_t),b=(p1<c_t),c=(p2<c_t),d=(p3<c_t),e=(p4<c_t),f=(p5<c_t),g=(p6<c_t),h=(p7<c_t),i=(p8<c_t),j=(p9<c_t),k=(p10<c_t),l=(p11<c_t),m=(p12<c_t),n=(p13<c_t),o=(p14<c_t),p=(p15<c_t);\nbool isCorner=A&&(B&&(K&&L&&J&&(M&&N&&O&&P||G&&H&&I&&(M&&N&&O||F&&(M&&N||E&&(M||D))))||C&&(K&&L&&M&&(N&&O&&P||G&&H&&I&&J&&(N&&O||F&&(N||E)))||D&&(N&&(L&&M&&(K&&G&&H&&I&&J&&(O||F)||O&&P)||k&&l&&m&&e&&f&&g&&h&&i&&j)||E&&(O&&(M&&N&&(K&&L&&G&&H&&I&&J||P)||k&&l&&m&&n&&f&&g&&h&&i&&j)||F&&(P&&(N&&O||k&&l&&m&&n&&o&&g&&h&&i&&j)||G&&(O&&P||H&&(P||I)||k&&l&&m&&n&&o&&p&&h&&i&&j)||k&&l&&m&&n&&o&&h&&i&&j&&(p||g))||k&&l&&m&&n&&h&&i&&j&&(o&&(p||g)||f&&(o&&p||g)))||k&&l&&m&&h&&i&&j&&(n&&(o&&p||g&&(o||f))||e&&(n&&o&&p||g&&(n&&o||f))))||k&&l&&h&&i&&j&&(m&&(n&&o&&p||g&&(n&&o||f&&(n||e)))||d&&(m&&n&&o&&p||g&&(m&&n&&o||f&&(m&&n||e)))))||k&&h&&i&&j&&(l&&(m&&n&&o&&p||g&&(m&&n&&o||f&&(m&&n||e&&(m||d))))||c&&(l&&m&&n&&o&&p||g&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d))))))||K&&I&&J&&(L&&M&&N&&O&&P||G&&H&&(L&&M&&N&&O||F&&(L&&M&&N||E&&(L&&M||D&&(L||C)))))||h&&i&&j&&(b&&(k&&l&&m&&n&&o&&p||g&&(k&&l&&m&&n&&o||f&&(k&&l&&m&&n||e&&(k&&l&&m||d&&(k&&l||c)))))||k&&(l&&m&&n&&o&&p||g&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c)))))))||B&&(H&&I&&J&&(K&&L&&M&&N&&O&&P&&a||G&&(K&&L&&M&&N&&O&&a||F&&(K&&L&&M&&N&&a||E&&(K&&L&&M&&a||D&&(K&&L&&a||C)))))||a&&k&&i&&j&&(l&&m&&n&&o&&p||g&&h&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c))))))||C&&(K&&H&&I&&J&&(L&&M&&N&&O&&P&&a&&b||G&&(L&&M&&N&&O&&a&&b||F&&(L&&M&&N&&a&&b||E&&(L&&M&&a&&b||D))))||a&&b&&k&&l&&j&&(m&&n&&o&&p||g&&h&&i&&(m&&n&&o||f&&(m&&n||e&&(m||d)))))||D&&(K&&L&&H&&I&&J&&(M&&N&&O&&P&&a&&b&&c||G&&(M&&N&&O&&a&&b&&c||F&&(M&&N&&a&&b&&c||E)))||a&&b&&k&&l&&m&&c&&(n&&o&&p||g&&h&&i&&j&&(n&&o||f&&(n||e))))||E&&(K&&L&&M&&H&&I&&J&&(N&&O&&P&&a&&b&&c&&d||G&&(N&&O&&a&&b&&c&&d||F))||a&&b&&l&&m&&n&&c&&d&&(k&&g&&h&&i&&j&&(o||f)||o&&p))||F&&(K&&L&&M&&N&&H&&I&&J&&(O&&P&&a&&b&&c&&d&&e||G)||a&&b&&m&&n&&o&&c&&d&&e&&(k&&l&&g&&h&&i&&j||p))||G&&(K&&L&&M&&N&&O&&H&&I&&J||a&&b&&n&&o&&p&&c&&d&&e&&f)||H&&(K&&L&&M&&N&&O&&P&&I&&J||a&&b&&o&&p&&c&&d&&e&&f&&g)||a&&(b&&(k&&l&&j&&(m&&n&&o&&p||g&&h&&i&&(m&&n&&o||f&&(m&&n||e&&(m||d))))||c&&(k&&l&&m&&(n&&o&&p||g&&h&&i&&j&&(n&&o||f&&(n||e)))||d&&(l&&m&&n&&(k&&g&&h&&i&&j&&(o||f)||o&&p)||e&&(m&&n&&o&&(k&&l&&g&&h&&i&&j||p)||f&&(n&&o&&p||g&&(o&&p||h&&(p||i)))))))||k&&i&&j&&(l&&m&&n&&o&&p||g&&h&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c))))))||h&&i&&j&&(k&&l&&m&&n&&o&&p||g&&(k&&l&&m&&n&&o||f&&(k&&l&&m&&n||e&&(k&&l&&m||d&&(k&&l||c&&(b||k))))));\nif(!isCorner)\nreturn;\nmat4 mp = mat4(p0,p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12,p13,p14,p15);\nmat4 mct = mp - mat4(ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct);\nmat4 mc_t = mat4(c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t) - mp;\nconst vec4 zeros = vec4(0.0f), ones = vec4(1.0f);\nvec4 bs = max(mct[0], zeros), ds = max(mc_t[0], zeros);\nbs += max(mct[1], zeros);     ds += max(mc_t[1], zeros);\nbs += max(mct[2], zeros);     ds += max(mc_t[2], zeros);\nbs += max(mct[3], zeros);     ds += max(mc_t[3], zeros);\nfloat thisScore = max(dot(bs, ones), dot(ds, ones)) / 16.0f;\nfloat prevScore = decodeFloat16(prev.rb);\nvec3 thisResult = vec3(encodeFloat16(thisScore), encodeLod(lod));\ncolor.rba = thisScore > prevScore ? thisResult : color.rba;\n#endif\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/fast.vs.glsl":
/*!************************************************!*\
  !*** ./src/gpu/shaders/keypoints/fast.vs.glsl ***!
  \************************************************/
/***/ ((module) => {

module.exports = "uniform mediump float lod;\n#if !defined(FAST_TYPE)\n#error Undefined FAST_TYPE\n#elif FAST_TYPE == 916\nout vec2 v_pix0, v_pix1, v_pix2, v_pix3, v_pix4, v_pix5, v_pix6, v_pix7,\nv_pix8, v_pix9, v_pix10,v_pix11,v_pix12,v_pix13,v_pix14,v_pix15;\n#else\n#error Invalid FAST_TYPE\n#endif\n#define PIX(x,y) (texCoord + ((pot) * vec2((x),(y))) / texSize)\nvoid vsmain()\n{\nfloat pot = exp2(lod);\n#if FAST_TYPE == 916\nv_pix0 = PIX(0,3); v_pix1 = PIX(1,3), v_pix2 = PIX(2,2), v_pix3 = PIX(3,1);\nv_pix4 = PIX(3,0); v_pix5 = PIX(3,-1), v_pix6 = PIX(2,-2), v_pix7 = PIX(1,-3);\nv_pix8 = PIX(0,-3); v_pix9 = PIX(-1,-3), v_pix10 = PIX(-2,-2), v_pix11 = PIX(-3,-1);\nv_pix12 = PIX(-3,0); v_pix13 = PIX(-3,1), v_pix14 = PIX(-2,2), v_pix15 = PIX(-1,3);\n#endif\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/hamming-distance-filter.glsl":
/*!****************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/hamming-distance-filter.glsl ***!
  \****************************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\n@include \"keypoint-descriptors.glsl\"\nuniform sampler2D encodedKeypointsA;\nuniform int encoderLengthA;\nuniform sampler2D encodedKeypointsB;\nuniform int encoderLengthB;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nuniform int threshold;\nvoid main()\n{\nivec2 thread = threadLocation();\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint index = findKeypointIndex(address, descriptorSize, extraSize);\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nvec4 data = readKeypointData(encodedKeypointsA, encoderLengthA, address);\ncolor = data;\nif(address.offset >= sizeofEncodedKeypointHeader() / 4)\nreturn;\nKeypoint keypointA = decodeKeypoint(encodedKeypointsA, encoderLengthA, address);\nKeypoint keypointB = decodeKeypoint(encodedKeypointsB, encoderLengthB, address);\ncolor = encodeNullKeypoint();\nif(isNullKeypoint(keypointA) && isNullKeypoint(keypointB))\nreturn;\ncolor = encodeDiscardedKeypoint();\nif(isDiscardedKeypoint(keypointA) || isDiscardedKeypoint(keypointB))\nreturn;\ncolor = encodeDiscardedKeypoint();\nif(isNullKeypoint(keypointA) || isNullKeypoint(keypointB))\nreturn;\nuint[DESCRIPTOR_SIZE] descriptorA, descriptorB;\ndescriptorA = readKeypointDescriptor(encodedKeypointsA, descriptorSize, extraSize, encoderLengthA, address);\ndescriptorB = readKeypointDescriptor(encodedKeypointsB, descriptorSize, extraSize, encoderLengthB, address);\nint dist = distanceBetweenKeypointDescriptors(descriptorA, descriptorB);\nbool shouldKeep = (dist <= threshold);\ncolor = shouldKeep ? data : encodeDiscardedKeypoint();\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/harris-cutoff.glsl":
/*!******************************************************!*\
  !*** ./src/gpu/shaders/keypoints/harris-cutoff.glsl ***!
  \******************************************************/
/***/ ((module) => {

module.exports = "@include \"float16.glsl\"\nuniform sampler2D corners;\nuniform sampler2D maxScore;\nuniform float quality;\nvoid main()\n{\nvec4 pixel = threadPixel(corners);\nfloat score = decodeFloat16(pixel.rb);\nfloat maxval = decodeFloat16(threadPixel(maxScore).rb);\nfloat threshold = maxval * clamp(quality, 0.0f, 1.0f);\ncolor = pixel;\ncolor.rb = score >= threshold ? color.rb : encodeFloat16(0.0f);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/harris.glsl":
/*!***********************************************!*\
  !*** ./src/gpu/shaders/keypoints/harris.glsl ***!
  \***********************************************/
/***/ ((module) => {

module.exports = "@include \"pyramids.glsl\"\n@include \"float16.glsl\"\n@include \"filters.glsl\"\n#if !defined(WINDOW_SIZE)\n#error Undefined WINDOW_SIZE\n#endif\n#define WINDOW_RADIUS ((WINDOW_SIZE - 1) / 2)\nuniform sampler2D corners;\nuniform sampler2D pyramid;\nuniform sampler2D derivatives;\nuniform float lod;\nuniform float lodStep;\nuniform float gaussian[@WINDOW_SIZE@];\n#define G(x) gaussian[(x) + WINDOW_RADIUS]\n#define W(x,y) (G(x) * G(y))\n#define H(ox,oy) dpix = pixelAtShortOffset(derivatives, ivec2((ox),(oy))); \\\ndf = (1.0f + lod) * decodePairOfFloat16(dpix); \\\nh += vec3(df.x * df.x, df.x * df.y, df.y * df.y) * W((ox),(oy))\nvoid main()\n{\nfloat intensity = 0.0f;\nivec2 thread = threadLocation();\nvec4 pixel = threadPixel(corners);\nvec4 dpix = vec4(0.0f);\nvec2 df = vec2(0.0f);\nvec3 h = vec3(0.0f);\ncolor = pixel;\n#if WINDOW_SIZE == 1\nH(0,0);\n#elif WINDOW_SIZE == 3\nH(-1,-1); H(0,-1); H(1,-1);\nH(-1,0); H(0,0); H(1,0);\nH(-1,1); H(0,1); H(1,1);\n#elif WINDOW_SIZE == 5\nH(-2,-2); H(-1,-2); H(0,-2); H(1,-2); H(2,-2);\nH(-2,-1); H(-1,-1); H(0,-1); H(1,-1); H(2,-1);\nH(-2,0); H(-1,0); H(0,0); H(1,0); H(2,0);\nH(-2,1); H(-1,1); H(0,1); H(1,1); H(2,1);\nH(-2,2); H(-1,2); H(0,2); H(1,2); H(2,2);\n#elif WINDOW_SIZE == 7\nH(-3,-3); H(-2,-3); H(-1,-3); H(0,-3); H(1,-3); H(2,-3); H(3,-3);\nH(-3,-2); H(-2,-2); H(-1,-2); H(0,-2); H(1,-2); H(2,-2); H(3,-2);\nH(-3,-1); H(-2,-1); H(-1,-1); H(0,-1); H(1,-1); H(2,-1); H(3,-1);\nH(-3,0); H(-2,0); H(-1,0); H(0,0); H(1,0); H(2,0); H(3,0);\nH(-3,1); H(-2,1); H(-1,1); H(0,1); H(1,1); H(2,1); H(3,1);\nH(-3,2); H(-2,2); H(-1,2); H(0,2); H(1,2); H(2,2); H(3,2);\nH(-3,3); H(-2,3); H(-1,3); H(0,3); H(1,3); H(2,3); H(3,3);\n#else\n#error Invalid WINDOW_SIZE\n#endif\nfloat response = 0.5f * (h.x + h.z - sqrt((h.x - h.z) * (h.x - h.z) + 4.0f * h.y * h.y));\nresponse /= float(WINDOW_SIZE * WINDOW_SIZE);\nfloat lodPlus = min(float(PYRAMID_MAX_LEVELS - 1), lod + lodStep);\nfloat currentScaleStrength = abs(laplacian(pyramid, vec2(thread), lod));\nfloat previousScaleStrength = abs(laplacian(pyramid, vec2(thread), lodPlus));\nfloat previousResponse = decodeFloat16(pixel.rb);\nvec4 result = vec4(encodeFloat16(response), encodeLod(lod), intensity);\ncolor.rbag = (currentScaleStrength >= previousScaleStrength || previousResponse == 0.0f) ? result : pixel.rbag;\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/knn-init.glsl":
/*!*************************************************!*\
  !*** ./src/gpu/shaders/keypoints/knn-init.glsl ***!
  \*************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoint-matches.glsl\"\nvoid main()\n{\n#if ENCODE_FILTERS != 0\nKeypointMatch initial = KeypointMatch(MATCH_MAX_INDEX, 0);\n#else\nKeypointMatch initial = KeypointMatch(MATCH_MAX_INDEX, MATCH_MAX_DISTANCE);\n#endif\ncolor = encodeKeypointMatch(initial);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/knn-transfer.glsl":
/*!*****************************************************!*\
  !*** ./src/gpu/shaders/keypoints/knn-transfer.glsl ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoint-matches.glsl\"\nuniform sampler2D encodedMatches;\nuniform sampler2D encodedKthMatches;\nuniform int numberOfMatchesPerKeypoint;\nuniform int kthMatch;\nvoid main()\n{\nivec2 thread = threadLocation();\nivec2 matcherSize = textureSize(encodedMatches, 0);\nivec2 kthMatcherSize = textureSize(encodedKthMatches, 0);\nint rasterIndex = thread.y * matcherSize.x + thread.x;\nint matchIndex = rasterIndex / numberOfMatchesPerKeypoint;\nint matchCell = rasterIndex % numberOfMatchesPerKeypoint;\ncolor = threadPixel(encodedMatches);\nif(matchCell != kthMatch)\nreturn;\ncolor = encodeKeypointMatch(MATCH_NOT_FOUND);\nif(matchIndex >= kthMatcherSize.x * kthMatcherSize.y)\nreturn;\nivec2 pos = ivec2(matchIndex % kthMatcherSize.x, matchIndex / kthMatcherSize.x);\ncolor = texelFetch(encodedKthMatches, pos, 0);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/laplacian.glsl":
/*!**************************************************!*\
  !*** ./src/gpu/shaders/keypoints/laplacian.glsl ***!
  \**************************************************/
/***/ ((module) => {

module.exports = "@include \"pyramids.glsl\"\n@include \"float16.glsl\"\n@include \"filters.glsl\"\nuniform sampler2D corners;\nuniform sampler2D pyramid;\nuniform float lodStep;\nuniform float lodOffset;\nvoid main()\n{\nivec2 thread = threadLocation();\nvec4 pixel = threadPixel(corners);\nfloat lod = decodeLod(pixel.a);\nfloat lodMinus = max(0.0f, lod - lodStep + lodOffset);\nfloat lodPlus = min(float(PYRAMID_MAX_LEVELS - 1), lod + lodStep + lodOffset);\nfloat lapMinus = laplacian(pyramid, vec2(thread), lodMinus);\nfloat lapPlus = abs(lodPlus - lodMinus) < 1e-5 ? lapMinus : laplacian(pyramid, vec2(thread), lodPlus);\ncolor = encodePairOfFloat16(vec2(lapMinus, lapPlus));\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/lk.glsl":
/*!*******************************************!*\
  !*** ./src/gpu/shaders/keypoints/lk.glsl ***!
  \*******************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\n@include \"float16.glsl\"\nuniform sampler2D nextPyramid;\nuniform sampler2D prevPyramid;\nuniform sampler2D encodedFlow;\nuniform sampler2D prevKeypoints;\nuniform int level;\nuniform int depth;\nuniform int numberOfIterations;\nuniform float discardThreshold;\nuniform float epsilon;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#ifndef WINDOW_SIZE\n#error Undefined WINDOW_SIZE\n#endif\n#define NEXT_IMAGE 1\n#define PREV_IMAGE 0\nconst int WINDOW_RADIUS = (WINDOW_SIZE - 1) / 2;\nconst int WINDOW_SIZE_SQUARED = (WINDOW_SIZE) * (WINDOW_SIZE);\nconst int WINDOW_SIZE_PLUS = (WINDOW_SIZE) + 2;\nconst int WINDOW_SIZE_PLUS_SQUARED = WINDOW_SIZE_PLUS * WINDOW_SIZE_PLUS;\nconst int DBL_WINDOW_SIZE_PLUS_SQUARED = 2 * WINDOW_SIZE_PLUS_SQUARED;\nconst int WINDOW_RADIUS_PLUS = (WINDOW_SIZE_PLUS - 1) / 2;\nconst highp float FLT_SCALE = 9.5367431640625e-7;\nconst highp float FLT_EPSILON = 0.00000011920929f;\nint pixelBuffer[DBL_WINDOW_SIZE_PLUS_SQUARED];\n#define prevPixel(index) pixelBuffer[(index)]\n#define nextPixel(index) pixelBuffer[WINDOW_SIZE_PLUS_SQUARED + (index)]\n#define pixelIndex(i, j) (((j) + WINDOW_RADIUS_PLUS) * WINDOW_SIZE_PLUS + ((i) + WINDOW_RADIUS_PLUS))\nivec2 derivBuffer[WINDOW_SIZE_SQUARED];\n#define derivativesAt(x, y) derivBuffer[((y) + WINDOW_RADIUS) * WINDOW_SIZE + ((x) + WINDOW_RADIUS)]\nvoid readWindow(vec2 center, float lod)\n{\nconst int r = WINDOW_RADIUS;\nivec2 pyrBaseSize = textureSize(prevPyramid, 0);\nfloat pot = exp2(lod);\nivec2 offset; int idx;\n#define readPixelsAt(ox, oy) offset = ivec2((ox), (oy)); \\\nidx = pixelIndex(offset.x, offset.y); \\\nnextPixel(idx) = int(255.0f * pyrSubpixelAtExOffset(nextPyramid, center, lod, pot, offset, pyrBaseSize).g); \\\nprevPixel(idx) = int(255.0f * pyrSubpixelAtExOffset(prevPyramid, center, lod, pot, offset, pyrBaseSize).g)\nfor(int j = 0; j < WINDOW_SIZE; j++) {\nfor(int i = 0; i < WINDOW_SIZE; i++) {\nreadPixelsAt(i-r, j-r);\n}\n}\nint r1 = r+1;\nfor(int k = 0; k < WINDOW_SIZE; k++) {\nreadPixelsAt(-r1, k-r);\nreadPixelsAt( r1, k-r);\nreadPixelsAt(k-r,-r1);\nreadPixelsAt(k-r, r1);\n}\nreadPixelsAt(-r1,-r1);\nreadPixelsAt( r1,-r1);\nreadPixelsAt(-r1, r1);\nreadPixelsAt( r1, r1);\n}\nivec2 computeDerivatives(int imageCode, ivec2 offset)\n{\nconst mat3 dx = mat3(\n3, 0, -3,\n10, 0, -10,\n3, 0, -3\n);\nconst mat3 dy = mat3(\n3, 10, 3,\n0, 0, 0,\n-3, -10, -3\n);\nint indexOffset = imageCode * WINDOW_SIZE_PLUS_SQUARED;\nmat3 window = mat3(\npixelBuffer[indexOffset + pixelIndex(offset.x-1, offset.y-1)],\npixelBuffer[indexOffset + pixelIndex(offset.x+0, offset.y-1)],\npixelBuffer[indexOffset + pixelIndex(offset.x+1, offset.y-1)],\npixelBuffer[indexOffset + pixelIndex(offset.x-1, offset.y+0)],\n0.0f,\npixelBuffer[indexOffset + pixelIndex(offset.x+1, offset.y+0)],\npixelBuffer[indexOffset + pixelIndex(offset.x-1, offset.y+1)],\npixelBuffer[indexOffset + pixelIndex(offset.x+0, offset.y+1)],\npixelBuffer[indexOffset + pixelIndex(offset.x+1, offset.y+1)]\n);\nmat3 fx = matrixCompMult(dx, window);\nmat3 fy = matrixCompMult(dy, window);\nconst vec3 ones = vec3(1.0f);\nreturn ivec2(\ndot(fx[0], ones) + dot(fx[1], ones) + dot(fx[2], ones),\ndot(fy[0], ones) + dot(fy[1], ones) + dot(fy[2], ones)\n);\n}\nint readBufferedPixel(int imageCode, ivec2 offset)\n{\nconst int r = WINDOW_RADIUS;\noffset = clamp(offset, -r, r);\nint indexOffset = imageCode * WINDOW_SIZE_PLUS_SQUARED;\nreturn pixelBuffer[indexOffset + pixelIndex(offset.x, offset.y)];\n}\nint readBufferedSubpixel(int imageCode, vec2 offset)\n{\nivec2 p = ivec2(floor(offset));\nvec2 frc = fract(offset);\nvec2 ifrc = vec2(1.0f) - frc;\nvec4 pix = vec4(\nreadBufferedPixel(imageCode, p),\nreadBufferedPixel(imageCode, p + ivec2(1,0)),\nreadBufferedPixel(imageCode, p + ivec2(0,1)),\nreadBufferedPixel(imageCode, p + ivec2(1,1))\n);\nvec4 sub = vec4(\nifrc.x * ifrc.y,\nfrc.x * ifrc.y,\nifrc.x * frc.y,\nfrc.x * frc.y\n);\nreturn int(0.5f + dot(sub*pix, vec4(1.0f)));\n}\nvec2 computeMismatch(vec2 pyrGuess, vec2 localGuess)\n{\nconst int r = WINDOW_RADIUS;\nint timeDerivative;\nivec2 mismatch = ivec2(0);\nint x, y, _x, _y;\nvec2 d = pyrGuess + localGuess;\n#define innerLoop() \\\nfor(_x = 0; _x < WINDOW_SIZE; _x++) { \\\nx = _x - r; y = _y - r; \\\ntimeDerivative = ( \\\nreadBufferedSubpixel(NEXT_IMAGE, vec2(x, y) + d) - \\\nreadBufferedPixel(PREV_IMAGE, ivec2(x, y)) \\\n); \\\nmismatch += derivativesAt(x, y) * timeDerivative; \\\n}\n@unroll\nfor(_y = 0; _y < WINDOW_SIZE; _y++) {\ninnerLoop();\n}\nreturn vec2(mismatch) * FLT_SCALE;\n}\nbool isInsideImage(vec2 position)\n{\nvec2 imageSize = vec2(textureSize(nextPyramid, 0));\nvec2 border = vec2(WINDOW_SIZE);\nreturn all(bvec4(\ngreaterThanEqual(position, border),\nlessThan(position, imageSize - border)\n));\n}\nvoid main()\n{\nvec4 pixel = threadPixel(encodedFlow);\nivec2 thread = threadLocation();\nfloat windowArea = float(WINDOW_SIZE * WINDOW_SIZE);\nconst int r = WINDOW_RADIUS;\nint keypointIndex = thread.x + thread.y * outputSize().x;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);\nKeypoint keypoint = decodeKeypoint(prevKeypoints, encoderLength, address);\ncolor = encodeNullPairOfFloat16();\nif(isNullKeypoint(keypoint))\nreturn;\ncolor = encodeDiscardedPairOfFloat16();\nif(isBadKeypoint(keypoint))\nreturn;\nvec2 pyrGuess = (level < depth - 1) ? decodePairOfFloat16(pixel) : vec2(0.0f);\npyrGuess *= 2.0f;\nreadWindow(keypoint.position, float(level));\nivec2 derivatives;\nivec3 harris3i = ivec3(0);\nfor(int j = 0; j < WINDOW_SIZE; j++) {\nfor(int i = 0; i < WINDOW_SIZE; i++) {\nderivatives = computeDerivatives(PREV_IMAGE, ivec2(i-r, j-r));\nharris3i += ivec3(\nderivatives.x * derivatives.x,\nderivatives.x * derivatives.y,\nderivatives.y * derivatives.y\n);\nderivativesAt(i-r, j-r) = derivatives;\n}\n}\nhighp vec3 harris = vec3(harris3i) * FLT_SCALE;\nhighp mat2 invHarris = mat2(harris.z, -harris.y, -harris.y, harris.x);\nhighp float det = harris.x * harris.z - harris.y * harris.y;\nhighp float invDet = abs(det) >= FLT_EPSILON ? 1.0f / det : 0.0f;\nhighp float minEigenvalue = 0.5f * ((harris.x + harris.z) - sqrt(\n(harris.x - harris.z) * (harris.x - harris.z) + 4.0f * (harris.y * harris.y)\n));\nint niceNumbers = int(abs(det) >= FLT_EPSILON && minEigenvalue >= discardThreshold * windowArea);\nbool goodKeypoint = (level > 0) || (niceNumbers != 0);\nhighp float eps2 = epsilon * epsilon;\nhighp vec2 mismatch, delta, localGuess = vec2(0.0f);\nfor(int k = 0; k < numberOfIterations; k++) {\nmismatch = niceNumbers != 0 ? computeMismatch(pyrGuess, localGuess) : vec2(0.0f);\ndelta = mismatch * invHarris * invDet;\nniceNumbers *= int(eps2 <= dot(delta, delta));\nlocalGuess += float(niceNumbers) * delta;\n}\nvec2 opticalFlow = pyrGuess + localGuess;\nbool mustDiscard = (level == 0) && any(bvec2(\n!goodKeypoint,\n!isInsideImage(keypoint.position + opticalFlow)\n));\ncolor = !mustDiscard ? encodePairOfFloat16(opticalFlow) : encodeDiscardedPairOfFloat16();\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/lookup-of-locations.glsl":
/*!************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/lookup-of-locations.glsl ***!
  \************************************************************/
/***/ ((module) => {

module.exports = "#if @FS_USE_CUSTOM_PRECISION@\nprecision mediump int;\nprecision mediump float;\n#endif\n#if !defined(STAGE)\n#error Undefined STAGE\n#elif STAGE == 1\n@include \"float16.glsl\"\nuniform sampler2D corners;\n#elif STAGE < 1\nuniform mediump usampler2D lookupTable;\n#else\n#define SKIP_TEXTURE_READS 1\n#define DENSITY_FACTOR 0.10\nuniform mediump usampler2D lookupTable;\nuniform int blockSize;\nuniform int width;\nuniform int height;\nin vec2 v_topLeft, v_top, v_topRight,\nv_left, v_center, v_right,\nv_bottomLeft, v_bottom, v_bottomRight;\n#endif\nconst uvec2 NULL_ELEMENT = uvec2(0xFFFFu);\nvoid main()\n{\n#if STAGE == 1\nuvec2 outSize = uvec2(outputSize());\nuvec2 thread = uvec2(threadLocation());\nuvec2 size = uvec2(textureSize(corners, 0));\nuint location = thread.y * outSize.x + thread.x;\nivec2 pos = ivec2(location % size.x, location / size.x);\nvec4 pixel = location < size.x * size.y ? texelFetch(corners, pos, 0) : vec4(0.0f);\nbool isCorner = !isEncodedFloat16Zero(pixel.rb);\ncolor = isCorner ? uvec4(uvec2(pos), 1u, 0u) : uvec4(NULL_ELEMENT, 0u, 0u);\n#elif STAGE > 1\nint dblBlockSize = 2 * blockSize;\nivec2 thread = threadLocation();\nivec2 offset = thread % dblBlockSize;\nivec2 delta = thread - offset;\n#if SKIP_TEXTURE_READS\nif(blockSize >= 8) {\nuint sb = texture(lookupTable, texCoord).z;\nfloat p = max((float(sb) / float(blockSize)) / float(blockSize), DENSITY_FACTOR);\nfloat rowthr = float(dblBlockSize) * p + 3.0f * sqrt(p * (1.0f - p));\ncolor = uvec4(NULL_ELEMENT, 4u * sb, 0u);\nif(offset.y >= max(1, int(ceil(rowthr))))\nreturn;\n}\n#endif\n#define deltaCenter ivec2(0,0)\n#define deltaTop ivec2(0,-blockSize)\n#define deltaTopRight ivec2(blockSize,-blockSize)\n#define deltaRight ivec2(blockSize,0)\n#define deltaBottomRight ivec2(blockSize,blockSize)\n#define deltaBottom ivec2(0,blockSize)\n#define deltaBottomLeft ivec2(-blockSize,blockSize)\n#define deltaLeft ivec2(-blockSize,0)\n#define deltaTopLeft ivec2(-blockSize,-blockSize)\nivec2 boundary = ivec2(width - 1, height - 1) / blockSize;\nivec2 bottomRightPos = thread + deltaBottomRight;\nuvec2 valid = uvec2(\nbottomRightPos.x < width  || bottomRightPos.x / blockSize == boundary.x,\nbottomRightPos.y < height || bottomRightPos.y / blockSize == boundary.y\n);\nuvec4 mask[4] = uvec4[4](\nuvec4(1u, valid.x, valid.y, valid.x * valid.y),\nuvec4(1u, 1u, valid.y, valid.y),\nuvec4(1u, valid.x, 1u, valid.x),\nuvec4(1u)\n);\n#if SKIP_TEXTURE_READS\n#define calcSb(delta) texelFetch(lookupTable, blockSize * ((thread + (delta)) / blockSize), 0).z\nuint center = calcSb(deltaCenter);\nuint top = calcSb(deltaTop);\nuint topRight = calcSb(deltaTopRight);\nuint right = calcSb(deltaRight);\nuint bottomRight = calcSb(deltaBottomRight);\nuint bottom = calcSb(deltaBottom);\nuint bottomLeft = calcSb(deltaBottomLeft);\nuint left = calcSb(deltaLeft);\nuint topLeft = calcSb(deltaTopLeft);\n#else\n#define calcSb(pos) texture(lookupTable, (pos)).z\nuint center = calcSb(v_center);\nuint top = calcSb(v_top);\nuint topRight = calcSb(v_topRight);\nuint right = calcSb(v_right);\nuint bottomRight = calcSb(v_bottomRight);\nuint bottom = calcSb(v_bottom);\nuint bottomLeft = calcSb(v_bottomLeft);\nuint left = calcSb(v_left);\nuint topLeft = calcSb(v_topLeft);\n#endif\nuvec4 sums[4] = uvec4[4](\nuvec4(center, right, bottom, bottomRight),\nuvec4(left, center, bottomLeft, bottom),\nuvec4(top, topRight, center, right),\nuvec4(topLeft, top, left, center)\n);\nivec2 cmp = ivec2(greaterThanEqual(offset, ivec2(blockSize)));\nint option = 2 * cmp.y + cmp.x;\nuvec4 cdef = sums[option] * mask[option];\nuint c2b = cdef.x, d2b = cdef.y, e2b = cdef.z, f2b = cdef.w;\nuint sb = center;\nuint s2b = c2b + d2b + e2b + f2b;\ns2b = s2b < sb ? 0xFFFFu : min(0xFFFFu, s2b);\nuint w2b = uint(min(dblBlockSize, width - delta.x));\nuvec2 uoffset = uvec2(offset);\nuint ceiling = s2b >= uoffset.x ? (s2b - uoffset.x) / w2b + uint((s2b - uoffset.x) % w2b > 0u) : 0u;\ncolor = uvec4(NULL_ELEMENT, s2b, 0u);\nif(uoffset.y >= ceiling)\nreturn;\nuint i2b = uoffset.y * w2b + uoffset.x;\nuint j2b = i2b >= c2b ? i2b - c2b : 0u;\nuint k2b = j2b >= d2b ? j2b - d2b : 0u;\nuint l2b = k2b >= e2b ? k2b - e2b : 0u;\nuint wl = uint(min(blockSize, width - delta.x));\nuint wr = uint(min(blockSize, width - delta.x - blockSize));\nivec2 magicOffset = (\n(i2b < c2b) ? ivec2(i2b % wl, i2b / wl) : (\n(j2b < d2b) ? ivec2(j2b % wr, j2b / wr) + ivec2(blockSize, 0) : (\n(k2b < e2b) ? ivec2(k2b % wl, k2b / wl) + ivec2(0, blockSize) : (\n(l2b < f2b) ? ivec2(l2b % wr, l2b / wr) + ivec2(blockSize) : ivec2(0)\n))));\nuvec2 a2b = texelFetch(lookupTable, delta + magicOffset, 0).xy;\ncolor = uvec4(a2b, s2b, 0u);\n#else\nuvec4 pix = texture(lookupTable, texCoord);\ncolor = all(equal(pix.xy, NULL_ELEMENT)) ? vec4(0,1,1,1) : vec4(1,0,0,1);\n#endif\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/lookup-of-locations.vs.glsl":
/*!***************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/lookup-of-locations.vs.glsl ***!
  \***************************************************************/
/***/ ((module) => {

module.exports = "#if !defined(STAGE) || STAGE < 1\n#error Invalid STAGE\n#else\nuniform mediump int blockSize;\nout vec2 v_topLeft, v_top, v_topRight,\nv_left, v_center, v_right,\nv_bottomLeft, v_bottom, v_bottomRight;\nvoid vsmain()\n{\nfloat b = float(blockSize);\n#define V(x,y) (texCoord + (vec2((x),(y)) * b) / texSize)\nv_topLeft = V(-1,-1); v_top = V(0,-1); v_topRight = V(1,-1);\nv_left = V(-1,0); v_center = V(0,0); v_right = V(1,0);\nv_bottomLeft = V(-1,1); v_bottom = V(0,1); v_bottomRight = V(1,1);\n}\n#endif"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/lsh-knn.glsl":
/*!************************************************!*\
  !*** ./src/gpu/shaders/keypoints/lsh-knn.glsl ***!
  \************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\n@include \"keypoint-matches.glsl\"\n@include \"keypoint-descriptors.glsl\"\nuniform sampler2D candidates;\nuniform sampler2D filters;\nuniform int matcherLength;\nuniform sampler2D tables;\nuniform sampler2D descriptorDB;\nuniform int tableIndex;\nuniform int bucketCapacity;\nuniform int bucketsPerTable;\nuniform int tablesStride;\nuniform int descriptorDBStride;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#if HASH_SIZE > SEQUENCE_MAXLEN\n#error LSH: invalid HASH_SIZE\n#elif SEQUENCE_COUNT * SEQUENCE_MAXLEN * 4 > 16384\n#error LSH: sequences are too large!\n#elif (SEQUENCE_COUNT * SEQUENCE_MAXLEN) % 4 > 0\n#error LSH: sequences of invalid size!\n#endif\nlayout(std140) uniform LSHSequences\n{\nuvec4 sequences[(SEQUENCE_COUNT * SEQUENCE_MAXLEN) / 4];\n};\n#if HASH_SIZE == 10\nconst int SWAP_COUNT[3] = int[3](1, 11, 56);\nconst int[56] SWAP = int[56](0,1,2,4,8,16,32,64,128,256,512,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768);\n#elif HASH_SIZE == 11\nconst int SWAP_COUNT[3] = int[3](1, 12, 67);\nconst int[67] SWAP = int[67](0,1,2,4,8,16,32,64,128,256,512,1024,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536);\n#elif HASH_SIZE == 12\nconst int SWAP_COUNT[3] = int[3](1, 13, 79);\nconst int[79] SWAP = int[79](0,1,2,4,8,16,32,64,128,256,512,1024,2048,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072);\n#elif HASH_SIZE == 13\nconst int SWAP_COUNT[3] = int[3](1, 14, 92);\nconst int[92] SWAP = int[92](0,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072,4097,4098,4100,4104,4112,4128,4160,4224,4352,4608,5120,6144);\n#elif HASH_SIZE == 14\nconst int SWAP_COUNT[3] = int[3](1, 15, 106);\nconst int[106] SWAP = int[106](0,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072,4097,4098,4100,4104,4112,4128,4160,4224,4352,4608,5120,6144,8193,8194,8196,8200,8208,8224,8256,8320,8448,8704,9216,10240,12288);\n#elif HASH_SIZE == 15\nconst int SWAP_COUNT[3] = int[3](1, 16, 121);\nconst int[121] SWAP = int[121](0,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072,4097,4098,4100,4104,4112,4128,4160,4224,4352,4608,5120,6144,8193,8194,8196,8200,8208,8224,8256,8320,8448,8704,9216,10240,12288,16385,16386,16388,16392,16400,16416,16448,16512,16640,16896,17408,18432,20480,24576);\n#elif HASH_SIZE == 16\nconst int SWAP_COUNT[3] = int[3](1, 17, 137);\nconst int[137] SWAP = int[137](0,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072,4097,4098,4100,4104,4112,4128,4160,4224,4352,4608,5120,6144,8193,8194,8196,8200,8208,8224,8256,8320,8448,8704,9216,10240,12288,16385,16386,16388,16392,16400,16416,16448,16512,16640,16896,17408,18432,20480,24576,32769,32770,32772,32776,32784,32800,32832,32896,33024,33280,33792,34816,36864,40960,49152);\n#elif HASH_SIZE == 17\nconst int SWAP_COUNT[3] = int[3](1, 18, 154);\nconst int[154] SWAP = int[154](0,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072,4097,4098,4100,4104,4112,4128,4160,4224,4352,4608,5120,6144,8193,8194,8196,8200,8208,8224,8256,8320,8448,8704,9216,10240,12288,16385,16386,16388,16392,16400,16416,16448,16512,16640,16896,17408,18432,20480,24576,32769,32770,32772,32776,32784,32800,32832,32896,33024,33280,33792,34816,36864,40960,49152,65537,65538,65540,65544,65552,65568,65600,65664,65792,66048,66560,67584,69632,73728,81920,98304);\n#elif HASH_SIZE == 18\nconst int SWAP_COUNT[3] = int[3](1, 19, 172);\nconst int[172] SWAP = int[172](0,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072,4097,4098,4100,4104,4112,4128,4160,4224,4352,4608,5120,6144,8193,8194,8196,8200,8208,8224,8256,8320,8448,8704,9216,10240,12288,16385,16386,16388,16392,16400,16416,16448,16512,16640,16896,17408,18432,20480,24576,32769,32770,32772,32776,32784,32800,32832,32896,33024,33280,33792,34816,36864,40960,49152,65537,65538,65540,65544,65552,65568,65600,65664,65792,66048,66560,67584,69632,73728,81920,98304,131073,131074,131076,131080,131088,131104,131136,131200,131328,131584,132096,133120,135168,139264,147456,163840,196608);\n#elif HASH_SIZE == 19\nconst int SWAP_COUNT[3] = int[3](1, 20, 191);\nconst int[191] SWAP = int[191](0,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072,262144,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072,4097,4098,4100,4104,4112,4128,4160,4224,4352,4608,5120,6144,8193,8194,8196,8200,8208,8224,8256,8320,8448,8704,9216,10240,12288,16385,16386,16388,16392,16400,16416,16448,16512,16640,16896,17408,18432,20480,24576,32769,32770,32772,32776,32784,32800,32832,32896,33024,33280,33792,34816,36864,40960,49152,65537,65538,65540,65544,65552,65568,65600,65664,65792,66048,66560,67584,69632,73728,81920,98304,131073,131074,131076,131080,131088,131104,131136,131200,131328,131584,132096,133120,135168,139264,147456,163840,196608,262145,262146,262148,262152,262160,262176,262208,262272,262400,262656,263168,264192,266240,270336,278528,294912,327680,393216);\n#elif HASH_SIZE == 20\nconst int SWAP_COUNT[3] = int[3](1, 21, 211);\nconst int[211] SWAP = int[211](0,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072,262144,524288,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072,4097,4098,4100,4104,4112,4128,4160,4224,4352,4608,5120,6144,8193,8194,8196,8200,8208,8224,8256,8320,8448,8704,9216,10240,12288,16385,16386,16388,16392,16400,16416,16448,16512,16640,16896,17408,18432,20480,24576,32769,32770,32772,32776,32784,32800,32832,32896,33024,33280,33792,34816,36864,40960,49152,65537,65538,65540,65544,65552,65568,65600,65664,65792,66048,66560,67584,69632,73728,81920,98304,131073,131074,131076,131080,131088,131104,131136,131200,131328,131584,132096,133120,135168,139264,147456,163840,196608,262145,262146,262148,262152,262160,262176,262208,262272,262400,262656,263168,264192,266240,270336,278528,294912,327680,393216,524289,524290,524292,524296,524304,524320,524352,524416,524544,524800,525312,526336,528384,532480,540672,557056,589824,655360,786432);\n#else\n#error Invalid HASH_SIZE\n#endif\n#if LEVEL < 0 || LEVEL > 2\n#error Invalid LEVEL\n#endif\nconst uint END_OF_LIST = 0xFFFFFFFFu;\nconst int NUMBER_OF_HASHES = SWAP_COUNT[LEVEL];\nuint sequenceElement(int sequenceIndex, int elementIndex)\n{\nint offset = (SEQUENCE_MAXLEN) * sequenceIndex + elementIndex;\nuvec4 tuple = sequences[offset / 4];\nreturn tuple[offset & 3];\n}\nint descriptorHash(uint[DESCRIPTOR_SIZE] descriptor, int sequenceIndex)\n{\nuint bit, b, m;\nint hash = 0;\n@unroll\nfor(int i = 0; i < HASH_SIZE; i++) {\nbit = sequenceElement(sequenceIndex, i);\nb = bit >> 3u;\nm = 1u << (bit & 7u);\nhash = (hash << 1) | int((descriptor[b] & m) != 0u);\n}\nreturn hash;\n}\n#define readTableData(tables, tablesStride, rasterIndex) decodeUint32(texelFetch((tables), ivec2((rasterIndex) % (tablesStride), (rasterIndex) / (tablesStride)), 0))\nvoid main()\n{\nivec2 thread = threadLocation();\nint keypointIndex = thread.x + thread.y * matcherLength;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);\ncolor = encodeKeypointMatch(MATCH_NOT_FOUND);\nif(isBadKeypoint(keypoint))\nreturn;\nKeypointMatch candidate = decodeKeypointMatch(threadPixel(candidates));\nKeypointMatch mfilter = decodeKeypointMatch(threadPixel(filters));\nuint[DESCRIPTOR_SIZE] candidateDescriptor;\nuint[DESCRIPTOR_SIZE] descriptor = readKeypointDescriptor(encodedKeypoints, descriptorSize, extraSize, encoderLength, address);\nint hash0 = descriptorHash(descriptor, tableIndex);\nfor(int h = 0; h < NUMBER_OF_HASHES; h++) {\nint hash = hash0 ^ SWAP[h];\nint tableAddress = tableIndex * bucketsPerTable * bucketCapacity;\nint bucketAddress = tableAddress + hash * bucketCapacity;\nbool validEntry = true;\nfor(int b = 0; b < bucketCapacity; b++) {\nint entryAddress = bucketAddress + b;\nuint entry = validEntry ? readTableData(tables, tablesStride, entryAddress) : END_OF_LIST;\nvalidEntry = (validEntry && entry != END_OF_LIST);\nint candidateIndex = int(entry);\ncandidateDescriptor = readKeypointDescriptorFromDB(descriptorDB, descriptorDBStride, validEntry ? candidateIndex : -1);\nint descriptorDistance = distanceBetweenKeypointDescriptors(descriptor, candidateDescriptor);\nKeypointMatch match = KeypointMatch(candidateIndex, descriptorDistance);\nbool betterThanCandidate = (match.dist < candidate.dist) || (match.dist == candidate.dist && match.index > candidate.index);\nbool worseThanFilter = (match.dist > mfilter.dist) || (match.dist == mfilter.dist && match.index < mfilter.index);\nbool nicerMatch = (validEntry && betterThanCandidate && worseThanFilter);\nivec2 v = nicerMatch ? ivec2(match.index, match.dist) : ivec2(candidate.index, candidate.dist);\ncandidate = KeypointMatch(v.x, v.y);\n}\n}\ncolor = encodeKeypointMatch(candidate);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/mix-keypoints.glsl":
/*!******************************************************!*\
  !*** ./src/gpu/shaders/keypoints/mix-keypoints.glsl ***!
  \******************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\n@include \"int32.glsl\"\n#if !defined(STAGE)\n#error Undefined STAGE\n#elif STAGE == 1\nuniform sampler2D encodedKeypointsA;\nuniform sampler2D encodedKeypointsB;\nuniform int encoderLengthA;\nuniform int encoderLengthB;\nuniform int encoderCapacityA;\nuniform int encoderCapacityB;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#elif STAGE == 2\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nuniform int maxKeypoints;\n#elif STAGE == 3\nuniform sampler2D array;\nuniform int blockSize;\n#elif STAGE == 4\nuniform sampler2D array;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#elif STAGE == 5\nuniform sampler2D array;\n#else\n#error Invalid STAGE\n#endif\n#define NULL_KEYPOINT_INDEX 0xFFFF\nconst highp uint UNIT = 0x10000u;\nvoid main()\n{\n#if STAGE == 1\nivec2 thread = threadLocation();\nKeypointAddress addr = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint keypointIndex = findKeypointIndex(addr, descriptorSize, extraSize);\nint newKeypointIndex = keypointIndex < encoderCapacityA ? keypointIndex : keypointIndex - encoderCapacityA;\ncolor = encodeNullKeypoint();\nif(newKeypointIndex >= max(encoderCapacityA, encoderCapacityB))\nreturn;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\naddr = KeypointAddress(newKeypointIndex * pixelsPerKeypoint, addr.offset);\nvec4 dataA = readKeypointData(encodedKeypointsA, encoderLengthA, addr);\nvec4 dataB = readKeypointData(encodedKeypointsB, encoderLengthB, addr);\ncolor = keypointIndex < encoderCapacityA ? dataA : dataB;\n#elif STAGE == 2\nivec2 thread = threadLocation();\nint keypointIndex = thread.y * outputSize().x + thread.x;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress addr = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, addr);\nbool isValid = !isNullKeypoint(keypoint) && keypointIndex < maxKeypoints;\nkeypointIndex = isValid ? keypointIndex : NULL_KEYPOINT_INDEX;\ncolor = encodeUint32(uint(keypointIndex & 0xFFFF) | (isValid ? UNIT : 0u));\n#elif STAGE == 3\nivec2 thread = threadLocation();\nivec2 size = outputSize();\nint arrayLength = size.x * size.y;\nint arrayIndex = thread.y * size.x + thread.x;\nint arrayIndexLeft = arrayIndex - blockSize;\nint arrayIndexRight = arrayIndex + blockSize;\nint mask = int(arrayIndexRight < arrayLength || arrayIndexRight / blockSize == (arrayLength - 1) / blockSize);\narrayIndexLeft = max(0, arrayIndexLeft);\narrayIndexRight = min(arrayLength - 1, arrayIndexRight);\n#define raster2pos(k) ivec2((k) % size.x, (k) / size.x)\nuvec3 entries32 = uvec3(\ndecodeUint32(threadPixel(array)),\ndecodeUint32(texelFetch(array, raster2pos(arrayIndexLeft), 0)),\ndecodeUint32(texelFetch(array, raster2pos(arrayIndexRight), 0))\n);\nivec3 sb = ivec3((entries32 >> 16u) & 0xFFFFu);\nsb.z *= mask;\nint dblBlockSize = 2 * blockSize;\nint offset = arrayIndex % dblBlockSize;\nint s2b = sb.x + (offset < blockSize ? sb.z : sb.y);\nint l2b = offset < blockSize ? sb.x : sb.y;\nuint keypointIndex = entries32.x & 0xFFFFu;\nuint shiftedS2b = uint(s2b) << 16u;\ncolor = encodeUint32(uint(NULL_KEYPOINT_INDEX) | shiftedS2b);\nif(offset >= s2b)\nreturn;\ncolor = encodeUint32(keypointIndex | shiftedS2b);\nif(offset < l2b)\nreturn;\nvec4 entry = texelFetch(array, raster2pos(arrayIndex + blockSize - l2b), 0);\nkeypointIndex = decodeUint32(entry) & 0xFFFFu;\ncolor = encodeUint32(keypointIndex | shiftedS2b);\n#elif STAGE == 4\nivec2 thread = threadLocation();\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress addr = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint keypointIndex = findKeypointIndex(addr, descriptorSize, extraSize);\n#define raster2pos(k) ivec2((k) % size.x, (k) / size.x)\nivec2 size = textureSize(array, 0);\nuint sortedPair = decodeUint32(texelFetch(array, raster2pos(keypointIndex), 0));\nint newKeypointIndex = int(sortedPair & 0xFFFFu);\ncolor = encodeNullKeypoint();\nif(newKeypointIndex == NULL_KEYPOINT_INDEX || keypointIndex >= size.x * size.y)\nreturn;\nKeypointAddress newAddr = KeypointAddress(newKeypointIndex * pixelsPerKeypoint, addr.offset);\ncolor = readKeypointData(encodedKeypoints, encoderLength, newAddr);\n#elif STAGE == 5\nuint val = decodeUint32(threadPixel(array));\ncolor = (val & 0xFFFFu) == uint(NULL_KEYPOINT_INDEX) ? vec4(0,1,1,1) : vec4(1,0,0,1);\n#endif\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/nonmax-scale.glsl":
/*!*****************************************************!*\
  !*** ./src/gpu/shaders/keypoints/nonmax-scale.glsl ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = "@include \"pyramids.glsl\"\n@include \"float16.glsl\"\n@include \"filters.glsl\"\n#if !defined(USE_LAPLACIAN)\n#error Undefined USE_LAPLACIAN\n#endif\nuniform sampler2D corners;\nuniform sampler2D pyramid;\nuniform float lodStep;\n#if USE_LAPLACIAN\nuniform sampler2D pyrLaplacian;\n#endif\nvoid main()\n{\nivec2 thread = threadLocation();\nvec4 pixel = threadPixel(corners);\nfloat score = decodeFloat16(pixel.rb);\nfloat myEncodedLod = pixel.a;\nfloat lod = decodeLod(myEncodedLod);\nfloat lodPlus = lod + lodStep;\nfloat lodMinus = lod - lodStep;\nfloat pot = exp2(lod);\nfloat potPlus = exp2(lodPlus);\nfloat potMinus = exp2(lodMinus);\ncolor = pixel;\nif(score == 0.0f)\nreturn;\n#define P(p,u,v) textureLod(corners, texCoord + (p) * vec2((u),(v)) / texSize, 0.0f)\nvec4 pix[18] = vec4[18](\n#define D(u,v) P(potMinus,(u),(v))\nD(-1,-1), D(0,-1), D(1,-1),\nD(-1,0), D(0,0), D(1,0),\nD(-1,1), D(0,1), D(1,1)\n,\n#define U(u,v) P(potPlus,(u),(v))\nU(-1,-1), U(0,-1), U(1,-1),\nU(-1,0), U(0,0), U(1,0),\nU(-1,1), U(0,1), U(1,1)\n);\nfloat scores[18] = float[18](\n#define C(j) decodeFloat16(pix[j].rb)\nC(0), C(1), C(2),\nC(3), C(4), C(5),\nC(6), C(7), C(8)\n,\nC(9), C(10), C(11),\nC(12), C(13), C(14),\nC(15), C(16), C(17)\n);\nfloat lods[18] = float[18](\n#define E(j) decodeLod(pix[j].a)\nE(0), E(1), E(2),\nE(3), E(4), E(5),\nE(6), E(7), E(8)\n,\nE(9), E(10), E(11),\nE(12), E(13), E(14),\nE(15), E(16), E(17)\n);\n#if USE_LAPLACIAN\n#define L(p,u,v) textureLod(pyrLaplacian, texCoord + (p) * vec2((u),(v)) / texSize, 0.0f)\nmat3 strengths[2] = mat3[2](mat3(\n#define Lm(u,v) abs(decodeFloat16(L(potMinus,(u),(v)).xy))\nLm(-1,-1), Lm(0,-1), Lm(1,-1),\nLm(-1,0), Lm(0,0), Lm(1,0),\nLm(-1,1), Lm(0,1), Lm(1,1)\n), mat3(\n#define Lp(u,v) abs(decodeFloat16(L(potPlus,(u),(v)).zw))\nLp(-1,-1), Lp(0,-1), Lp(1,-1),\nLp(-1,0), Lp(0,0), Lp(1,0),\nLp(-1,1), Lp(0,1), Lp(1,1)\n));\nfloat myStrength = abs(laplacian(pyramid, vec2(thread), lod));\n#else\n#define L(u,v) (((v)+1)*3 + ((u)+1))\nmat3 strengths[2] = mat3[2](mat3(\n#define Lm(u,v) scores[L((u),(v))]\nLm(-1,-1), Lm(0,-1), Lm(1,-1),\nLm(-1,0), Lm(0,0), Lm(1,0),\nLm(-1,1), Lm(0,1), Lm(1,1)\n), mat3(\n#define Lp(u,v) scores[9 + L((u),(v))]\nLp(-1,-1), Lp(0,-1), Lp(1,-1),\nLp(-1,0), Lp(0,0), Lp(1,0),\nLp(-1,1), Lp(0,1), Lp(1,1)\n));\nfloat myStrength = score;\n#endif\n#define B(j,lod) float(isSameLod(lods[j], (lod))) * float(scores[j] > 0.0f)\nmat3 nearLod[2] = mat3[2](mat3(\n#define Bm(j) B((j), lodMinus)\nBm(0), Bm(1), Bm(2),\nBm(3), Bm(4), Bm(5),\nBm(6), Bm(7), Bm(8)\n), mat3(\n#define Bp(j) B((j), lodPlus)\nBp(9), Bp(10), Bp(11),\nBp(12), Bp(13), Bp(14),\nBp(15), Bp(16), Bp(17)\n));\nmat3 upStrengths = matrixCompMult(strengths[1], nearLod[1]);\nmat3 downStrengths = matrixCompMult(strengths[0], nearLod[0]);\nvec3 maxUpStrength3 = max(upStrengths[0], max(upStrengths[1], upStrengths[2]));\nvec3 maxDownStrength3 = max(downStrengths[0], max(downStrengths[1], downStrengths[2]));\nvec3 maxStrength3 = max(maxUpStrength3, maxDownStrength3);\nfloat maxStrength = max(maxStrength3.x, max(maxStrength3.y, maxStrength3.z));\ncolor.rb = encodeFloat16(score * step(maxStrength, myStrength));\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/nonmax-space.glsl":
/*!*****************************************************!*\
  !*** ./src/gpu/shaders/keypoints/nonmax-space.glsl ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = "@include \"pyramids.glsl\"\n@include \"float16.glsl\"\nuniform sampler2D corners;\nvoid main()\n{\nivec2 thread = threadLocation();\nvec4 pixel = threadPixel(corners);\nfloat encodedLod = pixel.a;\nfloat score = decodeFloat16(pixel.rb);\nfloat lod = decodeLod(encodedLod);\nfloat pot = exp2(lod);\ncolor = pixel;\nif(score == 0.0f)\nreturn;\n#if 1\nvec2 gridSize = vec2(pot);\nvec2 gridLocation = floor(mod(texCoord * texSize, gridSize));\nvec2 gridDelta = gridLocation / gridSize - vec2(0.5f);\nfloat gridStep = 1.0f / pot;\nconst float adjustment = 1.25f;\ncolor.rb = encodeFloat16(0.0f);\nif(max(abs(gridDelta.x), abs(gridDelta.y)) > adjustment * gridStep)\nreturn;\n#endif\n#define P(x,y) textureLod(corners, texCoord + pot * vec2((x), (y)) / texSize, 0.0f)\nvec4 pix[9] = vec4[9](\nP(-1,-1), P(0,-1), P(1,-1),\nP(-1,0), pixel, P(1,0),\nP(-1,1), P(0,1), P(1,1)\n);\n#define S(j) decodeFloat16(pix[j].rb)\nmat3 scores = mat3(\nS(0), S(1), S(2),\nS(3), S(4), S(5),\nS(6), S(7), S(8)\n);\n#define B(j) float(isSameLod(decodeLod(pix[j].a), lod))\nmat3 sameLod = mat3(\nB(0), B(1), B(2),\nB(3), B(4), B(5),\nB(6), B(7), B(8)\n);\nmat3 sameLodScores = matrixCompMult(scores, sameLod);\nvec3 maxScore3 = max(sameLodScores[0], max(sameLodScores[1], sameLodScores[2]));\nfloat maxScore = max(maxScore3.x, max(maxScore3.y, maxScore3.z));\ncolor.rb = encodeFloat16(score * step(maxScore, score));\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/nonmax-suppression.glsl":
/*!***********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/nonmax-suppression.glsl ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = "@include \"pyramids.glsl\"\n@include \"float16.glsl\"\nuniform sampler2D image;\nuniform float lodStep;\n#if !defined(MULTISCALE)\n#error Must define MULTISCALE\n#elif MULTISCALE != 0\n#define LOD_STEP (lodStep)\n#define USE_MIDDLE_RING\n#else\n#define LOD_STEP (0.0f)\n#endif\n#define PIX(x,y) pixelAtShortOffset(image, ivec2((x),(y)))\n#define L2(v,i) bvec2(isSameEncodedLod(v[i].a, alphaMinus), isSameEncodedLod(v[i].a, alphaPlus))\n#define L3(v,i) bvec3(isSameEncodedLod(v[i].a, alpha), isSameEncodedLod(v[i].a, alphaMinus), isSameEncodedLod(v[i].a, alphaPlus))\n#define S3(v,i) decodeFloat16(v[i].rb) * float(any(L3(v,i)))\n#define S2(v,i) decodeFloat16(v[i].rb) * float(any(L2(v,i)))\n#define P(i) S3(p,i)\n#define Q(i) S2(q,i)\n#define R(i) S2(r,i)\nconst vec4 O = vec4(0.0f);\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nfloat lod = decodeLod(pixel.a);\nfloat score = decodeFloat16(pixel.rb);\ncolor = pixel;\nif(score == 0.0f)\nreturn;\nvec4 p[8] = vec4[8](\nPIX(0,1), PIX(1,1), PIX(1,0), PIX(1,-1),\nPIX(0,-1), PIX(-1,-1), PIX(-1,0), PIX(-1,1)\n);\n#ifdef USE_MIDDLE_RING\nvec4 q[16] = vec4[16](\nPIX(0,2), PIX(1,2), PIX(2,2), PIX(2,1),\nPIX(2,0), PIX(2,-1), PIX(2,-2), PIX(1,-2),\nPIX(0,-2), PIX(-1,-2), PIX(-2,-2), PIX(-2,-1),\nPIX(-2,0), PIX(-2,1), PIX(-2,2), PIX(-1,2)\n);\n#else\nvec4 q[16] = vec4[16](O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O);\n#endif\n#ifdef USE_OUTER_RING\nvec4 r[16] = vec4[16](\nPIX(0,3), PIX(1,3), PIX(3,1), PIX(3,0),\nPIX(3,-1), PIX(1,-3), PIX(0,-3), PIX(-1,-3),\nPIX(-3,-1), PIX(-3,0), PIX(-3,1), PIX(-1,3),\nPIX(0,4), PIX(4,0), PIX(0,-4), PIX(-4,0)\n);\n#else\nvec4 r[16] = vec4[16](O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O);\n#endif\nfloat alphaPlus = encodeLod(lod + LOD_STEP);\nfloat alphaMinus = encodeLod(lod - LOD_STEP);\nfloat alpha = encodeLod(lod);\nmat3 innerScore = mat3(\nP(0), P(1), P(2), P(3),\nP(4), P(5), P(6), P(7),\n0.0f);\nmat4 middleScore = mat4(\nQ(0), Q(1), Q(2), Q(3),\nQ(4), Q(5), Q(6), Q(7),\nQ(8), Q(9), Q(10), Q(11),\nQ(12), Q(13), Q(14), Q(15)\n);\nmat4 outerScore = mat4(\nR(0), R(1), R(2), R(3),\nR(4), R(5), R(6), R(7),\nR(8), R(9), R(10), R(11),\nR(12), R(13), R(14), R(15)\n);\nvec3 maxInnerScore3 = max(innerScore[0], max(innerScore[1], innerScore[2]));\nvec4 maxMiddleScore4 = max(max(middleScore[0], middleScore[1]), max(middleScore[2], middleScore[3]));\nvec4 maxOuterScore4 = max(max(outerScore[0], outerScore[1]), max(outerScore[2], outerScore[3]));\nfloat maxInnerScore = max(maxInnerScore3.x, max(maxInnerScore3.y, maxInnerScore3.z));\nfloat maxMiddleScore = max(max(maxMiddleScore4.x, maxMiddleScore4.y), max(maxMiddleScore4.z, maxMiddleScore4.w));\nfloat maxOuterScore = max(max(maxOuterScore4.x, maxOuterScore4.y), max(maxOuterScore4.z, maxOuterScore4.w));\nfloat maxScore = max(maxInnerScore, max(maxMiddleScore, maxOuterScore));\nfloat finalScore = step(maxScore, score) * score;\ncolor.rb = encodeFloat16(finalScore);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/orb-descriptor.glsl":
/*!*******************************************************!*\
  !*** ./src/gpu/shaders/keypoints/orb-descriptor.glsl ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D encodedCorners;\nuniform int encoderLength;\nuniform sampler2D image;\nuniform int extraSize;\nconst int descriptorSize = 32;\n#define P(a,b,c,d) ivec4((a),(b),(c),(d))\nconst ivec4 pat31[256] = ivec4[256](\nP(8,-3,9,5),\nP(4,2,7,-12),\nP(-11,9,-8,2),\nP(7,-12,12,-13),\nP(2,-13,2,12),\nP(1,-7,1,6),\nP(-2,-10,-2,-4),\nP(-13,-13,-11,-8),\nP(-13,-3,-12,-9),\nP(10,4,11,9),\nP(-13,-8,-8,-9),\nP(-11,7,-9,12),\nP(7,7,12,6),\nP(-4,-5,-3,0),\nP(-13,2,-12,-3),\nP(-9,0,-7,5),\nP(12,-6,12,-1),\nP(-3,6,-2,12),\nP(-6,-13,-4,-8),\nP(11,-13,12,-8),\nP(4,7,5,1),\nP(5,-3,10,-3),\nP(3,-7,6,12),\nP(-8,-7,-6,-2),\nP(-2,11,-1,-10),\nP(-13,12,-8,10),\nP(-7,3,-5,-3),\nP(-4,2,-3,7),\nP(-10,-12,-6,11),\nP(5,-12,6,-7),\nP(5,-6,7,-1),\nP(1,0,4,-5),\nP(9,11,11,-13),\nP(4,7,4,12),\nP(2,-1,4,4),\nP(-4,-12,-2,7),\nP(-8,-5,-7,-10),\nP(4,11,9,12),\nP(0,-8,1,-13),\nP(-13,-2,-8,2),\nP(-3,-2,-2,3),\nP(-6,9,-4,-9),\nP(8,12,10,7),\nP(0,9,1,3),\nP(7,-5,11,-10),\nP(-13,-6,-11,0),\nP(10,7,12,1),\nP(-6,-3,-6,12),\nP(10,-9,12,-4),\nP(-13,8,-8,-12),\nP(-13,0,-8,-4),\nP(3,3,7,8),\nP(5,7,10,-7),\nP(-1,7,1,-12),\nP(3,-10,5,6),\nP(2,-4,3,-10),\nP(-13,0,-13,5),\nP(-13,-7,-12,12),\nP(-13,3,-11,8),\nP(-7,12,-4,7),\nP(6,-10,12,8),\nP(-9,-1,-7,-6),\nP(-2,-5,0,12),\nP(-12,5,-7,5),\nP(3,-10,8,-13),\nP(-7,-7,-4,5),\nP(-3,-2,-1,-7),\nP(2,9,5,-11),\nP(-11,-13,-5,-13),\nP(-1,6,0,-1),\nP(5,-3,5,2),\nP(-4,-13,-4,12),\nP(-9,-6,-9,6),\nP(-12,-10,-8,-4),\nP(10,2,12,-3),\nP(7,12,12,12),\nP(-7,-13,-6,5),\nP(-4,9,-3,4),\nP(7,-1,12,2),\nP(-7,6,-5,1),\nP(-13,11,-12,5),\nP(-3,7,-2,-6),\nP(7,-8,12,-7),\nP(-13,-7,-11,-12),\nP(1,-3,12,12),\nP(2,-6,3,0),\nP(-4,3,-2,-13),\nP(-1,-13,1,9),\nP(7,1,8,-6),\nP(1,-1,3,12),\nP(9,1,12,6),\nP(-1,-9,-1,3),\nP(-13,-13,-10,5),\nP(7,7,10,12),\nP(12,-5,12,9),\nP(6,3,7,11),\nP(5,-13,6,10),\nP(2,-12,2,3),\nP(3,8,4,-6),\nP(2,6,12,-13),\nP(9,-12,10,3),\nP(-8,4,-7,9),\nP(-11,12,-4,-6),\nP(1,12,2,-8),\nP(6,-9,7,-4),\nP(2,3,3,-2),\nP(6,3,11,0),\nP(3,-3,8,-8),\nP(7,8,9,3),\nP(-11,-5,-6,-4),\nP(-10,11,-5,10),\nP(-5,-8,-3,12),\nP(-10,5,-9,0),\nP(8,-1,12,-6),\nP(4,-6,6,-11),\nP(-10,12,-8,7),\nP(4,-2,6,7),\nP(-2,0,-2,12),\nP(-5,-8,-5,2),\nP(7,-6,10,12),\nP(-9,-13,-8,-8),\nP(-5,-13,-5,-2),\nP(8,-8,9,-13),\nP(-9,-11,-9,0),\nP(1,-8,1,-2),\nP(7,-4,9,1),\nP(-2,1,-1,-4),\nP(11,-6,12,-11),\nP(-12,-9,-6,4),\nP(3,7,7,12),\nP(5,5,10,8),\nP(0,-4,2,8),\nP(-9,12,-5,-13),\nP(0,7,2,12),\nP(-1,2,1,7),\nP(5,11,7,-9),\nP(3,5,6,-8),\nP(-13,-4,-8,9),\nP(-5,9,-3,-3),\nP(-4,-7,-3,-12),\nP(6,5,8,0),\nP(-7,6,-6,12),\nP(-13,6,-5,-2),\nP(1,-10,3,10),\nP(4,1,8,-4),\nP(-2,-2,2,-13),\nP(2,-12,12,12),\nP(-2,-13,0,-6),\nP(4,1,9,3),\nP(-6,-10,-3,-5),\nP(-3,-13,-1,1),\nP(7,5,12,-11),\nP(4,-2,5,-7),\nP(-13,9,-9,-5),\nP(7,1,8,6),\nP(7,-8,7,6),\nP(-7,-4,-7,1),\nP(-8,11,-7,-8),\nP(-13,6,-12,-8),\nP(2,4,3,9),\nP(10,-5,12,3),\nP(-6,-5,-6,7),\nP(8,-3,9,-8),\nP(2,-12,2,8),\nP(-11,-2,-10,3),\nP(-12,-13,-7,-9),\nP(-11,0,-10,-5),\nP(5,-3,11,8),\nP(-2,-13,-1,12),\nP(-1,-8,0,9),\nP(-13,-11,-12,-5),\nP(-10,-2,-10,11),\nP(-3,9,-2,-13),\nP(2,-3,3,2),\nP(-9,-13,-4,0),\nP(-4,6,-3,-10),\nP(-4,12,-2,-7),\nP(-6,-11,-4,9),\nP(6,-3,6,11),\nP(-13,11,-5,5),\nP(11,11,12,6),\nP(7,-5,12,-2),\nP(-1,12,0,7),\nP(-4,-8,-3,-2),\nP(-7,1,-6,7),\nP(-13,-12,-8,-13),\nP(-7,-2,-6,-8),\nP(-8,5,-6,-9),\nP(-5,-1,-4,5),\nP(-13,7,-8,10),\nP(1,5,5,-13),\nP(1,0,10,-13),\nP(9,12,10,-1),\nP(5,-8,10,-9),\nP(-1,11,1,-13),\nP(-9,-3,-6,2),\nP(-1,-10,1,12),\nP(-13,1,-8,-10),\nP(8,-11,10,-6),\nP(2,-13,3,-6),\nP(7,-13,12,-9),\nP(-10,-10,-5,-7),\nP(-10,-8,-8,-13),\nP(4,-6,8,5),\nP(3,12,8,-13),\nP(-4,2,-3,-3),\nP(5,-13,10,-12),\nP(4,-13,5,-1),\nP(-9,9,-4,3),\nP(0,3,3,-9),\nP(-12,1,-6,1),\nP(3,2,4,-8),\nP(-10,-10,-10,9),\nP(8,-13,12,12),\nP(-8,-12,-6,-5),\nP(2,2,3,7),\nP(10,6,11,-8),\nP(6,8,8,-12),\nP(-7,10,-6,5),\nP(-3,-9,-3,9),\nP(-1,-13,-1,5),\nP(-3,-7,-3,4),\nP(-8,-2,-8,3),\nP(4,2,12,12),\nP(2,-5,3,11),\nP(6,-9,11,-13),\nP(3,-1,7,12),\nP(11,-1,12,4),\nP(-3,0,-3,6),\nP(4,-11,4,12),\nP(2,-4,2,1),\nP(-10,-6,-8,1),\nP(-13,7,-11,1),\nP(-13,12,-11,-13),\nP(6,0,11,-13),\nP(0,-1,1,4),\nP(-13,3,-9,-2),\nP(-9,8,-6,-3),\nP(-13,-6,-8,-2),\nP(5,-9,8,10),\nP(2,7,3,-9),\nP(-1,-6,-1,-1),\nP(9,5,11,-2),\nP(11,-3,12,-8),\nP(3,0,3,5),\nP(-1,4,0,10),\nP(3,-6,4,5),\nP(-13,0,-10,5),\nP(5,8,12,11),\nP(8,9,9,-6),\nP(7,-4,8,-12),\nP(-10,4,-10,9),\nP(7,3,12,4),\nP(9,-7,10,-2),\nP(7,0,12,-2),\nP(-1,-6,0,-11)\n);\nvoid getPair(int index, mat2 rot, out vec2 p, out vec2 q)\n{\nivec4 data = pat31[index];\nvec2 op = vec2(data.xy);\nvec2 oq = vec2(data.zw);\np = rot * op;\nq = rot * oq;\n}\nvoid main()\n{\nvec4 pixel = threadPixel(encodedCorners);\nivec2 thread = threadLocation();\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint descriptorCell = address.offset - sizeofEncodedKeypoint(0, extraSize) / 4;\ncolor = pixel;\nif(descriptorCell < 0)\nreturn;\nKeypoint keypoint = decodeKeypoint(encodedCorners, encoderLength, address);\nif(isBadKeypoint(keypoint))\nreturn;\nfloat degreesOrientation = round(360.0f + degrees(keypoint.orientation));\nfloat orientation = radians(degreesOrientation - mod(degreesOrientation, 12.0f));\nfloat kcos = cos(orientation);\nfloat ksin = sin(orientation);\nmat2 rot = mat2(kcos, ksin, -ksin, kcos);\nfloat pot = exp2(keypoint.lod);\nint patternStart = 32 * descriptorCell;\nuint test[4] = uint[4](0u, 0u, 0u, 0u);\nfor(int t = 0; t < 4; t++) {\nuint bits = 0u;\nvec2 p, q;\nvec4 a, b;\nint i = t * 8;\n@unroll\nfor(int j = 0; j < 8; j++) {\ngetPair(patternStart + i + j, rot, p, q);\na = texelFetch(image, ivec2(round(keypoint.position + pot * p)), 0);\nb = texelFetch(image, ivec2(round(keypoint.position + pot * q)), 0);\nbits |= uint(a.g < b.g) << j;\n}\ntest[t] = bits;\n}\ncolor = vec4(test[0], test[1], test[2], test[3]) / 255.0f;\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/orb-orientation.glsl":
/*!********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/orb-orientation.glsl ***!
  \********************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D image;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#define P(x,y) ivec2((x),(y))\nconst int diskPointCount[16] = int[16](0, 4, 12, 28, 48, 80, 112, 148, 196, 252, 316, 376, 440, 528, 612, 708);\nconst ivec2 diskPoint[708] = ivec2[708](\nP(0,-1),P(-1,0),P(1,0),P(0,1),\nP(-1,-1),P(1,-1),P(-1,1),P(1,1),P(0,-2),P(-2,0),P(2,0),P(0,2),\nP(-1,-2),P(1,-2),P(-2,-1),P(2,-1),P(-2,1),P(2,1),P(-1,2),P(1,2),P(-2,-2),P(2,-2),P(-2,2),P(2,2),P(0,-3),P(-3,0),P(3,0),P(0,3),\nP(-1,-3),P(1,-3),P(-3,-1),P(3,-1),P(-3,1),P(3,1),P(-1,3),P(1,3),P(-2,-3),P(2,-3),P(-3,-2),P(3,-2),P(-3,2),P(3,2),P(-2,3),P(2,3),P(0,-4),P(-4,0),P(4,0),P(0,4),\nP(-1,-4),P(1,-4),P(-4,-1),P(4,-1),P(-4,1),P(4,1),P(-1,4),P(1,4),P(-3,-3),P(3,-3),P(-3,3),P(3,3),P(-2,-4),P(2,-4),P(-4,-2),P(4,-2),P(-4,2),P(4,2),P(-2,4),P(2,4),P(0,-5),P(-3,-4),P(3,-4),P(-4,-3),P(4,-3),P(-5,0),P(5,0),P(-4,3),P(4,3),P(-3,4),P(3,4),P(0,5),\nP(-1,-5),P(1,-5),P(-5,-1),P(5,-1),P(-5,1),P(5,1),P(-1,5),P(1,5),P(-2,-5),P(2,-5),P(-5,-2),P(5,-2),P(-5,2),P(5,2),P(-2,5),P(2,5),P(-4,-4),P(4,-4),P(-4,4),P(4,4),P(-3,-5),P(3,-5),P(-5,-3),P(5,-3),P(-5,3),P(5,3),P(-3,5),P(3,5),P(0,-6),P(-6,0),P(6,0),P(0,6),\nP(-1,-6),P(1,-6),P(-6,-1),P(6,-1),P(-6,1),P(6,1),P(-1,6),P(1,6),P(-2,-6),P(2,-6),P(-6,-2),P(6,-2),P(-6,2),P(6,2),P(-2,6),P(2,6),P(-4,-5),P(4,-5),P(-5,-4),P(5,-4),P(-5,4),P(5,4),P(-4,5),P(4,5),P(-3,-6),P(3,-6),P(-6,-3),P(6,-3),P(-6,3),P(6,3),P(-3,6),P(3,6),P(0,-7),P(-7,0),P(7,0),P(0,7),\nP(-1,-7),P(1,-7),P(-5,-5),P(5,-5),P(-7,-1),P(7,-1),P(-7,1),P(7,1),P(-5,5),P(5,5),P(-1,7),P(1,7),P(-4,-6),P(4,-6),P(-6,-4),P(6,-4),P(-6,4),P(6,4),P(-4,6),P(4,6),P(-2,-7),P(2,-7),P(-7,-2),P(7,-2),P(-7,2),P(7,2),P(-2,7),P(2,7),P(-3,-7),P(3,-7),P(-7,-3),P(7,-3),P(-7,3),P(7,3),P(-3,7),P(3,7),P(-5,-6),P(5,-6),P(-6,-5),P(6,-5),P(-6,5),P(6,5),P(-5,6),P(5,6),P(0,-8),P(-8,0),P(8,0),P(0,8),\nP(-1,-8),P(1,-8),P(-4,-7),P(4,-7),P(-7,-4),P(7,-4),P(-8,-1),P(8,-1),P(-8,1),P(8,1),P(-7,4),P(7,4),P(-4,7),P(4,7),P(-1,8),P(1,8),P(-2,-8),P(2,-8),P(-8,-2),P(8,-2),P(-8,2),P(8,2),P(-2,8),P(2,8),P(-6,-6),P(6,-6),P(-6,6),P(6,6),P(-3,-8),P(3,-8),P(-8,-3),P(8,-3),P(-8,3),P(8,3),P(-3,8),P(3,8),P(-5,-7),P(5,-7),P(-7,-5),P(7,-5),P(-7,5),P(7,5),P(-5,7),P(5,7),P(-4,-8),P(4,-8),P(-8,-4),P(8,-4),P(-8,4),P(8,4),P(-4,8),P(4,8),P(0,-9),P(-9,0),P(9,0),P(0,9),\nP(-1,-9),P(1,-9),P(-9,-1),P(9,-1),P(-9,1),P(9,1),P(-1,9),P(1,9),P(-2,-9),P(2,-9),P(-6,-7),P(6,-7),P(-7,-6),P(7,-6),P(-9,-2),P(9,-2),P(-9,2),P(9,2),P(-7,6),P(7,6),P(-6,7),P(6,7),P(-2,9),P(2,9),P(-5,-8),P(5,-8),P(-8,-5),P(8,-5),P(-8,5),P(8,5),P(-5,8),P(5,8),P(-3,-9),P(3,-9),P(-9,-3),P(9,-3),P(-9,3),P(9,3),P(-3,9),P(3,9),P(-4,-9),P(4,-9),P(-9,-4),P(9,-4),P(-9,4),P(9,4),P(-4,9),P(4,9),P(-7,-7),P(7,-7),P(-7,7),P(7,7),P(0,-10),P(-6,-8),P(6,-8),P(-8,-6),P(8,-6),P(-10,0),P(10,0),P(-8,6),P(8,6),P(-6,8),P(6,8),P(0,10),\nP(-1,-10),P(1,-10),P(-10,-1),P(10,-1),P(-10,1),P(10,1),P(-1,10),P(1,10),P(-2,-10),P(2,-10),P(-10,-2),P(10,-2),P(-10,2),P(10,2),P(-2,10),P(2,10),P(-5,-9),P(5,-9),P(-9,-5),P(9,-5),P(-9,5),P(9,5),P(-5,9),P(5,9),P(-3,-10),P(3,-10),P(-10,-3),P(10,-3),P(-10,3),P(10,3),P(-3,10),P(3,10),P(-7,-8),P(7,-8),P(-8,-7),P(8,-7),P(-8,7),P(8,7),P(-7,8),P(7,8),P(-4,-10),P(4,-10),P(-10,-4),P(10,-4),P(-10,4),P(10,4),P(-4,10),P(4,10),P(-6,-9),P(6,-9),P(-9,-6),P(9,-6),P(-9,6),P(9,6),P(-6,9),P(6,9),P(0,-11),P(-11,0),P(11,0),P(0,11),\nP(-1,-11),P(1,-11),P(-11,-1),P(11,-1),P(-11,1),P(11,1),P(-1,11),P(1,11),P(-2,-11),P(2,-11),P(-5,-10),P(5,-10),P(-10,-5),P(10,-5),P(-11,-2),P(11,-2),P(-11,2),P(11,2),P(-10,5),P(10,5),P(-5,10),P(5,10),P(-2,11),P(2,11),P(-8,-8),P(8,-8),P(-8,8),P(8,8),P(-3,-11),P(3,-11),P(-7,-9),P(7,-9),P(-9,-7),P(9,-7),P(-11,-3),P(11,-3),P(-11,3),P(11,3),P(-9,7),P(9,7),P(-7,9),P(7,9),P(-3,11),P(3,11),P(-6,-10),P(6,-10),P(-10,-6),P(10,-6),P(-10,6),P(10,6),P(-6,10),P(6,10),P(-4,-11),P(4,-11),P(-11,-4),P(11,-4),P(-11,4),P(11,4),P(-4,11),P(4,11),P(0,-12),P(-12,0),P(12,0),P(0,12),\nP(-1,-12),P(1,-12),P(-8,-9),P(8,-9),P(-9,-8),P(9,-8),P(-12,-1),P(12,-1),P(-12,1),P(12,1),P(-9,8),P(9,8),P(-8,9),P(8,9),P(-1,12),P(1,12),P(-5,-11),P(5,-11),P(-11,-5),P(11,-5),P(-11,5),P(11,5),P(-5,11),P(5,11),P(-2,-12),P(2,-12),P(-12,-2),P(12,-2),P(-12,2),P(12,2),P(-2,12),P(2,12),P(-7,-10),P(7,-10),P(-10,-7),P(10,-7),P(-10,7),P(10,7),P(-7,10),P(7,10),P(-3,-12),P(3,-12),P(-12,-3),P(12,-3),P(-12,3),P(12,3),P(-3,12),P(3,12),P(-6,-11),P(6,-11),P(-11,-6),P(11,-6),P(-11,6),P(11,6),P(-6,11),P(6,11),P(-4,-12),P(4,-12),P(-12,-4),P(12,-4),P(-12,4),P(12,4),P(-4,12),P(4,12),P(-9,-9),P(9,-9),P(-9,9),P(9,9),P(-8,-10),P(8,-10),P(-10,-8),P(10,-8),P(-10,8),P(10,8),P(-8,10),P(8,10),P(0,-13),P(-5,-12),P(5,-12),P(-12,-5),P(12,-5),P(-13,0),P(13,0),P(-12,5),P(12,5),P(-5,12),P(5,12),P(0,13),\nP(-1,-13),P(1,-13),P(-7,-11),P(7,-11),P(-11,-7),P(11,-7),P(-13,-1),P(13,-1),P(-13,1),P(13,1),P(-11,7),P(11,7),P(-7,11),P(7,11),P(-1,13),P(1,13),P(-2,-13),P(2,-13),P(-13,-2),P(13,-2),P(-13,2),P(13,2),P(-2,13),P(2,13),P(-3,-13),P(3,-13),P(-13,-3),P(13,-3),P(-13,3),P(13,3),P(-3,13),P(3,13),P(-6,-12),P(6,-12),P(-12,-6),P(12,-6),P(-12,6),P(12,6),P(-6,12),P(6,12),P(-9,-10),P(9,-10),P(-10,-9),P(10,-9),P(-10,9),P(10,9),P(-9,10),P(9,10),P(-4,-13),P(4,-13),P(-8,-11),P(8,-11),P(-11,-8),P(11,-8),P(-13,-4),P(13,-4),P(-13,4),P(13,4),P(-11,8),P(11,8),P(-8,11),P(8,11),P(-4,13),P(4,13),P(-7,-12),P(7,-12),P(-12,-7),P(12,-7),P(-12,7),P(12,7),P(-7,12),P(7,12),P(-5,-13),P(5,-13),P(-13,-5),P(13,-5),P(-13,5),P(13,5),P(-5,13),P(5,13),P(0,-14),P(-14,0),P(14,0),P(0,14),\nP(-1,-14),P(1,-14),P(-14,-1),P(14,-1),P(-14,1),P(14,1),P(-1,14),P(1,14),P(-2,-14),P(2,-14),P(-10,-10),P(10,-10),P(-14,-2),P(14,-2),P(-14,2),P(14,2),P(-10,10),P(10,10),P(-2,14),P(2,14),P(-9,-11),P(9,-11),P(-11,-9),P(11,-9),P(-11,9),P(11,9),P(-9,11),P(9,11),P(-3,-14),P(3,-14),P(-6,-13),P(6,-13),P(-13,-6),P(13,-6),P(-14,-3),P(14,-3),P(-14,3),P(14,3),P(-13,6),P(13,6),P(-6,13),P(6,13),P(-3,14),P(3,14),P(-8,-12),P(8,-12),P(-12,-8),P(12,-8),P(-12,8),P(12,8),P(-8,12),P(8,12),P(-4,-14),P(4,-14),P(-14,-4),P(14,-4),P(-14,4),P(14,4),P(-4,14),P(4,14),P(-7,-13),P(7,-13),P(-13,-7),P(13,-7),P(-13,7),P(13,7),P(-7,13),P(7,13),P(-5,-14),P(5,-14),P(-10,-11),P(10,-11),P(-11,-10),P(11,-10),P(-14,-5),P(14,-5),P(-14,5),P(14,5),P(-11,10),P(11,10),P(-10,11),P(10,11),P(-5,14),P(5,14),P(0,-15),P(-9,-12),P(9,-12),P(-12,-9),P(12,-9),P(-15,0),P(15,0),P(-12,9),P(12,9),P(-9,12),P(9,12),P(0,15)\n);\nconst int DEFAULT_PATCH_RADIUS = 15;\nconst int MIN_PATCH_RADIUS = 2;\nvoid main()\n{\nvec4 pixel = threadPixel(encodedKeypoints);\nivec2 thread = threadLocation();\nint keypointIndex = thread.x + thread.y * outputSize().x;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);\nvec2 m = vec2(0.0f);\nfloat pot = exp2(keypoint.lod);\nvec2 imageSize = vec2(textureSize(image, 0));\nint scaledRadius = int(ceil(float(DEFAULT_PATCH_RADIUS) / pot));\nint radius = max(scaledRadius, MIN_PATCH_RADIUS);\nint count = diskPointCount[radius];\nfor(int j = 0; j < count; j++) {\nvec2 offset = vec2(diskPoint[j]);\nvec2 position = keypoint.position + round(pot * offset);\nvec4 patchPixel = texture(image, (position + vec2(0.5f)) / imageSize);\nm += offset * patchPixel.g;\n}\nfloat angle = fastAtan2(m.y, m.x);\nfloat encodedOrientation = encodeKeypointOrientation(angle);\ncolor = vec4(0.0f, encodedOrientation, 0.0f, 0.0f);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/refine-scale.glsl":
/*!*****************************************************!*\
  !*** ./src/gpu/shaders/keypoints/refine-scale.glsl ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\n@include \"filters.glsl\"\n#if !defined(METHOD)\n#error Undefined METHOD\n#endif\nuniform sampler2D pyramid;\nuniform float lodStep;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#if METHOD == 1\nuniform int threshold;\n#endif\nconst float eps = 1e-6;\nfloat cornerStrength(vec2 position, float lod)\n{\n#if METHOD == 0\nreturn laplacian(pyramid, position, lod);\n#elif METHOD == 1\nfloat pot = exp2(lod);\nfloat t = float(clamp(threshold, 0, 255)) / 255.0f;\n#define P(x,y) pyrPixelAtOffset(pyramid, lod, pot, ivec2((x),(y))).g\nmat4 mp = mat4(\nP(0,3),P(3,0),P(0,-3),P(-3,0),\nP(1,3),P(2,2),P(3,1),P(3,-1),\nP(2,-2),P(1,-3),P(-1,-3),P(-2,-2),\nP(-3,-1),P(-3,1),P(-2,2),P(-1,3)\n);\nfloat c = P(0,0);\nfloat ct = c + t, c_t = c - t;\nmat4 mct = mp - mat4(ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct);\nmat4 mc_t = mat4(c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t) - mp;\nconst vec4 zeros = vec4(0.0f), ones = vec4(1.0f);\nvec4 bs = max(mct[0], zeros), ds = max(mc_t[0], zeros);\nbs += max(mct[1], zeros);     ds += max(mc_t[1], zeros);\nbs += max(mct[2], zeros);     ds += max(mc_t[2], zeros);\nbs += max(mct[3], zeros);     ds += max(mc_t[3], zeros);\nreturn max(dot(bs, ones), dot(ds, ones)) / 16.0f;\n#else\n#error Invalid method\n#endif\n}\nvoid main()\n{\nvec4 pixel = threadPixel(encodedKeypoints);\nivec2 thread = threadLocation();\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\ncolor = pixel;\nif(address.offset != 1)\nreturn;\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);\nif(isBadKeypoint(keypoint))\nreturn;\nvec3 strength = vec3(\ncornerStrength(keypoint.position, max(0.0f, keypoint.lod - lodStep)),\ncornerStrength(keypoint.position, keypoint.lod),\ncornerStrength(keypoint.position, keypoint.lod + lodStep)\n);\nvec3 p = mat3(\n2, -3, 1,\n-4, 4, 0,\n2, -1, 0\n) * strength;\nfloat maxStrength = max(strength.x, max(strength.y, strength.z));\nvec3 diffStrength = abs(strength - vec3(maxStrength));\nvec3 strengthIndicators = vec3(lessThan(diffStrength, vec3(eps)));\nfloat maxPoint = min(1.0f, dot(vec3(0.0f, 0.5f, 1.0f), strengthIndicators));\nbool hasMax = p.x < -eps;\nfloat pmax = hasMax ? -0.5f * p.y / p.x : maxPoint;\nfloat alpha = abs(pmax - 0.5f) <= 0.5f ? pmax : maxPoint;\nfloat lodOffset = mix(-lodStep, lodStep, alpha);\nfloat lod = keypoint.lod + lodOffset;\ncolor.r = encodeLod(lod);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/score-findmax.glsl":
/*!******************************************************!*\
  !*** ./src/gpu/shaders/keypoints/score-findmax.glsl ***!
  \******************************************************/
/***/ ((module) => {

module.exports = "@include \"float16.glsl\"\nuniform sampler2D corners;\nuniform int iterationNumber;\nvoid main()\n{\nivec2 thread = threadLocation();\nivec2 bounds = outputSize();\nint jump = (1 << iterationNumber);\nint clusterLength = jump << 1;\nint clusterMask = clusterLength - 1;\nivec2 clusterPos = ivec2(thread >> (1 + iterationNumber)) << (1 + iterationNumber);\nivec2 next1 = clusterPos + ((thread - clusterPos + ivec2(jump, 0)) & clusterMask);\nivec2 next2 = clusterPos + ((thread - clusterPos + ivec2(0, jump)) & clusterMask);\nivec2 next3 = clusterPos + ((thread - clusterPos + ivec2(jump, jump)) & clusterMask);\nvec4 p0 = threadPixel(corners);\nvec4 p1 = texelFetch(corners, next1 % bounds, 0);\nvec4 p2 = texelFetch(corners, next2 % bounds, 0);\nvec4 p3 = texelFetch(corners, next3 % bounds, 0);\nfloat s0 = decodeFloat16(p0.rb);\nfloat s1 = decodeFloat16(p1.rb);\nfloat s2 = decodeFloat16(p2.rb);\nfloat s3 = decodeFloat16(p3.rb);\nbool b0 = s0 >= s1 && s0 >= s2 && s0 >= s3;\nbool b1 = s1 >= s0 && s1 >= s2 && s1 >= s3;\nbool b2 = s2 >= s0 && s2 >= s1 && s2 >= s3;\ncolor = vec4(0.0f);\ncolor.rb = b0 ? p0.rb : (\nb1 ? p1.rb : (\nb2 ? p2.rb : p3.rb\n)\n);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/shuffle.glsl":
/*!************************************************!*\
  !*** ./src/gpu/shaders/keypoints/shuffle.glsl ***!
  \************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#if PERMUTATION_MAXLEN % 4 > 0 || PERMUTATION_MAXLEN * 4 > 16384\n#error Invalid PERMUTATION_MAXLEN\n#endif\nlayout(std140) uniform Permutation\n{\nivec4 permutation[PERMUTATION_MAXLEN / 4];\n};\nint permutationElement(int index)\n{\nint base = index - (index % PERMUTATION_MAXLEN);\nint offset = index - base;\nivec4 tuple = permutation[offset / 4];\nint newOffset = tuple[offset & 3];\nreturn base + newOffset;\n}\nvoid main()\n{\nivec2 thread = threadLocation();\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress myAddress = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint myIndex = findKeypointIndex(myAddress, descriptorSize, extraSize);\nint otherIndex = permutationElement(myIndex);\nKeypointAddress otherAddress = KeypointAddress(otherIndex * pixelsPerKeypoint, myAddress.offset);\nKeypoint myKeypoint = decodeKeypoint(encodedKeypoints, encoderLength, myAddress);\nKeypoint otherKeypoint = decodeKeypoint(encodedKeypoints, encoderLength, otherAddress);\ncolor = readKeypointData(encodedKeypoints, encoderLength, otherAddress);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/sort-keypoints.glsl":
/*!*******************************************************!*\
  !*** ./src/gpu/shaders/keypoints/sort-keypoints.glsl ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\n#if !defined(STAGE)\n#error Undefined STAGE\n#elif STAGE == 1\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#elif STAGE == 2\nuniform sampler2D permutation;\nuniform int blockSize;\nuniform int dblLog2BlockSize;\n#elif STAGE == 3\nuniform sampler2D permutation;\nuniform int maxKeypoints;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\n#else\n#error Invalid STAGE\n#endif\nstruct PermutationElement\n{\nint keypointIndex;\nfloat score;\nbool valid;\n};\nvec4 encodePermutationElement(PermutationElement element)\n{\nconst vec2 ONES = vec2(1.0f);\nvec2 encodedScore = element.valid ? encodeFloat16(element.score) : ONES;\nvec2 encodedIndex = vec2(element.keypointIndex & 255, (element.keypointIndex >> 8) & 255) / 255.0f;\nreturn vec4(encodedIndex, encodedScore);\n}\nPermutationElement decodePermutationElement(vec4 pixel)\n{\nconst vec2 ONES = vec2(1.0f);\nPermutationElement element;\nelement.keypointIndex = int(pixel.r * 255.0f) | (int(pixel.g * 255.0f) << 8);\nelement.valid = !all(equal(pixel.ba, ONES));\nelement.score = element.valid ? decodeFloat16(pixel.ba) : -1.0f;\nreturn element;\n}\nPermutationElement readPermutationElement(sampler2D permutation, int elementIndex, int stride, int height)\n{\nconst vec4 INVALID_PIXEL = vec4(1.0f);\nivec2 pos = ivec2(elementIndex % stride, elementIndex / stride);\nvec4 pixel = pos.y < height ? pixelAt(permutation, pos) : INVALID_PIXEL;\nreturn decodePermutationElement(pixel);\n}\n#if STAGE == 2\nPermutationElement selectKth(sampler2D permutation, int k, int la, int ra, int lb, int rb)\n{\nfloat scoreA, scoreB;\nint ha, hb, ma, mb;\nbool discard1stHalf, altb;\nbool locked = false;\nint tmp, result = 0;\nint stride = outputSize().x;\nint height = outputSize().y;\nfor(int i = 0; i < dblLog2BlockSize; i++) {\ntmp = (lb > rb && !locked) ? (la+k) : result;\nresult = (la > ra && !locked) ? (lb+k) : tmp;\nlocked = locked || (la > ra) || (lb > rb);\nha = (ra - la + 1) / 2;\nhb = (rb - lb + 1) / 2;\nma = la + ha;\nmb = lb + hb;\nscoreA = readPermutationElement(permutation, ma, stride, height).score;\nscoreB = readPermutationElement(permutation, mb, stride, height).score;\ndiscard1stHalf = (k > ha + hb);\naltb = (-scoreA < -scoreB);\nk -= int(discard1stHalf && altb) * (ha + 1);\nk -= int(discard1stHalf && !altb) * (hb + 1);\nla += int(discard1stHalf && altb) * (ma + 1 - la);\nlb += int(discard1stHalf && !altb) * (mb + 1 - lb);\nra += int(!discard1stHalf && !altb) * (ma - 1 - ra);\nrb += int(!discard1stHalf && altb) * (mb - 1 - rb);\n}\nreturn readPermutationElement(permutation, result, stride, height);\n}\n#endif\nvoid main()\n{\n#if STAGE == 1\nivec2 thread = threadLocation();\nint stride = outputSize().x;\nint keypointIndex = thread.y * stride + thread.x;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);\nPermutationElement element;\nelement.keypointIndex = keypointIndex;\nelement.score = keypoint.score;\nelement.valid = !isBadKeypoint(keypoint);\ncolor = encodePermutationElement(element);\n#elif STAGE == 2\nivec2 thread = threadLocation();\nint stride = outputSize().x;\nint elementIndex = thread.y * stride + thread.x;\nint blockIndex = elementIndex / blockSize;\nint blockOffset = elementIndex % blockSize;\nint la = blockIndex * blockSize;\nint lb = la + blockSize / 2;\nint ra = lb - 1;\nint rb = (blockIndex + 1) * blockSize - 1;\nint k = blockOffset;\nPermutationElement element = selectKth(permutation, k, la, ra, lb, rb);\ncolor = encodePermutationElement(element);\n#elif STAGE == 3\nivec2 thread = threadLocation();\nint newEncoderLength = outputSize().x;\nKeypointAddress myAddress = findKeypointAddress(thread, newEncoderLength, descriptorSize, extraSize);\nint myKeypointIndex = findKeypointIndex(myAddress, descriptorSize, extraSize);\nivec2 psize = textureSize(permutation, 0);\nPermutationElement element = readPermutationElement(permutation, myKeypointIndex, psize.x, psize.y);\nint oldEncoderLength = textureSize(encodedKeypoints, 0).x;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = KeypointAddress(element.keypointIndex * pixelsPerKeypoint, myAddress.offset);\nvec4 keypointData = readKeypointData(encodedKeypoints, oldEncoderLength, address);\ncolor = myKeypointIndex < maxKeypoints && element.valid ? keypointData : encodeNullKeypoint();\n#endif\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/subpixel-refinement.glsl":
/*!************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/subpixel-refinement.glsl ***!
  \************************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\n@include \"float16.glsl\"\n#if !defined(METHOD)\n#error Must define METHOD\n#endif\nuniform sampler2D pyramid;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nuniform int maxIterations;\nuniform float epsilon;\nconst int PATCH_RADIUS = 1;\nconst int PATCH_SIZE = 2 * PATCH_RADIUS + 1;\nconst int PATCH_SIZE_SQUARED = PATCH_SIZE * PATCH_SIZE;\nconst int LARGE_PATCH_RADIUS = PATCH_RADIUS + 1;\nconst int LARGE_PATCH_SIZE = 2 * LARGE_PATCH_RADIUS + 1;\nconst int LARGE_PATCH_SIZE_SQUARED = LARGE_PATCH_SIZE * LARGE_PATCH_SIZE;\nconst int LARGER_PATCH_RADIUS = LARGE_PATCH_RADIUS + 1;\nconst int LARGER_PATCH_SIZE = 2 * LARGER_PATCH_RADIUS + 1;\nconst int LARGER_PATCH_SIZE_SQUARED = LARGER_PATCH_SIZE * LARGER_PATCH_SIZE;\nconst float EPS = 1e-5;\nfloat smoothPixelBuffer[LARGER_PATCH_SIZE_SQUARED];\nvec2 derivativesBuffer[LARGE_PATCH_SIZE_SQUARED];\nfloat responseBuffer[PATCH_SIZE_SQUARED];\n#define patchPixelAt(u,v) smoothPixelBuffer[((v) + LARGER_PATCH_RADIUS) * LARGER_PATCH_SIZE + ((u) + LARGER_PATCH_RADIUS)]\n#define derivativesAt(u,v) derivativesBuffer[((v) + LARGE_PATCH_RADIUS) * LARGE_PATCH_SIZE + ((u) + LARGE_PATCH_RADIUS)]\n#define responseAt(u,v) responseBuffer[((v) + PATCH_RADIUS) * PATCH_SIZE + ((u) + PATCH_RADIUS)]\nvoid readPixels(vec2 center, float lod)\n{\nivec2 pyrBaseSize = textureSize(pyramid, 0);\nfloat pot = exp2(lod);\nint u, v;\nfor(int j = 0; j < LARGER_PATCH_SIZE; j++) {\nfor(int i = 0; i < LARGER_PATCH_SIZE; i++) {\nu = i - LARGER_PATCH_RADIUS;\nv = j - LARGER_PATCH_RADIUS;\npatchPixelAt(u,v) = pyrSubpixelAtExOffset(pyramid, center, lod, pot, ivec2(u,v), pyrBaseSize).g;\n}\n}\n}\nvoid computeDerivatives()\n{\nconst mat3 dx = mat3(\n-1, 0, 1,\n-2, 0, 2,\n-1, 0, 1\n);\nconst mat3 dy = mat3(\n1, 2, 1,\n0, 0, 0,\n-1,-2,-1\n);\nint u, v;\nmat3 pix, convX, convY;\nconst vec3 ones = vec3(1.0f);\nfor(int j = 0; j < LARGE_PATCH_SIZE; j++) {\nfor(int i = 0; i < LARGE_PATCH_SIZE; i++) {\nu = i - LARGE_PATCH_RADIUS;\nv = j - LARGE_PATCH_RADIUS;\npix = mat3(\npatchPixelAt(u+1,v+1), patchPixelAt(u+0,v+1), patchPixelAt(u-1,v+1),\npatchPixelAt(u+1,v+0), patchPixelAt(u+0,v+0), patchPixelAt(u-1,v+0),\npatchPixelAt(u+1,v-1), patchPixelAt(u+0,v-1), patchPixelAt(u-1,v-1)\n);\nconvX = matrixCompMult(dx, pix);\nconvY = matrixCompMult(dy, pix);\nderivativesAt(u,v) = vec2(\ndot(ones, vec3(\ndot(convX[0], ones),\ndot(convX[1], ones),\ndot(convX[2], ones)\n)),\ndot(ones, vec3(\ndot(convY[0], ones),\ndot(convY[1], ones),\ndot(convY[2], ones)\n))\n);\n}\n}\n}\nvec2 computeResponseMap()\n{\nfloat patchArea = float(PATCH_SIZE * PATCH_SIZE);\nvec3 h; vec2 d, c = vec2(0.0f);\nconst vec3 ones = vec3(1.0f);\nfloat response, sum = 0.0f;\nint u, v;\n#define H(r,s) d = derivativesAt((r),(s)); h += vec3(d.x * d.x, d.x * d.y, d.y * d.y)\nfor(int j = 0; j < PATCH_SIZE; j++) {\nfor(int i = 0; i < PATCH_SIZE; i++) {\nu = i - PATCH_RADIUS;\nv = j - PATCH_RADIUS;\nh = vec3(0.0f);\nH(u-1,v-1); H(u+0,v-1); H(u+1,v-1);\nH(u-1,v+0); H(u+0,v+0); H(u+1,v+0);\nH(u-1,v+1); H(u+0,v+1); H(u+1,v+1);\nresponse = 0.5f * (h.x + h.z - sqrt((h.x - h.z) * (h.x - h.z) + 4.0f * h.y * h.y));\nresponse /= patchArea;\nresponseAt(u,v) = response;\nc += vec2(u,v) * response;\nsum += response;\n}\n}\nreturn abs(sum) > EPS ? c / sum : vec2(0.0f);\n}\n#if METHOD == 0\nvec2 quadratic1d()\n{\nfloat a = 0.5f * (responseAt(-1,0) - 2.0f * responseAt(0,0) + responseAt(1,0));\nfloat b = 0.5f * (responseAt(1,0) - responseAt(-1,0));\nfloat c = responseAt(0,0);\nfloat d = 0.5f * (responseAt(0,-1) - 2.0f * responseAt(0,0) + responseAt(0,1));\nfloat e = 0.5f * (responseAt(0,1) - responseAt(0,-1));\nfloat f = responseAt(0,0);\nbool hasMax = a < -EPS && d < -EPS;\nreturn hasMax ? -0.5f * vec2(b / a, e / d) : vec2(0.0f);\n}\n#endif\n#if METHOD == 1\nvec2 taylor2d()\n{\nfloat dx = (-responseAt(-1,0) + responseAt(1,0)) * 0.5f;\nfloat dy = (-responseAt(0,-1) + responseAt(0,1)) * 0.5f;\nfloat dxx = responseAt(-1,0) - 2.0f * responseAt(0,0) + responseAt(1,0);\nfloat dyy = responseAt(0,-1) - 2.0f * responseAt(0,0) + responseAt(0,1);\nfloat dxy = (responseAt(-1,-1) + responseAt(1,1) - responseAt(1,-1) - responseAt(-1,1)) * 0.25f;\nfloat det = dxx * dyy - dxy * dxy;\nmat2 inv = mat2(dyy, -dxy, -dxy, dxx);\nbool hasMax = det > EPS && dxx < 0.0f;\nreturn hasMax ? inv * vec2(dx, dy) / (-det) : vec2(0.0f);\n}\n#endif\n#if METHOD == 2\nvoid bilinearUpsample(ivec2 patchOffset, vec4 pixelsOfPatch)\n{\nint u, v, i, j;\nvec2 frc, ifrc; vec4 sub;\nconst vec4 ones = vec4(1.0f);\nfloat s = 1.0f / float(PATCH_SIZE - 1);\nint xoff = 2 * patchOffset.x;\nint yoff = 2 * patchOffset.y;\nfor(j = 0; j < PATCH_SIZE; j++) {\nfor(i = 0; i < PATCH_SIZE; i++) {\nu = i - PATCH_RADIUS;\nv = j - PATCH_RADIUS;\nfrc = vec2(i, j) * s;\nifrc = vec2(1.0f) - frc;\nsub = vec4(\nifrc.x * ifrc.y,\nfrc.x * ifrc.y,\nifrc.x * frc.y,\nfrc.x * frc.y\n);\npatchPixelAt(u+xoff,v+yoff) = dot(sub*pixelsOfPatch, ones);\n}\n}\n}\n#endif\n#if METHOD == 3\nvoid bicubicUpsample(ivec2 patchOffset, vec4 pixelsOfPatch, vec4 dx, vec4 dy, vec4 dxy)\n{\nfloat x, y, s = 1.0f / float(PATCH_SIZE - 1);\nint u, v, i, j;\nfloat f00 = pixelsOfPatch.x;\nfloat f10 = pixelsOfPatch.y;\nfloat f01 = pixelsOfPatch.z;\nfloat f11 = pixelsOfPatch.w;\nfloat fx00 = dx.x;\nfloat fx10 = dx.y;\nfloat fx01 = dx.z;\nfloat fx11 = dx.w;\nfloat fy00 = dy.x;\nfloat fy10 = dy.y;\nfloat fy01 = dy.z;\nfloat fy11 = dy.w;\nfloat fxy00 = dxy.x;\nfloat fxy10 = dxy.y;\nfloat fxy01 = dxy.z;\nfloat fxy11 = dxy.w;\nmat4 bicubic = mat4(\n1, 0, -3, 2,\n0, 0, 3, -2,\n0, 1, -2, 1,\n0, 0, -1, 1\n) * mat4(\nf00, f10, fx00, fx10,\nf01, f11, fx01, fx11,\nfy00, fy10, fxy00, fxy10,\nfy01, fy11, fxy01, fxy11\n) * mat4(\n1, 0, 0, 0,\n0, 0, 1, 0,\n-3, 3, -2, -1,\n2, -2, 1, 1\n);\nint xoff = 2 * patchOffset.x;\nint yoff = 2 * patchOffset.y;\nfor(j = 0; j < PATCH_SIZE; j++) {\nfor(i = 0; i < PATCH_SIZE; i++) {\nu = i - PATCH_RADIUS;\nv = j - PATCH_RADIUS;\nx = float(i) * s;\ny = float(j) * s;\npatchPixelAt(u+xoff,v+yoff) = dot(\nvec4(1, x, x*x, x*x*x),\nbicubic * vec4(1, y, y*y, y*y*y)\n);\n}\n}\n}\n#endif\n#if METHOD == 2 || METHOD == 3\nvoid upsamplePatch(int left, int top, int right, int bottom)\n{\nint x, y, k;\nvec4 ptch[9];\nvec2 d00, d10, d01, d11;\nfor(k = 0; k < 9; k++) {\nx = -1 + (k % 3);\ny = -1 + (k / 3);\nptch[k] = vec4(\npatchPixelAt(left+x, top+y),\npatchPixelAt(right+x, top+y),\npatchPixelAt(left+x, bottom+y),\npatchPixelAt(right+x, bottom+y)\n);\n}\nfor(k = 0; k < 9; k++) {\nx = -1 + (k % 3);\ny = -1 + (k / 3);\n#if METHOD == 2\nbilinearUpsample(ivec2(x, y), ptch[k]);\n#elif METHOD == 3\nd00 = derivativesAt(left+x, top+y);\nd10 = derivativesAt(right+x, top+y);\nd01 = derivativesAt(left+x, bottom+y);\nd11 = derivativesAt(right+x, bottom+y);\nbicubicUpsample(ivec2(x, y), ptch[k],\nvec4(d00.x, d10.x, d01.x, d11.x),\nvec4(d00.y, d10.y, d01.y, d11.y),\n0.25f * vec4(\n(patchPixelAt(left+x + 1,top+y + 1) + patchPixelAt(left+x - 1, top+y - 1)) - (patchPixelAt(left+x + 1, top+y - 1) + patchPixelAt(left+x - 1, top+y + 1)),\n(patchPixelAt(right+x + 1,top+y + 1) + patchPixelAt(right+x - 1, top+y - 1)) - (patchPixelAt(right+x + 1, top+y - 1) + patchPixelAt(right+x - 1, top+y + 1)),\n(patchPixelAt(left+x + 1,bottom+y + 1) + patchPixelAt(left+x - 1, bottom+y - 1)) - (patchPixelAt(left+x + 1, bottom+y - 1) + patchPixelAt(left+x - 1, bottom+y + 1)),\n(patchPixelAt(right+x + 1,bottom+y + 1) + patchPixelAt(right+x - 1, bottom+y - 1)) - (patchPixelAt(right+x + 1, bottom+y - 1) + patchPixelAt(right+x - 1, bottom+y + 1))\n)\n);\n#endif\n}\n}\nvec2 upsampleResponseMap(int left, int top, int right, int bottom)\n{\nupsamplePatch(left, top, right, bottom);\ncomputeDerivatives();\nreturn computeResponseMap();\n}\nvec2 iterativeUpsample(vec2 initialGuess)\n{\nint refine = 1;\nfloat scale = 0.5f;\nfloat eps2 = epsilon * epsilon;\nvec2 guess = initialGuess, localGuess = initialGuess;\nfor(int k = 0; k < maxIterations; k++) {\nivec4 quad = ivec4(floor(localGuess.x), floor(localGuess.y), ceil(localGuess.x), ceil(localGuess.y));\nvec2 response = (refine != 0) ? upsampleResponseMap(quad.x, quad.y, quad.z, quad.w) : vec2(0.0f);\nlocalGuess = response * scale;\nguess += localGuess;\nscale *= 0.5f;\nrefine *= int(dot(localGuess, localGuess) >= eps2);\n}\nreturn guess;\n}\n#endif\nvoid main()\n{\nivec2 thread = threadLocation();\nint keypointIndex = thread.x + thread.y * outputSize().x;\nint pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;\nKeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);\ncolor = encodeNullPairOfFloat16();\nif(isNullKeypoint(keypoint))\nreturn;\ncolor = encodeDiscardedPairOfFloat16();\nif(isBadKeypoint(keypoint))\nreturn;\nreadPixels(keypoint.position, keypoint.lod);\ncomputeDerivatives();\nvec2 offset = computeResponseMap();\n#if METHOD == 0\noffset = quadratic1d();\n#elif METHOD == 1\noffset = taylor2d();\n#elif METHOD == 2 || METHOD == 3\noffset = iterativeUpsample(offset);\n#else\n#error Unknown METHOD\n#endif\nfloat pot = exp2(keypoint.lod);\ncolor = encodePairOfFloat16(offset * pot);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/transfer-flow.glsl":
/*!******************************************************!*\
  !*** ./src/gpu/shaders/keypoints/transfer-flow.glsl ***!
  \******************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\n@include \"float16.glsl\"\nuniform sampler2D encodedFlow;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nvoid main()\n{\nvec4 pixel = threadPixel(encodedKeypoints);\nivec2 thread = threadLocation();\nint len = textureSize(encodedFlow, 0).x;\nKeypointAddress myAddress = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, myAddress);\nint myIndex = findKeypointIndex(myAddress, descriptorSize, extraSize);\ncolor = pixel;\nif(isBadKeypoint(keypoint))\nreturn;\nivec2 location = ivec2(myIndex % len, myIndex / len);\nvec4 encodedFlow = myIndex < len * len ? pixelAt(encodedFlow, location) : encodeDiscardedKeypoint();\nbool discardFlow = isDiscardedPairOfFloat16(encodedFlow);\nvec2 flow = !discardFlow ? decodePairOfFloat16(encodedFlow) : vec2(0.0f);\nvec4 newPosition = encodeKeypointPosition(keypoint.position + flow);\nvec4 newPixel = myAddress.offset == 0 ? newPosition : pixel;\ncolor = !discardFlow ? newPixel : encodeDiscardedKeypoint();\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/transfer-orientation.glsl":
/*!*************************************************************!*\
  !*** ./src/gpu/shaders/keypoints/transfer-orientation.glsl ***!
  \*************************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D encodedOrientations;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nvoid main()\n{\nvec4 pixel = threadPixel(encodedKeypoints);\nivec2 thread = threadLocation();\nKeypointAddress myAddress = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint myIndex = findKeypointIndex(myAddress, descriptorSize, extraSize);\nint orientationEncoderLength = textureSize(encodedOrientations, 0).x;\nivec2 location = ivec2(myIndex % orientationEncoderLength, myIndex / orientationEncoderLength);\nvec4 targetPixel = pixelAt(encodedOrientations, location);\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, myAddress);\nbool isValid = !isBadKeypoint(keypoint);\nfloat encodedOrientation = targetPixel.g;\ncolor = isValid && myAddress.offset == 1 ? vec4(pixel.r, encodedOrientation, pixel.ba) : pixel;\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/transfer-to-extra.glsl":
/*!**********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/transfer-to-extra.glsl ***!
  \**********************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D encodedData;\nuniform int strideOfEncodedData;\nuniform sampler2D encodedKeypoints;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\nvec4 readEncodedData(sampler2D encodedData, int strideOfEncodedData, int elementId, int pixelsPerElement, int pixelOffset)\n{\nint rasterIndex = elementId * pixelsPerElement + pixelOffset;\nivec2 pos = ivec2(rasterIndex % strideOfEncodedData, rasterIndex / strideOfEncodedData);\nreturn texelFetch(encodedData, pos, 0);\n}\nvoid main()\n{\nivec2 thread = threadLocation();\nKeypointAddress myAddress = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint myIndex = findKeypointIndex(myAddress, descriptorSize, extraSize);\nint headerSize = sizeofEncodedKeypointHeader();\nint extraCell = myAddress.offset - headerSize / 4;\nint numberOfExtraCells = extraSize / 4;\ncolor = threadPixel(encodedKeypoints);\nif(extraCell < 0 || extraCell >= numberOfExtraCells)\nreturn;\nKeypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, myAddress);\nif(isBadKeypoint(keypoint))\nreturn;\ncolor = readEncodedData(encodedData, strideOfEncodedData, myIndex, numberOfExtraCells, extraCell);\n}"

/***/ }),

/***/ "./src/gpu/shaders/keypoints/upload-keypoints.glsl":
/*!*********************************************************!*\
  !*** ./src/gpu/shaders/keypoints/upload-keypoints.glsl ***!
  \*********************************************************/
/***/ ((module) => {

module.exports = "@include \"keypoints.glsl\"\nuniform sampler2D encodedKeypoints;\nuniform int startIndex;\nuniform int endIndex;\nuniform int descriptorSize;\nuniform int extraSize;\nuniform int encoderLength;\n#ifndef BUFFER_SIZE\n#error Undefined BUFFER_SIZE\n#endif\nlayout(std140) uniform KeypointBuffer\n{\nvec4 keypointBuffer[BUFFER_SIZE];\n};\nvoid main()\n{\nvec4 pixel = threadPixel(encodedKeypoints);\nivec2 thread = threadLocation();\nKeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);\nint index = findKeypointIndex(address, descriptorSize, extraSize);\ncolor = pixel;\nif(index < startIndex)\nreturn;\ncolor = encodeNullKeypoint();\nif(index >= endIndex)\nreturn;\nvec4 data = keypointBuffer[index - startIndex];\nswitch(address.offset) {\ncase 0: {\ncolor = encodeKeypointPosition(data.xy);\nbreak;\n}\ncase 1: {\nvec2 score = encodeKeypointScore(max(data.w, 0.0f));\nfloat scale = encodeLod(data.z);\nfloat rotation = encodeKeypointOrientation(0.0f);\ncolor = vec4(scale, rotation, score);\nbreak;\n}\ndefault: {\ncolor = vec4(0.0f);\nbreak;\n}\n}\n}"

/***/ }),

/***/ "./src/gpu/shaders/pyramids/downsample2.glsl":
/*!***************************************************!*\
  !*** ./src/gpu/shaders/pyramids/downsample2.glsl ***!
  \***************************************************/
/***/ ((module) => {

module.exports = "uniform sampler2D image;\nvoid main()\n{\n#if 1\ncolor = texture(image, texCoord);\n#else\nivec2 thread = threadLocation();\nivec2 pos = min(thread * 2, textureSize(image, 0) - ivec2(1));\ncolor = pixelAt(image, pos);\n#endif\n}"

/***/ }),

/***/ "./src/gpu/shaders/pyramids/upsample2.glsl":
/*!*************************************************!*\
  !*** ./src/gpu/shaders/pyramids/upsample2.glsl ***!
  \*************************************************/
/***/ ((module) => {

module.exports = "uniform sampler2D image;\nvoid main()\n{\nivec2 thread = threadLocation();\nvec4 pixel = pixelAt(image, thread / 2);\ncolor = (((thread.x + thread.y) & 1) == 0) ? pixel : vec4(0.0f, 0.0f, 0.0f, pixel.a);\n}"

/***/ }),

/***/ "./src/gpu/shaders/transforms/additive-mix.glsl":
/*!******************************************************!*\
  !*** ./src/gpu/shaders/transforms/additive-mix.glsl ***!
  \******************************************************/
/***/ ((module) => {

module.exports = "@include \"subpixel.glsl\"\nuniform sampler2D image0;\nuniform sampler2D image1;\nuniform float alpha;\nuniform float beta;\nuniform float gamma;\nconst vec4 BACKGROUND = vec4(0.0f);\nvoid main()\n{\nivec2 location = threadLocation();\nivec2 size0 = textureSize(image0, 0);\nivec2 size1 = textureSize(image1, 0);\nvec4 pix0 = all(lessThan(location, size0)) ? pixelAt(image0, location) : BACKGROUND;\nvec4 pix1 = all(lessThan(location, size1)) ? pixelAt(image1, location) : BACKGROUND;\nvec4 pix = clamp(alpha * pix0 + beta * pix1 + vec4(gamma), 0.0f, 1.0f);\ncolor = vec4(pix.rgb, 1.0f);\n}"

/***/ }),

/***/ "./src/gpu/shaders/transforms/resize.glsl":
/*!************************************************!*\
  !*** ./src/gpu/shaders/transforms/resize.glsl ***!
  \************************************************/
/***/ ((module) => {

module.exports = "@include \"subpixel.glsl\"\nuniform sampler2D image;\nvoid main()\n{\nvec2 imageSize = vec2(textureSize(image, 0));\n#if !defined(INTERPOLATION_METHOD)\n#error Must define INTERPOLATION_METHOD\n#elif INTERPOLATION_METHOD == 0\nvec2 pos = texCoord * imageSize;\ncolor = textureLod(image, (round(pos) + vec2(0.5f)) / imageSize, 0.0f);\n#elif INTERPOLATION_METHOD == 1\ncolor = subpixelAtBI(image, texCoord * imageSize);\n#else\n#error Invalid INTERPOLATION_METHOD\n#endif\n}"

/***/ }),

/***/ "./src/gpu/shaders/transforms/warp-perspective.glsl":
/*!**********************************************************!*\
  !*** ./src/gpu/shaders/transforms/warp-perspective.glsl ***!
  \**********************************************************/
/***/ ((module) => {

module.exports = "@include \"subpixel.glsl\"\nuniform sampler2D image;\nuniform mat3 inverseHomography;\nconst vec4 emptyColor = vec4(0.0f, 0.0f, 0.0f, 1.0f);\nvec2 perspectiveWarp(mat3 homography, vec2 p)\n{\nvec3 q = homography * vec3(p, 1.0f);\nreturn q.xy / q.z;\n}\nvoid main()\n{\nivec2 location = threadLocation();\nivec2 size = outputSize();\nconst vec2 zero = vec2(0.0f);\nvec2 target = perspectiveWarp(inverseHomography, vec2(location));\nbool withinBounds = all(bvec4(greaterThanEqual(target, zero), lessThan(target, vec2(size))));\ncolor = withinBounds ? subpixelAtBI(image, target) : emptyColor;\n}"

/***/ }),

/***/ "./src/gpu/shaders/utils/copy-components.glsl":
/*!****************************************************!*\
  !*** ./src/gpu/shaders/utils/copy-components.glsl ***!
  \****************************************************/
/***/ ((module) => {

module.exports = "@include \"colors.glsl\"\nuniform sampler2D dest, src;\nuniform int destComponents;\nuniform int srcComponentId;\nvoid main()\n{\nvec4 destPixel = threadPixel(dest);\nvec4 srcPixel = threadPixel(src);\nbvec4 flags = bvec4(\n(destComponents & PIXELCOMPONENT_RED) != 0,\n(destComponents & PIXELCOMPONENT_GREEN) != 0,\n(destComponents & PIXELCOMPONENT_BLUE) != 0,\n(destComponents & PIXELCOMPONENT_ALPHA) != 0\n);\ncolor = mix(destPixel, vec4(srcPixel[srcComponentId]), flags);\n}"

/***/ }),

/***/ "./src/gpu/shaders/utils/copy-raster.glsl":
/*!************************************************!*\
  !*** ./src/gpu/shaders/utils/copy-raster.glsl ***!
  \************************************************/
/***/ ((module) => {

module.exports = "#if !defined(TYPE)\n#error Undefined TYPE\n#elif TYPE == 1\n@include \"keypoints.glsl\"\n#define nullPixel() encodeNullKeypoint()\n#elif TYPE == 2\n@include \"float16.glsl\"\n#define nullPixel() encodeNullPairOfFloat16()\n#else\n#error Invalid TYPE\n#endif\nuniform sampler2D image;\nvoid main()\n{\nivec2 thread = threadLocation();\nivec2 imageSize = textureSize(image, 0);\nint rasterIndex = thread.y * outputSize().x + thread.x;\nbool isValidPixel = rasterIndex < imageSize.x * imageSize.y;\nivec2 pos = ivec2(rasterIndex % imageSize.x, rasterIndex / imageSize.x);\nvec4 nullpix = nullPixel();\ncolor = isValidPixel ? texelFetch(image, pos, 0) : nullpix;\n}"

/***/ }),

/***/ "./src/gpu/shaders/utils/copy.glsl":
/*!*****************************************!*\
  !*** ./src/gpu/shaders/utils/copy.glsl ***!
  \*****************************************/
/***/ ((module) => {

module.exports = "uniform sampler2D image;\nvoid main()\n{\ncolor = threadPixel(image);\n}"

/***/ }),

/***/ "./src/gpu/shaders/utils/fill-components.glsl":
/*!****************************************************!*\
  !*** ./src/gpu/shaders/utils/fill-components.glsl ***!
  \****************************************************/
/***/ ((module) => {

module.exports = "@include \"colors.glsl\"\nuniform sampler2D image;\nuniform int pixelComponents;\nuniform float value;\nvoid main()\n{\nvec4 pixel = threadPixel(image);\nbvec4 flags = bvec4(\n(pixelComponents & PIXELCOMPONENT_RED) != 0,\n(pixelComponents & PIXELCOMPONENT_GREEN) != 0,\n(pixelComponents & PIXELCOMPONENT_BLUE) != 0,\n(pixelComponents & PIXELCOMPONENT_ALPHA) != 0\n);\ncolor = mix(pixel, vec4(value), flags);\n}"

/***/ }),

/***/ "./src/gpu/shaders/utils/fill.glsl":
/*!*****************************************!*\
  !*** ./src/gpu/shaders/utils/fill.glsl ***!
  \*****************************************/
/***/ ((module) => {

module.exports = "uniform float value;\nvoid main()\n{\ncolor = vec4(value);\n}"

/***/ }),

/***/ "./src/gpu/shaders/utils/flip-y.vs.glsl":
/*!**********************************************!*\
  !*** ./src/gpu/shaders/utils/flip-y.vs.glsl ***!
  \**********************************************/
/***/ ((module) => {

module.exports = "void vsmain()\n{\ngl_Position *= vec4(1,-1,1,1);\n}"

/***/ }),

/***/ "./src/gpu/shaders/utils/scan-minmax2d.glsl":
/*!**************************************************!*\
  !*** ./src/gpu/shaders/utils/scan-minmax2d.glsl ***!
  \**************************************************/
/***/ ((module) => {

module.exports = "uniform sampler2D image;\nuniform int iterationNumber;\nvoid main()\n{\nivec2 thread = threadLocation();\nivec2 last = outputSize() - ivec2(1);\nint jump = (1 << iterationNumber);\nint clusterLength = jump << 1;\nint clusterMask = clusterLength - 1;\nivec2 clusterPos = ivec2(thread >> (1 + iterationNumber)) << (1 + iterationNumber);\nivec2 next1 = clusterPos + ((thread - clusterPos + ivec2(jump, 0)) & clusterMask);\nivec2 next2 = clusterPos + ((thread - clusterPos + ivec2(0, jump)) & clusterMask);\nivec2 next3 = clusterPos + ((thread - clusterPos + ivec2(jump, jump)) & clusterMask);\nvec4 p0 = texelFetch(image, thread, 0);\nvec4 p1 = texelFetch(image, min(next1, last), 0);\nvec4 p2 = texelFetch(image, min(next2, last), 0);\nvec4 p3 = texelFetch(image, min(next3, last), 0);\nvec4 pmax = max(max(p0, p1), max(p2, p3));\nvec4 pmin = min(min(p0, p1), min(p2, p3));\ncolor = vec4(pmax.r, pmin.g, pmax.r - pmin.g, p0.a);\n}"

/***/ }),

/***/ "./src/gpu/shaders/utils/sobel-derivatives.glsl":
/*!******************************************************!*\
  !*** ./src/gpu/shaders/utils/sobel-derivatives.glsl ***!
  \******************************************************/
/***/ ((module) => {

module.exports = "@include \"pyramids.glsl\"\n@include \"float16.glsl\"\nuniform sampler2D pyramid;\nuniform float lod;\n#define USE_VARYINGS 1\nin vec2 v_pix0, v_pix1, v_pix2,\nv_pix3, v_pix4, v_pix5,\nv_pix6, v_pix7, v_pix8;\nconst mat3 hkern = mat3(\n1.0f, 0.0f,-1.0f,\n2.0f, 0.0f,-2.0f,\n1.0f, 0.0f,-1.0f\n), vkern = mat3(\n1.0f, 2.0f, 1.0f,\n0.0f, 0.0f, 0.0f,\n-1.0f,-2.0f,-1.0f\n);\n#define PIX(x,y) pyrPixelAtOffset(pyramid, lod, pot, ivec2((x),(y))).g\n#define XIP(v) textureLod(pyramid, (v), lod).g\nvoid main()\n{\nconst vec3 ones = vec3(1.0f);\nfloat pot = exp2(lod);\nmat3 win = mat3(\n#if USE_VARYINGS\nXIP(v_pix0), XIP(v_pix1), XIP(v_pix2),\nXIP(v_pix3), XIP(v_pix4), XIP(v_pix5),\nXIP(v_pix6), XIP(v_pix7), XIP(v_pix8)\n#else\nPIX(-1,-1), PIX(0,-1), PIX(1,-1),\nPIX(-1,0), PIX(0,0), PIX(1,0),\nPIX(-1,1), PIX(0,1), PIX(1,1)\n#endif\n);\nmat3 dx = matrixCompMult(hkern, win);\nmat3 dy = matrixCompMult(vkern, win);\nvec2 df = vec2(\ndot(dx[0] + dx[1] + dx[2], ones),\ndot(dy[0] + dy[1] + dy[2], ones)\n);\ncolor = encodePairOfFloat16(df);\n}"

/***/ }),

/***/ "./src/gpu/shaders/utils/sobel-derivatives.vs.glsl":
/*!*********************************************************!*\
  !*** ./src/gpu/shaders/utils/sobel-derivatives.vs.glsl ***!
  \*********************************************************/
/***/ ((module) => {

module.exports = "uniform mediump float lod;\nout vec2 v_pix0, v_pix1, v_pix2,\nv_pix3, v_pix4, v_pix5,\nv_pix6, v_pix7, v_pix8;\n#define PIX(x,y) (texCoord + ((pot) * vec2((x),(y))) / texSize)\nvoid vsmain()\n{\nfloat pot = exp2(lod);\nv_pix0 = PIX(-1,-1); v_pix1 = PIX(0,-1); v_pix2 = PIX(1,-1);\nv_pix3 = PIX(-1,0); v_pix4 = PIX(0,0); v_pix5 = PIX(1,0);\nv_pix6 = PIX(-1,1); v_pix7 = PIX(0,1); v_pix8 = PIX(1,1);\n}"

/***/ }),

/***/ "./src/core/wasm/speedy-matrix.wasm.txt":
/*!**********************************************!*\
  !*** ./src/core/wasm/speedy-matrix.wasm.txt ***!
  \**********************************************/
/***/ ((module) => {

module.exports = `AGFzbQEAAAABiwETYAABfmADf39/AX9gAX8AYAN/f38AYAF9AX9gAX8Bf2ACf38Bf2AFf39/f38B
f2AFf39/f38AYAZ/f39/f38Bf2AAAX9gAn99AX9gA39/fQF/YAJ/fwF9YAF/AX1gBH9/f38AYAR/
f39/AX9gEX98fHx8fHx8fHx8fHx8fHx8AGAHf39/f39/fQF/AjsEA2VudgZtZW1vcnkCAAIDZW52
BWZhdGFsAAIDZW52CGJ5dGVmaWxsAAMDZW52CmNvcHlXaXRoaW4AAwNAPwQFBgIGAQECBwgGAwAJ
AgYCBgYKBQUFCQsFBgEBDAEBBgYGAQEMAQ0OAwgPAxAIAwYBEQEBAQEBARIBEgEBDwQFAXABBQUG
CAF/AUHwmgQLB/QDHAZtYWxsb2MABARmcmVlAAYFc3JhbmQACgxNYXQzMl9jcmVhdGUAEA1NYXQz
Ml9kZXN0cm95ABcKTWF0MzJfZGF0YQAYDk1hdDMyX2RhdGFTaXplABkPTWF0MzJfdHJhbnNwb3Nl
AB0JTWF0MzJfYWRkAB4OTWF0MzJfc3VidHJhY3QAHwtNYXQzMl9zY2FsZQAgDk1hdDMyX2NvbXBt
dWx0ACEOTWF0MzJfbXVsdGlwbHkAIg5NYXQzMl9pbnZlcnNlMQAjDk1hdDMyX2ludmVyc2UyACQO
TWF0MzJfaW52ZXJzZTMAJQ1NYXQzMl9xcl9mdWxsACwQTWF0MzJfcXJfcmVkdWNlZAAvDE1hdDMy
X3FyX29scwAwEE1hdDMyX3FyX2ludmVyc2UAMxZNYXQzMl9ob21vZ3JhcGh5X25kbHQ0ADcVTWF0
MzJfaG9tb2dyYXBoeV9uZGx0ADgUTWF0MzJfYWZmaW5lX2RpcmVjdDMAOhNNYXQzMl9hZmZpbmVf
ZGlyZWN0ADsYTWF0MzJfcHJhbnNhY19ob21vZ3JhcGh5ADwUTWF0MzJfcHJhbnNhY19hZmZpbmUA
PhtNYXQzMl90cmFuc2Zvcm1fcGVyc3BlY3RpdmUAPxZNYXQzMl90cmFuc2Zvcm1fYWZmaW5lAEAJ
CgEAQQELBA8REz0Kh7oBPyMBAX8gALwiAUGAgID8B3FBgICA/AdGIAFB////A3FBAEdxC2kBAX9B
AEEAKALAmoCAAEEBajYCwJqAgABBAEEAKAK0moCAACIBQQdxIAFqIgEgAGo2ArSagIAAAkBB8JqE
gABBB3EgAWpB8JqEgABqIgA/AEEQdEkNAEGEiICAABCAgICAAEEADwsgAAt1AQJ/QQAhAkEAQQAo
AsCagIAAQQFqNgLAmoCAAEEAQQAoArSagIAAIgNBB3EgA2oiAyAAajYCtJqAgAACQAJAQfCahIAA
QQdxIANqQfCahIAAaiIAPwBBEHRJDQAgAUUNASABEICAgIAAQQAPCyAAIQILIAILRgECf0EAQQAo
AsCagIAAIgFBf2oiAjYCwJqAgAACQCACDQBBAEEINgK0moCAAA8LAkAgAUEASg0AQZOIgIAAEICA
gIAACwtGAQJ/QQBBACgCwJqAgAAiAkF/aiIDNgLAmoCAAAJAIAMNAEEAQQg2ArSagIAAQQAPCwJA
IAJBAEoNACABEICAgIAAC0EACxcAIAFB/wFxIAAgACACahCBgICAACAACxMAIAAgASABIAJqEIKA
gIAAIAALoQECAX8CfkEAKAK4moCAACIBIACtQiCGIABBf3OthCICQqrw0/Sv7ry3PHwiA0IeiCAD
hUK5y5Pn0e2RrL9/fiIDQhuIIAOFQuujxJmxt5LolH9+IgNCH4ggA4U3AwggASACQpX4qfqXt96b
nn98IgJCHoggAoVCucuT59Htkay/f34iAkIbiCAChULro8SZsbeS6JR/fiICQh+IIAKFNwMAC0QB
AX9B3oG33QAhBQJAIAJFDQAgAEUNACADRQ0AQQAhBSABQQJJDQAgACAAIAFBf2ogAmxqIAIgAyAE
EIyAgIAACyAFC60GAwR/AXwFfwJAAkAgASAASw0AIAEhBSAAIQYMAQtBACACayEHIAJBBEshCANA
IAEiBSAAIgZrIAJuIgFBCEkNAQJAAkBBACgCvJqAgAARgICAgAAAQgyIQoCAgICAgID4P4S/RAAA
AAAAAPC/oCABQQFquKIiCUQAAAAAAADwQWMgCUQAAAAAAAAAAGZxRQ0AIAmrIQEMAQtBACEBCyAG
IAEgAmxqIQogBSEBIAYhCwNAAkAgCyAKIAQgAxGBgICAAABBf0oNAANAIAsgAmoiCyAKIAQgAxGB
gICAAABBAEgNAAsLAkAgASAKIAQgAxGBgICAAABBAUgNAANAIAEgB2oiASAKIAQgAxGBgICAAABB
AEoNAAsLAkAgCyABTw0AIAEhACALIQwgAiENAkACQCAIDQACQAJAIAIOBQMBAQEAAwsgCygCACEA
IAsgASgCADYCACABIAA2AgAMAgsgASEAIAshDCACIQ0LA0AgDC0AACEOIAwgAC0AADoAACAAIA46
AAAgAEEBaiEAIAxBAWohDCANQX9qIg0NAAsLIAEgCyAKIAogAUYbIAogC0YbIQogASAHaiEBIAsg
AmohCwwBCwsgCyACaiALIAsgAUYiABshDAJAAkAgASAHaiABIAAbIgEgBk0NACAMIAVPDQACQCAB
IAZrIAUgDGtNDQAgDCAFIAIgAyAEEIyAgIAAIAYhAAwCCyAGIAEgAiADIAQQjICAgAAgBSEBIAwh
AAwBCyAGIAwgASAGSyIKGyEAIAEgBSAKGyEBIAoNACAMIAVPDQILIAEhBSAAIQYgASAASw0ACwsC
QCAGIAVPDQAgAkEESyEHA0AgBiINIAJqIgYhASANIQACQCAGIAVLDQADQCABIAAgASAAIAQgAxGB
gICAAABBAEgbIQAgASACaiIBIAVNDQALIAAgDUYNAAJAIAcNAAJAIAIOBQIBAQEAAgsgACgCACEB
IAAgDSgCADYCACANIAE2AgAMAQtBACEBA0AgACABaiIMLQAAIQogDCANIAFqIgstAAA6AAAgCyAK
OgAAIAIgAUEBaiIBRw0ACwsgBiAFSQ0ACwsLNQECfwJAIAFBAUgNAEEAIQIgACEDA0AgAyACNgIA
IANBBGohAyABIAJBAWoiAkcNAAsLIAALvgIFAn8BfAF/AXwEfwJAIAFBf2oiA0UNACACQQRLIQRE
AAAAAAAAAAAhBUEAIQYDQAJAAkBBACgCvJqAgAARgICAgAAAQgyIQoCAgICAgID4P4S/RAAAAAAA
APC/oCABIAZruKIgBaAiB0QAAAAAAADwQWMgB0QAAAAAAAAAAGZxRQ0AIAerIQgMAQtBACEICwJA
IAYgCEYNAAJAIAQNAAJAIAIOBQIBAQEAAgsgACAGQQJ0aiIJKAIAIQogCSAAIAhBAnRqIggoAgA2
AgAgCCAKNgIADAELIAAgBiACbGohCSAAIAggAmxqIQggAiEKA0AgCS0AACELIAkgCC0AADoAACAI
IAs6AAAgCEEBaiEIIAlBAWohCSAKQX9qIgoNAAsLIAVEAAAAAAAA8D+gIQUgBkEBaiIGIANHDQAL
CwtFAQN+QQBBACkD2JqAgAAiAEEAKQPQmoCAACIBhSICQiWJNwPYmoCAAEEAIAFCGIkgAoUgAkIQ
hoU3A9CagIAAIAAgAXwLlAEBAX8CQAJAIAMgAkgNACAAQQFIDQAgAUEBSA0AIAJBAUgNACAAQX9q
IAJsIAFBf2ogA2xqQQFqIARHDQAgBQ0BC0GfiICAABCAgICAAAtBHEG+iICAABCFgICAACIGIAM2
AhQgBiACNgIQIAYgATYCDCAGIAA2AgggBiAENgIEIAZBgoCAgAA2AhggBiAFNgIAIAYLAgALkwEB
BH8CQAJAIABBAUgNACABQQBKDQELQdqIgIAAEICAgIAAC0EcQfmIgIAAEIWAgIAAIQIgASAAbCID
QQJ0IgRBlYmAgAAQhYCAgAAhBSACIAA2AhQgAkEBNgIQIAIgATYCDCACIAA2AgggAiADNgIEIAVB
ACAEEIiAgIAAIQAgAkGDgICAADYCGCACIAA2AgAgAgsRACAAQeeKgIAAEIeAgIAAGgv0AQEEfwJA
AkAgAEEBSA0AIAFBAEoNAQtB2oiAgAAQgICAgAALQRxB+YiAgAAQhYCAgAAhAiABIABsIgNBAnQi
BEGViYCAABCFgICAACEFIAIgADYCFCACQQE2AhAgAiABNgIMIAIgADYCCCACIAM2AgQgBUEAIAQQ
iICAgAAhAyACQYOAgIAANgIYIAIgAzYCAAJAIAAgASAAIAFIGyIBQQFIDQAgAyACKAIUIAIoAhBq
IgQgAUF/amxBAnRqIQAgAUEBaiEBQQAgBEECdGshAwNAIABBgICA/AM2AgAgACADaiEAIAFBf2oi
AUEBSg0ACwsgAguYAgEKfwJAAkAgACgCCCABKAIIRw0AIAAoAgwgASgCDEYNAQtBx4qAgAAQgICA
gAALAkACQCAAKAIEIgIgASgCBEYNACAAKAIMIgNBAUgNAUEAIQQgACgCCCIFQQFIIQZBACEHA0AC
QCAGDQAgACgCEEECdCEIIAEoAhBBAnQhCSAAKAIAIAAoAhQgBGxqIQIgASgCACABKAIUIARsaiEK
QQAhCwNAIAIgCigCADYCACACIAhqIQIgCiAJaiEKIAtBAWoiCyAFSA0ACwsgBEEEaiEEIAdBAWoi
ByADSA0ADAILCwJAIAEoAgAiCiAAKAIAIgsgAkECdCICak8NACAKIAJqIAtLDQELIAsgCiACEImA
gIAAGgsgAAtVAQF/QRxBsYmAgAAQhYCAgAAiAEEYakEAKALoiYCAADYCACAAQRBqQQApAuCJgIAA
NwIAIABBCGpBACkC2ImAgAA3AgAgAEEAKQLQiYCAADcCACAACyEAIAAoAgAgACgCGBGCgICAAAAg
AEHsiYCAABCHgICAAAsHACAAKAIACwoAIAAoAgRBAnQL0AEBAn8CQCAAKAIYQYKAgIAARg0AQYeK
gIAAEICAgIAACwJAAkAgAyACSA0AIAJBAEgNACAFIARIDQAgBEEASA0AIAEoAgggA0wNACABKAIM
IAVKDQELQaeKgIAAEICAgIAACyABKAIQIQYgAEEUaiABQRRqKAIAIgc2AgAgACAGNgIQIAAgBSAE
a0EBajYCDCAAIAMgAmtBAWo2AgggACAGIANsIAcgBWxqIAcgBGwgBiACbGoiAmtBAWo2AgQgACAB
KAIAIAJBAnRqNgIAIAALgQEBCH8CQCAAKAIMIgJBAUgNAEEAIQMgACgCCCIEQQFIIQVBACEGA0AC
QCAFDQAgACgCEEECdCEHIAAoAgAgACgCFCADbGohCEEAIQkDQCAIIAE4AgAgCCAHaiEIIAlBAWoi
CSAESA0ACwsgA0EEaiEDIAZBAWoiBiACSA0ACwsgAAumAQEIfwJAIAAoAgwiASAAKAIIIgJsIgMg
ACgCBEcNACAAKAIAQQAgA0ECdBCIgICAABogAA8LAkAgAUEBSA0AIAJBAUghBEEAIQVBACEGA0AC
QCAEDQAgACgCEEECdCEHIAAoAgAgACgCFCAFbGohAyACIQgDQCADQQA2AgAgAyAHaiEDIAhBf2oi
CA0ACwsgBUEEaiEFIAZBAWoiBiABRw0ACwsgAAvcAQEKfwJAAkAgACgCCCABKAIMRw0AIAAoAgwi
AiABKAIIRg0BC0GBi4CAABCAgICAACAAKAIMIQILAkAgAkEBSA0AIAAoAgwhA0EAIQQgACgCCCIF
QQFIIQZBACEHA0ACQCAGDQAgACgCEEECdCEIIAEoAhRBAnQhCSAAKAIAIAAoAhQgBGxqIQIgASgC
ACABKAIQIARsaiEKQQAhCwNAIAIgCigCADYCACACIAhqIQIgCiAJaiEKIAtBAWoiCyAFSA0ACwsg
BEEEaiEEIAdBAWoiByADSA0ACwsgAAuZAgEMfwJAAkAgASgCCCIDIAIoAghHDQAgASgCDCIEIAIo
AgxHDQAgACgCCCADRw0AIAAoAgwgBEYNAQtBp4uAgAAQgICAgAAgACgCDCEECwJAIARBAUgNACAA
KAIMIQVBACEGIAAoAggiB0EBSCEIQQAhCQNAAkAgCA0AIAAoAhBBAnQhCiACKAIQQQJ0IQsgASgC
EEECdCEMIAAoAgAgACgCFCAGbGohBCACKAIAIAIoAhQgBmxqIQMgASgCACABKAIUIAZsaiENQQAh
DgNAIAQgDSoCACADKgIAkjgCACAEIApqIQQgAyALaiEDIA0gDGohDSAOQQFqIg4gB0gNAAsLIAZB
BGohBiAJQQFqIgkgBUgNAAsLIAALmQIBDH8CQAJAIAEoAggiAyACKAIIRw0AIAEoAgwiBCACKAIM
Rw0AIAAoAgggA0cNACAAKAIMIARGDQELQc2LgIAAEICAgIAAIAAoAgwhBAsCQCAEQQFIDQAgACgC
DCEFQQAhBiAAKAIIIgdBAUghCEEAIQkDQAJAIAgNACAAKAIQQQJ0IQogAigCEEECdCELIAEoAhBB
AnQhDCAAKAIAIAAoAhQgBmxqIQQgAigCACACKAIUIAZsaiEDIAEoAgAgASgCFCAGbGohDUEAIQ4D
QCAEIA0qAgAgAyoCAJM4AgAgBCAKaiEEIAMgC2ohAyANIAxqIQ0gDkEBaiIOIAdIDQALCyAGQQRq
IQYgCUEBaiIJIAVIDQALCyAAC98BAQp/AkACQCAAKAIIIAEoAghHDQAgACgCDCIDIAEoAgxGDQEL
QfOLgIAAEICAgIAAIAAoAgwhAwsCQCADQQFIDQAgACgCDCEEQQAhBSAAKAIIIgZBAUghB0EAIQgD
QAJAIAcNACAAKAIQQQJ0IQkgASgCEEECdCEKIAAoAgAgACgCFCAFbGohAyABKAIAIAEoAhQgBWxq
IQtBACEMA0AgAyALKgIAIAKUOAIAIAMgCWohAyALIApqIQsgDEEBaiIMIAZIDQALCyAFQQRqIQUg
CEEBaiIIIARIDQALCyAAC5kCAQx/AkACQCABKAIIIgMgAigCCEcNACABKAIMIgQgAigCDEcNACAA
KAIIIANHDQAgACgCDCAERg0BC0GZjICAABCAgICAACAAKAIMIQQLAkAgBEEBSA0AIAAoAgwhBUEA
IQYgACgCCCIHQQFIIQhBACEJA0ACQCAIDQAgACgCEEECdCEKIAIoAhBBAnQhCyABKAIQQQJ0IQwg
ACgCACAAKAIUIAZsaiEEIAIoAgAgAigCFCAGbGohAyABKAIAIAEoAhQgBmxqIQ1BACEOA0AgBCAN
KgIAIAMqAgCUOAIAIAQgCmohBCADIAtqIQMgDSAMaiENIA5BAWoiDiAHSA0ACwsgBkEEaiEGIAlB
AWoiCSAFSA0ACwsgAAvOAgMLfwF9BX8CQAJAIAEoAgwgAigCCEcNACAAKAIIIAEoAghHDQAgACgC
DCACKAIMRg0BC0HAjICAABCAgICAAAsgABCcgICAABoCQCAAKAIMIgNBAUgNAEEAIQQgAigCCCIF
QQFIIQZBACEHA0ACQCAGDQAgAigCFCAHbCEIIAAoAgghCSACKAIQIQogAigCACELQQAhDEEAIQ0D
QAJAIAlBAUgNACALIAggCiANbGpBAnRqKgIAIQ4gACgCEEECdCEPIAEoAhBBAnQhECAAKAIAIAQg
ACgCFGxqIREgASgCACABKAIUIAxsaiESQQAhEwNAIBEgDiASKgIAlCARKgIAkjgCACARIA9qIREg
EiAQaiESIBNBAWoiEyAJSA0ACwsgDEEEaiEMIA1BAWoiDSAFSA0ACwsgBEEEaiEEIAdBAWoiByAD
SA0ACwsgAAuIAQICfwF9AkACQCAAKAIIIgIgASgCCEcNACACQQFHDQAgAiAAKAIMIgNHDQAgAyAB
KAIMRg0BC0HnjICAABCAgICAAAsCQAJAIAEoAgAqAgAiBIu7RI3ttaD3xrA+Y0EBcw0AQQAqAoCI
gIAAIQQMAQtDAACAPyAElSEECyAAKAIAIAQ4AgAgAAuNAgICfwV9AkACQCAAKAIIIgIgASgCCEcN
ACACQQJHDQAgAiAAKAIMIgNHDQAgAyABKAIMRg0BC0GOjYCAABCAgICAAAsCQAJAIAEoAgAiAioC
ACIEIAIgAUEUaigCACIDIAEoAhAiAWpBAnRqKgIAIgWUIAIgAUECdGoqAgAiBiACIANBAnRqKgIA
IgeUkyIIi7tEje21oPfGsD5jQQFzDQBBACoCgIiAgAAhCAwBC0MAAIA/IAiVIQgLIAAoAgAiASAF
IAiUOAIAIAEgACgCECICQQJ0aiAIIAaMlDgCACABIABBFGooAgAiA0ECdGogCCAHjJQ4AgAgASAD
IAJqQQJ0aiAEIAiUOAIAIAALnAQGAn8CfQF/BX0BfwZ9AkACQCAAKAIIIgIgASgCCEcNACACQQNH
DQAgAiAAKAIMIgNHDQAgAyABKAIMRg0BC0G1jYCAABCAgICAAAsCQAJAIAEoAgAiAiABKAIQIgNB
A3RqKgIAIgQgAiABQRRqKAIAIgFBAnRqKgIAIgUgAiABQQF0IgYgA2pBAnRqKgIAIgeUIAIgASAD
akECdGoqAgAiCCACIAFBA3RqKgIAIgmUkyIKlCACKgIAIgsgCCACIAYgA0EBdCIMakECdGoqAgAi
DZQgAiAMIAFqQQJ0aioCACIOIAeUkyIPlCACIANBAnRqKgIAIhAgBSANlCAOIAmUkyIRlJOSIhKL
u0SN7bWg98awPmNBAXMNAEEAKgKAiICAACESDAELQwAAgD8gEpUhEgsgACgCACICIA8gEpQ4AgAg
AiAAKAIQIgFBAnRqIBIgECANlCAEIAeUk4yUOAIAIAIgAUEDdGogECAOlCAEIAiUkyASlDgCACAC
IABBFGooAgAiA0ECdGogEiARjJQ4AgAgAiADIAFqIgZBAnRqIAsgDZQgBCAJlJMgEpQ4AgAgAiAD
IAFBAXRqQQJ0aiASIAsgDpQgBCAFlJOMlDgCACACIANBA3RqIAogEpQ4AgAgAiABIANBAXRqQQJ0
aiASIAsgB5QgECAJlJOMlDgCACACIAZBA3RqIAsgCJQgECAFlJMgEpQ4AgAgAAvZAgIRfwF9AkAC
QCABKAIIIAIoAghHDQAgACgCCCABKAIMRw0AIAAoAgwiAyACKAIMRg0BC0HcjYCAABCAgICAACAA
KAIMIQMLAkAgA0EBSA0AIAAoAgwhBCAAKAIIIgVBAUghBkEAIQdBACEIA0ACQCAGDQAgACgCFCAI
bCEJIAIoAgghCiAAKAIQIQsgACgCACEMQQAhDUEAIQ4DQCAMIAkgCyAObGpBAnRqIg9BADYCAAJA
IApBAUgNACACKAIQQQJ0IRAgASgCEEECdCERIAIoAgAgByACKAIUbGohAyABKAIAIAEoAhQgDWxq
IRJBACETQwAAAAAhFANAIA8gFCASKgIAIAMqAgCUkiIUOAIAIAMgEGohAyASIBFqIRIgE0EBaiIT
IApIDQALCyANQQRqIQ0gDkEBaiIOIAVIDQALCyAHQQRqIQcgCEEBaiIIIARIDQALCyAAC5sFBAR/
An0DfxB9AkACQCAAKAIIIgMgACgCDEcNACABKAIIIgQgASgCDEcNACACKAIIIgVBA0cNACAEQQNH
DQAgA0EDRw0AIAUgAigCDEYNAQtBg46AgAAQgICAgAALIAIoAgAiAyACQRRqKAIAIgRBAXQiBiAC
KAIQIgVBAXQiAmpBAnRqKgIAIQcgAyACIARqQQJ0aioCACEIIAEoAgAiAiABKAIQIglBAXQiCiAB
QRRqKAIAIgtqQQJ0aioCACEMIAIgC0EBdCIBIApqQQJ0aioCACENIAMgBEEDdGoqAgAhDiADIAYg
BWpBAnRqKgIAIQ8gAyAEQQJ0aioCACEQIAMgBCAFakECdGoqAgAhESACIAlBA3RqKgIAIRIgAiAJ
QQJ0aioCACETIAIgCyAJakECdGoqAgAhFCACIAEgCWpBAnRqKgIAIRUgACgCACIBIAIqAgAiFiAD
KgIAIheUIAIgC0ECdGoqAgAiGCADIAVBAnRqKgIAIhmUkiACIAtBA3RqKgIAIhogAyAFQQN0aioC
ACIblJI4AgAgASAAKAIQIgNBAnRqIBMgF5QgFCAZlJIgFSAblJI4AgAgASADQQN0aiASIBeUIAwg
GZSSIA0gG5SSOAIAIAEgAEEUaigCACICQQJ0aiAWIBCUIBggEZSSIBogCJSSOAIAIAEgAiADaiIE
QQJ0aiATIBCUIBQgEZSSIBUgCJSSOAIAIAEgAiADQQF0akECdGogEiAQlCAMIBGUkiANIAiUkjgC
ACABIAJBA3RqIBYgDpQgGCAPlJIgGiAHlJI4AgAgASADIAJBAXRqQQJ0aiATIA6UIBQgD5SSIBUg
B5SSOAIAIAEgBEEDdGogEiAOlCAMIA+UkiANIAeUkjgCACAAC+UBAQp/AkACQCAAKAIIIAEoAghH
DQAgACgCDCIDIAEoAgxGDQELQaqOgIAAEICAgIAAIAAoAgwhAwsCQCADQQFIDQAgACgCDCEEQQAh
BSAAKAIIIgZBAUghB0EAIQgDQAJAIAcNACAAKAIQQQJ0IQkgASgCEEECdCEKIAAoAgAgACgCFCAF
bGohAyABKAIAIAEoAhQgBWxqIQtBACEMA0AgAyALKgIAIAKUIAMqAgCSOAIAIAMgCWohAyALIApq
IQsgDEEBaiIMIAZIDQALCyAFQQRqIQUgCEEBaiIIIARIDQALCyAAC48CAwh/AX0DfwJAAkAgASgC
DEEBRw0AIAIoAghBAUcNACAAKAIIIAEoAghHDQAgACgCDCIDIAIoAgxGDQELQdGOgIAAEICAgIAA
IAAoAgwhAwsCQCADQQFIDQAgAkEUaigCACEEIAAoAgwhBSACKAIAIQZBACEHIAAoAggiCEEBSCEJ
QQAhCgNAAkAgCQ0AIAYgBCAKbEECdGoqAgAhCyAAKAIQQQJ0IQwgASgCEEECdCENIAAoAgAgACgC
FCAHbGohAiABKAIAIQNBACEOA0AgAiALIAMqAgCUOAIAIAIgDGohAiADIA1qIQMgDkEBaiIOIAhI
DQALCyAHQQRqIQcgCkEBaiIKIAVIDQALCyAAC70BAwF/AX0DfwJAAkAgACgCDEEBRw0AIAEoAgxB
AUcNACAAKAIIIgIgASgCCEYNAQtB+I6AgAAQgICAgAAgASgCCCECCwJAAkAgAkEBTg0AQwAAAAAh
AwwBCyABKAIQQQJ0IQQgACgCEEECdCEFIAEoAgghBiABKAIAIQEgACgCACEAQwAAAAAhA0EAIQID
QCADIAAqAgAgASoCAJSSIQMgASAEaiEBIAAgBWohACACQQFqIgIgBkgNAAsLIAMLggEEAX8BfQJ/
AX0CQCAAKAIMQQFGDQBBn4+AgAAQgICAgAALAkACQCAAKAIIIgFBAU4NAEMAAAAAIQIMAQsgACgC
EEECdCEDIAAoAgAhAEEAIQRDAAAAACECA0AgAiAAKgIAIgUgBZSSIQIgACADaiEAIARBAWoiBCAB
SA0ACwsgApELsQIBBX8CQCACKAIIIgMgAigCDCIETg0AQcaPgIAAEICAgIAACwJAAkAgACgCCCAD
Rw0AIAAoAgwgA0cNACABKAIIIANHDQAgASgCDCAERg0BC0Hlj4CAABCAgICAAAsgBEECdEGfkYCA
ABCFgICAACEFAkACQCAEQQFIDQBBACEGIAUhBwNAIAcgAyAGakEBEJKAgIAANgIAIAdBBGohByAE
IAZBf2oiBmoNAAsgAyAEIAUgASACEK2AgIAAIAMgBCAFIAAQroCAgAAgBEEBaiEHIARBAnQgBWpB
fGohBgNAIAYoAgAQl4CAgAAaIAZBfGohBiAHQX9qIgdBAUoNAAwCCwsgAyAEIAUgASACEK2AgIAA
IAMgBCAFIAAQroCAgAALIAVBlZKAgAAQh4CAgAAaC5AEAgl/An0CQCAAIAFODQBBupGAgAAQgICA
gAALAkACQCAEKAIIIABHDQAgBCgCDCABRw0AIAMoAgggAEcNACADKAIMIAFGDQELQdiRgIAAEICA
gIAACxCWgICAACEFEJaAgIAAIQYQloCAgAAhBxCWgICAACEIIABBAWoiCSABQQFqIgoQkoCAgAAh
CyAJIAoQkoCAgAAhDCADIAQQlYCAgAAaAkAgAUEBSA0AIAFBf2ohDSAAQX9qIQpBACEAA0AgBSAD
IAAgCiAAIAAQmoCAgAAiBCgCACoCACEOIAIoAgAgBBCVgICAABogBBCrgICAACEPIAIoAgAiBCgC
ACIJIA8gDkMAAAAAYCAOQwAAAABda7KUIAkqAgCSOAIAAkAgBBCrgICAACIOi7tEje21oPfGsD5j
DQAgAigCACIEIARDAACAPyAOlRCggICAABogBiADIAAgCiAAIA0QmoCAgAAhBCAHIAtBASACKAIA
KAIMQQEgBCgCDBCagICAACACKAIAIAQQpoCAgAAhCSAEIAggDEEBIAIoAgAoAghBASAEKAIMEJqA
gIAAIAIoAgAgCRCpgICAAEMAAADAEKiAgIAAGgsgAkEEaiECIAEgAEEBaiIARw0ACwsgDBCXgICA
ABogCxCXgICAABogCBCXgICAABogBxCXgICAABogBhCXgICAABogBRCXgICAABoL8gICCH8BfQJA
AkAgAygCCCAARw0AIAMoAgwiBCAARg0BIAQgAUYNAQtB9pGAgAAQgICAgAALEJaAgIAAIQUQloCA
gAAhBiADEJyAgIAAGgJAIAMoAgwiB0EBSA0AIAMoAgAgA0EUaigCACADKAIQaiIIIAdBf2psQQJ0
aiEEIAdBAWohCUEAIAhBAnRrIQgDQCAEQYCAgPwDNgIAIAQgCGohBCAJQX9qIglBAUoNAAsgB0EB
SA0AIAFBAWohCiAAQX9qIQAgAUECdCACakF8aiELQQAhAgNAIAUgA0EAIAAgAiACEJqAgIAAIQcg
CyEEIAohCQJAIAFBAUgNAANAIAYgByAJQX5qIABBAEEAEJqAgIAAIQggBCgCACAIEKqAgIAAIQwg
CCAEKAIAIAxDAAAAwJQQqICAgAAaIARBfGohBCAJQX9qIglBAUoNAAsLIAJBAWoiAiADKAIMSA0A
CwsgBhCXgICAABogBRCXgICAABoLlwMBB38CQCACKAIIIgMgAigCDCIETg0AQYSQgIAAEICAgIAA
CwJAAkAgACgCCCADRw0AIAAoAgwgBEcNACABKAIIIARHDQAgASgCDCAERg0BC0GjkICAABCAgICA
AAsQloCAgAAhBSADIAQQkoCAgAAhBiAEQQJ0QZ+RgIAAEIWAgIAAIQcCQAJAIARBAUgNAEEAIQgg
ByEJA0AgCSADIAhqQQEQkoCAgAA2AgAgCUEEaiEJIAQgCEF/aiIIag0ACyADIAQgByAGIAIQrYCA
gAAgAyAEIAcgABCugICAACABIAUgBkEAIARBf2oiCEEAIAgQmoCAgAAQlYCAgAAaIARBAWohCSAE
QQJ0IAdqQXxqIQgDQCAIKAIAEJeAgIAAGiAIQXxqIQggCUF/aiIJQQFKDQAMAgsLIAMgBCAHIAYg
AhCtgICAACADIAQgByAAEK6AgIAAIAEgBSAGQQAgBEF/aiIIQQAgCBCagICAABCVgICAABoLIAdB
lZKAgAAQh4CAgAAaIAYQl4CAgAAaIAUQl4CAgAAaC+QDAQp/AkAgASgCCCIEIAEoAgwiBU4NAEHC
kICAABCAgICAAAsCQAJAIAIoAgggBEcNACACKAIMQQFHDQAgACgCCCAFRw0AIAAoAgxBAUYNAQtB
4ZCAgAAQgICAgAALIAQgBRCSgICAACEGIARBARCSgICAACEHIARBARCSgICAACEIIAVBARCSgICA
ACEJIAVBAnRBn5GAgAAQhYCAgAAhCgJAIAVBAUgNACAEIQsgCiEMIAUhDQNAIAwgC0EBEJKAgIAA
NgIAIAtBf2ohCyAMQQRqIQwgDUF/aiINDQALCyAEIAUgCiAGIAEQrYCAgAAgBCAFIAogByACELGA
gIAAIAAgBiAHELKAgIAAAkAgA0EBSA0AIANBAWohCwNAIAggAiAHIAEgABCigICAABCfgICAABog
BCAFIAogByAIELGAgIAAIAkgBiAHELKAgIAAIAAgCUMAAIA/EKiAgIAAGiALQX9qIgtBAUoNAAsL
AkAgBUEBSA0AIAVBAWohDCAFQQJ0IApqQXxqIQsDQCALKAIAEJeAgIAAGiALQXxqIQsgDEF/aiIM
QQFKDQALCyAKQZWSgIAAEIeAgIAAGiAJEJeAgIAAGiAIEJeAgIAAGiAHEJeAgIAAGiAGEJeAgIAA
GiAAC+MCAwh/AX0BfwJAAkAgAygCCCAARw0AIAMoAgxBAUcNACAEKAIIIABHDQAgBCgCDEEBRg0B
C0GukoCAABCAgICAAAsgAyAEEJWAgIAAGgJAIAFBAUgNAEEAIQUgACEGQQAhBwNAAkAgByAATiII
DQAgAygCECIEQQJ0IQkgAygCACAEIAVsaiEEIAIgB0ECdGoiCigCACILKAIQQQJ0IQwgCygCACEL
QwAAAAAhDSAGIQ4DQCANIAsqAgAgBCoCAJSSIQ0gBCAJaiEEIAsgDGohCyAOQX9qIg4NAAsgCA0A
IA0gDZIhDSADKAIQIgRBAnQhCSADKAIAIAQgBWxqIQQgCigCACILKAIQQQJ0IQwgCygCACELIAYh
DgNAIAQgBCoCACANIAsqAgCUkzgCACAEIAlqIQQgCyAMaiELIA5Bf2oiDg0ACwsgBUEEaiEFIAZB
f2ohBiAHQQFqIgcgAUcNAAsLC7IDAwx/An0DfwJAIAEoAggiAyABKAIMIgRODQBBzZKAgAAQgICA
gAALAkACQCAAKAIIIARHDQAgACgCDEEBRw0AIAIoAgggA0cNACACKAIMQQFGDQELQeySgIAAEICA
gIAACwJAIARBAUgNAEEAIQVBACABQRRqKAIAIgNBAnQiBiABKAIQIgdBAnRqayEIIAEoAgAiCSAD
IARsIAcgBEF/amxqQQJ0aiEKIARBAnQhCyADIAdqIQwgBCENA0ACQCAJIAwgDUF/aiIObEECdGoq
AgAiD4u7RI3ttaD3xrA+Y0EBcw0AIABBACoCgIiAgAAQm4CAgAAaDwsgAigCACACKAIQIA5sQQJ0
aioCACEQAkACQCANIARIDQAgACgCECERIAAoAgAhEgwBCyAAKAIQIhFBAnQhEyAAKAIAIhIgESAL
bGohASAKIQMgBSEHA0AgECADKgIAIAEqAgCUkyEQIAEgE2ohASADIAZqIQMgB0F/aiIHDQALCyAS
IBEgDmxBAnRqIBAgD5U4AgAgC0F8aiELIAogCGohCiAFQQFqIQUgDUEBSiEBIA4hDSABDQALCwvC
AwEKfwJAAkAgACgCCCICIAAoAgxHDQAgAiABKAIIIgNHDQAgAyABKAIMRg0BC0GAkYCAABCAgICA
ACAAKAIMIQILIAIgAhCUgICAACEEIAIgAhCSgICAACEFIAJBARCSgICAACEGEJaAgIAAIQcQloCA
gAAhCCACQQJ0QZ+RgIAAEIWAgIAAIQkCQAJAIAJBAUgNACAJIQMgAiEKA0AgAyAKQQEQkoCAgAA2
AgAgA0EEaiEDIApBf2oiCg0ACyACIAIgCSAFIAEQrYCAgAAgAkEBSA0BIAJBf2ohCkEAIQMDQCAH
IARBACAKIAMgAxCagICAACEBIAggAEEAIAogAyADEJqAgIAAIQsgAiACIAkgBiABELGAgIAAIAsg
BSAGELKAgIAAIAIgA0EBaiIDRw0ACyACQQFIDQEgAkEBaiEKIAJBAnQgCWpBfGohAwNAIAMoAgAQ
l4CAgAAaIANBfGohAyAKQX9qIgpBAUoNAAwCCwsgAiACIAkgBSABEK2AgIAACyAJQZWSgIAAEIeA
gIAAGiAIEJeAgIAAGiAHEJeAgIAAGiAGEJeAgIAAGiAFEJeAgIAAGiAEEJeAgIAAGiAAC9YCAQJ/
AkACQCAAKAIIQQNHDQAgACgCDEEDRw0AIAEoAghBAkcNACABKAIMQQRHDQAgAigCCEECRw0AIAIo
AgxBBEYNAQtBi5OAgAAQgICAgAALIAAgASgCACIDKgIAuyADIAEoAhAiBEECdGoqAgC7IAMgAUEU
aigCACIBQQJ0aioCALsgAyABIARqQQJ0aioCALsgAyABQQN0aioCALsgAyABQQF0IARqQQJ0aioC
ALsgAyABQQNsIgFBAnRqKgIAuyADIAEgBGpBAnRqKgIAuyACKAIAIgMqAgC7IAMgAigCECIEQQJ0
aioCALsgAyACQRRqKAIAIgFBAnRqKgIAuyADIAEgBGpBAnRqKgIAuyADIAFBA3RqKgIAuyADIAFB
AXQgBGpBAnRqKgIAuyADIAFBA2wiAUECdGoqAgC7IAMgASAEakECdGoqAgC7ELWAgIAAIAAL9QoC
FnwDf0EAKgKAiICAALshEQJAAkAgAiAEoSISIAWiIAQgBqEiEyABoiAGIAKhIhQgA6KgoCAKIAyh
IhUgDaIgDCAOoSIWIAmiIA4gCqEgC6KgoKJEAAAAAAAAAABjDQAgEyAHoiAGIAihIhcgA6IgCCAE
oSIYIAWioKAgFiAPoiAOIBChIhkgC6IgECAMoSANoqCgokQAAAAAAAAAAGMNACASIAeiIAQgCKEg
AaIgCCACoSITIAOioKAgFSAPoiAMIBChIAmiIBAgCqEiEiALoqCgokQAAAAAAAAAAGMNACACIAah
IAeiIBcgAaIgEyAFoqCgIAogDqEgD6IgGSAJoiASIA2ioKCiRAAAAAAAAAAAYw0AIAQgAqEiGiAH
IAGhIheiIAMgAaEiGyAToqEiHJkiHUSN7bWg98awPmMNACAUIBeiIAUgAaEiHiAToqEiH5kiIESN
7bWg98awPmMNACAbIBSiIBogHqKhIhSZIiFEje21oPfGsD5jDQAgBiAEoSAHIAOhoiAFIAOhIBii
oZlEje21oPfGsD5jDQAgHCAFoiIYIB8gA6KhIiIgFCAIoiAcIAaiIh6gIiOiIB4gHyAEoqEiHiAU
IAeiIBigIhiioSIkmUSN7bWg98awPmMNACAcmiIlIBShIiYgIqIgHyAcoSIiIBiioUQAAAAAAADw
PyAkoyIkoiEYICIgI6IgJiAeoqEgJKIhHgJAAkAgHSAgZEEBcw0AIBMgGCAEoiAeIAOiRAAAAAAA
APA/oKAiBKIgJaMhHSAcIR8MAQsgEyAYIAaiIB4gBaJEAAAAAAAA8D+goCIEoiAfmqMhHQsgFyAE
oiAfoyETAkACQCAhICWZZEEBcw0AIBogGCAGoiAeIAWiRAAAAAAAAPA/oKAiBKIgFJqjIQcMAQsg
GiAYIAiiIB4gB6JEAAAAAAAA8D+goCIEoiAcoyEHICUhFAsgGCAdmiABoiATIAKioSIXIAeioiAd
IBsgBKIgFKMiFKIgHiATIAeaIAGiIBQgAqKhIhyioqCgIBMgB6KhIBggHSAcoqKhIB4gFyAUoqKh
mUSN7bWg98awPmMNACALIA2hIhsgECAOoSIaoiAWIA8gDaEiH6KhIiCZRI3ttaD3xrA+Yw0AIBEh
BCARIQIgESEGIBEhDiARIQEgESEDIBEhBSARIQggGyAVIBmgIhWiIBYgCSALoSANIA+hoCIZoqFE
AAAAAAAA8D8gIKMiFqIiDSAMIAqhIBogGaIgHyAVoqEgFqIiFiAMoqAiDCAJoqIgCyAJoSAWIAui
oCILIBIgDSAQoqAiEKIgFiAPIAmhIA0gD6KgIg8gCqKioKAgDyAMoqEgDSALIAqioqEgFiAQIAmi
oqGZRI3ttaD3xrA+Yw0BIBYgF6IgDSAcoqBEAAAAAAAA8D+gIQUgGCAWIBOiIA0gFKKgoCEDIB4g
FiAdoiANIAeioKAhASAMIBeiIBAgHKKgIAqgIQ4gGCAKoiAMIBOiIBAgFKKgoCEGIB4gCqIgDCAd
oiAQIAeioKAhAiALIBeiIA8gHKKgIAmgIQQgGCAJoiALIBOiIA8gFKKgoCERIB4gCaIgCyAdoiAP
IAeioKAhCAwBCyARIQQgESECIBEhBiARIQ4gESEBIBEhAyARIQUgESEICyAAKAIAIicgCLY4AgAg
JyAAQRRqKAIAIihBAnRqIBG2OAIAICcgKEEDdGogBLY4AgAgJyAAKAIQIgBBAnRqIAK2OAIAICcg
ACAoaiIpQQJ0aiAGtjgCACAnIAAgKEEBdGpBAnRqIA62OAIAICcgAEEDdGogAbY4AgAgJyAoIABB
AXRqQQJ0aiADtjgCACAnIClBA3RqIAW2OAIAC7oHAhZ/Cn0CQAJAIAAoAghBA0cNACAAKAIMQQNH
DQAgASgCCEECRw0AIAEoAgwiA0EESA0AIAIoAghBAkcNACACKAIMIANGDQELQbKTgIAAEICAgIAA
IAEoAgwhAwsgA0EBdCIEQQgQkoCAgAAhBSAEQQEQkoCAgAAhBkEIQQEQkoCAgAAhBwJAIANBAUgN
ACAFQRRqKAIAIgRBDGwgBSgCECIIQQJ0IglqIQogBEEEdCAJaiELIARBFGwgCWohDCAEQRhsIg0g
CWohDiAEQRxsIg8gCWohECACKAIQQQJ0IREgASgCEEECdCESIAhBA3QhCCAGKAIQIglBA3QhEyAJ
QQJ0IRQgAkEUaigCAEECdCEVIAFBFGooAgBBAnQhFiAEQQN0IRcgBEECdCEYIAYoAgAhCSAFKAIA
IQQgAigCACECIAEoAgAhAQNAIAIgEWoqAgAhGSABIBJqKgIAIRogAioCACEbIAQgASoCACIcOAIA
IAQgGGogGjgCACAEIBdqQYCAgPwDNgIAIAQgCmogHDgCACAEIAtqIBo4AgAgBCAMakGAgID8AzYC
ACAEIA1qIBsgHIwiHJQ4AgAgBCAOaiAZIByUOAIAIAQgD2ogGyAajCIalDgCACAEIBBqIBkgGpQ4
AgAgCSAbOAIAIAkgFGogGTgCACACIBVqIQIgASAWaiEBIAQgCGohBCAJIBNqIQkgA0F/aiIDDQAL
CyAHIAUgBkEDELCAgIAAGgJAAkAgBygCACIEKgIAIhkgBCAHKAIQIglBBHRqKgIAIhqUIAQgCUEC
dGoqAgAiGyAEIAlBFGxqKgIAIhyUIAQgCUEYbGoqAgAiHZSSIAQgCUEDdGoqAgAiHiAEIAlBDGxq
KgIAIh+UIAQgCUEcbGoqAgAiIJSSIBsgH5STIBkgHJQgIJSTIB4gGpQgHZSTIiEQg4CAgAANAEMA
AIA/ISIgIYu7RI3ttaD3xrA+Y0EBcw0BC0EAKgKAiICAACIZIRsgGSEeIBkhHyAZIRogGSEcIBkh
HSAZISAgGSEiCyAAKAIAIgQgGTgCACAEIABBFGooAgAiCUECdGogGzgCACAEIAlBA3RqIB44AgAg
BCAAKAIQIgJBAnRqIB84AgAgBCACIAlqIgFBAnRqIBo4AgAgBCACIAlBAXRqQQJ0aiAcOAIAIAQg
AkEDdGogHTgCACAEIAkgAkEBdGpBAnRqICA4AgAgBCABQQN0aiAiOAIAIAcQl4CAgAAaIAYQl4CA
gAAaIAUQl4CAgAAaIAALnwgKAX8BfQF/An0Bfwp9AX8BfQN/AX0CQAJAIAAoAghBA0cNACAAKAIM
QQNHDQAgASgCCEECRw0AIAEoAgxBBEcNACACKAIIQQJHDQAgAigCDEEERg0BC0HZk4CAABCAgICA
AAsgACABKAIAIgMqAgAiBCAEIAMgAUEUaigCACIFQQJ0aioCACIGkiADIAVBA3RqKgIAIgeSIAMg
BUEDbCIIQQJ0aioCACIJkkMAAIA+lCIKkyIEQwAAAEEgAyAIIAEoAhAiAWpBAnRqKgIAIgsgCyAD
IAFBAnRqKgIAIgwgAyAFIAFqQQJ0aioCACINkiADIAVBAXQgAWpBAnRqKgIAIg6SkkMAAIA+lCIP
kyILIAuUIAkgCpMiCSAJlCAOIA+TIg4gDpQgByAKkyIHIAeUIA0gD5MiDSANlCAGIAqTIgYgBpQg
BCAElCAMIA+TIgwgDJSSkpKSkpKSlZEiBJS7IAwgBJS7IAYgBJS7IA0gBJS7IAcgBJS7IA4gBJS7
IAkgBJS7IAsgBJS7IAIoAgAiAyoCACILIAsgAyACQRRqKAIAIgVBAnRqKgIAIhCSIAMgBUEDdGoq
AgAiDJIgAyAFQQNsIghBAnRqKgIAIg2SQwAAgD6UIgmTIgtDAAAAQSADIAggAigCECIBakECdGoq
AgAiDiAOIAMgAUECdGoqAgAiESADIAUgAWpBAnRqKgIAIhKSIAMgBUEBdCABakECdGoqAgAiBpKS
QwAAgD6UIg6TIgcgB5QgDSAJkyINIA2UIAYgDpMiBiAGlCAMIAmTIgwgDJQgEiAOkyISIBKUIBAg
CZMiECAQlCALIAuUIBEgDpMiESARlJKSkpKSkpKVkSILlLsgESALlLsgECALlLsgEiALlLsgDCAL
lLsgBiALlLsgDSALlLsgByALlLsQtYCAgAAgACgCACIDIABBFGooAgAiBUEBdCICIAAoAhAiAUEB
dCIIakECdGoqAgAhECADIAggBWpBAnRqIggqAgAhByADIAIgAWpBAnRqIgIqAgAhESADIAVBA3Rq
IhMqAgAhFCADIAUgAWoiFUECdGoiFioCACEGIAMgBUECdGoiBSoCACEMIAMgAUECdGoiFyoCACES
IAMgBCAJIAMgAUEDdGoiASoCACINlCADKgIAIhhDAACAPyALlSILlJKUOAIAIBcgBCAOIA2UIBIg
C5SSlDgCACABIAQgDZQ4AgAgBSAEIAkgB5QgDCALlJKUOAIAIBYgBCAOIAeUIAYgC5SSlDgCACAI
IAQgB5Q4AgAgEyAUIAQgCiAYlCAPIAyUkpSTIAuUIAkgECAEIAogDZQgDyAHlJKUkyIHlJI4AgAg
AiARIAQgCiASlCAPIAaUkpSTIAuUIA4gB5SSOAIAIAMgFUEDdGogBzgCACAAC5sCAQZ/AkACQCAA
KAIIQQNHDQAgACgCDEEDRw0AIAEoAghBAkcNACABKAIMIgNBBEgNACACKAIIQQJHDQAgAigCDCAD
Rg0BC0GAlICAABCAgICAACABKAIMIQMLQQIgAxCSgICAACEEQQIgAxCSgICAACEFQQNBAxCSgICA
ACEGQQNBAxCSgICAACEHQQNBAxCSgICAACEIIAQgASAGQQNBAxCSgICAACIDEMGAgIAAIAUgAiAD
IAcQwYCAgAAgAyAIIAQgBRC2gICAACIBIAYQp4CAgAAaIAAgByADEKeAgIAAGiADEJeAgIAAGiAB
EJeAgIAAGiAHEJeAgIAAGiAGEJeAgIAAGiAFEJeAgIAAGiAEEJeAgIAAGiAAC/kFAhZ/Bn0CQAJA
IAAoAghBAkcNACAAKAIMQQNHDQAgASgCCEECRw0AIAEoAgwiA0EDSA0AIAIoAghBAkcNACACKAIM
IANGDQELQaeUgIAAEICAgIAAIAEoAgwhAwsgA0EBdCIEQQYQkoCAgAAhBSAEQQEQkoCAgAAhBkEG
QQEQkoCAgAAhBwJAIANBAUgNACAFQRRqKAIAIgRBDGwgBSgCECIIQQJ0IglqIQogBEEEdCAJaiEL
IARBFGwgCWohDCACKAIQQQJ0IQ0gASgCEEECdCEOIAhBA3QhDyAGKAIQIglBA3QhECAJQQJ0IREg
AkEUaigCAEECdCESIAFBFGooAgBBAnQhEyAEQQN0IRQgBEECdCEVIAYoAgAhCSAFKAIAIQQgAigC
ACECIAEoAgAhAQNAIAIgDWooAgAhFiABIA5qKAIAIQggAigCACEXIAQgASgCACIYNgIAIAQgFWog
CDYCACAEIBRqQYCAgPwDNgIAIAQgCmogGDYCACAEIAtqIAg2AgAgBCAMakGAgID8AzYCACAJIBc2
AgAgCSARaiAWNgIAIAIgEmohAiABIBNqIQEgBCAPaiEEIAkgEGohCSADQX9qIgMNAAsLIAcgBSAG
QQMQsICAgAAaAkACQCAHKAIAIgQqAgAiGSAEIAcoAhAiCUECdGoqAgAiGpIgBCAJQQN0aioCACIb
kiAEIAlBDGxqKgIAIhySIAQgCUEEdGoqAgAiHZIgBCAJQRRsaioCACIekhCDgICAAA0AIBkgHZQg
GiAclJOLu0SN7bWg98awPmNBAXMNAQtBACoCgIiAgAAiGSEaIBkhGyAZIRwgGSEdIBkhHgsgACgC
ACIEIBk4AgAgBCAAQRRqKAIAIglBAnRqIBo4AgAgBCAJQQN0aiAbOAIAIAQgACgCECICQQJ0aiAc
OAIAIAQgAiAJakECdGogHTgCACAEIAIgCUEBdGpBAnRqIB44AgAgBxCXgICAABogBhCXgICAABog
BRCXgICAABogAAvNBQMBfAJ/FXwCQAJAIAAoAghBAkcNACAAKAIMQQNHDQAgASgCCEECRw0AIAEo
AgxBA0cNACACKAIIQQJHDQAgAigCDEEDRg0BC0HKlICAABCAgICAAAtBACoCgIiAgAC7IQMCQAJA
IAEoAgAiBCABKAIQIgVBAnRqKgIAuyIGIAQgAUEUaigCACIBIAVqQQJ0aioCALsiB6EiCCAEIAFB
A3RqKgIAuyIJoiAHIAQgAUEBdCAFakECdGoqAgC7IgqhIgsgBCoCALsiDKIgCiAGoSINIAQgAUEC
dGoqAgC7Ig6ioKAiD5lEje21oPfGsD5jDQAgAigCACIEIAIoAhAiBUECdGoqAgC7IhAgBCACQRRq
KAIAIgEgBWpBAnRqKgIAuyIRoSAEIAFBA3RqKgIAuyISoiARIAQgAUEBdCAFakECdGoqAgC7IhOh
IAQqAgC7IhSiIBMgEKEgBCABQQJ0aioCALsiFaKgoJlEje21oPfGsD5jDQBEAAAAAAAA8D8gD6Mi
FiALIBSiIA0gFaKgIAggEqKgoiIPIBYgCSAOoSIXIBCiIAwgCaEiGCARoqAgDiAMoSIZIBOioKIi
GqIgFiAXIBSiIBggFaKgIBkgEqKgoiIXIBYgCyAQoiANIBGioCAIIBOioKIiCKKhmUSN7bWg98aw
PmNBAXNFDQAgFiAOIAqiIAcgCaKhIgMgEKIgBiAJoiAMIAqioSIKIBGioCAMIAeiIAYgDqKhIgcg
E6KgoiEGIBYgAyAUoiAKIBWioCAHIBKioKIhAwwBCyADIQ8gAyEXIAMhCCADIRogAyEGCyAAKAIA
IgQgD7Y4AgAgBCAAQRRqKAIAIgFBAnRqIBe2OAIAIAQgAUEDdGogA7Y4AgAgBCAAKAIQIgVBAnRq
IAi2OAIAIAQgBSABakECdGogGrY4AgAgBCAFIAFBAXRqQQJ0aiAGtjgCACAAC4EDAQl/AkACQCAA
KAIIQQJHDQAgACgCDEEDRw0AIAEoAghBAkcNACABKAIMIgNBA0gNACACKAIIQQJHDQAgAigCDCAD
Rg0BC0HtlICAABCAgICAACABKAIMIQMLQQIgAxCSgICAACEEQQIgAxCSgICAACEFQQNBAxCSgICA
ACEGQQNBAxCSgICAACEHQQNBAxCUgICAACEIEJaAgIAAIAhBAEEBQQBBAhCagICAACEJQQNBAxCS
gICAACEDQQNBAxCSgICAACEKEJaAgIAAIApBAEEBQQBBAhCagICAACELIAQgASAGIAMQwYCAgAAg
BSACIAMgBxDBgICAACAJIAQgBRC5gICAACEBIAMgCCAGEKeAgIAAGiAKIAcgAxCngICAABogACAL
EJWAgIAAGiALEJeAgIAAGiAKEJeAgIAAGiADEJeAgIAAGiABEJeAgIAAGiAIEJeAgIAAGiAHEJeA
gIAAGiAGEJeAgIAAGiAFEJeAgIAAGiAEEJeAgIAAGiAAC5kUAhx/DX0jgICAgABBEGsiBySAgICA
AAJAAkAgACgCCEEDRw0AIAAoAgxBA0cNACACKAIIQQJHDQAgAigCDCIIQQRIDQAgAygCCEECRw0A
IAMoAgwgCEcNAAJAIAFFDQAgASgCCEEBRw0BIAEoAgwgCEcNAQsgBEEBSA0AIAVBAUgNACAGQwAA
AABgDQELQZCVgIAAEICAgIAAIAIoAgwhCAsCQCABRQ0AIAFDAAAAABCbgICAABoLIAhBAnQiCUGy
lYCAABCFgICAACEKIAlB0ZWAgAAQhYCAgAAgCBCNgICAACILIAhBBBCOgICAACAIIARBAnQiDCAI
b2sgDGoiDUECdEHwlYCAABCFgICAACEOAkAgDUEBSA0AQQAhDyAIQQFIIRAgDiERA0ACQCAQDQBB
ACEMIBEhEgNAIBIgDDYCACASQQRqIRIgCCAMQQFqIgxHDQALCyAOIA9BAnRqIAhBBBCOgICAACAR
IAlqIREgDyAIaiIPIA1IDQALC0ECQQQQkoCAgAAhE0ECQQQQkoCAgAAhFCAEQQN0QY+WgIAAEIWA
gIAAIRUgBCEWAkAgBEEBSA0AIBUhFyAOIQkgBCEYIAQhFgNAIAcgCSgCACIZNgIAIAcgCUEEaigC
ACIaNgIEIAcgCUEIaigCACIbNgIIIAcgCUEMaigCADYCDCAUKAIUIQ0gEygCFCEQIAMoAhAhHCAU
KAIQIR0gFCgCACEMIAMoAgAhEiADKAIUIR4gAigCECEfIBMoAhAhICATKAIAIg8gAigCACIRIBkg
AigCFCIhbCIiQQJ0aigCADYCACAPICBBAnRqIBEgHyAiakECdGooAgA2AgAgDCASIB4gGWwiGUEC
dGooAgA2AgAgDCAdQQJ0aiASIBwgGWpBAnRqKAIANgIAIA8gEEECdGogESAhIBpsIhlBAnRqKAIA
NgIAIA8gICAQakECdGogESAfIBlqQQJ0aigCADYCACAMIA1BAnRqIBIgHiAabCIZQQJ0aigCADYC
ACAMIB0gDWpBAnRqIBIgHCAZakECdGooAgA2AgAgDyAQQQN0aiARICEgG2wiGUECdGooAgA2AgAg
DyAgIBBBAXRqQQJ0aiARIB8gGWpBAnRqKAIANgIAIAwgDUEDdGogEiAeIBtsIhlBAnRqKAIANgIA
IAwgHSANQQF0akECdGogEiAcIBlqQQJ0aigCADYCACAPIBBBA2wiEEECdGogESAhIAcoAgwiGWwi
IUECdGooAgA2AgAgDyAgIBBqQQJ0aiARIB8gIWpBAnRqKAIANgIAIAwgDUEDbCIPQQJ0aiASIB4g
GWwiEUECdGooAgA2AgAgDCAdIA9qQQJ0aiASIBwgEWpBAnRqKAIANgIAQQNBAxCSgICAACEMIBdB
BGoiEkEANgIAIBcgDDYCACAMIBMgFBC0gICAABoCQCAXKAIAKAIAKgIAEIOAgIAARQ0AIBJBfzYC
ACAWQX9qIRYLIBdBCGohFyAJQRBqIQkgGEF/aiIYDQALCwJAAkAgFg0AIABBACoCgIiAgAAQm4CA
gAAaDAELIAYgBpQhI0EAIRcgFSAEQQhBhICAgABBABCLgICAABoCQAJAIAhBAUgNAEEAIRwDQCAc
IhJBAWoiHCAFbyEMAkAgFkECSA0AIAwNACAVIBZBCEGEgICAAEEAEIuAgIAAGiAWQQF2IRYLAkAg
FkEBRw0AQQAhFwwDCwJAIBZBAUgNACADKAIAIgwgAygCFCALIBJBAnRqKAIAIhJsIg9BAnRqKgIA
ISQgAigCACIRIAIoAhQgEmwiEkECdGoqAgAhBiAMIA8gAygCEGpBAnRqKgIAISUgESASIAIoAhBq
QQJ0aioCACEmIBUhESAWIQkDQCARQQRqIgwgDCgCACARKAIAIg8oAgAiDCAPQRRqKAIAIhJBAXQi
DSAPKAIQIg9qQQJ0aioCACAGIAwgD0ECdGoqAgCUICYgDCASIA9qQQJ0aioCAJSSkiAMIA0gD0EB
dCIQakECdGoqAgAgBiAMIA9BA3RqKgIAlCAmIAwgECASakECdGoqAgCUkpIiJ5UgJZMiKCAolCAM
IBJBA3RqKgIAIAYgDCoCAJQgJiAMIBJBAnRqKgIAlJKSICeVICSTIicgJ5SSICNfajYCACARQQhq
IREgCUF/aiIJDQALCyAcIAhHDQALCyAWQQJIDQAgFUEMaiEMQQAhF0EBIRIDQCASIBcgDCgCACAV
IBdBA3RqKAIEShshFyAMQQhqIQwgFiASQQFqIhJHDQALCwJAIAhBAUgNACAVIBdBA3RqKAIAIg8o
AgAiDCAPKAIQIhJBA3RqKgIAISQgDCASQQJ0aioCACElIAwgD0EUaigCACIPQQN0aioCACEpIAwg
D0ECdGoqAgAhKiAMIBJBAXQiESAPakECdGoqAgAhKyAMIA8gEmpBAnRqKgIAISwgDCAPQQF0Ig8g
EWpBAnRqKgIAIS0gDCAPIBJqQQJ0aioCACEuIAwqAgAhLyADKAIAIQ8gAigCACERQQAhEkEAIQwD
QAJAICkgLyARIAIoAhQgDGwiCUECdGoqAgAiBpQgKiARIAkgAigCEGpBAnRqKgIAIiaUkpIgLSAk
IAaUICsgJpSSkiInlSAPIAMoAhQgDGwiCUECdGoqAgCTIiggKJQgLiAlIAaUICwgJpSSkiAnlSAP
IAkgAygCEGpBAnRqKgIAkyIGIAaUkiAjX0EBcw0AIAogEkECdGogDDYCACASQQFqIRIgAUUNACAB
KAIAIAEoAhQgDGxBAnRqQYCAgPwDNgIACyAIIAxBAWoiDEcNAAsgEkEDTA0AQQIgEhCSgICAACEW
QQIgEhCSgICAACIZKAIQQQJ0IRcgFkEUaigCAEECdCEcIBYoAhBBAnQhHSAZQRRqKAIAQQJ0IR4g
GSgCACEMIANBFGooAgAhHyAWKAIAIQ8gAkEUaigCACEgIAMoAhAhISADKAIAIQggAigCECEDIAIo
AgAhCSAKIREDQCAPIAkgICARKAIAIg1sIhBBAnRqKAIANgIAIA8gHWogCSADIBBqQQJ0aigCADYC
ACAMIAggHyANbCINQQJ0aigCADYCACAMIBdqIAggISANakECdGooAgA2AgAgDCAeaiEMIA8gHGoh
DyARQQRqIREgEkF/aiISDQALIAAgFiAZELiAgIAAGiAZEJeAgIAAGiAWEJeAgIAAGgwBCyAAQQAq
AoCIgIAAEJuAgIAAGgsCQCAEQQFIDQAgBEEBaiESIARBA3QgFWpBeGohDANAIAwoAgAQl4CAgAAa
IAxBeGohDCASQX9qIhJBAUoNAAsLIBVBr5aAgAAQh4CAgAAaIBQQl4CAgAAaIBMQl4CAgAAaIA5B
zZaAgAAQh4CAgAAaIAtB65aAgAAQh4CAgAAaIApBiZeAgAAQh4CAgAAaIAdBEGokgICAgAAgAAsN
ACABKAIEIAAoAgRrC8gRAhh/CX0CQAJAIAAoAghBAkcNACAAKAIMQQNHDQAgAigCCEECRw0AIAIo
AgwiB0EDSA0AIAMoAghBAkcNACADKAIMIAdHDQACQCABRQ0AIAEoAghBAUcNASABKAIMIAdHDQEL
IARBAUgNACAFQQFIDQAgBkMAAAAAYA0BC0Gnl4CAABCAgICAACACKAIMIQcLAkAgAUUNACABQwAA
AAAQm4CAgAAaCyAHQQJ0IghBypeAgAAQhYCAgAAhCSAIQeqXgIAAEIWAgIAAIAcQjYCAgAAiCiAH
QQQQjoCAgAAgByAEQQNsIgsgB29rIAtqIgxBAnRBipiAgAAQhYCAgAAhDQJAIAxBAUgNAEEAIQ4g
B0EBSCEPIA0hEANAAkAgDw0AQQAhCyAQIREDQCARIAs2AgAgEUEEaiERIAcgC0EBaiILRw0ACwsg
DSAOQQJ0aiAHQQQQjoCAgAAgECAIaiEQIA4gB2oiDiAMSA0ACwtBAkEDEJKAgIAAIQ9BAkEDEJKA
gIAAIRIgBEEDdEGqmICAABCFgICAACETIAQhFAJAIARBAUgNACATIQggDSEMIAQhFSAEIRQDQCAP
KAIAIgsgAigCACIRIAIoAhQiFiAMKAIAIhdsIg5BAnRqKAIANgIAIAsgDygCECIYQQJ0aiARIAIo
AhAiGSAOakECdGooAgA2AgAgEigCACIOIAMoAgAiECAXIAMoAhQiGmwiF0ECdGooAgA2AgAgDiAS
KAIQIhtBAnRqIBAgAygCECIcIBdqQQJ0aigCADYCACALIA8oAhQiF0ECdGogESAWIAxBBGooAgAi
HWwiHkECdGooAgA2AgAgCyAYIBdqQQJ0aiARIBkgHmpBAnRqKAIANgIAIA4gEigCFCIeQQJ0aiAQ
IBogHWwiHUECdGooAgA2AgAgDiAbIB5qQQJ0aiAQIBwgHWpBAnRqKAIANgIAIAsgF0EDdGogESAW
IAxBCGooAgAiHWwiFkECdGooAgA2AgAgCyAYIBdBAXRqQQJ0aiARIBkgFmpBAnRqKAIANgIAIA4g
HkEDdGogECAaIB1sIgtBAnRqKAIANgIAIA4gGyAeQQF0akECdGogECAcIAtqQQJ0aigCADYCAEEC
QQMQkoCAgAAhCyAIQQRqIhFBADYCACAIIAs2AgAgCyAPIBIQuoCAgAAaAkAgCCgCACgCACoCABCD
gICAAEUNACARQX82AgAgFEF/aiEUCyAIQQhqIQggDEEMaiEMIBVBf2oiFQ0ACwsCQAJAIBQNACAA
QQAqAoCIgIAAEJuAgIAAGgwBCyAGIAaUIR9BACEMIBMgBEEIQYSAgIAAQQAQi4CAgAAaAkACQCAH
QQFIDQBBACEXA0AgFyIRQQFqIhcgBW8hCwJAIBRBAkgNACALDQAgEyAUQQhBhICAgABBABCLgICA
ABogFEEBdiEUCwJAIBRBAUcNAEEAIQwMAwsCQCAUQQFIDQAgAygCACILIAMoAhQgCiARQQJ0aigC
ACIRbCIOQQJ0aioCACEgIAIoAgAiECACKAIUIBFsIhFBAnRqKgIAIQYgCyAOIAMoAhBqQQJ0aioC
ACEhIBAgESACKAIQakECdGoqAgAhIiATIREgFCEIA0AgEUEEaiILIAsoAgAgESgCACIQKAIAIgsg
EEEUaigCACIOQQN0aioCACAGIAsqAgCUICIgCyAOQQJ0aioCAJSSkiAgkyIjICOUIAsgDkEBdCAQ
KAIQIhBqQQJ0aioCACAGIAsgEEECdGoqAgCUICIgCyAOIBBqQQJ0aioCAJSSkiAhkyIjICOUkiAf
X2o2AgAgEUEIaiERIAhBf2oiCA0ACwsgFyAHRw0ACwsgFEECSA0AIBNBDGohC0EAIQxBASERA0Ag
ESAMIAsoAgAgEyAMQQN0aigCBEobIQwgC0EIaiELIBQgEUEBaiIRRw0ACwsCQCAHQQFIDQAgEyAM
QQN0aigCACIRKAIAIgsgESgCECIOQQJ0aioCACEgIAsgEUEUaigCACIRQQN0aioCACEhIAsgEUEC
dGoqAgAhJCALIBEgDmpBAnRqKgIAISUgCyARQQF0IA5qQQJ0aioCACEmIAsqAgAhJyADKAIAIQ4g
AigCACEQQQAhEUEAIQsDQAJAICEgJyAQIAIoAhQgC2wiCEECdGoqAgAiBpQgJCAQIAggAigCEGpB
AnRqKgIAIiKUkpIgDiADKAIUIAtsIghBAnRqKgIAkyIjICOUICYgICAGlCAlICKUkpIgDiAIIAMo
AhBqQQJ0aioCAJMiBiAGlJIgH19BAXMNACAJIBFBAnRqIAs2AgAgEUEBaiERIAFFDQAgASgCACAB
KAIUIAtsQQJ0akGAgID8AzYCAAsgByALQQFqIgtHDQALIBFBAkwNAEECIBEQkoCAgAAhG0ECIBEQ
koCAgAAiHCgCEEECdCEXIBtBFGooAgBBAnQhHiAbKAIQQQJ0IRQgHEEUaigCAEECdCEWIBwoAgAh
CyADQRRqKAIAIRggGygCACEOIAJBFGooAgAhGSADKAIQIRogAygCACEQIAIoAhAhAyACKAIAIQgg
CSEHA0AgDiAIIBkgBygCACIMbCICQQJ0aigCADYCACAOIBRqIAggAyACakECdGooAgA2AgAgCyAQ
IBggDGwiDEECdGooAgA2AgAgCyAXaiAQIBogDGpBAnRqKAIANgIAIAsgFmohCyAOIB5qIQ4gB0EE
aiEHIBFBf2oiEQ0ACyAAIBsgHBC7gICAABogHBCXgICAABogGxCXgICAABoMAQsgAEEAKgKAiICA
ABCbgICAABoLAkAgBEEBSA0AIARBAWohESAEQQN0IBNqQXhqIQsDQCALKAIAEJeAgIAAGiALQXhq
IQsgEUF/aiIRQQFKDQALCyATQcqYgIAAEIeAgIAAGiASEJeAgIAAGiAPEJeAgIAAGiANQeiYgIAA
EIeAgIAAGiAKQYaZgIAAEIeAgIAAGiAJQaSZgIAAEIeAgIAAGiAAC+IDCAN/An0BfwN9AX8EfQF/
A30CQAJAIAAoAghBAkcNACABKAIIQQJHDQAgACgCDCIDIAEoAgxHDQAgAigCCEEDRw0AIAIoAgxB
A0YNAQtBwpmAgAAQgICAgAAgASgCDCEDCwJAIAIoAgAiBCACKAIQIgVBA3RqKgIAIgYgBCACQRRq
KAIAIgJBAnRqKgIAIgcgBCACQQF0IgggBWpBAnRqKgIAIgmUIAQgAkEDdGoqAgAiCiAEIAIgBWpB
AnRqKgIAIguUk5QgBCAFQQF0IgwgAmpBAnRqKgIAIg0gCiAEIAVBAnRqKgIAIg6UIAQqAgAiDyAJ
lJOUkiAPIAuUIAcgDpSTIAQgCCAMakECdGoqAgAiEJSSi7tEje21oPfGsD5jDQACQCADQQFIDQAg
ACgCEEECdCECIAEoAhBBAnQhCCAAQRRqKAIAQQJ0IQwgAUEUaigCAEECdCERIAAoAgAhBCABKAIA
IQUDQCAEIAogDyAFKgIAIhKUIAcgBSAIaioCACITlJKSIBAgBiASlCANIBOUkpIiFJU4AgAgBCAC
aiAJIA4gEpQgCyATlJKSIBSVOAIAIAQgDGohBCAFIBFqIQUgA0F/aiIDDQALCyAADwsgAEEAKgKA
iICAABCbgICAAAvVAgQDfwZ9An8CfQJAAkAgACgCCEECRw0AIAEoAghBAkcNACAAKAIMIgMgASgC
DEcNACACKAIIQQJHDQAgAigCDEEDRg0BC0HnmYCAABCAgICAACABKAIMIQMLAkAgA0EBSA0AIAIo
AgAiBCACKAIQIgVBAnRqKgIAIQYgBCACQRRqKAIAIgJBA3RqKgIAIQcgBCACQQJ0aioCACEIIAQg
AiAFakECdGoqAgAhCSAEIAJBAXQgBWpBAnRqKgIAIQogBCoCACELIAAoAhBBAnQhAiABKAIQQQJ0
IQUgAEEUaigCAEECdCEMIAFBFGooAgBBAnQhDSAAKAIAIQQgASgCACEBA0AgBCAHIAsgASoCACIO
lCAIIAEgBWoqAgAiD5SSkjgCACAEIAJqIAogBiAOlCAJIA+UkpI4AgAgBCAMaiEEIAEgDWohASAD
QX9qIgMNAAsLIAAL+AcHAX8BfQF/A30DfwF9An8CQAJAAkAgASgCCEECRw0AIAEoAgwiBEEBSA0A
IAAoAghBAkcNACAAKAIMIARHDQAgAigCCEEDRw0AIAIoAgxBA0cNACADKAIIQQNHDQAgAygCDEED
Rw0AIASyIQUMAQtBjJqAgAAQgICAgABBACEGIAEoAgwiBLIhBSAEQQBKDQBDAAAAACEHQwAAAAAg
BZUiCCEJDAELIAEoAhBBAnQhCiABQRRqKAIAQQJ0IQsgASgCACEGQwAAAAAhByAEIQxDAAAAACEN
A0AgByAGKgIAkiEHIA0gBiAKaioCAJIhDSAGIAtqIQYgDEF/aiIMDQALIA0gBZUhCCAHIAWVIQkg
ASgCEEECdCEKIAFBFGooAgBBAnQhCyABKAIAIQZDAAAAACEHIAQhDANAIAcgBioCACAJkyINIA2U
IAYgCmoqAgAgCJMiDSANlJKSIQcgBiALaiEGIAxBf2oiDA0AC0EBIQYLAkAgByAFlZEiB4u7RI3t
taD3xrA+Y0UNACACEJyAgIAAGiADEJyAgIAAGiADKAIAIgZBgICA/AM2AgAgAigCACIMQYCAgPwD
NgIAIAYgA0EUaigCACADKAIQaiIKQQJ0akGAgID8AzYCACAMIAJBFGooAgAgAigCEGoiC0ECdGpB
gICA/AM2AgAgBiAKQQN0akGAgID8AzYCACAMIAtBA3RqQYCAgPwDNgIAIAAgARCVgICAABoPCyAH
Q/MEtT+VIQ1D8wS1PyAHlSEHAkAgBkUNACAAKAIQQQJ0IQogASgCEEECdCELIABBFGooAgBBAnQh
DiABQRRqKAIAQQJ0IQ8gACgCACEGIAEoAgAhDANAIAYgByAMKgIAIAmTlDgCACAGIApqIAcgDCAL
aioCACAIk5Q4AgAgBiAOaiEGIAwgD2ohDCAEQX9qIgQNAAsLIAIoAgAiBiAHOAIAIAYgAkEUaigC
ACIMQQJ0akEANgIAIAYgDEEDdGogCSAHjCIFlDgCACAGIAIoAhAiCkECdGpBADYCACAGIAogDGoi
C0ECdGogBzgCACAGIAogDEEBdGpBAnRqIAggBZQ4AgAgBiAKQQN0akEANgIAIAYgDCAKQQF0akEC
dGpBADYCACAGIAtBA3RqQYCAgPwDNgIAIAMoAgAiBiANOAIAIAYgA0EUaigCACIMQQJ0akEANgIA
IAYgDEEDdGogCTgCACAGIAMoAhAiCkECdGpBADYCACAGIAogDGoiC0ECdGogDTgCACAGIAogDEEB
dGpBAnRqIAg4AgAgBiAKQQN0akEANgIAIAYgDCAKQQF0akECdGpBADYCACAGIAtBA3RqQYCAgPwD
NgIACwv2EgMAQYAIC7ISAAD4f091dCBvZiBtZW1vcnkhAERvdWJsZSBmcmVlAEFzc2VydGlvbiBm
YWlsZWQgYXQgbWF0MzIuYzo2MQBPdXQgb2YgbWVtb3J5IGF0IG1hdDMyLmM6NjMAQXNzZXJ0aW9u
IGZhaWxlZCBhdCBtYXQzMi5jOjg0AE91dCBvZiBtZW1vcnkgYXQgbWF0MzIuYzo4NgBPdXQgb2Yg
bWVtb3J5IGF0IG1hdDMyLmM6ODkAT3V0IG9mIG1lbW9yeSBhdCBtYXQzMi5jOjEzNgAAAGANAAAB
AAAAAAAAAAAAAAABAAAAAQAAAAIAAABEb3VibGUgZnJlZSBhdCBtYXQzMi5jOjE0OQBBc3NlcnRp
b24gZmFpbGVkIGF0IG1hdDMyLmM6MTg0AEFzc2VydGlvbiBmYWlsZWQgYXQgbWF0MzIuYzoxODgA
QXNzZXJ0aW9uIGZhaWxlZCBhdCBtYXQzMi5jOjI3NQBEb3VibGUgZnJlZSBhdCBtYXQzMi5jOjI5
AEFzc2VydGlvbiBmYWlsZWQgYXQgYXJpdGhtZXRpYzMyLmM6MzYAQXNzZXJ0aW9uIGZhaWxlZCBh
dCBhcml0aG1ldGljMzIuYzo1OABBc3NlcnRpb24gZmFpbGVkIGF0IGFyaXRobWV0aWMzMi5jOjgw
AEFzc2VydGlvbiBmYWlsZWQgYXQgYXJpdGhtZXRpYzMyLmM6OTkAQXNzZXJ0aW9uIGZhaWxlZCBh
dCBhcml0aG1ldGljMzIuYzoxMjEAQXNzZXJ0aW9uIGZhaWxlZCBhdCBhcml0aG1ldGljMzIuYzox
NDMAQXNzZXJ0aW9uIGZhaWxlZCBhdCBhcml0aG1ldGljMzIuYzoxNjgAQXNzZXJ0aW9uIGZhaWxl
ZCBhdCBhcml0aG1ldGljMzIuYzoxODkAQXNzZXJ0aW9uIGZhaWxlZCBhdCBhcml0aG1ldGljMzIu
YzoyMTgAQXNzZXJ0aW9uIGZhaWxlZCBhdCBhcml0aG1ldGljMzIuYzoyNzEAQXNzZXJ0aW9uIGZh
aWxlZCBhdCBhcml0aG1ldGljMzIuYzozMjIAQXNzZXJ0aW9uIGZhaWxlZCBhdCBhcml0aG1ldGlj
MzIuYzozNTYAQXNzZXJ0aW9uIGZhaWxlZCBhdCBhcml0aG1ldGljMzIuYzozNzgAQXNzZXJ0aW9u
IGZhaWxlZCBhdCBhcml0aG1ldGljMzIuYzo0MjAAQXNzZXJ0aW9uIGZhaWxlZCBhdCBhcml0aG1l
dGljMzIuYzo0MzYAQXNzZXJ0aW9uIGZhaWxlZCBhdCBxcjMyLmM6MjYxAEFzc2VydGlvbiBmYWls
ZWQgYXQgcXIzMi5jOjI2NQBBc3NlcnRpb24gZmFpbGVkIGF0IHFyMzIuYzoyODYAQXNzZXJ0aW9u
IGZhaWxlZCBhdCBxcjMyLmM6MjkwAEFzc2VydGlvbiBmYWlsZWQgYXQgcXIzMi5jOjMyMQBBc3Nl
cnRpb24gZmFpbGVkIGF0IHFyMzIuYzozMjUAQXNzZXJ0aW9uIGZhaWxlZCBhdCBxcjMyLmM6Mzc5
AE91dCBvZiBtZW1vcnkgYXQgcXIzMi5jOjM2AEFzc2VydGlvbiBmYWlsZWQgYXQgcXIzMi5jOjY5
AEFzc2VydGlvbiBmYWlsZWQgYXQgcXIzMi5jOjczAEFzc2VydGlvbiBmYWlsZWQgYXQgcXIzMi5j
OjE4NABEb3VibGUgZnJlZSBhdCBxcjMyLmM6NTUAQXNzZXJ0aW9uIGZhaWxlZCBhdCBxcjMyLmM6
MTQ4AEFzc2VydGlvbiBmYWlsZWQgYXQgcXIzMi5jOjIyNABBc3NlcnRpb24gZmFpbGVkIGF0IHFy
MzIuYzoyMjgAQXNzZXJ0aW9uIGZhaWxlZCBhdCBob21vZ3JhcGh5MzIuYzoyNDQAQXNzZXJ0aW9u
IGZhaWxlZCBhdCBob21vZ3JhcGh5MzIuYzoyODAAQXNzZXJ0aW9uIGZhaWxlZCBhdCBob21vZ3Jh
cGh5MzIuYzozNTkAQXNzZXJ0aW9uIGZhaWxlZCBhdCBob21vZ3JhcGh5MzIuYzo0NDQAQXNzZXJ0
aW9uIGZhaWxlZCBhdCBhZmZpbmUzMi5jOjExOQBBc3NlcnRpb24gZmFpbGVkIGF0IGFmZmluZTMy
LmM6MTk2AEFzc2VydGlvbiBmYWlsZWQgYXQgYWZmaW5lMzIuYzoyMjkAQXNzZXJ0aW9uIGZhaWxl
ZCBhdCByYW5zYWMzMi5jOjcxAE91dCBvZiBtZW1vcnkgYXQgcmFuc2FjMzIuYzo4NABPdXQgb2Yg
bWVtb3J5IGF0IHJhbnNhYzMyLmM6ODgAT3V0IG9mIG1lbW9yeSBhdCByYW5zYWMzMi5jOjkzAE91
dCBvZiBtZW1vcnkgYXQgcmFuc2FjMzIuYzoxMDcARG91YmxlIGZyZWUgYXQgcmFuc2FjMzIuYzoy
MzYARG91YmxlIGZyZWUgYXQgcmFuc2FjMzIuYzoyNDMARG91YmxlIGZyZWUgYXQgcmFuc2FjMzIu
YzoyNDYARG91YmxlIGZyZWUgYXQgcmFuc2FjMzIuYzoyNDkAQXNzZXJ0aW9uIGZhaWxlZCBhdCBy
YW5zYWMzMi5jOjI3NQBPdXQgb2YgbWVtb3J5IGF0IHJhbnNhYzMyLmM6Mjg4AE91dCBvZiBtZW1v
cnkgYXQgcmFuc2FjMzIuYzoyOTIAT3V0IG9mIG1lbW9yeSBhdCByYW5zYWMzMi5jOjI5NwBPdXQg
b2YgbWVtb3J5IGF0IHJhbnNhYzMyLmM6MzExAERvdWJsZSBmcmVlIGF0IHJhbnNhYzMyLmM6NDM2
AERvdWJsZSBmcmVlIGF0IHJhbnNhYzMyLmM6NDQzAERvdWJsZSBmcmVlIGF0IHJhbnNhYzMyLmM6
NDQ2AERvdWJsZSBmcmVlIGF0IHJhbnNhYzMyLmM6NDQ5AEFzc2VydGlvbiBmYWlsZWQgYXQgdHJh
bnNmb3JtMzIuYzozOQBBc3NlcnRpb24gZmFpbGVkIGF0IHRyYW5zZm9ybTMyLmM6NzcAQXNzZXJ0
aW9uIGZhaWxlZCBhdCB0cmFuc2Zvcm0zMi5jOjExNAAAQbQaCwwIAAAAUA0AAAEAAAAAQcAaCyQA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
`

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Speedy)
/* harmony export */ });
/* harmony import */ var _gpu_speedy_gl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gpu/speedy-gl */ "./src/gpu/speedy-gl.js");
/* harmony import */ var _core_speedy_media__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/speedy-media */ "./src/core/speedy-media.js");
/* harmony import */ var _utils_fps_counter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/fps-counter */ "./src/utils/fps-counter.js");
/* harmony import */ var _core_speedy_vector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/speedy-vector */ "./src/core/speedy-vector.js");
/* harmony import */ var _core_speedy_point__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/speedy-point */ "./src/core/speedy-point.js");
/* harmony import */ var _core_speedy_size__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./core/speedy-size */ "./src/core/speedy-size.js");
/* harmony import */ var _core_speedy_matrix_factory__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./core/speedy-matrix-factory */ "./src/core/speedy-matrix-factory.js");
/* harmony import */ var _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/speedy-promise */ "./src/utils/speedy-promise.js");
/* harmony import */ var _core_pipeline_pipeline__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./core/pipeline/pipeline */ "./src/core/pipeline/pipeline.js");
/* harmony import */ var _core_pipeline_factories_image_factory__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./core/pipeline/factories/image-factory */ "./src/core/pipeline/factories/image-factory.js");
/* harmony import */ var _core_pipeline_factories_filter_factory__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./core/pipeline/factories/filter-factory */ "./src/core/pipeline/factories/filter-factory.js");
/* harmony import */ var _core_pipeline_factories_transform_factory__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./core/pipeline/factories/transform-factory */ "./src/core/pipeline/factories/transform-factory.js");
/* harmony import */ var _core_pipeline_factories_keypoint_factory__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./core/pipeline/factories/keypoint-factory */ "./src/core/pipeline/factories/keypoint-factory.js");
/* harmony import */ var _core_pipeline_factories_vector2_factory__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./core/pipeline/factories/vector2-factory */ "./src/core/pipeline/factories/vector2-factory.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./utils/utils */ "./src/utils/utils.js");
/* harmony import */ var _utils_globals__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./utils/globals */ "./src/utils/globals.js");
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
 * main.js
 * The entry point of the library
 */


















/* eslint-disable no-undef */
/** @typedef {import('./core/speedy-matrix').SpeedyMatrix} SpeedyMatrix */
/** @typedef {import('./core/speedy-matrix-expr').SpeedyMatrixExpr} SpeedyMatrixExpr */
/** @typedef {import('./core/speedy-media').SpeedyMediaOptions} SpeedyMediaOptions */
/** @typedef {import('./core/speedy-media-source').SpeedyMediaSourceNativeElement} SpeedyMediaSourceNativeElement */
/** @typedef {import('./gpu/speedy-gl').SpeedyPowerPreference} SpeedyPowerPreference */


// Constants

/** @type {SpeedyMatrixFactory} */
const matrixFactory = new _core_speedy_matrix_factory__WEBPACK_IMPORTED_MODULE_6__.SpeedyMatrixFactory();

/** @type {SpeedyPipelineVector2Factory} */
const vector2Factory = new _core_pipeline_factories_vector2_factory__WEBPACK_IMPORTED_MODULE_13__.SpeedyPipelineVector2Factory();



/**
 * GPU-accelerated Computer Vision for JavaScript
 */
class Speedy
{
    /**
     * Loads a SpeedyMedia object based on the provided source element
     * @param {SpeedyMediaSourceNativeElement} sourceElement The source media
     * @param {SpeedyMediaOptions} [options] Additional options for advanced configuration
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static load(sourceElement, options = {})
    {
        return _core_speedy_media__WEBPACK_IMPORTED_MODULE_1__.SpeedyMedia.load(sourceElement, options);
    }

    /**
     * Loads a camera stream
     * @param {number | MediaStreamConstraints} [widthOrConstraints] width of the stream or contraints object
     * @param {number} [height] height of the stream
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static camera(widthOrConstraints = 640, height = 360)
    {
        const constraints = (typeof(widthOrConstraints) === 'object') ? widthOrConstraints : ({
            audio: false,
            video: {
                width: widthOrConstraints | 0,
                height: height | 0,
            },
        });

        return _utils_utils__WEBPACK_IMPORTED_MODULE_14__.Utils.requestCameraStream(constraints).then(
            video => _core_speedy_media__WEBPACK_IMPORTED_MODULE_1__.SpeedyMedia.load(video)
        );
    }

    /**
     * Checks if Speedy can be executed in this machine & browser
     * @returns {boolean} true if Speedy can be executed in this machine & browser
     */
    static isSupported()
    {
        return (
            (typeof WebAssembly !== 'undefined') &&
            (typeof WebGL2RenderingContext !== 'undefined') &&
            (_gpu_speedy_gl__WEBPACK_IMPORTED_MODULE_0__.SpeedyGL.instance.gl != null)
        );
    }

    /**
     * Create a 2D vector
     * @returns {SpeedyPipelineVector2Factory & ((x: number, y: number) => SpeedyVector2)}
     */
    static get Vector2()
    {
        return vector2Factory;
    }

    /**
     * Create a 2D point
     * @param {number} x
     * @param {number} y
     * @returns {SpeedyPoint2}
     */
    static Point2(x, y)
    {
        return new _core_speedy_point__WEBPACK_IMPORTED_MODULE_4__.SpeedyPoint2(x, y);
    }

    /**
     * Create a new size object
     * @param {number} width
     * @param {number} height
     * @returns {SpeedySize}
     */
    static Size(width, height)
    {
        return new _core_speedy_size__WEBPACK_IMPORTED_MODULE_5__.SpeedySize(width, height);
    }

    /**
     * Create a Matrix (entries are given in column-major format)
     * @returns {SpeedyMatrixFactory & ((rows: number, columns: number, entries: number[]) => SpeedyMatrix) & ((expr: SpeedyMatrixExpr) => SpeedyMatrix)}
     */
    static get Matrix()
    {
        return matrixFactory;
    }

    /**
     * Speedy Promises
     * @returns {typeof SpeedyPromise}
     */
    static get Promise()
    {
        return _utils_speedy_promise__WEBPACK_IMPORTED_MODULE_7__.SpeedyPromise;
    }

    /**
     * Create a new Pipeline
     * @returns {SpeedyPipeline}
     */
    static Pipeline()
    {
        return new _core_pipeline_pipeline__WEBPACK_IMPORTED_MODULE_8__.SpeedyPipeline();
    }

    /**
     * Image-related nodes
     * @returns {typeof SpeedyPipelineImageFactory}
     */
    static get Image()
    {
        return _core_pipeline_factories_image_factory__WEBPACK_IMPORTED_MODULE_9__.SpeedyPipelineImageFactory;
    }

    /**
     * Image filters
     * @returns {typeof SpeedyPipelineFilterFactory}
     */
    static get Filter()
    {
        return _core_pipeline_factories_filter_factory__WEBPACK_IMPORTED_MODULE_10__.SpeedyPipelineFilterFactory;
    }

    /**
     * Image transforms
     * @returns {typeof SpeedyPipelineTransformFactory}
     */
    static get Transform()
    {
        return _core_pipeline_factories_transform_factory__WEBPACK_IMPORTED_MODULE_11__.SpeedyPipelineTransformFactory;
    }

    /**
     * Keypoint-related nodes
     * @returns {typeof SpeedyPipelineKeypointFactory}
     */
    static get Keypoint()
    {
        return _core_pipeline_factories_keypoint_factory__WEBPACK_IMPORTED_MODULE_12__.SpeedyPipelineKeypointFactory;
    }

    /**
     * The version of the library
     * @returns {string} The version of the library
     */
    static get version()
    {
        if(true)
            return "0.9.0-wip" + '-dev';
        else
            {}
    }

    /**
     * The FPS rate
     * @returns {number} Frames per second (FPS)
     */
    static get fps()
    {
        return _utils_fps_counter__WEBPACK_IMPORTED_MODULE_2__.FPSCounter.instance.fps;
    }

    /**
     * Power preference for the WebGL context
     * @returns {SpeedyPowerPreference}
     */
    static get powerPreference()
    {
        return _gpu_speedy_gl__WEBPACK_IMPORTED_MODULE_0__.SpeedyGL.powerPreference;
    }

    /**
     * Power preference for the WebGL context
     * @param {SpeedyPowerPreference} value
     */
    static set powerPreference(value)
    {
        _gpu_speedy_gl__WEBPACK_IMPORTED_MODULE_0__.SpeedyGL.powerPreference = value;
    }
}

// Notice
_utils_utils__WEBPACK_IMPORTED_MODULE_14__.Utils.log(
    `Speedy Vision v${Speedy.version}. ` +
    `GPU-accelerated Computer Vision for JavaScript by Alexandre Martins. ` +
    "https://github.com/alemart/speedy-vision"
);

// Big-endian machine? Currently untested.
if(!_utils_globals__WEBPACK_IMPORTED_MODULE_15__.LITTLE_ENDIAN)
    _utils_utils__WEBPACK_IMPORTED_MODULE_14__.Utils.warning('Running on a big-endian machine');

})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=speedy-vision.js.map