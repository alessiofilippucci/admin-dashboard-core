import { put, takeEvery } from 'redux-saga/effects';
import { refreshView } from '../actions/uiActions';

/**
 * Refresh Side Effects
 */
function* handleRefresh() {
    yield put(refreshView());
}

export default function* () {
    yield takeEvery(
        action => action.meta && action.meta.refresh,
        handleRefresh
    );
}
