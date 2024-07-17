import { FMINT_ACCOUNT } from '../../../../../../../tests/data/common/fmint-account.js';
import { unref } from 'vue';

export function getFmintAccountMock({ ownerAddress }) {
    return {
        data: {
            ...FMINT_ACCOUNT(unref(ownerAddress)),
        },
    };
}
