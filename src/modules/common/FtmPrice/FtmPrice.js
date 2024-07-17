import { ref } from 'vue';
import { useInterval } from 'fantom-vue3-components';
import { Interval } from 'fantom-vue3-components/src/utils/interval/Interval.js';

export class FtmPrice {
    #price = ref(0);
    /** @type {function} */
    #fetchPrice = null;
    #currency = '';
    /** @type {Interval} */
    #interval = null;
    #pollInterval = 0;
    #outsideComponent = false;
    #intervalCode = 'ftm-price-interval';

    /**
     * @param {function(currency: string)} fetchPrice
     * @param {string} [currency]
     * @param {number} [pollInterval] In milliseconds
     * @param {boolean} [outsideComponent] Instance is used outside vue component
     */
    constructor({
        fetchPrice = null,
        currency = 'USD',
        pollInterval = 0,
        outsideComponent = false,
    }) {
        this.#fetchPrice = fetchPrice;
        this.#currency = currency;
        this.#pollInterval = pollInterval;
        this.#outsideComponent = outsideComponent;
        // console.log(this.#price.value);

        if (!this.#fetchPrice) {
            throw new Error('fetchPrice arg is missing');
        }

        if (this.#pollInterval > 0) {
            this.#startPolling(this.#pollInterval);
        }
    }

    async getPrice() {
        if (this.#price.value <= 0) {
            await this.#setPrice();
        }

        return this.#price.value;
    }

    getPriceRef() {
        return this.#price;
    }

    /**
     * @param {string} currency
     */
    setCurrency(currency) {
        this.#currency = currency;

        if (this.#interval) {
            this.stopPolling();
            this.#startPolling(this.#pollInterval);
        }
    }

    stopPolling() {
        if (this.#interval) {
            this.#interval.stop(this.#intervalCode);
        }
    }

    async #setPrice() {
        this.#price.value = await this.#fetchPrice(this.#currency);
    }

    #startPolling(pollInterval) {
        if (!this.#outsideComponent) {
            this.#interval = useInterval(true).interval;
        } else {
            this.#interval = new Interval();
        }

        this.#interval.start(
            this.#intervalCode,
            async () => {
                await this.#setPrice();
            },
            pollInterval,
            true
        );
    }
}
