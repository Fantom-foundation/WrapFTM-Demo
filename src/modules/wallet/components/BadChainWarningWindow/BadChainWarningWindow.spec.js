import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import BadChainWarningWindow from './BadChainWarningWindow.vue';
import { i18n } from '@/config/i18n.js';
import { vi } from 'vitest';
import { WalletMock } from '@/modules/wallet/test-helpers.js';
import { delay } from 'fantom-vue3-components';

let wrapper = null;
let web3Wallet = null;

function createWrapper(options = { props: { chainId: '0xfa', web3Wallet: web3Wallet } }) {
    return mount(BadChainWarningWindow, {
        ...options,
        attachTo: document.body,
    });
}

beforeEach(() => {
    web3Wallet = new WalletMock();
});

afterEach(() => {
    vi.restoreAllMocks();
    web3Wallet = null;
    destroyWrapper(wrapper);
});

describe('BadChainWarningWindow', () => {
    it('should expose FWindow methods', () => {
        wrapper = createWrapper();

        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.show).toBeDefined();
        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.hide).toBeDefined();
        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.isWindowVisible).toBeDefined();
    });

    it('should display correct text', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();

        expect(wrapper.text()).toContain(
            i18n.t('wallet.badChainWarningWindow.switchChainMessage', {
                chainName: 'Fantom Opera',
            })
        );
    });

    it.skip('should display "add chain" text if switching fails', async () => {
        web3Wallet = new WalletMock({
            errors: { switchChain: 'Unrecognized chain ID' },
        });
        wrapper = createWrapper({
            props: {
                showSwitchChainButton: true,
                chainId: '0xfa',
                web3Wallet,
            },
        });

        await wrapper.showWindow();
        await wrapper.find('button').trigger('click');
        await delay();

        console.log(wrapper.html());

        expect(wrapper.text()).toContain(
            i18n.t('wallet.badChainWarningWindow.addChainMessage', {
                chainName: 'Fantom Opera',
            })
        );
    });
});
