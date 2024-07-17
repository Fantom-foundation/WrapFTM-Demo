<script setup>
import { FCard } from 'fantom-vue3-components';
import Heading1 from '@/modules/common/components/Heading1/Heading1.vue';
</script>

<template>
    <div class="view404">
        <FCard class="view404_message">
            <Heading1 class="h3">{{ $t('main.view404.title') }}</Heading1>
            <p>{{ $t('main.view404.text') }}</p>
            <p>
                <RouterLink to="/">{{ $t('main.view404.linkTitle') }}</RouterLink>
            </p>
        </FCard>
    </div>
</template>

<style lang="scss">
.view404 {
    &_message {
        width: 90%;
        max-width: 600px;
        margin: var(--f-spacer-7) auto 0 auto;

        h1 {
            font-weight: bold;
            margin-top: 0;
        }
    }
}
</style>
