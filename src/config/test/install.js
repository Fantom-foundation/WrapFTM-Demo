import { config } from '@vue/test-utils';
import { routerT, i18nT, piniaT } from './main.js';
import 'fantom-vue3-components/src/test/mocks/matchMedia.js';
// import 'fantom-vue3-components/src/test/mocks/IntersectionObserver.js';
import { registerGlobalComponents } from '@/config/registerGlobalComponents.js';

routerT.addRouterPlugin(config);
i18nT.addVueI18nPlugin(config);
piniaT.addPiniaPlugin(config, { stubActions: false });

registerGlobalComponents(config.global.components);
