import { adjustToken, adjustTokens, tokenHasSymbol } from '@/utils/token/token.js';

describe('token utils', () => {
    const SYMBOLS_TO_ADJUST = ['wftm', 'fusd'];
    const LOGOS_TO_ADJUST = {
        wftm: 'wftm logo',
        fusd: 'fusd logo',
    };

    describe('tokenHasSymbol()', () => {
        it('should return `false` if token is not an object', () => {
            expect(tokenHasSymbol('foo', 'ftm')).toBe(false);
        });

        it('should return `false` if token has no "symbol" property', () => {
            expect(tokenHasSymbol({}, 'ftm')).toBe(false);
        });

        it('should return `true` if token has symbol property and no symbol is given', () => {
            expect(tokenHasSymbol({ symbol: 'FTM' })).toBe(true);
        });

        it('should return `true` if token has given symbol', () => {
            expect(tokenHasSymbol({ symbol: 'FTM' }, 'ftm')).toBe(true);
            expect(tokenHasSymbol({ symbol: 'wFTM' }, 'WFTM')).toBe(true);
        });
    });

    describe('adjustToken()', () => {
        function TOKEN() {
            return {
                symbol: 'WFTM',
            };
        }

        it('should adjust symbol of certain token', () => {
            const token = TOKEN();

            adjustToken({
                token,
                symbolsToAdjust: SYMBOLS_TO_ADJUST,
                logosToAdjust: LOGOS_TO_ADJUST,
            });

            expect(token.symbol).toBe('wFTM');
        });

        it('should adjust logoURL of certain token', () => {
            const token = TOKEN();

            adjustToken({
                token,
                symbolsToAdjust: SYMBOLS_TO_ADJUST,
                logosToAdjust: LOGOS_TO_ADJUST,
            });

            expect(token.logoURL).toBe('wftm logo');
        });

        it('should add missing properties', () => {
            const token = TOKEN();

            adjustToken({
                token,
                addMissingProperties: {
                    decimals: 18,
                    logo: 'foo_logo',
                },
            });

            expect(token.logo).toBe('foo_logo');
            expect(token.decimals).toBe(18);
        });

        it('should map properties', () => {
            const token = { icon_url: 'imgurl', foo: 'FOO', foo2: '' };

            adjustToken({
                token,
                mapProperties: {
                    icon_url: 'logo',
                    foo2: 'foo',
                },
            });

            expect(token.icon_url).toBeUndefined();
            expect(token.logo).toBe('imgurl');
            expect(token.foo2).toBeUndefined();
            expect(token.foo).toBe('FOO');
        });
    });

    describe('adjustTokens()', () => {
        function TOKENS() {
            return [{ symbol: 'WFTM' }, { symbol: 'FUSD' }];
        }

        it('should adjust symbols and logos of certain tokens', () => {
            const tokens = TOKENS();

            adjustTokens({
                tokens,
                symbolsToAdjust: SYMBOLS_TO_ADJUST,
                logosToAdjust: LOGOS_TO_ADJUST,
            });

            expect(tokens).toEqual([
                { symbol: 'wFTM', logoURL: 'wftm logo' },
                { symbol: 'fUSD', logoURL: 'fusd logo' },
            ]);
        });

        it('should add missing properties', () => {
            const tokens = TOKENS();

            adjustTokens({
                tokens,
                addMissingProperties: {
                    decimals: 18,
                },
            });

            expect(tokens).toEqual([
                { symbol: 'WFTM', decimals: 18 },
                { symbol: 'FUSD', decimals: 18 },
            ]);
        });

        it('should map properties', () => {
            const tokens = TOKENS();

            adjustTokens({
                tokens,
                mapProperties: {
                    symbol: 'sbl',
                },
            });

            expect(tokens).toEqual([{ sbl: 'WFTM' }, { sbl: 'FUSD' }]);
        });
    });
});
