import { withSetup } from 'fantom-vue3-components/src/test/utils.js';
import { useAppIconset } from './useAppIconset.js';

let composableResult = null;
let app = null;
const ICONSET = { IconFoo: {}, IconFooBar: {} };

beforeEach(() => {
    const result = withSetup({ composable: () => useAppIconset() });
    composableResult = result.composableResult;
    app = result.app;
});

afterEach(() => {
    app.unmount();
    composableResult = null;
    app = null;
});

describe('useAppIconset', () => {
    it('should set and get an iconset', () => {
        composableResult.setIconset(ICONSET);

        expect(composableResult.getIconset()).toEqual(ICONSET);
    });

    it('should get icon names', () => {
        composableResult.setIconset(ICONSET);

        expect(composableResult.getIconNames()).toEqual(['foo', 'fooBar']);
    });
});
