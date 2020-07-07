uniform sampler2D image;

void main()
{
    ivec2 thread = threadLocation();
    color = pixelAt(image, thread * 2);
}