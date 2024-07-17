import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import RecentTransactionList from './RecentTransactionList.vue';
import { i18n } from '@/config/i18n.js';
import { setUpTestLocales } from '@/config/test/locale.js';

let wrapper = null;

function TRANSACTIONS() {
    return [
        {
            hash: '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
            description: 'tx description 1',
            status: 'pending',
            time: 1675691168634,
        },
        {
            description: 'tx description 2',
            hash: '0x40852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
            status: 'success',
        },
    ];
}

function createWrapper(options = {}) {
    return mount(RecentTransactionList, options);
}

beforeAll(() => {
    setUpTestLocales();
});

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('RecentTransactionList', () => {
    it('should display a notification if no transactions are given', () => {
        wrapper = createWrapper({ props: {} });

        expect(wrapper.text()).toContain(
            i18n.t('transaction.recentTransactionList.noTransactions')
        );
    });

    it('should display transaction description', () => {
        wrapper = createWrapper({
            props: {
                transactions: TRANSACTIONS(),
            },
        });
        const transactions = wrapper.findByTestCode('recenttransactionlist_item');

        expect(transactions[0].text()).toContain('tx description 1');
    });

    it('should display transaction status', () => {
        wrapper = createWrapper({
            props: {
                transactions: TRANSACTIONS(),
            },
        });
        const transactionStatus = wrapper.findComponent({
            name: 'TransactionStatus',
        });

        expect(transactionStatus.vm.$props.status).toBe('pending');
    });

    it('should display transaction hash', () => {
        wrapper = createWrapper({
            props: {
                transactions: TRANSACTIONS(),
            },
        });
        const transactions = wrapper.findByTestCode('recenttransactionlist_item');

        expect(transactions[0].text()).toContain(
            '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2'
        );
    });

    it('should display link to transaction detail in a fantom explorer', () => {
        wrapper = createWrapper({
            props: {
                transactions: TRANSACTIONS(),
            },
        });
        const transactions = wrapper.findByTestCode('recenttransactionlist_item');

        expect(transactions[0].find('a').attributes('href')).toBe(
            'https://ftmscan.com/tx/0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2'
        );
    });

    it('should display link to transaction detail in a fantom explorer with hash given in tx status object', () => {
        wrapper = createWrapper({
            props: {
                transactions: TRANSACTIONS(),
            },
        });
        const transactions = wrapper.findByTestCode('recenttransactionlist_item');

        expect(transactions[1].find('a').attributes('href')).toBe(
            'https://ftmscan.com/tx/0x40852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2'
        );
    });

    it('should display transaction time', () => {
        wrapper = createWrapper({
            props: {
                transactions: TRANSACTIONS(),
            },
        });
        const transactions = wrapper.findByTestCode('recenttransactionlist_item');

        expect(transactions[0].text()).toContain('2/6/2023, 1:46 PM');
    });
});
