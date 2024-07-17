<script setup>
import { BigNumber0 } from '@/utils/big-number/big-number.js';
import { computed } from 'vue';
import { useWallet } from '@/modules/wallet/composables/useWallet/useWallet.js';
import Token from '@/modules/common/components/Token/Token.vue';
import { FTM_TOKEN } from '@/config/tokens.js';

const props = defineProps({
    gasPrice: {
        type: [String, Number, BigNumber0],
        default: '',
        required: true,
    },
    gasLimit: {
        type: [String, Number, BigNumber0],
        default: '',
        required: true,
    },
    maximumFractionDigits: {
        type: Number,
        default: 7,
    },
});

const wallet = useWallet().wallet;

const transactionFee = computed(() =>
    wallet.getTransactionFee(props.gasPrice, props.gasLimit)
);
</script>

<template>
    <div class="maxfee">
        {{ $t('transaction.maxFee.label') }}:
        <Token
            :token="FTM_TOKEN()"
            convert
            :value="transactionFee"
            :maximum-fraction-digits="maximumFractionDigits"
            no-logo
            use-placeholder
        />
    </div>
</template>

<style lang="scss"></style>
