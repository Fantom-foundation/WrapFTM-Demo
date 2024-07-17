import { useVueRpcConnector } from '@/plugins/api-connectors/useVueRpcConnector/useVueRpcConnector.js';
import { toHex } from '@/utils/big-number/big-number.js';

const vueRpcConnector = useVueRpcConnector().vueRpcConnector;

export function getNonce(address) {
    return vueRpcConnector.query({
        async query({ variables, jsonRpcProvider }) {
            return toHex(await jsonRpcProvider.getTransactionCount(variables.address));
        },
        variables: {
            address,
        },
        mock: {
            fnName: 'getNonceMock',
        },
    });
}
