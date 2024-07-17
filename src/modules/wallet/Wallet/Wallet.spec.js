import { Wallet } from './Wallet.js';
import { Web3Wallet } from '@/plugins/web3-wallets/Web3Wallet/Web3Wallet.js';
import { vi } from 'vitest';
import { defineStore } from 'pinia';
import { watch, ref } from 'vue';
import {
    TEST_ACCOUNT_ADDRESS,
    TEST_TRANSACTION_HASH,
    TestWeb3Wallet,
} from '@/plugins/web3-wallets/test-helpers.js';
import { delay, getUniqueId } from 'fantom-vue3-components';
import { toBigNumber } from '@/utils/big-number/big-number.js';
import { useFApi } from '@/plugins/api-connectors/FApi/useFApi/useFApi.js';

class NotificationsMock {
    async add() {
        return getUniqueId();
    }
    hide() {}
}

const TEST_WALLET_NAME = 'testwallet';
const DEFAULT_CHAIN_ID = '0xfa';
/*
const TX = {
    from: TEST_ACCOUNT_ADDRESS,
    to: TEST_ACCOUNT_ADDRESS,
};
*/

/** @type {Wallet} */
let wallet = null;
let testWallet = null;
let store = null;
let transactionNotifications = null;
const useTestStore = defineStore('wallet_test_store', {
    state: () => {
        return {
            chainId: '',
            address: '',
            walletName: '',
        };
    },
});
const api = useFApi().api;

function createTestWeb3Wallet(options = { name: TEST_WALLET_NAME }) {
    return new TestWeb3Wallet(options);
}

async function createWallet() {
    store = useTestStore();
    transactionNotifications = new NotificationsMock();
    wallet = new Wallet({
        store,
        api,
        defaultChainId: DEFAULT_CHAIN_ID,
        transactionNotifications,
    });
    testWallet = createTestWeb3Wallet();
    testWallet.address = TEST_ACCOUNT_ADDRESS;
    testWallet.chainId = DEFAULT_CHAIN_ID;
    await wallet.setWeb3Wallet(testWallet);
}

beforeEach(async () => {
    await createWallet();
});

afterEach(() => {
    vi.restoreAllMocks();
    wallet = null;
    testWallet = null;
    store = null;
    transactionNotifications = null;
});

describe('Wallet', () => {
    it('should set default chain id', () => {
        wallet.setDefaultChainId(1);

        expect(wallet.defaultChainId).toBe('0x1');
    });

    it('should get info on whether wallet has been set up', () => {
        expect(wallet.isSet()).toBe(true);
    });

    describe('wallet store', () => {
        it('should set wallet name in a store', () => {
            expect(store.walletName).toBe(TEST_WALLET_NAME);
        });

        it('should provide access to wallet store', () => {
            expect(wallet.store.$id).toBe('wallet_test_store');
        });

        it('should change chainId value in a store if chainId is changed', () => {
            testWallet.chainId = '0x1';

            expect(store.chainId).toBe('0x1');
        });

        it('should change address value in a store if address is changed', () => {
            testWallet.address = '0x123';

            expect(store.address).toBe('0x123');
        });

        it('should reset wallet store to initial values', () => {
            testWallet.address = '0x123';
            testWallet.chainId = '0x1';
            testWallet.walletName = 'software';

            wallet.resetStore();

            expect(wallet.store.address).toBe('');
            expect(wallet.store.chainId).toBe('');
            expect(wallet.store.walletName).toBe('');
        });

        it('should check if given store is Pinia store', () => {
            expect(() => {
                wallet.setStore({});
            }).toThrowError();
        });

        it('should check if given store has expected form of its state', () => {
            expect(() => {
                wallet.setStore({ $id: 'foo', $reset() {} });
            }).toThrowError();
        });
    });

    describe('setting a web3 wallet', () => {
        it('should set web3 wallet', async () => {
            wallet = new Wallet({ store });
            await wallet.setWeb3Wallet(createTestWeb3Wallet());

            expect(wallet.isSet()).toBe(true);
        });

        it('should remove already set wallet', async () => {
            const disconnectSpy = vi.spyOn(wallet, 'disconnect');

            await wallet.setWeb3Wallet(createTestWeb3Wallet());

            expect(disconnectSpy).toBeCalled();
        });

        it('should reset store when wallet is removed', async () => {
            await wallet.removeWallet();

            expect(wallet.store.address).toBe('');
            expect(wallet.store.walletName).toBe('');
            expect(wallet.store.chainId).toBe('');
        });

        it.skip('should throw an error if wallet does not implement Web3Wallet interface', async () => {
            class TestWeb3Wallet2 extends Web3Wallet {}

            await expect(
                wallet.setWeb3Wallet(
                    new TestWeb3Wallet2({ name: `${TEST_WALLET_NAME}2` })
                )
            ).rejects.toBeInstanceOf(Error);
        });

        it('should provide access to web3 wallet', () => {
            expect(wallet.web3Wallet).toBeInstanceOf(TestWeb3Wallet);
        });
    });

    describe('web3 wallet events', () => {
        it('should re-trigger web3 wallet event', async () => {
            const walletEventsListener = vi.fn(() => {});
            const EVENT = {
                name: 'chain_change',
                data: {
                    chainId: '0x1',
                    walletName: wallet.web3Wallet.name,
                },
            };

            wallet.setEventsListener(walletEventsListener);

            await wallet.web3Wallet.triggerEvent(EVENT);

            expect(walletEventsListener).toHaveBeenCalledWith(EVENT);
        });
    });

    describe('web3 wallet proxies', () => {
        it('should make a proxy for `isInstalled` web3 wallet method', () => {
            const spy = vi.spyOn(testWallet, 'isInstalled');

            wallet.isInstalled();

            expect(spy).toBeCalled();
        });

        it('should make a proxy for `isActive` web3 wallet method', () => {
            const spy = vi.spyOn(testWallet, 'isActive');

            wallet.isActive();

            expect(spy).toBeCalled();
        });

        it('should make a proxy for `disconnect` web3 wallet method', async () => {
            const spy = vi.spyOn(testWallet, 'disconnect');

            await wallet.disconnect();

            expect(spy).toBeCalled();
        });

        it('should make a proxy for `activate` web3 wallet method', async () => {
            const spy = vi.spyOn(testWallet, 'activate');

            await wallet.activate();

            expect(spy).toBeCalled();
        });

        it('should make a proxy for `is` web3 wallet method', async () => {
            const spy = vi.spyOn(testWallet, 'is');

            await wallet.is();

            expect(spy).toBeCalled();
        });

        it('should make a proxy for `name` web3 wallet getter', async () => {
            expect(wallet.name).toBeDefined();
        });

        it('should make a proxy for `address` web3 wallet getter', async () => {
            expect(wallet.address).toBeDefined();
        });

        it('should make a proxy for `chainId` web3 wallet getter', async () => {
            expect(wallet.chainId).toBeDefined();
        });
    });

    describe('preparing of transaction object', () => {
        it('should prepare transaction object', async () => {
            const transaction = {
                from: TEST_ACCOUNT_ADDRESS,
                to: TEST_ACCOUNT_ADDRESS,
            };

            await delay();

            const tx = await wallet.prepareTransaction(transaction);

            expect(tx).toHaveProperty('from', TEST_ACCOUNT_ADDRESS);
            expect(tx).toHaveProperty('to', TEST_ACCOUNT_ADDRESS);
            expect(tx.nonce).toBeTypeOf('string');
            expect(tx.gasPrice).toBeTypeOf('string');
            expect(tx.gasLimit).toBeTypeOf('string');
        });

        it('should increase gasLimit by constant `addGas` if it is given', async () => {
            const transaction = {
                to: TEST_ACCOUNT_ADDRESS,
                gasLimit: '0x1',
            };

            await delay();

            const tx = await wallet.prepareTransaction(transaction, 1);

            expect(tx.gasLimit).toEqual('0x2');
        });

        it('should fill `from` property by current wallet address if it is not given', async () => {
            await delay();
            expect(await wallet.prepareTransaction({})).toHaveProperty(
                'from',
                TEST_ACCOUNT_ADDRESS
            );
        });
    });

    describe('transaction signing', () => {
        it('should set ref txStatus object with pending status', async () => {
            const txStatus = ref({});

            await wallet.signTransaction({ transaction: {}, txStatus });

            expect(txStatus.value.status).toBe('pending');
        });

        it('should trigger `no_wallet_set` event if no wallet is set', async () => {
            const walletEventsListener = vi.fn(() => {});
            wallet = new Wallet({ walletEventsListener, store });

            await wallet.signTransaction({ _transaction: {} });

            expect(walletEventsListener).toBeCalledWith({
                name: 'no_wallet_set',
                waitFor: [],
            });
        });

        it('should trigger `no_wallet_set` event and cancel signing of transaction if no wallet is set and promise with "cancel" is set', async () => {
            const walletEventsListener = vi.fn((event) => {
                if (event.name === 'no_wallet_set') {
                    event.waitFor.push(
                        new Promise((resolve) => {
                            resolve('cancel');
                        })
                    );
                }
            });
            wallet = new Wallet({ walletEventsListener, store });

            const ret = await wallet.signTransaction({ _transaction: {} });

            expect(ret).not.toBeDefined();
        });

        it('should trigger `bad_chain_id` event if chain id differs from default chain id', async () => {
            const walletEventsListener = vi.fn(() => {});
            wallet = new Wallet({ walletEventsListener, store });
            await wallet.setWeb3Wallet(testWallet);
            wallet.setDefaultChainId(1);

            await wallet.signTransaction({ _transaction: {} });

            expect(walletEventsListener).toBeCalledWith({
                name: 'bad_chain_id',
                data: DEFAULT_CHAIN_ID,
                waitFor: [],
            });
        });

        it('should set ref txStatus object with "error" status and error and emit an error event if something goes wrong', async () => {
            const txStatus = ref({});
            let status = null;
            const error = 'error message';
            const walletEventsListener = vi.fn(() => {});
            wallet.setEventsListener(walletEventsListener);

            await wallet.signTransaction({
                __errorMessage__: error,
                transaction: {},
                txStatus,
            });

            await new Promise((resolve) => {
                const unwatch = watch(txStatus, (st) => {
                    unwatch();

                    status = st;
                    resolve();
                });
            });

            expect(status).toEqual({
                status: 'error',
                error: new Error(error),
                code: '',
            });
            expect(walletEventsListener).toBeCalledWith({
                name: 'error',
                data: new Error(error),
                code: '',
                waitFor: [],
            });
        });

        it('should set ref txStatus object with "error" status and error and emit an error event if `signTransaction` returns an error', async () => {
            const txStatus = ref({});
            let status = null;
            const error = 'error message';
            const walletEventsListener = vi.fn(() => {});
            wallet.setEventsListener(walletEventsListener);

            await wallet.signTransaction({
                __signedTransaction__: {
                    status: 'error',
                    data: new Error(error),
                },
                transaction: {},
                txStatus,
            });

            await new Promise((resolve) => {
                const unwatch = watch(txStatus, (st) => {
                    unwatch();

                    status = st;
                    resolve();
                });
            });

            expect(status).toEqual({
                status: 'error',
                error: new Error(error),
                code: '',
                transactionHash: '',
            });
            expect(walletEventsListener).toBeCalledWith({
                name: 'error',
                data: new Error(error),
                code: '',
                waitFor: [],
            });
        });

        it('should set ref txStatus object with "success" status and signedTransaction if everything goes well', async () => {
            const txStatus = ref({});
            let status = null;
            const signedTransaction = {
                rawTransaction: '',
                transactionHash: '',
            };

            await wallet.signTransaction({
                transaction: {},
                txStatus,
                verifyTransaction: false,
                __signedTransaction__: {
                    status: 'success',
                    data: signedTransaction,
                },
            });

            await new Promise((resolve) => {
                const unwatch = watch(txStatus, (st) => {
                    unwatch();

                    status = st;
                    resolve();
                });
            });

            expect(status).toEqual({
                status: 'success',
                signedTransaction,
                verified: false,
                code: '',
            });
        });

        it('should set ref txStatus status object with given transaction code in the status object', async () => {
            const txStatus = ref({});
            let status = null;
            const signedTransaction = {
                rawTransaction: '',
                transactionHash: '',
            };

            await wallet.signTransaction({
                code: 'txcode',
                transaction: {},
                txStatus,
                verifyTransaction: false,
                __signedTransaction__: {
                    status: 'success',
                    data: signedTransaction,
                },
            });

            await new Promise((resolve) => {
                const unwatch = watch(txStatus, (st) => {
                    unwatch();

                    status = st;
                    resolve();
                });
            });

            expect(status).toEqual({
                status: 'success',
                code: 'txcode',
                signedTransaction,
                verified: false,
            });
        });
    });

    describe('personal singing', () => {
        it('should sign a message', async () => {
            const signStatus = ref({});
            const ret = await wallet.personalSign({
                __signedMessage__: 'signed message',
                message: 'message',
                signStatus,
            });

            expect(ret).toEqual({
                signedMessage: 'signed message',
            });
            expect(signStatus.value).toEqual({
                status: 'success',
                signedMessage: 'signed message',
            });
        });

        it('should return empty string and an error if something goes wrong', async () => {
            const signStatus = ref({});
            const ret = await wallet.personalSign({
                __errorMessage__: 'error message',
                message: 'message',
                signStatus,
            });

            expect(ret).toEqual({
                signedMessage: '',
                error: new Error('error message'),
            });
            expect(signStatus.value).toEqual({
                status: 'error',
                error: new Error('error message'),
                code: '',
            });
        });
    });

    describe('transaction sending', () => {
        it('should set ref txStatus object with pending status', async () => {
            const txStatus = ref({});

            await wallet.sendTransaction({ transaction: {}, txStatus });

            expect(txStatus.value.status).toBe('pending');
        });

        it('should add transaction notification', async () => {
            const addSpy = vi.spyOn(transactionNotifications, 'add');
            const txStatus = ref({});

            await wallet.sendTransaction({
                description: 'foo',
                transaction: {},
                txStatus,
            });

            expect(addSpy).toHaveBeenCalled();
        });

        it('should trigger `no_wallet_set` event if no wallet is set', async () => {
            const walletEventsListener = vi.fn(() => {});
            wallet = new Wallet({ walletEventsListener, store });

            await wallet.sendTransaction({ _transaction: {} });

            expect(walletEventsListener).toBeCalledWith({
                name: 'no_wallet_set',
                waitFor: [],
            });
        });

        it('should trigger `no_wallet_set` event and cancel sending of a transaction if no wallet is set and promise with "cancel" is set', async () => {
            const walletEventsListener = vi.fn((event) => {
                if (event.name === 'no_wallet_set') {
                    event.waitFor.push(
                        new Promise((resolve) => {
                            resolve('cancel');
                        })
                    );
                }
            });
            wallet = new Wallet({ walletEventsListener, store });

            const ret = await wallet.sendTransaction({ _transaction: {} });

            expect(ret).not.toBeDefined();
        });

        it('should trigger `bad_chain_id` event if chain id differs from default chain id', async () => {
            const walletEventsListener = vi.fn(() => {});
            wallet = new Wallet({ walletEventsListener, store });
            await wallet.setWeb3Wallet(testWallet);
            wallet.setDefaultChainId(1);

            await wallet.sendTransaction({ _transaction: {} });

            expect(walletEventsListener).toBeCalledWith({
                name: 'bad_chain_id',
                data: DEFAULT_CHAIN_ID,
                waitFor: [],
            });
        });

        it('should set ref txStatus object with "error" status and error and emit an error event if something goes wrong', async () => {
            const txStatus = ref({});
            let status = null;
            const error = 'error message';
            const walletEventsListener = vi.fn(() => {});
            wallet.setEventsListener(walletEventsListener);

            await wallet.sendTransaction({
                __errorMessage__: error,
                transaction: {},
                txStatus,
            });

            await new Promise((resolve) => {
                const unwatch = watch(txStatus, (st) => {
                    unwatch();

                    status = st;
                    resolve();
                });
            });

            expect(status).toEqual({
                status: 'error',
                error: new Error(error),
                code: '',
            });
            expect(walletEventsListener).toBeCalledWith({
                name: 'error',
                data: new Error(error),
                code: '',
                waitFor: [],
            });
        });

        it('should set ref txStatus object with "error" status and error and emit an error event if `sendTransaction` returns an error', async () => {
            const txStatus = ref({});
            let status = null;
            const error = 'error message';
            const walletEventsListener = vi.fn(() => {});
            wallet.setEventsListener(walletEventsListener);

            await wallet.sendTransaction({
                __transactionHash__: {
                    status: 'error',
                    data: new Error(error),
                },
                transaction: {},
                txStatus,
                verifyTransaction: false,
            });

            await new Promise((resolve) => {
                const unwatch = watch(txStatus, (st) => {
                    unwatch();

                    status = st;
                    resolve();
                });
            });

            expect(status).toEqual({
                status: 'error',
                error: new Error(error),
                code: '',
                transactionHash: '',
            });
            expect(walletEventsListener).toBeCalledWith({
                name: 'error',
                data: new Error(error),
                code: '',
                waitFor: [],
            });
        });

        it('should set ref txStatus object with "success" status and transactionHash if everything goes well', async () => {
            const txStatus = ref({});
            let status = null;
            const transactionHash = TEST_TRANSACTION_HASH;

            await wallet.sendTransaction({
                transaction: {},
                txStatus,
                verifyTransaction: false,
                __transactionHash__: {
                    status: 'success',
                    data: transactionHash,
                },
            });

            await new Promise((resolve) => {
                const unwatch = watch(txStatus, (st) => {
                    unwatch();

                    status = st;
                    resolve();
                });
            });

            expect(status).toEqual({
                status: 'success',
                transactionHash,
                verified: false,
                code: '',
            });
        });

        it('should set ref txStatus status object with given transaction code in the status object', async () => {
            const txStatus = ref({});
            let status = null;
            const transactionHash = TEST_TRANSACTION_HASH;

            await wallet.sendTransaction({
                code: 'txcode',
                transaction: {},
                txStatus,
                verifyTransaction: false,
                __transactionHash__: {
                    status: 'success',
                    data: transactionHash,
                },
            });

            await new Promise((resolve) => {
                const unwatch = watch(txStatus, (st) => {
                    unwatch();

                    status = st;
                    resolve();
                });
            });

            expect(status).toEqual({
                status: 'success',
                code: 'txcode',
                transactionHash,
                verified: false,
            });
        });

        it('should verify transaction if `verifyTransaction` argument is given', async () => {
            const txStatus = ref({});
            let status = null;
            wallet.verifyTransaction = async () => true;

            await wallet.sendTransaction({
                transaction: {},
                txStatus,
                __transactionHash__: {
                    status: 'success',
                    data: TEST_TRANSACTION_HASH,
                },
            });

            await new Promise((resolve) => {
                const unwatch = watch(txStatus, (st) => {
                    unwatch();

                    status = st;
                    resolve();
                });
            });

            expect(status).toEqual({
                status: 'pending',
                verifying: true,
                code: '',
                transactionHash: TEST_TRANSACTION_HASH,
            });
        });

        it('should set ref txStatus object with "error" status if transaction verifying failed', async () => {
            const txStatus = ref({});
            let status = null;
            wallet.verifyTransaction = async () => false;
            const transactionHash = TEST_TRANSACTION_HASH;

            await wallet.sendTransaction({
                transaction: {},
                txStatus,
                __transactionHash__: {
                    status: 'success',
                    data: transactionHash,
                },
            });

            await new Promise((resolve) => {
                const unwatch = watch(txStatus, (st) => {
                    if (st.status !== 'pending') {
                        unwatch();

                        status = st;
                        resolve();
                    }
                });
            });

            expect(status).toEqual({
                status: 'error',
                verifying: true,
                code: '',
                transactionHash,
                error: new Error('The transaction failed'),
            });
        });
    });

    describe('getTransactionFee()', () => {
        it('should return 0 if gas price or limit is missing', () => {
            expect(wallet.getTransactionFee('', '')).toEqual(toBigNumber(0));
        });

        it('should calculate transaction fee', () => {
            expect(wallet.getTransactionFee('0x3B9ACA00', '0x5208')).toEqual(
                toBigNumber('21000000000000')
            );
        });
    });
});
