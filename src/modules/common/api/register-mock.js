import { sendTransaction } from './mutations/send-transaction/mock/send-transaction.js';
import {
    getErc20AssetsMock,
    getErc20AssetsWithBalanceMock,
} from './queries/erc20-assets/mock/erc20-assets.js';
import { getErc20TokenListMock } from './queries/erc20-token-list/mock/erc20-token-list.js';
import { getFmintAccountMock } from './queries/fmint-account/mock/fmint-account.js';
import { getTokenAllowanceMock } from './queries/token-allowance/mock/token-allowance.js';
import { getPriceMock } from './queries/price/mock/price.js';
import { useFApi } from '@/plugins/api-connectors/FApi/useFApi/useFApi.js';

const api = useFApi().api;

api.registerMutationMock(sendTransaction, 'sendTransaction');

api.registerQueryMocks({
    getPriceMock,
    getTokenAllowanceMock,
    getFmintAccountMock,
    getErc20TokenListMock,
    getErc20AssetsMock,
    getErc20AssetsWithBalanceMock,
});
