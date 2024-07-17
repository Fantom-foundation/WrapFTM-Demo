import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import TokenListC from './TokenListC.vue';
import { TEST_ACCOUNT_ADDRESS } from '@/plugins/web3-wallets/test-helpers.js';
import { vi } from 'vitest';
import { delay } from 'fantom-vue3-components';

let wrapper = null;
function TOKENS() {
    return [
        {
            symbol: 'fUSD',
            name: 'fUSD',
            logo: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=003',
            decimals: 18,
            address: '0xaabe370d5312f44cb42ce377bc9b8a0cef1a4c83',
            // balance: '0x6B14BD1E6EEA00000', // 123.456
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

async function getBalance({ tokenAddress }) {
    if (tokenAddress === '0xaabe370d5312f44cb42ce377bc9b8a0cef1a4c83') {
        return '0x6B14BD1E6EEA00000'; // 123.45
    } else if (tokenAddress === '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83') {
        return '0x55DE6A779BBAC0000'; // 99
    }

    return '';
}

function createWrapper(options) {
    return mount(TokenListC, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
    vi.resetAllMocks();
});

describe('TokenListC', () => {
    it('should display TokenList component', () => {
        wrapper = createWrapper({
            props: {
                tokens: TOKENS(),
                accountAddress: TEST_ACCOUNT_ADDRESS,
                actions: {
                    getBalance,
                },
            },
        });

        expect(wrapper.findComponent({ name: 'TokenList' }).exists()).toBe(true);
    });

    it('should load balances if address and `getBalance` function is given', async () => {
        const getBalanceSpy = vi.fn(getBalance);

        wrapper = createWrapper({
            props: {
                tokens: TOKENS(),
                accountAddress: TEST_ACCOUNT_ADDRESS,
                actions: {
                    getBalance: getBalanceSpy,
                },
            },
        });

        await delay();

        const text = wrapper.text();
        expect(getBalanceSpy).toHaveBeenCalledWith({
            accountAddress: TEST_ACCOUNT_ADDRESS,
            tokenAddress: '0xaabe370d5312f44cb42ce377bc9b8a0cef1a4c83',
        });
        expect(text).toContain('123.46');
        expect(text).toContain('99');
    });

    it('should not load balances if `hideBalance` prop is set to true', async () => {
        const getBalanceSpy = vi.fn(getBalance);

        wrapper = createWrapper({
            props: {
                hideBalance: true,
                tokens: TOKENS(),
                accountAddress: TEST_ACCOUNT_ADDRESS,
                actions: {
                    getBalance: getBalanceSpy,
                },
            },
        });

        await delay();

        const text = wrapper.text();
        expect(getBalanceSpy).toHaveBeenCalledTimes(0);
        expect(text).not.toContain('123.45');
    });

    it('should re-emit "token-pick" event', async () => {
        const tokens = TOKENS();
        wrapper = createWrapper({
            props: {
                tokens: TOKENS(),
                accountAddress: TEST_ACCOUNT_ADDRESS,
                actions: {
                    getBalance,
                },
            },
        });

        await wrapper.selectListboxItem(1);

        expect(wrapper.emitted('token-pick')[0][0]).toEqual(
            expect.objectContaining(tokens[0])
        );
    });
});
