import { FApi } from '../FApi.js';

const api = new FApi();

/**
 * @return {{api: FApi}}
 */
export function useFApi() {
    return { api };
}
