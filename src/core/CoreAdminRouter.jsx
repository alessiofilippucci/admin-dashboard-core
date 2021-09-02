import React, {
    Children,
    useEffect,
    cloneElement,
    createElement,
} from 'react';
import { Route, Switch } from 'react-router-dom';

import RoutesWithLayout from './RoutesWithLayout';

import { useLogout, useGetPermissions, useGetAuthenticatedUser, useAuthState } from '../auth';
import { Ready, useTimeout, useSafeSetState } from '../util';

const CoreAdminRouter = props => {
    const getPermissions = useGetPermissions();
    const getAuthenticatedUser = useGetAuthenticatedUser();
    const doLogout = useLogout();
    const { authenticated } = useAuthState();
    const oneSecondHasPassed = useTimeout(1000);
    const [computedChildren, setComputedChildren] = useSafeSetState([]);
    useEffect(() => {
        if (typeof props.children === 'function') {
            initializeResources();
        }
    }, [authenticated]); // eslint-disable-line react-hooks/exhaustive-deps

    const initializeResources = async () => {
        try {
            const permissions = await getPermissions();
            const authenticatedUser = await getAuthenticatedUser();
            const resolveChildren = props.children;

            const childrenFuncResult = resolveChildren(permissions, authenticatedUser);
            if ((childrenFuncResult).then) {
                (childrenFuncResult).then(
                    resolvedChildren =>
                        setComputedChildren(
                            resolvedChildren
                                .filter(child => child)
                                .map(child => ({
                                    ...child,
                                    props: {
                                        ...child.props,
                                        key: child.props.name,
                                    },
                                }))
                        )
                );
            } else {
                setComputedChildren(
                    (childrenFuncResult).filter(
                        child => child
                    )
                );
            }
        } catch (error) {
            console.error(error);
            doLogout();
        }
    };

    const renderCustomRoutesWithoutLayout = (route, routeProps) => {
        if (route.props.render) {
            return route.props.render({
                ...routeProps,
                title: props.title,
            });
        }
        if (route.props.component) {
            return createElement(route.props.component, {
                ...routeProps,
                title: props.title,
            });
        }
    };

    const {
        layout,
        catchAll,
        children,
        customRoutes,
        dashboard,
        layoutPublic,
        loading,
        logout,
        menu,
        theme,
        title,
        routePrefix,
    } = props;

    if (
        process.env.NODE_ENV !== 'production' &&
        typeof children !== 'function' &&
        !children
    ) {
        return <Ready />;
    }

    if (
        typeof children === 'function' &&
        (!computedChildren || computedChildren.length === 0)
    ) {
        if (oneSecondHasPassed) {
            return <Route path="/" key="loading" component={loading} />;
        } else {
            return null;
        }
    }

    const childrenToRender = (typeof children === 'function'
        ? computedChildren
        : children);

    return (
        <div>
            {
                // Render every resources children outside the React Router Switch
                // as we need all of them and not just the one rendered
                Children.map(
                    childrenToRender,
                    (child) =>
                        cloneElement(child, {
                            key: child.props.name,
                            // The context prop instructs the Resource component to not render anything
                            // but simply to register itself as a known resource
                            intent: 'registration',
                        })
                )
            }
            <Switch>
                {customRoutes
                    .filter(route => route.props.noLayout)
                    .map((route, key) => {
                        return cloneElement(route, {
                            key,
                            render: routeProps =>
                                renderCustomRoutesWithoutLayout(
                                    route,
                                    routeProps
                                ),
                        })
                    }
                    )}
                <Route
                    path={`/${routePrefix}`}
                    render={() =>
                        createElement(
                            layout,
                            {
                                dashboard,
                                logout,
                                menu,
                                theme,
                                title,
                                routePrefix,
                            },
                            <RoutesWithLayout
                                catchAll={catchAll}
                                customRoutes={customRoutes.filter(
                                    route => !route.props.noLayout
                                )}
                                dashboard={dashboard}
                                title={title}
                                routePrefix={routePrefix}
                            >
                                {Children.map(
                                    childrenToRender,
                                    (
                                        child
                                    ) =>
                                        cloneElement(child, {
                                            key: child.props.name,
                                            intent: 'route',
                                        })
                                )}
                            </RoutesWithLayout>
                        )
                    }
                />
            </Switch>
        </div>
    );
};

CoreAdminRouter.defaultProps = {
    customRoutes: [],
};

export default CoreAdminRouter;
