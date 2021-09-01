import { useContext } from 'react';

import { TranslationContext } from './TranslationContext';

const useLocale = () => {
    const { locale } = useContext(TranslationContext);
    return locale;
};

export default useLocale;
