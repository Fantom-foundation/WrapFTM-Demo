import { MAIN_APP_STRUCTURE } from '@/modules/main/constants/app-structure.js';
import AppMainView from '@/modules/app/views/AppMainView/AppMainView.vue';
import HomeView from '@/modules/app/views/HomeView/HomeView.vue';
import { Tree } from 'fantom-vue3-components';

export const appStructure = new Tree(APP_STRUCTURE(), {
    idPropertyName: 'name',
});

/**
 * @return {AppNode[]}
 */
export function APP_STRUCTURE() {
    return [
        {
            path: '/',
            name: 'main',
            component: AppMainView,
            _c: [
                {
                    path: '',
                    name: 'home',
                    component: HomeView,
                },
            ],
        },
        ...MAIN_APP_STRUCTURE(),
    ];
}
