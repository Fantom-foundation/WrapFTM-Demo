import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import RecentTransactionListPopover from './RecentTransactionListPopover.vue';
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
    ];
}

function createWrapper(options = {}) {
    return mount(RecentTransactionListPopover, options);
}

beforeAll(() => {
    setUpTestLocales();
});

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('RecentTransactionListPopover', () => {
    it('should display RecentTransactionList', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();

        expect(wrapper.findComponent({ name: 'RecentTransactionList' }).exists()).toBe(
            true
        );
    });

    it('should pass transactions to RecentTransactionList', async () => {
        wrapper = createWrapper({
            props: {
                transactions: TRANSACTIONS(),
            },
        });

        await wrapper.showWindow();

        expect(
            wrapper.findComponent({ name: 'RecentTransactionList' }).vm.$props
                .transactions
        ).toEqual(TRANSACTIONS());
    });

    it('should expose popover methods', () => {
        wrapper = createWrapper();

        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.show).toBeDefined();
        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.hide).toBeDefined();
    });
});
