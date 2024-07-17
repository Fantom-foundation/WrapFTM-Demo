import { getAccountBalanceMock } from './account-balance.js';

describe('getAccountBalance() mock', () => {
    it('should return expected outcome for ftm token', async () => {
        const data = getAccountBalanceMock();

        expect(data.toLowerCase()).toBe('0x6B14BD1E6EEA00000'.toLowerCase());
    });

    it('should return expected outcome for erc20 token', async () => {
        const data = getAccountBalanceMock({ erc20TokenAddress: '0x0' });

        expect(data.toLowerCase()).toBe('0x1BC16D674EC80000'.toLowerCase());
    });
});
