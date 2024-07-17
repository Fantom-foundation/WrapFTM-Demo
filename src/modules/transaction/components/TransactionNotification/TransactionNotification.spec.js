import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import TransactionNotification from './TransactionNotification.vue';
import { i18n } from '@/config/i18n.js';

let wrapper = null;

function createWrapper(options = {}) {
    return mount(TransactionNotification, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('TransactionNotification', () => {
    it('should display transaction description', () => {
        wrapper = createWrapper({
            props: {
                description: 'tx description',
                transactionStatus: {
                    status: 'success',
                },
            },
        });

        expect(wrapper.text()).toContain('tx description');
    });

    it('should display transaction hash', () => {
        wrapper = createWrapper({
            props: {
                hash: '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
                description: 'tx description',
                transactionStatus: {
                    status: 'success',
                },
            },
        });

        expect(wrapper.text()).toContain(
            '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2'
        );
    });

    it('should display link to transaction detail in a fantom explorer', () => {
        wrapper = createWrapper({
            props: {
                hash: '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
                description: 'tx description',
                transactionStatus: {
                    status: 'success',
                },
            },
        });

        expect(wrapper.find('a').attributes('href')).toBe(
            'https://ftmscan.com/tx/0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2'
        );
    });

    it('should display link to transaction detail in a fantom explorer with hash given in tx status object', () => {
        wrapper = createWrapper({
            props: {
                description: 'tx description',
                transactionStatus: {
                    transactionHash:
                        '0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2',
                    status: 'success',
                },
            },
        });

        expect(wrapper.find('a').attributes('href')).toBe(
            'https://ftmscan.com/tx/0x39852eca227233345f541691124ad91d30800534035dea0e67a57627652acbb2'
        );
    });

    it('should display transaction status', () => {
        wrapper = createWrapper({
            props: {
                transactionStatus: {
                    status: 'success',
                },
                description: 'tx description',
            },
        });

        expect(wrapper.text()).toContain(i18n.t('common.transactionStatus.success'));
    });
});
