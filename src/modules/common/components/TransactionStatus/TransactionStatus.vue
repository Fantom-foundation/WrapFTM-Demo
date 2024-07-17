<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppIconset from '@/modules/common/components/AppIconset/AppIconset.vue';

const t = useI18n().t;

const props = defineProps({
    /** @type {'pending'|'success'|'rejected'|'error'} */
    status: {
        type: String,
        default: '',
        validator(_value) {
            return ['', 'pending', 'success', 'rejected', 'error'].indexOf(_value) !== -1;
        },
    },
    noText: {
        type: Boolean,
        default: false,
    },
    noIcon: {
        type: Boolean,
        default: false,
    },
    iconProps: {
        type: Object,
        default() {
            return {};
        },
    },
});

const text = computed(() => {
    const { status } = props;
    let text = '';

    if (status === 'pending') {
        text = t('common.transactionStatus.pending');
    } else if (status === 'success') {
        text = t('common.transactionStatus.success');
    } else if (status === 'error') {
        text = t('common.transactionStatus.error');
    } else if (status === 'rejected') {
        text = t('common.transactionStatus.rejected');
    }

    return text;
});

const cIconProps = computed(() => {
    const { status, iconProps } = props;
    let icon = '';

    if (status === 'pending') {
        icon = 'spinner';
    } else if (status === 'success') {
        icon = 'circleCheck';
    } else if (status === 'error') {
        icon = 'circleXMark';
    } else if (status === 'rejected') {
        icon = 'circleXMark';
    }

    return { icon, ...iconProps };
});
</script>

<template>
    <span class="transactionstatus" :data-status="status">
        <AppIconset
            v-if="!noIcon && cIconProps.icon"
            v-bind="cIconProps"
            :title="text"
            data-testid="transactionstatus_icon"
        />
        <slot name="text"></slot>
        <span :class="{ 'not-visible': noText }" data-testid="transactionstatus_text">
            {{ text }}
        </span>
    </span>
</template>

<style lang="scss">
@keyframes spinner {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.transactionstatus {
    display: inline-flex;
    gap: var(--f-spacer-2);
    align-items: center;

    &[data-status='pending'] {
        .fsvgicon {
            animation: 800ms linear infinite spinner;
        }
    }

    &[data-status='success'] {
        color: var(--f-color-green-5);
    }

    &[data-status='error'] {
        color: var(--f-color-red-5);
    }
}

:root.theme-dark {
    .transactionstatus {
        &[data-status='success'] {
            color: var(--f-color-green-4);
        }

        &[data-status='error'] {
            color: var(--f-color-red-4);
        }
    }
}
</style>
