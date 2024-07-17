import { test, expect } from '@playwright/test';

export function setUpPlaywrightCtr(ctr) {
    const { fns } = ctr.options;

    fns.test = test;
    // fns.test.describe.configure({ mode: 'parallel' });
    fns.it = test;
    fns.expect = expect;
    fns.describe = test.describe;
    fns.beforeAll = test.beforeAll;
    fns.beforeEach = test.beforeEach;
    fns.afterEach = test.afterEach;
    fns.afterAll = test.afterAll;

    ctr.options.convertClassName = true;
    ctr.options.convertMethodName = true;

    ctr.expect = expect;
    ctr.use = test.use;

    ctr.onLifecycleHookFunction = function (methodName, fn, inst) {
        fn(async ({ page, context }) => {
            await inst[methodName]({ page, context, dsl: page._dsl });
        });
    };
    ctr.onTestMethod = function (method, fn, inst) {
        fn(method.testName, async ({ page, context }) => {
            await inst[method.name]({ page, context, dsl: page._dsl });
        });
    };
}
