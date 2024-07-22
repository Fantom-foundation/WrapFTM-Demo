<script setup>
import WrapStation from '@/modules/wrap-station/components/WrapStation.vue';
</script>

<template>
    <div class="wrapstationview">
        <h1>Wrap FTM</h1>
        <h2>
            Sample App showing recommended ways of checking the completion of a
            transaction
            <br />
            <a
                href="https://github.com/Fantom-foundation/WrapFTM-Demo/tree/main/src/modules/wrap-station/verification-methods"
                target="_blank"
                >App source code on Github</a
            >
        </h2>
        <WrapStation />
    </div>
</template>

<style lang="scss">
.wrapstationview {
    h1 {
        text-align: center;
        margin-block-start: var(--f-spacer-5);
    }

    h2 {
        margin-block-start: var(--f-spacer-5);
        margin-block-end: var(--f-spacer-7);
        text-align: center;

        a {
            padding-top: var(--f-spacer-5);
            font-size: var(--f-font-size-5);
        }
    }
}
</style>
