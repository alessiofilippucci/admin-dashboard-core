import useDataProvider from './useDataProvider';
import { useMemo } from 'react';
import useDeclarativeSideEffects from './useDeclarativeSideEffects';

const useDataProviderWithDeclarativeSideEffects = () => {
    const dataProvider = useDataProvider();
    const getSideEffects = useDeclarativeSideEffects();

    const dataProviderProxy = useMemo(() => {
        return new Proxy(dataProvider, {
            get: (target, name) => {
                if (typeof name === 'symbol') {
                    return;
                }
                return (
                    resource,
                    payload,
                    options
                ) => {
                    const { onSuccess, onFailure } = getSideEffects(
                        resource,
                        options
                    );
                    try {
                        return target[name.toString()](resource, payload, {
                            ...options,
                            onSuccess,
                            onFailure,
                        });
                    } catch (e) {
                        // turn synchronous exceptions (e.g. in parameter preparation)
                        // into async ones, otherwise they'll be lost
                        return Promise.reject(e);
                    }
                };
            },
        });
    }, [dataProvider, getSideEffects]);

    return dataProviderProxy;
};

export default useDataProviderWithDeclarativeSideEffects;
