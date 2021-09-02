import isEqual from 'lodash/isEqual';
import { FETCH_END } from '../../../actions';
import {
    CREATE,
    DELETE,
    DELETE_MANY,
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    GET_ONE,
    UPDATE,
    UPDATE_MANY,
} from '../../../core';
import getFetchedAt from '../../../util/getFetchedAt';

/**
 * Make the fetchedAt property non enumerable
 */
export const hideFetchedAt = (records) => {
    Object.defineProperty(records, 'fetchedAt', {
        enumerable: false,
        configurable: false,
        writable: false,
    });
    return records;
};

/**
 * Add new records to the pool, and remove outdated ones.
 *
 * This is the equivalent of a stale-while-revalidate caching strategy:
 * The cached data is displayed before fetching, and stale data is removed
 * only once fresh data is fetched.
 */
export const addRecordsAndRemoveOutdated = (
    newRecords = [],
    oldRecords
) => {
    const newRecordsById = {};
    newRecords.forEach(record => (newRecordsById[record.id] = record));

    const newFetchedAt = getFetchedAt(
        newRecords.map(({ id }) => id),
        oldRecords.fetchedAt
    );

    const records = { fetchedAt: newFetchedAt };
    Object.keys(newFetchedAt).forEach(
        id =>
            (records[id] = newRecordsById[id]
                ? isEqual(newRecordsById[id], oldRecords[id])
                    ? oldRecords[id] // do not change the record to avoid a redraw
                    : newRecordsById[id]
                : oldRecords[id])
    );

    return hideFetchedAt(records);
};

/**
 * Add new records to the pool, without touching the other ones.
 */
export const addRecords = (
    newRecords = [],
    oldRecords
) => {
    const newRecordsById = { ...oldRecords };
    newRecords.forEach(record => {
        newRecordsById[record.id] = isEqual(record, oldRecords[record.id])
            ? (oldRecords[record.id])
            : record;
    });

    const updatedFetchedAt = getFetchedAt(
        newRecords.map(({ id }) => id),
        oldRecords.fetchedAt
    );

    Object.defineProperty(newRecordsById, 'fetchedAt', {
        value: { ...oldRecords.fetchedAt, ...updatedFetchedAt },
        enumerable: false,
    });

    return newRecordsById;
};

export const addOneRecord = (
    newRecord,
    oldRecords,
    date = new Date()
) => {
    const newRecordsById = {
        ...oldRecords,
        [newRecord.id]: isEqual(newRecord, oldRecords[newRecord.id])
            ? oldRecords[newRecord.id] // do not change the record to avoid a redraw
            : newRecord,
    };

    return Object.defineProperty(newRecordsById, 'fetchedAt', {
        value: { ...oldRecords.fetchedAt, [newRecord.id]: date },
        enumerable: false,
    });
};

const includesNotStrict = (items, element) =>
    items.some(item => item == element); // eslint-disable-line eqeqeq

/**
 * Remove records from the pool
 */
export const removeRecords = (
    removedRecordIds = [],
    oldRecords
) => {
    const records = Object.entries(oldRecords)
        .filter(([key]) => !includesNotStrict(removedRecordIds, key))
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {
            fetchedAt: {}, // TypeScript warns later if this is not defined
        });
    records.fetchedAt = Object.entries(oldRecords.fetchedAt)
        .filter(([key]) => !includesNotStrict(removedRecordIds, key))
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

    return hideFetchedAt(records);
};

const initialState = hideFetchedAt({ fetchedAt: {} });

const dataReducer = (
    previousState = initialState,
    { payload, meta }
) => {
    if (meta && meta.optimistic) {
        if (meta.fetch === UPDATE) {
            const updatedRecord = {
                ...previousState[payload.id],
                ...payload.data,
            };
            return addOneRecord(updatedRecord, previousState);
        }
        if (meta.fetch === UPDATE_MANY) {
            const updatedRecords = payload.ids.map(id => ({
                ...previousState[id],
                ...payload.data,
            }));
            return addRecordsAndRemoveOutdated(updatedRecords, previousState);
        }
        if (meta.fetch === DELETE) {
            return removeRecords([payload.id], previousState);
        }
        if (meta.fetch === DELETE_MANY) {
            return removeRecords(payload.ids, previousState);
        }
    }
    if (!meta || !meta.fetchResponse || meta.fetchStatus !== FETCH_END) {
        return previousState;
    }

    switch (meta.fetchResponse) {
        case GET_LIST:
            return addRecordsAndRemoveOutdated(payload.data, previousState);
        case GET_MANY:
        case GET_MANY_REFERENCE:
            return addRecords(payload.data, previousState);
        case UPDATE:
        case CREATE:
        case GET_ONE:
            return addOneRecord(payload.data, previousState);
        default:
            return previousState;
    }
};

export const getRecord = (state, id) => state[id];

export default dataReducer;
