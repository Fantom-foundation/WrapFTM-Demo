import { appConfig } from '@/config/app-config.js';
import { envToBool } from '@/config/utils.js';

export function setEnv() {
    appConfig.env.mockingEnabled = envToBool(import.meta.env.VITE_ENABLE_MOCKING);
    appConfig.env.underMaintenance = envToBool(import.meta.env.VITE_UNDER_MAINTENANCE);
}

setEnv();
