<script setup>
import { useWallet } from '@/modules/wallet/composables/useWallet/useWallet.js';
import { useAccounts } from '@/modules/account/composables/useAccounts/useAccounts.js';
import { storeToRefs } from 'pinia';
import { useWalletStore } from '@/modules/wallet/store/store.js';
import { defer } from 'fantom-vue3-components';
import { onMounted, ref } from 'vue';
import BadChainWarningWindow from '@/modules/wallet/components/BadChainWarningWindow/BadChainWarningWindow.vue';
import { chains } from '@/config/chains.js';

const props = defineProps({
    notifications: { required: true },
});

const wallet = useWallet().wallet;
const { accounts } = useAccounts();
const { walletName } = storeToRefs(useWalletStore());
const badChainWarningWindow = ref(null);
const chainId = ref(chains.defaultChain.chainId);

function addAccount(data) {
    defer(() => {
        const { accounts } = useAccounts();

        /*console.log(
            '???',
            walletName.value,
            store.activeAccountAddress,
            data.address,
            data.prevAddress,
            data.requestAddress
        );*/

        // if (walletName.value !== 'software' && store.activeAccountAddress !== data.address) {
        if (!accounts.getAccountByAddress(data.address)) {
            accounts.setActiveAccount({
                address: data.address,
                walletName: data.walletName,
            });
        } /*else if (!addressesMatch(store.activeAccountAddress, data.address)) {
            accounts.setActiveAccount(
                { address: store.activeAccountAddress, walletName: data.walletName },
                { activateOnInit: false }
            );
        }*/
    });
}

function cancelEvent(event) {
    if (Array.isArray(event.waitFor)) {
        event.waitFor.push(
            new Promise((resolve) => {
                resolve('cancel');
            })
        );
    }
}

function removeAccount(address) {
    accounts.removeAccountByAddress(address);
}

function onWalletEvents(event) {
    if (event.name === 'error') {
        props.notifications.add({
            type: 'error',
            text: event.data,
        });
    } else if (event.name === 'address_change') {
        cancelEvent(event);
        // console.log('handler: address_change');
        addAccount(event.data);
    } else if (event.name === 'bad_chain_id') {
        badChainWarningWindow?.value?.show();
        cancelEvent(event);
    } else if (event.name === 'chain_change') {
        badChainWarningWindow?.value?.hide();
    } else if (event.name === 'no_wallet_set') {
        console.log('handler: no_wallet_set');
    } else if (event.name === 'wallet_inactive') {
        console.log('handler: wallet_inactive');
        addAccount(event.data);
    } else if (event.name === 'disconnected') {
        removeAccount(event.address);
    }
}

onMounted(() => {
    wallet.setEventsListener(onWalletEvents);
});
</script>

<template>
    <div class="walleteventshandler">
        <BadChainWarningWindow
            ref="badChainWarningWindow"
            :chain-id="chainId"
            :web3-wallet="wallet.web3Wallet"
            :show-switch-chain-button="walletName === 'metamask'"
        />
    </div>
</template>

<style lang="scss">
.walleteventshandler {
}
</style>
