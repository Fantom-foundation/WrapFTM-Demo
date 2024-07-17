import { getNonceMock } from './nonce.js';

describe('getNonce() mock', () => {
    it('should return expected outcome', async () => {
        const result = getNonceMock();

        expect(result).toEqual('0x1');
    });
});
