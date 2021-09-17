/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * memory.h
 * Memory management
 */

#ifndef _MEMORY_H
#define _MEMORY_H

#include "base.h"

#define smalloc(size) _malloc((size), "Out of memory at "__FILE__ ":" STR(__LINE__))
#define sfree(ptr) _free((ptr), "Double free at " __FILE__ ":" STR(__LINE__))

void* malloc(size_t size);
void free(void* ptr);
void* _malloc(size_t size, const char* error);
void* _free(void* ptr, const char* error);

void* memset(void* ptr, int byte, size_t count);
void* memcpy(void* restrict dest, const void* restrict src, size_t count);

#endif