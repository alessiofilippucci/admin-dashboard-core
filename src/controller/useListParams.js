import { useCallback, useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { parse, stringify } from 'query-string';
import lodashDebounce from 'lodash/debounce';
import set from 'lodash/set';
import pickBy from 'lodash/pickBy';
import { useHistory, useLocation } from 'react-router-dom';

import queryReducer, {
    SET_FILTER,
    SET_PAGE,
    SET_PER_PAGE,
    SET_SORT,
    SORT_ASC,
} from '../reducer/admin/resource/list/queryReducer';
import { changeListParams } from '../actions/listActions';
import removeEmpty from '../util/removeEmpty';
import removeKey from '../util/removeKey';

const emptyObject = {};

const defaultSort = {
    field: 'id',
    order: SORT_ASC,
};

const defaultParams = {};

/**
 * Get the list parameters (page, sort, filters) and modifiers.
 *
 * These parameters are merged from 3 sources:
 *   - the query string from the URL
 *   - the params stored in the state (from previous navigation)
 *   - the options passed to the hook (including the filter defaultValues)
 *
 * @returns {Array} A tuple [parameters, modifiers].
 * Destructure as [
 *    { page, perPage, sort, order, filter, filterValues, displayedFilters, requestSignature },
 *    { setFilters, hideFilter, showFilter, setPage, setPerPage, setSort }
 * ]
 *
 * @example
 *
 * const [listParams, listParamsActions] = useListParams({
 *      resource: 'posts',
 *      location: location // From react-router. Injected to your component by react-admin inside a List
 *      filterDefaultValues: {
 *          published: true
 *      },
 *      sort: {
 *          field: 'published_at',
 *          order: 'DESC'
 *      },
 *      perPage: 25
 * });
 *
 * const {
 *      page,
 *      perPage,
 *      sort,
 *      order,
 *      filter,
 *      filterValues,
 *      displayedFilters,
 *      requestSignature
 * } = listParams;
 *
 * const {
 *      setFilters,
 *      hideFilter,
 *      showFilter,
 *      setPage,
 *      setPerPage,
 *      setSort,
 * } = listParamsActions;
 */
const useListParams = ({
    resource,
    filterDefaultValues,
    sort = defaultSort,
    perPage = 10,
    debounce = 500,
    syncWithLocation = false,
}) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const [localParams, setLocalParams] = useState(defaultParams);
    const params = useSelector(
        (reduxState) =>
            reduxState.admin.resources[resource]
                ? reduxState.admin.resources[resource].list.params
                : defaultParams,
        shallowEqual
    );

    const requestSignature = [
        location.search,
        resource,
        syncWithLocation ? params : localParams,
        filterDefaultValues,
        JSON.stringify(sort),
        perPage,
        syncWithLocation,
    ];

    const queryFromLocation = syncWithLocation
        ? parseQueryFromLocation(location)
        : {};

    const query = useMemo(
        () =>
            getQuery({
                queryFromLocation,
                params: syncWithLocation ? params : localParams,
                filterDefaultValues,
                sort,
                perPage,
            }),
        requestSignature // eslint-disable-line react-hooks/exhaustive-deps
    );

    // On mount, if the location includes params (for example from a link like
    // the categories products on the demo), we need to persist them in the
    // redux state as well so that we don't lose them after a redirection back
    // to the list
    useEffect(() => {
        if (Object.keys(queryFromLocation).length > 0) {
            dispatch(changeListParams(resource, query));
        }
    }, []); // eslint-disable-line

    const changeParams = useCallback(action => {
        const newParams = queryReducer(query, action);
        if (syncWithLocation) {
            history.push({
                search: `?${stringify({
                    ...newParams,
                    filter: JSON.stringify(newParams.filter),
                    displayedFilters: JSON.stringify(
                        newParams.displayedFilters
                    ),
                })}`,
            });
            dispatch(changeListParams(resource, newParams));
        } else {
            setLocalParams(newParams);
        }
    }, requestSignature); // eslint-disable-line react-hooks/exhaustive-deps

    const setSort = useCallback(
        (sort, order) =>
            changeParams({
                type: SET_SORT,
                payload: { sort, order },
            }),
        requestSignature // eslint-disable-line react-hooks/exhaustive-deps
    );

    const setPage = useCallback(
        (newPage) => changeParams({ type: SET_PAGE, payload: newPage }),
        requestSignature // eslint-disable-line react-hooks/exhaustive-deps
    );

    const setPerPage = useCallback(
        (newPerPage) =>
            changeParams({ type: SET_PER_PAGE, payload: newPerPage }),
        requestSignature // eslint-disable-line react-hooks/exhaustive-deps
    );

    const filterValues = query.filter || emptyObject;
    const displayedFilterValues = query.displayedFilters || emptyObject;

    const debouncedSetFilters = lodashDebounce((filter, displayedFilters) => {
        changeParams({
            type: SET_FILTER,
            payload: {
                filter: removeEmpty(filter),
                displayedFilters,
            },
        });
    }, debounce);

    const setFilters = useCallback(
        (filter, displayedFilters, debounce = true) =>
            debounce
                ? debouncedSetFilters(filter, displayedFilters)
                : changeParams({
                    type: SET_FILTER,
                    payload: {
                        filter: removeEmpty(filter),
                        displayedFilters,
                    },
                }),
        requestSignature // eslint-disable-line react-hooks/exhaustive-deps
    );

    const hideFilter = useCallback((filterName) => {
        // we don't use lodash.set() for displayed filters
        // to avoid problems with compound filter names (e.g. 'author.name')
        const displayedFilters = Object.keys(displayedFilterValues).reduce(
            (filters, filter) => {
                return filter !== filterName
                    ? { ...filters, [filter]: true }
                    : filters;
            },
            {}
        );
        const filter = removeEmpty(removeKey(filterValues, filterName));
        changeParams({
            type: SET_FILTER,
            payload: { filter, displayedFilters },
        });
    }, requestSignature); // eslint-disable-line react-hooks/exhaustive-deps

    const showFilter = useCallback((filterName, defaultValue) => {
        // we don't use lodash.set() for displayed filters
        // to avoid problems with compound filter names (e.g. 'author.name')
        const displayedFilters = {
            ...displayedFilterValues,
            [filterName]: true,
        };
        const filter = defaultValue
            ? set(filterValues, filterName, defaultValue)
            : filterValues;
        changeParams({
            type: SET_FILTER,
            payload: {
                filter,
                displayedFilters,
            },
        });
    }, requestSignature); // eslint-disable-line react-hooks/exhaustive-deps

    return [
        {
            displayedFilters: displayedFilterValues,
            filterValues,
            requestSignature,
            ...query,
        },
        {
            changeParams,
            setPage,
            setPerPage,
            setSort,
            setFilters,
            hideFilter,
            showFilter,
        },
    ];
};

export const validQueryParams = [
    'page',
    'perPage',
    'sort',
    'order',
    'filter',
    'displayedFilters',
];

const parseObject = (query, field) => {
    if (query[field] && typeof query[field] === 'string') {
        try {
            query[field] = JSON.parse(query[field]);
        } catch (err) {
            delete query[field];
        }
    }
};

export const parseQueryFromLocation = ({ search }) => {
    const query = pickBy(
        parse(search),
        (v, k) => validQueryParams.indexOf(k) !== -1
    );
    parseObject(query, 'filter');
    parseObject(query, 'displayedFilters');
    return query;
};

/**
 * Check if user has already set custom sort, page, or filters for this list
 *
 * User params come from the Redux store as the params props. By default,
 * this object is:
 *
 * { filter: {}, order: null, page: 1, perPage: null, sort: null }
 *
 * To check if the user has custom params, we must compare the params
 * to these initial values.
 *
 * @param {Object} params
 */
export const hasCustomParams = (params) => {
    return (
        params &&
        params.filter &&
        (Object.keys(params.filter).length > 0 ||
            params.order != null ||
            params.page !== 1 ||
            params.perPage != null ||
            params.sort != null)
    );
};

/**
 * Merge list params from 3 different sources:
 *   - the query string
 *   - the params stored in the state (from previous navigation)
 *   - the props passed to the List component (including the filter defaultValues)
 */
export const getQuery = ({
    queryFromLocation,
    params,
    filterDefaultValues,
    sort,
    perPage,
}) => {
    const query =
        Object.keys(queryFromLocation).length > 0
            ? queryFromLocation
            : hasCustomParams(params)
                ? { ...params }
                : { filter: filterDefaultValues || {} };

    if (!query.sort) {
        query.sort = sort.field;
        query.order = sort.order;
    }
    if (query.perPage == null) {
        query.perPage = perPage;
    }
    if (query.page == null) {
        query.page = 1;
    }

    return {
        ...query,
        page: getNumberOrDefault(query.page, 1),
        perPage: getNumberOrDefault(query.perPage, 10),
    };
};

export const getNumberOrDefault = (
    possibleNumber,
    defaultValue
) => {
    const parsedNumber =
        typeof possibleNumber === 'string'
            ? parseInt(possibleNumber, 10)
            : possibleNumber;

    return isNaN(parsedNumber) ? defaultValue : parsedNumber;
};

export default useListParams;