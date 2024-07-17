import { useVueRpcConnector } from '@/plugins/api-connectors/useVueRpcConnector/useVueRpcConnector.js';

const vueRpcConnector = useVueRpcConnector().vueRpcConnector;

export function getTransactionStatus(transactionHash) {
    return vueRpcConnector.query({
        async query({ variables, jsonRpcProvider }) {
            const tx = await jsonRpcProvider.getTransactionReceipt(
                variables.transactionHash
            );
            let status = null;

            if (tx) {
                status = parseInt(tx.status) === 1 ? '0x1' : '0x0';
            }

            return status;
        },
        variables: {
            transactionHash,
        },
        mock: {
            fnName: 'getTransactionStatusMock',
        },
    });
}

export function getTransactionReceipt(transactionHash) {
    return vueRpcConnector.query({
        async query({ variables, jsonRpcProvider }) {
            const tx = await jsonRpcProvider.getTransactionReceipt(
                variables.transactionHash
            );

            return tx || null;
        },
        variables: {
            transactionHash,
        },
    });
}
