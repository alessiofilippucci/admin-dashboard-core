import React, {
    useCallback,
    useMemo,
    Children,
} from 'react';

import { useSafeSetState } from '../util/hooks';
import { TranslationContext } from './TranslationContext';

const TranslationProvider = props => {
    const { i18nProvider, children } = props;

    const [state, setState] = useSafeSetState({
        locale: i18nProvider ? i18nProvider.getLocale() : 'en',
        i18nProvider,
    });

    const setLocale = useCallback(
        (newLocale) =>
            setState(state => ({ ...state, locale: newLocale })),
        [setState]
    );

    // Allow locale modification by including setLocale in the context
    // This can't be done in the initial state because setState doesn't exist yet
    const value = useMemo(
        () => ({
            ...state,
            setLocale,
        }),
        [setLocale, state]
    );

    return (
        <TranslationContext.Provider value={value}>
            {Children.only(children)}
        </TranslationContext.Provider>
    );
};

export default TranslationProvider;
