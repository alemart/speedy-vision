/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for the web
 * Copyright 2020 Alexandre Martins <alemartf(at)gmail.com>
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
 * fast9ml.glsl
 * FAST-9,16 corner detector
 */

uniform sampler2D image;
uniform float threshold;
const ivec4 margin = ivec4(3, 3, 4, 4);

// FAST-9,16 implementation based on Machine Learning
// Adapted from New BSD Licensed fast_9.c code found at
// https://github.com/edrosten/fast-C-src
void main()
{
    vec4 pixel = threadPixel(image);
    ivec2 thread = threadLocation();
    ivec2 size = outputSize();

    // assume it's not a corner
    color = vec4(0.0f, pixel.gba);

    // outside bounds?
    //if(thread.x < 3 || thread.y < 3 || thread.x >= size.x - 3 || thread.y >= size.y - 3)
    if(any(lessThan(ivec4(thread, size - thread), margin)))
        return;

    // is it a corner?
    float t = clamp(threshold, 0.0f, 1.0f);
    float c = pixel.g;
    float ct = c + t, c_t = c - t;
    float p0 = pixelAtOffset(image, ivec2(0, 3)).g;
    float p4 = pixelAtOffset(image, ivec2(3, 0)).g;
    float p8 = pixelAtOffset(image, ivec2(0, -3)).g;
    float p12 = pixelAtOffset(image, ivec2(-3, 0)).g;

    // quick test: not a corner
    if(!(
        ((c_t > p0 || c_t > p8) && (c_t > p4 || c_t > p12)) ||
        ((ct < p0  || ct < p8)  && (ct < p4  || ct < p12))
    ))
        return;

    // corner test
    float p1 = pixelAtOffset(image, ivec2(1, 3)).g;
    float p2 = pixelAtOffset(image, ivec2(2, 2)).g;
    float p3 = pixelAtOffset(image, ivec2(3, 1)).g;
    float p5 = pixelAtOffset(image, ivec2(3, -1)).g;
    float p6 = pixelAtOffset(image, ivec2(2, -2)).g;
    float p7 = pixelAtOffset(image, ivec2(1, -3)).g;
    float p9 = pixelAtOffset(image, ivec2(-1, -3)).g;
    float p10 = pixelAtOffset(image, ivec2(-2, -2)).g;
    float p11 = pixelAtOffset(image, ivec2(-3, -1)).g;
    float p13 = pixelAtOffset(image, ivec2(-3, 1)).g;
    float p14 = pixelAtOffset(image, ivec2(-2, 2)).g;
    float p15 = pixelAtOffset(image, ivec2(-1, 3)).g;

    if(p0 > ct)
     if(p1 > ct)
      if(p2 > ct)
       if(p3 > ct)
        if(p4 > ct)
         if(p5 > ct)
          if(p6 > ct)
           if(p7 > ct)
            if(p8 > ct)
             color = vec4(1.0f, pixel.gba);
            else
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              ;
           else if(p7 < c_t)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              ;
            else if(p14 < c_t)
             if(p8 < c_t)
              if(p9 < c_t)
               if(p10 < c_t)
                if(p11 < c_t)
                 if(p12 < c_t)
                  if(p13 < c_t)
                   if(p15 < c_t)
                    color = vec4(1.0f, pixel.gba);
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              ;
            else
             ;
          else if(p6 < c_t)
           if(p15 > ct)
            if(p13 > ct)
             if(p14 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              ;
            else if(p13 < c_t)
             if(p7 < c_t)
              if(p8 < c_t)
               if(p9 < c_t)
                if(p10 < c_t)
                 if(p11 < c_t)
                  if(p12 < c_t)
                   if(p14 < c_t)
                    color = vec4(1.0f, pixel.gba);
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            if(p7 < c_t)
             if(p8 < c_t)
              if(p9 < c_t)
               if(p10 < c_t)
                if(p11 < c_t)
                 if(p12 < c_t)
                  if(p13 < c_t)
                   if(p14 < c_t)
                    color = vec4(1.0f, pixel.gba);
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              ;
            else
             ;
           else if(p13 < c_t)
            if(p7 < c_t)
             if(p8 < c_t)
              if(p9 < c_t)
               if(p10 < c_t)
                if(p11 < c_t)
                 if(p12 < c_t)
                  if(p14 < c_t)
                   if(p15 < c_t)
                    color = vec4(1.0f, pixel.gba);
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else if(p5 < c_t)
          if(p14 > ct)
           if(p12 > ct)
            if(p13 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  if(p10 > ct)
                   if(p11 > ct)
                    color = vec4(1.0f, pixel.gba);
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             ;
           else if(p12 < c_t)
            if(p6 < c_t)
             if(p7 < c_t)
              if(p8 < c_t)
               if(p9 < c_t)
                if(p10 < c_t)
                 if(p11 < c_t)
                  if(p13 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else if(p14 < c_t)
           if(p7 < c_t)
            if(p8 < c_t)
             if(p9 < c_t)
              if(p10 < c_t)
               if(p11 < c_t)
                if(p12 < c_t)
                 if(p13 < c_t)
                  if(p6 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
                   if(p15 < c_t)
                    color = vec4(1.0f, pixel.gba);
                   else
                    ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           if(p6 < c_t)
            if(p7 < c_t)
             if(p8 < c_t)
              if(p9 < c_t)
               if(p10 < c_t)
                if(p11 < c_t)
                 if(p12 < c_t)
                  if(p13 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else
          if(p12 > ct)
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  if(p10 > ct)
                   if(p11 > ct)
                    color = vec4(1.0f, pixel.gba);
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             ;
           else
            ;
          else if(p12 < c_t)
           if(p7 < c_t)
            if(p8 < c_t)
             if(p9 < c_t)
              if(p10 < c_t)
               if(p11 < c_t)
                if(p13 < c_t)
                 if(p14 < c_t)
                  if(p6 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
                   if(p15 < c_t)
                    color = vec4(1.0f, pixel.gba);
                   else
                    ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
        else if(p4 < c_t)
         if(p13 > ct)
          if(p11 > ct)
           if(p12 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  if(p10 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  if(p10 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            ;
          else if(p11 < c_t)
           if(p5 < c_t)
            if(p6 < c_t)
             if(p7 < c_t)
              if(p8 < c_t)
               if(p9 < c_t)
                if(p10 < c_t)
                 if(p12 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
         else if(p13 < c_t)
          if(p7 < c_t)
           if(p8 < c_t)
            if(p9 < c_t)
             if(p10 < c_t)
              if(p11 < c_t)
               if(p12 < c_t)
                if(p6 < c_t)
                 if(p5 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  if(p14 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                else
                 if(p14 < c_t)
                  if(p15 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                 else
                  ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
         else
          if(p5 < c_t)
           if(p6 < c_t)
            if(p7 < c_t)
             if(p8 < c_t)
              if(p9 < c_t)
               if(p10 < c_t)
                if(p11 < c_t)
                 if(p12 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
        else
         if(p11 > ct)
          if(p12 > ct)
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  if(p10 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  if(p10 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            ;
          else
           ;
         else if(p11 < c_t)
          if(p7 < c_t)
           if(p8 < c_t)
            if(p9 < c_t)
             if(p10 < c_t)
              if(p12 < c_t)
               if(p13 < c_t)
                if(p6 < c_t)
                 if(p5 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  if(p14 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                else
                 if(p14 < c_t)
                  if(p15 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                 else
                  ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
         else
          ;
       else if(p3 < c_t)
        if(p10 > ct)
         if(p11 > ct)
          if(p12 > ct)
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           ;
         else
          ;
        else if(p10 < c_t)
         if(p7 < c_t)
          if(p8 < c_t)
           if(p9 < c_t)
            if(p11 < c_t)
             if(p6 < c_t)
              if(p5 < c_t)
               if(p4 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                if(p12 < c_t)
                 if(p13 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
              else
               if(p12 < c_t)
                if(p13 < c_t)
                 if(p14 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
             else
              if(p12 < c_t)
               if(p13 < c_t)
                if(p14 < c_t)
                 if(p15 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             ;
           else
            ;
          else
           ;
         else
          ;
        else
         ;
       else
        if(p10 > ct)
         if(p11 > ct)
          if(p12 > ct)
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           ;
         else
          ;
        else if(p10 < c_t)
         if(p7 < c_t)
          if(p8 < c_t)
           if(p9 < c_t)
            if(p11 < c_t)
             if(p12 < c_t)
              if(p6 < c_t)
               if(p5 < c_t)
                if(p4 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 if(p13 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
               else
                if(p13 < c_t)
                 if(p14 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
              else
               if(p13 < c_t)
                if(p14 < c_t)
                 if(p15 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
         else
          ;
        else
         ;
      else if(p2 < c_t)
       if(p9 > ct)
        if(p10 > ct)
         if(p11 > ct)
          if(p12 > ct)
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p3 > ct)
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else
          ;
        else
         ;
       else if(p9 < c_t)
        if(p7 < c_t)
         if(p8 < c_t)
          if(p10 < c_t)
           if(p6 < c_t)
            if(p5 < c_t)
             if(p4 < c_t)
              if(p3 < c_t)
               color = vec4(1.0f, pixel.gba);
              else
               if(p11 < c_t)
                if(p12 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
             else
              if(p11 < c_t)
               if(p12 < c_t)
                if(p13 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p11 < c_t)
              if(p12 < c_t)
               if(p13 < c_t)
                if(p14 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            if(p11 < c_t)
             if(p12 < c_t)
              if(p13 < c_t)
               if(p14 < c_t)
                if(p15 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           ;
         else
          ;
        else
         ;
       else
        ;
      else
       if(p9 > ct)
        if(p10 > ct)
         if(p11 > ct)
          if(p12 > ct)
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p3 > ct)
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else
          ;
        else
         ;
       else if(p9 < c_t)
        if(p7 < c_t)
         if(p8 < c_t)
          if(p10 < c_t)
           if(p11 < c_t)
            if(p6 < c_t)
             if(p5 < c_t)
              if(p4 < c_t)
               if(p3 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                if(p12 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
              else
               if(p12 < c_t)
                if(p13 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
             else
              if(p12 < c_t)
               if(p13 < c_t)
                if(p14 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p12 < c_t)
              if(p13 < c_t)
               if(p14 < c_t)
                if(p15 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            ;
          else
           ;
         else
          ;
        else
         ;
       else
        ;
     else if(p1 < c_t)
      if(p8 > ct)
       if(p9 > ct)
        if(p10 > ct)
         if(p11 > ct)
          if(p12 > ct)
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
            else
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p3 > ct)
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else
          if(p2 > ct)
           if(p3 > ct)
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
        else
         ;
       else
        ;
      else if(p8 < c_t)
       if(p7 < c_t)
        if(p9 < c_t)
         if(p6 < c_t)
          if(p5 < c_t)
           if(p4 < c_t)
            if(p3 < c_t)
             if(p2 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p10 < c_t)
               if(p11 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
            else
             if(p10 < c_t)
              if(p11 < c_t)
               if(p12 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
           else
            if(p10 < c_t)
             if(p11 < c_t)
              if(p12 < c_t)
               if(p13 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p10 < c_t)
            if(p11 < c_t)
             if(p12 < c_t)
              if(p13 < c_t)
               if(p14 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else
          if(p10 < c_t)
           if(p11 < c_t)
            if(p12 < c_t)
             if(p13 < c_t)
              if(p14 < c_t)
               if(p15 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
        else
         ;
       else
        ;
      else
       ;
     else
      if(p8 > ct)
       if(p9 > ct)
        if(p10 > ct)
         if(p11 > ct)
          if(p12 > ct)
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
            else
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p3 > ct)
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else
          if(p2 > ct)
           if(p3 > ct)
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
        else
         ;
       else
        ;
      else if(p8 < c_t)
       if(p7 < c_t)
        if(p9 < c_t)
         if(p10 < c_t)
          if(p6 < c_t)
           if(p5 < c_t)
            if(p4 < c_t)
             if(p3 < c_t)
              if(p2 < c_t)
               color = vec4(1.0f, pixel.gba);
              else
               if(p11 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
             else
              if(p11 < c_t)
               if(p12 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
            else
             if(p11 < c_t)
              if(p12 < c_t)
               if(p13 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
           else
            if(p11 < c_t)
             if(p12 < c_t)
              if(p13 < c_t)
               if(p14 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p11 < c_t)
            if(p12 < c_t)
             if(p13 < c_t)
              if(p14 < c_t)
               if(p15 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else
          ;
        else
         ;
       else
        ;
      else
       ;
    else if(p0 < c_t)
     if(p1 > ct)
      if(p8 > ct)
       if(p7 > ct)
        if(p9 > ct)
         if(p6 > ct)
          if(p5 > ct)
           if(p4 > ct)
            if(p3 > ct)
             if(p2 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p10 > ct)
               if(p11 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
            else
             if(p10 > ct)
              if(p11 > ct)
               if(p12 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
           else
            if(p10 > ct)
             if(p11 > ct)
              if(p12 > ct)
               if(p13 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p10 > ct)
            if(p11 > ct)
             if(p12 > ct)
              if(p13 > ct)
               if(p14 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else
          if(p10 > ct)
           if(p11 > ct)
            if(p12 > ct)
             if(p13 > ct)
              if(p14 > ct)
               if(p15 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
        else
         ;
       else
        ;
      else if(p8 < c_t)
       if(p9 < c_t)
        if(p10 < c_t)
         if(p11 < c_t)
          if(p12 < c_t)
           if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
            else
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p3 < c_t)
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else
          if(p2 < c_t)
           if(p3 < c_t)
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
        else
         ;
       else
        ;
      else
       ;
     else if(p1 < c_t)
      if(p2 > ct)
       if(p9 > ct)
        if(p7 > ct)
         if(p8 > ct)
          if(p10 > ct)
           if(p6 > ct)
            if(p5 > ct)
             if(p4 > ct)
              if(p3 > ct)
               color = vec4(1.0f, pixel.gba);
              else
               if(p11 > ct)
                if(p12 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
             else
              if(p11 > ct)
               if(p12 > ct)
                if(p13 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p11 > ct)
              if(p12 > ct)
               if(p13 > ct)
                if(p14 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            if(p11 > ct)
             if(p12 > ct)
              if(p13 > ct)
               if(p14 > ct)
                if(p15 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           ;
         else
          ;
        else
         ;
       else if(p9 < c_t)
        if(p10 < c_t)
         if(p11 < c_t)
          if(p12 < c_t)
           if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p3 < c_t)
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else
          ;
        else
         ;
       else
        ;
      else if(p2 < c_t)
       if(p3 > ct)
        if(p10 > ct)
         if(p7 > ct)
          if(p8 > ct)
           if(p9 > ct)
            if(p11 > ct)
             if(p6 > ct)
              if(p5 > ct)
               if(p4 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                if(p12 > ct)
                 if(p13 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
              else
               if(p12 > ct)
                if(p13 > ct)
                 if(p14 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
             else
              if(p12 > ct)
               if(p13 > ct)
                if(p14 > ct)
                 if(p15 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             ;
           else
            ;
          else
           ;
         else
          ;
        else if(p10 < c_t)
         if(p11 < c_t)
          if(p12 < c_t)
           if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           ;
         else
          ;
        else
         ;
       else if(p3 < c_t)
        if(p4 > ct)
         if(p13 > ct)
          if(p7 > ct)
           if(p8 > ct)
            if(p9 > ct)
             if(p10 > ct)
              if(p11 > ct)
               if(p12 > ct)
                if(p6 > ct)
                 if(p5 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  if(p14 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                else
                 if(p14 > ct)
                  if(p15 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                 else
                  ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
         else if(p13 < c_t)
          if(p11 > ct)
           if(p5 > ct)
            if(p6 > ct)
             if(p7 > ct)
              if(p8 > ct)
               if(p9 > ct)
                if(p10 > ct)
                 if(p12 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else if(p11 < c_t)
           if(p12 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  if(p10 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  if(p10 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            ;
          else
           ;
         else
          if(p5 > ct)
           if(p6 > ct)
            if(p7 > ct)
             if(p8 > ct)
              if(p9 > ct)
               if(p10 > ct)
                if(p11 > ct)
                 if(p12 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
        else if(p4 < c_t)
         if(p5 > ct)
          if(p14 > ct)
           if(p7 > ct)
            if(p8 > ct)
             if(p9 > ct)
              if(p10 > ct)
               if(p11 > ct)
                if(p12 > ct)
                 if(p13 > ct)
                  if(p6 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
                   if(p15 > ct)
                    color = vec4(1.0f, pixel.gba);
                   else
                    ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else if(p14 < c_t)
           if(p12 > ct)
            if(p6 > ct)
             if(p7 > ct)
              if(p8 > ct)
               if(p9 > ct)
                if(p10 > ct)
                 if(p11 > ct)
                  if(p13 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else if(p12 < c_t)
            if(p13 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  if(p10 < c_t)
                   if(p11 < c_t)
                    color = vec4(1.0f, pixel.gba);
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             ;
           else
            ;
          else
           if(p6 > ct)
            if(p7 > ct)
             if(p8 > ct)
              if(p9 > ct)
               if(p10 > ct)
                if(p11 > ct)
                 if(p12 > ct)
                  if(p13 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else if(p5 < c_t)
          if(p6 > ct)
           if(p15 < c_t)
            if(p13 > ct)
             if(p7 > ct)
              if(p8 > ct)
               if(p9 > ct)
                if(p10 > ct)
                 if(p11 > ct)
                  if(p12 > ct)
                   if(p14 > ct)
                    color = vec4(1.0f, pixel.gba);
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else if(p13 < c_t)
             if(p14 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              ;
            else
             ;
           else
            if(p7 > ct)
             if(p8 > ct)
              if(p9 > ct)
               if(p10 > ct)
                if(p11 > ct)
                 if(p12 > ct)
                  if(p13 > ct)
                   if(p14 > ct)
                    color = vec4(1.0f, pixel.gba);
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else if(p6 < c_t)
           if(p7 > ct)
            if(p14 > ct)
             if(p8 > ct)
              if(p9 > ct)
               if(p10 > ct)
                if(p11 > ct)
                 if(p12 > ct)
                  if(p13 > ct)
                   if(p15 > ct)
                    color = vec4(1.0f, pixel.gba);
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              ;
            else
             ;
           else if(p7 < c_t)
            if(p8 < c_t)
             color = vec4(1.0f, pixel.gba);
            else
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              ;
           else
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              ;
            else
             ;
          else
           if(p13 > ct)
            if(p7 > ct)
             if(p8 > ct)
              if(p9 > ct)
               if(p10 > ct)
                if(p11 > ct)
                 if(p12 > ct)
                  if(p14 > ct)
                   if(p15 > ct)
                    color = vec4(1.0f, pixel.gba);
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              ;
            else
             ;
           else
            ;
         else
          if(p12 > ct)
           if(p7 > ct)
            if(p8 > ct)
             if(p9 > ct)
              if(p10 > ct)
               if(p11 > ct)
                if(p13 > ct)
                 if(p14 > ct)
                  if(p6 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
                   if(p15 > ct)
                    color = vec4(1.0f, pixel.gba);
                   else
                    ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else if(p12 < c_t)
           if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  if(p10 < c_t)
                   if(p11 < c_t)
                    color = vec4(1.0f, pixel.gba);
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             ;
           else
            ;
          else
           ;
        else
         if(p11 > ct)
          if(p7 > ct)
           if(p8 > ct)
            if(p9 > ct)
             if(p10 > ct)
              if(p12 > ct)
               if(p13 > ct)
                if(p6 > ct)
                 if(p5 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  if(p14 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                else
                 if(p14 > ct)
                  if(p15 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                 else
                  ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
         else if(p11 < c_t)
          if(p12 < c_t)
           if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  if(p10 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  if(p10 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            ;
          else
           ;
         else
          ;
       else
        if(p10 > ct)
         if(p7 > ct)
          if(p8 > ct)
           if(p9 > ct)
            if(p11 > ct)
             if(p12 > ct)
              if(p6 > ct)
               if(p5 > ct)
                if(p4 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 if(p13 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
               else
                if(p13 > ct)
                 if(p14 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
              else
               if(p13 > ct)
                if(p14 > ct)
                 if(p15 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
         else
          ;
        else if(p10 < c_t)
         if(p11 < c_t)
          if(p12 < c_t)
           if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           ;
         else
          ;
        else
         ;
      else
       if(p9 > ct)
        if(p7 > ct)
         if(p8 > ct)
          if(p10 > ct)
           if(p11 > ct)
            if(p6 > ct)
             if(p5 > ct)
              if(p4 > ct)
               if(p3 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                if(p12 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
              else
               if(p12 > ct)
                if(p13 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
             else
              if(p12 > ct)
               if(p13 > ct)
                if(p14 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p12 > ct)
              if(p13 > ct)
               if(p14 > ct)
                if(p15 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            ;
          else
           ;
         else
          ;
        else
         ;
       else if(p9 < c_t)
        if(p10 < c_t)
         if(p11 < c_t)
          if(p12 < c_t)
           if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p3 < c_t)
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else
          ;
        else
         ;
       else
        ;
     else
      if(p8 > ct)
       if(p7 > ct)
        if(p9 > ct)
         if(p10 > ct)
          if(p6 > ct)
           if(p5 > ct)
            if(p4 > ct)
             if(p3 > ct)
              if(p2 > ct)
               color = vec4(1.0f, pixel.gba);
              else
               if(p11 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
             else
              if(p11 > ct)
               if(p12 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
            else
             if(p11 > ct)
              if(p12 > ct)
               if(p13 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
           else
            if(p11 > ct)
             if(p12 > ct)
              if(p13 > ct)
               if(p14 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p11 > ct)
            if(p12 > ct)
             if(p13 > ct)
              if(p14 > ct)
               if(p15 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else
          ;
        else
         ;
       else
        ;
      else if(p8 < c_t)
       if(p9 < c_t)
        if(p10 < c_t)
         if(p11 < c_t)
          if(p12 < c_t)
           if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
            else
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p3 < c_t)
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else
          if(p2 < c_t)
           if(p3 < c_t)
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
        else
         ;
       else
        ;
      else
       ;
    else
     if(p7 > ct)
      if(p8 > ct)
       if(p9 > ct)
        if(p6 > ct)
         if(p5 > ct)
          if(p4 > ct)
           if(p3 > ct)
            if(p2 > ct)
             if(p1 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p10 > ct)
               color = vec4(1.0f, pixel.gba);
              else
               ;
            else
             if(p10 > ct)
              if(p11 > ct)
               color = vec4(1.0f, pixel.gba);
              else
               ;
             else
              ;
           else
            if(p10 > ct)
             if(p11 > ct)
              if(p12 > ct)
               color = vec4(1.0f, pixel.gba);
              else
               ;
             else
              ;
            else
             ;
          else
           if(p10 > ct)
            if(p11 > ct)
             if(p12 > ct)
              if(p13 > ct)
               color = vec4(1.0f, pixel.gba);
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else
          if(p10 > ct)
           if(p11 > ct)
            if(p12 > ct)
             if(p13 > ct)
              if(p14 > ct)
               color = vec4(1.0f, pixel.gba);
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
        else
         if(p10 > ct)
          if(p11 > ct)
           if(p12 > ct)
            if(p13 > ct)
             if(p14 > ct)
              if(p15 > ct)
               color = vec4(1.0f, pixel.gba);
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
         else
          ;
       else
        ;
      else
       ;
     else if(p7 < c_t)
      if(p8 < c_t)
       if(p9 < c_t)
        if(p6 < c_t)
         if(p5 < c_t)
          if(p4 < c_t)
           if(p3 < c_t)
            if(p2 < c_t)
             if(p1 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p10 < c_t)
               color = vec4(1.0f, pixel.gba);
              else
               ;
            else
             if(p10 < c_t)
              if(p11 < c_t)
               color = vec4(1.0f, pixel.gba);
              else
               ;
             else
              ;
           else
            if(p10 < c_t)
             if(p11 < c_t)
              if(p12 < c_t)
               color = vec4(1.0f, pixel.gba);
              else
               ;
             else
              ;
            else
             ;
          else
           if(p10 < c_t)
            if(p11 < c_t)
             if(p12 < c_t)
              if(p13 < c_t)
               color = vec4(1.0f, pixel.gba);
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else
          if(p10 < c_t)
           if(p11 < c_t)
            if(p12 < c_t)
             if(p13 < c_t)
              if(p14 < c_t)
               color = vec4(1.0f, pixel.gba);
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
        else
         if(p10 < c_t)
          if(p11 < c_t)
           if(p12 < c_t)
            if(p13 < c_t)
             if(p14 < c_t)
              if(p15 < c_t)
               color = vec4(1.0f, pixel.gba);
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
         else
          ;
       else
        ;
      else
       ;
     else
      ;
}
