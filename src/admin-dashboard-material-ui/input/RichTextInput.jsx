import debounce from 'lodash/debounce';
import React, {
    useRef,
    useEffect,
    useCallback,
} from 'react';
import Quill from 'quill';
import { useInput, FieldTitle } from 'admin-dashboard-core';
import InputHelperText from './InputHelperText';
import {
    FormHelperText,
    FormControl,
    InputLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import styles from './RichTextStyle';

const useStyles = makeStyles(styles, { name: 'RaRichTextInput' });

const RichTextInput = props => {
    const {
        options = {}, // Quill editor options
        toolbar = true,
        fullWidth = true,
        classes: classesOverride,
        configureQuill,
        helperText,
        label,
        source,
        resource,
        variant,
        margin = 'dense',
        ...rest
    } = props;
    const classes = useStyles(props);
    const quillInstance = useRef();
    const divRef = useRef();
    const editor = useRef();

    const {
        id,
        isRequired,
        input: { value, onChange },
        meta: { touched, error },
    } = useInput({ source, ...rest });

    const lastValueChange = useRef(value);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onTextChange = useCallback(
        debounce(() => {
            const value =
                editor.current.innerHTML === '<p><br></p>'
                    ? ''
                    : editor.current.innerHTML;

            if (lastValueChange.current !== value) {
                lastValueChange.current = value;
                onChange(value);
            }
        }, 500),
        [onChange]
    );

    useEffect(() => {
        quillInstance.current = new Quill(divRef.current, {
            modules: { toolbar, clipboard: { matchVisual: false } },
            theme: 'snow',
            ...options,
        });

        if (configureQuill) {
            configureQuill(quillInstance.current);
        }

        quillInstance.current.setContents(
            quillInstance.current.clipboard.convert(value)
        );

        editor.current = divRef.current.querySelector('.ql-editor');
        quillInstance.current.on('text-change', onTextChange);

        return () => {
            quillInstance.current.off('text-change', onTextChange);
            if (onTextChange.cancel) {
                onTextChange.cancel();
            }
            quillInstance.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (lastValueChange.current !== value) {
            const selection = quillInstance.current.getSelection();
            quillInstance.current.setContents(
                quillInstance.current.clipboard.convert(value)
            );
            if (selection && quillInstance.current.hasFocus()) {
                quillInstance.current.setSelection(selection);
            }
        }
    }, [value]);

    return (
        <FormControl
            error={!!(touched && error)}
            fullWidth={fullWidth}
            className="ra-rich-text-input"
            margin={margin}
        >
            {label !== '' && label !== false && (
                <InputLabel shrink htmlFor={id} className={classes.label}>
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                </InputLabel>
            )}
            <div data-testid="quill" ref={divRef} className={variant} />
            <FormHelperText
                error={!!error}
                className={!!error ? 'ra-rich-text-input-error' : ''}
            >
                <InputHelperText
                    error={error}
                    helperText={helperText}
                    touched={touched}
                />
            </FormHelperText>
        </FormControl>
    );
};

RichTextInput.propTypes = {
    label: PropTypes.string,
    options: PropTypes.object,
    source: PropTypes.string,
    fullWidth: PropTypes.bool,
    configureQuill: PropTypes.func,
};

export default RichTextInput;