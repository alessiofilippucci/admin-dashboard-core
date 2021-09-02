import { useEffect } from 'react';
import useCheckAuth from './useCheckAuth';

const emptyParams = {};

export default (params = emptyParams) => {
    const checkAuth = useCheckAuth();
    useEffect(() => {
        checkAuth(params).catch(() => {});
    }, [checkAuth, params]);
};
