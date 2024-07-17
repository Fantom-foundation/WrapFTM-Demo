/**
 * Interface for api calls
 */
export class FApi {
    /** @type {FApiQueries} */
    static __query__ = {};
    /** @type {FApiMutations} */
    static __mutation__ = {};
    static __mocks__ = {
        query: {},
        mutation: {},
    };
    static __realFnNames__ = {
        query: {},
        mutation: {},
    };

    get query() {
        return FApi.__query__;
    }

    get mutation() {
        return FApi.__mutation__;
    }

    /**
     * @param {function} func
     * @param {string} funcName
     */
    registerQuery(func, funcName) {
        this.#registerFunction({ func, funcName, type: 'query' });
    }

    /**
     * @param {Object<string, function>} queries
     */
    registerQueries(queries) {
        Object.keys(queries).forEach((fnName) => {
            this.registerQuery(queries[fnName], fnName);
        });
    }

    /**
     * @param {function} func
     * @param {string} funcName
     */
    registerQueryMock(func, funcName) {
        this.#registerFunctionMock({ func, funcName, type: 'query' });
    }

    /**
     * @param {Object<string, function>} queryMocks
     */
    registerQueryMocks(queryMocks) {
        Object.keys(queryMocks).forEach((fnName) => {
            this.registerQueryMock(queryMocks[fnName], fnName);
        });
    }

    /**
     * @param {string} funcName
     * @return {function|null}
     */
    getQueryMock(funcName) {
        return FApi.__mocks__.query[funcName] || null;
    }

    /**
     * @param {string} funcName
     * @return {function|null}
     */
    getMutationMock(funcName) {
        return FApi.__mocks__.mutation[funcName] || null;
    }

    /**
     * @param {function} func
     * @param {string} funcName
     */
    registerMutation(func, funcName) {
        this.#registerFunction({ func, funcName, type: 'mutation' });
    }

    /**
     * @param {Object<string, function>} mutations
     */
    registerMutations(mutations) {
        Object.keys(mutations).forEach((fnName) => {
            this.registerMutation(mutations[fnName], fnName);
        });
    }

    /**
     * @param {function} func
     * @param {string} funcName
     */
    registerMutationMock(func, funcName) {
        this.#registerFunctionMock({ func, funcName, type: 'mutation' });
    }

    /**
     * @param {Object<string, function>} mutationMocks
     */
    registerMutationMocks(mutationMocks) {
        Object.keys(mutationMocks).forEach((fnName) => {
            this.registerMutationMock(mutationMocks[fnName], fnName);
        });
    }

    #registerFunction({ func, funcName = '', type = 'query' }) {
        const fnName = funcName || func.name;

        if (typeof func === 'function' && fnName) {
            if (this[type][fnName] === undefined) {
                this[type][fnName] = func;
                FApi.__realFnNames__[type][func.name] = func;
            } else {
                throw new Error(
                    `${
                        type === 'query' ? 'Query' : 'Mutation'
                    } ${fnName} is already registered`
                );
            }
        }
    }

    #registerFunctionMock({ func, funcName = '', type = 'query' }) {
        const fnName = funcName || func.name;

        if (typeof func === 'function' && fnName) {
            FApi.__mocks__[type][fnName] = func;
        }
    }

    static getFunctionByRealName(fnName) {
        const rn = FApi.__realFnNames__;

        return {
            query: rn.query[fnName],
            mutation: rn.mutation[fnName],
        };
    }

    static clearAll() {
        FApi.__query__ = {};
        FApi.__mutation__ = {};
        FApi.__mocks__ = {
            query: {},
            mutation: {},
        };
        FApi.__realFnNames__ = {
            query: {},
            mutation: {},
        };
    }
}
