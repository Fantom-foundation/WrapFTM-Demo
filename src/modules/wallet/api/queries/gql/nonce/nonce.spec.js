import { getNonce } from './nonce.js';
import { TEST_ACCOUNT_ADDRESS } from '@/plugins/web3-wallets/test-helpers.js';

describe.skip('getNonce', () => {
    it('should return expected outcome', async () => {
        const { dataPromise } = getNonce(TEST_ACCOUNT_ADDRESS);

        expect(await dataPromise).toBe('0x0');
    });
});
