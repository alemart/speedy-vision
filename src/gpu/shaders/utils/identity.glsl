uniform sampler2D image;

// identity shader: no-op
void main()
{
    color = threadPixel(image);
}