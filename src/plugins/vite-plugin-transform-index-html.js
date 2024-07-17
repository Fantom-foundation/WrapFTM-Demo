export function vitePluginTransformIndexHtml(tokens = {}) {
    return {
        name: 'vite-plugin-transform-index-html',
        transformIndexHtml(html) {
            Object.keys(tokens).forEach((token) => {
                html = html.replace(
                    new RegExp(`{{\\s*${token.toUpperCase()}\\s*}}`, 'g'),
                    tokens[token]
                );
            });

            return html;
        },
    };
}
