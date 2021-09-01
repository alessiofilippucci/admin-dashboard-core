import React, { cloneElement, createElement } from 'react';
import { Switch, Route } from 'react-router-dom';

import CoreAdminRouter from './CoreAdminRouter';
import { RouteWithoutLayout } from './RouteWithoutLayout';

const DefaultLayout = ({ children }) => (
    <>{children}</>
);

const CoreAdminUI = ({
    catchAll = Noop,
    children,
    customRoutes = [],
    dashboard,
    layoutPublic,
    layout = DefaultLayout,
    loading = Noop,
    loginPage = false,
    resetPasswordPage = false,
    logout,
    menu, // deprecated, use a custom layout instead
    theme,
    title = '',
    routePrefix,
}) => {
    return (
        <Switch>
            {loginPage !== false && loginPage !== true ? (
                <Route
                    exact
                    path="/login"
                    render={props =>
                        createElement(loginPage, {
                            ...props,
                            title,
                            theme,
                            routePrefix,
                            hasResetPassword: resetPasswordPage !== false && resetPasswordPage !== true
                        })
                    }
                />
            ) : null}
            {resetPasswordPage !== false && resetPasswordPage !== true ? (
                <Route
                    exact
                    path="/resetPassword"
                    render={props =>
                        createElement(resetPasswordPage, {
                            ...props,
                            title,
                            theme,
                            routePrefix,
                        })
                    }
                />
            ) : null}
            <Route
                path={`/${routePrefix}`}
                render={props => (
                    <CoreAdminRouter
                        catchAll={catchAll}
                        customRoutes={customRoutes}
                        dashboard={dashboard}
                        layoutPublic={layoutPublic}
                        layout={layout}
                        loading={loading}
                        logout={logout && createElement(logout)}
                        menu={menu}
                        theme={theme}
                        title={title}
                        routePrefix={routePrefix}
                        {...props}
                    >
                        {children}
                    </CoreAdminRouter>
                )}
            />

            <RouteWithoutLayout path="/" component={layoutPublic} />,
            <RouteWithoutLayout
                path="/:id"
                render={routeProps =>
                    cloneElement(layoutPublic, {
                        id: decodeURIComponent((routeProps.match).params.id),
                        ...routeProps
                    })
                }
            />
        </Switch>
    );
};

const Noop = () => null;

export default CoreAdminUI;
