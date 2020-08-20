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
 * test-tuner.js
 * A tuner created for testing purposes
 */

import { Tuner } from './tuner';

/**
 * A Tuner created for testing purposes
 */
export class TestTuner extends Tuner
{
    /**
     * Class constructor
     * @param {number} minState minimum integer accepted by the unknown system
     * @param {number} maxState maximum integer accepted by the unknown system
     */
    constructor(minState, maxState)
    {
        super(minState, minState, maxState);
    }

    // where should I go next?
    _nextState()
    {
        //console.log(this.info());
        const nextState = this._state + 1;
        return nextState > this._maxState ? this._minState : nextState;
    }

    // let me see stuff
    info()
    {
        return {
            state: [ this._state, this._bucketOf(this._state).average ],
            data: JSON.stringify(this._bucket.map(b => b.average)),
        };
    }
}