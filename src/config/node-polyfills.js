// dependecies: node-stdlib-browser, vite-plugin-node-stdlib-browser, @rollup/plugin-inject
import inject from '@rollup/plugin-inject';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

// if this plugin is needed and error "__require.resolve is not a function"
// occurs: https://stackoverflow.com/questions/77543213/ckeditor-5-and-vite-5-typeerror-require-resolve-is-not-a-function

/**
 * @param {array} vitePlugins
 */
export function addNodePolyfills(vitePlugins) {
    vitePlugins.push({
        ...inject({
            global: [
                require.resolve('node-stdlib-browser/helpers/esbuild/shim'),
                'global',
            ],
            process: [
                require.resolve('node-stdlib-browser/helpers/esbuild/shim'),
                'process',
            ],
            Buffer: [
                require.resolve('node-stdlib-browser/helpers/esbuild/shim'),
                'Buffer',
            ],
        }),
        enforce: 'post',
        apply: 'build', // rollup plugin
    });

    vitePlugins.push(nodePolyfills());
}
