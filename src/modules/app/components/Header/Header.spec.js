import { shallowMount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import Header from '@/modules/app/components/Header/Header.vue';

function createWrapper(options = {}) {
    return shallowMount(Header, options);
}

let wrapper = null;

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('Header', () => {
    it('should display logo', () => {
        wrapper = createWrapper();

        expect(wrapper.findByTestId('app_logo').exists()).toBe(true);
    });

    it('should display wallet button', () => {
        wrapper = createWrapper();

        const walletButton = wrapper.findComponent({ name: 'WalletButtonC' });

        expect(walletButton.exists()).toBe(true);
    });
});
