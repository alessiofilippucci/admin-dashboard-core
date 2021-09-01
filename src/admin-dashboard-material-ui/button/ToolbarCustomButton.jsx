import * as React from 'react';
import { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { linkToRecord } from 'admin-dashboard-core';

import Button from './Button';

const ToolbarCustomButton = ({
    basePath,
    record,
    handleSubmit,
    handleSubmitWithRedirect,
    onSave,
    invalid,
    pristine,
    saving,
    submitOnEnter,
    label = '',
    icon = null,
    variant = 'contained',
    className,
    onClick,
    size = 'medium',
    redirectTo,
    ...rest
}) => (
    <Button
        className={className}
        component={redirectTo ? Link : "div"}
        to={redirectTo ? `${linkToRecord(basePath, record && record.id)}/redirectTo` : null}
        label={label}
        onClick={onClick}
        variant={variant}
        {...(rest)}
    >
        {icon}
    </Button>
);

ToolbarCustomButton.propTypes = {
    basePath: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
    record: PropTypes.any,
};

const PureShowButton = memo(
    ToolbarCustomButton,
    (props, nextProps) =>
        (props.record && nextProps.record
            ? props.record.id === nextProps.record.id
            : props.record == nextProps.record) && // eslint-disable-line eqeqeq
        props.basePath === nextProps.basePath
);

export default PureShowButton;
