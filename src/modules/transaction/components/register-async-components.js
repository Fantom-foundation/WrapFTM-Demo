import { AsyncComponents } from 'fantom-vue3-components';
import { defineAsyncComponent } from 'vue';

AsyncComponents.registerComponents({
    RecentTransactionListButton: defineAsyncComponent(
        () => import('./RecentTransactionListButton/RecentTransactionListButton.vue')
    ),
    TransactionNotifications: defineAsyncComponent(
        () => import('./TransactionNotifications/TransactionNotifications.vue')
    ),
});
