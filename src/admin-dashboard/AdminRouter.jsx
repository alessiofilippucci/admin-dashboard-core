import * as React from 'react';
import { CoreAdminRouter } from 'admin-dashboard-core';
import { Loading } from 'admin-dashboard-material-ui';

const AdminRouter = props => (
    <CoreAdminRouter {...props} />
);

AdminRouter.defaultProps = {
    loading: Loading,
};

export default AdminRouter;
