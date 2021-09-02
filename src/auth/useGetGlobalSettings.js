import { Utils } from '../util';
import { useCallback } from 'react';

import useDataProvider from '../dataProvider/useDataProvider';

const getGlobalSettingsWithoutProvider = () => Promise.resolve({});

const useGetGlobalSettings = () => {
    const dataProvider = useDataProvider();

    const getGlobalSettings = useCallback(
        (params = {}) => {
            const filter = {
                enabled: true,
            };

            var nestedFilter = Object.keys(params).map((key) => { return `key eq '${key}'` }).join("eq") || '';

            if (!Utils.IsEmpty(nestedFilter)) {
                filter["_"] = nestedFilter;
            }

            return dataProvider.getList('configurations',
                {
                    pagination: null,
                    sort: { field: 'order', order: 'ASC' },
                    filter: filter,
                })
        }, [dataProvider]
    );

    return dataProvider ? getGlobalSettings : getGlobalSettingsWithoutProvider;
};

export default useGetGlobalSettings;
