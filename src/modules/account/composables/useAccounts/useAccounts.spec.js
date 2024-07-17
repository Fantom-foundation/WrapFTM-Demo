import { withSetup } from 'fantom-vue3-components/src/test/utils.js';
import { useAccounts } from './useAccounts.js';
import { Accounts } from '@/modules/account/Accounts/Accounts.js';
import { appConfig } from '@/config/app-config.js';

describe('useAccounts', () => {
    it('should return instance of Accounts class', () => {
        const { composableResult, app } = withSetup({
            composable: () => useAccounts(),
        });

        expect(composableResult.accounts instanceof Accounts).toBe(true);

        app.unmount();
    });

    it('should return account store', () => {
        const { composableResult, app } = withSetup({
            composable: () => useAccounts(),
        });

        expect(composableResult.store.$id).toBe('accounts');

        app.unmount();
    });

    it('should register web3 wallets', () => {
        const walletName = appConfig.flags.useWeb3Modal ? 'web3modal' : 'metamask';

        expect(Accounts.isWeb3WalletRegistered(walletName)).toBe(true);
    });
});
