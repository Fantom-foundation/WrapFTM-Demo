import { getAccountBalanceMock } from './queries/account-balance/mock/account-balance.js';
import { useFApi } from '@/plugins/api-connectors/FApi/useFApi/useFApi.js';

const api = useFApi().api;

api.registerQueryMocks({
    getAccountBalanceMock,
});
