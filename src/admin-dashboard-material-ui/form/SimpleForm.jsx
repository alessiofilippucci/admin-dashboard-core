import * as React from 'react';
import {
    Children,
    ReactElement,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
    FormWithRedirect,
} from 'admin-dashboard-core';

import FormInput from './FormInput';
import Toolbar from './Toolbar';
import CardContentInner from '../layout/CardContentInner';

/**
 * Form with a one column layout, one input per line.
 *
 * Pass input components as children.
 *
 * @example
 *
 * import * as React from "react";
 * import { Create, Edit, SimpleForm, TextInput, DateInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton } from 'react-admin';
 * import RichTextInput from 'ra-input-rich-text';
 *
 * export const PostCreate = (props) => (
 *     <Create {...props}>
 *         <SimpleForm>
 *             <TextInput source="title" />
 *             <TextInput source="teaser" options={{ multiLine: true }} />
 *             <RichTextInput source="body" />
 *             <DateInput label="Publication date" source="published_at" defaultValue={new Date()} />
 *         </SimpleForm>
 *     </Create>
 * );
 *
 * @typedef {Object} Props the props you can use (other props are injected by Create or Edit)
 * @prop {ReactElement[]} children Input elements
 * @prop {Object} initialValues
 * @prop {Function} validate
 * @prop {boolean} submitOnEnter
 * @prop {string} redirect
 * @prop {ReactElement} toolbar The element displayed at the bottom of the form, containing the SaveButton
 * @prop {string} variant Apply variant to all inputs. Possible values are 'standard', 'outlined', and 'filled' (default)
 * @prop {string} margin Apply variant to all inputs. Possible values are 'none', 'normal', and 'dense' (default)
 * @prop {boolean} sanitizeEmptyValues Whether or not deleted record attributes should be recreated with a `null` value (default: true)
 *
 * @param {Props} props
 */
const SimpleForm = props => (
    <FormWithRedirect
        {...props}
        render={formProps => <SimpleFormView {...formProps} />}
    />
);

SimpleForm.propTypes = {
    children: PropTypes.node,
    initialValues: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    // @ts-ignore
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    save: PropTypes.func,
    saving: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
    toolbar: PropTypes.element,
    undoable: PropTypes.bool,
    validate: PropTypes.func,
    version: PropTypes.number,
    sanitizeEmptyValues: PropTypes.bool,
};

const SimpleFormView = ({
    basePath,
    children,
    className,
    component: Component,
    handleSubmit,
    handleSubmitWithRedirect,
    invalid,
    margin,
    mutationMode,
    pristine,
    record,
    redirect,
    resource,
    saving,
    submitOnEnter,
    toolbar,
    undoable,
    useBootstrap,
    variant,
    inSidebar,
    showRenderCount,
    fieldsSubscription,
    ...rest
}) => (
    <form
        className={classnames('simple-form', className, useBootstrap ? 'container-fluid' : '')}
        {...sanitizeRestProps(rest)}
    >
        <Component className={classnames(useBootstrap ? 'row' : '', inSidebar ? 'pt-0' : '')}>
            {Children.map(
                children,
                (input) =>
                    input && (
                        <FormInput
                            basePath={basePath}
                            input={input}
                            record={record}
                            resource={resource}
                            variant={input.props.variant || variant}
                            margin={input.props.margin || margin}
                            useBootstrap={useBootstrap}
                            showRenderCount={showRenderCount}
                            subscription={fieldsSubscription}
                        />
                    )
            )}
        </Component>
        {toolbar &&
            React.cloneElement(toolbar, {
                basePath,
                handleSubmitWithRedirect,
                handleSubmit,
                invalid,
                mutationMode,
                pristine,
                record,
                redirect,
                resource,
                saving,
                submitOnEnter,
                undoable,
            })}
    </form>
);

SimpleFormView.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    handleSubmit: PropTypes.func, // passed by react-final-form
    invalid: PropTypes.bool,
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    pristine: PropTypes.bool,
    // @ts-ignore
    record: PropTypes.object,
    resource: PropTypes.string,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    saving: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
    toolbar: PropTypes.element,
    undoable: PropTypes.bool,
    useBootstrap: PropTypes.bool,
    validate: PropTypes.func,
    inSidebar: PropTypes.bool,
};

SimpleFormView.defaultProps = {
    submitOnEnter: true,
    toolbar: <Toolbar />,
    component: CardContentInner,
};

const sanitizeRestProps = ({
    active,
    dirty,
    dirtyFields,
    dirtyFieldsSinceLastSubmit,
    dirtySinceLastSubmit,
    error,
    errors,
    form,
    hasSubmitErrors,
    hasValidationErrors,
    initialValues,
    modified = null,
    modifiedSinceLastSubmit,
    save = null,
    submitError,
    submitErrors,
    submitFailed,
    submitSucceeded,
    submitting,
    touched = null,
    valid,
    validating,
    values,
    visited = null,
    __versions = null,
    ...props
}) => props;

export default SimpleForm;
