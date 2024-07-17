import './component-defaults.js';
import { TestRouterUtils } from 'fantom-vue3-components/src/utils/test/router/TestRouterUtils.js';
import { TestVueI18nUtils } from 'fantom-vue3-components/src/utils/test/vue-i18n/TestVueI18nUtils.js';
import { TestPiniaUtils } from 'fantom-vue3-components/src/utils/test/pinia/TestPiniaUtils.js';
import '@/config/setEnv.js';
import router from '@/config/router/index.js';
import { i18n } from '@/config/i18n.js';
import { createTestingPinia } from '@pinia/testing';
import './async-components.js';
import { setUpAppIconset } from '@/config/app-iconset.js';
import { setUpModules } from '@/config/modules.js';
import { Modules } from '@/utils/Modules/Modules.js';

async function setup() {
    await setUpModules(true);

    setUpAppIconset();
    i18n.setMessages({ en: await Modules.getTranslations('en') });
}

await setup();

export const routerT = new TestRouterUtils(router);
export const i18nT = new TestVueI18nUtils(i18n.i18n);
export const piniaT = new TestPiniaUtils(createTestingPinia);
