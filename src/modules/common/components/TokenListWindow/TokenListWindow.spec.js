import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import TokenListWindow from './TokenListWindow.vue';
import { TEST_ACCOUNT_ADDRESS } from '@/plugins/web3-wallets/test-helpers.js';

let wrapper = null;
function TOKENS() {
    return [
        {
            symbol: 'fUSD',
            name: 'fUSD',
            logo: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=003',
            decimals: 18,
            address: '0xaabe370d5312f44cb42ce377bc9b8a0cef1a4c83',
            // balance: '0x6B14BD1E6EEA00000', // 123.45
        },
        {
            symbol: 'wFTM',
            name: 'wFTM',
            logo: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=003',
            decimals: 18,
            address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
        },
    ];
}

async function fetchBalance({ tokenAddress }) {
    if (tokenAddress === '0xaabe370d5312f44cb42ce377bc9b8a0cef1a4c83') {
        return '0x6B14BD1E6EEA00000'; // 123.45
    } else if (tokenAddress === '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83') {
        return '0x55DE6A779BBAC0000'; // 99
    }

    return '';
}

function createWrapper(
    options = {
        props: {
            tokens: TOKENS(),
            accountAddress: TEST_ACCOUNT_ADDRESS,
            fetchBalance,
        },
    }
) {
    return mount(TokenListWindow, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('TokenListWindow', () => {
    it('should display TokenListC component', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();

        expect(wrapper.findComponent({ name: 'TokenListC' }).exists()).toBe(true);
    });

    it('should re-emit "token-pick" event', async () => {
        const tokens = TOKENS();
        wrapper = createWrapper();

        await wrapper.showWindow();
        await wrapper.selectListboxItem(2);

        expect(wrapper.emitted('token-pick')[0][0]).toEqual(
            expect.objectContaining(tokens[1])
        );
    });

    it('should hide window when token is picked', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();
        await wrapper.selectListboxItem(2);

        expect(wrapper.vm.$refs.window.isWindowVisible()).toBe(false);
    });

    it('should expose FWindow methods', () => {
        wrapper = createWrapper();

        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.show).toBeDefined();
        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.hide).toBeDefined();
    });
});
