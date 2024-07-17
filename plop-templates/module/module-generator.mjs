export const moduleGenerator = {
    name: 'module',
    config: {
        description: 'module',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'module name',
            },
            {
                type: 'input',
                name: 'path',
                message: 'module path',
                default: 'modules',
            },
        ],
        actions: function () {
            const actions = [
                {
                    type: 'add',
                    path: 'src/{{path}}/{{name}}/api/register.js',
                    templateFile: 'plop-templates/module/api-register.hbs',
                },
                {
                    type: 'add',
                    path: 'src/{{path}}/{{name}}/api/register-mock.js',
                    templateFile: 'plop-templates/module/api-register-mock.hbs',
                },
                {
                    type: 'add',
                    path: 'src/{{path}}/{{name}}/components/playground.js',
                    templateFile: 'plop-templates/module/components-playground.hbs',
                },
                {
                    type: 'add',
                    path: 'src/{{path}}/{{name}}/components/register-async-components.js',
                    templateFile: 'plop-templates/module/register-async-components.hbs',
                },
                {
                    type: 'add',
                    path: 'src/{{path}}/{{name}}/components/register-test-async-components.js',
                    templateFile:
                        'plop-templates/module/register-test-async-components.hbs',
                },
                {
                    type: 'add',
                    path: 'src/{{path}}/{{name}}/constants/app-structure.js',
                    templateFile: 'plop-templates/module/app-structure.hbs',
                },
                {
                    type: 'add',
                    path: 'src/{{path}}/{{name}}/constants/routes.js',
                    templateFile: 'plop-templates/module/routes.hbs',
                },
                {
                    type: 'add',
                    path: 'src/{{path}}/{{name}}/locales/en.json',
                    templateFile: 'plop-templates/module/locales-en.hbs',
                },
                {
                    type: 'add',
                    path: 'src/{{path}}/{{name}}/views/{{ pascalCase name }}View/{{ pascalCase name }}View.vue',
                    templateFile: 'plop-templates/module/views-module-view.hbs',
                },
                {
                    type: 'add',
                    path: 'src/{{path}}/{{name}}/store/store.js',
                    templateFile: 'plop-templates/module/store.hbs',
                },
                {
                    type: 'add',
                    path: 'src/{{path}}/{{name}}/store/store.spec.js',
                    templateFile: 'plop-templates/module/store-spec.hbs',
                },
                {
                    type: 'add',
                    path: 'src/{{path}}/{{name}}/register.js',
                    templateFile: 'plop-templates/module/register.hbs',
                },
            ];

            return actions;
        },
    },
};
