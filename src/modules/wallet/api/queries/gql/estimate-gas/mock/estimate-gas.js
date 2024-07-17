import { ESTIMATE_GAS } from '../../../../../../../../tests/data/wallet/estimate-gas.js';

export function getEstimateGasMock() {
    return {
        data: {
            ...ESTIMATE_GAS(),
        },
    };
}
