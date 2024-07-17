import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import LanguageSelector from '@/modules/app/components/LanguageSelector/LanguageSelector.vue';
import { vi } from 'vitest';
import { VueI18n } from '@/plugins/VueI18n/VueI18n.js';
import { appStoreUtils, useAppStore } from '@/modules/app/store/store.js';
import {
    windowLocationMock,
    windowLocationMockRestore,
} from 'fantom-vue3-components/src/test/mocks/window-location.js';
import {
    mockI18n,
    TEST_LANGUAGES,
    TEST_TRANSLATIONS,
} from 'fantom-vue3-components/src/test/language.js';
import { setUpTestLocales, TEST_LOCALES } from '@/config/test/locale.js';

const languages = TEST_LANGUAGES();
const messages = TEST_TRANSLATIONS();

function createWrapper(options = { props: { languages } }) {
    return mount(LanguageSelector, options);
}

let wrapper = null;
const i18n = new VueI18n({
    messages,
});
const store = useAppStore();

vi.mock('@/config/i18n.js', () => {
    return mockI18n(i18n);
});

beforeAll(() => {
    windowLocationMock();
    setUpTestLocales({ store, i18n, locales: TEST_LOCALES() });
});

afterAll(() => {
    windowLocationMockRestore();
    vi.restoreAllMocks();
});

beforeEach(() => {
    wrapper = createWrapper();
});

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('LanguageSelector', () => {
    it('should display given list of languages', async () => {
        const combobox = wrapper.findComponent({ name: 'FComboBox' });
        await combobox.openCombobox();

        expect(document.body.innerHTML).toMatch(
            new RegExp(`${languages[0].label}.*${languages[1].label}`)
        );
    });

    it('should be able to change language', async () => {
        const combobox = wrapper.findComponent({ name: 'FComboBox' });
        await combobox.selectComboboxItem(2);

        expect(i18n.t('hello')).toEqual('Ahoj');
    });

    it('should pick default lang value from the store', async () => {
        destroyWrapper(wrapper);
        store.lang = 'cs';
        wrapper = createWrapper();
        const combobox = wrapper.findComponent({ name: 'FComboBox' });

        expect(combobox.vm.value).toBe('cs');
    });

    it('should store picked language in local storage', async () => {
        const combobox = wrapper.findComponent({ name: 'FComboBox' });
        await combobox.selectComboboxItem(2);

        expect(window.localStorage.getItem(appStoreUtils.getStorageKey('lang'))).toBe(
            'cs'
        );
    });
});
