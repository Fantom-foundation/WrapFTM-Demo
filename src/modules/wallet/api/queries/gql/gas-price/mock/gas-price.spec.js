import { getGasPriceMock } from './gas-price.js';

describe('getGasPrice() mock', () => {
    it('should return expected outcome', async () => {
        const result = getGasPriceMock().data.gasPrice;

        expect(result).toBe('0x24ab47394a');
    });
});
