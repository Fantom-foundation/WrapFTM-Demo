/**
 * @param {*} value
 * @param {string} errorMessage
 * @return {string}
 */
export function greaterThanZeroValidator(value, errorMessage) {
    const val = Number(value);
    let errMessage = '';

    if (isNaN(value) || value === '' || val <= 0) {
        errMessage = errorMessage;
    }

    return errMessage;
}
