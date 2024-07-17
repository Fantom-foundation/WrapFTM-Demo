export class Web3Mock {
    /** @type {function} */
    #mock = null;
    /** @type {function} */
    #resetMocks = null;
    /** @type {function} */
    #trigger = null;
    /** @type {function} */
    #confirm = null;
    /** @type {function} */
    #connect = null;
    /** Keys are unique mock names, values are mock functions */
    #mocks = {};
    /** Helper */
    #counter = 0;
    softwareWalletPrivateKey = '';

    /**
     * @param {function} mock
     * @param {function} resetMocks
     * @param {function} trigger
     * @param {function} confirm
     * @param {function} connect
     */
    constructor({ mock, resetMocks, trigger, confirm, connect }) {
        this.#mock = mock;
        this.#resetMocks = resetMocks;
        this.#trigger = trigger;
        this.#confirm = confirm;
        this.#connect = connect;

        if (
            typeof this.#mock !== 'function' ||
            typeof this.#resetMocks !== 'function' ||
            typeof this.#trigger !== 'function' ||
            typeof this.#confirm !== 'function' ||
            typeof this.#connect !== 'function'
        ) {
            throw new Error('Required params are missing');
        }
    }

    /**
     * @param {string} [mockName]
     * @param args
     * @return {string}
     */
    mock({ mockName, mock, useJsonRpcProvider = false, confirmTransaction = true }) {
        let name = mockName || this.#getMockName();

        if (this.#mocks[name]) {
            throw new Error(`Mock with the name '${name}' already exists`);
        }

        const jsonRpcProvider = window?.__mocks__?.jsonRpcProvider;

        if (jsonRpcProvider && useJsonRpcProvider) {
            mock.provider = jsonRpcProvider;
        }

        this.#mocks[name] = this.#mock(mock);

        if (mock.transaction && confirmTransaction) {
            this.#confirm(this.#mocks[name]);
        }

        return name;
    }

    resetMocks() {
        this.#mocks = {};
        this.#resetMocks();
    }

    trigger(...args) {
        this.#trigger(...args);
    }

    confirm(...args) {
        this.#confirm(...args);
    }

    connect(...args) {
        this.#connect(...args);
    }

    /**
     * @param {string} mockName
     * @return {boolean}
     */
    toHaveBeenCalled(mockName) {
        return this.#getMockCallCount(mockName) > 0;
    }

    /**
     * @param {string} mockName
     * @param {number} times
     * @return {boolean}
     */
    toHaveBeenCalledTimes(mockName, times = -1) {
        return this.#getMockCallCount(mockName) === times;
    }

    #getMockCallCount(mockName) {
        const mock = this.#mocks[mockName];
        let callCount = 0;

        if (mock) {
            callCount = mock.callCount;
        }

        return callCount;
    }

    #getMockName() {
        return `_mk_${this.#counter++}`;
    }
}
