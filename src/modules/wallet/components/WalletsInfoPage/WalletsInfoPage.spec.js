import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import WalletsInfoPage from '@/modules/wallet/components/WalletsInfoPage/WalletsInfoPage.vue';
import { TEST_ACCOUNT_ADDRESS } from '@/plugins/web3-wallets/test-helpers';

let wrapper = null;

function createWrapper(props = {}) {
    return mount(WalletsInfoPage, { props });
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('WalletsInfoPage', () => {
    it('should display "logout" button', () => {
        wrapper = createWrapper();
        const button = wrapper.findComponent({ name: 'LogoutButtonC' });

        expect(button.exists()).toBe(true);
    });

    it('should display given address', () => {
        wrapper = createWrapper({
            accountAddress: TEST_ACCOUNT_ADDRESS,
        });

        expect(wrapper.text()).toContain(TEST_ACCOUNT_ADDRESS);
    });

    it('should display jazzicon', () => {
        wrapper = createWrapper({
            accountAddress: TEST_ACCOUNT_ADDRESS,
        });

        expect(wrapper.find('svg').exists()).toBe(true);
    });

    describe('one account mode', () => {
        it('should not display account list', () => {
            wrapper = createWrapper({
                oneAccountMode: true,
                accountAddress: TEST_ACCOUNT_ADDRESS,
            });
            const accountList = wrapper.findComponent({ name: 'AccountListC' });

            expect(accountList.exists()).toBe(false);
        });

        it('should not display "add wallet" button', () => {
            wrapper = createWrapper({
                oneAccountMode: true,
                accountAddress: TEST_ACCOUNT_ADDRESS,
            });
            const button = wrapper.findComponent({ name: 'AddWalletButton' });

            expect(button.exists()).toBe(false);
        });
    });
});
