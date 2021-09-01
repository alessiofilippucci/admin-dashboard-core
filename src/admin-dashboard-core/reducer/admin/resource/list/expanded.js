import { TOGGLE_LIST_ITEM_EXPAND, } from '../../../../actions/listActions';

const initialState = [];

const expanded = (
    previousState = initialState,
    action
) => {
    if (action.type === TOGGLE_LIST_ITEM_EXPAND) {
        const index = previousState
            .map(el => el == action.payload) // eslint-disable-line eqeqeq
            .indexOf(true);
        if (index === -1) {
            // expand
            return [...previousState, action.payload];
        } else {
            // close
            return [
                ...previousState.slice(0, index),
                ...previousState.slice(index + 1),
            ];
        }
    }
    return previousState;
};

export default expanded;
