import { useFApi } from '@/plugins/api-connectors/FApi/useFApi/useFApi.js';
import { getEstimateGas } from '@/modules/wallet/api/queries/estimate-gas/estimate-gas.js';
import { getGasPrice } from '@/modules/wallet/api/queries/gas-price/gas-price.js';
import { getNonce } from '@/modules/wallet/api/queries/nonce/nonce.js';
import {
    getTransactionStatus,
    getTransactionReceipt,
} from '@/modules/wallet/api/queries/transaction-status/transaction-status.js';

const api = useFApi().api;

api.registerQueries({
    getEstimateGas,
    getGasPrice,
    getNonce,
    getTransactionStatus,
    getTransactionReceipt,
});

/**
 * @typedef {Object} WalletApiQueries
 * @property {function():{promise: Promise<*>, refetch: Function, onError: Function, onDone: (function(onDoneFn: function, processResult: boolean=)), onLoading: Function, data: Ref<*|null>, loading: Ref<boolean>, error: Ref<Error>}} getGasPrice
 * @property {function({from: string, to: string, value: string, data: string}):{promise: Promise<*>, refetch: Function, onError: Function, onDone: (function(onDoneFn: function, processResult: boolean=)), onLoading: Function, data: Ref<*|null>, loading: Ref<boolean>, error: Ref<Error>}} getEstimateGas
 * @property {function({address: string}):{promise: Promise<*>, refetch: Function, onError: Function, onDone: (function(onDoneFn: function, processResult: boolean=)), onLoading: Function, data: Ref<*|null>, loading: Ref<boolean>, error: Ref<Error>}} getNonce
 * @property {function({transactionHash: string}):{promise: Promise<*>, refetch: Function, onError: Function, onDone: (function(onDoneFn: function, processResult: boolean=)), onLoading: Function, data: Ref<*|null>, loading: Ref<boolean>, error: Ref<Error>}} getTransactionStatus
 * @property {function({transactionHash: string}):{promise: Promise<*>, refetch: Function, onError: Function, onDone: (function(onDoneFn: function, processResult: boolean=)), onLoading: Function, data: Ref<*|null>, loading: Ref<boolean>, error: Ref<Error>}} getTransactionReceipt
 */
