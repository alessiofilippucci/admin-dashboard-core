export const USER_LOGIN = 'AF/USER_LOGIN';
export const USER_LOGIN_LOADING = 'AF/USER_LOGIN_LOADING';
export const USER_LOGIN_FAILURE = 'AF/USER_LOGIN_FAILURE';
export const USER_LOGIN_SUCCESS = 'AF/USER_LOGIN_SUCCESS';

export const USER_CHECK = 'AF/USER_CHECK';
export const USER_CHECK_SUCCESS = 'AF/USER_CHECK_SUCCESS';

export const userCheck = (
    payload,
    pathName,
    routeParams = {}
) => ({
    type: USER_CHECK,
    payload: {
        ...payload,
        routeParams,
    },
    meta: { auth: true, pathName },
});

export const USER_LOGOUT = 'AF/USER_LOGOUT';

export const userLogout = (redirectTo) => ({
    type: USER_LOGOUT,
    payload: { redirectTo },
    meta: { auth: true },
});
