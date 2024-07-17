import { toHex } from '../big-number/big-number.js';

export class Chains {
    #chains = [];
    #defaultChainId = '';
    #defaultChain = null;

    /**
     * @param {Chain[]} chains
     * @param {string} [defaultChainId]
     */
    constructor({ chains = [], defaultChainId = '' } = {}) {
        this.setUp({ chains, defaultChainId });
    }

    /**
     * @param {Chain[]} chains
     * @param {string} [defaultChainId]
     */
    setUp({ chains = [], defaultChainId = '' }) {
        this.setChains(chains);
        this.setDefaultChainId(defaultChainId);
    }

    setChains(chains = []) {
        this.#chains = (chains || []).map((chain) => Object.freeze(chain));
    }

    setDefaultChainId(defaultChainId) {
        this.#defaultChainId = defaultChainId || '';
        this.#defaultChain = this.get(this.#defaultChainId) || this.#chains[0];
    }

    /**
     * Get chain by chain id
     *
     * @param {string|number} id
     * @return {Chain|undefined}
     */
    get(id) {
        return this.getBy(toHex(id), 'chainId');
    }

    /**
     * @param {string} value
     * @param {string} chainPropName
     * @return {Chain|undefined}
     */
    getBy(value, chainPropName) {
        return this.#chains.find((chain) => {
            return chain[chainPropName] === value;
        });
    }

    /**
     * @return {Chain|undefined}
     */
    get defaultChain() {
        return this.#defaultChain;
    }

    /**
     * @return {Chain[]}
     */
    get chains() {
        return this.#chains;
    }

    getMetamaskChainsInfo() {
        const chains = {};

        this.#chains.forEach((chain) => {
            chains[chain.chainId] = {
                chainId: chain.chainId,
                chainName: chain.name,
                nativeCurrency: {
                    name: chain.nativeToken.name,
                    symbol: chain.nativeToken.symbol,
                    decimals: chain.nativeToken.decimals,
                },
                rpcUrls: [chain.rpcUrl],
                blockExplorerUrls: [chain.explorerUrl],
            };
        });

        return chains;
    }
}

/**
 * Chain object
 * @typedef {Object} Chain
 * @property {string|number} chainId
 * @property {string} name
 * @property {string} [code]
 * @property {string} currencySymbol
 * @property {Token} nativeToken
 * @property {string} rpcUrl
 * @property {string} explorerUrl
 */
