import useListController from './useListController';
import { useTranslate } from '../i18n';

/**
 * Render prop version of the useListController hook.
 *
 * @see useListController
 * @example
 *
 * const ListView = () => <div>...</div>;
 * const List = props => (
 *     <ListController {...props}>
 *        {controllerProps => <ListView {...controllerProps} {...props} />}
 *     </ListController>
 * )
 */
const ListController = ({ children, ...props }) => {
    const controllerProps = useListController(props);
    const translate = useTranslate(); // injected for backwards compatibility
    return children({ translate, ...controllerProps });
};

export default ListController;
