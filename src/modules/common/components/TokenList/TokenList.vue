<script setup>
import { FListbox } from 'fantom-vue3-components';
import Token from '@/modules/common/components/Token/Token.vue';

const emit = defineEmits(['token-pick']);

defineProps({
    tokens: {
        type: Array,
        default() {
            return [];
        },
        required: true,
    },
    hideBalance: {
        type: Boolean,
        default: false,
    },
});

function onTokenSelected(token) {
    emit('token-pick', token);
}
</script>

<template>
    <FListbox :data="tokens" class="tokenlist" @component-change="onTokenSelected">
        <template #default="{ item: token }">
            <div class="tokenlist_item">
                <Token :token="token" :show-name="true" :no-symbol="false" />
                <Token
                    v-if="!hideBalance"
                    :token="token"
                    :value="token.balance"
                    no-symbol
                    no-logo
                    use-placeholder
                />
            </div>
        </template>
    </FListbox>
</template>

<style lang="scss">
.tokenlist {
    &_item {
        display: flex;
        justify-content: space-between;
        align-items: center;
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
