import gql from 'graphql-tag';
import { computed, isRef } from 'vue';
import { adjustTokens } from '@/utils/token/token.js';
import { useVueApolloConnector } from '@/plugins/api-connectors/useVueApolloConnector/useVueApolloConnector.js';

const vueApolloConnector = useVueApolloConnector().vueApolloConnector;

export function getErc20Assets({
    ownerAddress,
    count = 100,
    additionalFields = [],
    enabled = isRef(ownerAddress) ? computed(() => !!ownerAddress.value) : !!ownerAddress,
}) {
    return vueApolloConnector.query({
        query: gql`
            query GetErc20Assets($owner: Address!, $count: Int = 50) {
                erc20Assets(owner: $owner, count: $count) {
                    address
                    name
                    symbol
                    decimals
                    logoURL
                    ${additionalFields.join('\n')}
                }
            }
        `,
        variables: {
            owner: ownerAddress,
            count,
        },
        defaultData: [],
        enabled,
        pickFn: getErc20AssetsPickFn,
        copyResult: true, // ????
        mock: {
            fnName: 'getErc20AssetsMock',
        },
        options: {
            clientId: 'fantom',
        },
    });
}

export function getErc20AssetsWithBalance({
    ownerAddress,
    count = 100,
    additionalFields = [],
}) {
    return getErc20Assets({
        ownerAddress,
        count,
        additionalFields: ['balanceOf(owner: $owner)', ...additionalFields],
    });
}

/*
export function getErc20AssetsWithAllowance({ ownerAddress, spenderAddress, count = 100, additionalFields = [] }) {
    return getErc20Assets({ ownerAddress, count, additionalFields: ['allowance(owner: $owner)', ...additionalFields] });
}
*/

export function getErc20AssetsPickFn(data) {
    const erc20Assets = data?.erc20Assets;

    if (erc20Assets) {
        adjustTokens({ tokens: erc20Assets, symbolsToAdjust: ['wftm', 'fusd'] });
    }

    return erc20Assets;
}
