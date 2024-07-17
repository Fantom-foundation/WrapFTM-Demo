import { toHex } from '@/utils/big-number/big-number.js';

export function ERC20_TOKEN_BALANCE(balance = '0x1BC16D674EC80000') {
    return {
        ercTokenBalance: toHex(balance),
    };
}
