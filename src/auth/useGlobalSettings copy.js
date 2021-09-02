import { useEffect } from 'react';

import useGetGlobalSettings from './useGetGlobalSettings';
import { useSafeSetState } from '../util/hooks';

const emptyParams = {};

const useGlobalSettings = (params = emptyParams) => {
    const [state, setState] = useSafeSetState({
        loading: true,
        loaded: false,
    });
    const getGlobalSettings = useGetGlobalSettings();
    useEffect(() => {
        getGlobalSettings(params)
            .then(({ data }) => {
                let globalSettings = {};

                data.forEach(d => {
                    globalSettings[d.key] = ["image, file"].includes(d.type) ? d.contentData : d.value;
                });

                setState({ loading: false, loaded: true, globalSettings });
            })
            .catch(error => {
                setState({
                    loading: false,
                    loaded: true,
                    error,
                });
            });
    }, [getGlobalSettings, params, setState]);
    return state;
};

export default useGlobalSettings;
