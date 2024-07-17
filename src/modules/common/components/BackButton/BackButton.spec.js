import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import BackButton from '@/modules/common/components/BackButton/BackButton.vue';
import { FViewSwitcher } from 'fantom-vue3-components';
import { markRaw, nextTick } from 'vue';

let wrapper = null;
const VIEW_SWITCHER_ID = 'switcher-id';
function APP_STRUCTURE() {
    return [
        {
            id: 'Component',
            type: 'component',
            _c: [
                {
                    id: 'ComponentWithBackButton',
                    type: 'component',
                },
            ],
        },
    ];
}

// defineComponent()
const Component = markRaw({
    name: 'Component',
    template: `<div></div>`,
});

const ComponentWithBackButton = markRaw({
    name: 'ComponentWithBackButton',
    components: { BackButton },
    template: `<div><BackButton :view-switcher-id="viewSwitcherId" component-id="ComponentWithBackButton" /></div>`,
    data() {
        return {
            viewSwitcherId: VIEW_SWITCHER_ID,
        };
    },
});

const Playground = {
    components: { FViewSwitcher, Component, ComponentWithBackButton },
    template: `
        <FViewSwitcher
            :id="viewSwitcherId"
            :app-structure="appStructure"
            :components="components"
            default-component="ComponentWithBackButton"
        />
    `,
    data() {
        return {
            viewSwitcherId: VIEW_SWITCHER_ID,
            appStructure: APP_STRUCTURE(),
            components: { Component, ComponentWithBackButton },
        };
    },
};

function createWrapper(options = {}) {
    return mount(BackButton, options);
}

function createPlayground(options = {}) {
    return mount(Playground, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('BackButton', () => {
    it('should match snapshot', () => {
        wrapper = createWrapper();

        expect(wrapper.element).toMatchSnapshot();
    });

    it('should go to parent component if "viewSwitcherId" and "componentId" props are given', async () => {
        wrapper = createPlayground();

        await wrapper.findComponent(BackButton).trigger('click');
        await nextTick();

        expect(wrapper.findComponent(Component).exists()).toBe(true);
    });

    it('should emit "back-button-click" event', async () => {
        wrapper = createWrapper();

        await wrapper.find('button').trigger('click');

        expect(wrapper.emitted('back-button-click')).toBeDefined();
    });
});
