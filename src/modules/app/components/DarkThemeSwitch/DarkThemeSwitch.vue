<script setup>
import { FDarkThemeSwitch } from 'fantom-vue3-components';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/modules/app/store/store.js';

const { theme } = storeToRefs(useAppStore());

function onChange(event) {
    if (event.target.checked) {
        theme.value = 'theme-dark';
    } else {
        theme.value = 'theme-default';
    }
}
</script>

<template>
    <FDarkThemeSwitch
        :model-value="theme === 'theme-dark'"
        @change="onChange"
        :title="$t('app.darkThemeSwitch.label')"
    />
</template>
