import './types.js';

const mainConfig = {
    // app main title
    title: 'WrapFTM',
    // app description
    description: 'Wrap FTM',
    // app keywords
    keywords: 'FTM, Fantom, app',
    // app code
    code: 'wrapftm',
    defaultChainId: '0xfa',
    useWebHashHistory: false,
    image: '/pwa-192x192.png',
    // apollo client settings
    apollo: {
        // Fantom api
        fantom: {
            // list of providers. if one of them is unavailable, another is randomly picked
            providers: [
                {
                    http: 'https://xapi-nodea.fantom.network/',
                    // for subscriptions
                    ws: '',
                },
                {
                    http: 'https://xapi-nodeb.fantom.network/',
                    // for subscriptions
                    ws: '',
                },
                {
                    http: 'https://xapi-nodec.fantom.network/',
                    // for subscriptions
                    ws: '',
                },
                {
                    http: 'https://xapi-noded.fantom.network/',
                    // for subscriptions
                    ws: '',
                },
            ],
            // index into providers array of default provider or 'random' - takes index randomly
            defaultProviderIndex: 'random',
        },
    },
    // pwa settings
    pwa: {
        // name used in pwa manifest
        name: 'Wrap FTM',
        categories: ['finance'],
        mainColor: '#ffffff',
        description: 'Wrap FTM',
        assetsVersion: '1',
    },
    locales: [
        { tag: 'en', label: 'English' },
        // { tag: 'cs', label: 'Česky' },
    ],
    defaultLanguageCode: 'en',
    currencies: [
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
    ],
    defaultCurrency: 'USD',
    formats: {
        dateTime: {
            short: {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            },
            shortDatetime: {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            },
            long: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                hour: 'numeric',
                minute: 'numeric',
            },
        },
        number: {
            twoFractionDigits: {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            },
        },
        ftmFractionDigits: 2,
    },
    themes: ['theme-default', 'theme-dark'],
    defaultTheme: 'theme-dark',
    oneAccountMode: true,
    transactionNotifications: {
        limit: 64,
    },
    // feature flags
    flags: {
        useMultipleWallets: true,
        useWeb3Modal: true,
        transactionNotifications: true,
        recentTransactionList: true,
        useViewTransitions: false,
        // private (set automatically)
        _useRpcProvider: true,
    },
    // this object is set by calling `setEnv` function
    env: {
        underMaintenance: false,
        mockingEnabled: false,
    },
};

const testnetConfig = {
    apollo: {
        fantom: {
            providers: [
                {
                    http: 'https://xapi.testnet.fantom.network/api',
                    // for subscriptions
                    ws: '',
                },
            ],
        },
    },
};

export const appConfig = {
    ...mainConfig,
    ...(mainConfig.defaultChainId === '0xfa2' ? testnetConfig : {}),
};
