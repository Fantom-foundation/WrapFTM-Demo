import { Web3WalletError } from '@/plugins/web3-wallets/Web3Wallet/Web3Wallet.js';
import {
    createWeb3Modal,
    defaultConfig,
    useWeb3Modal,
    useWeb3ModalAccount,
    useWeb3ModalEvents,
    useWeb3ModalTheme,
    useSwitchNetwork,
} from '@web3modal/ethers5/vue';
import { watch } from 'vue';
import { getWeb3ModalOptions, getWeb3ModalStyles } from '@/config/web3-modal.js';
import { useAccounts } from '@/modules/account/composables/useAccounts/useAccounts.js';
import { styleWebComponent } from '@/utils/styleWebComponent.js';
import { useAppStore } from '@/modules/app/store/store.js';
import { appConfig } from '@/config/app-config.js';
import { storeToRefs } from 'pinia';

export class Web3Modal {
    #modal = null;
    #selectedWallet = '';
    #darkTheme = appConfig.defaultTheme === 'theme-dark';

    async open() {
        if (this.#modal === null) {
            await this.create();
        }

        if (this.#modal) {
            this.#modal.open();
        }
    }

    async close() {
        if (this.#modal === null) {
            await this.create();
        }

        if (this.#modal) {
            this.#modal.close();
        }
    }

    async switchChain(chainId) {
        // return this.#modal.open({ view: 'Networks' });
        const { switchNetwork } = useSwitchNetwork();

        return switchNetwork(
            typeof chainId === 'string' && chainId.startsWith('0x')
                ? parseInt(chainId, 16)
                : chainId
        );
    }

    async create() {
        if (this.#modal !== null) {
            return;
        }

        const web3ModalOptions = getWeb3ModalOptions();

        if (!web3ModalOptions.projectId) {
            throw new Web3WalletError('No project id provided');
        }

        web3ModalOptions.ethersConfig = defaultConfig(web3ModalOptions.ethersConfig);

        createWeb3Modal(web3ModalOptions);

        this.#modal = useWeb3Modal();

        this.#bindModalEvents();
        this.#bindAccountEvents();
        this.#bindThemeEvent();
    }

    #bindModalEvents() {
        const events = useWeb3ModalEvents();

        watch(events, (event) => {
            // console.log('web3modal events: ', event.data.event);
            const eventName = event.data.event;

            if (eventName === 'SELECT_WALLET') {
                this.#selectedWallet = event.data.properties.name;
            } else if (eventName === 'MODAL_OPEN') {
                this.#styleModal();
            }
        });
    }

    #bindAccountEvents() {
        const { address, isConnected } = useWeb3ModalAccount();

        watch(isConnected, async (active) => {
            if (this.#selectedWallet && active) {
                // console.log('!!!', address.value, this.#selectedWallet);
                await this.#setAccount({
                    address: address.value,
                    selectedWallet: this.#selectedWallet,
                });

                this.#selectedWallet = '';
            }
        });
    }

    #bindThemeEvent() {
        const { theme } = storeToRefs(useAppStore());

        watch(
            theme,
            (theme) => {
                this.#darkTheme = theme === 'theme-dark';
            },
            { immediate: true }
        );
    }

    async #setAccount({ address, selectedWallet }) {
        const { accounts } = useAccounts();

        await accounts.addAccount({
            address,
            walletName: 'web3modal',
            connectedWalletName: selectedWallet,
        });
        await accounts.setActiveAccountByAddress(address);
    }

    #styleModal() {
        const { setThemeMode } = useWeb3ModalTheme();

        setThemeMode(this.#darkTheme ? 'dark' : 'light');

        requestAnimationFrame(() => {
            const wcStyles = getWeb3ModalStyles(this.#darkTheme);

            Object.keys(wcStyles).forEach((wcSelector) => {
                styleWebComponent(wcSelector, wcStyles[wcSelector]);
            });
        });
    }
}
