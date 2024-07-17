import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import TokenPicker from './TokenPicker.vue';

describe('TokenPicker', () => {
    it('should display disabled button with no icon if `tokens` are an empty array', async () => {
        wrapper = createWrapper();

        const button = wrapper.find('button');
        expect(button.element.disabled).toBe(true);
        expect(button.find('svg').exists()).toBe(false);
    });

    it('should display disabled button with no icon if `tokens` array has 1 item', async () => {
        wrapper = createWrapper({
            props: {
                tokens: [TOKENS()[0]],
            },
        });

        const button = wrapper.find('button');
        expect(button.element.disabled).toBe(true);
    });

    it('should not display icon if `tokens` array has 1 item', async () => {
        wrapper = createWrapper({
            props: {
                tokens: [TOKENS()[0]],
            },
        });

        const button = wrapper.find('button');
        expect(button.find('svg').exists()).toBe(false);
    });

    it('should display icon if `tokens` array has more than 1 item', async () => {
        wrapper = createWrapper({
            props: {
                tokens: TOKENS(),
            },
        });

        const button = wrapper.find('button');
        expect(button.find('svg').exists()).toBe(true);
    });

    it('should display given selected token', async () => {
        wrapper = createWrapper({
            props: {
                token: TOKENS()[1],
            },
        });

        expect(wrapper.text()).toContain('wFTM');
        expect(wrapper.find('img').exists()).toBe(true);
    });

    it('should display token name instead of token symbol if `showTokenName` is true', async () => {
        wrapper = createWrapper({
            props: {
                showTokenName: true,
                token: TOKENS()[1],
            },
        });

        expect(wrapper.text()).toContain('Wrapped FTM');
    });

    it('should display balance of the token', async () => {
        wrapper = createWrapper({
            props: {
                showBalanceOnButton: true,
                token: TOKENS()[1],
            },
        });

        expect(wrapper.text()).toContain('1wFTM');
    });

    it('should display updated selected token', async () => {
        wrapper = createWrapper({
            props: {
                token: TOKENS()[0],
            },
        });

        await wrapper.setProps({ token: TOKENS()[1] });

        expect(wrapper.text()).toContain('wFTM');
        expect(wrapper.find('img').exists()).toBe(true);
    });

    it('should select first token if `tokens` array is not empty and no `token` is given', async () => {
        wrapper = createWrapper({
            props: {
                tokens: TOKENS(),
            },
        });

        expect(wrapper.text()).toContain('fUSD');
        expect(wrapper.find('img').exists()).toBe(true);
    });

    it('should display picked token', async () => {
        wrapper = createWrapper({
            props: {
                tokens: TOKENS(),
            },
        });

        await wrapper.find('button').trigger('click');
        await wrapper.selectListboxItem(2);

        expect(wrapper.text()).toContain('wFTM');
        expect(wrapper.find('img').exists()).toBe(true);
    });

    it('should re-emit "token-pick" event', async () => {
        const tokens = TOKENS();
        wrapper = createWrapper({
            props: {
                tokens,
            },
        });

        await wrapper.find('button').trigger('click');
        await wrapper.selectListboxItem(2);

        expect(wrapper.emitted('token-pick')[0][0]).toEqual(
            expect.objectContaining(tokens[1])
        );
    });
});

let wrapper = null;

function TOKENS() {
    return [
        {
            symbol: 'fUSD',
            name: 'Frapped USD',
            logo: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=003',
            decimals: 18,
            address: '0xaabe370d5312f44cb42ce377bc9b8a0cef1a4c83',
        },
        {
            symbol: 'wFTM',
            name: 'Wrapped FTM',
            logo: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=003',
            decimals: 18,
            address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
            balance: '0xDE0B6B3A7640000',
        },
    ];
}

function createWrapper(options = {}) {
    return mount(TokenPicker, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});
