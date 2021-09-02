import useReferenceInputController from './useReferenceInputController';

/**
 * Render prop version of the useReferenceInputController hook.
 *
 * @see useReferenceInputController
 */
export const ReferenceInputController = ({
    children,
    ...props
}) => {
    return children(useReferenceInputController(props));
};

export default ReferenceInputController;
