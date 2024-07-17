import { TransactionNotificationsProvider } from '@/modules/transaction/components/TransactionNotifications/TransactionNotificationsProvider/TransactionNotificationsProvider.js';
import { TransactionNotifier } from './TransactionNotifier.js';
import { useTransactionStore } from '@/modules/transaction/store/store.js';
import { useWallet } from '@/modules/wallet/composables/useWallet/useWallet.js';

let transactionNotifications = null;

export function useTransactionNotifications() {
    if (transactionNotifications === null) {
        const { accountAddress } = useWallet(true);

        transactionNotifications = new TransactionNotificationsProvider({
            notifications: new TransactionNotifier(),
            transactionStore: useTransactionStore(),
            accountAddress,
        });
    }

    return { transactionNotifications };
}
