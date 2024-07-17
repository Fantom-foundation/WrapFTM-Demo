import { vi } from 'vitest';
import { Web3Wallet, Web3WalletError } from './Web3Wallet.js';
import { TEST_ACCOUNT_ADDRESS } from '../test-helpers.js';

/** @type {Web3Wallet} */
let wallet = null;
const WALLET_NAME = 'a_wallet';

function createWallet({ name = WALLET_NAME, walletEventsListener = null } = {}) {
    wallet = new Web3Wallet({ name, walletEventsListener });
}

beforeEach(() => {
    createWallet();
});

afterEach(() => {
    wallet = null;
});

describe('Web3Wallet', () => {
    it('should set wallet name', () => {
        expect(wallet.is(WALLET_NAME)).toBe(true);
    });

    it('should return wallet name', () => {
        expect(wallet.name).toBe(WALLET_NAME);
    });

    it('should throw an error if wallet name is not set', () => {
        expect(() => {
            new Web3Wallet();
        }).toThrowError(Web3WalletError);
    });

    it('should be "installed" by default', () => {
        expect(wallet.isInstalled()).toBe(true);
    });

    it('should check if transaction object is valid', () => {
        expect(wallet.isTransactionObjectValid({})).toBe(false);
        expect(wallet.isTransactionObjectValid({ gas: '0x123' })).toBe(false);
        expect(
            wallet.isTransactionObjectValid({
                to: '0x123',
                gas: '0x123',
                chainId: '0xfa',
            })
        ).toBe(true);
    });

    it('should set given chain id hex number format', () => {
        wallet.chainId = '0xfa';

        expect(wallet.chainId).toBe('0xfa');
    });

    it('should set given chain id as an integer and convert it to hex number format', () => {
        wallet.chainId = 250;

        expect(wallet.chainId).toBe('0xfa');
    });

    it('should not be active by default', () => {
        expect(wallet.isActive()).toBe(false);
    });

    it('should check if an account is active', () => {
        wallet.active = true;

        expect(wallet.isActive()).toBe(true);
    });

    describe('events', () => {
        it('should trigger a wallet event if `walletEventsListener` function is given', async () => {
            const walletEventsListener = vi.fn(() => {});

            wallet.setEventsListener(walletEventsListener);

            const EVENT = {
                name: 'chain_change',
                data: 'data',
            };

            await wallet.triggerEvent(EVENT);

            expect(walletEventsListener).toHaveBeenCalledWith(EVENT);
        });

        it('should trigger `disconnected` event when wallet is disconnecting', () => {
            const walletEventsListener = vi.fn(() => {});
            wallet.setEventsListener(walletEventsListener);

            wallet._disconnect();

            expect(walletEventsListener).toHaveBeenCalledWith({
                address: '',
                name: 'disconnected',
                waitFor: [],
            });
        });

        it('should trigger `chain_change` event when chain id is changed', () => {
            const walletEventsListener = vi.fn(() => {});
            wallet.setEventsListener(walletEventsListener);

            wallet.chainId = 250;

            expect(walletEventsListener).toHaveBeenCalledWith({
                name: 'chain_change',
                data: {
                    chainId: '0xfa',
                    walletName: WALLET_NAME,
                },
                waitFor: [],
            });
        });

        it('should trigger `address_change` event when address is changed', () => {
            const walletEventsListener = vi.fn(() => {});
            wallet.setEventsListener(walletEventsListener);

            wallet.address = TEST_ACCOUNT_ADDRESS;

            expect(walletEventsListener).toHaveBeenCalledWith({
                name: 'address_change',
                data: {
                    address: TEST_ACCOUNT_ADDRESS,
                    walletName: WALLET_NAME,
                    prevAddress: '',
                },
                waitFor: [],
            });
        });
    });
});
