import { implementsInterface } from 'fantom-vue3-components/src/utils/interface/interface.js';
import { toBigNumber, toHex } from '@/utils/big-number/big-number.js';
import { checkObjectProperties, delay } from 'fantom-vue3-components';
import { EventsMixin } from '@/plugins/web3-wallets/EventsMixin/EventsMixin.js';
import { Web3WalletInterface } from '@/plugins/web3-wallets/Web3WalletInterface.js';

export class Wallet extends EventsMixin() {
    static storeStateDef = {
        address: 'string',
        chainId: 'string',
        walletName: 'string',
    };

    /** An web3 wallet */
    #wallet = null;
    /** @type {WalletStore} */
    #store = {};
    /** @type {Api} */
    #api = {};
    #transactionNotifications = null;
    #defaultChainId = '';
    /** Helper */
    #beingSetUp = false;
    #disconnectOnRemove = false;

    /**
     * @param {WalletStore} store Pinia store
     * @param {Api} api
     * @param {function} [walletEventsListener] Arg for this function is WalletEvent
     * @param {TransactionNotificationsProvider} [transactionNotifications]
     * @param {string} [defaultChainId]
     * @param {boolean} [disconnectOnRemove]
     */
    constructor({
        store = {},
        api = null,
        walletEventsListener = null,
        transactionNotifications = null,
        defaultChainId = '',
        disconnectOnRemove = true,
    } = {}) {
        super();

        this.setStore(store);
        this.#api = api;
        this.#disconnectOnRemove = disconnectOnRemove;
        this.setTransactionNotifications(transactionNotifications);

        if (walletEventsListener) {
            this.setEventsListener(walletEventsListener);
        }

        if (defaultChainId) {
            this.setDefaultChainId(defaultChainId);
        }
    }

    setTransactionNotifications(transactionNotifications) {
        this.#transactionNotifications = transactionNotifications;
    }

    async setWeb3Wallet(wallet, initWalletArgs = {}) {
        if (!this.#beingSetUp) {
            this.#beingSetUp = true;

            try {
                await this.removeWallet(true);

                if (implementsInterface(wallet, Web3WalletInterface)) {
                    this.#wallet = wallet;
                    this.#wallet.setEventsListener((...args) => {
                        this.#onWalletEvents(...args);
                    });
                    await this.#wallet.init({
                        chainId: this.#defaultChainId,
                        ...initWalletArgs,
                    });

                    if (this.#store) {
                        this.#store.walletName = this.name;
                    }
                }

                this.#beingSetUp = false;
            } catch (error) {
                this.#beingSetUp = false;
                throw error;
            }
        }
    }

    async removeWallet(keepStore = false) {
        if (this.isSet()) {
            if (this.#disconnectOnRemove) {
                await this.disconnect();
            }
            if (!keepStore) {
                this.resetStore();
            }
            this.#wallet = null;
        }
    }

    isSet() {
        return !!this.#wallet;
    }

    setStore(store) {
        if (!store || !store.$id) {
            throw new Error('Not a Pinia store');
        } else if (!Wallet.isStoreStateOk(store)) {
            throw new Error(
                `Given store's state should be in the form: ${JSON.stringify(
                    Wallet.storeStateDef
                )}`
            );
        } else {
            this.#store = store;
        }
    }

    resetStore() {
        if (this.#store) {
            this.#store.address = '';
            this.#store.chainId = '';
            this.#store.walletName = '';
        }
    }

    setDefaultChainId(chainId) {
        this.#defaultChainId = toHex(chainId);
    }

    /**
     * @param {Object} args
     * @return {Promise<void>}
     */
    async signTransaction(
        args = { transaction: null, txStatus: null, code: '', addGas: 2000 }
    ) {
        const { txStatus } = args;
        const { onError, ok } = await this.#beforeWalletAction(txStatus, args.code);

        if (!ok) {
            return;
        }

        this.prepareTransaction({ ...args.transaction }, args.addGas)
            .then((transaction) => {
                this.#proxyWeb3WalletMethod('signTransaction', {
                    ...args,
                    transaction,
                })
                    .then(async (signTransactionData) => {
                        await this.#onTransactionSuccess({
                            signTransactionData,
                            txStatus,
                            code: args.code,
                        });
                    })
                    .catch(onError);
            })
            .catch(onError);
    }

    /**
     * @param {Object} args
     * @return {Promise<void>}
     */
    async sendTransaction(
        args = {
            transaction: null,
            txStatus: null,
            verifyTransaction: true,
            code: '',
            description: '',
            addGas: 2000,
        }
    ) {
        const { txStatus, description } = args;
        const { onError, ok } = await this.#beforeWalletAction(txStatus, args.code);

        if (!ok) {
            return;
        }

        if (description) {
            this.#addTransactionNotification(description, txStatus);
        }

        this.prepareTransaction({ ...args.transaction }, args.addGas)
            .then((transaction) => {
                this.#proxyWeb3WalletMethod('sendTransaction', {
                    ...args,
                    transaction,
                })
                    .then(async (sendTransactionData) => {
                        await this.#onTransactionSuccess({
                            ...args,
                            sendTransactionData,
                            txStatus,
                            transaction,
                        });
                    })
                    .catch(onError);
            })
            .catch(onError);
    }

    async personalSign(args = { message: '', signStatus: null, checkChainId: false }) {
        const { signStatus } = args;
        const { onError, ok } = await this.#beforeWalletAction(
            signStatus,
            '',
            args.checkChainId || false
        );
        let signedMessage = '';

        if (!ok) {
            return { signedMessage };
        }

        try {
            const {
                signedMessage: sm,
                status,
                error,
            } = await this.#proxyWeb3WalletMethod('personalSign', {
                ...args,
                accountAddress: this.address,
            });

            if (status === 'success') {
                signedMessage = sm;
            }

            if (signStatus?.value) {
                signStatus.value = {
                    status,
                    signedMessage,
                };
            }

            return {
                signedMessage,
                error: error || undefined,
            };
        } catch (error) {
            onError(error);
            return { signedMessage, error };
        }
    }

    /**
     * @param {string} transactionHash
     * @param {Object} [transaction]
     * @param {function} [verifyTransactionFn]
     * @param {number} [interval] Polling interval in milliseconds
     * @param {'poll_status'|'poll_nonce'} [type]
     * @return {Promise<boolean>} Is status ok?
     * @private
     */
    async verifyTransaction({
        transactionHash,
        transaction,
        verifyTransactionFn = null,
    }) {
        if (typeof verifyTransactionFn === 'function') {
            return verifyTransactionFn({ transaction, transactionHash });
        } else {
            const prevNonce = parseInt(transaction.nonce, 16);
            const maxChecks = 100;
            const interval = 100;
            let currNonce = prevNonce;
            let checksCount = 0;

            while (currNonce === prevNonce && checksCount < maxChecks) {
                await delay(interval);
                currNonce = parseInt(await this.getNonce(transaction.from), 16);
                checksCount += 1;
            }

            return checksCount < maxChecks;
        }
    }

    async prepareTransaction(transaction, addGas = 0) {
        const tx = { ...transaction };

        if (this.isSet()) {
            if (!tx.from) {
                tx.from = this.address;
            }

            tx.nonce = await this.getNonce(this.address);
        }

        if (!tx.gasPrice) {
            tx.gasPrice = await this.getGasPrice();
        }

        if (!tx.chainId) {
            tx.chainId = parseInt(this.chainId);
            // tx.chainId = this.chainId;
        }

        // console.log('tx', JSON.stringify(tx));
        if (!tx.gasLimit) {
            tx.gasLimit = await this.getEstimateGas(tx);
        }

        if (addGas > 0) {
            tx.gasLimit = toHex(toBigNumber(tx.gasLimit).plus(addGas));
        }

        return tx;
    }

    async getNonce(address = '') {
        return this.#api ? this.#api.query.getNonce(address).promise : null;
    }

    async getGasPrice() {
        return this.#api ? this.#api.query.getGasPrice().promise : null;
    }

    async getEstimateGas(transaction = {}) {
        return this.#api ? this.#api.query.getEstimateGas(transaction).promise : null;
    }

    async getTransactionStatus(transactionHash) {
        return this.#api
            ? this.#api.query.getTransactionStatus(transactionHash).promise
            : null;
    }

    /**
     * Get transaction fee in WEI
     *
     * @param {string|number|BigNumber0} gasPrice
     * @param {string|number|BigNumber0} gasLimit
     * @return {BigNumber0}
     */
    getTransactionFee(gasPrice = '', gasLimit) {
        let fee = toBigNumber(0);

        if (gasPrice && gasLimit) {
            fee = toBigNumber(gasPrice).multipliedBy(gasLimit);
        }

        return fee;
    }

    isInstalled() {
        return this.#proxyWeb3WalletMethod('isInstalled');
    }

    isActive() {
        return this.#proxyWeb3WalletMethod('isActive');
    }

    is(walletName = '') {
        return this.#proxyWeb3WalletMethod('is', walletName);
    }

    async disconnect() {
        return this.#proxyWeb3WalletMethod('disconnect');
    }

    async activate(currentAddress = '') {
        return this.#proxyWeb3WalletMethod('activate', currentAddress);
    }

    get name() {
        return this.#proxyWeb3WalletGetter('name');
    }

    get address() {
        return this.#proxyWeb3WalletGetter('address');
    }

    get chainId() {
        return this.#proxyWeb3WalletGetter('chainId');
    }

    get store() {
        return this.#store;
    }

    get web3Wallet() {
        return this.#wallet;
    }

    get defaultChainId() {
        return this.#defaultChainId;
    }

    /**
     * @param {Ref<FTransactionStatus>} txStatus
     * @param {string} code
     * @param {boolean} [checkChainId]
     * @return {Promise<{onError: onError, ok: boolean}|{ok: boolean}>}
     */
    async #beforeWalletAction(txStatus, code = '', checkChainId = true) {
        let ok =
            (await this.#isWalletSet()) &&
            (await this.#isWalletActive()) &&
            (checkChainId ? await this.#isChainIdCorrect() : true);

        /*if (ok) {
            ok = await this.#isWalletActive();

            if (ok) {
                ok = await this.#isChainIdCorrect();
            }
        }*/

        return { onError: ok ? this.#initTxStatus(txStatus, code) : null, ok };
    }

    /**
     * @param {Ref<FTransactionStatus>} txStatus
     * @param {Object} error
     */
    #setError(txStatus, error) {
        if (txStatus) {
            txStatus.value = error;
        }

        this.triggerEvent({
            name: 'error',
            data: error.error,
            code: error.code,
        });

        console.error(error.error);
    }

    /**
     * @param {Ref<FTransactionStatus>} txStatus
     * @param {string} code
     * @return {onError}
     */
    #initTxStatus(txStatus, code) {
        if (txStatus) {
            txStatus.value = {
                status: 'pending',
                code,
            };
        }

        return (error) => {
            this.#setError(txStatus, {
                status: 'error',
                code,
                error,
            });
        };
    }

    /**
     * @param {WalletSendTransactionData} sendTransactionData
     * @param {WalletSignTransactionData} signTransactionData
     * @param {FTransactionStatus} txStatus
     * @param verifyTransaction
     * @param code
     * @param {Object} [transaction]
     * @param {Object} [verifyTxOptions]
     * @param {function} [verifyTransactionFn]
     * @return {Promise<void>}
     * @private
     */
    async #onTransactionSuccess({
        sendTransactionData,
        signTransactionData,
        txStatus,
        verifyTransaction = true,
        code = '',
        transaction = {},
        verifyTransactionFn = null,
    }) {
        let verified = false;
        let error = null;
        const transactionHash = sendTransactionData?.data;
        const status =
            signTransactionData?.status || sendTransactionData?.status || 'success';

        if (verifyTransaction && transactionHash && status === 'success') {
            if (txStatus) {
                txStatus.value = {
                    status: 'pending',
                    code,
                    transactionHash,
                    verifying: true,
                };
            }

            verified = await this.verifyTransaction({
                transactionHash,
                transaction,
                verifyTransactionFn,
            });

            if (!verified) {
                error = {
                    status: 'error',
                    code,
                    transactionHash,
                    verifying: true,
                    error: new Error('The transaction failed'),
                };
            }
        }

        if (error) {
            this.#setError(txStatus, error);
        } else if (txStatus) {
            if (status === 'error') {
                this.#setError(txStatus, {
                    status: 'error',
                    code,
                    transactionHash: '',
                    error: signTransactionData?.data || sendTransactionData?.data,
                });
            } else {
                txStatus.value = {
                    status,
                    code,
                    signedTransaction: signTransactionData?.data,
                    transactionHash,
                    verified,
                };
            }
        }
    }

    #addTransactionNotification(text, txStatus) {
        const transactionNotifications = this.#transactionNotifications;

        if (transactionNotifications) {
            transactionNotifications.add({ text }, txStatus);
        }
    }

    /**
     * @return {Promise<boolean>}
     */
    async #isWalletSet() {
        let isSet = true;
        let result = null;

        if (!this.isSet()) {
            result = await this.triggerEvent({
                name: 'no_wallet_set',
            });

            if (!result || (Array.isArray(result) && result[0] === 'cancel')) {
                isSet = false;
            }
        }

        return isSet;
    }
    /**
     * @return {Promise<boolean>}
     */
    async #isWalletActive() {
        let isActive = true;
        // let result = null;

        if (!this.isActive()) {
            const requestAddress = await this.activate(this.#store.address);

            isActive = this.isActive();

            if (!isActive) {
                await this.triggerEvent({
                    name: 'wallet_inactive',
                    data: {
                        address: this.#store.address,
                        requestAddress,
                    },
                });
                /*result = await this.triggerEvent({
                    name: 'wallet_inactive',
                    data: this.#store.address,
                });

                if (!result || (Array.isArray(result) && result[0] === 'cancel')) {
                    isActive = false;
                }*/
            }
        }

        return isActive;
    }

    /**
     * @return {Promise<boolean>}
     */
    async #isChainIdCorrect() {
        let isOk = true;
        let result = null;

        if (this.defaultChainId !== this.chainId) {
            result = await this.triggerEvent({
                name: 'bad_chain_id',
                data: this.chainId,
            });

            if (Array.isArray(result) && result[0] === 'cancel') {
                isOk = false;
            }
        }

        return isOk;
    }

    /**
     * @param {WalletEvent} event
     */
    #onWalletEvents(event) {
        if (this.#store) {
            if (event.name === 'chain_change') {
                this.#store.chainId = event.data.chainId || '';
            } else if (event.name === 'address_change') {
                this.#store.address = event.data.address;
            }
        }

        this.triggerEvent(event);
    }

    #proxyWeb3WalletMethod(methodName, ...args) {
        if (this.isSet()) {
            return this.#wallet[methodName](...args);
        }

        throw new Error('An web3 wallet is not set');
    }

    #proxyWeb3WalletGetter(getterName) {
        if (this.isSet()) {
            return this.#wallet[getterName];
        }

        throw new Error('An web3 wallet is not set');
    }

    static isStoreStateOk(store) {
        return checkObjectProperties(store, Wallet.storeStateDef).length === 0;
    }
}

/**
 * Transaction object
 * @typedef {Object} Transaction
 * @property {string} from Address
 * @property {string} to Address
 * @property {string} gasPrice Hex number in WEI
 * @property {string} gasLimit Hex number
 * @property {string} data
 * @property {string} [nonce]
 */

/**
 * FTransactionStatus object
 * @typedef {Object} FTransactionStatus
 * @property {'pending'|'success'|'rejected'|'error'} status
 * @property {SignedTransaction} signedTransaction
 * @property {string} code
 * @property {boolean} [verifying]
 * @property {boolean} [verified]
 * @property {Error} [error]
 */

/**
 * WalletEvent object
 * @typedef {Object} WalletEvent
 * @property {'chain_change'|'address_change'|'no_wallet_set'|'bad_chain_id'} name Event name
 * @property {*} [data] Event's data
 * @property {array} [waitFor] Array of promises to be await. Possible returns: 'cancel' -> cancels tx signing
 */
