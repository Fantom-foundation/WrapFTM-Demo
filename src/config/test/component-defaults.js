import { setUpComponentDefaults } from '@/config/component-defaults.js';
import { fLinkPropDefaults } from 'fantom-vue3-components/src/components/FLink/prop-defaults.js';

function setUpTestComponentDefaults() {
    setUpComponentDefaults();

    fLinkPropDefaults.hrefs = {
        transaction(props) {
            return new URL(props.hash || props.text, 'https://ftmscan.com/tx/').href;
        },
        address(props) {
            return new URL(props.address || props.text, 'https://ftmscan.com/address/')
                .href;
        },
    };
}

setUpTestComponentDefaults();
