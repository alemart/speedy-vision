const vec4 grey = vec4(0.299f, 0.587f, 0.114f, 0.0f);
uniform sampler2D image;

// Convert to greyscale
void main()
{
    vec4 pixel = currentPixel(image);
    float g = dot(pixel, grey);
    
    color = vec4(g, g, g, 1.0f);
}