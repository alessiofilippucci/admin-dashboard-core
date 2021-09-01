import * as React from 'react';
import { memo } from 'react';
import PropTypes from 'prop-types';
import ImageEye from '@material-ui/icons/RemoveRedEye';
import { Link } from 'react-router-dom';
import { linkToRecord } from 'admin-dashboard-core';

import Button from './Button';

const ShowButton = ({
    basePath = '',
    label = 'ra.action.show',
    record,
    icon = defaultIcon,
    ...rest
}) => (
    <Button
        component={Link}
        to={`${linkToRecord(basePath, record && record.id)}/show`}
        label={label}
        onClick={stopPropagation}
        {...(rest)}
    >
        {icon}
    </Button>
);

const defaultIcon = <ImageEye />;

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

ShowButton.propTypes = {
    basePath: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
    record: PropTypes.any,
};

const PureShowButton = memo(
    ShowButton,
    (props, nextProps) =>
        (props.record && nextProps.record
            ? props.record.id === nextProps.record.id
            : props.record == nextProps.record) && // eslint-disable-line eqeqeq
        props.basePath === nextProps.basePath
);

export default PureShowButton;
