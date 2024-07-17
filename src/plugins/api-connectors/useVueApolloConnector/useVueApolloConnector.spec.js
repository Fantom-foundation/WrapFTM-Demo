import { withSetup } from 'fantom-vue3-components/src/test/utils.js';
import { useVueApolloConnector } from './useVueApolloConnector.js';
import { VueApiConnector } from '../VueApiConnector/VueApiConnector.js';
import { ApolloConnector } from '@/plugins/api-connectors/ApolloConnector/ApolloConnector.js';

let composableResult = null;
let app = null;

beforeEach(() => {
    const result = withSetup({ composable: () => useVueApolloConnector() });
    composableResult = result.composableResult;
    app = result.app;
});

afterEach(() => {
    app.unmount();
    composableResult = null;
    app = null;
});

describe('useApolloConnector', () => {
    it('should return instance of ApolloConnector class', () => {
        expect(composableResult.apolloConnector).toBeInstanceOf(ApolloConnector);
    });

    it('should return instance of VueApiConnector class', () => {
        expect(composableResult.vueApolloConnector).toBeInstanceOf(VueApiConnector);
    });
});
