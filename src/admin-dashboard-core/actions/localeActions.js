export const CHANGE_LOCALE = 'AF/CHANGE_LOCALE';

export const changeLocale = (locale) => ({
    type: CHANGE_LOCALE,
    payload: locale,
});

export const CHANGE_LOCALE_SUCCESS = 'AF/CHANGE_LOCALE_SUCCESS';

export const changeLocaleSuccess = (
    locale,
    messages
) => ({
    type: CHANGE_LOCALE_SUCCESS,
    payload: {
        locale,
        messages,
    },
});

export const CHANGE_LOCALE_FAILURE = 'AF/CHANGE_LOCALE_FAILURE';

export const changeLocaleFailure = (
    locale,
    error
) => ({
    type: CHANGE_LOCALE_FAILURE,
    error,
    payload: {
        locale,
    },
});
