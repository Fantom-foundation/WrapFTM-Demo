<script setup>
import TransactionNotifications from './TransactionNotifications.vue';
import { FButton } from 'fantom-vue3-components';
import { useTransactionNotifications } from '@/modules/transaction/composables/useTransactionNotifications/useTransactionNotifications.js';
import { ref } from 'vue';
import { TEST_TRANSACTION_HASH } from '@/plugins/web3-wallets/test-helpers.js';

const transactionNotifications = useTransactionNotifications().transactionNotifications;
const txStatus = ref({ status: 'pending' });

function onShowButtonClick() {
    transactionNotifications.add(
        {
            text: 'Lorem ipsum dolor sit amend 1234',
            hash: TEST_TRANSACTION_HASH,
        },
        txStatus
    );
}

function onSuccessButtonClick() {
    txStatus.value = { status: 'success' };
}

function onErrorButtonClick() {
    txStatus.value = { status: 'error' };
}

function onRejectedButtonClick() {
    txStatus.value = { status: 'rejected' };
}

function onPendingButtonClick() {
    txStatus.value = { status: 'pending' };
}
</script>

<template>
    <div class="playground_content">
        <div class="playground_example">
            <h2>Default</h2>
            <FButton label="Show notification" @click="onShowButtonClick" />
            <FButton label="Status 'success'" @click="onSuccessButtonClick" />
            <FButton label="Status 'error'" @click="onErrorButtonClick" />
            <FButton label="Status 'rejected'" @click="onRejectedButtonClick" />
            <FButton label="Status 'pending'" @click="onPendingButtonClick" />
            <TransactionNotifications />
        </div>
    </div>
</template>
