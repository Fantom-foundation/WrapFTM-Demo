/**
 * @param {number|string} amount
 * @param {number|string} maxAmount
 * @param {string} maxAmountErrorMessage
 * @param {string} invalidAmountErrorMessage
 * @return {string}
 */
export function amountValidator({
    amount,
    maxAmount,
    maxAmountErrorMessage,
    invalidAmountErrorMessage,
}) {
    const value = Number(amount);
    let errorMessage = '';

    if (isNaN(amount) || amount === '' || value < 0) {
        errorMessage = invalidAmountErrorMessage;
    } else if (value > Number(maxAmount)) {
        errorMessage = maxAmountErrorMessage;
    }

    return errorMessage;
}
