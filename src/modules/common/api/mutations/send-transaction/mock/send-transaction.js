export function sendTransactionData(
    hash = '0xb255061a2a646f28bf1fa922a96aff195ec6e3368c9dccac2b472dc693a8a795'
) {
    return {
        data: {
            sendTransaction: {
                hash,
                __typename: 'Transaction',
            },
        },
    };
}

export function sendTransaction() {
    return sendTransactionData();
}
