import { vi } from 'vitest';
import { Modules } from './Modules.js';

afterEach(() => {
    Modules.clear();
});

describe('Modules', () => {
    describe('registerModule()', () => {
        it('should throw an error if module to be registered has no name', () => {
            expect(() => {
                Modules.registerModule('', {});
            }).toThrowError();
        });

        it('should throw an error if module to be registered is already registered', () => {
            expect(() => {
                Modules.registerModule('test', {});
                Modules.registerModule('test', {});
            }).toThrowError();
        });
    });

    describe('setUp()', () => {
        it('should set up api mocks', async () => {
            const fn = vi.fn();

            Modules.registerModule('test', {
                api: {
                    async mocks() {
                        fn();
                    },
                },
            });

            await Modules.setUp(true);

            expect(fn).toBeCalled();
        });

        it('should set up async components for testing', async () => {
            const fn = vi.fn();

            Modules.registerModule('test', {
                async testAsyncComponents() {
                    fn();
                },
            });

            await Modules.setUp(true);

            expect(fn).toBeCalled();
        });
    });

    describe('setUpApiMocks()', () => {
        it('should set up api mocks', async () => {
            const fn = vi.fn();

            Modules.registerModule('test', {
                api: {
                    async mocks() {
                        fn();
                    },
                },
            });

            await Modules.setUpApiMocks();

            expect(fn).toBeCalled();
        });
    });

    describe('getTranslations()', () => {
        it('should return empty object if no modules are registered', async () => {
            expect(await Modules.getTranslations('en')).toEqual({});
        });

        it('should return empty object if no translations for the given language code are found', async () => {
            Modules.registerModule('test', {
                locales: {
                    async en() {
                        return { hello: 'Hello' };
                    },
                },
            });

            expect(await Modules.getTranslations('cs')).toEqual({});
        });

        it('should return object with translations', async () => {
            Modules.registerModule('test', {
                locales: {
                    async en() {
                        return { hello: 'Hello' };
                    },
                },
            });

            expect(await Modules.getTranslations('en')).toEqual({
                hello: 'Hello',
            });
        });
    });

    describe('getPlaygroundComponents()', () => {
        it('should return empty object if no modules are registered', async () => {
            expect(await Modules.getPlaygroundComponents()).toEqual([]);
        });

        it('should return empty object if no playground components are set', async () => {
            Modules.registerModule('test', {});

            expect(await Modules.getPlaygroundComponents()).toEqual([]);
        });

        it('should return playground components', async () => {
            Modules.registerModule('test', {
                async playgroundComponents() {
                    return [
                        {
                            label: 'PlaygroundComponent',
                            component: { PlaygroundComponent: {} },
                        },
                    ];
                },
            });
            Modules.registerModule('test2', {
                async playgroundComponents() {
                    return [
                        {
                            label: 'PlaygroundComponent2',
                            component: { PlaygroundComponent2: {} },
                        },
                    ];
                },
            });

            expect(await Modules.getPlaygroundComponents()).toEqual([
                {
                    label: 'PlaygroundComponent',
                    component: { PlaygroundComponent: {} },
                },
                {
                    label: 'PlaygroundComponent2',
                    component: { PlaygroundComponent2: {} },
                },
            ]);
        });
    });
});
