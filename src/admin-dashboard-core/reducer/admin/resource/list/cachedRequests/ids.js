import { GET_LIST } from '../../../../../core';

const initialState = [];

const idsReducer = (
    previousState = initialState,
    action
) => {
    if (action.meta && action.meta.fetchResponse === GET_LIST) {
        return action.payload.data.map(({ id }) => id);
    }
    return previousState;
};

export default idsReducer;
