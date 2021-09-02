import Authenticated from './Authenticated';
import AuthContext from './AuthContext';
import useAuthProvider from './useAuthProvider';
import useAuthState from './useAuthState';
import usePermissions from './usePermissions';
import useGlobalSettings from './useGlobalSettings';
import useAuthenticatedUser from './useAuthenticatedUser';
import useAuthenticated from './useAuthenticated';
import WithPermissions from './WithPermissions';
import useLogin from './useLogin';
import useResetPassword from './useResetPassword';
import useLogout from './useLogout';
import useCheckAuth from './useCheckAuth';
import useGetPermissions from './useGetPermissions';
import useGetAuthenticatedUser from './useGetAuthenticatedUser';
import useGetGlobalSettings from './useGetGlobalSettings';
import useLogoutIfAccessDenied from './useLogoutIfAccessDenied';
import convertLegacyAuthProvider from './convertLegacyAuthProvider';
export * from './types';

export {
    AuthContext,
    useAuthProvider,
    convertLegacyAuthProvider,
    // low-level hooks for calling a particular verb on the authProvider
    useLogin,
    useResetPassword,
    useLogout,
    useCheckAuth,
    useGetPermissions,
    useGetAuthenticatedUser,
    useGetGlobalSettings,
    // hooks with state management
    usePermissions,
    useAuthenticatedUser,
    useGlobalSettings,
    useAuthState,
    // hook with immediate effect
    useAuthenticated,
    useLogoutIfAccessDenied,
    // components
    Authenticated,
    WithPermissions,
};
