import gql from 'graphql-tag';
import { useVueApolloConnector } from '@/plugins/api-connectors/useVueApolloConnector/useVueApolloConnector.js';

const vueApolloConnector = useVueApolloConnector().vueApolloConnector;

export function sendTransaction() {
    return vueApolloConnector.mutation({
        mutation: gql`
            mutation ($transaction: Bytes!) {
                sendTransaction(tx: $transaction) {
                    hash
                    from
                    to
                }
            }
        `,
        pickFn: sendTransactionPickFn,
        mock: {
            fnName: 'sendTransaction',
        },
        options: {
            clientId: 'fantom',
        },
    });
}

export function sendTransactionPickFn(data) {
    return data?.sendTransaction?.hash;
}
