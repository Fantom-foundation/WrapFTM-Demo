import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { appConfig } from '@/config/app-config.js';
import { FApolloClient } from '../../plugins/apollo/FApolloClient.js';
import { useVueApolloConnector } from '@/plugins/api-connectors/useVueApolloConnector/useVueApolloConnector.js';
import { useNotifications } from 'fantom-vue3-components/src/composables/useNotifications/useNotifications.js';
import { GqlPagination } from 'fantom-vue3-components';

export const fantomFApolloClient = new FApolloClient({
    apolloProviders: appConfig.apollo.fantom.providers,
    defaultProviderIndex: appConfig.apollo.fantom.defaultProviderIndex,
});

const fantomApolloClient = new ApolloClient({
    link: ApolloLink.from([
        fantomFApolloClient.getNetErrorLink(),
        fantomFApolloClient.getRetryLink(),
        fantomFApolloClient.getErrorLink(),
        // fantomFApolloClient.getHttpAuthLink(),
        fantomFApolloClient.getHttpLink(),
    ]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
    /*
    defaultOptions: {
        watchQuery: {
            nextFetchPolicy(currentFetchPolicy) {
                if (
                    currentFetchPolicy === 'network-only' ||
                    currentFetchPolicy === 'cache-and-network'
                ) {
                    // Demote the network policies (except "no-cache") to "cache-first"
                    // after the first request.
                    return 'cache-first';
                }
                // Leave all other fetch policies unchanged.
                return currentFetchPolicy;
            },
        },
    },
*/
});

const apolloClients = {
    fantom: fantomApolloClient,
};

function setUpAuth(auth) {
    if (auth) {
        // fantomFApolloClient.setAuth(auth);
    }
}

function setUpApolloConnector() {
    const { apolloConnector, vueApolloConnector } = useVueApolloConnector();
    const { notifications } = useNotifications();

    apolloConnector.setApolloClients(apolloClients);
    apolloConnector.setDefaultOptions({
        fetchPolicy: 'network-only',
    });

    vueApolloConnector.setOnErrorHook((error) => {
        notifications.add({
            type: 'error',
            text: error.message,
        });
    });
}

function setUpGqlPagination() {
    GqlPagination.setPageInfoAttrNames('fantom-api', {
        startCursor: 'first',
        endCursor: 'last',
        hasNextPage: 'hasNext',
        hasPreviousPage: 'hasPrevious',
    });
    GqlPagination.setQueryVariableNames('fantom-api', {
        first: 'count',
        last: 'last',
        after: 'cursor',
        before: 'before',
    });
}

export function setUpApollo(auth) {
    setUpAuth(auth);
    setUpApolloConnector();
    setUpGqlPagination();
}
