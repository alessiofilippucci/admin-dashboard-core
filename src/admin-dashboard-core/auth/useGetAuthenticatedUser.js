import { useCallback } from 'react';

import useAuthProvider from './useAuthProvider';

const getAuthenticatedUserWithoutProvider = () => Promise.resolve({});

const useGetAuthenticatedUser = () => {
    const authProvider = useAuthProvider();
    const getAuthenticatedUser = useCallback(
        (params = {}) => authProvider.getAuthenticatedUser(params),
        [authProvider]
    );

    return authProvider ? getAuthenticatedUser : getAuthenticatedUserWithoutProvider;
};

export default useGetAuthenticatedUser;
