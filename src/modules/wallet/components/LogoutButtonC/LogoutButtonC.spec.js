import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import LogoutButtonC from './LogoutButtonC.vue';
import { useAccounts } from '@/modules/account/composables/useAccounts/useAccounts.js';
import {
    TEST_ACCOUNT_ADDRESS,
    TEST_ACCOUNT_ADDRESS2,
} from '@/plugins/web3-wallets/test-helpers.js';

let wrapper = null;
const TEST_ACCOUNT = {
    address: TEST_ACCOUNT_ADDRESS,
    walletName: 'testwallet',
};
const TEST_ACCOUNT2 = {
    ...TEST_ACCOUNT,
    address: TEST_ACCOUNT_ADDRESS2,
};

function createWrapper(options = {}) {
    return mount(LogoutButtonC, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('LogoutButtonC', () => {
    it('should remove all account', async () => {
        wrapper = createWrapper();
        const { accounts } = useAccounts();

        await accounts.addAccount(TEST_ACCOUNT);
        await accounts.addAccount(TEST_ACCOUNT2);

        wrapper.findComponent({ name: 'LogoutButton' }).vm.$emit('logout');

        expect(accounts.store.accounts).toHaveLength(0);
    });

    it('should set `withoutConfirmation` prop of LogoutButton to true if there are no "software" wallets', async () => {
        wrapper = createWrapper();
        const { accounts } = useAccounts();

        accounts.setOneAccountMode(false);

        await accounts.addAccount(TEST_ACCOUNT);
        await accounts.addAccount(TEST_ACCOUNT2);

        const logoutButton = wrapper.findComponent({ name: 'LogoutButton' });

        expect(logoutButton.vm.withoutConfirmation).toBe(true);
    });
});
