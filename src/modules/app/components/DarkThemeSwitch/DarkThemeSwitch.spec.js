import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import DarkThemeSwitch from './DarkThemeSwitch.vue';
import { useAppStore } from '@/modules/app/store/store.js';
import { FDarkThemeSwitch } from 'fantom-vue3-components';

let wrapper = null;
const store = useAppStore();

function createWrapper(options = {}) {
    return mount(DarkThemeSwitch, options);
}

beforeEach(() => {
    store.theme = 'theme-default';
});

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('DarkThemeSwitch', () => {
    it('should be checked according to the theme from the store', () => {
        store.theme = 'theme-dark';
        wrapper = createWrapper();
        const checkbox = wrapper.findComponent(FDarkThemeSwitch).find('input').element;

        expect(checkbox.checked).toBe(true);
    });

    it('should change theme value in the store if switch is toggled', async () => {
        wrapper = createWrapper();

        await wrapper.findComponent(FDarkThemeSwitch).toggleCheckbox();

        expect(store.theme).toBe('theme-dark');
    });
});
