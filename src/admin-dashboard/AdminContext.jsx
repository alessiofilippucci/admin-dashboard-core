import * as React from 'react';
import { CoreAdminContext } from 'admin-dashboard-core';

import defaultI18nProvider from './defaultI18nProvider';

const AdminContext = props => (
    <CoreAdminContext {...props} />
);

AdminContext.defaultProps = {
    i18nProvider: defaultI18nProvider,
};

AdminContext.displayName = 'AdminContext';

export default AdminContext;
