import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import HeadingWithBackButton from '@/modules/common/components/HeadingWithBackButton/HeadingWithBackButton.vue';

let wrapper = null;

function createWrapper(options = {}) {
    return mount(HeadingWithBackButton, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('HeadingWithBackButton', () => {
    it('should display custom heading', () => {
        wrapper = createWrapper({
            props: {
                heading: 'h4',
            },
        });

        expect(wrapper.find('h4').exists()).toBe(true);
    });

    it('should re-emit "back-button-click" event', async () => {
        wrapper = createWrapper();

        await wrapper.find('button').trigger('click');

        expect(wrapper.emitted('back-button-click')).toBeDefined();
    });

    it('should add custom title to the back button', () => {
        wrapper = createWrapper({
            props: {
                buttonTitle: 'foo',
            },
        });
        const button = wrapper.find('button');

        expect(button.attributes('title')).toBe('foo');
    });
});
