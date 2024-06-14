/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for the web
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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
 * demo-base.js
 * Utilities for the demos
 */

function setupCanvas(id, width, height, title = '')
{
    const canvas = document.getElementById(id);

    if(canvas) {
        canvas.width = width;
        canvas.height = height;
        canvas.title = title;
    }

    return canvas;
}

function renderMedia(media, canvas, x = 0, y = 0, width = media.width, height = media.height)
{
    const context = canvas.getContext('2d');

    if(media.type != 'data')
        context.drawImage(media.source, x, y, width, height);
    else
        context.putImageData(media.source, x, y, 0, 0, width, height);
}

function renderKeypoints(canvas, keypoints, color = 'yellow', size = 1, thickness = 1)
{
    const context = canvas.getContext('2d');

    context.beginPath();
    for(let i = keypoints.length - 1; i >= 0; i--) {
        const keypoint = keypoints[i];
        const radius = size * keypoint.scale;

        // draw scaled circle
        context.moveTo(keypoint.x + radius, keypoint.y);
        context.arc(keypoint.x, keypoint.y, radius, 0, Math.PI * 2.0);

        // draw rotation line
        const sin = Math.sin(keypoint.rotation);
        const cos = Math.cos(keypoint.rotation);
        context.moveTo(keypoint.x, keypoint.y);
        context.lineTo(keypoint.x + radius * cos, keypoint.y + radius * sin);
    }
    context.lineWidth = thickness;
    context.strokeStyle = color;
    context.stroke();
}

function renderStatus(arr = null, label = 'Keypoints')
{
    const status = document.getElementById('status');

    if(Array.isArray(arr))
        status.innerText = `FPS: ${Speedy.fps} | ${label}: ${arr.length}`;
    else
        status.innerText = `FPS: ${Speedy.fps}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search);

    // link the query string to Speedy.Settings
    for(const [key, value] of params) {
        const setting = Object.getOwnPropertyDescriptor(Speedy.Settings, key);

        if(setting !== undefined && setting.set !== undefined)
            setting.set(value);
    }
});