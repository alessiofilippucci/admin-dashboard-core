import { Children, createElement, } from 'react';

import warning from '../util/warning';
import usePermissions from './usePermissions';

const isEmptyChildren = children => Children.count(children) === 0;

const WithPermissions = ({
    authParams,
    children,
    render,
    component,
    staticContext,
    ...props
}) => {
    warning(
        (render && children && !isEmptyChildren(children)) ||
        (render && component) ||
        (component && children && !isEmptyChildren(children)),
        'You should only use one of the `component`, `render` and `children` props in <WithPermissions>'
    );

    const { permissions } = usePermissions(authParams);
    // render even though the usePermissions() call isn't finished (optimistic rendering)
    if (component) {
        return createElement(component, { permissions, ...props });
    }
};

export default WithPermissions;
