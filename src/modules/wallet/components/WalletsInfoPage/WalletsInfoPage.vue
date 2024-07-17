<script setup>
import LogoutButtonC from '@/modules/wallet/components/LogoutButtonC/LogoutButtonC.vue';
import { getJazzicon, FAddress } from 'fantom-vue3-components';
import { computed } from 'vue';
import { useWallet } from '@/modules/wallet/composables/useWallet/useWallet';
import { getChainNameById } from '@/plugins/web3-wallets/utils/utils';

defineProps({
    accountAddress: {
        type: String,
        default: '',
    },
    oneAccountMode: {
        type: Boolean,
        default: false,
    },
});

const { chainId } = useWallet();
const chainName = computed(() => {
    return getChainNameById(chainId.value);
});
</script>

<template>
    <div
        class="walletsinfopage"
        :class="{ 'walletsinfopage-oneaccountmode': oneAccountMode }"
    >
        <div class="walletsinfopage_section">
            <div
                v-html="getJazzicon(accountAddress, 64)"
                class="faddress_image faddress_jazzicon"
                aria-hidden="true"
                data-testid="jazzicon"
            ></div>
            <FAddress :address="accountAddress" use-copy-button />
            <div class="walletsinfopage_chainname" data-flip-id="chainname">
                {{ chainName }}
            </div>
        </div>
        <LogoutButtonC />
    </div>
</template>

<style lang="scss">
.walletsinfopage {
    --walletsinfopage-border-color: var(--f-color-grey-3);

    display: flex;
    flex-direction: column;

    &_section {
        padding: var(--f-spacer-4);
        border-bottom: 1px solid var(--theme-dark-color-6);
    }

    &_chainname {
        font-size: 0.8em;
        font-weight: normal;
        opacity: 0.7;
        text-align: center;
    }

    .faddress {
        max-width: 200px;
        font-weight: bold;

        &_jazzicon {
            > div {
                margin: 0 auto var(--f-spacer-2) auto !important;
            }
        }
    }
    > .fbutton {
        margin: 0;
        padding-inline-start: var(--f-spacer-4);
        padding-inline-end: var(--f-spacer-4);
        border-radius: 0;
        justify-content: start;
        border-top: 1px solid var(--walletsinfopage-border-color);
    }

    &-oneaccountmode {
        > .fbutton {
            border-top: none;
        }
    }

    .accountlist {
        max-height: 330px;
        overflow: auto;
    }
}
:root.theme-dark {
    .walletsinfopage {
        --walletsinfopage-border-color: var(--theme-dark-color-5);
    }
}
</style>
