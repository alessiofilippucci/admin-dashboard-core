import { useCallback } from 'react';

import useAuthProvider from './useAuthProvider';

const getPermissionsWithoutProvider = () => Promise.resolve([]);

const useGetPermissions = () => {
    const authProvider = useAuthProvider();
    const getPermissions = useCallback(
        (params = {}) => authProvider.getPermissions(params),
        [authProvider]
    );

    return authProvider ? getPermissions : getPermissionsWithoutProvider;
};

export default useGetPermissions;
