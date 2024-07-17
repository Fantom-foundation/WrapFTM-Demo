import { sendTransaction } from './send-transaction.js';
import { sendTransactionPickFn } from '../send-transaction.js';

describe('sendTransaction() mock', () => {
    it('should return expected outcome', async () => {
        expect(sendTransactionPickFn(sendTransaction().data)).toEqual(
            '0xb255061a2a646f28bf1fa922a96aff195ec6e3368c9dccac2b472dc693a8a795'
        );
    });
});
