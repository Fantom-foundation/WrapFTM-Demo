import { VueApiConnector } from './VueApiConnector.js';
import { MyApiConnectorMock } from '../utils/test-helpers.js';
import { vi } from 'vitest';
import { delay } from 'fantom-vue3-components';
import { computed, nextTick, ref } from 'vue';

describe('VueApiConnector', () => {
    describe('query()', () => {
        describe('returns Ref `data`', () => {
            it('should return Ref `data`', async () => {
                const { data } = vueApiConnector.query({});

                expect(data.value).toBe(null);

                await delay();

                expect(data.value).toBe('result');
            });

            it('should return Ref `data` with default data', async () => {
                const { data } = vueApiConnector.query({
                    defaultData: 0,
                });

                expect(data.value).toBe(0);

                await delay();

                expect(data.value).toBe('result');
            });

            test('`data` should change when refetching', async () => {
                const { data, refetch } = vueApiConnector.query({
                    skipFirst: true,
                });

                expect(data.value).toBe(null);

                refetch();
                await delay();

                expect(data.value).toBe('result');

                refetch();

                expect(data.value).toBe(null);
            });
        });

        describe('returns boolean Ref `loading`', () => {
            it('should return boolean Ref `loading`', async () => {
                const { loading } = vueApiConnector.query({});

                expect(loading.value).toBe(true);

                await delay();

                expect(loading.value).toBe(false);
            });

            test('`loading` should change when refetching', async () => {
                const { loading, refetch } = vueApiConnector.query({
                    skipFirst: true,
                });

                expect(loading.value).toBe(false);

                refetch();

                expect(loading.value).toBe(true);

                await delay();
                expect(loading.value).toBe(false);
            });
        });

        describe('returns Error Ref `error`', () => {
            it('should return Error Ref `error`', async () => {
                const err = new Error('foo error');
                myApiConnector.__errors__.processQuery = err;
                const { error } = vueApiConnector.query({});

                expect(error.value).toBe(null);

                // to prevent "unhandled error" error message
                // promise.catch(() => {});

                await delay();

                expect(error.value).toBe(err);
            });

            test('`error` should change while refetching', async () => {
                const err = new Error('foo error');
                myApiConnector.__errors__.processQuery = err;

                const { error, refetch } = vueApiConnector.query({
                    skipFirst: true,
                });

                expect(error.value).toBe(null);

                // to prevent "unhandled error" error message
                // promise.catch(() => {});

                refetch();

                await delay();

                expect(error.value).toBe(err);

                refetch();

                expect(error.value).toBe(null);
            });
        });

        describe('accepts object or array Ref `variables`', () => {
            it('should run query whenever object Ref `variables` is changed', async () => {
                const onDoneSpy = vi.fn(() => {});
                myApiConnector.processQuery = async function (query, variables) {
                    return `result ${variables.variable}`;
                };
                const variable = ref(0);
                const { onDone } = vueApiConnector.query({
                    variables: { variable },
                });
                onDone(onDoneSpy);

                await delay();

                expect(onDoneSpy).toHaveBeenCalledWith('result 0', 'result 0');

                variable.value = 1;
                await delay();

                expect(onDoneSpy).toHaveBeenCalledWith('result 1', 'result 1');
            });

            it('should run query whenever array Ref `variables` is changed', async () => {
                const onDoneSpy = vi.fn(() => {});
                myApiConnector.processQuery = async function (query, variables) {
                    return `result ${variables[0]}`;
                };
                const variable = ref(0);
                const { onDone } = vueApiConnector.query({
                    variables: [variable],
                });
                onDone(onDoneSpy);

                await delay();

                expect(onDoneSpy).toHaveBeenCalledWith('result 0', 'result 0');

                variable.value = 1;
                await delay();

                expect(onDoneSpy).toHaveBeenCalledWith('result 1', 'result 1');
            });
        });

        describe('accepts boolean (Ref) `enabled`', () => {
            it('should not run query if `enabled` arg is `false`', async () => {
                const onDoneSpy = vi.fn(() => {});
                const { onDone } = vueApiConnector.query({
                    enabled: false,
                });
                onDone(onDoneSpy);

                await delay();

                expect(onDoneSpy).toHaveBeenCalledTimes(0);
            });

            it('should not run query if `enabled` arg is Ref and `false`', async () => {
                const onDoneSpy = vi.fn(() => {});
                const { onDone } = vueApiConnector.query({
                    enabled: ref(false),
                });
                onDone(onDoneSpy);

                await delay();

                expect(onDoneSpy).toHaveBeenCalledTimes(0);
            });

            it('should not run query if Ref `enabled` is changed to `false`', async () => {
                const onDoneSpy = vi.fn(() => {});
                const enabled = ref(true);
                const { onDone, refetch } = vueApiConnector.query({
                    enabled,
                });
                onDone(onDoneSpy);

                enabled.value = false;
                await nextTick();

                refetch();
                await delay();

                expect(onDoneSpy).toHaveBeenCalledTimes(1);
            });

            it('should run query if Ref `enabled` was `false` and then was changed to `true`', async () => {
                const onDoneSpy = vi.fn(() => {});
                const enabled = ref(false);
                const { onDone } = vueApiConnector.query({
                    enabled,
                });
                onDone(onDoneSpy);

                enabled.value = true;
                await nextTick();

                await delay();

                expect(onDoneSpy).toHaveBeenCalledTimes(1);
            });

            it('should accept computed `enabled`', async () => {
                const onDoneSpy = vi.fn(() => {});
                const disabled = ref(false);
                const enabled = computed(() => !disabled.value);
                const { onDone, refetch } = vueApiConnector.query({
                    enabled,
                });
                onDone(onDoneSpy);

                disabled.value = true;
                await nextTick();

                refetch();
                await delay();

                disabled.value = false;
                await nextTick();

                await delay();

                expect(onDoneSpy).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe('mutation()', () => {
        describe('returns Ref `data`', () => {
            it('should return Ref `data`', async () => {
                const { data, mutate } = vueApiConnector.mutation({});

                expect(data.value).toBe(null);

                mutate();
                await delay();

                expect(data.value).toBe('result');

                mutate();
                expect(data.value).toBe(null);
            });

            it('should return Ref `data` with default data', async () => {
                const { data, mutate } = vueApiConnector.mutation({
                    defaultData: 0,
                });

                expect(data.value).toBe(0);

                mutate();
                await delay();

                expect(data.value).toBe('result');

                mutate();

                expect(data.value).toBe(0);
            });
        });

        describe('returns boolean Ref `loading`', () => {
            it('should return boolean Ref `loading`', async () => {
                const { loading, mutate } = vueApiConnector.mutation({});

                expect(loading.value).toBe(false);

                mutate();

                expect(loading.value).toBe(true);

                await delay();

                expect(loading.value).toBe(false);
            });
        });

        describe('returns Error Ref `error`', () => {
            it('should return Error Ref `error`', async () => {
                const err = new Error('foo error');
                myApiConnector.__errors__.processMutation = err;
                const { error, mutate } = vueApiConnector.mutation({});

                expect(error.value).toBe(null);

                const promise = mutate();

                // to prevent "unhandled error" error message
                promise.catch(() => {});
                await delay();

                expect(error.value).toBe(err);

                mutate();

                expect(error.value).toBe(null);
            });
        });

        describe('accepts object or array Ref `variables`', () => {
            it('should run mutation whenever object Ref `variables` is changed', async () => {
                const onDoneSpy = vi.fn(() => {});
                myApiConnector.processMutation = async function (mutation, variables) {
                    return `result ${variables.variable}`;
                };
                const variable = ref(0);
                const { mutate, onDone } = vueApiConnector.mutation({
                    variables: { variable },
                });
                onDone(onDoneSpy);

                await mutate();

                expect(onDoneSpy).toHaveBeenCalledWith('result 0', 'result 0');

                variable.value = 1;
                await delay();

                expect(onDoneSpy).toHaveBeenCalledWith('result 1', 'result 1');
            });

            it('should run mutation whenever array Ref `variables` is changed', async () => {
                const onDoneSpy = vi.fn(() => {});
                myApiConnector.processMutation = async function (mutation, variables) {
                    return `result ${variables[0]}`;
                };
                const variable = ref(0);
                const { mutate, onDone } = vueApiConnector.mutation({
                    variables: [variable],
                });
                onDone(onDoneSpy);

                await mutate();

                expect(onDoneSpy).toHaveBeenCalledWith('result 0', 'result 0');

                variable.value = 1;
                await delay();

                expect(onDoneSpy).toHaveBeenCalledWith('result 1', 'result 1');
            });
        });
    });
});

/** @type {VueApiConnector} */
let vueApiConnector = null;
/** @type {MyApiConnectorMock} */
let myApiConnector = null;

beforeEach(() => {
    myApiConnector = new MyApiConnectorMock();
    vueApiConnector = new VueApiConnector({ connector: myApiConnector });
});

afterEach(() => {
    myApiConnector = null;
    vueApiConnector = null;
    vi.clearAllMocks();
});
