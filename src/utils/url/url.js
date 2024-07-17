import { chains } from '@/config/chains.js';

export function getDefaultChainExplorerUrl() {
    let explorerUrl = chains.defaultChain.explorerUrl;

    if (Array.isArray(explorerUrl)) {
        explorerUrl = explorerUrl[0];
    }

    return explorerUrl;
}

/**
 * @param {string} transactionHash
 * @return {string}
 */
export function getTransactionUrl(transactionHash) {
    return new URL(transactionHash, `${getDefaultChainExplorerUrl()}/tx/`).href;
}

/**
 * @param {string} address
 * @return {string}
 */
export function getAddressUrl(address) {
    return new URL(address, `${getDefaultChainExplorerUrl()}/address/`).href;
}
