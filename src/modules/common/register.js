import { Modules } from '@/utils/Modules/Modules.js';
import './api/register.js';

Modules.registerModule('common', {
    locales: {
        en: async () => import('./locales/en.json'),
        cs: async () => import('./locales/en.json'),
    },
    api: {
        mocks: async () => import('./api/register-mock.js'),
    },
    playgroundComponents: async () => {
        const playgroundComponents = await import('./components/playground.js');

        return playgroundComponents.default;
    },
});
