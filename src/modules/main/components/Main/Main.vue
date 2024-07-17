<script setup>
import { setUpApollo } from '@/config/api/apollo.js';
import { setUpRpcConnector } from '@/config/api/rpc.js';
import {
    FNotifications,
    FTooltip,
    FNetworkStatus,
    FViewSwitcher,
    AsyncComponents,
} from 'fantom-vue3-components';
import AppTheme from '@/modules/app/components/AppTheme/AppTheme.vue';
import { appConfig } from '@/config/app-config.js';
import { setUpFormatters } from '@/config/formatters.js';
import { useAccounts } from '@/modules/account/composables/useAccounts/useAccounts.js';
import { setUpWallets } from '@/config/web3-wallets.js';
import WalletEventsHandler from '@/modules/wallet/components/WalletEventsHandler/WalletEventsHandler.vue';
import { useNotifications } from 'fantom-vue3-components/src/composables/useNotifications/useNotifications.js';
import { MAIN_VIEW_SWITCHER_ID } from '@/modules/main/constants/ids.js';
import { getCurrency } from '@/modules/app/store/store.js';
import { setWalletTransactionNotifications } from '@/modules/wallet/composables/useWallet/useWallet.js';
import { WALLET_PICKER_ID } from '@/modules/wallet/constants/ids.js';
import WalletPickerWindow from '@/modules/wallet/components/WalletPickerWindow/WalletPickerWindow.vue';

setUpFormatters(getCurrency().value);
setUpWallets();
setUpApollo(); // (useAuth().auth);
setUpRpcConnector();
useAccounts();

const notifications = useNotifications().notifications;

const RecentTransactionListButton = appConfig.flags.recentTransactionList
    ? AsyncComponents.get('RecentTransactionListButton')
    : {};

const TransactionNotifications = appConfig.flags.transactionNotifications
    ? AsyncComponents.get('TransactionNotifications')
    : {};

setWalletTransactionNotifications();

/*
onMounted(() => {
    setUpGqlApi();
});
*/
</script>

<template>
    <WalletPickerWindow
        :id="WALLET_PICKER_ID"
        restore-account-view-switcher-id="main-restore-account-view-switcher"
        restore-account-window-id="main-restore-account-window"
    />

    <FViewSwitcher :id="MAIN_VIEW_SWITCHER_ID" type="routes" />

    <AppTheme :themes="appConfig.themes" :default-theme="appConfig.defaultTheme" />
    <FNotifications
        strategy="newest-first"
        with-icon
        position="top-center"
        hide-on-click
        animation-in="scale-center-enter-active"
        animation-out="scale-center-leave-active"
        data-testid="notifications"
    />
    <TransactionNotifications />
    <FTooltip with-arrow hide-on-document-scroll />
    <WalletEventsHandler :notifications="notifications" />
    <FNetworkStatus />
    <RecentTransactionListButton v-if="appConfig.flags.recentTransactionList" />
</template>
