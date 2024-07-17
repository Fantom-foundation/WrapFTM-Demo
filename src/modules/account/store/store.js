import { defineStore } from 'pinia';
import { StoreUtils } from 'fantom-vue3-components/src/utils/StoreUtils/StoreUtils.js';
import { appConfig } from '@/config/app-config.js';

export const accountsStoreUtils = new StoreUtils(`${appConfig.code}-accounts`);

export const useAccountsStore = defineStore('accounts', {
    state: () => {
        return {
            ...accountsStoreUtils.useInLocalStorage('accounts', []),
            ...accountsStoreUtils.useInLocalStorage('activeAccountAddress', ''),
        };
    },
});
