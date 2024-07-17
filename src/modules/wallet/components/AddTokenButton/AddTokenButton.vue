<script setup>
import { FButton } from 'fantom-vue3-components';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    /** @type {FToken} */
    token: {
        type: Object,
        default() {
            return {};
        },
        required: true,
    },
    web3Wallet: {
        required: true,
    },
    useSymbol: {
        type: Boolean,
        default: false,
    },
});

const t = useI18n().t;
const action = ref('');
const buttonLabel = computed(() => {
    const { token } = props;

    return t('wallet.addTokenButton.add', {
        tokenName: props.useSymbol ? token?.symbol : token?.name,
    });
});

async function performAction(actionName, callback) {
    try {
        action.value = actionName;
        await callback();
        action.value = '';
    } catch (error) {
        action.value = '';

        throw error;
    }
}

async function addToken(token) {
    const web3Wallet = props.web3Wallet;

    if (typeof web3Wallet?.addToken === 'function') {
        await performAction('adding-token', async () =>
            web3Wallet.addToken({
                address: token.address,
                symbol: token.symbol,
                decimals: token.decimals,
                image: token.image || token.logo || token.logoURL,
            })
        );
    }
}

function onButtonClick() {
    addToken(props.token);
}

defineExpose({
    addToken,
});
</script>

<template>
    <FButton
        class="addtokenbutton"
        :label="buttonLabel"
        :disabled="!!action"
        :loading="!!action"
        @click="onButtonClick"
    />
</template>

<style lang="scss">
.addtokenbutton {
}
</style>
