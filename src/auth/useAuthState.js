import { useEffect } from 'react';

import useCheckAuth from './useCheckAuth';
import { useSafeSetState } from '../util/hooks';

const emptyParams = {};

const useAuthState = (params = emptyParams) => {
    const [state, setState] = useSafeSetState({
        loading: true,
        loaded: false,
        authenticated: true, // optimistic
    });
    const checkAuth = useCheckAuth();
    useEffect(() => {
        checkAuth(params, false)
            .then(() =>
                setState({ loading: false, loaded: true, authenticated: true })
            )
            .catch(() =>
                setState({ loading: false, loaded: true, authenticated: false })
            );
    }, [checkAuth, params, setState]);
    return state;
};

export default useAuthState;
