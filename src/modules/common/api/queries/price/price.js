import gql from 'graphql-tag';
import { useVueApolloConnector } from '@/plugins/api-connectors/useVueApolloConnector/useVueApolloConnector.js';

const vueApolloConnector = useVueApolloConnector().vueApolloConnector;

export function getPrice({ to = 'USD', enabled = true }) {
    return vueApolloConnector.query({
        query: gql`
            query GetPrice($to: String!) {
                price(to: $to) {
                    price
                }
            }
        `,
        variables: { to },
        defaultData: 1,
        enabled,
        pickFn: getPricePickFn,
        mock: {
            fnName: 'getPriceMock',
        },
        options: {
            clientId: 'fantom',
        },
    });
}

export function getPricePickFn(data) {
    return data?.price?.price;
}
