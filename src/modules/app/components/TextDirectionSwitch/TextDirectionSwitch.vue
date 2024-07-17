<script setup>
import { FToggleButton } from 'fantom-vue3-components';
import { useLocale } from 'fantom-vue3-components/src/composables/useLocale/useLocale.js';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    label: {
        type: String,
        default: '',
    },
});

const t = useI18n().t;
const { locale } = useLocale();
const rtlDirection = ref(locale.rtlDirection);
const label = ref(props.label || t('app.textDirectionSwitch.label'));

watch(rtlDirection, (rtlDirection) => {
    locale.setTextDirection(rtlDirection ? 'rtl' : 'ltr');
});
</script>

<template>
    <FToggleButton v-model="rtlDirection" :label="label" />
</template>
