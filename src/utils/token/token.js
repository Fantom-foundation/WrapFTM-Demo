import { lowercaseFirstChar } from 'fantom-vue3-components';

/*
const SYMBOLS_TO_ADJUST = ['wftm', 'fusd'];
const LOGOS_TO_ADJUST = {
    ftm: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Ccircle fill='%231969FF' cx='16' cy='16' r='16'/%3E%3Cpath d='M14.5 4.1c.6-.3 1.5-.3 2.1 0l6.2 3.3c.4.1.6.4.6.7v16.3c0 .3-.2.6-.5.8l-6.2 3.3c-.6.3-1.5.3-2.1 0l-6.2-3.3c-.4-.2-.6-.5-.6-.8V8.1c0-.4.2-.6.5-.8L14.6 4Zm8 13-5.8 3.1c-.6.3-1.5.4-2.1 0l-5.8-3v7.2l5.9 3c.3.2.5.3.8.3h.1c.3 0 .6 0 .8-.2l.2-.1 5.9-3v-7.2ZM6.4 24.5c0 .6 0 1 .2 1.3.1.3.3.4.6.6v.1h.2v.1h.1l.1.1.4.2-.5.9-.4-.3-.2-.1h-.1v-.1c-1-.6-1.3-1.3-1.4-2.7h1Zm8.7-11.6H15l-6.2 3.3 6.2 3.3h.1v-6.6Zm1 0v6.6h.1l6.2-3.3-6.2-3.2h-.1Zm6.4-3.5-5.6 2.9 5.6 2.9V9.3Zm-13.7 0V15l5.5-3-5.5-2.8ZM16.2 5c-.3-.2-.8-.2-1.2 0L8.8 8.2l6.2 3.3h1.2l6.2-3.3L16.2 5Zm7.6 0 .3.2h.2v.1l.2.1c1 .6 1.3 1.3 1.3 2.7h-1c0-.5 0-1-.2-1.2-.1-.3-.3-.4-.6-.6v-.1h-.1l-.1-.1-.2-.1-.4-.2.6-.9Z' stroke='%23FFF' stroke-width='.6' fill='%23FFF' fill-rule='nonzero'/%3E%3C/g%3E%3C/svg%3E",
    wftm: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Ccircle fill='%23F5F5F5' cx='16' cy='16' r='16'/%3E%3Cpath d='M14.5 4.1c.6-.3 1.5-.3 2.1 0l6.2 3.3c.4.1.6.4.6.7v16.3c0 .3-.2.6-.5.8l-6.2 3.3c-.6.3-1.5.3-2.1 0l-6.2-3.3c-.4-.2-.6-.5-.6-.8V8.1c0-.4.2-.6.5-.8L14.6 4Zm8 13-5.8 3.1c-.6.3-1.5.4-2.1 0l-5.8-3v7.2l5.9 3c.3.2.5.3.8.3h.1c.3 0 .6 0 .8-.2l.2-.1 5.9-3v-7.2ZM6.4 24.5c0 .6 0 1 .2 1.3.1.3.3.4.6.6v.1h.2v.1h.1l.1.1.4.2-.5.9-.4-.3-.2-.1h-.1v-.1c-1-.6-1.3-1.3-1.4-2.7h1Zm8.7-11.6H15l-6.2 3.3 6.2 3.3h.1v-6.6Zm1 0v6.6h.1l6.2-3.3-6.2-3.2h-.1Zm6.4-3.5-5.6 2.9 5.6 2.9V9.3Zm-13.7 0V15l5.5-3-5.5-2.8ZM16.2 5c-.3-.2-.8-.2-1.2 0L8.8 8.2l6.2 3.3h1.2l6.2-3.3L16.2 5Zm7.6 0 .3.2h.2v.1l.2.1c1 .6 1.3 1.3 1.3 2.7h-1c0-.5 0-1-.2-1.2-.1-.3-.3-.4-.6-.6v-.1h-.1l-.1-.1-.2-.1-.4-.2.6-.9Z' fill='%231969FF' fill-rule='nonzero'/%3E%3C/g%3E%3C/svg%3E",
    fusd: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cg stroke='none' stroke-width='1' fill='%231969FF' fill-rule='evenodd'%3E%3Cpath d='M29.8 13.4h2a16 16 0 0 1-24.5 16 73 73 0 0 0 1.6-2.7 12.9 12.9 0 0 0 19.8-13.3h1.1Zm-5-10.8A73 73 0 0 0 23 5.3 12.9 12.9 0 0 0 3.3 18.6H.2a16 16 0 0 1 24.5-16Z'/%3E%3Cpath d='M16.2 11c1.9 0 3 .5 3.7.7l.7-2.8c-.8-.4-2-.7-3.6-.8V5.9h-2.5v2.4c-2.7.5-4.2 2.2-4.2 4.4 0 2.4 1.8 3.7 4.5 4.6 1.9.6 2.7 1.2 2.7 2.1 0 1-1 1.6-2.5 1.6-1.6 0-3.1-.6-4.1-1l-.8 2.8c1 .6 2.6 1 4.3 1.1v2.4H17v-2.6c3-.4 4.5-2.4 4.5-4.6 0-2.2-1.2-3.6-4.2-4.7-2.2-.7-3-1.3-3-2.1-.1-.7.4-1.4 2-1.4Z'/%3E%3C/g%3E%3C/svg%3E",
};
*/

/**
 * Check if token contains given symbol
 *
 * @param {Object} token
 * @param {string} [symbol]
 * @return {boolean}
 */
export function tokenHasSymbol(token, symbol = '') {
    const tokenSymbol = token?.symbol;
    let hasSymbol = false;

    if (tokenSymbol) {
        if (symbol !== '') {
            hasSymbol = tokenSymbol.toLowerCase() === symbol.toLowerCase();
        } else {
            hasSymbol = true;
        }
    }

    return hasSymbol;
}

/**
 * Adjust symbol and logoURL of certain token
 *
 * @param {Object} token
 * @param {Object|null} addMissingProperties
 * @param {Object|null} mapProperties
 * @param {array} [symbolsToAdjust]
 * @param {Object} [logosToAdjust]
 */
export function adjustToken({
    token,
    addMissingProperties = null,
    mapProperties = null,
    symbolsToAdjust = [],
    logosToAdjust = [],
}) {
    const symbol = token.symbol?.toLowerCase();

    if (addMissingProperties) {
        Object.keys(addMissingProperties).forEach((key) => {
            if (!(key in token)) {
                token[key] = addMissingProperties[key];
            }
        });
    }

    if (symbolsToAdjust.includes(symbol)) {
        token.symbol = lowercaseFirstChar(token.symbol);
    }

    if (symbol in logosToAdjust) {
        token.logoURL = logosToAdjust[symbol];
    }

    if (mapProperties) {
        Object.keys(mapProperties).forEach((from) => {
            if (from in token) {
                if (token[from] !== '') {
                    token[mapProperties[from]] = token[from];
                }
                delete token[from];
            }
        });
    }
}

/**
 * Adjust symbols and logoURLs of certain tokens
 *
 * @param {array} tokens
 * @param {Object|null} addMissingProperties
 * @param {Object|null} mapProperties
 * @param {array} [symbolsToAdjust]
 * @param {Object} [logosToAdjust]
 */
export function adjustTokens({
    tokens,
    addMissingProperties = null,
    mapProperties = null,
    symbolsToAdjust = [], //SYMBOLS_TO_ADJUST,
    logosToAdjust = [], // LOGOS_TO_ADJUST
}) {
    tokens.forEach((token) =>
        adjustToken({
            token,
            addMissingProperties,
            mapProperties,
            symbolsToAdjust,
            logosToAdjust,
        })
    );
}
