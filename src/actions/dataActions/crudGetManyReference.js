import { GET_MANY_REFERENCE } from '../../core';

export const crudGetManyReference = (
    reference,
    target,
    id,
    relatedTo,
    pagination,
    sort,
    filter,
    source
) => ({
    type: CRUD_GET_MANY_REFERENCE,
    payload: { target, id, pagination, sort, filter, source },
    meta: {
        resource: reference,
        relatedTo,
        fetch: GET_MANY_REFERENCE,
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
});

export const CRUD_GET_MANY_REFERENCE = 'AF/CRUD_GET_MANY_REFERENCE';

export const CRUD_GET_MANY_REFERENCE_LOADING = 'AF/CRUD_GET_MANY_REFERENCE_LOADING';

export const CRUD_GET_MANY_REFERENCE_FAILURE = 'AF/CRUD_GET_MANY_REFERENCE_FAILURE';

export const CRUD_GET_MANY_REFERENCE_SUCCESS = 'AF/CRUD_GET_MANY_REFERENCE_SUCCESS';
