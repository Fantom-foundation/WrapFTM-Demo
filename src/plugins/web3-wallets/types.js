/**
 * SignedTransaction object
 * @typedef {Object} SignedTransaction
 * @property {string} rawTransaction
 * @property {string} transactionHash
 */

/**
 * WalletTransactionStatus
 * @typedef {('success'|'rejected'|'error')} WalletTransactionStatus
 */

/**
 * TransactionHash
 * @typedef {string} TransactionHash
 */

/**
 * WalletSignTransactionData object
 * @typedef {Object} WalletSignTransactionData
 * @property {WalletTransactionStatus} status
 * @property {SignedTransaction|Error|null} data
 */

/**
 * WalletSendTransactionData object
 * @typedef {Object} WalletSendTransactionData
 * @property {WalletTransactionStatus} status
 * @property {TransactionHash|Error|null} data
 */
