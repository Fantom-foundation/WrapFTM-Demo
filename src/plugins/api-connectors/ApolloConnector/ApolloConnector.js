export class ApolloConnector {
    #apolloClients = null;
    #defaultOptions = {};

    /**
     * @param {Object.<string, ApolloClient>} [apolloClients]
     * @param {Object} [defaultOptions]
     */
    constructor({ apolloClients = null, defaultOptions = {} } = {}) {
        this.setApolloClients(apolloClients);
        this.setDefaultOptions(defaultOptions);
    }

    /**
     * @param {Object.<string, ApolloClient>} [apolloClients]
     */
    setApolloClients(apolloClients = null) {
        this.#apolloClients = apolloClients;
    }

    /**
     * @param {Object} defaultOptions
     */
    setDefaultOptions(defaultOptions = {}) {
        this.#defaultOptions = defaultOptions;
    }

    /**
     * @param {gql} query
     * @param {Object} [variables]
     * @param {Object} [options]
     * @return {Promise<*>}
     */
    async processQuery(query, variables, options = {}) {
        return this.#getApolloClientById(options?.clientId).query({
            query,
            variables,
            ...this.#defaultOptions,
            ...options,
        });
    }

    /**
     * @param {gql} mutation
     * @param {Object} [variables]
     * @param {Object} [options]
     * @return {Promise<*>}
     */
    async processMutation(mutation, variables, options = {}) {
        return this.#getApolloClientById(options?.clientId).mutate({
            mutation,
            variables,
            ...this.#defaultOptions,
            ...options,
        });
    }

    /**
     * @param {Object} result
     * @param {function|null} pickFn
     * @return {*}
     */
    processResult(result, pickFn = null) {
        return !pickFn ? this.#getValueOfFirstKey(result?.data) : result?.data;
    }

    #getApolloClientById(clientId = 'default') {
        const apolloClients = this.#apolloClients;

        if (!apolloClients) {
            throw new Error('No apollo clients are given');
        }
        if (!(clientId in this.#apolloClients)) {
            throw new Error(`There is no apollo client with id "${clientId}"`);
        }

        return this.#apolloClients[clientId || 'default'];
    }

    #getValueOfFirstKey(obj) {
        const keys = obj ? Object.keys(obj) : [];

        return keys.length > 0 ? obj[keys[0]] : null;
    }
}
