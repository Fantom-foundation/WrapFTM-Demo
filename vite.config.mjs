/* eslint-disable no-undef */
import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { appConfig } from './src/config/app-config.js';
import { vitePluginTransformIndexHtml } from './src/plugins/vite-plugin-transform-index-html.js';
// import { addNodePolyfills } from './src/config/node-polyfills.js';
import * as dotenv from 'dotenv';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { envToBool } from './src/config/utils.js';

dotenv.config();

const plugins = [vue()];
const env = process.env;
const USE_HTTPS_DEV = envToBool(env.VITE_USE_HTTPS_DEV);
const excludeTests = [
    'src/plugins/web3-wallets/node_modules/**/*.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
];

if (appConfig.flags.useWeb3Modal) {
    // 'src/modules/faucet/**/*.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    excludeTests.push('src/**/WalletPicker.spec.js');
    excludeTests.push('src/**/LedgerAccountPickerC.spec.js');
    excludeTests.push('src/**/AccountList*.spec.js');
}

// addNodePolyfills(plugins);

if (USE_HTTPS_DEV) {
    plugins.push(basicSsl());
}

// PWA
plugins.push(
    VitePWA({
        // selfDestroying: true,
        includeAssets: [
            'favicon-16x16.png',
            'favicon-32x32.png',
            'favicon.ico',
            'robots.txt',
            'apple-touch-icon.png',
            // 'fire2.gif',
        ],
        manifest: {
            name: appConfig.pwa.name,
            short_name: appConfig.pwa.name,
            theme_color: appConfig.pwa.mainColor,
            background_color: appConfig.pwa.mainColor,
            description: appConfig.pwa.description,
            categories: appConfig.pwa.categories,
            display: 'standalone',
            icons: [
                {
                    src: './pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: './pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
            ],
        },
        registerType: 'autoUpdate',
    })
);

plugins.push(
    vitePluginTransformIndexHtml({
        APP_TITLE: appConfig.title,
        APP_DESCRIPTION: appConfig.description,
        APP_KEYWORDS: appConfig.keywords,
        APP_IMAGE: appConfig.image,
    })
);

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        https: USE_HTTPS_DEV,
    },
    base: envToBool(env.VITE_SANDBOX_MODE) ? './' : undefined,
    plugins,
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '~fantom-vue3-components': 'fantom-vue3-components',
        },
    },
    test: {
        // include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
        include: ['src/**/*.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: excludeTests,
        deps: {
            optimizer: {
                web: {
                    include: ['fantom-vue3-components'],
                },
            },
            // inline: ['fantom-vue3-components'],
        },
        setupFiles: [
            fileURLToPath(
                new URL(
                    'node_modules/fantom-vue3-components/src/plugins/vue-test-plugins/install.js',
                    import.meta.url
                )
            ),
            fileURLToPath(
                new URL('src/plugins/vue-test-plugins/install.js', import.meta.url)
            ),
            fileURLToPath(new URL('src/config/test/install.js', import.meta.url)),
            // fileURLToPath(new URL('test/setup.js', import.meta.url)),
        ],
        globals: true,
        // globalSetup: 'test/setup.js',
        // minThreads: 2,
        // maxThreads: 3,
        onConsoleLog(log) {
            if (
                log.includes('Download the Vue Devtools extension') ||
                log.includes('Lit is in dev mode.')
            ) {
                return false;
            }
        },
    },
    optimizeDeps: {
        exclude: ['fantom-vue3-components'],
    },
    // libraries for Ledger support needs this :(
    define: {
        global: true,
        'process.env': {},
    },
    /*esbuild: {
        keepNames: true,
    },*/
    /*build: {
        commonjsOptions: {
            // include: [/node_modules\/web3/],
        },
    },*/
    /*build: {
        rollupOptions: {
            plugins: [
                /!*NodeGlobalsPolyfillPlugin({
                    process: true,
                    buffer: true,
                }),*!/
                // Enable rollup polyfills plugin
                // used during production bundling
                nodePolyfills(),
            ],
        },
    },*/
});

/* eslint-enable no-undef */
