<script setup>
import { FForm } from 'fantom-vue3-components';
import GasFields from '@/modules/transaction/components/GasFields/GasFields.vue';

function onUpdateValue(value) {
    console.log('JO!!!', value);
}
</script>
<template>
    <div class="playground_content">
        <FForm>
            <GasFields
                gas-price="0x49504f80"
                gas-limit="0x5208"
                :throttle-input-interval="500"
                @update:value="onUpdateValue"
            />
        </FForm>
    </div>
</template>
