import { PaginatedData } from './PaginatedData.js';

let paginatedData = null;

function DATA(max = 0) {
    const data = [];

    for (let i = 1; i <= max; i++) {
        data.push(i);
    }

    return data;
}

function createPaginatedData(maxItems = 11) {
    return new PaginatedData({
        data: DATA(maxItems),
        name: 'foo',
        typeName: 'FooList',
        itemName: 'fooItem',
        pageLength: 2,
        cursorStartAt: 100,
    });
}

beforeEach(() => {
    paginatedData = createPaginatedData();
});

afterEach(() => {
    paginatedData = null;
});

describe('PaginatedData', () => {
    it('should return number of the first page', () => {
        expect(paginatedData.getFirstPageNumber()).toBe(1);
    });

    it('should return number of the last page', () => {
        expect(paginatedData.getLastPageNumber()).toBe(6);
    });

    it('should return correct data for the first page', () => {
        expect(paginatedData.getFirstPage()).toEqual({
            foo: {
                totalCount: 11,
                pageInfo: {
                    first: '0x64',
                    last: '0x65',
                    hasNext: true,
                    hasPrevious: false,
                    __typename: 'ListPageInfo',
                },
                edges: [
                    {
                        fooItem: 1,
                        cursor: '0x64',
                        __typename: 'FooListEdge',
                    },
                    {
                        fooItem: 2,
                        cursor: '0x65',
                        __typename: 'FooListEdge',
                    },
                ],
                __typename: 'FooList',
            },
        });
    });

    it('should return correct data for the "middle" page', () => {
        expect(paginatedData.getPage(3)).toEqual({
            foo: {
                totalCount: 11,
                pageInfo: {
                    first: '0x68',
                    last: '0x69',
                    hasNext: true,
                    hasPrevious: true,
                    __typename: 'ListPageInfo',
                },
                edges: [
                    {
                        fooItem: 5,
                        cursor: '0x68',
                        __typename: 'FooListEdge',
                    },
                    {
                        fooItem: 6,
                        cursor: '0x69',
                        __typename: 'FooListEdge',
                    },
                ],
                __typename: 'FooList',
            },
        });
    });

    it('should return correct data for the last page', () => {
        expect(paginatedData.getLastPage()).toEqual({
            foo: {
                totalCount: 11,
                pageInfo: {
                    first: '0x6e',
                    last: '0x6e',
                    hasNext: false,
                    hasPrevious: true,
                    __typename: 'ListPageInfo',
                },
                edges: [
                    {
                        fooItem: 11,
                        cursor: '0x6e',
                        __typename: 'FooListEdge',
                    },
                ],
                __typename: 'FooList',
            },
        });
    });

    it('should return correct data for the next page', () => {
        expect(paginatedData.getNextPage()).toEqual(paginatedData.getFirstPage());

        expect(paginatedData.getNextPage()).toEqual(paginatedData.getPage(2));

        paginatedData.getLastPage();

        expect(paginatedData.getNextPage()).toEqual(paginatedData.getLastPage());
    });

    it('should return correct data for the previous page', () => {
        paginatedData.getPage(3);

        expect(paginatedData.getPreviousPage()).toEqual(paginatedData.getPage(2));
        expect(paginatedData.getPreviousPage()).toEqual(paginatedData.getFirstPage());
        expect(paginatedData.getPreviousPage()).toEqual(paginatedData.getFirstPage());
    });

    it('should return correct data for empty list', () => {
        paginatedData = createPaginatedData(0);

        expect(paginatedData.getNextPage()).toEqual({
            foo: {
                totalCount: 0,
                pageInfo: {
                    first: null,
                    last: null,
                    hasNext: false,
                    hasPrevious: false,
                    __typename: 'ListPageInfo',
                },
                edges: [],
                __typename: 'FooList',
            },
        });
    });

    /*it('should return `pageInfo` object', () => {
        expect(
            paginatedData.getPageInfoObject({
                first: 10,
                last: 40,
                hasPrevious: false,
                typename: 'ListPageInfo',
            })
        ).toEqual({
            first: '0xa',
            last: '0x28',
            hasNext: true,
            hasPrevious: false,
            __typename: 'ListPageInfo',
        });
    });

    it('should return `pageInfo` object for empty arguments', () => {
        expect(paginatedData.getPageInfoObject()).toEqual({
            first: null,
            last: null,
            hasNext: false,
            hasPrevious: false,
            __typename: 'ListPageInfo',
        });
    });*/
});
