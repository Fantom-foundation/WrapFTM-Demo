import { amountValidator } from './amountValidator.js';

describe('amountValidator', () => {
    it('should return error message if given amount is above maximum amount', () => {
        expect(
            amountValidator({
                amount: 2,
                maxAmount: 1,
                maxAmountErrorMessage: 'max amount reached',
            })
        ).toBe('max amount reached');
    });

    it('should return error message if given amount is below zero, NaN or an empty string', () => {
        expect(
            amountValidator({
                amount: -1,
                maxAmount: 1,
                invalidAmountErrorMessage: 'invalid amount',
            })
        ).toBe('invalid amount');
        expect(
            amountValidator({
                amount: '-',
                maxAmount: 1,
                invalidAmountErrorMessage: 'invalid amount',
            })
        ).toBe('invalid amount');
        expect(
            amountValidator({
                amount: '',
                maxAmount: 1,
                invalidAmountErrorMessage: 'invalid amount',
            })
        ).toBe('invalid amount');
    });

    it('should return an empty string if given amount is below or equal to maximum amount', () => {
        expect(
            amountValidator({
                amount: 0.5,
                maxAmount: 1,
                maxAmountErrorMessage: 'max amount reached',
            })
        ).toBe('');
        expect(
            amountValidator({
                amount: 1,
                maxAmount: 1,
                maxAmountErrorMessage: 'max amount reached',
            })
        ).toBe('');
    });

    /*it('should an empty string if maximum amount is not set', () => {
        expect(amountValidator({ amount: 2, maxAmount: '', maxAmountErrorMessage: 'max amount reached' })).toBe('');
    });*/
});
