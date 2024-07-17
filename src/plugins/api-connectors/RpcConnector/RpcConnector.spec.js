import { RpcConnector } from '../RpcConnector/RpcConnector.js';
import { VueApiConnector } from '../VueApiConnector/VueApiConnector.js';

describe('RpcConnector', () => {
    it('should throw an error if rpc provider is not given', async () => {
        rpcConnector = new RpcConnector();
        vueRpcConnector = new VueApiConnector({
            connector: rpcConnector,
        });

        const { error, promise } = vueRpcConnector.query({});

        await promise;
        expect(error.value).toEqual(new Error('No rpc provider is given'));

        const { mutate, error: error2 } = vueRpcConnector.mutation({});

        await mutate();

        expect(error2.value).toEqual(new Error('No rpc provider is given'));
    });

    it('should process query as a function', async () => {
        const { promise } = vueRpcConnector.query({
            async query({ variables, options, jsonRpcProvider }) {
                return jsonRpcProvider.method(
                    variables.transaction.to + ' ' + options.option1
                );
            },
            variables: {
                transaction: { to: '0x1', from: '0x2' },
            },
            options: { option1: 'option1' },
        });

        const result = await promise;

        expect(result).toBe('0x1 option1');
    });

    it('should process query as a function with custom chain id defined in the options', async () => {
        const { promise } = vueRpcConnector.query({
            async query({ jsonRpcProvider }) {
                return jsonRpcProvider.method('');
            },
            variables: {
                transaction: { to: '0x1', from: '0x2' },
            },
            options: { chainId: '0xfa2' },
        });

        const result = await promise;

        expect(result).toBe('0xfa2');
    });

    it('should process query as a function with custom chain id defined as a variable', async () => {
        const { promise } = vueRpcConnector.query({
            async query({ jsonRpcProvider }) {
                return jsonRpcProvider.method('');
            },
            variables: {
                chainId: '0xfa2',
                transaction: { to: '0x1', from: '0x2' },
            },
        });

        const result = await promise;

        expect(result).toBe('0xfa2');
    });

    it('should process query with contract call', async () => {
        const { promise } = vueRpcConnector.query({
            async query({ variables, options, getContract }) {
                const abiId = 'erc20';

                return getContract(variables.contract, abiId).balanceOf(
                    `${variables.contract} ${variables.transaction.to} ${options.option1}`
                );
            },
            variables: {
                contract: '0x123',
                transaction: { to: '0x1', from: '0x2' },
            },
            options: { option1: 'option1' },
        });

        const result = await promise;

        expect(result).toBe('balanceOf 0x123 0x1 option1');
    });

    it('should process query with contract call and custom chain id defined in the options', async () => {
        const { promise } = vueRpcConnector.query({
            async query({ variables, getContract }) {
                const abiId = 'erc20';

                return getContract(variables.contract, abiId).balanceOf('');
            },
            variables: {
                contract: '0x123',
                transaction: { to: '0x1', from: '0x2' },
            },
            options: { chainId: '0xfa2' },
        });

        const result = await promise;

        expect(result).toBe('balanceOf 0xfa2');
    });

    it('should process query with contract call and custom chain id defined as a variable', async () => {
        const { promise } = vueRpcConnector.query({
            async query({ variables, getContract }) {
                const abiId = 'erc20';

                return getContract(variables.contract, abiId).balanceOf('');
            },
            variables: {
                chainId: '0xfa2',
                contract: '0x123',
                transaction: { to: '0x1', from: '0x2' },
            },
        });

        const result = await promise;

        expect(result).toBe('balanceOf 0xfa2');
    });

    it('should process mutation as a function', async () => {
        const { mutate } = vueRpcConnector.mutation({
            async mutation({ variables, options, jsonRpcProvider }) {
                return jsonRpcProvider.method(
                    variables.transaction.to + ' ' + options.option1
                );
            },
            variables: {
                transaction: { to: '0x1', from: '0x2' },
            },
            options: { option1: 'option1' },
        });

        const result = await mutate();

        expect(result).toBe('0x1 option1');
    });

    it('should process mutation as a function and custom chain id defined in the options', async () => {
        const { mutate } = vueRpcConnector.mutation({
            async mutation({ jsonRpcProvider }) {
                return jsonRpcProvider.method('');
            },
            variables: {
                transaction: { to: '0x1', from: '0x2' },
            },
            options: { chainId: '0xfa2' },
        });

        const result = await mutate();

        expect(result).toBe('0xfa2');
    });

    it('should process mutation as a function and custom chain id defined as a variable', async () => {
        const { mutate } = vueRpcConnector.mutation({
            async mutation({ jsonRpcProvider }) {
                return jsonRpcProvider.method('');
            },
            variables: {
                chainId: '0xfa2',
                transaction: { to: '0x1', from: '0x2' },
            },
        });

        const result = await mutate();

        expect(result).toBe('0xfa2');
    });

    it('should process mutation with contract call', async () => {
        const { mutate } = vueRpcConnector.mutation({
            async mutation({ variables, options, getContract }) {
                const abiId = 'erc20';

                return getContract(variables.contract, abiId).balanceOf(
                    `${variables.contract} ${variables.transaction.to} ${options.option1}`
                );
            },
            variables: {
                contract: '0x123',
                transaction: { to: '0x1', from: '0x2' },
            },
            options: { option1: 'option1' },
        });

        const result = await mutate();

        expect(result).toBe('balanceOf 0x123 0x1 option1');
    });

    it('should process mutation with contract call and custom chain id defined in the options', async () => {
        const { mutate } = vueRpcConnector.mutation({
            async mutation({ variables, getContract }) {
                const abiId = 'erc20';

                return getContract(variables.contract, abiId).balanceOf('');
            },
            variables: {
                contract: '0x123',
                transaction: { to: '0x1', from: '0x2' },
            },
            options: { chainId: '0xfa2' },
        });

        const result = await mutate();

        expect(result).toBe('balanceOf 0xfa2');
    });

    it('should process mutation with contract call and custom chain id defined as a variable', async () => {
        const { mutate } = vueRpcConnector.mutation({
            async mutation({ variables, getContract }) {
                const abiId = 'erc20';

                return getContract(variables.contract, abiId).balanceOf('');
            },
            variables: {
                chainId: '0xfa2',
                contract: '0x123',
                transaction: { to: '0x1', from: '0x2' },
            },
        });

        const result = await mutate();

        expect(result).toBe('balanceOf 0xfa2');
    });

    it('should throw an error if abi is not found by given id', async () => {
        const { error, promise } = vueRpcConnector.query({
            async query({ getContract }) {
                return getContract('0x123', 'foo').balanceOf(`0x123`);
            },
        });
        await promise;

        expect(error.value).toEqual(new Error("Can't find abi with id 'foo'"));

        const { error: error2, mutate } = vueRpcConnector.mutation({
            async mutation({ getContract }) {
                return getContract('0x123', 'foo').balanceOf(`0x123`);
            },
        });
        await mutate();

        expect(error2.value).toEqual(new Error("Can't find abi with id 'foo'"));
    });

    it('should use given abi object as is (not abi id)', async () => {
        const { promise } = vueRpcConnector.query({
            async query({ getContract }) {
                return getContract('0x123', []).balanceOf(`0x123`);
            },
        });
        let result = await promise;

        expect(result).toBe('balanceOf 0x123');

        const { mutate } = vueRpcConnector.mutation({
            async mutation({ getContract }) {
                return getContract('0x123', {}).balanceOf(`0x123`);
            },
        });
        result = await mutate();

        expect(result).toBe('balanceOf 0x123');
    });
});

class RpcProviderMock {
    get jsonRpcProvider() {
        return {
            method(arg) {
                return arg;
            },
        };
    }

    getContract(contractAddress, abi, chainId) {
        return {
            balanceOf(args) {
                return `balanceOf ${args}${chainId || ''}`;
            },

            returnHex(hex) {
                return {
                    _hex: hex,
                };
            },

            throwError() {
                throw new Error('ERRRR');
            },
        };
    }

    getJsonRpcProviderByChainId(chainId) {
        return {
            method(arg) {
                return `${arg}${chainId}`;
            },
        };
    }
}

/** @type {RpcConnector} */
let rpcConnector = null;
/** @type {RpcProviderMock} */
let rpcProvider = null;
/** @type {VueApiConnector} */
let vueRpcConnector = null;

beforeEach(() => {
    rpcProvider = new RpcProviderMock();
    rpcConnector = new RpcConnector({
        rpcProvider,
        abis: {
            erc20: {},
        },
    });
    vueRpcConnector = new VueApiConnector({
        connector: rpcConnector,
    });
});

afterEach(() => {
    rpcConnector = null;
});
