import { TransactionNotificationsProvider } from './TransactionNotificationsProvider.js';
import { vi } from 'vitest';
import { delay, getUniqueId } from 'fantom-vue3-components';
import { nextTick, ref } from 'vue';
import { useTransactionStore } from '@/modules/transaction/store/store.js';

let transactionNotifications = null;
let notifications = null;

class NotificationsMock {
    async add() {
        return getUniqueId();
    }
    hide() {}
    update() {}
}

beforeEach(() => {
    notifications = new NotificationsMock();
    transactionNotifications = new TransactionNotificationsProvider({
        notifications,
        hideDelay: 0,
    });
});

afterEach(() => {
    transactionNotifications = null;
    notifications = null;
});

describe('TransactionNotificationsProvider', () => {
    it('should add notification', async () => {
        const addSpy = vi.spyOn(notifications, 'add');

        await transactionNotifications.add({ text: 'foo' });

        expect(addSpy).toHaveBeenCalled();
    });

    it('should update last notification', async () => {
        const updateSpy = vi.spyOn(notifications, 'update');

        const notificationId = await transactionNotifications.add({
            text: 'foo',
        });
        transactionNotifications.update({ text: 'updated' });

        expect(updateSpy).toHaveBeenCalledWith(
            { text: 'updated', type: 'info', hideAfter: 1000000 },
            notificationId
        );
    });

    it('should hide notification if `txStatus` is not in pending state', async () => {
        const hideSpy = vi.spyOn(notifications, 'hide');
        const txStatus = ref({ status: 'pending' });

        await transactionNotifications.add({ text: 'foo' }, txStatus);
        txStatus.value = { status: 'success' };

        await nextTick();

        expect(hideSpy).toHaveBeenCalled();
    });

    it('should hide notification after `hideDelay` milliseconds', async () => {
        const hideSpy = vi.spyOn(notifications, 'hide');
        const txStatus = ref({ status: 'pending' });
        transactionNotifications = new TransactionNotificationsProvider({
            hideDelay: 20,
            notifications,
        });

        const messageId = await transactionNotifications.add({ text: 'foo' }, txStatus);
        transactionNotifications.hide(messageId);

        expect(hideSpy).toHaveBeenCalledTimes(0);

        await delay(21);

        expect(hideSpy).toHaveBeenCalledTimes(1);
    });

    it('should not watch `txStatus` when notification is hidden', async () => {
        const hideSpy = vi.spyOn(notifications, 'hide');
        const txStatus = ref({ status: 'pending' });

        const messageId = await transactionNotifications.add({ text: 'foo' }, txStatus);
        transactionNotifications.hide(messageId);
        txStatus.value = { status: 'success' };

        await nextTick();

        expect(hideSpy).toHaveBeenCalledTimes(1);
    });

    it('should add transaction info to transaction store if the store is given and `txStatus` is not in pending state', async () => {
        vi.useFakeTimers();

        const transactionStore = useTransactionStore();
        transactionNotifications = new TransactionNotificationsProvider({
            transactionStore,
            accountAddress: ref('0x123abc'),
            notifications: new NotificationsMock(),
            hideDelay: 0,
        });
        const txStatus = ref({ status: 'pending' });
        const date = new Date(2023, 1, 8);
        vi.setSystemTime(date);

        await transactionNotifications.add({ text: 'foo' }, txStatus);
        txStatus.value = { status: 'success', transactionHash: '0x123' };

        await nextTick();

        expect(transactionStore.recentTransactions['0x123abc']).toEqual([
            {
                description: 'foo',
                status: 'success',
                hash: '0x123',
                time: date.valueOf(),
            },
        ]);

        vi.useRealTimers();
    });
});
