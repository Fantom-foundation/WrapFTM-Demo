import {ERC20_TOKEN_LIST} from "./erc20-token-list.js";

export function ERC20_TOKEN_LIST_NAMED({ start, end, modifyFn } = {}) {
    return {
        erc20TokenList: ERC20_TOKEN_LIST({ start, end, modifyFn })
    }
}
