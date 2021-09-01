import React, { cloneElement } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import ArrowBack from '@material-ui/icons/ArrowBack';

import { sanitizeButtonRestProps }  from './Button';

import { useTranslate, } from 'admin-dashboard-core';

const BackButton = ({
    basePath = '',
    label = 'ra.action.back',
    variant = 'text',
    disabled,
    record,
    icon = defaultIcon,
    className,
    ...props
}) => {
    const classes = useStyles(props);
    const translate = useTranslate();
    const displayedLabel = label && translate(label, { _: label });
    return (
        <Button
            label={label}
            onClick={goBack}
            className={classnames(classes.button, className)}
            variant={variant}
            disabled={disabled}
            aria-label={displayedLabel}
            {...sanitizeButtonRestProps(props)}
        >
            {
                cloneElement(icon, {
                    className: classnames(classes.leftIcon, classes.icon),
                })
            }
            {displayedLabel}
        </Button>
    )
};

const defaultIcon = <ArrowBack />;

function goBack(e) {
    e.stopPropagation();
    window.history.go(-1);
}

const useStyles = makeStyles(
    theme => ({
        button: {
            position: 'relative',
        },
        leftIcon: {
            marginRight: theme.spacing(1),
        },
        icon: {
            fontSize: 18,
        },
    }),
    { name: 'RaBackButton' }
);

BackButton.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    icon: PropTypes.element,
    label: PropTypes.string,
    variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
};

export default BackButton;
