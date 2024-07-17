import { getAccountBalance } from './queries/account-balance/account-balance.js';
import { useFApi } from '@/plugins/api-connectors/FApi/useFApi/useFApi.js';

const api = useFApi().api;

api.registerQueries({
    getAccountBalance,
});

/**
 * @typedef {Object} AccountsApiQueries
 * @property {function({address: string|Ref<string>, erc20TokenAddress?: string|Ref<string>, enabled?: boolean|Ref<boolean>, skipFirst?: boolean, chainId?: string}):{promise: Promise<*>, refetch: Function, onError: Function, onDone: (function(onDoneFn: function, processResult: boolean=)), onLoading: Function, data: Ref<*|null>, loading: Ref<boolean>, error: Ref<Error>}} getAccountBalance
 */
