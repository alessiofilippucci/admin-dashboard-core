import * as React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { composeValidators } from './validate';

export const isRequired = validate => {
    if (validate && validate.isRequired) {
        return true;
    }
    if (Array.isArray(validate)) {
        return !!validate.find(it => it.isRequired);
    }
    return false;
};

const FormField = ({
    id,
    input,
    validate,
    ...props
}) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('FormField is deprecated, use the useInput hook instead.');
    }

    const sanitizedValidate = Array.isArray(validate)
        ? composeValidators(validate)
        : validate;

    const finalId = id || props.source;

    return input ? ( // An ancestor is already decorated by Field
        React.createElement(props.component, { input, id: finalId, ...props })
    ) : (
        <Field
            {...props}
            id={finalId}
            name={props.source}
            isRequired={isRequired(validate)}
            validate={sanitizedValidate}
        />
    );
};

FormField.propTypes = {
    defaultValue: PropTypes.any,
    source: PropTypes.string,
    validate: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
};

export default FormField;
