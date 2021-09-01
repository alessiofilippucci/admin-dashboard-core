import React, { cloneElement, Children } from 'react';
import PropTypes from 'prop-types';
import {
    useReferenceManyFieldController,
    ListContextProvider,
} from 'admin-dashboard-core';

import { fieldPropTypes } from './types';
import sanitizeRestProps from './sanitizeRestProps';

/**
 * Render related records to the current one.
 *
 * You must define the fields to be passed to the iterator component as children.
 *
 * @example Display all the comments of the current post as a datagrid
 * <ReferenceManyField reference="comments" target="post_id">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="body" />
 *         <DateField source="created_at" />
 *         <EditButton />
 *     </Datagrid>
 * </ReferenceManyField>
 *
 * @example Display all the books by the current author, only the title
 * <ReferenceManyField reference="books" target="author_id">
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 *
 * By default, restricts the displayed values to 25. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceManyField perPage={10} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceManyField sort={{ field: 'created_at', order: 'DESC' }} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceManyField filter={{ is_published: true }} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 */
export const ReferenceManyField = props => {
    const {
        basePath,
        children,
        filter,
        page = 1,
        perPage,
        record,
        reference,
        resource,
        sort,
        source,
        target,
    } = props;

    if (React.Children.count(children) !== 1) {
        throw new Error(
            '<ReferenceManyField> only accepts a single child (like <Datagrid>)'
        );
    }

    const controllerProps = useReferenceManyFieldController({
        basePath,
        filter,
        page,
        perPage,
        record,
        reference,
        resource,
        sort,
        source,
        target,
    });

    return (
        <ListContextProvider value={controllerProps}>
            <ReferenceManyFieldView {...props} {...controllerProps} />
        </ListContextProvider>
    );
};

ReferenceManyField.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string,
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
    filter: PropTypes.object,
    label: PropTypes.string,
    perPage: PropTypes.number,
    record: PropTypes.any,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string,
    sortBy: PropTypes.string,
    sortByOrder: fieldPropTypes.sortByOrder,
    source: PropTypes.string.isRequired,
    sort: PropTypes.exact({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    target: PropTypes.string.isRequired,
};

ReferenceManyField.defaultProps = {
    filter: {},
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
    source: 'id',
    addLabel: true,
};

export const ReferenceManyFieldView = props => {
    const { basePath, children, pagination, reference, ...rest } = props;
    return (
        <>
            {cloneElement(Children.only(children), {
                ...sanitizeRestProps(rest),
                basePath,
                resource: reference,
            })}
            {pagination &&
                props.total !== undefined &&
                cloneElement(pagination, rest)}
        </>
    );
};

ReferenceManyFieldView.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.element,
    className: PropTypes.string,
    currentSort: PropTypes.exact({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    data: PropTypes.any,
    ids: PropTypes.array,
    loaded: PropTypes.bool,
    pagination: PropTypes.element,
    reference: PropTypes.string,
    setSort: PropTypes.func,
};

export default ReferenceManyField;
