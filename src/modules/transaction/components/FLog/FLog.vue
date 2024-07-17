<script setup>
import { Log } from './Log.js';
</script>

<template>
    <div class="flog">
        <pre v-if="!Log.isEmpty()">{{ Log.rows }}</pre>
    </div>
</template>

<style lang="scss">
.flog {
    pre {
        font-size: 14px;
        white-space: pre-wrap;
        word-wrap: break-word;
        max-width: 600px;
        padding: var(--f-spacer-2) var(--f-spacer-3);
    }
}
</style>
