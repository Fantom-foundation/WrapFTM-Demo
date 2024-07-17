import { useAccountsStore } from './store.js';

let store = null;

beforeEach(() => {
    store = useAccountsStore();
});

afterEach(() => {
    store = null;
});

describe('transaction store', () => {
    it('should have correct default values', () => {
        expect(store.accounts).toEqual([]);
        expect(store.activeAccountAddress).toEqual('');
    });
});
