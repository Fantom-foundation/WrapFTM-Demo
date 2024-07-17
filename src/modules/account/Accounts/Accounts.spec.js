import { Accounts } from './Accounts.js';
import { defineStore } from 'pinia';
import { useWallet } from '@/modules/wallet/composables/useWallet/useWallet.js';
import {
    TEST_ACCOUNT_ADDRESS,
    TEST_ACCOUNT_ADDRESS2,
    TestWeb3Wallet,
} from '@/plugins/web3-wallets/test-helpers.js';
import { vi } from 'vitest';
import { i18n } from '@/config/i18n.js';
import { flushPromises } from '@vue/test-utils';

const TEST_WALLET_NAME = 'testwallet';
const TEST_WALLET_NAME2 = 'testwallet2';
function TEST_ACCOUNT() {
    return {
        address: TEST_ACCOUNT_ADDRESS,
        walletName: TEST_WALLET_NAME,
    };
}

function TEST_ACCOUNT2() {
    return {
        ...TEST_ACCOUNT(),
        address: TEST_ACCOUNT_ADDRESS2,
    };
}

function TEST_ACCOUNT3() {
    return {
        address: TEST_ACCOUNT_ADDRESS2,
        walletName: TEST_WALLET_NAME2,
    };
}

const { wallet } = useWallet(true);
/** @type {Accounts} */
let accounts = null;
let store = null;
let notifications = null;
const useTestStore = defineStore('accounts_test_store', {
    state: () => {
        return {
            accounts: [],
            activeAccountAddress: '',
        };
    },
});

class NotificationsMock {
    add() {}
}

function createAccounts({ callback, oneAccountMode = false } = {}) {
    Accounts.registerWeb3Wallet({
        name: TEST_WALLET_NAME,
        clas: TestWeb3Wallet,
    });
    Accounts.registerWeb3Wallet({
        name: TEST_WALLET_NAME2,
        clas: TestWeb3Wallet,
    });
    store = useTestStore();
    notifications = new NotificationsMock();

    if (callback) {
        callback();
    }

    accounts = new Accounts({ store, wallet, notifications, oneAccountMode });
}

async function destroyAccounts() {
    accounts.resetStore();
    Accounts.unregisterWeb3Wallet(TEST_WALLET_NAME);
    Accounts.unregisterWeb3Wallet(TEST_WALLET_NAME2);
    store = null;
    accounts = null;
    notifications = null;
    await wallet.removeWallet();
}

beforeEach(() => {
    createAccounts();
});

afterEach(async () => {
    await destroyAccounts();
});

describe('Accounts', () => {
    describe('web3wallet registration', () => {
        it('should register a web3wallet class', () => {
            expect(Accounts.isWeb3WalletRegistered(TEST_WALLET_NAME)).toBe(true);
        });

        it('should unregister web3wallet by wallet name', () => {
            Accounts.unregisterWeb3Wallet(TEST_WALLET_NAME);

            expect(Accounts.isWeb3WalletRegistered(TEST_WALLET_NAME)).toBe(false);
        });

        it('should throw an error if wallet is registered already', () => {
            expect(() => {
                Accounts.registerWeb3Wallet({
                    name: TEST_WALLET_NAME,
                    clas: TestWeb3Wallet,
                });
            }).toThrowError();
        });
    });

    describe('account store', () => {
        it('should provide access to account store', () => {
            expect(accounts.store.$id).toBe('accounts_test_store');
        });

        it('should reset account store to initial values', () => {
            store.accounts = [{}];
            store.activeAccountAddress = '0x123';

            accounts.resetStore();

            expect(accounts.store.accounts).toEqual([]);
            expect(accounts.store.activeAccountAddress).toEqual('');
        });

        it('should check if given store is Pinia store', () => {
            expect(() => {
                accounts.setStore({});
            }).toThrowError();
        });

        it('should check if given store has expected form of its state', () => {
            expect(() => {
                accounts.setStore({ $id: 'foo', $reset() {} });
            }).toThrowError();
        });
    });

    describe('on initialization', () => {
        it('should set active account by address from the store if it is available', async () => {
            destroyAccounts();
            createAccounts({
                callback: () => {
                    store.accounts.push(TEST_ACCOUNT());
                    store.activeAccountAddress = TEST_ACCOUNT_ADDRESS;
                },
            });

            await flushPromises();

            expect(wallet.address).toBe(TEST_ACCOUNT_ADDRESS);
        });
    });

    describe('getting an account', () => {
        it('should get account by address', () => {
            accounts.store.accounts.push({
                address: TEST_ACCOUNT_ADDRESS,
            });

            expect(accounts.getAccountByAddress(TEST_ACCOUNT_ADDRESS)).toEqual({
                address: TEST_ACCOUNT_ADDRESS,
            });
        });

        it('should get active account', async () => {
            const testAccount = TEST_ACCOUNT();
            await accounts.addAccount(testAccount);
            await accounts.setActiveAccount(testAccount);

            expect(accounts.activeAccountAddress).toBe(testAccount.address);
        });
    });

    describe('adding new account', () => {
        it('should add new account', async () => {
            const testAccount = TEST_ACCOUNT();
            expect(await accounts.addAccount(testAccount)).toBe(true);
            expect(accounts.getAccountByAddress(TEST_ACCOUNT_ADDRESS)).toEqual(
                testAccount
            );
        });

        it('should throw an error if added account is not in expected form', async () => {
            await expect(async () => {
                await accounts.addAccount({});
            }).rejects.toBeInstanceOf(Error);
        });

        it('should not add account if account already exists', async () => {
            const testAccount = TEST_ACCOUNT();
            await accounts.addAccount(testAccount);
            await accounts.addAccount(testAccount);

            expect(accounts.store.accounts).toHaveLength(1);
        });

        it('should return false if account already exists', async () => {
            const testAccount = TEST_ACCOUNT();
            await accounts.addAccount(testAccount);

            expect(await accounts.addAccount(testAccount)).toBe(false);
        });

        it('should show notification if account was successfully added and notifications instance is injected', async () => {
            const addNotificationSpy = vi.spyOn(notifications, 'add');

            await accounts.addAccount(TEST_ACCOUNT());

            expect(addNotificationSpy).toHaveBeenCalledWith({
                type: 'success',
                text: i18n.t('account.accountAddedSuccessfully'),
            });

            vi.restoreAllMocks();
        });
    });

    describe('removing account by address', () => {
        it('should remove account by address', async () => {
            const testAccount = TEST_ACCOUNT();
            await accounts.addAccount(testAccount);

            await accounts.removeAccountByAddress(testAccount.address);

            expect(accounts.store.accounts).toEqual([]);
        });

        it('should remove active wallet', async () => {
            const testAccount = TEST_ACCOUNT();
            await accounts.addAccount(testAccount);
            await accounts.setActiveAccount(testAccount);

            await accounts.removeAccountByAddress(testAccount.address);

            expect(wallet.isSet()).toBe(false);
        });

        it('should set the last wallet in the list as active if the active wallet is removed', async () => {
            const testAccount = TEST_ACCOUNT();
            await accounts.addAccount(testAccount);
            await accounts.addAccount(TEST_ACCOUNT3());
            await accounts.setActiveAccount(testAccount);

            await accounts.removeAccountByAddress(testAccount.address);

            expect(wallet.address).toBe(TEST_ACCOUNT3().address);
        });

        it('should reset activeAccountAddress if account to be removed is active account', async () => {
            const testAccount = TEST_ACCOUNT();
            accounts.addAccount(testAccount);
            await accounts.setActiveAccount(testAccount);

            await accounts.removeAccountByAddress(testAccount.address);

            expect(accounts.store.activeAccountAddress).toBe('');
        });

        it('should show notification if account was successfully removed and notifications instance is injected', async () => {
            const testAccount = TEST_ACCOUNT();
            const addNotificationSpy = vi.spyOn(notifications, 'add');

            await accounts.addAccount(testAccount);
            await accounts.removeAccountByAddress(testAccount.address);

            expect(addNotificationSpy).toHaveBeenCalledWith({
                type: 'success',
                text: i18n.t('account.accountRemovedSuccessfully'),
            });

            vi.restoreAllMocks();
        });
    });

    describe('removing all accouts', () => {
        it('should remove all account', async () => {
            await accounts.addAccount(TEST_ACCOUNT());
            await accounts.addAccount(TEST_ACCOUNT2());

            await accounts.removeAllAccounts();

            expect(accounts.store.accounts).toHaveLength(0);
        });

        it('should remove active wallet', async () => {
            const testAccount = TEST_ACCOUNT();
            await accounts.addAccount(testAccount);
            await accounts.addAccount(TEST_ACCOUNT2());
            await accounts.setActiveAccount(testAccount);

            await accounts.removeAllAccounts();

            expect(wallet.isSet()).toBe(false);
        });
    });

    describe('setting active account', () => {
        it('should throw an error if there is no registered web3wallet with given name', async () => {
            await expect(
                accounts.setActiveAccount({
                    ...TEST_ACCOUNT(),
                    walletName: 'foo',
                })
            ).rejects.toBeInstanceOf(Error);
        });

        it('should throw an error if address of account and address in keystore file is different', async () => {
            await expect(
                accounts.setActiveAccount({
                    ...TEST_ACCOUNT(),
                    keystoreFile: {
                        address: TEST_ACCOUNT_ADDRESS2,
                    },
                })
            ).rejects.toBeInstanceOf(Error);
        });

        it('should set active account', async () => {
            const testAccount = TEST_ACCOUNT();
            await accounts.addAccount(testAccount);

            await accounts.setActiveAccount(testAccount);

            expect(wallet.address).toBe(TEST_ACCOUNT_ADDRESS);
        });

        it('should set active account and pass keystore file to web3wallet instance if account has a keystoreFile', async () => {
            const testAccount = {
                ...TEST_ACCOUNT(),
                address: TEST_ACCOUNT_ADDRESS2,
                keystoreFile: {
                    address: TEST_ACCOUNT_ADDRESS2,
                },
            };

            await accounts.setActiveAccount(testAccount);

            expect(wallet.address).toBe(TEST_ACCOUNT_ADDRESS2);
        });

        it('should save active account address in the store', async () => {
            const testAccount = TEST_ACCOUNT();
            await accounts.addAccount(testAccount);

            await accounts.setActiveAccount(testAccount);

            expect(accounts.store.activeAccountAddress).toBe(testAccount.address);
        });
    });

    describe('setting active account by address', () => {
        it('should throw an error if account is not found', async () => {
            await expect(
                accounts.setActiveAccountByAddress(TEST_ACCOUNT_ADDRESS)
            ).rejects.toBeInstanceOf(Error);
        });

        it('should set active account by address', async () => {
            await accounts.addAccount(TEST_ACCOUNT());

            await accounts.setActiveAccountByAddress(TEST_ACCOUNT_ADDRESS);

            expect(wallet.address).toBe(TEST_ACCOUNT_ADDRESS);
        });
    });

    describe('one account mode', () => {
        it('should handle only one account if "one account" mode is on', async () => {
            destroyAccounts();
            createAccounts({ oneAccountMode: true });

            await accounts.addAccount(TEST_ACCOUNT());
            await accounts.addAccount(TEST_ACCOUNT2());

            expect(accounts.store.accounts).toHaveLength(1);
            expect(accounts.store.accounts[0].address).toBe(TEST_ACCOUNT2().address);
        });
    });

    describe('bearer token manipulation', () => {
        it('should set a bearer token by address', async () => {
            const testAccount = TEST_ACCOUNT();
            await accounts.addAccount(testAccount);
            await accounts.setActiveAccountByAddress(testAccount.address);

            accounts.setBearerTokenByAddress('bearer token', testAccount.address);

            expect(accounts.store.accounts[0].bearerToken).toBe('bearer token');
        });

        it('should get a bearer token by address', async () => {
            const testAccount = TEST_ACCOUNT();
            await accounts.addAccount(testAccount);
            await accounts.setActiveAccountByAddress(testAccount.address);

            accounts.setBearerTokenByAddress('bearer token', testAccount.address);

            expect(accounts.getBearerTokenByAddress(testAccount.address)).toBe(
                'bearer token'
            );
        });

        it('should remove a bearer token by address', async () => {
            const testAccount = TEST_ACCOUNT();
            await accounts.addAccount(testAccount);
            await accounts.setActiveAccountByAddress(testAccount.address);

            accounts.setBearerTokenByAddress('bearer token', testAccount.address);
            accounts.removeBearerTokenByAddress(testAccount.address);

            expect(accounts.store.accounts[0].bearerToken).toBeUndefined();
        });
    });
});
