import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import RecentTransactionListButton from './RecentTransactionListButton.vue';
import { setUpTestLocales } from '@/config/test/locale.js';
import { useTransactionStore } from '@/modules/transaction/store/store.js';
import { useWalletStore } from '@/modules/wallet/store/store.js';
import { nextTick } from 'vue';

let wrapper = null;
const transactionStore = useTransactionStore();
const walletStore = useWalletStore();

function createWrapper(options = {}) {
    return mount(RecentTransactionListButton, options);
}

beforeAll(() => {
    setUpTestLocales();
});

afterEach(() => {
    destroyWrapper(wrapper);
    walletStore.$reset();
});

describe('RecentTransactionListButton', () => {
    it('should be hidden if no transactions are given', () => {
        wrapper = createWrapper({
            props: {
                transactions: [],
            },
        });

        expect(wrapper.findByTestId('revecenttransactionlistbutton').exists()).toBe(
            false
        );
    });

    it('should display given transactions', async () => {
        wrapper = createWrapper({
            props: {
                transactions: [
                    {
                        hash: '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
                        description: 'tx description 1',
                        status: 'pending',
                        time: 1675691168634,
                    },
                ],
            },
        });

        await wrapper.findByTestId('revecenttransactionlistbutton').trigger('click');

        expect(wrapper.html()).toContain(
            '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2'
        );
    });

    it('should display transactions from the store as a default if no transactions are given', async () => {
        walletStore.address = '0x123abc';
        const TRANSACTION = {
            hash: '0x11139852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
            description: 'tx description 2',
            status: 'pending',
            time: 1675691168634,
        };
        transactionStore.addTransaction(TRANSACTION, '0x123abc');
        wrapper = createWrapper();

        await wrapper.findByTestId('revecenttransactionlistbutton').trigger('click');

        expect(wrapper.html()).toContain(
            '0x11139852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2'
        );

        transactionStore.clearAllTransactions();
    });

    it('should remove recent transactions if account address is changed or empty (logout)', async () => {
        walletStore.address = '0x123abc';
        const TRANSACTION = {
            hash: '0x11139852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
            description: 'tx description 2',
            status: 'pending',
            time: 1675691168634,
        };
        transactionStore.addTransaction(TRANSACTION, '0x123abc');
        wrapper = createWrapper();

        walletStore.address = '';
        await nextTick();

        expect(wrapper.findByTestId('revecenttransactionlistbutton').exists()).toBe(
            false
        );
        expect(transactionStore.recentTransactions['0x123abc']).toBeUndefined();

        transactionStore.clearAllTransactions();
    });
});
