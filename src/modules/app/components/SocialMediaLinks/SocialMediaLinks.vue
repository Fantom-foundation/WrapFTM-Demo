<script setup>
import { SOCIAL_MEDIA_LINKS } from '@/config/social-media-links.js';
import LinkGroup from '@/modules/common/components/LinkGroup/LinkGroup.vue';
</script>

<template>
    <section class="socialmedialinks" aria-labelledby="smlinksid">
        <h2 id="smlinksid" class="not-visible">
            {{ $t('app.socialMediaLinks.socialMediaLinks') }}
        </h2>
        <LinkGroup
            :links="SOCIAL_MEDIA_LINKS()"
            :icon-props="{ size: '32px' }"
            show-labels
        />
    </section>
</template>

<style lang="scss">
@use '~fantom-vue3-components/src/assets/scss/tools/media';
@use '@/assets/scss/_settings.scss' as settings;

.socialmedialinks {
    .linkgroup {
        display: flex;
        justify-content: space-between;
        //margin-top: calc(var(--f-spacer-6) + var(--f-spacer-5));
        //margin-top: var(--f-spacer-9);
        //border-top: 1px solid var(--f-color-grey-3);
        padding: var(--f-spacer-7) 0;

        &_label {
            font-size: var(--f-font-size-5);
        }

        a:visited,
        a:link {
            color: var(--f-doc-color) !important;
        }
    }
}

:root.theme-dark {
    .socialmedialinks {
        .linkgroup {
            //border-top: 1px solid var(--theme-dark-color-6);
            border-top-color: var(--theme-dark-color-6);
        }
    }
}

@include media.media-max(settings.$breakpoint-md) {
    .socialmedialinks {
        .linkgroup {
            &_label {
                display: none;
            }
        }
    }
}
</style>
