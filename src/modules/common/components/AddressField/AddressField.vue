<script setup>
import { FInput } from 'fantom-vue3-components';
import { addressValidator } from './address-validator/addressValidator.js';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const t = useI18n().t;

const props = defineProps({
    addressResolver: {
        type: Function,
        default: null,
    },
});

const emit = defineEmits(['validation-state', 'update:value']);

const infoText = ref('');
const input = ref(null);

function validator(address) {
    return addressValidator(address, t('common.addressField.invalidAddressErrMessage'));
}

function onValueUpdate(value) {
    if (typeof props.addressResolver === 'function') {
        const valueIsAddress = !addressValidator(value);
        const result = props.addressResolver(value, valueIsAddress);

        if (valueIsAddress) {
            infoText.value = result.name || '';
        } else {
            if (result.address) {
                input.value.setInputValue(result.address);
                infoText.value = value;
            } else {
                infoText.value = '';
            }
        }
    }

    emit('update:value', value);
}

defineExpose({
    validate() {
        return input.value.validate();
    },
});
</script>

<template>
    <FInput
        ref="input"
        class="addressfield"
        validate-on-input
        :validator="validator"
        :info-text="infoText"
        :throttle-input-interval="400"
        @validation-state="$emit('validation-state', $event)"
        @update:value="onValueUpdate"
    >
        <!-- copy slots -->
        <template v-for="name in $slots" v-slot:[name]="data">
            <slot :name="name" v-bind="data"> </slot>
        </template>
    </FInput>
</template>

<style lang="scss"></style>
