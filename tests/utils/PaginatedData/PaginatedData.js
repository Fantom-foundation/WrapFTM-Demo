export class PaginatedData {
    #data = [];
    #pageLength = 0;
    #name = '';
    #typeName = '';
    #itemName = '';
    #listPageInfoType = '';
    #currentPage = 0;
    #cursorStartAt = 1;

    constructor({
        data = [],
        pageLength = 20,
        name = '',
        typeName = '',
        itemName = '',
        listPageInfoType = 'ListPageInfo',
        cursorStartAt = 1,
    } = {}) {
        this.#data = data;
        this.#pageLength = pageLength;
        this.#name = name;
        this.#typeName = typeName;
        this.#itemName = itemName;
        this.#listPageInfoType = listPageInfoType;
        this.#cursorStartAt = cursorStartAt;
    }

    getFirstPage() {
        return this.getPage(this.getFirstPageNumber());
    }

    getLastPage() {
        return this.getPage(this.getLastPageNumber());
    }

    getNextPage() {
        return this.getPage(this.#currentPage + 1);
    }

    getPreviousPage() {
        return this.getPage(this.#currentPage - 1);
    }

    getPage(pageNumber = 1) {
        const data = this.#data;
        const page = {};

        this.#setCurrentPageNumber(pageNumber);

        page[this.#name] = {
            totalCount: data.length,
            pageInfo: this.#getPageInfo(this.#currentPage, this.#pageLength),
            edges: this.#getEdges(data, this.#currentPage, this.#pageLength),
            __typename: this.#typeName,
        };

        return page;
    }

    setPageLength(pageLength) {
        this.#pageLength = pageLength;
    }

    #setCurrentPageNumber(pageNumber) {
        this.#currentPage = pageNumber;

        if (this.#currentPage < 1) {
            this.#currentPage = 1;
        } else if (this.#currentPage > this.getLastPageNumber()) {
            this.#currentPage = this.getLastPageNumber();
        }
    }

    getFirstPageNumber() {
        return 1;
    }

    getLastPageNumber() {
        return Math.ceil(this.#data.length / this.#pageLength);
    }

    #getEdges(data, pageNumber, pageLength) {
        const pageIndices = this.#getPageIndices(
            pageNumber,
            pageLength,
            this.#data.length
        );
        const itemName = this.#itemName;
        const cursorStartAt = this.#cursorStartAt + pageIndices.from;

        return data.slice(pageIndices.from, pageIndices.to).map((item, index) => ({
            [itemName]: item,
            cursor: this.#toHex(cursorStartAt + index),
            __typename: `${this.#typeName}Edge`,
            // __typename: `${this.#uppercaseFirstChar(itemName)}Edge`,
        }));
    }

    #getPageInfo(pageNumber, pageLength) {
        const dataLength = this.#data.length;
        const pageIndices = this.#getPageIndices(pageNumber, pageLength, dataLength);
        const cursorStartAt = this.#cursorStartAt;

        return this.#getPageInfoObject(
            dataLength > 0
                ? {
                      first: cursorStartAt + pageIndices.from,
                      last: cursorStartAt + pageIndices.to - 1,
                      hasNext: pageNumber !== this.getLastPageNumber(),
                      hasPrevious: pageNumber !== this.getFirstPageNumber(),
                  }
                : { first: -1, last: -1 }
        );
    }

    #getPageInfoObject({
        first = -1,
        last = -1,
        hasNext = true,
        hasPrevious = true,
        typename = this.#listPageInfoType,
    } = {}) {
        return {
            first: first < 0 ? null : this.#toHex(first),
            last: last < 0 ? null : this.#toHex(last),
            hasNext: last === -1 ? false : hasNext,
            hasPrevious: first === -1 ? false : hasPrevious,
            __typename: typename,
        };
    }

    #getPageIndices(pageNumber, pageLength, dataLength) {
        const from = pageLength * (pageNumber - 1);
        let to = from + pageLength;

        if (pageNumber === this.getLastPageNumber()) {
            const r = dataLength % pageLength;

            if (r > 0) {
                to = from + r;
            }
        }

        return { from, to };
    }

    /*#uppercaseFirstChar(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }*/

    #toHex(number) {
        const sign = number < 0 ? '-' : '';

        return `${sign}0x${Number(number).toString(16)}`;
    }
}
