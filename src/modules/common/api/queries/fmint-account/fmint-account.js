import gql from 'graphql-tag';
import { computed, isRef } from 'vue';
import { useVueApolloConnector } from '@/plugins/api-connectors/useVueApolloConnector/useVueApolloConnector.js';

const vueApolloConnector = useVueApolloConnector().vueApolloConnector;

export function getFmintAccount({
    ownerAddress,
    additionalFields = [],
    collateralDebtAdditionalFields = [],
    enabled = isRef(ownerAddress) ? computed(() => !!ownerAddress.value) : !!ownerAddress,
}) {
    return vueApolloConnector.query({
        query: gql`
            query GetFmintAccount($owner: Address!) {
                fMintAccount(owner: $owner) {
                    address
                    collateral {
                        balance
                        tokenAddress
                        ${collateralDebtAdditionalFields.join('\n')}
                    }
                    debt {
                        balance
                        tokenAddress
                        ${collateralDebtAdditionalFields.join('\n')}
                    }
                    ${additionalFields.join('\n')}
                }
            }
        `,
        variables: { owner: ownerAddress },
        enabled,
        defaultData: {},
        mock: {
            fnName: 'getFmintAccountMock',
        },
        options: {
            clientId: 'fantom',
        },
    });
}
