import { GET_ONE } from '../../core';

export const crudGetOne = (
    resource,
    id,
    basePath,
    refresh = true
) => ({
    type: CRUD_GET_ONE,
    payload: { id },
    meta: {
        resource,
        fetch: GET_ONE,
        basePath,
        onFailure: {
            notification: {
                body: 'ra.notification.item_doesnt_exist',
                level: 'warning',
            },
            redirectTo: 'list',
            refresh,
        },
    },
});

export const CRUD_GET_ONE = 'AF/CRUD_GET_ONE';

export const CRUD_GET_ONE_LOADING = 'AF/CRUD_GET_ONE_LOADING';

export const CRUD_GET_ONE_FAILURE = 'AF/CRUD_GET_ONE_FAILURE';

export const CRUD_GET_ONE_SUCCESS = 'AF/CRUD_GET_ONE_SUCCESS';