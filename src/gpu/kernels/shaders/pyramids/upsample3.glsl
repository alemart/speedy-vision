uniform sampler2D image;

void main()
{
    ivec2 thread = threadLocation();
    vec4 pixel = pixelAt(image, thread / 3);

    color = mix(
        vec4(0.0f, 0.0f, 0.0f, pixel.a), // preserve scale
        pixel,
        ((thread.x - (thread.y % 3) + 3) % 3) == 0
    );
}