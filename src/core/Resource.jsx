import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import WithPermissions from '../auth/WithPermissions';
import { registerResource, unregisterResource } from '../actions';
import { ResourceContextProvider } from './ResourceContextProvider';

const defaultOptions = {};

const ResourceRegister = ({
    name,
    list,
    create,
    edit,
    show,
    icon,
    options = defaultOptions,
}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            registerResource({
                name,
                options,
                hasList: !!list,
                hasEdit: !!edit,
                hasShow: !!show,
                hasCreate: !!create,
                icon,
            })
        );
        return () => dispatch(unregisterResource(name));
    }, [dispatch, name, create, edit, icon, list, show, options]);
    return null;
};

const ResourceRoutes = ({
    name,
    match,
    list,
    create,
    edit,
    show,
    options = defaultOptions,
}) => {
    const isRegistered = useSelector(
        (state) => !!state.admin.resources[name]
    );

    const basePath = match ? match.path : '';

    const resourceData = useMemo(
        () => ({
            resource: name,
            options,
            hasList: !!list,
            hasEdit: !!edit,
            hasShow: !!show,
            hasCreate: !!create,
        }),
        [name, options, create, edit, list, show]
    );

    // match tends to change even on the same route ; using memo to avoid an extra render
    return useMemo(() => {
        // if the registration hasn't finished, no need to render
        if (!isRegistered) {
            return null;
        }

        return (
            <ResourceContextProvider value={name}>
                <Switch>
                    {create && (
                        <Route
                            path={`${basePath}/create`}
                            render={routeProps => (
                                <WithPermissions
                                    component={create}
                                    basePath={basePath}
                                    {...routeProps}
                                    {...resourceData}
                                />
                            )}
                        />
                    )}
                    {show && (
                        <Route
                            path={`${basePath}/:id/show`}
                            render={routeProps => (
                                <WithPermissions
                                    component={show}
                                    basePath={basePath}
                                    id={decodeURIComponent(
                                        (routeProps.match)
                                            .params.id
                                    )}
                                    {...routeProps}
                                    {...resourceData}
                                />
                            )}
                        />
                    )}
                    {edit && (
                        <Route
                            path={`${basePath}/:id`}
                            render={routeProps => (
                                <WithPermissions
                                    component={edit}
                                    basePath={basePath}
                                    id={decodeURIComponent(
                                        (routeProps.match)
                                            .params.id
                                    )}
                                    {...routeProps}
                                    {...resourceData}
                                />
                            )}
                        />
                    )}
                    {list && (
                        <Route
                            path={`${basePath}`}
                            render={routeProps => (
                                <WithPermissions
                                    component={list}
                                    basePath={basePath}
                                    {...routeProps}
                                    {...resourceData}
                                    syncWithLocation
                                />
                            )}
                        />
                    )}
                </Switch>
            </ResourceContextProvider>
        );
    }, [basePath, name, create, edit, list, show, options, isRegistered]); // eslint-disable-line react-hooks/exhaustive-deps
};

const Resource = ({ intent = 'route', ...props }) =>
    intent === 'registration' ? (
        <ResourceRegister {...props} />
    ) : (
            <ResourceRoutes {...props} />
        );

export default Resource;