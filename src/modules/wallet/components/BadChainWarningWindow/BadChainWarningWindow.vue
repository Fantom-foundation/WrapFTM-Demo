<script setup>
import { exposeMethods } from 'fantom-vue3-components/src/utils/exposeMethods/exposeMethods.js';
import { FWindow } from 'fantom-vue3-components';
import { getChainNameById } from '@/plugins/web3-wallets/utils/utils.js';
import { ref } from 'vue';
import AddChainButton from '@/modules/wallet/components/AddChainButton/AddChainButton.vue';
import { chains } from '@/config/chains.js';
// import { useWallet } from '@/modules/wallet/main.js';

defineProps({
    chainId: {
        type: [String, Number],
        default: '',
        required: true,
    },
    web3Wallet: {
        required: true,
    },
    showSwitchChainButton: {
        type: Boolean,
        default: false,
    },
});

// const wallet = useWallet(true).wallet;
const window = ref(null);
const addingChain = ref(false);

function onAddChainButtonAction(action) {
    addingChain.value = action === 'adding-chain';
}

defineExpose(exposeMethods(window, ['show', 'hide', 'isWindowVisible']));
</script>

<template>
    <FWindow
        ref="window"
        modal
        :title="$t('wallet.notification')"
        class="badchainwarningwindow fwindow-width-4 fwindow-nobodytoppadding"
    >
        <p class="tea-center">
            <template v-if="!addingChain">
                {{
                    $t('wallet.badChainWarningWindow.switchChainMessage', {
                        chainName: getChainNameById(chainId),
                    })
                }}
            </template>
            <template v-else>
                {{
                    $t('wallet.badChainWarningWindow.addChainMessage', {
                        chainName: getChainNameById(chainId),
                    })
                }}
            </template>
        </p>
        <div v-if="showSwitchChainButton" class="tea-center">
            <AddChainButton
                :web3-wallet="web3Wallet"
                :chain="chains.get(chainId)"
                switch-chain
                size="large"
                @action="onAddChainButtonAction"
            />
        </div>
    </FWindow>
</template>
