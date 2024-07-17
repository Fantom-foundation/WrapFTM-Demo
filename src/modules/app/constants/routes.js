import { appStructure } from '@/modules/app/constants/app-structure.js';

export function APP_ROUTES() {
    return [
        {
            ...appStructure.getNode('main'),
            redirect: { name: 'home' },
            children: [appStructure.getNode('home')],
        },
    ];
}
