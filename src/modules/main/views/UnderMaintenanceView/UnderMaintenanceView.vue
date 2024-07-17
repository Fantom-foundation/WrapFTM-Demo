<script setup>
import UnderMaintenance from '@/modules/main/components/UnderMaintenance/UnderMaintenance.vue';
import { appConfig } from '@/config/app-config.js';
import SocialMediaLinks from '@/modules/app/components/SocialMediaLinks/SocialMediaLinks.vue';
import Header from '@/modules/app/components/Header/Header.vue';
</script>

<template>
    <div
        class="undermaintenanceview container"
        :class="[`sonic-${appConfig.env.buildName}`]"
    >
        <Header display-just-logo />
        <main>
            <UnderMaintenance />
        </main>
        <footer>
            <SocialMediaLinks data-testid="social_media_links" />
        </footer>
    </div>
</template>

<style lang="scss">
.undermaintenanceview {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;

    main {
        flex: 10;
    }

    .socialmedialinks {
        .linkgroup {
            margin-top: 0 !important;
            border-top: none !important;
        }
    }
}
</style>
