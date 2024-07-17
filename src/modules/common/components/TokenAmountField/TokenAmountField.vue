<script setup>
import {
    FInput,
    FToken,
    FLabel,
    FActionButtons,
    useFormatters,
} from 'fantom-vue3-components';
import { computed, watch } from 'vue';
import Token from '@/modules/common/components/Token/Token.vue';
import { ref } from 'vue';
import {
    bFromTokenValue,
    bFromWei,
    bToTokenValue,
    toHex,
} from '@/utils/big-number/big-number.js';
import { amountValidator } from '@/modules/common/components/TokenAmountField/amount-validator/amountValidator.js';
import { useI18n } from 'vue-i18n';
import { tokenAmountFieldPropDefaults as defaults } from './prop-defaults.js';

const t = useI18n().t;
const { formatters } = useFormatters();

const emit = defineEmits(['validation-state', 'update:value', 'token-pick']);

const props = defineProps({
    /** @type {{ symbol?: string, logo?: string, balance: string, decimals?: number }} */
    token: {
        type: Object,
        default() {
            return {};
        },
        required: true,
    },
    maxButtonLabel: {
        type: String,
        default: defaults.maxButtonLabel,
    },
    /** Percentages separated by commas. Eg. '25%, 50%, 100%' */
    amountButtons: {
        type: String,
        default: '',
    },
    /** Emitted value is converted to hex in token decimals */
    convertOutput: {
        type: Boolean,
        default: defaults.convertOutput,
    },
    /** Show logo and symbol */
    showToken: {
        type: Boolean,
        default: defaults.showToken,
    },
    showBalance: {
        type: Boolean,
        default: defaults.showBalance,
    },
    showBalancePrice: {
        type: Boolean,
        default: defaults.showBalancePrice,
    },
    showMaxButton: {
        type: Boolean,
        default: defaults.showMaxButton,
    },
    showAmountButtonsAtTheBottom: {
        type: Boolean,
        default: defaults.showAmountButtonsAtTheBottom,
    },
    disabled: {
        type: Boolean,
        default: defaults.disabled,
    },
    noValidation: {
        type: Boolean,
        default: defaults.noValidation,
    },
    /** Don't validate max amount */
    noMaxValidation: {
        type: Boolean,
        default: defaults.noMaxValidation,
    },
    subtractFromMax: {
        type: Number,
        default: defaults.subtractFromMax,
    },
    inputTokenProps: {
        type: Object,
        default() {
            return defaults.inputTokenProps;
        },
    },
    balanceTokenProps: {
        type: Object,
        default() {
            return defaults.balanceTokenProps;
        },
    },
    tokenPrice: {
        type: Number,
        default: defaults.tokenPrice,
    },
    /** Size of input, 'large' | 'small' */
    fieldSize: {
        type: String,
        default: defaults.fieldSize,
    },
    /** Css class to be added to the root element */
    clas: {
        type: String,
        default: defaults.clas,
    },
    inputTokenComponent: {
        default: FToken,
    },
});

const input = ref(null);
const rToken = ref(props.token);
let resetingValidation = false;

const logoSize = computed(() => {
    const { fieldSize } = props;
    let size = 20;

    if (fieldSize === 'large') {
        size = 28;
    } else if (fieldSize === 'small') {
        size = 16;
    }

    return size;
});

const buttonSize = computed(() => {
    const { fieldSize } = props;
    let size = 'small';

    if (fieldSize === 'small' || fieldSize === 'mini') {
        size = 'mini';
    }

    return size;
});

const balance = computed(() => getTokenBalance(rToken.value));
const balancePrice = computed(() => {
    return formatters.currency(
        bFromWei(rToken.value.balance).multipliedBy(props.tokenPrice).toNumber()
    );
});

const cAmountButtons = computed(() => {
    let buttons = [];

    if (props.showMaxButton) {
        buttons = getAmountButtonsFromPercentages('100%');
    } else if (props.amountButtons) {
        buttons = getAmountButtonsFromPercentages(props.amountButtons);
    }

    return buttons;
});

function validator(amount) {
    if (props.noValidation || resetingValidation) {
        return '';
    }

    return amountValidator({
        amount,
        maxAmount: balance.value - props.subtractFromMax,
        maxAmountErrorMessage: !props.noMaxValidation
            ? t('common.tokenAmountField.maximumAmountReached')
            : '',
        invalidAmountErrorMessage: t('common.tokenAmountField.invalidAmount'),
    });
}

function getTokenDecimals(token) {
    return token.decimals || 18;
}

/**
 * @param {Object} token
 * @return {number}
 */
function getTokenBalance(token) {
    return bFromTokenValue(token.balance, getTokenDecimals(token)).toNumber();
}

function convertToTokenValue(value) {
    let val;

    // max
    if (Number(value) === balance.value) {
        val = rToken.value.balance;
    } else {
        val = toHex(bToTokenValue(value, getTokenDecimals(rToken.value)));
    }

    return val;
}

function resetValidation() {
    resetingValidation = true;
    input.value.validate();
    resetingValidation = false;
}

function getAmountButtonsFromPercentages(percetnages) {
    const _percentages = percetnages
        .split(',')
        .map((value) => parseInt(value))
        .filter((value) => !isNaN(value) && value >= 0 && value <= 100);

    return _percentages.map((p) => {
        let label = `${p}%`;

        if (p === 100) {
            label = props.maxButtonLabel || t('common.tokenAmountField.max');
        }

        return {
            action: `amount_${p}`,
            label,
            size: buttonSize.value,
            quaternary: true,
        };
    });
}

function onValueUpdate(value) {
    let val = value;

    if (validator(val) === '') {
        if (props.convertOutput) {
            val = convertToTokenValue(val);
        }

        emit('update:value', val);
    }
}

function onAmountButtonAction(action) {
    const percentage = parseInt(action.split('_')[1]);
    let amount = balance.value;

    if (!isNaN(percentage) && amount > 0) {
        if (percentage === 100) {
            amount -= props.subtractFromMax;
        }

        amount = amount * (percentage / 100);
        input.value.setInputValue(amount);
        onValueUpdate(amount);
        input.value.validate();
        // validate();
    }
}

function onTokenPick(token) {
    rToken.value = token;
    emit('token-pick', token);
}

watch(
    () => props.token,
    (token) => {
        rToken.value = token;
    }
);

defineExpose({
    convertToTokenValue,
    validate() {
        return input.value.validate();
    },
    setInputValue(value) {
        input.value.setInputValue(value);
    },
    resetValidation,
});
</script>

<template>
    <FInput
        ref="input"
        :clas="`tokenamountfield ${clas}`"
        type="number"
        min="0"
        validate-on-input
        :validator="validator"
        :field-size="fieldSize"
        :disabled="disabled"
        @validation-state="$emit('validation-state', $event)"
        @update:value="onValueUpdate"
    >
        <!-- copy slots -->
        <template v-for="name in $slots" v-slot:[name]="data">
            <slot :name="name" v-bind="data"> </slot>
        </template>

        <template #top="{ labeledById, label, required }">
            <span class="tokenamountfield_top">
                <FLabel native :id="labeledById" :required="required">{{ label }}</FLabel>
                <span v-if="showBalance">
                    <Token
                        :value="rToken.balance"
                        :decimals="getTokenDecimals(rToken)"
                        :symbol="rToken.symbol"
                        :name="rToken.name"
                        no-logo
                        __no-symbol
                        __show-name
                        :use-placeholder="false"
                        v-bind="balanceTokenProps"
                        class="tokenamountfield_balance"
                        data-testcode="tokenamountfield_balance"
                    />
                    <span v-if="showBalancePrice" class="tokenamountfield_balanceprice">
                        ({{ balancePrice }})
                    </span>
                </span>
            </span>
        </template>

        <template #suffix>
            <FActionButtons
                v-if="!showAmountButtonsAtTheBottom"
                :buttons="cAmountButtons"
                :disabled="disabled"
                @button-action="onAmountButtonAction"
            />
            <Component
                :is="inputTokenComponent"
                v-if="showToken"
                class="ftoken-novalue"
                :symbol="rToken.symbol"
                :logo="rToken.logo"
                :logo-size="logoSize"
                :token="rToken"
                v-bind="inputTokenProps"
                @token-pick="onTokenPick"
                data-testcode="tokenamountfield_input_token"
            />
        </template>

        <template #bottom2>
            <FActionButtons
                v-if="showAmountButtonsAtTheBottom"
                class="tokenamountfield_bottombuttons"
                data-testcode="tokenamountfield_bottom_buttons"
                :buttons="cAmountButtons"
                :disabled="disabled"
                @button-action="onAmountButtonAction"
            />
        </template>
    </FInput>
</template>

<style lang="scss">
@use '~fantom-vue3-components/src/assets/scss/tools';

.tokenamountfield {
    @include tools.no-input-arrows;

    &_top {
        display: flex;
        justify-content: space-between;
    }

    &_balance {
        font-size: var(--f-font-size-3);

        .token.ftoken .ftoken_value {
            font-weight: normal !important;
        }
    }

    &_balanceprice {
        font-size: var(--f-font-size-2);
        opacity: var(--f-opacity-7);
    }

    &_bottombuttons {
        padding-top: var(--f-spacer-2);
        justify-content: start;

        > * {
            flex: 1;
        }
    }

    .flabel {
        display: inline-block;
    }

    .ftoken {
        --ftoken-logo-gap: var(--f-spacer-2);
    }

    .tokenpicker {
        &.btn {
            --f-btn-lg-padding: var(--f-spacer-2) var(--f-spacer-2);
        }
    }

    .factionbuttons {
        flex-wrap: initial;
    }
}
</style>
