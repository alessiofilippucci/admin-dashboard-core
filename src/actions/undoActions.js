export const UNDOABLE = 'AF/UNDOABLE';

export const startUndoable = (action) => ({
    type: UNDOABLE,
    payload: { action },
});

export const UNDO = 'AF/UNDO';

export const undo = () => ({
    type: UNDO,
});

export const COMPLETE = 'AF/COMPLETE';

export const complete = () => ({
    type: COMPLETE,
});

export const START_OPTIMISTIC_MODE = 'AF/START_OPTIMISTIC_MODE';

export const startOptimisticMode = () => ({
    type: START_OPTIMISTIC_MODE,
});

export const STOP_OPTIMISTIC_MODE = 'AF/STOP_OPTIMISTIC_MODE';


export const stopOptimisticMode = () => ({
    type: STOP_OPTIMISTIC_MODE,
});
