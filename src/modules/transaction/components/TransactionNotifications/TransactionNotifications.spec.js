import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import TransactionNotifications from './TransactionNotifications.vue';
import { useTransactionNotifications } from '@/modules/transaction/composables/useTransactionNotifications/useTransactionNotifications.js';
import { delay, useMethods } from 'fantom-vue3-components';
import { TransactionNotificationsProvider } from '@/modules/transaction/components/TransactionNotifications/TransactionNotificationsProvider/TransactionNotificationsProvider.js';
import { useNotifications } from 'fantom-vue3-components/src/composables/useNotifications/useNotifications.js';
import { ref } from 'vue';

let wrapper = null;
let transactionNotifications = null;

function createWrapper(options = {}) {
    return mount(TransactionNotifications, {
        ...options,
        attachTo: document.body,
    });
}

beforeEach(() => {
    transactionNotifications = useTransactionNotifications().transactionNotifications;
});

afterEach(() => {
    destroyWrapper(wrapper);
    transactionNotifications = null;
});

describe('TransactionNotifications', () => {
    it('should add notification', async () => {
        wrapper = createWrapper();

        await transactionNotifications.add({ text: 'FOO', hash: '0x123abc' }, {});

        expect(document.body.innerHTML).toContain('FOO');
        expect(document.body.innerHTML).toContain('0x123abc');
    });

    it('should update notification', async () => {
        wrapper = createWrapper();

        const notificationId = await transactionNotifications.add(
            { text: 'FOO', hash: '0x123abc' },
            {}
        );
        transactionNotifications.update(
            { text: 'updated', hash: '0x4567' },
            notificationId
        );
        await delay();

        expect(document.body.innerHTML).toContain('updated');
        expect(document.body.innerHTML).toContain('0x4567');
    });

    it('should register `add`, `update` and `hide` methods', () => {
        const ID = 'id';
        wrapper = createWrapper({ props: { id: ID } });

        const { add, update, hide } = useMethods(ID).getMethods();

        expect(typeof add === 'function').toBe(true);
        expect(typeof update === 'function').toBe(true);
        expect(typeof hide === 'function').toBe(true);
    });

    it('should hide notification if `txStatus` is not in pending state', async () => {
        wrapper = createWrapper();
        const txStatus = ref({ status: 'pending' });
        transactionNotifications = new TransactionNotificationsProvider({
            notifications: useNotifications().notifications,
            hideDelay: 0,
        });

        transactionNotifications.add({ text: 'FOO', hash: '0x123abc' }, txStatus);
        await delay();

        txStatus.value = { status: 'success' };

        await delay();

        expect(document.body.innerHTML).not.toContain('FOO');
    });
});
