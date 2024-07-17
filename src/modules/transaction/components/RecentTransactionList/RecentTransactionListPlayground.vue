<script setup>
import RecentTransactionList from './RecentTransactionList.vue';

function TRANSACTIONS() {
    return [
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
        },
        {
            hash: '0x80852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
            description: 'tx description 3',
            status: 'rejected',
        },
        {
            hash: '0x10852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
            description: 'tx description 4',
            status: 'error',
        },
    ];
}
</script>

<template>
    <div class="playground_content">
        <div class="playground_example">
            <h2>Default</h2>
            <RecentTransactionList />
        </div>

        <div class="playground_example">
            <h2>Transactions</h2>
            <RecentTransactionList :transactions="TRANSACTIONS()" />
        </div>
    </div>
</template>
