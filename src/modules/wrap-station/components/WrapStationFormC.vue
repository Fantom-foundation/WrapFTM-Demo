<script setup>
import WrapStationForm from '@/modules/wrap-station/components/WrapStationForm/WrapStationForm.vue';
import { computed, ref, watch } from 'vue';
import { useWallet } from '@/modules/wallet/composables/useWallet/useWallet.js';
import { defiUnwrapFtm, defiWrapFtm } from '@/modules/wrap-station/utils/tx/wrap.js';
import { tokenHasSymbol } from '@/utils/token/token.js';
import { useI18n } from 'vue-i18n';
import { useFApi } from '@/plugins/api-connectors/FApi/useFApi/useFApi.js';
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '@/modules/transaction/store/store';

const emit = defineEmits(['pending-transaction', 'tx-success']);

const props = defineProps({
    /** @type {{ symbol?: string, logo?: string, balance: string, decimals?: number }} */
    fromToken: {
        type: Object,
        default() {
            return {};
        },
    },
    /** @type {{ symbol?: string, logo?: string, balance: string, decimals?: number }} */
    toToken: {
        type: Object,
        default() {
            return {};
        },
    },
    verificationFunc: {
        type: Function,
        default: null,
    },
    wallet: {
        default: null,
    },
});

const { wrap } = storeToRefs(useTransactionStore());
const t = useI18n().t;
const api = useFApi().api;
const wallet = props.wallet || useWallet().wallet;

const { accountAddress } = useWallet();
const rFromToken = ref(props.fromToken);
const rToToken = ref(props.toToken);
const rFromTokenBalance = ref('');
const rToTokenBalance = ref('');
const wrapTxStatus = ref({});
const unwrapTxStatus = ref({});
const form = ref(null);

const formDisabled = ref(!accountAddress.value);
const cFormDisabled = computed(
    () =>
        formDisabled.value ||
        wrapTxStatus.value.status === 'pending' ||
        unwrapTxStatus.value.status === 'pending' ||
        !tokenHasSymbol(rFromToken.value) ||
        !tokenHasSymbol(rToToken.value)
);

async function loadBalances(accountAddress = accountAddress.value) {
    await loadFromTokenBalance(accountAddress);
    await loadToTokenBalance(accountAddress);
}

async function getBalance({ accountAddress, erc20TokenAddress }) {
    return api.query.getAccountBalance({
        address: accountAddress,
        erc20TokenAddress,
    }).promise;
}

async function loadFromTokenBalance(accountAddress = accountAddress.value) {
    if (!accountAddress) {
        rFromTokenBalance.value = '0x0';
        return;
    }

    rFromTokenBalance.value = '';
    rFromTokenBalance.value = await getBalance({
        accountAddress,
        erc20TokenAddress: rFromToken.value.address,
    });
}

async function loadToTokenBalance(accountAddress = accountAddress.value) {
    if (!accountAddress) {
        rToTokenBalance.value = '0x0';
        return;
    }

    rToTokenBalance.value = '';
    rToTokenBalance.value = await getBalance({
        accountAddress,
        erc20TokenAddress: rToToken.value.address,
    });
}

async function wrapFtm({ amount, address, tokenAddress }) {
    await wallet.sendTransaction({
        transaction: {
            ...defiWrapFtm(tokenAddress, amount),
            from: address,
        },
        code: 'wrapFtm',
        description: `${t('wrapStation.wrapStationForm.wrap')} FTM`,
        txStatus: wrapTxStatus,
        verifyTransactionFn: props.verificationFunc,
    });
}

async function unwrapFtm({ amount, address, tokenAddress }) {
    await wallet.sendTransaction({
        transaction: {
            ...defiUnwrapFtm(tokenAddress, amount),
            from: address,
        },
        code: 'unwrapFtm',
        description: `${t('wrapStation.wrapStationForm.unwrap')} FTM`,
        txStatus: unwrapTxStatus,
        verifyTransactionFn: props.verificationFunc,
    });
}

function onSubmit(values) {
    if (tokenHasSymbol(values.fromToken, 'FTM')) {
        wrapFtm({
            amount: values.tokenAmount,
            address: accountAddress.value,
            tokenAddress: values.toToken.address,
        });
    } else {
        unwrapFtm({
            amount: values.tokenAmount,
            address: accountAddress.value,
            tokenAddress: values.fromToken.address,
        });
    }
}

function onSwap() {
    const fromToken = rFromToken.value;
    const fromTokenBalance = rFromTokenBalance.value;

    rFromToken.value = rToToken.value;
    rToToken.value = fromToken;

    rFromTokenBalance.value = rToTokenBalance.value;
    rToTokenBalance.value = fromTokenBalance;

    wrap.value = tokenHasSymbol(rFromToken.value, 'FTM');
}

watch(
    accountAddress,
    (address) => {
        formDisabled.value = !address;
        loadBalances(address);
    },
    { immediate: true }
);

watch([wrapTxStatus, unwrapTxStatus], ([wrapStatus, unwrapStatus]) => {
    emit('pending-transaction', false);

    if (wrapStatus.status === 'pending') {
        emit('pending-transaction', true);
    } else if (unwrapStatus.status === 'pending') {
        emit('pending-transaction', true);
    } else if (wrapStatus.status === 'success' || unwrapStatus.status === 'success') {
        emit('tx-success');
        // reloadAppMainViewSwitcher();
        // form.value.resetInputFields();
        // loadBalances(accountAddress.value);
    }
});
</script>

<template>
    <WrapStationForm
        ref="form"
        :from-token="{ ...rFromToken, balance: rFromTokenBalance }"
        :to-token="{ ...rToToken, balance: rToTokenBalance }"
        :disabled="cFormDisabled"
        :loading="
            wrapTxStatus.status === 'pending' || unwrapTxStatus.status === 'pending'
        "
        class="wrapstationformc"
        @submit="onSubmit"
        @swap="onSwap"
        data-testid="wrap_station_form"
    ></WrapStationForm>
</template>

<style lang="scss">
.wrapstationformc {
}
</style>
