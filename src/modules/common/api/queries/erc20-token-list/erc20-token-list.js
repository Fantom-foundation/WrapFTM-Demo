import gql from 'graphql-tag';
import { useVueApolloConnector } from '@/plugins/api-connectors/useVueApolloConnector/useVueApolloConnector.js';

const vueApolloConnector = useVueApolloConnector().vueApolloConnector;

export function getErc20TokenList({
    count = 50,
    additionalFields = [],
    enabled = true,
} = {}) {
    return vueApolloConnector.query({
        query: gql`
            query GetErc20TokenList($count: Int = 50) {
                erc20TokenList(count: $count) {
                    address
                    name
                    symbol
                    decimals
                    logoURL
                    ${additionalFields.join('\n')}
                }
            }
        `,
        variables: { count },
        defaultData: [],
        enabled,
        options: {
            clientId: 'fantom',
            // fetchPolicy: 'cache-first',
        },
        mock: {
            fnName: 'getErc20TokenListMock',
        },
    });
}
