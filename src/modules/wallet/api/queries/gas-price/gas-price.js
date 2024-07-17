import { useVueRpcConnector } from '@/plugins/api-connectors/useVueRpcConnector/useVueRpcConnector.js';

const vueRpcConnector = useVueRpcConnector().vueRpcConnector;

export function getGasPrice() {
    return vueRpcConnector.query({
        async query({ jsonRpcProvider }) {
            // ethers v6
            // console.log('--', await jsonRpcProvider.getFeeData());
            return await jsonRpcProvider.getGasPrice();
        },
        mock: {
            fnName: 'getGasPriceMock',
        },
    });
}
