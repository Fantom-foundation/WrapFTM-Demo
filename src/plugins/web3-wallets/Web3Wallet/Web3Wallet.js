import { toHex } from '@/utils/big-number/big-number.js';
import { EventsMixin } from '../EventsMixin/EventsMixin.js';
import '../types.js';

/**
 * Base class for ethers wallets.
 */
export class Web3Wallet extends EventsMixin() {
    #name = '';
    #chainId = '';
    #address = '';
    #active = false;

    /**
     * @param {string} name
     * @param {function} [walletEventsListener]
     */
    constructor({ name = '', walletEventsListener = null } = {}) {
        super();

        this.#name = name;
        // this.setWalletEventsListener(walletEventsListener);
        if (walletEventsListener) {
            this.setEventsListener(walletEventsListener);
        }

        if (!this.#name) {
            throw new Web3WalletError('Web3Wallet should have a name');
        }
    }

    /**
     * @param {Transaction} tx
     * @param {boolean} [contractDeployment]
     * @return {Promise<WalletSignTransactionData>}
     */
    // eslint-disable-next-line no-unused-vars
    /*async signTransaction({ tx = {}, contractDeployment = false } = {}) {
        throw new Error("'signTransaction' method should be implemented");
    }*/

    /**
     * @param {Transaction} tx
     * @param {boolean} [contractDeployment]
     * @return {Promise<WalletSendTransactionData>}
     */
    // eslint-disable-next-line no-unused-vars
    async sendTransaction({ tx = {}, contractDeployment = false } = {}) {
        throw new Error("'sendTransaction' method should be implemented");
    }

    async activate() {
        throw new Error("'activate' method should be implemented");
    }

    /**
     * @param {string} walletName
     * @return {boolean}
     */
    is(walletName) {
        return this.#name === walletName;
    }

    isTransactionObjectValid(tx = {}) {
        // return !!tx.to && !!tx.gas;
        return !!tx.to && !!tx.chainId;
    }

    /**
     * @return {boolean}
     */
    isInstalled() {
        return true;
    }

    isActive() {
        return this.#active;
    }

    async _disconnect() {
        await this.triggerEvent({
            name: 'disconnected',
            address: this.address,
        });
    }

    /**
     * @return {string}
     */
    get name() {
        return this.#name;
    }

    set chainId(id) {
        const chainId = toHex(id);

        if (chainId !== this.#chainId) {
            this.#chainId = chainId;
            this.triggerEvent({
                name: 'chain_change',
                data: {
                    chainId,
                    walletName: this.name,
                },
            });
        }
    }

    get chainId() {
        return this.#chainId;
    }

    set address(address) {
        let prevAddress = '';

        if (address !== this.#address) {
            prevAddress = this.#address;
            this.#address = address;
            this.triggerEvent({
                name: 'address_change',
                data: {
                    address,
                    prevAddress,
                    walletName: this.name,
                },
            });
        }
    }

    get address() {
        return this.#address;
    }

    set active(active) {
        this.#active = active;
    }
}

export class Web3WalletError extends Error {
    constructor(message) {
        super(message);

        this.name = 'Web3WalletError';
    }
}
