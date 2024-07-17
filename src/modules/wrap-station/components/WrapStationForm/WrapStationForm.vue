<script setup>
import { FForm, FFormInput, FButton, objectEquals } from 'fantom-vue3-components';
import TokenAmountField from '@/modules/common/components/TokenAmountField/TokenAmountField.vue';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppIconset from '@/modules/common/components/AppIconset/AppIconset.vue';
import { SUBTRACT_FTM_AMOUNT } from '@/modules/app/constants/index.js';
import { tokenHasSymbol } from '@/utils/token/token.js';
import { useWalletPickerWindow } from '@/modules/wallet/composables/useWalletPickerWindow/useWalletPickerWindow.js';

const emit = defineEmits(['submit', 'swap']);

const props = defineProps({
    /** @type {{ symbol?: string, logo?: string, balance: string, decimals?: number }} */
    fromToken: {
        type: Object,
        default() {
            return {};
        },
    },
    /** @type {{ symbol?: string, logo?: string, balance: string, decimals?: number }} */
    toToken: {
        type: Object,
        default() {
            return {};
        },
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    subtractFtmAmount: {
        type: Number,
        default: SUBTRACT_FTM_AMOUNT,
    },
});

const t = useI18n().t;
const { show: showWalletPickerWindow } = useWalletPickerWindow();

const fromValue = ref(0);
const toValue = ref(0);
const rFromToken = ref({});
const rToToken = ref({});
const fromTokenAmountField = ref(null);
const toTokenAmountField = ref(null);
const subtractFromMax = ref(0);

const submitButtonLabel = computed(() => {
    let label = t('wrapStation.wrapStationForm.submit');

    if (tokenHasSymbol(rFromToken.value, 'FTM')) {
        label = t('wrapStation.wrapStationForm.wrap');
    } else if (tokenHasSymbol(rFromToken.value, 'wFTM')) {
        label = t('wrapStation.wrapStationForm.unwrap');
    }

    return label;
});

function swapTokens() {
    if (props.disabled) {
        return;
    }

    const fromTokenValue = rFromToken.value;

    rFromToken.value = rToToken.value;
    rToToken.value = fromTokenValue;

    setSubtractFromMax();

    resetInputFields();

    emit('swap');
    /*
    const inputRef = fromTokenAmountField.value.$refs.input;
    if (inputRef.$refs.input.value !== '') {
        nextTick(() => {
            inputRef.validate();
        });
    }
*/
}

function getValues(values) {
    return {
        tokenAmount: fromTokenAmountField.value.$refs.input.convertToTokenValue(
            values.fromTokenAmount
        ),
        fromToken: {
            ...rFromToken.value,
            balance: undefined,
        },
        toToken: {
            ...rToToken.value,
            balance: undefined,
        },
    };
}

function setSubtractFromMax() {
    if (tokenHasSymbol(rFromToken.value, 'FTM')) {
        subtractFromMax.value = props.subtractFtmAmount;
    } else {
        subtractFromMax.value = 0;
    }
}

function resetInputFields() {
    fromTokenAmountField.value.$refs.input.setInputValue('');
    toTokenAmountField.value.$refs.input.setInputValue('');
}

function onSubmit(event) {
    emit('submit', getValues(event.values));
}

function onFromTokenAmount(value) {
    toValue.value = value;
}

function onToTokenAmount(value) {
    fromValue.value = value;
}

function onSwapButtonClick() {
    swapTokens();
}

function onSubmitButtonClick() {
    if (props.disabled) {
        showWalletPickerWindow();
    }
}

watch(
    () => props.fromToken,
    (value, oldValue) => {
        if (!objectEquals(value, oldValue)) {
            rFromToken.value = value;
            setSubtractFromMax();
        }
    },
    { immediate: true }
);

watch(
    () => props.toToken,
    (value, oldValue) => {
        if (!objectEquals(value, oldValue)) {
            rToToken.value = value;
        }
    },
    { immediate: true }
);

defineExpose({
    resetInputFields,
});
</script>

<template>
    <FForm class="wrapstationform grid" @submit="onSubmit">
        <FFormInput
            ref="fromTokenAmountField"
            :type="TokenAmountField"
            :token="rFromToken"
            :model-value="fromValue"
            name="fromTokenAmount"
            :label="$t('wrapStation.wrapStationForm.from')"
            :subtract-from-max="subtractFromMax"
            show-balance
            show-amount-buttons-at-the-bottom
            amount-buttons="25%,50%,75%,100%"
            show-token
            @update:value="onFromTokenAmount"
            data-testid="wrap_station_form_from_token"
        />
        <div class="wrapstationform_swapbutton">
            <FButton
                :title="$t('wrapStation.wrapStationForm.swapTokens')"
                :disabled="disabled"
                data-testid="swap_button"
                @click="onSwapButtonClick"
                tertiary
                round
            >
                <AppIconset icon="rightLeft" rotate="90deg" size="20px" />
            </FButton>
        </div>
        <FFormInput
            ref="toTokenAmountField"
            :type="TokenAmountField"
            :token="rToToken"
            :model-value="toValue"
            name="toTokenAmount"
            :label="$t('wrapStation.wrapStationForm.to')"
            show-balance
            show-token
            no-max-validation
            @update:value="onToTokenAmount"
            data-testid="wrap_station_form_to_token"
        />
        <div class="fform_buttons">
            <FButton
                type="submit"
                size="large"
                :label="submitButtonLabel"
                :loading="loading"
                @click="onSubmitButtonClick"
                data-testid="submit_button"
            />
        </div>
    </FForm>
</template>

<style lang="scss">
.wrapstationform {
    &_swapbutton {
        text-align: center;
    }
}
</style>
