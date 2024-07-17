<script setup>
import WrapStationFormC from '@/modules/wrap-station/components/WrapStationFormC.vue';
import { FTM_TOKEN, WFTM_TOKEN } from '@/config/tokens.js';
import { FCard } from 'fantom-vue3-components';
import TransactionVerificationPlayground from '@/modules/transaction/components/TransactionVerificationPlayground/TransactionVerificationPlayground.vue';
import { ref } from 'vue';
import { useTransactionStore } from '@/modules/transaction/store/store';
import { storeToRefs } from 'pinia';

const verificationFunc = ref(null);
const pendingTransaction = ref(false);
const fromToken = ref({});
const toToken = ref({});
const formKey = ref(1);
const { wrap } = storeToRefs(useTransactionStore());

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

function onVerificationMethodChange(event) {
    verificationFunc.value = event.verificationFunc;
}

function onPendingTransaction(pending) {
    pendingTransaction.value = pending;
}

function onTxSuccess() {
    formKey.value += 1;
    setTokens();
}
</script>

<template>
    <div class="wrapstation">
        <div>
            <h3>Wrap/Unwrap FTM</h3>
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
            <h3>Ways of checking the completion of a transaction</h3>
            <TransactionVerificationPlayground
                :pending-transaction="pendingTransaction"
                @verification-method-change="onVerificationMethodChange"
            />
        </div>
    </div>
</template>

<style lang="scss">
@use 'fantom-vue3-components/src/assets/scss/tools/media';

.wrapstation {
    display: grid;
    grid-template-columns: 1fr 1.6fr;
    gap: var(--f-spacer-5);

    .fcard {
        max-width: 500px;
        //margin: 0 auto var(--f-spacer-9) auto;
    }
}

@include media.media-max(1080px) {
    .wrapstation {
        grid-template-columns: 1fr;

        .fcard {
            //margin: 0 auto var(--f-spacer-9) auto;
        }
    }
}
</style>
