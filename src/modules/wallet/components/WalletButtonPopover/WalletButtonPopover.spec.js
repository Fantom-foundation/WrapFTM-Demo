import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import WalletButtonPopover from '@/modules/wallet/components/WalletButtonPopover/WalletButtonPopover.vue';
import WalletsInfoPage from '@/modules/wallet/components/WalletsInfoPage/WalletsInfoPage.vue';
import { useAccounts } from '@/modules/account/composables/useAccounts/useAccounts.js';
import {
    TEST_ACCOUNT_ADDRESS,
    TEST_ACCOUNT_ADDRESS2,
} from '@/plugins/web3-wallets/test-helpers.js';
import { delay } from 'fantom-vue3-components';

let wrapper = null;

function createWrapper(options = { attachTo: document.body }) {
    return mount(WalletButtonPopover, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('WalletButtonPopover', () => {
    it('should display wallets info page', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();
        const settings = wrapper.findComponent(WalletsInfoPage);

        expect(settings.exists()).toBe(true);
    });

    it.skip('should hide when account is changed', async () => {
        wrapper = createWrapper();
        const { accounts } = useAccounts();
        await accounts.addAccount({
            address: TEST_ACCOUNT_ADDRESS,
            walletName: 'software',
        });
        await accounts.addAccount({
            address: TEST_ACCOUNT_ADDRESS2,
            walletName: 'software',
        });
        await accounts.setActiveAccountByAddress(TEST_ACCOUNT_ADDRESS);

        await wrapper.showWindow();
        await accounts.setActiveAccountByAddress(TEST_ACCOUNT_ADDRESS2);
        await delay();

        expect(wrapper.vm.$refs.popover.isWindowVisible()).toBe(false);
    });
});
