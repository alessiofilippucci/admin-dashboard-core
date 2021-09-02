import { useEffect } from 'react';
import { useRefresh } from '../sideEffect';
import useIsAutomaticRefreshEnabled from './useIsAutomaticRefreshEnabled';

const useRefreshWhenVisible = (delay = 1000 * 60 * 5) => {
    const refresh = useRefresh();
    const automaticRefreshEnabled = useIsAutomaticRefreshEnabled();

    useEffect(() => {
        let lastHiddenTime;
        const handleVisibilityChange = () => {
            if (!automaticRefreshEnabled) {
                return;
            }
            if (document.hidden) {
                // tab goes hidden
                lastHiddenTime = Date.now();
            } else {
                // tab goes visible
                if (Date.now() - lastHiddenTime > delay) {
                    refresh();
                }
                lastHiddenTime = null;
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange, {
            capture: true,
        });
        return () =>
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            );
    }, [automaticRefreshEnabled, delay, refresh]);
};

export default useRefreshWhenVisible;
