import { PRICE } from '../../../../../../../tests/data/common/price.js';

export function getPriceMock() {
    return {
        data: {
            price: {
                ...PRICE(),
            },
        },
    };
}
