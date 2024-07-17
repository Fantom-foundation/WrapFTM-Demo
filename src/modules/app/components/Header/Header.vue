<script setup>
import WalletButtonC from '@/modules/wallet/components/WalletButtonC/WalletButtonC.vue';
</script>

<template>
    <header class="header">
        <RouterLink
            :to="{ name: 'home' }"
            class="header_logo"
            data-testid="app_logo"
            :title="$t('app.home')"
        >
            <img src="/fantom-logo-blue.svg" alt="Fantom logo" width="124" height="34" />
        </RouterLink>
        <div class="header_right">
            <WalletButtonC use-popover />
        </div>
    </header>
</template>

<style lang="scss">
@use 'fantom-vue3-components/src/assets/scss/tools/media';
@use 'fantom-vue3-components/src/assets/scss/settings/breakpoints';

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--f-spacer-4) 0;
    gap: var(--f-spacer-5);

    &-sticky {
        position: sticky;
        top: 0;
        z-index: var(--f-zindex-fixed);
    }

    &_logo {
        img {
            display: block;
        }
    }
}

@include media.media-max(790px) {
    .header {
        flex-direction: column;

        &_logo {
            img {
                height: 28px;
            }
        }

        &_navigation {
            order: 3;
        }

        &_right {
            order: 2;
        }
    }
}
</style>
