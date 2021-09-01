import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Button as MuiButton,
    Tooltip,
    IconButton,
    useMediaQuery,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { useTranslate } from 'admin-dashboard-core';

/**
 * A generic Button with side icon. Only the icon is displayed on small screens.
 *
 * The component translates the label. Pass the icon as child.
 * The icon displays on the left side of the button by default. Set alignIcon prop to 'right' to inverse.
 *
 * @example
 *
 * <Button label="Edit" color="secondary" onClick={doEdit}>
 *   <ContentCreate />
 * </Button>
 *
 */
const Button = props => {
    const {
        alignIcon = 'left',
        children,
        classes: classesOverride,
        className,
        color,
        disabled,
        label,
        size,
        title,
        onlyIcon,
        notOnlyIconWhenSmall,
        ...rest
    } = props;
    const translate = useTranslate();
    const classes = useStyles(props);
    const isXSmall = useMediaQuery((theme) =>
        theme.breakpoints.down('xs')
    );
    const restProps = sanitizeButtonRestProps(rest);

    return isXSmall && !notOnlyIconWhenSmall ? (
        label && !disabled ? (
            <Tooltip title={translate(label, { _: label })}>
                <IconButton
                    aria-label={translate(label, { _: label })}
                    className={className}
                    color={color}
                    {...restProps}
                >
                    {children}
                </IconButton>
            </Tooltip>
        ) : (
                <IconButton
                    className={className}
                    color={color}
                    disabled={disabled}
                    {...restProps}
                >
                    {children}
                </IconButton>
            )
    ) : (
            onlyIcon ?
                <Tooltip title={title || label ? translate(title || label, { _: title || label }) : ''}>
                    <MuiButton
                        className={classnames(classes.button, classes.onlyIconButton, className)}
                        color={color}
                        size={size}
                        aria-label={label ? translate(label, { _: label }) : undefined}
                        disabled={disabled}
                        {...restProps}
                    >
                        {children &&
                            React.cloneElement(children, {
                                className: classes[`${size}Icon`],
                            })
                        }
                    </MuiButton>
                </Tooltip> :
                <MuiButton
                    className={classnames(classes.button, className)}
                    color={color}
                    size={size}
                    aria-label={label ? translate(label, { _: label }) : undefined}
                    disabled={disabled}
                    {...restProps}
                >
                    {alignIcon === 'left' &&
                        children &&
                        React.cloneElement(children, {
                            className: classes[`${size}Icon`],
                        })}
                    {label && (
                        <span
                            className={classnames({
                                [classes.label]: alignIcon === 'left',
                                [classes.labelRightIcon]: alignIcon !== 'left',
                            })}
                        >
                            {translate(label, { _: label })}
                        </span>
                    )}
                    {alignIcon === 'right' &&
                        children &&
                        React.cloneElement(children, {
                            className: classes[`${size}Icon`],
                        })}
                </MuiButton>
        );
};

const useStyles = makeStyles(
    {
        button: {
            display: 'inline-flex',
            alignItems: 'center',
        },
        onlyIconButton: {
            minWidth: 'inherit',
        },
        label: {
            paddingLeft: '0.5em',
        },
        labelRightIcon: {
            paddingRight: '0.5em',
        },
        smallIcon: {
            fontSize: 20,
        },
        mediumIcon: {
            fontSize: 22,
        },
        largeIcon: {
            fontSize: 24,
        },
    },
    { name: 'RaButton' }
);

export const sanitizeButtonRestProps = ({
    // The next props are injected by Toolbar
    basePath,
    handleSubmit,
    handleSubmitWithRedirect,
    invalid,
    onSave,
    pristine,
    record,
    redirect,
    resource,
    saving,
    submitOnEnter,
    undoable,
    ...rest
}) => rest;

Button.propTypes = {
    alignIcon: PropTypes.oneOf(['left', 'right']),
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary']),
    disabled: PropTypes.bool,
    label: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    onlyIcon: PropTypes.bool,
    notOnlyIconWhenSmall: PropTypes.bool,
};

Button.defaultProps = {
    color: 'primary',
    size: 'small',
};

export default Button;
