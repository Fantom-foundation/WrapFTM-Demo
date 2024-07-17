<script setup>
import AppIconset from '@/modules/common/components/AppIconset/AppIconset.vue';
</script>

<template>
    <div class="undermaintenance" data-testid="under_maintenance">
        <div class="gearsanimation">
            <AppIconset icon="settings" id="si1" />
            <AppIconset icon="settings" id="si2" />
            <AppIconset icon="settings" id="si3" />
        </div>
        <h1>{{ $t('main.underMaintenance.text') }}</h1>
    </div>
</template>

<style lang="scss">
@use '~fantom-vue3-components/src/assets/scss/tools/media';

.undermaintenance {
    //position: fixed;
    //inset: 0;
    position: relative;
    display: grid;
    place-items: center;
    height: 100%;

    .gearsanimation {
        --translate: translateX(0);
        --anim-speed: 5s;

        position: absolute;
        top: 50%;
        left: 50%;
        width: 770px;
        //width: 900px;
        aspect-ratio: 3;
        transform: translateX(-50%) translateY(-50%);
        z-index: 1;

        .fsvgicon {
            --fsvgicon-color: rgba(26, 106, 255, 0.4);
            --fsvgicon-size: 100%;

            position: absolute;
            top: 0;
            left: 0;

            /*
            svg {
                filter: blur(4px);
            }
            */
        }

        #si1 {
            animation: rz2 var(--anim-speed) linear infinite reverse;
        }

        #si2 {
            --translate: translateX(32%);
            //--translate: translateX(97%);
            animation: rz var(--anim-speed) linear infinite;
        }

        #si3 {
            --translate: translateX(-32.5%);
            //--translate: translateX(194%);
            animation: rz var(--anim-speed) linear infinite;
        }
    }

    h1 {
        position: relative;
        margin-top: 0;
        font-size: 42px;
        //font-size: var(--f-font-size-8);
        z-index: 2;
    }

    @keyframes rz {
        from {
            transform: var(--translate) rotate(0deg);
        }
        to {
            transform: var(--translate) rotate(360deg);
        }
    }

    @keyframes rz2 {
        from {
            transform: var(--translate) rotate(-30deg);
        }
        to {
            transform: var(--translate) rotate(330deg);
        }
    }
}
@include media.media-max(725px) {
    .undermaintenance {
        .gearsanimation {
            width: 100%;
        }
        h1 {
            font-size: 6vw;
        }
    }
}
</style>
