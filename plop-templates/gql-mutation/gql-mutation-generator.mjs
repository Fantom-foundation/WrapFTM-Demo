export const gqlMutationGenerator = {
    name: 'gql mutation',
    config: {
        description: 'gql mutation',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Gql mutation name (in dash case)',
            },
            {
                type: 'input',
                name: 'path',
                message: 'Gql mutation path',
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
                    templateFile: 'plop-templates/gql-mutation/gql-mutation.hbs',
                },
            ];

            if (data.addMock) {
                actions.push({
                    type: 'add',
                    path: 'src/{{path}}/{{kebabCase name}}/mock/{{kebabCase name}}.js',
                    templateFile: 'plop-templates/gql-mutation/gql-mutation-mock.hbs',
                });

                actions.push({
                    type: 'add',
                    path: 'src/{{path}}/{{kebabCase name}}/mock/{{kebabCase name}}.spec.js',
                    templateFile:
                        'plop-templates/gql-mutation/gql-mutation-mock.spec.hbs',
                });
            }

            return actions;
        },
    },
};
