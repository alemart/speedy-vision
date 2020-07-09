uniform sampler2D image;
uniform ivec2 imageSize;
uniform int maxIterations; // c

// Blue = min(c, -1 + offset to the next keypoint) / 255, for a constant c in [1,255]
void main()
{
    vec4 pixel = threadPixel(image);
    ivec2 pos = threadLocation();
    int offset = -1;

    while(offset < maxIterations && pos.y < imageSize.y && pixelAt(image, pos).r == 0.0f) {
        ++offset;
        pos.x = (pos.x + 1) % imageSize.x;
        pos.y += int(pos.x == 0);
    }

    color = vec4(pixel.rg, float(max(0, offset)) / 255.0f, pixel.a);
}