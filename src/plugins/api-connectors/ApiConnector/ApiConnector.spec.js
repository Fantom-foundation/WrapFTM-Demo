import { vi } from 'vitest';
import { FApi } from '../FApi/FApi.js';
import { ApiConnector } from './ApiConnector.js';
import { MyApiConnectorMock } from '../utils/test-helpers.js';
import { delay } from 'fantom-vue3-components';

describe('ApiConnector', () => {
    describe('on init', () => {
        it('should throw an error if no connector is given', () => {
            expect(() => {
                new ApiConnector({});
            }).toThrowError('No connector is given');
        });

        it('should throw an error if connector is not implementing ApiConnectorInterface', () => {
            class MyConnector {}

            expect(() => {
                new ApiConnector({
                    connector: new MyConnector(),
                });
            }).toThrowError(
                'Class MyConnector must implement methods: processQuery, processMutation'
            );
        });
    });

    describe('query()', () => {
        describe('returns promise', () => {
            it('should return a promise', async () => {
                const result = await apiConnector.query({}).promise;

                expect(result).toBe('result');
            });

            it('should return undefined if an error occurs', async () => {
                const error = new Error('foo error');
                myApiConnector.__errors__.processQuery = error;

                expect(await apiConnector.query({}).promise).toBeNull();
            });
        });

        describe('returns onDone()', () => {
            it('should return `onDone` function that accepts a function called when a result is returned', async () => {
                const onDoneSpy = vi.fn(() => {});
                const onDoneSpy2 = vi.fn(() => {});
                const result = { data: 'foo' };
                myApiConnector.__results__.processQuery = result;

                const { onDone } = apiConnector.query({});
                onDone(onDoneSpy);
                onDone(onDoneSpy2);

                await delay();
                await delay();

                expect(onDoneSpy).toHaveBeenCalledWith(result, result);
                expect(onDoneSpy2).toHaveBeenCalledWith(result, result);
            });

            it('should register global `onDone` function (hook)', async () => {
                const globalOnDoneSpy = vi.fn(() => {});
                const onDoneSpy = vi.fn(() => {});

                apiConnector = new ApiConnector({
                    onDone: globalOnDoneSpy,
                    connector: myApiConnector,
                });

                const { onDone } = apiConnector.query({});
                onDone(onDoneSpy);

                await delay();
                await delay();

                expect(globalOnDoneSpy).toHaveBeenCalled();
                expect(onDoneSpy).toHaveBeenCalled();
            });

            it('should register more than one global `onDone` function (hook)', async () => {
                const globalOnDoneSpy = vi.fn(() => {});
                const globalOnDoneSpy2 = vi.fn(() => {});
                const onDoneSpy = vi.fn(() => {});

                apiConnector = new ApiConnector({
                    onDone: [globalOnDoneSpy, globalOnDoneSpy2],
                    connector: myApiConnector,
                });

                const { onDone } = apiConnector.query({});
                onDone(onDoneSpy);

                await delay();
                await delay();

                expect(globalOnDoneSpy).toHaveBeenCalled();
                expect(globalOnDoneSpy2).toHaveBeenCalled();
                expect(onDoneSpy).toHaveBeenCalled();
            });
        });

        describe('returns onError()', () => {
            it('should return `onError` function that accepts a function called when an error occurs', async () => {
                const onErrorSpy = vi.fn(() => {});
                const error = new Error('foo error');
                myApiConnector.__errors__.processQuery = error;

                const { onError, promise } = apiConnector.query({});
                onError(onErrorSpy);

                // to prevent "unhandled error" error message
                promise.catch(() => {});

                await delay();
                await delay();

                expect(onErrorSpy).toHaveBeenCalledWith(error, expect.anything());
            });

            it.skip('should handle promise rejection and `onError` at the same time', async () => {
                const onErrorSpy = vi.fn(() => {});
                const error = new Error('foo error');
                myApiConnector.__errors__.processQuery = error;

                const { promise, onError } = apiConnector.query({});
                onError(onErrorSpy);

                await expect(promise).rejects.toThrowError(error, expect.anything());
                expect(onErrorSpy).toHaveBeenCalledWith(error, expect.anything());
            });

            it('should register global `onError` function (called on every error)', async () => {
                const globalOnErrorSpy = vi.fn(() => {});
                const onErrorSpy = vi.fn(() => {});
                const error = new Error('foo error');
                myApiConnector.__errors__.processQuery = error;

                apiConnector = new ApiConnector({
                    onError: globalOnErrorSpy,
                    connector: myApiConnector,
                });

                const { onError, promise } = apiConnector.query({});
                onError(onErrorSpy);

                // to prevent "unhandled error" error message
                promise.catch(() => {});
                await delay();
                await delay();

                expect(globalOnErrorSpy).toHaveBeenCalledWith(error, expect.anything());
                expect(onErrorSpy).toHaveBeenCalledWith(error, expect.anything());
            });

            it('should register more than one global `onError` function', async () => {
                const globalOnErrorSpy = vi.fn(() => {});
                const globalOnErrorSpy2 = vi.fn(() => {});
                const onErrorSpy = vi.fn(() => {});
                const error = new Error('foo error');
                myApiConnector.__errors__.processQuery = error;

                apiConnector = new ApiConnector({
                    onError: [globalOnErrorSpy, globalOnErrorSpy2],
                    connector: myApiConnector,
                });

                const { onError, promise } = apiConnector.query({});
                onError(onErrorSpy);

                // to prevent "unhandled error" error message
                promise.catch(() => {});
                await delay();
                await delay();

                expect(globalOnErrorSpy).toHaveBeenCalledWith(error, expect.anything());
                expect(globalOnErrorSpy2).toHaveBeenCalledWith(error, expect.anything());
                expect(onErrorSpy).toHaveBeenCalledWith(error, expect.anything());
            });

            it('should add `silentErrors` param as a second argument to `onError` function', async () => {
                const globalOnErrorSpy = vi.fn(() => {});
                const onErrorSpy = vi.fn(() => {});
                const error = new Error('foo error');
                myApiConnector.__errors__.processQuery = error;

                apiConnector = new ApiConnector({
                    onError: globalOnErrorSpy,
                    connector: myApiConnector,
                });

                const { onError, promise } = apiConnector.query({
                    silentErrors: true,
                });
                onError(onErrorSpy);

                // to prevent "unhandled error" error message
                promise.catch(() => {});
                await delay();
                await delay();

                expect(globalOnErrorSpy).toHaveBeenCalledWith(error, true);
                expect(onErrorSpy).toHaveBeenCalledWith(error, true);
            });
        });

        describe('returns onLoading()', () => {
            it('should return `onLoading` function that accepts a function called when fetching of a query starts and ends', async () => {
                const onLoadingSpy = vi.fn(() => {});
                const onLoadingSpy2 = vi.fn(() => {});

                const { onLoading } = apiConnector.query({});
                onLoading(onLoadingSpy);
                onLoading(onLoadingSpy2);

                expect(onLoadingSpy).toHaveBeenNthCalledWith(1, true);
                expect(onLoadingSpy2).toHaveBeenNthCalledWith(1, true);
                await delay();
                expect(onLoadingSpy).toHaveBeenNthCalledWith(2, false);
                expect(onLoadingSpy2).toHaveBeenNthCalledWith(2, false);
            });

            it('should register global `onLoading` function (called on every `onLoading`)', async () => {
                const onGlobalLoadingSpy = vi.fn(() => {});
                const onLoadingSpy = vi.fn(() => {});

                apiConnector = new ApiConnector({
                    onLoading: onGlobalLoadingSpy,
                    connector: myApiConnector,
                });

                const { onLoading } = apiConnector.query({});
                onLoading(onLoadingSpy);

                expect(onGlobalLoadingSpy).toHaveBeenNthCalledWith(1, true);
                expect(onLoadingSpy).toHaveBeenNthCalledWith(1, true);
                await delay();
                expect(onGlobalLoadingSpy).toHaveBeenNthCalledWith(2, false);
                expect(onLoadingSpy).toHaveBeenNthCalledWith(2, false);
            });

            it('should register more than one global `onLoading` function', async () => {
                const onGlobalLoadingSpy = vi.fn(() => {});
                const onGlobalLoadingSpy2 = vi.fn(() => {});
                const onLoadingSpy = vi.fn(() => {});

                apiConnector = new ApiConnector({
                    onLoading: [onGlobalLoadingSpy, onGlobalLoadingSpy2],
                    connector: myApiConnector,
                });

                const { onLoading } = apiConnector.query({});
                onLoading(onLoadingSpy);

                expect(onGlobalLoadingSpy).toHaveBeenNthCalledWith(1, true);
                expect(onGlobalLoadingSpy2).toHaveBeenNthCalledWith(1, true);
                expect(onLoadingSpy).toHaveBeenNthCalledWith(1, true);
                await delay();
                expect(onGlobalLoadingSpy).toHaveBeenNthCalledWith(2, false);
                expect(onGlobalLoadingSpy2).toHaveBeenNthCalledWith(2, false);
                expect(onLoadingSpy).toHaveBeenNthCalledWith(2, false);
            });
        });

        describe('returns refetch()', () => {
            it('should return `refetch` function for re-fetching the query', async () => {
                const processQuerySpy = vi.spyOn(myApiConnector, 'processQuery');
                const { refetch } = apiConnector.query({
                    variables: { var1: true },
                });

                refetch();

                expect(processQuerySpy).toHaveBeenCalledTimes(2);
                expect(processQuerySpy).toHaveBeenNthCalledWith(
                    1,
                    null,
                    { var1: true },
                    expect.anything()
                );
                expect(processQuerySpy).toHaveBeenNthCalledWith(
                    2,
                    null,
                    {
                        var1: true,
                    },
                    expect.anything()
                );
            });

            it('should return `refetch` function for re-fetching the query and use given variables merged with the original ones (if `variables` is an object)', async () => {
                const processQuerySpy = vi.spyOn(myApiConnector, 'processQuery');
                const { refetch } = apiConnector.query({
                    variables: { var1: true },
                });

                refetch({ var2: true });

                expect(processQuerySpy).toHaveBeenCalledTimes(2);
                expect(processQuerySpy).toHaveBeenNthCalledWith(
                    1,
                    null,
                    {
                        var1: true,
                    },
                    expect.anything()
                );
                expect(processQuerySpy).toHaveBeenNthCalledWith(
                    2,
                    null,
                    {
                        var2: true,
                        var1: true,
                    },
                    expect.anything()
                );
            });

            it('should return `refetch` function for re-fetching the query and use given variables if `variables` is an array', async () => {
                const processQuerySpy = vi.spyOn(myApiConnector, 'processQuery');
                const { refetch } = apiConnector.query({
                    variables: [1],
                });

                refetch([2]);

                expect(processQuerySpy).toHaveBeenCalledTimes(2);
                expect(processQuerySpy).toHaveBeenNthCalledWith(
                    1,
                    null,
                    [1],
                    expect.anything()
                );
                expect(processQuerySpy).toHaveBeenNthCalledWith(
                    2,
                    null,
                    [2],
                    expect.anything()
                );
            });

            it('should call query only with `refetch()` (not when `query()` is called)', async () => {
                const processQuerySpy = vi.spyOn(myApiConnector, 'processQuery');
                const { refetch } = apiConnector.query({
                    skipFirst: true,
                });

                refetch();

                expect(processQuerySpy).toHaveBeenCalledTimes(1);
            });

            it('should return `refetch` function that returns a promise', async () => {
                const { refetch } = apiConnector.query({
                    skipFirst: true,
                });

                const promise = await refetch();

                expect(promise).toBe('result');
            });

            it('should not call query if `options.disabled` is `true`', async () => {
                const processQuerySpy = vi.spyOn(myApiConnector, 'processQuery');
                const { refetch } = apiConnector.query({
                    options: {
                        disabled: true,
                    },
                });

                refetch();

                expect(processQuerySpy).toHaveBeenCalledTimes(0);
            });
        });

        describe('accepts defaultData', () => {
            it('should provide default data in `onDone` function', async () => {
                const onDoneSpy = vi.fn(() => {});
                myApiConnector.__results__.processQuery = null;

                const { onDone } = apiConnector.query({
                    defaultData: 'default',
                });
                onDone(onDoneSpy);

                await delay();

                expect(onDoneSpy).toHaveBeenCalledWith('default', null);
            });

            it('should provide default data in the promise', async () => {
                myApiConnector.__results__.processQuery = null;
                const result = await apiConnector.query({
                    defaultData: 'default',
                }).promise;

                expect(result).toBe('default');
            });
        });

        describe('accepts pickFn()', () => {
            it('should call `pickFn` function on each result (response data)', async () => {
                const onDoneSpy = vi.fn(() => {});
                myApiConnector.__results__.processQuery = {
                    data: { foo: 'boo' },
                };

                const { onDone } = apiConnector.query({
                    pickFn: (result) => result?.data,
                });
                onDone(onDoneSpy);

                await delay();

                expect(onDoneSpy).toHaveBeenCalledWith(
                    { foo: 'boo' },
                    {
                        data: { foo: 'boo' },
                    }
                );
            });

            it('should register global `pickFn` function called on every result (response data)', async () => {
                const onDoneSpy = vi.fn(() => {});
                myApiConnector.__results__.processQuery = {
                    data: { foo: 'boo' },
                };

                apiConnector = new ApiConnector({
                    pickFn: (result) => result?.data,
                    connector: myApiConnector,
                });

                const { onDone } = apiConnector.query({});
                onDone(onDoneSpy);

                await delay();

                expect(onDoneSpy).toHaveBeenCalledWith(
                    { foo: 'boo' },
                    {
                        data: { foo: 'boo' },
                    }
                );
            });

            it('should override globaly registered `pickFn` function when `pickFn` is given in the `query()` function', async () => {
                const onDoneSpy = vi.fn(() => {});
                myApiConnector.__results__.processQuery = {
                    data: { foo: 'boo' },
                };

                apiConnector = new ApiConnector({
                    pickFn: (result) => result?.data,
                    connector: myApiConnector,
                });

                const { onDone } = apiConnector.query({
                    pickFn: (result) => result?.data?.foo,
                });
                onDone(onDoneSpy);

                await delay();

                expect(onDoneSpy).toHaveBeenCalledWith('boo', {
                    data: { foo: 'boo' },
                });
            });
        });

        describe('accepts copyResult', () => {
            it('should copy result', async () => {
                const _result = { foo: 'boo' };
                myApiConnector.__results__.processQuery = _result;
                const { refetch } = apiConnector.query({
                    copyResult: true,
                    skipFirst: true,
                });

                const result = await refetch();

                expect(result).toEqual(_result);
                expect(result !== _result).toBe(true);
            });
        });

        describe('query mock', () => {
            it('should use mock function if it is registered', async () => {
                function myQueryMock() {
                    return 'mock';
                }

                api.registerQueryMock(myQueryMock, 'myQueryMock');

                const result = await apiConnector.query({
                    mock: {
                        fnName: 'myQueryMock',
                    },
                }).promise;

                expect(result).toBe('mock');
            });

            it('should delay query mock', async () => {
                const onDoneSpy = vi.fn(() => {});

                function myQueryMock() {
                    return 'mock';
                }

                api.registerQueryMock(myQueryMock, 'myQueryMock');

                const { onDone } = apiConnector.query({
                    mock: {
                        delay: 50,
                        fnName: 'myQueryMock',
                    },
                });
                onDone(onDoneSpy);

                expect(onDoneSpy).not.toHaveBeenCalled();

                await delay(51);

                expect(onDoneSpy).toHaveBeenCalled();
            });
        });
    });

    describe('mutation()', () => {
        describe('returns mutate()', () => {
            it('should return `mutate` function', async () => {
                const processMutationSpy = vi.spyOn(myApiConnector, 'processMutation');
                const { mutate } = apiConnector.mutation({
                    variables: { var1: true },
                });

                mutate();

                await delay();

                expect(processMutationSpy).toHaveBeenNthCalledWith(
                    1,
                    null,
                    { var1: true },
                    expect.anything()
                );
            });

            it('should return `mutate` function and use given variables merged with old ones (if `variables` is an object)', async () => {
                const processMutationSpy = vi.spyOn(myApiConnector, 'processMutation');
                const { mutate } = apiConnector.mutation({
                    variables: { address: '0x123' },
                });

                mutate({ var1: true });

                await delay();

                expect(processMutationSpy).toHaveBeenNthCalledWith(
                    1,
                    null,
                    { var1: true, address: '0x123' },
                    expect.anything()
                );
            });

            it('should return `mutate` function and use given variables if `variables` is an array', async () => {
                const processMutationSpy = vi.spyOn(myApiConnector, 'processMutation');
                const { mutate } = apiConnector.mutation({
                    variables: [1],
                });

                mutate([2]);

                await delay();

                expect(processMutationSpy).toHaveBeenNthCalledWith(
                    1,
                    null,
                    [2],
                    expect.anything()
                );
            });

            it('should return `mutate` function that returns a promise', async () => {
                const { mutate } = apiConnector.mutation({});

                const promise = await mutate();

                expect(promise).toBe('result');
            });
        });

        describe('returns onDone()', () => {
            it('should return `onDone` function that accepts a function called when a result is returned', async () => {
                const onDoneSpy = vi.fn(() => {});
                const onDoneSpy2 = vi.fn(() => {});
                const result = { data: 'foo' };
                myApiConnector.__results__.processMutation = result;

                const { onDone, mutate } = apiConnector.mutation({});
                onDone(onDoneSpy);
                onDone(onDoneSpy2);

                mutate();

                await delay();

                expect(onDoneSpy).toHaveBeenCalledWith(result, result);
                expect(onDoneSpy2).toHaveBeenCalledWith(result, result);
            });

            it('should register global `onDone` function (hook)', async () => {
                const globalOnDoneSpy = vi.fn(() => {});
                const onDoneSpy = vi.fn(() => {});

                apiConnector = new ApiConnector({
                    onDone: globalOnDoneSpy,
                    connector: myApiConnector,
                });

                const { onDone, mutate } = apiConnector.mutation({});
                onDone(onDoneSpy);

                mutate();

                await delay();

                expect(globalOnDoneSpy).toHaveBeenCalled();
                expect(onDoneSpy).toHaveBeenCalled();
            });

            it('should register more than one global `onDone` function (hook)', async () => {
                const globalOnDoneSpy = vi.fn(() => {});
                const globalOnDoneSpy2 = vi.fn(() => {});
                const onDoneSpy = vi.fn(() => {});

                apiConnector = new ApiConnector({
                    onDone: [globalOnDoneSpy, globalOnDoneSpy2],
                    connector: myApiConnector,
                });

                const { onDone, mutate } = apiConnector.mutation({});
                onDone(onDoneSpy);

                mutate();

                await delay();

                expect(globalOnDoneSpy).toHaveBeenCalled();
                expect(globalOnDoneSpy2).toHaveBeenCalled();
                expect(onDoneSpy).toHaveBeenCalled();
            });
        });

        describe('returns onError()', () => {
            it('should return `onError` function that accepts a function called when an error occurs', async () => {
                const onErrorSpy = vi.fn(() => {});
                const error = new Error('foo error');
                myApiConnector.__errors__.processMutation = error;

                const { onError, mutate } = apiConnector.mutation({});
                onError(onErrorSpy);

                const promise = mutate();

                // to prevent "unhandled error" error message
                promise.catch(() => {});

                await delay();

                expect(onErrorSpy).toHaveBeenCalledWith(error, expect.anything());
            });

            it.skip('should handle promise rejection and `onError` at the same time', async () => {
                const onErrorSpy = vi.fn(() => {});
                const error = new Error('foo error');
                myApiConnector.__errors__.processMutation = error;

                const { mutate, onError } = apiConnector.mutation({});
                onError(onErrorSpy);

                const promise = mutate();

                await expect(promise).rejects.toThrowError(error, expect.anything());
                expect(onErrorSpy).toHaveBeenCalledWith(error, expect.anything());
            });

            it('should register global `onError` function (called on every error)', async () => {
                const globalOnErrorSpy = vi.fn(() => {});
                const onErrorSpy = vi.fn(() => {});
                const error = new Error('foo error');
                myApiConnector.__errors__.processMutation = error;

                apiConnector = new ApiConnector({
                    onError: globalOnErrorSpy,
                    connector: myApiConnector,
                });

                const { onError, mutate } = apiConnector.mutation({});
                onError(onErrorSpy);

                const promise = mutate();

                // to prevent "unhandled error" error message
                promise.catch(() => {});
                await delay();

                expect(globalOnErrorSpy).toHaveBeenCalledWith(error, expect.anything());
                expect(onErrorSpy).toHaveBeenCalledWith(error, expect.anything());
            });

            it('should add `silentErrors` param as a second argument to `onError` function', async () => {
                const globalOnErrorSpy = vi.fn(() => {});
                const onErrorSpy = vi.fn(() => {});
                const error = new Error('foo error');
                myApiConnector.__errors__.processMutation = error;

                apiConnector = new ApiConnector({
                    onError: globalOnErrorSpy,
                    connector: myApiConnector,
                });

                const { onError, mutate } = apiConnector.mutation({
                    silentErrors: true,
                });
                onError(onErrorSpy);

                const promise = mutate();

                // to prevent "unhandled error" error message
                promise.catch(() => {});
                await delay();

                expect(globalOnErrorSpy).toHaveBeenCalledWith(error, true);
                expect(onErrorSpy).toHaveBeenCalledWith(error, true);
            });
        });

        describe('returns onLoading()', () => {
            it('should return `onLoading` function that accepts a function called when mutation starts and ends', async () => {
                const onLoadingSpy = vi.fn(() => {});
                const onLoadingSpy2 = vi.fn(() => {});

                const { onLoading, mutate } = apiConnector.mutation({});
                onLoading(onLoadingSpy);
                onLoading(onLoadingSpy2);

                mutate();
                await delay();

                expect(onLoadingSpy).toHaveBeenNthCalledWith(1, true);
                expect(onLoadingSpy2).toHaveBeenNthCalledWith(1, true);
                expect(onLoadingSpy).toHaveBeenNthCalledWith(2, false);
                expect(onLoadingSpy2).toHaveBeenNthCalledWith(2, false);
            });

            it('should register global `onLoading` function (called on every `onLoading`)', async () => {
                const onGlobalLoadingSpy = vi.fn(() => {});
                const onLoadingSpy = vi.fn(() => {});

                apiConnector = new ApiConnector({
                    onLoading: onGlobalLoadingSpy,
                    connector: myApiConnector,
                });

                const { onLoading, mutate } = apiConnector.mutation({});
                onLoading(onLoadingSpy);

                mutate();
                await delay();

                expect(onGlobalLoadingSpy).toHaveBeenNthCalledWith(1, true);
                expect(onLoadingSpy).toHaveBeenNthCalledWith(1, true);
                expect(onGlobalLoadingSpy).toHaveBeenNthCalledWith(2, false);
                expect(onLoadingSpy).toHaveBeenNthCalledWith(2, false);
            });

            it('should register more than one global `onLoading` function', async () => {
                const onGlobalLoadingSpy = vi.fn(() => {});
                const onGlobalLoadingSpy2 = vi.fn(() => {});
                const onLoadingSpy = vi.fn(() => {});

                apiConnector = new ApiConnector({
                    onLoading: [onGlobalLoadingSpy, onGlobalLoadingSpy2],
                    connector: myApiConnector,
                });

                const { onLoading, mutate } = apiConnector.mutation({});
                onLoading(onLoadingSpy);

                mutate();
                await delay();

                expect(onGlobalLoadingSpy).toHaveBeenNthCalledWith(1, true);
                expect(onGlobalLoadingSpy2).toHaveBeenNthCalledWith(1, true);
                expect(onLoadingSpy).toHaveBeenNthCalledWith(1, true);
                expect(onGlobalLoadingSpy).toHaveBeenNthCalledWith(2, false);
                expect(onGlobalLoadingSpy2).toHaveBeenNthCalledWith(2, false);
                expect(onLoadingSpy).toHaveBeenNthCalledWith(2, false);
            });
        });

        describe('accepts defaultData', () => {
            it('should provide default data in `onDone` function', async () => {
                const onDoneSpy = vi.fn(() => {});
                myApiConnector.__results__.processMutation = null;

                const { mutate, onDone } = apiConnector.mutation({
                    defaultData: 'default',
                });
                onDone(onDoneSpy);

                await mutate();

                expect(onDoneSpy).toHaveBeenCalledWith('default', null);
            });

            it('should provide default data in the promise', async () => {
                myApiConnector.__results__.processMutation = null;
                const { mutate } = apiConnector.mutation({
                    defaultData: 'default',
                });

                const promise = mutate();

                const result = await promise;
                expect(result).toBe('default');
            });
        });

        describe('accepts pickFn()', () => {
            it('should call `pickFn` function on each result (response data)', async () => {
                const onDoneSpy = vi.fn(() => {});
                myApiConnector.__results__.processMutation = {
                    data: { foo: 'boo' },
                };

                const { onDone, mutate } = apiConnector.mutation({
                    pickFn: (result) => result?.data,
                });
                onDone(onDoneSpy);

                await mutate();

                expect(onDoneSpy).toHaveBeenCalledWith(
                    { foo: 'boo' },
                    {
                        data: { foo: 'boo' },
                    }
                );
            });

            it('should register global `pickFn` function called on every result (response data)', async () => {
                const onDoneSpy = vi.fn(() => {});
                myApiConnector.__results__.processMutation = {
                    data: { foo: 'boo' },
                };

                apiConnector = new ApiConnector({
                    pickFn: (result) => result?.data,
                    connector: myApiConnector,
                });

                const { onDone, mutate } = apiConnector.mutation({});
                onDone(onDoneSpy);

                await mutate();

                expect(onDoneSpy).toHaveBeenCalledWith(
                    { foo: 'boo' },
                    {
                        data: { foo: 'boo' },
                    }
                );
            });

            it('should override globaly registered `pickFn` function when `pickFn` is given in the `query()` function', async () => {
                const onDoneSpy = vi.fn(() => {});
                myApiConnector.__results__.processMutation = {
                    data: { foo: 'boo' },
                };

                apiConnector = new ApiConnector({
                    pickFn: (result) => result?.data,
                    connector: myApiConnector,
                });

                const { onDone, mutate } = apiConnector.mutation({
                    pickFn: (result) => result?.data?.foo,
                });
                onDone(onDoneSpy);

                await mutate();

                expect(onDoneSpy).toHaveBeenCalledWith('boo', {
                    data: { foo: 'boo' },
                });
            });
        });

        describe('accepts copyResult', () => {
            it.only('should copy result', async () => {
                const _result = { foo: 'boo' };
                myApiConnector.__results__.processMutation = _result;
                const { mutate } = apiConnector.mutation({
                    copyResult: true,
                });

                const result = await mutate();

                expect(result).toEqual(_result);
                expect(result !== _result).toBe(true);
            });
        });

        describe('mutation mock', () => {
            it('should use mock function if it is registered', async () => {
                function myMutationMock() {
                    return 'mock';
                }

                api.registerMutationMock(myMutationMock, 'myMutationMock');

                const { mutate } = apiConnector.mutation({
                    mock: {
                        fnName: 'myMutationMock',
                    },
                });

                const result = await mutate();
                expect(result).toBe('mock');
            });

            it('should delay mutation mock', async () => {
                const onDoneSpy = vi.fn(() => {});

                function myMutationMock() {
                    return 'mock';
                }

                api.registerMutationMock(myMutationMock, 'myMutationMock');

                const { onDone, mutate } = apiConnector.mutation({
                    mock: {
                        delay: 50,
                        fnName: 'myMutationMock',
                    },
                });
                onDone(onDoneSpy);

                mutate();

                expect(onDoneSpy).not.toHaveBeenCalled();

                await delay(51);

                expect(onDoneSpy).toHaveBeenCalled();
            });
        });
    });

    describe('using with FApi', () => {
        it('should use registered query', async () => {
            function myQuery() {
                return apiConnector.query({
                    query: '',
                });
            }

            api.registerQuery(myQuery, 'myQuery');

            const result = await api.query.myQuery().promise;

            expect(result).toBe('result');
        });

        it('should use registered query mock', async () => {
            function myQuery() {
                return apiConnector.query({
                    mock: {
                        fnName: 'myQueryMock',
                    },
                });
            }

            function myQueryMock() {
                return 'mock';
            }

            api.registerQuery(myQuery, 'myQuery');
            api.registerQueryMock(myQueryMock, 'myQueryMock');

            const result = await api.query.myQuery().promise;

            expect(result).toBe('mock');
        });

        it('should use registered mutation', async () => {
            function myMutation() {
                return apiConnector.mutation({});
            }

            api.registerMutation(myMutation, 'myMutation');

            const { mutate } = await api.mutation.myMutation();

            const result = await mutate();
            expect(result).toBe('result');
        });

        it('should use registered mutation mock', async () => {
            function myMutation() {
                return apiConnector.mutation({
                    mock: {
                        fnName: 'myMutationMock',
                    },
                });
            }

            function myMutationMock() {
                return 'mock';
            }

            api.registerMutation(myMutation, 'myMutation');
            api.registerMutationMock(myMutationMock, 'myMutationMock');

            const { mutate } = await api.mutation.myMutation();

            const result = await mutate();
            expect(result).toBe('mock');
        });
    });
});

/** @type {ApiConnector} */
let apiConnector = null;
/** @type {FApi} */
let api = null;
/** @type {MyApiConnectorMock} */
let myApiConnector = null;

beforeEach(() => {
    myApiConnector = new MyApiConnectorMock();
    api = new FApi();
    apiConnector = new ApiConnector({ connector: myApiConnector, api });
});

afterEach(() => {
    myApiConnector = null;
    apiConnector = null;
    FApi.clearAll();
    api = null;
});
