<script setup>
import TransactionStatus from '@/modules/common/components/TransactionStatus/TransactionStatus.vue';
import { FLink, useFormatters } from 'fantom-vue3-components';

defineProps({
    transactions: {
        type: Array,
        default() {
            return [];
        },
    },
});

const { formatters } = useFormatters();

function formatTime(time = 0) {
    return time > 0 ? formatters.dateTime(new Date(time), 'shortDatetime') : '';
}
</script>

<template>
    <div class="recenttransactionlist">
        <h2 id="recenttransactionlist" class="h4">
            {{ $t('transaction.recentTransactionList.recentTransactions') }}
        </h2>

        <ul
            v-if="transactions.length > 0"
            aria-labelledby="recenttransactionlist"
            class="listbare"
        >
            <li
                v-for="transaction in transactions"
                :key="transaction.hash"
                data-testcode="recenttransactionlist_item"
            >
                <TransactionStatus
                    :status="transaction.status"
                    :icon-props="{ size: '20px' }"
                    no-text
                >
                    <template #text>
                        <h3>{{ transaction.description }}</h3>
                    </template>
                </TransactionStatus>
                <div class="recenttransactionlist_bottom">
                    <FLink
                        v-if="transaction.hash"
                        type="transaction"
                        :text="transaction.hash || ''"
                        use-ellipsis
                        target="_blank"
                        :title="$t('transaction.transactionNotification.transactionHash')"
                        clas="recenttransactionlist_txlink"
                    />
                    <span class="recenttransactionlist_time">
                        {{ formatTime(transaction.time) }}
                    </span>
                </div>
            </li>
        </ul>
        <template v-else>
            {{ $t('transaction.recentTransactionList.noTransactions') }}
        </template>
    </div>
</template>

<style lang="scss">
.recenttransactionlist {
    --recenttransactionlist-separator: 1px solid var(--f-color-grey-2);

    padding: var(--f-spacer-3);
    display: flex;
    flex-direction: column;

    ul {
        max-height: calc(4 * var(--f-spacer-9));
        overflow: auto;

        li {
            padding: var(--f-spacer-3);
            //background: var(--f-color-grey-2);
        }

        li + li {
            border-top: var(--recenttransactionlist-separator);
            margin-top: var(--f-spacer-1);
        }
    }

    h2 {
        margin: 0 0 var(--f-spacer-3) 0;
        text-align: center;
    }

    h3 {
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        max-width: 233px;
        text-overflow: ellipsis;
    }

    &_bottom {
        display: flex;
        font-size: var(--f-font-size-2);
        opacity: var(--f-opacity-7);
        gap: var(--f-spacer-2);

        > * {
            flex: 1;
        }
    }

    &_txlink {
        max-width: 50%;
    }

    &_time {
        text-align: end;
        //opacity: var(--f-opacity-5);
    }
}

:root.theme-dark {
    .recenttransactionlist {
        --recenttransactionlist-separator: 1px solid var(--theme-dark-color-5);
    }
}
</style>
