import { useContext, useCallback } from 'react';

import { TranslationContext } from './TranslationContext';

const useTranslate = () => {
    const { i18nProvider, locale } = useContext(TranslationContext);
    const translate = useCallback(
        (key, options) =>
            i18nProvider.translate(key, options),
        // update the hook each time the locale changes
        [i18nProvider, locale] // eslint-disable-line react-hooks/exhaustive-deps
    );
    return i18nProvider ? translate : identity;
};

const identity = key => key;

export default useTranslate;
