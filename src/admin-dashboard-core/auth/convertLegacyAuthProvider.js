import {
    AUTH_LOGIN,
    AUTH_RESET_PASSWORD,
    AUTH_LOGOUT,
    AUTH_CHECK,
    AUTH_ERROR,
    AUTH_GET_PERMISSIONS,
} from './types';

/**
 * Turn a function-based authProvider to an object-based one
 *
 * Allows using legacy authProviders transparently.
 *
 * @param {Function} legacyAuthProvider A legacy authProvider (type, params) => Promise<any>
 *
 * @returns {Object} An authProvider that react-admin can use
 */
export default (legacyAuthProvider) => {
    const authProvider = (...args) => legacyAuthProvider.apply(null, args);
    authProvider.login = params => legacyAuthProvider(AUTH_LOGIN, params);
    authProvider.resetPassword = params => legacyAuthProvider(AUTH_RESET_PASSWORD, params);
    authProvider.logout = params => legacyAuthProvider(AUTH_LOGOUT, params);
    authProvider.checkAuth = params => legacyAuthProvider(AUTH_CHECK, params);
    authProvider.checkError = error => legacyAuthProvider(AUTH_ERROR, error);
    authProvider.getPermissions = params =>
        legacyAuthProvider(AUTH_GET_PERMISSIONS, params);
    return authProvider;
};
