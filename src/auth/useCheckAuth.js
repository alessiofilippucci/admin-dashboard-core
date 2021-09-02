import { useCallback } from 'react';

import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import { useLocation } from 'react-router-dom';
import useLogout from './useLogout';
import useNotify from '../sideEffect/useNotify';

const useCheckAuth = () => {
    const authProvider = useAuthProvider();
    const notify = useNotify();
    const logout = useLogout();
    const location = useLocation();
    const allowedPublicPath = ['/login', '/resetPassword', '/changePassword'];

    const checkAuth = useCallback(
        (
            params = {},
            logoutOnFailure = true,
            redirectTo = defaultAuthParams.loginUrl
        ) =>
            authProvider.checkAuth(params).catch(error => {
                if (logoutOnFailure && (error.type === "guest" || !allowedPublicPath.includes(location.pathname))) {
                    logout(
                        {},
                        error && error.redirectTo
                            ? error.redirectTo
                            : redirectTo
                    );
                    if (location.pathname.includes("admin")) {
                        console.log("ADMIN")
                        notify(
                            getErrorMessage(error, 'ra.auth.auth_check_error'),
                            'warning'
                        );
                    }
                }
                throw error;
            }),
        [authProvider, logout, notify]
    );

    return authProvider ? checkAuth : checkAuthWithoutAuthProvider;
};

const checkAuthWithoutAuthProvider = () => Promise.resolve();

const getErrorMessage = (error, defaultMessage) =>
    typeof error === 'string'
        ? error
        : typeof error === 'undefined' || !error.message
        ? defaultMessage
        : error.message;

export default useCheckAuth;
