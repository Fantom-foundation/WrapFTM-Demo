import { watch } from 'vue';

export class TransactionNotificationsProvider {
    #notifications = null;
    #transactionStore = null;
    #accountAddress = null;
    #hideDelay = 0;
    // key is notification id, value is Ref<FTransactionStatus>
    #txStatuses = {};
    #lastNotificationId = '';

    /**
     * @param {{add: function, hide: function}} notifications
     * @param {{addTransaction: function}} transactionStore
     * @param {Ref<string>} [accountAddress]
     * @param {number} hideDelay Delay in milliseconds before hiding a notification
     */
    constructor({
        notifications,
        transactionStore,
        accountAddress = null,
        hideDelay = 5000,
    }) {
        this.#notifications = notifications;
        this.#accountAddress = accountAddress;
        this.#transactionStore = transactionStore;
        this.#hideDelay = hideDelay;
    }

    /**
     * @param {Object} notification
     * @param {Ref<FTransactionStatus>} [txStatus]
     * @return {string} Notification id
     */
    async add(notification, txStatus = null) {
        return this.#addNotification(notification, txStatus);
    }

    /**
     * @param {string} notificationId
     * @param {number} [hideDelay] Delay in milliseconds before hiding a notification
     */
    hide(notificationId, hideDelay = this.#hideDelay) {
        if (notificationId && !this.#notificationHidingInProgress(notificationId)) {
            this.#setNotificationHidingInProgress(notificationId);

            if (hideDelay > 0) {
                setTimeout(() => {
                    this.#hideNotification(notificationId);
                }, hideDelay);
            } else {
                this.#hideNotification(notificationId);
            }
        }
    }

    /**
     * @param {Object} notification
     * @param {string} notificationId
     * @return {boolean}
     */
    update(notification, notificationId = this.#lastNotificationId) {
        return this.#notifications.update(
            this.#getNotification(notification),
            notificationId
        );
    }

    async #addNotification(notification, txStatus) {
        const notificationId = await this.#notifications.add(
            this.#getNotification(notification),
            txStatus
        );

        if (txStatus) {
            this.#addTxStatus({ txStatus, notificationId, notification });
        }

        this.#lastNotificationId = notificationId;

        return notificationId;
    }

    #hideNotification(notificationId) {
        this.#notifications.hide(notificationId);
        this.#removeTxStatus(notificationId);
    }

    #getNotification(notification) {
        return {
            ...notification,
            type: 'info',
            hideAfter: 1000000,
        };
    }

    #notificationHidingInProgress(notificationId) {
        const txStatus = this.#txStatuses[notificationId];

        return txStatus?._hidingInProgress || false;
    }

    #setNotificationHidingInProgress(notificationId) {
        const txStatus = this.#txStatuses[notificationId];

        if (txStatus) {
            txStatus._hidingInProgress = true;
        }
    }

    #addTxStatus({ txStatus, notificationId, notification }) {
        if (txStatus && notificationId) {
            // console.log('!!!', txStatus);
            this.#txStatuses[notificationId] = {
                unwatch: watch(txStatus, (value) => {
                    if (value.status !== 'pending') {
                        this.#addToStore(value, notification);
                        this.hide(notificationId);
                    }
                }),
                txStatus,
            };
        }
    }

    #addToStore(txStatus, notification) {
        const transactionStore = this.#transactionStore;
        const accountAddress = this.#accountAddress ? this.#accountAddress.value : '';

        if (transactionStore) {
            if (accountAddress) {
                transactionStore.addTransaction(
                    {
                        description: notification.text,
                        hash: txStatus.transactionHash,
                        status: txStatus.status,
                        time: Date.now(),
                    },
                    accountAddress
                );
            } else {
                throw new Error('No account address is provided');
            }
        }
    }

    #removeTxStatus(notificationId) {
        const txStatus = this.#txStatuses[notificationId];

        if (txStatus) {
            txStatus.unwatch();
            txStatus.txStatus = null;

            delete this.#txStatuses[notificationId];
        }
    }
}
