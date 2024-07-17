import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import TokenAmountField from './TokenAmountField.vue';
import { i18n } from '@/config/i18n.js';
import { FToken } from 'fantom-vue3-components';
import TokenPicker from '@/modules/common/components/TokenPicker/TokenPicker.vue';
import { markRaw } from 'vue';

let wrapper = null;
const TOKEN = {
    symbol: 'FTM',
    name: 'FTM',
    logo: 'logo.png',
    decimals: 18,
    balance: '0x6B14E9F9B0DF36A83', // 123456789123456789123
};

async function pickToken(index) {
    const tokenPicker = wrapper.findComponent({ name: 'TokenPicker' });
    await tokenPicker.find('button').trigger('click');
    const window = wrapper.findComponent({ name: 'FWindow' });
    await window.selectListboxItem(index);
}

function createWrapper(options = {}) {
    return mount(TokenAmountField, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('TokenAmountField', () => {
    it('should display input field', () => {
        wrapper = createWrapper({
            props: {
                token: TOKEN,
            },
        });

        expect(wrapper.find('input[type="number"]').exists()).toBe(true);
    });

    it('should display given token', () => {
        wrapper = createWrapper({
            props: {
                showToken: true,
                token: TOKEN,
            },
        });

        expect(wrapper.text()).toContain(TOKEN.symbol);
        expect(wrapper.find('img').exists()).toBe(true);
    });

    it('should apply props to FToken component', () => {
        wrapper = createWrapper({
            props: {
                inputTokenProps: {
                    noLogo: true,
                },
                showToken: true,
                token: TOKEN,
            },
        });

        const fToken = wrapper.findComponent(FToken);
        expect(fToken.vm.$props.noLogo).toBe(true);
    });

    it('should display token balance', () => {
        wrapper = createWrapper({
            props: {
                showBalance: true,
                token: TOKEN,
                balanceTokenProps: {
                    maximumFractionDigits: 2,
                },
            },
        });

        expect(wrapper.text()).toContain('123.46FTM');
    });

    it('should display token balance in USD', () => {
        wrapper = createWrapper({
            props: {
                showBalancePrice: true,
                tokenPrice: 0.1,
                showBalance: true,
                token: TOKEN,
            },
        });

        expect(wrapper.text()).toContain('$12.35');
    });

    it('should emit "update:value" event with amount converted to hex in token decimals if `convertOutput` prop is set to true', async () => {
        wrapper = createWrapper({
            props: {
                convertOutput: true,
                token: TOKEN,
            },
        });

        await wrapper.find('input').setValue(1);

        expect(wrapper.emitted('update:value')[0][0].toLowerCase()).toBe(
            '0xDE0B6B3A7640000'.toLowerCase()
        );
    });

    it('should behave correctly when token is changed', async () => {
        wrapper = createWrapper({
            props: {
                convertOutput: true,
                showMaxButton: true,
                showToken: true,
                showBalance: true,
                token: TOKEN,
            },
        });

        await wrapper.setProps({
            token: {
                symbol: 'wFTM',
                name: 'wFTM',
                balance: '0xDE0B6B3A7640000',
            },
        });
        await wrapper.findByTestId('action_button_amount_100').trigger('click');

        expect(wrapper.text()).toContain('wFTM');
        expect(wrapper.text()).toContain('1wFTM');
        expect(wrapper.find('input').element.value).toContain('1');
        expect(wrapper.emitted('update:value')[0][0].toLowerCase()).toBe(
            '0xDE0B6B3A7640000'.toLowerCase()
        );
    });

    it('should use custom input token component', async () => {
        wrapper = createWrapper({
            props: {
                inputTokenComponent: markRaw(TokenPicker),
                showToken: true,
                token: TOKEN,
            },
        });

        expect(wrapper.findComponent({ name: 'TokenPicker' }).exists()).toBe(true);
    });

    it('should behave correctly when input token component is TokenPicker and token is picked', async () => {
        wrapper = createWrapper({
            props: {
                inputTokenComponent: markRaw(TokenPicker),
                inputTokenProps: {
                    tokens: [
                        {
                            address: '0x234234',
                            symbol: 'wFTM',
                            name: 'wFTM',
                            balance: '0xDE0B6B3A7640000',
                        },
                        {
                            address: '0x234234',
                            symbol: 'wFTM',
                            name: 'wFTM',
                            balance: '0xDE0B6B3A7640000',
                        },
                    ],
                },
                convertOutput: true,
                showMaxButton: true,
                showToken: true,
                showBalance: true,
                token: TOKEN,
            },
            attachTo: document.body,
        });

        await pickToken(1);

        expect(wrapper.text()).toContain('wFTM');
        expect(wrapper.text()).toContain('1wFTM');
    });

    it('should re-emit "token-pick" event', async () => {
        wrapper = createWrapper({
            props: {
                inputTokenComponent: markRaw(TokenPicker),
                inputTokenProps: {
                    tokens: [
                        {
                            address: '0x234234',
                            symbol: 'wFTM',
                            balance: '0xDE0B6B3A7640000',
                        },
                        {
                            address: '0x111',
                            symbol: 'fUSD',
                        },
                    ],
                },
                convertOutput: true,
                showMaxButton: true,
                showToken: true,
                showBalance: true,
                token: TOKEN,
            },
            attachTo: document.body,
        });

        await pickToken(2);

        expect(wrapper.emitted('token-pick')[0][0]).toEqual(
            expect.objectContaining({
                address: '0x111',
                symbol: 'fUSD',
            })
        );
    });

    describe('validation', () => {
        it('should validate amount on input', async () => {
            wrapper = createWrapper({
                props: {
                    token: TOKEN,
                },
            });
            const input = wrapper.find('input');

            await input.setValue(500);

            expect(wrapper.emitted('validation-state')).toBeTruthy();
            expect(wrapper.text()).toContain(
                i18n.t('common.tokenAmountField.maximumAmountReached')
            );

            await input.setValue(-1);

            expect(wrapper.emitted('validation-state')).toBeTruthy();
            expect(wrapper.text()).toContain(
                i18n.t('common.tokenAmountField.invalidAmount')
            );
        });

        it('should not validate max amount if "noMaxValidation" is set to true', async () => {
            wrapper = createWrapper({
                props: {
                    noMaxValidation: true,
                    token: TOKEN,
                },
            });
            const input = wrapper.find('input');

            await input.setValue(500);

            expect(wrapper.emitted('validation-state')[0][0].valid).toBe(true);
        });

        it('should skip validation if `noValidation` prop is true', async () => {
            wrapper = createWrapper({
                props: {
                    noValidation: true,
                    token: TOKEN,
                },
            });
            const input = wrapper.find('input');

            await input.setValue(500);

            expect(wrapper.emitted('validation-state')[0][0].valid).toBe(true);
        });
    });

    describe('"max" button', () => {
        it('should display "max" button for adding whole balance into the input field', () => {
            wrapper = createWrapper({
                props: {
                    showMaxButton: true,
                    maxButtonLabel: 'MAX',
                    token: TOKEN,
                },
            });

            expect(wrapper.findByTestId('action_button_amount_100').exists()).toBe(true);
            expect(wrapper.text()).toContain('MAX');
        });

        it('should input whole balance to the input field if "max" button is clicked', async () => {
            wrapper = createWrapper({
                props: {
                    showMaxButton: true,
                    token: TOKEN,
                },
            });

            await wrapper.findByTestId('action_button_amount_100').trigger('click');

            expect(wrapper.find('input').element.value).toContain('123.456');
            expect(wrapper.emitted('update:value')).toBeTruthy();
        });

        it('should input whole balance minus "subtractFromMax" to the input field if "max" button is clicked', async () => {
            wrapper = createWrapper({
                props: {
                    subtractFromMax: 1,
                    showMaxButton: true,
                    token: TOKEN,
                },
            });

            await wrapper.findByTestId('action_button_amount_100').trigger('click');

            expect(wrapper.find('input').element.value).toContain('122.456');
        });

        it('should disable the "max" button if whole component is disabled', async () => {
            wrapper = createWrapper({
                props: {
                    disabled: true,
                    showMaxButton: true,
                    token: TOKEN,
                },
            });

            await wrapper.findByTestId('action_button_amount_100').trigger('click');

            expect(wrapper.find('input').element.value).toBe('');
            expect(wrapper.emitted('update:value')).toBeFalsy();
        });

        it('should emit correct max amount (balance) converted to hex in token decimals if `convertOutput` prop is set to true and "max" button is clicked', async () => {
            wrapper = createWrapper({
                props: {
                    convertOutput: true,
                    showMaxButton: true,
                    token: TOKEN,
                },
            });

            await wrapper.findByTestId('action_button_amount_100').trigger('click');

            expect(wrapper.emitted('update:value')[0][0].toLowerCase()).toBe(
                TOKEN.balance.toLowerCase()
            );
        });
    });

    describe('amount buttons', () => {
        it('should display amount buttons', () => {
            wrapper = createWrapper({
                props: {
                    amountButtons: '-12%,25%, 50%,100%,  120%',
                    maxButtonLabel: 'MAX',
                    token: TOKEN,
                },
            });

            const buttons = wrapper.findAll('button');

            expect(buttons).toHaveLength(3);
            expect(wrapper.text()).toContain('25%50%MAX');
        });

        it('should display amount buttons at the bottom of input if `showAmountButtonsAtTheBottom` is true', () => {
            wrapper = createWrapper({
                props: {
                    showAmountButtonsAtTheBottom: true,
                    amountButtons: '25%, 50%, 100%',
                    maxButtonLabel: 'MAX',
                    token: TOKEN,
                },
            });

            expect(
                wrapper.findByTestCode('tokenamountfield_bottom_buttons')[0].text()
            ).toContain('25%50%MAX');
        });

        it('should emit correct amounts converted to hex in token decimals if `convertOutput` prop is set to true and a amount buttons is clicked', async () => {
            wrapper = createWrapper({
                props: {
                    amountButtons: '25%, 50%, 100%',
                    token: {
                        ...TOKEN,
                        balance: '0x8AC7230489E80000', // 10
                    },
                    convertOutput: true,
                },
            });

            await wrapper.findByTestId('action_button_amount_50').trigger('click');
            await wrapper.findByTestId('action_button_amount_100').trigger('click');

            const emitted = wrapper.emitted('update:value');
            expect(emitted[0][0].toLowerCase()).toBe('0x4563918244F40000'.toLowerCase()); // 5
            expect(emitted[1][0].toLowerCase()).toBe('0x8AC7230489E80000'.toLowerCase());
        });

        it('should enter correct amount  to the input field if "subtractFromMax" is set and "50%" button is clicked', async () => {
            wrapper = createWrapper({
                props: {
                    subtractFromMax: 1,
                    amountButtons: '25%, 50%, 100%',
                    token: {
                        ...TOKEN,
                        balance: '0x4563918244F40000', // 5
                    },
                },
            });

            await wrapper.findByTestId('action_button_amount_50').trigger('click');

            expect(wrapper.find('input').element.value).toContain('2.5');
        });
    });

    describe('expose methods', () => {
        it('should expose `convertToTokenValue` method', () => {
            wrapper = createWrapper({ props: { token: TOKEN } });

            expect(
                wrapper.vm.$parent.$refs.VTU_COMPONENT.convertToTokenValue
            ).toBeDefined();
        });

        it('should expose `validate` method', () => {
            wrapper = createWrapper({ props: { token: TOKEN } });

            expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.validate).toBeDefined();
        });

        it('should expose `setInputValue` method', () => {
            wrapper = createWrapper({ props: { token: TOKEN } });

            expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.setInputValue).toBeDefined();
        });

        it('should expose `resetValidation` method', () => {
            wrapper = createWrapper({ props: { token: TOKEN } });

            expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.resetValidation).toBeDefined();
        });
    });
});
