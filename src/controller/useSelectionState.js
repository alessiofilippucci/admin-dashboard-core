import { useCallback, useEffect, useRef } from 'react';

import { useSafeSetState } from '../util';

const defaultSelection = [];

/**
 * Hooks to provide selection state.
 *
 * The names of the return values match the ListContext interface
 *
 * @example
 *
 * const { selectedIds, onSelect, onToggleItem, onUnselectItem } = useSelectionState();
 *
 */
const useSelectionState = (
    initialSelection = defaultSelection
) => {
    const [selectedIds, setSelectedIds] = useSafeSetState(
        initialSelection
    );

    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setSelectedIds(initialSelection);
    }, [initialSelection, setSelectedIds]);

    const onSelect = useCallback(
        (newIds) => {
            setSelectedIds(newIds);
        },
        [setSelectedIds]
    );
    const onToggleItem = useCallback(
        (id) => {
            setSelectedIds(previousState => {
                const index = previousState.indexOf(id);
                if (index > -1) {
                    return [
                        ...previousState.slice(0, index),
                        ...previousState.slice(index + 1),
                    ];
                } else {
                    return [...previousState, id];
                }
            });
        },
        [setSelectedIds]
    );
    const onUnselectItems = useCallback(() => {
        setSelectedIds([]);
    }, [setSelectedIds]);

    return {
        selectedIds,
        onSelect,
        onToggleItem,
        onUnselectItems,
    };
};

export default useSelectionState;
