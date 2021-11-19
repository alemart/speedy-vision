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
 * speedy-promise.js
 * Speedy Promises: a fast implementation of Promises
 */

const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

const SUSPEND_ASYNC = 1;
const asap = (typeof queueMicrotask !== 'undefined' && queueMicrotask) || // browsers
             (typeof process !== 'undefined' && process.nextTick) || // node.js
             (f => Promise.resolve().then(() => f())); // most compatible

/**
 * SpeedyPromise: Super Fast Promises. SpeedyPromises can
 * interoperate with ES6 Promises. This implementation is
 * based on the Promises/A+ specification.
 * @template T
 */
export class SpeedyPromise
{
    /**
     * Constructor
     * @param {function(function(T=): void, function(Error): void): void} callback
     */
    constructor(callback)
    {
        this._state = PENDING;
        this._value = undefined;

        this._onFulfillment = null;
        this._onRejection = null;
        this._children = 0;
        this[0] = this;
        this._parent = undefined;
        this._flags = 0;

        this._fulfill = this._fulfill.bind(this);
        this._reject = this._reject.bind(this);
        this._resolve = this._resolve.bind(this);
        this._broadcastIfAsync = this._broadcastIfAsync.bind(this);

        callback(this._fulfill, this._reject);
    }

    /**
     * Setup handlers
     * @template U
     * @param {function(T): void|SpeedyPromise<U>|Promise<U>|U} onFulfillment called when the SpeedyPromise is fulfilled
     * @param {function(Error): void|SpeedyPromise<U>|Promise<U>|U} [onRejection] called when the SpeedyPromise is rejected
     * @returns {SpeedyPromise<U>}
     */
    then(onFulfillment, onRejection = null)
    {
        const child = new SpeedyPromise(this._nop);
        child._onFulfillment = typeof onFulfillment === 'function' && onFulfillment;
        child._onRejection = typeof onRejection === 'function' && onRejection;
        child._parent = this;

        this[this._children++] = child; // attach child
        this._flags &= ~SUSPEND_ASYNC; // restore the async behavior
        this._notify();

        return child;
    }

    /**
     * Setup rejection handler
     * @template U
     * @param {function(Error): void|SpeedyPromise<U>|Promise<U>|U} [onRejection] called when the SpeedyPromise is rejected
     * @returns {SpeedyPromise<U>}
     */
    catch(onRejection)
    {
        return this.then(null, onRejection);
    }

    /**
     * Execute a callback when the promise is settled
     * (i.e., fulfilled or rejected)
     * @param {function(): void} onFinally
     * @returns {SpeedyPromise<T>}
     */
    finally(onFinally)
    {
        const fn = val => { onFinally(); return val; };
        return this.then(fn, fn);
    }

    /**
     * Start the computation immediately, synchronously.
     * Can't afford to spend any time at all waiting for micro-tasks, etc.
     * @returns {SpeedyPromise<T>} this
     */
    turbocharge()
    {
        let my = this;

        // suspend the async behavior
        this._flags |= SUSPEND_ASYNC;
        while(my._parent !== undefined) {
            my = my._parent;
            my._flags |= SUSPEND_ASYNC;
        }

        // notify the children of the root
        my._notify(); // will be synchronous

        // return this SpeedyPromise
        return this;
    }

    /**
     * Convert to string
     * @returns {string}
     */
    toString()
    {
        switch(this._state) {
            case PENDING:
                return `SpeedyPromise { <pending> }`;
            case FULFILLED:
                return `SpeedyPromise { <fulfilled> ${this._value} }`;
            case REJECTED:
                return `SpeedyPromise { <rejected> ${this._value} }`;
            default:
                return '';
        }
    }

    /**
     * Creates a resolved SpeedyPromise
     * @template U
     * @param {U} [value]
     * @returns {SpeedyPromise<U>}
     */
    static resolve(value)
    {
        const promise = new SpeedyPromise(this._snop);

        if((typeof value === 'object' && value !== null && 'then' in value) || (typeof value === 'function' && 'then' in value)) {
            // resolve asynchronously
            promise._resolve(value);
        }
        else {
            // fulfill synchronously
            promise._value = value;
            promise._state = FULFILLED;
        }

        return promise;
    }

    /**
     * Creates a rejected SpeedyPromise
     * @template U
     * @param {Error} reason
     * @returns {SpeedyPromise<U>}
     */
    static reject(reason)
    {
        const promise = new SpeedyPromise(this._snop);
        promise._value = reason;
        promise._state = REJECTED;
        return promise;
    }

    /**
     * Returns a SpeedyPromise that resolves to an array
     * containing the results of the input promises/values,
     * in their given order. The returned SpeedyPromise will
     * resolve if all input promises resolve, or reject if
     * any input promise rejects.
     * @template U
     * @param {Iterable<U>|Iterable<SpeedyPromise<U>>|Iterable<Promise<U>>} iterable e.g., a SpeedyPromise[], a thenable[]
     * @returns {SpeedyPromise<U[]>}
     *
     * FIXME iterables need not be all <U>
     */
    static all(iterable)
    {
        return new SpeedyPromise((resolve, reject) => {
            const input = [];

            // get elements
            for(const element of iterable)
                input.push(element);

            // resolve synchronously if there are no elements
            const length = input.length;
            if(length == 0) {
                resolve([]);
                return;
            }

            // resolve asynchronously
            let counter = length;
            const output = new Array(length);
            const partialResolve = i => (val => { output[i] = val; if(0 == --counter) resolve(output); });
            for(let i = 0; i < length; i++) {
                const element = input[i];
                if(element.__proto__ === SpeedyPromise.prototype || element.__proto__ === Promise.prototype)
                    element.then(partialResolve(i), reject);
                else
                    SpeedyPromise.resolve(element).then(partialResolve(i), reject);
            }
        });
    }

    /**
     * Returns a promise that gets fulfilled or rejected as soon
     * as the first promise in the iterable gets fulfilled or
     * rejected (with its value/reason).
     * @template U
     * @param {Iterable<U>|Iterable<SpeedyPromise<U>>|Iterable<Promise<U>>} iterable e.g., a SpeedyPromise[], a thenable[]
     * @returns {SpeedyPromise<U>}
     */
    static race(iterable)
    {
        return new SpeedyPromise((resolve, reject) => {
            const input = [];

            // get elements
            for(const element of iterable)
                input.push(element);

            // if the iterable is empty, the promise
            // will be pending forever...

            // resolve asynchronously
            const length = input.length;
            for(let i = 0; i < length; i++) {
                const element = input[i];
                if(element.__proto__ === SpeedyPromise.prototype || element.__proto__ === Promise.prototype)
                    element.then(resolve, reject);
                else
                    SpeedyPromise.resolve(element).then(resolve, reject);
            }
        });
    }

    /**
     * Fulfill this promise with a value
     * @param {T} value
     */
    _fulfill(value)
    {
        this._setState(FULFILLED, value);
    }

    /**
     * Reject this promise with a reason
     * @param {Error} reason
     */
    _reject(reason)
    {
        this._setState(REJECTED, reason);
    }

    /**
     * Set the state and the value of this promise
     * @param {number} state
     * @param {T|Error} value
     */
    _setState(state, value)
    {
        // the promise is already fulfilled or rejected
        if(this._state != PENDING)
            return;

        // set the new state
        this._state = state;
        this._value = value;
        this._notify();
    }

    /**
     * Notify my children that this promise is no
     * longer pending. This is an async operation:
     * my childen will be notified "as soon
     * as possible" (it will be scheduled).
     * We may force this to be synchronous, though
     */
    _notify()
    {
        // nothing to do
        if(this._state == PENDING)
            return;

        // have we turbocharged this promise?
        if(this._flags & SUSPEND_ASYNC) {
            this._broadcast(); // execute synchronously
            return;
        }

        // install a timer (default behavior)
        asap(this._broadcastIfAsync);
    }

    /**
     * Helper method
     */
    _broadcastIfAsync()
    {
        // we may have installed a timer at some
        // point, but turbocharged the promise later
        if(!(this._flags & SUSPEND_ASYNC))
            this._broadcast();
    }

    /**
     * Tell my children that this promise
     * is either fulfilled or rejected.
     * This is a synchronous operation
     */
    _broadcast()
    {
        const children = this._children;
        const state = this._state;

        if(state === FULFILLED) {
            for(let i = 0; i < children; i++) {
                const child = this[i];
                const callback = child._onFulfillment;

                try {
                    if(callback) {
                        if(callback !== child._nop) {
                            child._resolve(callback(this._value)); // promise resolution procedure
                            child._onFulfillment = child._nop; // will not be called again
                        }
                    }
                    else
                        child._fulfill(this._value);
                }
                catch(e) {
                    child._reject(e);
                }
            }
        }
        else if(state === REJECTED) {
            for(let i = 0; i < children; i++) {
                const child = this[i];
                const callback = child._onRejection;

                try {
                    if(callback) {
                        if(callback !== child._nop) {
                            child._resolve(callback(this._value)); // promise resolution procedure
                            child._onRejection = child._nop; // will not be called again
                        }
                    }
                    else
                        child._reject(this._value);
                }
                catch(e) {
                    child._reject(e);
                }
            }
        }
    }

    /**
     * Promise Resolution Procedure
     * based on the Promises/A+ spec
     * @param {T} x
     */
    _resolve(x)
    {
        if((typeof x !== 'object' && typeof x !== 'function') || (x === null)) { // if(x !== Object(x))
            this._fulfill(x);
            return;
        }

        if(x === this)
            throw new TypeError(); // Circular reference

        if(x.__proto__ === SpeedyPromise.prototype || x.__proto__ === Promise.prototype) {
            x.then(this._resolve, this._reject);
            return;
        }

        try {
            const then = x.then;
            if(typeof then === 'function') {
                let resolve = this._resolve, reject = this._reject;
                try {
                    then.call(x,
                        y => { resolve(y); resolve = reject = this._nop; },
                        r => { reject(r); resolve = reject = this._nop; }
                    );
                }
                catch(e) {
                    if(resolve !== this._nop && reject !== this._nop)
                        this._reject(e);
                }
            }
            else {
                this._fulfill(x);
            }
        }
        catch(e) {
            this._reject(e);
        }
    }

    /**
     * No-operation
     */
    _nop()
    {
    }

    /**
     * Static no-operation
     */
    static _snop()
    {
    }
}

//module.exports = { SpeedyPromise };

/*
// Uncomment to test performance with regular Promises
module.exports = { SpeedyPromise: Promise };
Promise.prototype.turbocharge = function() { return this };
*/
