import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
    FormControl,
    FormHelperText,
    FormLabel,
    RadioGroup,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import get from 'lodash/get';
import { Utils, useInput, FieldTitle, warning } from 'admin-dashboard-core';

import sanitizeInputRestProps from './sanitizeInputRestProps';
import InputHelperText from './InputHelperText';
import RadioButtonGroupInputItem from './RadioButtonGroupInputItem';

const useStyles = makeStyles(
    theme => ({
        label: {
            transform: 'translate(0, 5px) scale(0.75)',
            transformOrigin: `top ${theme.direction === 'ltr' ? 'left' : 'right'
                }`,
        },
    }),
    { name: 'RaRadioButtonGroupInput' }
);

/**
 * An Input component for a radio button group, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property as the option text
 * @example
 * const choices = [
 *    { id: 'M', name: 'Male' },
 *    { id: 'F', name: 'Female' },
 * ];
 * <RadioButtonGroupInput source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <RadioButtonGroupInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <CheckboxGroupInput source="recipients" choices={choices} optionText={optionRenderer} />
 *
 * `optionText` also accepts a React Element, that will be cloned and receive
 * the related choice as the `record` prop. You can use Field components there.
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
 * <RadioButtonGroupInput source="gender" choices={choices} optionText={<FullNameField />}/>
 *
 * The choices are translated by default, so you can use translation identifiers as choices:
 * @example
 * const choices = [
 *    { id: 'M', name: 'myroot.gender.male' },
 *    { id: 'F', name: 'myroot.gender.female' },
 * ];
 *
 * However, in some cases (e.g. inside a `<ReferenceInput>`), you may not want
 * the choice to be translated. In that case, set the `translateChoice` prop to false.
 * @example
 * <RadioButtonGroupInput source="gender" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the material-ui <RadioButtonGroup> component
 */
const RadioButtonGroupInput = props => {
    const {
        choices = [],
        classes: classesOverride,
        format,
        helperText,
        label,
        margin = 'dense',
        onBlur,
        onChange,
        onFocus,
        options,
        optionText,
        optionValue,
        parse,
        resource,
        row,
        source,
        translateChoice,
        validate,
        setFilter,
        setPagination,
        setSort,
        itemAsCol,
        hideInput,
        getRecord,
        inlineLabel,
        ...rest
    } = props;
    const classes = useStyles(props);

    warning(
        source === undefined,
        `If you're not wrapping the RadioButtonGroupInput inside a ReferenceInput, you must provide the source prop`
    );

    warning(
        choices === undefined,
        `If you're not wrapping the RadioButtonGroupInput inside a ReferenceInput, you must provide the choices prop`
    );

    const {
        id,
        isRequired,
        meta: { error, touched },
        input,
    } = useInput({
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        validate,
        ...rest,
    });

    const handleChange = useCallback(
        (item) => {
            input.onChange(item);

            if (Utils.IsFunction(getRecord) && choices.length > 0) {
                const record = choices.find(x => x.id === item);
                getRecord(record);
            }
        },
        [input]
    );

    const rbgi = (
        <FormControl
            component="fieldset"
            margin={margin}
            error={touched && !!error}
            {...sanitizeInputRestProps(rest)}
            fullWidth={inlineLabel ? false : rest.fullWidth}
        >
            {!inlineLabel && <FormLabel component="legend" className={classes.label}>
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            </FormLabel>
            }

            <RadioGroup id={id} row={row} {...options}>
                {choices.map(choice => (
                    <RadioButtonGroupInputItem
                        {...input}
                        onChange={handleChange}
                        key={get(choice, optionValue)}
                        choice={choice}
                        optionText={optionText}
                        optionValue={optionValue}
                        source={source}
                        translateChoice={translateChoice}
                        itemAsCol={itemAsCol}
                        hideInput={hideInput}
                    />
                ))}
            </RadioGroup>
            <FormHelperText>
                <InputHelperText
                    touched={touched}
                    error={error}
                    helperText={helperText}
                />
            </FormHelperText>
        </FormControl>
    );

    rest.fullWidth = false;

    if(inlineLabel){
        return (
            <div className="d-flex justify-content-start">
                <Typography component="span" variant="body1" style={{ marginTop: 16, marginRight: 16 }}>
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                </Typography>
                {rbgi}
            </div>
        )
    }

    return (
        rbgi
    );
};

RadioButtonGroupInput.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.any),
    label: PropTypes.string,
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]),
    optionValue: PropTypes.string,
    resource: PropTypes.string,
    source: PropTypes.string,
    translateChoice: PropTypes.bool,
    itemAsCol: PropTypes.bool,
    hideInput: PropTypes.bool,
    inlineLabel: PropTypes.bool,
};

RadioButtonGroupInput.defaultProps = {
    options: {},
    optionText: 'name',
    optionValue: 'id',
    row: true,
    translateChoice: true,
    inlineLabel: false,
};

export default RadioButtonGroupInput;