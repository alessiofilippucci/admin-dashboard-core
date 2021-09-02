import { createContext, useMemo } from 'react';
import pick from 'lodash/pick';

const ListSortContext = createContext({
    currentSort: null,
    setSort: null,
    resource: null,
});

export const usePickSortContext = (
    context
) =>
    useMemo(
        () => pick(context, ['currentSort', 'setSort', 'resource']),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [context.currentSort, context.setSort]
    );

ListSortContext.displayName = 'ListSortContext';

export default ListSortContext;
