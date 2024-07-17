<script setup>
import { FActionButtons, FAddress } from 'fantom-vue3-components';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const props = defineProps({
    address: {
        type: String,
        required: true,
        default: '',
    },
});

const emit = defineEmits(['button-action']);

const buttons = ref([
    {
        action: 'remove',
        label: t('account.remove'),
        size: 'large',
    },
    {
        action: 'cancel',
        label: t('account.cancel'),
        size: 'large',
        secondary: true,
    },
]);

/**
 * @param {'remove'|'cancel'} action
 */
function onButtonAction(action) {
    const data = { action };

    if (action === 'remove') {
        data.address = props.address;
    }

    emit('button-action', data);
}
</script>

<template>
    <div class="removeaccountconfirmation grid">
        <p class="tea-center">
            {{ $t('account.removeAccountConfirmation.text') }}
            <FAddress :address="address">
                <template #suffix>?</template>
            </FAddress>
        </p>
        <FActionButtons :buttons="buttons" @button-action="onButtonAction" />
    </div>
</template>

<style lang="scss">
.removeaccountconfirmation {
    .fellipsis_suffix {
        margin-inline-start: 0;
    }
}
</style>
