<script setup>
import { computed } from 'vue';
import { FSvgIcon, uppercaseFirstChar } from 'fantom-vue3-components';
import { useAppIconset } from '@/modules/common/components/AppIconset/useAppIconset/useAppIconset.js';

const { getIconset } = useAppIconset();
const iconset = getIconset();

const props = defineProps({
    /** Icon name. For example icon name for `IconArrowLeft.vue` will be `arrowLeft` */
    icon: {
        type: String,
        default: '',
    },
    /** Aria label for svg */
    ariaLabel: {
        type: String,
        default: '',
    },
});

const componentName = computed(() => {
    if (iconset) {
        const icon = iconset[`Icon${uppercaseFirstChar(props.icon)}`];

        if (icon) {
            return icon;
        } else {
            // throw new Error(`Icon ${props.icon} can't be found`);
            console.error(`Icon ${props.icon} can't be found`);
        }
    } else {
        // throw new Error('No iconset is set');
        console.error('No app iconset is set');
    }

    return '';
});
</script>

<template>
    <FSvgIcon>
        <Component :is="componentName" :aria-label="ariaLabel || null" />
    </FSvgIcon>
</template>
