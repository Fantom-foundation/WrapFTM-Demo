<script setup>
import Header from '@/modules/app/components/Header/Header.vue';
import { FViewSwitcher } from 'fantom-vue3-components';
import { APP_MAIN_VIEW_SWITCHER_ID } from '@/modules/app/constants/ids.js';
import { watch } from 'vue';
import { reloadAppMainViewSwitcher } from '@/modules/app/helpers.js';
import { useWallet } from '@/modules/wallet/composables/useWallet/useWallet.js';
import SocialMediaLinks from '@/modules/app/components/SocialMediaLinks/SocialMediaLinks.vue';

const { accountAddress } = useWallet();

watch(accountAddress, () => {
    reloadAppMainViewSwitcher();
});
</script>

<template>
    <div class="main container">
        <Header />
        <main>
            <FViewSwitcher :id="APP_MAIN_VIEW_SWITCHER_ID" type="routes" />
        </main>
        <footer>
            <SocialMediaLinks data-testid="social_media_links" />
        </footer>
    </div>
</template>

<style lang="scss">
.main {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-height: 100dvh;
    gap: var(--f-spacer-5);
}
</style>
