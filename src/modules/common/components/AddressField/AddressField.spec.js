import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import AddressField from './AddressField.vue';
import { i18n } from '@/config/i18n.js';

const ADDRESS = '0xeb57521b52E1102eE6B1422BA3A6F53D0C9E18cb';
const NAME = 'valid_name';
let wrapper = null;

function addressResolver(value, valueIsAddress = false) {
    const result = {
        address: '',
        name: '',
    };

    if (valueIsAddress) {
        if (value === ADDRESS) {
            result.address = ADDRESS;
            result.name = NAME;
        }
    } else {
        if (value === NAME) {
            result.address = ADDRESS;
            result.name = NAME;
        }
    }

    return result;
}

function createWrapper(options = {}) {
    return mount(AddressField, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('AddressField', () => {
    it('should display input field', () => {
        wrapper = createWrapper();

        expect(wrapper.find('input').exists()).toBe(true);
    });

    it('should validate given address on input event', async () => {
        wrapper = createWrapper({ props: { throttleInputInterval: 0 } });

        await wrapper.find('input').setValue('foo');

        expect(wrapper.emitted('validation-state')).toBeTruthy();
        expect(wrapper.text()).toContain(
            i18n.t('common.addressField.invalidAddressErrMessage')
        );
    });

    it('should display found address in input field if address resolver is given and right name is entered', async () => {
        wrapper = createWrapper({
            props: { addressResolver, throttleInputInterval: 0 },
        });
        const input = wrapper.find('input');

        await input.setValue(NAME);

        expect(input.element.value).toContain(ADDRESS);
    });

    it('should display entered name on input event if address resolver is given and right name is entered', async () => {
        wrapper = createWrapper({
            props: { addressResolver, throttleInputInterval: 0 },
        });
        const input = wrapper.find('input');

        await input.setValue(NAME);

        expect(wrapper.text()).toContain(NAME);
    });

    it('should display entered name on input event if address resolver is given and right address is entered', async () => {
        wrapper = createWrapper({
            props: { addressResolver, throttleInputInterval: 0 },
        });
        const input = wrapper.find('input');

        await input.setValue(ADDRESS);

        expect(wrapper.text()).toContain(NAME);
    });

    it('should expose `validate` method', () => {
        wrapper = createWrapper();

        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.validate).toBeDefined();
    });
});
