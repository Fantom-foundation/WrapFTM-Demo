<script setup>
import { ref } from 'vue';
import { exposeMethods } from 'fantom-vue3-components/src/utils/exposeMethods/exposeMethods.js';
import ConfirmationWindow from '@/modules/common/components/ConfirmationWindow/ConfirmationWindow.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const window = ref(null);
const buttons = ref([
    {
        action: 'cancel',
        label: t('wallet.cancel'),
        size: 'large',
        secondary: true,
    },
    {
        action: 'logout',
        label: t('wallet.logout'),
        size: 'large',
    },
]);

defineExpose(exposeMethods(window, ['show', 'hide', 'isWindowVisible']));
</script>

<template>
    <ConfirmationWindow
        ref="window"
        :buttons="buttons"
        :title="$t('wallet.logout')"
        data-testid="logout_confirmation_window"
    >
        <p class="tea-center">
            {{ $t('wallet.logoutConfirmation.text') }}
        </p>
    </ConfirmationWindow>
</template>
