<script setup>
import { FButton } from 'fantom-vue3-components';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const t = useI18n().t;

const emit = defineEmits(['action']);

const props = defineProps({
    /** @type {Chain} */
    chain: {
        type: Object,
        default() {
            return {};
        },
        required: true,
    },
    web3Wallet: {
        required: true,
    },
    switchChain: {
        type: Boolean,
        default: false,
    },
});

const action = ref('');
const label = computed(() => {
    let label = t('wallet.addChainButton.add', { chainName: props.chain.name });

    if (props.switchChain && action.value !== 'adding-chain') {
        label = t('wallet.addChainButton.switch', {
            chainName: props.chain.name,
        });
    }

    return label;
});

async function addChain(chainId) {
    const web3Wallet = props.web3Wallet;

    if (typeof web3Wallet.addChain === 'function') {
        await performAction('adding-chain', async () => web3Wallet.addChain(chainId));
    }
}

async function _switchChain(chainId) {
    const web3Wallet = props.web3Wallet;

    if (typeof web3Wallet.switchChain === 'function') {
        try {
            await performAction('switching-chain', async () =>
                web3Wallet.switchChain(chainId)
            );
        } catch (error) {
            if (
                error.message.indexOf('Unrecognized chain ID') > -1 ||
                error.message.indexOf('not approved') > -1
            ) {
                await addChain(chainId);
            }
        }
    }
}

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

function onButtonClick() {
    if (!props.switchChain) {
        addChain(props.chain.chainId);
    } else {
        _switchChain(props.chain.chainId);
    }
}

watch(action, (value) => {
    emit('action', value);
});
</script>

<template>
    <FButton
        class="addchainbutton"
        :label="label"
        :disabled="!!action"
        :loading="!!action"
        @click="onButtonClick"
    />
</template>

<style lang="scss">
.addchainbutton {
}
</style>
