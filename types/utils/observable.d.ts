/**
 * Implementation of the Observer design pattern
 * @abstract
 */
export class Observable {
    /** @type {Function[]} subscribers / callbacks */
    _subscribers: Function[];
    /** @type {object[]} "this" pointers */
    _thisptr: object[];
    /** @type {Array<any[]>} function arguments */
    _args: Array<any[]>;
    /**
     * Add subscriber
     * @param {Function} fn callback
     * @param {object} [thisptr] "this" pointer to be used when invoking the callback
     * @param {...any} args arguments to be passed to the callback
     */
    subscribe(fn: Function, thisptr?: object, ...args: any[]): void;
    /**
     * Remove subscriber
     * @param {Function} fn previously added callback
     * @param {object} [thisptr] "this" pointer
     */
    unsubscribe(fn: Function, thisptr?: object): void;
    /**
     * Notify all subscribers about a state change
     * @protected
     */
    protected _notify(): void;
}
