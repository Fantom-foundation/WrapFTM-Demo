<script setup>
import WrapStationForm from './WrapStationForm.vue';
import { FTM_TOKEN, WFTM_TOKEN } from '@/config/tokens.js';
import { ref } from 'vue';
import { FCard } from 'fantom-vue3-components';

const submitData = ref({});

function onSubmit(values) {
    submitData.value = values;
}
</script>

<template>
    <div class="playground_content">
        <div class="playground_example">
            <h2>Default</h2>
            <WrapStationForm
                :from-token="FTM_TOKEN()"
                from-token-balance="0x1BC16D674EC80000"
                :to-token="WFTM_TOKEN()"
                to-token-balance="0x4563918244F40000"
                @submit="onSubmit"
            />
        </div>

        <FCard class="playground_example">
            on submit:
            <pre class="tes-3">{{ submitData }}</pre>
        </FCard>
    </div>
</template>
