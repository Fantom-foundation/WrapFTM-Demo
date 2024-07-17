import { withSetup } from 'fantom-vue3-components/src/test/utils.js';
import { useWallet } from './useWallet.js';
import { Wallet } from '@/modules/wallet/Wallet/Wallet.js';
import { vi } from 'vitest';
import { TestWeb3Wallet } from '@/plugins/web3-wallets/test-helpers.js';

describe('useWallet', () => {
    it('should return instance of Wallet class', () => {
        const { composableResult, app } = withSetup({
            composable: () => useWallet(),
        });

        expect(composableResult.wallet instanceof Wallet).toBe(true);

        app.unmount();
    });

    it('should return web3 wallet events callback', async () => {
        const { composableResult, app } = withSetup({
            composable: () => useWallet(),
        });
        const walletEventsListener = vi.fn();
        composableResult.onWalletEvents(walletEventsListener);
        const EVENT = {
            name: 'chain_change',
            data: 'data',
        };

        const testWeb3Wallet = new TestWeb3Wallet({ name: 'pipi_wallet' });
        await composableResult.wallet.setWeb3Wallet(testWeb3Wallet);
        await testWeb3Wallet.triggerEvent(EVENT);

        expect(walletEventsListener).toHaveBeenCalledWith(EVENT);

        app.unmount();
    });

    it('should return wallet store', () => {
        const { composableResult, app } = withSetup({
            composable: () => useWallet(),
        });

        expect(composableResult.store.$id).toBe('wallet');

        app.unmount();
    });

    it('should return account address ref', () => {
        const { composableResult, app } = withSetup({
            composable: () => useWallet(),
        });

        expect(composableResult.accountAddress.value).toBe('');

        app.unmount();
    });

    it('should return chain id ref', () => {
        const { composableResult, app } = withSetup({
            composable: () => useWallet(),
        });

        expect(composableResult.chainId.value).toBe('');

        app.unmount();
    });
});
