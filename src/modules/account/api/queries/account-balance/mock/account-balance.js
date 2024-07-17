import { unref } from 'vue';
import { ERC20_TOKEN_BALANCE } from '../../../../../../../tests/data/account/erc20-token-balance.js';

/**
 * @param {Ref|string} erc20TokenAddress
 * @return {{result: null, onError: function(*): void, data: ComputedRef<*|null>, fetchMore: function(...[*]): void, dataPromise: Promise<*>, refetch: function(...[*]): void, loading: Ref<UnwrapRef<boolean>>, error: null, enabled: Ref<UnwrapRef<*>>, onResult: function(*): void}}
 */
export function getAccountBalanceMock({ erc20TokenAddress } = {}) {
    const tokenAddress = unref(erc20TokenAddress);

    return tokenAddress ? ERC20_TOKEN_BALANCE().ercTokenBalance : '0x6B14BD1E6EEA00000';
}
