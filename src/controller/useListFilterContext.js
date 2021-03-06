import { useContext } from 'react';

import ListFilterContext from './ListFilterContext';

/**
 * Hook to read the list controller props from the ListContext.
 *
 * Must be used within a <ListContextProvider> (e.g. as a descendent of <List>
 * or <ListBase>).
 *
 * @prop {Object}   filterValues a dictionary of filter values, e.g. { title: 'lorem', nationality: 'fr' }
 * @prop {Function} setFilters a callback to update the filters, e.g. setFilters(filters, displayedFilters)
 * @prop {Object}   displayedFilters a dictionary of the displayed filters, e.g. { title: true, nationality: true }
 * @prop {Function} showFilter a callback to show one of the filters, e.g. showFilter('title', defaultValue)
 * @prop {Function} hideFilter a callback to hide one of the filters, e.g. hidefilter('title')
 * @prop {string}   resource the resource name, deduced from the location. e.g. 'posts'
 *
 * @see useListController for how it is filled
 */
const useListFilterContext = (props) => {
    const context = useContext(ListFilterContext);
    if (!context.hideFilter) {
        return props;
    }
    return context;
};

export default useListFilterContext;
