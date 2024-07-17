// vite.config.mjvite.configs
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            // eslint-disable-next-line no-undef
            entry: resolve(__dirname, './main.js'),
            name: 'MocksLib',
            // the proper extensions will be added
            fileName: 'mocks-lib',
            formats: ['umd'],
        },
        // eslint-disable-next-line no-undef
        outDir: resolve(__dirname, './dist'),
        copyPublicDir: false,
    },
});
