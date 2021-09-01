import React, {
    Children,
    cloneElement,
    createElement,
} from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import WithPermissions from '../auth/WithPermissions';

const RoutesWithLayout = ({
    catchAll,
    children,
    customRoutes,
    dashboard,
    title,
    routePrefix,
}) => {
    const childrenAsArray = React.Children.toArray(children);
    const firstChild = childrenAsArray.length > 0 ? (childrenAsArray[0]) : null;

    return (
        <Switch>
            {customRoutes && customRoutes.map((route, key) => cloneElement(route, { key }))}
            {Children.map(children, (child) => (
                <Route
                    key={child.props.name}
                    path={`/${routePrefix}${child.props.name}`}
                    render={props =>
                        cloneElement(child, {
                            // The context prop instruct the Resource component to
                            // render itself as a standard component
                            intent: 'route',
                            ...props,
                        })
                    }
                />
            ))}
            {dashboard ? (
                <Route
                    exact
                    path={`/${routePrefix}`}
                    render={routeProps => (
                        <WithPermissions
                            authParams={{
                                route: 'dashboard',
                            }}
                            component={dashboard}
                            {...routeProps}
                        />
                    )}
                />
            ) : firstChild ? (
                <Route
                    exact
                    path={`/${routePrefix}`}
                    render={() => <Redirect to={`/${routePrefix}${firstChild.props.name}`} />}
                />
            ) : null}
            <Route
                render={routeProps =>
                    createElement(catchAll, {
                        ...routeProps,
                        title,
                    })
                }
            />
        </Switch>
    );
};

export default RoutesWithLayout;
