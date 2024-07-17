import { correctAddress, addressesMatch } from './account.js';

export const ADDRESS = '0xeb57521b52E1102eE6B1422BA3A6F53D0C9E18cb';
export const ADDRESS2 = '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01';

describe('account utility functions', () => {
    describe('#correctAddress', () => {
        it('should add `0x` prefix to address if it is not presented', () => {
            expect(correctAddress(ADDRESS.slice(2))).toBe(
                '0xeb57521b52E1102eE6B1422BA3A6F53D0C9E18cb'
            );
        });
    });

    describe('#addressesMatch', () => {
        it('should check if two addresses match', () => {
            expect(addressesMatch(ADDRESS, ADDRESS.toLowerCase())).toBe(true);
            expect(addressesMatch(ADDRESS, ADDRESS2)).toBe(false);
        });

        it.skip('should add `0x` prefix to addresses if it is not presented', () => {
            expect(addressesMatch(ADDRESS, ADDRESS.slice(2))).toBe(true);
        });
    });
});
