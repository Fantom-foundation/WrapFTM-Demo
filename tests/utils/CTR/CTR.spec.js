import { CTR } from './CTR.js';
import { vi } from 'vitest';

function setMocks() {
    CTR.setDefaultOptions();

    function callFn(fn) {
        fn();
    }

    function callFnWithName(name, fn) {
        fn();
    }

    CTR.options.fns.beforeAll = vi.fn(callFn);
    CTR.options.fns.beforeEach = vi.fn(callFn);
    CTR.options.fns.afterEach = vi.fn(callFn);
    CTR.options.fns.afterAll = vi.fn(callFn);
    CTR.options.fns.describe = vi.fn(callFnWithName);
    CTR.options.fns.test = vi.fn(callFnWithName);
    CTR.options.fns.expect = vi.fn(callFn);
}

class MyTest {
    itShouldDoSomething() {}
    testSomething() {}
    ignore() {}
}

beforeEach(() => {
    setMocks();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('CTR - Class Test Runner', () => {
    it('should set test suite description from class name', () => {
        CTR.run(MyTest);

        expect(CTR.options.fns.describe).toHaveBeenCalledWith(
            'MyTest',
            expect.anything()
        );
    });

    it('should convert test suite description to lowercase with spaces', () => {
        CTR.options.convertClassName = true;

        CTR.run(MyTest);

        expect(CTR.options.fns.describe).toHaveBeenCalledWith(
            'my test',
            expect.anything()
        );
    });

    it('should run test by calling method that starts with "test"', () => {
        CTR.run(MyTest);

        expect(CTR.options.fns.test).toHaveBeenCalledWith('Something', expect.anything());
    });

    it('should run test by calling method that starts with "it"', () => {
        CTR.run(MyTest);

        expect(CTR.options.fns.test).toHaveBeenCalledWith(
            'ShouldDoSomething',
            expect.anything()
        );
    });

    it('should ignore method that does not start with "test" or "it"', () => {
        CTR.run(MyTest);

        expect(CTR.options.fns.test).not.toHaveBeenCalledWith(
            'ignore',
            expect.anything()
        );
    });

    it('should convert test description to lowercase with spaces', () => {
        CTR.options.convertMethodName = true;

        CTR.run(MyTest);

        expect(CTR.options.fns.test).toHaveBeenCalledWith(
            'should do something',
            expect.anything()
        );
    });

    it('should run test with a "test action" (test.todo, test.skip, ...)', () => {
        class TestSkip {
            skip_itShouldBeSkipped() {}
            skipItShouldBeSkipped() {}
        }

        CTR.options.fns.test = { skip: CTR.options.fns.test };

        CTR.run(TestSkip);

        expect(CTR.options.fns.test.skip).toHaveBeenCalledWith(
            'ShouldBeSkipped',
            expect.anything()
        );
    });

    it('should skip given methods', () => {
        class TestSkip {
            itShouldBeSkipped() {}
        }

        CTR.options.fns.test = { skip: CTR.options.fns.test };

        CTR.run(TestSkip, ['itShouldBeSkipped']);

        expect(CTR.options.fns.test.skip).toHaveBeenCalledWith(
            'ShouldBeSkipped',
            expect.anything()
        );
    });

    it.skip('should run lifecycle hooks if a method has its name', async () => {
        const spy = vi.fn(() => {
            console.log('spy!');
        });
        class TestHooks extends MyTest {
            beforeEach() {
                spy();
            }
            afterEach() {}
        }

        CTR.run(TestHooks);

        // await delay(1500);

        expect(spy).toHaveBeenCalledTimes(2);
    });
});
