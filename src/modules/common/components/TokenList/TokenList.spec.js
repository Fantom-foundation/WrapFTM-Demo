import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import TokenList from './TokenList.vue';
import { nextTick, ref } from 'vue';

let wrapper = null;
function TOKENS() {
    return [
        {
            symbol: 'fUSD',
            name: 'Frapped USD',
            logo: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=003',
            decimals: 18,
            address: '0xaabe370d5312f44cb42ce377bc9b8a0cef1a4c83',
            balance: '0x6B14BD1E6EEA00000', // 123.456
        },
        {
            symbol: 'wFTM',
            name: 'Wrapped FTM',
            logo: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=003',
            decimals: 18,
            address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
        },
    ];
}

function createWrapper(
    options = {
        props: {
            tokens: TOKENS(),
        },
    }
) {
    return mount(TokenList, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('TokenList', () => {
    it('should display tokens symbols', () => {
        wrapper = createWrapper();

        const text = wrapper.text();

        expect(text).toContain('fUSD');
        expect(text).toContain('wFTM');
    });

    it('should display tokens names', () => {
        wrapper = createWrapper();

        const text = wrapper.text();

        expect(text).toContain('Frapped USD');
        expect(text).toContain('Wrapped FTM');
    });

    it('should display tokens logos', () => {
        wrapper = createWrapper();

        expect(wrapper.findAll('img').length).toBe(2);
    });

    it('should display token balance', () => {
        wrapper = createWrapper();

        expect(wrapper.text()).toContain('123.46');
    });

    it('should hide token balance if `hideBalance` prop is set to true', () => {
        wrapper = createWrapper({
            props: {
                hideBalance: true,
                tokens: TOKENS(),
            },
        });

        expect(wrapper.text()).not.toContain('123.46');
    });

    it('should display correct balance if balance of the token is changed', async () => {
        const tokens = ref(TOKENS());
        wrapper = createWrapper({
            props: { tokens: tokens.value },
        });

        tokens.value[1].balance = '0x55DE6A779BBAC0000';
        await nextTick();

        expect(wrapper.text()).toContain('99');
    });

    it('should emit "token-pick" event when a token is selected', async () => {
        const tokens = TOKENS();
        wrapper = createWrapper();

        await wrapper.selectListboxItem(2);

        expect(wrapper.emitted('token-pick')[0][0]).toEqual(
            expect.objectContaining(tokens[1])
        );
    });
});
