import gql from 'graphql-tag';
import { useVueApolloConnector } from '@/plugins/api-connectors/useVueApolloConnector/useVueApolloConnector.js';

const vueApolloConnector = useVueApolloConnector().vueApolloConnector;

export function getEstimateGas({
    from = undefined,
    to = undefined,
    value = undefined,
    data = undefined,
}) {
    return vueApolloConnector.query({
        query: gql`
            query GetEstimateGas(
                $from: Address
                $to: Address
                $value: BigInt
                $data: String
            ) {
                estimateGas(from: $from, to: $to, value: $value, data: $data)
            }
        `,
        variables: {
            from: from,
            to: to,
            value: value,
            data: data,
        },
        mock: {
            fnName: 'getEstimateGasMock',
        },
        options: {
            clientId: 'fantom',
        },
    });
}
