import { Log } from '@/modules/transaction/components/FLog/Log';
import { delay } from 'fantom-vue3-components';
import { useFApi } from '@/plugins/api-connectors/FApi/useFApi/useFApi';

const api = useFApi().api;

async function getTxCount(address) {
    return api.query.getNonce(address).promise;
}

export async function pollTxCount({ transaction, delayMs = 100 }) {
    const prevTxCount = parseInt(transaction.nonce, 16);
    const maxTries = 100;
    let currTxCount = prevTxCount;
    let checksCount = 0;

    while (currTxCount === prevTxCount && checksCount < maxTries) {
        currTxCount = parseInt(await getTxCount(transaction.from), 16);
        Log.push(`current tx count: ${currTxCount}, previous tx count: ${prevTxCount}`);
        checksCount += 1;

        await delay(delayMs);
    }

    Log.push('----');
    Log.push('Done');

    return checksCount < maxTries;
}
