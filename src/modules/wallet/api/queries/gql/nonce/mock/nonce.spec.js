import { getNonceMock } from './nonce.js';
import { getNoncePickFn } from '@/modules/wallet/api/queries/gql/nonce/nonce.js';

describe('getNonce() mock', () => {
    it('should return expected outcome', async () => {
        const result = getNoncePickFn(getNonceMock().data);

        expect(result).toEqual('0x1');
    });
});
