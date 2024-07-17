<script setup>
import { FButton, FAddress } from 'fantom-vue3-components';

defineProps({
    address: {
        type: String,
        default: '',
    },
    subText: {
        type: String,
        default: '',
    },
    placeholderText: {
        type: String,
        default: '',
    },
});
</script>

<template>
    <FButton
        secondary
        size="large"
        data-testid="wallet_button"
        class="walletbutton"
        :aria-label="`${$t('wallet.walletButton.activeAccount')} ${address}`"
    >
        <template v-if="address">
            <FAddress
                :address="address"
                use-jazzicon
                :image-size="32"
                data-testid="wallet_address"
            >
                <template #suffix>
                    <span class="walletbutton_subtext" data-testid="wallet_subtext">{{
                        subText
                    }}</span>
                </template>
            </FAddress>
        </template>
        <template v-else>
            {{ placeholderText }}
        </template>
    </FButton>
</template>

<style lang="scss">
.walletbutton {
    //padding-top: var(--f-spacer-1);
    //padding-bottom: var(--f-spacer-1);
    //padding: var(--f-spacer-1) var(--f-spacer-2);

    &_subtext {
        position: absolute;
        left: 38px;
        //bottom: 0;
        bottom: calc(var(--f-spacer-1) * -1);
        font-size: 0.8em;
    }

    .faddress {
        position: relative;
        max-width: 200px;
        margin: calc(-1 * var(--f-spacer-3)) calc(-1 * var(--f-spacer-4));

        .left-chars,
        .right-chars {
            margin-top: calc(var(--f-spacer-3) * -1);
        }
    }
    /*.faddress {
        display: block;

        &_jazzicon {
            margin-top: 0;
        }
    }*/
}
</style>
