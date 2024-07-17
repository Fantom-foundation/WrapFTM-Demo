import { withSetup } from 'fantom-vue3-components/src/test/utils.js';
import { useFtmPrice } from './useFtmPrice.js';

let composableResult = null;
let app = null;

async function fetchPrice() {
    return 2;
}

beforeEach(() => {
    const result = withSetup({
        composable: () => useFtmPrice({ fetchPriceFn: fetchPrice }),
    });
    composableResult = result.composableResult;
    app = result.app;
});

afterEach(() => {
    app.unmount();
    composableResult = null;
    app = null;
});

describe('useFtmPrice', () => {
    it('should return ref to FTM price', async () => {
        expect(composableResult.ftmPrice.value).toBe(2);
    });
});
