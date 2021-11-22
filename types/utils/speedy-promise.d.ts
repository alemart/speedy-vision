/**
 * SpeedyPromise: Super Fast Promises. SpeedyPromises can
 * interoperate with ES6 Promises. This implementation is
 * based on the Promises/A+ specification.
 * @template T
 */
export class SpeedyPromise<T> {
    /**
     * Creates a resolved SpeedyPromise
     * @template U
     * @param {U} [value]
     * @returns {SpeedyPromise<U>}
     */
    static resolve<U_2>(value?: U_2 | undefined): SpeedyPromise<U_2>;
    /**
     * Creates a rejected SpeedyPromise
     * @template U
     * @param {Error} reason
     * @returns {SpeedyPromise<U>}
     */
    static reject<U_3>(reason: Error): SpeedyPromise<U_3>;
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
    static all<U_4>(iterable: Iterable<U_4> | Iterable<SpeedyPromise<U_4>> | Iterable<Promise<U_4>>): SpeedyPromise<U_4[]>;
    /**
     * Returns a promise that gets fulfilled or rejected as soon
     * as the first promise in the iterable gets fulfilled or
     * rejected (with its value/reason).
     * @template U
     * @param {Iterable<U>|Iterable<SpeedyPromise<U>>|Iterable<Promise<U>>} iterable e.g., a SpeedyPromise[], a thenable[]
     * @returns {SpeedyPromise<U>}
     */
    static race<U_5>(iterable: Iterable<U_5> | Iterable<SpeedyPromise<U_5>> | Iterable<Promise<U_5>>): SpeedyPromise<U_5>;
    /**
     * Static no-operation
     */
    static _snop(): void;
    /**
     * Constructor
     * @param {function(function(T=): void, function(Error): void): void} callback
     */
    constructor(callback: (arg0: (arg0: T | undefined) => void, arg1: (arg0: Error) => void) => void);
    _state: number;
    _value: Error | T | undefined;
    _onFulfillment: any;
    _onRejection: any;
    _children: number;
    0: SpeedyPromise<T>;
    _parent: any;
    _flags: number;
    /**
     * Fulfill this promise with a value
     * @param {T} value
     */
    _fulfill(value: T): void;
    /**
     * Reject this promise with a reason
     * @param {Error} reason
     */
    _reject(reason: Error): void;
    /**
     * Promise Resolution Procedure
     * based on the Promises/A+ spec
     * @param {T} x
     */
    _resolve(x: T): void;
    /**
     * Helper method
     */
    _broadcastIfAsync(): void;
    /**
     * Setup handlers
     * @template U, V=never
     * @param {null|undefined|(function(T): U|PromiseLike<U>|SpeedyPromise<U>)} onFulfillment called when the SpeedyPromise is fulfilled
     * @param {null|undefined|(function(Error): V|PromiseLike<V>|SpeedyPromise<V>)} [onRejection] called when the SpeedyPromise is rejected
     * @returns {SpeedyPromise<U>}
     */
    then<U, V>(onFulfillment: ((arg0: T) => U | PromiseLike<U> | SpeedyPromise<U>) | null | undefined, onRejection?: ((arg0: Error) => V | PromiseLike<V> | SpeedyPromise<V>) | null | undefined): SpeedyPromise<U>;
    /**
     * Setup rejection handler
     * @template U, V=never
     * @param {null|undefined|(function(Error): V|PromiseLike<V>|SpeedyPromise<V>)} [onRejection] called when the SpeedyPromise is rejected
     * @returns {SpeedyPromise<U>}
     */
    catch<U_1, V_1>(onRejection?: ((arg0: Error) => V_1 | PromiseLike<V_1> | SpeedyPromise<V_1>) | null | undefined): SpeedyPromise<U_1>;
    /**
     * Execute a callback when the promise is settled
     * (i.e., fulfilled or rejected)
     * @param {function(): void} onFinally
     * @returns {SpeedyPromise<T>}
     */
    finally(onFinally: () => void): SpeedyPromise<T>;
    /**
     * Start the computation immediately, synchronously.
     * Can't afford to spend any time at all waiting for micro-tasks, etc.
     * @returns {SpeedyPromise<T>} this
     */
    turbocharge(): SpeedyPromise<T>;
    /**
     * Convert to string
     * @returns {string}
     */
    toString(): string;
    /**
     * Set the state and the value of this promise
     * @param {number} state
     * @param {T|Error} value
     */
    _setState(state: number, value: T | Error): void;
    /**
     * Notify my children that this promise is no
     * longer pending. This is an async operation:
     * my childen will be notified "as soon
     * as possible" (it will be scheduled).
     * We may force this to be synchronous, though
     */
    _notify(): void;
    /**
     * Tell my children that this promise
     * is either fulfilled or rejected.
     * This is a synchronous operation
     */
    _broadcast(): void;
    /**
     * No-operation
     */
    _nop(): void;
    /**
     * Symbol.toStringTag
     * @returns {string}
     */
    get [Symbol.toStringTag](): string;
}
