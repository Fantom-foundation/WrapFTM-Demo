import { setUpTestLocales } from '@/config/test/locale.js';
import { formatDateFromTimestamp } from '@/utils/formatters/formatters.js';

beforeAll(() => {
    setUpTestLocales();
});

describe('formatters', () => {
    describe('formatDateFromTimestamp()', () => {
        it('should display date in short format by default', () => {
            expect(formatDateFromTimestamp(1650355235)).toBe('4/19/2022, 8:00 AM');
        });

        it('should display date when timestamp is hex number', () => {
            expect(formatDateFromTimestamp('0x625e6c23')).toBe('4/19/2022, 8:00 AM');
        });
    });
});
