import gql from 'graphql-tag';
import { useVueApolloConnector } from '@/plugins/api-connectors/useVueApolloConnector/useVueApolloConnector.js';

const vueApolloConnector = useVueApolloConnector().vueApolloConnector;

/**
 * @return {{result: <any>, onError: (fn: (param: ApolloError) => void) => {off: () => void}, data: ComputedRef<*|null>, fetchMore: (options: (FetchMoreQueryOptions<null, any> & FetchMoreOptions<any, null>)) => (Promise<ApolloQueryResult<any>> | undefined), dataPromise: Promise<*>, refetch: (variables?: null) => (Promise<ApolloQueryResult<any>> | undefined), loading: <boolean>, error: <ApolloError | null>, onResult: (fn: (param: ApolloQueryResult<any>) => void) => {off: () => void}}}
 */
export function getGasPrice() {
    return vueApolloConnector.query({
        query: gql`
            query GetGasPrice {
                gasPrice
            }
        `,
        mock: {
            fnName: 'getGasPriceMock',
        },
        options: {
            clientId: 'fantom',
        },
    });
}
