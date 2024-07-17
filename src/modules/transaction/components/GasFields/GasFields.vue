<script setup>
import { FFormInput } from 'fantom-vue3-components';
import { BigNumber0, bShiftDP, toHex, toInt } from '@/utils/big-number/big-number.js';
import { ref } from 'vue';
import { greaterThanZeroValidator } from './greater-than-zero-validator/greaterThanZeroValidator.js';
import { useI18n } from 'vue-i18n';

const t = useI18n().t;

const emit = defineEmits(['update:value']);

defineProps({
    gasPrice: {
        type: [String, Number, BigNumber0],
        default: '',
    },
    gasLimit: {
        type: [String, Number, BigNumber0],
        default: '',
    },
    /** Throttle onInput callback interval in milliseconds */
    throttleInputInterval: {
        type: Number,
        default: 0,
    },
});

const gasPriceInput = ref(null);
const gasLimitInput = ref(null);

function validator(value) {
    return greaterThanZeroValidator(value, t('transaction.gasFields.errorMessage'));
}

function gasPriceInFormatter(value) {
    return bShiftDP(value, -9).toNumber();
}

function gasPriceOutFormatter(value) {
    return !validator(value) ? toHex(bShiftDP(value, 9)) : '';
}

function gasLimitInFormatter(value) {
    return toInt(value);
}

function gasLimitOutFormatter(value) {
    return !validator(value) ? toHex(value) : '';
}

function emitUpdateEvent({
    gasPrice = gasPriceInput.value.inputValue,
    gasLimit = gasLimitInput.value.inputValue,
}) {
    if (gasPrice && gasLimit) {
        emit('update:value', { gasPrice, gasLimit });
    }
}

function onGasPriceInput(value) {
    emitUpdateEvent({ gasPrice: value });
}

function onGasLimitInput(value) {
    emitUpdateEvent({ gasLimit: value });
}
</script>

<template>
    <div class="gasfields">
        <FFormInput
            ref="gasPriceInput"
            type="number"
            min="0"
            name="gasPrice"
            field-size="large"
            autocomplete="off"
            validate-on-input
            clas="noinputarrows"
            :validator="validator"
            :model-value="gasPrice"
            :in-formatter="gasPriceInFormatter"
            :out-formatter="gasPriceOutFormatter"
            :throttle-input-interval="throttleInputInterval"
            :label="$t('transaction.gasFields.gasPriceLabel')"
            @update:modelValue="onGasPriceInput"
        />
        <FFormInput
            ref="gasLimitInput"
            type="number"
            min="0"
            name="gasLimit"
            field-size="large"
            autocomplete="off"
            validate-on-input
            clas="noinputarrows"
            :validator="validator"
            :model-value="gasLimit"
            :in-formatter="gasLimitInFormatter"
            :out-formatter="gasLimitOutFormatter"
            :throttle-input-interval="throttleInputInterval"
            :label="$t('transaction.gasFields.gasLimitLabel')"
            @update:modelValue="onGasLimitInput"
        />
    </div>
</template>

<style lang="scss">
.gasfields {
    display: flex;
    gap: var(--f-spacer-3);
}
</style>
