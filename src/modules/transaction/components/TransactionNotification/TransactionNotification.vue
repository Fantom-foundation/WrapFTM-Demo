<script setup>
import { computed } from 'vue';
import { FLink, FDotsLoader } from 'fantom-vue3-components';
import TransactionStatus from '@/modules/common/components/TransactionStatus/TransactionStatus.vue';

const props = defineProps({
    description: {
        type: String,
        default: '',
        required: true,
    },
    /** @type {FTransactionStatus} */
    transactionStatus: {
        type: Object,
        default() {
            return {};
        },
        required: true,
    },
    hash: {
        type: String,
        default: '',
    },
});

const cHash = computed(() => props.hash || props.transactionStatus?.transactionHash);
const cStatus = computed(() => {
    const { status } = props.transactionStatus;
    let label = '';

    if (status === 'pending') {
        if (cHash.value) {
            label = 'Veryfying transaction';
        }
    } else if (status === 'rejected') {
        label = 'Rejected';
    } else if (status === 'success') {
        label = 'Success';
    } else if (status === 'error') {
        label = 'Error';
    }

    return label;
});
</script>

<template>
    <div class="transactionnotification">
        <h2>{{ description }}</h2>
        <div class="transactionnotification_status">
            <FDotsLoader v-if="transactionStatus.status === 'pending'" size="18px" />
            <TransactionStatus
                v-else
                :status="transactionStatus.status"
                :icon-props="{ size: '110px' }"
                no-text
            ></TransactionStatus>
        </div>
        <div>
            <div class="transactionnotification_status_label">
                {{ cStatus }}
            </div>
            <FLink
                v-if="cHash"
                type="transaction"
                :text="cHash"
                use-ellipsis
                :title="$t('transaction.transactionNotification.transactionHash')"
                clas="transactionnotification_txlink"
            />
        </div>
    </div>
</template>

<style lang="scss">
.transactionnotification {
    padding-top: var(--f-spacer-5);
    padding-bottom: var(--f-spacer-5);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--f-spacer-5);
    min-height: 220px;

    &_txlink {
        .fellipsis {
            display: inline-flex;
            max-width: 180px;
        }
    }

    &_status {
        overflow: hidden;

        &_label {
            text-align: center;
        }
    }

    h2 {
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        max-width: 233px;
        text-overflow: ellipsis;
    }

    .transactionstatus {
        padding-top: var(--f-spacer-1);
        gap: var(--f-spacer-3);
    }

    .fdotsloader {
        margin-top: var(--f-spacer-5);
    }
}
</style>
