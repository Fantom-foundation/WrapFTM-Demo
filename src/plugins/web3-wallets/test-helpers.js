import { Web3Wallet } from '@/plugins/web3-wallets/Web3Wallet/Web3Wallet.js';

export const TEST_ACCOUNT_MNEMONIC =
    'adjust unit fluid toy clock tennis sting shadow pluck swift local answer treat push snack dilemma question praise target time trap glass rain vital';
export const TEST_ACCOUNT_ADDRESS = '0xeb57521b52E1102eE6B1422BA3A6F53D0C9E18cb';
export const TEST_ACCOUNT_ADDRESS2 = '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01';
export const TEST_ACCOUNT_PRIVATE_KEY =
    '0x19d9919f1cc2a4d9d09944dc54b2a9812f7ffa741f0c2be59376fe19bd67b78f';
export const TEST_ACCOUNT_PASSWORD = 'password';
export const TEST_TRANSACTION_HASH =
    '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331';

export function TEST_ACCOUNT_KEYSTORE_FILE() {
    return {
        version: 3,
        id: '436973c8-1cb3-400a-8c94-cd45e34a61e3',
        address: 'eb57521b52e1102ee6b1422ba3a6f53d0c9e18cb',
        crypto: {
            ciphertext:
                'b098712c8316bcd165ac4727dbf792c3fdb937a22c87a14ef58a7ff9b0511ef1',
            cipherparams: { iv: '08b5cc35d278833a81374f40646cd217' },
            cipher: 'aes-128-ctr',
            kdf: 'scrypt',
            kdfparams: {
                dklen: 32,
                salt: '27355f72a4d823a4dde6df528917d9869c84363d87e5ff0e90902a69a5bbec20',
                n: 8192,
                r: 8,
                p: 1,
            },
            mac: '291828d1d0d519f363cb7360ad477123737d3ed1d2e1cb8b37aaf2f03539de3f',
        },
    };
}

export function TRANSACTION() {
    return {
        from: TEST_ACCOUNT_ADDRESS,
        to: TEST_ACCOUNT_ADDRESS2,
        gasPrice: '0x3B9ACA00',
        gasLimit: '0x5208',
        data: 'foo',
    };
}

export function FULL_TRANSACTION() {
    return {
        from: TEST_ACCOUNT_ADDRESS,
        to: TEST_ACCOUNT_ADDRESS2,
        gasLimit: '0x28301',
        gasPrice: '0x24ab47394a',
        nonce: '0x1',
        chainId: '0xfa',
    };
}

export const TEST_ACCOUNT = {
    address: TEST_ACCOUNT_ADDRESS,
    walletName: 'test',
};

export const TEST_ACCOUNT2 = {
    address: TEST_ACCOUNT_ADDRESS2,
    walletName: 'test',
};

export class TestWeb3Wallet extends Web3Wallet {
    constructor({ name, address = '' }) {
        super({ name });

        if (address) {
            this.address = address;
        }
    }

    init({ address }) {
        if (address) {
            this.address = address;
        }
    }

    async activate() {
        this.active = true;
    }

    setFromKeystoreFile(keystoreFile) {
        this.address = keystoreFile.address;
    }

    async signTransaction({ __signedTransaction__ = null, __errorMessage__ = '' }) {
        return new Promise((resolve, reject) => {
            if (__signedTransaction__) {
                resolve(__signedTransaction__);
            } else if (__errorMessage__) {
                reject(new Error(__errorMessage__));
            } else {
                resolve();
            }
        });
    }

    async sendTransaction({ __transactionHash__ = '', __errorMessage__ = '' }) {
        return new Promise((resolve, reject) => {
            if (__transactionHash__) {
                resolve(__transactionHash__);
            } else if (__errorMessage__) {
                reject(new Error(__errorMessage__));
            } else {
                resolve();
            }
        });
    }

    async personalSign({ __signedMessage__ = null, __errorMessage__ = '' }) {
        return new Promise((resolve, reject) => {
            if (__signedMessage__) {
                resolve({
                    signedMessage: __signedMessage__,
                    status: 'success',
                });
            } else if (__errorMessage__) {
                reject(new Error(__errorMessage__));
            } else {
                resolve();
            }
        });
    }

    async disconnect() {
        this._disconnect();
    }
}

export class ProviderMock {
    #requestErrors = {};

    constructor({ requestErrors = {} } = {}) {
        this.#requestErrors = requestErrors;
    }

    init() {}

    async signTransaction() {
        return {
            status: 'success',
            data: {
                rawTransaction:
                    '0xf865018524ab47394a83028301948ba1f109551bd432803012645ac136ddd64dba7280801ba0a6e699ad3fe618f0907592e33497ee50e6337711b7da37fb8446e17e69c7cda7a00c46014008f7706809048717f07ee6df2ee73c58aafd875667eeccad93faf574',
                transactionHash:
                    '0xb255061a2a646f28bf1fa922a96aff195ec6e3368c9dccac2b472dc693a8a795',
            },
        };
    }

    async sendTransaction() {
        return {
            status: 'success',
            data: '0xb255061a2a646f28bf1fa922a96aff195ec6e3368c9dccac2b472dc693a8a795',
        };
    }

    async personalSign() {
        return {
            status: 'success',
            signedMessage: 'signed message',
        };
    }

    async request({ method }) {
        let ret = null;

        if (method in this.#requestErrors) {
            throw new Error(this.#requestErrors[method]);
        }

        if (method === 'eth_sendTransaction') {
            ret = TEST_TRANSACTION_HASH;
        } else if (method === 'eth_accounts' || method === 'eth_requestAccounts') {
            ret = [''];
        } else if (method === 'personal_sign') {
            ret = 'signed message';
        }

        return ret;
    }

    on() {}
}
