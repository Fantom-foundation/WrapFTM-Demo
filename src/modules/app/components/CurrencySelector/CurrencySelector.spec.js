import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import CurrencySelector from './CurrencySelector.vue';
import { appStoreUtils, useAppStore } from '@/modules/app/store/store.js';
import { useFormatters } from 'fantom-vue3-components';

function TEST_CURRENCIES() {
    return [
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
    ];
}

let wrapper = null;
const store = useAppStore();
const { formatters } = useFormatters();

function createWrapper(options = { props: { currencies: TEST_CURRENCIES() } }) {
    return mount(CurrencySelector, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
    store.currency = 'USD';
});

describe('CurrencySelector', () => {
    it('should display given list of currencies', async () => {
        wrapper = createWrapper();
        const currencies = TEST_CURRENCIES();

        const combobox = wrapper.findComponent({ name: 'FComboBox' });
        await combobox.openCombobox();

        expect(document.body.innerHTML).toMatch(
            new RegExp(`${currencies[0].label}.*${currencies[1].label}`)
        );
    });

    it('should pick default currency from the store', async () => {
        store.currency = 'EUR';
        wrapper = createWrapper();

        const combobox = wrapper.findComponent({ name: 'FComboBox' });
        expect(combobox.vm.value).toBe('EUR');
    });

    it('should store picked language in local storage', async () => {
        wrapper = createWrapper();

        const combobox = wrapper.findComponent({ name: 'FComboBox' });
        await combobox.selectComboboxItem(2);

        expect(window.localStorage.getItem(appStoreUtils.getStorageKey('currency'))).toBe(
            'EUR'
        );
    });

    it('should be able to change currency', async () => {
        wrapper = createWrapper();

        const combobox = wrapper.findComponent({ name: 'FComboBox' });
        await combobox.selectComboboxItem(2);

        expect(formatters.currency(1)).toBe('€1.00');
    });
});
