import { greaterThanZeroValidator } from './greaterThanZeroValidator.js';

describe('greaterThanZeroValidator', () => {
    it('should return error message if given value is below or equal zero, NaN or an empty string', () => {
        expect(greaterThanZeroValidator(0, 'error message')).toBe('error message');
        expect(greaterThanZeroValidator('-', 'error message')).toBe('error message');
        expect(greaterThanZeroValidator('', 'error message')).toBe('error message');
    });

    it('should return empty string if given value is a number greater than zero', () => {
        expect(greaterThanZeroValidator(0.1, 'error message')).toBe('');
    });
});
