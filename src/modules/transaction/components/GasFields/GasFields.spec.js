import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import GasFields from './GasFields.vue';
import { FForm } from 'fantom-vue3-components';
import { nextTick } from 'vue';
import { i18n } from '@/config/i18n.js';

let wrapper = null;

const Playground = {
    components: { FForm, GasFields },
    props: ['gasPrice', 'gasLimit', 'throttleInputInterval'],
    template: `
        <FForm @submit="$emit('submit', $event)">
          <GasFields
              :gas-price="gasPrice"
              :gas-limit="gasLimit"
              :throttle-input-interval="throttleInputInterval"
              @update:value="$emit('update:value', $event)"
          />
          <button type="submit">Submit</button>
        </FForm>
    `,
};

function createPlaygroundWrapper(options = {}) {
    return mount(Playground, { ...options, attachTo: document.body });
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('GasFields', () => {
    it('should enter given gas price into input field, converted to GWEI', async () => {
        wrapper = createPlaygroundWrapper({
            props: {
                gasPrice: '0x49504F80', // 1230000000
            },
        });

        expect(wrapper.find('input[name="gasPrice"]').element.value).toBe('1.23');
    });

    it('should enter given gas limit into input field, converted to int', async () => {
        wrapper = createPlaygroundWrapper({
            props: {
                gasLimit: '0x5208', // 21000
            },
        });

        expect(wrapper.find('input[name="gasLimit"]').element.value).toBe('21000');
    });

    it.skip('should convert gas price output to hex in WEI', async () => {
        wrapper = createPlaygroundWrapper();
        await nextTick();

        await wrapper.setFormElements({
            gasPrice: 1.23,
            gasLimit: 21000,
        });
        await wrapper.submitForm();

        expect(wrapper.emitted('submit')[1][0].values).toEqual({
            gasPrice: '0x49504f80',
            gasLimit: '0x5208',
        });
    });

    it.skip('should convert gas limit output to hex', async () => {
        wrapper = createPlaygroundWrapper();
        await nextTick();

        await wrapper.setFormElements({
            gasPrice: 1.23,
            gasLimit: 21000,
        });
        await wrapper.submitForm();

        expect(wrapper.emitted('submit')[1][0].values).toEqual({
            gasPrice: '0x49504f80',
            gasLimit: '0x5208',
        });
    });

    it('should validate given address on input event', async () => {
        wrapper = createPlaygroundWrapper({
            props: {
                throttleInputInterval: 0,
            },
        });

        await wrapper.setFormElement('gasPrice', 'foo');

        expect(wrapper.text()).toContain(i18n.t('transaction.gasFields.errorMessage'));
    });

    it('should emit throttled `update:value` event with gas price and limit values', async () => {
        wrapper = createPlaygroundWrapper({
            props: {
                throttleInputInterval: 0,
            },
        });
        await nextTick();

        await wrapper.setFormElements({
            gasPrice: 1.23,
            gasLimit: 21000,
        });

        expect(wrapper.emitted('update:value')[0][0]).toEqual({
            gasPrice: '0x49504f80',
            gasLimit: '0x5208',
        });
    });

    it('should emit `update:value` event if one of the values is not presented', async () => {
        wrapper = createPlaygroundWrapper({
            props: {
                throttleInputInterval: 0,
            },
        });
        await nextTick();

        await wrapper.setFormElements({
            gasPrice: 1.23,
            gasLimit: '',
        });

        expect(wrapper.emitted('update:value')).toBeFalsy();
    });
});
