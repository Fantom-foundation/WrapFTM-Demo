import { ethers } from 'ethers';
import { chains } from '@/config/chains';
import { wftmAbi } from '@/config/api/abi/wftmAbi';
import { WFTM_TOKEN } from '@/config/tokens';
import { Log } from '@/modules/wrap-station/components/FLog/Log';

let wftmContract = null;
let txHash = '';
let onTransferEventDone = null;
let provider = null;

function getProvider() {
    if (provider === null) {
        provider = new ethers.providers.WebSocketProvider(chains.defaultChain.wsRpcUrl);
    }

    return provider;
}

export function subscribeTransferEvent() {
    unsubscribeTransferEvent();

    wftmContract = new ethers.Contract(WFTM_TOKEN().address, wftmAbi, getProvider());
    wftmContract.on('Transfer', onTransferEvent);
}

export function unsubscribeTransferEvent() {
    if (wftmContract) {
        wftmContract.removeAllListeners();
        wftmContract = null;
    }
}

function onTransferEvent(from, to, value, event) {
    if (event.transactionHash === txHash) {
        if (typeof onTransferEventDone === 'function') {
            onTransferEventDone(true);
        }

        Log.push(`Transfer event with transaction hash ${txHash} emitted`);
        Log.push('----');
        Log.push('Done');

        txHash = '';
        onTransferEventDone = null;
    }
}

export async function listenToTransferEvent({ transactionHash }) {
    txHash = transactionHash;

    return new Promise((resolve) => {
        onTransferEventDone = resolve;
    });
}
