export const TOGGLE_SIDEBAR = 'AF/TOGGLE_SIDEBAR';

export const toggleSidebar = () => ({
    type: TOGGLE_SIDEBAR,
});

export const SET_SIDEBAR_VISIBILITY = 'AF/SET_SIDEBAR_VISIBILITY';

export const setSidebarVisibility = (
    isOpen
) => ({
    type: SET_SIDEBAR_VISIBILITY,
    payload: isOpen,
});

export const REFRESH_VIEW = 'AF/REFRESH_VIEW';

export const refreshView = () => ({
    type: REFRESH_VIEW,
});

export const SET_AUTOMATIC_REFRESH = 'AF/SET_AUTOMATIC_REFRESH';

export const setAutomaticRefresh = (enabled) => ({
    type: SET_AUTOMATIC_REFRESH,
    payload: enabled,
});
