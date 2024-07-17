import { Modules } from '@/utils/Modules/Modules.js';
import './api/register.js';

Modules.registerModule('wallet', {
    locales: {
        en: async () => import('./locales/en.json'),
        cs: async () => import('./locales/cs.json'),
    },
    api: {
        mocks: async () => import('./api/register-mock.js'),
    },
});
