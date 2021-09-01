import * as React from 'react';
import { cloneElement, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    sanitizeListRestProps,
    useListContext,
} from 'admin-dashboard-core';

import TopToolbar from '../layout/TopToolbar';
import { CreateButton, ExportButton } from '../button';

const ListActions = props => {
    const { className, exporter, filters, showCreateAction, showExporterAction, ...rest } = props;
    const {
        currentSort,
        resource,
        displayedFilters,
        filterValues,
        hasCreate,
        basePath,
        selectedIds,
        showFilter,
        total,
    } = useListContext(props);
    return useMemo(
        () => (
            <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
                {filters &&
                    cloneElement(filters, {
                        resource,
                        showFilter,
                        displayedFilters,
                        filterValues,
                        context: 'button',
                    })}
                {hasCreate && showCreateAction && <CreateButton basePath={basePath} />}
                {exporter !== false && showExporterAction && (
                    <ExportButton
                        disabled={total === 0}
                        resource={resource}
                        sort={currentSort}
                        filterValues={filterValues}
                    />
                )}
            </TopToolbar>
        ),
        [resource, displayedFilters, filterValues, selectedIds, filters, total] // eslint-disable-line react-hooks/exhaustive-deps
    );
};

ListActions.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    currentSort: PropTypes.any,
    displayedFilters: PropTypes.object,
    exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    filters: PropTypes.element,
    filterValues: PropTypes.object,
    hasCreate: PropTypes.bool,
    resource: PropTypes.string,
    onUnselectItems: PropTypes.func.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    showFilter: PropTypes.func,
    showCreateAction: PropTypes.bool,
    showExporterAction: PropTypes.bool,
    total: PropTypes.number,
};

ListActions.defaultProps = {
    selectedIds: [],
    onUnselectItems: () => null,
    showCreateAction: true,
    showExporterAction: true,
};

export default ListActions;
