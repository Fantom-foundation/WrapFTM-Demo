import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import AutoDarkThemeSwitch from './AutoDarkThemeSwitch.vue';
import { useAppStore } from '@/modules/app/store/store.js';
import { FToggleButton } from 'fantom-vue3-components';

let wrapper = null;
const store = useAppStore();

function createWrapper(options = {}) {
    return mount(AutoDarkThemeSwitch, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('AutoDarkThemeSwitch', () => {
    it('should be checked according to the `autoDarkTheme` value from the store', () => {
        store.autoDarkTheme = true;
        wrapper = createWrapper();
        const checkbox = wrapper.findComponent(FToggleButton).find('input').element;

        expect(checkbox.checked).toBe(true);
    });

    it('should change `autoDarkTheme` value in the store if switch is toggled', async () => {
        store.autoDarkTheme = false;
        wrapper = createWrapper();

        await wrapper.findComponent(FToggleButton).toggleCheckbox();

        expect(store.autoDarkTheme).toBe(true);
    });
});
