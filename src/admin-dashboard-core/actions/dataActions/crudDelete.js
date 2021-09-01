import { DELETE } from '../../core';

export const crudDelete = (
    resource,
    id,
    previousData,
    basePath,
    redirectTo = 'list',
    refresh = true
) => ({
    type: CRUD_DELETE,
    payload: { id, previousData },
    meta: {
        resource,
        fetch: DELETE,
        onSuccess: {
            notification: {
                body: 'ra.notification.deleted',
                level: 'info',
                messageArgs: {
                    smart_count: 1,
                },
            },
            refresh,
            redirectTo,
            basePath,
        },
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
});

export const CRUD_DELETE = 'AF/CRUD_DELETE';

export const CRUD_DELETE_LOADING = 'AF/CRUD_DELETE_LOADING';

export const CRUD_DELETE_FAILURE = 'AF/CRUD_DELETE_FAILURE';

export const CRUD_DELETE_SUCCESS = 'AF/CRUD_DELETE_SUCCESS';