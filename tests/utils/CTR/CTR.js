import { toKebabCase, uppercaseFirstChar } from '../string.js';
import { setUpPlaywrightCtr } from '../setUpPlaywrightCtr.js';

/**
 * Class Test Runner
 */
export class CTR {
    static options = CTR.#defaultOptions;

    /**
     * @param {Class} cls
     * @param {string[]} [methodsToSkip]
     */
    static run(cls, methodsToSkip = []) {
        CTR.#skipMethods(methodsToSkip, cls);
        CTR.#runClassTests(cls);
    }

    static onLifecycleHookFunction(methodName, fn, inst) {
        fn(async () => {
            await inst[methodName]();
        });
    }

    static onTestMethod(method, fn, inst) {
        fn(method.testName, async () => {
            await inst[method.name]();
        });
    }

    static #runClassTests(cls) {
        CTR.#callFn('describe', CTR.#getTestNameFromClassName(cls.name), () => {
            const inst = new cls();
            const options = CTR.options;

            CTR.#getAllPropertyNames(cls.prototype).forEach((methodName) => {
                let fn = null;

                if (methodName !== 'constructor') {
                    if (options.lifecycleHooks.indexOf(methodName) > -1) {
                        fn = CTR.#getFn(methodName);
                        CTR.onLifecycleHookFunction(methodName, fn, inst);
                    } else {
                        const method = CTR.#parseMethodName(methodName);

                        if (method.isTest) {
                            fn = CTR.#getFn('test', method.testAction);
                            CTR.onTestMethod(method, fn, inst);
                        }
                    }
                }
            });
        });
    }

    static setDefaultOptions() {
        CTR.options = CTR.#defaultOptions;
    }

    static #skipMethods(methods = [], cls) {
        methods.forEach((method) => {
            cls.prototype[`skip_${method}`] = cls.prototype[method];
            delete cls.prototype[method];
        });
    }

    static get #defaultOptions() {
        return {
            convertClassName: false,
            convertMethodName: false,
            fns: {
                beforeAll: null,
                beforeEach: null,
                afterEach: null,
                afterAll: null,
                describe: null,
                test: null,
                expect: null,
            },
            lifecycleHooks: ['beforeAll', 'beforeEach', 'afterEach', 'afterAll'],
        };
    }

    static #parseMethodName(methodName) {
        const split = toKebabCase(methodName).split('-');
        const isTest = CTR.#isTestKeyword(split[0]) || CTR.#isTestKeyword(split[1]);
        let testName = '';
        let testAction = '';

        if (isTest) {
            let split2;

            if (CTR.#isTestKeyword(split[0])) {
                split2 = split.slice(1);
            } else if (CTR.#isTestKeyword(split[1])) {
                split2 = split.slice(2);
                testAction = split[0].toLowerCase();
            }

            if (CTR.options.convertMethodName) {
                testName = split2.join(' ');
            } else {
                testName = split2.map((word) => uppercaseFirstChar(word)).join('');
            }
        }

        return {
            name: methodName,
            testName,
            testAction,
            isTest,
            split,
        };
    }

    static #callFn(name, ...args) {
        const fn = CTR.#getFn(name);

        fn(...args);
    }

    static #getFn(name, testAction) {
        const { fns } = CTR.options;
        const fn = testAction ? fns[name][testAction] : fns[name];

        if (typeof fn !== 'function') {
            throw new Error(
                `Not found a function with the name '${name}'${
                    testAction ? ` and test action '${testAction}'` : ''
                }`
            );
        }

        return fn;
    }

    static #isTestKeyword(str) {
        const lowcStr = str?.toLowerCase();

        return lowcStr === 'test' || lowcStr === 'it';
    }

    static #getTestNameSplitFromMethodName(methodName) {
        return CTR.options.convertMethodName ? toKebabCase(methodName).split('-') : [];
    }

    static #getTestNameFromMethodName(methodName) {
        return CTR.#getTestNameSplitFromMethodName(methodName).join(
            CTR.options.convertMethodName ? ' ' : ''
        );
    }

    static #getTestNameFromClassName(className) {
        return CTR.options.convertClassName
            ? toKebabCase(className).split('-').join(' ')
            : className;
    }

    static #getAllPropertyNames(obj) {
        const props = [];

        do {
            Object.getOwnPropertyNames(obj).forEach(function (prop) {
                if (props.indexOf(prop) === -1) {
                    props.push(prop);
                }
            });
        } while ((obj = Object.getPrototypeOf(obj)));

        return props;
    }
}

setUpPlaywrightCtr(CTR);
