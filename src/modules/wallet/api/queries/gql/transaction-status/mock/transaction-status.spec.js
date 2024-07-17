import { getTransactionStatusMock } from './transaction-status.js';
import { getTransactionStatusPickFn } from '@/modules/wallet/api/queries/gql/transaction-status/transaction-status.js';

describe('getTransactionStatus() mock', () => {
    it('should return expected outcome', async () => {
        const result = getTransactionStatusPickFn(
            getTransactionStatusMock(
                '0x8d091280a01eb697315e1e4fd98c1dc9925befc07175eb0c4bbf20188ba9e27c'
            ).data
        );

        expect(result).toBe('0x1');
    });
});
