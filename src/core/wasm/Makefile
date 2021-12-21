#
# speedy-vision.js
# GPU-accelerated Computer Vision for JavaScript
# Copyright 2020-2021 Alexandre Martins <alemartf(at)gmail.com>
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# Makefile
# WebAssembly-related makefile
#

OBJS32 = mat32.o arithmetic32.o qr32.o homography32.o affine32.o ransac32.o transform32.o
OBJS = base.o memory.o utils.o xoroshiro128plus.o ${OBJS32}

CC = clang
LD = wasm-ld
BASE64 = base64

BASE64_BINARY = speedy-matrix.wasm.txt
WASM_BINARY = speedy-matrix.wasm
IMPORTS_FILE = imports.syms
STACK_SIZE = 65536

CFLAGS = --target=wasm32 -nostdlib -fvisibility=hidden -std=c11 -O2
LDFLAGS = --no-entry --import-memory -z,stack=size=$(STACK_SIZE) --export-dynamic --allow-undefined-file=$(IMPORTS_FILE) --strip-all

$(BASE64_BINARY): $(WASM_BINARY)
	$(BASE64) $(WASM_BINARY) > $(BASE64_BINARY)

$(WASM_BINARY): $(OBJS)
	$(LD) $(LDFLAGS) -o $(WASM_BINARY) $^

%.o: %.c
	$(CC) $(CFLAGS) -MD -c $*.c -o $@

clean:
	rm -f *.o *.d
	rm -f $(WASM_BINARY)
	rm -f $(BASE64_BINARY)

-include $(OBJS:.o=.d)
