/**
 * Handles simple events triggering.
 *
 * @param BaseClass
 * @return {{new(): {#eventsListeners~1: [], isAListenerSet(): boolean, triggerEvent(*): Promise<Awaited<unknown>[]|undefined>, setEventsListener(*): void}, prototype: {#eventsListeners~1: [], isAListenerSet(): boolean, triggerEvent(*): Promise<Awaited<unknown>[]|undefined>, setEventsListener(*): void}}}
 * @constructor
 */
export const EventsMixin = (BaseClass) =>
    class extends (BaseClass || class {}) {
        #eventsListeners = [];

        /**
         * @param {function} fn
         */
        setEventsListener(fn) {
            if (typeof fn === 'function') {
                this.#eventsListeners.push(fn);
            } else {
                throw new Error('Listener must be a function');
            }
        }

        removeAllListeners() {
            this.#eventsListeners = [];
        }

        isAListenerSet() {
            return this.#eventsListeners.length > 0;
        }

        /**
         * @param {EventsMixinEvent} event
         * @return {Promise<Awaited<unknown>[]>}
         */
        async triggerEvent(event) {
            if (this.isAListenerSet()) {
                event.waitFor = [];

                this.#eventsListeners.forEach((listner) => {
                    listner(event);
                });

                if (event.waitFor.length > 0) {
                    return await Promise.all(event.waitFor);
                }
            }
        }
    };

/**
 * EventsMixinEvent object
 * @typedef {Object} EventsMixinEvent
 * @property {string} name Event name
 * @property {*} [data] Event's data
 * @property {array} [waitFor] Array of promises to be await
 */
