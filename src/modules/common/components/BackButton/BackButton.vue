<script setup>
import { FButton, useMethods } from 'fantom-vue3-components';
import AppIconset from '@/modules/common/components/AppIconset/AppIconset.vue';

const props = defineProps({
    viewSwitcherId: {
        type: String,
        default: '',
    },
    componentId: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['back-button-click']);

function onBackButtonClick() {
    if (props.viewSwitcherId && props.componentId) {
        const { goBack } = useMethods(props.viewSwitcherId).getMethods();

        if (goBack) {
            goBack(props.componentId);
        }
    }

    emit('back-button-click');
}
</script>

<template>
    <FButton tertiary round :title="$t('common.goBack')" @click="onBackButtonClick">
        <AppIconset icon="arrowLeft" size="16px" class="fsvgicon-rtl-mirror" />
    </FButton>
</template>
