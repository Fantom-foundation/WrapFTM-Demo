import { getTokenAllowanceMock } from './token-allowance.js';

describe('getTokenAllowance() mock', () => {
    it('should return expected outcome', async () => {
        const result = getTokenAllowanceMock().data.ercTokenAllowance;

        expect(result.toLowerCase()).toBe('0xDE0B6B3A7640000'.toLowerCase());
    });
});
