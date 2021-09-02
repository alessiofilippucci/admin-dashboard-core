import * as React from 'react';

import CoreAdminContext from './CoreAdminContext';
import CoreAdminUI from './CoreAdminUI';

const CoreAdmin = ({
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
    loginPage,
    logoutButton,
    menu, // deprecated, use a custom layout instead
    theme,
    title = '',
}) => {
    return (
        <CoreAdminContext
            authProvider={authProvider}
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            history={history}
            customReducers={customReducers}
            customSagas={customSagas}
            initialState={initialState}
        >
            <CoreAdminUI
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
                logout={authProvider ? logoutButton : undefined}
            >
                {children}
            </CoreAdminUI>
        </CoreAdminContext>
    );
};

export default CoreAdmin;
