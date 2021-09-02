import { CREATE } from '../../core';

export const crudCreate = (
    resource,
    data,
    basePath,
    redirectTo = 'edit'
) => ({
    type: CRUD_CREATE,
    payload: { data },
    meta: {
        resource,
        fetch: CREATE,
        onSuccess: {
            notification: {
                body: 'ra.notification.created',
                level: 'info',
                messageArgs: {
                    smart_count: 1,
                },
            },
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

export const CRUD_CREATE = 'AF/CRUD_CREATE';

export const CRUD_CREATE_LOADING = 'AF/CRUD_CREATE_LOADING';

export const CRUD_CREATE_FAILURE = 'AF/CRUD_CREATE_FAILURE';

export const CRUD_CREATE_SUCCESS = 'AF/CRUD_CREATE_SUCCESS';