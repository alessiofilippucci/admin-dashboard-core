export const REGISTER_RESOURCE = 'AF/REGISTER_RESOURCE';

export const registerResource = (resource) => ({
    type: REGISTER_RESOURCE,
    payload: resource,
});

export const UNREGISTER_RESOURCE = 'AF/UNREGISTER_RESOURCE';

export const unregisterResource = (resourceName) => ({
    type: UNREGISTER_RESOURCE,
    payload: resourceName,
});
