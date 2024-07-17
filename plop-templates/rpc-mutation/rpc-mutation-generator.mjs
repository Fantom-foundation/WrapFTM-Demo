export const rpcMutationGenerator = {
    name: 'rpc mutation',
    config: {
        description: 'rpc mutation',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Rpc mutation name (in dash case)',
            },
            {
                type: 'input',
                name: 'path',
                message: 'Rpc mutation path',
                default: 'mutations',
            },
            {
                type: 'confirm',
                name: 'addMock',
                message: 'Add mutation mock?',
                default: true,
            },
        ],
        actions: function (data) {
            const actions = [
                {
                    type: 'add',
                    path: `src/{{path}}/${
                        data.addMock ? '{{kebabCase name}}/' : ''
                    }{{kebabCase name}}.js`,
                    templateFile: 'plop-templates/rpc-mutation/rpc-mutation.hbs',
                },
            ];

            if (data.addMock) {
                actions.push({
                    type: 'add',
                    path: 'src/{{path}}/{{kebabCase name}}/mock/{{kebabCase name}}.js',
                    templateFile: 'plop-templates/rpc-mutation/rpc-mutation-mock.hbs',
                });

                actions.push({
                    type: 'add',
                    path: 'src/{{path}}/{{kebabCase name}}/mock/{{kebabCase name}}.spec.js',
                    templateFile:
                        'plop-templates/rpc-mutation/rpc-mutation-mock.spec.hbs',
                });
            }

            return actions;
        },
    },
};
