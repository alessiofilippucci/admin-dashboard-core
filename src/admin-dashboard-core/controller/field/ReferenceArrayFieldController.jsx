import useReferenceArrayFieldController from './useReferenceArrayFieldController';

/**
 * Render prop version of the useReferenceArrayFieldController hook.
 *
 * @see useReferenceArrayFieldController
 */
const ReferenceArrayFieldController = props => {
    const { children, ...rest } = props;
    const controllerProps = useReferenceArrayFieldController({
        sort: {
            field: 'id',
            order: 'ASC',
        },
        ...rest,
    });
    return children(controllerProps);
};

export default ReferenceArrayFieldController;