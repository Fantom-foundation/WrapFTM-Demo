import { FtmPrice } from './FtmPrice.js';
import { vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';

let ftmPrice = null;
let counter = 0;
const prices = {
    EUR: 3,
    USD: 2,
};

async function fetchPrice(currency = '') {
    let price = 1 + counter;

    if (currency === 'EUR') {
        price = prices.EUR + counter;
    } else if (currency === 'USD') {
        price = prices.USD + counter;
    }

    counter += 0.1;

    return price;
}

async function advanceTimersByTime(time) {
    vi.advanceTimersByTime(time);
    await flushPromises();
}

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    counter = 0;
    vi.useRealTimers();
});

describe('FtmPrice', () => {
    it('should throw an error if one of the required argument on init is missing', () => {
        expect(() => {
            ftmPrice = new FtmPrice({});
        }).toThrowError();
    });

    it('should fetch FTM price in given currency', async () => {
        ftmPrice = new FtmPrice({
            fetchPrice,
            currency: 'EUR',
            outsideComponent: true,
        });

        expect(await ftmPrice.getPrice()).toBe(prices.EUR);
    });

    it('should use "USD" as the default currency', async () => {
        ftmPrice = new FtmPrice({ fetchPrice, outsideComponent: true });

        expect(await ftmPrice.getPrice()).toBe(prices.USD);
    });

    it('should return price Ref object', async () => {
        ftmPrice = new FtmPrice({ fetchPrice, outsideComponent: true });
        const priceRef = ftmPrice.getPriceRef();

        await ftmPrice.getPrice();

        expect(priceRef.value).toBe(prices.USD);
    });

    it('should fetch FTM price periodically in given polling interval', async () => {
        ftmPrice = new FtmPrice({
            pollInterval: 30000,
            fetchPrice,
            outsideComponent: true,
        });
        const priceRef = ftmPrice.getPriceRef();

        await advanceTimersByTime(30001);

        expect(priceRef.value).toBe(prices.USD + 0.1);
    });

    it('should stop fetching the price if `stopPolling` is called', async () => {
        ftmPrice = new FtmPrice({
            pollInterval: 30000,
            fetchPrice,
            outsideComponent: true,
        });
        const priceRef = ftmPrice.getPriceRef();

        await advanceTimersByTime(30001);

        ftmPrice.stopPolling();

        await advanceTimersByTime(30001);

        expect(priceRef.value).toBe(prices.USD + 0.1);
    });

    it('should fetch correct price if currency is changed', async () => {
        ftmPrice = new FtmPrice({ fetchPrice, outsideComponent: true });

        ftmPrice.setCurrency('EUR');

        expect(await ftmPrice.getPrice()).toBe(prices.EUR);
    });

    it('should fetch correct price in given interval if currency is changed', async () => {
        ftmPrice = new FtmPrice({
            pollInterval: 30000,
            fetchPrice,
            outsideComponent: true,
        });
        const priceRef = ftmPrice.getPriceRef();

        await advanceTimersByTime(30001);
        counter = 0;

        ftmPrice.setCurrency('EUR');

        await advanceTimersByTime(30001);

        expect(priceRef.value).toBe(prices.EUR + 0.1);
    });
});
