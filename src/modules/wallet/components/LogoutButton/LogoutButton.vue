<script setup>
import { FButton, useFPopover } from 'fantom-vue3-components';
import AppIconset from '@/modules/common/components/AppIconset/AppIconset.vue';
import LogoutConfirmationWindow from '@/modules/wallet/components/LogoutConfirmationWindow/LogoutConfirmationWindow.vue';
import { ref } from 'vue';
import { WALLET_BUTTON_POPOVER_ID } from '@/modules/wallet/constants/ids.js';

const props = defineProps({
    label: {
        type: String,
        default: '',
    },
    withoutConfirmation: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['logout']);

const window = ref(null);
const { enablePopoverHiding, disablePopoverHiding } = useFPopover(
    WALLET_BUTTON_POPOVER_ID
);
let currentAction = '';

function onButtonClick() {
    if (!props.withoutConfirmation) {
        disablePopoverHiding();

        window.value.show();
    } else {
        emit('logout');
    }
}
function onButtonAction(action) {
    currentAction = action;

    if (action === 'logout') {
        emit('logout');
    }
}

function onWindowHide() {
    enablePopoverHiding(currentAction === 'logout');

    currentAction = '';
}
</script>

<template>
    <FButton
        class="logoutbutton fbutton-withicon"
        tertiary
        size="large"
        v-bind="$attrs"
        @click="onButtonClick"
        data-testid="logout_button"
    >
        <AppIconset icon="close" /> {{ label || $t('wallet.logout') }}
    </FButton>
    <LogoutConfirmationWindow
        ref="window"
        @button-action="onButtonAction"
        @window-hide="onWindowHide"
    />
</template>
