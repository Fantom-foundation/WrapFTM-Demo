import { Web3Wallet, Web3WalletError } from '../Web3Wallet/Web3Wallet.js';
import {
    useDisconnect,
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from '@web3modal/ethers5/vue';
import { watch } from 'vue';
import { providers } from 'ethers';
import { createWeb3Modal } from '@/plugins/web3-wallets/useWeb3Modal.js';

export class Web3ModalWallet extends Web3Wallet {
    #options = {};
    #provider = null;
    #bindedEvents = null;
    #connectedWalletName = '';

    /**
     * @param {string} [name]
     * @param {function} [walletEventsListener]
     * @param {Object} [options]
     */
    constructor({ name = 'web3modal', walletEventsListener = null, options = {} }) {
        super({ name, walletEventsListener });

        this.#options = options;
    }

    async init({ activateOnInit = true, address = '', connectedWalletName = '' }) {
        await createWeb3Modal();
        this.#bindEvents();

        this.#connectedWalletName = connectedWalletName;

        if (!activateOnInit && address) {
            this.address = address;
        }
    }

    async sendTransaction({ transaction = {}, contractDeployment = false } = {}) {
        if (!contractDeployment && !this.isTransactionObjectValid(transaction)) {
            throw new Web3WalletError('Not a valid transaction object');
        }

        this.#createProvider();

        if (!this.#provider) {
            throw new Web3WalletError('A provider is not set');
        }

        try {
            if (!transaction.data) {
                transaction.data = '0x';
            }

            const hash = await this.#provider.send('eth_sendTransaction', [transaction]);

            return {
                status: 'success',
                data: hash,
            };
        } catch (error) {
            return {
                status: 'rejected',
            };
        }
    }

    async personalSign({ message }) {
        this.#createProvider();

        if (!this.#provider) {
            throw new Web3WalletError('A provider is not set');
        }

        try {
            const signer = this.#provider.getSigner();
            const signedMessage = await signer?.signMessage(message);

            return {
                status: 'success',
                signedMessage,
            };
        } catch (error) {
            return {
                status: 'rejected',
                error,
            };
        }
    }

    async disconnect(fromWallet) {
        if (!this.isActive()) {
            return;
        }

        if (!fromWallet) {
            const { disconnect } = useDisconnect();

            disconnect();
        }

        this.active = false;
        this.#unbindEvents();
        await this._disconnect();
    }

    activate() {
        this.active = true;
    }

    getConnectedWalletName() {
        return this.#connectedWalletName;
    }

    #createProvider() {
        if (this.#provider !== null) {
            return;
        }

        const { walletProvider } = useWeb3ModalProvider();

        this.#provider = new providers.Web3Provider(walletProvider.value);
    }

    #bindEvents() {
        if (this.#bindedEvents) {
            return;
        }

        this.#bindedEvents = {};

        const { address, chainId, isConnected } = useWeb3ModalAccount();

        this.#bindedEvents.unwatchIsConnected = watch(
            isConnected,
            async (isConnected, isConnectedOld) => {
                if (isConnected) {
                    this.activate();
                }

                if (isConnectedOld) {
                    await this.disconnect();
                }
            }
        );

        this.#bindedEvents.unwatchAddress = watch(
            address,
            (address) => {
                if (address !== undefined) {
                    this.address = address.toLowerCase();
                    this.activate();
                } else {
                    this.disconnect(true);
                }
            },
            { immediate: true }
        );

        this.#bindedEvents.unwatchChainId = watch(
            chainId,
            (chainId) => {
                if (chainId !== undefined) {
                    this.chainId = chainId;
                }
            },
            { immediate: true }
        );
    }

    #unbindEvents() {
        const bindedEvents = this.#bindedEvents;

        if (bindedEvents) {
            bindedEvents.unwatchAddress();
            bindedEvents.unwatchChainId();
            bindedEvents.unwatchIsConnected();

            this.#bindedEvents = null;
        }
    }
}
