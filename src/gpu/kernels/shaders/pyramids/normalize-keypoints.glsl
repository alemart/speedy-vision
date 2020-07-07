uniform sampler2D image;
uniform float imageScale;

// normalize keypoint positions, so that they are
// positioned as if scale = 1.0 (base of the pyramid)
// this assumes 1 < imageScale <= 2
void main()
{
    ivec2 thread = threadLocation();
    ivec2 size = outputSize();
    ivec2 scaled = thread * imageScale;
    vec4 pixel = currentPixel(image);
    vec4 p0 = pixelAt(image, scaled);
    vec4 p1 = pixelAt(image, scaled + ivec2(0, 1));
    vec4 p2 = pixelAt(image, scaled + ivec2(1, 0));
    vec4 p3 = pixelAt(image, scaled + ivec2(1, 1));

    // locate corner in a 2x2 square (p0...p3)
    // if there is a corner, take the scale & score of the one with the maximum score
    // if there is no corner in the 2x2 square, drop the corner
    vec2 best = mix(
        vec2(0.0f, pixel.a), // drop corner
        mix(
            mix(
                mix(p3.ra, p1.ra, p1.r > p3.r),
                mix(p2.ra, p1.ra, p1.r > p2.r),
                p2.r > p3.r
            ),
            mix(
                mix(p3.ra, p0.ra, p0.r > p3.r),
                mix(p2.ra, p0.ra, p0.r > p2.r),
                p2.r > p3.r
            ),
            p0.r > p1.r
        ),
        //(thread.x & 1) + (thread.y & 1) == 0 &&
        scaled.x + 1 < size.x && scaled.y + 1 < size.y && // square is within bounds
        (p0.r + p1.r + p2.r + p3.r) > 0.0f // there is a corner
    );

    // done
    color = vec4(best.x, pixel.gb, best.y);
}

export function normalizeScale(image, imageScale)
{
    const width = this.constants.width;
    const height = this.constants.height;
    const x = this.thread.x, y = this.thread.y;
    const xs = x * imageScale, ys = y * imageScale;
    const pixel = image[y][x];

    // drop corner
    this.color(0, pixel[1], pixel[2], pixel[3]);

    // locate corner in a 2x2 square
    if(x%2 + y%2 == 0 && xs+1 < width && ys+1 < height) {
        const p0 = image[ys][xs];
        const p1 = image[ys+1][xs];
        const p2 = image[ys][xs+1];
        const p3 = image[ys+1][xs+1];

        if(p0[0] + p1[0] + p2[0] + p3[0] > 0) { // if there is a corner
            let s = 1, m = 0;

            // get scale & score of the maximum
            if(p0[0] > p1[0]) {
                if(p2[0] > p3[0]) {
                    if(p0[0] > p2[0]) {
                        m = p0[0];
                        s = p0[3];
                    }
                    else {
                        m = p2[0];
                        s = p2[3];
                    }
                }
                else {
                    if(p0[0] > p3[0]) {
                        m = p0[0];
                        s = p0[3];
                    }
                    else {
                        m = p3[0];
                        s = p3[3];
                    }                   
                }
            }
            else {
                if(p2[0] > p3[0]) {
                    if(p1[0] > p2[0]) {
                        m = p1[0];
                        s = p1[3];
                    }
                    else {
                        m = p2[0];
                        s = p2[3];
                    }
                }
                else {
                    if(p1[0] > p3[0]) {
                        m = p1[0];
                        s = p1[3];
                    }
                    else {
                        m = p3[0];
                        s = p3[3];
                    }                   
                }               
            }

            // done
            this.color(m, pixel[1], pixel[2], s);
        }
    }
}