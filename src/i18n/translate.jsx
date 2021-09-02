import * as React from 'react';
import { default as warning } from '../util/warning';
import useTranslate from './useTranslate';
import useLocale from './useLocale';

const withTranslate = (BaseComponent) => {
    warning(
        typeof BaseComponent === 'string',
        `The translate function is a Higher Order Component, and should not be called directly with a translation key. Use the translate function passed as prop to your component props instead:

        const MyHelloButton = ({ translate }) => (
            <button>{translate('myroot.hello.world')}</button>
        );`
    );

    const TranslatedComponent = props => {
        const translate = useTranslate();
        const locale = useLocale();

        return (
            <BaseComponent {...props} translate={translate} locale={locale} />
        );
    };

    TranslatedComponent.defaultProps = BaseComponent.defaultProps;

    return TranslatedComponent;
};

export default withTranslate;
