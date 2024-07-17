import {PaginatedData} from "../../utils/PaginatedData/PaginatedData.js";
import {DELEGATION_LIST} from "./delegation-list.js";

export function DELEGATION_LIST_PAGINATED() {
    return new PaginatedData({
        data: DELEGATION_LIST({ end: 40 }),
        name: 'delegationsByAddress',
        typeName: 'DelegationList',
        itemName: 'delegation',
        pageLength: 25,
        cursorStartAt: 1000,
    });
}
