import { Modules } from '@/utils/Modules/Modules.js';

Modules.registerModule('wrap-station', {
    locales: {
        en: async () => import('./locales/en.json'),
        cs: async () => import('./locales/en.json'),
    },
    playgroundComponents: async () => {
        const playgroundComponents = await import('./components/playground.js');

        return playgroundComponents.default;
    },
});
