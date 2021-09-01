import * as React from 'react';

import useDataProvider from './useDataProviderWithDeclarativeSideEffects';

const withDataProvider = (Component) => (props) => (
    <Component {...props} dataProvider={useDataProvider()} />
);

export default withDataProvider;
