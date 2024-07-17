<script setup>
import BackButton from '@/modules/common/components/BackButton/BackButton.vue';
import { i18n } from '@/config/i18n.js';

defineProps({
    heading: {
        type: String,
        default: 'h2',
    },
    buttonTitle: {
        type: String,
        default: i18n.t('common.goBack'),
    },
});
</script>

<template>
    <div class="headingwithbackbutton">
        <BackButton
            :title="buttonTitle"
            @back-button-click="$emit('back-button-click')"
            class="headingwithbackbutton_button"
        />
        <Component :is="heading" class="headingwithbackbutton_heading"
            ><slot></slot
        ></Component>
    </div>
</template>

<style lang="scss">
.headingwithbackbutton {
    display: flex;
    align-items: center;
    margin-bottom: var(--f-spacer-5);

    &_heading {
        text-align: center;
        margin-top: 0;
        margin-bottom: 0;
        width: 100%;
    }

    &_button {
    }
}
</style>
