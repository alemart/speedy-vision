uniform sampler2D image;

// flip y-axis
void main() {
    ivec2 pos = threadLocation();
    pos.y = int(texSize.y) - 1 - pos.y;

    color = pixelAt(image, pos);
}