import { Auth } from '@/modules/account/Auth/Auth.js';
import { useWallet } from '@/modules/wallet/composables/useWallet/useWallet.js';
import { useAccounts } from '@/modules/account/composables/useAccounts/useAccounts.js';
import { ref } from 'vue';
import { useFApi } from '@/plugins/api-connectors/FApi/useFApi/useFApi.js';

/** @type {Auth} */
let auth = null;
const api = useFApi().api;
const isLogged = ref(false);

async function getMessageToSign() {
    const { mutate } = api.mutation.initiateLogin();

    return mutate();
}

async function logIn({ message = '', signedMessage = '', accountAddress = '' }) {
    const { mutate } = api.mutation.login({
        user: accountAddress,
        challenge: message,
        signature: signedMessage,
    });

    return mutate();
}

/**
 * @return {{auth: Auth, isLogged: Ref<boolean>}}
 */
export function useAuth() {
    if (auth === null) {
        const { wallet, accountAddress } = useWallet(true);
        const { accounts } = useAccounts();

        auth = new Auth({
            wallet,
            accounts,
            getMessageToSign,
            logIn,
            isLogged,
            accountAddress,
        });
    }

    return { auth, isLogged };
}
