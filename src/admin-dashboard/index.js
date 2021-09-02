import Admin from './Admin';
import AdminUI from './AdminUI';
import AdminContext from './AdminContext';
import AdminRouter from './AdminRouter';
import defaultI18nProvider from './defaultI18nProvider';

// // interface translations
import englishMessages from '../admin-dashboard-languages/english';
import italianMessages from '../admin-dashboard-languages/italian';

export * from '../admin-dashboard-core';
export * from '../admin-dashboard-material-ui';
export { Admin, AdminContext, AdminRouter, AdminUI, defaultI18nProvider, englishMessages, italianMessages  };