# Release notes

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