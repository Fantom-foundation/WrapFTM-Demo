import GasFieldsPlayground from './GasFields/GasFieldsPlayground.vue';
import MaxFeePlayground from './MaxFee/MaxFeePlayground.vue';
import SendTransactionFormPlayground from './SendTransactionForm/SendTransactionFormPlayground.vue';
import TransactionNotificationPlayground from './TransactionNotification/TransactionNotificationPlayground.vue';
import TransactionNotificationsPlayground from './TransactionNotifications/TransactionNotificationsPlayground.vue';
import RecentTransactionListPlayground from './RecentTransactionList/RecentTransactionListPlayground.vue';
import RecentTransactionListButtonPlayground from './RecentTransactionListButton/RecentTransactionListButtonPlayground.vue';

export default [
    { label: 'GasFields', component: { GasFieldsPlayground } },
    { label: 'MaxFee', component: { MaxFeePlayground } },
    {
        label: 'SendTransactionForm',
        component: { SendTransactionFormPlayground },
    },
    {
        label: 'TransactionNotification',
        component: { TransactionNotificationPlayground },
    },
    {
        label: 'TransactionNotifications',
        component: { TransactionNotificationsPlayground },
    },
    {
        label: 'RecentTransactionList',
        component: { RecentTransactionListPlayground },
    },
    {
        label: 'RecentTransactionListButton',
        component: { RecentTransactionListButtonPlayground },
    },
];
