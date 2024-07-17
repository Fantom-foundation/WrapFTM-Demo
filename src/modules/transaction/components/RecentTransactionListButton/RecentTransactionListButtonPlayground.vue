<script setup>
import RecentTransactionListButton from './RecentTransactionListButton.vue';

const transactions = [
    {
        hash: '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
        description: 'tx description 1',
        status: 'pending',
        time: 1675691168634,
    },
    {
        description: 'tx description 2',
        hash: '0x40852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
        status: 'success',
        time: 1675691168634,
    },
    {
        description: 'tx description 2 lorem ipsum dolor sit',
        hash: '0x40852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
        status: 'success',
    },
    {
        description: 'tx description 2',
        hash: '0x40852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
        status: 'error',
    },
    {
        description: 'tx description 2',
        hash: '0x40852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
        status: 'success',
    },
    {
        description: 'tx description 2',
        hash: '0x40852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
        status: 'success',
    },
    {
        description: 'tx description 2',
        hash: '0x40852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
        status: 'success',
    },
    {
        description: 'tx description 2',
        hash: '0x40852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
        status: 'success',
    },
    {
        description: 'tx description 2',
        hash: '0x40852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
        status: 'success',
    },
];
</script>

<template>
    <div class="playground_content">
        <div class="playground_example">
            <h2>Default</h2>
            <RecentTransactionListButton />
        </div>
        <div class="playground_example">
            <h2>Transactions</h2>
            <RecentTransactionListButton :transactions="transactions" />
        </div>
    </div>
</template>
