import * as React from 'react';

import AdminContext from './AdminContext';
import AdminUI from './AdminUI';

const Admin = ({
    appLayout,
    authProvider,
    catchAll,
    children,
    customReducers,
    customRoutes = [],
    customSagas,
    dashboard,
    dataProvider,
    history,
    layoutPublic,
    i18nProvider,
    initialState,
    layout,
    loading,
    locale,
    loginPage,
    logoutButton,
    menu, // deprecated, use a custom layout instead
    routePrefix = '',
    resetPasswordPage,
    theme,
    title = '',
}) => {
    if (appLayout && process.env.NODE_ENV !== 'production') {
        console.warn(
            'You are using deprecated prop "appLayout", it was replaced by "layout", see https://github.com/marmelab/react-admin/issues/2918'
        );
    }
    if (loginPage === true && process.env.NODE_ENV !== 'production') {
        console.warn(
            'You passed true to the loginPage prop. You must either pass false to disable it or a component class to customize it'
        );
    }
    if (resetPasswordPage === true && process.env.NODE_ENV !== 'production') {
        console.warn(
            'You passed true to the resetPasswordPage prop. You must either pass false to disable it or a component class to customize it'
        );
    }
    if (locale && process.env.NODE_ENV !== 'production') {
        console.warn(
            'You are using deprecated prop "locale". You must now pass the initial locale to your i18nProvider'
        );
    }

    return (
        <AdminContext
            authProvider={authProvider}
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            history={history}
            customReducers={customReducers}
            customSagas={customSagas}
            initialState={initialState}
        >
            <AdminUI
                layout={appLayout || layout}
                customRoutes={customRoutes}
                dashboard={dashboard}
                layoutPublic={layoutPublic}
                menu={menu}
                catchAll={catchAll}
                theme={theme}
                title={title}
                loading={loading}
                loginPage={loginPage}
                resetPasswordPage={resetPasswordPage}
                logout={authProvider ? logoutButton : undefined}
                routePrefix={routePrefix ? `${routePrefix}/` : ''}
            >
                {children}
            </AdminUI>
        </AdminContext>
    );
};

export default Admin;
