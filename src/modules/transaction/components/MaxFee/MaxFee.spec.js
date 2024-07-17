import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import MaxFee from './MaxFee.vue';

let wrapper = null;

function createWrapper(options = {}) {
    return mount(MaxFee, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('MaxFee', () => {
    it('should display max fee according to given gas price and limit', () => {
        wrapper = createWrapper({
            props: {
                gasPrice: '0x3B9ACA00',
                gasLimit: '0x5208',
            },
        });

        expect(wrapper.text()).toContain('0.000021FTM');
    });

    it('should set maximum fraction digits', () => {
        wrapper = createWrapper({
            props: {
                gasPrice: 1000000000,
                gasLimit: 123456,
                maximumFractionDigits: 9,
            },
        });

        expect(wrapper.text()).toContain('0.000123456FTM');
    });
});
