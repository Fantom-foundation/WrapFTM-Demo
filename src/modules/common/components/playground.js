import AddressFieldPlayground from './AddressField/AddressFieldPlayground.vue';
import TokenAmountFieldPlayground from './TokenAmountField/TokenAmountFieldPlayground.vue';
import TransactionStatusPlayground from './TransactionStatus/TransactionStatusPlayground.vue';

export default [
    { label: 'AddressField', component: { AddressFieldPlayground } },
    { label: 'TokenAmountField', component: { TokenAmountFieldPlayground } },
    { label: 'TransactionStatus', component: { TransactionStatusPlayground } },
];
