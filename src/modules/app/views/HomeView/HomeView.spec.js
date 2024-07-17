import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import HomeView from '@/modules/app/views/HomeView/HomeView.vue';

function createWrapper(options = { stubs: { Header: true } }) {
    return mount(HomeView, options);
}

let wrapper = null;

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('HomeView', () => {
    it('should display wrap station', () => {
        wrapper = createWrapper();

        expect(wrapper.findComponent({ name: 'WrapStationView' }).exists()).toBe(true);
    });
});
