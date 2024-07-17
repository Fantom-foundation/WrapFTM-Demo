import { FtmPrice } from '@/modules/common/FtmPrice/FtmPrice.js';
import { delay } from 'fantom-vue3-components';
import { useFApi } from '@/plugins/api-connectors/FApi/useFApi/useFApi.js';

const api = useFApi().api;
let ftmPrice = null;

async function fetchPrice(currency) {
    // Wait to next tick. This is because Metamask should be loading and this process cancels pending requests :(
    await delay();

    return api.query.getPrice({ to: currency }).promise;
}

/**
 * @param {string} [currency]
 * @param {boolean} [outsideComponent ]Function is used outside vue component
 * @param {function} [fetchPriceFn]
 * @return {{}}
 */
export function useFtmPrice({
    currency = 'USD',
    outsideComponent = false,
    fetchPriceFn = fetchPrice,
} = {}) {
    if (ftmPrice === null) {
        ftmPrice = new FtmPrice({
            fetchPrice: fetchPriceFn,
            currency,
            pollInterval: 30000,
            outsideComponent,
        });
    }

    return {
        ftmPrice: ftmPrice.getPriceRef(),
    };
}
