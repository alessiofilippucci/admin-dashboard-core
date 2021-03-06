import {
    useField as useFinalFormField,
} from 'react-final-form';
import { composeValidators } from './validate';
import isRequired from './isRequired';
import { useCallback, useEffect } from 'react';
import { useFormGroupContext } from './useFormGroupContext';
import { useFormContext } from './useFormContext';

const useInput = ({
    defaultValue,
    initialValue,
    id,
    name,
    source,
    validate,
    onBlur: customOnBlur,
    onChange: customOnChange,
    onFocus: customOnFocus,
    isRequired: isRequiredOption,
    ...options
}) => {
    //console.log(options)
    const finalName = name || source || "";
    const formGroupName = useFormGroupContext();
    const formContext = useFormContext();

    useEffect(() => {
        if (!formContext || !formGroupName) {
            return;
        }
        formContext.registerField(source, formGroupName);

        return () => {
            formContext.unregisterField(source, formGroupName);
        };
    }, [formContext, formGroupName, source]);
    

    const sanitizedValidate = Array.isArray(validate)
        ? composeValidators(validate)
        : validate;

    const { input, meta } = useFinalFormField(finalName, {
        initialValue: initialValue || defaultValue,
        validate: sanitizedValidate,
        ...options,
    });

    // Extract the event handlers so that we can provide ours
    // allowing users to provide theirs without breaking the form
    const { onBlur, onChange, onFocus, ...inputProps } = input;

    const handleBlur = useCallback(
        event => {
            onBlur(event);

            if (typeof customOnBlur === 'function') {
                customOnBlur(event);
            }
        },
        [onBlur, customOnBlur]
    );

    const handleChange = useCallback(
        event => {
            onChange(event);
            if (typeof customOnChange === 'function') {
                customOnChange(event);
            }
        },
        [onChange, customOnChange]
    );

    const handleFocus = useCallback(
        event => {
            onFocus(event);
            if (typeof customOnFocus === 'function') {
                customOnFocus(event);
            }
        },
        [onFocus, customOnFocus]
    );

    // If there is an input prop, this input has already been enhanced by final-form
    // This is required in for inputs used inside other inputs (such as the SelectInput inside a ReferenceInput)
    if (options.input) {
        return {
            id: id || source,
            input: options.input,
            meta: options.meta,
            isRequired: isRequiredOption || isRequired(validate),
        };
    }

    return {
        id: id || source,
        input: {
            ...inputProps,
            onBlur: handleBlur,
            onChange: handleChange,
            onFocus: handleFocus,
        },
        meta,
        isRequired: isRequiredOption || isRequired(validate),
    };
};

export default useInput;
