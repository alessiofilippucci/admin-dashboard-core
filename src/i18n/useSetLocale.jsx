import { useContext, useCallback } from 'react';

import { TranslationContext } from './TranslationContext';
import { useUpdateLoading } from '../loading';
import { useNotify } from '../sideEffect';

const useSetLocale = ()=> {
    const { setLocale, i18nProvider } = useContext(TranslationContext);
    const { startLoading, stopLoading } = useUpdateLoading();
    const notify = useNotify();
    return useCallback(
        (newLocale) =>
            new Promise(resolve => {
                startLoading();
                // so we systematically return a Promise for the messages
                // i18nProvider may return a Promise for language changes,
                resolve(i18nProvider.changeLocale(newLocale));
            })
                .then(() => {
                    stopLoading();
                    setLocale(newLocale);
                })
                .catch(error => {
                    stopLoading();
                    notify('ra.notification.i18n_error', 'warning');
                    console.error(error);
                }),
        [i18nProvider, notify, setLocale, startLoading, stopLoading]
    );
};

export default useSetLocale;
