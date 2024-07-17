import { createI18n } from 'vue-i18n';

export class VueI18n {
    #messageImports = null;
    #defaultLocale = 'en';

    constructor(vueI18nOptions = {}, messageImports = null) {
        const i18nOptions = {
            locale: 'en',
            allowComposition: true,
            globalInjection: true,
            legacy: false,
            ...vueI18nOptions,
        };

        this.i18n = createI18n(i18nOptions);
        // this.setLanguage(i18nOptions.locale);
        this.#messageImports = messageImports;
        this.#defaultLocale = i18nOptions.locale;
    }

    /**
     * @param {string} [localeCode]
     * @param {boolean} [reloadPage]
     */
    async setLanguage(localeCode = 'en', reloadPage = false) {
        const messageImports = this.#messageImports;
        let importMessages = null;

        if (messageImports) {
            importMessages = messageImports[localeCode];

            if (!importMessages) {
                importMessages = messageImports[this.#defaultLocale];
            }
        }

        // console.log('!!!', this.i18n.global);

        if (typeof importMessages === 'function') {
            this.i18n.global.setLocaleMessage(localeCode, await importMessages());
            this.i18n.global.locale.value = localeCode;
        } else {
            this.i18n.global.locale.value = localeCode;
        }

        document.documentElement.setAttribute('lang', localeCode);

        if (reloadPage) {
            window.location.reload();
        }
    }

    setMessages(messages) {
        const i18nG = this.i18n.global;

        Object.keys(messages).forEach((localeCode) => {
            i18nG.setLocaleMessage(localeCode, messages[localeCode]);
        });
    }

    /**
     * Get translation by code.
     *
     * @returns {TranslateResult}
     */
    t(...args) {
        return this.i18n.global.t(...args);
    }
}
