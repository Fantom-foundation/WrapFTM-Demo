import { defineStore, storeToRefs } from 'pinia';
import { StoreUtils } from 'fantom-vue3-components/src/utils/StoreUtils/StoreUtils.js';
import { appConfig } from '@/config/app-config.js';

export const appStoreUtils = new StoreUtils(`${appConfig.code}-app`);

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            ...appStoreUtils.useInLocalStorage('lang', ''),
            // ...appStoreUtils.useInLocalStorage('lang', appConfig.defaultLanguageCode),
            ...appStoreUtils.useInLocalStorage('theme', appConfig.defaultTheme),
            ...appStoreUtils.useInLocalStorage('currency', appConfig.defaultCurrency),
            ...appStoreUtils.useInLocalStorage('autoDarkTheme', false),
            ...appStoreUtils.useInLocalStorage('rtlDirection', false),
        };
    },
});

export function getCurrency() {
    const { currency } = storeToRefs(useAppStore());

    return currency;
}
