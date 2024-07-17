import { getPriceMock } from './price.js';
import { getPricePickFn } from '@/modules/common/api/queries/price/price.js';

describe('getPrice() mock', () => {
    it('should return expected outcome', async () => {
        const result = getPricePickFn(getPriceMock().data);

        expect(result).toBe(2);
    });
});
