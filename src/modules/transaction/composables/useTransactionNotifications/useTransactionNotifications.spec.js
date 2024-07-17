import { useTransactionNotifications } from './useTransactionNotifications.js';
import { TransactionNotificationsProvider } from '@/modules/transaction/components/TransactionNotifications/TransactionNotificationsProvider/TransactionNotificationsProvider.js';

describe('useTransactionNotifications', () => {
    it('should return instance of TransactionNotificationsProvider', () => {
        expect(useTransactionNotifications().transactionNotifications).toBeInstanceOf(
            TransactionNotificationsProvider
        );
    });
});
