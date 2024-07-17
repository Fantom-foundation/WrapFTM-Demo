import { defineStore } from 'pinia';

export const useWalletStore = defineStore('wallet', {
    state: () => {
        return {
            address: '',
            chainId: '',
            walletName: '',
        };
    },
});

/**
 * WalletStore object
 * @typedef {Object} WalletStore
 * @property {string} address Account address
 * @property {string} chainId
 * @property {string} walletName
 */
