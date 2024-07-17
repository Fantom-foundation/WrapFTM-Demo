<script setup>
import { FWindow, FActionButtons } from 'fantom-vue3-components';
import { ref } from 'vue';
import { exposeMethods } from 'fantom-vue3-components/src/utils/exposeMethods/exposeMethods.js';

const emit = defineEmits(['button-action', 'window-hide']);

defineProps({
    /** Action buttons */
    buttons: {
        type: Array,
        default() {
            return [];
        },
        required: true,
    },
});

const window = ref(null);

function onButtonAction(action) {
    emit('button-action', action);
    window.value.hide();
}

defineExpose(exposeMethods(window, ['show', 'hide', 'isWindowVisible']));
</script>

<template>
    <FWindow
        ref="window"
        modal
        class="confirmationwindow fwindow-width-3"
        @window-hide="$emit('window-hide', $event)"
    >
        <div class="grid">
            <slot></slot>
            <FActionButtons :buttons="buttons" @button-action="onButtonAction" />
        </div>
    </FWindow>
</template>
