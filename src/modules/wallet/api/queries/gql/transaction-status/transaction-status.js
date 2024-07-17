import gql from 'graphql-tag';
import { useVueApolloConnector } from '@/plugins/api-connectors/useVueApolloConnector/useVueApolloConnector.js';

const vueApolloConnector = useVueApolloConnector().vueApolloConnector;

export function getTransactionStatus(transactionHash) {
    return vueApolloConnector.query({
        query: gql`
            query GetTransactionStatus($hash: Bytes32!) {
                transaction(hash: $hash) {
                    status
                }
            }
        `,
        variables: {
            hash: transactionHash,
        },
        pickFn: getTransactionStatusPickFn,
        mock: {
            fnName: 'getTransactionStatusMock',
        },
        options: {
            clientId: 'fantom',
        },
    });
}

export function getTransactionStatusPickFn(data) {
    return data?.transaction?.status;
}
