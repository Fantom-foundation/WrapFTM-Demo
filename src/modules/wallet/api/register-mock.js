import { useFApi } from '@/plugins/api-connectors/FApi/useFApi/useFApi.js';
import { getGasPriceMock } from '@/modules/wallet/api/queries/gas-price/mock/gas-price.js';
import { getEstimateGasMock } from '@/modules/wallet/api/queries/estimate-gas/mock/estimate-gas.js';
import { getNonceMock } from '@/modules/wallet/api/queries/nonce/mock/nonce.js';
import { getTransactionStatusMock } from '@/modules/wallet/api/queries/transaction-status/mock/transaction-status.js';

const api = useFApi().api;

api.registerQueryMocks({
    getEstimateGasMock,
    getGasPriceMock,
    getNonceMock,
    getTransactionStatusMock,
});
