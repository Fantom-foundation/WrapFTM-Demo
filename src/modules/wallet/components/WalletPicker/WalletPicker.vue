<script setup>
import { ref } from 'vue';
import WalletList from '@/modules/wallet/components/WalletList/WalletList.vue';
import { WEB3_WALLETS } from '@/config/web3-wallets.js';
import { useAccounts } from '@/modules/account/composables/useAccounts/useAccounts.js';
import AddingExistingAccountWarningWindow from '@/modules/wallet/components/AddingExistingAccountWarningWindow/AddingExistingAccountWarningWindow.vue';
import { AsyncComponents } from 'fantom-vue3-components';

const RestoreAccountWindow = AsyncComponents.get('RestoreAccountWindow');
const LedgerAccountPickerWindow = AsyncComponents.get('LedgerAccountPickerWindow');

const emit = defineEmits([
    'wallet-pick',
    'window-hide',
    'account-picked',
    'same-account-picked',
]);

defineProps({
    restoreAccountViewSwitcherId: {
        type: String,
        default: '',
    },
    restoreAccountWindowId: {
        type: String,
        default: '',
    },
});

const accounts = useAccounts().accounts;
const wallets = ref(WEB3_WALLETS().map((wallet) => ({ ...wallet, value: wallet.name })));
const restoreAccountWindow = ref(null);
const ledgerWindow = ref(null);
const addingExistingAccountWarningWindow = ref(null);
const address = ref('');
const ledgerWalletName = ref('');

async function addWeb3Wallet(walletName) {
    const previousActiveAccountAddress = accounts.store.activeAccountAddress;

    await accounts.setActiveAccount({ walletName });

    if (
        walletName === 'metamask' &&
        previousActiveAccountAddress === accounts.store.activeAccountAddress
    ) {
        const account = accounts.getAccountByAddress(accounts.store.activeAccountAddress);

        if (account?.walletName === 'metamask') {
            address.value = previousActiveAccountAddress;
            addingExistingAccountWarningWindow.value.show();
            emit('same-account-picked', {
                address: previousActiveAccountAddress,
            });
        }
    }
}

function onWalletPick(wallet) {
    const walletName = wallet.name;

    if (walletName === 'software') {
        restoreAccountWindow.value.show();
    } else if (walletName === 'ledger-fantom' || walletName === 'ledger-ethereum') {
        ledgerWalletName.value = walletName;
        ledgerWindow.value.show();
    } else {
        addWeb3Wallet(walletName);
    }

    emit('wallet-pick', wallet);
}
</script>

<template>
    <div class="walletpicker">
        <WalletList :wallets="wallets" @wallet-pick="onWalletPick" />
        <RestoreAccountWindow
            ref="restoreAccountWindow"
            :restore-account-view-switcher-id="restoreAccountViewSwitcherId"
            :restore-account-window-id="restoreAccountWindowId"
            @window-hide="$emit('window-hide')"
            @account-picked="$emit('account-picked')"
        />
        <AddingExistingAccountWarningWindow
            ref="addingExistingAccountWarningWindow"
            :address="address"
        />
        <LedgerAccountPickerWindow ref="ledgerWindow" :wallet-name="ledgerWalletName" />
    </div>
</template>

<style lang="scss"></style>
