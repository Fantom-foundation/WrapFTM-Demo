import { TRANSACTION_STATUS } from '../../../../../../../../tests/data/wallet/transaction-status.js';

export function getTransactionStatusMock(hash, status) {
    return {
        data: {
            ...TRANSACTION_STATUS(status),
        },
    };
}
