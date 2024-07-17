import { getChainNameById } from './utils.js';

describe('web3 wallet utils', () => {
    describe('getChainNameById()', () => {
        it('should return chain name by given chain id', () => {
            expect(getChainNameById('0xfa')).toBe('Fantom Opera');
        });

        it('should return empty string if chain name is not found', () => {
            expect(getChainNameById('0xfaaaaaaaa')).toBe('');
        });
    });
});
