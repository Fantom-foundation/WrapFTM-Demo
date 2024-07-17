import { getAddressUrl, getDefaultChainExplorerUrl, getTransactionUrl } from './url.js';

describe('url utility functions', () => {
    describe('getTransactionUrl()', () => {
        it('should return url to transaction detail', () => {
            expect(
                getTransactionUrl(
                    '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2'
                )
            ).toBe(
                `${getDefaultChainExplorerUrl()}/tx/0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2`
            );
        });
    });

    describe('getAddressUrl()', () => {
        it('should return url to address detail', () => {
            expect(getAddressUrl('0xeb57521b52E1102eE6B1422BA3A6F53D0C9E18cb')).toBe(
                `${getDefaultChainExplorerUrl()}/address/0xeb57521b52E1102eE6B1422BA3A6F53D0C9E18cb`
            );
        });
    });
});
