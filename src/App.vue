<script setup>
import Main from '@/modules/main/components/Main/Main.vue';
import { onMounted } from 'vue';
import { clientInfo } from 'fantom-vue3-components';

onMounted(() => {
    if (clientInfo.mobile) {
        document.documentElement.classList.add('touch-device');
    }
});
</script>

<template>
    <Main />
</template>

<style lang="scss">
@use 'assets/scss/main';
</style>
