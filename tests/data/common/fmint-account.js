export function FMINT_ACCOUNT(ownerAddress = '') {
    return {
        fMintAccount: {
            address: ownerAddress,
            collateral: [
                {
                    balance: '0x4563918244F40000', // 5
                    tokenAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', // wFTM
                },
            ],
            debt: [
                {
                    balance: '0xDE0B6B3A7640000', // 1
                    tokenAddress: '0xad84341756bf337f5a0164515b1f6f993d194e1f', // fUSD
                },
            ],
        },
    };
}
