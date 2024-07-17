import gql from 'graphql-tag';
import { useVueApolloConnector } from '@/plugins/api-connectors/useVueApolloConnector/useVueApolloConnector.js';

const vueApolloConnector = useVueApolloConnector().vueApolloConnector;

export function getTokenAllowance({
    ownerAddress,
    tokenAddress,
    spenderAddress,
    enabled = true,
}) {
    return vueApolloConnector.query({
        query: gql`
            query GetTokenAllowance(
                $owner: Address!
                $token: Address!
                $spender: Address!
            ) {
                ercTokenAllowance(token: $token, owner: $owner, spender: $spender)
            }
        `,
        variables: {
            owner: ownerAddress,
            token: tokenAddress,
            spender: spenderAddress,
        },
        enabled,
        mock: {
            fnName: 'getTokenAllowanceMock',
        },
        options: {
            clientId: 'fantom',
        },
    });
}
