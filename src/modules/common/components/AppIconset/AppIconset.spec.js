import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import AppIconset from '@/modules/common/components/AppIconset/AppIconset.vue';
import { useAppIconset } from '@/modules/common/components/AppIconset/useAppIconset/useAppIconset.js';

let wrapper = null;
const IconTest = {
    template: `<svg width="14" height="14" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1H13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};
const ICONSET = {
    IconTest,
};

function createWrapper(options = {}) {
    return mount(AppIconset, options);
}

beforeAll(() => {
    const { setIconset } = useAppIconset();

    setIconset(ICONSET);
});

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('AppIconset', () => {
    it('should display icon from given iconset', () => {
        wrapper = createWrapper({
            props: {
                icon: 'test',
            },
        });

        expect(wrapper.findComponent(IconTest).exists()).toBe(true);
    });

    it('should add aria label to svg', () => {
        wrapper = createWrapper({
            props: {
                ariaLabel: 'foo',
                icon: 'test',
            },
        });

        expect(wrapper.find('svg').attributes('aria-label')).toBe('foo');
    });

    /*it.skip('should throw an error if given icon is not found', () => {
        expect(() => {
            createWrapper({
                props: {
                    icon: 'foo',
                },
            });
        }).toThrowError();
    });

    it.skip('should throw an error if no iconset is set', () => {
        const { setIconset } = useAppIconset();
        setIconset(null);

        expect(() => {
            createWrapper({
                props: {
                    icon: 'test',
                },
            });
        }).toThrowError();
    });*/
});
