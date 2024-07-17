<script setup>
import { onMounted, ref, watch } from 'vue';
import { FAppTheme } from 'fantom-vue3-components';
import { useAppStore } from '@/modules/app/store/store.js';

const props = defineProps({
    defaultTheme: {
        type: String,
        default: '',
    },
});

const appStore = useAppStore();
const currTheme = ref(appStore.theme || props.defaultTheme);
let prefersColorScheme = null;
let prevTheme = appStore.theme;

watch(
    () => appStore.theme,
    (theme) => {
        currTheme.value = theme;
    }
);

watch(
    () => appStore.autoDarkTheme,
    (value) => {
        setDarkTheme(
            value && prefersColorScheme
                ? prefersColorScheme.matches
                : appStore.theme === 'theme-dark'
        );
    }
);

function setPrefersColorScheme() {
    prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)');

    if (prefersColorScheme) {
        prefersColorScheme.addEventListener('change', (_event) => {
            if (appStore.autoDarkTheme) {
                setDarkTheme(_event.matches);
            }
        });
    }
}

function setDarkTheme(darkTheme = false) {
    if (darkTheme) {
        prevTheme = appStore.theme;
        currTheme.value = 'theme-dark';
    } else {
        currTheme.value = prevTheme;
    }
}

onMounted(() => {
    setPrefersColorScheme();
    setDarkTheme(
        appStore.autoDarkTheme && prefersColorScheme
            ? prefersColorScheme.matches
            : appStore.theme === 'theme-dark'
    );
});
</script>

<template>
    <FAppTheme :theme="currTheme" animate />
</template>
