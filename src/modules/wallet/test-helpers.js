import { delay } from 'fantom-vue3-components';

export class WalletMock {
    _signTransactionArgs = [];
    _sendTransactionArgs = [];
    _personalSignArgs = [];
    _errors = {};
    _delays = {};

    constructor({ errors = {}, delays = {} } = {}) {
        this._errors = errors;
        this._delays = delays;
    }

    async switchChain() {
        this._throwError('switchChain');
        await this._delay('switchChain');
    }

    async addChain() {
        this._throwError('addChain');
        await this._delay('addChain');
    }

    async addToken() {
        this._throwError('addToken');
        await this._delay('addToken');
    }

    async signTransaction(...args) {
        this._signTransactionArgs.push(args);
        await this._delay('signTransaction');
    }

    async sendTransaction(...args) {
        this._sendTransactionArgs.push(args);
        await this._delay('sendTransaction');
    }

    async personalSign(...args) {
        this._personalSignArgs.push(args);
        await this._delay('personalSign');
    }

    _throwError(methodName) {
        const error = this._errors[methodName];

        if (error) {
            if (typeof error === 'string') {
                throw new Error(error);
            } else {
                throw new error();
            }
        }
    }

    async _delay(methodName) {
        if (methodName in this._delays) {
            await delay(this._delays[methodName]);
        }
    }
}
