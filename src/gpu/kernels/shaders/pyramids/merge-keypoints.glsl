uniform sampler2D target;
uniform sampler2D source;

// merge keypoints having the same scale, i.e.,
// size(target) = size(source) = size(output)
void main()
{
    vec4 a = currentPixel(target);
    vec4 b = currentPixel(source);

    // copy corner score & scale
    color = mix(
        a,
        vec4(b.r, a.gb, b.a),
        b.r > a.r
    );
}