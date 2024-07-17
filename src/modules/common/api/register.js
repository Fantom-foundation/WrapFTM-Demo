import { sendTransaction } from './mutations/send-transaction/send-transaction.js';
import {
    getErc20Assets,
    getErc20AssetsWithBalance,
} from './queries/erc20-assets/erc20-assets.js';
import { getErc20TokenList } from './queries/erc20-token-list/erc20-token-list.js';
import { getFmintAccount } from './queries/fmint-account/fmint-account.js';
import { getTokenAllowance } from './queries/token-allowance/token-allowance.js';
import { getPrice } from './queries/price/price.js';
import { useFApi } from '@/plugins/api-connectors/FApi/useFApi/useFApi.js';

const api = useFApi().api;

api.registerMutation(sendTransaction, 'sendTransaction');

api.registerQueries({
    getPrice,
    getTokenAllowance,
    getFmintAccount,
    getErc20TokenList,
    getErc20Assets,
    getErc20AssetsWithBalance,
});

/**
 * @typedef {Object} CommonApiMutations
 * @property {function():{mutate: (function(Object=): Promise<*>), onError: function, onDone: function, onLoading: function, data: Ref<null|*>, loading: Ref<boolean>, error: Ref<Error>}} sendTransaction
 */

/**
 * @typedef {Object} CommonApiQueries
 * @property {function({ownerAddress: string|Ref<string>, count?: number|Ref<number>, additionalFields?: Array, enabled?: boolean|Ref<boolean>}):{promise: Promise<*>, refetch: Function, onError: Function, onDone: (function(onDoneFn: function, processResult: boolean=)), onLoading: Function, data: Ref<*|null>, loading: Ref<boolean>, error: Ref<Error>}} getErc20Assets
 * @property {function({ownerAddress: string|Ref<string>, count?: number|Ref<number>, additionalFields?: Array, enabled?: boolean|Ref<boolean>}):{promise: Promise<*>, refetch: Function, onError: Function, onDone: (function(onDoneFn: function, processResult: boolean=)), onLoading: Function, data: Ref<*|null>, loading: Ref<boolean>, error: Ref<Error>}} getErc20AssetsWithBalance
 * @property {function({count?: number|Ref<number>, additionalFields?: Array, enabled?: boolean|Ref<boolean>}):{promise: Promise<*>, refetch: Function, onError: Function, onDone: (function(onDoneFn: function, processResult: boolean=)), onLoading: Function, data: Ref<*|null>, loading: Ref<boolean>, error: Ref<Error>}} getErc20TokenList
 * @property {function({ownerAddress: string|Ref<string>, ownerAddress: string, additionalFields?: Array, collateralDebtAdditionalFields?: Array, enabled?: boolean|Ref<boolean>}):{promise: Promise<*>, refetch: Function, onError: Function, onDone: (function(onDoneFn: function, processResult: boolean=)), onLoading: Function, data: Ref<*|null>, loading: Ref<boolean>, error: Ref<Error>}} getFmintAccount
 * @property {function({ownerAddress: string|Ref<string>, tokenAddress: string|Ref<string>, enabled?: boolean|Ref<boolean>}):{promise: Promise<*>, refetch: Function, onError: Function, onDone: (function(onDoneFn: function, processResult: boolean=)), onLoading: Function, data: Ref<*|null>, loading: Ref<boolean>, error: Ref<Error>}} getTokenAllowance
 * @property {function({to: string|Ref<string>, enabled?: boolean|Ref<boolean>}):{promise: Promise<*>, refetch: Function, onError: Function, onDone: (function(onDoneFn: function, processResult: boolean=)), onLoading: Function, data: Ref<*|null>, loading: Ref<boolean>, error: Ref<Error>}} getPrice
 */
