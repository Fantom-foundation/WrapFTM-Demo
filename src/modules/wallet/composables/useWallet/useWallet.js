import { Wallet } from '@/modules/wallet/Wallet/Wallet.js';
import { useWalletStore } from '@/modules/wallet/store/store.js';
import { onUnmounted } from 'vue';
import { appConfig } from '@/config/app-config.js';
import { storeToRefs } from 'pinia';
import { chains } from '@/config/chains.js';
import { useFApi } from '@/plugins/api-connectors/FApi/useFApi/useFApi.js';

let store = null;
let api = null;
const listeners = {};
let accountAddress = null;
let chainId = null;

function walletEventsListener(event) {
    for (let symbol of Object.getOwnPropertySymbols(listeners)) {
        listeners[symbol].forEach((listener) => {
            listener(event);
        });
    }
}

let wallet = null;

export async function setWalletTransactionNotifications() {
    if (appConfig.flags.transactionNotifications) {
        const wallet = useWallet().wallet;

        const { useTransactionNotifications } = await import(
            '/src/modules/transaction/composables/useTransactionNotifications/useTransactionNotifications.js'
        );
        wallet.setTransactionNotifications(
            useTransactionNotifications().transactionNotifications
        );
    }
}

/**
 * @param {boolean} [outsideComponent]
 * @param {Wallet} [walletClass]
 * @return {{wallet: Wallet, store: Object, onWalletEvents: onWalletEvents, accountAddress: Ref<string>}}
 */
export function useWallet(outsideComponent = false, walletClass = Wallet) {
    const key = Symbol();

    if (!wallet) {
        store = useWalletStore();
        const storeRefs = storeToRefs(store);
        accountAddress = storeRefs.address;
        chainId = storeRefs.chainId;
        api = useFApi().api;
        wallet = new walletClass({
            store,
            api,
            walletEventsListener,
            defaultChainId: chains.defaultChain.chainId,
            // transactionNotifications: useTransactionNotifications().transactionNotifications,
            // disconnectOnRemove: appConfig.oneAccountMode,
        });
    }

    function onWalletEvents(fn) {
        if (typeof fn === 'function') {
            if (!listeners[key]) {
                listeners[key] = [];
            }

            listeners[key].push(fn);
        }
    }

    if (!outsideComponent) {
        onUnmounted(() => {
            if (listeners[key]) {
                delete listeners[key];
            }
        });
    }

    return {
        wallet,
        store,
        onWalletEvents,
        accountAddress,
        chainId,
    };
}
