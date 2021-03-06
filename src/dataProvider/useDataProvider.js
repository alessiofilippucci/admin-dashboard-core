import { useContext, useMemo } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

import DataProviderContext from './DataProviderContext';
import validateResponseFormat from './validateResponseFormat';
import undoableEventEmitter from './undoableEventEmitter';
import getFetchType from './getFetchType';
import defaultDataProvider from './defaultDataProvider';
import { canReplyWithCache, getResultFromCache } from './replyWithCache';
import {
    startOptimisticMode,
    stopOptimisticMode,
} from '../actions/undoActions';
import { FETCH_END, FETCH_ERROR, FETCH_START } from '../actions/fetchActions';
import { showNotification } from '../actions/notificationActions';
import { refreshView } from '../actions/uiActions';
import useLogoutIfAccessDenied from '../auth/useLogoutIfAccessDenied';
import { getDataProviderCallArguments } from './getDataProviderCallArguments';

import { Utils } from '../util';

// List of dataProvider calls emitted while in optimistic mode.
// These calls get replayed once the dataProvider exits optimistic mode
const optimisticCalls = [];
const undoableOptimisticCalls = [];
let nbRemainingOptimisticCalls = 0;

/**
 * Hook for getting a dataProvider
 *
 * Gets a dataProvider object, which behaves just like the real dataProvider
 * (same methods returning a Promise). But it's actually a Proxy object, which
 * dispatches Redux actions along the process. The benefit is that react-admin
 * tracks the loading state when using this hook, and stores results in the
 * Redux store for future use.
 *
 * In addition to the 2 usual parameters of the dataProvider methods (resource,
 * payload), the Proxy supports a third parameter for every call. It's an
 * object literal which may contain side effects, or make the action optimistic
 * (with undoable: true).
 *
 * @return dataProvider
 *
 * @example Basic usage
 *
 * import * as React from 'react';
import { useState } from 'react';
 * import { useDataProvider } from 'react-admin';
 *
 * const PostList = () => {
 *      const [posts, setPosts] = useState([])
 *      const dataProvider = useDataProvider();
 *      useEffect(() => {
 *          dataProvider.getList('posts', { filter: { status: 'pending' }})
 *            .then(({ data }) => setPosts(data));
 *      }, [])
 *
 *      return (
 *          <Fragment>
 *              {posts.map((post, key) => <PostDetail post={post} key={key} />)}
 *          </Fragment>
 *     );
 * }
 *
 * @example Handling all states (loading, error, success)
 *
 * import { useState, useEffect } from 'react';
 * import { useDataProvider } from 'react-admin';
 *
 * const UserProfile = ({ userId }) => {
 *     const dataProvider = useDataProvider();
 *     const [user, setUser] = useState();
 *     const [loading, setLoading] = useState(true);
 *     const [error, setError] = useState();
 *     useEffect(() => {
 *         dataProvider.getOne('users', { id: userId })
 *             .then(({ data }) => {
 *                 setUser(data);
 *                 setLoading(false);
 *             })
 *             .catch(error => {
 *                 setError(error);
 *                 setLoading(false);
 *             })
 *     }, []);
 *
 *     if (loading) return <Loading />;
 *     if (error) return <Error />
 *     if (!user) return null;
 *
 *     return (
 *         <ul>
 *             <li>Name: {user.name}</li>
 *             <li>Email: {user.email}</li>
 *         </ul>
 *     )
 * }
 *
 * @example Action customization
 *
 * dataProvider.getOne('users', { id: 123 });
 * // will dispatch the following actions:
 * // - CUSTOM_FETCH
 * // - CUSTOM_FETCH_LOADING
 * // - FETCH_START
 * // - CUSTOM_FETCH_SUCCESS
 * // - FETCH_END
 *
 * dataProvider.getOne('users', { id: 123 }, { action: CRUD_GET_ONE });
 * // will dispatch the following actions:
 * // - CRUD_GET_ONE
 * // - CRUD_GET_ONE_LOADING
 * // - FETCH_START
 * // - CRUD_GET_ONE_SUCCESS
 * // - FETCH_END
 */
const useDataProvider = () => {
    const dispatch = useDispatch();
    const dataProvider = useContext(DataProviderContext) || defaultDataProvider;
    const isOptimistic = useSelector(
        (state) => state.admin.ui.optimistic
    );
    const store = useStore();
    const logoutIfAccessDenied = useLogoutIfAccessDenied();

    const dataProviderProxy = useMemo(() => {
        return new Proxy(dataProvider, {
            get: (target, name) => {
                if (typeof name === 'symbol') {
                    return;
                }
                return (...args) => {
                    const {
                        resource,
                        payload,
                        allArguments,
                        options,
                    } = getDataProviderCallArguments(args);

                    const type = name.toString();
                    const {
                        action = 'CUSTOM_FETCH',
                        undoable = false,
                        onSuccess = undefined,
                        onFailure = undefined,
                        ...rest
                    } = options || {};

                    if (typeof dataProvider[type] !== 'function') {
                        throw new Error(
                            `Unknown dataProvider function: ${type}`
                        );
                    }
                    if (onSuccess && typeof onSuccess !== 'function') {
                        throw new Error(
                            'The onSuccess option must be a function'
                        );
                    }
                    if (onFailure && typeof onFailure !== 'function') {
                        throw new Error(
                            'The onFailure option must be a function'
                        );
                    }
                    if (undoable && !onSuccess) {
                        throw new Error(
                            'You must pass an onSuccess callback calling notify() to use the undoable mode'
                        );
                    }

                    const params = {
                        action,
                        dataProvider,
                        dispatch,
                        logoutIfAccessDenied,
                        onFailure,
                        onSuccess,
                        payload,
                        resource,
                        rest,
                        store,
                        type,
                        allArguments,
                        undoable,
                    };
                    if (isOptimistic) {
                        // in optimistic mode, all fetch calls are stacked, to be
                        // executed once the dataProvider leaves optimistic mode.
                        // In the meantime, the admin uses data from the store.
                        if (undoable) {
                            undoableOptimisticCalls.push(params);
                        } else {
                            optimisticCalls.push(params);
                        }
                        nbRemainingOptimisticCalls++;
                        // Return a Promise that only resolves when the optimistic call was made
                        // otherwise hooks like useQueryWithStore will return loaded = true
                        // before the content actually reaches the Redux store.
                        // But as we can't determine when this particular query was finished,
                        // the Promise resolves only when *all* optimistic queries are done.
                        return waitFor(() => nbRemainingOptimisticCalls === 0);
                    }
                    return doQuery(params);
                };
            },
        });
    }, [dataProvider, dispatch, isOptimistic, logoutIfAccessDenied, store]);

    return dataProviderProxy;
};

// get a Promise that resolves after a delay in milliseconds
const later = (delay = 100) =>
    new Promise(function (resolve) {
        setTimeout(resolve, delay);
    });

// get a Promise that resolves once a condition is satisfied
const waitFor = (condition) =>
    new Promise(resolve =>
        condition() ? resolve() : later().then(() => waitFor(condition))
    );

const doQuery = ({
    type,
    payload,
    resource,
    action,
    rest,
    onSuccess,
    onFailure,
    dataProvider,
    dispatch,
    store,
    undoable,
    logoutIfAccessDenied,
    allArguments,
}) => {
    const resourceState = store.getState().admin.resources[resource];
    if (canReplyWithCache(type, payload, resourceState)) {
        return answerWithCache({
            type,
            payload,
            resource,
            action,
            rest,
            onSuccess,
            resourceState,
            dispatch,
        });
    }
    return undoable
        ? performUndoableQuery({
            type,
            payload,
            resource,
            action,
            rest,
            onSuccess,
            onFailure,
            dataProvider,
            dispatch,
            logoutIfAccessDenied,
            allArguments,
        })
        : performQuery({
            type,
            payload,
            resource,
            action,
            rest,
            onSuccess,
            onFailure,
            dataProvider,
            dispatch,
            logoutIfAccessDenied,
            allArguments,
        });
};

/**
 * In undoable mode, the hook dispatches an optimistic action and executes
 * the success side effects right away. Then it waits for a few seconds to
 * actually call the dataProvider - unless the user dispatches an Undo action.
 *
 * We call that "optimistic" because the hook returns a resolved Promise
 * immediately (although it has an empty value). That only works if the
 * caller reads the result from the Redux store, not from the Promise.
 */
const performUndoableQuery = ({
    type,
    payload,
    resource,
    action,
    rest,
    onSuccess,
    onFailure,
    dataProvider,
    dispatch,
    logoutIfAccessDenied,
    allArguments,
}) => {
    dispatch(startOptimisticMode());
    if (window) {
        window.addEventListener('beforeunload', warnBeforeClosingWindow, {
            capture: true,
        });
    }
    dispatch({
        type: action,
        payload,
        meta: { resource, ...rest },
    });
    dispatch({
        type: `${action}_OPTIMISTIC`,
        payload,
        meta: {
            resource,
            fetch: getFetchType(type),
            optimistic: true,
        },
    });
    onSuccess && onSuccess({});
    undoableEventEmitter.once('end', ({ isUndo }) => {
        dispatch(stopOptimisticMode());
        if (isUndo) {
            dispatch(showNotification('ra.notification.canceled'));
            dispatch(refreshView());
            if (window) {
                window.removeEventListener(
                    'beforeunload',
                    warnBeforeClosingWindow,
                    {
                        capture: true,
                    }
                );
            }
            return;
        }
        dispatch({
            type: `${action}_LOADING`,
            payload,
            meta: { resource, ...rest },
        });
        dispatch({ type: FETCH_START });
        try {
            dataProvider[type]
                .apply(
                    dataProvider,
                    typeof resource !== 'undefined'
                        ? [resource, payload]
                        : allArguments
                )
                .then(response => {
                    if (response instanceof Error) {
                        throw response;
                    }
                    if (process.env.NODE_ENV !== 'production') {
                        validateResponseFormat(response, type);
                    }
                    dispatch({
                        type: `${action}_SUCCESS`,
                        payload: response,
                        requestPayload: payload,
                        meta: {
                            ...rest,
                            resource,
                            fetchResponse: getFetchType(type),
                            fetchStatus: FETCH_END,
                        },
                    });
                    dispatch({ type: FETCH_END });
                    if (window) {
                        window.removeEventListener(
                            'beforeunload',
                            warnBeforeClosingWindow,
                            {
                                capture: true,
                            }
                        );
                    }
                    replayOptimisticCalls();
                })
                .catch(error => {
                    if (window) {
                        window.removeEventListener(
                            'beforeunload',
                            warnBeforeClosingWindow,
                            {
                                capture: true,
                            }
                        );
                    }
                    if (process.env.NODE_ENV !== 'production') {
                        console.error(error);
                    }
                    return logoutIfAccessDenied(error).then(loggedOut => {
                        if (loggedOut) return;
                        dispatch({
                            type: `${action}_FAILURE`,
                            error: error.message ? error.message : error,
                            payload: error.body ? error.body : null,
                            requestPayload: payload,
                            meta: {
                                ...rest,
                                resource,
                                fetchResponse: getFetchType(type),
                                fetchStatus: FETCH_ERROR,
                            },
                        });
                        dispatch({ type: FETCH_ERROR, error });
                        onFailure && onFailure(error);
                    });
                });
        } catch (e) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(e);
            }
            throw new Error(
                'The dataProvider threw an error. It should return a rejected Promise instead.'
            );
        }
    });
    return Promise.resolve({});
};

// event listener added as window.onbeforeunload when starting optimistic mode, and removed when it ends
const warnBeforeClosingWindow = event => {
    event.preventDefault(); // standard
    event.returnValue = ''; // Chrome
    return 'Your latest modifications are not yet sent to the server. Are you sure?'; // Old IE
};

// Replay calls recorded while in optimistic mode
const replayOptimisticCalls = async () => {
    let clone;

    // We must perform any undoable queries first so that the effects of previous undoable
    // queries do not conflict with this one.

    // We only handle all side effects queries if there are no more undoable queries
    if (undoableOptimisticCalls.length > 0) {
        clone = [...undoableOptimisticCalls];
        // remove these calls from the list *before* doing them
        // because side effects in the calls can add more calls
        // so we don't want to erase these.
        undoableOptimisticCalls.splice(0, undoableOptimisticCalls.length);

        await Promise.all(
            clone.map(params => Promise.resolve(doQuery.call(null, params)))
        );
        // once the calls are finished, decrease the number of remaining calls
        nbRemainingOptimisticCalls -= clone.length;
    } else {
        clone = [...optimisticCalls];
        // remove these calls from the list *before* doing them
        // because side effects in the calls can add more calls
        // so we don't want to erase these.
        optimisticCalls.splice(0, optimisticCalls.length);

        await Promise.all(
            clone.map(params => Promise.resolve(doQuery.call(null, params)))
        );
        // once the calls are finished, decrease the number of remaining calls
        nbRemainingOptimisticCalls -= clone.length;
    }
};

/**
 * In normal mode, the hook calls the dataProvider. When a successful response
 * arrives, the hook dispatches a SUCCESS action, executes success side effects
 * and returns the response. If the response is an error, the hook dispatches
 * a FAILURE action, executes failure side effects, and throws an error.
 */
const performQuery = ({
    type,
    payload,
    resource,
    action,
    rest,
    onSuccess,
    onFailure,
    dataProvider,
    dispatch,
    logoutIfAccessDenied,
    allArguments,
}) => {
    dispatch({
        type: action,
        payload,
        meta: { resource, ...rest },
    });
    dispatch({
        type: `${action}_LOADING`,
        payload,
        meta: { resource, ...rest },
    });
    dispatch({ type: FETCH_START });

    try {
        return dataProvider[type]
            .apply(
                dataProvider,
                typeof resource !== 'undefined'
                    ? [resource, payload]
                    : allArguments
            )
            .then(response => {
                if (response instanceof Error) {
                    throw response;
                }
                if (process.env.NODE_ENV !== 'production') {
                    validateResponseFormat(response, type);
                }
                dispatch({
                    type: `${action}_SUCCESS`,
                    payload: response,
                    requestPayload: payload,
                    meta: {
                        ...rest,
                        resource,
                        fetchResponse: getFetchType(type),
                        fetchStatus: FETCH_END,
                    },
                });
                dispatch({ type: FETCH_END });
                onSuccess && onSuccess(response);
                return response;
            })
            .catch(error => {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                return logoutIfAccessDenied(error).then(loggedOut => {
                    if (loggedOut) return;
                    dispatch({
                        type: `${action}_FAILURE`,
                        error: error.message ? error.message : error,
                        payload: error.body ? error.body : null,
                        requestPayload: payload,
                        meta: {
                            ...rest,
                            resource,
                            fetchResponse: getFetchType(type),
                            fetchStatus: FETCH_ERROR,
                        },
                    });
                    dispatch({ type: FETCH_ERROR, error });
                    onFailure && onFailure(Utils.IsJsonString(error.message) ? JSON.parse(error.message) : error);
                    throw error;
                });
            });
    } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(e);
        }
        throw new Error(
            'The dataProvider threw an error. It should return a rejected Promise instead.'
        );
    }
};

const answerWithCache = ({
    type,
    payload,
    resource,
    action,
    rest,
    onSuccess,
    resourceState,
    dispatch,
}) => {
    dispatch({
        type: action,
        payload,
        meta: { resource, ...rest },
    });
    const response = getResultFromCache(type, payload, resourceState);
    dispatch({
        type: `${action}_SUCCESS`,
        payload: response,
        requestPayload: payload,
        meta: {
            ...rest,
            resource,
            fetchResponse: getFetchType(type),
            fetchStatus: FETCH_END,
            fromCache: true,
        },
    });
    onSuccess && onSuccess(response);
    return Promise.resolve(response);
};

export default useDataProvider;