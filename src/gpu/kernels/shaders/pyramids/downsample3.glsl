uniform sampler2D image;

void main()
{
    ivec2 thread = threadLocation();
    ivec2 pos = min(thread * 3, textureSize(image, 0) - 1);
    
    color = pixelAt(image, pos);
}