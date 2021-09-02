import { GET_LIST } from '../../../../../core';

const initialState = null;

const totalReducer = (
    previousState = initialState,
    action
) => {
    if (action.meta && action.meta.fetchResponse === GET_LIST) {
        return action.payload.total;
    }
    return previousState;
};

export default totalReducer;
