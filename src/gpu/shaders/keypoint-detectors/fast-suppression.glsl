uniform sampler2D image;

// non-maximum suppression on 8-neighborhood based
// on the corner score stored on the red channel
void main()
{
    // 8-neighborhood
    float p0 = pixelAtOffset(image, ivec2(0, 1)).r;
    float p1 = pixelAtOffset(image, ivec2(1, 1)).r;
    float p2 = pixelAtOffset(image, ivec2(1, 0)).r;
    float p3 = pixelAtOffset(image, ivec2(1, -1)).r;
    float p4 = pixelAtOffset(image, ivec2(0, -1)).r;
    float p5 = pixelAtOffset(image, ivec2(-1, -1)).r;
    float p6 = pixelAtOffset(image, ivec2(-1, 0)).r;
    float p7 = pixelAtOffset(image, ivec2(-1, 1)).r;

    // maximum score
    float m = max(
        max(max(p0, p1), max(p2, p3)),
        max(max(p4, p5), max(p6, p7))
    );

    // non-maximum suppression
    vec4 pixel = threadPixel(image);
    float score = float(pixel.r >= m) * pixel.r;
    color = vec4(score, pixel.gba);
}