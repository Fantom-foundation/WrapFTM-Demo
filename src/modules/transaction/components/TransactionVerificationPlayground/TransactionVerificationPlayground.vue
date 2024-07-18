<script setup>
import { FTab, FTabs } from 'fantom-vue3-components';
import { computed, onMounted, watch } from 'vue';
import { useTransactionStore } from '@/modules/transaction/store/store';
import { storeToRefs } from 'pinia';
import { Log } from '@/modules/transaction/components/FLog/Log';
import FLog from '@/modules/transaction/components/FLog/FLog.vue';
import { pollTxCount } from '@/modules/transaction/components/TransactionVerificationPlayground/verification-methods/pollTxCount';
import { pollReceipt } from '@/modules/transaction/components/TransactionVerificationPlayground/verification-methods/pollReceipt';
import {
    listenToTransferEvent,
    subscribeTransferEvent,
    unsubscribeTransferEvent,
} from '@/modules/transaction/components/TransactionVerificationPlayground/verification-methods/listenToTransferEvent';
import { queryLog } from '@/modules/transaction/components/TransactionVerificationPlayground/verification-methods/queryLog';

const emit = defineEmits(['verification-method-change']);

const props = defineProps({
    pendingTransaction: {
        type: Boolean,
        default: false,
    },
});

const { methodType } = storeToRefs(useTransactionStore());
const tabsDisabled = computed(() => !!props.pendingTransaction);

function clearLog() {
    Log.clear();

    if (methodType.value === 'subscribetoevent') {
        Log.push('Listening to Transfer event...');
    }
}

function getFuncByType(type) {
    let func = null;

    if (type === 'polltxcount') {
        func = pollTxCount;
    } else if (type === 'pollreceipt') {
        func = pollReceipt;
    } else if (type === 'subscribetoevent') {
        func = listenToTransferEvent;
    } else if (type === 'querylog') {
        func = queryLog;
    }

    if (func === listenToTransferEvent) {
        subscribeTransferEvent();
    } else {
        unsubscribeTransferEvent();
    }

    return func;
}

function emitVerificationMethodChange() {
    emit('verification-method-change', {
        methodType: methodType.value,
        verificationFunc: getFuncByType(methodType.value),
    });
}

function onTabSet(event) {
    methodType.value = event.tabId;

    clearLog();
    emitVerificationMethodChange();
}

watch(
    () => props.pendingTransaction,
    (pending) => {
        if (pending) {
            clearLog();
        }
    }
);

onMounted(() => {
    emitVerificationMethodChange();
    clearLog();
});
</script>

<template>
    <div class="transactionverificationplayground">
        <FTabs
            aria-label="transaction verification playground"
            data-testid="tvp_tabs"
            @tab-set="onTabSet"
            :disabled="tabsDisabled"
        >
            <FTab
                id="polltxcount"
                :active="methodType === 'polltxcount'"
                :title="$t('transaction.transactionVerificationPlayground.pollNonce')"
            >
                <p>Using polling method with <code>eth_getTransactionCount</code></p>
                <FLog />
            </FTab>
            <FTab
                id="subscribetoevent"
                :active="methodType === 'subscribetoevent'"
                :title="
                    $t('transaction.transactionVerificationPlayground.subscribeToEvent')
                "
            >
                <p>
                    Listening to <code>Transfer</code> event and looking for an event with
                    specific transaction hash
                </p>
                <FLog />
            </FTab>
            <FTab
                id="pollreceipt"
                :active="methodType === 'pollreceipt'"
                :title="$t('transaction.transactionVerificationPlayground.pollReceipt')"
            >
                <p>Using polling method with <code>eth_getTransactionReceipt</code></p>
                <FLog />
            </FTab>
            <FTab
                id="querylog"
                :active="methodType === 'querylog'"
                :title="$t('transaction.transactionVerificationPlayground.queryLog')"
            >
                <p>
                    Checking event log by calling <code>eth_getLogs</code> and looking for
                    an event with specific transaction hash
                </p>
                <FLog />
            </FTab>
        </FTabs>
    </div>
</template>

<style lang="scss">
.transactionverificationplayground {
    code {
        padding: var(--f-spacer-1) var(--f-spacer-2);
        font-size: 14px;
        background: var(--theme-dark-color-8b);
    }

    .ftabs {
        max-width: calc(100vw - var(--f-spacer-5));
    }
}
</style>
