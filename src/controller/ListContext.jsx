import { createContext } from 'react';

const ListContext = createContext({
    basePath: null,
    currentSort: null,
    data: null,
    defaultTitle: null,
    displayedFilters: null,
    filterValues: null,
    hasCreate: null,
    hideFilter: null,
    ids: null,
    loaded: null,
    loading: null,
    onSelect: null,
    onToggleItem: null,
    onUnselectItems: null,
    page: null,
    perPage: null,
    resource: null,
    selectedIds: null,
    setFilters: null,
    setPage: null,
    setPerPage: null,
    setSort: null,
    showFilter: null,
    total: null,
});

ListContext.displayName = 'ListContext';

export default ListContext;