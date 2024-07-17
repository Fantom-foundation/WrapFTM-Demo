<script setup>
import { ref, watch } from 'vue';
import { FComboBox, useFormatters } from 'fantom-vue3-components';
import { getCurrency } from '@/modules/app/store/store.js';

defineProps({
    currencies: {
        type: Array,
        default() {
            return [];
        },
        required: true,
    },
});

const currency = getCurrency();
const selectedCurrency = ref(currency.value);
const formatters = useFormatters().formatters;

watch(selectedCurrency, (value) => {
    currency.value = value;
    formatters.setDefaulCurrency(value);
});
</script>

<template>
    <FComboBox
        select-mode
        :data="currencies"
        v-model:value="selectedCurrency"
        class="currencyselector"
    />
</template>

<style lang="scss">
.currencyselector {
}
</style>
