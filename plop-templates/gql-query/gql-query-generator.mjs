export const gqlQueryGenerator = {
    name: 'gql query',
    config: {
        description: 'gql query',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Gql query name (in dash case)',
            },
            {
                type: 'input',
                name: 'path',
                message: 'Gql query path',
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
                    templateFile: 'plop-templates/gql-query/gql-query.hbs',
                },
            ];

            if (data.addMock) {
                actions.push({
                    type: 'add',
                    path: 'src/{{path}}/{{kebabCase name}}/mock/{{kebabCase name}}.js',
                    templateFile: 'plop-templates/gql-query/gql-query-mock.hbs',
                });

                actions.push({
                    type: 'add',
                    path: 'src/{{path}}/{{kebabCase name}}/mock/{{kebabCase name}}.spec.js',
                    templateFile: 'plop-templates/gql-query/gql-query-mock.spec.hbs',
                });
            }

            return actions;
        },
    },
};
