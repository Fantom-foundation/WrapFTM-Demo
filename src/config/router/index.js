import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import {
    autofocus,
    setRouteMetaInfo,
    showUnderMaintenancePage,
    transitionRoute,
} from '@/config/router/middlewares.js';
import { APP_ROUTES } from '@/modules/app/constants/routes.js';
import { MAIN_ROUTES } from '@/modules/main/constants/routes.js';
import { appConfig } from '@/config/app-config.js';
import { appStructure } from '@/modules/app/constants/app-structure.js';
import { envToBool } from '@/config/utils.js';

const useWebHashHistory =
    appConfig.useWebHashHistory || envToBool(import.meta.env.VITE_SANDBOX_MODE);

const router = createRouter({
    history: useWebHashHistory
        ? createWebHashHistory()
        : createWebHistory(import.meta.env.BASE_URL),
    routes: [...APP_ROUTES(), ...MAIN_ROUTES()],
});

router.beforeEach(showUnderMaintenancePage);
router.beforeEach(setRouteMetaInfo);

if (appConfig.flags.useViewTransitions) {
    router.beforeEach(function (to, from, next) {
        transitionRoute({ to, from, next, appStructure });
    });
}

if (import.meta.env.MODE !== 'test') {
    router.afterEach(autofocus);
}

export default router;
