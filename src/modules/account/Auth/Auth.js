import { watch } from 'vue';

export class Auth {
    /** @type {Wallet} */
    #wallet = null;
    /** @type {Accounts} */
    #accounts = null;
    /** @type {function} */
    #getMessageToSign = null;
    /** @type {function} */
    #logIn = null;
    /** JSON web token */
    #jwt = '';
    /** Role of authorized user */
    #role = '';
    /** @type {Ref<boolean>} */
    #isLogged = null;
    /** @type {Ref<string>} */
    #accountAddress = null;

    /**
     * @param {Wallet} wallet
     * @param {Accounts} accounts
     * @param {function} getMessageToSign Async function
     * @param {function} logIn Async function. It should return jwt. Function arguments: { accountAddress }
     * @param {Ref<string>} accountAddress
     * @param {Ref<boolean>} [isLogged]
     */
    constructor({
        wallet = null,
        accounts = null,
        getMessageToSign = null,
        logIn = null,
        accountAddress = null,
        isLogged = null,
    }) {
        this.#wallet = wallet;
        this.#accounts = accounts;
        this.#getMessageToSign = getMessageToSign;
        this.#logIn = logIn;
        this.#isLogged = isLogged;
        this.#accountAddress = accountAddress;

        if (
            !this.#wallet ||
            !this.#accountAddress ||
            !this.#accounts ||
            !this.#getMessageToSign ||
            !this.#logIn
        ) {
            throw new Error('Required argument is missing');
        }

        this.#watchAccountAddress();
    }

    /**
     * @return {boolean}
     */
    async logIn() {
        if (!this.#wallet || !this.#accountAddress.value || !this.#accounts) {
            return false;
        }

        const message = await this.#getMessageToSign();

        if (message) {
            const sign = await this.#wallet.personalSign({ message });

            if (sign?.signedMessage) {
                const jwt = await this.#logIn({
                    message,
                    signedMessage: sign.signedMessage,
                    accountAddress: this.#accountAddress.value,
                });

                if (this.#isJwtValid(jwt)) {
                    this.#setBearerToken(jwt);
                    this.#role = 'user';
                }
            }
        }

        return this.isLogged();
    }

    logOut(removeBearerTokenFromTheStore = true) {
        this.#jwt = '';
        this.#role = '';
        this.#setIsLoggedRef(false);

        const accountAddress = this.#accountAddress.value;
        if (removeBearerTokenFromTheStore && accountAddress) {
            this.#accounts.removeBearerTokenByAddress(accountAddress);
        }
    }

    /**
     * @return {boolean}
     */
    isLogged() {
        return !!this.getBearerToken();
    }

    getRole() {
        return this.#role;
    }

    /**
     * @return {string}
     */
    getBearerToken() {
        let jwt = this.#jwt;

        if (jwt && !this.#isJwtValid(jwt)) {
            this.logOut();
            jwt = '';
        }

        return jwt;
    }

    #setBearerToken(jwt) {
        this.#setJWT(jwt);
        this.#accounts.setBearerTokenByAddress(jwt, this.#accountAddress.value);
    }

    #setBearerTokenFromStore(accountAddress) {
        this.#setJWT(this.#getBearerTokenFromStore(accountAddress));
    }

    #setJWT(jwt) {
        this.#jwt = jwt;

        if (jwt) {
            this.#setIsLoggedRef(true);
        } else {
            this.logOut();
        }
    }

    #getBearerTokenFromStore(accountAddress) {
        return this.#accounts.getBearerTokenByAddress(accountAddress);
    }

    #setIsLoggedRef(value) {
        if (this.#isLogged) {
            this.#isLogged.value = value;
        }
    }

    #watchAccountAddress() {
        if (this.#accountAddress) {
            watch(
                this.#accountAddress,
                (accountAddress) => {
                    if (accountAddress) {
                        this.#setBearerTokenFromStore(accountAddress);
                    } else {
                        this.logOut(false);
                    }
                },
                { immediate: true }
            );
        }
    }

    #isJwtValid(token) {
        try {
            const parts = token.split('.');

            if (parts.length !== 3) {
                return false;
            }

            const expiration = JSON.parse(atob(parts[1])).exp;
            const now = new Date().getTime() / 1000;
            const expirationIn = expiration - now;

            // expiring in less than 2 minutes?
            if (expirationIn < 60 * 2) {
                console.warn('Bearer token expired');
                return false;
            }

            return true;
        } catch (e) {
            console.warn('Parsing JWT Bearer Token failed', e);
            return false;
        }
    }
}
