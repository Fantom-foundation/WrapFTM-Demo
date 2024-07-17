import { computed, isRef, unref } from 'vue';
import { useVueRpcConnector } from '@/plugins/api-connectors/useVueRpcConnector/useVueRpcConnector';

const vueRpcConnector = useVueRpcConnector().vueRpcConnector;

export function getFTMBalancePickFn(data) {
    return data?.account?.balance;
}

export function getErc20TokenBalancePickFn(data) {
    return data?.ercTokenBalance;
}

function getBalance({ address, enabled, skipFirst, chainId }) {
    return vueRpcConnector.query({
        async query({ variables, jsonRpcProvider }) {
            return await jsonRpcProvider.getBalance(variables.address);
        },
        variables: { address, chainId },
        enabled,
        skipFirst,
        mock: {
            fnName: 'getAccountBalanceMock',
        },
    });
}

function getErc20TokenBalance({
    address,
    erc20TokenAddress,
    enabled,
    skipFirst,
    chainId,
}) {
    return vueRpcConnector.query({
        async query({ variables, getContract }) {
            // throw new Error('Not implemented yet');
            return getContract(variables.token, 'erc20').balanceOf(variables.owner);
        },
        variables: { owner: address, token: erc20TokenAddress, chainId },
        enabled,
        skipFirst,
        mock: {
            fnName: 'getAccountBalanceMock',
        },
    });
}

export function getAccountBalance({
    address,
    erc20TokenAddress = '',
    enabled = isRef(address) ? computed(() => !!address.value) : !!address,
    skipFirst = false,
    chainId,
}) {
    return unref(erc20TokenAddress)
        ? getErc20TokenBalance({
              address,
              erc20TokenAddress,
              enabled,
              skipFirst,
              chainId,
          })
        : getBalance({ address, enabled, skipFirst, chainId });
}
