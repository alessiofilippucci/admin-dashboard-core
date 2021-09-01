import { useContext } from 'react';

import ListSortContext from './ListSortContext';

const useListSortContext = (props) => {
    const context = useContext(ListSortContext);
    if (!context.setSort) {
        return props;
    }
    return context;
};

export default useListSortContext;
