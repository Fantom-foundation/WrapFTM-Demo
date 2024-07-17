import { VueI18n } from './VueI18n.js';
import {
    windowLocationMock,
    windowLocationMockRestore,
} from 'fantom-vue3-components/src/test/mocks/window-location.js';

let i18n;
const messages = {
    en: {
        hello: 'Hello',
    },
    cs: {
        hello: 'Ahoj',
    },
};

beforeAll(() => {
    windowLocationMock();
});

afterAll(() => {
    windowLocationMockRestore();
});

beforeEach(() => {
    i18n = new VueI18n({
        messages,
    });
});

afterEach(() => {
    i18n = null;
});

describe('VueI18n', () => {
    it('should create vue i18n instance with given options', () => {
        expect(i18n.i18n).toBeDefined();
    });

    it('should get translation by code', () => {
        expect(i18n.t('hello')).toEqual('Hello');
    });

    it('should set language by locale', () => {
        i18n.setLanguage('cs');

        expect(i18n.t('hello')).toEqual('Ahoj');
    });

    it('should be able to reload the page when setting language', () => {
        i18n.setLanguage('cs', true);

        expect(window.location.reload).toHaveBeenCalledTimes(1);
    });

    it('should set correct lang attribute on html element when language is set', () => {
        i18n.setLanguage('cs');

        expect(document.documentElement.getAttribute('lang')).toEqual('cs');
    });

    it('should use async messages', async () => {
        i18n = null;
        i18n = new VueI18n(
            { locale: 'en' },
            {
                en: async () => ({ hello: 'Hello' }),
                cs: async () => ({ hello: 'Ahoj' }),
            }
        );

        await i18n.setLanguage('cs');

        expect(i18n.t('hello')).toEqual('Ahoj');
    });

    it('should use async messages with default locale if requested locale does not exists', async () => {
        i18n = null;
        i18n = new VueI18n(
            { locale: 'en' },
            {
                en: async () => ({ hello: 'Hello' }),
            }
        );

        await i18n.setLanguage('cs');

        expect(i18n.t('hello')).toEqual('Hello');
    });

    it('should set messages', () => {
        i18n = new VueI18n({ locale: 'cs' });

        i18n.setMessages(messages);

        expect(i18n.t('hello')).toEqual('Ahoj');
    });
});
