import { WALLET_PICKER_ID } from '@/modules/wallet/constants/ids.js';
import { useFWindow } from 'fantom-vue3-components';
import { appConfig } from '@/config/app-config.js';
import { closeWeb3Modal, openWeb3Modal } from '@/plugins/web3-wallets/useWeb3Modal.js';

export function useWalletPickerWindow(id = WALLET_PICKER_ID) {
    const { show: showWP, hide: hideWP } = useFWindow(id);
    const { useWeb3Modal } = appConfig.flags;

    async function show() {
        if (useWeb3Modal) {
            await openWeb3Modal();
        } else if (showWP) {
            showWP();
        }
    }

    async function hide() {
        if (useWeb3Modal) {
            await closeWeb3Modal();
        } else if (hideWP) {
            hideWP();
        }
    }

    return { show, hide };
}
