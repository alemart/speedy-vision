uniform sampler2D image;

void main()
{
    ivec2 thread = threadLocation();
    vec4 pixel = pixelAt(image, thread / 2);
    bool cond = (((thread.x + thread.y) & 1) == 0);

    color = mix(
        vec4(0.0f, 0.0f, 0.0f, pixel.a), // preserve scale
        pixel,
        bvec4(cond, cond, cond, cond)
    );
}