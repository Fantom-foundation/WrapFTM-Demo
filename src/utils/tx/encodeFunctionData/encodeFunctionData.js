import { ethers } from 'ethers';

export function encodeFunctionData(abiItem, values = []) {
    if (typeof abiItem !== 'object') {
        throw new Error('Abi item should be an object');
    } else if (!('name' in abiItem)) {
        throw new Error('Abi item should have "name" property');
    }

    return new ethers.utils.Interface([abiItem]).encodeFunctionData(abiItem.name, values);
}
