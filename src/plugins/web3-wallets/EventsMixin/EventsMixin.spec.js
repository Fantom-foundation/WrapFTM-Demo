import { vi } from 'vitest';
import { EventsMixin } from './EventsMixin.js';

class TestClass extends EventsMixin() {}

let instance = null;

beforeEach(() => {
    instance = new TestClass();
});

afterEach(() => {
    instance = null;
});

describe('EventsMixin', () => {
    it('should set events listener', () => {
        instance.setEventsListener(() => {});

        expect(instance.isAListenerSet()).toBe(true);
    });

    it('should throw an error if events listener is not a function', () => {
        expect(() => {
            instance.setEventsListener('foo');
        }).toThrowError();
    });

    it('should trigger an event', async () => {
        const listener = vi.fn(() => {});
        instance.setEventsListener(listener);

        const EVENT = {
            name: 'foo_event',
            data: 'foo',
        };

        await instance.triggerEvent(EVENT);

        expect(listener).toBeCalledWith(EVENT);
    });

    it('should await given promise after trigger of an event is done', async () => {
        instance.setEventsListener((event) => {
            event.waitFor.push(
                new Promise((resolve) => {
                    resolve('resolved');
                })
            );
        });

        await expect(instance.triggerEvent({ name: 'foo_event' })).resolves.toEqual([
            'resolved',
        ]);
    });

    it('should remove all event listeners', () => {
        instance.setEventsListener(() => {});
        instance.setEventsListener(() => {});

        instance.removeAllListeners();

        expect(instance.isAListenerSet()).toBe(false);
    });
});
