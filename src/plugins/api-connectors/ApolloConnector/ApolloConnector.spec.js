import { vi } from 'vitest';
import { VueApiConnector } from '@/plugins/api-connectors/VueApiConnector/VueApiConnector.js';
import { ApolloConnector } from '@/plugins/api-connectors/ApolloConnector/ApolloConnector.js';

describe('ApolloConnector', () => {
    it('should process query', async () => {
        const querySpy = vi.spyOn(apolloClient, 'query');

        const { promise } = vueApolloConnector.query({
            query: 'query',
            variables: { foo: 'bar' },
            options: { option1: 1 },
        });

        const result = await promise;

        expect(querySpy).toBeCalledWith({
            query: 'query',
            variables: { foo: 'bar' },
            option1: 1,
        });
        expect(result).toBe('query result');
    });

    it('should process mutation', async () => {
        const mutateSpy = vi.spyOn(apolloClient, 'mutate');

        const { mutate } = vueApolloConnector.mutation({
            mutation: 'mutation',
            variables: { foo: 'bar' },
            options: { option1: 1 },
        });

        const result = await mutate();

        expect(mutateSpy).toBeCalledWith({
            mutation: 'mutation',
            variables: { foo: 'bar' },
            option1: 1,
        });
        expect(result).toBe('mutation result');
    });

    /*
    it('should process query', async () => {
        const { promise } = vueApolloConnector.query({
            query: 'query',
            variables: { foo: 'bar' },
            options: { option1: 1 },
        });

        const result = await promise;

        expect(result).toBe('query result');
    });
*/

    it('should set apollo clients', async () => {
        apolloConnector = new ApolloConnector();
        vueApolloConnector = new VueApiConnector({
            connector: apolloConnector,
        });

        apolloConnector.setApolloClients({
            default: apolloClient,
        });

        const { promise } = vueApolloConnector.query({});

        const result = await promise;

        expect(result).toBe('query result');
    });

    it('should set default options', () => {
        const querySpy = vi.spyOn(apolloClient, 'query');
        const mutateSpy = vi.spyOn(apolloClient, 'mutate');

        apolloConnector.setDefaultOptions({
            fetchPolicy: 'network-only',
        });

        vueApolloConnector.query({});
        const { mutate } = vueApolloConnector.mutation({});

        mutate();

        expect(querySpy).toBeCalledWith(
            expect.objectContaining({
                fetchPolicy: 'network-only',
            })
        );
        expect(mutateSpy).toBeCalledWith(
            expect.objectContaining({
                fetchPolicy: 'network-only',
            })
        );
    });

    test('options given in `query` or `mutation` methods should override default options', () => {
        const querySpy = vi.spyOn(apolloClient, 'query');
        const mutateSpy = vi.spyOn(apolloClient, 'mutate');

        apolloConnector.setDefaultOptions({
            fetchPolicy: 'network-only',
        });

        vueApolloConnector.query({
            options: {
                fetchPolicy: 'cache-only',
            },
        });
        const { mutate } = vueApolloConnector.mutation({
            options: {
                fetchPolicy: 'cache-only',
            },
        });

        mutate();

        expect(querySpy).toBeCalledWith(
            expect.objectContaining({
                fetchPolicy: 'cache-only',
            })
        );
        expect(mutateSpy).toBeCalledWith(
            expect.objectContaining({
                fetchPolicy: 'cache-only',
            })
        );
    });

    it('should throw an error if apollo client(s) is not given', async () => {
        apolloConnector = new ApolloConnector();
        vueApolloConnector = new VueApiConnector({
            connector: apolloConnector,
        });
        const { promise, error } = vueApolloConnector.query({
            defaultData: -1,
        });

        const result = await promise;

        expect(error.value).toEqual(new Error('No apollo clients are given'));
        expect(result).toBe(-1);
    });

    it('should throw an error if there is no apollo client with given client Id', async () => {
        apolloConnector = new ApolloConnector({
            apolloClients: {
                default: apolloClient,
            },
        });
        vueApolloConnector = new VueApiConnector({
            connector: apolloConnector,
        });
        const { promise, error } = vueApolloConnector.query({
            options: {
                clientId: 'foo',
            },
        });

        await promise;

        expect(error.value).toEqual(new Error('There is no apollo client with id "foo"'));
    });
});

class ApolloClientMock {
    async query() {
        return {
            data: {
                foo: 'query result',
            },
        };
    }

    async mutate() {
        return {
            data: {
                foo: 'mutation result',
            },
        };
    }
}

/** @type {ApolloConnector} */
let apolloConnector = null;
/** @type {ApolloClientMock} */
let apolloClient = null;
/** @type {VueApiConnector} */
let vueApolloConnector = null;

beforeEach(() => {
    apolloClient = new ApolloClientMock();
    apolloConnector = new ApolloConnector({
        apolloClients: {
            default: apolloClient,
        },
    });
    vueApolloConnector = new VueApiConnector({
        connector: apolloConnector,
    });
});

afterEach(() => {
    apolloConnector = null;
    vi.resetAllMocks();
});
