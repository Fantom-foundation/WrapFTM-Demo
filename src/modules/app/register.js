import { Modules } from '@/utils/Modules/Modules.js';

Modules.registerModule('app', {
    locales: {
        en: async () => import('./locales/en.json'),
        cs: async () => import('./locales/en.json'),
    },
});
