import { clone, delay } from 'fantom-vue3-components';
import { callFunctions } from '../utils/utils.js';
import { useFApi } from '@/plugins/api-connectors/FApi/useFApi/useFApi.js';
import { implementsInterface } from 'fantom-vue3-components/src/utils/interface/interface.js';
import { ApiConnectorInterface } from '@/plugins/api-connectors/ApiConnector/ApiConnectorInterface.js';

export class ApiConnector {
    #apiConnector = null;
    /** @type {FApi} */
    #api = null;
    /** @type {function[]} */
    #onError = [];
    /** @type {function[]} */
    #onDone = [];
    /** @type {function[]} */
    #onLoading = [];
    /** @type {function} */
    #pickFn = null;

    /**
     * @param {{processQuery: function(query: *, variables: Object|array, options?: Object), processMutation: function(mutation: *, variables: Object, options?: Object)}} connector
     * @param {FApi} [api]
     * @param {function|function[]} [onError] Function (or array of functions) called on every error
     * @param {function|function[]} [onDone] Function (or array of functions) called when request is resolved
     * @param {function|function[]} [onLoading] Function (or array of functions) called whenever `onLoading` is called
     * @param {function(result: Object|null, processJustDefaultData?: boolean)} [pickFn] Function called on every result (response data)
     */
    constructor({
        connector,
        api = null,
        onError = null,
        onDone = null,
        onLoading = null,
        pickFn = null,
    }) {
        this.#apiConnector = connector;
        this.#api = api || useFApi().api;
        this.#pickFn = pickFn;

        if (!this.#apiConnector) {
            throw new Error('No connector is given');
        }

        if (implementsInterface(this.#apiConnector, ApiConnectorInterface)) {
            this.setOnErrorHook(onError);
            this.setOnDoneHook(onDone);
            this.setOnLoadingHook(onLoading);
        }
    }

    /**
     *
     * @param query
     * @param {Object|array} [variables]
     * @param {*} [defaultData]
     * @param {function} [pickFn]
     * @param {boolean} [skipFirst ] Skip first call of query
     * @param {boolean} [copyResult] Copy result data
     * @param {boolean} [silentErrors]
     * @param {{ fnName: string, delay: number}} [mock]
     * @param {Object} [options]
     * @return {{promise: Promise<*>, refetch: function, onError: function, onDone: function(onDoneFn: function, processResult?: boolean), onLoading: function}}
     */
    query({
        query = null,
        variables = {},
        defaultData = null,
        pickFn = null,
        skipFirst = false,
        copyResult = false,
        silentErrors = false,
        mock = { fnName: '', delay: -1 },
        options = {},
    }) {
        const queryRet = this.#useQuery(query, variables, {
            skipFirst,
            defaultData,
            pickFn,
            copyResult,
            silentErrors,
            mock,
            options,
        });

        if (this.#onError.length > 0) {
            this.#onError.forEach((fn) => {
                queryRet.onError(fn);
            });
        }

        if (this.#onDone.length > 0) {
            this.#onDone.forEach((fn) => {
                queryRet.onDone(fn);
            });
        }

        if (this.#onLoading.length > 0) {
            this.#onLoading.forEach((fn) => {
                queryRet.onLoading(fn);
            });
        }

        return queryRet;
    }

    /**
     *
     * @param mutation
     * @param {Object|array} [variables]
     * @param {*} [defaultData]
     * @param {function} [pickFn]
     * @param {boolean} [copyResult] Copy result data
     * @param {boolean} [silentErrors]
     * @param {{ fnName: string, delay: number}} [mock]
     * @param {Object} [options]
     * @return {{mutate: (function(Object=): Promise<*>), onError: function, onDone: function, onLoading: function}}
     */
    mutation({
        mutation = null,
        variables = {},
        defaultData = null,
        pickFn = null,
        copyResult = false,
        silentErrors = false,
        mock = { fnName: '', delay: -1 },
        options = {},
    }) {
        const mutationRet = this.#useMutation(mutation, variables, {
            defaultData,
            pickFn,
            copyResult,
            silentErrors,
            mock,
            options,
        });

        if (this.#onError.length > 0) {
            this.#onError.forEach((fn) => {
                mutationRet.onError(fn);
            });
        }

        if (this.#onDone.length > 0) {
            this.#onDone.forEach((fn) => {
                mutationRet.onDone(fn);
            });
        }

        if (this.#onLoading.length > 0) {
            this.#onLoading.forEach((fn) => {
                mutationRet.onLoading(fn);
            });
        }

        return mutationRet;
    }

    /**
     * @param {function|function[]} onError
     */
    setOnErrorHook(onError) {
        this.#setGlobalHook(this.#onError, onError);
    }

    /**
     * @param {function|function[]} onDone
     */
    setOnDoneHook(onDone) {
        this.#setGlobalHook(this.#onDone, onDone);
    }

    /**
     * @param {function|function[]} onLoading
     */
    setOnLoadingHook(onLoading) {
        this.#setGlobalHook(this.#onLoading, onLoading);
    }

    _processVariables(variables) {
        return variables;
    }

    /**
     * @param {array} store
     * @param {function|function[]} fn
     */
    #setGlobalHook(store, fn) {
        if (typeof fn === 'function') {
            store.push(fn);
        } else if (Array.isArray(fn)) {
            store.push(...fn);
        }
    }

    /**
     * @param query
     * @param variables
     * @param options
     * @return {{onError: function, onDone: function, promise: Promise<*>, refetch: (function(Object=): Promise<*>), onLoading: function}}
     * @private
     */
    #useQuery(query, variables, options) {
        const state = {
            loading: false,
            error: null,
        };
        let promise = null;

        const common = this.#useCommon(options, state);

        /**
         * @param {Object} [_variables]
         * @return {Promise<*>}
         */
        const refetch = (_variables) => {
            let vars = variables;

            if (_variables) {
                if (Array.isArray(variables)) {
                    vars = _variables;
                } else {
                    vars = { ...variables, ..._variables };
                }
            }

            return this.#refetch({
                query,
                variables: vars,
                options,
                common,
                state,
            });
        };

        if (!options.skipFirst && !options.disabled) {
            promise = refetch();
        }

        return {
            promise,
            // promise: common.promise,
            refetch,
            onError: common.onError,
            onDone: common.onDone,
            onLoading: common.onLoading,
        };
    }

    /**
     * @param mutation
     * @param variables
     * @param options
     * @return {{mutate: (function(Object=): Promise<*>), onError: function, onDone: function, onLoading: function}}
     * @private
     */
    #useMutation(mutation, variables, options) {
        const common = this.#useCommon(options);

        /**
         * @param {Object} [_variables]
         * @return {Promise<*>}
         */
        const mutate = (_variables) => {
            let vars = variables;

            if (_variables) {
                if (Array.isArray(variables)) {
                    vars = _variables;
                } else {
                    vars = { ...variables, ..._variables };
                }
            }

            return this.#mutate({
                mutation,
                variables: vars,
                options,
                common,
            });
        };

        return {
            mutate,
            onError: common.onError,
            onDone: common.onDone,
            onLoading: common.onLoading,
        };
    }

    #useCommon(options, state = null) {
        const _onDoneFns = [];
        const _onErrorFns = [];
        const _onLoadingFns = [];

        function onDone(onDoneFn, processJustDefaultData = false) {
            _onDoneFns.push({ fn: onDoneFn, processJustDefaultData });
        }

        function onError(onErrorFn) {
            _onErrorFns.push(onErrorFn);

            if (state?.error && typeof onErrorFn === 'function') {
                onErrorFn(state.error);
            }
        }

        function onLoading(onLoadingFn) {
            _onLoadingFns.push(onLoadingFn);

            if (state?.loading && typeof onLoadingFn === 'function') {
                onLoadingFn(true);
            }
        }

        // const promise = this.#getPromise({ onDone, onError });

        const _processOnDoneFns = (result) => {
            _onDoneFns.forEach((doneFn) => {
                if (typeof doneFn.fn === 'function') {
                    doneFn.fn(
                        this.#processResult({
                            result,
                            pickFn: options.pickFn,
                            defaultData: options.defaultData,
                            processJustDefaultData: doneFn.processJustDefaultData,
                        }),
                        result
                    );
                }
            });
        };

        return {
            onDone,
            onError,
            onLoading,
            // promise,
            _processOnDoneFns,
            _onErrorFns,
            _onLoadingFns,
        };
    }

    #processResult({
        result,
        pickFn = null,
        defaultData = null,
        processJustDefaultData = false,
    }) {
        const _pickFn = pickFn || this.#pickFn;
        let data = this.#apiConnector.processResult(result, _pickFn);

        if (typeof _pickFn === 'function') {
            data = _pickFn(data, processJustDefaultData);
        }

        return data ?? defaultData;
    }

    /**
     * @param {function} onResult
     * @param {function} [onError]
     * @param {*} [defaultData]
     * @return {Promise<unknown>}
     * @private
     */
    #getPromise({ onDone, onError, defaultData = null }) {
        return new Promise((resolve, reject) => {
            if (typeof onDone !== 'function') {
                reject(new Error('onDone is not a function'));
            } else {
                onDone((data) => {
                    resolve(
                        data || defaultData
                        /*
                        useResult
                            ? this._useResult(
                                  { value: data?.data || data },
                                  defaultData,
                                  pickFn,
                                  copyData
                              )
                            : data?.data || data || defaultData
*/
                    );
                });

                if (typeof onError === 'function') {
                    onError((error) => {
                        reject(error);
                    });
                }
            }
        });
    }

    #refetch({ query, variables, options, common, state }) {
        if (options.options.disabled) {
            return Promise.resolve(null);
        }

        const vars = this._processVariables(variables);
        const mockOptions = options.mock;
        const mockFn = mockOptions.fnName
            ? this.#api.getQueryMock(mockOptions.fnName)
            : null;
        let processQuery;

        state.error = null;
        state.loading = true;

        callFunctions(common._onLoadingFns, true);

        if (mockFn) {
            processQuery = this.#processMock(mockFn, mockOptions, vars);
        } else {
            processQuery = this.#apiConnector.processQuery(query, vars, options.options);
        }

        let pResolve = null;
        const promise = new Promise((resolve) => {
            pResolve = resolve;
        });

        processQuery
            .then((_result) => {
                const result = options.copyResult ? clone(_result) : _result;

                state.loading = false;
                state.error = null;
                callFunctions(common._onLoadingFns, false);

                common._processOnDoneFns(result);
                pResolve(
                    this.#processResult({
                        result,
                        pickFn: options.pickFn,
                        defaultData: options.defaultData,
                    })
                );

                return result;
            })
            .catch((error) => {
                state.error = error;
                state.loading = false;

                callFunctions(common._onLoadingFns, false);
                common._processOnDoneFns();

                pResolve(
                    this.#processResult({
                        pickFn: options.pickFn,
                        defaultData: options.defaultData,
                    })
                );
                callFunctions(common._onErrorFns, error, options.silentErrors);
                // pReject(error);
            });

        return promise;
    }

    #mutate({ mutation, variables, options, common }) {
        const vars = this._processVariables(variables);
        const mockOptions = options.mock;
        const mockFn = mockOptions.fnName
            ? this.#api.getMutationMock(mockOptions.fnName)
            : null;
        let processMutation;

        callFunctions(common._onLoadingFns, true);

        if (mockFn) {
            processMutation = this.#processMock(mockFn, mockOptions, vars);
        } else {
            processMutation = this.#apiConnector.processMutation(
                mutation,
                vars,
                options.options
            );
        }

        let pResolve = null;
        const promise = new Promise((resolve) => {
            pResolve = resolve;
        });

        processMutation
            .then((_result) => {
                const result = options.copyResult ? clone(_result) : _result;

                callFunctions(common._onLoadingFns, false);

                common._processOnDoneFns(result);
                pResolve(
                    this.#processResult({
                        result,
                        pickFn: options.pickFn,
                        defaultData: options.defaultData,
                    })
                );

                return result;
            })
            .catch((error) => {
                callFunctions(common._onLoadingFns, false);
                common._processOnDoneFns();
                pResolve(
                    this.#processResult({
                        pickFn: options.pickFn,
                        defaultData: options.defaultData,
                    })
                );
                callFunctions(common._onErrorFns, error, options.silentErrors);
            });

        return promise;
    }

    async #processMock(mockFn, mockOptions, variables) {
        if (mockFn) {
            if (mockOptions.delay > 0) {
                await delay(mockOptions.delay);
            }

            return mockFn(variables);
        }

        return null;
    }
}
