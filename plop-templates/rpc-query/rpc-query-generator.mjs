export const rpcQueryGenerator = {
    name: 'rpc query',
    config: {
        description: 'rpc query',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Rpc query name (in dash case)',
            },
            {
                type: 'input',
                name: 'path',
                message: 'Rpc query path',
                default: 'queries',
            },
            {
                type: 'confirm',
                name: 'addMock',
                message: 'Add query mock?',
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
                    templateFile: 'plop-templates/rpc-query/rpc-query.hbs',
                },
            ];

            if (data.addMock) {
                actions.push({
                    type: 'add',
                    path: 'src/{{path}}/{{kebabCase name}}/mock/{{kebabCase name}}.js',
                    templateFile: 'plop-templates/rpc-query/rpc-query-mock.hbs',
                });

                actions.push({
                    type: 'add',
                    path: 'src/{{path}}/{{kebabCase name}}/mock/{{kebabCase name}}.spec.js',
                    templateFile: 'plop-templates/rpc-query/rpc-query-mock.spec.hbs',
                });
            }

            return actions;
        },
    },
};
