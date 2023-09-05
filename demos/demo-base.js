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

    context.drawImage(media.source, x, y, width, height);
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
    const script = document.createElement('script');

    script.addEventListener('load', () => {
        kofiWidgetOverlay.draw('alemart', {
            'type': 'floating-chat',
            'floating-chat.donateButton.text': 'Support me',
            'floating-chat.donateButton.background-color': 'royalblue',
            'floating-chat.donateButton.text-color': 'white'
        });
    });

    script.addEventListener('error', e => console.log(`Can't load the Ko-fi widget`, e));

    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';

    document.body.appendChild(script);
});