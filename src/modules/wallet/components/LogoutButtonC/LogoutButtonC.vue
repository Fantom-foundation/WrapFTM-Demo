<script setup>
import { useAccounts } from '@/modules/account/composables/useAccounts/useAccounts.js';
import LogoutButton from '@/modules/wallet/components/LogoutButton/LogoutButton.vue';
import { computed } from 'vue';

const { accounts } = useAccounts();

const withoutConfirmation = computed(() => {
    return !accounts.store.accounts.find((account) => account.walletName === 'software');
});

function onLogout() {
    accounts.removeAllAccounts();
}
</script>

<template>
    <LogoutButton :without-confirmation="withoutConfirmation" @logout="onLogout" />
</template>
