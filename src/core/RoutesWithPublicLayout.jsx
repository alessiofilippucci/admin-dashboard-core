import React, {
    Children,
    cloneElement,
    createElement,
} from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { RouteWithoutLayout } from './RouteWithoutLayout';

const RoutesWithLayoutPublic = ({
    layoutPublic,
}) => {
    return (
        <Switch>
            <RouteWithoutLayout exact path="/" component={layoutPublic} />,
            <RouteWithoutLayout
                exact
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

export default RoutesWithLayoutPublic;
