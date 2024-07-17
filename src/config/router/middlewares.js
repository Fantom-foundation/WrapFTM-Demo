import { focusElem, useDocumentMeta } from 'fantom-vue3-components';
import { appConfig } from '@/config/app-config.js';
import { i18n } from '@/config/i18n.js';
import { transitionHelper } from '@/utils/transitionHelper.js';
import { nextTick } from 'vue';
import { getNodesPositions } from '@/utils/tree/tree.js';

const APP_DESCRIPTION = appConfig.description;
const { documentMeta } = useDocumentMeta();

/**
 * Set title and description of the page from route's data
 *
 * @param {Object} to
 * @param {Object} from
 */
export function setRouteMetaInfo(to, from) {
    let title = to?.meta?.title;
    const getTitle = to?.meta?.getTitle;
    const description = to?.meta?.description;

    title = title ? i18n.t(title) : '';

    if (typeof getTitle === 'function') {
        title = getTitle({ to, from, title });
    }

    documentMeta.setTitle(title, true);
    documentMeta.setDescription(
        description ? i18n.t(description) : '' || APP_DESCRIPTION
    );
}

/**
 * Add view transition when route is updated
 *
 * @param {Object} to
 * @param {Object} from
 * @param {function} next
 * @param {array} appStructure
 */
export function transitionRoute({ to, from, next, appStructure }) {
    transitionHelper({
        async updateDOM() {
            next();
            await nextTick();
        },
        classNames:
            appStructure &&
            getNodesPositions(from.name, to.name, appStructure) === 'after'
                ? ['back-transition']
                : [],
    });
}

/**
 * Cancel route if route is forbidden
 *
 * @param {Object} to
 * @param {array} forbiddenRoutes
 */
export function cancelRoutes(to, forbiddenRoutes = []) {
    if (forbiddenRoutes.length === 0 || !forbiddenRoutes.includes(to.name)) {
        return false;
    }
}

/**
 * Cancel route if route is forbidden
 *
 * @param {Object} to
 */
export function showUnderMaintenancePage(to) {
    if (appConfig.env.underMaintenance) {
        if (to.name !== 'under-maintenance') {
            return { name: 'under-maintenance', replace: true };
        }
    }
}

/**
 * Focus first found element with `data-focus` attribute
 */
export function autofocus() {
    if (window.document) {
        setTimeout(() => {
            focusElem();
        }, 100);
    }
}
