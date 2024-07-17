import { vi } from 'vitest';
import { processPromisesBatch } from '@/utils/processPromisesBatch/processPromisesBatch.js';

let fn = null;

function FNS(len = 10) {
    // return new Array(len).fill(fn);
    return new Array(len).fill(null).map((item, idx) => () => {
        return fn(idx);
    });
}

beforeEach(() => {
    fn = vi.fn(
        (idx) =>
            new Promise((resolve) => {
                resolve(idx);
            })
    );
});

afterEach(() => {
    fn = null;
    vi.clearAllMocks();
});

describe('processPromisesBatch()', function () {
    it('should process all given array of functions (that return promises) if no batch size is given and return result', async () => {
        const result = await processPromisesBatch({ fns: FNS(3) });

        expect(fn).toHaveBeenCalledTimes(3);
        expect(result).toEqual([0, 1, 2]);
    });

    it('should throw an error if one of the given fns item is not an function', async () => {
        const error = new Error('fns[i] is not a function');

        try {
            await processPromisesBatch({ fns: ['foo'] });
        } catch (err) {
            expect(err).toEqual(error);
        }

        try {
            await processPromisesBatch({
                fns: ['foo', 'foo2'],
                batchSize: 2,
                batchFn: () => {},
            });
        } catch (err) {
            expect(err).toEqual(error);
        }
    });

    it('should process given array of functions that return promises in batches and return results', async () => {
        const batchFn = vi.fn(() => {});

        const result = await processPromisesBatch({
            fns: FNS(10),
            batchSize: 3,
            batchFn,
        });

        expect(batchFn).toHaveBeenCalledTimes(4);
        expect(result).toEqual([[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]]);
    });

    it('should process given array of functions in batches, should call `batchFn` function correctly and return results', async () => {
        const batchFn = vi.fn(() => {});

        const result = await processPromisesBatch({
            fns: FNS(10),
            batchSize: 3,
            batchFn,
        });

        expect(batchFn).toHaveBeenNthCalledWith(2, {
            batchResult: [3, 4, 5],
            fromIndex: 3,
            toIndex: 5,
        });
        expect(result).toEqual([[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]]);
    });

    it('should process given array of functions in batches with a given delay after each batch is processed', async () => {
        const batchFn = vi.fn(() => {});

        const t = Date.now();
        await processPromisesBatch({
            fns: FNS(10),
            batchSize: 3,
            batchFn,
            delayMs: 50,
        });

        expect(Date.now() - t > 200).toBe(true);
    });

    it('should behave correctly if number of given functions is less than batch size', async () => {
        const batchFn = vi.fn(() => {});

        const result = await processPromisesBatch({
            fns: FNS(2),
            batchSize: 4,
            batchFn,
        });

        expect(batchFn).toHaveBeenNthCalledWith(1, {
            batchResult: [0, 1],
            fromIndex: 0,
            toIndex: 1,
        });
        expect(result).toEqual([[0, 1]]);
    });

    it('should stop processing promises', async () => {
        const batchFn = vi.fn(() => {});

        await processPromisesBatch({
            fns: FNS(10),
            batchSize: 3,
            batchFn,
            stopFn(stop) {
                stop();
            },
        });

        expect(batchFn).toHaveBeenCalledTimes(0);
    });
});
