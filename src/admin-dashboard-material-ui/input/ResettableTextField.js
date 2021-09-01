import * as React from 'react';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import MuiTextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { useNotify, useTranslate } from 'admin-dashboard-core';

const useStyles = makeStyles(
    {
        clearIcon: {
            height: 16,
            width: 0,
        },
        visibleClearIcon: {
            width: 16,
        },
        clearButton: {
            height: 24,
            width: 24,
            padding: 0,
        },
        selectAdornment: {
            position: 'absolute',
            right: 24,
        },
        inputAdornedEnd: {
            paddingRight: 0,
        },
        root: {
            "& li": {
                whiteSpace: 'initial'
            }
        }
    },
    { name: 'RaResettableTextField' }
);

const handleMouseDownClearButton = event => {
    event.preventDefault();
};

/**
 * An override of the default Material-UI TextField which is resettable
 */
function ResettableTextField(props) {
    const {
        classes: classesOverride,
        clearAlwaysVisible,
        showCopy,
        InputProps,
        value,
        resettable,
        disabled,
        variant = 'filled',
        margin = 'dense',
        ...rest
    } = props;
    const classes = useStyles(props);
    const translate = useTranslate();
    const notify = useNotify();

    const { onChange, onFocus, onBlur } = props;
    const handleClickClearButton = useCallback(
        event => {
            event.preventDefault();
            onChange('');
        },
        [onChange]
    );

    const handleFocus = useCallback(
        event => {
            onFocus && onFocus(event);
        },
        [onFocus]
    );

    const handleBlur = useCallback(
        event => {
            onBlur && onBlur(event);
        },
        [onBlur]
    );

    const {
        clearButton,
        clearIcon,
        inputAdornedEnd,
        selectAdornment,
        visibleClearButton,
        visibleClearIcon,
        ...restClasses
    } = classes;

    const { endAdornment, ...InputPropsWithoutEndAdornment } = InputProps || {};

    if (clearAlwaysVisible && endAdornment) {
        throw new Error(
            'ResettableTextField cannot display both an endAdornment and a clear button always visible'
        );
    }
    if (showCopy && endAdornment) {
        throw new Error(
            'ResettableTextField cannot display both an endAdornment and a show copy button'
        );
    }
    if (showCopy && clearAlwaysVisible) {
        throw new Error(
            'ResettableTextField cannot display both a clear button always visible and a show copy button'
        );
    }

    const getEndAdornment = () => {
        if (showCopy) {
            return (
                <InputAdornment position="end">
                    <Tooltip title={translate('ra.input.copy')}>
                        <IconButton
                            className={clearButton}
                            aria-label={translate('ra.input.copy')}
                            onClick={() => { navigator.clipboard.writeText(value); notify('ra.input.copied'); }}
                        >
                            <FileCopyOutlinedIcon
                                className={classNames(
                                    clearIcon,
                                    visibleClearIcon
                                )}/>
                        </IconButton>
                    </Tooltip>
                </InputAdornment>
            );
        }
        else if (!resettable) {
            return endAdornment;
        } else if (!value) {
            if (clearAlwaysVisible) {
                return (
                    <InputAdornment
                        position="end"
                        classes={{
                            root: props.select ? selectAdornment : null,
                        }}
                    >
                        <IconButton
                            className={clearButton}
                            aria-label={translate(
                                'ra.action.clear_input_value'
                            )}
                            title={translate('ra.action.clear_input_value')}
                            disableRipple
                            disabled={true}
                        >
                            <ClearIcon
                                className={classNames(
                                    clearIcon,
                                    visibleClearIcon
                                )}
                            />
                        </IconButton>
                    </InputAdornment>
                );
            } else {
                if (endAdornment) {
                    return endAdornment;
                } else {
                    // show spacer
                    return (
                        <InputAdornment
                            position="end"
                            classes={{
                                root: props.select ? selectAdornment : null,
                            }}
                        >
                            <span className={clearButton}>&nbsp;</span>
                        </InputAdornment>
                    );
                }
            }
        } else {
            // show clear
            return (
                <InputAdornment
                    position="end"
                    classes={{
                        root: props.select ? selectAdornment : null,
                    }}
                >
                    <IconButton
                        className={clearButton}
                        aria-label={translate('ra.action.clear_input_value')}
                        title={translate('ra.action.clear_input_value')}
                        disableRipple
                        onClick={handleClickClearButton}
                        onMouseDown={handleMouseDownClearButton}
                        disabled={disabled}
                    >
                        <ClearIcon
                            className={classNames(clearIcon, {
                                [visibleClearIcon]: clearAlwaysVisible || value,
                            })}
                        />
                    </IconButton>
                </InputAdornment>
            );
        }
    };

    return (
        <MuiTextField
            classes={restClasses}
            value={value}
            InputProps={{
                classes: props.select && variant === 'filled' ? { adornedEnd: inputAdornedEnd } : {},
                endAdornment: getEndAdornment(),
                ...InputPropsWithoutEndAdornment,
            }}
            SelectProps={{
                SelectDisplayProps: {
                    style: {
                        whiteSpace: 'initial'
                    }
                },
                MenuProps: {
                    MenuListProps: {
                        className: classes.root
                    }
                }
            }}
            disabled={disabled}
            variant={variant}
            margin={margin}
            {...rest}
            onFocus={handleFocus}
            onBlur={handleBlur}
        />
    );
}

ResettableTextField.propTypes = {
    classes: PropTypes.object,
    clearAlwaysVisible: PropTypes.bool,
    showCopy: PropTypes.bool,
    disabled: PropTypes.bool,
    InputProps: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    resettable: PropTypes.bool,
    value: PropTypes.any.isRequired,
};

export default ResettableTextField;
