export const SHOW_NOTIFICATION = 'AF/SHOW_NOTIFICATION';

/**
 * Shows a snackbar/toast notification on the screen
 *
 * @see {@link https://material-ui.com/api/snackbar/|Material ui snackbar component}
 * @see {@link https://material.io/guidelines/components/snackbars-toasts.html|Material ui reference document on snackbar}
 */
export const showNotification = (
    // A translatable label or text to display on notification
    message,
    // The type of the notification
    type = 'info',
    // Specify additional parameters of notification
    notificationOptions
) => ({
    type: SHOW_NOTIFICATION,
    payload: {
        ...notificationOptions,
        type,
        message,
    },
});

export const HIDE_NOTIFICATION = 'AF/HIDE_NOTIFICATION';

export const hideNotification = () => ({
    type: HIDE_NOTIFICATION,
});

export const RESET_NOTIFICATION = 'RA/RESET_NOTIFICATION';

export const resetNotification = () => ({
    type: RESET_NOTIFICATION,
});