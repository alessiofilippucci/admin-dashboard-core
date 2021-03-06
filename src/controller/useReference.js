import { useGetMany } from '../dataProvider';

/**
 * @typedef ReferenceProps
 * @type {Object}
 * @property {boolean} loading: boolean indicating if the reference is loading
 * @property {boolean} loaded: boolean indicating if the reference has loaded
 * @property {Object} referenceRecord: the referenced record.
 */

/**
 * Fetch reference record, and return it when available
 *
 * The reference prop sould be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example
 *
 * const { loading, loaded, referenceRecord } = useReference({
 *     id: 7,
 *     reference: 'users',
 * });
 *
 * @param {Object} option
 * @param {string} option.reference The linked resource name
 * @param {string} option.id The id of the reference
 *
 * @returns {ReferenceProps} The reference record
 */
export const useReference = ({ reference, id }) => {
    const { data, error, loading, loaded } = useGetMany(reference, [id]);
    return {
        referenceRecord: error ? undefined : data[0],
        error,
        loading,
        loaded,
    };
};

export default useReference;
