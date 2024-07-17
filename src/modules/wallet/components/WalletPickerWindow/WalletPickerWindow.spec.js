import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import WalletPickerWindow from '@/modules/wallet/components/WalletPickerWindow/WalletPickerWindow.vue';
import { delay } from 'fantom-vue3-components';

let wrapper = null;

function createWrapper(options = {}) {
    return mount(WalletPickerWindow, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('WalletPickerWindow', () => {
    it('should expose FWindow methods', () => {
        wrapper = createWrapper();

        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.show).toBeDefined();
        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.hide).toBeDefined();
    });

    it('should display wallet picker', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();

        expect(wrapper.findComponent({ name: 'WalletPicker' }).exists()).toBe(true);
    });

    it("should hide on 'account-picked' event", async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();
        const walletPicker = wrapper.findComponent({ name: 'WalletPicker' });
        walletPicker.vm.$emit('account-picked');

        await delay(0);

        expect(wrapper.vm.window.isVisible).toBe(false);
    });

    it('should re-emit "account-picked" event', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();
        const walletPicker = wrapper.findComponent({ name: 'WalletPicker' });
        walletPicker.vm.$emit('account-picked');

        expect(wrapper.emitted('account-picked')).toBeTruthy();
    });
});
