import { Auth } from './Auth.js';
import { vi } from 'vitest';
import {
    TEST_ACCOUNT_ADDRESS,
    TEST_ACCOUNT_ADDRESS2,
} from '@/plugins/web3-wallets/test-helpers.js';
import { nextTick, ref } from 'vue';

const MESSAGE = 'message';
// exp 13. March 2024 10:05:35
const JWT =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTAzMjQzMzUsInN1YiI6IjB4QTMzMmUwYTY4N2M4RTY4RkU4YzU5REEyMzYxZjVCMWE5OTkxNDQ1ZCJ9.fKf-DPY1_JQtAa_7RfSIqvQ98dEfEcutYY4p-c1oPFk';
let jwt = '';

class WalletMock {
    async personalSign({ message }) {
        return {
            signedMessage: `signed ${message}`,
        };
    }

    isSet() {
        return true;
    }

    get address() {
        return TEST_ACCOUNT_ADDRESS;
    }
}

class AccountsMock {
    setBearerTokenByAddress() {}
    getBearerTokenByAddress() {
        return '';
    }
    removeBearerTokenByAddress() {}
}

async function getMessageToSign() {
    return MESSAGE;
}

async function logIn() {
    return jwt;
}

/** @type {Auth} */
let auth = null;
let wallet = null;
let accounts = null;
let accountAddress = null;

function createAuth({
    wallet,
    accounts,
    getMessageToSign,
    logIn,
    isLogged,
    accountAddress,
}) {
    auth = new Auth({
        wallet,
        accounts,
        getMessageToSign,
        logIn,
        isLogged,
        accountAddress,
    });
}

beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 2, 10, 12));

    jwt = JWT;
    wallet = new WalletMock();
    accounts = new AccountsMock();
    accountAddress = ref(TEST_ACCOUNT_ADDRESS);
    createAuth({ wallet, accounts, getMessageToSign, logIn, accountAddress });
});

afterEach(() => {
    vi.useRealTimers();
});

describe('Auth', () => {
    it('should throw an error if a required parameter is missing on init', () => {
        expect(() => {
            new Auth({});
        }).toThrowError();
    });

    it('should set bearer token from accounts store if account address is set and bearer token for given account exists', async () => {
        accounts.getBearerTokenByAddress = () => JWT;
        accountAddress.value = '';
        createAuth({
            wallet,
            accounts,
            getMessageToSign,
            logIn,
            accountAddress,
        });

        accountAddress.value = TEST_ACCOUNT_ADDRESS;
        await nextTick();

        expect(auth.isLogged()).toBe(true);
    });

    describe('log in', () => {
        it('should return false if account address is not set', async () => {
            accountAddress.value = '';
            expect(await auth.logIn()).toBe(false);
        });

        it('should log in', async () => {
            const loggedIn = await auth.logIn();

            expect(auth.isLogged() && loggedIn).toBe(true);
        });

        it('should not log in if bearer token is not in the right form', async () => {
            jwt =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTAzMjQzMzUsInN1YiI6IjB4QTMzMmUwYTY4N2M4RTY4RkU4YzU5REEyMzYxZjVCMWE5OTkxNDQ1ZCJ9';
            createAuth({
                wallet,
                accounts,
                getMessageToSign,
                logIn,
                accountAddress,
            });

            const loggedIn = await auth.logIn();

            expect(auth.isLogged() && loggedIn).toBe(false);
        });

        it('should not log in if bearer token is expired', async () => {
            vi.setSystemTime(new Date(2024, 2, 13, 12));

            await auth.logIn();

            expect(auth.isLogged()).toBe(false);
        });

        it('should store bearer token after a successful log in', async () => {
            const setBearerTokenByAddressSpy = vi.spyOn(
                accounts,
                'setBearerTokenByAddress'
            );

            await auth.logIn();

            expect(setBearerTokenByAddressSpy).toBeCalledWith(jwt, TEST_ACCOUNT_ADDRESS);

            vi.restoreAllMocks();
        });

        it('should set given "isLogged" ref on log in', async () => {
            const isLogged = ref(false);
            createAuth({
                isLogged,
                wallet,
                accounts,
                getMessageToSign,
                logIn,
                accountAddress,
            });

            await auth.logIn();

            expect(isLogged.value).toBe(true);
        });
    });

    describe('log out', () => {
        it('should log out properly', async () => {
            await auth.logIn();

            auth.logOut();

            expect(auth.isLogged()).toBe(false);
            expect(auth.getBearerToken()).toBe('');
            expect(auth.getRole()).toBe('');
        });

        it('should log out if `accountAddress` is empty', async () => {
            await auth.logIn();

            accountAddress.value = '';
            await nextTick();

            expect(auth.isLogged()).toBe(false);
        });

        it('should log out if `accountAddress` is changed to an address with no bearer token', async () => {
            await auth.logIn();

            accountAddress.value = TEST_ACCOUNT_ADDRESS2;
            await nextTick();

            expect(auth.isLogged()).toBe(false);
        });

        it('should set given "isLogged" ref on log out', async () => {
            const isLogged = ref(false);
            createAuth({
                isLogged,
                wallet,
                accounts,
                getMessageToSign,
                logIn,
                accountAddress,
            });

            await auth.logIn();
            auth.logOut();

            expect(isLogged.value).toBe(false);
        });
    });

    it('should use "user" as a default authorized user role', async () => {
        await auth.logIn();

        expect(auth.getRole()).toBe('user');
    });
});
