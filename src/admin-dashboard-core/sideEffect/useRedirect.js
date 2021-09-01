import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import resolveRedirectTo from '../util/resolveRedirectTo';
import { refreshView } from '../actions/uiActions';
import { useHistory } from 'react-router-dom';

import * as Utils from '../inference/assertions';

const useRedirect = () => {
    const dispatch = useDispatch();
    const history = useHistory(); // Note: history is mutable. This prevents render loops in useCallback.
    return useCallback(
        (
            redirectTo,
            basePath = '',
            id,
            data = null
        ) => {
            if (!redirectTo) {
                if (history.location.state || history.location.search) {
                    history.replace({
                        ...history.location,
                        state: {},
                        search: undefined,
                    });
                } else {
                    dispatch(refreshView());
                }
                return;
            }

            history.push({
                pathname: resolveRedirectTo(redirectTo, basePath, id, data),
                state: data,
            });
            // if (data && ['create'].includes(redirectTo)) {
            //     const redirectUrl = `${resolveRedirectTo(redirectTo, basePath, id, data)}?source=${JSON.stringify(data)}`;
            //     history.push({
            //         pathname: redirectUrl,
            //         state: data,
            //     });
            // }
            // else {
            //     history.push({
            //         pathname: resolveRedirectTo(redirectTo, basePath, id, data),
            //         state: data,
            //     });
            // }
        },
        [dispatch, history]
    );
};

export default useRedirect;
