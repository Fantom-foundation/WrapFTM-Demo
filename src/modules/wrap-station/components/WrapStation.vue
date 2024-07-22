<script setup>
/* eslint-disable vue/no-parsing-error */
import WrapStationFormC from '@/modules/wrap-station/components/WrapStationFormC.vue';
import { FTM_TOKEN, WFTM_TOKEN } from '@/config/tokens.js';
import { defer, FCard, FTab, FTabs } from 'fantom-vue3-components';
import { onMounted, ref } from 'vue';
import { useTransactionStore } from '@/modules/transaction/store/store';
import { storeToRefs } from 'pinia';
import { pollTxCount } from '@/modules/wrap-station/verification-methods/pollTxCount';
import { pollReceipt } from '@/modules/wrap-station/verification-methods/pollReceipt';
import {
    listenToTransferEvent,
    subscribeTransferEvent,
    unsubscribeTransferEvent,
} from '@/modules/wrap-station/verification-methods/listenToTransferEvent';
import { queryLog } from '@/modules/wrap-station/verification-methods/queryLog';
import { Log } from '@/modules/wrap-station/components/FLog/Log';
import FLog from '@/modules/wrap-station/components/FLog/FLog.vue';
import { highlightAll } from '@speed-highlight/core';

const { wrap } = storeToRefs(useTransactionStore());
const { methodType } = storeToRefs(useTransactionStore());
const verificationFunc = ref(getFuncByType(methodType.value));
const fromToken = ref({});
const toToken = ref({});
const formKey = ref(1);
const showTabs = ref(false);
const pendingTransaction = ref(false);
const lastMethod = ref('');

setTokens();

function setTokens() {
    if (wrap.value) {
        fromToken.value = FTM_TOKEN();
        toToken.value = WFTM_TOKEN();
    } else {
        fromToken.value = WFTM_TOKEN();
        toToken.value = FTM_TOKEN();
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

function clearLog() {
    Log.clear();

    if (methodType.value === 'subscribetoevent') {
        Log.push('Listening to Transfer event...');
    }
}

function onTabSet(event) {
    methodType.value = event.tabId;
    // clearLog();
    verificationFunc.value = getFuncByType(methodType.value);
}

function onPendingTransaction(pending) {
    pendingTransaction.value = pending;

    if (pending) {
        clearLog();
    }

    lastMethod.value = methodType.value;
}

function onTxSuccess() {
    formKey.value += 1;
    setTokens();
}

onMounted(() => {
    defer(() => {
        showTabs.value = true;

        defer(() => {
            highlightAll();
        });
    });
});
</script>

<template>
    <div class="wrapstation">
        <FTabs
            v-if="showTabs"
            aria-label="transaction verification playground"
            @tab-set="onTabSet"
            :disabled="pendingTransaction"
        >
            <Teleport to="#tv_log">
                <FTab
                    id="polltxcount"
                    :active="methodType === 'polltxcount'"
                    :title="$t('wrapStation.wrapStation.pollNonce')"
                >
                    <p>Using polling method with <code>eth_getTransactionCount</code></p>
                    <FLog v-if="lastMethod === 'polltxcount'" />
                    <h3>Code Samples and Documentation:</h3>
                    <pre class="wrapstation_code shj-lang-js">
export async function pollTxCount({ transaction, delayMs = 100 }) {
    const prevTxCount = parseInt(transaction.nonce, 16);
    const maxTries = 100;
    let currTxCount = prevTxCount;
    let checksCount = 0;

    while (currTxCount === prevTxCount && checksCount < maxTries) {
        currTxCount = parseInt(await getTxCount(transaction.from), 16);
        Log.push(`current tx count: ${currTxCount}, previous tx count: ${prevTxCount}`);
        checksCount += 1;

        await delay(delayMs);
    }

    Log.push('----');
    Log.push('Done');

    return checksCount < maxTries;
}
                    </pre>
                </FTab>
            </Teleport>
            <Teleport to="#tv_log">
                <FTab
                    id="subscribetoevent"
                    :active="methodType === 'subscribetoevent'"
                    :title="$t('wrapStation.wrapStation.subscribeToEvent')"
                >
                    <p>
                        Listening to <code>Transfer</code> event and looking for an event
                        with specific transaction hash
                    </p>
                    <FLog v-if="lastMethod === 'subscribetoevent'" />
                    <h3>Code Samples and Documentation:</h3>
                    <pre class="wrapstation_code shj-lang-js">
function getProvider() {
    if (provider === null) {
        provider = new ethers.providers.WebSocketProvider(chains.defaultChain.wsRpcUrl);
    }

    return provider;
}

export function subscribeTransferEvent() {
    unsubscribeTransferEvent();

    wftmContract = new ethers.Contract(WFTM_TOKEN().address, wftmAbi, getProvider());
    wftmContract.on('Transfer', onTransferEvent);
}

export function unsubscribeTransferEvent() {
    if (wftmContract) {
        wftmContract.removeAllListeners();
        wftmContract = null;
    }
}

function onTransferEvent(from, to, value, event) {
    if (event.transactionHash === txHash) {
        if (typeof onTransferEventDone === 'function') {
            onTransferEventDone(true);
        }

        Log.push(`Transfer event with transaction hash ${txHash} emitted`);
        Log.push('----');
        Log.push('Done');

        txHash = '';
        onTransferEventDone = null;
    }
}

export async function listenToTransferEvent({ transactionHash }) {
    txHash = transactionHash;

    return new Promise((resolve) => {
        onTransferEventDone = resolve;
    });
}
                    </pre>
                </FTab>
            </Teleport>
            <Teleport to="#tv_log">
                <FTab
                    id="pollreceipt"
                    :active="methodType === 'pollreceipt'"
                    :title="$t('wrapStation.wrapStation.pollReceipt')"
                >
                    <p>
                        Using polling method with <code>eth_getTransactionReceipt</code>
                    </p>
                    <FLog v-if="lastMethod === 'pollreceipt'" />
                    <h3>Code Samples and Documentation:</h3>
                    <pre class="wrapstation_code shj-lang-js">
export async function pollReceipt({ transactionHash, delayMs = 100 }) {
    let receipt = await getTransactionReceipt(transactionHash);

    while (receipt === null) {
        receipt = await getTransactionReceipt(transactionHash);
        Log.push(`receipt: ${JSON.stringify(receipt, null, 2)}`);

        await delay(delayMs);
    }

    Log.push('----');
    Log.push('Done');

    return !!receipt;
}
                    </pre>
                </FTab>
            </Teleport>
            <Teleport to="#tv_log">
                <FTab
                    id="querylog"
                    :active="methodType === 'querylog'"
                    :title="$t('wrapStation.wrapStation.queryLog')"
                >
                    <p>
                        Checking event log by calling <code>eth_getLogs</code> and looking
                        for an event with specific transaction hash
                    </p>
                    <FLog v-if="lastMethod === 'querylog'" />
                    <h3>Code Samples and Documentation:</h3>
                    <pre class="wrapstation_code shj-lang-js">
export async function queryLog({ transactionHash, delayMs = 100 }) {
    const provider = rpcProvider.jsonRpcProvider;
    const contract = new ethers.Contract(WFTM_TOKEN().address, wftmAbi, provider);
    const maxTries = 100;
    let checksCount = 0;

    let events = null;
    let found = false;

    while (!found && checksCount < maxTries) {
        const currentBlockNumber = await provider.getBlockNumber();
        events = await contract.queryFilter(
            'Transfer',
            currentBlockNumber - 50,
            currentBlockNumber
        );

        const event = events.find((event) => event.transactionHash === transactionHash);

        found = !!event;

        Log.push(
            `found: ${found}, block: ${event ? event.blockNumber : currentBlockNumber}`
        );

        if (!found) {
            await delay(delayMs);
        }

        checksCount += 1;
    }

    Log.push('----');
    Log.push('Done');

    return found;
}
                    </pre>
                </FTab>
            </Teleport>
        </FTabs>
        <div class="wrapstation_content">
            <div>
                <FCard>
                    <WrapStationFormC
                        :key="formKey"
                        :from-token="fromToken"
                        :to-token="toToken"
                        :verification-func="verificationFunc"
                        @pending-transaction="onPendingTransaction"
                        @tx-success="onTxSuccess"
                    />
                </FCard>
            </div>
            <div>
                <div id="tv_log"></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@use '../../../../node_modules/fantom-vue3-components/src/assets/scss/tools/media';

.wrapstation {
    &_content {
        display: grid;
        grid-template-columns: 1fr 1.6fr;
        gap: var(--f-spacer-5);

        .fcard {
            max-width: 500px;
            //margin: 0 auto var(--f-spacer-9) auto;
        }
    }

    /*
    &_log_title {
        margin-top: 0;
    }
    */

    pre.wrapstation_code {
        font-size: 13px;
        white-space: pre-wrap;
        word-wrap: break-word;
        max-width: calc(100vw - var(--f-spacer-5));
        max-height: 300px;
        overflow: auto;
        padding: var(--f-spacer-3) var(--f-spacer-3);
        background: var(--theme-dark-color-8b);
        border-radius: var(--f-border-radius-3);
    }

    code {
        padding: var(--f-spacer-1) var(--f-spacer-2);
        font-size: 14px;
        background: var(--theme-dark-color-8b);
    }

    .ftabs {
        max-width: calc(100vw - var(--f-spacer-5));
        margin-bottom: var(--f-spacer-2);
    }
}

@include media.media-max(1080px) {
    .wrapstation {
        &_content {
            grid-template-columns: 1fr;

            .fcard {
                margin: 0 auto;
            }
        }

        pre.wrapstation_code {
            white-space: pre;
        }

        .fcard {
            //margin: 0 auto var(--f-spacer-9) auto;
        }
    }
}
</style>
