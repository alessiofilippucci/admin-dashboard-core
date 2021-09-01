import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { useInput, FieldTitle, Utils } from 'admin-dashboard-core';

import InputHelperText from './InputHelperText';
import sanitizeInputRestProps from './sanitizeInputRestProps';
import classNames from 'classnames';

const convertStringToNumber = value => {
    const float = parseFloat(value);

    return isNaN(float) ? null : float;
};

/**
 * An Input component for a number
 *
 * @example
 * <NumberInput source="nb_views" />
 *
 * You can customize the `step` props (which defaults to "any")
 * @example
 * <NumberInput source="nb_views" step={1} />
 *
 * The object passed as `options` props is passed to the material-ui <TextField> component
 */
const NumberInput = ({
    format,
    helperText,
    label,
    margin = 'dense',
    onBlur,
    onFocus,
    onChange,
    options,
    parse = convertStringToNumber,
    resource,
    source,
    step,
    min,
    max,
    validate,
    variant = 'filled',
    inputProps: overrideInputProps,
    InputProps: OverrideInputProps,
    rowIndex,
    hideError,
    validClasses,
    notValidClasses,
    ...rest
}) => {
    const {
        id,
        input,
        isRequired,
        meta: { error, touched },
    } = useInput({
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        type: 'number',
        validate,
        ...rest,
    });

    let validationClass = '';

    if (Utils.IsNumber(input.value) && input.value !== 0) {
        if (!Utils.IsEmpty(min) && input.value < min || !Utils.IsEmpty(max) && input.value > max) {
            validationClass = notValidClasses;
        }
        else {
            validationClass = validClasses;
        }
    }

    const inputProps = { ...overrideInputProps, step, min, max, };
    const InputProps = {
        ...OverrideInputProps, classes: {
            root: validationClass
        }
    };

    return (
        <TextField
            id={id}
            {...input}
            variant={variant}
            error={!!(touched && error)}
            helperText={
                !hideError && <InputHelperText
                    touched={touched}
                    error={error}
                    helperText={helperText}
                />
            }
            label={
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            }
            margin={margin}
            inputProps={inputProps}
            InputProps={InputProps}
            {...options}
            {...sanitizeInputRestProps(rest)}
        />
    );
};

NumberInput.propTypes = {
    label: PropTypes.string,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hideError: PropTypes.bool,
    validClasses: PropTypes.string,
    notValidClasses: PropTypes.string,
};

NumberInput.defaultProps = {
    options: {},
    step: 'any',
    textAlign: 'right',
    hideError: false,
    validClasses: '',
    notValidClasses: ''
};

export default NumberInput;
