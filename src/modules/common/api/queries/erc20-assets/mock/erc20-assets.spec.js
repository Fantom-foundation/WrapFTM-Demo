import { getErc20AssetsMock, getErc20AssetsWithBalanceMock } from './erc20-assets.js';
import { TEST_ACCOUNT_ADDRESS } from '@/plugins/web3-wallets/test-helpers.js';
import { getErc20AssetsPickFn } from '@/modules/common/api/queries/erc20-assets/erc20-assets.js';

describe('erc20 asset mocks', () => {
    describe('getErc20Assets() mock', () => {
        /*it('should return empty array if `ownerAddress` is not TEST_ACCOUNT_ADDRESS', async () => {
            const { data } = getErc20Assets({ ownerAddress: '' });

            await delay();

            expect(data.value).toEqual([]);
        });*/

        it('should return expected outcome if `ownerAddress` is TEST_ACCOUNT_ADDRESS', async () => {
            const result = getErc20AssetsPickFn(
                getErc20AssetsMock({
                    ownerAddress: TEST_ACCOUNT_ADDRESS,
                }).data
            );

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
                    symbol: 'wFTM',
                    balanceOf: '0x4563918244F40000',
                    decimals: 18,
                    logoURL: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=003',
                },
                {
                    __typename: 'ERC20Token',
                    address: '0xad84341756bf337f5a0164515b1f6f993d194e1f',
                    name: 'Fantom USD',
                    symbol: 'fUSD',
                    balanceOf: '0x0',
                    decimals: 18,
                    logoURL: 'https://cdn.worldvectorlogo.com/logos/usd-1.svg',
                },
                {
                    __typename: 'ERC20Token',
                    address: '0x841fad6eae12c286d1fd18d1d525dffa75c7effe',
                    name: 'SpookyToken',
                    symbol: 'BOO',
                    balanceOf: '0xDE0B6B3A7640000',
                    decimals: 18,
                    logoURL: 'https://repository.fantom.network/logos/erc20.svg',
                },
                {
                    __typename: 'ERC20Token',
                    address: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
                    name: 'Dai Stablecoin',
                    symbol: 'DAI',
                    balanceOf: '0x4563918244F40000',
                    decimals: 18,
                    logoURL: 'https://repository.fantom.network/logos/erc20.svg',
                },
                {
                    __typename: 'ERC20Token',
                    address: '0xd67de0e0a0fd7b15dc8348bb9be742f3c5850454',
                    name: 'Binance',
                    symbol: 'BNB',
                    balanceOf: '0x0',
                    decimals: 18,
                    logoURL: 'https://repository.fantom.network/logos/erc20.svg',
                },
                {
                    __typename: 'ERC20Token',
                    address: '0x6c021ae822bea943b2e66552bde1d2696a53fbb7',
                    name: 'TOMB',
                    symbol: 'TOMB',
                    balanceOf: '0xDE0B6B3A7640000',
                    decimals: 18,
                    logoURL: 'https://repository.fantom.network/logos/erc20.svg',
                },
                {
                    __typename: 'ERC20Token',
                    address: '0x74b23882a30290451a17c44f4f05243b6b58c76d',
                    name: 'Ethereum',
                    symbol: 'ETH',
                    balanceOf: '0x4563918244F40000',
                    decimals: 18,
                    logoURL: 'https://repository.fantom.network/logos/erc20.svg',
                },
            ]);
        });

        it('should return expected outcome if `ownerAddress` is TEST_ACCOUNT_ADDRESS and `count` is given', async () => {
            const result = getErc20AssetsPickFn(
                getErc20AssetsMock({
                    ownerAddress: TEST_ACCOUNT_ADDRESS,
                    count: 2,
                }).data
            );

            expect(result).toEqual([
                {
                    __typename: 'ERC20Token',
                    address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
                    name: 'USD Coin',
                    symbol: 'USDC',
                    decimals: 6,
                    balanceOf: '0xF4240',
                    logoURL: 'https://repository.fantom.network/logos/erc20.svg',
                },
                {
                    __typename: 'ERC20Token',
                    address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
                    name: 'Wrapped Fantom',
                    symbol: 'wFTM',
                    decimals: 18,
                    balanceOf: '0x4563918244F40000',
                    logoURL: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=003',
                },
            ]);
        });
    });

    describe('getErc20AssetsWithBalance() mock', () => {
        /*it('should return empty array if `ownerAddress` is not TEST_ACCOUNT_ADDRESS', async () => {
            const { data } = getErc20AssetsWithBalance({ ownerAddress: '' });

            await delay();

            expect(data.value).toEqual([]);
        });*/

        it('should return expected outcome if `ownerAddress` is TEST_ACCOUNT_ADDRESS and `count` is given', async () => {
            const result = getErc20AssetsPickFn(
                getErc20AssetsWithBalanceMock({
                    ownerAddress: TEST_ACCOUNT_ADDRESS,
                    count: 3,
                }).data
            );

            expect(result).toEqual([
                {
                    __typename: 'ERC20Token',
                    address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
                    name: 'USD Coin',
                    symbol: 'USDC',
                    decimals: 6,
                    logoURL: 'https://repository.fantom.network/logos/erc20.svg',
                    balanceOf: '0xF4240',
                },
                {
                    __typename: 'ERC20Token',
                    address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
                    name: 'Wrapped Fantom',
                    symbol: 'wFTM',
                    decimals: 18,
                    logoURL: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=003',
                    balanceOf: '0x4563918244F40000',
                },
                {
                    __typename: 'ERC20Token',
                    address: '0xad84341756bf337f5a0164515b1f6f993d194e1f',
                    name: 'Fantom USD',
                    symbol: 'fUSD',
                    decimals: 18,
                    logoURL: 'https://cdn.worldvectorlogo.com/logos/usd-1.svg',
                    balanceOf: '0x0',
                },
            ]);
        });
    });
});
