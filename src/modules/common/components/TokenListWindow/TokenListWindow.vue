<script setup>
import { FWindow } from 'fantom-vue3-components';
import { exposeMethods } from 'fantom-vue3-components/src/utils/exposeMethods/exposeMethods.js';
import { ref } from 'vue';
import TokenListC from '@/modules/common/components/TokenListC/TokenListC.vue';

const emit = defineEmits(['token-pick']);

const window = ref(null);

function onTokenPick(token) {
    emit('token-pick', token);
    window.value.hide();
}

defineExpose(exposeMethods(window, ['show', 'hide']));
</script>

<template>
    <FWindow
        ref="window"
        modal
        :title="$t('common.tokenListWindow.title')"
        class="tokenlistwindow fwindow-width-3 fwindow-nobodytoppadding"
        data-testid="token_list_window"
    >
        <TokenListC v-bind="$attrs" @token-pick="onTokenPick" />
    </FWindow>
</template>

<style lang="scss">
.tokenlistwindow {
    max-height: 460px;
}
</style>
