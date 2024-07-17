import { Accounts } from '@/modules/account/Accounts/Accounts.js';
import { useAccountsStore } from '@/modules/account/store/store.js';
import { useWallet } from '@/modules/wallet/composables/useWallet/useWallet.js';
import { WEB3_WALLETS } from '@/config/web3-wallets.js';
import { useNotifications } from 'fantom-vue3-components/src/composables/useNotifications/useNotifications.js';
import { appConfig } from '@/config/app-config.js';

let store = null;

WEB3_WALLETS().forEach((web3Wallet) => {
    Accounts.registerWeb3Wallet(web3Wallet);
});

/** @type {Accounts} */
let accounts = null;

export function useAccounts() {
    if (accounts === null) {
        store = useAccountsStore();
        const { wallet } = useWallet(true);
        const { notifications } = useNotifications();

        accounts = new Accounts({
            store,
            wallet,
            notifications,
            oneAccountMode: appConfig.oneAccountMode,
        });
    }

    return {
        accounts,
        store,
    };
}
