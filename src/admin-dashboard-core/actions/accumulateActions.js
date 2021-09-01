import { crudGetMatching } from './dataActions';

export const CRUD_GET_MANY_ACCUMULATE = 'AF/CRUD_GET_MANY_ACCUMULATE';

export const CRUD_GET_MATCHING_ACCUMULATE = 'AF/CRUD_GET_MATCHING_ACCUMULATE';

export const crudGetMatchingAccumulate = (
    reference,
    relatedTo,
    pagination,
    sort,
    filter
) => {
    const action = crudGetMatching(
        reference,
        relatedTo,
        pagination,
        sort,
        filter
    );

    return {
        type: CRUD_GET_MATCHING_ACCUMULATE,
        meta: {
            accumulate: () => action,
            accumulateValues: () => true,
            accumulateKey: JSON.stringify({
                resource: reference,
                relatedTo,
                ...action.payload,
            }),
        },
    };
};
