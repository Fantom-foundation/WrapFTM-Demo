import {PaginatedData} from "../../utils/PaginatedData/PaginatedData.js";
import {TRANSACTION_LIST} from "./transaction-list.js";

export function TRANSACTION_LIST_PAGINATED({ start, end, modifyFn } = {}) {
    return new PaginatedData({
        data: TRANSACTION_LIST({ start, end, modifyFn }),
        name: 'txList',
        typeName: 'TransactionList',
        itemName: 'transaction',
        pageLength: 25,
        cursorStartAt: 100000,
    });
}
