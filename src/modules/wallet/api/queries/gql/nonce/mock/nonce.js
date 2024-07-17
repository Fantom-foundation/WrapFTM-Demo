import { ACCOUNT } from '../../../../../../../../tests/data/account/account.js';

export function getNonceMock() {
    return {
        data: {
            ...ACCOUNT({ txCount: 1 }),
        },
    };
}
