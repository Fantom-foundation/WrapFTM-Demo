import { useMethods } from 'fantom-vue3-components';

export const TRANSACTION_NOTIFICATIONS_ID = 'transaction-notifications-id';

export class TransactionNotifier {
    #notifications = {};

    async add(notification, txStatus) {
        const code = txStatus.value?.code;
        const { add } = useMethods(TRANSACTION_NOTIFICATIONS_ID).getMethods();
        let notificationId = '';

        if (code in this.#notifications) {
            this.hide(this.#notifications[code]);
            delete this.#notifications[code];
        }

        if (add) {
            notificationId = await add(notification, txStatus);
            this.#notifications[code] = notificationId;
        }

        return notificationId;
    }

    hide(notificationId) {
        const { hide } = useMethods(TRANSACTION_NOTIFICATIONS_ID).getMethods();

        if (hide) {
            hide(notificationId);
        }
    }

    update(notification, notificationId) {
        const { update } = useMethods(TRANSACTION_NOTIFICATIONS_ID).getMethods();

        if (update) {
            update(notification, notificationId);
        }
    }
}
