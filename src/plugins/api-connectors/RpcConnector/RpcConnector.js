import { toHex } from '@/utils/big-number/big-number.js';

export class RpcConnector {
    /** @type {RpcProvider} */
    #rpcProvider = null;
    /** @type {Object<string, Object>}*/
    #abis = {};

    /**
     * @param {RpcProvider} [rpcProvider]
     * @param {Object<string, Object>} [abis]
     */
    constructor({ rpcProvider, abis } = {}) {
        this.setRpcProvider(rpcProvider);
        this.setAbis(abis);
    }

    /**
     * @param {RpcProvider} rpcProvider
     */
    setRpcProvider(rpcProvider = null) {
        this.#rpcProvider = rpcProvider;
    }

    /**
     * @param {Object<string, Object>} abis
     */
    setAbis(abis = {}) {
        this.#abis = abis;
    }

    /**
     * @param {function|{abi: string, fn: string, contract: string}} query
     * @param {Object|array} [variables]
     * @param {Object} [options]
     * @return {Promise<*>}
     */
    async processQuery(query, variables, options = {}) {
        return this.#processRequest(query, variables, options);
    }

    /**
     * @param {function|{abi: string, fn: string, contract: string}} mutation
     * @param {Object|array} [variables]
     * @param {Object} [options]
     * @return {Promise<*>}
     */
    async processMutation(mutation, variables, options = {}) {
        return this.#processRequest(mutation, variables, options);
    }

    /**
     * @param {Object} result
     * @return {*}
     */
    processResult(result) {
        const hex = result?._hex;

        return hex ? toHex(hex) : result;
    }

    /**
     * @param {function|{abi: string, fn: string, contract: string}} req
     * @param {Object|array} [variables]
     * @param {Object} [options]
     * @return {Promise<*>}
     */
    async #processRequest(req, variables = null, options = {}) {
        const rpcProvider = this.#getRpcProvider();

        if (typeof req === 'function') {
            const chainId = variables?.chainId || options.chainId;

            return req({
                variables,
                options,
                jsonRpcProvider: chainId
                    ? rpcProvider.getJsonRpcProviderByChainId(chainId)
                    : rpcProvider.jsonRpcProvider,
                getContract: (contractAddress, abi) =>
                    this.#getContract(contractAddress, abi, chainId),
            });
        }
    }

    #getContract(contractAddress, abi, chainId) {
        const rpcProvider = this.#getRpcProvider();
        const abiObj = typeof abi === 'string' ? this.#abis[abi] : abi;

        if (typeof abi === 'string' && !abiObj) {
            throw new Error(`Can't find abi with id '${abi}'`);
        }

        return rpcProvider.getContract(contractAddress, abiObj, chainId);
    }

    /**
     * @return {RpcProvider}
     */
    #getRpcProvider() {
        if (!this.#rpcProvider) {
            throw new Error('No rpc provider is given');
        }

        return this.#rpcProvider;
    }
}
