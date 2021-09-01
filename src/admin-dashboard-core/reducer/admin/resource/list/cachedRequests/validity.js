import { GET_LIST } from '../../../../../core';

const initialState = null;

const validityReducer = (
    previousState = initialState,
    { payload, meta }
) => {
    switch (meta.fetchResponse) {
        case GET_LIST: {
            if (payload.validUntil) {
                // store the validity date
                return payload.validUntil;
            } else {
                // remove the validity date
                return initialState;
            }
        }
        default:
            return previousState;
    }
};

export default validityReducer;
