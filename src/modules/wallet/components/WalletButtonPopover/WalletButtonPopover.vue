<script setup>
import { FPopover, useFPopover } from 'fantom-vue3-components';
import { ref, watch } from 'vue';
import WalletsInfoPage from '@/modules/wallet/components/WalletsInfoPage/WalletsInfoPage.vue';
import { WALLET_BUTTON_POPOVER_ID } from '@/modules/wallet/constants/ids.js';
import { storeToRefs } from 'pinia';
import { useWalletStore } from '@/modules/wallet/store/store.js';
import { appConfig } from '@/config/app-config.js';

const popover = ref(null);
const { address } = storeToRefs(useWalletStore());
const { exposeFPopoverMethods, hideOnDocumentMousedown } = useFPopover(
    WALLET_BUTTON_POPOVER_ID,
    popover
);

watch(address, () => {
    popover.value.hide();
});

defineExpose(exposeFPopoverMethods());
</script>

<template>
    <FPopover
        ref="popover"
        attach-position="rt rt"
        :attach-margin="[0, 0, 0, 0]"
        width-as-attach
        :hide-on-document-mousedown="hideOnDocumentMousedown"
        :prevent-focus="false"
        class="fdropdownlistbox_fwindow"
        @window-hide="$emit('window-hide', $event)"
    >
        <slot>
            <WalletsInfoPage
                :account-address="address"
                :one-account-mode="appConfig.oneAccountMode"
            />
        </slot>
    </FPopover>
</template>

<style lang="scss"></style>
