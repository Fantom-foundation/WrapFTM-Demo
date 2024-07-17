import { RpcProvider } from '@/plugins/api-connectors/RpcProvider/RpcProvider.js';
import { chains } from '../chains.js';
import { appConfig } from '../app-config.js';
import { ethers } from 'ethers';
import { useNotifications } from 'fantom-vue3-components/src/composables/useNotifications/useNotifications.js';
import { useVueRpcConnector } from '@/plugins/api-connectors/useVueRpcConnector/useVueRpcConnector.js';
import { erc20Abi } from './abi/erc20Abi.js';

const useMock = import.meta.env.VITE_ACCEPTANCE_TESTING === '1';
const { notifications } = useNotifications();

function createRpcProviderMock(rpcUrl) {
    const jsonRpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl, 'any');

    window.__mocks__.jsonRpcProvider = jsonRpcProvider;

    return jsonRpcProvider;
}

export const rpcProvider = appConfig.flags._useRpcProvider
    ? new RpcProvider({
          chains,
          createProvider: useMock ? createRpcProviderMock : null,
          defaultChainId: appConfig.defaultChainId,
      })
    : null;

export function setUpRpcConnector() {
    const { rpcConnector, vueRpcConnector } = useVueRpcConnector();

    rpcConnector.setRpcProvider(rpcProvider);
    rpcConnector.setAbis({
        erc20: erc20Abi,
    });

    vueRpcConnector.setOnErrorHook((error) => {
        console.error(error);

        notifications.add({
            type: 'error',
            text: error.message,
        });
    });
}
