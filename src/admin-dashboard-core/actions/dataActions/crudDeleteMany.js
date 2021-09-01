import { DELETE_MANY } from '../../core';

export const crudDeleteMany = (
    resource,
    ids,
    basePath,
    refresh = true
) => ({
    type: CRUD_DELETE_MANY,
    payload: { ids },
    meta: {
        resource,
        fetch: DELETE_MANY,
        onSuccess: {
            notification: {
                body: 'ra.notification.deleted',
                level: 'info',
                messageArgs: {
                    smart_count: ids.length,
                },
            },
            basePath,
            refresh,
            unselectAll: true,
        },
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
});

export const CRUD_DELETE_MANY = 'AF/CRUD_DELETE_MANY';

export const CRUD_DELETE_MANY_LOADING = 'AF/CRUD_DELETE_MANY_LOADING';

export const CRUD_DELETE_MANY_FAILURE = 'AF/CRUD_DELETE_MANY_FAILURE';

export const CRUD_DELETE_MANY_SUCCESS = 'AF/CRUD_DELETE_MANY_SUCCESS';