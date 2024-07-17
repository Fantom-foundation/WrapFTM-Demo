import { ethers } from 'ethers';

export function addressValidator(address, errorMessage = 'Invalid address') {
    try {
        ethers.utils.getAddress(address);
        return '';
    } catch (error) {
        return errorMessage;
    }
}
