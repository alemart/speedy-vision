/*
 * Keypoint images are encoded as follows:
 *
 * R - "cornerness" score of the pixel (0 means it's not a corner)
 * G - pixel intensity (greyscale)
 * B - min(c, -1 + offset to the next feature) / 255, for a constant c in [1,255]
 * A - general purpose channel
 *
 *
 * Keypoints are encoded as follows:
 *
 * each keypoint takes (2 + N/4) pixels of 32 bits
 *
 *    1 pixel        1 pixel         N/4 pixels
 * [  X  |  Y  ][ S | R | - | - ][  ...  D  ...  ]
 *
 * X: keypoint_xpos (2 bytes)
 * Y: keypoint_ypos (2 bytes)
 * S: keypoint_pyramid_scale * 2 (1 byte)
 * R: keypoint_rotation / (2 pi) (1 byte)
 * -: unused
 * D: descriptor binary string (N bytes)
 */

uniform sampler2D image;
uniform ivec2 imageSize;
uniform int encoderLength;
uniform int descriptorSize;

// q = 0, 1, 2...
bool findQthKeypoint(int q, out ivec2 position, out vec4 pixel)
{
    int i = 0, p = 0;

    for(position = ivec2(0, 0); position.y < imageSize.y; ) {
        pixel = pixelAt(image, position);
        if(pixel.r > 0.0f) {
            if(p++ == q)
                return true;
        }

        i += 1 + int(pixel.b * 255.0f);
        position = ivec2(i % imageSize.x, i / imageSize.x);
    }

    return false;
}

void main()
{
    vec4 pixel;
    ivec2 position;
    ivec2 thread = threadLocation();
    int p = encoderLength * thread.y + thread.x;
    int d = 2 + descriptorSize / 4; // pixels per keypoint
    int q = p / d; // q-th feature point

    // q-th keypoint doesn't exist
    color = vec4(1.0f, 1.0f, 1.0f, 1.0f);

    // find the q-th keypoint, if it exists
    if(findQthKeypoint(q, position, pixel)) {
        int r = p % d;
        switch(r) {
            case 0: {
                // write position
                ivec2 lo = position & 255;
                ivec2 hi = position >> 8;
                color = vec4(float(lo.x), float(hi.x), float(lo.y), float(hi.y)) / 255.0f;
                break;
            }

            case 1: {
                // write scale & rotation
                float scale = pixel.a;
                float rotation = 0.0f;
                color = vec4(scale, rotation, 0.0f, 0.0f);
                break;
            }

            default: {
                // write descriptor
                int i = r - 2; // take the i-th descriptor pixel of the q-th keypoint (i = 0, 1...)
                break;
            }
        }
    }
}