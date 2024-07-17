<script setup>
import { FButton } from 'fantom-vue3-components';
import { computed, ref, watch } from 'vue';
import Token from '@/modules/common/components/Token/Token.vue';
import AppIconset from '@/modules/common/components/AppIconset/AppIconset.vue';
import TokenListWindow from '@/modules/common/components/TokenListWindow/TokenListWindow.vue';

const emit = defineEmits(['token-pick']);

const props = defineProps({
    tokens: {
        type: Array,
        default() {
            return [];
        },
    },
    /** selected token */
    token: {
        type: Object,
        default() {
            return null;
        },
    },
    hideBalance: {
        type: Boolean,
        default: false,
    },
    showTokenName: {
        type: Boolean,
        default: false,
    },
    showBalanceOnButton: {
        type: Boolean,
        default: false,
    },
});

const disabled = computed(() => props.tokens.length <= 1);
const rToken = ref(null);
const window = ref(null);
const cToken = computed(() => {
    return (
        rToken.value || props.token || (props.tokens.length > 0 ? props.tokens[0] : {})
    );
});
const balance = computed(() => {
    const { balance: tokenBalance } = cToken.value;
    let balance = '';

    if (
        props.showBalanceOnButton &&
        tokenBalance &&
        tokenBalance !== '0x0' &&
        tokenBalance !== '0x00'
    ) {
        balance = tokenBalance;
    }

    return balance;
});
const showIcon = computed(() => {
    return props.tokens.length > 1;
});

function onClick() {
    if (!disabled.value) {
        window.value.show();
    }
}

function onTokenPick(_token) {
    emit('token-pick', _token);
    rToken.value = _token;
}

watch(
    () => props.token,
    (token) => {
        rToken.value = token;
    }
);
</script>

<template>
    <FButton
        :disabled="disabled"
        size="large"
        class="tokenpicker"
        v-bind="$attrs"
        @click="onClick"
    >
        <Token
            :token="cToken"
            :value="balance"
            :show-name="showTokenName"
            :no-symbol="showTokenName"
            :logo-size="32"
        />
        <AppIconset v-if="showIcon" icon="chevronDown" size="14px" />
    </FButton>
    <TokenListWindow
        ref="window"
        :tokens="tokens"
        :hide-balance="hideBalance"
        @token-pick="onTokenPick"
        data-testid="token_picker_window"
    />
</template>

<style lang="scss">
.tokenpicker {
    &.btn {
        --f-btn-lg-padding: var(--f-spacer-2) var(--f-spacer-6);
        --f-btn-main-color: var(--f-doc-color);
        --f-btn-font-weight: normal !important;
        --f-btn-disabled-opacity: 1;
    }

    .fbutton {
        &_label {
            display: flex;
            align-items: center;
            gap: var(--f-spacer-2);
        }
    }

    .token.ftoken {
        --ftoken-symbol-size: 100%;

        .ftoken_value {
            font-weight: normal;
        }

        .ftoken_symbol {
            opacity: 1;
        }
    }
}
</style>
