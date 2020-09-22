# speedy-vision.js

A **lightning fast** GPU-accelerated Computer Vision library for the web, with a focus on real-time feature detection and matching. ORB, FAST, BRISK, Harris, image processing and more!

[<img src="assets/demo-orb.gif" width="640" alt="Speedy feature detection">](https://alemart.github.io/speedy-vision-js/demos/orb-features.html)

*Click to open a demo*

## Table of contents

* [Demos](#demos)
* [Installation](#installation)
* [Motivation](#motivation)
* [API Reference](#api-reference)
  * [Media routines](#media-routines)
  * [Feature detection](#feature-detection)
  * [Feature matching](#feature-matching)
  * [Image processing](#image-processing)
  * [Extras](#extras)
* [Unit tests](https://alemart.github.io/speedy-vision-js/tests/index.html)

## Demos

Try the demos and take a look at their source code:

* [Hello, world!](https://alemart.github.io/speedy-vision-js/demos/hello-world.html)
* Feature detection
  * [Feature detection in a webcam](https://alemart.github.io/speedy-vision-js/demos/webcam-demo.html)
  * [Feature detection in an image](https://alemart.github.io/speedy-vision-js/demos/image-features.html)
  * [Feature detection in a video](https://alemart.github.io/speedy-vision-js/demos/video-features.html)
  * [Find the best Harris corners](https://alemart.github.io/speedy-vision-js/demos/best-features.html)
  * [Automatic sensitivity](https://alemart.github.io/speedy-vision-js/demos/automatic-sensitivity.html)
  * [ORB features](https://alemart.github.io/speedy-vision-js/demos/orb-features.html)
* Image processing
  * [Nightvision camera](https://alemart.github.io/speedy-vision-js/demos/nightvision-camera.html)
  * [Cool effects with image convolutions](https://alemart.github.io/speedy-vision-js/demos/convolution.html)
  * [Convert image to greyscale](https://alemart.github.io/speedy-vision-js/demos/greyscale-image.html)
  * [Convert video to greyscale](https://alemart.github.io/speedy-vision-js/demos/greyscale-video.html)
  * [Blurring an image](https://alemart.github.io/speedy-vision-js/demos/image-blurring.html)
  * [Normalize camera stream](https://alemart.github.io/speedy-vision-js/demos/normalize-demo.html)

## Installation

Download the latest release of speedy-vision.js and include it in the `<head>` section of your HTML page:

```html
<script src="dist/speedy-vision.min.js"></script>
```

Once you import the library, the `Speedy` object will be exposed.

```js
// Load an image with Speedy
let image = document.querySelector('img');
let media = await Speedy.load(image);

// Create a feature detector
let harris = Speedy.FeatureDetector.Harris();

// Find the feature points
let features = await harris.detect(media);
for(let feature of features)
    console.log(feature.x, feature.y);
```

Check out the [Hello World demo](demos/hello-world.html) for a working example.

## Author

speedy-vision.js is developed by [Alexandre Martins](https://github.com/alemart), a computer scientist from Brazil. It is released under the [Apache-2.0 license](LICENSE).

## Motivation

Detecting features in an image is an important step of many computer vision algorithms. Traditionally, the computationally expensive nature of this process made it difficult to bring interactive Computer Vision applications to the web browser. The framerates were unsatisfactory for a compelling user experience. Speedy, a short name for speedy-vision.js, is a JavaScript library created to address this issue.

Speedy's real-time performance in the web browser is possible thanks to its efficient WebGL2 backend and to its GPU implementations of fast computer vision algorithms. With an easy-to-use API, Speedy is an excellent choice for real-time computer vision projects involving tasks such as: object detection in videos, pose estimation, Simultaneous Location and Mapping (SLAM), and others.



## API Reference

### Media routines

A `SpeedyMedia` object encapsulates a media object: an image, a video, a canvas or a bitmap.

#### Loading your media

##### Speedy.load()

`Speedy.load(source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap, options?: object): Promise<SpeedyMedia>`

Tells Speedy to load `source`. The `source` parameter may be an image, a video, a canvas or a bitmap.

###### Arguments

* `source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap`. The media source.
* `options: object, optional`. Additional options for advanced configuration. See [SpeedyMedia.options](#speedymediaoptions) for details.

###### Returns

A `Promise<SpeedyMedia>` that resolves as soon as the media source is loaded.

###### Example

```js
window.onload = async function() {
    let image = document.getElementById('my-image'); // <img id="my-image" src="...">
    let media = await Speedy.load(image);
}
```

##### Speedy.camera()

`Speedy.camera(width?: number, height?: number, cameraOptions?: object, options?: object): Promise<SpeedyMedia>`

Loads a camera stream into a new `SpeedyMedia` object. This is a wrapper around `navigator.mediaDevices.getUserMedia()` provided for your convenience.

###### Arguments

* `width: number, optional`. The width of the stream. Defaults to `426`.
* `height: number, optional`. The height of the stream. Defaults to `240`.
* `cameraOptions: object, optional`. Additional options to be passed to `navigator.mediaDevices.getUserMedia()`.
* `options: object, optional`. Additional options for advanced configuration. See [SpeedyMedia.options](#speedymediaoptions) for details.

###### Returns

A `Promise<SpeedyMedia>` that resolves as soon as the media source is loaded with the camera stream.

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

#### Examining your media

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
    * `"dynamic"`: This is a hint that you'll be calling Speedy continuously, such as when playing a video or displaying an animated canvas. Speedy may optimize downloads from the GPU (e.g., when obtaining feature points, Speedy will use DMA transfers to give you a performance boost). This is the default setting if your media is a video or a canvas. If you don't intend to be calling Speedy continously on this media, this setting may give you undesirable results.
    * `"static"`: You are operating on static media and intend to be calling Speedy once or at most a few times. This is the default setting if your media is an image.

#### Playing with your media

##### SpeedyMedia.draw()

`SpeedyMedia.draw(canvas: HTMLCanvasElement, x?: number, y?: number, width?: number, height?: number): void`

Draws the media to a canvas.

###### Arguments

* `canvas: HTMLCanvasElement`. The canvas element to which you'll draw.
* `x: number, optional`. An x-position in the canvas. Defaults to `0`.
* `y: number, optional`. An y-position in the canvas. Defaults to `0`.
* `width: number, optional`. The desired width. Defaults to `SpeedyMedia.width`.
* `height: number, optional`. The desired height. Defaults to `SpeedyMedia.height`.

##### SpeedyMedia.clone()

`SpeedyMedia.clone(options?: object): Promise<SpeedyMedia>`

Clones the `SpeedyMedia` object.

###### Arguments

* `options: object, optional`. Configuration object.
  * `lightweight: boolean`. Create a lightweight clone of the `SpeedyMedia`. A lightweight clone shares its internal resources with the original media. Although faster to generate, lightweight clones of the same media are linked to each other. Change one, and you'll most likely change the other. This option defaults to `false`.

###### Returns

A Promise that resolves to a clone of the `SpeedyMedia` object.

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

`SpeedyMedia.release(): Promise`

Releases internal resources associated with this `SpeedyMedia`. You will no longer be able to use it, nor any of its [lightweight clones](#speedymediaclone).

###### Returns

A `Promise` that resolves as soon as the resources are released.

### Feature detection

#### Detection methods

Speedy can use different methods for detecting feature points. Different methods return different results. Some work in scale-space and return oriented keypoints, others do not. Currently, the following detectors are available:

| Detector | Description                      | Multi-scale | Oriented | Includes descriptor |
|----------|----------------------------------|-------------|----------|---------------------|
|`FAST`    | FAST corner detector             | -           | -        | -                   |
|`MultiscaleFAST` | FAST augmented with scale & orientation | Yes | Yes | -                  |
|`Harris`  | Harris corner detector           | -           | -        | -                   |
|`MultiscaleHarris` | Harris augmented with scale & orientation | Yes | Yes | -              |
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

`SpeedyFeatureDetector.detect(media: SpeedyMedia, settings?: object): Promise<SpeedyFeature[]>`

Detects feature points in a `SpeedyMedia`.

###### Arguments

* `media: SpeedyMedia`. The media object (image, video, etc.)
* `settings: object, optional`. A configuration object that accepts the following keys (all are optional):
  * `max: number`. If specified, Speedy will return the best keypoints (according to their scores) up to this number.
  * `denoise: boolean`. Whether or not to denoise the image before finding the features. Defaults to `true`.
  * `enhancements: object`. If specified, Speedy will enhance the image in different ways before extracting the features. This is meant to make your features more robust. Read more on [enhancing your features](#enhancing-your-features).

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

###### Enhancing your features

Speedy can enhance your images in different ways before detecting the interest points. These enhancements are intended to make the feature detection more robust, at a slighly higher computational cost. The desired enhancements are specified in the `settings.enhancements` object:

* `illumination: boolean`. If set to `true`, the feature detection will be more robust in relation to lighting changes and shadows. It will use the [Nightvision](#nightvision) filter behind the scenes.


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

#### FAST features

`Speedy.FeatureDetector.FAST(n: number): SpeedyFeatureDetector`

`Speedy.FeatureDetector.MultiscaleFAST(): SpeedyFeatureDetector`

When using any variation of the FAST feature detector, the following additional properties are available:

* `threshold: number`. An alternative to `sensitivity` representing the threshold paramter of FAST: an integer between `0` and `255`, inclusive. Lower thresholds get you more features.
  * Note: `sensitivity` is an easier-to-use property and does *not* map linearly to `threshold`.
* `n: number`. The FAST variant you want: use `9` for FAST-9,16 (default), `7` for FAST-7,12 or `5` for FAST-5,8. Option not available for multiscale.

When using the `MultiscaleFAST` detector, you may also specify:

* `useHarrisScore: boolean`. Adopt a better scoring function (cornerness measure). It will give you slightly better features. Defaults to `false` (using the `MultiscaleHarris` detector is preferred).

#### Harris corners

`Speedy.FeatureDetector.Harris(): SpeedyFeatureDetector`

`Speedy.FeatureDetector.MultiscaleHarris(): SpeedyFeatureDetector`

Speedy includes an implementation of the Harris corner detector with the Shi-Tomasi corner response. The following additional properties are available:

* `quality: number`. A value between `0` and `1` representing the minimum "quality" of the returned keypoints. Speedy will discard any keypoint whose score is lower than the specified fraction of the maximum keypoint score. A typical value for `quality` is `0.10` (10%).
  * Note: `quality` is an alternative to `sensitivity`.

#### ORB features

`Speedy.FeatureDetector.ORB(): SpeedyFeatureDetector`

Speedy includes an implementation of ORB. It is an efficient solution that first finds keypoints in scale-space and then compute the descriptors for feature matching. The following additional properties are available:

* `depth: number`. An integer between `1` and `4` that tells Speedy how "deep" it should go when searching for keypoints in scale-space. Defaults to `3`.
* `quality: number`. A value between `0` and `1`, as in the Harris detector. This is an alternative to `sensitivity`.

#### BRISK features

`Speedy.FeatureDetector.BRISK(): SpeedyFeatureDetector`

**Currently work-in-progress.** Speedy implements a modified version of the BRISK feature detector. It is able to give you feature points at multiple scales. The following additional properties are available:

* `depth: number`. An integer between `1` and `4` telling how "deep" the algorithm should go when searching for keypoints in scale-space. The higher the value, the more robust it is against scale transformations (at a slighly higher computational cost). Defaults to `4`.
* `threshold: number`. An integer between `0` and `255`, just like in FAST.

#### Automatic sensitivity

**Experimental feature**

[Sensitivity](#speedyfeaturedetectorsensitivity) alone does not give you control of how many feature points you will get. When you specify the number of features you expect to get, Speedy will automatically learn a sensitivity value that gives you that amount of features, within a tolerance range.

Automatic sensitivity is meant to be used with media configured for [dynamic usage](#speedymediaoptions). It takes multiple calls to the feature detector for Speedy to adjust the sensitivity. Multiple calls is what you will be doing anyway if you need to detect features in a video (see the example below).

Speedy finds the feature points on the GPU. Although this is an efficient process, downloading data from the GPU is expensive. The more features you get, the more data has to be downloaded. Setting an expected number of feature points may thus help you keep the number of returned points in a controlled interval.

Expected numbers between 100 and 500 have been found to work well in practice. Your results may vary depending on your media. If you need larger numbers and don't care about the exact amount, it's easier to adjust the sensitivity manually. If you need small numbers, you might want to increase the tolerance.

##### SpeedyFeatureDetector.expect()

`SpeedyFeatureDetector.expect(numberOfFeaturePoints: number | undefined, tolerance: number?)`

Speedy can automatically adjust the [sensitivity](#speedyfeaturedetectorsensitivity) of the feature detector to get you *approximately* the number of features you ask.

###### Arguments

* `numberOfFeaturePoints: number | undefined`. The approximate number of feature points you desire, or `undefined` if you wish to disable automatic sensitivity
* `tolerance: number, optional`. A tolerance margin, defined as a percentage relative to the number of features you expect. Defaults to `0.10` (10%)

###### Example

```js
window.onload = async function() {
    // load media
    const video = document.getElementById('my-video');
    const media = await Speedy.load(video);

    // create a feature detector
    const harris = Speedy.FeatureDetector.Harris();

    // give me approximately 100 feature points
    harris.expect(100);

    // find features
    async function loop()
    {
        // detect features
        const features = await harris.detect(media);
        console.log(`Found ${features.length} features`);

        // loop
        const FPS = 60;
        setTimeout(loop, 1000.0 / FPS);
    }
    loop();
};
```

#### Examining your feature points

A `SpeedyFeature` object represents an image feature.

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

When applying the filters, pixels at the borders are replicated.

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
* `decay: number`. A value between `0` (no decay, default) and `1` (full decay) that modifies the gain from the center of the image to its corners. Used to get high contrast at the center and low contrast at the corners.

### Extras

#### Frames per second (FPS)

Speedy includes a FPS counter for testing purposes. It will be created as soon as you access it.

##### Speedy.fps

`Speedy.fps: number, read-only`

Gets the FPS rate.

###### Example

```js
console.log(Speedy.fps);
```

#### Misc

##### Speedy.version

`Speedy.version: string, read-only`

The version of the library.
