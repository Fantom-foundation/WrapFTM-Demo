import {
    bFromTokenValue,
    bFromWei,
    bShiftDP,
    bToTokenValue,
    bToWei,
    toBigNumber,
    toHex,
    toInt,
} from './big-number.js';

describe('big-number utility functions', () => {
    describe('#toBigNumber', () => {
        it('should convert given number to BigNumber', () => {
            expect(toBigNumber(123)).toBeTypeOf('object');
        });
    });

    describe('#bShiftDP', () => {
        it('should shift decimal point', () => {
            expect(bShiftDP(123, 2).toNumber()).toEqual(12300);
            expect(bShiftDP(123, -2).toNumber()).toEqual(1.23);
        });
    });

    describe('#bFromTokenValue', () => {
        it('should shift decimal point left', () => {
            expect(bFromTokenValue(123, 2).toNumber()).toEqual(1.23);
        });
    });

    describe('#bToTokenValue', () => {
        it('should shift decimal point right', () => {
            expect(bToTokenValue(123, 2).toNumber()).toEqual(12300);
        });
    });

    describe('#bFromWei', () => {
        it('should convert value from WEI to Ether', () => {
            expect(bFromWei(123).toNumber()).toEqual(1.23e-16);
            expect(bFromWei('0x7b').toNumber()).toEqual(1.23e-16);
        });
    });

    describe('#bToWei', () => {
        it('should convert value from Ether to WEI', () => {
            expect(bToWei(123).toString()).toEqual('123000000000000000000');
            expect(bToWei('0x7b').toString()).toEqual('123000000000000000000');
        });
    });

    describe('#toHex', () => {
        it('should convert given value to hexadecimal number', () => {
            expect(toHex(123)).toEqual('0x7b');
        });
    });

    describe('#toInt', () => {
        it('should convert given value to integer', () => {
            expect(toInt('0x7b')).toEqual(123);
        });
    });
});
