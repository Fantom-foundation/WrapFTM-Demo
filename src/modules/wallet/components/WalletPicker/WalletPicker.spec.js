import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import WalletPicker from '@/modules/wallet/components/WalletPicker/WalletPicker.vue';
import { WEB3_WALLETS_BY_NAME } from '@/config/web3-wallets.js';
import { delay } from 'fantom-vue3-components';

let wrapper = null;

function createWrapper(options = {}) {
    return mount(WalletPicker, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('WalletPicker', () => {
    it('should display wallet list', () => {
        wrapper = createWrapper();
        const wallets = WEB3_WALLETS_BY_NAME();

        expect(wrapper.text()).toContain(`${wallets.metamask.label}`);
    });

    it.skip('should show window with restore account view if software wallet is picked', async () => {
        wrapper = createWrapper();

        await wrapper.selectListboxItemByValue('metamask');
        await delay(0);

        expect(wrapper.findComponent({ name: 'RestoreAccountPage' }).exists()).toBe(true);
    });

    it('should show window with ledger picker if Ledger is picked', async () => {
        wrapper = createWrapper();

        await wrapper.selectListboxItemByValue('ledger-fantom');
        await delay(0);

        expect(wrapper.findComponent({ name: 'LedgerAccountPickerC' }).exists()).toBe(
            true
        );
    });

    /*it('should add metamask wallet', async () => {
        wrapper = createWrapper();
        const { wallet } = useWallet(true);

        await wrapper.selectListboxItemByValue('metamask');
        await delay(500);

        console.log('????', wallet.address);
    });*/

    it.skip('should show window message if metamask wallet is picked and picked account already exists', async () => {
        wrapper = createWrapper();

        await wrapper.selectListboxItemByValue('metamask');
        await wrapper.selectListboxItemByValue('metamask');
        await delay(0);

        const window = wrapper.findComponent({
            name: 'AddingExistingAccountWarningWindow',
        });
        expect(window.vm.$refs.window.isWindowVisible()).toBe(true);
    });

    it.skip('should emit "same-account-picked" event', async () => {
        wrapper = createWrapper();

        await wrapper.selectListboxItemByValue('metamask');
        await wrapper.selectListboxItemByValue('metamask');
        await delay(0);

        expect(wrapper.emitted('same-account-picked')).toBeDefined();
    });

    it('should re-emit "account-picked" event', async () => {
        wrapper = createWrapper();

        await wrapper.selectListboxItemByValue('metamask');
        await delay(0);

        wrapper.vm.restoreAccountWindow.$emit('account-picked');
        await delay(0);

        expect(wrapper.emitted('account-picked')).toBeDefined();
    });

    it('should re-emit "wallet-pick" event', async () => {
        wrapper = createWrapper();

        await wrapper.selectListboxItemByValue('software');
        await delay(0);

        expect(wrapper.emitted('wallet-pick')).toBeDefined();
    });

    it('should re-emit "window-hide" event of RestoreAccountWindow', async () => {
        wrapper = createWrapper();

        await wrapper.selectListboxItemByValue('software');
        await delay(0);

        wrapper.vm.restoreAccountWindow.hide();
        await delay(0);

        expect(wrapper.emitted('window-hide')).toBeDefined();
    });
});
