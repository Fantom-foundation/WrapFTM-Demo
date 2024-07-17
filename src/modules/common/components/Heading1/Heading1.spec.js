import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import Heading1 from './Heading1.vue';

let wrapper = null;

function createWrapper(options = {}) {
    return mount(Heading1, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('Heading1', () => {
    it('should has default slot', () => {
        wrapper = createWrapper({
            slots: {
                default: 'foo',
            },
        });

        expect(wrapper.text()).toContain('foo');
    });

    it('should has proper attributes by default', () => {
        wrapper = createWrapper();

        console.log(wrapper.html());

        expect(wrapper.attributes('data-focus')).toBeDefined();
        expect(wrapper.attributes('tabindex')).toBe('-1');
    });

    it('should be without any attribute if `noFocus` prop is true', () => {
        wrapper = createWrapper({
            props: {
                noFocus: true,
            },
        });

        expect(wrapper.attributes('data-focus')).toBeUndefined();
        expect(wrapper.attributes('tabindex')).toBeUndefined();
    });
});
