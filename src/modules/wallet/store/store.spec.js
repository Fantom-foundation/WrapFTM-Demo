import { useWalletStore } from './store.js';

let store = null;

beforeEach(() => {
    store = useWalletStore();
});

afterEach(() => {
    store = null;
});

describe('transaction store', () => {
    it('should have correct default values', () => {
        expect(store.address).toEqual('');
        expect(store.chainId).toEqual('');
        expect(store.walletName).toEqual('');
    });
});
