import { 
    SHOW_NOTIFICATION,
    HIDE_NOTIFICATION,
    RESET_NOTIFICATION, 
} from '../../actions/notificationActions';
import { UNDO } from '../../actions/undoActions';

const initialState = [];

const notificationsReducer = (
    previousState = initialState,
    action
) => {
    switch (action.type) {
        case SHOW_NOTIFICATION:
            return previousState.concat(action.payload);
        case HIDE_NOTIFICATION:
        case UNDO:
            return previousState.slice(1);
        case RESET_NOTIFICATION:
            return initialState;
        default:
            return previousState;
    }
};

export default notificationsReducer;
/**
 * Returns the first available notification to show
 * @param {Object} state - Redux state
 */
export const getNotification = state => state.admin.notifications[0];
