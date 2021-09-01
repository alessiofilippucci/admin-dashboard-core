import * as React from 'react';
import { CoreAdminUI } from 'admin-dashboard-core';
import {
    Layout as DefaultLayout,
    LayoutPublic as DefaultLayoutPublic,
    Loading,
    Login,
    ResetPassword,
    Logout,
    NotFound,
} from 'admin-dashboard-material-ui';

const AdminUI = props => <CoreAdminUI {...props} />;

AdminUI.defaultProps = {
    layout: DefaultLayout,
    layoutPublic: DefaultLayoutPublic,
    catchAll: NotFound,
    loading: Loading,
    loginPage: Login,
    resetPasswordPage: ResetPassword,
    logout: Logout,
};

export default AdminUI;
