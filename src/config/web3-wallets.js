import { chains } from '@/config/chains.js';

/**
 * List of available web3 wallets
 *
 * @return {Wb3[]}
 * @constructor
 */
export function WEB3_WALLETS() {
    return [
        {
            name: 'web3modal',
            label: 'Web3Modal',
            async getClass() {
                return (
                    await import('/src/plugins/web3-wallets/Web3Modal/Web3ModalWallet.js')
                ).Web3ModalWallet;
            },
            options: {
                defaultChainId: chains.defaultChain.chainId,
            },
        },
    ];
}

/**
 * @return {{}} Keys are wallet names, values are Wb3
 * @constructor
 */
export function WEB3_WALLETS_BY_NAME() {
    const wallets = {};

    WEB3_WALLETS().forEach((wallet) => {
        wallets[wallet.name] = wallet;
    });

    return wallets;
}

export function setUpWallets() {}
