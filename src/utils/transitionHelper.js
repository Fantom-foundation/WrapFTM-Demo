/**
 * Code taken from: https://developer.chrome.com/docs/web-platform/view-transitions/
 * Current view transitions api support: https://caniuse.com/?search=view%20transitions
 *
 * @param {boolean} skipTransition
 * @param {array} classNames
 * @param {function} updateDOM
 * @return {{updateCallbackDone: Promise<unknown>, ready: Promise<never>, skipTransition: skipTransition, finished: Promise<unknown>}|*}
 */
export function transitionHelper({ skipTransition = false, classNames = [], updateDOM }) {
    if (skipTransition || !document.startViewTransition) {
        const updateCallbackDone = Promise.resolve(updateDOM()).then(() => {});
        const ready = Promise.reject(Error('View transitions unsupported'));

        // Avoid spamming the console with this error unless the promise is used.
        ready.catch(() => {});

        return {
            ready,
            updateCallbackDone,
            finished: updateCallbackDone,
            skipTransition: () => {},
        };
    }

    document.documentElement.classList.add(...classNames);

    const transition = document.startViewTransition(updateDOM);

    transition.finished.finally(() =>
        document.documentElement.classList.remove(...classNames)
    );

    return transition;
}
