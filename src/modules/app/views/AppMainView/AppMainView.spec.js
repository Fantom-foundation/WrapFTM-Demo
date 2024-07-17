import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import AppMain from '@/modules/app/views/AppMainView/AppMainView.vue';

function createWrapper(options = { stubs: { Header: true } }) {
    return mount(AppMain, options);
}

let wrapper = null;

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('AppMain', () => {
    it('should display header', () => {
        wrapper = createWrapper();

        expect(wrapper.findComponent({ name: 'Header' }).exists()).toBe(true);
    });
});
