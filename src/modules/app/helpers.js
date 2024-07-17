import { useMethods } from 'fantom-vue3-components';
import { APP_MAIN_VIEW_SWITCHER_ID } from '@/modules/app/constants/ids.js';

export function reloadAppMainViewSwitcher() {
    const { reload } = useMethods(APP_MAIN_VIEW_SWITCHER_ID).getMethods();

    if (reload) {
        reload();
    }
}
