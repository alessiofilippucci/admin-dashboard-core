import get from 'lodash/get';
import { useMemo } from 'react';
import { CRUD_GET_MANY_REFERENCE } from '../actions/dataActions/crudGetManyReference';
import useQueryWithStore from './useQueryWithStore';
import { getIds, getTotal, nameRelatedTo, } from '../reducer/admin/references/oneToMany';
const defaultIds = [];
const defaultData = {};
/**
 * Call the dataProvider.getManyReference() method and return the resolved result
 * as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { loading: true, loaded: false }
 * - success: { data: [data from store], ids: [ids from response], total: [total from response], loading: false, loaded: true }
 * - error: { error: [error from response], loading: false, loaded: true }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * @param {string} resource The referenced resource name, e.g. 'comments'
 * @param {string} target The target resource key, e.g. 'post_id'
 * @param {Object} id The identifier of the record to look for in 'target'
 * @param {Object} pagination The request pagination { page, perPage }, e.g. { page: 1, perPage: 10 }
 * @param {Object} sort The request sort { field, order }, e.g. { field: 'id', order: 'DESC' }
 * @param {Object} filter The request filters, e.g. { body: 'hello, world' }
 * @param {string} referencingResource The resource name, e.g. 'posts'. Used to generate a cache key
 * @param {Object} options Options object to pass to the dataProvider. May include side effects to be executed upon success or failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as { data, total, ids, error, loading, loaded }.
 *
 * @example
 *
 * import { useGetManyReference } from 'react-admin';
 *
 * const PostComments = ({ post_id }) => {
 *     const { data, ids, loading, error } = useGetManyReference(
 *         'comments',
 *         'post_id',
 *         post_id,
 *         { page: 1, perPage: 10 },
 *         { field: 'published_at', order: 'DESC' }
 *         {},
 *         'posts',
 *     );
 *     if (loading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <ul>{ids.map(id =>
 *         <li key={id}>{data[id].body}</li>
 *     )}</ul>;
 * };
 */
const useGetManyReference = (resource, target, id, pagination, sort, filter, referencingResource, options) => {
    const relatedTo = useMemo(() => nameRelatedTo(resource, id, referencingResource, target, filter), [filter, resource, id, referencingResource, target]);
    const { data: { ids, allRecords }, total, error, loading, loaded, } = useQueryWithStore({
        type: 'getManyReference',
        resource: resource,
        payload: { target, id, pagination, sort, filter },
    }, Object.assign(Object.assign({}, options), { relatedTo, action: CRUD_GET_MANY_REFERENCE }),
        // ids and data selector
        (state) => ({
            ids: getIds(state, relatedTo),
            allRecords: get(state.admin.resources, [resource, 'data'], defaultData),
        }), (state) => getTotal(state, relatedTo), isDataLoaded);
    const data = useMemo(() => ids == null
        ? defaultData
        : ids
            .map(id => allRecords[id])
            .reduce((acc, record) => {
                if (!record)
                    return acc;
                acc[record.id] = record;
                return acc;
            }, {}), [ids, allRecords]);
    return { data, ids: ids || defaultIds, total, error, loading, loaded };
};
const isDataLoaded = (data) => data.ids != null;
export default useGetManyReference;