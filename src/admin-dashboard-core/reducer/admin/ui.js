import {
    TOGGLE_SIDEBAR,
    SET_SIDEBAR_VISIBILITY,
    REFRESH_VIEW,
    START_OPTIMISTIC_MODE,
    STOP_OPTIMISTIC_MODE,
} from '../../actions';
import { SET_AUTOMATIC_REFRESH, } from '../../actions/uiActions';

// Match the medium breakpoint defined in the material-ui theme
// See https://material-ui.com/customization/breakpoints/#breakpoints
const isDesktop = () =>
    // (min-width: 960px) => theme.breakpoints.up('md')
    typeof window !== 'undefined' &&
        window.matchMedia &&
        typeof window.matchMedia === 'function'
        ? window.matchMedia('(min-width:960px)').matches
        : false;

const defaultState = {
    automaticRefreshEnabled: true,
    sidebarOpen: isDesktop(),
    optimistic: false,
    viewVersion: 0,
};

const uiReducer = (
    previousState = defaultState,
    action
) => {
    switch (action.type) {
        case TOGGLE_SIDEBAR:
            return {
                ...previousState,
                sidebarOpen: !previousState.sidebarOpen,
            };
        case SET_SIDEBAR_VISIBILITY:
            return { ...previousState, sidebarOpen: action.payload };
        case SET_AUTOMATIC_REFRESH:
            return {
                ...previousState,
                automaticRefreshEnabled: action.payload,
            };
        case REFRESH_VIEW:
            return {
                ...previousState,
                viewVersion: previousState.viewVersion + 1,
            };
        case START_OPTIMISTIC_MODE:
            return { ...previousState, optimistic: true };
        case STOP_OPTIMISTIC_MODE:
            return { ...previousState, optimistic: false };
        default:
            return previousState;
    }
};

export default uiReducer;
