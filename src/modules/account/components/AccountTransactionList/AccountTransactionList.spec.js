import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import AccountTransactionList from './AccountTransactionList.vue';
import {
    TEST_ACCOUNT_ADDRESS,
    TEST_ACCOUNT_ADDRESS2,
} from '@/plugins/web3-wallets/test-helpers.js';
import { setUpTestLocales } from '@/config/test/locale.js';
import { nextTick } from 'vue';

let wrapper = null;

function TRANSACTIONS() {
    return [
        {
            hash: '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
            from: TEST_ACCOUNT_ADDRESS,
            to: TEST_ACCOUNT_ADDRESS2,
            value: '0x0',
            status: '0x1',
            block: {
                timestamp: '0x63289dba',
            },
        },
        {
            hash: '0x40852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
            from: TEST_ACCOUNT_ADDRESS,
            to: TEST_ACCOUNT_ADDRESS2,
            value: '0x6B14BD1E6EEA00000',
            status: '0x0',
            block: {
                timestamp: '0x631f6aa6',
            },
        },
        {
            hash: '0x80852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
            from: TEST_ACCOUNT_ADDRESS2,
            to: TEST_ACCOUNT_ADDRESS,
            value: '0xde0b6b3a7640000',
            status: null,
            block: {
                timestamp: '0x631f6aa6',
            },
        },
    ];
}

function createWrapper(
    options = {
        props: {
            transactions: TRANSACTIONS(),
            address: TEST_ACCOUNT_ADDRESS,
        },
    }
) {
    return mount(AccountTransactionList, options);
}

beforeAll(() => {
    setUpTestLocales();
});

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('AccountTransactionList', () => {
    it('should display transaction status', () => {
        wrapper = createWrapper();
        const gridRows = wrapper.findByTestCode('fdatagrid-row');

        expect(gridRows[0].text()).toContain('Success');
        expect(gridRows[1].text()).toContain('Fail');
        expect(gridRows[2].text()).toContain('Pending');
    });

    it('should display transaction timestamp', () => {
        wrapper = createWrapper();
        const gridRows = wrapper.findByTestCode('fdatagrid-row');

        expect(gridRows[0].text()).toContain('9/19/2022, 4:50 PM');
        expect(gridRows[1].text()).toContain('9/12/2022, 5:21 PM');
        expect(gridRows[2].text()).toContain('9/12/2022, 5:21 PM');
    });

    it('should display `to` address if it differs from given account address', () => {
        wrapper = createWrapper();
        const gridRows = wrapper.findByTestCode('fdatagrid-row');

        expect(gridRows[0].text()).toContain(TEST_ACCOUNT_ADDRESS2);
    });

    it('should display `from` address if it differs from given account address', () => {
        wrapper = createWrapper();
        const gridRows = wrapper.findByTestCode('fdatagrid-row');

        expect(gridRows[2].text()).toContain(TEST_ACCOUNT_ADDRESS2);
    });

    it('should display transferred amount', () => {
        wrapper = createWrapper({
            props: {
                transactions: TRANSACTIONS(),
                address: TEST_ACCOUNT_ADDRESS,
            },
        });
        const gridRows = wrapper.findByTestCode('fdatagrid-row');

        expect(gridRows[0].find('td:last-child').text()).toBe('0');
        expect(gridRows[1].find('td:last-child').text()).toBe('-123.46');
        expect(gridRows[2].find('td:last-child').text()).toBe('+1.00');
    });

    it('should display link to transaction detail in a fantom explorer', () => {
        wrapper = createWrapper({
            props: {
                transactions: TRANSACTIONS(),
                address: TEST_ACCOUNT_ADDRESS,
            },
        });
        const gridRows = wrapper.findByTestCode('fdatagrid-row');

        expect(gridRows[0].find('a').attributes('href')).toBe(
            'https://ftmscan.com/tx/0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2'
        );
    });

    it('should display link to address detail in a fantom explorer', () => {
        wrapper = createWrapper({
            props: {
                transactions: TRANSACTIONS(),
                address: TEST_ACCOUNT_ADDRESS,
            },
        });
        const gridRows = wrapper.findByTestCode('fdatagrid-row');

        const links = gridRows[0].findAll('a');
        expect(links[1].attributes('href')).toBe(
            `https://ftmscan.com/address/${TEST_ACCOUNT_ADDRESS2}`
        );
    });

    it('should expose FDataGrid methods', () => {
        wrapper = createWrapper();

        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.resetPagination).toBeDefined();
    });

    it('should match snapshot', async () => {
        wrapper = createWrapper({
            props: {
                transactions: TRANSACTIONS(),
                address: TEST_ACCOUNT_ADDRESS,
                addressUrl: 'https://ftmscan.com/address/',
            },
        });

        await nextTick();
        // remove dynamic attributes
        wrapper.removeAttributes('id');
        wrapper.removeAttributes('data-fdg-id');

        expect(wrapper.element).toMatchSnapshot();
    });
});
