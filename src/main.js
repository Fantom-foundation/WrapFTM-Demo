import '@/config/component-defaults.js';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './config/setEnv.js';
import router from './config/router';
import { i18n } from '@/config/i18n.js';
import App from './App.vue';
import { appConfig } from '@/config/app-config.js';
import { registerSW } from 'virtual:pwa-register';
import { useDocumentMeta } from 'fantom-vue3-components';
import { registerGlobalComponents } from '@/config/registerGlobalComponents.js';
import { setUpMocking } from '@/config/api/mocking.js';
import { setUpAppIconset } from '@/config/app-iconset.js';
import { setUpLocale } from '@/config/locale.js';
import { setUpModules } from '@/config/modules.js';

setUpModules();

setUpAppIconset();

// PWA
registerSW({
    onOfflineReady() {},
});

const { documentMeta } = useDocumentMeta();
documentMeta.setMainTitle(appConfig.title);

async function startApp(app) {
    app.use(createPinia());
    app.use(i18n.i18n);

    await setUpLocale();

    app.use(router);

    registerGlobalComponents(app);

    app.mount('#app');
}

setUpMocking(() => {
    const app = createApp(App);
    startApp(app);
}, appConfig.env.mockingEnabled);
