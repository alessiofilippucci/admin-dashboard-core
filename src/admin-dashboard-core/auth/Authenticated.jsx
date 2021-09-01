import { cloneElement } from 'react';

import useAuthenticated from './useAuthenticated';

const Authenticated = ({
    authParams,
    children,
    location, // kept for backwards compatibility, unused
    ...rest
}) => {
    useAuthenticated(authParams);
    // render the child even though the useAuthenticated() call isn't finished (optimistic rendering)
    // the above hook will log out if the authProvider doesn't validate that the user is authenticated
    return cloneElement(children, rest);
};

export default Authenticated;
