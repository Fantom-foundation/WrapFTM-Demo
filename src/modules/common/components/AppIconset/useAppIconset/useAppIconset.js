import { lowercaseFirstChar } from 'fantom-vue3-components';

let _iconset = null;

export function useAppIconset() {
    function setIconset(iconset = {}) {
        _iconset = iconset;
    }

    function getIconset() {
        return _iconset;
    }

    function getIconNames() {
        return Object.keys(_iconset).map((iconName) =>
            lowercaseFirstChar(iconName.replace('Icon', ''))
        );
    }

    return {
        setIconset,
        getIconset,
        getIconNames,
    };
}
