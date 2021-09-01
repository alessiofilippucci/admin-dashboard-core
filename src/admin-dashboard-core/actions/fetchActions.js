export const FETCH_START = 'AF/FETCH_START';

export const fetchStart = () => ({ type: FETCH_START });

export const FETCH_END = 'AF/FETCH_END';

export const fetchEnd = () => ({ type: FETCH_END });

export const FETCH_ERROR = 'AF/FETCH_ERROR';

export const fetchError = () => ({ type: FETCH_ERROR });

export const FETCH_CANCEL = 'AF/FETCH_CANCEL';

export const fetchCancel = () => ({ type: FETCH_CANCEL });
