import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import TextDirectionSwitch from './TextDirectionSwitch.vue';
import { FToggleButton } from 'fantom-vue3-components';
import { useAppStore } from '@/modules/app/store/store.js';
import { setUpTestLocales } from '@/config/test/locale.js';

let wrapper = null;
const store = useAppStore();

function createWrapper(options = {}) {
    return mount(TextDirectionSwitch, options);
}

beforeAll(() => {
    setUpTestLocales({ store });
});

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('TextDirectionSwitch', () => {
    it('should be checked according to the `rtlDirection` value from the store', () => {
        store.rtlDirection = true;
        wrapper = createWrapper();
        const checkbox = wrapper.findComponent(FToggleButton).find('input').element;

        expect(checkbox.checked).toBe(true);
    });

    it('should change `rtlDirection` value in the store if switch is toggled', async () => {
        store.rtlDirection = false;
        wrapper = createWrapper();

        await wrapper.findComponent(FToggleButton).toggleCheckbox();

        expect(store.rtlDirection).toBe(true);
    });
});
