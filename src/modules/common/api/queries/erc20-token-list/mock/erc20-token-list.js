import { ERC20_TOKEN_LIST_NAMED } from '../../../../../../../tests/data/common/erc20-token-list-named.js';
import { unref } from 'vue';

export function getErc20TokenListMock({ count = 8 } = {}) {
    return {
        data: {
            ...ERC20_TOKEN_LIST_NAMED({ end: unref(count) }),
        },
    };
}
