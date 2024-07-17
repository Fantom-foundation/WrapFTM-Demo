<script setup>
import { ref, watch } from 'vue';
import { FComboBox } from 'fantom-vue3-components';
import { useLocale } from 'fantom-vue3-components/src/composables/useLocale/useLocale.js';

const props = defineProps({
    languages: {
        type: Array,
        default() {
            return [];
        },
    },
    reloadPage: {
        type: Boolean,
        default: false,
    },
});

const { locale } = useLocale();
const selectedLocale = ref(locale.tag);

watch(selectedLocale, (localeTag) => {
    locale.setLocale(localeTag, props.reloadPage);
});
</script>

<template>
    <FComboBox
        select-mode
        :data="languages"
        v-model:value="selectedLocale"
        class="languageselector"
    />
</template>
