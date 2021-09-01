import { useTranslate } from '../../i18n';
import { useCreateController } from './useCreateController';

/**
 * Render prop version of the useCreateController hook
 *
 * @see useCreateController
 * @example
 *
 * const CreateView = () => <div>...</div>
 * const MyCreate = props => (
 *     <CreateController {...props}>
 *         {controllerProps => <CreateView {...controllerProps} {...props} />}
 *     </CreateController>
 * );
 */
export const CreateController = ({ children, ...props }) => {
    const controllerProps = useCreateController(props);
    const translate = useTranslate(); // injected for backwards compatibility
    return children({ translate, ...controllerProps });
};
