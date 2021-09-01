import * as React from 'react';
import { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import { FieldTitle, useResourceContext  } from 'admin-dashboard-core';

const FilterButtonMenuItem = forwardRef(
    (props, ref) => {
        const { filter, onShow } = props;
        const resource = useResourceContext(props);
        const handleShow = useCallback(() => {
            onShow({
                source: filter.props.source,
                defaultValue: filter.props.defaultValue,
            });
        }, [filter.props.defaultValue, filter.props.source, onShow]);

        return (
            <MenuItem
                className="new-filter-item"
                data-key={filter.props.source}
                data-default-value={filter.props.defaultValue}
                key={filter.props.source}
                onClick={handleShow}
                ref={ref}
            >
                <FieldTitle
                    label={filter.props.label}
                    source={filter.props.source}
                    resource={resource}
                />
            </MenuItem>
        );
    }
);

FilterButtonMenuItem.propTypes = {
    filter: PropTypes.element.isRequired,
    onShow: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
};

export default FilterButtonMenuItem;
