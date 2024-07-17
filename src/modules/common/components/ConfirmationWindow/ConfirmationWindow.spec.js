import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import ConfirmationWindow from './ConfirmationWindow.vue';
import { nextTick } from 'vue';

let wrapper = null;

function BUTTONS() {
    return [
        {
            action: 'cancel',
            label: 'Cancel',
            secondary: true,
        },
        {
            action: 'action',
            label: 'Action',
        },
    ];
}

function createWrapper(
    options = {
        props: {
            buttons: BUTTONS(),
        },
    }
) {
    return mount(ConfirmationWindow, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('ConfirmationWindow', () => {
    it('should have default slot representing number slot', async () => {
        wrapper = createWrapper({
            slots: {
                default: 'text slot',
            },
            props: {
                buttons: BUTTONS(),
            },
        });

        await wrapper.showWindow();

        expect(wrapper.text()).toContain('text slot');
    });

    it('should hide window on an action button click', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();
        await wrapper.findByTestId('action_button_cancel').trigger('click');
        await nextTick();

        expect(wrapper.vm.$refs.window.isWindowVisible()).toBe(false);
    });

    it('should re-emit "button-action" event', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();
        await wrapper.findByTestId('action_button_action').trigger('click');
        await nextTick();

        expect(wrapper.emitted('button-action')[0]).toEqual(['action']);
    });

    it('should re-emit "window-hide" event', async () => {
        wrapper = createWrapper();

        await wrapper.showWindow();
        await wrapper.findByTestId('action_button_action').trigger('click');
        await nextTick();

        expect(wrapper.emitted('window-hide')[0]).toBeDefined();
    });

    it('should expose FWindow methods', () => {
        wrapper = createWrapper();

        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.show).toBeDefined();
        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.hide).toBeDefined();
        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.isWindowVisible).toBeDefined();
    });
});
