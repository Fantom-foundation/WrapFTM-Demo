import { chains } from '@/config/chains.js';
import { appConfig } from '@/config/app-config.js';

const defaultChain = chains.get(appConfig.defaultChainId);

function getChains() {
    const w3mChains = [];

    w3mChains.push(chains.get('0xfa'));
    // w3mChains.push(chains.get('0xfa2'));

    return w3mChains.map((chain) => ({
        ...chain,
        currency: 'FTM',
        chainId: parseInt(chain.chainId, 16),
    }));
    /*
    return [
        {
            chainId: 1,
            name: 'Ethereum',
            currency: 'ETH',
            explorerUrl: 'https://etherscan.io',
            rpcUrl: 'https://cloudflare-eth.com',
        },
        {
            chainId: 42161,
            name: 'Arbitrum',
            currency: 'ETH',
            explorerUrl: 'https://arbiscan.io',
            rpcUrl: 'https://arb1.arbitrum.io/rpc',
        },
    ];
*/
}

export function getWeb3ModalOptions() {
    const url = new URL(window.location.href);
    const appIcon = appConfig.image;

    return {
        projectId: import.meta.env.VITE_WEB3_MODAL_PROJECT_ID,
        ethersConfig: {
            metadata: {
                name: appConfig.title,
                description: appConfig.description,
                url: url.origin,
                icons: [`${url.origin}${appIcon}`],
            },
            defaultChainId: parseInt(defaultChain.chainId, 16),
            rpcUrl: defaultChain.rpcUrl,
        },
        chains: getChains(),
        chainImages: {
            250: appIcon,
            4002: appIcon,
        },
        /*
        featuredWalletIds: [
            'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
            '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
            '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
        ],
*/
        featuredWalletIds: [],
        // themeMode: 'dark', // 'light',
        themeVariables: {
            '--w3m-font-family': 'var(--f-doc-font-family)',
            '--w3m-border-radius-master': '2px',
            // '--w3m-color-mix': 'var(--theme-dark-color-7)',
            // '--w3m-color-mix-strength': 100,
        },
        /*
        customWallets: [
            {
                id: 'myCustomWallet',
                name: 'My Custom Wallet',
                // image_url: 'my_custom_wallet_image', // Optional
            },
        ],
*/
    };
}

export function getWeb3ModalStyles(darkTheme) {
    if (darkTheme) {
        return {
            'w3m-modal': {
                'wui-card': {
                    boxShadow: 'var(--f-box-shadow-6)',
                    background: 'var(--theme-dark-color-7)',
                    outline: '1px solid var(--theme-dark-color-6)',
                },
            },
            'w3m-modal>w3m-header': {
                'wui-separator': {
                    display: 'none',
                },
            },
        };
    }

    return {
        'w3m-modal>w3m-header': {
            'wui-separator': {
                display: 'none',
            },
        },
    };
}
