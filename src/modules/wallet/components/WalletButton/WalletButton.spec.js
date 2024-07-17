import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import WalletButton from '@/modules/wallet/components/WalletButton/WalletButton.vue';
import { TEST_ACCOUNT_ADDRESS } from '@/plugins/web3-wallets/test-helpers.js';

function createWrapper(options = {}) {
    return mount(WalletButton, options);
}

let wrapper = null;

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('WalletButton', () => {
    it('should display wallet address', () => {
        wrapper = createWrapper({
            props: {
                address: TEST_ACCOUNT_ADDRESS,
            },
        });

        expect(wrapper.findByTestId('wallet_address').text()).toBe(TEST_ACCOUNT_ADDRESS);
    });

    it('should display placeholder text if wallet address is not given', () => {
        wrapper = createWrapper({
            props: {
                placeholderText: 'Connect',
            },
        });

        expect(wrapper.findByTestId('wallet_button').text()).toBe('Connect');
    });

    it('should display wallet name', () => {
        wrapper = createWrapper({
            props: {
                address: TEST_ACCOUNT_ADDRESS,
                subText: 'Keystore',
            },
        });

        expect(wrapper.findByTestId('wallet_subtext').text()).toBe('Keystore');
    });
});
