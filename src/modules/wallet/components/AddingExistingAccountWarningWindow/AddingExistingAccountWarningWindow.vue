<script setup>
import { ref } from 'vue';
import { exposeMethods } from 'fantom-vue3-components/src/utils/exposeMethods/exposeMethods.js';
import { FWindow, FAddress } from 'fantom-vue3-components';

defineProps({
    address: {
        type: String,
        default: '',
        required: true,
    },
});

const window = ref(null);

defineExpose(exposeMethods(window, ['show', 'hide', 'isWindowVisible']));
</script>

<template>
    <FWindow
        ref="window"
        modal
        :title="$t('wallet.notification')"
        class="addingexistingaccountwarningwindow fwindow-width-3 fwindow-nobodytoppadding"
    >
        <p class="tea-center">
            {{ $t('wallet.addingExistingAccountWarningWindow.messagePart1') }}
            <FAddress :address="address" />
            {{ $t('wallet.addingExistingAccountWarningWindow.messagePart2') }}
        </p>
    </FWindow>
</template>
