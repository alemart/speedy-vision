/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2022 Alexandre Martins <alemartf(at)gmail.com>
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
 * memory.c
 * Memory management
 */

#include "speedy.h"
#include "memory.h"

/*
 * This is a super simple & super fast bump allocator.
 *
 * Speedy's WASM routines are stateless. This simple approach will
 * work provided that the memory is properly managed by the user.
 */

#define PAGE_SIZE 65536 // 64K, defined by WebAssembly
#define INITIAL_OFFSET 8 // preserve 0 for NULL and use 64-bit alignment

extern unsigned char __heap_base;
extern void bytefill(uint8_t byte, uintptr_t start, uintptr_t end);
extern void copyWithin(uintptr_t target, uintptr_t start, uintptr_t end);

static uintptr_t bumpOffset = INITIAL_OFFSET;
static int allocations = 0; // number of allocations

/**
 * Custom malloc()
 * @param size number of bytes to allocate
 * @returns pointer to the newly allocated memory region or NULL on error
 */
WASM_EXPORT void* malloc(size_t size)
{
    return _malloc(size, "Out of memory!");
}

/**
 * Custom free()
 * @param ptr pointer allocated using malloc()
 */
WASM_EXPORT void free(void* ptr)
{
    _free(ptr, "Double free");
}

/**
 * Custom memset()
 * @param ptr pointer
 * @param byte value to be set (will be converted to unsigned char)
 * @param count number of bytes to set
 * @returns ptr
 */
void* memset(void* ptr, int byte, size_t count)
{
    uint8_t value = (uint8_t)byte;
    uintptr_t start = (uintptr_t)ptr;
    uintptr_t end = start + (uintptr_t)count;

    bytefill(value, start, end);

    return ptr;
}

/**
 * Custom memcpy()
 * @param dest destination address
 * @param src source address
 * @param count number of bytes to copy
 * @returns dest
 */
void* memcpy(void* restrict dest, const void* restrict src, size_t count)
{
    uintptr_t target = (uintptr_t)dest;
    uintptr_t start = (uintptr_t)src;
    uintptr_t end = start + count;

    copyWithin(target, start, end);

    return dest;
}

/**
 * Allocates memory in the heap, displaying an optional error message
 * @param size number of bytes to allocate
 * @param error custom error message or NULL
 * @returns pointer to the newly allocated memory region or NULL on error
 */
void* _malloc(size_t size, const char* error)
{
    // ensure 64-bit alignment
    uintptr_t base = (uintptr_t)(&__heap_base) + ((uintptr_t)(&__heap_base) & 7);
    uintptr_t offset = (bumpOffset += bumpOffset & 7);
    uintptr_t addr = base + offset;

    // allocate memory
    bumpOffset += size;
    ++allocations;

    // out of memory?
    if(addr >= __builtin_wasm_memory_size(0) * PAGE_SIZE) {
        // TODO grow memory
        if(error != NULL)
            fatal(error);

        // error
        return NULL;
    }

    // done!
    return (void*)addr;
}

/**
 * Deallocates a previously allocated memory using _malloc()
 * @param ptr pointer allocated using _malloc()
 * @param error custom error message
 * @returns NULL
 */
void* _free(void* ptr, const char* error)
{
    (void)ptr;

    // clear all memory
    if(--allocations == 0) {
        //puts("Memory cleared.");
        bumpOffset = INITIAL_OFFSET;
    }

    // error!
    if(allocations < 0)
        fatal(error);

    // done!
    return NULL;
}