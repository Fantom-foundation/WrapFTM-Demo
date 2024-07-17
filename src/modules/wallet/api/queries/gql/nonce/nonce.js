import gql from 'graphql-tag';
import { useVueApolloConnector } from '@/plugins/api-connectors/useVueApolloConnector/useVueApolloConnector.js';

const vueApolloConnector = useVueApolloConnector().vueApolloConnector;

export function getNonce(address) {
    return vueApolloConnector.query({
        query: gql`
            query GetNonce($address: Address!) {
                account(address: $address) {
                    txCount
                }
            }
        `,
        variables: {
            address,
        },
        pickFn: getNoncePickFn,
        mock: {
            fnName: 'getNonceMock',
        },
        options: {
            clientId: 'fantom',
        },
    });
}

export function getNoncePickFn(data) {
    return data?.account?.txCount;
}
