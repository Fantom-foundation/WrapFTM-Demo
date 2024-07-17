<script setup>
import { FNotifications, useMethods } from 'fantom-vue3-components';
import TransactionNotification from '@/modules/transaction/components/TransactionNotification/TransactionNotification.vue';
import { ref } from 'vue';
import { TRANSACTION_NOTIFICATIONS_ID } from '@/modules/transaction/composables/useTransactionNotifications/TransactionNotifier.js';

const props = defineProps({
    id: {
        type: String,
        default: TRANSACTION_NOTIFICATIONS_ID,
    },
});

const GROUP_NAME = 'transaction-notifications';
const notifications = ref(null);

async function add(notification, txStatus) {
    return notifications.value.add(notification, txStatus);
}

function update(notification, notificationId) {
    notifications.value.update(notification, notificationId);
}

function hide(notificationId) {
    notifications.value.hideNotification({
        msgId: notificationId,
        group: GROUP_NAME,
    });
}

const { registerMethods } = useMethods(props.id, true);
registerMethods({ add, update, hide });
</script>

<template>
    <FNotifications
        ref="notifications"
        :group="GROUP_NAME"
        strategy="newest-first"
        position="bottom-center"
        hide-on-click
        hide-on-close-button
        animation-in="scale-center-enter-active"
        animation-out="scale-center-leave-active"
        __animation-in="slide-left-enter-active"
        __animation-out="slide-right-leave-active"
        class="transactionnotifications"
        data-testid="transaction_notifications"
    >
        <template #notification="notification">
            <TransactionNotification
                :transaction-status="notification?.args[0].value || {}"
                :description="notification.text || notification.description"
                :hash="notification.hash"
            />
        </template>
    </FNotifications>
</template>

<style lang="scss">
.transactionnotifications {
    bottom: 50%;
    transform: translateX(-50%) translateY(50%);

    .transactionnotification {
        font-size: 1em;
        //font-size: 0.8em;
    }

    .fmessage {
        display: block;
        margin-bottom: 0;
        outline: 10000px solid rgba(0, 0, 0, 0.5);

        .fbutton {
            position: absolute;
            inset-block-start: var(--f-spacer-3);
            inset-inline-end: var(--f-spacer-3);
        }
    }
}
</style>
