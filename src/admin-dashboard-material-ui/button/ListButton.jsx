import * as React from 'react';
import PropTypes from 'prop-types';
import ActionList from '@material-ui/icons/List';
import { Link } from 'react-router-dom';

import Button from './Button';

const ListButton = ({
    basePath = '',
    label = 'ra.action.list',
    icon = defaultIcon,
    ...rest
}) => (
    <Button component={Link} to={basePath} label={label} {...(rest)}>
        {icon}
    </Button>
);

const defaultIcon = <ActionList />;

ListButton.propTypes = {
    basePath: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
};

export default ListButton;
