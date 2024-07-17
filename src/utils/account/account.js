import { ethers } from 'ethers';

export function correctAddress(address) {
    if (!address) {
        return '';
    }

    try {
        return ethers.utils.getAddress(address);
    } catch (err) {
        return '';
    }
    // return !address ? '' : ethers.utils.getAddress(address);
}

export function addressesMatch(address1 = '', address2 = '') {
    const addr1 = correctAddress(address1);
    const addr2 = correctAddress(address2);

    return addr1 && addr2 && addr1.toLowerCase() === addr2.toLowerCase();
}
