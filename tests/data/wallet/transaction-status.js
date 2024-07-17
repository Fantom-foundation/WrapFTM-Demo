export function TRANSACTION_STATUS_VALUE(status = '0x1') {
    return status;
}

export function TRANSACTION_STATUS(status = '0x1') {
    return {
        transaction: {
            status,
            __typename: 'Transaction',
        },
    };
}
