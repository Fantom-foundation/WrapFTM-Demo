import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import WalletEventsHandler from './WalletEventsHandler.vue';
import { vi } from 'vitest';
import { useWallet } from '@/modules/wallet/composables/useWallet/useWallet.js';
import {
    TEST_ACCOUNT,
    TEST_ACCOUNT2,
    TestWeb3Wallet,
} from '@/plugins/web3-wallets/test-helpers.js';
import { useAccounts } from '@/modules/account/composables/useAccounts/useAccounts.js';
import { Accounts } from '@/modules/account/Accounts/Accounts.js';
import { delay } from 'fantom-vue3-components';

class NotificationsMock {
    add() {}
}

let wrapper = null;
let notifications = new NotificationsMock();
const wallet = useWallet(true).wallet;
const { accounts } = useAccounts();

function createWrapper(options = { props: { notifications } }) {
    return mount(WalletEventsHandler, options);
}

Accounts.registerWeb3Wallet({
    name: 'test',
    clas: TestWeb3Wallet,
    label: 'Test wallet',
});

beforeAll(async () => {
    await accounts.addAccount(TEST_ACCOUNT);
    await accounts.addAccount(TEST_ACCOUNT2);
});

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('WalletEventsHandler', () => {
    it('should show notification on error event', async () => {
        const addNotificationSpy = vi.spyOn(notifications, 'add');
        wrapper = createWrapper();

        await wallet.triggerEvent({
            name: 'error',
            data: 'error message',
        });

        expect(addNotificationSpy).toHaveBeenCalledWith({
            type: 'error',
            text: 'error message',
        });

        vi.restoreAllMocks();
    });

    it('should set active account if address is changed', async () => {
        wrapper = createWrapper();

        await accounts.setActiveAccount(TEST_ACCOUNT, {
            address: TEST_ACCOUNT.address,
        });
        wallet.web3Wallet.address = TEST_ACCOUNT2.address;
        await delay();

        expect(wallet.address).toBe(TEST_ACCOUNT2.address);
    });

    /*it('should show "bad chain" warning message', async () => {
        wrapper = createWrapper();

        await accounts.setActiveAccount(TEST_ACCOUNT, { address: TEST_ACCOUNT.address });
        wallet.web3Wallet.chainId = '0x1';
        await delay();
        await delay();

        expect(wrapper.vm.$refs.badChainWarningWindow.isWindowVisible()).toBe(true);
    });*/
});
