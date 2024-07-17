import { Chains } from '@/utils/Chains/Chains.js';
import { FTM_TOKEN } from '@/config/tokens.js';

function NATIVE_TOKEN() {
    const ftmToken = FTM_TOKEN();

    return {
        name: ftmToken.name,
        symbol: ftmToken.symbol,
        decimals: ftmToken.decimals,
    };
}
const CHAINS = [
    {
        chainId: '0xfa',
        name: 'Fantom Opera',
        code: 'fantom_mainnet',
        currencySymbol: 'FTM',
        nativeToken: NATIVE_TOKEN(),
        rpcUrl: 'https://rpc.ftm.tools/',
        explorerUrl: 'https://ftmscan.com',
    },
    {
        chainId: '0xfa2',
        name: 'Fantom Testnet',
        code: 'fantom_testnet',
        currencySymbol: 'FTM',
        nativeToken: NATIVE_TOKEN(),
        rpcUrl: 'https://xapi.testnet.fantom.network/lachesis/',
        explorerUrl: 'https://explorer.testnet.fantom.network',
    },
];
let chains = null;

beforeEach(() => {
    chains = new Chains();
});

afterEach(() => {
    chains = null;
});

describe('Chains', () => {
    it('should set array of chains', () => {
        chains.setUp({ chains: CHAINS });

        expect(chains.get('0xfa')).toEqual(CHAINS[0]);
    });

    it('should get a chain by id in hex format', () => {
        chains.setUp({ chains: CHAINS });

        expect(chains.get('0xfa')).toEqual(CHAINS[0]);
    });

    it('should get a chain by id as integer', () => {
        chains.setUp({ chains: CHAINS });

        expect(chains.get(250)).toEqual(CHAINS[0]);
    });

    it('should get a chain by a value and property', () => {
        chains.setUp({ chains: CHAINS });

        expect(chains.getBy('fantom_testnet', 'code')).toEqual(CHAINS[1]);
    });

    it('should get default chain id', () => {
        chains.setUp({ defaultChainId: '0xfa2', chains: CHAINS });

        expect(chains.defaultChain).toEqual(CHAINS[1]);
    });

    it('should get first chain if default chain id is not given', () => {
        chains.setUp({ chains: CHAINS });

        expect(chains.defaultChain).toEqual(CHAINS[0]);
    });

    it('should freeze returned chain', () => {
        chains.setUp({ chains: CHAINS });

        const chain = chains.get('0xfa');

        expect(() => {
            chains.defaultChain.chainId = '0x1';
        }).toThrowError();
        expect(() => {
            chain.chainId = '0x1';
        }).toThrowError();
    });

    it('should expose chains array', () => {
        chains.setUp({ chains: CHAINS });

        expect(chains.chains).toEqual(CHAINS);
    });

    it('should get adjusted info about chains for Metamask', () => {
        chains.setUp({ chains: CHAINS });

        expect(chains.getMetamaskChainsInfo()).toEqual({
            '0xfa': {
                chainId: CHAINS[0].chainId,
                chainName: CHAINS[0].name,
                nativeCurrency: NATIVE_TOKEN(),
                rpcUrls: [CHAINS[0].rpcUrl],
                blockExplorerUrls: [CHAINS[0].explorerUrl],
            },
            '0xfa2': {
                chainId: CHAINS[[1]].chainId,
                chainName: CHAINS[[1]].name,
                nativeCurrency: NATIVE_TOKEN(),
                rpcUrls: [CHAINS[[1]].rpcUrl],
                blockExplorerUrls: [CHAINS[[1]].explorerUrl],
            },
        });
    });
});
