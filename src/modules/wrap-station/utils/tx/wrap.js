import { encodeFunctionData } from '@/utils/tx/encodeFunctionData/encodeFunctionData.js';

export function defiWrapFtm(erc20Address, amount) {
    return {
        to: erc20Address,
        value: amount,
        data: encodeFunctionData({
            constant: false,
            inputs: [],
            name: 'deposit',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: true,
            stateMutability: 'payable',
            type: 'function',
        }),
    };
}

export function defiUnwrapFtm(erc20Address, amount) {
    return {
        to: erc20Address,
        value: '0x0',
        data: encodeFunctionData(
            {
                constant: false,
                inputs: [
                    {
                        internalType: 'uint256',
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                name: 'withdraw',
                outputs: [
                    {
                        internalType: 'uint256',
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            [amount]
        ),
    };
}
