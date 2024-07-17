<script setup>
import { ref } from 'vue';
import { FPopover, useFPopover } from 'fantom-vue3-components';
import RecentTransactionList from '@/modules/transaction/components/RecentTransactionList/RecentTransactionList.vue';

defineProps({
    transactions: {
        type: Array,
        default() {
            return [];
        },
    },
});

const popover = ref(null);
const { exposeFPopoverMethods } = useFPopover('', popover);

defineExpose(exposeFPopoverMethods());
</script>

<template>
    <FPopover
        ref="popover"
        :attach-margin="[0, 0, 0, 0]"
        width-as-attach
        :prevent-focus="false"
        hide-on-document-mousedown
        hide-on-document-scroll
        class="fdropdownlistbox_fwindow recenttransactionlistpopover"
        style="max-width: 300px"
        @window-hide="$emit('window-hide', $event)"
    >
        <RecentTransactionList :transactions="transactions" />
    </FPopover>
</template>

<style lang="scss">
/*
.recenttransactionlistpopover {
    --recenttransactionlistpopover-max-height: calc(5 * var(--f-spacer-9));

    max-height: var(--recenttransactionlistpopover-max-height);
}
*/
</style>
