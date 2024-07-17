import { Tree } from 'fantom-vue3-components';
import { MAIN_APP_STRUCTURE } from '@/modules/main/constants/app-structure.js';

const mainStructure = new Tree(MAIN_APP_STRUCTURE(), {
    idPropertyName: 'name',
});

export function MAIN_ROUTES() {
    return [
        mainStructure.getNode('under-maintenance'),
        mainStructure.getNode('404', 'name'),
        mainStructure.getNode('wrongpaths', 'name'),
    ];
}
