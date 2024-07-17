import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import View404 from './View404.vue';

let wrapper = null;

function createWrapper(options = {}) {
    return mount(View404, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('View404', () => {
    it('should match snapshot', () => {
        wrapper = createWrapper();

        expect(wrapper.element).toMatchSnapshot();
    });
});
