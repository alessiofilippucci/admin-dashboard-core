import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { fetchStart, fetchEnd } from '../actions/fetchActions';

export default () => {
    const dispatch = useDispatch();

    const startLoading = useCallback(() => {
        dispatch(fetchStart());
    }, [dispatch]);

    const stopLoading = useCallback(() => {
        dispatch(fetchEnd());
    }, [dispatch]);

    return { startLoading, stopLoading };
};
