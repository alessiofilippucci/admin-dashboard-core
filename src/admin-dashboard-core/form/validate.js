import lodashMemoize from 'lodash/memoize';

/* eslint-disable no-underscore-dangle */
/* @link http://stackoverflow.com/questions/46155/validate-email-address-in-javascript */
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape
const TEL_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.\\\/]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/;
const IBAN_REGEX = /^(?:(?:IT|SM)[0-9]{2}[A-Za-z][0-9]{10}[0-9A-Za-z]{12}|CY\d{2}[A-Z]\d{23}|NL\d{2}[A-Z]{4}\d{10}|LV\d{2}[A-Z]{4}\d{13}|(?:BG|BH|GB|IE)\d{2}[A-Z]{4}\d{14}|GI\d{2}[A-Z]{4}\d{15}|RO\d{2}[A-Z]{4}\d{16}|KW\d{2}[A-Z]{4}\d{22}|MT\d{2}[A-Z]{4}\d{23}|NO\d{13}|(?:DK|FI|GL|FO)\d{16}|MK\d{17}|(?:AT|EE|KZ|LU|XK)\d{18}|(?:BA|HR|LI|CH|CR)\d{19}|(?:GE|DE|LT|ME|RS)\d{20}|IL\d{21}|(?:AD|CZ|ES|MD|SA)\d{22}|PT\d{23}|(?:BE|IS)\d{24}|(?:FR|MR|MC)\d{25}|(?:AL|DO|LB|PL)\d{26}|(?:AZ|HU)\d{27}|(?:GR|MU)\d{28})$/;

const isEmpty = (value) =>
    typeof value === 'undefined' ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);

const getMessage = (    message,    messageArgs,    value,    values) =>
    typeof message === 'function'
        ? message({
            args: messageArgs,
            value,
            values,
        })
        : messageArgs
            ? {
                message,
                args: messageArgs,
            }
            : message;

// If we define validation functions directly in JSX, it will
// result in a new function at every render, and then trigger infinite re-render.
// Hence, we memoize every built-in validator to prevent a "Maximum call stack" error.
const memoize = (fn) =>
    lodashMemoize(fn, (...args) => JSON.stringify(args));

const isFunction = value => typeof value === 'function';

// Compose multiple validators into a single one for use with final-form
export const composeValidators = (...validators) => async (
    value,
    values,
    meta
) => {
    const allValidators = (Array.isArray(validators[0])
        ? validators[0]
        : validators
    ).filter(isFunction);

    for (const validator of allValidators) {
        const error = await validator(value, values, meta);

        if (error) {
            return error;
        }
    }
};

// Compose multiple validators into a single one for use with final-form
export const composeSyncValidators = (...validators) => (
    value,
    values,
    meta
) => {
    const allValidators = (Array.isArray(validators[0])
        ? validators[0]
        : validators
    ).filter(isFunction);

    for (const validator of allValidators) {
        const error = validator(value, values, meta);

        if (error) {
            return error;
        }
    }
};

/**
 * Required validator
 *
 * Returns an error if the value is null, undefined, or empty
 *
 * @param {string|Function} message
 *
 * @example
 *
 * const titleValidators = [required('The title is required')];
 * <TextInput name="title" validate={titleValidators} />
 */
export const required = memoize((message = 'ra.validation.required') =>
    Object.assign(
        (value, values) =>
            isEmpty(value)
                ? getMessage(message, undefined, value, values)
                : undefined,
        { isRequired: true }
    )
);

/**
 * Minimum length validator
 *
 * Returns an error if the value has a length less than the parameter
 *
 * @param {integer} min
 * @param {string|Function} message
 *
 * @example
 *
 * const passwordValidators = [minLength(10, 'Should be at least 10 characters')];
 * <TextInput type="password" name="password" validate={passwordValidators} />
 */
export const minLength = memoize(
    (min, message = 'ra.validation.minLength') => (value, values) =>
        !isEmpty(value) && value.length < min
            ? getMessage(message, { min }, value, values)
            : undefined
);

/**
 * Maximum length validator
 *
 * Returns an error if the value has a length higher than the parameter
 *
 * @param {integer} max
 * @param {string|Function} message
 *
 * @example
 *
 * const nameValidators = [maxLength(10, 'Should be at most 10 characters')];
 * <TextInput name="name" validate={nameValidators} />
 */
export const maxLength = memoize(
    (max, message = 'ra.validation.maxLength') => (value, values) =>
        !isEmpty(value) && value.length > max
            ? getMessage(message, { max }, value, values)
            : undefined
);

/**
 * Minimum validator
 *
 * Returns an error if the value is less than the parameter
 *
 * @param {integer} min
 * @param {string|Function} message
 *
 * @example
 *
 * const fooValidators = [minValue(5, 'Should be more than 5')];
 * <NumberInput name="foo" validate={fooValidators} />
 */
export const minValue = memoize(
    (min, message = 'ra.validation.minValue') => (value, values) =>
        !isEmpty(value) && value < min
            ? getMessage(message, { min }, value, values)
            : undefined
);

/**
 * Maximum validator
 *
 * Returns an error if the value is higher than the parameter
 *
 * @param {integer} max
 * @param {string|Function} message
 *
 * @example
 *
 * const fooValidators = [maxValue(10, 'Should be less than 10')];
 * <NumberInput name="foo" validate={fooValidators} />
 */
export const maxValue = memoize(
    (max, message = 'ra.validation.maxValue') => (value, values) =>
        !isEmpty(value) && value > max
            ? getMessage(message, { max }, value, values)
            : undefined
);

/**
 * Number validator
 *
 * Returns an error if the value is not a number
 *
 * @param {string|Function} message
 *
 * @example
 *
 * const ageValidators = [number('Must be a number')];
 * <TextInput name="age" validate={ageValidators} />
 */
export const number = memoize(
    (message = 'ra.validation.number') => (value, values) =>
        !isEmpty(value) && isNaN(Number(value))
            ? getMessage(message, undefined, value, values)
            : undefined
);

/**
 * Regular expression validator
 *
 * Returns an error if the value does not match the pattern given as parameter
 *
 * @param {RegExp} pattern
 * @param {string|Function} message
 *
 * @example
 *
 * const zipValidators = [regex(/^\d{5}(?:[-\s]\d{4})?$/, 'Must be a zip code')];
 * <TextInput name="zip" validate={zipValidators} />
 */
export const regex = lodashMemoize(
    (pattern, message = 'ra.validation.regex') => (value, values) =>
        !isEmpty(value) && typeof value === 'string' && !pattern.test(value)
            ? getMessage(message, { pattern }, value, values)
            : undefined,
    (pattern, message) => {
        return pattern.toString() + message;
    }
);

/**
 * Email validator
 *
 * Returns an error if the value is not a valid email
 *
 * @param {string|Function} message
 *
 * @example
 *
 * const emailValidators = [email('Must be an email')];
 * <TextInput name="email" validate={emailValidators} />
 */
export const email = memoize((message = 'ra.validation.email') =>
    regex(EMAIL_REGEX, message)
);

const oneOfTypeMessage = ({ args }) => ({
    message: 'ra.validation.oneOf',
    args,
});

/**
 * Telephone validator
 *
 * Returns an error if the value is not a valid telephone number
 *
 * @param {string|Function} message
 *
 * @example
 *
 * const telValidators = [tel('Must be an tel')];
 * <TextInput name="tel" validate={telValidators} />
 */
export const tel = memoize((message = 'ra.validation.tel') =>
    regex(TEL_REGEX, message)
);

/**
 * IBAN validator
 *
 * Returns an error if the value is not a valid IBAN string
 *
 * @param {string|Function} message
 *
 * @example
 *
 * const telValidators = [tel('Must be an tel')];
 * <TextInput name="tel" validate={telValidators} />
 */
export const iban = memoize((message = 'ra.validation.iban') =>
    regex(IBAN_REGEX, message)
);

/**
 * Choices validator
 *
 * Returns an error if the value is not among the list passed as parameter
 *
 * @param {array} list
 * @param {string|Function} message
 *
 * @example
 *
 * const genderValidators = [choices(['male', 'female'], 'Must be either Male or Female')];
 * <TextInput name="gender" validate={genderValidators} />
 */
export const choices = memoize(
    (list, message = oneOfTypeMessage) => (value, values) =>
        !isEmpty(value) && list.indexOf(value) === -1
            ? getMessage(message, { list }, value, values)
            : undefined
);