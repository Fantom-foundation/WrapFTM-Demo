import { toInt } from '@/utils/big-number/big-number.js';
import { CHAIN_NAMES } from '@/plugins/web3-wallets/utils/chain-names.js';

export function getChainNameById(chainId) {
    const chainIdI = toInt(chainId);

    return CHAIN_NAMES[chainIdI] || '';
}
