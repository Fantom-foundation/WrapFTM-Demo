import { addressValidator } from './addressValidator.js';

describe('addressValidator()', () => {
    it('should return error message if given address is not valid ethereum address', () => {
        expect(addressValidator('foo', 'error message')).toBe('error message');
        expect(
            addressValidator(
                '0xeb57521b52E1102eE6B1422BA3A6F53D0C9E18c1',
                'error message'
            )
        ).toBe('error message');
    });

    it('should return an empty string if given address is valid ethereum address', () => {
        expect(
            addressValidator(
                '0xeb57521b52E1102eE6B1422BA3A6F53D0C9E18cb',
                'error message'
            )
        ).toBe('');
    });
});
