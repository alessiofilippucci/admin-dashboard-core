import useReferenceManyFieldController from './useReferenceManyFieldController';

/**
 * Render prop version of the useReferenceManyFieldController hook.
 *
 * @see useReferenceManyFieldController
 */
export const ReferenceManyFieldController = props => {
    const { children, page = 1, perPage = 25, ...rest } = props;
    const controllerProps = useReferenceManyFieldController({
        page,
        perPage,
        ...rest,
    });
    return children(controllerProps);
};

export default ReferenceManyFieldController;
