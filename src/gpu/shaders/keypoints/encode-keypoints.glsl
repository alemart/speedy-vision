@include "keypoints.glsl"

uniform sampler2D corners;

precision mediump usampler2D;
uniform usampler2D lookupTable;
uniform int stride; // width of the lookup table

uniform int descriptorSize;
uniform int extraSize;
uniform int encoderLength;
uniform int encoderCapacity;

const uvec2 NULL_ELEMENT = uvec2(0xFFFFu);

void main()
{
    ivec2 thread = threadLocation();
    KeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);
    int index = findKeypointIndex(address, descriptorSize, extraSize);

    ivec2 pos = ivec2(index % stride, index / stride);
    uvec4 entry = texelFetch(lookupTable, pos, 0);

    // end of list?
    color = encodeNullKeypoint();
    if(all(equal(entry.xy, NULL_ELEMENT)) || index >= encoderCapacity)
        return;

    // position cell?
    color = encodeKeypointPosition(vec2(entry.xy));
    if(address.offset == 0)
        return;

    // not in a header (really?)
    color = vec4(0.0f);
    if(address.offset > 1)
        return;

    // properties cell?
    vec4 pixel = texelFetch(corners, ivec2(entry.xy), 0);
    vec2 encodedScore = encodeKeypointScore(decodeFloat16(pixel.rb)); // duh
    float encodedOrientation = encodeKeypointOrientation(0.0f);
    float encodedLod = pixel.a; // encodeLod(decodeLod(pixel.a)); // duh
    color = vec4(encodedLod, encodedOrientation, encodedScore);
}