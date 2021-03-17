# speedy-vision.js

Build real-time stuff with **speedy-vision.js**, a GPU-accelerated Computer Vision library for JavaScript.

[<img src="assets/demo-bestfeatures.gif" alt="Speedy feature detection">](https://alemart.github.io/speedy-vision-js/demos/best-features.html "Click to open a demo")

## Features

* Feature detection
  * Harris corner detector
  * FAST feature detector
  * ORB feature descriptor
  * BRISK feature detector & descriptor (soon)
* Feature tracking
  * LK optical flow
* Feature matching
  * Soon
* Image processing
  * Greyscale
  * Gaussian blur & box blur
  * Custom convolution filters
  * Image normalization
  * Nightvision
* Linear Algebra
  * Beautiful matrix algebra with fluent interfaces
  * Solve linear systems of equations
  * QR decomposition

... and more in development!

There are plenty of [demos](#demos) available!

## Author

**speedy-vision.js** is developed by [Alexandre Martins](https://github.com/alemart), a computer scientist from Brazil. It is released under the [Apache-2.0 license](LICENSE).

If you appreciate my work, [make a donation](https://www.paypal.com/donate?hosted_button_id=JS6AR2WMLAJTY). I appreciate it!

**Contact:** alemartf `at` gmail `.` com

-----

## Table of contents

* [Demos](#demos)
* [Installation](#installation)
* [Motivation](#motivation)
* [API Reference](#api-reference)
  * [Media routines](#media-routines)
    * [Loading your media](#loading-your-media)
    * [Media properties](#media-properties)
    * [Playing with your media](#playing-with-your-media)
  * [Feature detection](#feature-detection)
    * [Detection methods](#detection-methods)
    * [Properties of feature points](#properties-of-feature-points)
    * [FAST features](#fast-features)
    * [Harris corners](#harris-corners)
    * [ORB features](#orb-features)
  * [Feature description](#feature-description)
    * [ORB descriptors](#orb-descriptors)
  * [Feature tracking](#feature-tracking)
    * [Tracking methods](#tracking-methods)
    * [Tracking API](#tracking-api)
    * [LK feature tracker](#lk-feature-tracker)
  * [Feature matching](#feature-matching)
  * [Image processing](#image-processing)
    * [Creating a pipeline](#creating-a-pipeline)
    * [Running a pipeline](#running-a-pipeline)
    * [Pipeline operations](#pipeline-operations)
  * [Maths](#maths)
    * [2D vectors](#2d-vectors)
  * [Matrices & Linear Algebra](#matrices-linear-algebra)
    * [Creating new matrices](#creating-new-matrices)
    * [Matrix properties](#matrix-properties)
    * [Reading from the matrices](#reading-from-the-matrices)
    * [Writing to the matrices](#writing-to-the-matrices)
    * [Elementary operations](#elementary-operations)
    * [Access by block](#access-by-block)
    * [Linear Algebra](#linear-algebra)
  * [Extras](#extras)
    * [Promises](#promises)
    * [Utilities](#utilities)
* [Unit tests](https://alemart.github.io/speedy-vision-js/tests/index.html)

## Demos

Try the demos and take a look at their source code:

* [Hello, world!](https://alemart.github.io/speedy-vision-js/demos/hello-world.html)
* Feature detection
  * [Feature detection in a webcam](https://alemart.github.io/speedy-vision-js/demos/webcam-demo.html)
  * [Feature detection in an image](https://alemart.github.io/speedy-vision-js/demos/image-features.html)
  * [Feature detection in a video](https://alemart.github.io/speedy-vision-js/demos/video-features.html)
  * [Find the best Harris corners](https://alemart.github.io/speedy-vision-js/demos/best-features.html)
  * [ORB features](https://alemart.github.io/speedy-vision-js/demos/orb-features.html)
* Feature tracking
  * [Optical flow in a corridor](https://alemart.github.io/speedy-vision-js/demos/optical-flow.html)
  * [Tracking a soccer player](https://alemart.github.io/speedy-vision-js/demos/soccer-demo.html)
* Image processing
  * [Nightvision camera](https://alemart.github.io/speedy-vision-js/demos/nightvision-camera.html)
  * [Cool effects with image convolutions](https://alemart.github.io/speedy-vision-js/demos/convolution.html)
  * [Convert image to greyscale](https://alemart.github.io/speedy-vision-js/demos/greyscale-image.html)
  * [Convert video to greyscale](https://alemart.github.io/speedy-vision-js/demos/greyscale-video.html)
  * [Blurring an image](https://alemart.github.io/speedy-vision-js/demos/image-blurring.html)
  * [Normalize camera stream](https://alemart.github.io/speedy-vision-js/demos/normalize-demo.html)
* Linear Algebra
  * [System of equations](https://alemart.github.io/speedy-vision-js/demos/system-of-equations.html)
  * [QR decomposition](https://alemart.github.io/speedy-vision-js/demos/qr-decomposition.html)

## Installation

Download the latest release of speedy-vision.js and include it in the `<head>` section of your HTML page:

```html
<script src="dist/speedy-vision.min.js"></script>
```

Once you import the library, the `Speedy` object will be exposed.

```js
window.onload = async function() {
    // Load an image with Speedy
    let image = document.querySelector('img');
    let media = await Speedy.load(image);

    // Create a feature detector
    let harris = Speedy.FeatureDetector.Harris();

    // Find the feature points
    let features = await harris.detect(media);
    for(let feature of features)
        console.log(feature.x, feature.y);
}
```

Check out the [Hello World demo](demos/hello-world.html) for a working example.

## Motivation

Detecting features in an image is an important step of many computer vision algorithms. Traditionally, the computationally expensive nature of this process made it difficult to bring interactive Computer Vision applications to the web browser. The framerates were unsatisfactory for a compelling user experience. Speedy, a short name for speedy-vision.js, is a JavaScript library created to address this issue.

Speedy's real-time performance in the web browser is possible thanks to its efficient WebGL2 backend and to its GPU implementations of fast computer vision algorithms. With an easy-to-use API, Speedy is an excellent choice for real-time computer vision projects involving tasks such as: object detection in videos, pose estimation, Simultaneous Location and Mapping (SLAM), and others.

## API Reference

### Media routines

A `SpeedyMedia` object encapsulates a media object: an image, a video, a canvas or a bitmap.

#### Loading your media

##### Speedy.load()

`Speedy.load(source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap, options?: object): SpeedyPromise<SpeedyMedia>`

Tells Speedy to load `source`. The `source` parameter may be an image, a video, a canvas or a bitmap.

###### Arguments

* `source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap`. The media source.
* `options: object, optional`. Additional options for advanced configuration. See [SpeedyMedia.options](#speedymediaoptions) for details.

###### Returns

A `SpeedyPromise<SpeedyMedia>` that resolves as soon as the media source is loaded.

###### Example

```js
window.onload = async function() {
    let image = document.getElementById('my-image'); // <img id="my-image" src="...">
    let media = await Speedy.load(image);
}
```

##### Speedy.camera()

`Speedy.camera(width?: number, height?: number, cameraOptions?: object, options?: object): SpeedyPromise<SpeedyMedia>`

Loads a camera stream into a new `SpeedyMedia` object. This is a wrapper around `navigator.mediaDevices.getUserMedia()` provided for your convenience.

###### Arguments

* `width: number, optional`. The width of the stream. Defaults to `426`.
* `height: number, optional`. The height of the stream. Defaults to `240`.
* `cameraOptions: object, optional`. Additional options to be passed to `navigator.mediaDevices.getUserMedia()`.
* `options: object, optional`. Additional options for advanced configuration. See [SpeedyMedia.options](#speedymediaoptions) for details.

###### Returns

A `SpeedyPromise<SpeedyMedia>` that resolves as soon as the media source is loaded with the camera stream.

###### Example

```js
// Display the contents of a webcam
window.onload = async function() {
    const media = await Speedy.camera();
    const canvas = createCanvas(media.width, media.height);

    function render()
    {
        media.draw(canvas);
        requestAnimationFrame(render);
    }

    render();
}

function createCanvas(width, height)
{
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    return canvas;
}
```

#### Media properties

##### SpeedyMedia.source

`SpeedyMedia.source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap, read-only`

The media source associated with the `SpeedyMedia` object.

##### SpeedyMedia.width

`SpeedyMedia.width: number, read-only`

The width of the media source, in pixels.

##### SpeedyMedia.height

`SpeedyMedia.height: number, read-only`

The height of the media source, in pixels.

##### SpeedyMedia.type

`SpeedyMedia.type: string, read-only`

The type of the media source. One of the following: `"image"`, `"video"`, `"canvas"`, `"bitmap"`.

##### SpeedyMedia.options

`SpeedyMedia.options: object, read-only`

Read-only object defined when [loading the media](#speedyload). The following keys are available:

* `usage: string`. Specifies the intended usage of the media for optimization purposes. Possible values:
    * `"dynamic"`: This is a hint that you'll be calling Speedy in a loop, such as when processing a video or an animated canvas. Speedy will then optimize the data transfers between the CPU and the GPU in different ways. This is the default setting if your media is a video. If you don't intend to be calling Speedy continously on this media, this setting may give you undesirable results.
    * `"static"`: You are operating on static media and intend to call Speedy once or at most a few times. This is the default setting if your media is an image, a canvas or a bitmap.

#### Playing with your media

##### SpeedyMedia.draw()

`SpeedyMedia.draw(canvas: HTMLCanvasElement, x?: number, y?: number, width?: number, height?: number): void`

Draws the media to a canvas.

###### Arguments

* `canvas: HTMLCanvasElement`. The canvas element to which you'll draw.
* `x: number, optional`. X-position in the canvas. Defaults to `0`.
* `y: number, optional`. Y-position in the canvas. Defaults to `0`.
* `width: number, optional`. The desired width. Defaults to `SpeedyMedia.width`.
* `height: number, optional`. The desired height. Defaults to `SpeedyMedia.height`.

##### SpeedyMedia.clone()

`SpeedyMedia.clone(options?: object): SpeedyPromise<SpeedyMedia>`

Clones the `SpeedyMedia` object.

###### Arguments

* `options: object, optional`. Configuration object. The following keys may be specified:
  * `lightweight: boolean`. Create a lightweight clone of the `SpeedyMedia`. A lightweight clone shares its internal resources with the original media. Although faster to generate, lightweight clones of the same media are linked to each other. Change one, and you'll most likely change the other. This option defaults to `false`.

###### Returns

A `SpeedyPromise` that resolves to a clone of the `SpeedyMedia` object.

###### Example

```js
const clone = await media.clone();
```

##### SpeedyMedia.toBitmap()

`SpeedyMedia.toBitmap(): Promise<ImageBitmap>`

Converts the media to an `ImageBitmap`.

###### Returns

A Promise that resolves to an `ImageBitmap`.

##### SpeedyMedia.release()

`SpeedyMedia.release(): SpeedyPromise`

Releases internal resources associated with this `SpeedyMedia`. You will no longer be able to use it, nor any of its [lightweight clones](#speedymediaclone).

###### Returns

A `SpeedyPromise` that resolves as soon as the resources are released.

### Feature detection

#### Detection methods

Speedy can use different methods for detecting feature points. Different methods return different results. Some work in scale-space, others do not. Currently, the following detectors are available:

| Detector | Description                      | Multi-scale | Oriented | Includes descriptor |
|----------|----------------------------------|-------------|----------|---------------------|
|`FAST`    | FAST corner detector             | -           | -        | -                   |
|`MultiscaleFAST` | FAST augmented with scale | Yes         | -        | -                   |
|`Harris`  | Harris corner detector           | -           | -        | -                   |
|`MultiscaleHarris` | Harris augmented with scale | Yes     | -        | -                   |
|`ORB`     | ORB features                     | Yes         | Yes      | Yes                 |
|`BRISK`   | BRISK features                   | Soon        | Soon     | Soon                |

Before you're able to detect any features in a media, you must create a `SpeedyFeatureDetector` object. Feature detectors are created using the `Speedy.FeatureDetector` factory (see the example below).

```js
// 1st. load our media
const media = await Speedy.load( /* ... */ );

// 2nd. create a SpeedyFeatureDetector
const featureDetector = Speedy.FeatureDetector.Harris();

// 3rd. detect features in our media
const features = await featureDetector.detect(media);

// Now, features is an array of SpeedyFeature objects
console.log(features);
```

##### SpeedyFeatureDetector.detect()

`SpeedyFeatureDetector.detect(media: SpeedyMedia, flags?: number): Promise<SpeedyFeature[]>`

Detects feature points in a `SpeedyMedia`.

###### Arguments

* `media: SpeedyMedia`. The media object (image, video, etc.)
* `flags: number, optional`. You may specify a combination of the following flags with the bitwise or:
  * `Speedy.FEATURE_DETECTOR_RESET_CAPACITY`. Speedy performs optimizations behind the scenes, specially when detecting features in videos. This flag will undo these optimizations. Use it when you expect a sudden increase in the number of keypoints (i.e., between two consecutive frames).

###### Returns

A `Promise` that resolves to an array of `SpeedyFeature` objects.

###### Example

```js
window.onload = async function() {
    // load the media
    const image = document.querySelector('img');
    const media = await Speedy.load(image);

    // create a feature detector
    const harris = Speedy.FeatureDetector.Harris();

    // detect the features
    const features = await harris.detect(media);

    // display the features
    for(let feature of features) {
        const x = feature.x;
        const y = feature.y;
        console.log(x, y);
    }
}
```

##### SpeedyFeatureDetector.sensitivity

`SpeedyFeatureDetector.sensitivity: number`

A number between `0.0` and `1.0`. The higher the number, the more features you get.

###### Example

```js
window.onload = () => {
    // load the media
    const media = await Speedy.load( /* ... */ );

    // create the feature detector
    const fast = Speedy.FeatureDetector.FAST();

    // set its sensitivity
    fast.sensitivity = 0.7; // experiment with this number

    // detect features
    const features = await fast.detect(media);
    console.log(features);
};
```

##### SpeedyFeatureDetector.max

`SpeedyFeatureDetector.max: number | undefined`

Used to cap the number of keypoints: Speedy will return the best keypoints (according to their scores) up to this number. If it's `undefined`, no such limit will be applied.

##### SpeedyFeatureDetector.enhance()

`SpeedyFeatureDetector.enhance(enhancements: object)`

Speedy can enhance your images in different ways before detecting the interest points. These enhancements are intended to make the feature detection more robust, at a slighly higher computational cost. The desired enhancements are specified in the `enhancements` parameter. That's an object that accepts the following keys (all are optional):

* `denoise: boolean`. Whether or not to denoise the image before finding the features. A simple Gaussian Blur will be applied. Defaults to `true`.
* `illumination: boolean`. If set to `true`, the feature detection algorithm will be more robust when dealing with lighting changes and shadows. It will use the [Nightvision](#nightvision) filter behind the scenes. Defaults to `false`.
* `nightvision: object`. An object with the following keys: `gain`, `offset`, `decay` and `quality`, as in the [Nightvision](#nightvision) filter.

##### SpeedyFeatureDetector.link()

`SpeedyFeatureDetector.link(decorator: SpeedyFeatureDecorator): SpeedyFeatureDetector`

Links the feature detector with a feature descriptor. As soon as the link is established, the `detect()` method will return additional data.

###### Arguments

* `decorator: SpeedyFeatureDecorator`.

###### Returns

The `SpeedyFeatureDetector` itself.



#### Properties of feature points

A `SpeedyFeature` object represents a feature point (also known as keypoint).

##### SpeedyFeature.x

`SpeedyFeature.x: number, read-only`

The x position of the feature in the image.

##### SpeedyFeature.y

`SpeedyFeature.y: number, read-only`

The y position of the feature in the image.

##### SpeedyFeature.scale

`SpeedyFeature.scale: number, read-only`

The scale of the image feature. Only a subset of the feature [detection methods](#detection-methods) support scaled features. Defaults to `1.0`.

##### SpeedyFeature.rotation

`SpeedyFeature.rotation: number, read-only`

The orientation angle of the image feature, in radians. Only a subset of the feature [detection methods](#detection-methods) support oriented features. Defaults to `0.0`.

##### SpeedyFeature.score

`SpeedyFeature.score: number, read-only`

A score measure of the image feature. Although different detection methods employ different measurement strategies, the larger the score, the "better" the feature is.

##### SpeedyFeature.lod

`SpeedyFeature.lod: number, read-only`

The level-of-detail (pyramid level) corresponding to the feature point, starting from zero. While not the same, `lod` is equivalent to `scale`.





#### FAST features

`Speedy.FeatureDetector.FAST(n?: number): SpeedyFeatureDetector`

`Speedy.FeatureDetector.MultiscaleFAST(): SpeedyFeatureDetector`

When using any variation of the FAST feature detector, the following additional properties are available:

* `threshold: number`. An alternative to `sensitivity` representing the threshold paramter of FAST: an integer between `0` and `255`, inclusive. Lower thresholds get you more features. A typical value is `20`.
  * Note: `sensitivity` is an easier-to-use property and does *not* map linearly to `threshold`.
* `n: number`. The FAST variant you want: use `9` for FAST-9,16 (default), `7` for FAST-7,12 or `5` for FAST-5,8. Option not available for multiscale.

When using the `MultiscaleFAST` detector, you may also specify:

* `depth: number`. An integer between `1` and `7` that tells Speedy how "deep" it should go when searching for keypoints in scale-space. Defaults to `4`.
* `scaleFactor: number`. The scale factor between two consecutive pyramid layers. Defaults to the square root of two.

#### Harris corners

`Speedy.FeatureDetector.Harris(): SpeedyFeatureDetector`

`Speedy.FeatureDetector.MultiscaleHarris(): SpeedyFeatureDetector`

Speedy includes an implementation of the Harris corner detector with the Shi-Tomasi corner response. Harris usually gives better feature points than FAST (e.g., for tracking), but it's more computationally expensive. The following additional properties are available:

* `quality: number`. A value between `0` and `1` representing the minimum "quality" of the returned keypoints. Speedy will discard any keypoint whose score is lower than the specified fraction of the maximum keypoint score. A typical value for `quality` is `0.10` (10%).
  * Note: `quality` is an alternative to `sensitivity`.

When using the `MultiscaleHarris` detector, the following additional properties are available:

* `depth: number`. An integer between `1` and `7` that tells Speedy how "deep" it should go when searching for keypoints in scale-space. Defaults to `4`.
* `scaleFactor: number`. The scale factor between two consecutive pyramid layers. Defaults to the square root of two.

#### ORB features

`Speedy.FeatureDetector.ORB(): SpeedyFeatureDetector`

Speedy includes an implementation of ORB. It is an efficient solution that first finds keypoints in scale-space and then computes descriptors for feature matching. The following additional properties are available:

* `depth: number`. An integer between `1` and `7` that tells Speedy how "deep" it should go when searching for keypoints in scale-space. Defaults to `4`.
* `scaleFactor: number`. The scale factor between two consecutive pyramid layers. Defaults to `1.19`.
* `quality: number`. A value between `0` and `1`, as in the Harris detector. This is an alternative to `sensitivity`.






### Feature description

Feature descriptors are data that somehow describe feature points. "Similar" feature points have "similar" descriptors, according to a distance metric. There are different algorithms for computing descriptors. The idea is to use the descriptors to match feature points of different images.

Feature detectors and feature trackers may be linked with a feature descriptor using a decorator. The decorator design pattern lets you dynamically add new behavior to objects. It creates a flexible way of combining detection and description algorithms, considering that the actual computations take place in the GPU.

#### ORB descriptors

`SpeedyFeatureDescriptor.ORB(): SpeedyFeatureDecorator`

Used to augment a feature detector/tracker with 256-bit binary descriptors for feature matching.

###### Returns

A `SpeedyFeatureDecorator` to be linked with the feature detector or tracker.

###### Example

```js
// Combine Harris corner detector with ORB descriptors
const orb = Speedy.FeatureDescriptor.ORB();
const detector = Speedy.FeatureDetector.MultiscaleHarris().link(orb);

const features = await detector.detect(media);
```



### Feature tracking

Feature point tracking is the process of tracking feature points across a sequence of images. Feature tracking allows you to get a sense of how keypoints are moving in time (how fast they are moving and where they are going).

Speedy uses sparse optical-flow algorithms to track feature points in a video. Applications of optical-flow are numerous. You may get a sense of how objects are moving in a scene, you may estimate how the camera itself is moving, you may detect a transition in a film (a cut between two shots), and so on.

#### Tracking methods

Currently, the following feature trackers are available:

| Tracker | Description |
|---------|-------------|
| `LK`    | Pyramid-based LK optical-flow |

Feature trackers are associated with a `SpeedyMedia`, so that consecutive frames of a video are automatically stored in memory and used in the optical-flow algorithms.

**Note:** some keypoints may be discarded during tracking. Additionally, feature trackers will not recompute any keypoints.

#### Tracking API

##### SpeedyFeatureTracker.track()

`SpeedyFeatureTracker.track(features: SpeedyFeature[], flow?: SpeedyVector2[], found?: boolean[]): Promise<SpeedyFeature[]>`

Track a collection of `features` between frames. You may optionally specify the `flow` array to get the flow vector for each of the tracked features. Additionally, `found[i]` will tell you whether the i-th feature point has been found in the next frame of the video/animation or not.

###### Arguments

* `features: SpeedyFeature[]`. The feature points you want to track.
* `flow: SpeedyVector2[], optional`. Output parameter giving you the flow vector of each feature point. Pass an array to it.
* `found: boolean[], optional`. Output parameter telling you whether the feature points remain in the scene or not. Pass an array to it.

###### Returns

A `Promise` that resolves to an array of `SpeedyFeature` objects.

###### Example

```js
// setup a feature tracker
const featureTracker = Speedy.FeatureTracker.LK(media);

// [...]

// features is an array of SpeedyFeature objects
let flow = [];
let features = await featureTracker.track(features, flow);

// output
console.log(features, flow);
```

##### SpeedyFeatureTracker.link()

`SpeedyFeatureTracker.link(decorator: SpeedyFeatureDecorator): SpeedyFeatureTracker`

Links the feature tracker with a feature descriptor. As soon as the link is established, the `track()` method will return additional data.

###### Arguments

* `decorator: SpeedyFeatureDecorator`.

###### Returns

The `SpeedyFeatureTracker` itself.





#### LK feature tracker

`Speedy.FeatureTracker.LK(media: SpeedyMedia): LKFeatureTracker`

Pyramid-based LK optical-flow algorithm. The following properties are available:

* `windowSize: number`. The size of the window to be used by the feature tracker. For a window of size *n*, the algorithm will read *n* x *n* neighboring pixels to determine the motion of a keypoint. Typical values for this property include: `21`, `15`, `11`, `7`. Defaults to `15`.
* `discardThreshold: number`. A threshold used to discard keypoints that are not "good" candidates for tracking. Defaults to `0.0001`. The higher the value, the more keypoints will be discarded.
* `depth: number`. Specifies how many pyramid levels will be used in the computation. You should generally leave this property as it is.

### Feature matching

Coming soon!

### Image processing

Image processing is vital in Computer Vision applications. Speedy lets you transform images in multiple ways using the `SpeedyPipeline` interface. A `SpeedyPipeline` encodes a sequence of operations that take an image (or video) as input and give you an image as output. These operations are executed on the GPU. Furthermore, a pipeline is described using method chaining (see the example below).

#### Creating a pipeline

##### Speedy.pipeline()

`Speedy.pipeline(): SpeedyPipeline`

Creates a new, empty `SpeedyPipeline`.

###### Returns

A new `SpeedyPipeline` instance.

###### Example

```js
// create a pipeline
const pipeline = Speedy.pipeline()                 // create a new SpeedyPipeline
                       .convertTo('greyscale')     // add an operation to the pipeline
                       .blur();                    // add another operation to the pipeline

// pipeline operations are executed
// in the order they are declared

// execute the pipeline on a SpeedyMedia
const media = await Speedy.load(/* ... */);        // load some media (image, video, etc.)
const processedMedia = await media.run(pipeline);  // processedMedia is a new SpeedyMedia object
```

##### SpeedyPipeline.release()

`SpeedyPipeline.release(): Promise<SpeedyPipeline>`

Cleanup pipeline memory. The JavaScript engine has an automatic garbage collector, but this is still useful if you spawn lots of pipelines.

##### SpeedyPipeline.length

`SpeedyPipeline.length: number, read-only`

The number of operations of the pipeline.

#### Running a pipeline

##### SpeedyMedia.run()

`SpeedyMedia.run(pipeline: SpeedyPipeline): Promise<SpeedyMedia>`

Runs the provided `pipeline`, outputting a [lightweight clone](#speedymediaclone) of the media containing the result.

**Note:** while faster to generate, lightweight clones are linked to each other. If you intend to run two or more pipelines with the same content, either use a duplicate `SpeedyMedia` or [clone your media](#speedymediaclone).

###### Arguments

* `pipeline: SpeedyPipeline`.

###### Returns

A `Promise` that resolves to the resulting image: a new `SpeedyMedia` object.

###### Example

```js
// How to blur an image
const pipeline = Speedy.pipeline()
                       .blur();

const media = await Speedy.load(/* ... */);
const blurred = await media.run(pipeline);
```

#### Pipeline operations

The methods below can be chained together to create your own image processing pipelines. They all return the `SpeedyPipeline` instance they operate upon.

Many pipeline operations accept an `option` parameter of type `PipelineOperationOptions`. This should be either an object or a function with no arguments that returns an object, that is, `object | () => object`. In the first case, all data related to the operation is set when the pipeline is instantiated. In the latter, the data may change in time, allowing you to regulate the parameters.

##### Generic

###### .concat

`SpeedyPipeline.concat(pipeline: SpeedyPipeline): SpeedyPipeline`

Concatenates another pipeline into the current one.

##### Color conversion

###### .convertTo

`SpeedyPipeline.convertTo(dest: string): SpeedyPipeline`

Converts the media to a different color space. The following case-sensitive strings can be passed as parameters:

* `"greyscale"`: convert to greyscale
* `"grayscale"`: an alias to `"greyscale"`

##### Image filters

###### .blur

`SpeedyPipeline.blur(options?: PipelineOperationOptions): SpeedyPipeline`

Blurs the media. Available options:

* `filter: string`. Name of the smoothing filter. One of the following: `"gaussian"`, `"box"`. Defaults to `"gaussian"`.
* `size: number`. Kernel size. One of the following: `3`, `5` or `7`. Defaults to `5`.

###### .convolve

`SpeedyPipeline.convolve(kernel: Array<number>, divisor?: number): SpeedyPipeline`

Performs an image convolution given a `kernel`. Currently, Speedy supports 3x3, 5x5 and 7x7 convolution kernels. If you have a non-square kernel, pad it with zeroes.

Optionally, you may specify a `divisor`: all kernel entries will be divided by it. Useful for normalizing the kernel.

```js
// Example: Sharpening an image
const pipeline = Speedy.pipeline()
                       .convolve([
                           0,-1, 0,
                          -1, 5,-1,
                           0,-1, 0,
                       ]);

const image = document.getElementById('my-image');
const media = await Speedy.load(image);
const transformedMedia = await media.run(pipeline);

// Display the result
const canvas = document.getElementById('my-canvas');
transformedMedia.draw(canvas);
```

###### .normalize

`SpeedyPipeline.normalize(options?: PipelineOperationOptions): SpeedyPipeline`

Normalizes the media (histogram stretching). Available options:

* `min: number`. The minimum desired pixel intensity. Defaults to `0`.
* `max: number`. The maximum desired pixel intensity. Defaults to `255`.

###### .nightvision

`SpeedyPipeline.nightvision(options?: PipelineOperationOptions): SpeedyPipeline`

Nightvision enhances the illumination of the scene. It improves local contrast and brightness, enabling you to "see in the dark" - [see the demo](#demos). Available options:

* `gain: number`. A value used to stretch the contrast, typically between `0` and `1`.
* `offset: number`. A value used to adjust the brightness, typically between `0` and `1`.
* `decay: number`. A value between `0` (no decay, default) and `1` (full decay) that modifies the gain from the center of the image to its corners. Used to get high contrast at the center and low contrast at the corners. Defaults to `0`.
* `quality: string`. One of the following: `"high"`, `"medium"`, `"low"`. Defaults to `"medium"`.

### Maths

#### 2D Vectors

##### Speedy.Vector2()

`Speedy.Vector2(x: number, y: number): SpeedyVector2`

Creates a new 2D vector with the given coordinates.

###### Arguments

* `x: number`. The x-coordinate of the vector.
* `y: number`. The y-coordinate of the vector.

###### Returns

A new `SpeedyVector2` instance.

###### Example

```js
const zero = Speedy.Vector2(0, 0);
```

##### SpeedyVector2.x

`SpeedyVector2.x: number`

The x-coordinate of the vector.

##### SpeedyVector2.y

`SpeedyVector2.y: number`

The y-coordinate of the vector.

##### SpeedyVector2.length()

`SpeedyVector2.length(): number`

Computes the length of the vector (Euclidean norm).

###### Returns

The length of the vector.

###### Example

```js
const v = Speedy.Vector2(3, 4);

console.log('Coordinates', v.x, v.y);
console.log('Length', v.length()); // 5
```

##### SpeedyVector2.normalize()

`SpeedyVector2.normalize(): SpeedyVector2`

Normalizes the vector, so that its length becomes one.

###### Returns

The vector itself.

##### SpeedyVector2.distanceTo()

`SpeedyVector2.distanceTo(v: SpeedyVector2): number`

Computes the distance between two vectors.

###### Arguments

* `v: SpeedyVector2`. A vector.

###### Returns

The Euclidean distance between the two vectors.

###### Example

```js
const u = Speedy.Vector2(1, 0);
const v = Speedy.Vector2(5, 0);

console.log(u.distanceTo(v)); // 4
```

##### SpeedyVector2.dot()

`SpeedyVector2.dot(v: SpeedyVector2): number`

Dot product.

###### Arguments

* `v: SpeedyVector2`. A vector.

###### Returns

The dot product between the two vectors.

##### SpeedyVector2.toString()

`SpeedyVector2.toString(): string`

Get a string representation of the vector.

###### Returns

A string representation of the vector.




### Matrices & Linear Algebra

Matrix computations play a crucial role in computer vision applications. Speedy includes its own implementation of matrices. Matrix computations are specified using a fluent interface that has been crafted to be easy to use and to somewhat mirror how we write matrix algebra using pen-and-paper.

Matrix computations may be computationally heavy. Speedy's Matrix system has been designed in such a way that the actual number crunching takes place in a WebWorker (with a few exceptions), so that the user interface will not be blocked during the computations.

Since matrix operations usually do not take place in the main thread, Speedy's Matrix API is asynchronous in nature. Here's a brief overview of how it works:

1. First, you specify the operations you want.
2. Next, your operations will be quickly examined, and perhaps simplified.
3. Your operations will be placed in a queue as soon as a result is required.
4. A WebWorker will do the number crunching as soon as possible.
5. Finally, you will get the results you asked for, asynchronously.

Because Speedy's Matrix API has been designed to not block the main thread, be aware that there is a little bit of overhead to make this work. Such overhead does not depend on the size of the matrices, but it is impacted by the number of matrix operations. That being said, JavaScript engines are highly optimized, so don't worry *too much* about it. Just keep in mind that it's preferable to work with a few "large" matrices than to work with lots of "tiny" ones (e.g., 3x3).

If you intend to work with tiny matrices, Speedy may perform the computations in the main thread in order to avoid the cost of transfering data to a WebWorker. If this is your case, then writing a closed algebraic expression to your problem - if at all possible - will likely give you the best possible performance.

Finally, matrices in Speedy are stored in [column-major format](https://en.wikipedia.org/wiki/Row-_and_column-major_order), using Typed Arrays for extra performance.

#### Creating new matrices

##### Speedy.Matrix()

`Speedy.Matrix(rows: number, columns: number, data?: number[], dtype?: string): SpeedyMatrixLvalueExpr`

Creates a new matrix expression representing a matrix with the specified configuration.

###### Arguments

* `rows: number`. The number of rows of the matrix.
* `columns: number, optional`. The number of columns of the matrix. If not specified, it will be set to `rows`, so that a square matrix will be created.
* `data: number[], optional`. The elements of the matrix in column-major format. The length of this array must be `rows * columns`.
* `dtype: string, optional`. Data type, used for storage purposes. One of the following: `"float32"`, `"float64"`, `"int32"`, `"uint8"`. Defaults to `"float32"`.

###### Returns

A new `SpeedyMatrixLvalueExpr` representing a single matrix.

###### Example

```js
//
// We use the column-major format to specify
// the elements of the new matrix. For example,
// to create the 2x3 matrix (2 rows, 3 columns)
// below, we first specify the elements of the
// first column, then the elements of the second
// column, and finally the elements of the third
// column.
// 
// M = [ 1  3  5 ]
//     [ 2  4  6 ]
//
const mat = Speedy.Matrix(2, 3, [
    1,
    2,
        3,
        4,
            5,
            6
]);

// Alternatively, we may write the data in
// column-major format in a compact form:
const mat1 = Speedy.Matrix(2, 3, [
    1, 2, // first column
    3, 4, // second column
    5, 6  // third column
]);

// Print the matrices to the console
await mat.print();
await mat1.print();
```

##### Speedy.Matrix.Zeros()

`Speedy.Matrix.Zeros(rows: number, columns?: number dtype?: string): SpeedyMatrixLvalueExpr`

Creates a new matrix expression representing a matrix with the specified shape and filled with zeros.

###### Arguments

* `rows: number`. The number of rows of the matrix.
* `columns: number, optional`. The number of columns of the matrix. If not specified, it will be set to `rows`, so that a square matrix will be created.
* `dtype: string, optional`. Data type, used for storage purposes. One of the following: `"float32"`, `"float64"`, `"int32"`, `"uint8"`. Defaults to `"float32"`.

###### Returns

A new `SpeedyMatrixLvalueExpr` representing a matrix filled with zeros.

###### Example

```js
// A 3x3 matrix filled with zeros
const zeros = Speedy.Matrix.Zeros(3);
await zeros.print();
```

##### Speedy.Matrix.Ones()

`Speedy.Matrix.Ones(rows: number, columns?: number dtype?: string): SpeedyMatrixLvalueExpr`

Creates a new matrix expression representing a matrix with the specified shape and filled with ones.

###### Arguments

* `rows: number`. The number of rows of the matrix.
* `columns: number, optional`. The number of columns of the matrix. If not specified, it will be set to `rows`, so that a square matrix will be created.
* `dtype: string, optional`. Data type, used for storage purposes. One of the following: `"float32"`, `"float64"`, `"int32"`, `"uint8"`. Defaults to `"float32"`.

###### Returns

A new `SpeedyMatrixLvalueExpr` representing a matrix filled with ones.

##### Speedy.Matrix.Eye()

`Speedy.Matrix.Eye(rows: number, columns?: number dtype?: string): SpeedyMatrixLvalueExpr`

Creates a new matrix expression representing an identity matrix with the specified shape.

###### Arguments

* `rows: number`. The number of rows of the matrix.
* `columns: number, optional`. The number of columns of the matrix. This is usually set to `rows`, so that you'll get a square matrix. Nonetheless, this parameter is configurable. If not specified, it will be set to `rows`.
* `dtype: string, optional`. Data type, used for storage purposes. One of the following: `"float32"`, `"float64"`, `"int32"`, `"uint8"`. Defaults to `"float32"`.

###### Returns

A new `SpeedyMatrixLvalueExpr` representing an identity matrix.

###### Example

```js
// A 3x3 identity matrix
const eye = Speedy.Matrix.Eye(3);
await eye.print();
```


#### Matrix properties

##### SpeedyMatrixExpr.rows

`SpeedyMatrixExpr.rows: number, read-only`

The number of rows of the matrix.

##### SpeedyMatrixExpr.columns

`SpeedyMatrixExpr.columns: number, read-only`

The number of columns of the matrix.

##### SpeedyMatrixExpr.dtype

`SpeedyMatrixExpr.dtype: string, read-only`

The data type of the matrix. One of the following: `"float32"`, `"float64"`, `"int32"`, `"uint8"`.

#### Reading from the matrices

##### SpeedyMatrixExpr.read()

`SpeedyMatrixExpr.read(): SpeedyPromise<number[]>`

Read the entries of the matrix. Results will be received asynchronously, as an array of numbers in column-major format.

###### Returns

A new `SpeedyPromise` bringing you an array of numbers representing the entries of the matrix in column-major format.

###### Example

```js
const mat = Speedy.Matrix(2, 2, [
    1,
    2,
        3,
        4
]);

const arr = await mat.read();
console.log(arr); // [ 1, 2, 3, 4 ]
```

##### SpeedyMatrixExpr.print()

`SpeedyMatrixExpr.print(decimals?: number, fn?: Function): SpeedyPromise<void>`

Print the matrix in a neat format. Useful for debugging.

###### Arguments

* `decimals: number, optional`. If specified, the entries of the matrix will be formatted with the specified number of digits after the decimal point. Defaults to `undefined`.
* `fn: Function, optional`. The function to be used in order to print the matrix. It must accept a string as input. Defaults to `console.log`.

###### Returns

A new `SpeedyPromise` that will be fulfilled as soon as the matrix is printed.

###### Example

```js
const mat = Speedy.Matrix(2, 2, [
    1,
    2,
        3,
        4
]);

await mat.print();
```

##### SpeedyMatrixExpr.toString()

`SpeedyMatrixExpr.toString(): string`

Convert to string. This is a synchronous method. Although the shape of the matrix will be available, its data will not. If you need the actual entries of the matrix, use asynchronous methods [SpeedyMatrixExpr.print()](#speedymatrixexprprint) or [SpeedyMatrixExpr.read()](#speedymatrixexprread) instead.

###### Returns

A string.

#### Writing to the matrices

Not all matrix expressions can be written to (example: the result of a sum is read-only). You need a *l-value* expression to be able to write. You'll have a *l-value* expression when you create a new matrix or when you access a block of a matrix that you have previously created. Think of a *l-value* expression as a sort of "matrix variable" that you can write data to. It's a *"locator value"*, as it is called in C. Let's illustrate:

```js
// Correct: myvariable is a l-value - you can assign a value to it
myvariable = 2;

// Error: 1 is not a l-value - you can't assign a value to it
1 = 2;
```

##### SpeedyMatrixLvalueExpr.assign()

`SpeedyMatrixLvalueExpr.assign(expr: SpeedyMatrixExpr): SpeedyPromise<SpeedyMatrixLvalueExpr>`

`SpeedyMatrixLvalueExpr.assign(entries: number[]): SpeedyPromise<SpeedyMatrixLvalueExpr>`

Assignment expression.

###### Arguments

* `expr: SpeedyMatrixExpr`. A matrix expression.
* `entries: number[]`. Numbers in column-major format. The length of this array must match the number of entries of the matrix.

###### Returns

In the first form: a `SpeedyPromise` that resolves to a `SpeedyMatrixLvalueExpr` featuring a matrix with the same entries as the evaluation of `expr`.

In the second form: a `SpeedyPromise` that resolves to a `SpeedyMatrixLvalueExpr` featuring a matrix with the same entries as `entries`.

*Note:* in an assignment operation, no data is copied. Only an internal pointer is changed (for performance). This is enough for most cases, but if you need to copy the data, take a look at [SpeedyMatrixExpr.clone()](#speedymatrixexprclone).

###### Example

```js
//
// Let's add two matrices:
//
// A = [ 1  3 ]    B = [ 4  2 ]
//     [ 2  4 ]        [ 3  1 ]
//
// We'll set C to be the sum A + B,
// that is, C = A + B
//
const matA = Speedy.Matrix(2, 2, [
    1, 2,
    3, 4
]);
const matB = Speedy.Matrix(2, 2, [
    4, 3,
    2, 1
]);

// We'll store A + B into matrix C
const matC = Speedy.Matrix(2, 2);

// Compute C = A + B
await matC.assign(matA.plus(matB));

//
// Print the result:
//
// C = [ 5  5 ]
//     [ 5  5 ]
//
await matC.print();
```

##### SpeedyMatrixLvalueExpr.fill()

`SpeedyMatrixLvalueExpr.fill(value: number): SpeedyPromise<SpeedyMatrixLvalueExpr>`

Fill a matrix with a single number.

###### Arguments

* `value: number`. We'll fill the matrix with this number.

###### Returns

A `SpeedyPromise` that resolves to a `SpeedyMatrixLvalueExpr` featuring a matrix with all entries set to `value`.

###### Example

```js
// Create a 5x5 matrix filled with twos
const twos = Speedy.Matrix(5);
await twos.fill(2);
await twos.print();
```

#### Access by block

Speedy lets you work with blocks of matrices. This is a very handy feature! Columns and rows are trivial examples of blocks. Blocks share memory with the originating matrices, meaning: if you modify the entries of a block of a matrix *M*, you'll modify the corresponding entries of *M*.

##### SpeedyMatrixExpr.block()

`SpeedyMatrixExpr.block(firstRow: number, lastRow: number, firstColumn: number, lastColumn: number): SpeedyMatrixExpr`

`SpeedyMatrixLvalueExpr.block(firstRow: number, lastRow: number, firstColumn: number, lastColumn: number): SpeedyMatrixLvalueExpr`

Extract a `lastRow - firstRow + 1` x `lastColumn - firstColumn + 1` block from the matrix. All indices are 0-based. They are all inclusive. Note that the memory of the block is shared with the matrix.

###### Arguments

* `firstRow: number`. Index of the first row (0-based).
* `lastRow: number`. Index of the last row (0-based). Use `lastRow >= firstRow`.
* `firstColumn: number`. Index of the first column (0-based).
* `lastColumn: number`. Index of the last column (0-based). Use `lastColumn >= firstColumn`.

###### Returns

A `SpeedyMatrixLvalueExpr` (read-write) if the input expression is a `SpeedyMatrixLvalueExpr`, or a `SpeedyMatrixExpr` otherwise (read-only).

###### Example

```js
//
// We'll create the following 4x4 matrix:
// (a dot represents a zero)
//
// [ 5  5  5  . ]
// [ 5  5  5  . ]
// [ 5  5  5  . ]
// [ .  .  .  . ]
//
const mat = Speedy.Matrix.Zeros(4);
await mat.block(0, 2, 0, 2).fill(5);
await mat.print();
```

##### SpeedyMatrixExpr.column()

`SpeedyMatrixExpr.column(index: number): SpeedyMatrixExpr`

`SpeedyMatrixLvalueExpr.column(index: number): SpeedyMatrixLvalueExpr`

Extract a column of the matrix.

###### Arguments

* `index: number`. Index of the column (0-based).

###### Returns

A `SpeedyMatrixLvalueExpr` (read-write) if the input expression is a `SpeedyMatrixLvalueExpr`, or a `SpeedyMatrixExpr` otherwise (read-only).

###### Example

```js
const mat = Speedy.Matrix(2, 3, [
    1,
    2,
        3,
        4,
            5,
            6
]);

const firstColumn = await mat.column(0).read(); // [1, 2]
const secondColumn = await mat.column(1).read(); // [3, 4]
const thirdColumn = await mat.column(2).read(); // [5, 6]

console.log(firstColumn, secondColumn, thirdColumn);
```

##### SpeedyMatrixExpr.row()

`SpeedyMatrixExpr.row(index: number): SpeedyMatrixExpr`

`SpeedyMatrixLvalueExpr.row(index: number): SpeedyMatrixLvalueExpr`

Extract a row of the matrix.

###### Arguments

* `index: number`. Index of the row (0-based).

###### Returns

A `SpeedyMatrixLvalueExpr` (read-write) if the input expression is a `SpeedyMatrixLvalueExpr`, or a `SpeedyMatrixExpr` otherwise (read-only).

###### Example

```js
//
// We'll create the following matrix:
// [ 0  0  0  0 ]
// [ 1  1  1  1 ]
// [ 2  2  2  2 ]
// [ 0  0  0  0 ]
//
const mat = Speedy.Matrix.Zeros(4);
await mat.row(1).fill(1);
await mat.row(2).fill(2);
await mat.print();
```

##### SpeedyMatrixExpr.columnSpan()

`SpeedyMatrixExpr.columnSpan(firstColumn: number, lastColumn: number): SpeedyMatrixExpr`

`SpeedyMatrixLvalueExpr.columnSpan(firstColumn: number, lastColumn): SpeedyMatrixLvalueExpr`

Extract a set of `lastColumn - firstColumn + 1` contiguous columns of the matrix.

###### Arguments

* `firstColumn: number`. Index of the first column (0-based).
* `lastColumn: number`. Index of the last column (0-based). Use `lastColumn >= firstColumn`.

###### Returns

A `SpeedyMatrixLvalueExpr` (read-write) if the input expression is a `SpeedyMatrixLvalueExpr`, or a `SpeedyMatrixExpr` otherwise (read-only).

###### Example

```js
// We'll print a 4x2 matrix featuring
// the first two columns of the 4x4
// identity matrix
const mat = Speedy.Matrix.Eye(4);
await mat.columnSpan(0, 1).print();
```

##### SpeedyMatrixExpr.rowSpan()

`SpeedyMatrixExpr.rowSpan(firstRow: number, lastRow: number): SpeedyMatrixExpr`

`SpeedyMatrixLvalueExpr.rowSpan(firstRow: number, lastRow): SpeedyMatrixLvalueExpr`

Extract a set of `lastRow - firstRow + 1` contiguous rows of the matrix.

###### Arguments

* `firstRow: number`. Index of the first row (0-based).
* `lastRow: number`. Index of the last row (0-based). Use `lastRow >= firstRow`.

###### Returns

A `SpeedyMatrixLvalueExpr` (read-write) if the input expression is a `SpeedyMatrixLvalueExpr`, or a `SpeedyMatrixExpr` otherwise (read-only).

##### SpeedyMatrixExpr.diagonal()

`SpeedyMatrixExpr.diagonal(): SpeedyMatrixExpr`

`SpeedyMatrixLvalueExpr.diagonal(): SpeedyMatrixLvalueExpr`

Extract the main diagonal of the matrix.

###### Returns

A `SpeedyMatrixLvalueExpr` (read-write) if the input expression is a `SpeedyMatrixLvalueExpr`, or a `SpeedyMatrixExpr` otherwise (read-only).

###### Example

```js
//
// We'll create the following matrix:
// (a dot represents a zero)
//
// [ 5  .  .  .  . ]
// [ .  5  .  .  . ]
// [ .  .  5  .  . ]
// [ .  .  .  .  . ]
// [ .  .  .  .  . ]
//
const mat = Speedy.Matrix.Zeros(5); // create a 5x5 matrix filled with zeros
const submat = mat.block(0, 2, 0, 2); // extract 3x3 submatrix at the "top-left"
const diag = submat.diagonal(); // extract the diagonal of the submatrix

await diag.fill(5); // fill the diagonal of the submatrix with a constant
await mat.print(); // print the entire matrix

// Alternatively, we may use this compact form:
await mat.block(0, 2, 0, 2).diagonal().fill(5);
```

#### Elementary operations

##### SpeedyMatrixExpr.clone()

`SpeedyMatrixExpr.clone(): SpeedyMatrixExpr`

Clone a matrix, so that when you call `lvalue.assign()`, no data will be shared between the matrices.

###### Returns

A `SpeedyMatrixExpr` representing a clone of the input expression.

###### Example

```js
const matA = Speedy.Matrix(2);
const matB = Speedy.Matrix(2, 2, [
    1, 2,
    3, 4
]);

// matA and matB will share the same buffer
// (the same underlying data), so if you
// change the contents of matB, you'll
// change the contents of matA as well
await matA.assign(matB);

// matA and matB will NOT share the same buffer,
// meaning that you'll be able to change matB
// without matA being affected
await matA.assign(matB.clone());

// print
await matA.print();
```

##### SpeedyMatrixExpr.transpose()

`SpeedyMatrixExpr.transpose(): SpeedyMatrixExpr`

Transpose a matrix.

###### Returns

A `SpeedyMatrixExpr` representing the tranpose of the input expression.

###### Example

```js
// Create a 2x3 matrix
const mat = Speedy.Matrix(2, 3, [
    1, 2,
    3, 4,
    5, 6
]);

// Print the matrix and its transpose
await mat.print();
await mat.transpose().print();

// We can also store its transpose in matT
const matT = Speedy.Matrix(3, 2);
await matT.assign(mat.transpose());
await matT.print();
```

##### SpeedyMatrixExpr.plus()

`SpeedyMatrixExpr.plus(expr: SpeedyMatrixExpr): SpeedyMatrixExpr`

Compute the sum between the matrix expression and `expr`. Both matrices must have the same shape.

###### Arguments

* `expr: SpeedyMatrixExpr`. Another matrix expression.

###### Returns

A `SpeedyMatrixExpr` representing the sum between the matrix expression and `expr`.

###### Example

```js
const matA = Speedy.Matrix(3, 3, [
    1, 2, 3,
    4, 5, 6,
    7, 8, 9
]);
const ones = Speedy.Matrix.Ones(3);

// print A + 1
await matA.plus(ones).print();

// set B = A + 1
const matB = Speedy.Matrix(3);
await matB.assign(ones.plus(matA));
await matB.print(); // print B
```

##### SpeedyMatrixExpr.minus()

`SpeedyMatrixExpr.minus(expr: SpeedyMatrixExpr): SpeedyMatrixExpr`

Compute the difference between the matrix expression and `expr`. Both matrices must have the same shape.

###### Arguments

* `expr: SpeedyMatrixExpr`. Another matrix expression.

###### Returns

A `SpeedyMatrixExpr` representing the difference between the matrix expression and `expr`.

##### SpeedyMatrixExpr.times()

`SpeedyMatrixExpr.times(expr: SpeedyMatrixExpr): SpeedyMatrixExpr`

`SpeedyMatrixExpr.times(scalar: number): SpeedyMatrixExpr`

Matrix multiplication.

In the first form, compute the matrix multiplication between the matrix expression and `expr`. The shape of `expr` must be compatible with the shape of the matrix expression.

In the second form, multiply the matrix expression by a `scalar`.

###### Arguments

* `expr: SpeedyMatrixExpr`. Matrix expression.
* `scalar: number`. A number.

###### Returns

A `SpeedyMatrixExpr` representing the result of the multiplication.

###### Example

```js
const col = Speedy.Matrix(3, 1, [0, 5, 2]);
const row = Speedy.Matrix(1, 3, [1, 2, 3]);

const dot = row.times(col);
await dot.print(); // 1x1 matrix (a scalar)

const out = col.times(row);
await out.print(); // 3x3 matrix

const len = col.transpose().times(col);
await len.print(); // square of L2 norm of col
```

##### SpeedyMatrixExpr.compMult()

`SpeedyMatrixExpr.compMult(expr: SpeedyMatrixExpr): SpeedyMatrixExpr`

Compute the component-wise multiplication between the matrix expression and `expr`. Both matrices must have the same shape.

###### Arguments

* `expr: SpeedyMatrixExpr`. Matrix expression.

###### Returns

A `SpeedyMatrixExpr` representing the component-wise multiplication between the matrix expression and `expr`.

#### Linear Algebra

##### SpeedyMatrixExpr.solve()

`SpeedyMatrixExpr.solve(b: SpeedyMatrixExpr, method?: string): SpeedyMatrixExpr`

Solve a linear system of equations. We'll solve *Ax = b* for *x*, where *A* is a *m* x *m* square matrix and *b* is a *m* x *1* column vector. *m* is the number of equations and the number of unknowns.

###### Arguments

* `b: SpeedyMatrixExpr`. Column vector.
* `method: string, optional`. One of the following: `"qr"`. Defaults to `"qr"`.

###### Returns

A `SpeedyMatrixExpr` featuring the solution of the linear system of equations, if such a solution exists. The shape of the returned matrix will be the same as the shape of `b`.

###### Example

```js
//
// We'll solve the following system of equations:
// y - z = 9
// y + z = 6
//
// Let's write it in matrix form:
// [ 1  -1 ] [ y ] = [ 9 ]
// [ 1   1 ] [ z ]   [ 6 ]
//
// The code below solves Ax = b for x, where
// x = (y, z) is the column vector of unknowns.
//
const A = Speedy.Matrix(2, 2, [
    1, 1,  // first column
    -1, 1  // second column
]);
const b = Speedy.Matrix(2, 1, [
    9, 6   // column vector
]);

// Solve Ax = b for x
const x = A.solve(b);
const soln = await x.read();
console.log(soln); // [ 7.5, -1.5 ]
```

##### SpeedyMatrixExpr.lssolve()

`SpeedyMatrixExpr.lssolve(b: SpeedyMatrixExpr): SpeedyMatrixExpr`

"Solve" an overdetermined linear system of equations *Ax = b* for *x* using least squares, where *A* is a *m* x *n* matrix (satisfying *m* >= *n*) and *b* is a *m* x *1* column vector. *m* is the number of equations and *n* is the number of unknowns.

To "solve" an overdetermined linear system of equations *Ax = b* for *x* using least squares means: to find a *n* x *1* column vector *x* such that the 2-norm *|b - Ax|* is minimized.

###### Arguments

* `b: SpeedyMatrixExpr`. Column vector.

###### Returns

A `SpeedyMatrixExpr` featuring the "solution" of the overdetermined linear system of equations, if such a solution exists.

##### SpeedyMatrixExpr.qr()

`SpeedyMatrixExpr.qr(mode?: string): SpeedyMatrixExpr`

Compute a QR decomposition using Householder reflectors.

*Note:* it is expected that the number of rows *m* of the input matrix *A* is greater than or equal to its number of columns *n* (i.e., *m* >= *n*).

###### Arguments

* `mode: string, optional`. One of the following: `"reduced"`, `"full"`. Defaults to `"reduced"`.

###### Returns

A `SpeedyMatrixExpr` representing a matrix with two blocks, *Q* and *R*, such that *Q* has orthonormal columns, *R* is upper-triangular and *A = Q * R*. The output matrix is set up as follows:

* If `mode` is `"reduced"`, then its first *m* rows and its first *n* columns store *Q*, whereas its last *n* rows and its last *n* columns store *R*. Its shape is *m* x *2n*.
* If `mode` is `"full"`, then its first *m* rows and its first *m* columns store *Q*, whereas its last *m* rows and its last *n* columns store *R* (*R* is a non-square matrix filled with zeros at the bottom). Its shape is *m* x *(m + n)*.

###### Example

```js
//
// Compute a QR decomposition of A
//
const A = Speedy.Matrix(3, 3, [
    0, 1, 0,
    1, 1, 0,
    1, 2, 3,
]);

// the shape of the output is m x 2n
const QR = Speedy.Matrix(3, 6);

// extract blocks
const Q = QR.columnSpan(0, 2);
const R = QR.columnSpan(3, 5);

// compute QR
await QR.assign(A.qr());

// print the result
await Q.print();
await R.print();
```



### Extras

#### Promises

Speedy includes its own implementation of Promises, called SpeedyPromises. SpeedyPromises can interoperate with standard ES6 Promises and are based on the [Promises/A+ specification](https://promisesaplus.com). The main difference between SpeedyPromises and standard ES6 Promises is that, under certain circunstances, SpeedyPromises can be made to run faster than ES6 Promises.

SpeedyPromises are specially beneficial when you have a chain of them. When (and if) their "turbocharged" mode is invoked, they will adopt a special (non-standard) behavior and skip the microtask queue when settling promises in a chain. This will save you a few milliseconds. While "a few milliseconds" doesn't sound much in terms of standard web development, for a real-time library such as Speedy it means a lot. Simply put, we're squeezing out performance. SpeedyPromises are used internally by the library.

##### Speedy.Promise

`Speedy.Promise: Function`

Used to create a new `SpeedyPromise` object.

###### Example

```js
let promise = new Speedy.Promise((resolve, reject) => {
    setTimeout(resolve, 2000);
});

promise.then(() => {
    console.log(`The SpeedyPromise is now fulfilled.`);
}).catch(() => {
    console.log(`The SpeedyPromise is now rejected.`);
}).finally(() => {
    console.log(`The SpeedyPromise is now settled.`);
});
```

#### Utilities

##### Speedy.version

`Speedy.version: string, read-only`

The version of the library.

##### Speedy.fps

`Speedy.fps: number, read-only`

Speedy includes a frames per second (FPS) counter for testing purposes. It will be created as soon as you access it.

###### Example

```js
console.log(Speedy.fps);
```