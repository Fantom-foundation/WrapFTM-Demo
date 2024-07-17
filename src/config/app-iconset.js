import { useAppIconset } from '@/modules/common/components/AppIconset/useAppIconset/useAppIconset.js';
import * as appIcons from '@/assets/app-icons/index.js';

export function setUpAppIconset() {
    const { setIconset } = useAppIconset();
    setIconset(appIcons);
}
