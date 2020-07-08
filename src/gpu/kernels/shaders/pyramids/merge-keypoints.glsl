uniform sampler2D target;
uniform sampler2D source;

// merge keypoints having the same scale, i.e.,
// size(target) = size(source) = size(output)
void main()
{
    vec4 a = threadPixel(target);
    vec4 b = threadPixel(source);
    bool cond = (b.r > a.r);

    // copy corner score & scale
    color = mix(
        a,
        vec4(b.r, a.gb, b.a),
        bvec4(cond, cond, cond, cond)
    );
}