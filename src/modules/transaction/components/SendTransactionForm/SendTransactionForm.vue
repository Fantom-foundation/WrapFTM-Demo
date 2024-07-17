<script setup>
import {
    FForm,
    FDetails,
    FFormInput,
    FActionButtons,
    FAddress,
} from 'fantom-vue3-components';
import GasFields from '@/modules/transaction/components/GasFields/GasFields.vue';
import MaxFee from '@/modules/transaction/components/MaxFee/MaxFee.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { FTM_TOKEN } from '@/config/tokens.js';
import Token from '@/modules/common/components/Token/Token.vue';

const t = useI18n().t;

const emit = defineEmits(['submit', 'button-action']);

const props = defineProps({
    /** @type {Transaction} */
    transaction: {
        type: Object,
        default() {
            return {};
        },
        required: true,
    },
    showPasswordField: {
        type: Boolean,
        default: false,
    },
    showAdvancedFunctions: {
        type: Boolean,
        default: false,
    },
    submitButtonLabel: {
        type: String,
        default: '',
    },
    passwordLabel: {
        type: String,
        default: '',
    },
    passwordValidator: {
        type: Function,
        default: null,
    },
    passwordLabelAsPlaceholder: {
        type: Boolean,
        default: false,
    },
    /** Throttle onInput callback interval in milliseconds */
    throttleInputInterval: {
        type: Number,
        default: 500,
    },
    buttons: {
        type: Array,
        default() {
            return [];
        },
    },
});

const gasPrice = ref(props.transaction?.gasPrice);
const gasLimit = ref(props.transaction?.gasLimit);
const buttons = ref(
    props.buttons.length > 0
        ? props.buttons
        : [
              {
                  label: props.submitButtonLabel || t('transaction.submit'),
                  action: 'submit',
                  type: 'submit',
                  size: 'large',
              },
          ]
);

const cPasswordLabel = computed(
    () => props.passwordLabel || t('transaction.sendTransactionForm.passwordLabel')
);

function requiredValidator(value) {
    return !value.trim() ? t('transaction.sendTransactionForm.required') : '';
}

function onGasFieldsUpdate(values) {
    gasPrice.value = values.gasPrice;
    gasLimit.value = values.gasLimit;
}

function onSubmit(event) {
    emit('submit', { ...props.transaction, ...event.values });
}
</script>

<template>
    <FForm class="sendtransactionform grid" @submit="onSubmit" v-slot="formProps">
        <slot v-bind="formProps"></slot>
        <div class="sendtransactionform_addresses">
            <FAddress :address="transaction.from" use-jazzicon />
            <span>&rarr;</span>
            <FAddress :address="transaction.to" use-jazzicon />
        </div>
        <div class="sendtransactionform_amount">
            {{ $t('transaction.sendTransactionForm.amount') }}:
            <Token :value="transaction.value" :token="FTM_TOKEN()" no-logo />
        </div>
        <MaxFee :gas-price="gasPrice" :gas-limit="gasLimit" />
        <FFormInput
            v-if="showPasswordField"
            name="password"
            type="passwordfield"
            :label="!passwordLabelAsPlaceholder ? cPasswordLabel : null"
            :placeholder="passwordLabelAsPlaceholder ? cPasswordLabel : null"
            :validator="passwordValidator || requiredValidator"
            field-size="large"
            class="input-w100"
        />
        <!--        <MaxFee :gas-price="gasPrice" :gas-limit="gasLimit" />-->
        <FDetails
            v-if="showAdvancedFunctions"
            label="Advanced functions"
            animate
            class="fdetails-flat"
        >
            <GasFields
                :gas-price="gasPrice"
                :gas-limit="gasLimit"
                @update:value="onGasFieldsUpdate"
                :throttle-input-interval="throttleInputInterval"
            />
        </FDetails>
        <FActionButtons
            :buttons="buttons"
            :disabled="formProps.disabled"
            @button-action="$emit('button-action', $event)"
        />
    </FForm>
</template>

<style lang="scss">
.sendtransactionform {
    &_addresses {
        display: flex;
        justify-content: space-between;

        .faddress {
            max-width: 42%;
        }
    }

    &_amount {
        .ftoken {
            &_value {
                font-size: var(--f-font-size-6);
            }
        }
    }

    .fdetails {
        opacity: var(--f-opacity-5);

        &-open {
            opacity: 1;
        }
    }
}
</style>
