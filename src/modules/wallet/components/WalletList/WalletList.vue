<script setup>
import { clone, FListbox } from 'fantom-vue3-components';
import AppIconset from '@/modules/common/components/AppIconset/AppIconset.vue';
// import InfoPopover from '@/modules/common/components/InfoPopover/InfoPopover.vue';
// import { ref } from 'vue';

defineProps({
    /** @type {Wb3[]} */
    wallets: {
        type: Array,
        default() {
            return [];
        },
    },
});

// events
const emit = defineEmits(['wallet-pick']);

function onWalletPick(wallet) {
    emit('wallet-pick', clone(wallet));
}

function getWalletName(wallet) {
    return wallet.label || wallet.name;
}
</script>

<template>
    <FListbox
        :data="wallets"
        @component-change="onWalletPick"
        class="walletlist"
        :aria-label="$t('wallet.walletList.walletList')"
        data-testid="wallet_list"
    >
        <template v-slot="{ item }">
            <div class="walletlist_item" :data-test-walletname="getWalletName(item)">
                <AppIconset v-if="item.icon" :icon="item.icon" original size="32px" />
                <span>{{ getWalletName(item) }}</span>
                <!--
                <InfoPopover
                    v-if="item.description"
                    :button-title="
                        $t('wallet.walletList.moreInfoAbout', {
                            walletName: getWalletName(item),
                        })
                    "
                >
                    <div v-html="item.description"></div>
                </InfoPopover>
-->
            </div>
        </template>
    </FListbox>
</template>

<style lang="scss">
.walletlist {
    &_item {
        display: flex;
        align-items: center;
        gap: var(--f-spacer-3);

        .infopopover {
            margin-left: auto;
        }
    }
}
</style>
