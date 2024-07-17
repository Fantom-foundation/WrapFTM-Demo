<script setup>
import TransactionNotification from './TransactionNotification.vue';
import { TEST_TRANSACTION_HASH } from '@/plugins/web3-wallets/test-helpers.js';
</script>

<template>
    <div class="playground_content">
        <div class="playground_example">
            <h2>
                <code>description="Send Opera FTM"</code><br />
                <code>transaction-status="{ status: 'pending' }"</code>
            </h2>
            <TransactionNotification
                description="Send Opera FTM"
                :transaction-status="{ status: 'pending' }"
            />
        </div>

        <div class="playground_example">
            <h2>
                <code>hash="{{ TEST_TRANSACTION_HASH.slice(0, 10) }}..."</code><br />
            </h2>
            <TransactionNotification
                description="Send Opera FTM"
                :hash="TEST_TRANSACTION_HASH"
                :transaction-status="{ status: 'pending' }"
            />
        </div>

        <div class="playground_example">
            <h2>
                <code>transaction-status="{ status: 'success' }"</code>
            </h2>
            <TransactionNotification
                description="Send Opera FTM"
                :hash="TEST_TRANSACTION_HASH"
                :transaction-status="{ status: 'success' }"
            />
        </div>

        <div class="playground_example">
            <h2>
                <code>transaction-status="{ status: 'error' }"</code>
            </h2>
            <TransactionNotification
                description="Send Opera FTM"
                :hash="TEST_TRANSACTION_HASH"
                :transaction-status="{ status: 'error' }"
            />
        </div>

        <div class="playground_example">
            <h2>
                <code>transaction-status="{ status: 'rejected' }"</code>
            </h2>
            <TransactionNotification
                description="Send Opera FTM"
                :hash="TEST_TRANSACTION_HASH"
                :transaction-status="{ status: 'rejected' }"
            />
        </div>
    </div>
</template>
