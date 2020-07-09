uniform sampler2D image;
uniform float threshold;

// FAST-5_8: requires 5 contiguous pixels
// on a circumference of 8 pixels
void main()
{
    ivec2 thread = threadLocation();
    ivec2 size = outputSize();
    vec4 pixel = threadPixel(image);

    // assume it's not a corner
    color = vec4(0.0f, pixel.gba);

    if(
        thread.x >= 3 && thread.x < size.x - 3 &&
        thread.y >= 3 && thread.y < size.y - 3
    ) {
        float t = clamp(threshold, 0.0f, 1.0f);
        float c = pixel.g;
        float ct = c + t, c_t = c - t;

        float p0 = pixelAtOffset(image, ivec2(0, 1)).g;
        float p1 = pixelAtOffset(image, ivec2(1, 1)).g;
        float p2 = pixelAtOffset(image, ivec2(1, 0)).g;
        float p3 = pixelAtOffset(image, ivec2(1, -1)).g;
        float p4 = pixelAtOffset(image, ivec2(0, -1)).g;
        float p5 = pixelAtOffset(image, ivec2(-1, -1)).g;
        float p6 = pixelAtOffset(image, ivec2(-1, 0)).g;
        float p7 = pixelAtOffset(image, ivec2(-1, 1)).g;

        bool possibleCorner =
            ((c_t > p1 || c_t > p5) && (c_t > p3 || c_t > p7)) ||
            ((ct < p1  || ct < p5)  && (ct < p3  || ct < p7))  ;

        if(possibleCorner) {
            int bright = 0, dark = 0, bc = 0, dc = 0;

            if(c_t > p0) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p0) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p1) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p1) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p2) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p2) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p3) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p3) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p4) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p4) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p5) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p5) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p6) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p6) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p7) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p7) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }

            if(bright < 5 && dark < 5) {

                if(bc > 0 && bc < 5) do {
                    if(c_t > p0)           bc += 1; else break;
                    if(c_t > p1 && bc < 5) bc += 1; else break;
                    if(c_t > p2 && bc < 5) bc += 1; else break;
                    if(c_t > p3 && bc < 5) bc += 1; else break;
                } while(false);

                if(dc > 0 && dc < 5) do {
                    if(ct < p0)           dc += 1; else break;
                    if(ct < p1 && dc < 5) dc += 1; else break;
                    if(ct < p2 && dc < 5) dc += 1; else break;
                    if(ct < p3 && dc < 5) dc += 1; else break;
                } while(false);

                // got a corner!
                if(bc >= 5 || dc >= 5)
                    color = vec4(1.0f, pixel.gba);

            }
            else {
                // got a corner!
                color = vec4(1.0f, pixel.gba);
            }
        }
    }
}
