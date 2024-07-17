import { getEstimateGasMock } from './estimate-gas.js';

describe('getEstimateGas() mock', () => {
    it('should return expected outcome', async () => {
        const result = getEstimateGasMock();

        expect(result).toBe('0x28301');
    });
});
