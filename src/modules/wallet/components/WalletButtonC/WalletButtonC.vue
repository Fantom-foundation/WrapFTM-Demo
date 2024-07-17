<script setup>
import WalletButton from '@/modules/wallet/components/WalletButton/WalletButton.vue';
import WalletButtonPopover from '@/modules/wallet/components/WalletButtonPopover/WalletButtonPopover.vue';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useWalletStore } from '@/modules/wallet/store/store.js';
import { useWalletPickerWindow } from '@/modules/wallet/composables/useWalletPickerWindow/useWalletPickerWindow.js';
import { useAccounts } from '@/modules/account/composables/useAccounts/useAccounts.js';
import AddingExistingAccountWarningWindow from '@/modules/wallet/components/AddingExistingAccountWarningWindow/AddingExistingAccountWarningWindow.vue';
import { getUniqueId } from 'fantom-vue3-components';
import { WEB3_WALLETS_BY_NAME } from '@/config/web3-wallets.js';
import { appConfig } from '@/config/app-config.js';
import { useWallet } from '@/modules/wallet/composables/useWallet/useWallet.js';

const props = defineProps({
    usePopover: {
        type: Boolean,
        default: false,
    },
});

const { useMultipleWallets, useWeb3Modal } = appConfig.flags;
const { address, walletName } = storeToRefs(useWalletStore());
const popover = ref(null);
const id = getUniqueId();
const loading = ref(false);
const { show: showWalletPickerWindow } = useWalletPickerWindow();
const wallet = useWallet().wallet;

const accounts = useAccounts().accounts;

const addingExistingAccountWarningWindow = ref(null);
const walletLabel = computed(() => {
    let walletLabel = '';

    if (useMultipleWallets && walletName.value) {
        if (useWeb3Modal) {
            walletLabel = wallet.web3Wallet.getConnectedWalletName();
        } else {
            const wallets = WEB3_WALLETS_BY_NAME();
            const wallet = wallets[walletName.value];

            if (wallet) {
                walletLabel = wallet.label;
            }
        }
    }

    return walletLabel;
});

async function addWeb3Wallet(walletName) {
    const previousActiveAccountAddress = accounts.store.activeAccountAddress;

    loading.value = true;

    try {
        await accounts.setActiveAccount({ walletName });

        if (
            walletName === 'metamask' &&
            previousActiveAccountAddress === accounts.store.activeAccountAddress
        ) {
            const account = accounts.getAccountByAddress(
                accounts.store.activeAccountAddress
            );

            if (account?.walletName === 'metamask') {
                address.value = previousActiveAccountAddress;
                addingExistingAccountWarningWindow.value.show();
            }
        }

        loading.value = false;
    } catch (error) {
        loading.value = false;
    }
}

async function onClick() {
    if (props.usePopover && address.value !== '') {
        popover.value.toggle();
    } else if (useMultipleWallets) {
        await showWalletPickerWindow();
    } else {
        await addWeb3Wallet('metamask');
    }
}
</script>

<template>
    <WalletButton
        :address="address"
        :sub-text="walletLabel"
        :placeholder-text="$t('wallet.walletButton.connectWallet')"
        :loading="loading"
        v-bind="$attrs"
        :id="id"
        @click="onClick"
    />
    <AddingExistingAccountWarningWindow
        ref="addingExistingAccountWarningWindow"
        :address="address"
    />
    <WalletButtonPopover v-if="usePopover" :attach-to="`#${id}`" ref="popover">
        <slot name="popover"></slot>
    </WalletButtonPopover>
</template>

<style lang="scss"></style>
