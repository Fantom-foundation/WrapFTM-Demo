import { useAppStore } from './store.js';
import { appConfig } from '@/config/app-config.js';

let store = null;

beforeEach(() => {
    store = useAppStore();
});

afterEach(() => {
    store = null;
});

describe('transaction store', () => {
    it('should have correct default values', () => {
        expect(store.lang).toEqual('');
        expect(store.theme).toEqual(appConfig.defaultTheme);
        expect(store.currency).toEqual(appConfig.defaultCurrency);
        expect(store.autoDarkTheme).toEqual(false);
        expect(store.rtlDirection).toEqual(false);
    });
});
