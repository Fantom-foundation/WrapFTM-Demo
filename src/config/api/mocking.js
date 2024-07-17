import { Modules } from '@/utils/Modules/Modules.js';

export async function setUpMocking(startApp, useMocking = false) {
    if (useMocking) {
        await Modules.setUpApiMocks();
        // await delay(150);
    }

    startApp();
}
