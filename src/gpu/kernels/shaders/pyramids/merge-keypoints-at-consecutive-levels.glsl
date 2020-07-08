uniform sampler2D largerImage;
uniform sampler2D smallerImage;

// merge keypoints at CONSECUTIVE pyramid levels
// area(largerImage) = 4 x area(smallerImage)
// size(largerImage) = size(output)
void main()
{
    ivec2 thread = threadLocation();
    vec4 lg = pixelAt(largerImage, min(thread, textureSize(largerImage, 0) - 1));
    vec4 sm = pixelAt(smallerImage, min(thread / 2, textureSize(smallerImage, 0) - 1));
    bool cond = (((thread.x & 1) + (thread.y & 1)) == 0) && (sm.r > lg.r);

    // copy corner score & scale
    color = mix(
        lg,
        vec4(sm.r, lg.gb, sm.a),
        bvec4(cond, cond, cond, cond)
    );
}