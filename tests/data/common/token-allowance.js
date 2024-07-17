import {toHex} from "@/utils/big-number/big-number.js";

export function TOKEN_ALLOWANCE(allowance = '0xDE0B6B3A7640000') {
    return {
        ercTokenAllowance: toHex(allowance),
    };
}
