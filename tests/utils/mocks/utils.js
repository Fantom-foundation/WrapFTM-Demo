/**
 * @param {BrowserContext} context
 * @return {Promise<void>}
 */
export async function addMocksScript(context) {
    await context.addInitScript({
        path: 'tests/utils/mocks/dist/mocks-lib.umd.js',
    });
}
