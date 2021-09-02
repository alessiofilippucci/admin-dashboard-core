import { useEffect } from 'react';

import useGetPermissions from './useGetPermissions';
import { useSafeSetState } from '../util/hooks';

const emptyParams = {};

const usePermissions = (params = emptyParams) => {
    const [state, setState] = useSafeSetState({
        loading: true,
        loaded: false,
    });
    const getPermissions = useGetPermissions();
    useEffect(() => {
        getPermissions(params)
            .then(permissions => {
                setState({ loading: false, loaded: true, permissions });
            })
            .catch(error => {
                setState({
                    loading: false,
                    loaded: true,
                    error,
                });
            });
    }, [getPermissions, params, setState]);
    return state;
};

export default usePermissions;
