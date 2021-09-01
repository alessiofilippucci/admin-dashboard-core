import {
    REGISTER_RESOURCE,
    UNREGISTER_RESOURCE,
    REFRESH_VIEW,
} from '../../../actions';

import data from './data';
import list from './list';
import validity from './validity';

const initialState = {};

export default (previousState = initialState, action) => {
    if (action.type === REGISTER_RESOURCE) {
        const resourceState = {
            props: action.payload,
            data: data(undefined, action),
            list: list(undefined, action),
            validity: validity(undefined, action),
        };
        return {
            ...previousState,
            [action.payload.name]: resourceState,
        };
    }

    if (action.type === UNREGISTER_RESOURCE) {
        return Object.keys(previousState).reduce((acc, key) => {
            if (key === action.payload) {
                return acc;
            }

            return { ...acc, [key]: previousState[key] };
        }, {});
    }

    if (
        action.type !== REFRESH_VIEW &&
        (!action.meta || !action.meta.resource)
    ) {
        return previousState;
    }

    const resources = Object.keys(previousState);
    const newState = resources.reduce(
        (acc, resource) => ({
            ...acc,
            [resource]:
                action.type === REFRESH_VIEW ||
                action.meta.resource === resource
                    ? {
                          props: previousState[resource].props,
                          data: data(previousState[resource].data, action),
                          list: list(previousState[resource].list, action),
                          validity: validity(
                              previousState[resource].validity,
                              action
                          ),
                      }
                    : previousState[resource],
        }),
        {}
    );

    return newState;
};

export const getResources = state =>
    Object.keys(state).map(key => state[key].props);

export const getReferenceResource = (state, props) => state[props.reference];
