// ----------------------------------------------------------------------------
// This shader is automatically included in all shaders used by Speedy
// ----------------------------------------------------------------------------

//
// GENERAL
//

// Integer position of the current texel
#define threadLocation() ivec2(texCoord * texSize)

// Output size
#define outputSize() ivec2(texSize)



//
// PIXEL ACCESS
//

// Get current pixel (independent texture lookup)
#define threadPixel(img) textureLod((img), texCoord, 0.0f)

// Get pixel at (x,y): REQUIRES MANUAL BOUNDARY CHECKING
#define pixelAt(img, pos) texelFetch((img), (pos), 0)

// Get the pixel at a constant (dx,dy) offset from the thread pixel (use |dx|,|dy| <= 7)
// This assumes textureSize(img, 0) == ivec2(texSize)
#define pixelAtOffset(img, offset) textureLodOffset((img), texCoord, 0.0f, (offset))