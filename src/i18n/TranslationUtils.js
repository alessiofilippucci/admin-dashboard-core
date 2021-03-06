import merge from 'lodash/merge';
import { DEFAULT_LOCALE } from './index';

export const resolveBrowserLocale = (defaultLocale = DEFAULT_LOCALE) => {
    // from http://blog.ksol.fr/user-locale-detection-browser-javascript/
    // Rely on the window.navigator object to determine user locale
    const {
        language,
        browserLanguage,
        userLanguage,
    } = window.navigator;
    return (language || browserLanguage || userLanguage || defaultLocale).split(
        '-'
    )[0];
};

export const mergeTranslations = (...translationsModules) =>
    merge({}, ...translationsModules);
