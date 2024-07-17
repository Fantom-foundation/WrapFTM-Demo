import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import UnderMaintenance from './UnderMaintenance.vue';

let wrapper = null;

function createWrapper(options = {}) {
    return mount(UnderMaintenance, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('UnderMaintenance', () => {
    it('should match snapshot', async () => {
        wrapper = createWrapper();

        expect(wrapper.element).toMatchSnapshot();
    });
});
