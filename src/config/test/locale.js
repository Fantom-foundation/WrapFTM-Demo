import { storeToRefs } from 'pinia';
import { translations } from 'fantom-vue3-components';
import { useLocale } from 'fantom-vue3-components/src/composables/useLocale/useLocale.js';
import { appConfig } from '@/config/app-config.js';
// import { TEST_LANGUAGES } from 'fantom-vue3-components/src/test/language.js';
import { getCurrency, useAppStore } from '@/modules/app/store/store.js';
import { useFormatters } from 'fantom-vue3-components';
import { setUpFormatters } from '@/config/formatters.js';

export function TEST_LOCALES() {
    return [
        { tag: 'en', label: 'English' },
        { tag: 'cs', label: 'Česky' },
        { tag: 'fa', label: 'دری', options: { rtl: true } },
    ];
}

export async function setUpTestLocales({
    store = useAppStore(),
    locales = TEST_LOCALES(),
    i18n = null,
} = {}) {
    const { lang, rtlDirection } = storeToRefs(store);
    const { locale } = useLocale();
    const { formatters } = useFormatters();

    setUpFormatters(getCurrency().value);

    locale.setup({
        locales,
        languageRef: lang,
        rtlDirectionRef: rtlDirection,
        defaultLanguageCode: appConfig.defaultLanguageCode,
        i18n,
        translations,
        formatters,
    });
    await locale.setLocale();
}
