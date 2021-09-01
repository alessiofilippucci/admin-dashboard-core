import * as React from 'react';
import { memo } from 'react';
import PropTypes from 'prop-types';
import Queue from '@material-ui/icons/Queue';
import { Link } from 'react-router-dom';
import { stringify } from 'query-string';

import Button from './Button';

export const CloneButton = ({
    basePath = '',
    label = 'ra.action.clone',
    record,
    icon = defaultIcon,
    ...rest
}) => (
    <Button
        component={Link}
        to={
            record
                ? {
                      pathname: `${basePath}/create`,
                      search: stringify({
                          source: JSON.stringify(omitId(record)),
                      }),
                  }
                : `${basePath}/create`
        }
        label={label}
        onClick={stopPropagation}
        {...rest}
    >
        {icon}
    </Button>
);

const defaultIcon = <Queue />;

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

const omitId = ({ id, ...rest }) => rest;

CloneButton.propTypes = {
    basePath: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
    record: PropTypes.any,
};

export default memo(CloneButton);
