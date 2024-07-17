import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import AddTokenButton from './AddTokenButton.vue';
import { WalletMock } from '@/modules/wallet/test-helpers.js';
import { vi } from 'vitest';
import { delay } from 'fantom-vue3-components';

let wrapper = null;
let web3Wallet = null;

function TOKEN(fusd = false) {
    return !fusd
        ? {
              symbol: 'wFTM',
              name: 'Wrapped Fantom',
              logo: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=003',
              decimals: 18,
              address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
          }
        : {
              symbol: 'fUSD',
              name: 'Fantom USD',
              image: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=003',
              decimals: 18,
              address: '0xaabe370d5312f44cb42ce377bc9b8a0cef1a4c83',
          };
}

function createWrapper(options = {}) {
    return mount(AddTokenButton, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

beforeEach(() => {
    web3Wallet = new WalletMock();
});

afterEach(() => {
    destroyWrapper(wrapper);
    web3Wallet = null;
    vi.resetAllMocks();
});
describe('AddTokenButton', () => {
    it('should display "add" label with token name', () => {
        wrapper = createWrapper({
            props: {
                token: TOKEN(),
                web3Wallet,
            },
        });

        expect(wrapper.text()).toContain(`Add Wrapped Fantom to Metamask`);
    });

    it('should display "add" label with token symbol', () => {
        wrapper = createWrapper({
            props: {
                useSymbol: true,
                token: TOKEN(),
                web3Wallet,
            },
        });

        expect(wrapper.text()).toContain(`Add wFTM to Metamask`);
    });

    it('should display custom label', () => {
        wrapper = createWrapper({
            props: {
                label: 'Foo label',
                token: TOKEN(),
                web3Wallet,
            },
        });

        expect(wrapper.text()).toContain('Foo label');
    });

    it('should add token', async () => {
        const token = TOKEN();
        wrapper = createWrapper({
            props: {
                token,
                web3Wallet,
            },
        });
        const addChainSpy = vi.spyOn(web3Wallet, 'addToken');

        await wrapper.find('button').trigger('click');
        await delay();
        await delay();
        await delay();

        expect(addChainSpy).toHaveBeenCalledWith({
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
            image: token.logo,
        });
    });

    it('should expose `addToken` function', () => {
        wrapper = createWrapper();

        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.addToken).toBeDefined();
    });
});
