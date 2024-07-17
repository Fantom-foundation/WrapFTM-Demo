import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import AddChainButton from './AddChainButton.vue';
import { FTM_TOKEN } from '@/config/tokens.js';
import { WalletMock } from '@/modules/wallet/test-helpers.js';
import { vi } from 'vitest';
import { delay } from 'fantom-vue3-components';

let wrapper = null;
let web3Wallet = null;

const CHAIN = {
    chainId: '0xfa',
    name: 'Fantom Opera',
    code: 'fantom_mainnet',
    currencySymbol: 'FTM',
    nativeToken: FTM_TOKEN(),
    rpcUrl: 'https://rpc.ftm.tools/',
    explorerUrl: 'https://ftmscan.com',
};

function createWrapper(options = {}) {
    return mount(AddChainButton, options);
}

beforeEach(() => {
    web3Wallet = new WalletMock();
});

afterEach(() => {
    destroyWrapper(wrapper);
    web3Wallet = null;
    vi.resetAllMocks();
});

describe('AddChainButton', () => {
    it('should display "add" label with chain name', () => {
        wrapper = createWrapper({
            props: {
                chain: CHAIN,
                web3Wallet,
            },
        });

        expect(wrapper.text()).toContain(`Add Fantom Opera chain`);
    });

    it('should display "switch" label with chain name if `switchChain` prop is true', () => {
        wrapper = createWrapper({
            props: {
                switchChain: true,
                chain: CHAIN,
                web3Wallet,
            },
        });

        expect(wrapper.text()).toContain(`Switch to Fantom Opera chain`);
    });

    describe('adding a chain', () => {
        it('should add chain', async () => {
            wrapper = createWrapper({
                props: {
                    chain: CHAIN,
                    web3Wallet,
                },
            });
            const addChainSpy = vi.spyOn(web3Wallet, 'addChain');

            await wrapper.find('button').trigger('click');

            expect(addChainSpy).toHaveBeenCalledWith('0xfa');
        });

        it('should display disabled button with loader while adding a chain', async () => {
            web3Wallet = new WalletMock({ delays: { addChain: 0 } });
            wrapper = createWrapper({
                props: {
                    chain: CHAIN,
                    web3Wallet,
                },
            });
            const fButton = wrapper.findComponent({ name: 'FButton' });
            await fButton.trigger('click');

            expect(fButton.element.disabled).toBe(true);
            expect(fButton.props('loading')).toBe(true);
        });

        it('should enable button and hide loader when adding of chain is done', async () => {
            web3Wallet = new WalletMock({ delays: { addChain: 0 } });
            wrapper = createWrapper({
                props: {
                    chain: CHAIN,
                    web3Wallet,
                },
            });
            const fButton = wrapper.findComponent({ name: 'FButton' });
            await fButton.trigger('click');

            await delay();

            expect(fButton.element.disabled).toBe(false);
            expect(fButton.props('loading')).toBe(false);
        });

        it('should emit "action" event with action "adding-chain" while adding a chain', async () => {
            web3Wallet = new WalletMock({ delays: { addChain: 0 } });
            wrapper = createWrapper({
                props: {
                    chain: CHAIN,
                    web3Wallet,
                },
            });

            await wrapper.find('button').trigger('click');

            expect(wrapper.emitted('action')[0][0]).toBe('adding-chain');
        });

        it('should emit "action" event with empty string when adding of chain is done', async () => {
            web3Wallet = new WalletMock({ delays: { addChain: 0 } });
            wrapper = createWrapper({
                props: {
                    chain: CHAIN,
                    web3Wallet,
                },
            });

            await wrapper.find('button').trigger('click');
            await delay();

            expect(wrapper.emitted('action')[1][0]).toBe('');
        });
    });

    describe('switching a chain', () => {
        it('should switch chain', async () => {
            wrapper = createWrapper({
                props: {
                    switchChain: true,
                    chain: CHAIN,
                    web3Wallet,
                },
            });
            const switchChainSpy = vi.spyOn(web3Wallet, 'switchChain');

            await wrapper.find('button').trigger('click');

            expect(switchChainSpy).toHaveBeenCalledWith('0xfa');
        });

        it('should add chain if switching ends with error message containing "Unrecognized chain ID"', async () => {
            web3Wallet = new WalletMock({
                errors: { switchChain: 'Unrecognized chain ID' },
            });
            wrapper = createWrapper({
                props: {
                    switchChain: true,
                    chain: CHAIN,
                    web3Wallet,
                },
            });
            const addChainSpy = vi.spyOn(web3Wallet, 'addChain');

            await wrapper.find('button').trigger('click');
            await delay();

            expect(addChainSpy).toHaveBeenCalledWith('0xfa');
        });

        it('should add chain if switching ends with error message containing "not approved"', async () => {
            web3Wallet = new WalletMock({
                errors: { switchChain: 'not approved' },
            });
            wrapper = createWrapper({
                props: {
                    switchChain: true,
                    chain: CHAIN,
                    web3Wallet,
                },
            });
            const addChainSpy = vi.spyOn(web3Wallet, 'addChain');

            await wrapper.find('button').trigger('click');
            await delay();

            expect(addChainSpy).toHaveBeenCalledWith('0xfa');
        });

        it('should display disabled button with loader while switching chain', async () => {
            web3Wallet = new WalletMock({ delays: { switchChain: 0 } });
            wrapper = createWrapper({
                props: {
                    switchChain: true,
                    chain: CHAIN,
                    web3Wallet,
                },
            });
            const fButton = wrapper.findComponent({ name: 'FButton' });
            await fButton.trigger('click');

            expect(fButton.element.disabled).toBe(true);
            expect(fButton.props('loading')).toBe(true);
        });

        it('should enable button and hide loader when switching of chain is done', async () => {
            web3Wallet = new WalletMock({ delays: { switchChain: 0 } });
            wrapper = createWrapper({
                props: {
                    switchChain: true,
                    chain: CHAIN,
                    web3Wallet,
                },
            });
            const fButton = wrapper.findComponent({ name: 'FButton' });
            await fButton.trigger('click');

            await delay();

            expect(fButton.element.disabled).toBe(false);
            expect(fButton.props('loading')).toBe(false);
        });

        it('should emit "action" event with action "switching-chain" while adding a chain', async () => {
            web3Wallet = new WalletMock({ delays: { switchChain: 0 } });
            wrapper = createWrapper({
                props: {
                    switchChain: true,
                    chain: CHAIN,
                    web3Wallet,
                },
            });

            await wrapper.find('button').trigger('click');

            expect(wrapper.emitted('action')[0][0]).toBe('switching-chain');
        });

        it('should emit "action" event with empty string when switching of chain is done', async () => {
            web3Wallet = new WalletMock({ delays: { addChain: 0 } });
            wrapper = createWrapper({
                props: {
                    switchChain: true,
                    chain: CHAIN,
                    web3Wallet,
                },
            });

            await wrapper.find('button').trigger('click');
            await delay();

            expect(wrapper.emitted('action')[1][0]).toBe('');
        });
    });
});
