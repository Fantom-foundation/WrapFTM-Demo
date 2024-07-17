import { delay } from 'fantom-vue3-components';

/**
 * @param {function[]} fns
 * @return {Promise<*>[]}
 */
function callFns(fns) {
    return fns.map((fn) => {
        if (typeof fn === 'function') {
            return fn();
        } else {
            throw new Error('fns[i] is not a function');
        }
    });
}

/**
 * @param {function[]} fns
 * @param {number} [batchSize] Positive integer
 * @param {function({ batchResult: *[], fromIndex: number, toIndex: number})} [batchFn]
 * @param {function} stopFn
 * @param {number} [delayMs] Delay in milliseconds between each batches
 * @return {Promise<*[]>}
 */
export async function processPromisesBatch({
    fns,
    batchSize = 0,
    batchFn = null,
    stopFn = null,
    delayMs = 0,
}) {
    if (!Array.isArray(fns)) {
        throw new Error('fns is not an array');
    }

    let result = [];
    let stop = false;

    if (fns.length === 0) {
        return [];
    }

    if (typeof stopFn === 'function') {
        stopFn(() => {
            stop = true;
        });
    }

    if (batchSize > 0) {
        let batch = [];
        let batchResult = [];
        let fromIndex = 0;

        for (let i = 0, len = fns.length; i < len; i++) {
            if (stop) {
                return result;
            }

            batch.push(fns[i]);

            if (batch.length === batchSize || i === len - 1) {
                batchResult = await Promise.all(callFns(batch));

                if (typeof batchFn === 'function') {
                    batchFn({
                        batchResult,
                        fromIndex,
                        toIndex: i,
                    });
                }

                result.push(batchResult);

                batch = [];
                fromIndex = i + 1;

                if (delayMs > 0) {
                    await delay(delayMs);
                }
            }
        }
    } else {
        result = await Promise.all(callFns(fns));
    }

    return result;
}
