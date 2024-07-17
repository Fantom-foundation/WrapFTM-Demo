import { ethers } from 'ethers';

export class RpcProvider {
    /** @type {Chains} */
    #chains = null;
    /** @type {function} */
    #createProvider = null;
    /** @type {JsonRpcProvider} */
    #provider = null;
    /** @type {Object.<string, JsonRpcProvider>} */
    #providers = {};

    /**
     * @param {Chains} chains
     * @param {function(rpcUrl: string):JsonRpcProvider} [createProvider]
     * @param {string} [defaultChainId]
     */
    constructor({ chains, createProvider = null, defaultChainId = '' }) {
        if (!chains) {
            throw new Error('Need instance of `Chains`');
        }

        this.#chains = chains;
        this.#createProvider = createProvider || this.#createJsonRpcProvider;

        this.setByChainId(defaultChainId || this.#chains.defaultChain.chainId);
    }

    /**
     * @param {string} chainId
     */
    setByChainId(chainId) {
        this.#provider = this.getJsonRpcProviderByChainId(chainId);
    }

    /**
     * @param {string} contractAddress
     * @param {Object} abi
     * @param {string} [chainId]
     * @return {Contract}
     */
    getContract(contractAddress, abi, chainId) {
        return new ethers.Contract(
            contractAddress,
            abi,
            chainId ? this.getJsonRpcProviderByChainId(chainId) : this.#provider
        );
    }

    getJsonRpcProviderByChainId(chainId) {
        let provider = this.#providers[chainId] || null;

        if (!provider) {
            provider = this.#createProviderByChainId(chainId);

            if (!provider) {
                throw new Error(`Can't find provider by chain id ${chainId}`);
            }
        }

        return provider;
    }

    /**
     * @return {JsonRpcProvider}
     */
    get jsonRpcProvider() {
        return this.#provider;
    }

    #createProviderByChainId(chainId) {
        const chain = this.#chains.get(chainId);
        let provider = null;

        if (chain) {
            provider = this.#createProvider(chain.rpcUrl);
            this.#providers[chain.chainId] = provider;
        }

        return provider;
    }

    #createJsonRpcProvider(rpcUrl) {
        return new ethers.providers.StaticJsonRpcProvider(rpcUrl);
    }
}
