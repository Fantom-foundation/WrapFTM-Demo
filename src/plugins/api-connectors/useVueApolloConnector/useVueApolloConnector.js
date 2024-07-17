import { ApolloConnector } from '../ApolloConnector/ApolloConnector.js';
import { VueApiConnector } from '../VueApiConnector/VueApiConnector.js';

const apolloConnector = new ApolloConnector();
const vueApolloConnector = new VueApiConnector({
    connector: apolloConnector,
});

/**
 * @return {{apolloConnector: ApolloConnector, vueApolloConnector: VueApiConnector}}
 */
export function useVueApolloConnector() {
    return { apolloConnector, vueApolloConnector };
}
