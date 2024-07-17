import { chains } from '@/config/chains.js';
import { useWallet } from '@/modules/wallet/composables/useWallet/useWallet.js';
import { rpcProvider } from '@/config/api/rpc.js';
import { appConfig } from '@/config/app-config.js';
import { switchWeb3ModalChain } from '@/plugins/web3-wallets/useWeb3Modal.js';

export async function switchChain(chainId) {
    if (!chainId) {
        return;
    }

    const { wallet } = useWallet();

    chains.setDefaultChainId(chainId);
    wallet.setDefaultChainId(chainId); // change when source chain is change (picked, swapped)
    rpcProvider.setByChainId(chainId);

    if (appConfig.flags.useWeb3Modal) {
        await switchWeb3ModalChain(chainId);
    }
}
