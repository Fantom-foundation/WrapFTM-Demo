<script setup>
import { onBeforeUnmount, ref, watch } from 'vue';
import { processPromisesBatch } from '@/utils/processPromisesBatch/processPromisesBatch.js';
import TokenList from '@/modules/common/components/TokenList/TokenList.vue';

const emit = defineEmits(['token-pick']);

const props = defineProps({
    tokens: {
        type: Array,
        default() {
            return [];
        },
        required: true,
    },
    accountAddress: {
        type: String,
        default: '',
    },
    hideBalance: {
        type: Boolean,
        default: false,
    },
    actions: {
        type: Object,
        default() {
            return {
                /** @type {function():Promise<string|number>} */
                getBalance: null,
            };
        },
    },
});

const rTokens = ref([]);
let stopProcessingPromises = null;

/**
 * @param {string[]} balances
 * @param {number} fromIndex
 */
function updateBalanceBatch({ batchResult: balances, fromIndex }) {
    if (balances && balances.length > 0) {
        balances.forEach((balance, idx) => {
            rTokens.value[fromIndex + idx].balance = balance;
        });
    }
}

async function updateBalances() {
    if (
        props.hideBalance ||
        rTokens.value.length === 0 ||
        !props.accountAddress ||
        typeof props.actions.getBalance !== 'function'
    ) {
        return;
    }

    await processPromisesBatch({
        fns: rTokens.value.map(
            (token) => () =>
                props.actions.getBalance({
                    tokenAddress: token.address,
                    accountAddress: props.accountAddress,
                })
        ),
        batchSize: 4,
        delayMs: 200,
        batchFn: updateBalanceBatch,
        stopFn(stop) {
            stopProcessingPromises = stop;
        },
    });
}

function onTokenPick(token) {
    emit('token-pick', token);
}

onBeforeUnmount(() => {
    if (typeof stopProcessingPromises === 'function') {
        stopProcessingPromises();
    }
});

watch(
    () => props.tokens,
    (tokens) => {
        rTokens.value = tokens;
        updateBalances();
    },
    { immediate: true }
);
</script>

<template>
    <TokenList :tokens="rTokens" :hide-balance="hideBalance" @token-pick="onTokenPick" />
</template>

<style lang="scss">
.tokenlistc {
}
</style>
