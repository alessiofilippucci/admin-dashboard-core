import * as React from 'react';
import { useFormState } from 'react-final-form';
import get from 'lodash/get';
import warning from '../util/warning';
import { Utils } from 'admin-dashboard-core/util';

/**
 * Get the current (edited) value of the record from the form and pass it
 * to child function
 *
 * @example
 *
 * const PostEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <BooleanInput source="hasEmail" />
 *             <FormDataConsumer>
 *                 {({ formData, ...rest }) => formData.hasEmail &&
 *                      <TextInput source="email" {...rest} />
 *                 }
 *             </FormDataConsumer>
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * @example
 *
 * const OrderEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <SelectInput source="country" choices={countries} />
 *             <FormDataConsumer>
 *                 {({ formData, ...rest }) =>
 *                      <SelectInput
 *                          source="city"
 *                          choices={getCitiesFor(formData.country)}
 *                          {...rest}
 *                      />
 *                 }
 *             </FormDataConsumer>
 *         </SimpleForm>
 *     </Edit>
 * );
 */
const FormDataConsumer = ({ subscription, ...props }) => {
    const formState = useFormState({ subscription });

    return <FormDataConsumerView formData={formState.values} {...props} />;
};

export const FormDataConsumerView = ({
    children,
    form,
    formData,
    source,
    index,
    childFieldAsFormClassName = null,
    ...rest
}) => {
    let scopedFormData = formData;
    let getSource;
    let getSourceHasBeenCalled = false;
    let ret;
    let childrenProps = {};

    // If we have an index, we are in an iterator like component (such as the SimpleFormIterator)
    if (typeof index !== 'undefined') {
        scopedFormData = get(formData, source);
        getSource = (scopedSource) => {
            getSourceHasBeenCalled = true;
            return `${source}.${scopedSource}`;
        };
        childrenProps = { formData, scopedFormData, getSource, ...rest };

        if (!Utils.IsEmpty(childFieldAsFormClassName) && scopedFormData) {
            childrenProps.formClassName = Utils.DeepFind(scopedFormData, childFieldAsFormClassName);
        }
    } else {
        childrenProps = { formData, ...rest };
        if (!Utils.IsEmpty(childFieldAsFormClassName) && rest.record) {
            childrenProps.formClassName = Utils.DeepFind(rest.record, childFieldAsFormClassName);
        }
    }

    ret = children(childrenProps);

    warning(
        typeof index !== 'undefined' && ret && !getSourceHasBeenCalled,
        `[${source}] You're using a FormDataConsumer inside an ArrayInput and you did not call the getSource function supplied by the FormDataConsumer component. This is required for your inputs to get the proper source.

<ArrayInput source="users">
    <SimpleFormIterator>
        <TextInput source="name" />

        <FormDataConsumer>
            {({
                formData, // The whole form data
                scopedFormData, // The data for this item of the ArrayInput
                getSource, // A function to get the valid source inside an ArrayInput
                ...rest,
            }) =>
                scopedFormData.name ? (
                    <SelectInput
                        source={getSource('role')} // Will translate to "users[0].role"
                        choices={['admin', 'user']}
                        {...rest}
                    />
                ) : null
            }
        </FormDataConsumer>
    </SimpleFormIterator>
</ArrayInput>`
    );

    return ret === undefined ? null : ret;
};

export default FormDataConsumer;
