import { useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import { resetNotification } from '../actions/notificationActions';

const useResetPassword = () => {
    const authProvider = useAuthProvider();
    const location = useLocation();
    const locationState = location.state;
    const history = useHistory();
    const dispatch = useDispatch();
    const nextPathName = locationState && locationState.nextPathname;

    const resetPassword = useCallback(
        (params= {}, pathName) =>
            authProvider.resetPassword(params).then(ret => {
                dispatch(resetNotification());
                const redirectUrl = pathName
                    ? pathName
                    : nextPathName || defaultAuthParams.afterLoginUrl;
                history.push(redirectUrl);
                return ret;
            }),
        [authProvider, history, nextPathName]
    );

    const resetPasswordWithoutProvider = useCallback(
        (_, __) => {
            dispatch(resetNotification());
            history.push(defaultAuthParams.afterLoginUrl);
            return Promise.resolve();
        },
        [history]
    );

    return authProvider ? resetPassword : resetPasswordWithoutProvider;
};

export default useResetPassword;
