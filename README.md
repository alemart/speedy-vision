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
* Geometric transformations
  * Homography matrix
* Image processing
  * Greyscale
  * Gaussian blur & box blur
  * Custom convolution filters
  * Image normalization
  * Nightvision
* Linear Algebra
  * Beautiful matrix algebra with fluent interfaces
  * Efficient computations with Web Workers & Typed Arrays
  * Solve linear systems of equations
  * QR decomposition

... and more in development!

There are plenty of [demos](#demos) available!

## Author

**speedy-vision.js** is developed by [Alexandre Martins](https://github.com/alemart), a computer scientist from Brazil. It is released under the [Apache-2.0 license](LICENSE).

If you appreciate my work, [make a donation](https://www.paypal.com/donate?hosted_button_id=JS6AR2WMLAJTY). I appreciate it!

Need specialized help? [Contact me on Otechie](https://otechie.com/alemart). [![Otechie](https://api.otechie.com/alemart/badge.svg)](https://otechie.com/alemart)

For general enquiries, contact me at alemartf `at` gmail `dot` com.

-----

## Table of contents

* [Demos](#demos)
* [Installation](#installation)
* [Motivation](#motivation)
* [The Pipeline](#the-pipeline)
* [API Reference](#api-reference)
  * [Media routines](#media-routines)
    * [Loading your media](#loading-your-media)
    * [Media properties](#media-properties)
    * [Playing with your media](#playing-with-your-media)
  * [Pipeline](#pipeline)
    * [Basic routines](#basic-routines)
    * [Basic properties](#basic-properties)
    * [Basic nodes](#basic-nodes)
  * [Image processing](#image-processing)
    * [Image filters](#image-filters)
    * [General transformations](#general-transformations)
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
  * [Matrices & Linear Algebra](#matrices-linear-algebra)
    * [Creating new matrices](#creating-new-matrices)
    * [Matrix properties](#matrix-properties)
    * [Reading from the matrices](#reading-from-the-matrices)
    * [Writing to the matrices](#writing-to-the-matrices)
    * [Elementary operations](#elementary-operations)
    * [Access by block](#access-by-block)
    * [Functional programming](#functional-programming)
    * [Systems of equations](#systems-of-equations)
    * [Matrix factorization](#matrix-factorization)
    * [Misc. Utilities](#misc-utilities)
  * [Geometric transformations](#geometric-transformations)
    * [Homography](#perspective-transformation)
  * [Geometric Utilities](#geometric-utilities)
    * [2D vectors](#2d-vectors)
    * [2D points](#2d-points)
    * [2D size](#2d-size)
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
  * [Optical flow](https://alemart.github.io/speedy-vision-js/demos/optical-flow.html)
* Image processing
  * [Image convolution](https://alemart.github.io/speedy-vision-js/demos/convolution.html)
  * [Image warping](https://alemart.github.io/speedy-vision-js/demos/warping.html)
  * [Resize image](https://alemart.github.io/speedy-vision-js/demos/resize-image.html)
  * [Nightvision camera](https://alemart.github.io/speedy-vision-js/demos/nightvision-camera.html)
  * [Convert image to greyscale](https://alemart.github.io/speedy-vision-js/demos/greyscale-image.html)
  * [Convert video to greyscale](https://alemart.github.io/speedy-vision-js/demos/greyscale-video.html)
  * [Blurring an image](https://alemart.github.io/speedy-vision-js/demos/image-blurring.html)
  * [Blurring a video with a median filter](https://alemart.github.io/speedy-vision-js/demos/median-filter.html)
  * [Normalize camera stream](https://alemart.github.io/speedy-vision-js/demos/normalize-demo.html)
* Linear Algebra
  * [System of equations](https://alemart.github.io/speedy-vision-js/demos/system-of-equations.html)
  * [QR decomposition](https://alemart.github.io/speedy-vision-js/demos/qr-decomposition.html)

## Installation

Download the latest release of speedy-vision.js and include it in the `<head>` section of your HTML page:

```html
<script src="dist/speedy-vision.min.js"></script>
```

Once you import the library, the `Speedy` object will be exposed. Check out the [Hello World demo](demos/hello-world.html) for a working example.

## Motivation

Detecting features in an image is an important step of many computer vision algorithms. Traditionally, the computationally expensive nature of this process made it difficult to bring interactive Computer Vision applications to the web browser. The framerates were unsatisfactory for a compelling user experience. Speedy, a short name for speedy-vision.js, is a JavaScript library created to address this issue.

Speedy's real-time performance in the web browser is possible thanks to its efficient WebGL2 backend and to its GPU implementations of fast computer vision algorithms. With an easy-to-use API, Speedy is an excellent choice for real-time computer vision projects involving tasks such as: object detection in videos, pose estimation, Simultaneous Location and Mapping (SLAM), and others.

## The Pipeline

The pipeline is a central concept in Speedy. It's a powerful structure that lets you organize the computations that take place in the GPU. It's a very flexible, yet conceptually simple, way of working with computer vision and image processing. Let's define a few things:

- A **pipeline** is a network of **nodes** in which data flows downstream from one or more sources to one or more sinks.
- Nodes have input and/or output **ports**. A node with no input ports is called a **source**. A node with no output ports is called a **sink**. A node with both input and output ports transforms the input data in some way and writes the results to its output port(s).
- A **link** connects an output port of a node to an input port of another node. Two nodes are said to be connected if there is a link connecting their ports. Data flows from one node to another by means of a link. Additionally, an input port may only be connected to a single output port, but an output port may be connected to multiple input ports.
- Input ports expect data of a certain **type** (e.g., an image). Output ports hold data of a certain type. Two ports may only be connected if their types match.
- Ports may impose additional **constraints** on the data passing through them. For example, an input port may expect an image and also impose the constraint that this image must be greyscale.
- Different nodes may have different **parameters**. These parameters can be adjusted and are meant to modify the output of the nodes in some way.
- Nodes and their ports have **names**. An input port is typically called `"in"`. An output port is typically called `"out"`. These names can vary, e.g., if a node has more than one input / output port. Speedy automatically assigns names to the nodes, but you can assign your own names as well.

The picture below shows a visual representation of a pipeline that converts an image or video to greyscale. Data gets into the pipeline via the image source. It is then passed to the Convert to greyscale node. Finally, a greyscale image goes into the image sink, where it gets out of the pipeline.

![Convert to greyscale: a simple pipeline](assets/network-example.png)

Here's a little bit of code:

```js
// Load an image
const img = document.querySelector('img');
const media = await Speedy.load(img);

// Create the pipeline and the nodes
const pipeline = Speedy.Pipeline();
const source = Speedy.Pipeline.ImageSource();
const sink = Speedy.Pipeline.ImageSink();
const greyscale = Speedy.Filter.Greyscale();

// Set the media source
source.media = media; // media is a SpeedyMedia object

// Connect the nodes
source.output().connectTo(greyscale.input());
greyscale.output().connectTo(sink.input());

// Specify the nodes to initialize the pipeline
pipeline.init(source, sink, greyscale);

// Run the pipeline
const { image } = await pipeline.run(); // image is a SpeedyMedia

// Display the result
const canvas = createCanvas(image.width, image.height);
image.draw(canvas);
```

Speedy provides many types of nodes. You can connect these nodes in a way that is suitable to your application, and Speedy will bring back the results you ask for.

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

* `width: number, optional`. The width of the stream. Defaults to `640`.
* `height: number, optional`. The height of the stream. Defaults to `360`.
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

`SpeedyMedia.clone(): SpeedyPromise<SpeedyMedia>`

Clones the `SpeedyMedia` object.

###### Returns

A `SpeedyPromise` that resolves to a clone of the `SpeedyMedia` object.

###### Example

```js
const clone = await media.clone();
```

##### SpeedyMedia.toBitmap()

`SpeedyMedia.toBitmap(): SpeedyPromise<ImageBitmap>`

Converts the media to an `ImageBitmap`.

###### Returns

A `SpeedyPromise` that resolves to an `ImageBitmap`.

##### SpeedyMedia.release()

`SpeedyMedia.release(): SpeedyPromise<void>`

Releases internal resources associated with this `SpeedyMedia` (textures, framebuffers, etc.)

###### Returns

A `SpeedyPromise` that resolves as soon as the resources are released.

### Pipeline

#### Basic routines

##### Speedy.Pipeline.Pipeline()

`Speedy.Pipeline.Pipeline(): SpeedyPipeline`

Creates a new, empty pipeline.

###### Returns

A new `SpeedyPipeline` object.

##### SpeedyPipeline.init()

`SpeedyPipeline.init(...nodes: ...SpeedyPipelineNode): SpeedyPipeline`

Initializes a pipeline with the specified `nodes`.

###### Arguments

* `...nodes: ...SpeedyPipelineNode`. The list of nodes that belong to the pipeline.

###### Returns

The pipeline itself.

###### Example

```js
const pipeline = Speedy.Pipeline(); // create the pipeline and the nodes
const source = Speedy.Pipeline.ImageSource();
const sink = Speedy.Pipeline.ImageSink();
const greyscale = Speedy.Filter.Greyscale();

source.media = media; // set the media source

source.output().connectTo(greyscale.input()); // connect the nodes
greyscale.output().connectTo(sink.input());

pipeline.init(source, sink, greyscale); // add the nodes to the pipeline
```

##### SpeedyPipeline.release()

`SpeedyPipeline.release(): null`

Releases the resources associated with `this` pipeline.

###### Returns

Returns `null`.

##### SpeedyPipeline.run()

`SpeedyPipeline.run(): SpeedyPromise<object>`

Runs `this` pipeline.

###### Returns

Returns a `SpeedyPromise` that resolves to an object whose keys are the names of the sinks of the pipeline and whose values are the data exported by those sinks.

###### Example

```js
const { sink1, sink2 } = await pipeline.run();
```

##### SpeedyPipeline.node()

`SpeedyPipeline.node(name: string): SpeedyPipelineNode | null`

Finds a node by its `name`.

###### Arguments

* `name: string`. Name of the target node.

###### Returns

Returns a `SpeedyPipelineNode` that has the specified `name` and that belongs to `this` pipeline, or `null` if there is no such node.

##### SpeedyPipelineNode.input()

`SpeedyPipelineNode.input(portName?: string): SpeedyPipelineNodePort`

The input port of `this` node whose name is `portName`.

###### Arguments

* `portName: string, optional`. The name of the port you want to access. Defaults to `"in"`.

###### Returns

The requested input port.

##### SpeedyPipelineNode.output()

`SpeedyPipelineNode.output(portName?: string): SpeedyPipelineNodePort`

The output port of `this` node whose name is `portName`.

###### Arguments

* `portName: string, optional`. The name of the port you want to access. Defaults to `"out"`.

###### Returns

The requested output port.

##### SpeedyPipelineNodePort.connectTo()

`SpeedyPipelineNodePort.connectTo(port: SpeedyPipelineNodePort): void`

Creates a link connecting `this` port to another `port`.

#### Basic properties

##### SpeedyPipelineNode.name

`SpeedyPipelineNode.name: string, read-only`

The name of the node.

##### SpeedyPipelineNode.fullName

`SpeedyPipelineNode.fullName: string, read-only`

A string that exhibits the name and the type of the node.

##### SpeedyPipelineNodePort.name

`SpeedyPipelineNodePort.name: string, read-only`

The name of the port.

##### SpeedyPipelineNodePort.node

`SpeedyPipelineNodePort.node: SpeedyPipelineNode, read-only`

The node to which `this` port belongs.

#### Basic nodes

##### Speedy.Pipeline.ImageSource

`Speedy.Pipeline.ImageSource(name?: string): SpeedyPipelineNodeImageInput`

Creates an image source with the specified name. If the name is not specified, Speedy will automatically generate a name for you.

###### Parameters

* `media: SpeedyMedia`. The media to be imported into the pipeline.

###### Ports

| Port name | Data type | Description |
|-----------|-----------|-------------|
| `"out"`   | Image     | An image corresponding to the `media` of this node. |

##### Speedy.Pipeline.ImageSink

`Speedy.Pipeline.ImageSink(name?: string): SpeedyPipelineNodeImageOutput`

Creates an image sink with the specified name. If the name is not specified, Speedy will use the name `"image"`.

###### Ports

| Port name | Data type | Description |
|-----------|-----------|-------------|
| `"in"`    | Image     | An image to be exported from the pipeline. |

##### Speedy.Pipeline.ImageMultiplexer

`Speedy.Pipeline.ImageMultiplexer(name?: string): SpeedyPipelineNodeImageMultiplexer`

Creates an image multiplexer. It receives two images as input and outputs one of the them.

###### Parameters

* `port: number`. Which input image should be redirected to the output: `0` or `1`? Defaults to `0`.

###### Ports

| Port name | Data type | Description |
|-----------|-----------|-------------|
| `"in0"`   | Image     | First image. |
| `"in1"`   | Image     | Second image. |
| `"out"`   | Image     | Either the first or the second image, depending on the value of `port`. |

### Image processing

#### Image filters

##### Speedy.Filter.Greyscale

`Speedy.Filter.Greyscale(name?: string): SpeedyPipelineNodeGreyscale`

Convert an image to greyscale.

###### Ports

| Port name | Data type | Description |
|-----------|-----------|-------------|
| `"in"`    | Image     | Input image. |
| `"out"`   | Image     | The input image converted to greyscale. |

##### Speedy.Filter.SimpleBlur

`Speedy.Filter.SimpleBlur(name?: string): SpeedyPipelineNodeSimpleBlur`

Blur an image using a box filter.

###### Parameters

* `kernelSize: SpeedySize`. The size of the convolution kernel: from 3x3 to 15x15. Defaults to 5x5.

###### Ports

| Port name | Data type | Description |
|-----------|-----------|-------------|
| `"in"`    | Image     | Input image. |
| `"out"`   | Image     | The input image, blurred. |

##### Speedy.Filter.GaussianBlur

`Speedy.Filter.SimpleBlur(name?: string): SpeedyPipelineNodeGaussianBlur`

Blur an image using a Gaussian filter.

###### Parameters

* `kernelSize: SpeedySize`. The size of the convolution kernel: from 3x3 to 15x15. Defaults to 5x5.
* `sigma: SpeedyVector2`. The sigma of the Gaussian function in both x and y axes. If set to the zero vector, Speedy will automatically pick a sigma according to the selected `kernelSize`. Defaults to (0,0).

###### Ports

| Port name | Data type | Description |
|-----------|-----------|-------------|
| `"in"`    | Image     | Input image. |
| `"out"`   | Image     | The input image, blurred. |

##### Speedy.Filter.MedianBlur

`Speedy.Filter.MedianBlur(name?: string): SpeedyPipelineNodeMedianBlur`

Median filter.

###### Parameters

* `kernelSize: SpeedySize`. One of the following: 3x3, 5x5 or 7x7. Defaults to 5x5.

###### Ports

| Port name | Data type | Description |
|-----------|-----------|-------------|
| `"in"`    | Image     | A greyscale image. |
| `"out"`   | Image     | The result of the median blur. |

###### Example

```js
const median = Speedy.Filter.MedianBlur();
median.kernelSize = Speedy.Size(7,7);
```

##### Speedy.Filter.Convolution

`Speedy.Filter.Convolution(name?: string): SpeedyPipelineNodeConvolution`

Compute the convolution of an image using a 2D kernel.

###### Parameters

* `kernel: SpeedyMatrixExpr`. A 3x3, 5x5 or 7x7 matrix.

###### Ports

| Port name | Data type | Description |
|-----------|-----------|-------------|
| `"in"`    | Image     | Input image. |
| `"out"`   | Image     | The result of the convolution. |

###### Example

```js
// Sharpening an image
const sharpen = Speedy.Filter.Convolution();
sharpen.kernel = Speedy.Matrix(3, 3, [
    0,-1, 0,
   -1, 5,-1,
    0,-1, 0
]);
```

##### Speedy.Filter.Normalize()

`Speedy.Filter.Normalize(name?: string): SpeedyPipelineNodeNormalize`

Normalize the intensity values of the input image to the [`minValue`, `maxValue`] interval.

###### Parameters

* `minValue: number`. A value in [0,255].
* `maxValue: number`. A value in [0,255] greater than or equal to `minValue`.

###### Ports

| Port name | Data type | Description |
|-----------|-----------|-------------|
| `"in"`    | Image     | Greyscale image. |
| `"out"`   | Image     | Normalized image. |

##### Speedy.Filter.Nightvision()

`Speedy.Filter.Nightvision(name?: string): SpeedyPipelineNodeNightvision`

Nightvision filter for local contrast stretching and brightness control.

###### Parameters

* `gain: number`. A value in [0,1]: the larger the number, the higher the contrast. Defaults to `0.5`.
* `offset: number`. A value in [0,1] that controls the brightness. Defaults to `0.5`.
* `decay: number`. A value in [0,1] specifying a contrast decay from the center of the image. Defaults to zero (no decay).
* `quality: string`. Quality level: `"high"`, `"medium"` or `"low"`. Defaults to `"medium"`.

###### Ports

| Port name | Data type | Description |
|-----------|-----------|-------------|
| `"in"`    | Image     | Input image. |
| `"out"`   | Image     | Output image. |

#### General transformations

##### Speedy.Transform.Resize()

`Speedy.Transform.Resize(name?: string): SpeedyPipelineNodeResize`

Resize an image.

###### Parameters

* `size: SpeedySize`. The size of the output image, in pixels. If set to zero, `scale` will be used to determine the size of the output. Defaults to zero.
* `scale: SpeedyVector2`. The size of the output image relative to the size of the input image. This parameter is only applied if `size` is zero. Defaults to (1,1), meaning: keep the original size.
* `method: string`. Resize method. One of the following: `"bilinear"` (bilinear interpolation) or `"nearest"` (nearest neighbors). Defaults to `"bilinear"`.

###### Ports

| Port name | Data type | Description |
|-----------|-----------|-------------|
| `"in"`    | Image     | Input image. |
| `"out"`   | Image     | Resized image. |

##### Speedy.Transform.PerspectiveWarp()

`Speedy.Transform.PerspectiveWarp(name?: string): SpeedyPipelineNodePerspectiveWarp`

Warp an image using a [homography matrix](#perspective-transformation).

###### Parameters

* `transform: SpeedyMatrixExpr`. A 3x3 perspective transformation. Defaults to the identity matrix.

###### Ports

| Port name | Data type | Description |
|-----------|-----------|-------------|
| `"in"`    | Image     | Input image. |
| `"out"`   | Image     | Warped image. |

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

`SpeedyFeatureDetector.detect(media: SpeedyMedia): SpeedyPromise<SpeedyFeature[]>`

Detects feature points in a `SpeedyMedia`.

###### Arguments

* `media: SpeedyMedia`. The media object (image, video, etc.)

###### Returns

A `SpeedyPromise` that resolves to an array of `SpeedyFeature` objects.

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

##### SpeedyFeatureDetector.useBufferedDownloads

`SpeedyFeatureDetector.useBufferedDownloads: boolean`

Used to optimize the download of data from the GPU when working with dynamic media (e.g., videos). This saves you some time by returning the keypoints of the previous frame of the video, which are likely to be almost identical to the keypoints of the current frame (i.e., there is a 1-frame delay). This is set to `true` by default. You may set it to `false` when you don't intend to be calling the feature detector continuously. This option has no effect no static media.

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

`SpeedyFeatureTracker.track(features: SpeedyFeature[], flow?: SpeedyVector2[], found?: boolean[]): SpeedyPromise<SpeedyFeature[]>`

Track a collection of `features` between frames. You may optionally specify the `flow` array to get the flow vector for each of the tracked features. Additionally, `found[i]` will tell you whether the i-th feature point has been found in the next frame of the video/animation or not.

###### Arguments

* `features: SpeedyFeature[]`. The feature points you want to track.
* `flow: SpeedyVector2[], optional`. Output parameter giving you the flow vector of each feature point. Pass an array to it.
* `found: boolean[], optional`. Output parameter telling you whether the feature points remain in the scene or not. Pass an array to it.

###### Returns

A `SpeedyPromise` that resolves to an array of `SpeedyFeature` objects.

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

* `windowSize: number`. The size of the window to be used by the feature tracker. For a window of size *n*, the algorithm will read *n* x *n* neighboring pixels to determine the motion of a keypoint. Typical values for this property include: `21`, `15`, `11`, `7`. This must be a positive odd integer. Defaults to `15`.
* `depth: number`. Specifies how many pyramid levels will be used in the computation. You should generally leave this property as it is.
* `discardThreshold: number`. A threshold used to discard keypoints that are not "good" candidates for tracking. The higher the value, the more keypoints will be discarded. Defaults to `0.0001`.
* `numberOfIterations: number`. Maximum number of iterations for computing the local optical-flow on each level of the pyramid. The larger this number, the more demanding the algorithm is on the GPU. Defaults to `5`.
* `epsilon: number`. An accuracy threshold used to stop the computation of the local optical-flow of any level of the pyramid. The local optical-flow is computed iteratively and in small increments. If the length of an increment is too small, we discard it. This property defaults to `0.01`.

### Feature matching

Coming soon!




### Matrices & Linear Algebra

Matrix computations play a crucial role in computer vision applications. Speedy includes its own implementation of matrices. Matrix computations are specified using a fluent interface that has been crafted to be easy to use and to somewhat mirror how we write matrix algebra using pen-and-paper.

Matrix computations may be computationally heavy. Speedy's Matrix system has been designed in such a way that the actual number crunching takes place in a WebWorker, so that the user interface will not be blocked during the computations.

Since matrix operations do not take place in the main thread, Speedy's Matrix API is asynchronous in nature. Here's a brief overview of how it works:

1. First, you specify the operations you want in a matrix expression.
2. Next, your expression will be quickly examined, and perhaps simplified.
3. Your operations will be placed in a queue as soon as a result is required.
4. A WebWorker will do the number crunching as soon as possible.
5. Finally, you will get the results you asked for, asynchronously.

Since Speedy's Matrix API has been designed not to block the main thread, there is a little bit of overhead to make things work. Roughly speaking, the overhead depends mainly on the number of *await*s in your code (data is transferred to a WebWorker, and then a result is transferred back to the main thread). The less *await*s you have, the less time is spent transferring data back and forth.

If you intend to do lots of computations, I suggest that you group your data into one large matrix composed of many [blocks](#access-by-block). Methods such as [map/reduce](#functional-programming) let you perform multiple computations all at once, helping to minimize the number of *await*s.

If your computations are cheap, I suggest that you perform them [in the main thread](#speedymatrixsettings). If you're unsure, profile both ways.

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

##### Speedy.Matrix.evaluate()

`Speedy.Matrix.evaluate(expr: SpeedyMatrixExpr): SpeedyPromise<SpeedyMatrixLvalueExpr>`

Evaluates `expr` and copies the result to a new matrix.

###### Arguments

* `expr: SpeedyMatrixExpr`. The matrix expression to be evaluated.

###### Returns

A `SpeedyPromise` that resolves to a new matrix storing the contents of the evaluated expression.

###### Example

```js
// Speedy does NOT evaluate matrix expressions unless a result is required. By using
// Speedy.Matrix.evaluate(), you're asking Speedy to perform the number crunching right away.

const matA = Speedy.Matrix.Eye(5); // create some matrix
const dblA = matA.times(2); // this is just an expression - the actual result is unknown at this line

const matB = await Speedy.Matrix.evaluate(dblA); // B stores the actual result of the expression A * 2.
                                                 // Number crunching takes place here! (look at the await)

await dblA.print(); // A * 2 will be evaluated again. You're asking Speedy to print a matrix expression.
                    // This means that the number crunching will happen twice. This is like writing:
                    // print(A * 2);

await matB.print(); // A * 2 will NOT be evaluated, because B already stores that result.
                    // There's no number crunching at this time. This is like writing:
                    // print(B);
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

##### SpeedyMatrixExpr.inverse()

`SpeedyMatrixExpr.inverse(): SpeedyMatrixExpr`

Compute the inverse of a matrix. Currently, only matrices up to 3x3 may be inverted.

###### Returns

A `SpeedyMatrixExpr` representing the inverse of the matrix.

#### Functional programming

##### SpeedyMatrixExpr.map()

`SpeedyMatrixExpr.map(blockRows: number, blockColumns: number, fn: Function): SpeedyMatrixExpr`

This is a handy operation that lets you execute multiple computations at once. It is analogous to `Array.prototype.map()`. Given a function `fn` and a *m* x *bn* matrix *A* split into *b* blocks *B1*, *B2*, ..., *Bb* of equal size:

```
A = [ B1 | B2 | ... | Bj | ... | Bb ]
```

*map* will evaluate function `fn` on each block. The output matrix will have the form:

```
[ fn(B1) | fn(B2) | ... | fn(Bj) | ... | fn(Bb) ]
```

It is required that, for all blocks, `fn` outputs a matrix of the same size & type. Additionally, the number of rows of each input block must be exactly *m* and the number of columns of each input block must be exactly *n*.

###### Arguments

* `blockRows: number`. Number of rows of each block. This **must** be set to the number of rows of the input matrix. This parameter is required only for clarity.
* `blockColumns: number`. Number of columns of each block. The number of columns of the input matrix must be a multiple of this value.
* `fn: Function`. A function returning a `SpeedyMatrixExpr` for each block of the input matrix. It receives three arguments:
    * `block: SpeedyMatrixExpr`. A block of the input matrix.
    * `index: SpeedyMatrixExpr`. A 1x1 matrix whose entry is the index of `block`. The left-most block of the input matrix has index 0. The block next to it has index 1, and so on.
    * `matrix: SpeedyMatrixExpr`. The input matrix.

###### Returns

A `SpeedyMatrixExpr` representing the result of the computations.

###### Example

```js
//
// Given a matrix A, we'll compute the squared
// Euclidean norm of each column-vector of A
//
const A = Speedy.Matrix(3, 5, [
    1, 0, 0, // 1st column-vector
    0, 1, 1, // 2nd column-vector
    1,-1,-1, // 3rd
    0, 0,-2, // 4th
    2, 1, 0, // 5th
]);

const norms = await Speedy.Matrix.evaluate(
    A.map(3, 1, v => v.transpose().times(v))
);
await norms.print(); // [ 1, 2, 3, 4, 5 ]
```

##### SpeedyMatrixExpr.reduce()

`SpeedyMatrixExpr.reduce(blockRows: number, blockColumns: number, fn: Function, initialMatrix: SpeedyMatrixExpr): SpeedyMatrixExpr`

This operation is analogous to `Array.prototype.reduce()`. Given a reducer function `fn`, an `initialMatrix`, and a *m* x *bn* input matrix *M* split into *b* blocks *B1*, *B2*, ..., *Bb* of equal size:

```
M = [ B1 | B2 | ... | Bj | ... | Bb ]
```

*reduce* will evaluate function `fn` on each block, producing accumulators *A0*, *A1*, ..., *Ab* as follows:

```
A0 = initialMatrix
A1 = fn(A0, B1)
A2 = fn(A1, B2)
...
Ab = fn(Ab-1, Bb)
```

The result of the *reduce* operation will be *Ab*. It is required that, for all input blocks, `fn` outputs a matrix of the same size & type. The shape of `initialMatrix` must match those. Additionally, the number of rows of each input block must be exactly *m* and the number of columns of each input block must be exactly *n*.

###### Arguments

* `blockRows: number`. Number of rows of each block. This **must** be set to the number of rows of the input matrix. This parameter is required only for clarity.
* `blockColumns: number`. Number of columns of each block. The number of columns of the input matrix must be a multiple of this value.
* `fn: Function`. A function returning a `SpeedyMatrixExpr` for each block of the input matrix. It receives four arguments:
    * `accumulator: SpeedyMatrixExpr`. The matrix returned on the previous invocation of `fn`. On the first invocation, this is set to `initialMatrix`.
    * `currentBlock: SpeedyMatrixExpr`. A block of the input matrix. The left-most block is used on the first invocation of `fn`. The block next to it is used on the second invocation, and so on.
    * `index: SpeedyMatrixExpr`. A 1x1 matrix whose entry is the index of `currentBlock`. The left-most block of the input matrix has index 0. The block next to it has index 1, and so on.
    * `matrix: SpeedyMatrixExpr`. The input matrix.
* `initialMatrix: SpeedyMatrixExpr`. A matrix used on the first invocation of `fn` as the `accumulator`.

###### Returns

A `SpeedyMatrixExpr` representing the result of the computations.

###### Example

```js
//
// Let's compute the Frobenius
// norm of the input matrix M
//
const M = Speedy.Matrix(3, 3, [
    0, 1, 0,
    1, 1, 1,
    2, 2, 2,
]);
const ones = Speedy.Matrix.Ones(1, 3);
const zeros = Speedy.Matrix.Zeros(3, 1);

// We add together the squared entries of M,
// and then take the square root of the sum.
const result = await Speedy.Matrix.evaluate(
    ones.times( // dot product
        M.compMult(M) // squared entries of M
            .reduce(3, 1, (A, B) => A.plus(B), zeros) // sum of the columns of the squared entries of M
    )
);
const [ norm2 ] = await result.read();

const norm = Math.sqrt(norm2);
console.log(norm); // 4
```

##### SpeedyMatrixExpr.sort()

`SpeedyMatrixExpr.sort(blockRows: number, blockColumns: number, cmp: Function): SpeedyMatrixExpr`

This operation is analogous to `Array.prototype.sort()`. Given a comparison function `cmp` and a *m* x *bn* input matrix *M* split into *b* blocks *B1*, *B2*, ..., *Bb* of equal shape (*m* x *n*):

```
M = [ B1 | B2 | ... | Bj | ... | Bb ]
```

*sort* will rearrange the blocks of the matrix according to the criteria established by `cmp`.

###### Arguments

* `blockRows: number`. Number of rows of each block. This **must** be set to the number of rows of the input matrix. This parameter is required only for clarity.
* `blockColumns: number`. Number of columns of each block. The number of columns of the input matrix must be a multiple of this value.
* `cmp: Function`. A function returning a 1x1 `SpeedyMatrixExpr` given two `SpeedyMatrixExpr` objects corresponding to distinct blocks `Bi` and `Bj` of the input matrix. `cmp` must always return the same result given the same pair of blocks. The entry of the output must be:
    * negative if `Bi` must precede `Bj` (i.e., if `Bi` must appear before `Bj` when reading the output matrix from left to right)
    * positive if `Bj` must precede `Bi`
    * zero if the relative order of `Bi` and `Bj` doesn't matter

###### Returns

The sorted matrix.

###### Example

```js
//
// Let's sort the column vectors of a
// matrix according to their magnitude
//
const M = Speedy.Matrix(3, 5, [
    0, 2, 0, // magnitude: 2
    0, 0, 0, // magnitude: 0
    1, 0, 0, // magnitude: 1
    0, 4, 3, // magnitude: 5
    0, 1, 0, // magnitude: 1
]);

const sorted = await Speedy.Matrix.evaluate(
    M.sort(3, 1, (u, v) => {
        // u and v are distinct column vectors
        const utu = u.transpose().times(u); // squared magnitude of u (1x1)
        const vtv = v.transpose().times(v); // squared magnitude of v (1x1)

        return utu.minus(vtv); // ascending
        //return vtv.minus(utu); // descending
    })
);

await sorted.print();

//
// Result:
// [ 0, 1, 0, 0, 0 ]
// [ 0, 0, 1, 2, 4 ]
// [ 0, 0, 0, 0, 3 ]
//
```

#### Systems of equations

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
const x = await Speedy.Matrix.evaluate(
    A.solve(b)
);

// get the result
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



#### Matrix factorization

##### Speedy.Matrix.QR()

`Speedy.Matrix.QR(mat: SpeedyMatrixExpr, options?: object): SpeedyPromise<SpeedyMatrixExpr[]>`

Compute a QR decomposition of `mat` using Householder reflectors.

*Note:* it is expected that the number of rows *m* of the input matrix *A* is greater than or equal to its number of columns *n* (i.e., *m* >= *n*).

###### Arguments

* `mat: SpeedyMatrixExpr`. The matrix to be decomposed.
* `options: object, optional`. A configuration object that accepts the following keys:
    * `mode: string`. Either `"full"` or `"reduced"`. Defaults to `"reduced"`.

###### Returns

Returns a `SpeedyPromise` that resolves to a pair `[Q, R]` such that `Q` * `R` = `mat`. `Q` is orthogonal and `R` is upper-triangular.

###### Example

```js
// Create a matrix
const A = Speedy.Matrix(3, 3, [
    0, 1, 0,
    1, 1, 0,
    1, 2, 3,
]);

// Compute a QR decomposition of A
const [Q, R] = await Speedy.Matrix.QR(A);

// Print the result
await Q.print();
await R.print();
```

##### SpeedyMatrixExpr.qr()

`SpeedyMatrixExpr.qr(mode?: string): SpeedyMatrixExpr`

Compute a QR decomposition using Householder reflectors. Check [Speedy.Matrix.QR()](#speedymatrixqr) for an easier to use version.

*Note:* it is expected that the number of rows *m* of the input matrix *A* is greater than or equal to its number of columns *n* (i.e., *m* >= *n*).

###### Arguments

* `mode: string, optional`. One of the following: `"reduced"`, `"full"`. Defaults to `"reduced"`.

###### Returns

A `SpeedyMatrixExpr` representing a matrix with two blocks, *Q* and *R*, such that *Q* has orthonormal columns, *R* is upper-triangular and *A = Q * R*. The output matrix is set up as follows:

* If `mode` is `"reduced"`, then its first *m* rows and its first *n* columns store *Q*, whereas its last *n* rows and its last *n* columns store *R*. Its shape is *m* x *2n*.
* If `mode` is `"full"`, then its first *m* rows and its first *m* columns store *Q*, whereas its last *m* rows and its last *n* columns store *R* (*R* is a non-square matrix filled with zeros at the bottom). Its shape is *m* x *(m + n)*.



#### Misc. Utilities

##### SpeedyMatrixExpr.followedBy()

`SpeedyMatrixExpr.followedBy(expr: SpeedyMatrixExpr): SpeedyMatrixExpr`

Create a sequence of two expressions that will be evaluated in a way that is similar to the comma operator in C/C++ and JavaScript. After evaluating the caller expression, `expr` will be evaluated. The result of the new expression will be `expr`. The result of the caller expression will be discarded.

###### Arguments

* `expr: SpeedyMatrixExpr`. Matrix expression.

###### Returns

A `SpeedyMatrixExpr` that evaluates both expressions and that has its result set to the result of `expr`.

###### Example

```js
//
// This example is analogous to the following JavaScript statement:
// a = (1, 2);
//
const A = Speedy.Matrix(3);
const I = Speedy.Matrix.Eye(3);
const T = I.times(2);

await A.assign(I.followedBy(T)); // A = (I, T)
await A.print();
```

##### SpeedyMatrixLvalueExpr.setTo()

`SpeedyMatrixLvalueExpr.setTo(expr: SpeedyMatrixExpr): SpeedyMatrixExpr`

`SpeedyMatrixLvalueExpr.setTo(entries: number[]): SpeedyMatrixExpr`

Create an assignment expression. Unlike [SpeedyMatrixLvalue.assign()](#speedymatrixlvalueexprassign), setTo() does not actually change any data, nor perform any computations (note that it does not return a promise). It's just an assignment expression, which may be used as part of a larger expression. The result of this assignment expression is `expr` in the first form, and a new `SpeedyMatrixExpr` corresponding to the given `entries` in the second form.

###### Arguments

* `expr: SpeedyMatrixExpr`. A matrix expression.
* `entries: number[]`. Numbers in column-major format. The length of this array must match the number of entries of the matrix.

###### Returns

A `SpeedyMatrixExpr` representing an assignment expression meant to modify the matrix on which it's called.

###### Example

```js
//
// This example is analogous to the following JavaScript statement:
// a = b = 1;
// also written as:
// a = (b = 1);
//
const A = Speedy.Matrix(3);
const B = Speedy.Matrix(3);
const I = Speedy.Matrix.Eye(3);

await A.assign(B.setTo(I));

await A.print(); // identity matrix
await B.print(); // identity matrix
```



#### Utilities

##### Speedy.Matrix.Settings

`Speedy.Matrix.Settings: object`

Settings object. It accepts the following keys:

* `useWorker: boolean`. Should the matrix computations be performed in a Web Worker? Using a Web Worker may or may not be faster than using the main thread, depending on various factors. Different web browsers, machines and applications may perform differently. Profile and see. Defaults to `true`.

##### Speedy.Matrix.fromPoints()

`Speedy.Matrix.fromPoints(points: SpeedyPoint2[]): SpeedyMatrixExpr`

Convert a non-empty array of points to a matrix in which each column encodes the coordinates of a point.

###### Arguments

* `points: SpeedyPoint2[]`. A non-empty array of points.

###### Returns

A 2 x *n* matrix, where *n* is the number of points that are provided.

##### Speedy.Matrix.toPoints()

`Speedy.Matrix.toPoints(matrix: SpeedyMatrixExpr): SpeedyPromise<SpeedyPoint2[]>`

Convert a matrix in which each column encodes the coordinates of a point to an array of points.

###### Arguments

* `matrix: SpeedyMatrixExpr`. A matrix with 2 rows.

###### Returns

A non-empty array of points.

###### Example

```js
const M = Speedy.Matrix(2, 3, [
    1, 0, // coordinates of the first point
    0, 1, // coordinates of the second point
    1, 1, // coordinates of the third point
]);

const points = await Speedy.Matrix.toPoints(M);
console.log(points);
```




### Geometric transformations

#### Perspective transformation

##### Speedy.Matrix.findHomography()

`Speedy.Matrix.findHomography(source: SpeedyMatrixExpr, destination: SpeedyMatrixExpr, options?: object): SpeedyMatrixExpr`

Compute a homography matrix using a set of *n* >= 4 correspondences of points, possibly with noise.

###### Arguments

* `source: SpeedyMatrixExpr`. A 2 x *n* matrix with the coordinates of *n* points (one point per column).
* `destination: SpeedyMatrixExpr`. A 2 x *n* matrix with the coordinates of *n* points (one point per column).
* `options: object, optional`. A configuration object. It accepts two keys:
    * `method: string`. The method to be employed to compute the homography (see the table of methods below).
    * `parameters: object`. A dictionary of parameters. The available parameters depend on the chosen method (see the table of parameters below).

Table of methods:

| Method            | Description |
|-------------------|-------------|
| `"p-ransac"` | P-RANSAC is a variant of RANSAC with bounded runtime that is designed for real-time tasks. It is able to reject outliers in the data set. This is the default method. |
| `"dlt"` | Normalized Direct Linear Transform (DLT). You should only use this method if your data set isn't polluted with outliers. |

Table of parameters:

| Parameter | Supported methods | Description |
|-----------|-------------------|-------------|
| `reprojectionError: number` | `"p-ransac"` | A threshold, measured in pixels, that lets Speedy decide if a data point is an inlier or an outlier for a given model. A data point is an inlier for a given model if the model maps its `source` coordinates near its `destination` coordinates (i.e., if the Euclidean distance is not greater than the threshold). A data point is an outlier if it's not an inlier. |
| `mask: SpeedyMatrixLvalueExpr` | `"p-ransac"` | An optional output matrix of shape 1 x *n*. Its i-th entry will be set to 1 if the i-th data point is an inlier for the best model found by the method, or 0 if it's an outlier. |
| `numberOfHypotheses: number` | `"p-ransac"` | A positive integer specifying the number of models that will be generated and tested. The best model found by the method will be refined and then returned. If your inlier ratio is "high", this parameter can be set to a "low" number, making the algorithm run even faster. Defaults to 500. |
| `bundleSize: number` | `"p-ransac"` | A positive integer specifying the number of data points to be tested against all viable models before the set of viable models gets cut in half, over and over again. Defaults to 100. |

###### Returns

A 3x3 homography matrix.

###### Example

```js
//
// Map random points
// from [0,100] x [0,100]
// to [200,600] x [200,600]
//
const numPoints = 50;
const noiseLevel = 2;

const transform = x => 4*x + 200; // simulated model
const randCoord = () => 100 * Math.random(); // in [0, 100)
const randNoise = () => (Math.random() - 0.5) * noiseLevel;

const srcCoords = new Array(numPoints * 2).fill(0).map(() => randCoord());
const dstCoords = srcCoords.map(x => transform(x) + randNoise());

const src = Speedy.Matrix(2, numPoints, srcCoords);
const dst = Speedy.Matrix(2, numPoints, dstCoords);
const mask = Speedy.Matrix(1, numPoints);

const homography = await Speedy.Matrix.evaluate(
    Speedy.Matrix.findHomography(src, dst, {
        method: "p-ransac",
        parameters: {
            mask: mask,
            reprojectionError: 1
        },
    })
);

await homography.print();
await mask.print();

// Now let's test the homography using a few test points.
// The points need to be mapped in line with our simulated model (see above)
const tstCoords = Speedy.Matrix(2, 5, [
    0, 0,
    100, 0,
    100, 100,
    0, 100,
    50, 50,
]);
const chkCoords = await Speedy.Matrix.evaluate(
    Speedy.Matrix.transform(homography, tstCoords)
);
await chkCoords.print();
```

##### Speedy.Matrix.Perspective()

`Speedy.Matrix.Perspective(source: SpeedyMatrixExpr, destination: SpeedyMatrixExpr): SpeedyMatrixExpr`

Compute a perspective transform (homography matrix) from four correspondences of points.

###### Arguments

* `source: SpeedyMatrixExpr`. A 2x4 matrix with the coordinates of 4 points (one per column) representing the corners of the source quadrilateral.
* `destination: SpeedyMatrixExpr`. A 2x4 matrix with the coordinates of 4 points (one per column) representing the corners of the destination quadrilateral.

###### Returns

A 3x3 homography matrix.

###### Example

```js
const srcQuad = Speedy.Matrix.fromPoints([
    Speedy.Point2(0, 0),
    Speedy.Point2(1, 0),
    Speedy.Point2(1, 1),
    Speedy.Point2(0, 1)
]);

const dstQuad = Speedy.Matrix.fromPoints([
    Speedy.Point2(0, 0),
    Speedy.Point2(3, 0),
    Speedy.Point2(3, 2),
    Speedy.Point2(0, 2)
]);

const homography = await Speedy.Matrix.evaluate(
    Speedy.Matrix.Perspective(srcQuad, dstQuad)
);
await homography.print();
```

##### Speedy.Matrix.transform()

`Speedy.Matrix.transform(mat: SpeedyMatrixExpr, points: SpeedyMatrixExpr): SpeedyMatrixExpr`

Apply a transformation matrix to a set of *n* points.

###### Arguments

* `mat: SpeedyMatrixExpr`. A transformation matrix: homography (3x3), affine (2x3) or linear (2x2).
* `points: SpeedyMatrixExpr`. A 2 x *n* matrix encoding a set of *n* points, one per column.

###### Returns

A 2 x *n* matrix.

###### Example

```js
const mat = Speedy.Matrix(3, 3, [
    3, 0, 0, // 1st column
    0, 2, 0, // 2nd column
    2, 1, 1, // 3rd column
]);

const srcQuad = Speedy.Matrix(2, 4, [
    0, 0,
    1, 0,
    1, 1,
    0, 1,
]);

const dstQuad = await Speedy.Matrix.evaluate(
    Speedy.Matrix.transform(mat, srcQuad)
);
await dstQuad.print();

//
// Result:
// [ 2  5  5  2 ]
// [ 1  1  3  3 ]
//
```





### Geometric Utilities

#### 2D Vectors

##### Speedy.Vector2()

`Speedy.Vector2(x: number, y: number): SpeedyVector2`

Creates a new immutable 2D vector with the given coordinates.

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

##### SpeedyVector2.plus()

`SpeedyVector2.plus(offset: SpeedyVector2): SpeedyVector2`

Vector addition.

###### Returns

A new vector corresponding to `this` + `offset`.

##### SpeedyVector2.minus()

`SpeedyVector2.minus(offset: SpeedyVector2): SpeedyVector2`

Vector subtraction.

###### Returns

A new vector corresponding to `this` - `offset`.

##### SpeedyVector2.times()

`SpeedyVector2.times(scalar: number): SpeedyVector2`

Multiply a vector by a scalar.

###### Returns

A new vector corresponding to `this` * `scalar`.

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

##### SpeedyVector2.normalized()

`SpeedyVector2.normalized(): SpeedyVector2`

Returns a normalized version of this vector.

###### Returns

A new vector with the same direction as the original one and with length equal to one.

##### SpeedyVector2.dot()

`SpeedyVector2.dot(v: SpeedyVector2): number`

Dot product.

###### Arguments

* `v: SpeedyVector2`. A vector.

###### Returns

The dot product between the two vectors.

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

##### SpeedyVector2.toString()

`SpeedyVector2.toString(): string`

Get a string representation of the vector.

###### Returns

A string representation of the vector.

##### SpeedyVector2.equals()

`SpeedyVector2.equals(v: SpeedyVector2): boolean`

Equality comparison.

###### Returns

Returns `true` if the coordinates of `this` are equal to the coordinates of `v`, or `false` otherwise.

#### 2D Points

##### Speedy.Point2()

`Speedy.Point2(x: number, y: number): SpeedyPoint2`

Creates a new immutable 2D point with the given coordinates.

###### Arguments

* `x: number`. The x-coordinate of the point.
* `y: number`. The y-coordinate of the point.

###### Returns

A new `SpeedyPoint2` instance.

###### Example

```js
const p = Speedy.Point2(5, 10);
```

##### SpeedyPoint2.x

`SpeedyPoint2.x: number`

The x-coordinate of the point.

##### SpeedyPoint2.y

`SpeedyPoint2.y: number`

The y-coordinate of the point.

##### SpeedyPoint2.plus()

`SpeedyPoint2.plus(v: SpeedyVector2): SpeedyPoint2`

Adds a vector to this point.

###### Arguments

* `v: SpeedyVector2`. A 2D vector.

###### Returns

A new `SpeedyPoint2` instance corresponding to this point translated by `v`.

##### SpeedyPoint2.minus()

`SpeedyPoint2.minus(p: SpeedyPoint2): SpeedyVector2`

Subtracts point `p` from this.

###### Arguments

* `p: SpeedyPoint2`. A 2D point.

###### Returns

A new `SpeedyVector2` instance such that `p` plus that vector equals this point.

##### SpeedyPoint2.equals()

`SpeedyPoint2.equals(p: SpeedyPoint2): boolean`

Equality comparison.

###### Returns

Returns `true` if the coordinates of `this` are equal to the coordinates of `p`, or `false` otherwise.

#### 2D Size

##### Speedy.Size()

`Speedy.Size(width: number, height: number): SpeedySize`

Creates a new immutable object that represents the size of a rectangle.

###### Arguments

* `width: number`. A non-negative number.
* `height: number`. A non-negative number.

###### Returns

A new `SpeedySize` instance.

###### Example

```js
const size = Speedy.Size(640, 360);
```

##### SpeedySize.width

`SpeedySize.width: number`

Width property.

##### SpeedySize.height

`SpeedySize.height: number`

Height property.

##### SpeedySize.equals

`SpeedySize.equals(anotherSize: SpeedySize): boolean`

Checks if two size objects have the same dimensions.

###### Returns

Returns `true` if the dimensions of `this` and `anotherSize` are equal.

##### SpeedySize.toString

`SpeedySize.toString(): string`

Convert to string.

###### Returns

A string representation of the object.






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
