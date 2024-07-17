import { withSetup } from 'fantom-vue3-components/src/test/utils.js';
import { useVueRpcConnector } from './useVueRpcConnector.js';
import { VueApiConnector } from '../VueApiConnector/VueApiConnector.js';
import { RpcConnector } from '@/plugins/api-connectors/RpcConnector/RpcConnector.js';

let composableResult = null;
let app = null;

beforeEach(() => {
    const result = withSetup({ composable: () => useVueRpcConnector() });
    composableResult = result.composableResult;
    app = result.app;
});

afterEach(() => {
    app.unmount();
    composableResult = null;
    app = null;
});

describe('useRpcConnector', () => {
    it('should return instance of RpcConnector class', () => {
        expect(composableResult.rpcConnector).toBeInstanceOf(RpcConnector);
    });

    it('should return instance of VueApiConnector class', () => {
        expect(composableResult.vueRpcConnector).toBeInstanceOf(VueApiConnector);
    });
});
