import { rpcProvider } from '@/config/api/rpc';
import { ethers } from 'ethers';
import { wftmAbi } from '@/config/api/abi/wftmAbi';
import { Log } from '@/modules/transaction/components/FLog/Log';
import { delay } from 'fantom-vue3-components';
import { WFTM_TOKEN } from '@/config/tokens';

export async function queryLog({ transactionHash, delayMs = 100 }) {
    const provider = rpcProvider.jsonRpcProvider;
    const contract = new ethers.Contract(WFTM_TOKEN().address, wftmAbi, provider);
    const maxTries = 100;
    let checksCount = 0;

    let events = null;
    let found = false;

    while (!found && checksCount < maxTries) {
        const currentBlockNumber = await provider.getBlockNumber();
        events = await contract.queryFilter(
            'Transfer',
            currentBlockNumber - 50,
            currentBlockNumber
        );

        const event = events.find((event) => event.transactionHash === transactionHash);

        found = !!event;

        Log.push(
            `found: ${found}, block: ${event ? event.blockNumber : currentBlockNumber}`
        );

        if (!found) {
            await delay(delayMs);
        }

        checksCount += 1;
    }

    Log.push('----');
    Log.push('Done');

    return found;
}
