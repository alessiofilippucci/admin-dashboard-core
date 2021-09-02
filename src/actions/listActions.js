export const CRUD_CHANGE_LIST_PARAMS = 'AF/CRUD_CHANGE_LIST_PARAMS';

export const changeListParams = (
    resource,
    params
) => ({
    type: CRUD_CHANGE_LIST_PARAMS,
    payload: params,
    meta: { resource },
});

export const SET_LIST_SELECTED_IDS = 'AF/SET_LIST_SELECTED_IDS';

export const setListSelectedIds = (
    resource,
    ids
) => ({
    type: SET_LIST_SELECTED_IDS,
    payload: ids,
    meta: { resource },
});

export const TOGGLE_LIST_ITEM = 'AF/TOGGLE_LIST_ITEM';

export const toggleListItem = (
    resource,
    id
) => ({
    type: TOGGLE_LIST_ITEM,
    payload: id,
    meta: { resource },
});

export const TOGGLE_LIST_ITEM_EXPAND = 'AF/TOGGLE_LIST_ITEM_EXPAND';

export const toggleListItemExpand = (
    resource,
    id
) => ({
    type: TOGGLE_LIST_ITEM_EXPAND,
    payload: id,
    meta: { resource },
});
