<script setup>
import SendTransactionForm from '@/modules/transaction/components/SendTransactionForm/SendTransactionForm.vue';
import { TRANSACTION } from '@/plugins/web3-wallets/test-helpers.js';
import { ref } from 'vue';
import { FFormInput, FCard } from 'fantom-vue3-components';

const transaction = ref(TRANSACTION());
const submitData = ref({});

function onSubmit(values) {
    submitData.value = values;
}
</script>

<template>
    <div class="playground_content">
        <div class="playground_example">
            <h2>Default</h2>
            <SendTransactionForm :transaction="transaction" @submit="onSubmit" />
        </div>

        <div class="playground_example">
            <h2>Slot</h2>
            <SendTransactionForm
                :transaction="transaction"
                show-password-field
                show-advanced-functions
                @submit="onSubmit"
            >
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem
                    ducimus libero numquam recusandae! Eligendi est eum fugit hic illum
                    minus numquam quo sit. Deleniti, fugiat, laborum? Accusamus beatae
                    necessitatibus nobis.
                </p>
                <FFormInput
                    type="text"
                    name="koko"
                    :validator="(value) => (value === '111' ? '' : 'Enter: 111')"
                    field-size="large"
                />
            </SendTransactionForm>
        </div>

        <div class="playground_example">
            <h2>Disabled</h2>
            <SendTransactionForm
                disabled
                :transaction="transaction"
                @submit="onSubmit"
                v-slot="formProps"
            >
                <div>
                    form props:
                    <pre class="tes-3">{{ formProps }}</pre>
                </div>
                <FFormInput
                    type="text"
                    name="koko"
                    :validator="(value) => (value === '111' ? '' : 'Enter: 111')"
                    field-size="large"
                />
            </SendTransactionForm>
        </div>

        <FCard class="playground_example">
            on submit:
            <pre class="tes-3">{{ submitData }}</pre>
        </FCard>
    </div>
</template>
