import { VueI18n } from '@/plugins/VueI18n/VueI18n.js';
import { appConfig } from '@/config/app-config.js';
import { messageImports } from '@/config/locale.js';

export const i18n = new VueI18n(
    {
        locale: appConfig.defaultLanguageCode,
        warnHtmlMessage: false,
    },
    messageImports
);
