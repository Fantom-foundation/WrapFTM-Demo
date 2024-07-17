import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import TransactionVerificationPlayground from './TransactionVerificationPlayground.vue';
import { i18n } from '@/config/i18n.js';
import { delay } from 'fantom-vue3-components';

let wrapper = null;

function createWrapper(props = {}) {
    return mount(TransactionVerificationPlayground, { props });
}

async function selectTab(id) {
    const tabs = wrapper.findByTestId('tvp_tabs');
    const tab = tabs.find(`[aria-controls="${id}"]`);

    await tab.trigger('click');
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('TransactionVerificationPlayground', () => {
    it('should display correct tabs', async () => {
        wrapper = createWrapper();

        await delay();

        const tabs = wrapper.findByTestId('tvp_tabs');
        const text = tabs.text();

        expect(text).toContain(
            i18n.t('transaction.transactionVerificationPlayground.pollNonce')
        );
        expect(text).toContain(
            i18n.t('transaction.transactionVerificationPlayground.pollReceipt')
        );
        expect(text).toContain(
            i18n.t('transaction.transactionVerificationPlayground.subscribeToEvent')
        );
    });

    it('should emit "verification-method-change" event on init', async () => {
        wrapper = createWrapper();

        await delay();

        const event = wrapper.emitted('verification-method-change')[0][0];
        expect(event.methodType).toEqual('subscribetoevent');
        expect(typeof event.verificationFunc === 'function').toBe(true);
    });

    it('should emit "verification-method-change" event when tab has changed', async () => {
        wrapper = createWrapper();

        await delay();

        await selectTab('pollreceipt');

        await delay();

        const event = wrapper.emitted('verification-method-change')[1][0];
        expect(event.methodType).toEqual('pollreceipt');
        expect(typeof event.verificationFunc === 'function').toBe(true);
    });

    it('should disable tabs if `pendingTransaction` prop is true', async () => {
        wrapper = createWrapper({
            pendingTransaction: true,
        });

        await delay();

        await selectTab('pollreceipt');

        await delay();

        expect(wrapper.emitted('verification-method-change')[1]).toBeUndefined();
    });

    it('should enable tabs if `pendingTransaction` prop has changed', async () => {
        wrapper = createWrapper({
            pendingTransaction: true,
        });

        await delay();

        await wrapper.setProps({
            pendingTransaction: false,
        });

        await selectTab('pollreceipt');

        await delay();

        expect(wrapper.emitted('verification-method-change')[0]).toBeDefined();
    });
});
