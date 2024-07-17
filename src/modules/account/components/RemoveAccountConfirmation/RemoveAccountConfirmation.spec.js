import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import RemoveAccountConfirmation from '@/modules/account/components/RemoveAccountConfirmation/RemoveAccountConfirmation.vue';
import { TEST_ACCOUNT_ADDRESS } from '@/plugins/web3-wallets/test-helpers.js';

let wrapper = null;

function createWrapper(options = { props: { address: TEST_ACCOUNT_ADDRESS } }) {
    return mount(RemoveAccountConfirmation, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('RemoveAccountConfirmation', () => {
    it.todo('should match snapshot', () => {
        wrapper = createWrapper();

        expect(wrapper.element).toMatchSnapshot();
    });

    it('should emit "button-action" event with object {action: "cancel"} as an argument by clicking "Cancel" button', async () => {
        wrapper = createWrapper();
        const cancelButton = wrapper.findByTestId('action_button_cancel');

        await cancelButton.trigger('click');

        expect(wrapper.emitted('button-action')[0]).toEqual([{ action: 'cancel' }]);
    });

    it('should emit "button-action" event with object {action: "remove"} as an argument by clicking "Remove" button', async () => {
        wrapper = createWrapper();
        const cancelButton = wrapper.findByTestId('action_button_remove');

        await cancelButton.trigger('click');

        expect(wrapper.emitted('button-action')[0]).toEqual([
            { action: 'remove', address: TEST_ACCOUNT_ADDRESS },
        ]);
    });
});
