import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import TransactionStatus from './TransactionStatus.vue';
import { i18n } from '@/config/i18n.js';

let wrapper = null;

function createWrapper(options = {}) {
    return mount(TransactionStatus, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('TransactionStatus', () => {
    it('should display "pending" text', () => {
        wrapper = createWrapper({
            props: {
                status: 'pending',
            },
        });

        const text = wrapper.findByTestId('transactionstatus_text');
        expect(text.text()).toContain(i18n.t('common.transactionStatus.pending'));
        expect(text.element.className).not.toContain('not-visible');
    });

    it('should display "success" text', () => {
        wrapper = createWrapper({
            props: {
                status: 'success',
            },
        });

        const text = wrapper.findByTestId('transactionstatus_text');
        expect(text.text()).toContain(i18n.t('common.transactionStatus.success'));
        expect(text.element.className).not.toContain('not-visible');
    });

    it('should display "error" text', () => {
        wrapper = createWrapper({
            props: {
                status: 'error',
            },
        });

        const text = wrapper.findByTestId('transactionstatus_text');
        expect(text.text()).toContain(i18n.t('common.transactionStatus.error'));
        expect(text.element.className).not.toContain('not-visible');
    });

    it('should display "rejected" text', () => {
        wrapper = createWrapper({
            props: {
                status: 'rejected',
            },
        });

        const text = wrapper.findByTestId('transactionstatus_text');
        expect(text.text()).toContain(i18n.t('common.transactionStatus.rejected'));
        expect(text.element.className).not.toContain('not-visible');
    });

    it('should pass props to icon', () => {
        wrapper = createWrapper({
            props: {
                iconProps: { size: '20px' },
                status: 'pending',
            },
        });

        expect(wrapper.findComponent({ name: 'FSvgIcon' }).vm.$props.size).toBe('20px');
    });

    it('should add `data-status` attribute to the container', () => {
        wrapper = createWrapper({
            props: {
                status: 'pending',
            },
        });

        expect(wrapper.attributes('data-status')).toBe('pending');
    });

    it('should display icon', () => {
        wrapper = createWrapper({
            props: {
                status: 'success',
            },
        });

        expect(wrapper.findByTestId('transactionstatus_icon').exists()).toBe(true);
    });

    it('should add title attribute to icon', () => {
        wrapper = createWrapper({
            props: {
                status: 'success',
            },
        });

        expect(wrapper.findByTestId('transactionstatus_icon').attributes('title')).toBe(
            i18n.t('common.transactionStatus.success')
        );
    });

    it('should not display icon if `noIcon` option is set', () => {
        wrapper = createWrapper({
            props: {
                noIcon: true,
                status: 'error',
            },
        });

        expect(wrapper.findByTestId('transactionstatus_icon').exists()).toBe(false);
    });

    it('should hide "pending" text if `noText` option is set', () => {
        wrapper = createWrapper({
            props: {
                noText: true,
                status: 'rejected',
            },
        });

        expect(
            wrapper.findByTestId('transactionstatus_text').element.className
        ).toContain('not-visible');
    });
});
