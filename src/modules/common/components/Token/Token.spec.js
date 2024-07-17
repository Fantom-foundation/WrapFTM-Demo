import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import Token from './Token.vue';

let wrapper = null;

function createWrapper(options = {}) {
    return mount(Token, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('Token', () => {
    it('should wrap FToken', () => {
        wrapper = createWrapper({
            props: {
                value: 123456.789,
                symbol: 'FTM',
                maximumFractionDigits: 2,
                logo: 'logo.png',
            },
        });

        expect(wrapper.text()).toContain('123,456.79FTM');
    });

    it('should correctly display token value with given decimal places and `convert` set to `true`', async () => {
        wrapper = createWrapper({
            props: {
                value: '1000000000000000000',
                convert: true,
                decimals: 18,
                symbol: 'FTM',
            },
        });

        expect(wrapper.text()).toContain('1FTM');

        await wrapper.setProps({ value: '0xDE0B6B3A7640000' });

        expect(wrapper.text()).toContain('1FTM');
    });

    it('should correctly display token value with given token and `convert` set to `true`', async () => {
        wrapper = createWrapper({
            props: {
                value: '1000000000000000000',
                convert: true,
                token: {
                    decimals: 18,
                    symbol: 'FTM',
                },
            },
        });

        expect(wrapper.text()).toContain('1FTM');

        await wrapper.setProps({ value: '0xDE0B6B3A7640000' });

        expect(wrapper.text()).toContain('1FTM');
    });
});
