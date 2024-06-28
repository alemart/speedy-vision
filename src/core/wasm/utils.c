/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2024 Alexandre Martins <alemartf(at)gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * utils.c
 * Generic utilities
 */

#include "utils.h"

static void quicksort(uint8_t* lo, uint8_t* hi, size_t width, int (*cmp)(const void*,const void*,void*), void* context);

/**
 * Swap two elements via individual bytes
 * @param a pointer to the first byte of an element
 * @param b pointer to the first byte of an element
 * @param width number of bytes of an element
 */
#define swap(a, b, width) do { \
    size_t w = (width); \
    \
    if(w == sizeof(uint32_t)) { \
        uint32_t* x = (uint32_t*)(a); \
        uint32_t* y = (uint32_t*)(b); \
        uint32_t t = *x; \
        *x = *y; \
        *y = t; \
        break; \
    } \
    \
    uint8_t* x = (uint8_t*)(a); \
    uint8_t* y = (uint8_t*)(b); \
    while(w-- > 0) { \
        uint8_t t = *x; \
        *(x++) = *y; \
        *(y++) = t; \
    } \
} while(0);

/**
 * Prints a string to stdout, appending a newline to it
 * @param str
 * @returns zero
 */
int puts(const char* str)
{
    extern void print(const char*);
    print(str != NULL ? str : "(null)");
    return 0;
}

/**
 * Convert an integer to a string (useful for debugging purposes)
 * @param value value to convert
 * @param str a buffer of appropriate size
 * @param base either 10 or 16
 * @returns str
 */
char* itoa(int value, char* str, int base)
{
    char* start = str;

    // handle negative values (base 10 only)
    if(value < 0 && base == 10) {
        *(start++) = '-';
        value = -value; // note: value == -value if value == 1 + INT_MAX (this is 0x80000000 if sizeof(int) == 4)
    }

    // write a non-negative value, reversed
    unsigned int val = *((unsigned int*)&value);
    char* p = start;
    switch(base) {
        // we support only base 10 or 16 in this implementation
        case 10:
            do {
                *(p++) = (val % 10) + '0';
            } while(val /= 10);
            break;   

        case 16: {   
            const char a = 'a' - 10;
            do {    
                char digit = val & 0xF;
                *(p++) = digit + (digit > 9 ? a : '0');
            } while(val >>= 4);
            break;
        }

        default:
            break;
    }
    *p = 0;

    // reverse string
    char* q = start;
    while(q < p) {
        char first = *(--p); // swap first <-> last
        *p = *q;
        *(q++) = first;
    }

    // done!
    return str;
}

/**
 * Convert a decimal to a string
 * @param value
 * @returns a statically allocated string
 */
const char* int2str(int value)
{
    static char buf[sizeof(int) * 8 + 1];
    return itoa(value, buf, 10);
}

/**
 * Convert a hexadecimal number to a string
 * @param value
 * @returns a statically allocated string
 */
const char* hex2str(int value)
{
    static char buf[sizeof(int) * 8 + 1];
    return itoa(value, buf, 16);
}






/**
 * Seed the pseudo-random number generator
 * @param seed
 */
WASM_EXPORT void srand(unsigned int seed)
{
    extern uint64_t* xor_seed;

    // make a 64-bit seed
    uint64_t seed64 = (uint64_t)(~seed) | (((uint64_t)seed) << 32);

    // let's use splitmix64 to seed the generator
    for(int i = 0; i <= 1; i++) {
        uint64_t x = (seed64 += UINT64_C(0x9e3779b97f4a7c15));
        x = (x ^ (x >> 30)) * UINT64_C(0xbf58476d1ce4e5b9);
        x = (x ^ (x >> 27)) * UINT64_C(0x94d049bb133111eb);
        xor_seed[i] = x ^ (x >> 31);
    }
}

/**
 * Generate a pseudo-random number in the [0,1) range
 * @returns pseudo-random number
 */
double random()
{
    extern uint64_t (*xor_next)(void);

    // we're using IEEE-754
    uint64_t x = xor_next() >> 12; // extract the higher 52 bits of a random 64-bit word
    x |= UINT64_C(0x3ff0000000000000); // sign bit = 0; exponent = 1023; fraction = random 52 bits
    return *((double*)&x) - 1.0;
}






/**
 * Polymorphic sorting that operates in-place
 * @param array pointer to the first byte of the array that you want to sort
 * @param count number of elements of the array
 * @param width size, in bytes, of each element of the array
 * @param cmp comparison function, as in libc
 * @param context user-data
 * @returns zero on success, non-zero otherwise
 */
errno_t qsort_s(void* array, size_t count, size_t width, int (*cmp)(const void*,const void*,void*), void* context)
{
    // invalid arguments?
    if(array == NULL || cmp == NULL || width == 0)
        return 0xbadc0de;

    // no need to sort?
    if(count <= 1)
        return 0;

    // find the first and to the last elements of the input array
    uint8_t* lo = (uint8_t*)array;
    uint8_t* hi = lo + width * (count - 1); // hi > lo, since count > 1

    // call quicksort
    quicksort(lo, hi, width, cmp, context);

    // done!
    return 0;
}

/**
 * Polymorphic Quicksort
 * @param lo pointer to the first byte of the first element of the partition
 * @param hi pointer to the first byte of the last element of the partition - we expect hi > lo and (hi - lo) % width == 0
 * @param width number of bytes of each element of the partition
 * @param cmp comparison function
 * @param context user-data
 */
void quicksort(uint8_t* lo, uint8_t* hi, size_t width, int (*cmp)(const void*,const void*,void*), void* context)
{
    const size_t LENGTH_OF_SMALL_ARRAY = 8;

    // is the array large enough?
    while(hi > lo && (size_t)(hi - lo) / width > LENGTH_OF_SMALL_ARRAY - 1) {
        // pick a pivot
        size_t sp = (size_t)(hi - lo) / width; // sp > 0, since hi > lo
        //uint8_t* pivot = lo + width * (sp / 2); // hi > mid >= lo
        uint8_t* pivot = lo + width * (size_t)((1 + sp) * random());

        // partition around the pivot
        uint8_t* left = lo;
        uint8_t* right = hi;
        for(;;) {
            while(cmp(left, pivot, context) < 0)
                left += width;
            while(cmp(right, pivot, context) > 0)
                right -= width;

            if(left < right) {
                swap(left, right, width); // swap data
                pivot = pivot == left ? right : (pivot == right ? left : pivot); // swap pivot if necessary
                left += width; right -= width;
                continue; // repeat, because left <= right
            }
            else if(left == right) {
                left += width; right -= width;
                break; // empty, because left > right
            }
            else
                break; // empty, because left > right
        }
        
        // now we know that left > right

        // sort subarrays: recur into the smaller partition
        // and use tail recursion to sort the larger one,
        // so we don't use too much stack space
        if(right > lo && left < hi) {
            if((size_t)(right - lo) > (size_t)(hi - left)) {
                quicksort(left, hi, width, cmp, context);
                hi = right; // tail recursion: quicksort(lo, right, width, cmp, context);
            }
            else {
                quicksort(lo, right, width, cmp, context);
                lo = left; // tail recursion: quicksort(left, hi, width, cmp, context);
            }
        }
        else if(right > lo)
            hi = right;
        else if(left < hi)
            lo = left;
        else
            break; // done!
    }

    // use selection sort on small arrays
    // this will reduce the number of swaps
    // we assume that comparisons are cheaper than swaps,
    // i.e., reading from memory is cheaper than writing to it
    for(uint8_t* p = lo; p < hi; p += width) {
        uint8_t* best = p;

        for(uint8_t* q = p + width; q <= hi; q += width) {
            if(cmp(q, best, context) < 0)
                best = q;
        }

        if(best != p)
            swap(best, p, width); // at most n-1 swaps, where n = 1 + (hi - lo) / width
    }
}

/**
 * Create a range from 0 to length - 1, inclusive
 * @param array allocated array of size >= length
 * @param length number of elements of the array
 * @returns array
 */
int* range(int* array, size_t length)
{
    int n = length;

    for(int i = 0; i < n; i++)
        array[i] = i;

    return array;
}

/**
 * Polymorphic Shuffle
 * @param array array to be shuffled
 * @param count number of elements of the array
 * @param width size, in bytes, of each element of the array
 */
void shuffle(void* array, size_t count, size_t width)
{
    // Fisher-Yattes
    uint8_t* v = (uint8_t*)array;
    unsigned m = count - 1;

    for(unsigned i = 0; i < m; i++) {
        unsigned j = i + random() * (count - i); // i <= j < count

        if(i != j)
            swap(&v[i * width], &v[j * width], width);
    }
}