import { ApiConnector } from '../ApiConnector/ApiConnector.js';
import { ref, toRef, watch } from 'vue';
import { deepToRaw } from '@/plugins/api-connectors/utils/utils.js';

export class VueApiConnector extends ApiConnector {
    /*
    /!**
     * @param {{processQuery: function(query: *, variables: Object, options?: Object), processMutation: function(mutation: *, variables: Object, options?: Object)}} connector
     * @param {FApi} api
     * @param {function|function[]} [onError] Function (or array of functions) called on every error
     * @param {function|function[]} [onDone] Function (or array of functions) called when request is resolved
     * @param {function|function[]} [onLoading] Function (or array of functions) called whenever `onLoadin` is called
     * @param {function(result: Object|null, processJustDefaultData?: boolean)} [pickFn] Function called on every result (response data)
     *!/
    constructor({
        connector,
        api = null,
        onError = null,
        onDone = null,
        onLoading = null,
        pickFn = null,
    }) {
        super({ connector, api, onError, onDone, onLoading, pickFn });
    }
*/

    /**
     *
     * @param query
     * @param {Object|Ref<Object>|array|Ref<array>|function|null} [variables]
     * @param {*} [defaultData]
     * @param {function} [pickFn]
     * @param {boolean|Ref<boolean>} [enabled]
     * @param {boolean} [skipFirst ] Skip first call of query
     * @param {boolean} [copyResult] Copy result data
     * @param {boolean} [silentErrors]
     * @param {{ fnName: string, delay: number}} [mock]
     * @param {Object} [options]
     * @return {{promise: Promise<*>, refetch: function, onError: function(onErrorFn: function), onDone: function(onDoneFn: function, processResult?: boolean), onLoading: function, data: Ref<null|*>, loading: Ref<boolean>, error: Ref<Error>}}
     */
    query({
        query = null,
        variables = null,
        defaultData = null,
        pickFn = null,
        enabled = true,
        skipFirst = false,
        copyResult = false,
        silentErrors = false,
        mock = { fnName: '', delay: -1 },
        options = {},
    }) {
        const _enabled = toRef(enabled);

        if (!_enabled.value) {
            options.disabled = true;
        }

        const queryRet = super.query({
            query,
            variables: variables || {},
            defaultData,
            pickFn,
            skipFirst,
            copyResult,
            silentErrors,
            mock,
            options,
        });

        const common = this.#useCommon(queryRet, defaultData);
        const _variables = variables ? toRef(variables) : null;

        if (_variables) {
            watch(
                _variables,
                (vars) => {
                    queryRet.refetch(vars);
                },
                { deep: true }
            );
        }

        watch(_enabled, (enbl) => {
            options.disabled = !enbl;

            if (enbl) {
                queryRet.refetch();
            }
        });

        return {
            ...queryRet,
            data: common.data,
            loading: common.loading,
            error: common.error,
        };
    }

    /**
     *
     * @param mutation
     * @param {Object|Ref<Object>|array|Ref<array>|function|null} [variables]
     * @param {*} [defaultData]
     * @param {function} [pickFn]
     * @param {boolean} [copyResult] Copy result data
     * @param {boolean} [silentErrors]
     * @param {{ fnName: string, delay: number}} [mock]
     * @param {Object} [options]
     * @return {{mutate: (function(Object=): Promise<*>), onError: function, onDone: function, onLoading: function, data: Ref<null|*>, loading: Ref<boolean>, error: Ref<Error>}}
     */
    mutation({
        mutation = null,
        variables = null,
        defaultData = null,
        pickFn = null,
        copyResult = false,
        silentErrors = false,
        mock = { fnName: '', delay: -1 },
        options = {},
    }) {
        const mutationRet = super.mutation({
            mutation,
            variables,
            defaultData,
            pickFn,
            copyResult,
            silentErrors,
            mock,
            options,
        });

        const common = this.#useCommon(mutationRet, defaultData);
        const _variables = variables ? toRef(variables) : null;

        if (_variables) {
            watch(
                _variables,
                (vars) => {
                    mutationRet.mutate(vars);
                },
                { deep: true }
            );
        }

        return {
            ...mutationRet,
            data: common.data,
            loading: common.loading,
            error: common.error,
        };
    }

    _processVariables(variables) {
        return deepToRaw(variables);
    }

    #useCommon(ret, defaultData) {
        const data = ref(defaultData ?? null);
        const loading = ref(false);
        const error = ref(null);

        ret.onDone((result) => {
            data.value = result;
        });

        ret.onLoading((_loading) => {
            if (_loading) {
                data.value = defaultData ?? null;
                error.value = null;
            }

            loading.value = _loading;
        });

        ret.onError((_error) => {
            error.value = _error;
        });

        return { data, loading, error };
    }
}
