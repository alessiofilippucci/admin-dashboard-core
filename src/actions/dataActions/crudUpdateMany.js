import { UPDATE_MANY } from '../../core';

export const crudUpdateMany = (
    resource,
    ids,
    data,
    basePath,
    refresh = true
) => ({
    type: CRUD_UPDATE_MANY,
    payload: { ids, data },
    meta: {
        resource,
        fetch: UPDATE_MANY,
        onSuccess: {
            notification: {
                body: 'ra.notification.updated',
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

export const CRUD_UPDATE_MANY = 'AF/CRUD_UPDATE_MANY';

export const CRUD_UPDATE_MANY_LOADING = 'AF/CRUD_UPDATE_MANY_LOADING';

export const CRUD_UPDATE_MANY_FAILURE = 'AF/CRUD_UPDATE_MANY_FAILURE';

export const CRUD_UPDATE_MANY_SUCCESS = 'AF/CRUD_UPDATE_MANY_SUCCESS';