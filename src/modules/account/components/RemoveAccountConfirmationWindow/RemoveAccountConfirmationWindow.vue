<script setup>
import { ref } from 'vue';
import { FWindow } from 'fantom-vue3-components';
import RemoveAccountConfirmation from '@/modules/account/components/RemoveAccountConfirmation/RemoveAccountConfirmation.vue';
import { exposeMethods } from 'fantom-vue3-components/src/utils/exposeMethods/exposeMethods.js';

defineProps({
    address: {
        type: String,
        required: true,
        default: '',
    },
});

const emit = defineEmits(['button-action']);

const window = ref(null);

/**
 * @param {RemoveAccountConfirmationButtonAction} data
 */
function onButtonAction(data) {
    window.value.hide();
    emit('button-action', data);
}

defineExpose(exposeMethods(window, ['show', 'hide']));
</script>

<template>
    <FWindow
        ref="window"
        modal
        :title="$t('account.removeAccountConfirmationWindow.label')"
        class="restoreaccountwindow fwindow-width-3"
    >
        <RemoveAccountConfirmation :address="address" @button-action="onButtonAction" />
    </FWindow>
</template>

<style lang="scss"></style>
