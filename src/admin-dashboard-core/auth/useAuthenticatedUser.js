import { useEffect } from 'react';

import useGetAuthenticatedUser from './useGetAuthenticatedUser';
import { useSafeSetState } from '../util/hooks';

const emptyParams = {};

const useAuthenticatedUser = (params = emptyParams) => {
    const [state, setState] = useSafeSetState({
        loading: true,
        loaded: false,
    });
    const getAuthenticatedUser = useGetAuthenticatedUser();
    useEffect(() => {
        getAuthenticatedUser(params)
            .then(authenticatedUser => {
                setState({ loading: false, loaded: true, authenticatedUser });
            })
            .catch(error => {
                setState({
                    loading: false,
                    loaded: true,
                    error,
                });
            });
    }, [getAuthenticatedUser, params, setState]);
    return state;
};

export default useAuthenticatedUser;
