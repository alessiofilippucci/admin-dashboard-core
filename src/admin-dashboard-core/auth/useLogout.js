import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import { clearState } from '../actions/clearActions';
import { useHistory } from 'react-router-dom';

const useLogout = () => {
    const authProvider = useAuthProvider();
    const dispatch = useDispatch();

    const history = useHistory();

    const logout = useCallback(
        (
            params = {},
            redirectTo = defaultAuthParams.loginUrl,
            redirectToCurrentLocationAfterLogin = true
        ) =>
            authProvider.logout(params).then(redirectToFromProvider => {
                dispatch(clearState());
                // redirectTo can contain a query string, e.g '/login?foo=bar'
                // we must split the redirectTo to pass a structured location to history.push()
                const redirectToParts = (
                    redirectToFromProvider || redirectTo
                ).split('?');
                const newLocation = {
                    pathname: redirectToParts[0],
                };
                if (
                    redirectToCurrentLocationAfterLogin &&
                    history.location &&
                    history.location.pathname
                ) {
                    newLocation.state = {
                        nextPathname: history.location.pathname,
                    };
                }
                if (redirectToParts[1]) {
                    newLocation.search = redirectToParts[1];
                }
                history.push(newLocation);
                return redirectToFromProvider;
            }),
        [authProvider, history, dispatch]
    );

    const logoutWithoutProvider = useCallback(
        _ => {
            history.push({
                pathname: defaultAuthParams.loginUrl,
                state: {
                    nextPathname: history.location && history.location.pathname,
                },
            });
            dispatch(clearState());
            return Promise.resolve();
        },
        [dispatch, history]
    );

    return authProvider ? logout : logoutWithoutProvider;
};

export default useLogout;
