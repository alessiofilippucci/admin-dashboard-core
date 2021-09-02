import { getStatusForInput as getDataStatus } from './referenceDataStatus';
import useTranslate from '../../i18n/useTranslate';
import useReference from '../useReference';
import useGetMatchingReferences from './useGetMatchingReferences';
import usePaginationState from '../usePaginationState';
import { useSortState } from '..';
import useFilterState from '../useFilterState';

const defaultReferenceSource = (resource, source) =>
    `${resource}@${source}`;
const defaultFilter = {};

/**
 * A hook for choosing a reference record. Useful for foreign keys.
 *
 * This hook fetches the possible values in the reference resource
 * (using `dataProvider.getMatching()`), it returns the possible choices
 * as the `choices` attribute.
 *
 * @example
 * const {
 *      choices, // the available reference resource
 * } = useReferenceInputController({
 *      input, // the input props
 *      resource: 'comments',
 *      reference: 'posts',
 *      source: 'post_id',
 * });
 *
 * The hook also allow to filter results. It returns a `setFilter`
 * function. It uses the value to create a filter
 * for the query - by default { q: [searchText] }. You can customize the mapping
 * searchText => searchQuery by setting a custom `filterToQuery` function option
 * You can also add a permanentFilter to further filter the result:
 *
 * @example
 * const {
 *      choices, // the available reference resource
 *      setFilter,
 * } = useReferenceInputController({
 *      input, // the input props
 *      resource: 'comments',
 *      reference: 'posts',
 *      source: 'post_id',
 *      permanentFilter: {
 *          author: 'john'
 *      },
 *      filterToQuery: searchText => ({ title: searchText })
 * });
 */
const useReferenceInputController = ({
    input,
    perPage = 25,
    filter = defaultFilter,
    reference,
    filterToQuery,
    referenceSource = defaultReferenceSource,
    resource,
    sort: sortOverride,
    source,
}) => {
    const translate = useTranslate();

    const { pagination, setPagination } = usePaginationState({ perPage });
    const { sort, setSort } = useSortState(sortOverride);

    const { filter: filterValue, setFilter } = useFilterState({
        permanentFilter: filter,
        filterToQuery,
    });

    const { matchingReferences } = useGetMatchingReferences({
        reference,
        referenceSource,
        filter: filterValue,
        pagination,
        sort,
        resource,
        source,
        id: input.value,
    });

    const { referenceRecord } = useReference({
        id: input.value,
        reference,
    });

    const dataStatus = getDataStatus({
        input,
        matchingReferences,
        referenceRecord,
        translate,
    });

    return {
        choices: dataStatus.choices,
        error: dataStatus.error,
        loading: dataStatus.waiting,
        filter: filterValue,
        setFilter,
        pagination,
        setPagination,
        sort,
        setSort,
        warning: dataStatus.warning,
    };
};

export default useReferenceInputController;
