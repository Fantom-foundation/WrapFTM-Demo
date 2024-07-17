/**
 * @typedef {WalletApiQueries, AccountsApiQueries, BlocksApiQueries, CommonApiQueries} FApiQueries
 */

/**
 * @typedef {CommonApiMutations} FApiMutations
 */

/**
 * Web3 wallet object
 * @typedef {Object} Wb3
 * @property {string} name
 * @property {Class} clas
 * @property {string} [label]
 * @property {string} [icon] Icon from AppIconset
 */

/**
 * Token object
 * @typedef {Object} Token
 * @property {string} symbol
 * @property {string} name
 * @property {number} decimals
 * @property {string} [logo]
 * @property {string} [address]
 */

/**
 * AppNodeMeta object
 * @typedef {Object} AppNodeMeta
 * @property {string} [title] Page title. Property name of Vue i18n translations object
 * @property {string} [description] Page description. Property name of Vue i18n translations object
 * @property {function({ to: Object, title: string })} [getTitle] Should return page title
 */

/**
 * AppNode object
 * @typedef {Object} AppNode
 * @property {string} name Unique route or component name
 * @property {string} [path] Route path
 * @property {function} [component]
 * @property {AppNodeMeta} [meta]
 * @property {AppNode[]} [_c] Children
 */
