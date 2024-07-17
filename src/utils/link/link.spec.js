import { createLinksInText } from './link.js';

describe('link', () => {
    describe('createLinksInText()', () => {
        it('should return given text if no url is found', () => {
            expect(createLinksInText('Lorem ipsum dolor sit')).toEqual({
                text: 'Lorem ipsum dolor sit',
                urlFound: false,
            });
        });

        it('should create <a> elements around urls in the given text', () => {
            createLinksInText('https://ipsum.com:8000/foo/boo.php?s=1');
            expect(createLinksInText('https://ipsum.com:8000/foo/boo.php?s=1')).toEqual({
                text: '<a href="https://ipsum.com:8000/foo/boo.php?s=1">https://ipsum.com:8000/foo/boo.php?s=1</a>',
                urlFound: true,
            });

            expect(
                createLinksInText(
                    'Lorem https://ipsum.com:8000/foo/boo.php?s=1 https://dolor.org sit'
                )
            ).toEqual({
                text: 'Lorem <a href="https://ipsum.com:8000/foo/boo.php?s=1">https://ipsum.com:8000/foo/boo.php?s=1</a> <a href="https://dolor.org">https://dolor.org</a> sit',
                urlFound: true,
            });
        });

        it('should create <a> elements with custom attributes in the given text', () => {
            expect(
                createLinksInText('Lorem https://ipsum.com', {
                    target: '_blank',
                    class: 'foo',
                })
            ).toEqual({
                text: 'Lorem <a href="https://ipsum.com" target="_blank" class="foo">https://ipsum.com</a>',
                urlFound: true,
            });
        });
    });
});
