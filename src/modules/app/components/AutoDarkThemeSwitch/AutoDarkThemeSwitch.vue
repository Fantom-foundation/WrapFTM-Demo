<script setup>
import { FToggleButton } from 'fantom-vue3-components';
import { useAppStore } from '@/modules/app/store/store.js';
import { storeToRefs } from 'pinia';

const { autoDarkTheme } = storeToRefs(useAppStore());
</script>

<template>
    <FToggleButton
        v-model="autoDarkTheme"
        :label="$t('app.autoDarkThemeSwitch.label')"
        :data-tooltip="$t('app.autoDarkThemeSwitch.tooltip')"
    />
</template>
