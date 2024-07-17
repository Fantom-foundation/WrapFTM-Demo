import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import WrapStationForm from './WrapStationForm.vue';
import { FTM_TOKEN, WFTM_TOKEN } from '@/config/tokens.js';
import { i18n } from '@/config/i18n.js';
import TokenAmountField from '@/modules/common/components/TokenAmountField/TokenAmountField.vue';

let wrapper = null;

function DEFAULT_PROPS() {
    return {
        fromToken: { ...FTM_TOKEN(), balance: '0xDE0B6B3A7640000' }, // 1
        toToken: { ...WFTM_TOKEN(), balance: '0x4563918244F40000' }, // 5
        subtractFtmAmount: 0,
    };
}

function createWrapper(
    options = {
        props: DEFAULT_PROPS(),
    }
) {
    return mount(WrapStationForm, { ...options, attachTo: document.body });
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('WrapStationForm', () => {
    it('should display right token symbols', () => {
        wrapper = createWrapper();

        const text = wrapper.text();
        expect(text).toContain(FTM_TOKEN().symbol);
        expect(text).toContain(WFTM_TOKEN().symbol);
    });

    it('should expose `resetInputFields` method', () => {
        wrapper = createWrapper();

        expect(wrapper.vm.$parent.$refs.VTU_COMPONENT.resetInputFields).toBeDefined();
    });

    describe('entering amount', () => {
        it('should enter the same amount to "toTokenAmount" input field if an amount is typed to "fromTokenAmount" input field', async () => {
            wrapper = createWrapper();

            await wrapper.setFormElement('fromTokenAmount', 0.5);

            expect(wrapper.find('[name="toTokenAmount"]').element.value).toBe('0.5');
        });

        it('should not enter the same amount to "toTokenAmount" input field if an amount is typed to "fromTokenAmount" input field and the amount is bigger than max balance of "from" token', async () => {
            wrapper = createWrapper();

            await wrapper.setFormElement('fromTokenAmount', 2);

            expect(wrapper.find('[name="toTokenAmount"]').element.value).toBe('');
        });

        it('should enter the same amount to "fromTokenAmount" input field if an amount is typed to "toTokenAmount" input field', async () => {
            wrapper = createWrapper();

            await wrapper.setFormElement('toTokenAmount', 2);

            expect(wrapper.find('[name="fromTokenAmount"]').element.value).toBe('2');
        });

        it('should set "subtractFromMax" prop to "from" input field if "from" token is FTM', async () => {
            wrapper = createWrapper({
                props: {
                    ...DEFAULT_PROPS(),
                    subtractFtmAmount: 1,
                },
            });
            const fromTokenAmountField = wrapper.findComponent(TokenAmountField);

            expect(fromTokenAmountField.vm.$props.subtractFromMax > 0).toBe(true);

            await wrapper.findByTestId('swap_button').trigger('click');

            expect(fromTokenAmountField.vm.$props.subtractFromMax).toBe(0);
        });
    });

    describe('form submit', () => {
        it('should emit `submit` event with from/to tokens and token amount', async () => {
            wrapper = createWrapper();

            await wrapper.setFormElement('fromTokenAmount', 0.5);
            await wrapper.submitForm();

            expect(wrapper.emitted('submit')[0]).toEqual([
                {
                    fromToken: FTM_TOKEN(),
                    toToken: WFTM_TOKEN(),
                    tokenAmount: '0x6F05B59D3B20000'.toLowerCase(),
                },
            ]);
        });

        it('should not emit `submit` event if no amount was filled', async () => {
            wrapper = createWrapper();

            await wrapper.submitForm();

            expect(wrapper.emitted('submit')).toBeUndefined();
        });

        it('should not emit `submit` event if maximum balance is exceeded', async () => {
            wrapper = createWrapper();

            await wrapper.setFormElement('fromTokenAmount', 2);
            await wrapper.submitForm();

            expect(wrapper.emitted('submit')).toBeUndefined();
        });
    });

    // amount 0 -> you don't have enough balance

    describe('tokens swap', () => {
        it('should swap tokens', async () => {
            wrapper = createWrapper();

            await wrapper.findByTestId('swap_button').trigger('click');

            const tokenBalances = wrapper.findByTestCode('tokenamountfield_balance');
            expect(wrapper.findByTestId('wrap_station_form_from_token').text()).toContain(
                WFTM_TOKEN().symbol
            );
            expect(tokenBalances[0].text()).toContain('5wFTM');
            expect(wrapper.findByTestId('wrap_station_form_to_token').text()).toContain(
                FTM_TOKEN().symbol
            );
            expect(tokenBalances[1].text()).toContain('1FTM');
        });

        it('should emit "swap" event', async () => {
            wrapper = createWrapper();

            await wrapper.findByTestId('swap_button').trigger('click');

            const event = wrapper.emitted('swap')[0];
            expect(event).toBeDefined();
        });

        it('should not swap tokens if form is disabled', async () => {
            wrapper = createWrapper({
                props: {
                    ...DEFAULT_PROPS(),
                    disabled: true,
                },
            });

            await wrapper.findByTestId('swap_button').trigger('click');

            expect(wrapper.findByTestId('wrap_station_form_from_token').text()).toContain(
                FTM_TOKEN().symbol
            );
            expect(wrapper.findByTestId('wrap_station_form_to_token').text()).toContain(
                WFTM_TOKEN().symbol
            );
        });

        it('should emit `submit` event with swapped tokens', async () => {
            wrapper = createWrapper();

            await wrapper.findByTestId('swap_button').trigger('click');
            await wrapper.setFormElement('fromTokenAmount', 0.5);
            await wrapper.submitForm();

            expect(wrapper.emitted('submit')[0]).toEqual([
                {
                    fromToken: WFTM_TOKEN(),
                    toToken: FTM_TOKEN(),
                    tokenAmount: '0x6F05B59D3B20000'.toLowerCase(),
                },
            ]);
        });
    });

    describe('submit button', () => {
        it('should display label "submit" by default', () => {
            wrapper = createWrapper({
                props: {
                    ...DEFAULT_PROPS(),
                    fromToken: {
                        ...FTM_TOKEN(),
                        symbol: 'FOO',
                    },
                },
            });

            expect(wrapper.findByTestId('submit_button').text()).toContain(
                i18n.t('wrapStation.wrapStationForm.submit')
            );
        });

        it('should display label "wrap" in the submit button if "from" token is FTM token', () => {
            wrapper = createWrapper();

            expect(wrapper.findByTestId('submit_button').text()).toContain(
                i18n.t('wrapStation.wrapStationForm.wrap')
            );
        });

        it('should display label "unwrap" in the submit button if "from" token is wFTM token', async () => {
            wrapper = createWrapper();

            await wrapper.findByTestId('swap_button').trigger('click');

            expect(wrapper.findByTestId('submit_button').text()).toContain(
                i18n.t('wrapStation.wrapStationForm.unwrap')
            );
        });
    });
});
