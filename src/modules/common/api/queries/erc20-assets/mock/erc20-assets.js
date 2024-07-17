import { ERC20_ASSETS } from '../../../../../../../tests/data/common/erc20-assets.js';
import { unref } from 'vue';

export function getErc20AssetsMock({ count = 100 }) {
    return {
        data: {
            ...ERC20_ASSETS({ count: unref(count) }),
        },
    };
}

export function getErc20AssetsWithBalanceMock({ count = 100 }) {
    return {
        data: {
            ...ERC20_ASSETS({ count }),
        },
    };
}
