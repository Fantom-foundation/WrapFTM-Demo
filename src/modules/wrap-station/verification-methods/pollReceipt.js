import { Log } from '@/modules/wrap-station/components/FLog/Log';
import { delay } from 'fantom-vue3-components';
import { useFApi } from '@/plugins/api-connectors/FApi/useFApi/useFApi';

const api = useFApi().api;

async function getTransactionReceipt(transactionHash) {
    return api.query.getTransactionReceipt(transactionHash).promise;
}

export async function pollReceipt({ transactionHash, delayMs = 100 }) {
    let receipt = await getTransactionReceipt(transactionHash);

    while (receipt === null) {
        receipt = await getTransactionReceipt(transactionHash);
        Log.push(`receipt: ${JSON.stringify(receipt, null, 2)}`);

        await delay(delayMs);
    }

    Log.push('----');
    Log.push('Done');

    return !!receipt;
}
