import {toHex} from "@/utils/big-number/big-number.js";

export function ACCOUNT({ transactionList = {}, balance, txCount }) {
    const account = {
        ...transactionList,
        __typename: 'Account',
    };

    if (balance !== undefined) {
        account.balance = toHex(balance);
    }

    if (txCount !== undefined) {
        account.txCount = toHex(txCount);
    }

    return {
        account,
    };
}
