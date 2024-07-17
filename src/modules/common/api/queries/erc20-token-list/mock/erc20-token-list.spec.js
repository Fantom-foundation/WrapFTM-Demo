import { getErc20TokenListMock } from './erc20-token-list.js';

describe('getErc20TokenList() mock', () => {
    it('should return expected outcome', async () => {
        const result = getErc20TokenListMock().data.erc20TokenList;

        expect(result.slice(0, 2)).toEqual([
            {
                __typename: 'ERC20Token',
                address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
                name: 'USD Coin',
                symbol: 'USDC',
                balanceOf: '0xF4240',
                decimals: 6,
                logoURL: 'https://repository.fantom.network/logos/erc20.svg',
            },
            {
                __typename: 'ERC20Token',
                address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
                name: 'Wrapped Fantom',
                symbol: 'WFTM',
                balanceOf: '0x4563918244F40000',
                decimals: 18,
                logoURL: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=003',
            },
        ]);
    });

    it('should return expected outcome if `count` is given', async () => {
        const result = getErc20TokenListMock({ count: 2 }).data.erc20TokenList;

        expect(result).toEqual([
            {
                __typename: 'ERC20Token',
                address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
                name: 'USD Coin',
                symbol: 'USDC',
                balanceOf: '0xF4240',
                decimals: 6,
                logoURL: 'https://repository.fantom.network/logos/erc20.svg',
            },
            {
                __typename: 'ERC20Token',
                address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
                name: 'Wrapped Fantom',
                symbol: 'WFTM',
                balanceOf: '0x4563918244F40000',
                decimals: 18,
                logoURL: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=003',
            },
        ]);
    });
});
