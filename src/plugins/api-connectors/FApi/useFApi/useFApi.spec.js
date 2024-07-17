import { withSetup } from 'fantom-vue3-components/src/test/utils.js';
import { useFApi } from './useFApi.js';
import { FApi } from '../FApi.js';

let composableResult = null;
let app = null;

beforeEach(() => {
    const result = withSetup({ composable: () => useFApi() });
    composableResult = result.composableResult;
    app = result.app;
});

afterEach(() => {
    app.unmount();
    composableResult = null;
    app = null;
});

describe('useFApi', () => {
    it('should return instance of FApi class', () => {
        expect(composableResult.api).toBeInstanceOf(FApi);
    });
});
