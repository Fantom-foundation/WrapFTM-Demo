//useWalletPickerWindowPickerWindow
import { withSetup } from 'fantom-vue3-components/src/test/utils.js';
import { useWalletPickerWindow } from './useWalletPickerWindow.js';

describe('useWalletPickerWindow', () => {
    it('should return `show` function', () => {
        const { composableResult, app } = withSetup({
            composable: () => useWalletPickerWindow(),
        });

        expect(typeof composableResult.show === 'function').toBe(true);

        app.unmount();
    });

    it('should return `hide` function', () => {
        const { composableResult, app } = withSetup({
            composable: () => useWalletPickerWindow(),
        });

        expect(typeof composableResult.hide === 'function').toBe(true);

        app.unmount();
    });
});
