<script setup>
import './types.js';
import { useI18n } from 'vue-i18n';
import { useFormatters } from 'fantom-vue3-components';
import { FDataGrid, FLink } from 'fantom-vue3-components';
import { ref } from 'vue';
import { bFromWei, toInt } from '@/utils/big-number/big-number.js';
import { addressesMatch } from '@/utils/account/account.js';
import { appConfig } from '@/config/app-config.js';
import { exposeMethods } from 'fantom-vue3-components/src/utils/exposeMethods/exposeMethods.js';

const t = useI18n().t;

const { formatters } = useFormatters();

const props = defineProps({
    /** @type {AccountTransaction[]} */
    transactions: {
        type: [Array, Promise],
        default() {
            return [];
        },
        required: true,
    },
    /** Account address */
    address: {
        type: String,
        default: '',
        required: true,
    },
});

const dataGrid = ref(null);
const columns = ref([
    {
        name: 'status',
        label: t('account.transactionList.status'),
        width: '120px',
        formatter(value) {
            return value !== null ? toInt(value) : null;
        },
    },
    {
        name: 'timestamp',
        label: t('account.transactionList.time'),
        itemProp: 'block.timestamp',
        width: '200px',
        formatter(value) {
            return formatters.dateTime(new Date(toInt(value) * 1000), 'shortDatetime');
        },
    },
    {
        name: 'address',
        label: t('account.transactionList.address'),
        width: '280px',
        formatter(value, item) {
            return getRightAddress(item);
        },
    },
    {
        name: 'amount',
        itemProp: 'value',
        label: `${t('account.transactionList.amount')} (FTM)`,
        width: '200px',
        css: { textAlign: 'end' },
        formatter(value, item) {
            let sign = '';

            if (value !== '0x0') {
                if (addressesMatch(props.address, item.to)) {
                    sign = '+';
                } else {
                    sign = '-';
                }
            }

            return {
                amount:
                    value !== '0x0'
                        ? sign +
                          formatters.number(
                              bFromWei(value),
                              appConfig.formats.ftmFractionDigits,
                              'twoFractionDigits'
                          )
                        : '0',
                highlight: sign === '+',
            };
        },
    },
]);

function getStatusLabel(status) {
    let label = t('account.transactionList.pending');

    if (status === 0) {
        label = t('account.transactionList.fail');
    } else if (status === 1) {
        label = t('account.transactionList.success');
    }

    return label;
}

function getStatusCssClass(status) {
    let clas = [];

    if (status === 0) {
        clas.push('accounttransactionlist_status-fail');
    } else if (status === 1) {
        clas.push('accounttransactionlist_status-success');
    }

    return clas;
}

function getRightAddress(transaction) {
    return !addressesMatch(props.address, transaction.to)
        ? transaction.to
        : transaction.from;
}

defineExpose(exposeMethods(dataGrid, ['resetPagination']));
</script>

<template>
    <FDataGrid
        ref="dataGrid"
        :columns="columns"
        :items="transactions"
        strategy="remote"
        no-header
        infinite-scroll
        infinite-scroll-root-margin="200px 0px"
        sticky-head
        class="accounttransactionlist"
    >
        <template #column-status="{ value: status }">
            <span
                class="accounttransactionlist_status"
                :class="getStatusCssClass(status)"
            >
                {{ getStatusLabel(status) }}
            </span>
        </template>

        <template #column-timestamp="{ value: date, item: transaction }">
            <FLink
                type="transaction"
                :hash="transaction.hash"
                :text="date"
                target="_blank"
            />
        </template>

        <template #column-address="{ value: address }">
            <FLink type="address" :text="address || ''" use-ellipsis target="_blank" />
        </template>

        <template #column-amount="{ value: { amount, highlight } }">
            <span
                class="accounttransactionlist_amount"
                :class="{
                    'accounttransactionlist_amount-highligted': highlight,
                }"
            >
                {{ amount }}
            </span>
        </template>
    </FDataGrid>
</template>

<style lang="scss">
.accounttransactionlist {
    &_status {
        font-weight: bold;

        &-fail {
            color: var(--f-color-red-5);
        }

        &-success {
            color: var(--f-color-green-5);
        }
    }

    &_amount {
        font-weight: bold;

        &-highligted {
            color: var(--f-color-green-5);
        }
    }
}
</style>
