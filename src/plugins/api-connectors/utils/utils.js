import { isProxy, isReactive, isRef, toRaw, unref } from 'vue';

/**
 * @param {function[]} functions
 * @param args
 */
export function callFunctions(functions, ...args) {
    functions.forEach((fn) => {
        if (typeof fn === 'function') {
            fn(...args);
        }
    });
}

export function deepToRaw(sourceObj) {
    const objectIterator = (input) => {
        if (Array.isArray(input)) {
            return input.map((item) => objectIterator(item));
        }
        if (isRef(input)) {
            return objectIterator(unref(input));
        }
        if (isReactive(input) || isProxy(input)) {
            return objectIterator(toRaw(input));
        }
        if (input && typeof input === 'object') {
            return Object.getOwnPropertyNames(input).reduce((acc, key) => {
                acc[key] = objectIterator(input[key]);
                return acc;
            }, {});
        }
        return input;
    };

    return objectIterator(sourceObj);
}
