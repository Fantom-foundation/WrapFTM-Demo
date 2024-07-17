import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import LogoutConfirmationWindow from '@/modules/wallet/components/LogoutConfirmationWindow/LogoutConfirmationWindow.vue';

let wrapper = null;

function createWrapper(options = {}) {
    return mount(LogoutConfirmationWindow, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('LogoutConfirmationWindow', () => {
    it('should expose FWindow methods', () => {
        wrapper = createWrapper();

        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.show).toBeDefined();
        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.hide).toBeDefined();
    });
});
