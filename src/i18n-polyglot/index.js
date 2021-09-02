import Polyglot from 'node-polyglot';

export default (
    getMessages,
    initialLocale = 'en',
    polyglotOptions = {}
) => {
    let locale = initialLocale;
    const messages = getMessages(initialLocale);
    if (messages instanceof Promise) {
        throw new Error(
            `The i18nProvider returned a Promise for the messages of the default locale (${initialLocale}). Please update your i18nProvider to return the messages of the default locale in a synchronous way.`
        );
    }
    const polyglot = new Polyglot({
        locale,
        phrases: { '': '', ...messages },
        ...polyglotOptions,
    });
    let translate = polyglot.t.bind(polyglot);

    return {
        translate: (key, options = {}) => translate(key, options),
        changeLocale: (newLocale) =>
            // We systematically return a Promise for the messages because
            // getMessages may return a Promise
            Promise.resolve(getMessages(newLocale)).then(
                (messages) => {
                    locale = newLocale;
                    const newPolyglot = new Polyglot({
                        locale: newLocale,
                        phrases: { '': '', ...messages },
                        ...polyglotOptions,
                    });
                    translate = newPolyglot.t.bind(newPolyglot);
                }
            ),
        getLocale: () => locale,
    };
};
