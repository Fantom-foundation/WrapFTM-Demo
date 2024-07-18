import { defineStore } from 'pinia';
import { StoreUtils } from 'fantom-vue3-components/src/utils/StoreUtils/StoreUtils.js';
import { appConfig } from '@/config/app-config.js';

const transactionStoreUtils = new StoreUtils(`${appConfig.code}-transaction`);

export const useTransactionStore = defineStore('transaction', {
    state: () => {
        return {
            // keys are address in lower case, values are arrays of transaction infos
            ...transactionStoreUtils.useInSessionStorage('recentTransactions', {}),
            ...transactionStoreUtils.useInSessionStorage('wrap', false),
            ...transactionStoreUtils.useInSessionStorage('methodType', 'polltxcount'),
            // recentTransactions: {},
        };
    },
    actions: {
        addTransaction(
            transaction,
            accountAddress,
            limit = appConfig.transactionNotifications.limit
        ) {
            const { recentTransactions } = this;
            const address = accountAddress ? accountAddress.toLowerCase() : '';

            if (address) {
                if (!(address in recentTransactions)) {
                    recentTransactions[address] = [];
                }

                const transactions = recentTransactions[address];

                if (!transactions.find((tx) => tx.hash === transaction.hash)) {
                    transactions.unshift({
                        hash: transaction.hash || transaction.transactionHash,
                        description: transaction.description,
                        time: transaction.time,
                        status: transaction.status,
                    });
                }

                if (transactions.length > limit) {
                    transactions.pop();
                }
            } else {
                throw new Error('No account address is provided');
            }
        },

        clearAllTransactions() {
            this.recentTransactions = {};
        },
    },
});

/**
 * TransactionStore object
 * @typedef {Object} TransactionStore
 * @property {array} recentTransactions
 */
