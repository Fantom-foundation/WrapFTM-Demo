/**
 * @return {AppNode[]}
 */
export function MAIN_APP_STRUCTURE() {
    return [
        {
            path: '/404',
            name: '404',
            component: () => import('../views/View404/View404.vue'),
        },
        {
            path: '/under-maintenance',
            name: 'under-maintenance',
            component: () =>
                import('../views/UnderMaintenanceView/UnderMaintenanceView.vue'),
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'wrongpaths',
            component: () => import('../views/View404/View404.vue'),
            redirect: { name: '404' },
        },
    ];
}
