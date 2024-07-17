import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import SendTransactionForm from './SendTransactionForm.vue';
import { TRANSACTION } from '@/plugins/web3-wallets/test-helpers.js';
import { nextTick } from 'vue';

let wrapper = null;

function createWrapper(options = {}) {
    return mount(SendTransactionForm, { ...options, attachTo: document.body });
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('SendTransactionForm', () => {
    it('should have default slot', () => {
        wrapper = createWrapper({
            props: {
                transaction: TRANSACTION(),
            },
            slots: {
                default: 'slot content',
            },
        });

        expect(wrapper.text()).toContain('slot content');
    });

    it('should display GasFields optionally', () => {
        wrapper = createWrapper({
            props: {
                showAdvancedFunctions: true,
                transaction: TRANSACTION(),
            },
        });

        expect(wrapper.findComponent({ name: 'GasFields' }).exists()).toBe(true);
    });

    it('should display "from" and "to" addresses', () => {
        const transaction = TRANSACTION();
        wrapper = createWrapper({
            props: {
                transaction,
            },
        });

        const text = wrapper.text();
        expect(text).toContain(transaction.from);
        expect(text).toContain(transaction.to);
    });

    it('should display FTM amount', () => {
        wrapper = createWrapper({
            props: {
                transaction: {
                    ...TRANSACTION(),
                    value: '0x29A2241AF62C0000',
                },
            },
        });

        expect(wrapper.text()).toContain('3FTM');
    });

    it('should display MaxFee', () => {
        wrapper = createWrapper({
            props: {
                showAdvancedFunctions: true,
                transaction: TRANSACTION(),
            },
        });

        expect(wrapper.findComponent({ name: 'MaxFee' }).exists()).toBe(true);
    });

    it('should display password field optionally', () => {
        wrapper = createWrapper({
            props: {
                showPasswordField: true,
                transaction: TRANSACTION(),
            },
        });

        expect(wrapper.find('input[type=password]').exists()).toBe(true);
    });

    it('should recalculate max fee if GasFields change', async () => {
        wrapper = createWrapper({
            props: {
                showAdvancedFunctions: true,
                transaction: TRANSACTION(),
                throttleInputInterval: 0,
            },
        });
        await nextTick();

        await wrapper.setFormElement('gasPrice', 2);

        expect(wrapper.text()).toContain('0.000042FTM');
    });

    it('should be able to set label of submit button', () => {
        wrapper = createWrapper({
            props: {
                submitButtonLabel: 'foo',
                transaction: TRANSACTION(),
            },
        });

        expect(wrapper.find('button[type=submit]').text()).toBe('foo');
    });

    it('should be able to set label of password field', () => {
        wrapper = createWrapper({
            props: {
                passwordLabel: 'password label',
                showPasswordField: true,
                transaction: TRANSACTION(),
            },
        });

        expect(wrapper.text()).toContain('password label');
    });

    it('should be able to display password label as a placeholder', () => {
        wrapper = createWrapper({
            props: {
                passwordLabelAsPlaceholder: true,
                passwordLabel: 'password label',
                showPasswordField: true,
                transaction: TRANSACTION(),
            },
        });
        const passwordInput = wrapper.find('[name="password"]');

        expect(passwordInput.attributes('placeholder')).toBe('password label');
    });

    it('should be able to set validator for password field', async () => {
        wrapper = createWrapper({
            props: {
                passwordValidator: (value) => (!value.trim() ? 'Foo' : ''),
                showPasswordField: true,
                transaction: TRANSACTION(),
            },
        });

        await wrapper.submitForm();

        expect(wrapper.text()).toContain('Foo');
    });

    it('should disable all buttons if `disabled` prop is `true`', () => {
        wrapper = createWrapper({
            props: {
                disabled: true,
                transaction: TRANSACTION(),
            },
        });

        expect(wrapper.find('button').element.disabled).toBe(true);
    });

    it('should display given buttons', () => {
        wrapper = createWrapper({
            props: {
                buttons: [
                    {
                        label: 'Button 1',
                    },
                    {
                        type: 'submit',
                        label: 'Button 2',
                    },
                ],
                transaction: TRANSACTION(),
            },
        });

        const buttons = wrapper.findAll('button');

        expect(buttons).toHaveLength(2);
        expect(wrapper.text()).toContain('Button 1Button 2');
    });

    describe('on form submit', () => {
        it('should emit `submit` event with given transaction', async () => {
            wrapper = createWrapper({
                props: {
                    transaction: TRANSACTION(),
                },
            });

            await wrapper.submitForm();

            expect(wrapper.emitted('submit')[0]).toEqual([TRANSACTION()]);
        });

        it.skip('should emit `submit` event with given transaction, password and modified gas price/limit if gas fields are changed', async () => {
            wrapper = createWrapper({
                props: {
                    showPasswordField: true,
                    showAdvancedFunctions: true,
                    transaction: TRANSACTION(),
                    throttleInputInterval: 0,
                },
            });
            await nextTick();

            await wrapper.setFormElements({
                password: 'password123',
                gasPrice: 2,
                gasLimit: 40000,
            });
            await wrapper.submitForm();

            expect(wrapper.emitted('submit')[0]).toEqual([
                {
                    ...TRANSACTION(),
                    gasPrice: '0x77359400',
                    gasLimit: '0x9c40',
                    password: 'password123',
                },
            ]);
        });

        it('should not submit the form if the password field is displayed and the password is not filled in', async () => {
            wrapper = createWrapper({
                props: {
                    showPasswordField: true,
                    transaction: TRANSACTION(),
                },
            });
            await nextTick();

            await wrapper.submitForm();

            expect(wrapper.emitted('submit')).toBeFalsy();
        });
    });
});
