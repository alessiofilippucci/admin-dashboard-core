import { useEffect, useReducer, useCallback, useRef } from 'react';

const paginationReducer = (
    prevState,
    nextState
) => {
    return {
        ...prevState,
        ...nextState,
    };
};

const defaultPagination = {
    page: 1,
    perPage: 25,
};

/**
 * Hooks to provide pagination state (apge and perPage)
 *
 * @example
 *
 * const { page, setpage, perPage, setPerPage } = usePagination(initialPerPage);
 *
 * @param {number} initialPagination the initial value per page
 * @returns {PaginationProps} The pagination props
 */
export default (
    initialPagination = {}
) => {
    const [pagination, setPagination] = useReducer(paginationReducer, {
        ...defaultPagination,
        ...initialPagination,
    });
    const isFirstRender = useRef(true);

    const setPerPage = useCallback(perPage => setPagination({ perPage }), []);
    const setPage = useCallback(page => setPagination({ page }), []);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setPerPage(initialPagination.perPage || 25);
    }, [initialPagination.perPage, setPerPage]);

    return {
        page: pagination.page,
        perPage: pagination.perPage,
        pagination,
        setPage,
        setPerPage,
        setPagination,
    };
};
