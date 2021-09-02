import get from 'lodash/get';

import { linkToRecord } from '../../util';

/**
 * Get the link toward the referenced resource
 *
 * @example
 *
 * const linkPath = getResourceLinkPath({
 *      basePath: '/comments',
 *      link: 'edit',
 *      reference: 'users',
 *      record: {
 *          userId: 7
 *      },
 *      resource: 'comments',
 *      source: 'userId',
 * });
 *
 * @param {Object} option
 * @param {string} option.basePath basepath to current resource
 * @param {string | false | LinkToFunctionType} option.link="edit" The link toward the referenced record. 'edit', 'show' or false for no link (default to edit). Alternatively a function that returns a string
 * @param {string | false | LinkToFunctionType} [option.linkType] DEPRECATED : old name for link
 * @param {string} option.reference The linked resource name
 * @param {Object} option.record The The current resource record
 * @param {string} option.resource The current resource name
 * @param {string} option.source The key of the linked resource identifier
 *
 * @returns {string | false} The reference props
 */
const getResourceLinkPath = ({
    basePath,
    link = 'edit',
    linkType,
    reference,
    record = { id: '' },
    resource,
    source,
}) => {
    const sourceId = get(record, source);
    const rootPath = basePath.replace(resource, reference);
    // Backward compatibility: keep linkType but with warning
    const getResourceLinkPath = (linkTo) =>
        !linkTo
            ? false
            : typeof linkTo === 'function'
            ? linkTo(record, reference)
            : linkToRecord(rootPath, sourceId, linkTo);

    if (linkType !== undefined) {
        console.warn(
            "The 'linkType' prop is deprecated and should be named to 'link' in <ReferenceField />"
        );
    }

    const resourceLinkPath = getResourceLinkPath(
        linkType !== undefined ? linkType : link
    );

    return resourceLinkPath;
};

export default getResourceLinkPath;
