import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { crudGetMatchingAccumulate } from '../../actions/accumulateActions';
import {
    getPossibleReferences,
    getPossibleReferenceValues,
    getReferenceResource,
} from '../../reducer';
import { useDeepCompareEffect } from '../../util/hooks';

const defaultReferenceSource = (resource, source) =>
    `${resource}@${source}`;

export default ({
    reference,
    referenceSource = defaultReferenceSource,
    resource,
    source,
    filter,
    pagination,
    sort,
    id,
}) => {
    const dispatch = useDispatch();

    useDeepCompareEffect(() => {
        dispatch(
            crudGetMatchingAccumulate(
                reference,
                referenceSource(resource, source),
                pagination,
                sort,
                filter
            )
        );
    }, [
        dispatch,
        filter,
        reference,
        referenceSource,
        resource,
        source,
        pagination,
        sort,
    ]);

    const matchingReferences = useGetMatchingReferenceSelector({
        referenceSource,
        reference,
        resource,
        source,
        id,
    });

    if (!matchingReferences) {
        return {
            loading: true,
            error: null,
            matchingReferences: null,
        };
    }

    if (matchingReferences.error) {
        return {
            loading: false,
            matchingReferences: null,
            error: matchingReferences.error,
        };
    }

    return {
        loading: false,
        error: null,
        matchingReferences,
    };
};

const useGetMatchingReferenceSelector = ({
    referenceSource,
    reference,
    resource,
    source,
    id,
}) => {
    const getMatchingReferences = useCallback(
        state => {
            const referenceResource = getReferenceResource(state, {
                reference,
            });
            if (
                // resources are registered
                Object.keys(state.admin.resources).length > 0 &&
                // no registered resource matching the reference
                !referenceResource
            ) {
                throw new Error(`Cannot fetch a reference to "${reference}" (unknown resource).
You must add <Resource name="${reference}" /> as child of <Admin> to use "${reference}" in a reference`);
            }
            const possibleValues = getPossibleReferenceValues(state, {
                referenceSource,
                resource,
                source,
            });

            return getPossibleReferences(referenceResource, possibleValues, [
                id,
            ]);
        },
        [referenceSource, reference, resource, source, id]
    );

    return useSelector(getMatchingReferences);
};
