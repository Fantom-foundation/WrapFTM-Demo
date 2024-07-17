import { isPromise } from 'fantom-vue3-components';

export class Modules {
    static #modules = {};

    static registerModule(name, module = {}) {
        if (!name) {
            throw new Error('Module must have a name');
        }

        if (name in Modules.#modules) {
            throw new Error(`Module ${name} is already registered`);
        }

        Modules.#modules[name] = module;
    }

    static async setUp(test = false) {
        await Modules.#forEachModule(async (module) => {
            // console.log('setup', moduleName, module);
            await Modules.#setUpApi(module, test);
            await Modules.#setUpAsyncComponents(module, test);
        });
    }

    static async getTranslations(languageCode) {
        let translations = {};

        await Modules.#forEachModule(async (module) => {
            const transl = module?.locales[languageCode];

            if (typeof transl === 'function') {
                const moduleTranslations = await transl();

                translations = {
                    ...translations,
                    ...moduleTranslations,
                };
            }
        });

        return translations;
    }

    static async getPlaygroundComponents() {
        let components = [];

        await Modules.#forEachModule(async (module) => {
            const { playgroundComponents } = module;

            if (typeof playgroundComponents === 'function') {
                const pComponents = await playgroundComponents();

                components = [...components, ...pComponents];
            }
        });

        return components;
    }

    static async setUpApiMocks() {
        await Modules.#forEachModule(async (module) => {
            await Modules.#setUpApi(module, true);
        });
    }

    static clear() {
        Modules.#modules = {};
    }

    static async #setUpApi(module, test = false) {
        await Modules.#importOnTest(module?.api?.mocks, test);
    }

    static async #setUpAsyncComponents(module, test = false) {
        await Modules.#importOnTest(module?.testAsyncComponents, test);
    }

    static async #importOnTest(fn, test = false) {
        const importFn = test ? fn : null;

        if (typeof importFn === 'function') {
            await importFn();
        }
    }

    static async #forEachModule(callback) {
        const modules = Modules.#modules;
        const promises = [];

        if (typeof callback === 'function') {
            Object.keys(modules).forEach((moduleName) => {
                const ret = callback(modules[moduleName], moduleName);

                if (isPromise(ret)) {
                    promises.push(ret);
                }
            });

            if (promises.length > 0) {
                await Promise.all(promises);
            }
        }
    }
}
