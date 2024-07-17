<script setup>
import TokenAmountField from '@/modules/common/components/TokenAmountField/TokenAmountField.vue';
import { FTM_TOKEN } from '@/config/tokens.js';
</script>

<template>
    <div class="playground_content">
        <div class="playground_example">
            <h2>Default</h2>
            <TokenAmountField
                :token="{
                    ...FTM_TOKEN(),
                    balance: '0x6B14E9F9B0DF36A83',
                }"
            />
        </div>

        <div class="playground_example">
            <h2><code>show-token</code></h2>
            <TokenAmountField
                show-token
                label="label"
                :token="{
                    ...FTM_TOKEN(),
                    balance: '0x6B14E9F9B0DF36A83',
                }"
            />
        </div>

        <div class="playground_example">
            <h2><code>show-balance</code></h2>
            <TokenAmountField
                show-balance
                show-token
                label="label"
                :token="{
                    ...FTM_TOKEN(),
                    balance: '0x6B14E9F9B0DF36A83',
                }"
            />
        </div>

        <div class="playground_example">
            <h2><code>show-balance-price</code></h2>
            <TokenAmountField
                show-balance-price
                :token-price="4"
                show-balance
                show-token
                label="label"
                :token="{
                    ...FTM_TOKEN(),
                    balance: '0x6B14E9F9B0DF36A83',
                }"
            />
        </div>

        <div class="playground_example">
            <h2><code>show-max-button</code></h2>
            <TokenAmountField
                show-max-button
                show-balance
                show-token
                label="label"
                :token="{
                    ...FTM_TOKEN(),
                    balance: '0x6B14E9F9B0DF36A83',
                }"
            />
        </div>

        <div class="playground_example">
            <h2><code>subtract-from-max</code></h2>
            <TokenAmountField
                :subtract-from-max="1"
                show-max-button
                show-balance
                show-token
                label="label"
                :token="{
                    ...FTM_TOKEN(),
                    balance: '0x6B14E9F9B0DF36A83',
                }"
            />
        </div>

        <div class="playground_example">
            <h2><code>max-button-label</code></h2>
            <TokenAmountField
                max-button-label="MAX"
                show-max-button
                show-balance
                show-token
                label="label"
                :token="{
                    ...FTM_TOKEN(),
                    balance: '0x6B14E9F9B0DF36A83',
                }"
            />
        </div>

        <div class="playground_example">
            <h2><code>input-token-props</code></h2>
            <TokenAmountField
                :input-token-props="{ noLogo: true }"
                show-token
                label="label"
                :token="{
                    ...FTM_TOKEN(),
                    balance: '0x6B14E9F9B0DF36A83',
                }"
            />
        </div>

        <div class="playground_example">
            <h2><code>balance-token-props</code></h2>
            <TokenAmountField
                :balance-token-props="{ usePlaceholder: true }"
                show-balance
                label="label"
                :token="FTM_TOKEN()"
            />
        </div>

        <div class="playground_example">
            <h2><code>amount-buttons</code></h2>
            <TokenAmountField
                amount-buttons="25%,50%,75%,100%"
                label="label"
                show-balance
                show-token
                :token="{
                    ...FTM_TOKEN(),
                    balance: '0x6B14E9F9B0DF36A83',
                }"
            />
        </div>

        <div class="playground_example">
            <h2><code>show-amount-buttons-at-the-bottom</code></h2>
            <TokenAmountField
                show-amount-buttons-at-the-bottom
                amount-buttons="25%,50%,75%,100%"
                label="label"
                show-balance
                show-token
                :token="{
                    ...FTM_TOKEN(),
                    balance: '0x6B14E9F9B0DF36A83',
                }"
            />
        </div>
    </div>
</template>
