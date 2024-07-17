import { useMethods } from 'fantom-vue3-components';
import { MAIN_VIEW_SWITCHER_ID } from '@/modules/main/constants/ids.js';

export function reloadMainViewSwitcher() {
    const { reload } = useMethods(MAIN_VIEW_SWITCHER_ID).getMethods();

    if (reload) {
        reload();
    }
}
