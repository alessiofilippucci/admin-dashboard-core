import { UPDATE } from '../../core';

export const crudUpdate = (
    resource,
    id,
    data,
    previousData,
    basePath,
    redirectTo = 'show',
    refresh = true
) => ({
    type: CRUD_UPDATE,
    payload: { id, data, previousData },
    meta: {
        resource,
        fetch: UPDATE,
        onSuccess: {
            notification: {
                body: 'ra.notification.updated',
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

export const CRUD_UPDATE = 'AF/CRUD_UPDATE';

export const CRUD_UPDATE_LOADING = 'AF/CRUD_UPDATE_LOADING';

export const CRUD_UPDATE_FAILURE = 'AF/CRUD_UPDATE_FAILURE';

export const CRUD_UPDATE_SUCCESS = 'AF/CRUD_UPDATE_SUCCESS';