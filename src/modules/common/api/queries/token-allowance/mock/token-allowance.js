import { TOKEN_ALLOWANCE } from '../../../../../../../tests/data/common/token-allowance.js';

export function getTokenAllowanceMock() {
    return {
        data: {
            ...TOKEN_ALLOWANCE(),
        },
    };
}
