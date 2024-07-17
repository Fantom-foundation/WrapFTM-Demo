/**
 * Account object
 * @typedef {Object} Account
 * @property {string} address
 * @property {string} walletName
 * @property {Object} [keystoreFile]
 */

/**
 * AccountsStore object
 * @typedef {Object} AccountsStore
 * @property {Account[]} accounts
 * @property {string} activeAccountAddress
 */

/**
 * RemoveAccountConfirmationButtonAction object
 * @typedef {Object} RemoveAccountConfirmationButtonAction
 * @property {'remove'|'cancel'} action
 * @property {string} [address]
 */
