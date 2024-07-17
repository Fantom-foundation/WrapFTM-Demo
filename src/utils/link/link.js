const urlRegExp =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;

function objToAttrs(attributes) {
    return Object.keys(attributes)
        .map((key) => `${key}="${attributes[key]}"`)
        .join(' ');
}

export function createLinksInText(text, attributes = {}) {
    const matches = [];
    let sIdx = 0;
    const slices = [];

    urlRegExp.lastIndex = -1;

    let match = urlRegExp.exec(text);

    while (match !== null) {
        matches.push({ text: match[0], index: match.index });
        match = urlRegExp.exec(text);
    }

    if (matches.length > 0) {
        const attrs = objToAttrs(attributes);
        const linkTemplate = `<a href="URL"${
            attrs.length > 0 ? ` ${attrs}` : ''
        }>URL</a>`;

        for (let i = 0, len = matches.length; i < len; i++) {
            match = matches[i];

            if (i === 0) {
                slices.push(text.slice(sIdx, match.index));
                sIdx = match.index;
            }

            if (i + 1 < len) {
                slices.push(
                    text
                        .slice(sIdx, matches[i + 1].index)
                        .replace(match.text, linkTemplate.replace(/URL/g, match.text))
                );
            } else {
                slices.push(
                    text
                        .slice(match.index)
                        .replace(match.text, linkTemplate.replace(/URL/g, match.text))
                );
            }
        }
    }

    return {
        text: slices.length > 0 ? slices.join('') : text,
        urlFound: matches.length > 0,
    };
}
