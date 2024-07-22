<script setup>
import { Log } from './Log.js';
</script>

<template>
    <div class="flog">
        <h3>Interaction Log:</h3>
        <pre v-if="!Log.isEmpty()">{{ Log.rows }}</pre>
    </div>
</template>

<style lang="scss">
.flog {
    pre {
        font-size: 14px;
        white-space: pre-wrap;
        word-wrap: break-word;
        max-width: calc(100vw - var(--f-spacer-5));
        padding: var(--f-spacer-3) var(--f-spacer-4);
        background: var(--theme-dark-color-8b);
        border-radius: var(--f-border-radius-3);
    }

    h3 {
        margin-top: 0;
    }
}
</style>
