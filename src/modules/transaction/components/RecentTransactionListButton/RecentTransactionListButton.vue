<script setup>
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '@/modules/transaction/store/store.js';
import { computed, ref, watch } from 'vue';
import { FButton } from 'fantom-vue3-components';
import AppIconset from '@/modules/common/components/AppIconset/AppIconset.vue';
import RecentTransactionListPopover from '@/modules/transaction/components/RecentTransactionListPopover/RecentTransactionListPopover.vue';
import { useWallet } from '@/modules/wallet/composables/useWallet/useWallet.js';

const props = defineProps({
    transactions: {
        type: Array,
        default() {
            return [];
        },
    },
});

const popover = ref(null);
const transactionStore = useTransactionStore();
const { recentTransactions } = storeToRefs(transactionStore);
const { accountAddress } = useWallet();

const cTransactions = computed(() => {
    let transactions = [];

    if (props.transactions.length > 0) {
        transactions = props.transactions;
    } else if (accountAddress.value) {
        transactions = recentTransactions.value[accountAddress.value] || [];
    }

    return transactions;
});

function onButtonClick() {
    popover.value.show();
}

watch(accountAddress, (value, prevValue) => {
    if (prevValue) {
        transactionStore.clearAllTransactions();
    }
});
</script>

<template>
    <FButton
        v-if="cTransactions.length > 0"
        id="revecenttransactionlistbutton"
        tertiary
        round
        class="revecenttransactionlistbutton"
        data-testid="revecenttransactionlistbutton"
        :title="$t('transaction.recentTransactionList.recentTransactions')"
        @click="onButtonClick"
    >
        <AppIconset icon="transaction" />
    </FButton>
    <RecentTransactionListPopover
        ref="popover"
        attach-to="#revecenttransactionlistbutton"
        attach-position="rb rb"
        :transactions="cTransactions"
    />
</template>

<style lang="scss">
.revecenttransactionlistbutton {
    --revecenttransactionlistbutton-size: var(--f-spacer-8);
    --revecenttransactionlistbutton-margin: var(--f-spacer-3);
    --revecenttransactionlistbutton-background-color: var(--f-color-grey-1);

    position: fixed;
    right: var(--revecenttransactionlistbutton-margin);
    bottom: var(--revecenttransactionlistbutton-margin);
    width: var(--revecenttransactionlistbutton-size);
    height: var(--revecenttransactionlistbutton-size);
    box-shadow: var(--f-box-shadow-6);
    color: var(--f-color-grey-5);
    background: var(--revecenttransactionlistbutton-background-color);
    opacity: var(--f-opacity-7);
    transition: opacity var(--f-transition-length) var(--f-transition-func);

    &:hover {
        opacity: 1;
    }
}

html[dir='rtl'] {
    .revecenttransactionlistbutton {
        right: unset;
        left: var(--revecenttransactionlistbutton-margin);
    }
}

:root.theme-dark {
    .revecenttransactionlistbutton {
        --revecenttransactionlistbutton-background-color: var(--theme-dark-color-6);
    }
}
</style>
