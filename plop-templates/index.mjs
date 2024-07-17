import { componentGenerator } from './component/component-generator.mjs';
import { gqlQueryGenerator } from './gql-query/gql-query-generator.mjs';
import { gqlMutationGenerator } from './gql-mutation/gql-mutation-generator.mjs';
import { composableGenerator } from './composable/composable-generator.mjs';
import { moduleGenerator } from './module/module-generator.mjs';
import { rpcQueryGenerator } from './rpc-query/rpc-query-generator.mjs';
import { rpcMutationGenerator } from './rpc-mutation/rpc-mutation-generator.mjs';

export const plopHelpers = [];
export const plopGenerators = [
    componentGenerator,
    gqlQueryGenerator,
    gqlMutationGenerator,
    rpcQueryGenerator,
    rpcMutationGenerator,
    composableGenerator,
    moduleGenerator,
];
