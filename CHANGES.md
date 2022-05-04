# Release notes

## 0.9.0 - May 4th, 2022

* Introduced feature matching
    * Brute force
    * Fast approximate k-nearest neighbors (kNN)
* Introduced type definitions for TypeScript
* New nodes: DistanceFilter, HammingDistanceFilter, BorderClipper
* New sink nodes: SinkOfTrackedKeypoints, SinkOfMatchedKeypoints
* Removed node: DiscardKeypointDescriptor
* New feature matching demo
* Improved the algorithm used to download data from the GPU
* Introduced synchronous writing methods to SpeedyMatrix
* Introduced affine transforms
* Introduced Speedy.Settings
    * Power preference
    * GPU polling modes
    * Logging modes (alxAgu)
* Removed SpeedyMedia.draw()
* Optimizations and fixes

## 0.8.2 - November 7th, 2021

* Introduced a new and faster keypoint encoder using Parallel Ale Sort
* Introduced the turbo flag in both Keypoint & Vector2 sinks
* Various performance optimizations

## 0.8.1 - October 12th, 2021

* Improved multi-scale keypoint detection
* Improved the LK optical-flow
* Introduced portals
* Introduced subpixel refinement for keypoints
* Introduced the image mixer
* Image & keypoint buffers can now be frozen
* New demos + general improvements and fixes

## 0.8.0 - September 20th, 2021

* Ported the Matrix routines to WebAssembly and updated the API

## 0.7.1 - September 10th, 2021

* Improved homography estimation
* Added Speedy.Keypoint.Transformer
* Reduced the CPU usage when polling the GPU
* General improvements

## 0.7.0 - July 31st, 2021

* Introduced the new Pipeline system (partial rewrite of the library)

## 0.6.1 - June 1st, 2021

* Introduced image warping via homographies
* Code cleanup

## 0.6.0 - May 20th, 2021

* Introduced efficient methods for homography estimation
* Matrix computations can now be performed in a WebWorker or in the main thread
* Introduced `SpeedyMatrixExpr.sort()` to sort blocks of matrices
* Introduced median filter in the pipeline API
* Improvements to the code

## 0.5.1 - April 5th, 2021

* Matrix expressions are now compiled for better performance
* Linear Algebra routines are now split into different files
* Introduced `SpeedyMatrixExpr.map()` and `SpeedyMatrixExpr.reduce()`
* Introduced `SpeedyMatrixExpr.inverse()`
* Improved & optimized the LK feature tracker
* ORB: using a larger patch when computing the orientation of a keypoint
* Harris/FAST: using 16-bit half-floats to store the scores of keypoints
* Improved the keypoint encoder
* General improvements & fixes

## 0.5.0 - February 14th, 2021

* Created Speedy's own Matrix / Linear Algebra system
* Improved the feature detection & description API
* Improved the computation of image pyramids
* Performance optimizations (keypoint encoder)
* Created Speedy's own implementation of Promises for extra performance
* Speedy's GLSL preprocessor can now unroll predefined for loops
* Improved the code & made new demos
* Removed Automatic Sensitivity

## 0.4.0 - October 8th, 2020

* Added ORB feature descriptor
* Added LK feature tracker (optical-flow)
* Added subpixel support for feature points
* Changed the feature detection API
* Created new image enhancement algorithm: Nightvision
* Implemented image normalization algorithm
* Data can now uploaded to the GPU using UBOs
* Added 2D vector routines
* Added support to ImageBitmaps
* New demos & visual improvements
* General improvements & fixes

## 0.3.2 - August 5th, 2020

* New feature detectors: harris, multiscale-harris, multiscale-fast
* Added new code to generate image pyramids and to compute keypoint orientation
* Performance optimizations
* Implemented ping-pong rendering for internal shaders
* Added max setting to limit the number of returned keypoints
* Added demo: find the best keypoints
* Improved the code

## 0.3.1 - July 17th, 2020

* Improved performance when downloading data from the GPU
* Added optional usage hint to be specified when loading new media
* Created a shorter implementation of the FAST feature detector
* Bugfixes & improvements

## 0.3.0 - July 9th, 2020

* Ported the backend to WebGL2

## 0.2.2 - June 7th, 2020

* Added unit tests
* Improved the texture encoding formula
* Added Speedy.camera() to request camera access
* General improvements

## 0.2.1 - May 30th, 2020

* Improved scale-space computations
* Implemented multi-scale feature detection
* Implemented image convolution on SpeedyPipeline
* Added demos: multi-scale features & image convolutions
* Added the ability to generate Gaussian kernels on the fly

## 0.2.0 - May 20th, 2020

* Introduced the SpeedyPipeline for image processing
* Implemented online tuners for improved performance
* Introduced new methods to SpeedyMedia: draw, clone
* Implemented image pyramids
* New demos & updated docs
* Refactored the code
* Renamed the library

## 0.1.0 - May 1st, 2020

* Initial release