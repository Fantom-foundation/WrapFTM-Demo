import { encodeFunctionData } from './encodeFunctionData.js';

describe('encodeFunctionData()', () => {
    it('should throw an error if given abi item is not an object', () => {
        expect(() => {
            encodeFunctionData('foo');
        }).toThrowError();
    });

    it('should throw an error if given abi item have no "name" property', () => {
        expect(() => {
            encodeFunctionData({});
        }).toThrowError();
    });

    it('should properly encode function data', () => {
        expect(
            encodeFunctionData({
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
            })
        ).toBe('0xd0e30db0');
    });

    it('should properly encode function data with values', () => {
        expect(
            encodeFunctionData(
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
                ['0xde0b6b3a7640000']
            )
        ).toBe(
            '0x2e1a7d4d0000000000000000000000000000000000000000000000000de0b6b3a7640000'
        );
    });
});
