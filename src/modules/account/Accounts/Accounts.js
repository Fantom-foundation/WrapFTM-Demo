import { addressesMatch } from '@/utils/account/account.js';
import { checkObjectProperties } from 'fantom-vue3-components';
import { i18n } from '@/config/i18n.js';

export class Accounts {
    static storeStateDef = {
        accounts: 'array',
        activeAccountAddress: 'string',
    };

    static accountDef = {
        address: 'string',
        walletName: 'string',
    };

    static #wallets = {};
    /** @type {Wallet} */
    #wallet = null;
    /** @type {AccountsStore} */
    #store = {};
    /** @type {Notifications} */
    #notifications = null;
    #oneAccountMode = false;

    /**
     * @param {AccountsStore} store Pinia store
     * @param {Wallet} wallet
     * @param {Notifications} [notifications]
     * @param {boolean} [oneAccountMode] Only one account will be allowed
     */
    constructor({
        store = {},
        wallet = null,
        notifications = null,
        oneAccountMode = false,
    }) {
        this.setStore(store);
        this.setWallet(wallet);
        this.#notifications = notifications;
        this.#oneAccountMode = oneAccountMode;

        if (this.store.activeAccountAddress) {
            this.setActiveAccountByAddress(this.store.activeAccountAddress);
        }
    }

    setWallet(wallet) {
        if (wallet && typeof wallet.setWeb3Wallet === 'function') {
            this.#wallet = wallet;
        } else {
            throw new Error('Need an instance of Wallet class');
        }
    }

    setStore(store) {
        if (!store.$id) {
            throw new Error('Not a Pinia store');
        } else if (!Accounts.isStoreStateOk(store)) {
            throw new Error(
                `Given store's state should be in the form: ${JSON.stringify(
                    Accounts.storeStateDef
                )}`
            );
        } else {
            this.#store = store;
        }
    }

    setOneAccountMode(oneAccountMode = false) {
        this.#oneAccountMode = oneAccountMode;
    }

    resetStore() {
        if (this.#store) {
            this.#store.accounts = [];
            this.#store.activeAccountAddress = '';
        }
    }

    get store() {
        return this.#store;
    }

    getAccountByAddress(address = '') {
        return this.#store.accounts.find((account) =>
            addressesMatch(account.address, address)
        );
    }

    /**
     * @param {Account} account
     * @return {Promise<boolean>}
     */
    async addAccount(account) {
        const store = this.#store;
        let accountAdded = false;

        if (Accounts.isAccountOk(account)) {
            if (
                !this.getAccountByAddress(account.address) &&
                Accounts.isKeystoreFileOk(account)
            ) {
                if (this.#oneAccountMode) {
                    if (store.accounts.length > 0) {
                        await this.removeAccountByAddress(
                            store.accounts[0].address,
                            true
                        );
                    }
                }

                this.#store.accounts.push(account);
                accountAdded = true;

                this.#showNotification({
                    type: 'success',
                    text: i18n.t('account.accountAddedSuccessfully'),
                });
            }
        } else {
            throw new Error(
                `Given account should be in the form: ${JSON.stringify(
                    Accounts.accountDef
                )}`
            );
        }

        return accountAdded;
    }

    async removeAccountByAddress(address, noNotification = false) {
        const store = this.#store;
        const index = store.accounts.findIndex((account) =>
            addressesMatch(account.address, address)
        );

        if (index > -1) {
            const address = store.accounts[index].address;

            store.accounts.splice(index, 1);

            await this.#removeActiveWallet({ address, setActiveWallet: true });

            if (!noNotification) {
                this.#showNotification({
                    type: 'success',
                    text: i18n.t('account.accountRemovedSuccessfully'),
                });
            }
        }
    }

    async removeAllAccounts() {
        if (this.#wallet.isSet()) {
            await this.#removeActiveWallet({
                address: this.#wallet.address,
                resetWalletStore: true,
            });
        }

        this.resetStore();
    }

    async setActiveAccount(account, initWalletArgs = {}) {
        if (
            addressesMatch(account.address, this.#wallet?.web3Wallet?.address) &&
            account.walletName === this.#wallet?.web3Wallet?.name
        ) {
            return;
        }

        const wallet = await this.#createWeb3WalletInstance(account);

        if (wallet) {
            const initArgs = {
                ...initWalletArgs,
            };

            if (Accounts.isKeystoreFileOk(account)) {
                initArgs.keystoreFile = account.keystoreFile;
            }

            if (account.privateKey) {
                initArgs.privateKey = account.privateKey;
            }

            if (
                account.walletName === 'ledger-fantom' ||
                account.walletName === 'ledger-ethereum'
            ) {
                initArgs.accountId = account.accountId;
                initArgs.addressId = account.addressId;
            }

            if (account.connectedWalletName) {
                initArgs.connectedWalletName = account.connectedWalletName;
            }

            await this.#wallet.setWeb3Wallet(wallet, {
                ...initArgs,
                address: account.address,
            });

            const address = account.address || wallet.address;
            if (address) {
                this.#store.activeAccountAddress = address;

                await this.addAccount({ ...account, address });
            }
        }
    }

    async setActiveAccountByAddress(address, initWalletArgs = {}) {
        const account = this.getAccountByAddress(address);

        if (account) {
            await this.setActiveAccount(account, initWalletArgs);
        } else {
            throw new Error(`Can't find account with address ${address}`);
        }
    }

    get activeAccountAddress() {
        return this.#store.activeAccountAddress;
    }

    /**
     * @param {string} bearerToken
     * @param {string} address
     */
    setBearerTokenByAddress(bearerToken, address) {
        const account = this.getAccountByAddress(address);

        if (account) {
            account.bearerToken = bearerToken;
        }
    }

    /**
     * @param {string} address
     * @return {string}
     */
    getBearerTokenByAddress(address) {
        const account = this.getAccountByAddress(address);
        let bearerToken = '';

        if (account) {
            bearerToken = account.bearerToken;
        }

        return bearerToken;
    }

    /**
     * @param {string} address
     */
    removeBearerTokenByAddress(address) {
        const account = this.getAccountByAddress(address);

        if (account) {
            delete account.bearerToken;
        }
    }

    async #createWeb3WalletInstance(account) {
        const { walletName } = account;

        if (Accounts.isWeb3WalletRegistered(walletName)) {
            const web3Wallet = Accounts.#wallets[walletName];
            let web3WalletClass = web3Wallet.clas;

            if (typeof web3Wallet.getClass === 'function') {
                web3WalletClass = await web3Wallet.getClass();
            }

            return new web3WalletClass({
                name: walletName,
                address: account.address,
                options: web3Wallet.options,
            });
        } else {
            throw new Error(`Web3 wallet with name '${walletName}' is not registered`);
        }
    }

    async #removeActiveWallet({
        address,
        setActiveWallet = false,
        resetWalletStore = false,
    }) {
        const wallet = this.#wallet;

        if (wallet.isSet() && addressesMatch(address, wallet.address)) {
            await wallet.removeWallet(
                resetWalletStore ? false : this.#store.accounts.length > 0
            );
            this.#store.activeAccountAddress = '';

            if (setActiveWallet) {
                await this.#setLastAccountAsActive();
            }
        }
    }

    async #setLastAccountAsActive() {
        const { accounts } = this.#store;

        if (accounts.length > 0) {
            await this.setActiveAccountByAddress(accounts[accounts.length - 1].address);
        }
    }

    /**
     * @param { type: string, text: string} notification
     */
    #showNotification(notification) {
        if (this.#notifications) {
            this.#notifications.add(notification);
        }
    }

    /**
     * @param {Wb3} web3Wallet
     */
    static registerWeb3Wallet(web3Wallet = {}) {
        const { name, clas, getClass } = web3Wallet;

        if (Accounts.isWeb3WalletRegistered(name)) {
            throw new Error(`Wallet ${name} already registered`);
        }

        if (clas || getClass) {
            Accounts.#wallets[name] = {
                label: web3Wallet.label,
                clas,
                getClass,
                options: web3Wallet.options ? { ...web3Wallet.options } : {},
            };
        }
    }

    static unregisterWeb3Wallet(walletName) {
        delete Accounts.#wallets[walletName];
    }

    static isWeb3WalletRegistered(walletName) {
        return walletName in Accounts.#wallets;
    }

    static isStoreStateOk(store) {
        return checkObjectProperties(store, Accounts.storeStateDef).length === 0;
    }

    static isAccountOk(account) {
        return checkObjectProperties(account, Accounts.accountDef).length === 0;
    }

    static isKeystoreFileOk(account) {
        if (
            account.keystoreFile &&
            !addressesMatch(account.keystoreFile.address, account.address)
        ) {
            throw new Error('Address in keystore file and account is different');
        }

        return true;
    }
}
