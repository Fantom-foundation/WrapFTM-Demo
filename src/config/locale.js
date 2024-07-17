import { storeToRefs } from 'pinia';
import { useAppStore } from '@/modules/app/store/store.js';
import { clone, useFormatters } from 'fantom-vue3-components';
import { appConfig } from '@/config/app-config.js';
import { i18n } from '@/config/i18n.js';
import { translations } from 'fantom-vue3-components/src/mixins/translations.js';
import { useLocale } from 'fantom-vue3-components/src/composables/useLocale/useLocale.js';
import { Modules } from '@/utils/Modules/Modules.js';

export async function setUpLocale() {
    const { lang, rtlDirection } = storeToRefs(useAppStore());
    const { locale } = useLocale();
    const { formatters } = useFormatters();

    locale.setup({
        locales: clone(appConfig.locales),
        languageRef: lang,
        rtlDirectionRef: rtlDirection,
        defaultLanguageCode: appConfig.defaultLanguageCode,
        i18n,
        translations,
        formatters,
    });

    await locale.setLocale();

    locale.setTextDirection();
}

export const messageImports = {
    async en() {
        return await Modules.getTranslations('en');
    },
    async cs() {
        return await Modules.getTranslations('cs');
    },
};
