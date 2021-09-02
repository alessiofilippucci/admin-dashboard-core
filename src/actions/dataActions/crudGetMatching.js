import { GET_LIST } from '../../core';

export const crudGetMatching = (
    reference,
    relatedTo,
    pagination,
    sort,
    filter
) => ({
    type: CRUD_GET_MATCHING,
    payload: { pagination, sort, filter },
    meta: {
        resource: reference,
        relatedTo,
        fetch: GET_LIST,
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
});

export const CRUD_GET_MATCHING = 'AF/CRUD_GET_MATCHING';

export const CRUD_GET_MATCHING_LOADING = 'AF/CRUD_GET_MATCHING_LOADING';

export const CRUD_GET_MATCHING_FAILURE = 'AF/CRUD_GET_MATCHING_FAILURE';

export const CRUD_GET_MATCHING_SUCCESS = 'AF/CRUD_GET_MATCHING_SUCCESS';