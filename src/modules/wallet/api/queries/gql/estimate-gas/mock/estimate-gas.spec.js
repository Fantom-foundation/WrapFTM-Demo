import { getEstimateGasMock } from './estimate-gas.js';

describe('getEstimateGas() mock', () => {
    it('should return expected outcome', async () => {
        const result = getEstimateGasMock({
            from: '0xD1C1BAB1eDeb382D76e5d8E454A60775d582546D',
            to: '0xfc00face00000000000000000000000000000000',
            value: '0x0',
            data: '0x0962ef790000000000000000000000000000000000000000000000000000000000000011',
        }).data.estimateGas;

        expect(result).toBe('0x28301');
    });
});
