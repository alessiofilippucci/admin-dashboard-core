import { GET_LIST } from '../../core';

export const crudGetList = (
    resource,
    pagination,
    sort,
    filter
) => ({
    type: CRUD_GET_LIST,
    payload: { pagination, sort, filter },
    meta: {
        resource,
        fetch: GET_LIST,
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
});


export const CRUD_GET_LIST = 'AF/CRUD_GET_LIST';

export const CRUD_GET_LIST_LOADING = 'AF/CRUD_GET_LIST_LOADING';

export const CRUD_GET_LIST_FAILURE = 'AF/CRUD_GET_LIST_FAILURE';

export const CRUD_GET_LIST_SUCCESS = 'AF/CRUD_GET_LIST_SUCCESS';