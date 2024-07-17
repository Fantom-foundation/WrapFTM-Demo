import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import FLog from './FLog.vue';
import { Log } from './Log.js';
import { nextTick } from 'vue';

let wrapper = null;

function createWrapper(options = {}) {
    return mount(FLog, options);
}

beforeEach(() => {
    Log.clear();
});

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('FLog', () => {
    it('should add text to the log', async () => {
        wrapper = createWrapper();

        Log.push('foo');
        Log.push('boo');

        await nextTick();

        expect(wrapper.text()).toContain('foo\nboo');
    });

    it('should clear the log', async () => {
        wrapper = createWrapper();

        Log.push('foo');
        Log.push('boo');

        Log.clear();

        await nextTick();

        expect(wrapper.text()).toEqual('');
    });
});
