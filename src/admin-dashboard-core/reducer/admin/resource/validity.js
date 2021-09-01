import { FETCH_END, REFRESH_VIEW } from '../../../actions';
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

const initialState = {};

const validityReducer = (
    previousState = initialState,
    { type, payload, requestPayload, meta }
) => {
    if (type === REFRESH_VIEW) {
        return initialState;
    }
    if (
        !meta ||
        !meta.fetchResponse ||
        meta.fetchStatus !== FETCH_END ||
        meta.fromCache === true
    ) {
        return previousState;
    }
    if (payload.validUntil) {
        // store the validity date
        switch (meta.fetchResponse) {
            case GET_LIST:
            case GET_MANY:
            case GET_MANY_REFERENCE:
                return addIds(
                    payload.data.map(record => record.id),
                    payload.validUntil,
                    previousState
                );
            case UPDATE_MANY:
                return addIds(payload.data, payload.validUntil, previousState);
            case UPDATE:
            case CREATE:
            case GET_ONE:
                return addIds(
                    [payload.data.id],
                    payload.validUntil,
                    previousState
                );
            case DELETE:
            case DELETE_MANY:
                throw new Error(
                    'Responses to dataProvider.delete() or dataProvider.deleteMany() should not contain a validUntil param'
                );
            default:
                return previousState;
        }
    } else {
        // remove the validity date
        switch (meta.fetchResponse) {
            case GET_LIST:
            case GET_MANY:
            case GET_MANY_REFERENCE:
                return removeIds(
                    payload.data.map(record => record.id),
                    previousState
                );
            case UPDATE:
            case CREATE:
            case GET_ONE:
                return removeIds([payload.data.id], previousState);
            case UPDATE_MANY:
                return removeIds(payload.data, previousState);
            case DELETE:
                return removeIds([requestPayload.id], previousState);
            case DELETE_MANY:
                return removeIds(requestPayload.ids, previousState);
            default:
                return previousState;
        }
    }
};

const addIds = (
    ids = [],
    validUntil,
    oldValidityRegistry
) => {
    const validityRegistry = { ...oldValidityRegistry };
    ids.forEach(id => {
        validityRegistry[id] = validUntil;
    });
    return validityRegistry;
};

const removeIds = (
    ids = [],
    oldValidityRegistry
) => {
    const validityRegistry = { ...oldValidityRegistry };
    ids.forEach(id => {
        delete validityRegistry[id];
    });
    return validityRegistry;
};

export default validityReducer;
