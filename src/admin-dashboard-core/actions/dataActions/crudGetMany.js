import { GET_MANY } from '../../core';

export const crudGetMany = (
    resource,
    ids
) => ({
    type: CRUD_GET_MANY,
    payload: { ids },
    meta: {
        resource,
        fetch: GET_MANY,
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
});

export const CRUD_GET_MANY = 'AF/CRUD_GET_MANY';

export const CRUD_GET_MANY_LOADING = 'AF/CRUD_GET_MANY_LOADING';

export const CRUD_GET_MANY_FAILURE = 'AF/CRUD_GET_MANY_FAILURE';

export const CRUD_GET_MANY_SUCCESS = 'AF/CRUD_GET_MANY_SUCCESS';