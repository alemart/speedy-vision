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
 * utils.h
 * Generic utilities
 */

#ifndef _UTILS_H
#define _UTILS_H

#include "base.h"

//
// Program flow
//

/**
 * Crash the application with a message
 * @param message error message
 */
extern void fatal(const char* message);

/**
 * Verify if expr is true
 * @param expr expression
 */
#define assert(expr) do { \
    if(!(expr)) \
        fatal("Assertion failed at " __FILE__ ":" STR(__LINE__)); \
} while(0)



//
// Numeric utilities
//

#define max(x, y) ((x) > (y) ? (x) : (y))
#define min(x, y) ((x) < (y) ? (x) : (y))
#define sign(x) (((x) >= 0) - ((x) < 0)) // +1 or -1



//
// String utilities
//

int puts(const char* str);
char* itoa(int value, char* str, int base);

const char* int2str(int value);
const char* hex2str(int value);



//
// General utilities
//

void srand(unsigned int seed);
errno_t qsort_s(void* array, size_t count, size_t width, int (*cmp)(const void*,const void*,void*), void* context);

double random();
int* range(int* array, size_t length);
void shuffle(void* array, size_t count, size_t width);

#endif