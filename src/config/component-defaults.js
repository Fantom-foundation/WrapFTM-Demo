import { tokenAmountFieldPropDefaults as tokenAmountField } from '@/modules/common/components/TokenAmountField/prop-defaults.js';
import { fLinkPropDefaults } from 'fantom-vue3-components/src/components/FLink/prop-defaults.js';
import { getAddressUrl, getTransactionUrl } from '@/utils/url/url.js';
// import { fWindowPropDefaults } from 'fantom-vue3-components/src/components/FWindow/prop-defaults.js';

export function setUpComponentDefaults() {
    tokenAmountField.fieldSize = 'large';
    tokenAmountField.clas = 'input-w100';
    tokenAmountField.balanceTokenProps = { usePlaceholder: true };

    fLinkPropDefaults.hrefs = {
        transaction(props) {
            return getTransactionUrl(props.hash || props.text);
        },
        address(props) {
            return getAddressUrl(props.address || props.text);
        },
    };

    // fWindowPropDefaults.animationIn = '';
    // fWindowPropDefaults.withOverlay = false;
}

setUpComponentDefaults();
