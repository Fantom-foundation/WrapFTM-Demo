import { RpcConnector } from '../RpcConnector/RpcConnector.js';
import { VueApiConnector } from '../VueApiConnector/VueApiConnector.js';

const rpcConnector = new RpcConnector();
const vueRpcConnector = new VueApiConnector({
    connector: rpcConnector,
});

/**
 * @return {{rpcConnector: RpcConnector, vueRpcConnector: VueApiConnector}}
 */
export function useVueRpcConnector() {
    return { rpcConnector, vueRpcConnector };
}
