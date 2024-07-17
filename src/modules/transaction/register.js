import { Modules } from '@/utils/Modules/Modules.js';
import './components/register-async-components.js';

Modules.registerModule('transaction', {
    locales: {
        en: async () => import('./locales/en.json'),
        cs: async () => import('./locales/en.json'),
    },
    testAsyncComponents: async () =>
        import('./components/register-test-async-components.js'),
    playgroundComponents: async () => {
        const playgroundComponents = await import('./components/playground.js');

        return playgroundComponents.default;
    },
});
