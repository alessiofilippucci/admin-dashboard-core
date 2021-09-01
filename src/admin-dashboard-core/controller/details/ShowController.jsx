import { useShowController } from './useShowController';
import { useTranslate } from '../../i18n';

/**
 * Render prop version of the useShowController hook
 *
 * @see useShowController
 * @example
 *
 * const ShowView = () => <div>...</div>
 * const MyShow = props => (
 *     <ShowController {...props}>
 *         {controllerProps => <ShowView {...controllerProps} {...props} />}
 *     </ShowController>
 * );
 */
export const ShowController = ({ children, ...props }) => {
    const controllerProps = useShowController(props);
    const translate = useTranslate(); // injected for backwards compatibility
    return children({ translate, ...controllerProps });
};