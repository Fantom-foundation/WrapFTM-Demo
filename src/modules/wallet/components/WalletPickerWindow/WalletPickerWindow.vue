<script setup>
import { FWindow, useFWindow } from 'fantom-vue3-components';
import { ref } from 'vue';
import WalletPicker from '@/modules/wallet/components/WalletPicker/WalletPicker.vue';
import { WALLET_PICKER_ID } from '@/modules/wallet/constants/ids.js';

const emit = defineEmits(['account-picked']);

const props = defineProps({
    restoreAccountViewSwitcherId: {
        type: String,
        default: '',
    },
    restoreAccountWindowId: {
        type: String,
        default: '',
    },
    id: {
        type: String,
        default: WALLET_PICKER_ID,
    },
});

const window = ref(null);

function onAccountPicked(data) {
    window.value.hide();

    emit('account-picked', data);
}

function onWalletPick() {
    // window.value.hide();
    // const { name } = data;
    // if (name !== 'ledger' && name !== 'software') {
    // if (name === 'walletconnect') {
    //     window.value.hide();
    // }
}

const { exposeFWindowMethods } = useFWindow(props.id, window);

defineExpose(exposeFWindowMethods());
</script>

<template>
    <FWindow
        ref="window"
        modal
        :title="$t('wallet.walletPickerWindow.label')"
        class="walletpickerwindow fwindow-width-3 fwindow-nobodytoppadding"
    >
        <WalletPicker
            @account-picked="onAccountPicked"
            @wallet-pick="onWalletPick"
            :restore-account-view-switcher-id="restoreAccountViewSwitcherId"
            :restore-account-window-id="restoreAccountWindowId"
        />
    </FWindow>
</template>
