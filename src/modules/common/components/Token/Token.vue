<script setup>
import { FToken } from 'fantom-vue3-components';
import { computed } from 'vue';
import { bFromTokenValue, BigNumber0 } from '@/utils/big-number/big-number.js';
import { appConfig } from '@/config/app-config.js';

const props = defineProps({
    /** @type {{ symbol?: string, logo?: string, logoURL?: string }} */
    token: {
        type: Object,
        default() {
            return {};
        },
    },
    value: {
        type: [Number, String, BigNumber0],
        default: '',
    },
    decimals: {
        type: Number,
        default: 0,
    },
    convert: {
        type: Boolean,
        default: true,
    },
    maximumFractionDigits: {
        type: Number,
        default: appConfig.formats.ftmFractionDigits,
    },
});

const cDecimals = computed(() => props.token?.decimals || props.decimals);
const cValue = computed(() => {
    let value = props.value;

    if (props.convert && cDecimals.value > 0 && value !== '') {
        value = bFromTokenValue(value, cDecimals.value).toNumber();
    }

    return value;
});
</script>

<template>
    <FToken
        class="token"
        :token="token"
        :value="cValue"
        :maximum-fraction-digits="maximumFractionDigits"
        :logo-size="32"
    >
        <!-- copy slots -->
        <template v-for="name in $slots" v-slot:[name]="data">
            <slot :name="name" v-bind="data"> </slot>
        </template>
    </FToken>
</template>

<style lang="scss">
.token {
    &.ftoken {
        --ftoken-symbol-size: 80%;

        .ftoken_value {
            font-weight: bold;
        }

        .ftoken_symbol {
            opacity: var(--f-opacity-5);
        }
    }
}
</style>
