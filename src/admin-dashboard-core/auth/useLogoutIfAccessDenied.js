import { useCallback } from 'react';

import useAuthProvider from './useAuthProvider';
import useLogout from './useLogout';
import { useNotify } from '../sideEffect';

let authCheckPromise;

const useLogoutIfAccessDenied = () => {
    const authProvider = useAuthProvider();
    const logout = useLogout();
    const notify = useNotify();
    const logoutIfAccessDenied = useCallback(
        (error) => {
            // Sometimes, a component might trigger multiple simultaneous
            // dataProvider calls which all fail and call this function.
            // To avoid having multiple notifications, we first verify if
            // a checkError promise is already ongoing
            if (!authCheckPromise) {
                authCheckPromise = authProvider
                    .checkAuth(error)
                    .then(() => false)
                    .catch(async e => {
                        const redirectTo =
                            e && e.redirectTo
                                ? e.redirectTo
                                : error && error.redirectTo
                                ? error.redirectTo
                                : undefined;
                        logout({}, redirectTo);
                        notify('ra.notification.logged_out', 'warning');
                        return true;
                    })
                    .finally(() => {
                        authCheckPromise = undefined;
                    });
            }
            return authCheckPromise;
        },
        [authProvider, logout, notify]
    );
    return authProvider
        ? logoutIfAccessDenied
        : logoutIfAccessDeniedWithoutProvider;
};

const logoutIfAccessDeniedWithoutProvider = () => Promise.resolve(false);

export default useLogoutIfAccessDenied;
