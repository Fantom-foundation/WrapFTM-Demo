import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import RemoveAccountConfirmationWindow from '@/modules/account/components/RemoveAccountConfirmationWindow/RemoveAccountConfirmationWindow.vue';
import RemoveAccountConfirmation from '@/modules/account/components/RemoveAccountConfirmation/RemoveAccountConfirmation.vue';
import { nextTick } from 'vue';
import { TEST_ACCOUNT_ADDRESS } from '@/plugins/web3-wallets/test-helpers.js';

let wrapper = null;

function createWrapper(options = { props: { address: TEST_ACCOUNT_ADDRESS } }) {
    return mount(RemoveAccountConfirmationWindow, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('RemoveAccountConfirmationWindow', () => {
    it('should display RemoveAccountConfirmation component', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();

        expect(wrapper.findComponent(RemoveAccountConfirmation).exists()).toBe(true);
    });

    it('should hide window on "cancel" action', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();
        await wrapper.findByTestId('action_button_cancel').trigger('click');
        await nextTick();

        expect(wrapper.vm.$refs.window.isVisible).toBe(false);
    });

    it('should hide window on "remove" action', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();
        await wrapper.findByTestId('action_button_remove').trigger('click');
        await nextTick();

        expect(wrapper.vm.$refs.window.isVisible).toBe(false);
    });

    it('should re-emit "button-action" event', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();
        await wrapper.findByTestId('action_button_remove').trigger('click');
        await nextTick();

        expect(wrapper.emitted('button-action')[0]).toEqual([
            { action: 'remove', address: TEST_ACCOUNT_ADDRESS },
        ]);
    });

    it('should expose FWindow methods', () => {
        wrapper = createWrapper();

        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.show).toBeDefined();
        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.hide).toBeDefined();
    });
});
