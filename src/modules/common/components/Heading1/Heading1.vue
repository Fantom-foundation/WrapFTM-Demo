<script setup>
import { computed } from 'vue';

const props = defineProps({
    noFocus: {
        type: Boolean,
        default: false,
    },
});

const attrs = computed(() => {
    let attrs = {};

    if (!props.noFocus) {
        attrs['data-focus'] = true;
        attrs.tabindex = '-1';
    }

    return attrs;
});
</script>

<template>
    <h1 v-bind="attrs"><slot></slot></h1>
</template>
