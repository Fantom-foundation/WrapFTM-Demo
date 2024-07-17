import { GAS_PRICE } from '../../../../../../../../tests/data/wallet/gas-price.js';

export function getGasPriceMock() {
    return {
        data: {
            ...GAS_PRICE(),
        },
    };
}
