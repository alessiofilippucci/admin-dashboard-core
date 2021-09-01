import get from 'lodash/get';

export const canReplyWithCache = (type, payload, resourceState) => {
    const now = new Date();
    switch (type) {
        case 'getList':
            return (
                get(resourceState, [
                    'list',
                    'cachedRequests',
                    JSON.stringify(payload),
                    'validity',
                ]) > now
            );
        case 'getOne':
            return (
                resourceState &&
                resourceState.validity &&
                resourceState.validity[(payload).id] > now
            );

        case 'getMany':
            return (
                resourceState &&
                resourceState.validity &&
                (payload).ids.every(
                    id => resourceState.validity[id] > now
                )
            );
        default:
            return false;
    }
};

export const getResultFromCache = (type, payload, resourceState) => {
    switch (type) {
        case 'getList': {
            const data = resourceState.data;
            const requestSignature = JSON.stringify(payload);
            const cachedRequest =
                resourceState.list.cachedRequests[requestSignature];
            return {
                data: cachedRequest.ids.map(id => data[id]),
                total: cachedRequest.total,
            };
        }
        case 'getOne':
            return { data: resourceState.data[payload.id] };
        case 'getMany':
            return {
                data: payload.ids.map(id => resourceState.data[id]),
            };
        default:
            throw new Error('cannot reply with cache for this method');
    }
};
