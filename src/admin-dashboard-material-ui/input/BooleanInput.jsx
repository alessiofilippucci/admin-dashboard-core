import * as React from 'react';
import { useCallback } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {
    FormControlLabel,
    FormHelperText,
    FormGroup,
    Switch,
    Checkbox,
    Typography,
    Grid,
} from '@material-ui/core';
import { FieldTitle, useInput, Utils } from 'admin-dashboard-core';

import sanitizeInputRestProps from './sanitizeInputRestProps';
import InputHelperText from './InputHelperText';
import InputPropTypes from './InputPropTypes';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
    theme => ({
        root: { paddingTop: 15 },
    }),
    { name: 'RaBooleanInput' }
);

const BooleanInput = ({
    className,
    format,
    label,
    fullWidth,
    helperText,
    onBlur,
    onChange,
    onFocus,
    options,
    disabled,
    parse,
    resource,
    source,
    validate,
    formControlLabelProps,
    errorHelperClassName,
    useCheckbox = false,
    showBoolText,
    rowIndex,
    hideError,
    ...rest
}) => {
    const {
        id,
        input: { onChange: finalFormOnChange, type, value, ...inputProps },
        isRequired,
        meta: { error, submitError, touched },
    } = useInput({
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        type: 'checkbox',
        validate,
        ...rest,
    });

    const classes = useStyles(rest);

    const handleChange = useCallback(
        (event, value) => {
            finalFormOnChange(value);
        },
        [finalFormOnChange]
    );

    return (
        <FormGroup className={classnames(classes.root, className)} {...sanitizeInputRestProps(rest)}>
            <FormControlLabel
                className={!showBoolText || Utils.IsEmpty(label) ? 'm-0' : ''}
                control={
                    useCheckbox ?
                        <Checkbox
                            id={id}
                            onChange={handleChange}
                            {...inputProps}
                            {...options}
                            disabled={disabled}
                        /> : (
                            <Grid component="label" container justify="space-between" alignItems="center" spacing={1} className="w-auto">
                                {
                                    showBoolText && label &&
                                    <Grid item>
                                        <Typography component="div">{label}{isRequired ? " *" : ""}</Typography>
                                    </Grid>
                                }
                                <Grid item>
                                    <Grid component="label" container alignItems="center" spacing={1}>
                                        <Grid item>
                                            <Switch
                                                id={id}
                                                onChange={handleChange}
                                                {...inputProps}
                                                {...options}
                                                disabled={disabled}
                                            />
                                        </Grid>
                                        {
                                            showBoolText &&
                                            <Grid item>
                                                <Typography component="div">{inputProps.checked ? "SI" : "NO"}</Typography>
                                            </Grid>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        )

                }
                label={
                    !showBoolText && <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                }
                {...formControlLabelProps}
            />
            {
                !hideError && <FormHelperText error={!!error || submitError} className={errorHelperClassName}>
                    <InputHelperText
                        touched={touched}
                        error={error || submitError}
                        helperText={helperText}
                    />
                </FormHelperText>
            }
        </FormGroup>
    );
};

BooleanInput.propTypes = {
    ...InputPropTypes,
    options: PropTypes.shape(Switch.propTypes),
    disabled: PropTypes.bool,
    showBoolText: PropTypes.bool,
    hideError: PropTypes.bool,
};

BooleanInput.defaultProps = {
    options: {},
    showBoolText: false,
    hideError: false,
};

export default BooleanInput;
