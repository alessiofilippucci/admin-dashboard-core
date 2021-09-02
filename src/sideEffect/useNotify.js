import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../actions/notificationActions';

const useNotify = () => {
    const dispatch = useDispatch();
    return useCallback(
        (
            message,
            type = 'info',
            messageArgs = {},
            undoable = false,
            autoHideDuration
        ) => {
            dispatch(
                showNotification(message, type, {
                    messageArgs,
                    undoable,
                    autoHideDuration,
                })
            );
        },
        [dispatch]
    );
};

export default useNotify;
