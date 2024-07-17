<script setup>
import TransactionStatus from './TransactionStatus.vue';
</script>

<template>
    <div class="playground_content">
        <div class="playground_example">
            <h2>Default</h2>
            <TransactionStatus />
        </div>

        <div class="playground_example">
            <h2><code>status="pending"</code></h2>
            <TransactionStatus status="pending" />
        </div>

        <div class="playground_example">
            <h2><code>status="success"</code></h2>
            <TransactionStatus status="success" />
        </div>

        <div class="playground_example">
            <h2><code>status="error"</code></h2>
            <TransactionStatus status="error" />
        </div>

        <div class="playground_example">
            <h2><code>status="rejected"</code></h2>
            <TransactionStatus status="rejected" />
        </div>

        <div class="playground_example">
            <h2><code>no-icon</code></h2>
            <TransactionStatus no-icon status="success" />
        </div>

        <div class="playground_example">
            <h2><code>no-text</code></h2>
            <TransactionStatus no-text status="success" />
        </div>

        <div class="playground_example">
            <h2><code>icon-props</code></h2>
            <TransactionStatus :icon-props="{ size: '48px' }" status="success" />
        </div>
    </div>
</template>
