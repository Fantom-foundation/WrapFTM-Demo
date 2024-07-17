function applyStyles(elem, styles) {
    Object.keys(styles).forEach((prop) => {
        elem.style[prop] = styles[prop];
    });
}

function findWebComponent(wcSelector) {
    const wcs = wcSelector.split('>');
    let wc = null;

    wcs.forEach((wcS) => {
        wc = (wc === null ? document : wc?.shadowRoot)?.querySelector(wcS);
    });

    return wc;
}

/**
 * @param {string} wcSelector
 * @param {Object<string, Object>} styles
 */
export function styleWebComponent(wcSelector, styles) {
    const wc = findWebComponent(wcSelector);

    if (!wc) {
        throw new Error(`Can't find web component '${wcSelector}'`);
    }

    if (!wc.shadowRoot) {
        throw new Error(`'${wcSelector}' is not a web component`);
    }

    Object.keys(styles).forEach((selector) => {
        if (selector === 'root') {
            applyStyles(wc, styles[selector]);
        } else {
            const elems = wc.shadowRoot.querySelectorAll(selector);

            if (elems.length > 0) {
                elems.forEach((elem) => {
                    applyStyles(elem, styles[selector]);
                });
            } else {
                console.warn(`Can't find element(s) '${selector}'`);
            }
        }
    });
}
