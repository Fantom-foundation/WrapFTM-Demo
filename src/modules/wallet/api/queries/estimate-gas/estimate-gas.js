import { useVueRpcConnector } from '@/plugins/api-connectors/useVueRpcConnector/useVueRpcConnector.js';

const vueRpcConnector = useVueRpcConnector().vueRpcConnector;

export function getEstimateGas(transaction = {}) {
    return vueRpcConnector.query({
        async query({ variables, jsonRpcProvider }) {
            return jsonRpcProvider.estimateGas(variables.transaction);
        },
        variables: {
            transaction,
        },
        mock: {
            fnName: 'getEstimateGasMock',
        },
    });
}
