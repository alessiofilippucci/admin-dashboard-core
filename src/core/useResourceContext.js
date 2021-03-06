import { useContext } from 'react';
import { ResourceContext } from './ResourceContext';

/**
 * Hook to read the resource from the ResourceContext.
 *
 * Must be used within a <ResourceContextProvider> (e.g. as a descendent of <Resource>
 * or any reference related components), or called with a resource prop.
 *
 * @example
 *
 * const ResourceName = (props) => {
 *   const { resource } = useResourceContext(props);
 *   const resourceName = translate(`resources.${resource}.name`, {
 *      smart_count: 1,
 *      _: inflection.humanize(inflection.singularize(resource)),
 *   });
 *   return <>{resourceName}</>;
 * }
 *
 * // use it in a resource context
 * const MyComponent = () => (
 *   <ResourceContextProvider value="posts">
 *     <ResourceName />
 *     ...
 *   </ResourceContextProvider>
 * );
 *
 * // override resource via props
 * const MyComponent = () => (
 *   <>
 *     <ResourceName resource="posts"/>
 *     ...
 *   </>
 * );
 *
 * @returns The resource name, e.g. 'posts'
 */
export const useResourceContext = (props) => {
    const context = useContext(ResourceContext);
    return (props && props.resource) || context;
};