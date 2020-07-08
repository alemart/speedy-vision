uniform sampler2D image;

void main()
{
    ivec2 thread = threadLocation();
    ivec2 size = outputSize();
    ivec2 zero = ivec2(0, 0);

    // Note: textureSize(image, 0) != texSize
    color = pixelAt(image, clamp(thread, zero, size - 1));
}