import { withSetup } from 'fantom-vue3-components/src/test/utils.js';
import { useAuth } from './useAuth.js';
import { Auth } from '../../Auth/Auth.js';

describe('useAuth', () => {
    it('should return instance of Accounts class', () => {
        const { composableResult, app } = withSetup({
            composable: () => useAuth(),
        });

        expect(composableResult.auth instanceof Auth).toBe(true);

        app.unmount();
    });

    it('should return "isLogged" ref', () => {
        const { composableResult, app } = withSetup({
            composable: () => useAuth(),
        });

        expect(composableResult.isLogged.value).toBe(false);

        app.unmount();
    });
});
