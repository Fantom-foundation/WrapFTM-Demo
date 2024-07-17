import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import WalletList from '@/modules/wallet/components/WalletList/WalletList.vue';

let wrapper = null;
function WALLETS() {
    return [
        {
            label: 'Wallet_1',
            icon: 'metamask',
        },
        {
            name: 'wallet_2',
            description: 'foo',
        },
        {
            label: 'Wallet_3',
            // icon: '_test_',
        },
    ];
}

function createWrapper(options = {}) {
    return mount(WalletList, options);
}

beforeEach(() => {
    wrapper = createWrapper({
        props: {
            wallets: WALLETS(),
        },
    });
});

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('WalletList', () => {
    it('should display list of wallets', () => {
        const wallets = WALLETS();

        expect(wrapper.text()).toMatch(
            new RegExp(`${wallets[0].label}.*${wallets[1].name}.*${wallets[2].label}`)
        );
    });

    it('should display an icon', () => {
        expect(wrapper.findComponent({ name: 'AppIconset' }).exists()).toBe(true);
    });

    /*
    it('should display popover text if `description` property is set', () => {
        expect(wrapper.findComponent({ name: 'InfoPopover' }).exists()).toBe(
            true
        );
    });
*/

    it('should emit "wallet-pick" event when a wallet is picked', async () => {
        const wallets = WALLETS();

        wrapper.selectListboxItem(2);

        const emitted = wrapper.emitted('wallet-pick');

        expect(emitted[0][0].name).toEqual(wallets[1].name);
    });
});
