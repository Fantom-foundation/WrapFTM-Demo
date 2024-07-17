import { useTransactionStore } from './store.js';

describe('transaction store', () => {
    it('should have correct default values', () => {
        expect(store.recentTransactions).toEqual({});
    });

    it('should add transaction to `recentTransactions` list', () => {
        store.addTransaction(
            {
                hash: '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
                description: 'tx description 1',
                status: 'pending',
                time: 1675691168634,
            },
            '0x123abc'
        );

        expect(store.recentTransactions['0x123abc']).toEqual([
            {
                hash: '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
                description: 'tx description 1',
                time: 1675691168634,
                status: 'pending',
            },
        ]);
    });

    it('should add a new transaction to the `recentTransactions` list at the top of the list', () => {
        store.addTransaction(
            {
                hash: '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
                description: 'tx description 1',
                status: 'pending',
                time: 1675691168634,
            },
            '0x123abc'
        );
        store.addTransaction(
            {
                hash: '0x11152eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
                description: 'tx description 2',
                status: 'success',
                time: 1675691168634,
            },
            '0x123abc'
        );

        expect(store.recentTransactions['0x123abc'][0]).toEqual({
            hash: '0x11152eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
            description: 'tx description 2',
            status: 'success',
            time: 1675691168634,
        });
    });

    it('should not add the same transaction twice to the `recentTransactions` list', () => {
        store.addTransaction(
            {
                hash: '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
                description: 'tx description 1',
                status: 'pending',
                time: 1675691168634,
            },
            '0x123abc123'
        );
        store.addTransaction(
            {
                hash: '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
                description: 'tx description 1',
                status: 'pending',
                time: 1675691168634,
            },
            '0x123abc123'
        );

        expect(store.recentTransactions['0x123abc123']).toEqual([
            {
                hash: '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
                description: 'tx description 1',
                time: 1675691168634,
                status: 'pending',
            },
        ]);
    });

    it('should limit number of stored transaction', () => {
        store.addTransaction(
            {
                hash: '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
                description: 'tx description 1',
                status: 'pending',
                time: 1675691168634,
            },
            '0x123abc123a',
            1
        );
        store.addTransaction(
            {
                hash: '0x40852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
                description: 'tx description 2',
                status: 'pending',
                time: 1675691168634,
            },
            '0x123abc123a',
            1
        );

        expect(store.recentTransactions['0x123abc123a']).toEqual([
            {
                hash: '0x40852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
                description: 'tx description 2',
                status: 'pending',
                time: 1675691168634,
            },
        ]);
    });

    it('should throw an error if no address is provided when adding a transaction', () => {
        expect(() => {
            store.addTransaction({
                hash: '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
                description: 'tx description 1',
                status: 'pending',
                time: 1675691168634,
            });
        }).toThrowError();
    });

    it('should clear all recent transactions', () => {
        store.addTransaction(
            {
                hash: '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
                description: 'tx description 1',
                status: 'pending',
                time: 1675691168634,
            },
            '0x123abc'
        );

        store.clearAllTransactions();

        expect(store.recentTransactions).toEqual({});
    });
});

let store = null;

beforeEach(() => {
    store = useTransactionStore();
});

afterEach(() => {
    store.$reset();
    sessionStorage.clear();
    store = null;
});
