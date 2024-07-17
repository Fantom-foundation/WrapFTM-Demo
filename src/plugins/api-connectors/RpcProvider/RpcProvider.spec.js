import { RpcProvider } from '@/plugins/api-connectors/RpcProvider/RpcProvider.js';
import { Chains } from '@/utils/Chains/Chains.js';
import { vi } from 'vitest';

let rpcProvider = null;
let providerMock = null;

class JsonRpcProviderMock {
    async getBalance() {
        return {
            _hex: '0xffff',
        };
    }
}

function createProvider() {
    providerMock = new JsonRpcProviderMock();

    return providerMock;
}

const CHAINS = [
    {
        chainId: '0xfa',
        rpcUrl: 'https://rpc.ftm.tools/',
    },
    {
        chainId: '0xfa2',
        rpcUrl: 'https://xapi.testnet.fantom.network/lachesis/',
    },
];

beforeEach(() => {
    rpcProvider = new RpcProvider({
        chains: new Chains({ chains: CHAINS, defaultChainId: '0xfa' }),
        createProvider,
    });
});

afterEach(() => {
    rpcProvider = null;
    providerMock = null;

    vi.resetAllMocks();
});

describe('RpcProvider', () => {
    it('should throw an error if `chains` instance is not given', () => {
        expect(() => {
            new RpcProvider({});
        }).toThrowError('Need instance of `Chains`');
    });

    /*
    it('should set provider by default chain id', () => {
        rpcProvider = new RpcProvider({
            chains: new Chains({ chains: CHAINS, defaultChainId: '0xfa' }),
            createProvider,
        });

        expect(typeof rpcProvider.provider.getBalance).toBe('function');
    });

    it('should set provider by chain id', () => {
        rpcProvider.setByChainId('0xfa2');

        expect(typeof rpcProvider.provider.getBalance).toBe('function');
    });
*/

    it('should throw an error if setting provider by chain id fails', () => {
        expect(() => {
            rpcProvider.setByChainId('0xfade');
        }).toThrowError("Can't find provider by chain id 0xfade");
    });
});
