export class Web3MockUtils {
    static BLOCKCHAIN = 'fantom';
    static WALLET = 'metamask';

    static async setMock(page, mock = {}, mockName = '', options = {}) {
        await page.evaluate(
            (args) => {
                window.__mocks__.web3Mock.mock(args);
            },
            {
                mock,
                mockName,
                ...options,
            }
        );
    }

    static async setAccountsMock({
        page,
        accounts = [],
        blockchain = Web3MockUtils.BLOCKCHAIN,
        wallet = Web3MockUtils.WALLET,
        mockName = '',
        options = {},
    }) {
        await Web3MockUtils.setMock(
            page,
            {
                blockchain,
                wallet,
                accounts: {
                    return: accounts,
                },
            },
            mockName,
            options
        );
    }

    static async setTransactionMock({
        page,
        transaction = {},
        blockchain = Web3MockUtils.BLOCKCHAIN,
        wallet = Web3MockUtils.WALLET,
        mockName = '',
        options = { setRequestMock: true },
    }) {
        // set provider to correctly mock `eth_getTransactionCount`, `eth_gasPrice` etc.
        if (options.setRequestMock) {
            await Web3MockUtils.setRequestMock({
                page,
                request: {
                    method: 'eth_getTransactionCount',
                    api: [' '],
                },
                mockName: '_eth_getTransactionCount_',
            });
        }

        await Web3MockUtils.setMock(
            page,
            {
                transaction,
                blockchain,
                wallet,
            },
            mockName,
            options
        );
    }

    static async setRequestMock({
        page,
        request = {},
        blockchain = Web3MockUtils.BLOCKCHAIN,
        wallet = Web3MockUtils.WALLET,
        mockName = '',
        options = { useJsonRpcProvider: true },
    }) {
        await Web3MockUtils.setMock(
            page,
            {
                request,
                blockchain,
                wallet,
            },
            mockName,
            options
        );
    }

    static async setSignRequestMock({
        page,
        params = [],
        signature,
        blockchain = Web3MockUtils.BLOCKCHAIN,
        wallet = Web3MockUtils.WALLET,
        mockName = '',
        options = { useJsonRpcProvider: true },
    }) {
        await Web3MockUtils.setMock(
            page,
            {
                signature: {
                    params,
                    return: signature,
                },
                blockchain,
                wallet,
            },
            mockName,
            options
        );
    }

    static async setNetworkMock({
        page,
        network = {},
        blockchain = Web3MockUtils.BLOCKCHAIN,
        wallet = Web3MockUtils.WALLET,
        mockName = '',
        options = {},
    }) {
        await Web3MockUtils.setMock(
            page,
            {
                network,
                blockchain,
                wallet,
            },
            mockName,
            options
        );
    }

    static async setBalanceMock({
        page,
        params = { address: '', balance: '0x0' },
        blockchain = Web3MockUtils.BLOCKCHAIN,
        wallet = Web3MockUtils.WALLET,
        mockName,
        options = { useJsonRpcProvider: true },
    }) {
        await Web3MockUtils.setMock(
            page,
            {
                balance: {
                    for: params.address,
                    return: params.balance,
                },
                blockchain,
                wallet,
            },
            mockName,
            options
        );
    }

    static async mockHasBeenCalled(page, mockName) {
        return await page.evaluate((_mockName) => {
            return window.__mocks__.web3Mock.toHaveBeenCalled(_mockName);
        }, mockName);
    }

    static async triggerWeb3WalletEvent(page, eventName, value) {
        return await page.evaluate(
            (args) => {
                return window.__mocks__.web3Mock.trigger(args.eventName, args.value);
            },
            { eventName, value }
        );
    }

    static async resetMocks(page) {
        await page.evaluate(() => {
            window.__mocks__.web3Mock.resetMocks();
        });
    }

    static async setSoftwareWalletPrivateKey(page, privateKey) {
        await page.evaluate(
            (args) => {
                window.__mocks__.web3Mock.softwareWalletPrivateKey = args.privateKey;
            },
            {
                privateKey,
            }
        );
    }
}
