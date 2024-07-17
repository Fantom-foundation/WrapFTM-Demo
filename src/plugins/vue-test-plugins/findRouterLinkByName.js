import { createWrapperError } from '@vue/test-utils';

/**
 * Find RouterLink component with given route name.
 *
 * @param {Object} wrapper
 * @returns {{findByTestId: ((function(*): (DOMWrapper<NodeType>))|*)}}
 */
export function findRouterLinkByNamePlugin(wrapper) {
    function findRouterLinkByName(routeName) {
        const routerLinks = wrapper.findAllComponents({ name: 'RouterLink' });
        let routerLink = null;

        for (let i = 0, len = routerLinks.length; i < len; i++) {
            if (routerLinks[i].vm.to.name === routeName) {
                routerLink = routerLinks[i];
                break;
            }
        }

        return routerLink || createWrapperError('VueWrapper');
    }

    return {
        findRouterLinkByName,
    };
}
