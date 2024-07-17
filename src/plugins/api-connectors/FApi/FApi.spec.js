import { FApi } from './FApi.js';

describe('FApi', () => {
    describe('query registration', () => {
        it('should register query function', () => {
            api.registerQuery(myQuery);

            expect(api.query.myQuery()).toBe('my query');
        });

        it('should register query function and use given function name', () => {
            api.registerQuery(myQuery, 'myNewQuery');

            expect(api.query.myNewQuery()).toBe('my query');
        });

        it('should throw an error if query to be registered is already registered', () => {
            api.registerQuery(myQuery);

            expect(() => {
                api.registerQuery(myQuery);
            }).toThrowError();
        });

        it('should register more queries', () => {
            api.registerQueries({
                myQuery,
                Query2: myQuery2,
            });

            expect(api.query.myQuery()).toBe('my query');
            expect(api.query.Query2()).toBe('my query 2');
        });
    });

    describe('mutation registration', () => {
        it('should register mutation function', () => {
            api.registerMutation(myMutation);

            expect(api.mutation.myMutation('my mutation')).toBe('my mutation');
        });

        it('should register mutation function and use given function name', () => {
            api.registerMutation(myMutation, 'myNewMutaion');

            expect(api.mutation.myNewMutaion('my mutation')).toBe('my mutation');
        });

        it('should throw an error if mutation to be registered is already registered', () => {
            api.registerMutation(myMutation);

            expect(() => {
                api.registerMutation(myMutation);
            }).toThrowError();
        });

        it('should register more mutations', () => {
            api.registerMutations({
                myMutation,
                Mutation2: myMutation2,
            });

            expect(api.mutation.myMutation('my mutation')).toBe('my mutation');
            expect(api.mutation.Mutation2('my mutation')).toBe('my mutation 2');
        });
    });

    describe('query mock registration', () => {
        it('should register query function ', () => {
            api.registerQueryMock(myQueryMock);

            expect(api.getQueryMock('myQueryMock')).toBe(myQueryMock);
        });

        it('should register query function and use given function name', () => {
            api.registerQueryMock(myQueryMock, 'myQuery');

            expect(api.getQueryMock('myQuery')).toBe(myQueryMock);
        });

        it('should register more query mocks', () => {
            api.registerQueryMocks({
                myQueryMock,
                queryMock2: myQueryMock2,
            });

            expect(api.getQueryMock('myQueryMock')).toBe(myQueryMock);
            expect(api.getQueryMock('queryMock2')).toBe(myQueryMock2);
        });
    });

    describe('mutation mock registration', () => {
        it('should register query function ', () => {
            api.registerMutationMock(myMutationMock);

            expect(api.getMutationMock('myMutationMock')).toBe(myMutationMock);
        });

        it('should register mutation function and use given function name', () => {
            api.registerMutationMock(myMutationMock, 'myMutation');

            expect(api.getMutationMock('myMutation')).toBe(myMutationMock);
        });

        it('should register more mutation mocks', () => {
            api.registerMutationMocks({
                myMutationMock,
                mutationMock2: myMutationMock2,
            });

            expect(api.getMutationMock('myMutationMock')).toBe(myMutationMock);
            expect(api.getMutationMock('mutationMock2')).toBe(myMutationMock2);
        });
    });

    it('should get funtions by their real name', () => {
        api.registerQuery(myQuery, 'query');
        api.registerMutation(myQuery, 'query');
        api.registerMutation(myMutation, 'mutation');

        expect(FApi.getFunctionByRealName('myQuery')).toEqual({
            query: myQuery,
            mutation: myQuery,
        });
        expect(FApi.getFunctionByRealName('myMutation')).toEqual({
            mutation: myMutation,
            query: undefined,
        });
    });
});

let api = null;

function myQuery() {
    return 'my query';
}

function myQuery2() {
    return 'my query 2';
}

function myQueryMock() {
    return api._getFunctionMock(() => 'query mock', 'myQueryMock')();
}

function myQueryMock2() {
    return api._getFunctionMock(() => 'query mock 2', 'myQueryMock2')();
}

function myMutation(m) {
    return m;
}

function myMutation2(m) {
    return `${m} 2`;
}

function myMutationMock() {
    return api._getFunctionMock(() => 'mutation mock', 'myMutationMock')();
}

function myMutationMock2() {
    return api._getFunctionMock(() => 'mutation mock 2', 'myMutationMock2')();
}

beforeEach(() => {
    api = new FApi();
});

afterEach(() => {
    FApi.clearAll();
    api = null;
});
